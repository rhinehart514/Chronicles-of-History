// Government reform system

export interface Reform {
  id: string;
  name: string;
  icon: string;
  tier: number;
  description: string;
  effects: ReformEffect[];
  requirements: ReformRequirement[];
  cost: number;
  mutuallyExclusive: string[];
}

export interface ReformEffect {
  type: string;
  value: number | string;
  description: string;
}

export interface ReformRequirement {
  type: 'tech' | 'year' | 'reform' | 'stat' | 'government';
  value: string | number;
}

// Default government reforms organized by tier
export const GOVERNMENT_REFORMS: Reform[] = [
  // Tier 1 - Basic Administration
  {
    id: 'feudal_nobility',
    name: 'Feudal Nobility',
    icon: '🏰',
    tier: 1,
    description: 'Power shared with noble families',
    effects: [
      { type: 'manpower', value: 10, description: '+10% National manpower' },
      { type: 'autonomy_change', value: 0.05, description: '+0.05 Monthly autonomy change' }
    ],
    requirements: [],
    cost: 0,
    mutuallyExclusive: ['centralized_bureaucracy', 'merchant_republic']
  },
  {
    id: 'centralized_bureaucracy',
    name: 'Centralized Bureaucracy',
    icon: '📋',
    tier: 1,
    description: 'Strong central administration',
    effects: [
      { type: 'admin_efficiency', value: 10, description: '+10% Administrative efficiency' },
      { type: 'autonomy_change', value: -0.03, description: '-0.03 Monthly autonomy change' }
    ],
    requirements: [],
    cost: 0,
    mutuallyExclusive: ['feudal_nobility', 'merchant_republic']
  },
  {
    id: 'merchant_republic',
    name: 'Merchant Republic',
    icon: '💰',
    tier: 1,
    description: 'Rule by wealthy merchants',
    effects: [
      { type: 'trade_efficiency', value: 20, description: '+20% Trade efficiency' },
      { type: 'republican_tradition', value: 0.5, description: '+0.5 Yearly republican tradition' }
    ],
    requirements: [
      { type: 'government', value: 'republic' }
    ],
    cost: 0,
    mutuallyExclusive: ['feudal_nobility', 'centralized_bureaucracy']
  },

  // Tier 2 - Military Organization
  {
    id: 'professional_military',
    name: 'Professional Military',
    icon: '⚔️',
    tier: 2,
    description: 'A well-trained standing army',
    effects: [
      { type: 'discipline', value: 5, description: '+5% Discipline' },
      { type: 'army_maintenance', value: 10, description: '+10% Army maintenance' }
    ],
    requirements: [
      { type: 'tech', value: 10 }
    ],
    cost: 25,
    mutuallyExclusive: ['militia_system', 'mercenary_tradition']
  },
  {
    id: 'militia_system',
    name: 'Militia System',
    icon: '🛡️',
    tier: 2,
    description: 'Citizens serve as part-time soldiers',
    effects: [
      { type: 'manpower', value: 25, description: '+25% National manpower' },
      { type: 'land_morale', value: -5, description: '-5% Land morale' }
    ],
    requirements: [],
    cost: 25,
    mutuallyExclusive: ['professional_military', 'mercenary_tradition']
  },
  {
    id: 'mercenary_tradition',
    name: 'Mercenary Tradition',
    icon: '🎖️',
    tier: 2,
    description: 'Rely on hired soldiers',
    effects: [
      { type: 'mercenary_cost', value: -25, description: '-25% Mercenary cost' },
      { type: 'mercenary_discipline', value: 5, description: '+5% Mercenary discipline' }
    ],
    requirements: [],
    cost: 25,
    mutuallyExclusive: ['professional_military', 'militia_system']
  },

  // Tier 3 - Economic Policy
  {
    id: 'free_enterprise',
    name: 'Free Enterprise',
    icon: '🏪',
    tier: 3,
    description: 'Minimal government interference in economy',
    effects: [
      { type: 'production_efficiency', value: 15, description: '+15% Production efficiency' },
      { type: 'global_tax', value: -10, description: '-10% Global tax' }
    ],
    requirements: [
      { type: 'tech', value: 15 }
    ],
    cost: 50,
    mutuallyExclusive: ['state_monopolies', 'guild_system']
  },
  {
    id: 'state_monopolies',
    name: 'State Monopolies',
    icon: '🏛️',
    tier: 3,
    description: 'Government controls key industries',
    effects: [
      { type: 'global_tax', value: 15, description: '+15% Global tax' },
      { type: 'production_efficiency', value: -10, description: '-10% Production efficiency' }
    ],
    requirements: [],
    cost: 50,
    mutuallyExclusive: ['free_enterprise', 'guild_system']
  },
  {
    id: 'guild_system',
    name: 'Guild System',
    icon: '🔨',
    tier: 3,
    description: 'Production controlled by trade guilds',
    effects: [
      { type: 'goods_produced', value: 10, description: '+10% Goods produced' },
      { type: 'innovation', value: -0.5, description: '-0.5 Yearly innovation' }
    ],
    requirements: [],
    cost: 50,
    mutuallyExclusive: ['free_enterprise', 'state_monopolies']
  },

  // Tier 4 - Religious Policy
  {
    id: 'state_religion',
    name: 'State Religion',
    icon: '⛪',
    tier: 4,
    description: 'One official religion',
    effects: [
      { type: 'stability_cost', value: -15, description: '-15% Stability cost' },
      { type: 'tolerance_heretics', value: -2, description: '-2 Tolerance of heretics' }
    ],
    requirements: [],
    cost: 50,
    mutuallyExclusive: ['religious_freedom', 'secular_state']
  },
  {
    id: 'religious_freedom',
    name: 'Religious Freedom',
    icon: '☮️',
    tier: 4,
    description: 'All religions tolerated',
    effects: [
      { type: 'tolerance_heretics', value: 2, description: '+2 Tolerance of heretics' },
      { type: 'tolerance_heathens', value: 1, description: '+1 Tolerance of heathens' }
    ],
    requirements: [
      { type: 'tech', value: 20 }
    ],
    cost: 50,
    mutuallyExclusive: ['state_religion', 'secular_state']
  },
  {
    id: 'secular_state',
    name: 'Secular State',
    icon: '⚖️',
    tier: 4,
    description: 'Separation of church and state',
    effects: [
      { type: 'advisor_cost', value: -10, description: '-10% Advisor cost' },
      { type: 'papal_influence', value: -2, description: '-2 Yearly papal influence' }
    ],
    requirements: [
      { type: 'tech', value: 25 }
    ],
    cost: 50,
    mutuallyExclusive: ['state_religion', 'religious_freedom']
  },

  // Tier 5 - Advanced Reforms
  {
    id: 'constitutional_monarchy',
    name: 'Constitutional Monarchy',
    icon: '📜',
    tier: 5,
    description: 'Monarch\'s power limited by constitution',
    effects: [
      { type: 'max_absolutism', value: -30, description: '-30 Max absolutism' },
      { type: 'global_unrest', value: -2, description: '-2 Global unrest' }
    ],
    requirements: [
      { type: 'government', value: 'monarchy' },
      { type: 'tech', value: 25 }
    ],
    cost: 100,
    mutuallyExclusive: ['absolute_monarchy', 'elective_monarchy']
  },
  {
    id: 'absolute_monarchy',
    name: 'Absolute Monarchy',
    icon: '👑',
    tier: 5,
    description: 'Unlimited royal power',
    effects: [
      { type: 'max_absolutism', value: 30, description: '+30 Max absolutism' },
      { type: 'harsh_treatment_cost', value: -50, description: '-50% Harsh treatment cost' }
    ],
    requirements: [
      { type: 'government', value: 'monarchy' }
    ],
    cost: 100,
    mutuallyExclusive: ['constitutional_monarchy', 'elective_monarchy']
  },
  {
    id: 'elective_monarchy',
    name: 'Elective Monarchy',
    icon: '🗳️',
    tier: 5,
    description: 'Monarch chosen by election',
    effects: [
      { type: 'diplomatic_reputation', value: 1, description: '+1 Diplomatic reputation' },
      { type: 'possible_heirs', value: 3, description: '3 Candidates to choose from' }
    ],
    requirements: [
      { type: 'government', value: 'monarchy' }
    ],
    cost: 100,
    mutuallyExclusive: ['constitutional_monarchy', 'absolute_monarchy']
  }
];

