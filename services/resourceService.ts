// Resource management system for strategic depth

import { Nation, NationStats } from '../types';

export interface Resources {
  treasury: number;      // Gold/money
  manpower: number;      // Available soldiers
  food: number;          // Sustains population
  iron: number;          // For military
  coal: number;          // For industry
  textiles: number;      // For trade
  luxuries: number;      // For prestige
}

export interface ResourceProduction {
  base: number;
  modifiers: { source: string; amount: number }[];
  total: number;
}

export interface ResourceConsumption {
  military: number;
  court: number;
  population: number;
  total: number;
}

export interface ResourceBalance {
  resource: keyof Resources;
  production: number;
  consumption: number;
  net: number;
  reserves: number;
  turnsUntilDepletion?: number;
}

// Default starting resources
export const DEFAULT_RESOURCES: Resources = {
  treasury: 100,
  manpower: 50,
  food: 100,
  iron: 30,
  coal: 20,
  textiles: 40,
  luxuries: 10
};

// Calculate resource production based on stats and territories
export function calculateProduction(
  nation: Nation,
  territoryCount: number
): Record<keyof Resources, ResourceProduction> {
  const stats = nation.stats;

  return {
    treasury: {
      base: 10,
      modifiers: [
        { source: 'Economy', amount: stats.economy * 5 },
        { source: 'Trade', amount: territoryCount * 2 },
        { source: 'Innovation', amount: Math.floor(stats.innovation * 2) }
      ],
      total: 10 + stats.economy * 5 + territoryCount * 2 + Math.floor(stats.innovation * 2)
    },
    manpower: {
      base: 5,
      modifiers: [
        { source: 'Stability', amount: Math.floor(stats.stability * 2) },
        { source: 'Territories', amount: territoryCount * 3 }
      ],
      total: 5 + Math.floor(stats.stability * 2) + territoryCount * 3
    },
    food: {
      base: 20,
      modifiers: [
        { source: 'Territories', amount: territoryCount * 5 },
        { source: 'Economy', amount: Math.floor(stats.economy * 3) }
      ],
      total: 20 + territoryCount * 5 + Math.floor(stats.economy * 3)
    },
    iron: {
      base: 5,
      modifiers: [
        { source: 'Territories', amount: territoryCount },
        { source: 'Innovation', amount: Math.floor(stats.innovation) }
      ],
      total: 5 + territoryCount + Math.floor(stats.innovation)
    },
    coal: {
      base: 5,
      modifiers: [
        { source: 'Innovation', amount: Math.floor(stats.innovation * 2) },
        { source: 'Territories', amount: territoryCount }
      ],
      total: 5 + Math.floor(stats.innovation * 2) + territoryCount
    },
    textiles: {
      base: 10,
      modifiers: [
        { source: 'Economy', amount: Math.floor(stats.economy * 2) },
        { source: 'Territories', amount: territoryCount }
      ],
      total: 10 + Math.floor(stats.economy * 2) + territoryCount
    },
    luxuries: {
      base: 2,
      modifiers: [
        { source: 'Prestige', amount: Math.floor(stats.prestige) },
        { source: 'Economy', amount: Math.floor(stats.economy) }
      ],
      total: 2 + Math.floor(stats.prestige) + Math.floor(stats.economy)
    }
  };
}

// Calculate resource consumption
export function calculateConsumption(
  nation: Nation,
  armySize: number,
  courtSize: number
): Record<keyof Resources, ResourceConsumption> {
  return {
    treasury: {
      military: armySize * 2,
      court: courtSize * 3,
      population: 5,
      total: armySize * 2 + courtSize * 3 + 5
    },
    manpower: {
      military: Math.floor(armySize * 0.5), // Replacement troops
      court: 0,
      population: 0,
      total: Math.floor(armySize * 0.5)
    },
    food: {
      military: armySize * 2,
      court: courtSize,
      population: 10,
      total: armySize * 2 + courtSize + 10
    },
    iron: {
      military: Math.floor(armySize * 0.3),
      court: 0,
      population: 1,
      total: Math.floor(armySize * 0.3) + 1
    },
    coal: {
      military: Math.floor(armySize * 0.2),
      court: 1,
      population: 2,
      total: Math.floor(armySize * 0.2) + 3
    },
    textiles: {
      military: Math.floor(armySize * 0.1),
      court: courtSize,
      population: 3,
      total: Math.floor(armySize * 0.1) + courtSize + 3
    },
    luxuries: {
      military: 0,
      court: Math.floor(courtSize * 0.5),
      population: 1,
      total: Math.floor(courtSize * 0.5) + 1
    }
  };
}

