// Manpower and military recruitment system

export interface ManpowerPool {
  current: number;
  maximum: number;
  recovery: number;
  modifier: number;
}

export interface ManpowerSource {
  id: string;
  name: string;
  icon: string;
  value: number;
  type: 'development' | 'modifier' | 'event';
}

export interface RecruitmentCost {
  manpower: number;
  gold: number;
  time: number;
}

export interface RegimentTemplate {
  infantry: number;
  cavalry: number;
  artillery: number;
}

// Base manpower constants
export const MANPOWER_CONSTANTS = {
  basePerDev: 250,
  recoveryBase: 10, // % per year
  recoveryMin: 1,
  recoveryMax: 50,
  recruitTime: 30, // days
  infantryManpower: 1000,
  cavalryManpower: 1000,
  artilleryManpower: 1000
};

// Manpower modifiers
export const MANPOWER_MODIFIERS: Record<string, number> = {
  quantity_ideas: 50,
  defensive_ideas: 33,
  conscription: 25,
  military_drill: 10,
  standing_army: -10,
  low_professionalism: 20,
  high_professionalism: -10
};

// Calculate max manpower
export function calculateMaxManpower(
  development: number,
  modifiers: number = 0
): number {
  const base = development * MANPOWER_CONSTANTS.basePerDev;
  return Math.floor(base * (1 + modifiers / 100));
}

// Calculate monthly recovery
export function calculateMonthlyRecovery(
  maxManpower: number,
  recoveryModifier: number = 0
): number {
  const rate = MANPOWER_CONSTANTS.recoveryBase + recoveryModifier;
  const cappedRate = Math.max(
    MANPOWER_CONSTANTS.recoveryMin,
    Math.min(MANPOWER_CONSTANTS.recoveryMax, rate)
  );
  return Math.floor(maxManpower * (cappedRate / 100) / 12);
}

// Calculate reinforcement cost
export function calculateReinforcementCost(
  casualties: number,
  reinforceSpeed: number = 100
): { manpower: number; time: number } {
  return {
    manpower: casualties,
    time: Math.ceil(MANPOWER_CONSTANTS.recruitTime / (reinforceSpeed / 100))
  };
}

// Calculate recruitment cost
export function calculateRecruitmentCost(
  template: RegimentTemplate,
  baseGoldCost: number
): RecruitmentCost {
  const manpower =
    template.infantry * MANPOWER_CONSTANTS.infantryManpower +
    template.cavalry * MANPOWER_CONSTANTS.cavalryManpower +
    template.artillery * MANPOWER_CONSTANTS.artilleryManpower;

  const regiments = template.infantry + template.cavalry + template.artillery;
  const gold = regiments * baseGoldCost;

  return {
    manpower,
    gold,
    time: MANPOWER_CONSTANTS.recruitTime
  };
}

// Check if can recruit
export function canRecruit(
  currentManpower: number,
  cost: RecruitmentCost,
  treasury: number
): boolean {
  return currentManpower >= cost.manpower && treasury >= cost.gold;
}

// Calculate effective manpower (with autonomy)
export function calculateEffectiveManpower(
  baseManpower: number,
  autonomy: number
): number {
  return Math.floor(baseManpower * (1 - autonomy / 100));
}

// Calculate manpower from province
export function calculateProvinceManpower(
  development: number,
  autonomy: number,
  modifiers: number = 0
): number {
  const base = development * MANPOWER_CONSTANTS.basePerDev;
  const effective = base * (1 - autonomy / 100);
  return Math.floor(effective * (1 + modifiers / 100));
}

// Get manpower status
export function getManpowerStatus(current: number, max: number): string {
  const ratio = current / max;
  if (ratio >= 0.9) return 'Full';
  if (ratio >= 0.6) return 'Good';
  if (ratio >= 0.3) return 'Low';
  if (ratio >= 0.1) return 'Critical';
  return 'Depleted';
}

// Get manpower status color
export function getManpowerColor(current: number, max: number): string {
  const ratio = current / max;
  if (ratio >= 0.6) return 'green';
  if (ratio >= 0.3) return 'yellow';
  if (ratio >= 0.1) return 'orange';
  return 'red';
}

// Calculate slacken recruitment gain
export function calculateSlackenGain(maxManpower: number): number {
  return Math.floor(maxManpower * 0.02);
}

// Calculate raise war taxes effect
export function calculateWarTaxesManpowerBonus(
  baseRecovery: number
): number {
  return Math.floor(baseRecovery * 0.3);
}

// Calculate drill loss on recruitment
export function calculateDrillLoss(
  newRegiments: number,
  currentDrill: number,
  totalRegiments: number
): number {
  const ratio = newRegiments / (totalRegiments + newRegiments);
  return currentDrill * (1 - ratio);
}

export default {
  MANPOWER_CONSTANTS,
  MANPOWER_MODIFIERS,
  calculateMaxManpower,
  calculateMonthlyRecovery,
  calculateReinforcementCost,
  calculateRecruitmentCost,
  canRecruit,
  calculateEffectiveManpower,
  calculateProvinceManpower,
  getManpowerStatus,
  getManpowerColor,
  calculateSlackenGain,
  calculateWarTaxesManpowerBonus,
  calculateDrillLoss
};
