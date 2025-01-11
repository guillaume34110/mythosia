import { Team } from './Team';

export type Upgrade = {
  id: string;
  type: 'stat' | 'ability';
  name: string;
  description: string;
  effect?: (team: Team) => void;
}; 