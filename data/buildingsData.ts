// Buildings data

export interface Building {
  id: string;
  name: string;
  description: string;
  cost: number;
  buildTime: number; // days
  requirements: {
    tech?: string;
    minDevelopment?: number;
    terrain?: string[];
    coastal?: boolean;
  };
  effects: Record<string, number>;
  category: 'government' | 'production' | 'military' | 'fort' | 'trade';
}

export const buildings: Record<string, Building> = {
  // Government buildings
  temple: {
    id: 'temple',
    name: 'Temple',
    description: 'A place of worship that increases tax income',
    cost: 100,
    buildTime: 365,
    requirements: {},
    effects: { taxIncome: 0.4 },
    category: 'government',
  },
  courthouse: {
    id: 'courthouse',
    name: 'Courthouse',
    description: 'Reduces local autonomy and governing cost',
    cost: 100,
    buildTime: 365,
    requirements: { tech: 'adm_8' },
    effects: { localAutonomy: -0.1, governingCost: -0.25 },
    category: 'government',
  },
  town_hall: {
    id: 'town_hall',
    name: 'Town Hall',
    description: 'Greatly reduces governing cost',
    cost: 200,
    buildTime: 730,
    requirements: { tech: 'adm_12' },
    effects: { governingCost: -0.5 },
    category: 'government',
  },
  university: {
    id: 'university',
    name: 'University',
    description: 'Increases institution spread',
    cost: 300,
    buildTime: 730,
    requirements: { tech: 'adm_17', minDevelopment: 20 },
    effects: { institutionSpread: 0.25, development: 0.2 },
    category: 'government',
  },

  // Production buildings
  workshop: {
    id: 'workshop',
    name: 'Workshop',
    description: 'Increases production income',
    cost: 100,
    buildTime: 365,
    requirements: {},
    effects: { productionIncome: 0.5 },
    category: 'production',
  },
  counting_house: {
    id: 'counting_house',
    name: 'Counting House',
    description: 'Greatly increases production income',
    cost: 400,
    buildTime: 730,
    requirements: { tech: 'adm_24' },
    effects: { productionIncome: 1.0 },
    category: 'production',
  },
  manufactory: {
    id: 'manufactory',
    name: 'Manufactory',
    description: 'Increases trade goods produced',
    cost: 500,
    buildTime: 1825,
    requirements: { tech: 'adm_11' },
    effects: { tradeGoodsProduced: 1.0 },
    category: 'production',
  },

  // Military buildings
  barracks: {
    id: 'barracks',
    name: 'Barracks',
    description: 'Increases local manpower',
    cost: 100,
    buildTime: 365,
    requirements: {},
    effects: { localManpower: 0.5 },
    category: 'military',
  },
  training_fields: {
    id: 'training_fields',
    name: 'Training Fields',
    description: 'Increases army drill gain and regiment recruitment speed',
    cost: 300,
    buildTime: 730,
    requirements: { tech: 'mil_16' },
    effects: { drillGain: 0.5, recruitmentTime: -0.5 },
    category: 'military',
  },
  regimental_camp: {
    id: 'regimental_camp',
    name: 'Regimental Camp',
    description: 'Increases force limit',
    cost: 200,
    buildTime: 365,
    requirements: { tech: 'mil_6' },
    effects: { forceLimit: 1.0 },
    category: 'military',
  },
  conscription_center: {
    id: 'conscription_center',
    name: 'Conscription Center',
    description: 'Greatly increases local manpower',
    cost: 400,
    buildTime: 730,
    requirements: { tech: 'mil_22' },
    effects: { localManpower: 1.0 },
    category: 'military',
  },
  shipyard: {
    id: 'shipyard',
    name: 'Shipyard',
    description: 'Increases naval force limit and ship construction speed',
    cost: 100,
    buildTime: 365,
    requirements: { coastal: true },
    effects: { navalForceLimit: 2.0, shipBuildTime: -0.25 },
    category: 'military',
  },
  grand_shipyard: {
    id: 'grand_shipyard',
    name: 'Grand Shipyard',
    description: 'Greatly increases naval capabilities',
    cost: 300,
    buildTime: 730,
    requirements: { coastal: true, tech: 'dip_16' },
    effects: { navalForceLimit: 4.0, shipBuildTime: -0.5 },
    category: 'military',
  },

  // Forts
  fort_15: {
    id: 'fort_15',
    name: 'Castle',
    description: 'A basic fortification',
    cost: 200,
    buildTime: 730,
    requirements: {},
    effects: { fortLevel: 2.0, garrisonSize: 1000 },
    category: 'fort',
  },
  fort_16: {
    id: 'fort_16',
    name: 'Bastion',
    description: 'An improved fortification with bastions',
    cost: 400,
    buildTime: 730,
    requirements: { tech: 'mil_14' },
    effects: { fortLevel: 4.0, garrisonSize: 2000 },
    category: 'fort',
  },
  fort_17: {
    id: 'fort_17',
    name: 'Star Fort',
    description: 'A modern star-shaped fortification',
    cost: 600,
    buildTime: 730,
    requirements: { tech: 'mil_19' },
    effects: { fortLevel: 6.0, garrisonSize: 3000 },
    category: 'fort',
  },
  fort_18: {
    id: 'fort_18',
    name: 'Fortress',
    description: 'A powerful modern fortress',
    cost: 800,
    buildTime: 730,
    requirements: { tech: 'mil_24' },
    effects: { fortLevel: 8.0, garrisonSize: 4000 },
    category: 'fort',
  },

  // Trade buildings
  marketplace: {
    id: 'marketplace',
    name: 'Marketplace',
    description: 'Increases local trade power',
    cost: 100,
    buildTime: 365,
    requirements: {},
    effects: { tradePower: 0.5 },
    category: 'trade',
  },
  trade_depot: {
    id: 'trade_depot',
    name: 'Trade Depot',
    description: 'Greatly increases local trade power',
    cost: 300,
    buildTime: 730,
    requirements: { tech: 'dip_17' },
    effects: { tradePower: 1.0 },
    category: 'trade',
  },
  stock_exchange: {
    id: 'stock_exchange',
    name: 'Stock Exchange',
    description: 'Maximizes trade power in the province',
    cost: 400,
    buildTime: 730,
    requirements: { tech: 'dip_22' },
    effects: { tradePower: 1.25, tradeValue: 0.5 },
    category: 'trade',
  },
  dock: {
    id: 'dock',
    name: 'Dock',
    description: 'Increases sailors and trade power',
    cost: 100,
    buildTime: 365,
    requirements: { coastal: true },
    effects: { sailors: 0.5, tradePower: 0.25 },
    category: 'trade',
  },
  drydock: {
    id: 'drydock',
    name: 'Drydock',
    description: 'Greatly increases sailors',
    cost: 300,
    buildTime: 730,
    requirements: { coastal: true, tech: 'dip_16' },
    effects: { sailors: 1.0, shipRepairSpeed: 0.25 },
    category: 'trade',
  },
};

export const buildingsList = Object.values(buildings);

export function getBuilding(id: string): Building | undefined {
  return buildings[id];
}

export function getBuildingsByCategory(category: Building['category']): Building[] {
  return buildingsList.filter(b => b.category === category);
}
