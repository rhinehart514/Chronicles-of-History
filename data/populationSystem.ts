// Population Dynamics System - Realistic demographic simulation
// Models birth/death rates, migration, urbanization, and social consequences

import { Nation, Demographics, SocialClass, Province, NationStats } from '../types';

// Historical population data for accurate starting points (in thousands)
export const HISTORICAL_POPULATIONS: Record<string, Record<number, number>> = {
  britain: {
    1750: 7500,
    1800: 10500,
    1850: 22000,
    1900: 38000,
    1950: 50000
  },
  france: {
    1750: 25000,
    1800: 29000,
    1850: 36000,
    1900: 41000,
    1950: 42000
  },
  qing: {
    1750: 260000,
    1800: 330000,
    1850: 430000,
    1900: 400000,
    1950: 550000
  },
  prussia: {
    1750: 6000,
    1800: 10000,
    1850: 17000,
    1900: 56000, // German Empire
    1950: 68000  // Germany
  },
  russia: {
    1750: 20000,
    1800: 37000,
    1850: 68000,
    1900: 132000,
    1950: 180000
  },
  ottoman: {
    1750: 25000,
    1800: 25000,
    1850: 35000,
    1900: 20000, // Territorial losses
    1950: 21000  // Turkey
  },
  spain: {
    1750: 9000,
    1800: 11000,
    1850: 15000,
    1900: 18000,
    1950: 28000
  }
};

// Population growth rates by era (annual %)
export const ERA_GROWTH_RATES: Record<string, { base: number; urban: number; rural: number }> = {
  EARLY_MODERN: { base: 0.3, urban: 0.5, rural: 0.2 },
  ENLIGHTENMENT: { base: 0.5, urban: 0.8, rural: 0.3 },
  REVOLUTIONARY: { base: 0.6, urban: 1.0, rural: 0.4 },
  INDUSTRIAL: { base: 1.0, urban: 2.0, rural: 0.5 },
  IMPERIAL: { base: 1.2, urban: 2.5, rural: 0.3 },
  GREAT_WAR: { base: -0.5, urban: -0.3, rural: -0.8 },
  INTERWAR: { base: 0.8, urban: 1.5, rural: 0.3 },
  WORLD_WAR: { base: -1.0, urban: -0.8, rural: -1.2 },
  COLD_WAR: { base: 1.5, urban: 2.5, rural: 0.5 },
  MODERN: { base: 0.5, urban: 1.0, rural: -0.5 }
};

// Urbanization rates by era (% of population in cities)
export const ERA_URBANIZATION: Record<string, number> = {
  EARLY_MODERN: 10,
  ENLIGHTENMENT: 12,
  REVOLUTIONARY: 15,
  INDUSTRIAL: 35,
  IMPERIAL: 50,
  GREAT_WAR: 55,
  INTERWAR: 60,
  WORLD_WAR: 65,
  COLD_WAR: 70,
  MODERN: 80
};

// Disease and mortality modifiers
export interface MortalityEvent {
  name: string;
  deathRate: number; // Additional deaths per 1000
  duration: number; // Years
  affectsUrban: boolean;
  affectsRural: boolean;
}

export const HISTORICAL_MORTALITY_EVENTS: Record<number, MortalityEvent> = {
  1771: { name: 'Russian Plague', deathRate: 5, duration: 2, affectsUrban: true, affectsRural: true },
  1817: { name: 'Cholera Pandemic', deathRate: 3, duration: 4, affectsUrban: true, affectsRural: false },
  1846: { name: 'Typhus Outbreak', deathRate: 2, duration: 3, affectsUrban: true, affectsRural: true },
  1918: { name: 'Spanish Flu', deathRate: 10, duration: 2, affectsUrban: true, affectsRural: true }
};

