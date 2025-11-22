// Mercenary companies and contracts system

export interface MercenaryCompany {
  id: string;
  name: string;
  origin: string;
  icon: string;
  size: number;
  composition: UnitComposition[];
  cost: number; // monthly
  hireCost: number;
  morale: number;
  discipline: number;
  maneuver: number;
  available: boolean;
  cooldown?: number; // months until available again
}

export interface UnitComposition {
  type: 'infantry' | 'cavalry' | 'artillery';
  count: number;
}

export interface HiredMercenary extends MercenaryCompany {
  contractEnd: number; // year
  currentStrength: number;
  location: string;
}

// Default mercenary companies
export const MERCENARY_COMPANIES: MercenaryCompany[] = [
  {
    id: 'swiss_guard',
    name: 'Swiss Guard',
    origin: 'Switzerland',
    icon: '🛡️',
    size: 12000,
    composition: [
      { type: 'infantry', count: 10000 },
      { type: 'cavalry', count: 2000 }
    ],
    cost: 15,
    hireCost: 300,
    morale: 4.5,
    discipline: 110,
    maneuver: 3,
    available: true
  },
  {
    id: 'landsknechts',
    name: 'Landsknechts',
    origin: 'Holy Roman Empire',
    icon: '⚔️',
    size: 15000,
    composition: [
      { type: 'infantry', count: 12000 },
      { type: 'cavalry', count: 3000 }
    ],
    cost: 18,
    hireCost: 400,
    morale: 4.0,
    discipline: 105,
    maneuver: 2,
    available: true
  },
  {
    id: 'condottieri',
    name: 'Italian Condottieri',
    origin: 'Italy',
    icon: '🏇',
    size: 8000,
    composition: [
      { type: 'infantry', count: 4000 },
      { type: 'cavalry', count: 4000 }
    ],
    cost: 12,
    hireCost: 250,
    morale: 3.5,
    discipline: 100,
    maneuver: 4,
    available: true
  },
  {
    id: 'stratioti',
    name: 'Stratioti',
    origin: 'Balkans',
    icon: '🐴',
    size: 6000,
    composition: [
      { type: 'cavalry', count: 6000 }
    ],
    cost: 10,
    hireCost: 200,
    morale: 4.0,
    discipline: 95,
    maneuver: 5,
    available: true
  },
  {
    id: 'black_army',
    name: 'Black Army',
    origin: 'Hungary',
    icon: '🖤',
    size: 20000,
    composition: [
      { type: 'infantry', count: 14000 },
      { type: 'cavalry', count: 4000 },
      { type: 'artillery', count: 2000 }
    ],
    cost: 25,
    hireCost: 600,
    morale: 4.5,
    discipline: 115,
    maneuver: 3,
    available: true
  },
  {
    id: 'mamluks',
    name: 'Mamluk Warriors',
    origin: 'Egypt',
    icon: '🌙',
    size: 10000,
    composition: [
      { type: 'infantry', count: 4000 },
      { type: 'cavalry', count: 6000 }
    ],
    cost: 14,
    hireCost: 350,
    morale: 4.2,
    discipline: 108,
    maneuver: 4,
    available: true
  },
  {
    id: 'free_company',
    name: 'Free Company',
    origin: 'France',
    icon: '🗡️',
    size: 10000,
    composition: [
      { type: 'infantry', count: 7000 },
      { type: 'cavalry', count: 3000 }
    ],
    cost: 11,
    hireCost: 220,
    morale: 3.8,
    discipline: 100,
    maneuver: 3,
    available: true
  },
  {
    id: 'almogavars',
    name: 'Almogavars',
    origin: 'Aragon',
    icon: '🏔️',
    size: 8000,
    composition: [
      { type: 'infantry', count: 8000 }
    ],
    cost: 9,
    hireCost: 180,
    morale: 4.3,
    discipline: 105,
    maneuver: 4,
    available: true
  },
  {
    id: 'cossacks',
    name: 'Cossack Host',
    origin: 'Ukraine',
    icon: '🏹',
    size: 12000,
    composition: [
      { type: 'infantry', count: 6000 },
      { type: 'cavalry', count: 6000 }
    ],
    cost: 13,
    hireCost: 280,
    morale: 4.0,
    discipline: 100,
    maneuver: 5,
    available: true
  },
  {
    id: 'janissaries_merc',
    name: 'Janissary Exiles',
    origin: 'Ottoman',
    icon: '🔫',
    size: 6000,
    composition: [
      { type: 'infantry', count: 5000 },
      { type: 'artillery', count: 1000 }
    ],
    cost: 14,
    hireCost: 300,
    morale: 4.5,
    discipline: 112,
    maneuver: 2,
    available: true
  },
  {
    id: 'gallowglass',
    name: 'Gallowglass',
    origin: 'Ireland',
    icon: '🪓',
    size: 5000,
    composition: [
      { type: 'infantry', count: 5000 }
    ],
    cost: 8,
    hireCost: 150,
    morale: 4.2,
    discipline: 105,
    maneuver: 2,
    available: true
  },
  {
    id: 'genoese_crossbows',
    name: 'Genoese Crossbowmen',
    origin: 'Genoa',
    icon: '🎯',
    size: 4000,
    composition: [
      { type: 'infantry', count: 4000 }
    ],
    cost: 7,
    hireCost: 140,
    morale: 3.5,
    discipline: 100,
    maneuver: 2,
    available: true
  }
];

// Calculate hire cost with modifiers
export function calculateHireCost(
  company: MercenaryCompany,
  currentManpower: number,
  maxManpower: number,
  mercenaryModifier: number = 0
): number {
  let cost = company.hireCost;

  // Desperation modifier - more expensive when low on manpower
  const manpowerRatio = currentManpower / maxManpower;
  if (manpowerRatio < 0.25) {
    cost *= 1.5;
  } else if (manpowerRatio < 0.5) {
    cost *= 1.25;
  }

  // Apply national modifiers
  cost *= (1 + mercenaryModifier / 100);

  return Math.round(cost);
}

// Calculate monthly cost
export function calculateMonthlyCost(
  company: MercenaryCompany,
  mercenaryModifier: number = 0
): number {
  return Math.round(company.cost * (1 + mercenaryModifier / 100));
}

// Get companies by origin
export function getCompaniesByOrigin(origin: string): MercenaryCompany[] {
  return MERCENARY_COMPANIES.filter(c => c.origin === origin);
}

// Get available companies
export function getAvailableCompanies(): MercenaryCompany[] {
  return MERCENARY_COMPANIES.filter(c => c.available);
}

// Calculate total strength
export function getCompanyStrength(company: MercenaryCompany): number {
  return company.composition.reduce((sum, unit) => sum + unit.count, 0);
}

export default {
  MERCENARY_COMPANIES,
  calculateHireCost,
  calculateMonthlyCost,
  getCompaniesByOrigin,
  getAvailableCompanies,
  getCompanyStrength
};
