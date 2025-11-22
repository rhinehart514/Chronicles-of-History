// Achievement and milestone system

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  hidden: boolean;
  points: number;
  condition: AchievementCondition;
}

export type AchievementCategory =
  | 'military'
  | 'economic'
  | 'diplomatic'
  | 'exploration'
  | 'cultural'
  | 'special';

export interface AchievementCondition {
  type: string;
  value: number | string;
  comparison?: 'gte' | 'lte' | 'eq';
}

export interface AchievementProgress {
  id: string;
  unlocked: boolean;
  unlockedAt?: number;
  progress?: number;
  maxProgress?: number;
}

// Define all achievements
export const ACHIEVEMENTS: Achievement[] = [
  // Military achievements
  {
    id: 'first_blood',
    name: 'First Blood',
    description: 'Win your first battle',
    icon: '⚔️',
    category: 'military',
    rarity: 'common',
    hidden: false,
    points: 10,
    condition: { type: 'battles_won', value: 1 }
  },
  {
    id: 'conqueror',
    name: 'Conqueror',
    description: 'Conquer 10 provinces',
    icon: '🏴',
    category: 'military',
    rarity: 'uncommon',
    hidden: false,
    points: 25,
    condition: { type: 'provinces_conquered', value: 10 }
  },
  {
    id: 'military_genius',
    name: 'Military Genius',
    description: 'Win 50 battles',
    icon: '🎖️',
    category: 'military',
    rarity: 'rare',
    hidden: false,
    points: 50,
    condition: { type: 'battles_won', value: 50 }
  },
  {
    id: 'world_conqueror',
    name: 'World Conqueror',
    description: 'Control 50% of the world',
    icon: '🌍',
    category: 'military',
    rarity: 'legendary',
    hidden: false,
    points: 100,
    condition: { type: 'world_control', value: 50 }
  },
  {
    id: 'naval_supremacy',
    name: 'Naval Supremacy',
    description: 'Build a navy of 100 ships',
    icon: '⚓',
    category: 'military',
    rarity: 'rare',
    hidden: false,
    points: 50,
    condition: { type: 'total_ships', value: 100 }
  },

  // Economic achievements
  {
    id: 'first_million',
    name: 'First Million',
    description: 'Accumulate 1,000,000 gold in treasury',
    icon: '💰',
    category: 'economic',
    rarity: 'uncommon',
    hidden: false,
    points: 25,
    condition: { type: 'treasury', value: 1000000 }
  },
  {
    id: 'trade_empire',
    name: 'Trade Empire',
    description: 'Control 10 trade routes',
    icon: '🚢',
    category: 'economic',
    rarity: 'rare',
    hidden: false,
    points: 50,
    condition: { type: 'trade_routes', value: 10 }
  },
  {
    id: 'industrialist',
    name: 'Industrialist',
    description: 'Build 50 factories',
    icon: '🏭',
    category: 'economic',
    rarity: 'rare',
    hidden: false,
    points: 50,
    condition: { type: 'factories', value: 50 }
  },
  {
    id: 'merchant_prince',
    name: 'Merchant Prince',
    description: 'Earn 10,000 gold from trade in one year',
    icon: '👑',
    category: 'economic',
    rarity: 'epic',
    hidden: false,
    points: 75,
    condition: { type: 'yearly_trade_income', value: 10000 }
  },

  // Diplomatic achievements
  {
    id: 'diplomat',
    name: 'Diplomat',
    description: 'Form your first alliance',
    icon: '🤝',
    category: 'diplomatic',
    rarity: 'common',
    hidden: false,
    points: 10,
    condition: { type: 'alliances_formed', value: 1 }
  },
  {
    id: 'peacemaker',
    name: 'Peacemaker',
    description: 'End 5 wars through negotiation',
    icon: '🕊️',
    category: 'diplomatic',
    rarity: 'uncommon',
    hidden: false,
    points: 25,
    condition: { type: 'wars_ended_peacefully', value: 5 }
  },
  {
    id: 'royal_dynasty',
    name: 'Royal Dynasty',
    description: 'Have 5 royal marriages',
    icon: '💒',
    category: 'diplomatic',
    rarity: 'rare',
    hidden: false,
    points: 50,
    condition: { type: 'royal_marriages', value: 5 }
  },
  {
    id: 'hegemon',
    name: 'Hegemon',
    description: 'Have 10 nations as vassals',
    icon: '🏰',
    category: 'diplomatic',
    rarity: 'legendary',
    hidden: false,
    points: 100,
    condition: { type: 'vassals', value: 10 }
  },

  // Exploration achievements
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Discover a new continent',
    icon: '🧭',
    category: 'exploration',
    rarity: 'uncommon',
    hidden: false,
    points: 25,
    condition: { type: 'continents_discovered', value: 1 }
  },
  {
    id: 'colonizer',
    name: 'Colonizer',
    description: 'Establish 10 colonies',
    icon: '🏝️',
    category: 'exploration',
    rarity: 'rare',
    hidden: false,
    points: 50,
    condition: { type: 'colonies', value: 10 }
  },
  {
    id: 'circumnavigator',
    name: 'Circumnavigator',
    description: 'Complete a voyage around the world',
    icon: '🌐',
    category: 'exploration',
    rarity: 'epic',
    hidden: true,
    points: 75,
    condition: { type: 'circumnavigation', value: 1 }
  },

  // Cultural achievements
  {
    id: 'renaissance',
    name: 'Renaissance',
    description: 'Research all cultural technologies',
    icon: '🎨',
    category: 'cultural',
    rarity: 'rare',
    hidden: false,
    points: 50,
    condition: { type: 'cultural_techs', value: 'all' }
  },
  {
    id: 'wonder_builder',
    name: 'Wonder Builder',
    description: 'Build a world wonder',
    icon: '🏛️',
    category: 'cultural',
    rarity: 'epic',
    hidden: false,
    points: 75,
    condition: { type: 'wonders', value: 1 }
  },
  {
    id: 'enlightenment',
    name: 'Enlightenment',
    description: 'Achieve 100% literacy',
    icon: '📚',
    category: 'cultural',
    rarity: 'rare',
    hidden: false,
    points: 50,
    condition: { type: 'literacy', value: 100 }
  },

  // Special achievements
  {
    id: 'survivor',
    name: 'Survivor',
    description: 'Survive for 100 years',
    icon: '⏳',
    category: 'special',
    rarity: 'uncommon',
    hidden: false,
    points: 25,
    condition: { type: 'years_played', value: 100 }
  },
  {
    id: 'underdog',
    name: 'Underdog',
    description: 'Win a war against a nation twice your size',
    icon: '🐕',
    category: 'special',
    rarity: 'rare',
    hidden: true,
    points: 50,
    condition: { type: 'underdog_victory', value: 1 }
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Achieve maximum stats in all categories',
    icon: '⭐',
    category: 'special',
    rarity: 'legendary',
    hidden: true,
    points: 100,
    condition: { type: 'max_all_stats', value: 1 }
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Win the game before 1800',
    icon: '⚡',
    category: 'special',
    rarity: 'epic',
    hidden: true,
    points: 75,
    condition: { type: 'victory_year', value: 1800, comparison: 'lte' }
  },
  {
    id: 'pacifist',
    name: 'Pacifist',
    description: 'Win without declaring any wars',
    icon: '☮️',
    category: 'special',
    rarity: 'legendary',
    hidden: true,
    points: 100,
    condition: { type: 'wars_declared', value: 0, comparison: 'eq' }
  }
];

