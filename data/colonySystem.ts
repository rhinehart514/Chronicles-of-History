// Colonial expansion system

import { NationStats } from '../types';
import { Resources } from '../services/resourceService';

export interface Colony {
  id: string;
  name: string;
  region: ColonyRegion;
  established: number;
  development: number; // 0-100
  population: number;
  loyalty: number; // 0-100
  resources: Partial<Resources>;
  garrison: number;
  unrest: number;
}

export type ColonyRegion =
  | 'americas_north'
  | 'americas_south'
  | 'caribbean'
  | 'africa_west'
  | 'africa_south'
  | 'india'
  | 'southeast_asia'
  | 'east_indies'
  | 'pacific';

export interface ColonizationMission {
  id: string;
  name: string;
  region: ColonyRegion;
  cost: number;
  duration: number;
  successRate: number;
  requirements: {
    naval: number;
    military: number;
    treasury: number;
  };
  rewards: {
    resources: Partial<Resources>;
    prestige: number;
    trade: number;
  };
}

// Region data
export const COLONY_REGIONS: Record<ColonyRegion, {
  name: string;
  icon: string;
  distance: number;
  climate: string;
  baseResources: Partial<Resources>;
  nativeResistance: number;
}> = {
  americas_north: {
    name: 'North America',
    icon: '🌲',
    distance: 3,
    climate: 'Temperate',
    baseResources: { food: 20, iron: 10, textiles: 5 },
    nativeResistance: 40
  },
  americas_south: {
    name: 'South America',
    icon: '🌴',
    distance: 4,
    climate: 'Tropical',
    baseResources: { food: 15, luxuries: 10, iron: 15 },
    nativeResistance: 50
  },
  caribbean: {
    name: 'Caribbean',
    icon: '🏝️',
    distance: 3,
    climate: 'Tropical',
    baseResources: { food: 25, luxuries: 15 },
    nativeResistance: 30
  },
  africa_west: {
    name: 'West Africa',
    icon: '🌍',
    distance: 2,
    climate: 'Tropical',
    baseResources: { luxuries: 20, iron: 10 },
    nativeResistance: 60
  },
  africa_south: {
    name: 'Southern Africa',
    icon: '🦁',
    distance: 4,
    climate: 'Varied',
    baseResources: { luxuries: 25, coal: 10 },
    nativeResistance: 55
  },
  india: {
    name: 'India',
    icon: '🐘',
    distance: 4,
    climate: 'Tropical',
    baseResources: { textiles: 30, luxuries: 20, food: 10 },
    nativeResistance: 70
  },
  southeast_asia: {
    name: 'Southeast Asia',
    icon: '🌾',
    distance: 5,
    climate: 'Tropical',
    baseResources: { food: 20, luxuries: 15, textiles: 10 },
    nativeResistance: 50
  },
  east_indies: {
    name: 'East Indies',
    icon: '🌺',
    distance: 5,
    climate: 'Tropical',
    baseResources: { luxuries: 30, food: 15 },
    nativeResistance: 45
  },
  pacific: {
    name: 'Pacific Islands',
    icon: '🏖️',
    distance: 6,
    climate: 'Tropical',
    baseResources: { food: 10, luxuries: 10 },
    nativeResistance: 25
  }
};

// Calculate colony income
export function calculateColonyIncome(colony: Colony): number {
  let income = 0;

  for (const [resource, amount] of Object.entries(colony.resources)) {
    income += amount * (colony.development / 100);
  }

  // Loyalty modifier
  income *= colony.loyalty / 100;

  // Unrest penalty
  income *= 1 - (colony.unrest / 200);

  return Math.round(income);
}

// Calculate colony maintenance cost
export function calculateColonyCost(colony: Colony): number {
  const baseCost = 5;
  const distanceCost = COLONY_REGIONS[colony.region].distance * 2;
  const garrisonCost = colony.garrison * 0.5;

  return Math.round(baseCost + distanceCost + garrisonCost);
}

// Check for rebellion
export function checkRebellion(colony: Colony): boolean {
  if (colony.loyalty >= 50) return false;

  const rebellionChance = (50 - colony.loyalty) + (colony.unrest * 0.5);
  return Math.random() * 100 < rebellionChance;
}

// Update colony each turn
export function processColony(colony: Colony, atWar: boolean): Colony {
  const updated = { ...colony };
  const regionData = COLONY_REGIONS[colony.region];

  // Development growth
  if (updated.loyalty > 50) {
    updated.development = Math.min(100, updated.development + 1);
  }

  // Population growth
  updated.population += Math.floor(updated.population * 0.02);

  // Loyalty changes
  if (updated.garrison >= updated.population * 0.05) {
    updated.loyalty = Math.min(100, updated.loyalty + 1);
  } else {
    updated.loyalty = Math.max(0, updated.loyalty - 2);
  }

  // Unrest from native resistance
  if (updated.garrison < regionData.nativeResistance * 0.1) {
    updated.unrest = Math.min(100, updated.unrest + 5);
  } else {
    updated.unrest = Math.max(0, updated.unrest - 2);
  }

  // War effects
  if (atWar) {
    updated.unrest += 5;
    updated.loyalty -= 2;
  }

  return updated;
}

// Colonial policies
export interface ColonialPolicy {
  id: string;
  name: string;
  description: string;
  effects: {
    loyalty: number;
    development: number;
    unrest: number;
    income: number;
    prestige: number;
  };
}

export const COLONIAL_POLICIES: ColonialPolicy[] = [
  {
    id: 'exploitation',
    name: 'Economic Exploitation',
    description: 'Maximize resource extraction',
    effects: { loyalty: -10, development: -5, unrest: 10, income: 30, prestige: -5 }
  },
  {
    id: 'settlement',
    name: 'Settlement Policy',
    description: 'Encourage colonist migration',
    effects: { loyalty: 10, development: 10, unrest: -5, income: 10, prestige: 5 }
  },
  {
    id: 'integration',
    name: 'Cultural Integration',
    description: 'Assimilate native population',
    effects: { loyalty: 15, development: 5, unrest: -10, income: 5, prestige: 10 }
  },
  {
    id: 'autonomy',
    name: 'Colonial Autonomy',
    description: 'Grant self-governance',
    effects: { loyalty: 20, development: 15, unrest: -15, income: -10, prestige: 5 }
  },
  {
    id: 'martial_law',
    name: 'Martial Law',
    description: 'Military control of colony',
    effects: { loyalty: -15, development: -10, unrest: -20, income: 5, prestige: -10 }
  }
];

// Calculate colonization success chance
export function calculateColonizationSuccess(
  region: ColonyRegion,
  naval: number,
  military: number,
  innovation: number
): number {
  const regionData = COLONY_REGIONS[region];

  let chance = 50;

  // Naval strength (crucial for colonies)
  chance += naval * 5;

  // Military for overcoming resistance
  chance += military * 3;

  // Innovation for logistics
  chance += innovation * 2;

  // Distance penalty
  chance -= regionData.distance * 5;

  // Native resistance
  chance -= regionData.nativeResistance * 0.3;

  return Math.max(10, Math.min(90, chance));
}

// Get total colonial power
export function getColonialPower(colonies: Colony[]): number {
  return colonies.reduce((sum, col) => {
    return sum + (col.development * col.loyalty / 100);
  }, 0);
}

export default {
  COLONY_REGIONS,
  COLONIAL_POLICIES,
  calculateColonyIncome,
  calculateColonyCost,
  checkRebellion,
  processColony,
  calculateColonizationSuccess,
  getColonialPower
};
