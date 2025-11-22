// Global and local modifier system

export interface Modifier {
  id: string;
  name: string;
  icon: string;
  type: ModifierType;
  scope: ModifierScope;
  effects: ModifierEffect[];
  duration?: number;
  expiresOn?: string;
  source: string;
  stackable: boolean;
}

export type ModifierType =
  | 'military'
  | 'economic'
  | 'diplomatic'
  | 'administrative'
  | 'religious'
  | 'cultural'
  | 'provincial';

export type ModifierScope = 'national' | 'provincial' | 'ruler' | 'army' | 'navy';

export interface ModifierEffect {
  stat: string;
  value: number;
  isPercentage: boolean;
}

export interface ModifierCategory {
  id: string;
  name: string;
  icon: string;
  stats: StatDefinition[];
}

export interface StatDefinition {
  id: string;
  name: string;
  category: string;
  isPositiveGood: boolean;
  format: 'percentage' | 'flat' | 'boolean';
}

// All modifier categories and stats
export const MODIFIER_CATEGORIES: ModifierCategory[] = [
  {
    id: 'military',
    name: 'Military',
    icon: '⚔️',
    stats: [
      { id: 'discipline', name: 'Discipline', category: 'military', isPositiveGood: true, format: 'percentage' },
      { id: 'morale', name: 'Morale', category: 'military', isPositiveGood: true, format: 'percentage' },
      { id: 'army_tradition', name: 'Army Tradition', category: 'military', isPositiveGood: true, format: 'flat' },
      { id: 'manpower_recovery', name: 'Manpower Recovery', category: 'military', isPositiveGood: true, format: 'percentage' },
      { id: 'land_forcelimit', name: 'Land Force Limit', category: 'military', isPositiveGood: true, format: 'percentage' },
      { id: 'naval_forcelimit', name: 'Naval Force Limit', category: 'military', isPositiveGood: true, format: 'percentage' },
      { id: 'siege_ability', name: 'Siege Ability', category: 'military', isPositiveGood: true, format: 'percentage' },
      { id: 'war_exhaustion', name: 'War Exhaustion', category: 'military', isPositiveGood: false, format: 'flat' }
    ]
  },
  {
    id: 'economic',
    name: 'Economic',
    icon: '💰',
    stats: [
      { id: 'tax_income', name: 'Tax Income', category: 'economic', isPositiveGood: true, format: 'percentage' },
      { id: 'production_efficiency', name: 'Production Efficiency', category: 'economic', isPositiveGood: true, format: 'percentage' },
      { id: 'trade_efficiency', name: 'Trade Efficiency', category: 'economic', isPositiveGood: true, format: 'percentage' },
      { id: 'global_tariffs', name: 'Global Tariffs', category: 'economic', isPositiveGood: true, format: 'percentage' },
      { id: 'build_cost', name: 'Build Cost', category: 'economic', isPositiveGood: false, format: 'percentage' },
      { id: 'advisor_cost', name: 'Advisor Cost', category: 'economic', isPositiveGood: false, format: 'percentage' },
      { id: 'inflation', name: 'Inflation', category: 'economic', isPositiveGood: false, format: 'flat' },
      { id: 'interest', name: 'Interest', category: 'economic', isPositiveGood: false, format: 'percentage' }
    ]
  },
  {
    id: 'diplomatic',
    name: 'Diplomatic',
    icon: '🤝',
    stats: [
      { id: 'diplomatic_reputation', name: 'Diplomatic Reputation', category: 'diplomatic', isPositiveGood: true, format: 'flat' },
      { id: 'improve_relations', name: 'Improve Relations', category: 'diplomatic', isPositiveGood: true, format: 'percentage' },
      { id: 'prestige', name: 'Prestige', category: 'diplomatic', isPositiveGood: true, format: 'flat' },
      { id: 'ae_impact', name: 'AE Impact', category: 'diplomatic', isPositiveGood: false, format: 'percentage' },
      { id: 'diplomatic_annexation', name: 'Diplomatic Annexation', category: 'diplomatic', isPositiveGood: true, format: 'percentage' },
      { id: 'envoy_travel_time', name: 'Envoy Travel Time', category: 'diplomatic', isPositiveGood: false, format: 'percentage' }
    ]
  },
  {
    id: 'administrative',
    name: 'Administrative',
    icon: '📋',
    stats: [
      { id: 'stability_cost', name: 'Stability Cost', category: 'administrative', isPositiveGood: false, format: 'percentage' },
      { id: 'core_creation', name: 'Core Creation Cost', category: 'administrative', isPositiveGood: false, format: 'percentage' },
      { id: 'tech_cost', name: 'Tech Cost', category: 'administrative', isPositiveGood: false, format: 'percentage' },
      { id: 'idea_cost', name: 'Idea Cost', category: 'administrative', isPositiveGood: false, format: 'percentage' },
      { id: 'corruption', name: 'Corruption', category: 'administrative', isPositiveGood: false, format: 'flat' },
      { id: 'legitimacy', name: 'Legitimacy', category: 'administrative', isPositiveGood: true, format: 'flat' }
    ]
  },
  {
    id: 'religious',
    name: 'Religious',
    icon: '⛪',
    stats: [
      { id: 'missionary_strength', name: 'Missionary Strength', category: 'religious', isPositiveGood: true, format: 'percentage' },
      { id: 'tolerance_own', name: 'Tolerance of True Faith', category: 'religious', isPositiveGood: true, format: 'flat' },
      { id: 'tolerance_heretic', name: 'Tolerance of Heretics', category: 'religious', isPositiveGood: true, format: 'flat' },
      { id: 'tolerance_heathen', name: 'Tolerance of Heathens', category: 'religious', isPositiveGood: true, format: 'flat' },
      { id: 'papal_influence', name: 'Papal Influence', category: 'religious', isPositiveGood: true, format: 'flat' }
    ]
  },
  {
    id: 'provincial',
    name: 'Provincial',
    icon: '🏘️',
    stats: [
      { id: 'local_development_cost', name: 'Development Cost', category: 'provincial', isPositiveGood: false, format: 'percentage' },
      { id: 'local_unrest', name: 'Local Unrest', category: 'provincial', isPositiveGood: false, format: 'flat' },
      { id: 'local_autonomy', name: 'Local Autonomy', category: 'provincial', isPositiveGood: false, format: 'flat' },
      { id: 'devastation', name: 'Devastation', category: 'provincial', isPositiveGood: false, format: 'flat' },
      { id: 'local_defensiveness', name: 'Fort Defense', category: 'provincial', isPositiveGood: true, format: 'percentage' }
    ]
  }
];

