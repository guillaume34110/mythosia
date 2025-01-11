import { Upgrade } from './Upgrade';
import { HealthBar } from '../systems/HealthBarSystem';

export type CreatureType = 'melee' | 'ranged';

export type Creature = {
  x: number;
  y: number;
  radius: number;
  direction: number;  // angle en radians
  velocity: number;   // vitesse actuelle
  targetX: number;    // position cible
  targetY: number;
  timeBeforeSplit: number; // temps restant avant la division
  shape: number[][]; // forme de la créature
  speed: number;     // vitesse de base
  damage: number;    // dégâts de base
  health: number;    // santé de base
  healthBar: HealthBar; // barre de vie
  type: CreatureType; // type de créature (melee ou ranged)
  attackCooldown?: number; // temps avant la prochaine attaque (pour les ranged)
};

export type Team = {
  id: string;
  resources: number;
  upgrades: Upgrade[];
  speed: number;
  damage: number;
  health: number;
  creatures: Creature[];
}; 