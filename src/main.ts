import { createUpgradeSystem } from './engine/systems/UpgradeSystem';
import { GameState } from './engine/types/GameState';
import { render } from './engine/systems/RenderSystem';
import { initializeTeams } from './engine/systems/GameSystem';
import { updateCreatures, handleSplitting } from './engine/systems/CreatureSystem';
import { 
  createProjectile, 
  updateProjectiles, 
  renderProjectiles, 
  projectileState 
} from './engine/systems/projectile';

// Initialisation du canvas
const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

// Ajuster la taille du canvas
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Initialisation de l'état du jeu
const gameState: GameState = {
  teams: [],
  upgradeCards: null,
  paused: false,
  winner: null  
};

// Remplir l'état du jeu avec les équipes et créatures initiales
gameState.teams = initializeTeams(canvas.width, canvas.height);

// Création des systèmes
const upgradeSystem = createUpgradeSystem(gameState);

// Fonction de réinitialisation du jeu
function resetGame() {
  projectileState.clearProjectiles();
  gameState.teams = initializeTeams(canvas.width, canvas.height);
  gameState.upgradeCards = null;
  gameState.paused = false;
  gameState.winner = null;
}

// Boucle principale du jeu
function gameLoop(timestamp: number) {
  if (!gameState.paused) {
    updateCreatures(gameState.teams, canvas.width, canvas.height);
    handleSplitting(gameState.teams);
    updateProjectiles(gameState.teams);
    checkVictoryCondition();
  }
  
  render(ctx, gameState, canvas.width, canvas.height);
  renderProjectiles(ctx);
  requestAnimationFrame(gameLoop);
}

// Gestion des clics sur les cartes et réinitialisation
canvas.addEventListener('click', (event) => {
  if (gameState.winner) {
    resetGame();
    return;
  }

  if (gameState.upgradeCards) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    gameState.upgradeCards.forEach((card, index) => {
      const cardX = canvas.width / 2 - 300 + index * 200;
      const cardY = canvas.height / 2 - 100;
      
      if (x >= cardX && x <= cardX + 180 && y >= cardY && y <= cardY + 250) {
        const activeTeam = gameState.teams.find(team => upgradeSystem.checkUpgrade(team));
        if (activeTeam) {
          upgradeSystem.handleUpgrade(activeTeam, index);
          gameState.upgradeCards = null;
          gameState.paused = false;
        }
      }
    });
  }
});

function checkVictoryCondition() {
  // Vérifier si une équipe a perdu toutes ses créatures
  gameState.teams.forEach(team => {
    if (team.creatures.length === 0) {
      gameState.winner = team.id === 'team1' ? 'team2' : 'team1';
      gameState.paused = true;
    }
  });
}

// Démarrage du jeu
requestAnimationFrame(gameLoop); 