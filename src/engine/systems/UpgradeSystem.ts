import { Team } from '../types/Team';
import { Upgrade } from '../types/Upgrade';
import { GameState } from '../types/GameState';

export type UpgradeSystem = {
  checkUpgrade: (team: Team) => boolean;
  handleUpgrade: (team: Team, upgradeIndex: number) => void;
  generateUpgrades: () => Upgrade[];
};

export function createUpgradeSystem(gameState: GameState) {
  const checkUpgrade = (team: Team): boolean => {
    return team.resources >= 50 && Math.floor(team.resources) % 50 === 0;
  };

  const handleUpgrade = (team: Team, upgradeIndex: number): void => {
    if (!gameState.upgradeCards) return;
    
    const upgrade = gameState.upgradeCards[upgradeIndex].upgrade;
    team.upgrades.push(upgrade);
    
    // Appliquer les effets de l'amélioration
    if (upgrade.effect) {
      upgrade.effect(team);
    }
  };

  const generateUpgrades = (): Upgrade[] => {
    // Générer 3 améliorations aléatoires
    return [
      { id: 'speed', type: 'stat', name: 'Vitesse', description: 'Augmente la vitesse', effect: (team: Team) => { team.speed *= 1.2; } },
      { id: 'damage', type: 'stat', name: 'Dégâts', description: 'Augmente les dégâts', effect: (team: Team) => { team.damage *= 1.2; } },
      { id: 'health', type: 'stat', name: 'Santé', description: 'Augmente la santé', effect: (team: Team) => { team.health *= 1.2; } }
    ];
  };

  return {
    checkUpgrade,
    handleUpgrade,
    generateUpgrades
  };
} 