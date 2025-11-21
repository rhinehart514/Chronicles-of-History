// Granular Military System - Unit types, logistics, and supply chains
// Detailed army and navy composition with era-appropriate units

import { Nation, NationStats, Era } from '../types';

// Unit categories
export type UnitCategory = 'INFANTRY' | 'CAVALRY' | 'ARTILLERY' | 'NAVAL' | 'AIR' | 'SUPPORT';

// Unit status
export type UnitStatus = 'READY' | 'TRAINING' | 'MOBILIZING' | 'DEPLOYED' | 'COMBAT' | 'RECOVERING';

// Unit definition
export interface MilitaryUnit {
  id: string;
  name: string;
  type: string;
  category: UnitCategory;
  era: Era[];

  // Strength
  manpower: number;
  equipment: number; // Guns, horses, ships, etc.

  // Combat stats
  attack: number;
  defense: number;
  morale: number;
  experience: number;

  // Logistics
  supplyCost: number; // Per turn
  movementSpeed: number;

  // Status
  status: UnitStatus;
  location?: string;
  strength: number; // 0-100% of full strength
}

// Unit templates by era
export interface UnitTemplate {
  type: string;
  name: string;
  category: UnitCategory;
  manpower: number;
  equipment: number;
  attack: number;
  defense: number;
  supplyCost: number;
  movementSpeed: number;
  description: string;
}