// Social class templates by era
export const ERA_CLASS_TEMPLATES: Record<string, SocialClass[]> = {
  ENLIGHTENMENT: [
    { name: 'Nobility', percentage: 2, wealth: 5, influence: 5, satisfaction: 70, description: 'The hereditary aristocracy holds land and titles' },
    { name: 'Clergy', percentage: 1, wealth: 4, influence: 4, satisfaction: 75, description: 'Religious institutions wield spiritual and temporal power' },
    { name: 'Bourgeoisie', percentage: 8, wealth: 4, influence: 3, satisfaction: 60, description: 'Merchants, professionals, and wealthy commoners' },
    { name: 'Artisans', percentage: 12, wealth: 2, influence: 2, satisfaction: 50, description: 'Skilled craftsmen and guild members' },
    { name: 'Peasantry', percentage: 70, wealth: 1, influence: 1, satisfaction: 40, description: 'Rural farmers and agricultural laborers' },
    { name: 'Urban Poor', percentage: 7, wealth: 1, influence: 1, satisfaction: 30, description: 'Unskilled urban laborers and servants' }
  ],
  INDUSTRIAL: [
    { name: 'Aristocracy', percentage: 1, wealth: 5, influence: 4, satisfaction: 65, description: 'Old nobility adapting to new economic realities' },
    { name: 'Industrial Magnates', percentage: 2, wealth: 5, influence: 5, satisfaction: 80, description: 'Factory owners and captains of industry' },
    { name: 'Middle Class', percentage: 15, wealth: 3, influence: 3, satisfaction: 65, description: 'Professionals, managers, and shopkeepers' },
    { name: 'Skilled Workers', percentage: 20, wealth: 2, influence: 2, satisfaction: 50, description: 'Factory workers and trained tradesmen' },
    { name: 'Unskilled Workers', percentage: 35, wealth: 1, influence: 1, satisfaction: 35, description: 'Factory laborers and domestic servants' },
    { name: 'Rural Population', percentage: 27, wealth: 1, influence: 1, satisfaction: 40, description: 'Farmers and agricultural workers' }
  ],
  MODERN: [
    { name: 'Upper Class', percentage: 3, wealth: 5, influence: 5, satisfaction: 85, description: 'Wealthy elites and corporate leaders' },
    { name: 'Upper Middle Class', percentage: 15, wealth: 4, influence: 3, satisfaction: 75, description: 'Professionals and senior managers' },
    { name: 'Middle Class', percentage: 40, wealth: 3, influence: 2, satisfaction: 60, description: 'White-collar workers and small business owners' },
    { name: 'Working Class', percentage: 35, wealth: 2, influence: 1, satisfaction: 50, description: 'Blue-collar and service industry workers' },
    { name: 'Underclass', percentage: 7, wealth: 1, influence: 1, satisfaction: 30, description: 'Unemployed and impoverished populations' }
  ]
};

// Migration patterns
export interface MigrationFlow {
  source: string; // Province or region
  destination: string;
  annual: number; // Thousands per year
  reason: 'ECONOMIC' | 'POLITICAL' | 'RELIGIOUS' | 'WAR' | 'FAMINE';
}

// Population dynamics result
export interface PopulationUpdate {
  previousPopulation: number;
  newPopulation: number;
  births: number;
  deaths: number;
  netMigration: number;
  urbanization: number;
  literacyChange: number;
  classChanges: { className: string; satisfactionChange: number; reason: string }[];
  events: string[];
}

// Calculate population changes for a year
export function simulatePopulationYear(
  nation: Nation,
  year: number,
  era: string,
  warActive: boolean,
  famine: boolean,
  plague: boolean
): PopulationUpdate {
  const demographics = nation.demographics;
  if (!demographics) {
    return {
      previousPopulation: 0,
      newPopulation: 0,
      births: 0,
      deaths: 0,
      netMigration: 0,
      urbanization: 0,
      literacyChange: 0,
      classChanges: [],
      events: []
    };
  }

  const events: string[] = [];
  const classChanges: { className: string; satisfactionChange: number; reason: string }[] = [];

  // Get base growth rate for era
  const eraRates = ERA_GROWTH_RATES[era] || ERA_GROWTH_RATES.ENLIGHTENMENT;
  let growthRate = eraRates.base;

  // Modifiers
  if (warActive) {
    growthRate -= 0.5;
    events.push('War casualties reduce population growth');
  }
  if (famine) {
    growthRate -= 1.0;
    events.push('Famine causes widespread death and emigration');
    classChanges.push({ className: 'Peasantry', satisfactionChange: -20, reason: 'Famine' });
  }
  if (plague) {
    growthRate -= 0.8;
    events.push('Disease outbreak increases mortality');
  }

  // Check for historical mortality events
  const mortalityEvent = HISTORICAL_MORTALITY_EVENTS[year];
  if (mortalityEvent) {
    growthRate -= mortalityEvent.deathRate / 10;
    events.push(`${mortalityEvent.name} affects the population`);
  }

  // Economic factors
  if (nation.stats.economy >= 4) {
    growthRate += 0.2;
  } else if (nation.stats.economy <= 2) {
    growthRate -= 0.2;
    classChanges.push({ className: 'Urban Poor', satisfactionChange: -10, reason: 'Economic hardship' });
  }

  // Innovation affects health/mortality
  if (nation.stats.innovation >= 4) {
    growthRate += 0.1;
  }

  // Stability affects birth rate
  if (nation.stats.stability <= 2) {
    growthRate -= 0.3;
    events.push('Political instability reduces population growth');
  }

  // Calculate actual population change
  const previousPop = demographics.totalPopulation;
  const births = Math.floor(previousPop * (growthRate > 0 ? growthRate * 1.5 : 0.5) / 100);
  const deaths = Math.floor(previousPop * (growthRate > 0 ? 0.5 : Math.abs(growthRate) + 0.5) / 100);
  const netMigration = Math.floor(previousPop * (growthRate > 0 ? 0.1 : -0.3) / 100);

  const newPopulation = previousPop + births - deaths + netMigration;

  // Urbanization changes
  const targetUrbanization = ERA_URBANIZATION[era] || 20;
  let urbanization = demographics.urbanization;

  if (urbanization < targetUrbanization) {
    urbanization = Math.min(targetUrbanization, urbanization + 0.5);
    if (nation.stats.innovation >= 4) {
      urbanization = Math.min(targetUrbanization, urbanization + 0.3);
    }
  }

  // Literacy changes based on era and stats
  let literacyChange = 0;
  if (nation.stats.innovation >= 3) {
    literacyChange = 0.5;
  }
  if (nation.stats.economy >= 4) {
    literacyChange += 0.3;
  }

  // Update class satisfaction based on conditions
  if (urbanization > demographics.urbanization + 1) {
    classChanges.push({ className: 'Artisans', satisfactionChange: -5, reason: 'Factory competition' });
    classChanges.push({ className: 'Urban Poor', satisfactionChange: -5, reason: 'Crowded cities' });
  }

  if (nation.stats.stability >= 4) {
    classChanges.push({ className: 'Bourgeoisie', satisfactionChange: 5, reason: 'Stable business environment' });
  }

  return {
    previousPopulation: previousPop,
    newPopulation,
    births,
    deaths,
    netMigration,
    urbanization,
    literacyChange,
    classChanges,
    events
  };
}

