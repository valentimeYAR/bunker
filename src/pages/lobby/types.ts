import type { Player } from "../create/types";
import type { GameCommonCards } from "../../shared/gameData/categories";

export type Game = {
    createdAt: number;
    players: Record<string, Player>;
    status: GameStatus;
    maxPlayers: number;
    gameStartTime?: number;
    commonCards?: GameCommonCards;
    currentRevealCard?: string; // ID категории которую сейчас открывают
    revealedCards?: string[]; // массив ID уже открытых категорий
}

export type GameStatus = 'waiting' | 'started' | 'finished';