// Era-specific unit templates
export const UNIT_TEMPLATES: Record<string, UnitTemplate[]> = {
  ENLIGHTENMENT: [
    // Infantry
    { type: 'line_infantry', name: 'Line Infantry Regiment', category: 'INFANTRY', manpower: 1000, equipment: 1000, attack: 3, defense: 3, supplyCost: 100, movementSpeed: 2, description: 'Standard musket-armed infantry in linear formations' },
    { type: 'light_infantry', name: 'Light Infantry Company', category: 'INFANTRY', manpower: 500, equipment: 500, attack: 3, defense: 2, supplyCost: 80, movementSpeed: 3, description: 'Skirmishers and irregular troops' },
    { type: 'grenadiers', name: 'Grenadier Battalion', category: 'INFANTRY', manpower: 800, equipment: 900, attack: 4, defense: 3, supplyCost: 150, movementSpeed: 2, description: 'Elite assault troops' },
    { type: 'guards', name: 'Royal Guard Regiment', category: 'INFANTRY', manpower: 1200, equipment: 1500, attack: 4, defense: 4, supplyCost: 200, movementSpeed: 2, description: 'Elite household troops' },
    // Cavalry
    { type: 'heavy_cavalry', name: 'Heavy Cavalry Squadron', category: 'CAVALRY', manpower: 500, equipment: 600, attack: 4, defense: 3, supplyCost: 200, movementSpeed: 4, description: 'Armored shock cavalry' },
    { type: 'light_cavalry', name: 'Hussar Regiment', category: 'CAVALRY', manpower: 400, equipment: 500, attack: 3, defense: 2, supplyCost: 150, movementSpeed: 5, description: 'Fast reconnaissance cavalry' },
    { type: 'dragoons', name: 'Dragoon Regiment', category: 'CAVALRY', manpower: 600, equipment: 700, attack: 3, defense: 3, supplyCost: 180, movementSpeed: 4, description: 'Mounted infantry' },
    // Artillery
    { type: 'field_artillery', name: 'Field Artillery Battery', category: 'ARTILLERY', manpower: 200, equipment: 12, attack: 5, defense: 1, supplyCost: 250, movementSpeed: 1, description: '6-12 pound field guns' },
    { type: 'siege_artillery', name: 'Siege Artillery Train', category: 'ARTILLERY', manpower: 300, equipment: 8, attack: 6, defense: 1, supplyCost: 400, movementSpeed: 0.5, description: 'Heavy siege mortars and cannons' },
    // Naval
    { type: 'ship_of_line', name: 'Ship of the Line', category: 'NAVAL', manpower: 800, equipment: 74, attack: 5, defense: 4, supplyCost: 500, movementSpeed: 3, description: '74-gun warship' },
    { type: 'frigate', name: 'Frigate', category: 'NAVAL', manpower: 300, equipment: 32, attack: 3, defense: 3, supplyCost: 250, movementSpeed: 5, description: 'Fast cruiser' },
    { type: 'sloop', name: 'Sloop of War', category: 'NAVAL', manpower: 100, equipment: 18, attack: 2, defense: 2, supplyCost: 100, movementSpeed: 6, description: 'Light patrol vessel' }
  ],
  INDUSTRIAL: [
    // Infantry
    { type: 'rifle_regiment', name: 'Rifle Regiment', category: 'INFANTRY', manpower: 1000, equipment: 1000, attack: 4, defense: 3, supplyCost: 150, movementSpeed: 2, description: 'Rifled musket infantry' },
    { type: 'jaegers', name: 'Jaeger Battalion', category: 'INFANTRY', manpower: 600, equipment: 600, attack: 4, defense: 2, supplyCost: 120, movementSpeed: 3, description: 'Specialized light infantry' },
    // Cavalry
    { type: 'lancers', name: 'Lancer Regiment', category: 'CAVALRY', manpower: 500, equipment: 600, attack: 4, defense: 2, supplyCost: 200, movementSpeed: 5, description: 'Lance-armed cavalry' },
    { type: 'cuirassiers', name: 'Cuirassier Regiment', category: 'CAVALRY', manpower: 500, equipment: 700, attack: 5, defense: 4, supplyCost: 250, movementSpeed: 4, description: 'Heavy armored cavalry' },
    // Artillery
    { type: 'rifled_artillery', name: 'Rifled Artillery Battery', category: 'ARTILLERY', manpower: 200, equipment: 12, attack: 6, defense: 1, supplyCost: 300, movementSpeed: 1.5, description: 'Modern rifled cannon' },
    { type: 'gatling_battery', name: 'Machine Gun Battery', category: 'ARTILLERY', manpower: 100, equipment: 6, attack: 5, defense: 1, supplyCost: 200, movementSpeed: 2, description: 'Gatling guns' },
    // Naval
    { type: 'ironclad', name: 'Ironclad', category: 'NAVAL', manpower: 400, equipment: 20, attack: 6, defense: 6, supplyCost: 600, movementSpeed: 3, description: 'Armored warship' },
    { type: 'cruiser', name: 'Armored Cruiser', category: 'NAVAL', manpower: 500, equipment: 30, attack: 5, defense: 4, supplyCost: 450, movementSpeed: 5, description: 'Fast armored cruiser' }
  ],
  GREAT_WAR: [
    // Infantry
    { type: 'infantry_division', name: 'Infantry Division', category: 'INFANTRY', manpower: 15000, equipment: 15000, attack: 4, defense: 4, supplyCost: 1000, movementSpeed: 1, description: 'Full infantry division with support' },
    { type: 'storm_troops', name: 'Stormtrooper Battalion', category: 'INFANTRY', manpower: 800, equipment: 1000, attack: 5, defense: 2, supplyCost: 200, movementSpeed: 2, description: 'Elite assault infantry' },
    // Artillery
    { type: 'howitzer_battery', name: 'Howitzer Battery', category: 'ARTILLERY', manpower: 200, equipment: 8, attack: 7, defense: 1, supplyCost: 400, movementSpeed: 1, description: 'Heavy howitzers' },
    { type: 'railway_gun', name: 'Railway Gun', category: 'ARTILLERY', manpower: 500, equipment: 1, attack: 9, defense: 1, supplyCost: 800, movementSpeed: 0.5, description: 'Super-heavy railway artillery' },
    // Air
    { type: 'fighter_squadron', name: 'Fighter Squadron', category: 'AIR', manpower: 50, equipment: 12, attack: 4, defense: 2, supplyCost: 300, movementSpeed: 10, description: 'Pursuit aircraft' },
    { type: 'bomber_squadron', name: 'Bomber Squadron', category: 'AIR', manpower: 100, equipment: 8, attack: 5, defense: 1, supplyCost: 400, movementSpeed: 6, description: 'Strategic bombers' },
    // Naval
    { type: 'dreadnought', name: 'Dreadnought', category: 'NAVAL', manpower: 1000, equipment: 12, attack: 8, defense: 7, supplyCost: 1000, movementSpeed: 4, description: 'All-big-gun battleship' },
    { type: 'submarine', name: 'Submarine Flotilla', category: 'NAVAL', manpower: 200, equipment: 6, attack: 5, defense: 2, supplyCost: 300, movementSpeed: 3, description: 'U-boats' }
  ],
  COLD_WAR: [
    // Ground
    { type: 'mechanized_division', name: 'Mechanized Division', category: 'INFANTRY', manpower: 12000, equipment: 500, attack: 6, defense: 5, supplyCost: 2000, movementSpeed: 4, description: 'Motorized infantry with APCs' },
    { type: 'armored_division', name: 'Armored Division', category: 'CAVALRY', manpower: 10000, equipment: 300, attack: 7, defense: 6, supplyCost: 3000, movementSpeed: 5, description: 'Tank division' },
    { type: 'airborne_division', name: 'Airborne Division', category: 'INFANTRY', manpower: 8000, equipment: 200, attack: 5, defense: 3, supplyCost: 1500, movementSpeed: 8, description: 'Paratroops' },
    // Artillery
    { type: 'rocket_artillery', name: 'Rocket Artillery Brigade', category: 'ARTILLERY', manpower: 1000, equipment: 36, attack: 8, defense: 1, supplyCost: 800, movementSpeed: 3, description: 'Multiple rocket launchers' },
    { type: 'nuclear_battery', name: 'Tactical Nuclear Battery', category: 'ARTILLERY', manpower: 500, equipment: 6, attack: 10, defense: 1, supplyCost: 2000, movementSpeed: 2, description: 'Nuclear-capable missiles' },
    // Air
    { type: 'jet_fighter_wing', name: 'Jet Fighter Wing', category: 'AIR', manpower: 500, equipment: 48, attack: 7, defense: 4, supplyCost: 1500, movementSpeed: 15, description: 'Jet interceptors' },
    { type: 'strategic_bomber_wing', name: 'Strategic Bomber Wing', category: 'AIR', manpower: 800, equipment: 24, attack: 9, defense: 2, supplyCost: 2500, movementSpeed: 10, description: 'Nuclear-capable bombers' },
    // Naval
    { type: 'aircraft_carrier', name: 'Aircraft Carrier', category: 'NAVAL', manpower: 5000, equipment: 80, attack: 9, defense: 6, supplyCost: 5000, movementSpeed: 6, description: 'Supercarrier' },
    { type: 'nuclear_submarine', name: 'Nuclear Submarine', category: 'NAVAL', manpower: 150, equipment: 16, attack: 8, defense: 5, supplyCost: 3000, movementSpeed: 8, description: 'Nuclear-powered attack sub' }
  ]
};

