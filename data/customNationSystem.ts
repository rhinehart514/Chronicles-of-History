// Custom nation creation system

export interface CustomNation {
  id: string;
  name: string;
  adjective: string;
  color: NationColor;
  flag: FlagDesign;
  mapColor: string;
  capital: string;
  culture: string;
  religion: string;
  government: string;
  techGroup: string;
  nationalIdeas: NationalIdea[];
  traits: NationTrait[];
  totalPoints: number;
}

export interface NationColor {
  primary: string;
  secondary: string;
  accent: string;
}

export interface FlagDesign {
  background: string;
  pattern: string;
  emblem: string;
  colors: string[];
}

export interface NationalIdea {
  id: string;
  name: string;
  effects: IdeaEffect[];
  cost: number;
}

export interface IdeaEffect {
  type: string;
  value: number;
  isPercent?: boolean;
}

export interface NationTrait {
  id: string;
  name: string;
  icon: string;
  effects: IdeaEffect[];
  cost: number;
  category: TraitCategory;
  description: string;
}

export type TraitCategory = 'military' | 'economic' | 'diplomatic' | 'administrative';

// Available nation traits
export const NATION_TRAITS: NationTrait[] = [
  // Military traits
  {
    id: 'martial_tradition',
    name: 'Martial Tradition',
    icon: '⚔️',
    effects: [
      { type: 'discipline', value: 5, isPercent: true },
      { type: 'army_tradition', value: 0.5 }
    ],
    cost: 50,
    category: 'military',
    description: 'A nation with deep military roots and traditions.'
  },
  {
    id: 'warrior_culture',
    name: 'Warrior Culture',
    icon: '🗡️',
    effects: [
      { type: 'land_morale', value: 10, isPercent: true },
      { type: 'manpower_recovery', value: 10, isPercent: true }
    ],
    cost: 40,
    category: 'military',
    description: 'Warriors are held in high regard in this society.'
  },
  {
    id: 'naval_tradition',
    name: 'Naval Tradition',
    icon: '⚓',
    effects: [
      { type: 'naval_morale', value: 15, isPercent: true },
      { type: 'navy_tradition', value: 1 }
    ],
    cost: 40,
    category: 'military',
    description: 'A nation of sailors and naval prowess.'
  },
  {
    id: 'fortification_experts',
    name: 'Fortification Experts',
    icon: '🏰',
    effects: [
      { type: 'defensiveness', value: 20, isPercent: true },
      { type: 'fort_maintenance', value: -15, isPercent: true }
    ],
    cost: 30,
    category: 'military',
    description: 'Masters of defensive warfare and fortification.'
  },

  // Economic traits
  {
    id: 'merchant_republic',
    name: 'Merchant Heritage',
    icon: '💰',
    effects: [
      { type: 'trade_efficiency', value: 15, isPercent: true },
      { type: 'global_trade_power', value: 10, isPercent: true }
    ],
    cost: 50,
    category: 'economic',
    description: 'A long history of commerce and trade.'
  },
  {
    id: 'industrious',
    name: 'Industrious',
    icon: '⚙️',
    effects: [
      { type: 'production_efficiency', value: 15, isPercent: true },
      { type: 'build_cost', value: -10, isPercent: true }
    ],
    cost: 40,
    category: 'economic',
    description: 'A nation known for its hardworking populace.'
  },
  {
    id: 'agrarian',
    name: 'Agrarian',
    icon: '🌾',
    effects: [
      { type: 'national_manpower', value: 20, isPercent: true },
      { type: 'production_efficiency', value: 10, isPercent: true }
    ],
    cost: 35,
    category: 'economic',
    description: 'An agricultural society with vast farmlands.'
  },
  {
    id: 'mining_tradition',
    name: 'Mining Tradition',
    icon: '⛏️',
    effects: [
      { type: 'goods_produced', value: 10, isPercent: true },
      { type: 'development_cost', value: -5, isPercent: true }
    ],
    cost: 30,
    category: 'economic',
    description: 'Rich in mineral resources and mining expertise.'
  },

  // Diplomatic traits
  {
    id: 'diplomatic_heritage',
    name: 'Diplomatic Heritage',
    icon: '🤝',
    effects: [
      { type: 'diplomatic_reputation', value: 2 },
      { type: 'improve_relations', value: 25, isPercent: true }
    ],
    cost: 45,
    category: 'diplomatic',
    description: 'A nation known for its skilled diplomats.'
  },
  {
    id: 'cultural_unity',
    name: 'Cultural Unity',
    icon: '🎭',
    effects: [
      { type: 'global_unrest', value: -2 },
      { type: 'stability_cost', value: -10, isPercent: true }
    ],
    cost: 35,
    category: 'diplomatic',
    description: 'A strong sense of national identity and unity.'
  },
  {
    id: 'religious_unity',
    name: 'Religious Unity',
    icon: '⛪',
    effects: [
      { type: 'tolerance_own', value: 2 },
      { type: 'missionary_strength', value: 1, isPercent: true }
    ],
    cost: 30,
    category: 'diplomatic',
    description: 'A deeply religious and unified people.'
  },

  // Administrative traits
  {
    id: 'bureaucratic',
    name: 'Bureaucratic',
    icon: '📜',
    effects: [
      { type: 'core_creation', value: -15, isPercent: true },
      { type: 'state_maintenance', value: -10, isPercent: true }
    ],
    cost: 45,
    category: 'administrative',
    description: 'An efficient and organized bureaucracy.'
  },
  {
    id: 'innovative',
    name: 'Innovative',
    icon: '💡',
    effects: [
      { type: 'tech_cost', value: -5, isPercent: true },
      { type: 'idea_cost', value: -10, isPercent: true }
    ],
    cost: 50,
    category: 'administrative',
    description: 'A forward-thinking society that embraces change.'
  },
  {
    id: 'traditional',
    name: 'Traditional',
    icon: '📚',
    effects: [
      { type: 'stability_cost', value: -15, isPercent: true },
      { type: 'legitimacy', value: 1 }
    ],
    cost: 30,
    category: 'administrative',
    description: 'A society that values tradition and stability.'
  }
];

