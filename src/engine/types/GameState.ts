import { Team } from './Team';
import { UpgradeCard } from './UpgradeCard';

export type GameState = {
  teams: Team[];
  upgradeCards: UpgradeCard[] | null;
  paused: boolean;
  winner: string | null;
}; 