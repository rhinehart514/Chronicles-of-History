// Population and demographics system

import { NationStats } from '../types';

export interface Population {
  total: number;
  growth: number;
  urbanization: number;
  literacy: number;
  classes: PopulationClasses;
  demographics: Demographics;
}

export interface PopulationClasses {
  nobility: number;
  clergy: number;
  bourgeoisie: number;
  artisans: number;
  peasants: number;
  laborers: number;
}

export interface Demographics {
  young: number;      // 0-14
  working: number;    // 15-64
  elderly: number;    // 65+
}

// Calculate population growth rate
export function calculateGrowthRate(
  food: number,
  stability: number,
  healthcare: number,
  atWar: boolean
): number {
  let rate = 1.5; // Base 1.5% growth

  // Food surplus bonus
  rate += Math.min(1, (food - 100) / 200);

  // Stability effect
  rate += (stability - 3) * 0.3;

  // Healthcare/innovation bonus
  rate += healthcare * 0.1;

  // War penalty
  if (atWar) rate -= 0.8;

  return Math.max(-2, Math.min(4, rate));
}

// Apply population growth
export function applyGrowth(population: Population): Population {
  const growthMultiplier = 1 + (population.growth / 100);
  const newTotal = Math.floor(population.total * growthMultiplier);

  // Update demographics
  const newDemographics = {
    young: population.demographics.young * growthMultiplier,
    working: population.demographics.working * growthMultiplier,
    elderly: population.demographics.elderly * growthMultiplier
  };

  return {
    ...population,
    total: newTotal,
    demographics: {
      young: Math.round(newDemographics.young),
      working: Math.round(newDemographics.working),
      elderly: Math.round(newDemographics.elderly)
    }
  };
}

// Calculate manpower from population
export function calculateManpower(population: Population, militarization: number): number {
  // Working age males available for military
  const eligiblePop = population.demographics.working * 0.5; // ~half are male
  const availableRate = 0.05 + (militarization * 0.02); // 5-15% depending on militarization

  return Math.floor(eligiblePop * availableRate);
}

// Calculate tax revenue from population
export function calculateTaxRevenue(
  population: Population,
  taxRate: number,
  efficiency: number
): number {
  // Weighted by class wealth
  const classWeights = {
    nobility: 100,
    clergy: 50,
    bourgeoisie: 80,
    artisans: 30,
    peasants: 10,
    laborers: 5
  };

  let taxableWealth = 0;
  for (const [cls, count] of Object.entries(population.classes)) {
    taxableWealth += count * classWeights[cls as keyof typeof classWeights];
  }

  return Math.floor(taxableWealth * (taxRate / 100) * efficiency);
}

// Calculate research output from population
export function calculateResearchOutput(population: Population): number {
  // Educated classes contribute to research
  const researchers = population.classes.clergy * 0.3 +
                     population.classes.bourgeoisie * 0.2;

  return Math.floor(researchers * population.literacy / 100);
}

// Migration between classes (social mobility)
export function applySocialMobility(
  population: Population,
  economy: number,
  innovation: number
): Population {
  const mobility = (economy + innovation) / 20; // 0-0.5 mobility rate

  const newClasses = { ...population.classes };

  // Peasants -> Laborers (urbanization)
  const urbanizing = Math.floor(newClasses.peasants * population.urbanization / 1000);
  newClasses.peasants -= urbanizing;
  newClasses.laborers += urbanizing;

  // Laborers -> Artisans (skill development)
  const skilling = Math.floor(newClasses.laborers * mobility * 0.02);
  newClasses.laborers -= skilling;
  newClasses.artisans += skilling;

  // Artisans -> Bourgeoisie (wealth accumulation)
  const enriching = Math.floor(newClasses.artisans * mobility * 0.01);
  newClasses.artisans -= enriching;
  newClasses.bourgeoisie += enriching;

  return { ...population, classes: newClasses };
}

// Calculate urbanization rate
export function calculateUrbanization(
  current: number,
  innovation: number,
  factories: number
): number {
  const urbanPull = innovation * 2 + factories * 5;
  const change = Math.min(1, urbanPull / 100);

  return Math.min(90, current + change);
}

// Calculate literacy rate
export function calculateLiteracy(
  current: number,
  schools: number,
  innovation: number
): number {
  const literacyGrowth = schools * 0.5 + innovation * 0.3;
  const change = Math.min(2, literacyGrowth / 10);

  return Math.min(100, current + change);
}

// Population modifiers on nation stats
export function getPopulationModifiers(population: Population): Partial<NationStats> {
  const modifiers: Partial<NationStats> = {};

  // Literacy bonus to innovation
  if (population.literacy > 50) {
    modifiers.innovation = (population.literacy - 50) / 200;
  }

  // Urbanization effect on economy
  if (population.urbanization > 30) {
    modifiers.economy = (population.urbanization - 30) / 200;
  }

  // Class balance affects stability
  const bourgeoisieRatio = population.classes.bourgeoisie / population.total;
  if (bourgeoisieRatio > 0.1) {
    modifiers.stability = (bourgeoisieRatio - 0.1) * 2;
  }

  return modifiers;
}

// Calculate unrest from population factors
export function calculateUnrest(
  population: Population,
  taxRate: number,
  food: number,
  stability: number
): number {
  let unrest = 0;

  // High taxes
  if (taxRate > 30) unrest += (taxRate - 30) * 0.5;

  // Food shortage
  if (food < 100) unrest += (100 - food) * 0.3;

  // Low literacy causes unrest during modernization
  if (population.urbanization > 50 && population.literacy < 30) {
    unrest += 10;
  }

  // Stability mitigation
  unrest -= stability * 3;

  return Math.max(0, Math.min(100, unrest));
}

// Plague/disease effects
export function applyDisease(
  population: Population,
  severity: 'mild' | 'moderate' | 'severe'
): Population {
  const deathRates = { mild: 0.02, moderate: 0.1, severe: 0.25 };
  const rate = 1 - deathRates[severity];

  return {
    ...population,
    total: Math.floor(population.total * rate),
    demographics: {
      young: Math.floor(population.demographics.young * rate),
      working: Math.floor(population.demographics.working * rate),
      elderly: Math.floor(population.demographics.elderly * (rate - 0.1)) // Elderly hit harder
    }
  };
}

// Create default population
export function createDefaultPopulation(size: number): Population {
  return {
    total: size,
    growth: 1.5,
    urbanization: 15,
    literacy: 20,
    classes: {
      nobility: Math.floor(size * 0.02),
      clergy: Math.floor(size * 0.03),
      bourgeoisie: Math.floor(size * 0.05),
      artisans: Math.floor(size * 0.1),
      peasants: Math.floor(size * 0.6),
      laborers: Math.floor(size * 0.2)
    },
    demographics: {
      young: Math.floor(size * 0.35),
      working: Math.floor(size * 0.55),
      elderly: Math.floor(size * 0.1)
    }
  };
}

export default {
  calculateGrowthRate,
  applyGrowth,
  calculateManpower,
  calculateTaxRevenue,
  calculateResearchOutput,
  applySocialMobility,
  calculateUrbanization,
  calculateLiteracy,
  getPopulationModifiers,
  calculateUnrest,
  applyDisease,
  createDefaultPopulation
};
