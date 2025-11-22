// Estates and factions system

export interface Estate {
  id: string;
  name: string;
  icon: string;
  description: string;
  influence: number;
  loyalty: number;
  privileges: Privilege[];
  interactions: EstateInteraction[];
  modifiers: EstateModifier[];
}

export interface Privilege {
  id: string;
  name: string;
  icon: string;
  description: string;
  effects: EstateModifier[];
  influenceCost: number;
  loyaltyEquilibrium: number;
  requirements?: string[];
}

export interface EstateInteraction {
  id: string;
  name: string;
  icon: string;
  description: string;
  loyaltyGain: number;
  influenceGain: number;
  cooldown: number;
  cost?: { type: string; value: number };
}

export interface EstateModifier {
  type: string;
  value: number;
  description: string;
}

// Default estates
export const DEFAULT_ESTATES: Estate[] = [
  {
    id: 'nobility',
    name: 'Nobility',
    icon: '👑',
    description: 'The landed aristocracy and feudal lords',
    influence: 20,
    loyalty: 50,
    privileges: [
      {
        id: 'noble_officers',
        name: 'Noble Officers',
        icon: '⚔️',
        description: 'Nobles serve as military officers',
        effects: [
          { type: 'army_tradition', value: 0.5, description: '+0.5 Yearly army tradition' },
          { type: 'noble_influence', value: 10, description: '+10% Noble influence' }
        ],
        influenceCost: 10,
        loyaltyEquilibrium: 5
      },
      {
        id: 'supremacy_nobles',
        name: 'Supremacy Over Crown',
        icon: '🏰',
        description: 'Nobles have supreme authority',
        effects: [
          { type: 'max_absolutism', value: -10, description: '-10 Max absolutism' },
          { type: 'manpower', value: 15, description: '+15% National manpower' }
        ],
        influenceCost: 20,
        loyaltyEquilibrium: 10
      },
      {
        id: 'monopoly_metals',
        name: 'Monopoly on Metals',
        icon: '⛏️',
        description: 'Control over metal production',
        effects: [
          { type: 'goods_produced_metals', value: 15, description: '+15% Metals produced' }
        ],
        influenceCost: 10,
        loyaltyEquilibrium: 5
      }
    ],
    interactions: [
      {
        id: 'summon_diet',
        name: 'Summon the Diet',
        icon: '🏛️',
        description: 'Call nobles to discuss matters of state',
        loyaltyGain: 15,
        influenceGain: 5,
        cooldown: 20
      },
      {
        id: 'seize_land',
        name: 'Seize Land',
        icon: '📜',
        description: 'Confiscate noble estates',
        loyaltyGain: -20,
        influenceGain: -10,
        cooldown: 5
      }
    ],
    modifiers: [
      { type: 'cavalry_cost', value: -10, description: '-10% Cavalry cost' },
      { type: 'manpower', value: 5, description: '+5% National manpower' }
    ]
  },
  {
    id: 'clergy',
    name: 'Clergy',
    icon: '⛪',
    description: 'Religious authorities and institutions',
    influence: 15,
    loyalty: 50,
    privileges: [
      {
        id: 'religious_diplomats',
        name: 'Religious Diplomats',
        icon: '🤝',
        description: 'Clergy serve as diplomats',
        effects: [
          { type: 'diplomatic_reputation', value: 1, description: '+1 Diplomatic reputation' },
          { type: 'clergy_influence', value: 10, description: '+10% Clergy influence' }
        ],
        influenceCost: 10,
        loyaltyEquilibrium: 5
      },
      {
        id: 'clerical_ministers',
        name: 'Clerical Ministers',
        icon: '📚',
        description: 'Church controls education',
        effects: [
          { type: 'advisor_cost', value: -15, description: '-15% Advisor cost' },
          { type: 'papal_influence', value: 0.5, description: '+0.5 Yearly papal influence' }
        ],
        influenceCost: 15,
        loyaltyEquilibrium: 5
      },
      {
        id: 'church_and_state',
        name: 'Integration of Church and State',
        icon: '⚖️',
        description: 'Religious and secular power unified',
        effects: [
          { type: 'stability_cost', value: -15, description: '-15% Stability cost' },
          { type: 'tolerance_heretics', value: -1, description: '-1 Tolerance of heretics' }
        ],
        influenceCost: 20,
        loyaltyEquilibrium: 10
      }
    ],
    interactions: [
      {
        id: 'ask_for_contribution',
        name: 'Ask for Contribution',
        icon: '💰',
        description: 'Request financial support',
        loyaltyGain: -10,
        influenceGain: 0,
        cooldown: 5,
        cost: { type: 'gold_gain', value: 100 }
      },
      {
        id: 'religious_blessing',
        name: 'Religious Blessing',
        icon: '✨',
        description: 'Receive divine blessing',
        loyaltyGain: 10,
        influenceGain: 5,
        cooldown: 10
      }
    ],
    modifiers: [
      { type: 'stability_cost', value: -5, description: '-5% Stability cost' },
      { type: 'tolerance_true', value: 1, description: '+1 Tolerance of true faith' }
    ]
  },
  {
    id: 'burghers',
    name: 'Burghers',
    icon: '🏪',
    description: 'Merchants, craftsmen, and urban citizens',
    influence: 15,
    loyalty: 50,
    privileges: [
      {
        id: 'indebted_burghers',
        name: 'Indebted to the Burghers',
        icon: '💵',
        description: 'Burghers provide loans',
        effects: [
          { type: 'interest', value: -0.5, description: '-0.5% Interest per annum' },
          { type: 'burgher_influence', value: 10, description: '+10% Burgher influence' }
        ],
        influenceCost: 10,
        loyaltyEquilibrium: 5
      },
      {
        id: 'exclusive_trade',
        name: 'Exclusive Trade Rights',
        icon: '🚢',
        description: 'Burghers control foreign trade',
        effects: [
          { type: 'trade_efficiency', value: 10, description: '+10% Trade efficiency' },
          { type: 'global_tax', value: -5, description: '-5% Global tax' }
        ],
        influenceCost: 15,
        loyaltyEquilibrium: 5
      },
      {
        id: 'patronage_arts',
        name: 'Patronage of the Arts',
        icon: '🎨',
        description: 'Support cultural development',
        effects: [
          { type: 'prestige', value: 0.5, description: '+0.5 Yearly prestige' },
          { type: 'advisor_cost', value: -10, description: '-10% Advisor cost' }
        ],
        influenceCost: 10,
        loyaltyEquilibrium: 5
      }
    ],
    interactions: [
      {
        id: 'demand_loans',
        name: 'Demand Loans',
        icon: '💰',
        description: 'Force burghers to provide loans',
        loyaltyGain: -15,
        influenceGain: 0,
        cooldown: 10,
        cost: { type: 'loan', value: 5 }
      },
      {
        id: 'grant_charter',
        name: 'Grant Town Charter',
        icon: '📜',
        description: 'Grant self-governance rights',
        loyaltyGain: 15,
        influenceGain: 10,
        cooldown: 20
      }
    ],
    modifiers: [
      { type: 'trade_efficiency', value: 5, description: '+5% Trade efficiency' },
      { type: 'development_cost', value: -5, description: '-5% Development cost' }
    ]
  },
  {
    id: 'cossacks',
    name: 'Cossacks',
    icon: '🐎',
    description: 'Free warriors of the steppes',
    influence: 10,
    loyalty: 40,
    privileges: [
      {
        id: 'cossack_register',
        name: 'Cossack Register',
        icon: '📋',
        description: 'Official military registration',
        effects: [
          { type: 'cavalry_cost', value: -20, description: '-20% Cavalry cost' },
          { type: 'cossack_influence', value: 15, description: '+15% Cossack influence' }
        ],
        influenceCost: 10,
        loyaltyEquilibrium: 5
      },
      {
        id: 'frontier_privileges',
        name: 'Frontier Privileges',
        icon: '🗺️',
        description: 'Control of frontier lands',
        effects: [
          { type: 'colonist', value: 1, description: '+1 Colonist' },
          { type: 'cavalry_flanking', value: 25, description: '+25% Cavalry flanking' }
        ],
        influenceCost: 20,
        loyaltyEquilibrium: 10
      }
    ],
    interactions: [
      {
        id: 'recruit_cossack_cavalry',
        name: 'Recruit Cossack Cavalry',
        icon: '🐎',
        description: 'Hire cossack riders',
        loyaltyGain: -5,
        influenceGain: 5,
        cooldown: 5
      },
      {
        id: 'settle_cossacks',
        name: 'Settle Cossacks',
        icon: '🏠',
        description: 'Grant lands for settlement',
        loyaltyGain: 20,
        influenceGain: 5,
        cooldown: 20
      }
    ],
    modifiers: [
      { type: 'cavalry_combat', value: 10, description: '+10% Cavalry combat ability' },
      { type: 'land_attrition', value: -10, description: '-10% Land attrition' }
    ]
  }
];

