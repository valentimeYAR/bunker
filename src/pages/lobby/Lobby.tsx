import { Box, Button, Input, Spinner, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../../shared/hooks/useGame";
import GameStatus from "../../shared/components/GameStatus";

function Lobby() {
  const {
    loading,
    gameId,
    playersCount,
    isRegistered,
    registerPlayer,
    playersList,
    countdown,
    maxPlayers,
    game,
    playerName: currentPlayerName,
  } = useGame();
  const [playerName, setPlayerName] = useState("");
  const navigate = useNavigate();

  const joinGame = async () => {
    await registerPlayer(playerName);
  };

  // Редирект на игру когда она начинается
  useEffect(() => {
    if (isRegistered && game?.status === 'started') {
      navigate(`/game/${gameId}`);
    }
  }, [isRegistered, game?.status, gameId, navigate]);

  if (loading) return <Spinner />;

  if (!isRegistered) {
    return (
      <Box p={4}>
        <Text fontSize="1xl" mb={4} fontWeight={700}>Присоединиться к игре {gameId}</Text>
        <Text>Кол-во игроков: {playersCount}</Text>
        <Text mb={2}>Введите ваше имя:</Text>
        <Input
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Ваше имя"
          mb={3}
        />
        <Button onClick={joinGame} colorScheme="teal" disabled={!playerName.trim()}>
          Войти в игру
        </Button>
      </Box>
    );
  }

  return (
    <Box p={4} display='flex' flexDirection='column' h='100%'>
      <Box>
        <Text fontSize="1xl" mb={2} fontWeight={700}>Лобби игры {gameId}</Text>
        <GameStatus />
        <Text mb={2}>Ваше имя: <Box fontWeight={700} as="span">{currentPlayerName}</Box></Text>
        <Text mb={2}>Кол-во игроков: {playersCount}/{maxPlayers}</Text>

        {countdown !== null && (
          <Box bg="yellow.100" p={3} rounded="md" mb={3}>
            <Text fontSize="lg" fontWeight={600} color="yellow.800">
              Игра начнется через: {countdown} сек
            </Text>
          </Box>
        )}
      </Box>

      {playersCount !== 0 && (
        <Box>
          <Text fontWeight={600} mb={2}>Игроки:</Text>
          {playersList.map((player, index) => (
            <Text key={player.id} fontSize="sm">
              {index + 1}. {player.name}
            </Text>
          ))}
        </Box>
      )}

      {isRegistered && countdown === null && (
        <Box display='flex' justifyContent='center' alignItems='center' gap={2} mt='100%'>
          <Spinner mb={2} />
          <Box>
            <Text>Идёт подключение игроков игроков...</Text>
          </Box>
        </Box>
      )}
      <Button onClick={() => {
        localStorage.clear();
        navigate('/');
      }}>Покинуть игру</Button>
    </Box>
  );
}

export default Lobby;