// Military structure for a nation
export interface NationalMilitary {
  // Army
  army: {
    totalManpower: number;
    activeUnits: MilitaryUnit[];
    reserves: number;
    conscriptPool: number;
    organization: number; // 0-100
    doctrine: string;
  };

  // Navy
  navy: {
    totalShips: number;
    activeUnits: MilitaryUnit[];
    sailors: number;
    navalBases: number;
    seaControl: number; // 0-100
  };

  // Logistics
  logistics: {
    supplyCapacity: number;
    currentSupply: number;
    supplyLines: number;
    warMateriel: number;
    fuelReserves: number;
  };

  // Command
  command: {
    generals: number;
    admirals: number;
    commandQuality: number; // 1-5
    warExperience: number;
  };

  // Fortifications
  fortifications: {
    forts: number;
    coastalDefenses: number;
    airDefenses: number;
  };

  // Status
  warReadiness: number; // 0-100
  morale: number; // 0-100
  attrition: number; // Monthly losses %
}

// Historical army sizes (thousands of active troops)
export const HISTORICAL_ARMY_SIZES: Record<string, Record<number, number>> = {
  britain: { 1750: 50, 1800: 250, 1850: 140, 1900: 430, 1914: 733, 1918: 4000, 1945: 5000 },
  france: { 1750: 180, 1800: 500, 1812: 680, 1850: 400, 1900: 600, 1914: 800, 1940: 900 },
  prussia: { 1750: 150, 1800: 200, 1850: 130, 1870: 1200, 1900: 600, 1914: 840 },
  russia: { 1750: 300, 1800: 400, 1850: 850, 1900: 1100, 1914: 1400, 1941: 5000 },
  qing: { 1750: 800, 1800: 800, 1850: 500, 1900: 400 },
  ottoman: { 1750: 200, 1800: 250, 1850: 150, 1900: 200, 1914: 800 },
  spain: { 1750: 80, 1800: 150, 1850: 100, 1900: 150 }
};

