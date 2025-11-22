// Buildings system

export interface Building {
  id: string;
  name: string;
  icon: string;
  category: BuildingCategory;
  description: string;
  cost: number;
  time: number; // months
  maintenance: number;
  effects: BuildingEffect[];
  requirements: BuildingRequirement[];
  unique: boolean;
  upgradeTo?: string;
}

export type BuildingCategory = 'government' | 'military' | 'economic' | 'religious' | 'cultural';

export interface BuildingEffect {
  type: string;
  value: number;
  description: string;
}

export interface BuildingRequirement {
  type: 'tech' | 'development' | 'terrain' | 'coastal' | 'capital';
  value: string | number | boolean;
}

// Default buildings
export const BUILDINGS: Building[] = [
  // Government
  {
    id: 'courthouse',
    name: 'Courthouse',
    icon: '⚖️',
    category: 'government',
    description: 'Reduces local autonomy and unrest',
    cost: 100,
    time: 12,
    maintenance: 1,
    effects: [
      { type: 'local_autonomy', value: -0.1, description: '-0.1 Monthly autonomy' },
      { type: 'local_unrest', value: -2, description: '-2 Local unrest' }
    ],
    requirements: [
      { type: 'tech', value: 8 }
    ],
    unique: false,
    upgradeTo: 'town_hall'
  },
  {
    id: 'town_hall',
    name: 'Town Hall',
    icon: '🏛️',
    category: 'government',
    description: 'Advanced administration center',
    cost: 200,
    time: 18,
    maintenance: 2,
    effects: [
      { type: 'local_autonomy', value: -0.2, description: '-0.2 Monthly autonomy' },
      { type: 'local_tax', value: 25, description: '+25% Local tax' }
    ],
    requirements: [
      { type: 'tech', value: 16 }
    ],
    unique: false
  },
  {
    id: 'university',
    name: 'University',
    icon: '🎓',
    category: 'government',
    description: 'Center of learning and innovation',
    cost: 300,
    time: 24,
    maintenance: 4,
    effects: [
      { type: 'local_development_cost', value: -20, description: '-20% Development cost' },
      { type: 'local_institution_spread', value: 25, description: '+25% Institution spread' }
    ],
    requirements: [
      { type: 'tech', value: 17 },
      { type: 'development', value: 20 }
    ],
    unique: true
  },

  // Military
  {
    id: 'barracks',
    name: 'Barracks',
    icon: '🏠',
    category: 'military',
    description: 'Trains local soldiers',
    cost: 100,
    time: 12,
    maintenance: 1,
    effects: [
      { type: 'local_manpower', value: 500, description: '+500 Local manpower' },
      { type: 'local_regiment_cost', value: -10, description: '-10% Regiment cost' }
    ],
    requirements: [
      { type: 'tech', value: 4 }
    ],
    unique: false,
    upgradeTo: 'training_fields'
  },
  {
    id: 'training_fields',
    name: 'Training Fields',
    icon: '⚔️',
    category: 'military',
    description: 'Advanced military training',
    cost: 200,
    time: 18,
    maintenance: 2,
    effects: [
      { type: 'local_manpower', value: 1000, description: '+1000 Local manpower' },
      { type: 'supply_limit', value: 2, description: '+2 Supply limit' }
    ],
    requirements: [
      { type: 'tech', value: 16 }
    ],
    unique: false
  },
  {
    id: 'fort',
    name: 'Fort',
    icon: '🏰',
    category: 'military',
    description: 'Defensive fortification',
    cost: 200,
    time: 24,
    maintenance: 3,
    effects: [
      { type: 'fort_level', value: 2, description: '+2 Fort level' },
      { type: 'garrison_size', value: 1000, description: '+1000 Garrison' }
    ],
    requirements: [
      { type: 'tech', value: 1 }
    ],
    unique: false,
    upgradeTo: 'bastion'
  },
  {
    id: 'shipyard',
    name: 'Shipyard',
    icon: '⚓',
    category: 'military',
    description: 'Builds and repairs ships',
    cost: 100,
    time: 12,
    maintenance: 1,
    effects: [
      { type: 'local_sailors', value: 200, description: '+200 Local sailors' },
      { type: 'local_ship_cost', value: -10, description: '-10% Ship cost' }
    ],
    requirements: [
      { type: 'tech', value: 4 },
      { type: 'coastal', value: true }
    ],
    unique: false,
    upgradeTo: 'grand_shipyard'
  },

  // Economic
  {
    id: 'workshop',
    name: 'Workshop',
    icon: '🔨',
    category: 'economic',
    description: 'Increases production efficiency',
    cost: 100,
    time: 12,
    maintenance: 1,
    effects: [
      { type: 'local_production', value: 50, description: '+50% Local production' }
    ],
    requirements: [
      { type: 'tech', value: 4 }
    ],
    unique: false,
    upgradeTo: 'counting_house'
  },
  {
    id: 'counting_house',
    name: 'Counting House',
    icon: '💰',
    category: 'economic',
    description: 'Advanced economic management',
    cost: 200,
    time: 18,
    maintenance: 2,
    effects: [
      { type: 'local_production', value: 100, description: '+100% Local production' }
    ],
    requirements: [
      { type: 'tech', value: 16 }
    ],
    unique: false
  },
  {
    id: 'marketplace',
    name: 'Marketplace',
    icon: '🏪',
    category: 'economic',
    description: 'Increases trade power',
    cost: 100,
    time: 12,
    maintenance: 1,
    effects: [
      { type: 'local_trade_power', value: 50, description: '+50% Trade power' }
    ],
    requirements: [
      { type: 'tech', value: 4 }
    ],
    unique: false,
    upgradeTo: 'trade_depot'
  },
  {
    id: 'trade_depot',
    name: 'Trade Depot',
    icon: '📦',
    category: 'economic',
    description: 'Major trade hub',
    cost: 200,
    time: 18,
    maintenance: 2,
    effects: [
      { type: 'local_trade_power', value: 100, description: '+100% Trade power' }
    ],
    requirements: [
      { type: 'tech', value: 16 }
    ],
    unique: false
  },
  {
    id: 'manufactory',
    name: 'Manufactory',
    icon: '🏭',
    category: 'economic',
    description: 'Large-scale production facility',
    cost: 500,
    time: 60,
    maintenance: 5,
    effects: [
      { type: 'local_goods_produced', value: 1, description: '+1 Goods produced' }
    ],
    requirements: [
      { type: 'tech', value: 17 }
    ],
    unique: false
  },

  // Religious
  {
    id: 'temple',
    name: 'Temple',
    icon: '🛕',
    category: 'religious',
    description: 'Place of worship',
    cost: 100,
    time: 12,
    maintenance: 1,
    effects: [
      { type: 'local_tax', value: 40, description: '+40% Local tax' }
    ],
    requirements: [
      { type: 'tech', value: 4 }
    ],
    unique: false,
    upgradeTo: 'cathedral'
  },
  {
    id: 'cathedral',
    name: 'Cathedral',
    icon: '⛪',
    category: 'religious',
    description: 'Grand religious structure',
    cost: 300,
    time: 36,
    maintenance: 3,
    effects: [
      { type: 'local_tax', value: 60, description: '+60% Local tax' },
      { type: 'local_missionary_strength', value: 3, description: '+3% Missionary strength' }
    ],
    requirements: [
      { type: 'tech', value: 16 }
    ],
    unique: false
  },

  // Cultural
  {
    id: 'theatre',
    name: 'Theatre',
    icon: '🎭',
    category: 'cultural',
    description: 'Cultural entertainment venue',
    cost: 200,
    time: 18,
    maintenance: 2,
    effects: [
      { type: 'local_unrest', value: -2, description: '-2 Local unrest' },
      { type: 'prestige', value: 0.5, description: '+0.5 Yearly prestige' }
    ],
    requirements: [
      { type: 'tech', value: 12 }
    ],
    unique: true
  }
];

