// Army template system for organizing military units

export interface UnitType {
  id: string;
  name: string;
  icon: string;
  category: 'infantry' | 'cavalry' | 'artillery' | 'special';
  manpowerCost: number;
  goldCost: number;
  maintenanceCost: number;
  attack: number;
  defense: number;
  morale: number;
  speed: number;
  requirements: UnitRequirement[];
}

export interface UnitRequirement {
  type: 'tech' | 'building' | 'resource' | 'reform';
  value: string | number;
}

export interface ArmyTemplate {
  id: string;
  name: string;
  icon: string;
  units: TemplateUnit[];
  totalManpower: number;
  totalCost: number;
  totalMaintenance: number;
}

export interface TemplateUnit {
  unitTypeId: string;
  count: number;
}

// Default unit types
export const UNIT_TYPES: UnitType[] = [
  // Infantry
  {
    id: 'militia',
    name: 'Militia',
    icon: '🗡️',
    category: 'infantry',
    manpowerCost: 500,
    goldCost: 10,
    maintenanceCost: 0.5,
    attack: 6,
    defense: 6,
    morale: 2,
    speed: 1,
    requirements: []
  },
  {
    id: 'infantry',
    name: 'Infantry',
    icon: '⚔️',
    category: 'infantry',
    manpowerCost: 1000,
    goldCost: 25,
    maintenanceCost: 1,
    attack: 10,
    defense: 10,
    morale: 3,
    speed: 1,
    requirements: []
  },
  {
    id: 'pikemen',
    name: 'Pikemen',
    icon: '🔱',
    category: 'infantry',
    manpowerCost: 1000,
    goldCost: 30,
    maintenanceCost: 1.2,
    attack: 8,
    defense: 14,
    morale: 3,
    speed: 1,
    requirements: [
      { type: 'tech', value: 5 }
    ]
  },
  {
    id: 'musketeers',
    name: 'Musketeers',
    icon: '🔫',
    category: 'infantry',
    manpowerCost: 1000,
    goldCost: 50,
    maintenanceCost: 2,
    attack: 16,
    defense: 8,
    morale: 4,
    speed: 1,
    requirements: [
      { type: 'tech', value: 12 }
    ]
  },
  {
    id: 'line_infantry',
    name: 'Line Infantry',
    icon: '🎖️',
    category: 'infantry',
    manpowerCost: 1000,
    goldCost: 75,
    maintenanceCost: 3,
    attack: 20,
    defense: 12,
    morale: 5,
    speed: 1,
    requirements: [
      { type: 'tech', value: 20 }
    ]
  },

  // Cavalry
  {
    id: 'light_cavalry',
    name: 'Light Cavalry',
    icon: '🐎',
    category: 'cavalry',
    manpowerCost: 1000,
    goldCost: 40,
    maintenanceCost: 2,
    attack: 12,
    defense: 6,
    morale: 4,
    speed: 3,
    requirements: []
  },
  {
    id: 'heavy_cavalry',
    name: 'Heavy Cavalry',
    icon: '🏇',
    category: 'cavalry',
    manpowerCost: 1000,
    goldCost: 60,
    maintenanceCost: 3,
    attack: 18,
    defense: 10,
    morale: 5,
    speed: 2,
    requirements: [
      { type: 'tech', value: 8 }
    ]
  },
  {
    id: 'hussars',
    name: 'Hussars',
    icon: '⚡',
    category: 'cavalry',
    manpowerCost: 1000,
    goldCost: 80,
    maintenanceCost: 4,
    attack: 20,
    defense: 8,
    morale: 6,
    speed: 4,
    requirements: [
      { type: 'tech', value: 15 }
    ]
  },
  {
    id: 'cuirassiers',
    name: 'Cuirassiers',
    icon: '🛡️',
    category: 'cavalry',
    manpowerCost: 1000,
    goldCost: 100,
    maintenanceCost: 5,
    attack: 22,
    defense: 14,
    morale: 6,
    speed: 2,
    requirements: [
      { type: 'tech', value: 18 }
    ]
  },

  // Artillery
  {
    id: 'cannon',
    name: 'Cannon',
    icon: '💥',
    category: 'artillery',
    manpowerCost: 500,
    goldCost: 100,
    maintenanceCost: 4,
    attack: 20,
    defense: 2,
    morale: 2,
    speed: 0.5,
    requirements: [
      { type: 'tech', value: 10 }
    ]
  },
  {
    id: 'field_artillery',
    name: 'Field Artillery',
    icon: '🎯',
    category: 'artillery',
    manpowerCost: 500,
    goldCost: 150,
    maintenanceCost: 6,
    attack: 30,
    defense: 4,
    morale: 3,
    speed: 0.5,
    requirements: [
      { type: 'tech', value: 16 }
    ]
  },
  {
    id: 'heavy_artillery',
    name: 'Heavy Artillery',
    icon: '🔥',
    category: 'artillery',
    manpowerCost: 500,
    goldCost: 200,
    maintenanceCost: 8,
    attack: 40,
    defense: 2,
    morale: 3,
    speed: 0.3,
    requirements: [
      { type: 'tech', value: 22 }
    ]
  },

  // Special units
  {
    id: 'engineers',
    name: 'Engineers',
    icon: '🔧',
    category: 'special',
    manpowerCost: 500,
    goldCost: 80,
    maintenanceCost: 3,
    attack: 4,
    defense: 8,
    morale: 3,
    speed: 1,
    requirements: [
      { type: 'tech', value: 12 }
    ]
  },
  {
    id: 'elite_guard',
    name: 'Elite Guard',
    icon: '👑',
    category: 'special',
    manpowerCost: 1000,
    goldCost: 150,
    maintenanceCost: 6,
    attack: 25,
    defense: 20,
    morale: 8,
    speed: 1,
    requirements: [
      { type: 'tech', value: 20 },
      { type: 'building', value: 'barracks' }
    ]
  }
];

