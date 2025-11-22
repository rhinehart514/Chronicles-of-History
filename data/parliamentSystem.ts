// Parliament and legislative system

export interface Parliament {
  id: string;
  name: string;
  type: ParliamentType;
  seats: ParliamentSeat[];
  currentIssue?: ParliamentIssue;
  bribesUsed: number;
  maxBribes: number;
  debatesWon: number;
  debatesLost: number;
}

export type ParliamentType = 'parliament' | 'diet' | 'sejm' | 'cortes' | 'estates_general';

export interface ParliamentSeat {
  id: string;
  provinceName: string;
  provinceId: string;
  loyalty: number; // -100 to 100
  bribed: boolean;
  issues: string[]; // Issues this seat cares about
}

export interface ParliamentIssue {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: IssueCategory;
  duration: number; // months
  effects: IssueEffect[];
  supportNeeded: number; // percentage
  currentSupport: number;
  yearsActive?: number;
}

export type IssueCategory = 'military' | 'economic' | 'religious' | 'diplomatic' | 'administrative';

export interface IssueEffect {
  type: string;
  value: number;
  description: string;
}

// Available parliament issues
export const PARLIAMENT_ISSUES: Omit<ParliamentIssue, 'currentSupport' | 'yearsActive'>[] = [
  {
    id: 'war_taxes',
    name: 'War Taxes',
    icon: '⚔️',
    description: 'Levy additional taxes to fund military campaigns',
    category: 'military',
    duration: 60,
    effects: [
      { type: 'tax_income', value: 15, description: '+15% Tax income' },
      { type: 'manpower_recovery', value: 10, description: '+10% Manpower recovery' }
    ],
    supportNeeded: 50
  },
  {
    id: 'trade_expansion',
    name: 'Support Trade Expansion',
    icon: '🚢',
    description: 'Invest in expanding trade routes and merchant fleets',
    category: 'economic',
    duration: 60,
    effects: [
      { type: 'trade_efficiency', value: 10, description: '+10% Trade efficiency' },
      { type: 'merchants', value: 1, description: '+1 Merchant' }
    ],
    supportNeeded: 50
  },
  {
    id: 'administrative_reform',
    name: 'Administrative Reform',
    icon: '📜',
    description: 'Streamline government bureaucracy',
    category: 'administrative',
    duration: 60,
    effects: [
      { type: 'administrative_efficiency', value: 5, description: '+5% Administrative efficiency' },
      { type: 'core_creation', value: -10, description: '-10% Core creation cost' }
    ],
    supportNeeded: 50
  },
  {
    id: 'religious_unity',
    name: 'Enforce Religious Unity',
    icon: '⛪',
    description: 'Strengthen the state religion across all provinces',
    category: 'religious',
    duration: 60,
    effects: [
      { type: 'missionary_strength', value: 2, description: '+2% Missionary strength' },
      { type: 'tolerance_true', value: 1, description: '+1 Tolerance of true faith' }
    ],
    supportNeeded: 60
  },
  {
    id: 'diplomatic_corps',
    name: 'Expand Diplomatic Corps',
    icon: '🤝',
    description: 'Increase diplomatic capabilities',
    category: 'diplomatic',
    duration: 60,
    effects: [
      { type: 'diplomatic_reputation', value: 1, description: '+1 Diplomatic reputation' },
      { type: 'diplomats', value: 1, description: '+1 Diplomat' }
    ],
    supportNeeded: 50
  },
  {
    id: 'colonial_ventures',
    name: 'Support Colonial Ventures',
    icon: '🌍',
    description: 'Fund expeditions to the New World',
    category: 'economic',
    duration: 60,
    effects: [
      { type: 'colonists', value: 1, description: '+1 Colonist' },
      { type: 'global_settler_increase', value: 15, description: '+15 Global settler increase' }
    ],
    supportNeeded: 50
  },
  {
    id: 'fortification_act',
    name: 'Fortification Act',
    icon: '🏰',
    description: 'Strengthen border defenses',
    category: 'military',
    duration: 60,
    effects: [
      { type: 'fort_defense', value: 15, description: '+15% Fort defense' },
      { type: 'garrison_size', value: 25, description: '+25% Garrison size' }
    ],
    supportNeeded: 50
  },
  {
    id: 'university_funding',
    name: 'University Funding',
    icon: '🎓',
    description: 'Increase funding for educational institutions',
    category: 'administrative',
    duration: 60,
    effects: [
      { type: 'technology_cost', value: -5, description: '-5% Technology cost' },
      { type: 'institution_spread', value: 10, description: '+10% Institution spread' }
    ],
    supportNeeded: 50
  },
  {
    id: 'naval_armament',
    name: 'Naval Armament Act',
    icon: '⚓',
    description: 'Expand and modernize the navy',
    category: 'military',
    duration: 60,
    effects: [
      { type: 'naval_forcelimit', value: 20, description: '+20% Naval force limit' },
      { type: 'ship_durability', value: 5, description: '+5% Ship durability' }
    ],
    supportNeeded: 50
  },
  {
    id: 'land_reform',
    name: 'Land Reform',
    icon: '🌾',
    description: 'Redistribute land to increase productivity',
    category: 'economic',
    duration: 60,
    effects: [
      { type: 'production_efficiency', value: 10, description: '+10% Production efficiency' },
      { type: 'development_cost', value: -5, description: '-5% Development cost' }
    ],
    supportNeeded: 60
  },
  {
    id: 'military_academies',
    name: 'Military Academies',
    icon: '🎖️',
    description: 'Establish schools for officer training',
    category: 'military',
    duration: 60,
    effects: [
      { type: 'army_tradition', value: 0.5, description: '+0.5 Yearly army tradition' },
      { type: 'leader_fire', value: 1, description: '+1 Leader fire' }
    ],
    supportNeeded: 50
  },
  {
    id: 'tolerance_act',
    name: 'Act of Tolerance',
    icon: '☮️',
    description: 'Grant religious freedoms to minorities',
    category: 'religious',
    duration: 60,
    effects: [
      { type: 'tolerance_heretic', value: 2, description: '+2 Tolerance of heretics' },
      { type: 'tolerance_heathen', value: 1, description: '+1 Tolerance of heathens' }
    ],
    supportNeeded: 60
  }
];

