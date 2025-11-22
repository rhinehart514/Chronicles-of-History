// AI decision-making and strategy service

import { NationStats } from '../types';

export interface AIPersonality {
  aggression: number;     // 0-10: How likely to declare wars
  expansion: number;      // 0-10: How much they want to grow
  diplomacy: number;      // 0-10: Preference for alliances
  economy: number;        // 0-10: Focus on economic development
  military: number;       // 0-10: Military buildup priority
  honor: number;          // 0-10: How likely to honor agreements
  risk: number;          // 0-10: Willingness to take risks
}

export interface AIState {
  nationId: string;
  personality: AIPersonality;
  currentStrategy: AIStrategy;
  threats: string[];
  opportunities: string[];
  allies: string[];
  rivals: string[];
}

export type AIStrategy =
  | 'expand'
  | 'consolidate'
  | 'defend'
  | 'trade'
  | 'diplomacy'
  | 'militarize';

// Predefined AI personalities
export const AI_PERSONALITIES: Record<string, AIPersonality> = {
  balanced: {
    aggression: 5,
    expansion: 5,
    diplomacy: 5,
    economy: 5,
    military: 5,
    honor: 5,
    risk: 5
  },
  aggressive: {
    aggression: 8,
    expansion: 7,
    diplomacy: 3,
    economy: 4,
    military: 8,
    honor: 3,
    risk: 7
  },
  defensive: {
    aggression: 2,
    expansion: 3,
    diplomacy: 6,
    economy: 6,
    military: 6,
    honor: 7,
    risk: 3
  },
  diplomatic: {
    aggression: 3,
    expansion: 4,
    diplomacy: 9,
    economy: 6,
    military: 4,
    honor: 8,
    risk: 4
  },
  merchant: {
    aggression: 3,
    expansion: 5,
    diplomacy: 7,
    economy: 9,
    military: 3,
    honor: 6,
    risk: 5
  },
  opportunist: {
    aggression: 6,
    expansion: 7,
    diplomacy: 4,
    economy: 5,
    military: 6,
    honor: 2,
    risk: 8
  },
  isolationist: {
    aggression: 1,
    expansion: 2,
    diplomacy: 2,
    economy: 7,
    military: 5,
    honor: 6,
    risk: 2
  }
};

// Determine AI's current strategy based on situation
export function determineStrategy(
  aiState: AIState,
  nationStats: NationStats,
  power: number,
  averagePower: number
): AIStrategy {
  const personality = aiState.personality;
  const powerRatio = power / averagePower;

  // Check for immediate threats
  if (aiState.threats.length > 0 && powerRatio < 0.8) {
    return 'defend';
  }

  // Strong and aggressive - expand
  if (powerRatio > 1.3 && personality.aggression > 6) {
    return 'expand';
  }

  // Weak - focus on defense and diplomacy
  if (powerRatio < 0.7) {
    if (personality.diplomacy > personality.military) {
      return 'diplomacy';
    }
    return 'defend';
  }

  // Economic issues
  if (nationStats.economy < 3) {
    return 'trade';
  }

  // Military is weak
  if (nationStats.military < 3 && personality.military > 5) {
    return 'militarize';
  }

  // Growing opportunities
  if (aiState.opportunities.length > 0 && personality.expansion > 5) {
    return 'expand';
  }

  // Default to consolidation
  return 'consolidate';
}

// Calculate desire to ally with another nation
export function calculateAllianceDesire(
  aiState: AIState,
  targetId: string,
  relations: number,
  targetPower: number,
  aiPower: number
): number {
  const personality = aiState.personality;
  let desire = 50;

  // Base on relations
  desire += relations * 0.3;

  // Diplomatic personality bonus
  desire += (personality.diplomacy - 5) * 5;

  // Power considerations
  const powerRatio = targetPower / aiPower;
  if (powerRatio > 1.5) {
    // Want strong allies
    desire += 20;
  } else if (powerRatio < 0.5) {
    // Weak allies less valuable
    desire -= 15;
  }

  // Threat defense
  if (aiState.threats.length > 0) {
    desire += 15;
  }

  // Don't ally with rivals
  if (aiState.rivals.includes(targetId)) {
    desire -= 50;
  }

  return Math.max(0, Math.min(100, desire));
}

