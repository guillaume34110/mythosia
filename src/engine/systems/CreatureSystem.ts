import { Creature, Team, CreatureType } from '../types/Team';
import seedrandom from 'seedrandom';
import { generateShape, generateStats } from './ShapeSystem';
import { createHealthBar, updateHealthBar } from './HealthBarSystem';
import { projectileState, createProjectile } from './projectile';

export function createInitialCreatures(teamId: string, canvasWidth: number, canvasHeight: number): Creature[] {
  const creatures: Creature[] = [];
  const isTeam1 = teamId === 'team1';
  const startX = isTeam1 ? 100 : canvasWidth - 100;
  const random = seedrandom();
  const teamShape = generateShape(() => random());
  const baseStats = generateStats(() => random());
  
  // Déterminer le type de l'équipe en fonction de la seed
  const teamRandom = random();
  const teamType: CreatureType = teamRandom < 0.5 ? 'melee' : 'ranged';
  
  console.log(`Équipe ${teamId}: Type ${teamType}, Stats de base:`, baseStats);
  
  for (let i = 0; i < 5; i++) {
    const x = startX + (random() - 0.5) * 100;
    const y = canvasHeight / 2 + (random() - 0.5) * 200;
    
    const creature: Creature = {
      x,
      y,
      radius: 15,
      direction: random() * Math.PI * 2,
      velocity: 0,
      targetX: x,
      targetY: y,
      timeBeforeSplit: 1000,
      shape: teamShape,
      speed: teamType === 'ranged' ? baseStats.speed * 0.8 : baseStats.speed * 1.2,
      damage: teamType === 'ranged' ? baseStats.damage * 0.7 : baseStats.damage * 1.3,
      health: teamType === 'ranged' ? baseStats.health * 0.8 : baseStats.health * 1.2,
      healthBar: null as any,
      type: teamType,
      attackCooldown: teamType === 'ranged' ? 0 : undefined
    };
    creature.healthBar = createHealthBar(creature);
    creatures.push(creature);
  }
  return creatures;
}

