// Province development and growth system

export interface DevelopmentType {
  id: string;
  name: string;
  icon: string;
  color: string;
  pointType: PointType;
  effects: DevelopmentEffect[];
  description: string;
}

export type PointType = 'admin' | 'diplomatic' | 'military';

export interface DevelopmentEffect {
  type: string;
  valuePerLevel: number;
}

export interface DevelopmentCost {
  base: number;
  perLevel: number;
  terrainMod: number;
  climateMod: number;
  institutuionPenalty: number;
}

export interface ProvinceGrowth {
  provinceId: string;
  baseGrowth: number;
  modifiers: GrowthModifier[];
  totalGrowth: number;
}

export interface GrowthModifier {
  source: string;
  value: number;
}

// Development types
export const DEVELOPMENT_TYPES: DevelopmentType[] = [
  {
    id: 'tax',
    name: 'Base Tax',
    icon: '💰',
    color: 'yellow',
    pointType: 'admin',
    effects: [
      { type: 'tax_income', valuePerLevel: 0.25 },
      { type: 'manpower', valuePerLevel: 125 }
    ],
    description: 'Increase tax income and administrative capacity.'
  },
  {
    id: 'production',
    name: 'Production',
    icon: '⚙️',
    color: 'blue',
    pointType: 'diplomatic',
    effects: [
      { type: 'production_income', valuePerLevel: 0.2 },
      { type: 'trade_value', valuePerLevel: 0.1 },
      { type: 'sailors', valuePerLevel: 50 }
    ],
    description: 'Increase production output and trade value.'
  },
  {
    id: 'manpower',
    name: 'Manpower',
    icon: '⚔️',
    color: 'red',
    pointType: 'military',
    effects: [
      { type: 'manpower', valuePerLevel: 250 },
      { type: 'garrison_size', valuePerLevel: 100 },
      { type: 'forcelimit', valuePerLevel: 0.1 }
    ],
    description: 'Increase manpower and military capacity.'
  }
];

// Development cost factors
export const DEVELOPMENT_COSTS: DevelopmentCost = {
  base: 50,
  perLevel: 3,
  terrainMod: 0,
  climateMod: 0,
  institutuionPenalty: 0
};

// Terrain modifiers for development cost
export const TERRAIN_DEV_MODIFIERS: Record<string, number> = {
  farmlands: -5,
  grasslands: 0,
  forest: 5,
  hills: 10,
  mountains: 15,
  jungle: 15,
  marsh: 15,
  desert: 10,
  arctic: 20,
  steppe: 5,
  drylands: 5,
  coastal_desert: 10
};

// Climate modifiers
export const CLIMATE_DEV_MODIFIERS: Record<string, number> = {
  temperate: 0,
  tropical: 5,
  arid: 10,
  arctic: 15
};

// Get development type by id
export function getDevelopmentType(id: string): DevelopmentType | undefined {
  return DEVELOPMENT_TYPES.find(t => t.id === id);
}

// Calculate development cost
export function calculateDevelopmentCost(
  currentLevel: number,
  terrain: string,
  climate: string,
  institutionPenalty: number,
  modifiers: number = 0
): number {
  let cost = DEVELOPMENT_COSTS.base;
  cost += DEVELOPMENT_COSTS.perLevel * currentLevel;
  cost *= (1 + (TERRAIN_DEV_MODIFIERS[terrain] || 0) / 100);
  cost *= (1 + (CLIMATE_DEV_MODIFIERS[climate] || 0) / 100);
  cost *= (1 + institutionPenalty / 100);
  cost *= (1 + modifiers / 100);

  return Math.ceil(cost);
}

// Calculate total development
export function calculateTotalDevelopment(
  tax: number,
  production: number,
  manpower: number
): number {
  return tax + production + manpower;
}

// Get development effects
export function getDevelopmentEffects(
  type: DevelopmentType,
  level: number
): Record<string, number> {
  const effects: Record<string, number> = {};
  for (const effect of type.effects) {
    effects[effect.type] = effect.valuePerLevel * level;
  }
  return effects;
}

// Calculate province value (for warscore, AE, etc)
export function calculateProvinceValue(
  totalDevelopment: number,
  hasCenter: boolean,
  hasCapital: boolean
): number {
  let value = totalDevelopment;
  if (hasCenter) value *= 1.5;
  if (hasCapital) value *= 2;
  return Math.floor(value);
}

// Calculate growth rate
export function calculateGrowthRate(
  prosperity: number,
  devastation: number,
  modifiers: GrowthModifier[]
): number {
  let growth = prosperity * 0.01;
  growth -= devastation * 0.01;

  for (const mod of modifiers) {
    growth += mod.value;
  }

  return Math.max(-1, Math.min(1, growth));
}

// Check if province can be developed
export function canDevelop(
  pointsAvailable: number,
  cost: number,
  devastation: number
): boolean {
  if (pointsAvailable < cost) return false;
  if (devastation > 0) return false;
  return true;
}

// Get development efficiency
export function getDevelopmentEfficiency(
  autonomy: number,
  stateMaintenance: boolean
): number {
  let efficiency = 100 - autonomy;
  if (!stateMaintenance) efficiency -= 25;
  return Math.max(0, efficiency);
}

// Calculate concentrate development
export function calculateConcentrateDevelopment(
  sourceDev: number,
  distance: number,
  sameContinent: boolean
): number {
  let transfer = sourceDev * 0.5;
  if (!sameContinent) transfer *= 0.5;
  transfer *= Math.max(0.25, 1 - distance * 0.01);
  return Math.floor(transfer);
}

// Get color for development level
export function getDevelopmentColor(totalDev: number): string {
  if (totalDev >= 30) return 'text-purple-400';
  if (totalDev >= 20) return 'text-blue-400';
  if (totalDev >= 15) return 'text-green-400';
  if (totalDev >= 10) return 'text-yellow-400';
  if (totalDev >= 5) return 'text-orange-400';
  return 'text-stone-400';
}

// Calculate exploitation bonus
export function calculateExploitBonus(
  development: number,
  exploitType: 'tax' | 'manpower'
): number {
  if (exploitType === 'tax') {
    return development * 60; // Gold
  } else {
    return development * 500; // Manpower
  }
}

export default {
  DEVELOPMENT_TYPES,
  DEVELOPMENT_COSTS,
  TERRAIN_DEV_MODIFIERS,
  CLIMATE_DEV_MODIFIERS,
  getDevelopmentType,
  calculateDevelopmentCost,
  calculateTotalDevelopment,
  getDevelopmentEffects,
  calculateProvinceValue,
  calculateGrowthRate,
  canDevelop,
  getDevelopmentEfficiency,
  calculateConcentrateDevelopment,
  getDevelopmentColor,
  calculateExploitBonus
};
