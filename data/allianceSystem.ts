// Alliance and diplomatic relations system

export interface Alliance {
  id: string;
  members: string[];
  warLeader: string;
  formationDate: string;
  type: AllianceType;
  strength: number;
}

export type AllianceType = 'defensive' | 'offensive' | 'coalition' | 'federation';

export interface DiplomaticRelation {
  nationA: string;
  nationB: string;
  relations: number;
  opinion: OpinionModifier[];
  treaties: string[];
  trust: number;
}

export interface OpinionModifier {
  id: string;
  name: string;
  value: number;
  decay: number;
  duration?: number;
}

export interface CallToArms {
  allyId: string;
  warId: string;
  favor: number;
  trust: number;
  reasons: AllyReason[];
  acceptChance: number;
}

export interface AllyReason {
  type: string;
  value: number;
  description: string;
}

// Opinion modifiers
export const OPINION_MODIFIERS: OpinionModifier[] = [
  { id: 'allied', name: 'Allied', value: 50, decay: 0 },
  { id: 'royal_marriage', name: 'Royal Marriage', value: 25, decay: 0 },
  { id: 'same_dynasty', name: 'Same Dynasty', value: 10, decay: 0 },
  { id: 'same_religion', name: 'Same Religion', value: 25, decay: 0 },
  { id: 'different_religion', name: 'Different Religion', value: -25, decay: 0 },
  { id: 'historical_friend', name: 'Historical Friend', value: 25, decay: 0 },
  { id: 'historical_rival', name: 'Historical Rival', value: -25, decay: 0 },
  { id: 'improved_relations', name: 'Improved Relations', value: 100, decay: 3 },
  { id: 'insulted', name: 'Insulted', value: -50, decay: 2 },
  { id: 'broke_alliance', name: 'Broke Alliance', value: -50, decay: 1 },
  { id: 'declared_war', name: 'Declared War', value: -100, decay: 2 },
  { id: 'honored_alliance', name: 'Honored Alliance', value: 25, decay: 1 },
  { id: 'refused_call', name: 'Refused Call to Arms', value: -50, decay: 1 },
  { id: 'guarantee', name: 'Guarantee', value: 10, decay: 0 },
  { id: 'military_access', name: 'Military Access', value: 10, decay: 0 },
  { id: 'subsidies', name: 'Subsidies', value: 15, decay: 0 },
  { id: 'common_enemy', name: 'Common Enemy', value: 20, decay: 0 },
  { id: 'ae', name: 'Aggressive Expansion', value: -1, decay: 2 }
];

// Alliance requirements
export const ALLIANCE_REQUIREMENTS = {
  minRelations: 0,
  minTrust: -100,
  diplomaticRepCost: 1,
  monthlyFavorGain: 0.5,
  maxFavors: 100
};

// Get opinion modifier by id
export function getOpinionModifier(id: string): OpinionModifier | undefined {
  return OPINION_MODIFIERS.find(m => m.id === id);
}

// Calculate total relations
export function calculateTotalRelations(modifiers: OpinionModifier[]): number {
  let total = 0;
  for (const mod of modifiers) {
    total += mod.value;
  }
  return Math.max(-200, Math.min(200, total));
}

// Calculate alliance acceptance
export function calculateAllianceAcceptance(
  relations: number,
  diplomaticRep: number,
  powerDifference: number,
  sameReligion: boolean,
  borderingEnemy: boolean
): { chance: number; reasons: AllyReason[] } {
  const reasons: AllyReason[] = [];
  let chance = 0;

  // Relations
  const relationsBonus = relations / 2;
  reasons.push({
    type: 'relations',
    value: relationsBonus,
    description: `Relations: ${relationsBonus > 0 ? '+' : ''}${relationsBonus.toFixed(0)}`
  });
  chance += relationsBonus;

  // Diplomatic reputation
  const dipRepBonus = diplomaticRep * 5;
  reasons.push({
    type: 'diplomatic_rep',
    value: dipRepBonus,
    description: `Diplomatic Reputation: ${dipRepBonus > 0 ? '+' : ''}${dipRepBonus.toFixed(0)}`
  });
  chance += dipRepBonus;

  // Power difference
  const powerBonus = powerDifference * -0.5;
  if (powerDifference !== 0) {
    reasons.push({
      type: 'power_difference',
      value: powerBonus,
      description: `Power Difference: ${powerBonus > 0 ? '+' : ''}${powerBonus.toFixed(0)}`
    });
    chance += powerBonus;
  }

  // Religion
  if (sameReligion) {
    reasons.push({
      type: 'same_religion',
      value: 10,
      description: 'Same Religion: +10'
    });
    chance += 10;
  }

  // Common threat
  if (borderingEnemy) {
    reasons.push({
      type: 'common_threat',
      value: 20,
      description: 'Common Threat: +20'
    });
    chance += 20;
  }

  return { chance: Math.max(0, Math.min(100, chance)), reasons };
}

