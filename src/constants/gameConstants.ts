// Game balance constants

// Time settings
export const GAME_START_DATE = '1444-11-11';
export const GAME_END_DATE = '1821-01-01';
export const DAYS_PER_MONTH = 30;
export const MONTHS_PER_YEAR = 12;

// Base income/costs
export const BASE_TAX_INCOME = 1.0;
export const BASE_PRODUCTION_INCOME = 1.0;
export const BASE_TRADE_INCOME = 1.0;
export const ADVISOR_COST_MULTIPLIER = 0.5;
export const ARMY_MAINTENANCE_MULTIPLIER = 0.02;
export const NAVY_MAINTENANCE_MULTIPLIER = 0.03;
export const FORT_MAINTENANCE = 0.5;

// Monarch power
export const BASE_MONARCH_POWER = 3;
export const MAX_MONARCH_POWER = 999;
export const POWER_COST_TECH = 600;
export const POWER_COST_IDEA = 400;
export const POWER_COST_DEVELOPMENT = 50;
export const POWER_COST_HARSH_TREATMENT = 100;
export const POWER_COST_RAISE_STABILITY = 100;
export const POWER_COST_REDUCE_WAR_EXHAUSTION = 75;

// Military
export const BASE_MANPOWER_RECOVERY = 0.01; // 1% per month
export const MAX_COMBAT_WIDTH = 40;
export const REINFORCE_SPEED = 0.1; // 10% per month
export const ATTRITION_BASE = 0.01;
export const SIEGE_ABILITY_BASE = 1;

// Diplomacy
export const MAX_DIPLOMATIC_RELATIONS = 4;
export const BASE_RELATIONS_DECAY = 1; // per year
export const ALLIANCE_RELATION_REQUIREMENT = 0;
export const ROYAL_MARRIAGE_RELATION_REQUIREMENT = 0;
export const IMPROVE_RELATIONS_PER_MONTH = 2;
export const MAX_RELATIONS = 200;
export const MIN_RELATIONS = -200;

// Stability and unrest
export const MAX_STABILITY = 3;
export const MIN_STABILITY = -3;
export const BASE_UNREST = 0;
export const OVEREXTENSION_UNREST = 0.05; // per 1% overextension
export const AUTONOMY_CHANGE_UNREST = 10;

// Development
export const BASE_DEVELOPMENT_COST = 50;
export const DEVELOPMENT_COST_MODIFIER = 0.03; // 3% per existing dev
export const MAX_DEVELOPMENT = 999;

// Technology
export const INSTITUTION_SPREAD_BASE = 0.01;
export const TECH_PENALTY_PER_INSTITUTION = 0.5; // 50% per missing institution

// Trade
export const BASE_TRADE_POWER = 5;
export const CARAVAN_POWER = 3;
export const LIGHT_SHIP_TRADE_POWER = 2;
export const MERCHANT_TRADE_POWER = 2;
export const TRADE_EFFICIENCY_BASE = 1.0;

// Colonization
export const BASE_COLONIST_GROWTH = 25;
export const COLONY_COST_BASE = 2;
export const NATIVE_UPRISING_CHANCE = 0.02;

// War score
export const WAR_SCORE_BATTLE = 1;
export const WAR_SCORE_SIEGE = 3;
export const WAR_SCORE_BLOCKADE = 0.1;
export const WAR_SCORE_MAX = 100;

// Age bonuses
export const AGE_OBJECTIVES_REQUIRED = 3;
export const AGE_ABILITY_SPLENDOR_COST = 800;

// Misc
export const GOVERNING_CAPACITY_BASE = 200;
export const CORRUPTION_COST = 0.05;
export const INFLATION_REDUCTION_COST = 75;
export const LEGITIMACY_DECAY = 1;
export const REPUBLICAN_TRADITION_DECAY = 1;

// Speed multipliers (milliseconds per day)
export const GAME_SPEEDS = {
  0: 0,      // Paused
  1: 2000,   // Very slow
  2: 1000,   // Slow
  3: 500,    // Normal
  4: 200,    // Fast
  5: 50,     // Very fast
};

// UI constants
export const TOOLTIP_DELAY = 500;
export const NOTIFICATION_DURATION = 5000;
export const MAX_SAVED_GAMES = 100;