// Initialize military for a nation
export function initializeMilitary(nationId: string, year: number, era: string, population: number): NationalMilitary {
  const armySize = interpolateMilitary(HISTORICAL_ARMY_SIZES[nationId] || HISTORICAL_ARMY_SIZES.britain, year);

  return {
    army: {
      totalManpower: armySize * 1000,
      activeUnits: generateInitialUnits(nationId, era, armySize),
      reserves: armySize * 500,
      conscriptPool: population * 100, // 10% of population
      organization: 70,
      doctrine: getDoctrineForNation(nationId)
    },
    navy: {
      totalShips: Math.floor(armySize / 5),
      activeUnits: [],
      sailors: armySize * 100,
      navalBases: Math.floor(population / 10000),
      seaControl: nationId === 'britain' ? 80 : 40
    },
    logistics: {
      supplyCapacity: armySize * 100,
      currentSupply: armySize * 80,
      supplyLines: Math.floor(armySize / 10),
      warMateriel: armySize * 200,
      fuelReserves: year >= 1900 ? armySize * 50 : 0
    },
    command: {
      generals: Math.floor(armySize / 20),
      admirals: Math.floor(armySize / 100),
      commandQuality: 3,
      warExperience: 0
    },
    fortifications: {
      forts: Math.floor(population / 5000),
      coastalDefenses: Math.floor(population / 10000),
      airDefenses: year >= 1914 ? Math.floor(armySize / 50) : 0
    },
    warReadiness: 60,
    morale: 70,
    attrition: 0
  };
}

// Interpolate military size
function interpolateMilitary(data: Record<number, number>, year: number): number {
  const years = Object.keys(data).map(Number).sort((a, b) => a - b);

  if (year <= years[0]) return data[years[0]];
  if (year >= years[years.length - 1]) return data[years[years.length - 1]];

  for (let i = 0; i < years.length - 1; i++) {
    if (years[i] <= year && years[i + 1] >= year) {
      const ratio = (year - years[i]) / (years[i + 1] - years[i]);
      return Math.floor(data[years[i]] + (data[years[i + 1]] - data[years[i]]) * ratio);
    }
  }

  return data[years[0]];
}

// Generate initial military units
function generateInitialUnits(nationId: string, era: string, armySize: number): MilitaryUnit[] {
  const templates = UNIT_TEMPLATES[era] || UNIT_TEMPLATES.ENLIGHTENMENT;
  const units: MilitaryUnit[] = [];

  // Generate infantry regiments
  const infantryTemplate = templates.find(t => t.category === 'INFANTRY');
  if (infantryTemplate) {
    const numRegiments = Math.floor(armySize / 2);
    for (let i = 0; i < numRegiments; i++) {
      units.push(createUnit(infantryTemplate, `${i + 1}st ${infantryTemplate.name}`));
    }
  }

  // Generate cavalry
  const cavalryTemplate = templates.find(t => t.category === 'CAVALRY');
  if (cavalryTemplate) {
    const numRegiments = Math.floor(armySize / 10);
    for (let i = 0; i < numRegiments; i++) {
      units.push(createUnit(cavalryTemplate, `${i + 1}st ${cavalryTemplate.name}`));
    }
  }

  // Generate artillery
  const artilleryTemplate = templates.find(t => t.category === 'ARTILLERY');
  if (artilleryTemplate) {
    const numBatteries = Math.floor(armySize / 20);
    for (let i = 0; i < numBatteries; i++) {
      units.push(createUnit(artilleryTemplate, `${i + 1}st ${artilleryTemplate.name}`));
    }
  }

  return units;
}

