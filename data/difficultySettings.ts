// Difficulty settings for the game

export type DifficultyLevel = 'easy' | 'normal' | 'hard' | 'ironman';

export interface DifficultySettings {
  level: DifficultyLevel;
  name: string;
  description: string;

  // Gameplay modifiers
  playerStatBonus: number;           // Bonus to player nation stats
  aiAggressiveness: number;          // How aggressive AI nations are (0-1)
  eventFrequency: number;            // Multiplier for random events
  negativeEventChance: number;       // Chance of negative events (0-1)
  economyMultiplier: number;         // Multiplier for economic gains
  stabilityDecay: number;            // How fast stability decays
  researchSpeed: number;             // Research progress multiplier

  // Special rules
  allowSaveScum: boolean;            // Can reload saves freely
  showAIPlans: boolean;              // Show AI nation intentions
  forgivingDiplomacy: boolean;       // AI forgives transgressions faster
}

export const DIFFICULTY_PRESETS: Record<DifficultyLevel, DifficultySettings> = {
  easy: {
    level: 'easy',
    name: 'Historian',
    description: 'For those who want to experience the narrative without much challenge. Perfect for learning.',
    playerStatBonus: 1,
    aiAggressiveness: 0.3,
    eventFrequency: 0.7,
    negativeEventChance: 0.3,
    economyMultiplier: 1.5,
    stabilityDecay: 0.5,
    researchSpeed: 1.5,
    allowSaveScum: true,
    showAIPlans: true,
    forgivingDiplomacy: true
  },

  normal: {
    level: 'normal',
    name: 'Statesman',
    description: 'The balanced experience. Challenge without frustration.',
    playerStatBonus: 0,
    aiAggressiveness: 0.5,
    eventFrequency: 1.0,
    negativeEventChance: 0.5,
    economyMultiplier: 1.0,
    stabilityDecay: 1.0,
    researchSpeed: 1.0,
    allowSaveScum: true,
    showAIPlans: false,
    forgivingDiplomacy: false
  },

  hard: {
    level: 'hard',
    name: 'Emperor',
    description: 'For experienced players. AI is aggressive and events can be brutal.',
    playerStatBonus: -1,
    aiAggressiveness: 0.8,
    eventFrequency: 1.3,
    negativeEventChance: 0.6,
    economyMultiplier: 0.8,
    stabilityDecay: 1.5,
    researchSpeed: 0.8,
    allowSaveScum: true,
    showAIPlans: false,
    forgivingDiplomacy: false
  },

  ironman: {
    level: 'ironman',
    name: 'Ironman',
    description: 'One save. No reloading. Every decision is permanent. True challenge.',
    playerStatBonus: 0,
    aiAggressiveness: 0.6,
    eventFrequency: 1.0,
    negativeEventChance: 0.5,
    economyMultiplier: 1.0,
    stabilityDecay: 1.0,
    researchSpeed: 1.0,
    allowSaveScum: false,
    showAIPlans: false,
    forgivingDiplomacy: false
  }
};

// Get difficulty settings by level
export function getDifficulty(level: DifficultyLevel): DifficultySettings {
  return DIFFICULTY_PRESETS[level];
}

// Apply difficulty modifier to a stat value
export function applyDifficultyModifier(
  baseValue: number,
  modifier: number,
  operation: 'add' | 'multiply' = 'multiply'
): number {
  if (operation === 'add') {
    return baseValue + modifier;
  }
  return baseValue * modifier;
}

// Check if an event should fire based on difficulty
export function shouldEventFire(
  baseChance: number,
  difficulty: DifficultySettings,
  isNegative: boolean
): boolean {
  let adjustedChance = baseChance * difficulty.eventFrequency;

  if (isNegative) {
    adjustedChance *= difficulty.negativeEventChance * 2; // Scale negative events
  }

  return Math.random() < adjustedChance;
}

export default DIFFICULTY_PRESETS;
