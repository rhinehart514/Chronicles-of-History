// Province modifiers and local effects system

export interface ProvinceModifier {
  id: string;
  name: string;
  icon: string;
  category: ModifierCategory;
  effects: ModifierEffect[];
  duration?: number;
  isPermanent: boolean;
  description: string;
}

export type ModifierCategory =
  | 'prosperity'
  | 'devastation'
  | 'event'
  | 'building'
  | 'policy'
  | 'disaster';

export interface ModifierEffect {
  type: string;
  value: number;
  isPercent?: boolean;
}

// Common province modifiers
export const PROVINCE_MODIFIERS: ProvinceModifier[] = [
  // Prosperity modifiers
  {
    id: 'prosperity',
    name: 'Prosperity',
    icon: '✨',
    category: 'prosperity',
    effects: [
      { type: 'local_production', value: 25, isPercent: true },
      { type: 'local_tax', value: 10, isPercent: true },
      { type: 'local_development_cost', value: -10, isPercent: true }
    ],
    isPermanent: false,
    description: 'The province is experiencing economic prosperity.'
  },
  {
    id: 'recent_uprising',
    name: 'Recent Uprising',
    icon: '🔥',
    category: 'devastation',
    effects: [
      { type: 'local_unrest', value: 10 },
      { type: 'local_tax', value: -50, isPercent: true },
      { type: 'local_manpower', value: -50, isPercent: true }
    ],
    duration: 120,
    isPermanent: false,
    description: 'The province recently experienced a rebellion.'
  },
  {
    id: 'looted',
    name: 'Looted',
    icon: '💀',
    category: 'devastation',
    effects: [
      { type: 'local_production', value: -50, isPercent: true },
      { type: 'local_tax', value: -50, isPercent: true },
      { type: 'local_manpower', value: -75, isPercent: true }
    ],
    duration: 60,
    isPermanent: false,
    description: 'The province has been looted by enemy forces.'
  },
  {
    id: 'plague',
    name: 'Plague',
    icon: '☠️',
    category: 'disaster',
    effects: [
      { type: 'local_manpower', value: -90, isPercent: true },
      { type: 'local_tax', value: -50, isPercent: true },
      { type: 'local_development_cost', value: 100, isPercent: true }
    ],
    duration: 24,
    isPermanent: false,
    description: 'A deadly plague is ravaging the province.'
  },
  {
    id: 'famine',
    name: 'Famine',
    icon: '🥀',
    category: 'disaster',
    effects: [
      { type: 'local_unrest', value: 8 },
      { type: 'local_manpower', value: -50, isPercent: true },
      { type: 'local_production', value: -75, isPercent: true }
    ],
    duration: 36,
    isPermanent: false,
    description: 'Crop failures have led to widespread famine.'
  },

  // Event modifiers
  {
    id: 'bountiful_harvest',
    name: 'Bountiful Harvest',
    icon: '🌾',
    category: 'event',
    effects: [
      { type: 'local_production', value: 50, isPercent: true },
      { type: 'local_manpower', value: 25, isPercent: true }
    ],
    duration: 60,
    isPermanent: false,
    description: 'An exceptionally good harvest this year.'
  },
  {
    id: 'gold_rush',
    name: 'Gold Rush',
    icon: '⛏️',
    category: 'event',
    effects: [
      { type: 'local_production', value: 100, isPercent: true },
      { type: 'local_development_cost', value: -25, isPercent: true }
    ],
    duration: 120,
    isPermanent: false,
    description: 'Gold has been discovered in this province.'
  },
  {
    id: 'center_of_trade',
    name: 'Center of Trade',
    icon: '🏪',
    category: 'building',
    effects: [
      { type: 'local_trade_power', value: 10 },
      { type: 'local_development_cost', value: -10, isPercent: true }
    ],
    isPermanent: true,
    description: 'A major trading hub in the region.'
  },
  {
    id: 'natural_harbor',
    name: 'Natural Harbor',
    icon: '⚓',
    category: 'building',
    effects: [
      { type: 'local_sailors', value: 25, isPercent: true },
      { type: 'naval_forcelimit', value: 2 },
      { type: 'local_ship_cost', value: -10, isPercent: true }
    ],
    isPermanent: true,
    description: 'A naturally protected harbor ideal for naval operations.'
  },
  {
    id: 'river_estuary',
    name: 'River Estuary',
    icon: '🌊',
    category: 'building',
    effects: [
      { type: 'local_trade_power', value: 5 },
      { type: 'local_development_cost', value: -5, isPercent: true }
    ],
    isPermanent: true,
    description: 'Located at a river mouth, ideal for trade.'
  },

  // Policy modifiers
  {
    id: 'harsh_treatment',
    name: 'Harsh Treatment',
    icon: '⚔️',
    category: 'policy',
    effects: [
      { type: 'local_unrest', value: -5 },
      { type: 'local_autonomy_change', value: -0.05 }
    ],
    duration: 120,
    isPermanent: false,
    description: 'Rebels in this province have been harshly dealt with.'
  },
  {
    id: 'decreased_autonomy',
    name: 'Decreased Autonomy',
    icon: '📜',
    category: 'policy',
    effects: [
      { type: 'local_unrest', value: 10 },
      { type: 'local_autonomy', value: -25 }
    ],
    duration: 360,
    isPermanent: false,
    description: 'Local autonomy has been forcibly reduced.'
  },
  {
    id: 'granted_autonomy',
    name: 'Increased Autonomy',
    icon: '🤝',
    category: 'policy',
    effects: [
      { type: 'local_unrest', value: -10 },
      { type: 'local_autonomy', value: 25 }
    ],
    duration: 360,
    isPermanent: false,
    description: 'Local autonomy has been granted to calm unrest.'
  }
];

// Get modifier by id
export function getModifier(id: string): ProvinceModifier | undefined {
  return PROVINCE_MODIFIERS.find(m => m.id === id);
}

// Get modifiers by category
export function getModifiersByCategory(category: ModifierCategory): ProvinceModifier[] {
  return PROVINCE_MODIFIERS.filter(m => m.category === category);
}

// Calculate total effects from multiple modifiers
export function calculateTotalEffects(
  modifierIds: string[]
): Map<string, number> {
  const effects = new Map<string, number>();

  for (const id of modifierIds) {
    const modifier = getModifier(id);
    if (!modifier) continue;

    for (const effect of modifier.effects) {
      const current = effects.get(effect.type) || 0;
      effects.set(effect.type, current + effect.value);
    }
  }

  return effects;
}

// Format modifier effect for display
export function formatEffect(effect: ModifierEffect): string {
  const sign = effect.value >= 0 ? '+' : '';
  const suffix = effect.isPercent ? '%' : '';
  return `${sign}${effect.value}${suffix} ${effect.type.replace(/_/g, ' ')}`;
}

// Get modifier icon color based on category
export function getModifierColor(category: ModifierCategory): string {
  switch (category) {
    case 'prosperity': return 'text-green-400';
    case 'devastation': return 'text-red-400';
    case 'event': return 'text-blue-400';
    case 'building': return 'text-amber-400';
    case 'policy': return 'text-purple-400';
    case 'disaster': return 'text-red-500';
  }
}

export default {
  PROVINCE_MODIFIERS,
  getModifier,
  getModifiersByCategory,
  calculateTotalEffects,
  formatEffect,
  getModifierColor
};
