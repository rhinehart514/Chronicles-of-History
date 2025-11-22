// Building and improvement system for territories

import { NationStats } from '../types';
import { Resources } from '../services/resourceService';

export interface Building {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: BuildingCategory;
  tier: number;
  cost: number;
  buildTime: number;
  maintenance: number;
  effects: BuildingEffects;
  requirements?: BuildingRequirements;
  upgradeTo?: string;
}

export type BuildingCategory = 'military' | 'economy' | 'culture' | 'government' | 'infrastructure';

export interface BuildingEffects {
  stats?: Partial<NationStats>;
  resources?: Partial<Resources>;
  special?: string[];
  localOnly?: boolean;
}

export interface BuildingRequirements {
  techs?: string[];
  buildings?: string[];
  minYear?: number;
  stats?: Partial<NationStats>;
}

// Building definitions
export const BUILDINGS: Building[] = [
  // Military
  {
    id: 'barracks',
    name: 'Barracks',
    description: 'Train and house soldiers',
    icon: '🏛️',
    category: 'military',
    tier: 1,
    cost: 50,
    buildTime: 2,
    maintenance: 3,
    effects: {
      resources: { manpower: 5 },
      special: ['+Local garrison']
    },
    upgradeTo: 'military_academy'
  },
  {
    id: 'military_academy',
    name: 'Military Academy',
    description: 'Train elite officers',
    icon: '🎖️',
    category: 'military',
    tier: 2,
    cost: 150,
    buildTime: 4,
    maintenance: 8,
    effects: {
      stats: { military: 0.1 },
      resources: { manpower: 10 },
      special: ['+Officer quality']
    },
    requirements: { buildings: ['barracks'], techs: ['military_staff'] },
    upgradeTo: 'war_college'
  },
  {
    id: 'war_college',
    name: 'War College',
    description: 'Premier military training institution',
    icon: '⚔️',
    category: 'military',
    tier: 3,
    cost: 300,
    buildTime: 6,
    maintenance: 15,
    effects: {
      stats: { military: 0.2 },
      resources: { manpower: 15 },
      special: ['+Elite units', '+Battle tactics']
    },
    requirements: { buildings: ['military_academy'], minYear: 1800 }
  },
  {
    id: 'fortress',
    name: 'Fortress',
    description: 'Defensive fortification',
    icon: '🏰',
    category: 'military',
    tier: 2,
    cost: 200,
    buildTime: 5,
    maintenance: 10,
    effects: {
      special: ['+50% Defense', '+Attrition to attackers']
    }
  },
  {
    id: 'naval_base',
    name: 'Naval Base',
    description: 'Build and maintain warships',
    icon: '⚓',
    category: 'military',
    tier: 2,
    cost: 180,
    buildTime: 4,
    maintenance: 12,
    effects: {
      stats: { military: 0.1 },
      special: ['+Ship building', '+Naval range']
    },
    requirements: { techs: ['naval_power'] }
  },

  // Economy
  {
    id: 'marketplace',
    name: 'Marketplace',
    description: 'Local trade center',
    icon: '🏪',
    category: 'economy',
    tier: 1,
    cost: 40,
    buildTime: 2,
    maintenance: 2,
    effects: {
      resources: { treasury: 5 },
      special: ['+Local trade']
    },
    upgradeTo: 'trade_post'
  },
  {
    id: 'trade_post',
    name: 'Trade Post',
    description: 'Regional commerce hub',
    icon: '🏛️',
    category: 'economy',
    tier: 2,
    cost: 100,
    buildTime: 3,
    maintenance: 5,
    effects: {
      stats: { economy: 0.1 },
      resources: { treasury: 12 },
      special: ['+Trade range']
    },
    requirements: { buildings: ['marketplace'] },
    upgradeTo: 'stock_exchange'
  },
  {
    id: 'stock_exchange',
    name: 'Stock Exchange',
    description: 'Financial market center',
    icon: '📈',
    category: 'economy',
    tier: 3,
    cost: 250,
    buildTime: 5,
    maintenance: 12,
    effects: {
      stats: { economy: 0.2 },
      resources: { treasury: 25 },
      special: ['+Investment returns']
    },
    requirements: { buildings: ['trade_post'], techs: ['banking'] }
  },
  {
    id: 'workshop',
    name: 'Workshop',
    description: 'Artisan production',
    icon: '🔨',
    category: 'economy',
    tier: 1,
    cost: 60,
    buildTime: 2,
    maintenance: 3,
    effects: {
      resources: { textiles: 5, iron: 3 }
    },
    upgradeTo: 'manufactory'
  },
  {
    id: 'manufactory',
    name: 'Manufactory',
    description: 'Large-scale production facility',
    icon: '🏭',
    category: 'economy',
    tier: 2,
    cost: 150,
    buildTime: 4,
    maintenance: 8,
    effects: {
      stats: { economy: 0.1 },
      resources: { textiles: 12, iron: 8 }
    },
    requirements: { buildings: ['workshop'], techs: ['steam_power'] }
  },
  {
    id: 'farm',
    name: 'Farm',
    description: 'Agricultural production',
    icon: '🌾',
    category: 'economy',
    tier: 1,
    cost: 30,
    buildTime: 2,
    maintenance: 1,
    effects: {
      resources: { food: 10 }
    }
  },
  {
    id: 'mine',
    name: 'Mine',
    description: 'Extract minerals',
    icon: '⛏️',
    category: 'economy',
    tier: 1,
    cost: 80,
    buildTime: 3,
    maintenance: 4,
    effects: {
      resources: { iron: 8, coal: 5 }
    }
  },

  // Culture
  {
    id: 'temple',
    name: 'Temple',
    description: 'Place of worship',
    icon: '⛪',
    category: 'culture',
    tier: 1,
    cost: 50,
    buildTime: 3,
    maintenance: 2,
    effects: {
      stats: { stability: 0.1 },
      special: ['+Religious unity']
    },
    upgradeTo: 'cathedral'
  },
  {
    id: 'cathedral',
    name: 'Cathedral',
    description: 'Grand religious monument',
    icon: '🏛️',
    category: 'culture',
    tier: 2,
    cost: 200,
    buildTime: 6,
    maintenance: 8,
    effects: {
      stats: { stability: 0.2, prestige: 0.1 },
      special: ['+Pilgrimage site']
    },
    requirements: { buildings: ['temple'] }
  },
  {
    id: 'university',
    name: 'University',
    description: 'Center of learning',
    icon: '🎓',
    category: 'culture',
    tier: 2,
    cost: 150,
    buildTime: 4,
    maintenance: 10,
    effects: {
      stats: { innovation: 0.2 },
      special: ['+Research speed', '+Attract scholars']
    },
    requirements: { techs: ['academies'] }
  },
  {
    id: 'theater',
    name: 'Theater',
    description: 'Performance venue',
    icon: '🎭',
    category: 'culture',
    tier: 1,
    cost: 80,
    buildTime: 3,
    maintenance: 4,
    effects: {
      stats: { prestige: 0.1 },
      special: ['+Cultural output']
    }
  },

  // Government
  {
    id: 'courthouse',
    name: 'Courthouse',
    description: 'Administer justice',
    icon: '⚖️',
    category: 'government',
    tier: 1,
    cost: 60,
    buildTime: 3,
    maintenance: 4,
    effects: {
      stats: { stability: 0.1 },
      special: ['-Local unrest', '+Law enforcement']
    }
  },
  {
    id: 'tax_office',
    name: 'Tax Office',
    description: 'Efficient tax collection',
    icon: '💼',
    category: 'government',
    tier: 1,
    cost: 70,
    buildTime: 2,
    maintenance: 3,
    effects: {
      resources: { treasury: 8 },
      special: ['+Tax efficiency']
    },
    requirements: { techs: ['bureaucracy'] }
  },

  // Infrastructure
  {
    id: 'roads',
    name: 'Roads',
    description: 'Improved transportation',
    icon: '🛤️',
    category: 'infrastructure',
    tier: 1,
    cost: 40,
    buildTime: 2,
    maintenance: 2,
    effects: {
      special: ['+Movement speed', '+Trade flow']
    },
    upgradeTo: 'railway'
  },
  {
    id: 'railway',
    name: 'Railway Station',
    description: 'Rail network connection',
    icon: '🚂',
    category: 'infrastructure',
    tier: 2,
    cost: 200,
    buildTime: 4,
    maintenance: 10,
    effects: {
      stats: { economy: 0.1 },
      special: ['+Rapid transport', '+Supply lines']
    },
    requirements: { buildings: ['roads'], techs: ['railways'] }
  },
  {
    id: 'port',
    name: 'Port',
    description: 'Maritime trade hub',
    icon: '🚢',
    category: 'infrastructure',
    tier: 1,
    cost: 100,
    buildTime: 3,
    maintenance: 5,
    effects: {
      resources: { treasury: 10 },
      special: ['+Naval access', '+Sea trade']
    }
  }
];

