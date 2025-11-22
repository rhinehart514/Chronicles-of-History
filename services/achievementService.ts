// Achievement and statistics tracking system

import { Nation, LogEntry, War } from '../types';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'military' | 'diplomacy' | 'economy' | 'culture' | 'special';
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  condition: (stats: PlayerStats) => boolean;
  unlockedAt?: number; // Timestamp when unlocked
}

export interface PlayerStats {
  // Lifetime stats
  totalGamesPlayed: number;
  totalYearsPlayed: number;
  totalDecisionsMade: number;

  // War stats
  warsWon: number;
  warsLost: number;
  territoriesConquered: number;

  // Diplomatic stats
  alliancesFormed: number;
  treatiesSigned: number;
  royalMarriages: number;

  // Economic stats
  maxEconomyReached: number;
  tradeDealsMade: number;

  // Other
  nationsPlayed: string[];
  longestReign: number;
  techsResearched: number;
  revolutionsSurvived: number;
  leadersLost: number;
}

// Default empty stats
export const DEFAULT_STATS: PlayerStats = {
  totalGamesPlayed: 0,
  totalYearsPlayed: 0,
  totalDecisionsMade: 0,
  warsWon: 0,
  warsLost: 0,
  territoriesConquered: 0,
  alliancesFormed: 0,
  treatiesSigned: 0,
  royalMarriages: 0,
  maxEconomyReached: 0,
  tradeDealsMade: 0,
  nationsPlayed: [],
  longestReign: 0,
  techsResearched: 0,
  revolutionsSurvived: 0,
  leadersLost: 0
};

// All achievements
export const ACHIEVEMENTS: Achievement[] = [
  // Military
  {
    id: 'first_blood',
    name: 'First Blood',
    description: 'Win your first war',
    icon: '⚔️',
    category: 'military',
    rarity: 'common',
    condition: (stats) => stats.warsWon >= 1
  },
  {
    id: 'conqueror',
    name: 'Conqueror',
    description: 'Win 10 wars',
    icon: '🏆',
    category: 'military',
    rarity: 'uncommon',
    condition: (stats) => stats.warsWon >= 10
  },
  {
    id: 'world_domination',
    name: 'World Domination',
    description: 'Conquer 20 territories',
    icon: '🌍',
    category: 'military',
    rarity: 'rare',
    condition: (stats) => stats.territoriesConquered >= 20
  },

  // Diplomacy
  {
    id: 'diplomat',
    name: 'Diplomat',
    description: 'Form your first alliance',
    icon: '🤝',
    category: 'diplomacy',
    rarity: 'common',
    condition: (stats) => stats.alliancesFormed >= 1
  },
  {
    id: 'matchmaker',
    name: 'Matchmaker',
    description: 'Arrange 5 royal marriages',
    icon: '💒',
    category: 'diplomacy',
    rarity: 'uncommon',
    condition: (stats) => stats.royalMarriages >= 5
  },
  {
    id: 'peace_maker',
    name: 'Peace Maker',
    description: 'Sign 10 treaties',
    icon: '📜',
    category: 'diplomacy',
    rarity: 'uncommon',
    condition: (stats) => stats.treatiesSigned >= 10
  },

  // Economy
  {
    id: 'merchant_prince',
    name: 'Merchant Prince',
    description: 'Reach maximum economy (5)',
    icon: '💰',
    category: 'economy',
    rarity: 'uncommon',
    condition: (stats) => stats.maxEconomyReached >= 5
  },
  {
    id: 'trader',
    name: 'Trader',
    description: 'Make 10 trade deals',
    icon: '🚢',
    category: 'economy',
    rarity: 'uncommon',
    condition: (stats) => stats.tradeDealsMade >= 10
  },

  // Culture/Special
  {
    id: 'innovator',
    name: 'Innovator',
    description: 'Research 20 technologies',
    icon: '💡',
    category: 'culture',
    rarity: 'uncommon',
    condition: (stats) => stats.techsResearched >= 20
  },
  {
    id: 'survivor',
    name: 'Survivor',
    description: 'Survive a revolution',
    icon: '🔥',
    category: 'special',
    rarity: 'rare',
    condition: (stats) => stats.revolutionsSurvived >= 1
  },
  {
    id: 'centenarian',
    name: 'Centenarian',
    description: 'Rule for 100 years',
    icon: '👑',
    category: 'special',
    rarity: 'rare',
    condition: (stats) => stats.longestReign >= 100
  },
  {
    id: 'historian',
    name: 'Historian',
    description: 'Make 500 decisions',
    icon: '📚',
    category: 'special',
    rarity: 'rare',
    condition: (stats) => stats.totalDecisionsMade >= 500
  },
  {
    id: 'world_traveler',
    name: 'World Traveler',
    description: 'Play as 5 different nations',
    icon: '🗺️',
    category: 'special',
    rarity: 'uncommon',
    condition: (stats) => stats.nationsPlayed.length >= 5
  },
  {
    id: 'legendary',
    name: 'Legendary',
    description: 'Play for 1000 years total',
    icon: '⭐',
    category: 'special',
    rarity: 'legendary',
    condition: (stats) => stats.totalYearsPlayed >= 1000
  }
];

