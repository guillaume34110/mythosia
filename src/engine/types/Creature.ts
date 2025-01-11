export type Creature = {
  x: number;
  y: number;
  radius: number;
  direction: number;  // angle en radians
  velocity: number;   // vitesse actuelle
  targetX: number;    // position cible
  targetY: number;
  timeBeforeSplit: number; // temps restant avant la division
}; 