// Comprehensive Economic System - P&R-style depth with historical accuracy
// Real GDP data, budgets, debt, inflation, and trade mechanics

import { Nation, NationStats } from '../types';

// Currency types by era
export type CurrencyType =
  | 'POUND_STERLING' | 'LIVRE' | 'TAEL' | 'THALER' | 'RUBLE' | 'AKCE' | 'REAL'
  | 'FRANC' | 'MARK' | 'DOLLAR' | 'YEN' | 'YUAN' | 'LIRA' | 'PESO';

// Economic structure for a nation
export interface NationalEconomy {
  // Core metrics (in millions of local currency)
  gdp: number;
  gdpPerCapita: number;
  gdpGrowth: number; // Annual %

  // Government finances
  budget: {
    revenue: number;
    expenditure: number;
    balance: number; // Surplus/deficit
    debt: number;
    debtToGdp: number; // %
    interestPayments: number;
  };

  // Revenue breakdown
  revenue: {
    taxes: number;
    tariffs: number;
    stateEnterprises: number;
    colonies: number;
    other: number;
  };

  // Expenditure breakdown
  expenditure: {
    military: number;
    navy: number;
    administration: number;
    infrastructure: number;
    education: number;
    welfare: number;
    courtMaintenance: number;
    debtService: number;
  };

  // Monetary
  currency: CurrencyType;
  inflation: number; // Annual %
  interestRate: number; // %
  goldReserves: number; // Tonnes

  // Trade
  trade: {
    exports: number;
    imports: number;
    balance: number;
    mainPartners: string[];
    tariffRate: number; // Average %
  };

  // Sectors (% of GDP)
  sectors: {
    agriculture: number;
    manufacturing: number;
    services: number;
    mining: number;
  };

  // Labor
  labor: {
    workforce: number; // Thousands
    unemployment: number; // %
    avgWage: number;
  };

  // Infrastructure
  infrastructure: {
    roads: number; // km
    railways: number; // km
    canals: number; // km
    ports: number;
    telegraphLines: number; // km
  };
}

// Historical GDP data (in 1990 International Geary-Khamis dollars, millions)
// Based on Angus Maddison's historical statistics
export const HISTORICAL_GDP: Record<string, Record<number, number>> = {
  britain: {
    1750: 10800, 1800: 20530, 1850: 63342, 1900: 184861, 1913: 224618,
    1950: 347850, 1973: 675941, 2000: 1291531
  },
  france: {
    1750: 15600, 1800: 15500, 1850: 58039, 1900: 115650, 1913: 144489,
    1950: 220492, 1973: 683965, 2000: 1327900
  },
  qing: {
    1750: 110000, 1800: 228600, 1850: 247234, 1870: 189740, 1900: 218200,
    1913: 241344, 1950: 239903, 1973: 740048
  },
  prussia: { // Germany after 1871
    1750: 10000, 1800: 17000, 1850: 48178, 1870: 72149, 1900: 162235,
    1913: 237332, 1950: 265354, 1973: 944755
  },
  russia: {
    1750: 16200, 1800: 37500, 1850: 83646, 1900: 154049, 1913: 232351,
    1950: 510243, 1973: 1513070
  },
  ottoman: {
    1750: 12000, 1800: 12500, 1850: 15000, 1900: 14000, 1913: 15000
  },
  spain: {
    1750: 7500, 1800: 10500, 1850: 19200, 1900: 33000, 1913: 41643,
    1950: 61427, 1973: 258693
  }
};

// Historical government debt as % of GDP
export const HISTORICAL_DEBT_RATIOS: Record<string, Record<number, number>> = {
  britain: { 1750: 100, 1800: 180, 1815: 260, 1850: 130, 1900: 30, 1918: 140, 1945: 240 },
  france: { 1750: 60, 1788: 80, 1800: 40, 1850: 50, 1900: 80, 1918: 170, 1945: 200 },
  prussia: { 1750: 20, 1800: 30, 1850: 15, 1900: 50, 1918: 100, 1945: 200 },
  russia: { 1750: 10, 1800: 20, 1850: 30, 1900: 40, 1913: 50 },
  qing: { 1750: 5, 1800: 5, 1850: 10, 1900: 30 },
  ottoman: { 1750: 30, 1800: 40, 1850: 60, 1875: 120 },
  spain: { 1750: 50, 1800: 80, 1850: 100, 1900: 120 }
};

