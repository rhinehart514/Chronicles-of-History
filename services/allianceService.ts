// Alliance and diplomatic pact system

import { NationStats } from '../types';

export interface Alliance {
  id: string;
  name: string;
  type: AllianceType;
  members: AllianceMember[];
  leader?: string;
  formed: number;
  expiresIn?: number;
  strength: number;
  goals: string[];
  active: boolean;
}

export interface AllianceMember {
  nationId: string;
  nationName: string;
  joinedYear: number;
  commitment: number; // 0-100
  contribution: number;
}

export type AllianceType =
  | 'defensive'
  | 'offensive'
  | 'mutual_defense'
  | 'coalition'
  | 'trade_league'
  | 'personal_union';

export interface DiplomaticPact {
  id: string;
  type: PactType;
  partnerNationId: string;
  partnerName: string;
  formed: number;
  duration: number;
  turnsRemaining: number;
  benefits: Partial<NationStats>;
  obligations: string[];
}

export type PactType =
  | 'non_aggression'
  | 'military_access'
  | 'guarantee'
  | 'vassalage'
  | 'marriage';

// Alliance type definitions
export const ALLIANCE_TYPES: Record<AllianceType, {
  name: string;
  description: string;
  icon: string;
  minMembers: number;
  maxMembers: number;
  benefits: Partial<NationStats>;
  callToArms: boolean;
}> = {
  defensive: {
    name: 'Defensive Alliance',
    description: 'Members defend each other when attacked',
    icon: '🛡️',
    minMembers: 2,
    maxMembers: 5,
    benefits: { stability: 0.1 },
    callToArms: true
  },
  offensive: {
    name: 'Offensive Alliance',
    description: 'Members support each other in wars of aggression',
    icon: '⚔️',
    minMembers: 2,
    maxMembers: 4,
    benefits: { military: 0.1 },
    callToArms: true
  },
  mutual_defense: {
    name: 'Mutual Defense Pact',
    description: 'Strong commitment to mutual protection',
    icon: '🤝',
    minMembers: 2,
    maxMembers: 3,
    benefits: { stability: 0.2, military: 0.1 },
    callToArms: true
  },
  coalition: {
    name: 'Coalition',
    description: 'Temporary alliance against common enemy',
    icon: '⚡',
    minMembers: 3,
    maxMembers: 10,
    benefits: { military: 0.2 },
    callToArms: true
  },
  trade_league: {
    name: 'Trade League',
    description: 'Economic cooperation and trade benefits',
    icon: '💰',
    minMembers: 3,
    maxMembers: 8,
    benefits: { economy: 0.3 },
    callToArms: false
  },
  personal_union: {
    name: 'Personal Union',
    description: 'Shared ruler between nations',
    icon: '👑',
    minMembers: 2,
    maxMembers: 2,
    benefits: { stability: 0.2, prestige: 0.2 },
    callToArms: true
  }
};

// Pact type definitions
export const PACT_TYPES: Record<PactType, {
  name: string;
  description: string;
  icon: string;
  duration: number;
  requirements: { minRelation: number };
  benefits: Partial<NationStats>;
}> = {
  non_aggression: {
    name: 'Non-Aggression Pact',
    description: 'Agreement not to attack each other',
    icon: '🕊️',
    duration: 20,
    requirements: { minRelation: 0 },
    benefits: { stability: 0.1 }
  },
  military_access: {
    name: 'Military Access',
    description: 'Permission to move troops through territory',
    icon: '🚩',
    duration: 15,
    requirements: { minRelation: 20 },
    benefits: {}
  },
  guarantee: {
    name: 'Guarantee Independence',
    description: 'Promise to defend their sovereignty',
    icon: '🛡️',
    duration: 30,
    requirements: { minRelation: 30 },
    benefits: { prestige: 0.1 }
  },
  vassalage: {
    name: 'Vassalage',
    description: 'Subordinate nation under your protection',
    icon: '⬇️',
    duration: -1,
    requirements: { minRelation: 50 },
    benefits: { economy: 0.2, military: 0.1 }
  },
  marriage: {
    name: 'Royal Marriage',
    description: 'Dynastic ties between ruling families',
    icon: '💒',
    duration: -1,
    requirements: { minRelation: 40 },
    benefits: { prestige: 0.1, stability: 0.1 }
  }
};

// Calculate alliance strength
export function calculateAllianceStrength(members: AllianceMember[]): number {
  return members.reduce((sum, member) => {
    return sum + (member.commitment * member.contribution / 100);
  }, 0);
}

