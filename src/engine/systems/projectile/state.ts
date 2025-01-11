import { Projectile } from '../../types/Projectile';

export class ProjectileState {
  private projectiles: Projectile[] = [];

  getProjectiles(): Projectile[] {
    return this.projectiles;
  }

  setProjectiles(newProjectiles: Projectile[]): void {
    this.projectiles = newProjectiles;
  }

  addProjectile(projectile: Projectile): void {
    this.projectiles.push(projectile);
  }

  clearProjectiles(): void {
    this.projectiles = [];
  }
}

export const projectileState = new ProjectileState(); 