// Create unit from template
function createUnit(template: UnitTemplate, name: string): MilitaryUnit {
  return {
    id: `unit_${Math.random().toString(36).substring(7)}`,
    name,
    type: template.type,
    category: template.category,
    era: [],
    manpower: template.manpower,
    equipment: template.equipment,
    attack: template.attack,
    defense: template.defense,
    morale: 70,
    experience: 0,
    supplyCost: template.supplyCost,
    movementSpeed: template.movementSpeed,
    status: 'READY',
    strength: 100
  };
}

// Get doctrine for nation
function getDoctrineForNation(nationId: string): string {
  const doctrines: Record<string, string> = {
    britain: 'Naval Supremacy',
    france: 'Offensive Spirit',
    prussia: 'Discipline and Drill',
    russia: 'Mass Mobilization',
    qing: 'Defensive Depth',
    ottoman: 'Frontier Defense',
    spain: 'Colonial Garrison'
  };
  return doctrines[nationId] || 'Balanced Forces';
}

// Calculate combat strength
export function calculateCombatStrength(military: NationalMilitary): number {
  let strength = 0;

  for (const unit of military.army.activeUnits) {
    const unitStrength = (unit.attack + unit.defense) * (unit.strength / 100) * (unit.morale / 100);
    strength += unitStrength;
  }

  // Modifiers
  strength *= military.army.organization / 100;
  strength *= 1 + (military.command.commandQuality - 3) * 0.1;

  // Supply penalty
  if (military.logistics.currentSupply < military.logistics.supplyCapacity * 0.5) {
    strength *= 0.7;
  }

  return Math.floor(strength);
}

// Simulate military attrition
export function simulateMilitaryYear(
  military: NationalMilitary,
  atWar: boolean,
  year: number
): { updated: NationalMilitary; events: string[] } {
  const events: string[] = [];
  const updated = { ...military };

  // Peacetime recovery
  if (!atWar) {
    updated.morale = Math.min(100, updated.morale + 5);
    updated.warReadiness = Math.min(100, updated.warReadiness + 2);

    // Units recover strength
    updated.army.activeUnits = updated.army.activeUnits.map(unit => ({
      ...unit,
      strength: Math.min(100, unit.strength + 10),
      morale: Math.min(100, unit.morale + 5)
    }));
  } else {
    // Wartime attrition
    updated.attrition = 2;
    updated.morale = Math.max(0, updated.morale - 3);

    // Units take losses
    updated.army.activeUnits = updated.army.activeUnits.map(unit => ({
      ...unit,
      strength: Math.max(0, unit.strength - 5),
      experience: Math.min(100, unit.experience + 10)
    }));

    // Supply consumption
    updated.logistics.currentSupply *= 0.9;
    if (updated.logistics.currentSupply < updated.logistics.supplyCapacity * 0.3) {
      events.push('CRITICAL: Supply shortages affecting military operations');
    }
  }

  // Check for mutiny risk
  if (updated.morale < 30) {
    events.push('WARNING: Low morale risks mutiny');
  }

  return { updated, events };
}

// Get military narrative
export function getMilitaryNarrative(military: NationalMilitary): string {
  const totalUnits = military.army.activeUnits.length;
  const totalManpower = military.army.totalManpower;

  let narrative = `The armed forces field ${totalUnits} units with ${(totalManpower / 1000).toFixed(0)}k troops. `;

  if (military.warReadiness > 80) {
    narrative += 'The military stands ready for war. ';
  } else if (military.warReadiness < 40) {
    narrative += 'Military readiness is dangerously low. ';
  }

  if (military.morale > 80) {
    narrative += 'Morale is excellent.';
  } else if (military.morale < 40) {
    narrative += 'Morale is poor and desertion is a concern.';
  }

  return narrative;
}