// Get buildings by category
export function getBuildingsByCategory(category: BuildingCategory): Building[] {
  return BUILDINGS.filter(b => b.category === category);
}

// Check if building can be constructed
export function canBuild(
  building: Building,
  existingBuildings: string[],
  researchedTechs: string[],
  treasury: number,
  year: number,
  stats: NationStats
): { canBuild: boolean; reason?: string } {
  if (treasury < building.cost) {
    return { canBuild: false, reason: `Need ${building.cost} gold` };
  }

  if (building.requirements) {
    if (building.requirements.buildings) {
      const missing = building.requirements.buildings.filter(b => !existingBuildings.includes(b));
      if (missing.length > 0) {
        return { canBuild: false, reason: `Requires: ${missing.join(', ')}` };
      }
    }

    if (building.requirements.techs) {
      const missing = building.requirements.techs.filter(t => !researchedTechs.includes(t));
      if (missing.length > 0) {
        return { canBuild: false, reason: `Missing tech: ${missing.join(', ')}` };
      }
    }

    if (building.requirements.minYear && year < building.requirements.minYear) {
      return { canBuild: false, reason: `Available from ${building.requirements.minYear}` };
    }

    if (building.requirements.stats) {
      for (const [stat, min] of Object.entries(building.requirements.stats)) {
        if (stats[stat as keyof NationStats] < min) {
          return { canBuild: false, reason: `Need ${min} ${stat}` };
        }
      }
    }
  }

  return { canBuild: true };
}

// Calculate total building effects
export function calculateBuildingEffects(buildingIds: string[]): {
  stats: Partial<NationStats>;
  resources: Partial<Resources>;
} {
  const stats: Partial<NationStats> = {};
  const resources: Partial<Resources> = {};

  for (const id of buildingIds) {
    const building = BUILDINGS.find(b => b.id === id);
    if (!building) continue;

    if (building.effects.stats) {
      for (const [stat, value] of Object.entries(building.effects.stats)) {
        const key = stat as keyof NationStats;
        stats[key] = (stats[key] || 0) + value;
      }
    }

    if (building.effects.resources) {
      for (const [res, value] of Object.entries(building.effects.resources)) {
        const key = res as keyof Resources;
        resources[key] = (resources[key] || 0) + value;
      }
    }
  }

  return { stats, resources };
}

// Get total maintenance cost
export function getTotalMaintenance(buildingIds: string[]): number {
  return buildingIds.reduce((sum, id) => {
    const building = BUILDINGS.find(b => b.id === id);
    return sum + (building?.maintenance || 0);
  }, 0);
}

export default {
  BUILDINGS,
  getBuildingsByCategory,
  canBuild,
  calculateBuildingEffects,
  getTotalMaintenance
};
