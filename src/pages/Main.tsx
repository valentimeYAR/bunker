import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import { push, ref, set } from "firebase/database";
import { db } from "../config/initFirebase.ts";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DEFAULT_PLAYERS_COUNT } from "../shared/hooks/useGame.tsx";

const Main = () => {
  const [gameId, setGameId] = useState<string | null>(null);
  const [playersCount, setPlayersCount] = useState(DEFAULT_PLAYERS_COUNT);

  const navigate = useNavigate();
  const createGame = async () => {
    const gameRef = push(ref(db, "games"));

    await set(gameRef, {
      createdAt: Date.now(),
      players: {},
      status: 'waiting',
      maxPlayers: playersCount
    });
    setGameId(gameRef.key);
  }

  const goToGame = () => {
    navigate(`/lobby/${gameId}`);
  }

  const clearHistory = async () => {
    localStorage.clear();
  }

  return (
    <Box>
      <Text fontSize='2xl' fontWeight={700} mb={4}>Создание игры</Text>
      <Flex gap={2} alignItems='center'>
        <Text mb={2}>Количество игроков:</Text>
        <Input type='text' value={playersCount} onChange={(e) => setPlayersCount(Number(e.target.value))} variant={'outline'} />
      </Flex>
      <Flex gap={2} alignItems='center' mt={4} mb={4}>
        <Button onClick={createGame}>Создать игру</Button>
        <Button onClick={clearHistory}>Очистка истории</Button>
      </Flex>
      {
        gameId && (
          <Box bg="gray.100" p={4} rounded="md" display='flex' flexDirection='column' gap={2}>
            <Text>Ссылка для <Box fontWeight={700} as="span">{playersCount}</Box> игроков:</Text>
            <Box>
              ID игры: <Box fontWeight={700} as="span">{gameId}</Box>
            </Box>
            <Input
              value={`${window.location.origin}/lobby/${gameId}`}
              isReadOnly
              onClick={async (e: React.MouseEvent<HTMLInputElement>) => {
                e.currentTarget.select();
                await navigator.clipboard.writeText(`${window.location.origin}/lobby/${gameId}`);
              }}
              mb={2}
            />
            <Flex gap={2} direction='column' alignItems='center'>
              <Text fontSize="sm" mb={2}>Отправь эту ссылку игрокам!</Text>
              <Button onClick={goToGame} colorScheme='teal' w='100%'>Перейти в игру</Button>
            </Flex>
          </Box>
        )
      }
    </Box >
  )
};

export default Main;