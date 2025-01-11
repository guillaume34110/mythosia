import { GameState } from '../types/GameState';
import { Team } from '../types/Team';
import { createInitialCreatures, updateCreatures, handleSplitting } from './CreatureSystem';
import { handleCombat } from './CombatSystem';
import { generateSeed } from './ShapeSystem';
import { createUpgradeSystem } from './UpgradeSystem';

export function initializeTeams(canvasWidth: number, canvasHeight: number): Team[] {
  return [
    { 
      id: 'team1', 
      resources: 0, 
      upgrades: [], 
      speed: 1, 
      damage: 1, 
      health: 100, 
      creatures: createInitialCreatures('team1', canvasWidth, canvasHeight)
    },
    { 
      id: 'team2', 
      resources: 0, 
      upgrades: [], 
      speed: 1, 
      damage: 1, 
      health: 100, 
      creatures: createInitialCreatures('team2', canvasWidth, canvasHeight)
    }
  ];
}

export function resetGame(gameState: GameState, canvasWidth: number, canvasHeight: number) {
  const team1Seed = generateSeed('team1');
  const team2Seed = generateSeed('team2');
  
  gameState.teams = [
    { id: 'team1', resources: 0, upgrades: [], speed: 1, damage: 1, health: 100, creatures: createInitialCreatures(team1Seed, canvasWidth, canvasHeight) },
    { id: 'team2', resources: 0, upgrades: [], speed: 1, damage: 1, health: 100, creatures: createInitialCreatures(team2Seed, canvasWidth, canvasHeight) }
  ];
  gameState.upgradeCards = null;
  gameState.paused = false;
  gameState.winner = null;
}

export function handleCPUUpgrades(gameState: GameState, upgradeSystem: ReturnType<typeof createUpgradeSystem>) {
  const cpuTeam = gameState.teams.find(team => team.id === 'cpu');
  if (!cpuTeam) return;

  if (upgradeSystem.checkUpgrade(cpuTeam)) {
    const upgrades = upgradeSystem.generateUpgrades();
    const randomUpgrade = upgrades[Math.floor(Math.random() * upgrades.length)];
    upgradeSystem.handleUpgrade(cpuTeam, upgrades.indexOf(randomUpgrade));
  }
}

export function updateGame(gameState: GameState, upgradeSystem: ReturnType<typeof createUpgradeSystem>, canvasWidth: number, canvasHeight: number) {
  if (!gameState.paused) {
    updateCreatures(gameState.teams, canvasWidth, canvasHeight);
    handleCombat(gameState);
    handleSplitting(gameState.teams);
    handleCPUUpgrades(gameState, upgradeSystem);
  }

  // Vérification des améliorations disponibles
  gameState.teams.forEach(team => {
    if (upgradeSystem.checkUpgrade(team)) {
      gameState.paused = true;
      gameState.upgradeCards = upgradeSystem.generateUpgrades().map(upgrade => ({ upgrade }));
    }
  });
} 