// Sector compositions by era (% of GDP)
export const ERA_SECTORS: Record<string, { agriculture: number; manufacturing: number; services: number; mining: number }> = {
  EARLY_MODERN: { agriculture: 60, manufacturing: 15, services: 20, mining: 5 },
  ENLIGHTENMENT: { agriculture: 55, manufacturing: 18, services: 22, mining: 5 },
  REVOLUTIONARY: { agriculture: 50, manufacturing: 22, services: 23, mining: 5 },
  INDUSTRIAL: { agriculture: 35, manufacturing: 35, services: 25, mining: 5 },
  IMPERIAL: { agriculture: 25, manufacturing: 40, services: 30, mining: 5 },
  GREAT_WAR: { agriculture: 20, manufacturing: 45, services: 30, mining: 5 },
  INTERWAR: { agriculture: 18, manufacturing: 42, services: 35, mining: 5 },
  WORLD_WAR: { agriculture: 15, manufacturing: 50, services: 30, mining: 5 },
  COLD_WAR: { agriculture: 10, manufacturing: 40, services: 45, mining: 5 },
  MODERN: { agriculture: 3, manufacturing: 25, services: 70, mining: 2 }
};

// Tax rates by government type
export const GOVERNMENT_TAX_RATES: Record<string, number> = {
  ABSOLUTE_MONARCHY: 12,
  CONSTITUTIONAL_MONARCHY: 15,
  REPUBLIC: 18,
  FEDERAL_REPUBLIC: 20,
  EMPIRE: 14,
  THEOCRACY: 10,
  OLIGARCHY: 8,
  MILITARY_JUNTA: 20,
  COMMUNIST_STATE: 50,
  FASCIST_STATE: 35
};

// Military spending as % of budget by era
export const ERA_MILITARY_SPENDING: Record<string, number> = {
  EARLY_MODERN: 50,
  ENLIGHTENMENT: 45,
  REVOLUTIONARY: 60,
  INDUSTRIAL: 35,
  IMPERIAL: 40,
  GREAT_WAR: 80,
  INTERWAR: 25,
  WORLD_WAR: 85,
  COLD_WAR: 30,
  MODERN: 15
};

// Initialize economy for a nation
export function initializeEconomy(nationId: string, year: number, era: string, population: number): NationalEconomy {
  // Get historical GDP or interpolate
  const gdpData = HISTORICAL_GDP[nationId] || HISTORICAL_GDP.britain;
  const gdp = interpolateValue(gdpData, year);

  // Get debt ratio
  const debtData = HISTORICAL_DEBT_RATIOS[nationId] || { [year]: 30 };
  const debtRatio = interpolateValue(debtData, year);

  // Calculate derived values
  const gdpPerCapita = gdp / (population / 1000); // GDP per thousand people
  const revenue = gdp * (GOVERNMENT_TAX_RATES.ABSOLUTE_MONARCHY / 100);
  const debt = gdp * (debtRatio / 100);
  const militarySpending = revenue * (ERA_MILITARY_SPENDING[era] || 40) / 100;
  const sectors = ERA_SECTORS[era] || ERA_SECTORS.ENLIGHTENMENT;

  return {
    gdp,
    gdpPerCapita,
    gdpGrowth: 1.0,

    budget: {
      revenue,
      expenditure: revenue * 0.95,
      balance: revenue * 0.05,
      debt,
      debtToGdp: debtRatio,
      interestPayments: debt * 0.05
    },

    revenue: {
      taxes: revenue * 0.5,
      tariffs: revenue * 0.3,
      stateEnterprises: revenue * 0.1,
      colonies: revenue * 0.05,
      other: revenue * 0.05
    },

    expenditure: {
      military: militarySpending * 0.6,
      navy: militarySpending * 0.4,
      administration: revenue * 0.15,
      infrastructure: revenue * 0.1,
      education: revenue * 0.05,
      welfare: revenue * 0.02,
      courtMaintenance: revenue * 0.08,
      debtService: debt * 0.05
    },

    currency: getCurrency(nationId),
    inflation: 2.0,
    interestRate: 5.0,
    goldReserves: gdp * 0.001,

    trade: {
      exports: gdp * 0.15,
      imports: gdp * 0.12,
      balance: gdp * 0.03,
      mainPartners: getTradePartners(nationId),
      tariffRate: 20
    },

    sectors,

    labor: {
      workforce: population * 0.4,
      unemployment: 5,
      avgWage: gdpPerCapita * 0.3
    },

    infrastructure: {
      roads: population * 0.5,
      railways: year >= 1830 ? population * 0.1 : 0,
      canals: population * 0.05,
      ports: Math.floor(population / 5000),
      telegraphLines: year >= 1850 ? population * 0.2 : 0
    }
  };
}

