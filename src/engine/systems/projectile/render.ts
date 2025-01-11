import { Projectile } from '../../types/Projectile';
import { projectileState } from './state';

export function renderProjectiles(ctx: CanvasRenderingContext2D): void {
  ctx.shadowColor = '#ffff00';
  ctx.shadowBlur = 10;
  ctx.fillStyle = '#ffff00';
  
  const projectiles = projectileState.getProjectiles();
  projectiles.forEach((projectile: Projectile) => {
    ctx.beginPath();
    ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
    ctx.fill();
  });
  
  ctx.shadowBlur = 0;
} 