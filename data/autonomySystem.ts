// Province autonomy and territorial control system

export interface ProvinceAutonomy {
  provinceId: string;
  baseAutonomy: number;
  minAutonomy: number;
  monthlyChange: number;
  modifiers: AutonomyModifier[];
}

export interface AutonomyModifier {
  id: string;
  name: string;
  value: number;
  duration?: number;
  source: ModifierSource;
}

export type ModifierSource = 'conquest' | 'event' | 'rebel' | 'estate' | 'government' | 'terrain';

export interface TerritorialCore {
  provinceId: string;
  nationId: string;
  isFull: boolean;
  progress: number;
  dateAcquired: string;
}

export interface AutonomyEffect {
  threshold: number;
  effects: { type: string; modifier: number }[];
}

// Autonomy effects at different levels
export const AUTONOMY_EFFECTS: AutonomyEffect[] = [
  {
    threshold: 0,
    effects: [
      { type: 'tax', modifier: 100 },
      { type: 'manpower', modifier: 100 },
      { type: 'trade_power', modifier: 100 },
      { type: 'force_limit', modifier: 100 }
    ]
  },
  {
    threshold: 25,
    effects: [
      { type: 'tax', modifier: 75 },
      { type: 'manpower', modifier: 75 },
      { type: 'trade_power', modifier: 87 },
      { type: 'force_limit', modifier: 87 }
    ]
  },
  {
    threshold: 50,
    effects: [
      { type: 'tax', modifier: 50 },
      { type: 'manpower', modifier: 50 },
      { type: 'trade_power', modifier: 75 },
      { type: 'force_limit', modifier: 75 }
    ]
  },
  {
    threshold: 75,
    effects: [
      { type: 'tax', modifier: 25 },
      { type: 'manpower', modifier: 25 },
      { type: 'trade_power', modifier: 62 },
      { type: 'force_limit', modifier: 62 }
    ]
  },
  {
    threshold: 100,
    effects: [
      { type: 'tax', modifier: 0 },
      { type: 'manpower', modifier: 0 },
      { type: 'trade_power', modifier: 50 },
      { type: 'force_limit', modifier: 50 }
    ]
  }
];

// Conquest autonomy by territory type
export const CONQUEST_AUTONOMY: Record<string, number> = {
  core: 0,
  claim: 50,
  no_claim: 75,
  overseas: 90
};

// Monthly autonomy reduction rates
export const AUTONOMY_REDUCTION_RATES: Record<string, number> = {
  normal: -0.025,
  centralization: -0.05,
  state: -0.05,
  capital: -0.1
};

// Calculate effective autonomy
export function calculateEffectiveAutonomy(
  base: number,
  modifiers: AutonomyModifier[]
): number {
  let total = base;

  for (const mod of modifiers) {
    total += mod.value;
  }

  return Math.max(0, Math.min(100, total));
}

// Get province output modifier for a given autonomy
export function getOutputModifier(
  autonomy: number,
  outputType: string
): number {
  let modifier = 100;

  for (const level of AUTONOMY_EFFECTS) {
    if (autonomy >= level.threshold) {
      const effect = level.effects.find(e => e.type === outputType);
      if (effect) {
        modifier = effect.modifier;
      }
    } else {
      break;
    }
  }

  return modifier;
}

// Calculate core creation cost
export function calculateCoreCost(
  baseCost: number,
  development: number,
  distance: number,
  modifiers: number
): number {
  const devCost = development * 2;
  const distanceCost = distance * 0.1;
  const total = (baseCost + devCost) * (1 + distanceCost) * (1 + modifiers / 100);

  return Math.round(total);
}

// Calculate monthly autonomy change
export function calculateMonthlyChange(
  currentAutonomy: number,
  minAutonomy: number,
  reductionRate: number,
  unrest: number
): number {
  if (currentAutonomy <= minAutonomy) return 0;

  let change = reductionRate;

  // Unrest slows autonomy reduction
  if (unrest > 0) {
    change *= Math.max(0, 1 - unrest / 20);
  }

  return change;
}

// Get territory status based on core
export function getTerritoryStatus(
  core: TerritorialCore | undefined,
  nationId: string
): 'core' | 'territorial' | 'occupied' {
  if (!core) return 'occupied';
  if (core.nationId === nationId && core.isFull) return 'core';
  return 'territorial';
}

// Get autonomy color for display
export function getAutonomyColor(autonomy: number): string {
  if (autonomy <= 25) return 'text-green-400';
  if (autonomy <= 50) return 'text-amber-400';
  if (autonomy <= 75) return 'text-orange-400';
  return 'text-red-400';
}

// Check if can decrease autonomy
export function canDecreaseAutonomy(
  currentAutonomy: number,
  minAutonomy: number,
  unrest: number
): boolean {
  return currentAutonomy > minAutonomy && unrest < 5;
}

// Calculate autonomy increase from action
export function getAutonomyIncrease(action: string): number {
  switch (action) {
    case 'appease_rebels': return 25;
    case 'estate_privilege': return 10;
    case 'disaster': return 50;
    case 'event': return 10;
    default: return 0;
  }
}

// Get state maintenance cost
export function calculateStateMaintenance(
  provinces: number,
  totalDevelopment: number,
  distance: number
): number {
  const base = provinces * 0.5;
  const devCost = totalDevelopment * 0.1;
  const distanceMod = 1 + distance * 0.05;

  return (base + devCost) * distanceMod;
}

export default {
  AUTONOMY_EFFECTS,
  CONQUEST_AUTONOMY,
  AUTONOMY_REDUCTION_RATES,
  calculateEffectiveAutonomy,
  getOutputModifier,
  calculateCoreCost,
  calculateMonthlyChange,
  getTerritoryStatus,
  getAutonomyColor,
  canDecreaseAutonomy,
  getAutonomyIncrease,
  calculateStateMaintenance
};