// Check if nation will honor call to arms
export function willHonorCall(
  member: AllianceMember,
  enemyStrength: number,
  allyStrength: number
): boolean {
  // Base chance from commitment
  let chance = member.commitment;

  // Modify based on strength comparison
  const ratio = allyStrength / (enemyStrength || 1);
  if (ratio > 1.5) chance += 20;
  else if (ratio < 0.5) chance -= 30;

  return Math.random() * 100 < chance;
}

// Create a new alliance
export function createAlliance(
  type: AllianceType,
  founder: AllianceMember,
  partner: AllianceMember,
  year: number
): Alliance {
  const allianceType = ALLIANCE_TYPES[type];

  return {
    id: `alliance_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    name: `${founder.nationName}-${partner.nationName} ${allianceType.name}`,
    type,
    members: [founder, partner],
    leader: founder.nationId,
    formed: year,
    strength: calculateAllianceStrength([founder, partner]),
    goals: [],
    active: true
  };
}

// Add member to alliance
export function addAllianceMember(
  alliance: Alliance,
  member: AllianceMember
): Alliance | null {
  const typeInfo = ALLIANCE_TYPES[alliance.type];

  if (alliance.members.length >= typeInfo.maxMembers) {
    return null;
  }

  return {
    ...alliance,
    members: [...alliance.members, member],
    strength: calculateAllianceStrength([...alliance.members, member])
  };
}

// Remove member from alliance
export function removeAllianceMember(
  alliance: Alliance,
  nationId: string
): Alliance | null {
  const typeInfo = ALLIANCE_TYPES[alliance.type];
  const remaining = alliance.members.filter(m => m.nationId !== nationId);

  if (remaining.length < typeInfo.minMembers) {
    return null; // Alliance dissolves
  }

  return {
    ...alliance,
    members: remaining,
    strength: calculateAllianceStrength(remaining),
    leader: alliance.leader === nationId ? remaining[0].nationId : alliance.leader
  };
}

// Create diplomatic pact
export function createPact(
  type: PactType,
  partnerId: string,
  partnerName: string,
  year: number
): DiplomaticPact {
  const pactType = PACT_TYPES[type];

  return {
    id: `pact_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    type,
    partnerNationId: partnerId,
    partnerName,
    formed: year,
    duration: pactType.duration,
    turnsRemaining: pactType.duration,
    benefits: pactType.benefits,
    obligations: []
  };
}

// Process pacts each turn
export function processPacts(pacts: DiplomaticPact[]): DiplomaticPact[] {
  return pacts.map(pact => {
    if (pact.duration === -1) return pact; // Permanent pact

    return {
      ...pact,
      turnsRemaining: pact.turnsRemaining - 1
    };
  }).filter(pact => pact.turnsRemaining > 0 || pact.duration === -1);
}

// Get all alliance benefits for a nation
export function getAllianceBenefits(
  alliances: Alliance[],
  nationId: string
): Partial<NationStats> {
  const benefits: Partial<NationStats> = {};

  for (const alliance of alliances.filter(a => a.active)) {
    if (alliance.members.some(m => m.nationId === nationId)) {
      const typeInfo = ALLIANCE_TYPES[alliance.type];
      for (const [stat, value] of Object.entries(typeInfo.benefits)) {
        const key = stat as keyof NationStats;
        benefits[key] = (benefits[key] || 0) + value;
      }
    }
  }

  return benefits;
}

// Get all pact benefits
export function getPactBenefits(pacts: DiplomaticPact[]): Partial<NationStats> {
  const benefits: Partial<NationStats> = {};

  for (const pact of pacts) {
    for (const [stat, value] of Object.entries(pact.benefits)) {
      const key = stat as keyof NationStats;
      benefits[key] = (benefits[key] || 0) + value;
    }
  }

  return benefits;
}

// Check if nations are allied
export function areAllied(
  alliances: Alliance[],
  nation1: string,
  nation2: string
): boolean {
  return alliances.some(alliance =>
    alliance.active &&
    alliance.members.some(m => m.nationId === nation1) &&
    alliance.members.some(m => m.nationId === nation2)
  );
}

export default {
  ALLIANCE_TYPES,
  PACT_TYPES,
  calculateAllianceStrength,
  willHonorCall,
  createAlliance,
  addAllianceMember,
  removeAllianceMember,
  createPact,
  processPacts,
  getAllianceBenefits,
  getPactBenefits,
  areAllied
};
