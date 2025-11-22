// Centralized game constants and configuration

// Game timing
export const GAME_CONFIG = {
  START_YEAR: 1750,
  END_YEAR: 1950,
  YEARS_PER_ERA: 50,

  // Auto-advance delays (ms)
  SPEED_NORMAL: 0, // Manual
  SPEED_FAST: 3000,
  SPEED_FASTEST: 1000,

  // Autosave interval
  AUTOSAVE_INTERVAL: 1, // Every turn
} as const;

// Stat limits
export const STAT_CONFIG = {
  MIN: 1,
  MAX: 5,
  DEFAULT: 3,
} as const;

// Faction config
export const FACTION_CONFIG = {
  MIN_APPROVAL: 0,
  MAX_APPROVAL: 100,
  REBELLION_THRESHOLD: 20,
  HAPPY_THRESHOLD: 70,
} as const;

// War config
export const WAR_CONFIG = {
  WAR_EXHAUSTION_PER_YEAR: 5,
  PEACE_COOLDOWN_YEARS: 10,
  VICTORY_PRESTIGE: 1,
  DEFEAT_PRESTIGE: -1,
} as const;

// Economy config
export const ECONOMY_CONFIG = {
  BANKRUPTCY_THRESHOLD: 0,
  TRADE_VALUE_MULTIPLIER: 1.0,
  TAX_STABILITY_IMPACT: -5,
} as const;

// Research config
export const RESEARCH_CONFIG = {
  BASE_POINTS_PER_TURN: 10,
  INNOVATION_MULTIPLIER: 5,
  ECONOMY_MULTIPLIER: 2,
} as const;

// Diplomacy config
export const DIPLOMACY_CONFIG = {
  OPINION_MIN: -100,
  OPINION_MAX: 100,
  ALLIANCE_THRESHOLD: 50,
  WAR_THRESHOLD: -50,
  OPINION_DECAY_PER_YEAR: 1,
} as const;

// UI config
export const UI_CONFIG = {
  NOTIFICATION_DURATION: 5000,
  ACHIEVEMENT_DURATION: 7000,
  TOOLTIP_DELAY: 300,
  ANIMATION_DURATION: 300,
} as const;

// API config
export const API_CONFIG = {
  TEXT_RATE_LIMIT: 30, // per minute
  IMAGE_RATE_LIMIT: 10,
  CACHE_TTL_SHORT: 5 * 60 * 1000, // 5 min
  CACHE_TTL_MEDIUM: 30 * 60 * 1000, // 30 min
  CACHE_TTL_LONG: 60 * 60 * 1000, // 1 hour
} as const;

// Achievement thresholds
export const ACHIEVEMENT_THRESHOLDS = {
  WARS_WON_BRONZE: 1,
  WARS_WON_SILVER: 5,
  WARS_WON_GOLD: 10,
  TERRITORIES_BRONZE: 5,
  TERRITORIES_SILVER: 10,
  TERRITORIES_GOLD: 20,
  YEARS_PLAYED_BRONZE: 50,
  YEARS_PLAYED_SILVER: 100,
  YEARS_PLAYED_GOLD: 200,
} as const;

// Legacy score weights
export const SCORE_WEIGHTS = {
  MILITARY: 25,
  ECONOMY: 25,
  DIPLOMACY: 20,
  CULTURE: 15,
  LONGEVITY: 15,
} as const;

// Historical periods
export const ERAS = {
  EARLY_MODERN: { start: 1500, end: 1750 },
  ENLIGHTENMENT: { start: 1750, end: 1800 },
  REVOLUTIONARY: { start: 1789, end: 1848 },
  INDUSTRIAL: { start: 1800, end: 1900 },
  IMPERIAL: { start: 1870, end: 1914 },
  GREAT_WAR: { start: 1914, end: 1918 },
  INTERWAR: { start: 1918, end: 1939 },
  WORLD_WAR: { start: 1939, end: 1945 },
  COLD_WAR: { start: 1945, end: 1991 },
  MODERN: { start: 1991, end: 2100 },
} as const;

// Color schemes
export const COLORS = {
  PRIMARY: '#f4efe4',
  SECONDARY: '#2c241b',
  ACCENT: '#d4a574',
  SUCCESS: '#22c55e',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#3b82f6',
} as const;

// Keyboard shortcuts
export const SHORTCUTS = {
  SAVE: 'ctrl+s',
  LOAD: 'ctrl+o',
  WORLD: 'w',
  COURT: 'c',
  DIPLOMACY: 'd',
  RESEARCH: 'r',
  END_TURN: 'space',
  ESCAPE: 'escape',
} as const;

export default {
  GAME_CONFIG,
  STAT_CONFIG,
  FACTION_CONFIG,
  WAR_CONFIG,
  ECONOMY_CONFIG,
  RESEARCH_CONFIG,
  DIPLOMACY_CONFIG,
  UI_CONFIG,
  API_CONFIG,
  ACHIEVEMENT_THRESHOLDS,
  SCORE_WEIGHTS,
  ERAS,
  COLORS,
  SHORTCUTS,
};