// Get buildings by category
export function getBuildingsByCategory(category: BuildingCategory): Building[] {
  return BUILDINGS.filter(b => b.category === category);
}

// Check if building can be constructed
export function canConstruct(
  building: Building,
  techLevel: number,
  provinceDev: number,
  isCoastal: boolean,
  isCapital: boolean,
  existingBuildings: string[]
): { canBuild: boolean; reason?: string } {
  // Check if already built
  if (existingBuildings.includes(building.id)) {
    return { canBuild: false, reason: 'Already constructed' };
  }

  // Check if unique and exists elsewhere (would need global check)
  // Check requirements
  for (const req of building.requirements) {
    switch (req.type) {
      case 'tech':
        if (techLevel < (req.value as number)) {
          return { canBuild: false, reason: `Requires tech ${req.value}` };
        }
        break;
      case 'development':
        if (provinceDev < (req.value as number)) {
          return { canBuild: false, reason: `Requires ${req.value} development` };
        }
        break;
      case 'coastal':
        if (req.value === true && !isCoastal) {
          return { canBuild: false, reason: 'Must be coastal' };
        }
        break;
      case 'capital':
        if (req.value === true && !isCapital) {
          return { canBuild: false, reason: 'Must be capital' };
        }
        break;
    }
  }

  return { canBuild: true };
}

// Calculate total building effects
export function calculateBuildingEffects(
  buildingIds: string[]
): Record<string, number> {
  const effects: Record<string, number> = {};

  for (const buildingId of buildingIds) {
    const building = BUILDINGS.find(b => b.id === buildingId);
    if (!building) continue;

    for (const effect of building.effects) {
      effects[effect.type] = (effects[effect.type] || 0) + effect.value;
    }
  }

  return effects;
}

export default {
  BUILDINGS,
  getBuildingsByCategory,
  canConstruct,
  calculateBuildingEffects
};
