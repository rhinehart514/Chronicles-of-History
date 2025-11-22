// Dynasty and succession system

export interface Dynasty {
  id: string;
  name: string;
  foundedYear: number;
  originCulture: string;
  prestige: number;
  legitimacy: number;
  traits: DynastyTrait[];
}

export interface Ruler {
  id: string;
  name: string;
  dynastyId: string;
  birthYear: number;
  deathYear?: number;
  stats: RulerStats;
  traits: RulerTrait[];
  isAlive: boolean;
}

export interface RulerStats {
  admin: number;
  diplo: number;
  military: number;
}

export interface Heir {
  id: string;
  name: string;
  dynastyId: string;
  birthYear: number;
  stats: RulerStats;
  claimStrength: number;
  traits: RulerTrait[];
}

export interface RulerTrait {
  id: string;
  name: string;
  icon: string;
  effects: TraitEffect[];
  description: string;
}

export interface TraitEffect {
  type: string;
  value: number;
}

export interface DynastyTrait {
  id: string;
  name: string;
  icon: string;
  effects: TraitEffect[];
  description: string;
}

export type SuccessionType =
  | 'primogeniture'
  | 'elective'
  | 'seniority'
  | 'tanistry'
  | 'appointment';

export interface SuccessionLaw {
  id: string;
  name: string;
  type: SuccessionType;
  description: string;
  requirements: SuccessionRequirement[];
  effects: TraitEffect[];
}

export interface SuccessionRequirement {
  type: string;
  value: string | number | boolean;
}

// Ruler traits
export const RULER_TRAITS: RulerTrait[] = [
  {
    id: 'just',
    name: 'Just',
    icon: '⚖️',
    effects: [
      { type: 'unrest', value: -2 },
      { type: 'legitimacy', value: 1 }
    ],
    description: 'This ruler is known for fair and just rulings.'
  },
  {
    id: 'cruel',
    name: 'Cruel',
    icon: '😈',
    effects: [
      { type: 'unrest', value: 3 },
      { type: 'discipline', value: 5 }
    ],
    description: 'This ruler rules through fear and intimidation.'
  },
  {
    id: 'scholar',
    name: 'Scholar',
    icon: '📚',
    effects: [
      { type: 'tech_cost', value: -5 },
      { type: 'institution_spread', value: 10 }
    ],
    description: 'This ruler values learning and scholarship.'
  },
  {
    id: 'warrior',
    name: 'Warrior',
    icon: '⚔️',
    effects: [
      { type: 'army_morale', value: 10 },
      { type: 'land_leader_shock', value: 1 }
    ],
    description: 'This ruler leads from the front in battle.'
  },
  {
    id: 'administrator',
    name: 'Administrator',
    icon: '📋',
    effects: [
      { type: 'advisor_cost', value: -15 },
      { type: 'build_cost', value: -10 }
    ],
    description: 'This ruler excels at managing the realm.'
  },
  {
    id: 'diplomat',
    name: 'Diplomat',
    icon: '🤝',
    effects: [
      { type: 'diplomatic_reputation', value: 2 },
      { type: 'improve_relations', value: 25 }
    ],
    description: 'This ruler is skilled in diplomacy and negotiation.'
  },
  {
    id: 'pious',
    name: 'Pious',
    icon: '🙏',
    effects: [
      { type: 'missionary_strength', value: 2 },
      { type: 'tolerance_own', value: 2 }
    ],
    description: 'This ruler is deeply devoted to their faith.'
  },
  {
    id: 'tolerant',
    name: 'Tolerant',
    icon: '☮️',
    effects: [
      { type: 'tolerance_heretic', value: 2 },
      { type: 'tolerance_heathen', value: 2 }
    ],
    description: 'This ruler accepts people of different faiths.'
  },
  {
    id: 'greedy',
    name: 'Greedy',
    icon: '💰',
    effects: [
      { type: 'tax_income', value: 10 },
      { type: 'corruption', value: 0.1 }
    ],
    description: 'This ruler is obsessed with accumulating wealth.'
  },
  {
    id: 'paranoid',
    name: 'Paranoid',
    icon: '👁️',
    effects: [
      { type: 'spy_offense', value: 25 },
      { type: 'diplomatic_reputation', value: -1 }
    ],
    description: 'This ruler sees conspiracies everywhere.'
  },
  {
    id: 'charismatic',
    name: 'Charismatic',
    icon: '✨',
    effects: [
      { type: 'prestige', value: 1 },
      { type: 'legitimacy', value: 1 }
    ],
    description: 'This ruler inspires loyalty and admiration.'
  },
  {
    id: 'sickly',
    name: 'Sickly',
    icon: '🤒',
    effects: [
      { type: 'life_expectancy', value: -10 }
    ],
    description: 'This ruler suffers from poor health.'
  }
];

