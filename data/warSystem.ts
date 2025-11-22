// War mechanics and goals system

export interface War {
  id: string;
  name: string;
  startDate: string;
  attackers: WarParticipant[];
  defenders: WarParticipant[];
  warGoal: WarGoal;
  warScore: number;
  battles: Battle[];
}

export interface WarParticipant {
  nationId: string;
  isLeader: boolean;
  warExhaustion: number;
  participationScore: number;
  occupiedProvinces: number;
  casualties: number;
}

export interface WarGoal {
  id: string;
  name: string;
  icon: string;
  type: WarGoalType;
  warscoreRequired: number;
  prestige: number;
  aggressiveExpansion: number;
  description: string;
  timedWarscore?: boolean;
}

export type WarGoalType =
  | 'conquest'
  | 'reconquest'
  | 'subjugation'
  | 'independence'
  | 'religious'
  | 'trade'
  | 'superiority'
  | 'humiliation'
  | 'revolution';

export interface Battle {
  id: string;
  location: string;
  date: string;
  attackerCasualties: number;
  defenderCasualties: number;
  winner: 'attacker' | 'defender';
  decisiveness: 'minor' | 'moderate' | 'decisive';
}

export interface CasusBelli {
  id: string;
  name: string;
  icon: string;
  warGoalType: WarGoalType;
  requirements: CBRequirement[];
  duration?: number;
  description: string;
}

export interface CBRequirement {
  type: string;
  value: string | number | boolean;
}

export interface WarExhaustionEffect {
  threshold: number;
  effects: { type: string; value: number }[];
}

// War goals
export const WAR_GOALS: WarGoal[] = [
  {
    id: 'conquest',
    name: 'Conquest',
    icon: '⚔️',
    type: 'conquest',
    warscoreRequired: 100,
    prestige: 10,
    aggressiveExpansion: 100,
    description: 'Take provinces from the enemy.',
    timedWarscore: false
  },
  {
    id: 'reconquest',
    name: 'Reconquest',
    icon: '🔄',
    type: 'reconquest',
    warscoreRequired: 75,
    prestige: 5,
    aggressiveExpansion: 25,
    description: 'Reclaim cores that belong to you or a subject.',
    timedWarscore: false
  },
  {
    id: 'subjugation',
    name: 'Subjugation',
    icon: '👑',
    type: 'subjugation',
    warscoreRequired: 100,
    prestige: 20,
    aggressiveExpansion: 150,
    description: 'Force the enemy to become your subject.',
    timedWarscore: false
  },
  {
    id: 'independence',
    name: 'Independence',
    icon: '🗽',
    type: 'independence',
    warscoreRequired: 100,
    prestige: 25,
    aggressiveExpansion: 0,
    description: 'Break free from your overlord.',
    timedWarscore: false
  },
  {
    id: 'religious',
    name: 'Religious War',
    icon: '✝️',
    type: 'religious',
    warscoreRequired: 100,
    prestige: 15,
    aggressiveExpansion: 50,
    description: 'Force conversion or take religious sites.',
    timedWarscore: false
  },
  {
    id: 'trade_war',
    name: 'Trade War',
    icon: '💰',
    type: 'trade',
    warscoreRequired: 60,
    prestige: 5,
    aggressiveExpansion: 25,
    description: 'Steal trade power and embargo enemy.',
    timedWarscore: true
  },
  {
    id: 'superiority',
    name: 'Show Superiority',
    icon: '🏆',
    type: 'superiority',
    warscoreRequired: 0,
    prestige: 10,
    aggressiveExpansion: 10,
    description: 'Win battles to prove military dominance.',
    timedWarscore: true
  },
  {
    id: 'humiliation',
    name: 'Humiliation',
    icon: '😤',
    type: 'humiliation',
    warscoreRequired: 100,
    prestige: 30,
    aggressiveExpansion: 0,
    description: 'Humiliate a rival and take their power.',
    timedWarscore: false
  },
  {
    id: 'revolution',
    name: 'Spread Revolution',
    icon: '🔥',
    type: 'revolution',
    warscoreRequired: 100,
    prestige: 20,
    aggressiveExpansion: 75,
    description: 'Spread revolutionary ideals to the enemy.',
    timedWarscore: false
  }
];

