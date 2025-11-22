// Combat resolution and battle mechanics system

export interface BattleResult {
  winner: string;
  loser: string;
  attackerCasualties: number;
  defenderCasualties: number;
  attackerMoraleHit: number;
  defenderMoraleHit: number;
  warScore: number;
  prestige: number;
}

export interface CombatUnit {
  type: 'infantry' | 'cavalry' | 'artillery';
  strength: number;
  morale: number;
  tactics: number;
  discipline: number;
}

export interface CombatPhase {
  name: string;
  attackerDamage: number;
  defenderDamage: number;
  duration: number;
}

export interface TerrainCombatBonus {
  terrain: string;
  attackerPenalty: number;
  defenderBonus: number;
  cavalryPenalty: number;
}

export interface LeaderBonus {
  fire: number;
  shock: number;
  maneuver: number;
  siege: number;
}

// Combat modifiers
export const COMBAT_MODIFIERS = {
  baseMorale: 2.0,
  disciplineMultiplier: 1.0,
  combatWidthBase: 20,
  combatWidthPerMilTech: 2,
  artilleryModifier: 0.5,
  cavalryFlankBonus: 50
};

// Terrain combat bonuses
export const TERRAIN_COMBAT: TerrainCombatBonus[] = [
  { terrain: 'plains', attackerPenalty: 0, defenderBonus: 0, cavalryPenalty: 0 },
  { terrain: 'farmlands', attackerPenalty: 0, defenderBonus: 0, cavalryPenalty: 0 },
  { terrain: 'grasslands', attackerPenalty: 0, defenderBonus: 0, cavalryPenalty: 0 },
  { terrain: 'forest', attackerPenalty: -1, defenderBonus: 1, cavalryPenalty: -50 },
  { terrain: 'hills', attackerPenalty: -1, defenderBonus: 1, cavalryPenalty: -25 },
  { terrain: 'mountains', attackerPenalty: -2, defenderBonus: 2, cavalryPenalty: -75 },
  { terrain: 'marsh', attackerPenalty: -1, defenderBonus: 1, cavalryPenalty: -75 },
  { terrain: 'jungle', attackerPenalty: -1, defenderBonus: 1, cavalryPenalty: -75 },
  { terrain: 'desert', attackerPenalty: 0, defenderBonus: 0, cavalryPenalty: 0 }
];

// Combat width by mil tech
export const COMBAT_WIDTH_BY_TECH: Record<number, number> = {
  1: 20, 5: 22, 10: 25, 15: 27, 20: 30, 25: 32, 30: 36
};

// Get terrain combat bonus
export function getTerrainCombat(terrain: string): TerrainCombatBonus {
  return TERRAIN_COMBAT.find(t => t.terrain === terrain) || TERRAIN_COMBAT[0];
}

// Calculate combat width
export function calculateCombatWidth(
  milTech: number,
  ideas: number = 0
): number {
  let width = COMBAT_MODIFIERS.combatWidthBase;

  // Find the appropriate tech level
  const techLevels = Object.keys(COMBAT_WIDTH_BY_TECH)
    .map(Number)
    .sort((a, b) => b - a);

  for (const level of techLevels) {
    if (milTech >= level) {
      width = COMBAT_WIDTH_BY_TECH[level];
      break;
    }
  }

  return width + ideas;
}

// Calculate unit damage
export function calculateUnitDamage(
  unit: CombatUnit,
  phase: 'fire' | 'shock',
  leader: LeaderBonus,
  terrain: TerrainCombatBonus,
  isAttacker: boolean
): number {
  let damage = unit.strength * unit.tactics;

  // Phase modifier
  if (phase === 'fire') {
    damage *= (unit.type === 'artillery' ? 1.5 : 1);
    damage += leader.fire;
  } else {
    damage *= (unit.type === 'cavalry' ? 1.25 : 1);
    damage += leader.shock;
  }

  // Discipline
  damage *= (1 + (unit.discipline - 100) / 100);

  // Terrain
  if (isAttacker) {
    damage *= (1 + terrain.attackerPenalty / 10);
  } else {
    damage *= (1 + terrain.defenderBonus / 10);
  }

  return Math.max(0, damage);
}

// Calculate morale damage
export function calculateMoraleDamage(
  casualties: number,
  totalTroops: number,
  morale: number
): number {
  const casualtyRatio = casualties / Math.max(1, totalTroops);
  return morale * casualtyRatio * 0.5;
}

// Calculate war score from battle
export function calculateBattleWarScore(
  casualties: number,
  enemyCasualties: number,
  isWinner: boolean
): number {
  const basescore = isWinner ? 1 : 0;
  const casualtyScore = (enemyCasualties - casualties) / 1000;
  return Math.max(0, Math.min(5, basescore + casualtyScore));
}

// Calculate prestige from battle
export function calculateBattlePrestige(
  isWinner: boolean,
  casualtyRatio: number
): number {
  if (isWinner) {
    return Math.min(5, 1 + casualtyRatio);
  }
  return Math.max(-5, -1 - casualtyRatio);
}

// Check if army will retreat
export function willRetreat(
  currentMorale: number,
  maxMorale: number
): boolean {
  return currentMorale <= maxMorale * 0.5;
}

// Calculate flanking damage
export function calculateFlankingBonus(
  attackerWidth: number,
  defenderWidth: number,
  cavalryRatio: number
): number {
  if (attackerWidth <= defenderWidth) return 0;

  const flankingUnits = attackerWidth - defenderWidth;
  return flankingUnits * cavalryRatio * COMBAT_MODIFIERS.cavalryFlankBonus / 100;
}

// Calculate siege progress
export function calculateSiegeProgress(
  fortLevel: number,
  siegingTroops: number,
  artillery: number,
  leaderSiege: number
): number {
  const baseProgress = 5;
  const troopBonus = Math.min(50, siegingTroops / 1000);
  const artilleryBonus = Math.min(artillery, fortLevel) * 2;
  const leaderBonus = leaderSiege * 2;
  const fortPenalty = fortLevel * 3;

  return Math.max(1, baseProgress + troopBonus + artilleryBonus + leaderBonus - fortPenalty);
}

// Calculate attrition
export function calculateAttrition(
  troops: number,
  supplyLimit: number,
  terrain: string,
  isWinter: boolean
): number {
  let attrition = 0;

  // Over supply limit
  if (troops > supplyLimit) {
    attrition += (troops - supplyLimit) / supplyLimit * 5;
  }

  // Terrain
  const terrainAttrition: Record<string, number> = {
    desert: 1,
    arctic: 2,
    jungle: 1,
    mountains: 0.5,
    marsh: 0.5
  };
  attrition += terrainAttrition[terrain] || 0;

  // Winter
  if (isWinter) {
    attrition += 1;
  }

  return Math.min(5, attrition);
}

// Get battle phase name
export function getPhaseName(phase: number): string {
  return phase % 2 === 0 ? 'Fire Phase' : 'Shock Phase';
}

// Calculate reinforcement rate
export function calculateReinforcement(
  maxStrength: number,
  reinforceSpeed: number
): number {
  return maxStrength * (reinforceSpeed / 100) / 12;
}

export default {
  COMBAT_MODIFIERS,
  TERRAIN_COMBAT,
  COMBAT_WIDTH_BY_TECH,
  getTerrainCombat,
  calculateCombatWidth,
  calculateUnitDamage,
  calculateMoraleDamage,
  calculateBattleWarScore,
  calculateBattlePrestige,
  willRetreat,
  calculateFlankingBonus,
  calculateSiegeProgress,
  calculateAttrition,
  getPhaseName,
  calculateReinforcement
};