// Calculate estate effects
export function calculateEstateEffects(
  estates: Estate[],
  activePrivileges: Record<string, string[]>
): Record<string, number> {
  const effects: Record<string, number> = {};

  for (const estate of estates) {
    // Base modifiers from loyalty
    if (estate.loyalty >= 60) {
      for (const mod of estate.modifiers) {
        if (typeof mod.value === 'number') {
          effects[mod.type] = (effects[mod.type] || 0) + mod.value;
        }
      }
    }

    // Privilege effects
    const privileges = activePrivileges[estate.id] || [];
    for (const privId of privileges) {
      const priv = estate.privileges.find(p => p.id === privId);
      if (priv) {
        for (const effect of priv.effects) {
          if (typeof effect.value === 'number') {
            effects[effect.type] = (effects[effect.type] || 0) + effect.value;
          }
        }
      }
    }
  }

  return effects;
}

// Check for estate disasters
export function checkEstateDisaster(estate: Estate): {
  disaster: boolean;
  type?: string;
  description?: string;
} {
  if (estate.influence >= 100) {
    return {
      disaster: true,
      type: 'takeover',
      description: `${estate.name} have seized control of the government!`
    };
  }

  if (estate.loyalty <= 0) {
    return {
      disaster: true,
      type: 'rebellion',
      description: `${estate.name} have risen in rebellion!`
    };
  }

  return { disaster: false };
}

export default {
  DEFAULT_ESTATES,
  calculateEstateEffects,
  checkEstateDisaster
};
