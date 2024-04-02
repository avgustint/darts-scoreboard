import { GameResult } from "./game-result.model"

export interface Game {
    home: GameResult,
    guest: GameResult
}