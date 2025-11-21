// Advanced Player Actions System - Hybrid World Spirit/Ruler Model
// Your guidance filtered through the competence of those who implement it

import { Nation, NationStats, Leader, CourtMember, LeaderTrait } from '../types';
import { NationalEconomy } from './economicSystem';
import { NationalMilitary } from './militarySystem';
import { IntelligenceApparatus, Agent, MissionType, MISSIONS } from './espionageSystem';
import { OppositionMovement, GovernmentResponse } from './oppositionSystem';

// Action categories
export type ActionCategory = 'ECONOMIC' | 'MILITARY' | 'ESPIONAGE' | 'DOMESTIC' | 'DIPLOMATIC';

// Action definition
export interface PlayerAction {
  id: string;
  name: string;
  category: ActionCategory;
  description: string;

  // Narrative framing (World Spirit perspective)
  guidanceText: string; // "Direct the treasury to..."

  // Requirements
  requirements?: {
    minStat?: { stat: keyof NationStats; value: number };
    governmentType?: string[];
    era?: string[];
    resources?: number;
    notAtWar?: boolean;
    atWar?: boolean;
  };

  // Who executes this
  executor: 'RULER' | 'CHANCELLOR' | 'TREASURER' | 'GENERAL' | 'ADMIRAL' | 'SPYMASTER' | 'DIPLOMAT';

  // Base effects (modified by executor competence)
  baseEffects: {
    statChanges?: Partial<NationStats>;
    economyChanges?: Partial<NationalEconomy>;
    specialEffect?: string;
  };

  // Risks
  riskLevel: number; // 1-10
  failureConsequences?: Partial<NationStats>;
}

// Trait bonuses for actions
const TRAIT_BONUSES: Record<LeaderTrait, { category: ActionCategory; bonus: number }[]> = {
  BRILLIANT_STRATEGIST: [{ category: 'MILITARY', bonus: 20 }],
  ENLIGHTENED_DESPOT: [{ category: 'DOMESTIC', bonus: 15 }, { category: 'ECONOMIC', bonus: 10 }],
  PATRON_OF_ARTS: [{ category: 'DIPLOMATIC', bonus: 10 }],
  MASTER_DIPLOMAT: [{ category: 'DIPLOMATIC', bonus: 25 }],
  RUTHLESS: [{ category: 'MILITARY', bonus: 10 }, { category: 'ESPIONAGE', bonus: 15 }],
  PIOUS: [{ category: 'DOMESTIC', bonus: 10 }],
  MERCHANT_PRINCE: [{ category: 'ECONOMIC', bonus: 20 }],
  REFORMER: [{ category: 'DOMESTIC', bonus: 20 }, { category: 'ECONOMIC', bonus: 10 }],
  TRADITIONALIST: [{ category: 'DOMESTIC', bonus: -10 }],
  WARRIOR_KING: [{ category: 'MILITARY', bonus: 20 }],
  WEAK_WILLED: [{ category: 'MILITARY', bonus: -15 }, { category: 'DOMESTIC', bonus: -15 }],
  PARANOID: [{ category: 'ESPIONAGE', bonus: 15 }, { category: 'DIPLOMATIC', bonus: -10 }],
  CHARISMATIC: [{ category: 'DOMESTIC', bonus: 15 }, { category: 'DIPLOMATIC', bonus: 10 }],
  FRUGAL: [{ category: 'ECONOMIC', bonus: 15 }],
  EXTRAVAGANT: [{ category: 'ECONOMIC', bonus: -15 }]
};

