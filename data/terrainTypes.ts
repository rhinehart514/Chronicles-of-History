// Terrain types and modifiers system

export interface TerrainType {
  id: string;
  name: string;
  icon: string;
  color: string;
  movementCost: number;
  combatWidth: number;
  defenderBonus: number;
  supplyLimit: number;
  development: DevelopmentModifiers;
  description: string;
}

export interface DevelopmentModifiers {
  taxModifier: number;
  productionModifier: number;
  manpowerModifier: number;
  buildCostModifier: number;
}

export interface TerrainCombatModifier {
  terrainId: string;
  infantryModifier: number;
  cavalryModifier: number;
  artilleryModifier: number;
}

// All terrain types
export const TERRAIN_TYPES: TerrainType[] = [
  {
    id: 'grasslands',
    name: 'Grasslands',
    icon: '🌾',
    color: '#90EE90',
    movementCost: 1.0,
    combatWidth: 30,
    defenderBonus: 0,
    supplyLimit: 8,
    development: {
      taxModifier: 0,
      productionModifier: 0,
      manpowerModifier: 0,
      buildCostModifier: 0
    },
    description: 'Flat, fertile land ideal for farming and supporting large populations.'
  },
  {
    id: 'farmlands',
    name: 'Farmlands',
    icon: '🌻',
    color: '#FFD700',
    movementCost: 1.0,
    combatWidth: 30,
    defenderBonus: 0,
    supplyLimit: 10,
    development: {
      taxModifier: 10,
      productionModifier: 10,
      manpowerModifier: 5,
      buildCostModifier: -10
    },
    description: 'Rich agricultural land with excellent growing conditions.'
  },
  {
    id: 'hills',
    name: 'Hills',
    icon: '⛰️',
    color: '#8B4513',
    movementCost: 1.4,
    combatWidth: 25,
    defenderBonus: 1,
    supplyLimit: 6,
    development: {
      taxModifier: -10,
      productionModifier: 0,
      manpowerModifier: -5,
      buildCostModifier: 10
    },
    description: 'Elevated terrain that provides defensive advantages but is harder to develop.'
  },
  {
    id: 'mountains',
    name: 'Mountains',
    icon: '🏔️',
    color: '#696969',
    movementCost: 2.0,
    combatWidth: 20,
    defenderBonus: 2,
    supplyLimit: 4,
    development: {
      taxModifier: -25,
      productionModifier: -10,
      manpowerModifier: -25,
      buildCostModifier: 25
    },
    description: 'Rugged mountain terrain. Very defensible but difficult to traverse and develop.'
  },
  {
    id: 'forest',
    name: 'Forest',
    icon: '🌲',
    color: '#228B22',
    movementCost: 1.5,
    combatWidth: 25,
    defenderBonus: 1,
    supplyLimit: 5,
    development: {
      taxModifier: -5,
      productionModifier: 10,
      manpowerModifier: -10,
      buildCostModifier: 0
    },
    description: 'Dense woodland providing timber and defensive cover.'
  },
  {
    id: 'jungle',
    name: 'Jungle',
    icon: '🌴',
    color: '#006400',
    movementCost: 2.0,
    combatWidth: 20,
    defenderBonus: 1,
    supplyLimit: 3,
    development: {
      taxModifier: -15,
      productionModifier: -5,
      manpowerModifier: -20,
      buildCostModifier: 20
    },
    description: 'Tropical rainforest. Difficult to traverse and develop but rich in resources.'
  },
  {
    id: 'marsh',
    name: 'Marsh',
    icon: '🦆',
    color: '#2F4F4F',
    movementCost: 1.8,
    combatWidth: 22,
    defenderBonus: 1,
    supplyLimit: 4,
    development: {
      taxModifier: -20,
      productionModifier: -10,
      manpowerModifier: -15,
      buildCostModifier: 15
    },
    description: 'Wetland terrain that impedes movement and development.'
  },
  {
    id: 'desert',
    name: 'Desert',
    icon: '🏜️',
    color: '#EDC9AF',
    movementCost: 1.5,
    combatWidth: 28,
    defenderBonus: 0,
    supplyLimit: 3,
    development: {
      taxModifier: -30,
      productionModifier: -20,
      manpowerModifier: -30,
      buildCostModifier: 10
    },
    description: 'Arid wasteland with limited resources and harsh conditions.'
  },
  {
    id: 'steppe',
    name: 'Steppe',
    icon: '🐎',
    color: '#D2B48C',
    movementCost: 1.0,
    combatWidth: 30,
    defenderBonus: 0,
    supplyLimit: 6,
    development: {
      taxModifier: -10,
      productionModifier: -5,
      manpowerModifier: 10,
      buildCostModifier: 0
    },
    description: 'Vast grassland plains ideal for cavalry and nomadic peoples.'
  },
  {
    id: 'tundra',
    name: 'Tundra',
    icon: '❄️',
    color: '#B0E0E6',
    movementCost: 1.3,
    combatWidth: 26,
    defenderBonus: 0,
    supplyLimit: 3,
    development: {
      taxModifier: -25,
      productionModifier: -15,
      manpowerModifier: -20,
      buildCostModifier: 15
    },
    description: 'Frozen northern lands with limited agricultural potential.'
  },
  {
    id: 'coastal',
    name: 'Coastal',
    icon: '🏖️',
    color: '#87CEEB',
    movementCost: 1.0,
    combatWidth: 28,
    defenderBonus: 0,
    supplyLimit: 7,
    development: {
      taxModifier: 5,
      productionModifier: 5,
      manpowerModifier: 0,
      buildCostModifier: -5
    },
    description: 'Coastal regions with access to maritime trade and fishing.'
  },
  {
    id: 'highlands',
    name: 'Highlands',
    icon: '🦌',
    color: '#A0522D',
    movementCost: 1.6,
    combatWidth: 23,
    defenderBonus: 2,
    supplyLimit: 5,
    development: {
      taxModifier: -15,
      productionModifier: -5,
      manpowerModifier: 0,
      buildCostModifier: 15
    },
    description: 'Rugged highland terrain with strong defensive positions.'
  }
];

