import { Creature, Team } from '../types/Team';
import { GameState } from '../types/GameState';

export function checkCollision(c1: Creature, c2: Creature): boolean {
  const dx = c2.x - c1.x;
  const dy = c2.y - c1.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < (c1.radius + c2.radius);
}

export function handleCombat(gameState: GameState) {
  const [team1, team2] = gameState.teams;
  
  team1.creatures.forEach((creature1, i) => {
    team2.creatures.forEach((creature2, j) => {
      if (checkCollision(creature1, creature2)) {
        if (creature1.damage > creature2.damage) {
          // La créature 1 absorbe la créature 2
          creature1.radius += creature2.radius * 0.1;
          team2.creatures.splice(j, 1);
        } else if (creature2.damage > creature1.damage) {
          // La créature 2 absorbe la créature 1
          creature2.radius += creature1.radius * 0.1;
          team1.creatures.splice(i, 1);
        } else {
          // Égalité : choix aléatoire du gagnant
          if (Math.random() < 0.5) {
            creature1.radius += creature2.radius * 0.1;
            team2.creatures.splice(j, 1);
          } else {
            creature2.radius += creature1.radius * 0.1;
            team1.creatures.splice(i, 1);
          }
        }
      }
    });
  });

  // Vérifier la victoire
  if (team1.creatures.length === 0) {
    gameState.paused = true;
    gameState.winner = 'team2';
  } else if (team2.creatures.length === 0) {
    gameState.paused = true;
    gameState.winner = 'team1';
  }
} 