// Common game modifiers
export const COMMON_MODIFIERS: Modifier[] = [
  {
    id: 'strong_army_tradition',
    name: 'Strong Army Tradition',
    icon: '🎖️',
    type: 'military',
    scope: 'national',
    effects: [
      { stat: 'morale', value: 10, isPercentage: true },
      { stat: 'discipline', value: 2.5, isPercentage: true }
    ],
    source: 'High army tradition',
    stackable: false
  },
  {
    id: 'war_taxes',
    name: 'War Taxes',
    icon: '💸',
    type: 'economic',
    scope: 'national',
    effects: [
      { stat: 'tax_income', value: 50, isPercentage: true },
      { stat: 'war_exhaustion', value: 0.5, isPercentage: false }
    ],
    duration: 24,
    source: 'Enabled war taxes',
    stackable: false
  },
  {
    id: 'golden_age',
    name: 'Golden Age',
    icon: '✨',
    type: 'administrative',
    scope: 'national',
    effects: [
      { stat: 'tax_income', value: 10, isPercentage: true },
      { stat: 'prestige', value: 1, isPercentage: false },
      { stat: 'legitimacy', value: 1, isPercentage: false }
    ],
    duration: 600,
    source: 'Declared golden age',
    stackable: false
  },
  {
    id: 'innovativeness_gain',
    name: 'Ahead of Time',
    icon: '💡',
    type: 'administrative',
    scope: 'national',
    effects: [
      { stat: 'tech_cost', value: -10, isPercentage: true },
      { stat: 'idea_cost', value: -10, isPercentage: true }
    ],
    source: 'High innovativeness',
    stackable: false
  },
  {
    id: 'recent_occupation',
    name: 'Recent Occupation',
    icon: '🏴',
    type: 'provincial',
    scope: 'provincial',
    effects: [
      { stat: 'local_unrest', value: 5, isPercentage: false },
      { stat: 'local_autonomy', value: 25, isPercentage: false }
    ],
    duration: 120,
    source: 'Recently occupied',
    stackable: false
  }
];

// Get stat definition
export function getStatDefinition(statId: string): StatDefinition | undefined {
  for (const category of MODIFIER_CATEGORIES) {
    const stat = category.stats.find(s => s.id === statId);
    if (stat) return stat;
  }
  return undefined;
}

// Format modifier value
export function formatModifierValue(effect: ModifierEffect): string {
  const stat = getStatDefinition(effect.stat);
  if (!stat) return `${effect.value}`;

  const prefix = effect.value > 0 ? '+' : '';
  const suffix = effect.isPercentage || stat.format === 'percentage' ? '%' : '';

  return `${prefix}${effect.value}${suffix}`;
}

// Determine if effect is beneficial
export function isEffectBeneficial(effect: ModifierEffect): boolean {
  const stat = getStatDefinition(effect.stat);
  if (!stat) return effect.value > 0;

  return stat.isPositiveGood ? effect.value > 0 : effect.value < 0;
}

// Aggregate modifiers by stat
export function aggregateModifiers(
  modifiers: Modifier[]
): Map<string, number> {
  const result = new Map<string, number>();

  for (const mod of modifiers) {
    for (const effect of mod.effects) {
      const current = result.get(effect.stat) || 0;
      result.set(effect.stat, current + effect.value);
    }
  }

  return result;
}

// Get modifiers by type
export function getModifiersByType(
  modifiers: Modifier[],
  type: ModifierType
): Modifier[] {
  return modifiers.filter(m => m.type === type);
}

// Check if modifier is active
export function isModifierActive(
  modifier: Modifier,
  currentDate: string
): boolean {
  if (!modifier.expiresOn) return true;
  return modifier.expiresOn > currentDate;
}

// Calculate remaining duration
export function getRemainingDuration(
  modifier: Modifier,
  currentDate: string
): number | undefined {
  if (!modifier.expiresOn || !modifier.duration) return undefined;
  // Simplified - would need date math in real implementation
  return modifier.duration;
}

export default {
  MODIFIER_CATEGORIES,
  COMMON_MODIFIERS,
  getStatDefinition,
  formatModifierValue,
  isEffectBeneficial,
  aggregateModifiers,
  getModifiersByType,
  isModifierActive,
  getRemainingDuration
};
