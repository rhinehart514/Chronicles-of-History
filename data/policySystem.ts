// Policy system for government policies

export interface Policy {
  id: string;
  name: string;
  icon: string;
  category: PolicyCategory;
  ideaRequirements: IdeaRequirement[];
  effects: PolicyEffect[];
  cost: number;
  description: string;
}

export type PolicyCategory = 'administrative' | 'diplomatic' | 'military' | 'economic';

export interface IdeaRequirement {
  ideaGroup: string;
  ideaIndex: number;
}

export interface PolicyEffect {
  type: string;
  value: number;
  isPercent?: boolean;
}

// Available policies
export const POLICIES: Policy[] = [
  // Administrative policies
  {
    id: 'centralization',
    name: 'Centralization',
    icon: '🏛️',
    category: 'administrative',
    ideaRequirements: [
      { ideaGroup: 'administrative', ideaIndex: 3 },
      { ideaGroup: 'economic', ideaIndex: 3 }
    ],
    effects: [
      { type: 'state_maintenance', value: -15, isPercent: true },
      { type: 'autonomy_change', value: -0.05 }
    ],
    cost: 1,
    description: 'Strengthen central authority over local governments.'
  },
  {
    id: 'land_reform',
    name: 'Land Reform',
    icon: '🌾',
    category: 'administrative',
    ideaRequirements: [
      { ideaGroup: 'administrative', ideaIndex: 2 },
      { ideaGroup: 'innovative', ideaIndex: 4 }
    ],
    effects: [
      { type: 'production_efficiency', value: 10, isPercent: true },
      { type: 'goods_produced', value: 10, isPercent: true }
    ],
    cost: 1,
    description: 'Redistribute land to increase agricultural output.'
  },
  {
    id: 'taxation_reform',
    name: 'Taxation Reform',
    icon: '💰',
    category: 'administrative',
    ideaRequirements: [
      { ideaGroup: 'economic', ideaIndex: 5 },
      { ideaGroup: 'administrative', ideaIndex: 4 }
    ],
    effects: [
      { type: 'national_tax', value: 15, isPercent: true },
      { type: 'inflation_reduction', value: 0.1 }
    ],
    cost: 1,
    description: 'Modernize the tax collection system.'
  },

  // Diplomatic policies
  {
    id: 'diplomatic_missions',
    name: 'Diplomatic Missions',
    icon: '🤝',
    category: 'diplomatic',
    ideaRequirements: [
      { ideaGroup: 'diplomatic', ideaIndex: 3 },
      { ideaGroup: 'exploration', ideaIndex: 2 }
    ],
    effects: [
      { type: 'diplomatic_reputation', value: 2 },
      { type: 'improve_relations', value: 20, isPercent: true }
    ],
    cost: 1,
    description: 'Establish permanent diplomatic missions abroad.'
  },
  {
    id: 'colonial_enterprise',
    name: 'Colonial Enterprise',
    icon: '⛵',
    category: 'diplomatic',
    ideaRequirements: [
      { ideaGroup: 'exploration', ideaIndex: 4 },
      { ideaGroup: 'trade', ideaIndex: 3 }
    ],
    effects: [
      { type: 'colonist', value: 1 },
      { type: 'global_settler_increase', value: 20 }
    ],
    cost: 1,
    description: 'Encourage colonial ventures and expansion.'
  },
  {
    id: 'mercantile_fleet',
    name: 'Mercantile Fleet',
    icon: '🚢',
    category: 'diplomatic',
    ideaRequirements: [
      { ideaGroup: 'trade', ideaIndex: 5 },
      { ideaGroup: 'diplomatic', ideaIndex: 4 }
    ],
    effects: [
      { type: 'trade_efficiency', value: 20, isPercent: true },
      { type: 'ship_trade_power', value: 25, isPercent: true }
    ],
    cost: 1,
    description: 'Build a merchant fleet for overseas trade.'
  },

  // Military policies
  {
    id: 'professional_army',
    name: 'Professional Army',
    icon: '⚔️',
    category: 'military',
    ideaRequirements: [
      { ideaGroup: 'offensive', ideaIndex: 4 },
      { ideaGroup: 'quality', ideaIndex: 4 }
    ],
    effects: [
      { type: 'discipline', value: 5, isPercent: true },
      { type: 'army_tradition_decay', value: -1 }
    ],
    cost: 1,
    description: 'Establish a professional standing army.'
  },
  {
    id: 'defensive_doctrine',
    name: 'Defensive Doctrine',
    icon: '🛡️',
    category: 'military',
    ideaRequirements: [
      { ideaGroup: 'defensive', ideaIndex: 3 },
      { ideaGroup: 'quality', ideaIndex: 3 }
    ],
    effects: [
      { type: 'defensiveness', value: 25, isPercent: true },
      { type: 'garrison_size', value: 25, isPercent: true }
    ],
    cost: 1,
    description: 'Focus on defensive military strategies.'
  },
  {
    id: 'naval_supremacy',
    name: 'Naval Supremacy',
    icon: '⚓',
    category: 'military',
    ideaRequirements: [
      { ideaGroup: 'offensive', ideaIndex: 5 },
      { ideaGroup: 'exploration', ideaIndex: 5 }
    ],
    effects: [
      { type: 'naval_morale', value: 15, isPercent: true },
      { type: 'naval_forcelimit', value: 20, isPercent: true }
    ],
    cost: 1,
    description: 'Invest in naval superiority.'
  },

  // Economic policies
  {
    id: 'guild_system',
    name: 'Guild System',
    icon: '🏭',
    category: 'economic',
    ideaRequirements: [
      { ideaGroup: 'economic', ideaIndex: 4 },
      { ideaGroup: 'innovative', ideaIndex: 3 }
    ],
    effects: [
      { type: 'production_efficiency', value: 15, isPercent: true },
      { type: 'build_cost', value: -10, isPercent: true }
    ],
    cost: 1,
    description: 'Organize craftsmen into regulated guilds.'
  },
  {
    id: 'free_trade',
    name: 'Free Trade',
    icon: '📦',
    category: 'economic',
    ideaRequirements: [
      { ideaGroup: 'trade', ideaIndex: 4 },
      { ideaGroup: 'economic', ideaIndex: 6 }
    ],
    effects: [
      { type: 'global_trade_power', value: 20, isPercent: true },
      { type: 'trade_range', value: 25, isPercent: true }
    ],
    cost: 1,
    description: 'Remove trade barriers and tariffs.'
  },
  {
    id: 'mining_subsidies',
    name: 'Mining Subsidies',
    icon: '⛏️',
    category: 'economic',
    ideaRequirements: [
      { ideaGroup: 'economic', ideaIndex: 2 },
      { ideaGroup: 'innovative', ideaIndex: 5 }
    ],
    effects: [
      { type: 'goods_produced', value: 15, isPercent: true },
      { type: 'development_cost', value: -10, isPercent: true }
    ],
    cost: 1,
    description: 'Subsidize mining operations across the nation.'
  }
];