const STORAGE_KEY = 'chronicles_stats';
const ACHIEVEMENTS_KEY = 'chronicles_achievements';

// Load stats from localStorage
export function loadStats(): PlayerStats {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_STATS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Failed to load stats:', e);
  }
  return { ...DEFAULT_STATS };
}

// Save stats to localStorage
export function saveStats(stats: PlayerStats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats:', e);
  }
}

// Load unlocked achievements
export function loadUnlockedAchievements(): string[] {
  try {
    const saved = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load achievements:', e);
  }
  return [];
}

// Save unlocked achievements
export function saveUnlockedAchievements(ids: string[]): void {
  try {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(ids));
  } catch (e) {
    console.error('Failed to save achievements:', e);
  }
}

// Check for new achievements and return any newly unlocked
export function checkAchievements(stats: PlayerStats): Achievement[] {
  const unlocked = loadUnlockedAchievements();
  const newlyUnlocked: Achievement[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (!unlocked.includes(achievement.id) && achievement.condition(stats)) {
      newlyUnlocked.push({
        ...achievement,
        unlockedAt: Date.now()
      });
      unlocked.push(achievement.id);
    }
  }

  if (newlyUnlocked.length > 0) {
    saveUnlockedAchievements(unlocked);
  }

  return newlyUnlocked;
}

// Get all achievements with unlock status
export function getAllAchievements(): (Achievement & { unlocked: boolean })[] {
  const unlocked = loadUnlockedAchievements();
  return ACHIEVEMENTS.map(a => ({
    ...a,
    unlocked: unlocked.includes(a.id)
  }));
}

// Update stats based on game events
export function updateStats(
  currentStats: PlayerStats,
  event: 'decision' | 'war_won' | 'war_lost' | 'territory' | 'alliance' | 'treaty' | 'marriage' | 'tech' | 'revolution',
  value?: number | string
): PlayerStats {
  const stats = { ...currentStats };

  switch (event) {
    case 'decision':
      stats.totalDecisionsMade++;
      break;
    case 'war_won':
      stats.warsWon++;
      break;
    case 'war_lost':
      stats.warsLost++;
      break;
    case 'territory':
      stats.territoriesConquered++;
      break;
    case 'alliance':
      stats.alliancesFormed++;
      break;
    case 'treaty':
      stats.treatiesSigned++;
      break;
    case 'marriage':
      stats.royalMarriages++;
      break;
    case 'tech':
      stats.techsResearched++;
      break;
    case 'revolution':
      stats.revolutionsSurvived++;
      break;
  }

  return stats;
}

export default {
  loadStats,
  saveStats,
  checkAchievements,
  getAllAchievements,
  updateStats,
  ACHIEVEMENTS
};
