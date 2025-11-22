// Peace deal negotiation and war score system

export interface PeaceDemand {
  id: string;
  name: string;
  icon: string;
  category: DemandCategory;
  baseWarscore: number;
  baseAE: number;
  scalingFactor: string;
  description: string;
}

export type DemandCategory = 'territory' | 'money' | 'diplomatic' | 'humiliation' | 'subject';

export interface WarScore {
  battles: number;
  occupation: number;
  warGoal: number;
  blockade: number;
  total: number;
}

export interface PeaceOffer {
  demands: SelectedDemand[];
  totalWarscore: number;
  totalAE: number;
  acceptanceChance: number;
}

export interface SelectedDemand {
  demandId: string;
  target?: string;
  value?: number;
  warscore: number;
  ae: number;
}

// Peace demands
export const PEACE_DEMANDS: PeaceDemand[] = [
  {
    id: 'cede_province',
    name: 'Cede Province',
    icon: '🗺️',
    category: 'territory',
    baseWarscore: 1,
    baseAE: 0.75,
    scalingFactor: 'development',
    description: 'Demand cession of a province.'
  },
  {
    id: 'return_core',
    name: 'Return Core',
    icon: '🔙',
    category: 'territory',
    baseWarscore: 0.5,
    baseAE: 0.5,
    scalingFactor: 'development',
    description: 'Return a province to its rightful owner.'
  },
  {
    id: 'gold',
    name: 'War Reparations',
    icon: '💰',
    category: 'money',
    baseWarscore: 5,
    baseAE: 0,
    scalingFactor: 'treasury',
    description: 'Demand gold from the defeated nation.'
  },
  {
    id: 'war_reparations',
    name: 'Annual Tribute',
    icon: '📦',
    category: 'money',
    baseWarscore: 10,
    baseAE: 5,
    scalingFactor: 'income',
    description: 'Demand yearly payments for 10 years.'
  },
  {
    id: 'vassalize',
    name: 'Vassalize',
    icon: '🛡️',
    category: 'subject',
    baseWarscore: 1,
    baseAE: 0.5,
    scalingFactor: 'development',
    description: 'Force the nation to become your vassal.'
  },
  {
    id: 'personal_union',
    name: 'Personal Union',
    icon: '👑',
    category: 'subject',
    baseWarscore: 0.8,
    baseAE: 0.3,
    scalingFactor: 'development',
    description: 'Force a personal union under your crown.'
  },
  {
    id: 'release_nation',
    name: 'Release Nation',
    icon: '🏴',
    category: 'diplomatic',
    baseWarscore: 1,
    baseAE: 0,
    scalingFactor: 'development',
    description: 'Force release of an oppressed nation.'
  },
  {
    id: 'cancel_alliance',
    name: 'Cancel Alliance',
    icon: '❌',
    category: 'diplomatic',
    baseWarscore: 10,
    baseAE: 0,
    scalingFactor: 'none',
    description: 'Force cancellation of an alliance.'
  },
  {
    id: 'revoke_core',
    name: 'Revoke Core',
    icon: '📜',
    category: 'diplomatic',
    baseWarscore: 0.5,
    baseAE: 0,
    scalingFactor: 'development',
    description: 'Force renunciation of a territorial claim.'
  },
  {
    id: 'humiliate',
    name: 'Humiliate',
    icon: '😤',
    category: 'humiliation',
    baseWarscore: 40,
    baseAE: 0,
    scalingFactor: 'none',
    description: 'Humiliate the rival nation.'
  },
  {
    id: 'show_strength',
    name: 'Show Strength',
    icon: '💪',
    category: 'humiliation',
    baseWarscore: 50,
    baseAE: 0,
    scalingFactor: 'none',
    description: 'Demonstrate your military superiority.'
  },
  {
    id: 'transfer_trade',
    name: 'Transfer Trade Power',
    icon: '🚢',
    category: 'money',
    baseWarscore: 15,
    baseAE: 5,
    scalingFactor: 'none',
    description: 'Gain 50% trade power transfer for 10 years.'
  },
  {
    id: 'concede_defeat',
    name: 'Concede Defeat',
    icon: '🏳️',
    category: 'humiliation',
    baseWarscore: 10,
    baseAE: 0,
    scalingFactor: 'none',
    description: 'Enemy admits defeat, ending the war.'
  },
  {
    id: 'annul_treaties',
    name: 'Annul Treaties',
    icon: '📋',
    category: 'diplomatic',
    baseWarscore: 20,
    baseAE: 0,
    scalingFactor: 'none',
    description: 'Cancel all enemy alliances and guarantees.'
  }
];