// Calculate desire to declare war
export function calculateWarDesire(
  aiState: AIState,
  targetId: string,
  relations: number,
  targetPower: number,
  aiPower: number,
  hasCasusBelli: boolean
): number {
  const personality = aiState.personality;
  let desire = 0;

  // Must have negative relations
  if (relations > 0) {
    desire -= 30;
  } else {
    desire += Math.abs(relations) * 0.2;
  }

  // Aggression personality
  desire += (personality.aggression - 5) * 8;

  // Risk tolerance
  const powerRatio = aiPower / targetPower;
  if (powerRatio > 1.5) {
    desire += 25;
  } else if (powerRatio < 0.8) {
    desire -= 30;
    if (personality.risk < 5) {
      desire -= 20;
    }
  }

  // Casus belli bonus
  if (hasCasusBelli) {
    desire += 20;
  } else {
    desire -= 15;
    if (personality.honor > 6) {
      desire -= 20;
    }
  }

  // Rivals
  if (aiState.rivals.includes(targetId)) {
    desire += 30;
  }

  // Already have threats
  if (aiState.threats.length > 1) {
    desire -= 25;
  }

  return Math.max(0, Math.min(100, desire));
}

// Calculate acceptance of peace offer
export function evaluatePeaceOffer(
  aiState: AIState,
  warScore: number,
  demandCost: number
): boolean {
  const personality = aiState.personality;

  // Winning significantly
  if (warScore > 50) {
    // Won't accept unless demands are low
    return demandCost <= warScore * 0.5;
  }

  // Losing significantly
  if (warScore < -50) {
    // More willing to accept harsh terms
    return demandCost <= Math.abs(warScore) * 1.2;
  }

  // Stalemate region
  const exhaustionFactor = aiState.threats.length > 1 ? 1.3 : 1.0;
  const personalityFactor = personality.honor > 6 ? 0.9 : 1.1;

  return demandCost <= Math.abs(warScore) * exhaustionFactor * personalityFactor;
}

// Decide on army movements
export function decideMilitaryAction(
  aiState: AIState,
  enemyProvinces: string[],
  ownProvinces: string[],
  armyStrength: number,
  enemyStrength: number
): 'attack' | 'defend' | 'siege' | 'retreat' {
  const personality = aiState.personality;
  const strengthRatio = armyStrength / enemyStrength;

  // Overwhelming force - attack
  if (strengthRatio > 1.5) {
    return 'attack';
  }

  // Strong advantage - attack or siege
  if (strengthRatio > 1.2) {
    if (personality.aggression > 5) {
      return 'attack';
    }
    return 'siege';
  }

  // Even forces
  if (strengthRatio > 0.8) {
    if (personality.risk > 6) {
      return 'attack';
    }
    return 'defend';
  }

  // Disadvantaged
  if (strengthRatio > 0.5) {
    if (personality.risk > 7) {
      return 'defend';
    }
    return 'retreat';
  }

  // Heavily outmatched
  return 'retreat';
}

// Economic priorities
export function decideEconomicPriority(
  aiState: AIState,
  treasury: number,
  income: number,
  buildings: number,
  techs: number
): 'buildings' | 'army' | 'navy' | 'research' | 'trade' {
  const personality = aiState.personality;
  const wealthRatio = treasury / (income * 12);

  // Low funds - focus on income
  if (wealthRatio < 1) {
    return 'trade';
  }

  // Threatened - military
  if (aiState.threats.length > 0 && personality.military > 4) {
    return 'army';
  }

  // Expansion focused
  if (aiState.currentStrategy === 'expand') {
    if (personality.military > personality.economy) {
      return 'army';
    }
  }

  // Based on personality
  if (personality.economy > 6 && buildings < 20) {
    return 'buildings';
  }

  if (personality.military > 6) {
    return 'army';
  }

  // Default to research
  return 'research';
}

// Generate random personality with variation
export function generateRandomPersonality(): AIPersonality {
  const base = Object.values(AI_PERSONALITIES)[
    Math.floor(Math.random() * Object.values(AI_PERSONALITIES).length)
  ];

  // Add variation
  return {
    aggression: Math.max(0, Math.min(10, base.aggression + (Math.random() * 4 - 2))),
    expansion: Math.max(0, Math.min(10, base.expansion + (Math.random() * 4 - 2))),
    diplomacy: Math.max(0, Math.min(10, base.diplomacy + (Math.random() * 4 - 2))),
    economy: Math.max(0, Math.min(10, base.economy + (Math.random() * 4 - 2))),
    military: Math.max(0, Math.min(10, base.military + (Math.random() * 4 - 2))),
    honor: Math.max(0, Math.min(10, base.honor + (Math.random() * 4 - 2))),
    risk: Math.max(0, Math.min(10, base.risk + (Math.random() * 4 - 2)))
  };
}

export default {
  AI_PERSONALITIES,
  determineStrategy,
  calculateAllianceDesire,
  calculateWarDesire,
  evaluatePeaceOffer,
  decideMilitaryAction,
  decideEconomicPriority,
  generateRandomPersonality
};