// Check if achievement condition is met
export function checkAchievement(
  achievement: Achievement,
  gameStats: Record<string, number | string>
): boolean {
  const { type, value, comparison = 'gte' } = achievement.condition;
  const currentValue = gameStats[type];

  if (currentValue === undefined) return false;

  if (typeof value === 'string') {
    return currentValue === value;
  }

  const numValue = Number(currentValue);
  switch (comparison) {
    case 'gte': return numValue >= value;
    case 'lte': return numValue <= value;
    case 'eq': return numValue === value;
    default: return false;
  }
}

// Get achievements by category
export function getAchievementsByCategory(category: AchievementCategory): Achievement[] {
  return ACHIEVEMENTS.filter(a => a.category === category);
}

// Get total points for unlocked achievements
export function calculateTotalPoints(progress: AchievementProgress[]): number {
  return progress
    .filter(p => p.unlocked)
    .reduce((sum, p) => {
      const achievement = ACHIEVEMENTS.find(a => a.id === p.id);
      return sum + (achievement?.points || 0);
    }, 0);
}

// Get completion percentage
export function getCompletionPercentage(progress: AchievementProgress[]): number {
  const unlocked = progress.filter(p => p.unlocked).length;
  return Math.round((unlocked / ACHIEVEMENTS.length) * 100);
}

// Get rarity color
export function getRarityColor(rarity: Achievement['rarity']): string {
  switch (rarity) {
    case 'common': return '#9ca3af';
    case 'uncommon': return '#22c55e';
    case 'rare': return '#3b82f6';
    case 'epic': return '#a855f7';
    case 'legendary': return '#f59e0b';
    default: return '#9ca3af';
  }
}

export default {
  ACHIEVEMENTS,
  checkAchievement,
  getAchievementsByCategory,
  calculateTotalPoints,
  getCompletionPercentage,
  getRarityColor
};