// Default national idea templates
export const IDEA_TEMPLATES: { name: string; effects: IdeaEffect[] }[] = [
  { name: 'Discipline', effects: [{ type: 'discipline', value: 2.5, isPercent: true }] },
  { name: 'Morale', effects: [{ type: 'land_morale', value: 10, isPercent: true }] },
  { name: 'Trade Power', effects: [{ type: 'global_trade_power', value: 10, isPercent: true }] },
  { name: 'Tax Income', effects: [{ type: 'national_tax', value: 10, isPercent: true }] },
  { name: 'Manpower', effects: [{ type: 'national_manpower', value: 15, isPercent: true }] },
  { name: 'Technology', effects: [{ type: 'tech_cost', value: -5, isPercent: true }] },
  { name: 'Core Cost', effects: [{ type: 'core_creation', value: -10, isPercent: true }] },
  { name: 'Diplomacy', effects: [{ type: 'diplomatic_reputation', value: 1 }] }
];

// Get traits by category
export function getTraitsByCategory(category: TraitCategory): NationTrait[] {
  return NATION_TRAITS.filter(t => t.category === category);
}

// Calculate total trait cost
export function calculateTraitCost(traitIds: string[]): number {
  return traitIds.reduce((sum, id) => {
    const trait = NATION_TRAITS.find(t => t.id === id);
    return sum + (trait?.cost || 0);
  }, 0);
}

// Calculate total effects from traits
export function calculateTraitEffects(traitIds: string[]): Map<string, number> {
  const effects = new Map<string, number>();

  for (const id of traitIds) {
    const trait = NATION_TRAITS.find(t => t.id === id);
    if (!trait) continue;

    for (const effect of trait.effects) {
      const current = effects.get(effect.type) || 0;
      effects.set(effect.type, current + effect.value);
    }
  }

  return effects;
}

// Validate custom nation
export function validateCustomNation(
  nation: Partial<CustomNation>,
  maxPoints: number
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!nation.name || nation.name.length < 3) {
    errors.push('Nation name must be at least 3 characters');
  }

  if (!nation.capital) {
    errors.push('Must select a capital province');
  }

  if (!nation.culture) {
    errors.push('Must select a culture');
  }

  if (!nation.religion) {
    errors.push('Must select a religion');
  }

  if (nation.traits && calculateTraitCost(nation.traits.map(t => t.id)) > maxPoints) {
    errors.push('Trait cost exceeds maximum points');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export default {
  NATION_TRAITS,
  IDEA_TEMPLATES,
  getTraitsByCategory,
  calculateTraitCost,
  calculateTraitEffects,
  validateCustomNation
};