// Interpolate value between known data points
function interpolateValue(data: Record<number, number>, year: number): number {
  const years = Object.keys(data).map(Number).sort((a, b) => a - b);

  // Before first data point
  if (year <= years[0]) return data[years[0]];

  // After last data point
  if (year >= years[years.length - 1]) return data[years[years.length - 1]];

  // Find surrounding years
  let lowerYear = years[0];
  let upperYear = years[years.length - 1];

  for (let i = 0; i < years.length - 1; i++) {
    if (years[i] <= year && years[i + 1] >= year) {
      lowerYear = years[i];
      upperYear = years[i + 1];
      break;
    }
  }

  // Linear interpolation
  const ratio = (year - lowerYear) / (upperYear - lowerYear);
  return data[lowerYear] + (data[upperYear] - data[lowerYear]) * ratio;
}

// Get currency for nation
function getCurrency(nationId: string): CurrencyType {
  const currencies: Record<string, CurrencyType> = {
    britain: 'POUND_STERLING',
    france: 'LIVRE', // Later FRANC
    qing: 'TAEL',
    prussia: 'THALER', // Later MARK
    russia: 'RUBLE',
    ottoman: 'AKCE',
    spain: 'REAL' // Later PESO
  };
  return currencies[nationId] || 'THALER';
}

// Get trade partners for nation
function getTradePartners(nationId: string): string[] {
  const partners: Record<string, string[]> = {
    britain: ['france', 'prussia', 'netherlands', 'portugal'],
    france: ['britain', 'spain', 'prussia', 'netherlands'],
    qing: ['britain', 'portugal', 'netherlands', 'japan'],
    prussia: ['britain', 'france', 'russia', 'austria'],
    russia: ['prussia', 'britain', 'france', 'ottoman'],
    ottoman: ['britain', 'france', 'russia', 'austria'],
    spain: ['france', 'britain', 'portugal', 'netherlands']
  };
  return partners[nationId] || ['britain', 'france'];
}

// Economic events and their effects
export interface EconomicEvent {
  id: string;
  name: string;
  description: string;
  effects: {
    gdpGrowth?: number;
    inflation?: number;
    unemployment?: number;
    debtChange?: number;
    tradeBalance?: number;
  };
  duration: number;
}

// Simulate one year of economic activity
export function simulateEconomicYear(
  economy: NationalEconomy,
  nation: Nation,
  year: number,
  era: string,
  atWar: boolean,
  hasFamine: boolean
): { updated: NationalEconomy; events: string[] } {
  const events: string[] = [];
  const updated = { ...economy };

  // Base GDP growth based on stats
  let growth = 1.0;
  growth += (nation.stats.economy - 3) * 0.5; // Economy stat effect
  growth += (nation.stats.innovation - 3) * 0.3; // Innovation effect
  growth += (nation.stats.stability - 3) * 0.2; // Stability effect

  // Era modifiers
  const eraGrowth: Record<string, number> = {
    EARLY_MODERN: 0.3, ENLIGHTENMENT: 0.5, REVOLUTIONARY: 0.2,
    INDUSTRIAL: 2.0, IMPERIAL: 1.5, GREAT_WAR: -2.0,
    INTERWAR: 0.5, WORLD_WAR: -3.0, COLD_WAR: 3.0, MODERN: 2.5
  };
  growth += eraGrowth[era] || 0.5;

  // War effects
  if (atWar) {
    growth -= 1.5;
    updated.expenditure.military *= 1.5;
    updated.budget.debt *= 1.1;
    events.push('War expenditures strain the treasury');
  }

  // Famine effects
  if (hasFamine) {
    growth -= 2.0;
    events.push('Famine devastates economic output');
  }

  // Apply growth
  updated.gdpGrowth = growth;
  updated.gdp *= (1 + growth / 100);
  updated.gdpPerCapita = updated.gdp / (nation.demographics?.totalPopulation || 10000) * 1000;

  // Inflation calculation
  let inflation = 2.0;
  if (atWar) inflation += 3.0;
  if (updated.budget.balance < 0) inflation += 1.0;
  if (updated.budget.debtToGdp > 100) inflation += 2.0;
  updated.inflation = inflation;

  // Update debt
  updated.budget.debt += updated.budget.balance < 0 ? Math.abs(updated.budget.balance) : 0;
  updated.budget.debtToGdp = (updated.budget.debt / updated.gdp) * 100;
  updated.budget.interestPayments = updated.budget.debt * (updated.interestRate / 100);

  // Check for economic crises
  if (updated.budget.debtToGdp > 150) {
    events.push('CRISIS: Sovereign debt reaches dangerous levels');
  }
  if (updated.inflation > 10) {
    events.push('CRISIS: High inflation erodes purchasing power');
  }
  if (updated.labor.unemployment > 15) {
    events.push('CRISIS: Mass unemployment threatens stability');
  }

  // Infrastructure growth
  if (year >= 1825 && era !== 'GREAT_WAR' && era !== 'WORLD_WAR') {
    updated.infrastructure.railways += updated.gdp * 0.0001;
    if (year >= 1850) {
      updated.infrastructure.telegraphLines += updated.gdp * 0.0002;
    }
  }

  return { updated, events };
}