// Available actions
export const PLAYER_ACTIONS: PlayerAction[] = [
  // ECONOMIC ACTIONS
  {
    id: 'raise_taxes',
    name: 'Raise Taxes',
    category: 'ECONOMIC',
    description: 'Increase tax collection to boost revenues',
    guidanceText: 'Direct the treasury to increase tax collection across the realm',
    executor: 'TREASURER',
    baseEffects: {
      specialEffect: 'RAISE_TAXES'
    },
    riskLevel: 4,
    failureConsequences: { stability: -1 }
  },
  {
    id: 'lower_taxes',
    name: 'Lower Taxes',
    category: 'ECONOMIC',
    description: 'Reduce taxes to gain popular support',
    guidanceText: 'Instruct the treasury to ease the burden on the people',
    executor: 'TREASURER',
    baseEffects: {
      statChanges: { stability: 1 },
      specialEffect: 'LOWER_TAXES'
    },
    riskLevel: 2
  },
  {
    id: 'build_infrastructure',
    name: 'Build Infrastructure',
    category: 'ECONOMIC',
    description: 'Invest in roads, canals, or railways',
    guidanceText: 'Commission great works to improve the nation\'s infrastructure',
    executor: 'CHANCELLOR',
    baseEffects: {
      statChanges: { economy: 1 },
      specialEffect: 'BUILD_INFRASTRUCTURE'
    },
    riskLevel: 3,
    requirements: { minStat: { stat: 'economy', value: 2 } }
  },
  {
    id: 'free_trade',
    name: 'Adopt Free Trade',
    category: 'ECONOMIC',
    description: 'Lower tariffs to boost trade',
    guidanceText: 'Guide the nation toward open markets and free exchange',
    executor: 'TREASURER',
    baseEffects: {
      statChanges: { economy: 1 },
      specialEffect: 'FREE_TRADE'
    },
    riskLevel: 5
  },
  {
    id: 'protectionism',
    name: 'Raise Tariffs',
    category: 'ECONOMIC',
    description: 'Protect domestic industry with tariffs',
    guidanceText: 'Shield the nation\'s industry from foreign competition',
    executor: 'TREASURER',
    baseEffects: {
      specialEffect: 'INCREASE_TARIFFS'
    },
    riskLevel: 4
  },
  {
    id: 'mint_money',
    name: 'Expand Money Supply',
    category: 'ECONOMIC',
    description: 'Print more currency (causes inflation)',
    guidanceText: 'Order the mint to increase the money supply',
    executor: 'TREASURER',
    baseEffects: {
      specialEffect: 'MINT_MONEY'
    },
    riskLevel: 6,
    failureConsequences: { economy: -1 }
  },

  // MILITARY ACTIONS
  {
    id: 'mobilize_army',
    name: 'Mobilize Forces',
    category: 'MILITARY',
    description: 'Call up reserves and prepare for war',
    guidanceText: 'Inspire the nation to martial readiness',
    executor: 'GENERAL',
    baseEffects: {
      statChanges: { military: 1 },
      specialEffect: 'MOBILIZE'
    },
    riskLevel: 3
  },
  {
    id: 'military_reforms',
    name: 'Military Reforms',
    category: 'MILITARY',
    description: 'Modernize army organization and tactics',
    guidanceText: 'Guide the generals toward modern methods of warfare',
    executor: 'GENERAL',
    baseEffects: {
      statChanges: { military: 1, innovation: 1 },
      specialEffect: 'MILITARY_REFORM'
    },
    riskLevel: 5,
    requirements: { minStat: { stat: 'innovation', value: 3 } }
  },
  {
    id: 'expand_navy',
    name: 'Expand Navy',
    category: 'MILITARY',
    description: 'Build new warships',
    guidanceText: 'Direct the admiralty to expand the fleet',
    executor: 'ADMIRAL',
    baseEffects: {
      statChanges: { military: 1 },
      specialEffect: 'BUILD_SHIPS'
    },
    riskLevel: 4,
    requirements: { minStat: { stat: 'economy', value: 3 } }
  },
  {
    id: 'fortify_borders',
    name: 'Fortify Borders',
    category: 'MILITARY',
    description: 'Build defensive fortifications',
    guidanceText: 'Strengthen the realm\'s defenses against invasion',
    executor: 'GENERAL',
    baseEffects: {
      specialEffect: 'BUILD_FORTS'
    },
    riskLevel: 2
  },

  // ESPIONAGE ACTIONS
  {
    id: 'deploy_spy',
    name: 'Deploy Spy',
    category: 'ESPIONAGE',
    description: 'Send an agent to gather intelligence',
    guidanceText: 'Direct your intelligence services to infiltrate [target]',
    executor: 'SPYMASTER',
    baseEffects: {
      specialEffect: 'DEPLOY_SPY'
    },
    riskLevel: 5
  },
  {
    id: 'sabotage_mission',
    name: 'Sabotage Operation',
    category: 'ESPIONAGE',
    description: 'Damage enemy infrastructure or military',
    guidanceText: 'Task your agents with disrupting [target]\'s capabilities',
    executor: 'SPYMASTER',
    baseEffects: {
      specialEffect: 'SABOTAGE'
    },
    riskLevel: 8,
    requirements: { atWar: true }
  },
  {
    id: 'counter_espionage',
    name: 'Counter-Espionage',
    category: 'ESPIONAGE',
    description: 'Hunt foreign spies in your nation',
    guidanceText: 'Set your agents to rooting out foreign infiltrators',
    executor: 'SPYMASTER',
    baseEffects: {
      specialEffect: 'COUNTER_INTEL'
    },
    riskLevel: 3
  },
  {
    id: 'establish_network',
    name: 'Establish Spy Network',
    category: 'ESPIONAGE',
    description: 'Build permanent intelligence network abroad',
    guidanceText: 'Cultivate a lasting presence in [target]\'s shadows',
    executor: 'SPYMASTER',
    baseEffects: {
      specialEffect: 'BUILD_NETWORK'
    },
    riskLevel: 6
  },

  // DOMESTIC ACTIONS
  {
    id: 'grant_reforms',
    name: 'Grant Reforms',
    category: 'DOMESTIC',
    description: 'Make political concessions to opposition',
    guidanceText: 'Counsel the ruler to bend before the storm breaks',
    executor: 'CHANCELLOR',
    baseEffects: {
      statChanges: { stability: 1 },
      specialEffect: 'REFORMS'
    },
    riskLevel: 4
  },
  {
    id: 'suppress_opposition',
    name: 'Suppress Opposition',
    category: 'DOMESTIC',
    description: 'Use force against political opponents',
    guidanceText: 'Harden the ruler\'s heart against dissent',
    executor: 'RULER',
    baseEffects: {
      specialEffect: 'MILITARY_SUPPRESSION'
    },
    riskLevel: 7,
    failureConsequences: { stability: -2 }
  },
  {
    id: 'propaganda_campaign',
    name: 'Launch Propaganda',
    category: 'DOMESTIC',
    description: 'Spread government message to the people',
    guidanceText: 'Shape the narrative in the ruler\'s favor',
    executor: 'CHANCELLOR',
    baseEffects: {
      statChanges: { prestige: 1 },
      specialEffect: 'PROPAGANDA'
    },
    riskLevel: 3
  },
  {
    id: 'expand_education',
    name: 'Expand Education',
    category: 'DOMESTIC',
    description: 'Build schools and universities',
    guidanceText: 'Enlighten the nation through knowledge',
    executor: 'CHANCELLOR',
    baseEffects: {
      statChanges: { innovation: 1 },
      specialEffect: 'EDUCATION'
    },
    riskLevel: 3
  },
  {
    id: 'religious_tolerance',
    name: 'Religious Tolerance',
    category: 'DOMESTIC',
    description: 'Grant freedom of worship',
    guidanceText: 'Open the ruler\'s mind to religious diversity',
    executor: 'RULER',
    baseEffects: {
      statChanges: { stability: 1 },
      specialEffect: 'TOLERANCE'
    },
    riskLevel: 5
  },
  {
    id: 'martial_law',
    name: 'Declare Martial Law',
    category: 'DOMESTIC',
    description: 'Suspend civil liberties to restore order',
    guidanceText: 'Steel the ruler to take desperate measures',
    executor: 'RULER',
    baseEffects: {
      specialEffect: 'MARTIAL_LAW'
    },
    riskLevel: 9,
    failureConsequences: { stability: -3, prestige: -1 }
  },

  // DIPLOMATIC ACTIONS
  {
    id: 'improve_relations',
    name: 'Improve Relations',
    category: 'DIPLOMATIC',
    description: 'Send diplomats to improve ties with another nation',
    guidanceText: 'Guide the nation toward friendship with [target]',
    executor: 'DIPLOMAT',
    baseEffects: {
      specialEffect: 'IMPROVE_RELATIONS'
    },
    riskLevel: 2
  },
  {
    id: 'propose_alliance',
    name: 'Propose Alliance',
    category: 'DIPLOMATIC',
    description: 'Offer a military alliance',
    guidanceText: 'Inspire the ruler to seek strength in partnership',
    executor: 'DIPLOMAT',
    baseEffects: {
      specialEffect: 'PROPOSE_ALLIANCE'
    },
    riskLevel: 4
  },
  {
    id: 'demand_tribute',
    name: 'Demand Tribute',
    category: 'DIPLOMATIC',
    description: 'Demand payments from weaker nations',
    guidanceText: 'Embolden the ruler to assert dominance',
    executor: 'DIPLOMAT',
    baseEffects: {
      statChanges: { prestige: 1 },
      specialEffect: 'DEMAND_TRIBUTE'
    },
    riskLevel: 6,
    requirements: { minStat: { stat: 'military', value: 4 } }
  },
  {
    id: 'royal_marriage',
    name: 'Arrange Royal Marriage',
    category: 'DIPLOMATIC',
    description: 'Seal alliance through marriage',
    guidanceText: 'Weave dynastic bonds to secure the future',
    executor: 'DIPLOMAT',
    baseEffects: {
      specialEffect: 'ROYAL_MARRIAGE'
    },
    riskLevel: 3,
    requirements: { governmentType: ['ABSOLUTE_MONARCHY', 'CONSTITUTIONAL_MONARCHY', 'EMPIRE'] }
  }
];