export function updateCreatures(teams: Team[], canvasWidth: number, canvasHeight: number) {
  const ACCELERATION = 0.2;
  const MAX_VELOCITY = 3;
  const TURN_SPEED = 0.1;
  const DETECTION_RANGE = 300;
  const SAFE_DISTANCE = 200;
  const RANGED_ATTACK_RANGE = 250;
  const RANGED_ATTACK_COOLDOWN = 60;
  const COLLISION_PUSH = 0.5; // Force de répulsion lors des collisions

  // Première passe : mise à jour des comportements
  teams.forEach((team, teamIndex) => {
    const enemyTeam = teams[1 - teamIndex];

    // Supprimer les créatures mortes
    team.creatures = team.creatures.filter(creature => creature.health > 0);

    team.creatures.forEach(creature => {
      // Trouver l'ennemi le plus proche
      let closestEnemy: Creature | null = null;
      let closestDistance = Infinity;
      
      enemyTeam.creatures.forEach(enemy => {
        const distance = Math.hypot(enemy.x - creature.x, enemy.y - creature.y);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestEnemy = enemy;
        }
      });

      // Gérer le comportement en fonction du type
      if (closestEnemy && closestDistance < DETECTION_RANGE) {
        const enemy = closestEnemy as Creature;
        if (creature.type === 'ranged') {
          // Les créatures ranged maintiennent leur distance et tirent
          const optimalDistance = RANGED_ATTACK_RANGE * 0.8;
          if (closestDistance < optimalDistance) {
            // Trop proche, s'éloigner
            setTargetToFlee(creature, enemy, SAFE_DISTANCE);
          } else if (closestDistance < RANGED_ATTACK_RANGE) {
            // Distance optimale, tirer si possible
            if (creature.type === 'ranged' && (creature.attackCooldown ?? 0) <= 0) {
              createProjectile(
                creature.x,
                creature.y,
                Math.atan2(enemy.y - creature.y, enemy.x - creature.x),
                team.id,
                creature.damage * 30
              );
              creature.attackCooldown = RANGED_ATTACK_COOLDOWN;
            }
            // Rester à distance
            setTargetToMaintainDistance(creature, enemy, optimalDistance);
          } else {
            // Trop loin, se rapprocher un peu
            creature.targetX = enemy.x;
            creature.targetY = enemy.y;
          }
        } else {
          // Les créatures melee chassent ou fuient selon leur force
          setTargetBasedOnThreatLevel(creature, enemy, creature.damage, enemy.damage, SAFE_DISTANCE);
        }
      } else {
        // Si pas d'ennemi proche, patrouiller dans sa zone
        const isTeam1 = team.id === 'team1';
        if (Math.abs(creature.x - creature.targetX) < 10 && Math.abs(creature.y - creature.targetY) < 10) {
          const preferredX = isTeam1 ? canvasWidth * 0.3 : canvasWidth * 0.7;
          creature.targetX = preferredX + (Math.random() - 0.5) * canvasWidth * 0.3;
          creature.targetY = Math.random() * canvasHeight;
        }
      }

      // Mettre à jour le cooldown d'attaque
      if (creature.type === 'ranged' && creature.attackCooldown !== undefined && creature.attackCooldown > 0) {
        creature.attackCooldown--;
      }

      updateCreatureMovement(creature, TURN_SPEED, ACCELERATION, MAX_VELOCITY, team.speed);
      handleBoundaryCollision(creature, canvasWidth, canvasHeight);
      updateHealthBar(creature.healthBar, creature);
    });
  });

  // Deuxième passe : résolution des collisions
  teams.forEach((team1) => {
    teams.forEach((team2) => {
      team1.creatures.forEach((creature1) => {
        team2.creatures.forEach((creature2) => {
          if (creature1 === creature2) return; // Ne pas vérifier la collision avec soi-même

          const dx = creature2.x - creature1.x;
          const dy = creature2.y - creature1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = creature1.radius + creature2.radius;

          if (distance < minDistance) {
            // Calculer la force de répulsion
            const angle = Math.atan2(dy, dx);
            const overlap = minDistance - distance;
            
            // Appliquer la répulsion proportionnellement à la superposition
            const pushX = Math.cos(angle) * overlap * COLLISION_PUSH;
            const pushY = Math.sin(angle) * overlap * COLLISION_PUSH;

            // Déplacer les créatures en sens opposé
            creature1.x -= pushX;
            creature1.y -= pushY;
            creature2.x += pushX;
            creature2.y += pushY;

            // Ajuster les vitesses pour éviter les rebonds excessifs
            creature1.velocity *= 0.9;
            creature2.velocity *= 0.9;

            // Appliquer les dégâts si les créatures sont d'équipes différentes
            if (team1.id !== team2.id) {
              // Les créatures melee font plus de dégâts en collision
              const damage1 = creature1.type === 'melee' ? creature1.damage : creature1.damage * 0.5;
              const damage2 = creature2.type === 'melee' ? creature2.damage : creature2.damage * 0.5;
              
              creature1.health -= damage2;
              creature2.health -= damage1;
            }
          }
        });
      });
    });
  });

  // Troisième passe : supprimer les créatures mortes après les collisions
  teams.forEach(team => {
    team.creatures = team.creatures.filter(creature => creature.health > 0);
  });
}

function updateCreatureMovement(creature: Creature, turnSpeed: number, acceleration: number, maxVelocity: number, teamSpeed: number) {
  // Calculer l'angle vers la cible
  const targetAngle = Math.atan2(
    creature.targetY - creature.y,
    creature.targetX - creature.x
  );

  // Tourner progressivement vers la cible
  let angleDiff = targetAngle - creature.direction;
  while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
  while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
  creature.direction += angleDiff * turnSpeed;

  // Accélérer dans la direction actuelle
  creature.velocity = Math.min(creature.velocity + acceleration, maxVelocity * teamSpeed);

  // Mettre à jour la position
  creature.x += Math.cos(creature.direction) * creature.velocity;
  creature.y += Math.sin(creature.direction) * creature.velocity;

  // Ralentir légèrement
  creature.velocity *= 0.99;
}

