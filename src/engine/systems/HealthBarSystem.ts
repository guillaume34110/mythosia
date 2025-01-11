import { Creature } from '../types/Team';

export type HealthBar = {
  maxHealth: number;
  currentHealth: number;
  width: number;
  height: number;
  x: number;
  y: number;
};

export function createHealthBar(creature: Creature): HealthBar {
  return {
    maxHealth: creature.health,
    currentHealth: creature.health,
    width: 30,
    height: 4,
    x: creature.x - 15,
    y: creature.y - creature.radius - 6
  };
}

export function updateHealthBar(healthBar: HealthBar, creature: Creature) {
  healthBar.x = creature.x - healthBar.width/2;
  healthBar.y = creature.y - creature.radius - healthBar.height - 2;
  
  healthBar.currentHealth = Math.max(0, Math.min(creature.health, healthBar.maxHealth));
}

export function renderHealthBar(ctx: CanvasRenderingContext2D, healthBar: HealthBar) {
  const healthPercentage = healthBar.currentHealth / healthBar.maxHealth;
  
  // Fond de la barre de vie (rouge)
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(
    healthBar.x,
    healthBar.y,
    healthBar.width,
    healthBar.height
  );
  
  // Barre de vie actuelle (verte)
  ctx.fillStyle = '#00ff00';
  ctx.fillRect(
    healthBar.x,
    healthBar.y,
    healthBar.width * healthPercentage,
    healthBar.height
  );
} 