// Calculate success chance based on executor competence
export function calculateActionSuccess(
  action: PlayerAction,
  nation: Nation
): { chance: number; executor: string; narrative: string } {
  let baseChance = 70;
  let executorName = 'the government';
  let narrative = '';

  const leader = nation.court?.leader;
  const court = nation.court?.members || [];

  // Find executor
  if (action.executor === 'RULER' && leader) {
    executorName = leader.name;

    // Ruler competence from traits
    let competence = 50;
    for (const trait of leader.personality.traits) {
      const bonuses = TRAIT_BONUSES[trait];
      if (bonuses) {
        for (const bonus of bonuses) {
          if (bonus.category === action.category) {
            competence += bonus.bonus;
          }
        }
      }
    }
    baseChance = competence;

    // Narrative based on traits
    if (leader.personality.traits.includes('WEAK_WILLED')) {
      narrative = `${leader.name} hesitates, uncertain of the course...`;
    } else if (leader.personality.traits.includes('BRILLIANT_STRATEGIST') && action.category === 'MILITARY') {
      narrative = `${leader.name} masterfully directs the operation...`;
    } else if (leader.personality.traits.includes('MASTER_DIPLOMAT') && action.category === 'DIPLOMATIC') {
      narrative = `${leader.name}'s diplomatic genius shines...`;
    }
  } else {
    // Find court member
    const roleMap: Record<string, string> = {
      CHANCELLOR: 'CHANCELLOR',
      TREASURER: 'TREASURER',
      GENERAL: 'GENERAL',
      ADMIRAL: 'ADMIRAL',
      SPYMASTER: 'SPYMASTER',
      DIPLOMAT: 'DIPLOMAT'
    };

    const executor = court.find(m => m.role === roleMap[action.executor]);
    if (executor) {
      executorName = executor.name;
      baseChance = 40 + executor.competence * 10; // Competence 1-5 = 50-90%

      // Loyalty affects reliability
      if (executor.loyalty < 50) {
        baseChance -= 15;
        narrative = `${executor.name}'s loyalty is questionable...`;
      } else if (executor.loyalty > 80) {
        baseChance += 5;
      }
    }
  }

  // Risk modifier
  baseChance -= action.riskLevel * 3;

  // Nation stats modifier
  if (action.category === 'MILITARY') {
    baseChance += (nation.stats.military - 3) * 5;
  } else if (action.category === 'ECONOMIC') {
    baseChance += (nation.stats.economy - 3) * 5;
  } else if (action.category === 'DOMESTIC') {
    baseChance += (nation.stats.stability - 3) * 5;
  }

  return {
    chance: Math.max(10, Math.min(95, baseChance)),
    executor: executorName,
    narrative
  };
}