// Get economic narrative
export function getEconomicNarrative(economy: NationalEconomy): string {
  let narrative = '';

  // GDP assessment
  if (economy.gdpGrowth > 3) {
    narrative += 'The economy booms with unprecedented growth. ';
  } else if (economy.gdpGrowth > 1) {
    narrative += 'The economy grows steadily. ';
  } else if (economy.gdpGrowth > -1) {
    narrative += 'The economy stagnates. ';
  } else {
    narrative += 'The economy contracts alarmingly. ';
  }

  // Debt assessment
  if (economy.budget.debtToGdp > 100) {
    narrative += 'National debt weighs heavily on the treasury. ';
  } else if (economy.budget.balance > 0) {
    narrative += 'The budget shows a healthy surplus. ';
  }

  // Inflation
  if (economy.inflation > 8) {
    narrative += 'Rampant inflation erodes savings. ';
  }

  // Trade
  if (economy.trade.balance > 0) {
    narrative += 'Trade generates wealth for the nation.';
  } else {
    narrative += 'Trade deficits drain gold reserves.';
  }

  return narrative;
}

// Calculate tax revenue potential
export function calculateMaxRevenue(economy: NationalEconomy, govType: string): number {
  const baseRate = GOVERNMENT_TAX_RATES[govType] || 15;
  const maxRate = baseRate * 1.5;
  return economy.gdp * (maxRate / 100);
}

// Apply economic policy
export function applyEconomicPolicy(
  economy: NationalEconomy,
  policy: 'RAISE_TAXES' | 'LOWER_TAXES' | 'INCREASE_TARIFFS' | 'FREE_TRADE' | 'AUSTERITY' | 'STIMULUS'
): { updated: NationalEconomy; narrative: string } {
  const updated = { ...economy };
  let narrative = '';

  switch (policy) {
    case 'RAISE_TAXES':
      updated.revenue.taxes *= 1.2;
      updated.budget.revenue = Object.values(updated.revenue).reduce((a, b) => a + b, 0);
      narrative = 'Taxes have been raised. Revenue increases but discontent may follow.';
      break;
    case 'LOWER_TAXES':
      updated.revenue.taxes *= 0.8;
      updated.budget.revenue = Object.values(updated.revenue).reduce((a, b) => a + b, 0);
      narrative = 'Taxes have been lowered. Popular but strains the treasury.';
      break;
    case 'INCREASE_TARIFFS':
      updated.revenue.tariffs *= 1.3;
      updated.trade.tariffRate += 10;
      narrative = 'Tariffs raised to protect domestic industry.';
      break;
    case 'FREE_TRADE':
      updated.revenue.tariffs *= 0.7;
      updated.trade.tariffRate -= 10;
      updated.trade.exports *= 1.1;
      narrative = 'Free trade agreements boost exports.';
      break;
    case 'AUSTERITY':
      updated.expenditure.welfare *= 0.5;
      updated.expenditure.infrastructure *= 0.5;
      updated.budget.expenditure = Object.values(updated.expenditure).reduce((a, b) => a + b, 0);
      narrative = 'Austerity measures cut spending drastically.';
      break;
    case 'STIMULUS':
      updated.expenditure.infrastructure *= 1.5;
      updated.budget.debt *= 1.1;
      narrative = 'Government stimulus invests in growth.';
      break;
  }

  updated.budget.balance = updated.budget.revenue - updated.budget.expenditure;
  return { updated, narrative };
}
