import type { PlayerCharacteristics } from "../../shared/gameData/categories";

export interface Player {
    id?: number;
    name?: string;
    playerId?: string;
    joinedAt?: number;
    characteristics?: PlayerCharacteristics;
}