// Execute an action
export function executePlayerAction(
  action: PlayerAction,
  nation: Nation,
  target?: string
): {
  success: boolean;
  narrative: string;
  statChanges: Partial<NationStats>;
  specialEffect?: string;
} {
  const { chance, executor, narrative: executorNarrative } = calculateActionSuccess(action, nation);
  const roll = Math.random() * 100;
  const success = roll < chance;

  let narrative = '';
  let statChanges: Partial<NationStats> = {};

  if (success) {
    // Apply base effects
    if (action.baseEffects.statChanges) {
      statChanges = { ...action.baseEffects.statChanges };
    }

    narrative = `${action.guidanceText.replace('[target]', target || 'the enemy')}. `;
    narrative += executorNarrative || `${executor} carries out your will successfully. `;

    // Success flavor by category
    if (action.category === 'MILITARY') {
      narrative += 'The realm grows stronger.';
    } else if (action.category === 'ECONOMIC') {
      narrative += 'The treasury benefits from this decision.';
    } else if (action.category === 'DOMESTIC') {
      narrative += 'Order is maintained.';
    }
  } else {
    // Failure
    if (action.failureConsequences) {
      statChanges = { ...action.failureConsequences };
    }

    narrative = `You attempt to ${action.name.toLowerCase()}, but `;

    if (executorNarrative) {
      narrative += executorNarrative + ' ';
    }

    narrative += `${executor} fails to execute your vision. `;

    // Failure flavor
    const failReasons = [
      'Bureaucratic incompetence undermines the effort.',
      'Opposition from vested interests blocks progress.',
      'Poor timing dooms the initiative.',
      'Resources prove insufficient for the task.',
      'The people resist this change.'
    ];
    narrative += failReasons[Math.floor(Math.random() * failReasons.length)];
  }

  return {
    success,
    narrative,
    statChanges,
    specialEffect: success ? action.baseEffects.specialEffect : undefined
  };
}

// Get available actions for current nation state
export function getAvailablePlayerActions(nation: Nation): PlayerAction[] {
  return PLAYER_ACTIONS.filter(action => {
    if (!action.requirements) return true;

    const req = action.requirements;

    // Check stat requirements
    if (req.minStat && nation.stats[req.minStat.stat] < req.minStat.value) {
      return false;
    }

    // Check government type
    if (req.governmentType && nation.government) {
      if (!req.governmentType.includes(nation.government.type)) {
        return false;
      }
    }

    return true;
  });
}

// Get actions by category
export function getActionsByCategory(nation: Nation, category: ActionCategory): PlayerAction[] {
  return getAvailablePlayerActions(nation).filter(a => a.category === category);
}
