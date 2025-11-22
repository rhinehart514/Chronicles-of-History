// Coalition and aggressive expansion system

export interface Coalition {
  id: string;
  targetNation: string;
  members: CoalitionMember[];
  formationDate: string;
  totalStrength: number;
}

export interface CoalitionMember {
  nationId: string;
  nationName: string;
  aggressiveExpansion: number;
  militaryStrength: number;
  joinedDate: string;
}

export interface AggressiveExpansion {
  nationId: string;
  value: number;
  sources: AESource[];
}

export interface AESource {
  type: AEType;
  value: number;
  province?: string;
  date: string;
  decayDate: string;
}

export type AEType =
  | 'conquest'
  | 'annexation'
  | 'vassalization'
  | 'claim_throne'
  | 'coalition_war'
  | 'no_cb_war';

// AE thresholds
export const AE_THRESHOLDS = {
  coalition_threshold: 50,
  outraged_threshold: 100,
  opinion_impact_per_ae: -1,
  decay_per_year: 2
};

// AE values by action
export const AE_VALUES: Record<AEType, number> = {
  conquest: 1, // per development
  annexation: 1.5, // per development
  vassalization: 0.5, // per development
  claim_throne: 10, // flat
  coalition_war: 20, // flat
  no_cb_war: 30 // flat
};

// AE modifiers by religion/culture
export const AE_MODIFIERS = {
  same_religion: 1.0,
  same_religion_group: 0.5,
  different_religion: 0.25,
  same_culture_group: 1.0,
  different_culture: 0.5,
  distance_per_100: -0.1 // reduction per 100 distance
};

// Calculate AE impact
export function calculateAEImpact(
  baseDevelopment: number,
  aeType: AEType,
  modifiers: {
    sameReligion?: boolean;
    sameCultureGroup?: boolean;
    distance?: number;
  }
): number {
  let ae = baseDevelopment * AE_VALUES[aeType];

  // Religion modifier
  if (modifiers.sameReligion) {
    ae *= AE_MODIFIERS.same_religion;
  } else {
    ae *= AE_MODIFIERS.different_religion;
  }

  // Culture modifier
  if (modifiers.sameCultureGroup) {
    ae *= AE_MODIFIERS.same_culture_group;
  } else {
    ae *= AE_MODIFIERS.different_culture;
  }

  // Distance modifier
  if (modifiers.distance) {
    const distanceReduction = Math.floor(modifiers.distance / 100) * AE_MODIFIERS.distance_per_100;
    ae *= Math.max(0.1, 1 + distanceReduction);
  }

  return Math.round(ae * 10) / 10;
}

// Check if nation would join coalition
export function wouldJoinCoalition(
  nationAE: number,
  relations: number,
  isRival: boolean,
  isAlly: boolean
): boolean {
  if (isAlly) return false;
  if (nationAE < AE_THRESHOLDS.coalition_threshold) return false;
  if (relations > -50 && !isRival) return false;
  return true;
}

// Calculate coalition strength
export function calculateCoalitionStrength(members: CoalitionMember[]): number {
  return members.reduce((sum, m) => sum + m.militaryStrength, 0);
}

// Get AE opinion impact
export function getAEOpinionImpact(ae: number): number {
  return Math.round(ae * AE_THRESHOLDS.opinion_impact_per_ae);
}

// Get AE severity
export function getAESeverity(ae: number): string {
  if (ae >= 200) return 'Extreme';
  if (ae >= 100) return 'Very High';
  if (ae >= 50) return 'High';
  if (ae >= 25) return 'Moderate';
  if (ae > 0) return 'Low';
  return 'None';
}

// Get AE color
export function getAEColor(ae: number): string {
  if (ae >= 100) return 'text-red-500';
  if (ae >= 50) return 'text-red-400';
  if (ae >= 25) return 'text-orange-400';
  if (ae > 0) return 'text-amber-400';
  return 'text-green-400';
}

// Calculate decay time for AE
export function calculateAEDecayTime(ae: number): number {
  return Math.ceil(ae / AE_THRESHOLDS.decay_per_year);
}

// Simulate coalition war outcome
export function simulateCoalitionOutcome(
  playerStrength: number,
  coalitionStrength: number
): {
  winChance: number;
  recommendation: string;
} {
  const ratio = playerStrength / coalitionStrength;

  if (ratio >= 2) {
    return { winChance: 90, recommendation: 'Strong advantage - victory likely' };
  }
  if (ratio >= 1.5) {
    return { winChance: 75, recommendation: 'Favorable odds - proceed with caution' };
  }
  if (ratio >= 1) {
    return { winChance: 55, recommendation: 'Even fight - consider diplomacy' };
  }
  if (ratio >= 0.7) {
    return { winChance: 35, recommendation: 'Unfavorable - seek allies or peace' };
  }
  return { winChance: 15, recommendation: 'Avoid war - coalition too strong' };
}

// Get nations outraged by AE
export function getOutragedNations(
  aeMap: Map<string, number>
): string[] {
  const outraged: string[] = [];
  aeMap.forEach((ae, nationId) => {
    if (ae >= AE_THRESHOLDS.outraged_threshold) {
      outraged.push(nationId);
    }
  });
  return outraged;
}

export default {
  AE_THRESHOLDS,
  AE_VALUES,
  AE_MODIFIERS,
  calculateAEImpact,
  wouldJoinCoalition,
  calculateCoalitionStrength,
  getAEOpinionImpact,
  getAESeverity,
  getAEColor,
  calculateAEDecayTime,
  simulateCoalitionOutcome,
  getOutragedNations
};
