import { Projectile } from '../../types/Projectile';
import { Team } from '../../types/Team';
import { projectileState } from './state';

export function updateProjectiles(teams: Team[]): void {
  // Mettre à jour la position des projectiles
  const projectiles = projectileState.getProjectiles();
  projectiles.forEach((projectile: Projectile) => {
    projectile.x += Math.cos(projectile.direction) * projectile.speed;
    projectile.y += Math.sin(projectile.direction) * projectile.speed;
    projectile.lifetime--;
  });

  // Vérifier les collisions avec les créatures
  const remainingProjectiles = projectiles.filter((projectile: Projectile) => {
    let projectileAlive = true;

    teams.forEach(team => {
      // Ignorer les créatures alliées
      if (team.id === projectile.teamId) return;
      
      team.creatures.forEach(creature => {
        const dx = creature.x - projectile.x;
        const dy = creature.y - projectile.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < creature.radius + projectile.radius) {
          // Collision détectée
          creature.health -= projectile.damage;
          projectileAlive = false; // Le projectile est détruit après avoir touché
        }
      });
    });

    return projectileAlive && projectile.lifetime > 0;
  });

  projectileState.setProjectiles(remainingProjectiles);
} 