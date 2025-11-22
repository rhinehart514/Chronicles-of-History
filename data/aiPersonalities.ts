// AI nation personalities and behavior system

export interface AIPersonality {
  id: string;
  name: string;
  description: string;
  priorities: AIPriorities;
  modifiers: AIModifier[];
  behaviors: AIBehavior[];
}

export interface AIPriorities {
  expansion: number; // 0-100
  diplomacy: number;
  economy: number;
  military: number;
  religion: number;
  colonization: number;
}

export interface AIModifier {
  type: string;
  value: number;
}

export interface AIBehavior {
  action: string;
  weight: number;
  conditions?: string[];
}

// AI personalities
export const AI_PERSONALITIES: AIPersonality[] = [
  {
    id: 'balanced',
    name: 'Balanced',
    description: 'A well-rounded approach to all aspects of the game.',
    priorities: {
      expansion: 50,
      diplomacy: 50,
      economy: 50,
      military: 50,
      religion: 50,
      colonization: 50
    },
    modifiers: [],
    behaviors: [
      { action: 'expand', weight: 50 },
      { action: 'ally', weight: 50 },
      { action: 'develop', weight: 50 }
    ]
  },
  {
    id: 'militarist',
    name: 'Militarist',
    description: 'Focuses on military strength and territorial expansion.',
    priorities: {
      expansion: 80,
      diplomacy: 30,
      economy: 40,
      military: 90,
      religion: 40,
      colonization: 30
    },
    modifiers: [
      { type: 'army_morale', value: 10 },
      { type: 'ae_impact', value: -20 }
    ],
    behaviors: [
      { action: 'expand', weight: 80 },
      { action: 'build_army', weight: 90 },
      { action: 'declare_war', weight: 70 }
    ]
  },
  {
    id: 'diplomat',
    name: 'Diplomat',
    description: 'Prefers diplomatic solutions and alliance building.',
    priorities: {
      expansion: 30,
      diplomacy: 90,
      economy: 50,
      military: 40,
      religion: 50,
      colonization: 40
    },
    modifiers: [
      { type: 'diplomatic_reputation', value: 2 },
      { type: 'improve_relations', value: 25 }
    ],
    behaviors: [
      { action: 'ally', weight: 90 },
      { action: 'improve_relations', weight: 80 },
      { action: 'royal_marriage', weight: 70 }
    ]
  },
  {
    id: 'colonizer',
    name: 'Colonizer',
    description: 'Focuses on overseas expansion and colonization.',
    priorities: {
      expansion: 60,
      diplomacy: 50,
      economy: 60,
      military: 50,
      religion: 40,
      colonization: 100
    },
    modifiers: [
      { type: 'colonist_speed', value: 25 },
      { type: 'naval_forcelimit', value: 25 }
    ],
    behaviors: [
      { action: 'colonize', weight: 100 },
      { action: 'build_navy', weight: 80 },
      { action: 'explore', weight: 70 }
    ]
  },
  {
    id: 'trader',
    name: 'Trader',
    description: 'Focuses on trade and economic growth.',
    priorities: {
      expansion: 40,
      diplomacy: 60,
      economy: 100,
      military: 40,
      religion: 30,
      colonization: 60
    },
    modifiers: [
      { type: 'trade_efficiency', value: 20 },
      { type: 'merchant', value: 1 }
    ],
    behaviors: [
      { action: 'trade', weight: 100 },
      { action: 'develop', weight: 70 },
      { action: 'build_trade_buildings', weight: 80 }
    ]
  },
  {
    id: 'religious',
    name: 'Religious',
    description: 'Focuses on religious unity and conversion.',
    priorities: {
      expansion: 50,
      diplomacy: 40,
      economy: 40,
      military: 60,
      religion: 100,
      colonization: 40
    },
    modifiers: [
      { type: 'missionary_strength', value: 2 },
      { type: 'tolerance_own', value: 2 }
    ],
    behaviors: [
      { action: 'convert', weight: 100 },
      { action: 'religious_war', weight: 80 },
      { action: 'defend_faith', weight: 70 }
    ]
  },
  {
    id: 'opportunist',
    name: 'Opportunist',
    description: 'Takes advantage of weakened neighbors.',
    priorities: {
      expansion: 70,
      diplomacy: 50,
      economy: 50,
      military: 70,
      religion: 30,
      colonization: 40
    },
    modifiers: [
      { type: 'spy_offense', value: 25 }
    ],
    behaviors: [
      { action: 'attack_weak', weight: 90 },
      { action: 'break_alliance', weight: 60 },
      { action: 'claim_throne', weight: 70 }
    ]
  },
  {
    id: 'defensive',
    name: 'Defensive',
    description: 'Focuses on defense and internal stability.',
    priorities: {
      expansion: 20,
      diplomacy: 60,
      economy: 70,
      military: 60,
      religion: 50,
      colonization: 20
    },
    modifiers: [
      { type: 'defensiveness', value: 25 },
      { type: 'fort_maintenance', value: -25 }
    ],
    behaviors: [
      { action: 'build_forts', weight: 90 },
      { action: 'develop', weight: 80 },
      { action: 'defensive_alliance', weight: 70 }
    ]
  }
];

// Get personality by id
export function getPersonality(id: string): AIPersonality | undefined {
  return AI_PERSONALITIES.find(p => p.id === id);
}

// Calculate action weight based on personality
export function calculateActionWeight(
  personality: AIPersonality,
  action: string,
  baseWeight: number
): number {
  const behavior = personality.behaviors.find(b => b.action === action);
  if (behavior) {
    return baseWeight * (behavior.weight / 50);
  }
  return baseWeight;
}

// Get recommended actions for personality
export function getRecommendedActions(personality: AIPersonality): string[] {
  return personality.behaviors
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 5)
    .map(b => b.action);
}

// Calculate overall aggressiveness
export function getAggressiveness(personality: AIPersonality): number {
  return (personality.priorities.expansion + personality.priorities.military) / 2;
}

// Check if personality would accept alliance
export function wouldAcceptAlliance(
  personality: AIPersonality,
  relations: number,
  powerRatio: number
): boolean {
  const threshold = 50 - personality.priorities.diplomacy / 2;
  const adjustedRelations = relations + (powerRatio > 1 ? 20 : -20);
  return adjustedRelations >= threshold;
}

export default {
  AI_PERSONALITIES,
  getPersonality,
  calculateActionWeight,
  getRecommendedActions,
  getAggressiveness,
  wouldAcceptAlliance
};
