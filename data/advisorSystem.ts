// Advisor system with hiring and bonuses

export interface Advisor {
  id: string;
  name: string;
  type: AdvisorType;
  skill: number;
  age: number;
  cost: number;
  effects: AdvisorEffect[];
  portrait?: string;
}

export interface AdvisorType {
  id: string;
  name: string;
  icon: string;
  category: 'administrative' | 'diplomatic' | 'military';
  baseEffects: AdvisorEffect[];
}

export interface AdvisorEffect {
  type: string;
  value: number;
  description: string;
}

// Default advisor types
export const ADVISOR_TYPES: AdvisorType[] = [
  // Administrative
  {
    id: 'treasurer',
    name: 'Treasurer',
    icon: '💰',
    category: 'administrative',
    baseEffects: [
      { type: 'global_tax', value: 10, description: '+10% Global tax' }
    ]
  },
  {
    id: 'philosopher',
    name: 'Philosopher',
    icon: '📚',
    category: 'administrative',
    baseEffects: [
      { type: 'technology_cost', value: -5, description: '-5% Technology cost' }
    ]
  },
  {
    id: 'theologian',
    name: 'Theologian',
    icon: '✝️',
    category: 'administrative',
    baseEffects: [
      { type: 'stability_cost', value: -10, description: '-10% Stability cost' }
    ]
  },
  {
    id: 'master_of_mint',
    name: 'Master of Mint',
    icon: '🪙',
    category: 'administrative',
    baseEffects: [
      { type: 'inflation_reduction', value: 0.1, description: '+0.1 Yearly inflation reduction' }
    ]
  },
  {
    id: 'inquisitor',
    name: 'Inquisitor',
    icon: '🔥',
    category: 'administrative',
    baseEffects: [
      { type: 'missionary_strength', value: 2, description: '+2% Missionary strength' }
    ]
  },

  // Diplomatic
  {
    id: 'statesman',
    name: 'Statesman',
    icon: '🏛️',
    category: 'diplomatic',
    baseEffects: [
      { type: 'diplomatic_reputation', value: 1, description: '+1 Diplomatic reputation' }
    ]
  },
  {
    id: 'trader',
    name: 'Trader',
    icon: '🚢',
    category: 'diplomatic',
    baseEffects: [
      { type: 'trade_efficiency', value: 10, description: '+10% Trade efficiency' }
    ]
  },
  {
    id: 'naval_reformer',
    name: 'Naval Reformer',
    icon: '⚓',
    category: 'diplomatic',
    baseEffects: [
      { type: 'naval_morale', value: 10, description: '+10% Naval morale' }
    ]
  },
  {
    id: 'spymaster',
    name: 'Spymaster',
    icon: '🕵️',
    category: 'diplomatic',
    baseEffects: [
      { type: 'spy_offense', value: 20, description: '+20% Spy network construction' }
    ]
  },
  {
    id: 'colonial_governor',
    name: 'Colonial Governor',
    icon: '🌍',
    category: 'diplomatic',
    baseEffects: [
      { type: 'global_colonial_growth', value: 15, description: '+15 Global settler increase' }
    ]
  },

  // Military
  {
    id: 'army_reformer',
    name: 'Army Reformer',
    icon: '⚔️',
    category: 'military',
    baseEffects: [
      { type: 'land_morale', value: 10, description: '+10% Land morale' }
    ]
  },
  {
    id: 'grand_captain',
    name: 'Grand Captain',
    icon: '🎖️',
    category: 'military',
    baseEffects: [
      { type: 'land_maintenance', value: -10, description: '-10% Land maintenance' }
    ]
  },
  {
    id: 'recruitmaster',
    name: 'Recruitmaster',
    icon: '👥',
    category: 'military',
    baseEffects: [
      { type: 'manpower_recovery', value: 10, description: '+10% Manpower recovery' }
    ]
  },
  {
    id: 'fortification_expert',
    name: 'Fortification Expert',
    icon: '🏰',
    category: 'military',
    baseEffects: [
      { type: 'fort_defense', value: 20, description: '+20% Fort defense' }
    ]
  },
  {
    id: 'quartermaster',
    name: 'Quartermaster',
    icon: '📦',
    category: 'military',
    baseEffects: [
      { type: 'reinforce_speed', value: 20, description: '+20% Reinforce speed' }
    ]
  }
];

// Generate a random advisor
export function generateAdvisor(
  typeId: string,
  year: number,
  costModifier: number = 0
): Advisor | null {
  const type = ADVISOR_TYPES.find(t => t.id === typeId);
  if (!type) return null;

  const skill = Math.floor(Math.random() * 3) + 1; // 1-3
  const age = Math.floor(Math.random() * 30) + 30; // 30-60
  const baseCost = skill * 3 * (1 + costModifier / 100);

  const names = [
    'Marco', 'Isabella', 'Johann', 'François', 'Ahmed',
    'Yuki', 'Vladimir', 'Chen', 'Miguel', 'Astrid'
  ];
  const surnames = [
    'Visconti', 'Habsburg', 'Tudor', 'Valois', 'Medici',
    'Sforza', 'Borgia', 'Stuart', 'Bourbon', 'Romanov'
  ];

  return {
    id: `advisor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: `${names[Math.floor(Math.random() * names.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`,
    type,
    skill,
    age,
    cost: Math.round(baseCost),
    effects: type.baseEffects.map(e => ({
      ...e,
      value: e.value * skill,
      description: e.description.replace(/\d+/, (match) => (parseInt(match) * skill).toString())
    }))
  };
}

// Calculate total advisor effects
export function calculateAdvisorEffects(
  advisors: Advisor[]
): Record<string, number> {
  const effects: Record<string, number> = {};

  for (const advisor of advisors) {
    for (const effect of advisor.effects) {
      effects[effect.type] = (effects[effect.type] || 0) + effect.value;
    }
  }

  return effects;
}

// Get advisor maintenance cost
export function getAdvisorMaintenance(
  advisor: Advisor,
  techLevel: number,
  modifiers: number = 0
): number {
  const baseCost = advisor.cost * (1 + techLevel * 0.5);
  return Math.round(baseCost * (1 + modifiers / 100));
}

export default {
  ADVISOR_TYPES,
  generateAdvisor,
  calculateAdvisorEffects,
  getAdvisorMaintenance
};