// Get policy by id
export function getPolicy(id: string): Policy | undefined {
  return POLICIES.find(p => p.id === id);
}

// Get policies by category
export function getPoliciesByCategory(category: PolicyCategory): Policy[] {
  return POLICIES.filter(p => p.category === category);
}

// Check if policy requirements are met
export function canEnactPolicy(
  policy: Policy,
  unlockedIdeas: Map<string, number>,
  activePolicies: string[]
): boolean {
  // Check if already active
  if (activePolicies.includes(policy.id)) return false;

  // Check idea requirements
  for (const req of policy.ideaRequirements) {
    const unlocked = unlockedIdeas.get(req.ideaGroup) || 0;
    if (unlocked < req.ideaIndex + 1) return false;
  }

  return true;
}

// Calculate total policy effects
export function calculatePolicyEffects(
  activePolicies: string[]
): Map<string, number> {
  const effects = new Map<string, number>();

  for (const policyId of activePolicies) {
    const policy = getPolicy(policyId);
    if (!policy) continue;

    for (const effect of policy.effects) {
      const current = effects.get(effect.type) || 0;
      effects.set(effect.type, current + effect.value);
    }
  }

  return effects;
}

// Get max active policies
export function getMaxPolicies(adminTech: number): number {
  return Math.max(1, Math.floor(adminTech / 5));
}

export default {
  POLICIES,
  getPolicy,
  getPoliciesByCategory,
  canEnactPolicy,
  calculatePolicyEffects,
  getMaxPolicies
};