function handleBoundaryCollision(creature: Creature, canvasWidth: number, canvasHeight: number) {
  if (creature.x < creature.radius) {
    creature.x = creature.radius;
    creature.direction = Math.PI - creature.direction;
  }
  if (creature.x > canvasWidth - creature.radius) {
    creature.x = canvasWidth - creature.radius;
    creature.direction = Math.PI - creature.direction;
  }
  if (creature.y < creature.radius) {
    creature.y = creature.radius;
    creature.direction = -creature.direction;
  }
  if (creature.y > canvasHeight - creature.radius) {
    creature.y = canvasHeight - creature.radius;
    creature.direction = -creature.direction;
  }
}

function setTargetBasedOnThreatLevel(creature: Creature, closestEnemy: Creature, allyDamage: number, enemyDamage: number, safeDistance: number) {
  if (allyDamage >= enemyDamage) {
    // Si plus fort, chasser l'ennemi
    creature.targetX = closestEnemy.x;
    creature.targetY = closestEnemy.y;
  } else {
    // Si plus faible, fuir dans la direction opposée
    const dx = creature.x - closestEnemy.x;
    const dy = creature.y - closestEnemy.y;
    const angle = Math.atan2(dy, dx);
    creature.targetX = creature.x + Math.cos(angle) * safeDistance;
    creature.targetY = creature.y + Math.sin(angle) * safeDistance;
  }
}

function setTargetToFlee(creature: Creature, enemy: Creature, distance: number) {
  const dx = creature.x - enemy.x;
  const dy = creature.y - enemy.y;
  const angle = Math.atan2(dy, dx);
  creature.targetX = creature.x + Math.cos(angle) * distance;
  creature.targetY = creature.y + Math.sin(angle) * distance;
}

function setTargetToMaintainDistance(creature: Creature, enemy: Creature, optimalDistance: number) {
  const dx = creature.x - enemy.x;
  const dy = creature.y - enemy.y;
  const currentDistance = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);
  
  if (currentDistance < optimalDistance - 10) {
    // S'éloigner légèrement
    creature.targetX = creature.x + Math.cos(angle) * 50;
    creature.targetY = creature.y + Math.sin(angle) * 50;
  } else if (currentDistance > optimalDistance + 10) {
    // Se rapprocher légèrement
    creature.targetX = creature.x - Math.cos(angle) * 50;
    creature.targetY = creature.y - Math.sin(angle) * 50;
  } else {
    // Maintenir la position actuelle
    creature.targetX = creature.x;
    creature.targetY = creature.y;
  }
}

export function handleSplitting(teams: Team[]) {
  const MAX_CREATURES = 100;

  teams.forEach(team => {
    // Ne pas diviser si l'équipe a atteint la limite
    if (team.creatures.length >= MAX_CREATURES) {
      return;
    }

    team.creatures.forEach((creature, index) => {
      creature.timeBeforeSplit--;

      // Ne pas diviser si ça dépasserait la limite
      if (creature.timeBeforeSplit <= 0 && team.creatures.length < MAX_CREATURES) {
        // Réinitialiser le temps avant la prochaine division
        creature.timeBeforeSplit = 1000;
        
        // Créer une nouvelle créature avec la même forme que sa parente
        const newCreature: Creature = {
          x: creature.x,
          y: creature.y,
          radius: creature.radius,
          direction: creature.direction + Math.PI,
          velocity: creature.velocity,
          targetX: creature.x,
          targetY: creature.y,
          timeBeforeSplit: 1000,
          shape: creature.shape,
          speed: creature.speed,
          damage: creature.damage,
          health: creature.health,
          type: creature.type,
          healthBar: null as any,
          attackCooldown: creature.type === 'ranged' ? 0 : undefined
        };
        newCreature.healthBar = createHealthBar(newCreature);
        team.creatures.push(newCreature);

        if (team.creatures.length === MAX_CREATURES) {
          console.log(`L'équipe ${team.id} a atteint la limite de ${MAX_CREATURES} créatures`);
        }
      }
    });
  });
} 