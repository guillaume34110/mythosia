import { GameState } from '../types/GameState';
import { Creature } from '../types/Team';
import { renderHealthBar } from './HealthBarSystem';
import { renderProjectiles } from './projectile';

export function render(ctx: CanvasRenderingContext2D, gameState: GameState, canvasWidth: number, canvasHeight: number) {
  // Effacer le canvas
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Afficher les créatures
  gameState.teams.forEach(team => {
    team.creatures.forEach(creature => {
      // Définir la couleur de l'équipe
      ctx.fillStyle = team.id === 'team1' ? '#ff0000' : '#0000ff';
      
      // Dessiner la créature
      ctx.beginPath();
      ctx.moveTo(creature.x + creature.shape[0][0], creature.y + creature.shape[0][1]);
      for (let i = 1; i < creature.shape.length; i++) {
        ctx.lineTo(creature.x + creature.shape[i][0], creature.y + creature.shape[i][1]);
      }
      ctx.closePath();
      ctx.fill();
      
      // Dessiner la barre de vie après la créature
      renderHealthBar(ctx, creature.healthBar);
    });
  });

  // Afficher les projectiles
  renderProjectiles(ctx);

  // Afficher les ressources des équipes
  ctx.font = '20px Arial';
  ctx.fillStyle = '#fff';
  gameState.teams.forEach((team, index) => {
    const y = 30 + index * 90;
    ctx.fillText(`${team.id}:`, 20, y);
    ctx.fillText(`Ressources: ${Math.floor(team.resources)}`, 20, y + 25);
    ctx.fillText(`Vitesse: ${team.creatures[0]?.speed.toFixed(2)}`, 20, y + 50);
    ctx.fillText(`Dégâts: ${team.creatures[0]?.damage.toFixed(2)}`, 200, y + 50);
    ctx.fillText(`Santé: ${team.creatures[0]?.health.toFixed(0)}`, 380, y + 50);
  });

  renderUpgradeCards(ctx, gameState, canvasWidth, canvasHeight);
  renderWinScreen(ctx, gameState, canvasWidth, canvasHeight);
}

function renderUpgradeCards(ctx: CanvasRenderingContext2D, gameState: GameState, canvasWidth: number, canvasHeight: number) {
  if (gameState.upgradeCards) {
    gameState.upgradeCards.forEach((card, index) => {
      const x = canvasWidth / 2 - 300 + index * 200;
      const y = canvasHeight / 2 - 100;
      
      // Dessiner la carte
      ctx.fillStyle = '#333';
      ctx.fillRect(x, y, 180, 250);
      
      ctx.fillStyle = '#fff';
      ctx.font = '16px Arial';
      ctx.fillText(card.upgrade.name, x + 10, y + 30);
      ctx.font = '14px Arial';
      ctx.fillText(card.upgrade.description, x + 10, y + 60);
    });
  }
}

function renderWinScreen(ctx: CanvasRenderingContext2D, gameState: GameState, canvasWidth: number, canvasHeight: number) {
  if (gameState.winner) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    ctx.fillStyle = '#fff';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${gameState.winner} a gagné !`, canvasWidth / 2, canvasHeight / 2);
    ctx.font = '24px Arial';
    ctx.fillText('Cliquez pour recommencer', canvasWidth / 2, canvasHeight / 2 + 50);
    
    ctx.textAlign = 'left';
  }
} 