// Update demographics based on population simulation
export function applyPopulationUpdate(
  demographics: Demographics,
  update: PopulationUpdate
): Demographics {
  // Update social class satisfaction
  const updatedClasses = demographics.socialClasses.map(sc => {
    const change = update.classChanges.find(c => c.className === sc.name);
    if (change) {
      return {
        ...sc,
        satisfaction: Math.max(0, Math.min(100, sc.satisfaction + change.satisfactionChange))
      };
    }
    return sc;
  });

  return {
    ...demographics,
    totalPopulation: update.newPopulation,
    growthRate: ((update.newPopulation - update.previousPopulation) / update.previousPopulation) * 100,
    urbanization: update.urbanization,
    literacy: Math.min(100, demographics.literacy + update.literacyChange),
    socialClasses: updatedClasses
  };
}

// Calculate class unrest level
export function calculateClassUnrest(socialClasses: SocialClass[]): number {
  let totalUnrest = 0;
  let totalWeight = 0;

  for (const sc of socialClasses) {
    const weight = sc.percentage * (6 - sc.wealth); // Lower classes weighted more
    const unrest = (100 - sc.satisfaction) * weight;
    totalUnrest += unrest;
    totalWeight += weight;
  }

  return totalWeight > 0 ? totalUnrest / totalWeight : 0;
}

// Check for social class conflicts
export function checkClassConflict(socialClasses: SocialClass[]): {
  conflict: boolean;
  type: string;
  description: string;
} | null {
  // Find classes with very different satisfaction levels
  const wealthyClasses = socialClasses.filter(sc => sc.wealth >= 4);
  const poorClasses = socialClasses.filter(sc => sc.wealth <= 2);

  const avgWealthySatisfaction = wealthyClasses.reduce((sum, sc) => sum + sc.satisfaction, 0) / wealthyClasses.length;
  const avgPoorSatisfaction = poorClasses.reduce((sum, sc) => sum + sc.satisfaction, 0) / poorClasses.length;

  const gap = avgWealthySatisfaction - avgPoorSatisfaction;

  if (gap > 40 && avgPoorSatisfaction < 30) {
    return {
      conflict: true,
      type: 'CLASS_WAR',
      description: 'The vast gulf between rich and poor threatens social order. Revolutionary sentiment grows among the lower classes.'
    };
  }

  if (avgPoorSatisfaction < 20) {
    return {
      conflict: true,
      type: 'RIOTS',
      description: 'Desperate conditions among the poor have sparked riots and unrest in major cities.'
    };
  }

  // Check for specific class conflicts
  const bourgeoisie = socialClasses.find(sc => sc.name.includes('Bourgeoisie') || sc.name.includes('Middle'));
  const nobility = socialClasses.find(sc => sc.name.includes('Nobility') || sc.name.includes('Aristocracy'));

  if (bourgeoisie && nobility && bourgeoisie.satisfaction < 40 && nobility.influence > bourgeoisie.influence) {
    return {
      conflict: true,
      type: 'LIBERAL_UPRISING',
      description: 'The rising middle class demands political reforms and representation against aristocratic privilege.'
    };
  }

  return null;
}

// Get narrative description of population state
export function getPopulationNarrative(demographics: Demographics): string {
  const popMillions = (demographics.totalPopulation / 1000).toFixed(1);
  const urbanPct = Math.round(demographics.urbanization);
  const literacyPct = Math.round(demographics.literacy);

  let narrative = `The nation counts ${popMillions} million souls. `;

  if (urbanPct > 60) {
    narrative += `Cities have grown to house ${urbanPct}% of the population. `;
  } else if (urbanPct < 20) {
    narrative += `The land remains primarily rural, with only ${urbanPct}% in cities. `;
  }

  if (literacyPct > 70) {
    narrative += `Education has flourished, with ${literacyPct}% literacy. `;
  } else if (literacyPct < 30) {
    narrative += `Illiteracy remains widespread at ${100 - literacyPct}%. `;
  }

  // Check for tensions
  const unrest = calculateClassUnrest(demographics.socialClasses);
  if (unrest > 50) {
    narrative += 'Social tensions run high as inequality divides the nation.';
  } else if (unrest < 20) {
    narrative += 'Social harmony prevails across the classes.';
  }

  return narrative;
}