// Get reforms by tier
export function getReformsByTier(tier: number): Reform[] {
  return GOVERNMENT_REFORMS.filter(r => r.tier === tier);
}

// Check if reform requirements are met
export function canEnactReform(
  reform: Reform,
  currentReforms: string[],
  techLevel: number,
  year: number,
  government: string
): { canEnact: boolean; reason?: string } {
  // Check mutual exclusivity
  for (const exclusive of reform.mutuallyExclusive) {
    if (currentReforms.includes(exclusive)) {
      const exclusiveReform = GOVERNMENT_REFORMS.find(r => r.id === exclusive);
      return {
        canEnact: false,
        reason: `Mutually exclusive with ${exclusiveReform?.name}`
      };
    }
  }

  // Check requirements
  for (const req of reform.requirements) {
    switch (req.type) {
      case 'tech':
        if (techLevel < (req.value as number)) {
          return { canEnact: false, reason: `Requires tech level ${req.value}` };
        }
        break;
      case 'year':
        if (year < (req.value as number)) {
          return { canEnact: false, reason: `Not available until ${req.value}` };
        }
        break;
      case 'government':
        if (government !== req.value) {
          return { canEnact: false, reason: `Requires ${req.value} government` };
        }
        break;
      case 'reform':
        if (!currentReforms.includes(req.value as string)) {
          return { canEnact: false, reason: `Requires ${req.value} reform` };
        }
        break;
    }
  }

  return { canEnact: true };
}

// Calculate total effects from reforms
export function calculateReformEffects(
  reformIds: string[]
): Record<string, number> {
  const effects: Record<string, number> = {};

  for (const reformId of reformIds) {
    const reform = GOVERNMENT_REFORMS.find(r => r.id === reformId);
    if (!reform) continue;

    for (const effect of reform.effects) {
      if (typeof effect.value === 'number') {
        effects[effect.type] = (effects[effect.type] || 0) + effect.value;
      }
    }
  }

  return effects;
}

export default {
  GOVERNMENT_REFORMS,
  getReformsByTier,
  canEnactReform,
  calculateReformEffects
};
