// Battle calculation and combat system

export interface Army {
  id: string;
  name: string;
  owner: string;
  troops: TroopComposition;
  morale: number;
  experience: number;
  leader: Leader | null;
  location: string;
  supplies: number;
}

export interface TroopComposition {
  infantry: number;
  cavalry: number;
  artillery: number;
}

export interface Leader {
  id: string;
  name: string;
  fire: number;      // Artillery phase bonus
  shock: number;     // Melee phase bonus
  maneuver: number;  // Movement and terrain bonus
  siege: number;     // Siege ability
}

export interface BattleResult {
  winner: 'attacker' | 'defender' | 'draw';
  attackerLosses: TroopComposition;
  defenderLosses: TroopComposition;
  attackerMorale: number;
  defenderMorale: number;
  phases: BattlePhase[];
  duration: number;
  terrain: string;
}

export interface BattlePhase {
  name: 'fire' | 'shock';
  attackerDamage: number;
  defenderDamage: number;
  description: string;
}

// Combat stats by troop type
const TROOP_STATS = {
  infantry: { attack: 1, defense: 1, morale: 1 },
  cavalry: { attack: 2, defense: 0.5, morale: 1.5 },
  artillery: { attack: 3, defense: 0.3, morale: 0.5 }
};

// Terrain modifiers
const TERRAIN_MODIFIERS: Record<string, { attackMod: number; defenseMod: number; cavPenalty: number }> = {
  plains: { attackMod: 0, defenseMod: 0, cavPenalty: 0 },
  forest: { attackMod: -0.2, defenseMod: 0.3, cavPenalty: -0.5 },
  mountains: { attackMod: -0.4, defenseMod: 0.5, cavPenalty: -0.8 },
  marsh: { attackMod: -0.3, defenseMod: 0.2, cavPenalty: -0.6 },
  desert: { attackMod: -0.1, defenseMod: -0.1, cavPenalty: 0 },
  crossing: { attackMod: -0.5, defenseMod: 0.3, cavPenalty: -0.3 }
};

// Calculate total army strength
export function calculateStrength(army: Army): number {
  const { infantry, cavalry, artillery } = army.troops;
  return (
    infantry * TROOP_STATS.infantry.attack +
    cavalry * TROOP_STATS.cavalry.attack +
    artillery * TROOP_STATS.artillery.attack
  ) * (army.morale / 100) * (1 + army.experience / 200);
}

// Calculate combat width
export function calculateCombatWidth(troops: TroopComposition): number {
  return troops.infantry + troops.cavalry; // Artillery doesn't take width
}

// Resolve a battle
export function resolveBattle(
  attacker: Army,
  defender: Army,
  terrain: string = 'plains'
): BattleResult {
  const terrainMod = TERRAIN_MODIFIERS[terrain] || TERRAIN_MODIFIERS.plains;
  const phases: BattlePhase[] = [];

  let attackerMorale = attacker.morale;
  let defenderMorale = defender.morale;

  const attackerLosses: TroopComposition = { infantry: 0, cavalry: 0, artillery: 0 };
  const defenderLosses: TroopComposition = { infantry: 0, cavalry: 0, artillery: 0 };

  // Leader bonuses
  const attackerLeaderBonus = attacker.leader
    ? { fire: attacker.leader.fire, shock: attacker.leader.shock }
    : { fire: 0, shock: 0 };
  const defenderLeaderBonus = defender.leader
    ? { fire: defender.leader.fire, shock: defender.leader.shock }
    : { fire: 0, shock: 0 };

  // Battle phases (2 fire, 2 shock)
  const phaseOrder: ('fire' | 'shock')[] = ['fire', 'shock', 'fire', 'shock'];

  for (const phaseName of phaseOrder) {
    // Calculate phase damage
    const isFirePhase = phaseName === 'fire';

    // Attacker damage
    let attackerBaseDamage = calculatePhaseDamage(
      attacker.troops,
      isFirePhase,
      attackerLeaderBonus[phaseName],
      terrainMod.attackMod,
      terrainMod.cavPenalty
    );

    // Defender damage
    let defenderBaseDamage = calculatePhaseDamage(
      defender.troops,
      isFirePhase,
      defenderLeaderBonus[phaseName],
      terrainMod.defenseMod,
      terrainMod.cavPenalty
    );

    // Apply morale modifier
    attackerBaseDamage *= attackerMorale / 100;
    defenderBaseDamage *= defenderMorale / 100;

    // Apply damage to troops
    const attackerCasualties = Math.floor(defenderBaseDamage * 0.1);
    const defenderCasualties = Math.floor(attackerBaseDamage * 0.1);

    // Distribute casualties
    distributeCasualties(attackerLosses, attacker.troops, attackerCasualties);
    distributeCasualties(defenderLosses, defender.troops, defenderCasualties);

    // Morale damage
    attackerMorale = Math.max(0, attackerMorale - defenderBaseDamage * 0.1);
    defenderMorale = Math.max(0, defenderMorale - attackerBaseDamage * 0.1);

    phases.push({
      name: phaseName,
      attackerDamage: attackerBaseDamage,
      defenderDamage: defenderBaseDamage,
      description: `${phaseName.charAt(0).toUpperCase() + phaseName.slice(1)} phase: ${defenderCasualties} attacker casualties, ${attackerCasualties} defender casualties`
    });

    // Check for rout
    if (attackerMorale <= 0 || defenderMorale <= 0) break;
  }

  // Determine winner
  let winner: 'attacker' | 'defender' | 'draw' = 'draw';
  if (defenderMorale <= 0 && attackerMorale > 0) {
    winner = 'attacker';
  } else if (attackerMorale <= 0 && defenderMorale > 0) {
    winner = 'defender';
  } else if (attackerMorale > defenderMorale) {
    winner = 'attacker';
  } else if (defenderMorale > attackerMorale) {
    winner = 'defender';
  }

  return {
    winner,
    attackerLosses,
    defenderLosses,
    attackerMorale,
    defenderMorale,
    phases,
    duration: phases.length,
    terrain
  };
}