// Get peace demand by id
export function getPeaceDemand(id: string): PeaceDemand | undefined {
  return PEACE_DEMANDS.find(d => d.id === id);
}

// Get demands by category
export function getDemandsByCategory(category: DemandCategory): PeaceDemand[] {
  return PEACE_DEMANDS.filter(d => d.category === category);
}

// Calculate warscore cost for a demand
export function calculateDemandWarscore(
  demand: PeaceDemand,
  developmentOrValue: number = 1,
  modifiers: number = 0
): number {
  let cost = demand.baseWarscore;

  switch (demand.scalingFactor) {
    case 'development':
      cost *= developmentOrValue;
      break;
    case 'treasury':
    case 'income':
      cost *= (developmentOrValue / 100);
      break;
  }

  return Math.ceil(cost * (1 + modifiers / 100));
}

// Calculate AE for a demand
export function calculateDemandAE(
  demand: PeaceDemand,
  developmentOrValue: number = 1,
  modifiers: number = 0
): number {
  let ae = demand.baseAE;

  switch (demand.scalingFactor) {
    case 'development':
      ae *= developmentOrValue;
      break;
  }

  return Math.ceil(ae * (1 + modifiers / 100));
}

// Calculate total warscore
export function calculateTotalWarscore(
  battles: number,
  occupation: number,
  warGoal: number,
  blockade: number
): WarScore {
  return {
    battles: Math.min(40, battles),
    occupation: Math.min(100, occupation),
    warGoal: Math.min(25, warGoal),
    blockade: Math.min(25, blockade),
    total: Math.min(100, battles + occupation + warGoal + blockade)
  };
}

// Calculate acceptance chance
export function calculateAcceptanceChance(
  warscore: number,
  demandCost: number,
  relations: number,
  warExhaustion: number
): number {
  let chance = warscore - demandCost;
  chance += warExhaustion * 2;
  chance += relations / 10;

  return Math.max(0, Math.min(100, chance));
}

// Check if peace can be enforced
export function canEnforcePeace(
  warscore: number,
  demandCost: number
): boolean {
  return warscore >= demandCost;
}

// Get maximum gold that can be demanded
export function getMaxGoldDemand(
  enemyTreasury: number,
  enemyMonthlyIncome: number
): number {
  return Math.max(0, enemyTreasury + enemyMonthlyIncome * 12);
}

// Calculate overextension from peace deal
export function calculateOverextension(
  provinceDevelopment: number,
  adminEfficiency: number = 0
): number {
  return provinceDevelopment * (1 - adminEfficiency / 100);
}

// Get peace deal summary
export function getPeaceDealSummary(offer: PeaceOffer): string {
  const categories = new Set(
    offer.demands.map(d => getPeaceDemand(d.demandId)?.category)
  );

  const parts: string[] = [];
  if (categories.has('territory')) parts.push('territorial concessions');
  if (categories.has('money')) parts.push('financial reparations');
  if (categories.has('subject')) parts.push('subjugation');
  if (categories.has('diplomatic')) parts.push('diplomatic demands');
  if (categories.has('humiliation')) parts.push('humiliation');

  return parts.join(', ');
}

// Check for war goal completion
export function checkWarGoalProgress(
  warGoalType: string,
  occupiedTarget: boolean,
  winningBattles: boolean
): number {
  if (warGoalType === 'conquest' && occupiedTarget) return 25;
  if (warGoalType === 'superiority' && winningBattles) return 25;
  return 0;
}

export default {
  PEACE_DEMANDS,
  getPeaceDemand,
  getDemandsByCategory,
  calculateDemandWarscore,
  calculateDemandAE,
  calculateTotalWarscore,
  calculateAcceptanceChance,
  canEnforcePeace,
  getMaxGoldDemand,
  calculateOverextension,
  getPeaceDealSummary,
  checkWarGoalProgress
};
