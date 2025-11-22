// Achievements system

export interface Achievement {
  id: string;
  name: string;
  icon: string;
  description: string;
  hint: string;
  category: AchievementCategory;
  difficulty: AchievementDifficulty;
  hidden: boolean;
  requirements: AchievementRequirement[];
  points: number;
}

export type AchievementCategory = 'conquest' | 'diplomacy' | 'economy' | 'military' | 'religion' | 'exploration' | 'special';
export type AchievementDifficulty = 'easy' | 'medium' | 'hard' | 'very_hard' | 'insane';

export interface AchievementRequirement {
  type: RequirementType;
  value: string | number;
  comparison?: 'eq' | 'gt' | 'lt' | 'gte' | 'lte';
}

export type RequirementType =
  | 'own_province'
  | 'own_provinces_count'
  | 'total_development'
  | 'income'
  | 'army_size'
  | 'navy_size'
  | 'vassals'
  | 'allies'
  | 'wars_won'
  | 'technology_level'
  | 'start_nation'
  | 'formed_nation'
  | 'religion'
  | 'culture'
  | 'year';

// All achievements
export const ACHIEVEMENTS: Achievement[] = [
  // Conquest
  {
    id: 'world_conqueror',
    name: 'World Conqueror',
    icon: '🌍',
    description: 'Own or have as subject every province in the world',
    hint: 'Conquer everything',
    category: 'conquest',
    difficulty: 'insane',
    hidden: false,
    requirements: [
      { type: 'own_provinces_count', value: 'all', comparison: 'eq' }
    ],
    points: 100
  },
  {
    id: 'great_power',
    name: 'Great Power',
    icon: '⭐',
    description: 'Become a Great Power',
    hint: 'Grow your nation',
    category: 'conquest',
    difficulty: 'easy',
    hidden: false,
    requirements: [
      { type: 'total_development', value: 300, comparison: 'gte' }
    ],
    points: 10
  },
  {
    id: 'empire_builder',
    name: 'Empire Builder',
    icon: '👑',
    description: 'Own 200 provinces',
    hint: 'Expand your borders',
    category: 'conquest',
    difficulty: 'medium',
    hidden: false,
    requirements: [
      { type: 'own_provinces_count', value: 200, comparison: 'gte' }
    ],
    points: 25
  },
  {
    id: 'three_mountains',
    name: 'The Three Mountains',
    icon: '⛰️',
    description: 'Own or have as subject every province in the world as Ryukyu',
    hint: 'Start as the smallest and become the largest',
    category: 'conquest',
    difficulty: 'insane',
    hidden: false,
    requirements: [
      { type: 'start_nation', value: 'ryukyu' },
      { type: 'own_provinces_count', value: 'all', comparison: 'eq' }
    ],
    points: 100
  },

  // Diplomacy
  {
    id: 'diplomatic_master',
    name: 'Diplomatic Master',
    icon: '🤝',
    description: 'Have 5 allies simultaneously',
    hint: 'Make friends',
    category: 'diplomacy',
    difficulty: 'easy',
    hidden: false,
    requirements: [
      { type: 'allies', value: 5, comparison: 'gte' }
    ],
    points: 10
  },
  {
    id: 'puppet_master',
    name: 'Puppet Master',
    icon: '🎭',
    description: 'Have 10 subject nations',
    hint: 'Vassalize others',
    category: 'diplomacy',
    difficulty: 'medium',
    hidden: false,
    requirements: [
      { type: 'vassals', value: 10, comparison: 'gte' }
    ],
    points: 25
  },
  {
    id: 'marriage_web',
    name: 'Royal Marriage Web',
    icon: '💒',
    description: 'Have royal marriages with 8 nations at once',
    hint: 'Spread your dynasty',
    category: 'diplomacy',
    difficulty: 'medium',
    hidden: false,
    requirements: [],
    points: 20
  },

  // Economy
  {
    id: 'wealthy_nation',
    name: 'Wealthy Nation',
    icon: '💰',
    description: 'Have a monthly income of 100 ducats',
    hint: 'Grow your economy',
    category: 'economy',
    difficulty: 'easy',
    hidden: false,
    requirements: [
      { type: 'income', value: 100, comparison: 'gte' }
    ],
    points: 10
  },
  {
    id: 'trade_hegemon',
    name: 'Trade Hegemon',
    icon: '🚢',
    description: 'Control 90% of trade power in a trade node',
    hint: 'Dominate trade',
    category: 'economy',
    difficulty: 'medium',
    hidden: false,
    requirements: [],
    points: 25
  },
  {
    id: 'midas_touch',
    name: "Midas' Touch",
    icon: '✨',
    description: 'Have 1000 ducats in your treasury',
    hint: 'Save your gold',
    category: 'economy',
    difficulty: 'easy',
    hidden: false,
    requirements: [],
    points: 15
  },

  // Military
  {
    id: 'military_might',
    name: 'Military Might',
    icon: '⚔️',
    description: 'Have an army of 100,000 troops',
    hint: 'Build a massive army',
    category: 'military',
    difficulty: 'medium',
    hidden: false,
    requirements: [
      { type: 'army_size', value: 100000, comparison: 'gte' }
    ],
    points: 20
  },
  {
    id: 'naval_supremacy',
    name: 'Naval Supremacy',
    icon: '⚓',
    description: 'Have 100 heavy ships',
    hint: 'Rule the waves',
    category: 'military',
    difficulty: 'hard',
    hidden: false,
    requirements: [
      { type: 'navy_size', value: 100, comparison: 'gte' }
    ],
    points: 30
  },
  {
    id: 'undefeated',
    name: 'Undefeated',
    icon: '🏆',
    description: 'Win 10 wars without losing any',
    hint: 'Perfect war record',
    category: 'military',
    difficulty: 'hard',
    hidden: false,
    requirements: [
      { type: 'wars_won', value: 10, comparison: 'gte' }
    ],
    points: 35
  },

  // Religion
  {
    id: 'defender_faith',
    name: 'Defender of the Faith',
    icon: '✝️',
    description: 'Become Defender of the Faith',
    hint: 'Defend your religion',
    category: 'religion',
    difficulty: 'easy',
    hidden: false,
    requirements: [],
    points: 15
  },
  {
    id: 'one_faith',
    name: 'One Faith',
    icon: '🙏',
    description: 'Convert all provinces in the world to your religion',
    hint: 'Spread your faith everywhere',
    category: 'religion',
    difficulty: 'insane',
    hidden: false,
    requirements: [],
    points: 100
  },

  // Exploration
  {
    id: 'new_world',
    name: 'New World',
    icon: '🗺️',
    description: 'Discover the Americas',
    hint: 'Explore west',
    category: 'exploration',
    difficulty: 'easy',
    hidden: false,
    requirements: [],
    points: 10
  },
  {
    id: 'circumnavigation',
    name: 'Around the World',
    icon: '🌐',
    description: 'Complete a circumnavigation',
    hint: 'Sail around the world',
    category: 'exploration',
    difficulty: 'medium',
    hidden: false,
    requirements: [],
    points: 25
  },
  {
    id: 'colonial_empire',
    name: 'Colonial Empire',
    icon: '🌴',
    description: 'Have 5 colonial nations',
    hint: 'Colonize new lands',
    category: 'exploration',
    difficulty: 'medium',
    hidden: false,
    requirements: [],
    points: 25
  },

  // Special
  {
    id: 'just_getting_started',
    name: 'Just Getting Started',
    icon: '🎮',
    description: 'Complete a game',
    hint: 'Play until the end date',
    category: 'special',
    difficulty: 'easy',
    hidden: false,
    requirements: [
      { type: 'year', value: 1821, comparison: 'gte' }
    ],
    points: 5
  },
  {
    id: 'basileus',
    name: 'Basileus',
    icon: '🦅',
    description: 'As Byzantium, restore the Roman Empire',
    hint: 'Restore past glory',
    category: 'special',
    difficulty: 'very_hard',
    hidden: false,
    requirements: [
      { type: 'start_nation', value: 'byzantium' },
      { type: 'formed_nation', value: 'rome' }
    ],
    points: 50
  },
  {
    id: 'mare_nostrum',
    name: 'Mare Nostrum',
    icon: '🌊',
    description: 'Own all Mediterranean coastal provinces',
    hint: 'Control the inner sea',
    category: 'special',
    difficulty: 'hard',
    hidden: false,
    requirements: [],
    points: 40
  },
  {
    id: 'sunset_invasion',
    name: 'Sunset Invasion',
    icon: '🌅',
    description: 'As an Aztec, own all of Iberia',
    hint: 'Reverse colonization',
    category: 'special',
    difficulty: 'very_hard',
    hidden: false,
    requirements: [
      { type: 'start_nation', value: 'aztec' }
    ],
    points: 50
  }
];