// Get resource balance
export function getResourceBalance(
  resources: Resources,
  production: Record<keyof Resources, ResourceProduction>,
  consumption: Record<keyof Resources, ResourceConsumption>
): ResourceBalance[] {
  const balances: ResourceBalance[] = [];

  for (const key of Object.keys(resources) as (keyof Resources)[]) {
    const prod = production[key].total;
    const cons = consumption[key].total;
    const net = prod - cons;
    const reserves = resources[key];

    const balance: ResourceBalance = {
      resource: key,
      production: prod,
      consumption: cons,
      net,
      reserves
    };

    if (net < 0 && reserves > 0) {
      balance.turnsUntilDepletion = Math.ceil(reserves / Math.abs(net));
    }

    balances.push(balance);
  }

  return balances;
}

// Apply resource changes for a turn
export function applyTurnResources(
  resources: Resources,
  production: Record<keyof Resources, ResourceProduction>,
  consumption: Record<keyof Resources, ResourceConsumption>
): { newResources: Resources; warnings: string[] } {
  const newResources = { ...resources };
  const warnings: string[] = [];

  for (const key of Object.keys(resources) as (keyof Resources)[]) {
    const net = production[key].total - consumption[key].total;
    newResources[key] = Math.max(0, resources[key] + net);

    if (newResources[key] <= 0 && resources[key] > 0) {
      warnings.push(`${key.charAt(0).toUpperCase() + key.slice(1)} has been depleted!`);
    } else if (newResources[key] < 20 && net < 0) {
      warnings.push(`${key.charAt(0).toUpperCase() + key.slice(1)} reserves are low.`);
    }
  }

  return { newResources, warnings };
}

// Get stat effects from resource shortages
export function getResourceEffects(resources: Resources): Partial<NationStats> {
  const effects: Partial<NationStats> = {};

  // No treasury = economic penalty
  if (resources.treasury <= 0) {
    effects.economy = -1;
    effects.stability = -0.5;
  }

  // No manpower = military penalty
  if (resources.manpower <= 0) {
    effects.military = -1;
  }

  // No food = stability crisis
  if (resources.food <= 0) {
    effects.stability = -2;
    effects.military = -0.5;
  }

  // No iron = military production issues
  if (resources.iron <= 0) {
    effects.military = (effects.military || 0) - 0.5;
  }

  // No coal = innovation slowdown
  if (resources.coal <= 0) {
    effects.innovation = -0.5;
  }

  // No luxuries = prestige loss
  if (resources.luxuries <= 0) {
    effects.prestige = -0.5;
  }

  return effects;
}

// Trade calculation
export function calculateTradeValue(
  resource: keyof Resources,
  amount: number,
  marketPrices?: Partial<Resources>
): number {
  const basePrices: Resources = {
    treasury: 1,
    manpower: 5,
    food: 2,
    iron: 8,
    coal: 6,
    textiles: 4,
    luxuries: 15
  };

  const price = marketPrices?.[resource] ?? basePrices[resource];
  return amount * price;
}

// Resource icons for UI
export const RESOURCE_ICONS: Record<keyof Resources, string> = {
  treasury: '💰',
  manpower: '👥',
  food: '🌾',
  iron: '⚙️',
  coal: '�ite',
  textiles: '🧵',
  luxuries: '💎'
};

// Resource descriptions
export const RESOURCE_DESCRIPTIONS: Record<keyof Resources, string> = {
  treasury: 'Gold for expenses and investments',
  manpower: 'Available population for military and labor',
  food: 'Agricultural output to sustain population',
  iron: 'Metal for weapons and tools',
  coal: 'Fuel for industry and innovation',
  textiles: 'Cloth for trade and uniforms',
  luxuries: 'Fine goods for prestige and diplomacy'
};

export default {
  DEFAULT_RESOURCES,
  calculateProduction,
  calculateConsumption,
  getResourceBalance,
  applyTurnResources,
  getResourceEffects,
  calculateTradeValue,
  RESOURCE_ICONS,
  RESOURCE_DESCRIPTIONS
};