// Seat concerns - what issues they care about
export const SEAT_CONCERNS: Record<string, string[]> = {
  coastal: ['trade_expansion', 'naval_armament', 'colonial_ventures'],
  inland: ['land_reform', 'fortification_act', 'administrative_reform'],
  border: ['fortification_act', 'war_taxes', 'military_academies'],
  capital: ['administrative_reform', 'diplomatic_corps', 'university_funding'],
  religious: ['religious_unity', 'tolerance_act'],
  agricultural: ['land_reform', 'war_taxes'],
  commercial: ['trade_expansion', 'colonial_ventures']
};

// Calculate support for an issue
export function calculateIssueSupport(
  seats: ParliamentSeat[],
  issueId: string
): number {
  if (seats.length === 0) return 0;

  const supporters = seats.filter(seat => {
    // Bribed seats always support
    if (seat.bribed) return true;
    // Loyal seats that care about issue support it
    if (seat.loyalty > 50 && seat.issues.includes(issueId)) return true;
    // Very loyal seats always support
    if (seat.loyalty > 80) return true;
    return false;
  });

  return Math.round((supporters.length / seats.length) * 100);
}

// Get bribe cost for a seat
export function getBribeCost(seat: ParliamentSeat): number {
  const baseCost = 50;
  // More loyal seats are cheaper to bribe
  const loyaltyMod = seat.loyalty > 0 ? 0.5 : 1.5;
  return Math.round(baseCost * loyaltyMod);
}

// Check if issue passes
export function doesIssuPass(issue: ParliamentIssue): boolean {
  return issue.currentSupport >= issue.supportNeeded;
}

export default {
  PARLIAMENT_ISSUES,
  SEAT_CONCERNS,
  calculateIssueSupport,
  getBribeCost,
  doesIssuPass
};