// Casus Belli types
export const CASUS_BELLI: CasusBelli[] = [
  {
    id: 'claim',
    name: 'Claim on Throne',
    icon: '👑',
    warGoalType: 'subjugation',
    requirements: [
      { type: 'royal_marriage', value: true },
      { type: 'no_heir', value: true }
    ],
    description: 'You have a claim to their throne through marriage.'
  },
  {
    id: 'reconquest',
    name: 'Core Reconquest',
    icon: '🔄',
    warGoalType: 'reconquest',
    requirements: [
      { type: 'has_core', value: true }
    ],
    description: 'Reclaim your rightful territory.'
  },
  {
    id: 'holy_war',
    name: 'Holy War',
    icon: '⛪',
    warGoalType: 'religious',
    requirements: [
      { type: 'different_religion', value: true }
    ],
    description: 'Wage war in the name of your faith.'
  },
  {
    id: 'trade_conflict',
    name: 'Trade Conflict',
    icon: '⚖️',
    warGoalType: 'trade',
    requirements: [
      { type: 'competing_trade_node', value: true }
    ],
    description: 'Settle trade disputes through force.'
  },
  {
    id: 'rivalry',
    name: 'Rival Humiliation',
    icon: '😠',
    warGoalType: 'humiliation',
    requirements: [
      { type: 'is_rival', value: true }
    ],
    description: 'Put your rival in their place.'
  },
  {
    id: 'independence',
    name: 'War of Independence',
    icon: '🗽',
    warGoalType: 'independence',
    requirements: [
      { type: 'is_subject', value: true }
    ],
    description: 'Fight for your freedom.'
  },
  {
    id: 'imperialism',
    name: 'Imperialism',
    icon: '🦅',
    warGoalType: 'conquest',
    requirements: [
      { type: 'diplomatic_tech', value: 23 }
    ],
    description: 'Take what you want through sheer power.'
  },
  {
    id: 'coalition',
    name: 'Coalition',
    icon: '🤝',
    warGoalType: 'superiority',
    requirements: [
      { type: 'coalition_target', value: true }
    ],
    description: 'Punish an aggressive expansionist.'
  }
];

// War exhaustion effects
export const WAR_EXHAUSTION_EFFECTS: WarExhaustionEffect[] = [
  {
    threshold: 0,
    effects: []
  },
  {
    threshold: 5,
    effects: [
      { type: 'morale', value: -5 },
      { type: 'manpower_recovery', value: -10 }
    ]
  },
  {
    threshold: 10,
    effects: [
      { type: 'morale', value: -10 },
      { type: 'manpower_recovery', value: -20 },
      { type: 'unrest', value: 2 }
    ]
  },
  {
    threshold: 15,
    effects: [
      { type: 'morale', value: -15 },
      { type: 'manpower_recovery', value: -30 },
      { type: 'unrest', value: 4 },
      { type: 'stability_cost', value: 25 }
    ]
  },
  {
    threshold: 20,
    effects: [
      { type: 'morale', value: -20 },
      { type: 'manpower_recovery', value: -50 },
      { type: 'unrest', value: 6 },
      { type: 'stability_cost', value: 50 },
      { type: 'call_for_peace', value: true }
    ]
  }
];

// Get war goal by type
export function getWarGoal(type: WarGoalType): WarGoal | undefined {
  return WAR_GOALS.find(g => g.type === type);
}

// Get available casus belli
export function getAvailableCB(
  gameState: Record<string, any>
): CasusBelli[] {
  return CASUS_BELLI.filter(cb => {
    for (const req of cb.requirements) {
      if (gameState[req.type] !== req.value) {
        return false;
      }
    }
    return true;
  });
}

// Calculate war exhaustion effects
export function getWarExhaustionEffects(
  exhaustion: number
): { type: string; value: number }[] {
  let effects: { type: string; value: number }[] = [];

  for (const level of WAR_EXHAUSTION_EFFECTS) {
    if (exhaustion >= level.threshold) {
      effects = level.effects;
    } else {
      break;
    }
  }

  return effects;
}

// Calculate war score from battles
export function calculateBattleWarscore(battles: Battle[]): number {
  let score = 0;

  for (const battle of battles) {
    const base = battle.decisiveness === 'decisive' ? 3 :
                 battle.decisiveness === 'moderate' ? 2 : 1;
    if (battle.winner === 'attacker') {
      score += base;
    } else {
      score -= base;
    }
  }

  return Math.max(-100, Math.min(100, score));
}

// Calculate aggressive expansion
export function calculateAE(
  warGoal: WarGoal,
  provincesDemanded: number
): number {
  return warGoal.aggressiveExpansion * (provincesDemanded / 10);
}

// Get war status description
export function getWarStatus(warScore: number): string {
  if (warScore >= 100) return 'Total Victory';
  if (warScore >= 50) return 'Winning';
  if (warScore >= 0) return 'Stalemate';
  if (warScore >= -50) return 'Losing';
  return 'Devastating Defeat';
}

export default {
  WAR_GOALS,
  CASUS_BELLI,
  WAR_EXHAUSTION_EFFECTS,
  getWarGoal,
  getAvailableCB,
  getWarExhaustionEffects,
  calculateBattleWarscore,
  calculateAE,
  getWarStatus
};
