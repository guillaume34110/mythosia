import { Projectile } from '../../types/Projectile';
import { projectileState } from './state';

export function createProjectile(
  x: number,
  y: number,
  direction: number,
  teamId: string,
  damage: number,
  speed: number = 5,
  radius: number = 3,
  lifetime: number = 60
): void {
  const projectile: Projectile = {
    x,
    y,
    direction,
    teamId,
    damage,
    speed,
    radius,
    lifetime
  };
  
  projectileState.addProjectile(projectile);
} 