// Dynasty traits
export const DYNASTY_TRAITS: DynastyTrait[] = [
  {
    id: 'ancient_lineage',
    name: 'Ancient Lineage',
    icon: '🏛️',
    effects: [
      { type: 'legitimacy', value: 0.5 },
      { type: 'prestige', value: 0.5 }
    ],
    description: 'This dynasty claims descent from ancient rulers.'
  },
  {
    id: 'conquerors',
    name: 'Conquerors',
    icon: '🗡️',
    effects: [
      { type: 'core_creation', value: -10 },
      { type: 'war_exhaustion', value: -0.05 }
    ],
    description: 'This dynasty is known for military conquest.'
  },
  {
    id: 'merchant_princes',
    name: 'Merchant Princes',
    icon: '🏪',
    effects: [
      { type: 'trade_efficiency', value: 10 },
      { type: 'global_tariffs', value: 10 }
    ],
    description: 'This dynasty built its wealth through trade.'
  },
  {
    id: 'fertile',
    name: 'Fertile',
    icon: '👶',
    effects: [
      { type: 'heir_chance', value: 50 }
    ],
    description: 'This dynasty produces many heirs.'
  },
  {
    id: 'cursed',
    name: 'Cursed',
    icon: '💀',
    effects: [
      { type: 'heir_chance', value: -25 },
      { type: 'life_expectancy', value: -5 }
    ],
    description: 'This dynasty seems to be afflicted by misfortune.'
  }
];

// Succession laws
export const SUCCESSION_LAWS: SuccessionLaw[] = [
  {
    id: 'male_primogeniture',
    name: 'Male Primogeniture',
    type: 'primogeniture',
    description: 'The eldest son inherits the throne.',
    requirements: [],
    effects: [
      { type: 'legitimacy', value: 1 }
    ]
  },
  {
    id: 'absolute_primogeniture',
    name: 'Absolute Primogeniture',
    type: 'primogeniture',
    description: 'The eldest child inherits regardless of gender.',
    requirements: [
      { type: 'reform', value: 'equal_rights' }
    ],
    effects: [
      { type: 'legitimacy', value: 0.5 }
    ]
  },
  {
    id: 'elective_monarchy',
    name: 'Elective Monarchy',
    type: 'elective',
    description: 'The nobles elect the next ruler.',
    requirements: [],
    effects: [
      { type: 'noble_loyalty', value: 10 },
      { type: 'legitimacy', value: -0.5 }
    ]
  },
  {
    id: 'seniority',
    name: 'Seniority',
    type: 'seniority',
    description: 'The oldest member of the dynasty inherits.',
    requirements: [],
    effects: [
      { type: 'stability', value: 0.5 }
    ]
  },
  {
    id: 'tanistry',
    name: 'Tanistry',
    type: 'tanistry',
    description: 'The most capable adult relative inherits.',
    requirements: [
      { type: 'culture_group', value: 'celtic' }
    ],
    effects: [
      { type: 'heir_stats', value: 1 }
    ]
  },
  {
    id: 'appointment',
    name: 'Appointment',
    type: 'appointment',
    description: 'The ruler appoints their successor.',
    requirements: [
      { type: 'government', value: 'autocracy' }
    ],
    effects: [
      { type: 'legitimacy', value: -1 },
      { type: 'stability_cost', value: 25 }
    ]
  }
];

// Generate random ruler stats
export function generateRulerStats(): RulerStats {
  return {
    admin: Math.floor(Math.random() * 6),
    diplo: Math.floor(Math.random() * 6),
    military: Math.floor(Math.random() * 6)
  };
}

// Get random trait
export function getRandomTrait(): RulerTrait {
  return RULER_TRAITS[Math.floor(Math.random() * RULER_TRAITS.length)];
}

// Calculate ruler quality
export function calculateRulerQuality(stats: RulerStats): 'poor' | 'average' | 'good' | 'excellent' {
  const total = stats.admin + stats.diplo + stats.military;
  if (total <= 6) return 'poor';
  if (total <= 9) return 'average';
  if (total <= 12) return 'good';
  return 'excellent';
}

// Get heir claim strength description
export function getClaimDescription(strength: number): string {
  if (strength >= 90) return 'Strong';
  if (strength >= 60) return 'Average';
  if (strength >= 30) return 'Weak';
  return 'Contested';
}

// Calculate succession stability cost
export function calculateSuccessionCost(
  legitimacy: number,
  claimStrength: number
): number {
  const legPenalty = Math.max(0, 50 - legitimacy) * 2;
  const claimPenalty = Math.max(0, 50 - claimStrength) * 1.5;
  return Math.round(legPenalty + claimPenalty);
}

// Get dynasty prestige level
export function getDynastyPrestigeLevel(prestige: number): string {
  if (prestige >= 100) return 'Legendary';
  if (prestige >= 75) return 'Renowned';
  if (prestige >= 50) return 'Respected';
  if (prestige >= 25) return 'Known';
  return 'Obscure';
}

export default {
  RULER_TRAITS,
  DYNASTY_TRAITS,
  SUCCESSION_LAWS,
  generateRulerStats,
  getRandomTrait,
  calculateRulerQuality,
  getClaimDescription,
  calculateSuccessionCost,
  getDynastyPrestigeLevel
};