// Default army templates
export const DEFAULT_TEMPLATES: ArmyTemplate[] = [
  {
    id: 'basic_army',
    name: 'Basic Army',
    icon: '⚔️',
    units: [
      { unitTypeId: 'infantry', count: 8 },
      { unitTypeId: 'light_cavalry', count: 2 }
    ],
    totalManpower: 10000,
    totalCost: 280,
    totalMaintenance: 12
  },
  {
    id: 'defensive_force',
    name: 'Defensive Force',
    icon: '🛡️',
    units: [
      { unitTypeId: 'pikemen', count: 6 },
      { unitTypeId: 'infantry', count: 4 }
    ],
    totalManpower: 10000,
    totalCost: 280,
    totalMaintenance: 11.2
  },
  {
    id: 'shock_army',
    name: 'Shock Army',
    icon: '⚡',
    units: [
      { unitTypeId: 'infantry', count: 4 },
      { unitTypeId: 'heavy_cavalry', count: 4 },
      { unitTypeId: 'cannon', count: 2 }
    ],
    totalManpower: 9000,
    totalCost: 540,
    totalMaintenance: 24
  },
  {
    id: 'siege_force',
    name: 'Siege Force',
    icon: '🏰',
    units: [
      { unitTypeId: 'infantry', count: 6 },
      { unitTypeId: 'cannon', count: 4 }
    ],
    totalManpower: 8000,
    totalCost: 550,
    totalMaintenance: 22
  },
  {
    id: 'cavalry_corps',
    name: 'Cavalry Corps',
    icon: '🐎',
    units: [
      { unitTypeId: 'light_cavalry', count: 4 },
      { unitTypeId: 'heavy_cavalry', count: 4 },
      { unitTypeId: 'hussars', count: 2 }
    ],
    totalManpower: 10000,
    totalCost: 560,
    totalMaintenance: 28
  }
];

// Calculate template totals
export function calculateTemplateTotals(units: TemplateUnit[]): {
  manpower: number;
  cost: number;
  maintenance: number;
  attack: number;
  defense: number;
} {
  let manpower = 0;
  let cost = 0;
  let maintenance = 0;
  let attack = 0;
  let defense = 0;

  for (const unit of units) {
    const unitType = UNIT_TYPES.find(u => u.id === unit.unitTypeId);
    if (!unitType) continue;

    manpower += unitType.manpowerCost * unit.count;
    cost += unitType.goldCost * unit.count;
    maintenance += unitType.maintenanceCost * unit.count;
    attack += unitType.attack * unit.count;
    defense += unitType.defense * unit.count;
  }

  return { manpower, cost, maintenance, attack, defense };
}

// Check if unit type is available
export function isUnitAvailable(
  unitType: UnitType,
  techLevel: number,
  buildings: string[],
  resources: string[]
): boolean {
  for (const req of unitType.requirements) {
    switch (req.type) {
      case 'tech':
        if (techLevel < (req.value as number)) return false;
        break;
      case 'building':
        if (!buildings.includes(req.value as string)) return false;
        break;
      case 'resource':
        if (!resources.includes(req.value as string)) return false;
        break;
    }
  }
  return true;
}

// Get units by category
export function getUnitsByCategory(category: UnitType['category']): UnitType[] {
  return UNIT_TYPES.filter(u => u.category === category);
}

export default {
  UNIT_TYPES,
  DEFAULT_TEMPLATES,
  calculateTemplateTotals,
  isUnitAvailable,
  getUnitsByCategory
};