// Calculate damage for a phase
function calculatePhaseDamage(
  troops: TroopComposition,
  isFirePhase: boolean,
  leaderBonus: number,
  terrainMod: number,
  cavPenalty: number
): number {
  let damage = 0;

  if (isFirePhase) {
    // Artillery dominates fire phase
    damage = troops.artillery * TROOP_STATS.artillery.attack * 2;
    damage += troops.infantry * TROOP_STATS.infantry.attack * 0.5;
  } else {
    // Shock phase - infantry and cavalry
    damage = troops.infantry * TROOP_STATS.infantry.attack;
    damage += troops.cavalry * TROOP_STATS.cavalry.attack * (1 + cavPenalty);
    damage += troops.artillery * TROOP_STATS.artillery.attack * 0.3;
  }

  // Apply modifiers
  damage *= (1 + terrainMod);
  damage *= (1 + leaderBonus * 0.1);

  // Randomness factor (±20%)
  damage *= 0.8 + Math.random() * 0.4;

  return damage;
}

// Distribute casualties among troop types
function distributeCasualties(
  losses: TroopComposition,
  troops: TroopComposition,
  totalLosses: number
): void {
  const total = troops.infantry + troops.cavalry + troops.artillery;
  if (total === 0) return;

  // Distribute proportionally, with infantry taking more
  const infantryRatio = (troops.infantry / total) * 1.2;
  const cavalryRatio = (troops.cavalry / total) * 1.0;
  const artilleryRatio = (troops.artillery / total) * 0.5;

  const sum = infantryRatio + cavalryRatio + artilleryRatio;

  losses.infantry += Math.floor(totalLosses * (infantryRatio / sum));
  losses.cavalry += Math.floor(totalLosses * (cavalryRatio / sum));
  losses.artillery += Math.floor(totalLosses * (artilleryRatio / sum));
}

// Siege calculation
export interface SiegeResult {
  progress: number;
  breached: boolean;
  casualties: number;
  daysRemaining: number;
}

export function calculateSiege(
  besieger: Army,
  fortLevel: number,
  artilleryCount: number,
  days: number
): SiegeResult {
  const leaderSiegeBonus = besieger.leader?.siege || 0;

  // Base siege progress per day
  let progressPerDay = 1 + (artilleryCount * 0.5) + (leaderSiegeBonus * 0.3);

  // Fort level resistance
  const fortResistance = fortLevel * 10;
  progressPerDay = progressPerDay / (1 + fortLevel * 0.5);

  const totalProgress = progressPerDay * days;
  const breached = totalProgress >= fortResistance;

  // Casualties during siege (attrition)
  const casualtyRate = 0.01 * (1 + fortLevel * 0.1);
  const totalTroops = besieger.troops.infantry + besieger.troops.cavalry + besieger.troops.artillery;
  const casualties = Math.floor(totalTroops * casualtyRate * days);

  // Estimated days to breach
  const daysRemaining = breached ? 0 : Math.ceil((fortResistance - totalProgress) / progressPerDay);

  return {
    progress: Math.min(100, (totalProgress / fortResistance) * 100),
    breached,
    casualties,
    daysRemaining
  };
}

// Naval battle (simplified)
export function resolveNavalBattle(
  attackerStrength: number,
  defenderStrength: number,
  attackerAdmiral: number = 0,
  defenderAdmiral: number = 0
): { winner: 'attacker' | 'defender'; attackerLosses: number; defenderLosses: number } {
  const attackerTotal = attackerStrength * (1 + attackerAdmiral * 0.05);
  const defenderTotal = defenderStrength * (1 + defenderAdmiral * 0.05);

  const ratio = attackerTotal / (attackerTotal + defenderTotal);
  const roll = Math.random();

  const winner = roll < ratio ? 'attacker' : 'defender';

  // Losses based on relative strength
  const attackerLosses = Math.floor(defenderTotal * 0.2 * (0.5 + Math.random() * 0.5));
  const defenderLosses = Math.floor(attackerTotal * 0.2 * (0.5 + Math.random() * 0.5));

  return { winner, attackerLosses, defenderLosses };
}

export default {
  calculateStrength,
  calculateCombatWidth,
  resolveBattle,
  calculateSiege,
  resolveNavalBattle
};
