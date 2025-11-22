// Colonial expansion and management system

export interface Colony {
  id: string;
  name: string;
  provinceId: string;
  population: number;
  growthRate: number;
  settler: boolean;
  nativeHostility: number;
  monthsRemaining: number;
}

export interface ColonialRegion {
  id: string;
  name: string;
  icon: string;
  provinces: string[];
  nativeAggressiveness: number;
  tradeGood: string;
  formableNation?: string;
}

export interface ColonistAssignment {
  colonistId: string;
  provinceId: string;
  progress: number;
}

// Colonial constants
export const COLONIAL_CONSTANTS = {
  baseGrowth: 25, // per month
  targetPopulation: 1000,
  maintenanceCost: 2, // ducats per month
  nativeUprisingThreshold: 5,
  rangeBonus: 50, // from exploration ideas
  colonialNationThreshold: 5 // provinces to form colonial nation
};

// Colonial regions
export const COLONIAL_REGIONS: ColonialRegion[] = [
  {
    id: 'eastern_america',
    name: 'Eastern America',
    icon: '🏔️',
    provinces: [],
    nativeAggressiveness: 3,
    tradeGood: 'fur',
    formableNation: 'United States'
  },
  {
    id: 'caribbean',
    name: 'Caribbean',
    icon: '🏝️',
    provinces: [],
    nativeAggressiveness: 1,
    tradeGood: 'sugar'
  },
  {
    id: 'mexico',
    name: 'Mexico',
    icon: '🌵',
    provinces: [],
    nativeAggressiveness: 4,
    tradeGood: 'cocoa',
    formableNation: 'Mexico'
  },
  {
    id: 'brazil',
    name: 'Brazil',
    icon: '🌴',
    provinces: [],
    nativeAggressiveness: 2,
    tradeGood: 'sugar',
    formableNation: 'Brazil'
  },
  {
    id: 'la_plata',
    name: 'La Plata',
    icon: '🐄',
    provinces: [],
    nativeAggressiveness: 2,
    tradeGood: 'grain',
    formableNation: 'Argentina'
  },
  {
    id: 'peru',
    name: 'Peru',
    icon: '⛰️',
    provinces: [],
    nativeAggressiveness: 3,
    tradeGood: 'gold',
    formableNation: 'Peru'
  },
  {
    id: 'australia',
    name: 'Australia',
    icon: '🦘',
    provinces: [],
    nativeAggressiveness: 1,
    tradeGood: 'wool',
    formableNation: 'Australia'
  }
];

// Get colonial region by id
export function getColonialRegion(id: string): ColonialRegion | undefined {
  return COLONIAL_REGIONS.find(r => r.id === id);
}

// Calculate colony growth
export function calculateColonyGrowth(
  baseGrowth: number,
  modifiers: number = 0,
  nativeHostility: number = 0
): number {
  let growth = baseGrowth + COLONIAL_CONSTANTS.baseGrowth;
  growth *= (1 + modifiers / 100);
  growth -= nativeHostility * 2;
  return Math.max(1, Math.floor(growth));
}

// Calculate months to complete
export function calculateMonthsToComplete(
  currentPopulation: number,
  growthRate: number
): number {
  const remaining = COLONIAL_CONSTANTS.targetPopulation - currentPopulation;
  if (remaining <= 0) return 0;
  return Math.ceil(remaining / growthRate);
}

// Calculate colonial maintenance
export function calculateColonialMaintenance(
  activeColonies: number,
  modifiers: number = 0
): number {
  const base = activeColonies * COLONIAL_CONSTANTS.maintenanceCost;
  return base * (1 + modifiers / 100);
}

// Check if can colonize
export function canColonize(
  hasColonist: boolean,
  inRange: boolean,
  provinceEmpty: boolean
): boolean {
  return hasColonist && inRange && provinceEmpty;
}

// Calculate colonization range
export function calculateColonizationRange(
  diploTech: number,
  rangeModifier: number = 0
): number {
  const baseRange = 60 + diploTech * 30;
  return baseRange + rangeModifier;
}

// Calculate native uprising chance
export function calculateUprisingChance(
  nativeAggressiveness: number,
  nativePopulation: number,
  garrison: number
): number {
  if (garrison > 0) return 0;

  const baseChance = nativeAggressiveness * nativePopulation / 1000;
  return Math.min(10, baseChance);
}

// Calculate native assimilation
export function calculateNativeAssimilation(
  nativePopulation: number,
  policy: 'trade' | 'coexist' | 'repression'
): number {
  const rates: Record<string, number> = {
    trade: 0.5,
    coexist: 0.25,
    repression: 0
  };
  return Math.floor(nativePopulation * rates[policy]);
}

// Check if colonial nation will form
export function willFormColonialNation(
  provincesInRegion: number,
  isOldWorld: boolean
): boolean {
  if (isOldWorld) return false;
  return provincesInRegion >= COLONIAL_CONSTANTS.colonialNationThreshold;
}

// Get colony status
export function getColonyStatus(population: number): string {
  const progress = (population / COLONIAL_CONSTANTS.targetPopulation) * 100;
  if (progress >= 100) return 'Complete';
  if (progress >= 75) return 'Thriving';
  if (progress >= 50) return 'Growing';
  if (progress >= 25) return 'Struggling';
  return 'Starting';
}

// Get status color
export function getColonyStatusColor(population: number): string {
  const progress = (population / COLONIAL_CONSTANTS.targetPopulation) * 100;
  if (progress >= 75) return 'green';
  if (progress >= 50) return 'blue';
  if (progress >= 25) return 'yellow';
  return 'orange';
}

// Calculate tariff income
export function calculateTariffIncome(
  colonialIncome: number,
  tariffRate: number
): number {
  return colonialIncome * (tariffRate / 100);
}

export default {
  COLONIAL_CONSTANTS,
  COLONIAL_REGIONS,
  getColonialRegion,
  calculateColonyGrowth,
  calculateMonthsToComplete,
  calculateColonialMaintenance,
  canColonize,
  calculateColonizationRange,
  calculateUprisingChance,
  calculateNativeAssimilation,
  willFormColonialNation,
  getColonyStatus,
  getColonyStatusColor,
  calculateTariffIncome
};
