import seedrandom from 'seedrandom';

// Fonction pour générer une forme à partir d'un générateur aléatoire
export function generateShape(random: () => number): number[][] {
  const shape: number[][] = [];
  
  for (let i = 0; i < 5; i++) {
    const angle = random() * Math.PI * 2;
    const radius = 5 + random() * 10;
    shape.push([Math.cos(angle) * radius, Math.sin(angle) * radius]);
  }
  console.log(shape ,random(), 'shape')
  return shape;
}

// Fonction pour générer une seed unique basée sur un préfixe et le timestamp actuel
export function generateSeed(prefix: string): string {
  return prefix + '-' + Date.now().toString();
}

export function generateStats(random: () => number) {
  return {
    speed: 0.5 + random() * 1.5,
    damage: 0.5 + random() * 1.5,
    health: 50 + random() * 100
  };
} 