// Get achievements by category
export function getAchievementsByCategory(category: AchievementCategory): Achievement[] {
  return ACHIEVEMENTS.filter(a => a.category === category);
}

// Get achievements by difficulty
export function getAchievementsByDifficulty(difficulty: AchievementDifficulty): Achievement[] {
  return ACHIEVEMENTS.filter(a => a.difficulty === difficulty);
}

// Calculate total points
export function calculateTotalPoints(unlockedIds: string[]): number {
  return unlockedIds.reduce((sum, id) => {
    const achievement = ACHIEVEMENTS.find(a => a.id === id);
    return sum + (achievement?.points || 0);
  }, 0);
}

// Get achievement progress
export function getAchievementProgress(
  achievementId: string,
  gameState: Record<string, any>
): number {
  const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
  if (!achievement) return 0;

  // Simplified progress calculation
  let totalReqs = achievement.requirements.length;
  let metReqs = 0;

  for (const req of achievement.requirements) {
    const value = gameState[req.type];
    if (value !== undefined) {
      switch (req.comparison) {
        case 'gte':
          if (value >= req.value) metReqs++;
          break;
        case 'eq':
          if (value === req.value) metReqs++;
          break;
        default:
          if (value === req.value) metReqs++;
      }
    }
  }

  return totalReqs > 0 ? (metReqs / totalReqs) * 100 : 100;
}

export default {
  ACHIEVEMENTS,
  getAchievementsByCategory,
  getAchievementsByDifficulty,
  calculateTotalPoints,
  getAchievementProgress
};
