import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ref, onValue, update } from "firebase/database";
import { db } from "../../config/initFirebase";
import type { Game } from "../../pages/lobby/types";
import { generatePlayerCharacteristics, generateGameCommonCards, getRandomRevealCategory } from "../gameData/categories";

export const DEFAULT_PLAYERS_COUNT = 4;
export const DEFAULT_PLAYERS_NAME = ["Любит Настю", "Любит Валю", "Жена Артема", "Муж Ани"];
const GAME_START_TIMER = 10;

export const useGame = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const playersCount = game?.players ? Object.keys(game.players).length : 0;

  const getCurrentPlayerId = () => {
    if (!gameId) return null;
    return localStorage.getItem(`player_${gameId}`);
  };

  const getCurrentPlayerName = () => {
    const currentPlayerId = getCurrentPlayerId();
    if (!currentPlayerId || !game?.players) return null;
    return game.players[currentPlayerId]?.name || null;
  };

  const getCurrentPlayerCharacteristics = () => {
    const currentPlayerId = getCurrentPlayerId();
    if (!currentPlayerId || !game?.players) return null;
    return game.players[currentPlayerId]?.characteristics || null;
  };

  const getPlayersList = () => {
    if (!game?.players) return [];
    const currentPlayerId = getCurrentPlayerId();

    return Object.entries(game.players).map(([playerId, playerData]) => ({
      id: playerId,
      name: playerId === currentPlayerId ? "Вы" : playerData.name,
      isCurrentUser: playerId === currentPlayerId,
      ...playerData
    }));
  };

  useEffect(() => {
    if (!gameId) return;

    const gameRef = ref(db, "games/" + gameId);
    const unsubscribe = onValue(gameRef, (snapshot) => {
      if (snapshot.exists()) {
        setGame(snapshot.val());
      } else {
        setGame(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [gameId]);

  useEffect(() => {
    if (gameId && !loading && game) {
      const savedPlayerId = localStorage.getItem(`player_${gameId}`);
      if (savedPlayerId) {
        // Проверяем есть ли игрок в базе данных
        if (game.players && savedPlayerId in game.players) {
          setIsRegistered(true);
        } else {
          // Если игрока нет в БД, удаляем из localStorage
          localStorage.removeItem(`player_${gameId}`);
          setIsRegistered(false);
        }
      }
    }
  }, [gameId, game?.players, loading, game]);

  const registerPlayer = async (playerName: string) => {
    if (!playerName.trim() || !gameId) return;

    const playerId = Date.now().toString();
    const playerData = {
      playerId,
      name: playerName,
      joinedAt: Date.now()
    };

    await update(ref(db, `games/${gameId}/players/${playerId}`), playerData);
    localStorage.setItem(`player_${gameId}`, playerId);
    setIsRegistered(true);
  };

  // Запускаем таймер в Firebase когда достигнуто нужное количество игроков
  useEffect(() => {
    if (playersCount === (game?.maxPlayers ?? 0) && !game?.gameStartTime && game?.status === 'waiting') {
      const startTime = Date.now() + (GAME_START_TIMER * 1000);
      update(ref(db, `games/${gameId}`), {
        gameStartTime: startTime
      });
    }
  }, [playersCount, game?.maxPlayers, game?.gameStartTime, game?.status, gameId]);

  // Вычисляем таймер от gameStartTime
  useEffect(() => {
    if (!game?.gameStartTime) {
      setCountdown(null);
      return;
    }

    const updateCountdown = () => {
      const timeLeft = Math.ceil(((game?.gameStartTime ?? 0) - Date.now()) / 1000);

      if (timeLeft <= 0) {
        setCountdown(0);
        if (game.status === 'waiting') {
          update(ref(db, `games/${gameId}`), {
            status: 'started',
            gameStartTime: null
          });
        }
      } else {
        setCountdown(timeLeft);
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [game?.gameStartTime, game?.status, gameId]);

  // Генерируем общие карточки и характеристики игроков когда игра начинается
  useEffect(() => {
    if (game?.status === 'started' && game?.players && gameId) {
      const updates: Record<string, object | string | string[]> = {};

      // Генерируем общие карточки игры если их еще нет
      if (!game.commonCards) {
        const commonCards = generateGameCommonCards();
        updates[`games/${gameId}/commonCards`] = commonCards;
      }

      // Устанавливаем первую карточку для открытия если ее еще нет
      if (!game.currentRevealCard) {
        const firstCard = getRandomRevealCategory(game.revealedCards || []);
        if (firstCard) {
          updates[`games/${gameId}/currentRevealCard`] = firstCard;
        }
      }

      // Инициализируем массив открытых карточек если его нет
      if (!game.revealedCards) {
        updates[`games/${gameId}/revealedCards`] = [];
      }

      // Проверяем, есть ли уже характеристики у игроков
      const playersWithoutCharacteristics = Object.entries(game.players).filter(
        ([, player]) => !player.characteristics
      );

      if (playersWithoutCharacteristics.length > 0) {
        // Получаем уже использованные карточки по категориям
        const gameUsedCards: Record<string, number[]> = {};

        Object.values(game.players).forEach(player => {
          if (player.characteristics) {
            Object.entries(player.characteristics).forEach(([categoryId, card]) => {
              if (card) {
                if (!gameUsedCards[categoryId]) gameUsedCards[categoryId] = [];
                gameUsedCards[categoryId].push(card.imageNumber);
              }
            });
          }
        });

        // Генерируем характеристики для игроков без них
        playersWithoutCharacteristics.forEach(([playerId]) => {
          const characteristics = generatePlayerCharacteristics(gameUsedCards);
          update(ref(db, `games/${gameId}/players/${playerId}/characteristics`), characteristics);

          // Обновляем список использованных карточек
          Object.entries(characteristics).forEach(([categoryId, card]) => {
            if (card) {
              if (!gameUsedCards[categoryId]) gameUsedCards[categoryId] = [];
              gameUsedCards[categoryId].push(card.imageNumber);
            }
          });
        });
      }

      if (Object.keys(updates).length > 0) {
        update(ref(db), updates);
      }
    }
  }, [game?.status, game?.players, gameId]);

  const changeRevealCard = async () => {
    if (!gameId || !game) return;

    const currentCard = game.currentRevealCard;
    const revealedCards = game.revealedCards || [];

    // Добавляем текущую карточку в список открытых если она есть
    const newRevealedCards = currentCard ? [...revealedCards, currentCard] : revealedCards;

    // Выбираем новую карточку
    const nextCard = getRandomRevealCategory(newRevealedCards);

    const updates: Record<string, string[] | string | null> = {
      [`games/${gameId}/revealedCards`]: newRevealedCards,
      [`games/${gameId}/currentRevealCard`]: nextCard
    };

    await update(ref(db), updates);

    if (!nextCard) {
      await update(ref(db), { [`games/${gameId}/status`]: 'finished' });
    }
  };


  return {
    game: game as Game,
    setGame,
    gameId,
    loading: loading || game === null,
    playersCount,
    isRegistered,
    registerPlayer,
    playersList: getPlayersList(),
    countdown,
    maxPlayers: game?.maxPlayers,
    playerName: getCurrentPlayerName(),
    playerCharacteristics: getCurrentPlayerCharacteristics(),
    commonCards: game?.commonCards,
    currentRevealCard: game?.currentRevealCard,
    revealedCards: game?.revealedCards || [],
    changeRevealCard
  };
} 