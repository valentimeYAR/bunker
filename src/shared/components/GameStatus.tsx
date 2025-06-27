import { Badge, Flex } from "@chakra-ui/react";
import { GAME_STATUS } from "../constants";
import { useGame } from "../hooks/useGame";
import { memo } from "react";

interface GameStatusProps {
  isShowRegistered?: boolean;
}

const GameStatus = ({ isShowRegistered = true }: GameStatusProps) => {
  const { game, isRegistered } = useGame();

  return (
    <Flex gap={1} direction='column' mb={4}>
      <Badge colorScheme={
        game?.status === "waiting" ? "yellow"
          : game?.status === "started" ? "green"
            : game?.status === "finished" ? "red"
              : "gray"
      } fontSize="lg" width='fit-content'>
        {GAME_STATUS[game?.status]}
      </Badge>
      {isRegistered && isShowRegistered && <Badge colorScheme={isRegistered ? "green" : "red"} width='fit-content' p={1}>Вы зарегистрированы</Badge>}
    </Flex>
  );
}

export default memo(GameStatus);