import type { Game } from "../../pages/lobby/types"

export type GameHook ={
  game: Game;
  setGame: (game: Game) => void;
  gameId: string;
}