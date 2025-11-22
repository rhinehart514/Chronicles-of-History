// Stability and unrest management system

export interface StabilityLevel {
  level: number;
  name: string;
  effects: StabilityEffect[];
  monthlyChange: number;
}

export interface StabilityEffect {
  type: string;
  value: number;
}

export interface UnrestSource {
  id: string;
  name: string;
  category: UnrestCategory;
  baseUnrest: number;
  monthlyDecay: number;
}

export type UnrestCategory = 'war' | 'religious' | 'cultural' | 'economic' | 'political';

export interface StabilityModifier {
  id: string;
  name: string;
  stabilityChange: number;
  unrestChange: number;
  duration?: number;
}

// Stability levels from -3 to +3
export const STABILITY_LEVELS: StabilityLevel[] = [
  {
    level: -3,
    name: 'Total Collapse',
    effects: [
      { type: 'tax_income', value: -33 },
      { type: 'manpower_recovery', value: -33 },
      { type: 'global_unrest', value: 6 },
      { type: 'monthly_autonomy', value: 0.1 }
    ],
    monthlyChange: -0.5
  },
  {
    level: -2,
    name: 'Severe Instability',
    effects: [
      { type: 'tax_income', value: -20 },
      { type: 'manpower_recovery', value: -20 },
      { type: 'global_unrest', value: 4 },
      { type: 'monthly_autonomy', value: 0.05 }
    ],
    monthlyChange: -0.3
  },
  {
    level: -1,
    name: 'Unstable',
    effects: [
      { type: 'tax_income', value: -10 },
      { type: 'manpower_recovery', value: -10 },
      { type: 'global_unrest', value: 2 }
    ],
    monthlyChange: -0.1
  },
  {
    level: 0,
    name: 'Neutral',
    effects: [],
    monthlyChange: 0
  },
  {
    level: 1,
    name: 'Stable',
    effects: [
      { type: 'tax_income', value: 5 },
      { type: 'missionary_strength', value: 0.5 }
    ],
    monthlyChange: 0.1
  },
  {
    level: 2,
    name: 'Prosperous',
    effects: [
      { type: 'tax_income', value: 10 },
      { type: 'missionary_strength', value: 1 },
      { type: 'global_unrest', value: -1 }
    ],
    monthlyChange: 0.2
  },
  {
    level: 3,
    name: 'Golden Era',
    effects: [
      { type: 'tax_income', value: 15 },
      { type: 'missionary_strength', value: 1.5 },
      { type: 'global_unrest', value: -2 },
      { type: 'prestige', value: 0.5 }
    ],
    monthlyChange: 0.3
  }
];

// Sources of unrest
export const UNREST_SOURCES: UnrestSource[] = [
  {
    id: 'war_exhaustion',
    name: 'War Exhaustion',
    category: 'war',
    baseUnrest: 1,
    monthlyDecay: 0.05
  },
  {
    id: 'recent_uprising',
    name: 'Recent Uprising',
    category: 'political',
    baseUnrest: 5,
    monthlyDecay: 0.1
  },
  {
    id: 'wrong_culture',
    name: 'Non-Accepted Culture',
    category: 'cultural',
    baseUnrest: 2,
    monthlyDecay: 0
  },
  {
    id: 'wrong_religion',
    name: 'Religious Minorities',
    category: 'religious',
    baseUnrest: 3,
    monthlyDecay: 0
  },
  {
    id: 'separatism',
    name: 'Separatism',
    category: 'cultural',
    baseUnrest: 5,
    monthlyDecay: 0.05
  },
  {
    id: 'high_autonomy',
    name: 'High Autonomy',
    category: 'economic',
    baseUnrest: 0,
    monthlyDecay: 0
  },
  {
    id: 'overextension',
    name: 'Overextension',
    category: 'political',
    baseUnrest: 2.5,
    monthlyDecay: 0
  },
  {
    id: 'harsh_treatment',
    name: 'Harsh Treatment',
    category: 'political',
    baseUnrest: -10,
    monthlyDecay: 0.1
  },
  {
    id: 'low_legitimacy',
    name: 'Low Legitimacy',
    category: 'political',
    baseUnrest: 2,
    monthlyDecay: 0
  },
  {
    id: 'bankruptcy',
    name: 'Bankruptcy',
    category: 'economic',
    baseUnrest: 5,
    monthlyDecay: 0
  },
  {
    id: 'corruption',
    name: 'Corruption',
    category: 'economic',
    baseUnrest: 0.5,
    monthlyDecay: 0
  },
  {
    id: 'devastation',
    name: 'War Devastation',
    category: 'war',
    baseUnrest: 4,
    monthlyDecay: 0.08
  }
];

// Stability cost modifiers
export const STABILITY_COSTS = {
  base: 100,
  perLevel: 50,
  warExhaustionMod: 5,
  overextensionMod: 1,
  corruptionMod: 2
};

// Get stability level data
export function getStabilityLevel(level: number): StabilityLevel | undefined {
  return STABILITY_LEVELS.find(s => s.level === level);
}

// Calculate stability cost
export function calculateStabilityCost(
  currentStability: number,
  targetStability: number,
  adminPower: number,
  modifiers: number = 0
): number {
  if (targetStability <= currentStability) return 0;

  const levelDiff = targetStability - currentStability;
  let cost = STABILITY_COSTS.base;

  for (let i = 1; i <= levelDiff; i++) {
    cost += STABILITY_COSTS.perLevel * (currentStability + i);
  }

  return Math.floor(cost * (1 + modifiers / 100));
}

// Calculate total unrest for a province
export function calculateProvinceUnrest(
  sources: { sourceId: string; value: number }[],
  globalUnrest: number,
  modifiers: number = 0
): number {
  let totalUnrest = globalUnrest;

  for (const source of sources) {
    const sourceData = UNREST_SOURCES.find(s => s.id === source.sourceId);
    if (sourceData) {
      totalUnrest += sourceData.baseUnrest * source.value;
    }
  }

  return Math.max(0, totalUnrest + modifiers);
}

// Get stability effects
export function getStabilityEffects(level: number): StabilityEffect[] {
  const stabilityLevel = getStabilityLevel(level);
  return stabilityLevel?.effects || [];
}

// Calculate rebel progress from unrest
export function calculateRebelProgress(
  unrest: number,
  autonomy: number,
  garrison: number
): number {
  if (unrest <= 0) return 0;

  const baseProgress = unrest * 0.5;
  const autonomyMod = (100 - autonomy) / 100;
  const garrisonMod = garrison > 0 ? 0.5 : 1;

  return baseProgress * autonomyMod * garrisonMod;
}

// Get unrest category color
export function getUnrestCategoryColor(category: UnrestCategory): string {
  const colors: Record<UnrestCategory, string> = {
    war: 'red',
    religious: 'purple',
    cultural: 'blue',
    economic: 'yellow',
    political: 'orange'
  };
  return colors[category];
}

// Check if rebellion will occur
export function willRebelOccur(progress: number): boolean {
  return progress >= 100;
}

export default {
  STABILITY_LEVELS,
  UNREST_SOURCES,
  STABILITY_COSTS,
  getStabilityLevel,
  calculateStabilityCost,
  calculateProvinceUnrest,
  getStabilityEffects,
  calculateRebelProgress,
  getUnrestCategoryColor,
  willRebelOccur
};