// Combat modifiers by terrain
export const TERRAIN_COMBAT_MODIFIERS: TerrainCombatModifier[] = [
  { terrainId: 'grasslands', infantryModifier: 0, cavalryModifier: 0, artilleryModifier: 0 },
  { terrainId: 'farmlands', infantryModifier: 0, cavalryModifier: 5, artilleryModifier: 0 },
  { terrainId: 'hills', infantryModifier: 5, cavalryModifier: -10, artilleryModifier: 5 },
  { terrainId: 'mountains', infantryModifier: 10, cavalryModifier: -25, artilleryModifier: -10 },
  { terrainId: 'forest', infantryModifier: 5, cavalryModifier: -20, artilleryModifier: -5 },
  { terrainId: 'jungle', infantryModifier: 5, cavalryModifier: -30, artilleryModifier: -10 },
  { terrainId: 'marsh', infantryModifier: 0, cavalryModifier: -25, artilleryModifier: -5 },
  { terrainId: 'desert', infantryModifier: -5, cavalryModifier: 5, artilleryModifier: 0 },
  { terrainId: 'steppe', infantryModifier: -5, cavalryModifier: 15, artilleryModifier: 0 },
  { terrainId: 'tundra', infantryModifier: 0, cavalryModifier: -5, artilleryModifier: 0 },
  { terrainId: 'coastal', infantryModifier: 0, cavalryModifier: 0, artilleryModifier: 5 },
  { terrainId: 'highlands', infantryModifier: 10, cavalryModifier: -15, artilleryModifier: 0 }
];

// Get terrain by id
export function getTerrainType(id: string): TerrainType | undefined {
  return TERRAIN_TYPES.find(t => t.id === id);
}

// Calculate total movement cost
export function calculateMovementCost(terrainId: string, baseSpeed: number): number {
  const terrain = getTerrainType(terrainId);
  if (!terrain) return baseSpeed;
  return baseSpeed * terrain.movementCost;
}

// Get combat modifier for unit type
export function getCombatModifier(
  terrainId: string,
  unitType: 'infantry' | 'cavalry' | 'artillery'
): number {
  const modifier = TERRAIN_COMBAT_MODIFIERS.find(m => m.terrainId === terrainId);
  if (!modifier) return 0;

  switch (unitType) {
    case 'infantry': return modifier.infantryModifier;
    case 'cavalry': return modifier.cavalryModifier;
    case 'artillery': return modifier.artilleryModifier;
  }
}

// Get terrain supply limit
export function getSupplyLimit(terrainId: string, baseDevelopment: number): number {
  const terrain = getTerrainType(terrainId);
  if (!terrain) return 5;
  return terrain.supplyLimit + Math.floor(baseDevelopment / 5);
}

// Get terrains by supply limit threshold
export function getTerrainsBySupply(minSupply: number): TerrainType[] {
  return TERRAIN_TYPES.filter(t => t.supplyLimit >= minSupply);
}

export default {
  TERRAIN_TYPES,
  TERRAIN_COMBAT_MODIFIERS,
  getTerrainType,
  calculateMovementCost,
  getCombatModifier,
  getSupplyLimit,
  getTerrainsBySupply
};