// Calculate call to arms acceptance
export function calculateCallAcceptance(
  trust: number,
  favor: number,
  relations: number,
  strengthRatio: number,
  isDefensive: boolean
): { chance: number; reasons: AllyReason[] } {
  const reasons: AllyReason[] = [];
  let chance = 0;

  // Trust
  const trustBonus = trust;
  reasons.push({
    type: 'trust',
    value: trustBonus,
    description: `Trust: ${trustBonus > 0 ? '+' : ''}${trustBonus}`
  });
  chance += trustBonus;

  // Favors
  const favorBonus = favor * 0.5;
  reasons.push({
    type: 'favors',
    value: favorBonus,
    description: `Favors: ${favorBonus > 0 ? '+' : ''}${favorBonus.toFixed(0)}`
  });
  chance += favorBonus;

  // Relations
  const relationsBonus = (relations - 100) * 0.2;
  reasons.push({
    type: 'relations',
    value: relationsBonus,
    description: `Relations: ${relationsBonus > 0 ? '+' : ''}${relationsBonus.toFixed(0)}`
  });
  chance += relationsBonus;

  // Strength ratio
  if (strengthRatio < 1) {
    const strengthPenalty = (1 - strengthRatio) * -50;
    reasons.push({
      type: 'strength',
      value: strengthPenalty,
      description: `Enemy Strength: ${strengthPenalty.toFixed(0)}`
    });
    chance += strengthPenalty;
  }

  // Defensive war bonus
  if (isDefensive) {
    reasons.push({
      type: 'defensive',
      value: 20,
      description: 'Defensive War: +20'
    });
    chance += 20;
  }

  return { chance: Math.max(0, Math.min(100, chance)), reasons };
}

// Calculate favor gain
export function calculateFavorGain(
  tradeValue: number,
  militarySupport: number
): number {
  let gain = ALLIANCE_REQUIREMENTS.monthlyFavorGain;
  gain += tradeValue * 0.01;
  gain += militarySupport * 0.1;
  return gain;
}

// Check if can form alliance
export function canFormAlliance(
  relations: number,
  trust: number,
  atWar: boolean,
  hasRival: boolean
): boolean {
  if (relations < ALLIANCE_REQUIREMENTS.minRelations) return false;
  if (trust < ALLIANCE_REQUIREMENTS.minTrust) return false;
  if (atWar) return false;
  if (hasRival) return false;
  return true;
}

// Get trust level description
export function getTrustDescription(trust: number): string {
  if (trust >= 80) return 'Unconditional';
  if (trust >= 60) return 'Very High';
  if (trust >= 40) return 'High';
  if (trust >= 20) return 'Moderate';
  if (trust >= 0) return 'Low';
  if (trust >= -20) return 'Distrust';
  return 'Deep Distrust';
}

// Calculate monthly trust change
export function calculateTrustChange(
  honoredCalls: number,
  refusedCalls: number,
  yearsAllied: number
): number {
  let change = 0;
  change += honoredCalls * 5;
  change -= refusedCalls * 10;
  change += Math.min(50, yearsAllied);
  return change;
}

export default {
  OPINION_MODIFIERS,
  ALLIANCE_REQUIREMENTS,
  getOpinionModifier,
  calculateTotalRelations,
  calculateAllianceAcceptance,
  calculateCallAcceptance,
  calculateFavorGain,
  canFormAlliance,
  getTrustDescription,
  calculateTrustChange
};
