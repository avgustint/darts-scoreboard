import { ChangeType } from "../enums/change-type.enum";

export interface GameResult {
    leg: number;
    set: number;
    total: number;
    changed: ChangeType
}