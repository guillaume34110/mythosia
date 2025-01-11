# Mythosia

An autonomous evolution-based combat game where two teams of creatures battle for survival.

## Overview

Mythosia is a unique auto-battler where creatures evolve and fight independently. Players influence the evolution of their team through strategic choices, unlocking new abilities and body parts at key decision points. The game features a seed-based reproduction system that affects population dynamics and team survival strategies.

### Key Features

- Autonomous creature combat system
- Two opposing teams with distinct evolutionary paths
- Team-based uniform creatures (one seed per team)
- Strategic evolution choices
- Independent creature movement and decision-making
- Territory control and resource management
- Procedurally generated body parts
- Physics-based interactions

## Game Mechanics

### Core Gameplay
- Creatures move and fight autonomously
- No direct player control during battles
- Strategic choices during evolution phases
- Population dynamics influenced by combat outcomes
- Territory control affects resource distribution
- Each team has uniform creatures based on a single seed

### Evolution System
- Unlock new abilities through progression
- Develop and modify body parts
- Strategic adaptation choices
- Team-wide evolution affects all creatures
- Seed-based generation ensures team uniformity

## Combat System

The game features a procedurally generated combat system where each creature is equipped with unique weapons and abilities based on their seed.

### Weapons

Each creature possesses a specialized organ that serves as a weapon. These weapons are procedurally generated with the following characteristics:

#### Types
- **Melee Weapons**: Close-range combat organs (claws, spikes, pincers)
- **Ranged Weapons**: Distance attack organs (spitters, launchers, cannons)

#### Attack Patterns
- **Slash**: Wide arc, close range
- **Thrust**: Direct, focused attack
- **Spray**: Multiple projectiles
- **Snipe**: Long-range, precise shot

#### Effects System
Weapons can apply various effects to their targets:

**Damage Effects**
- Poison: Continuous damage over time
- Burn: High damage over short duration
- Bleed: Moderate sustained damage

**Status Effects**
- Freeze: Severely reduces movement speed
- Slow: Moderately reduces movement speed
- Stun: Temporarily stops movement

### Combat Mechanics

- Each team's creatures share the same weapon type, determined by their team seed
- Weapons have cooldowns between attacks
- Attack success is influenced by range and accuracy stats
- Effects can stack and combine for strategic depth

### Extending the System

The combat system is designed to be easily extensible:

1. **Adding New Effects**
   - Create new damage or status effects in `WeaponGenerator.ts`
   - Define effect behavior in `CombatSystem.ts`

2. **New Attack Patterns**
   - Add new patterns in `WeaponGenerator.ts`
   - Define pattern parameters (range, angle, speed, etc.)

3. **Weapon Organs**
   - Customize organ shapes and appearances
   - Add new weapon types and variations

## Technologies

- TypeScript for game logic
- WebGL for rendering
- Custom game engine
- Jest for testing
- Vite for building

## Development

### Prerequisites
- Node.js
- npm or yarn

### Installation
```bash
npm install
```

### Running the Game
```bash
npm run dev
```

### Testing
```bash
npm test
```

## Project Structure

```
src/
  ├── engine/     # Core game engine components
  ├── game/       # Game-specific logic and mechanics
  ├── assets/     # Game assets
  ├── utils/      # Shared utilities
  └── types/      # TypeScript type definitions
```

## Contributing

Please follow our development guidelines when contributing:
- Use TypeScript for all code files
- Follow TDD practices
- Maintain clean code architecture
- Document public APIs and complex logic
- Use proper commit message prefixes (engine:, game:, etc.)

## License

[MIT License](LICENSE)