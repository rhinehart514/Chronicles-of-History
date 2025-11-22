// Game balance constants and formulas

// Base costs
export const BASE_COSTS = {
  // Building costs
  building_base: 100,
  building_per_dev: 5,

  // Development costs
  develop_province_base: 50,
  develop_per_existing_dev: 3,

  // Technology costs
  tech_base: 600,
  tech_level_mult: 1.0,
  ahead_of_time_penalty: 10,

  // Coring
  core_base: 10,
  core_per_dev: 1,

  // Stability
  stability_base: 100,
  stability_dev_factor: 0.5,

  // Advisor
  advisor_base: 50,
  advisor_per_skill: 100,
  advisor_maintenance_mult: 0.5,

  // Military
  infantry_cost: 10,
  cavalry_cost: 25,
  artillery_cost: 30,
  ship_cost_mult: 3,

  // Mercenary
  mercenary_mult: 2.5,

  // Diplomacy
  improve_relations_cost: 0,
  alliance_acceptance_base: -50
};

// Modifier caps
export const MODIFIER_CAPS = {
  discipline_min: 50,
  discipline_max: 150,
  morale_min: 0.5,
  morale_max: 10,
  tech_cost_min: -90,
  autonomy_min: 0,
  autonomy_max: 100,
  stability_min: -3,
  stability_max: 3,
  prestige_min: -100,
  prestige_max: 100,
  legitimacy_min: 0,
  legitimacy_max: 100,
  republican_tradition_min: 0,
  republican_tradition_max: 100,
  corruption_min: 0,
  corruption_max: 100,
  overextension_max: 300,
  war_exhaustion_max: 20,
  inflation_min: 0
};

// Combat formulas
export const COMBAT = {
  base_morale: 2.0,
  morale_per_tech: 0.5,
  base_width: 15,
  width_per_tech: 2,
  cavalry_flanking: 2,
  artillery_bonus_row: 0.5,
  terrain_max_penalty: -2,
  river_crossing_penalty: -1,
  strait_crossing_penalty: -2,
  siege_base_progress: 5,
  siege_per_cannon: 1,
  attrition_base: 1,
  attrition_supply_factor: 0.5
};

// Economy formulas
export const ECONOMY = {
  base_tax: 1,
  base_production: 1,
  trade_power_base: 2,
  inflation_from_gold: 0.5,
  corruption_cost: 0.05,
  autonomy_effect: -1, // -1% output per 1% autonomy
  devastation_effect: -1,
  maintenance_modifier_cap: 0.5
};

// Diplomatic relations
export const DIPLOMACY = {
  max_relations: 200,
  min_relations: -200,
  decay_per_year: 1,
  trust_max: 100,
  trust_min: -100,
  trust_gain_from_alliance: 1,
  trust_loss_from_break: -20,
  ae_coalition_threshold: 50,
  ae_decay_per_year: 2,
  truce_base_years: 5
};

// Calculate development cost
export function calculateDevelopmentCost(
  currentDev: number,
  terrain: string,
  climate: string,
  modifiers: number
): number {
  let cost = BASE_COSTS.develop_province_base;
  cost += currentDev * BASE_COSTS.develop_per_existing_dev;

  // Terrain modifier
  const terrainMods: Record<string, number> = {
    farmlands: -5,
    grasslands: 0,
    forest: 5,
    hills: 10,
    mountains: 20,
    desert: 25,
    jungle: 15,
    marsh: 10,
    steppe: 5
  };
  cost += terrainMods[terrain] || 0;

  // Climate modifier
  const climateMods: Record<string, number> = {
    temperate: 0,
    tropical: 10,
    arid: 15,
    arctic: 20
  };
  cost += climateMods[climate] || 0;

  // Apply percentage modifiers
  cost *= (1 + modifiers / 100);

  return Math.max(1, Math.round(cost));
}

// Calculate coring cost
export function calculateCoringCost(
  development: number,
  isClaim: boolean,
  isCulture: boolean,
  modifiers: number
): number {
  let cost = BASE_COSTS.core_base + development * BASE_COSTS.core_per_dev;

  if (isClaim) cost *= 0.75;
  if (isCulture) cost *= 0.5;

  cost *= (1 + modifiers / 100);

  return Math.max(1, Math.round(cost));
}

// Calculate advisor cost
export function calculateAdvisorCost(skill: number): number {
  return BASE_COSTS.advisor_base + (skill * skill) * BASE_COSTS.advisor_per_skill;
}

// Calculate army maintenance
export function calculateArmyMaintenance(
  infantry: number,
  cavalry: number,
  artillery: number,
  maintenanceModifier: number
): number {
  const base = infantry * BASE_COSTS.infantry_cost * 0.1 +
    cavalry * BASE_COSTS.cavalry_cost * 0.1 +
    artillery * BASE_COSTS.artillery_cost * 0.1;

  const modifier = Math.max(ECONOMY.maintenance_modifier_cap, 1 + maintenanceModifier / 100);

  return base * modifier;
}

// Calculate trade income
export function calculateTradeIncome(
  tradePower: number,
  totalTradePower: number,
  nodeValue: number,
  tradingBonus: number
): number {
  if (totalTradePower <= 0) return 0;

  const share = tradePower / totalTradePower;
  const income = nodeValue * share * (1 + tradingBonus / 100);

  return income;
}

// Calculate tech cost with modifiers
export function calculateTechCost(
  baseLevel: number,
  currentYear: number,
  techYear: number,
  institutionPenalty: number,
  modifiers: number
): number {
  let cost = BASE_COSTS.tech_base + baseLevel * BASE_COSTS.tech_base * BASE_COSTS.tech_level_mult;

  // Ahead of time penalty
  if (techYear > currentYear) {
    cost += (techYear - currentYear) * BASE_COSTS.ahead_of_time_penalty;
  }

  // Institution penalty
  cost *= (1 + institutionPenalty / 100);

  // Other modifiers
  cost *= (1 + modifiers / 100);

  return Math.max(1, Math.round(cost));
}

// Clamp value within bounds
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export default {
  BASE_COSTS,
  MODIFIER_CAPS,
  COMBAT,
  ECONOMY,
  DIPLOMACY,
  calculateDevelopmentCost,
  calculateCoringCost,
  calculateAdvisorCost,
  calculateArmyMaintenance,
  calculateTradeIncome,
  calculateTechCost,
  clamp
};
