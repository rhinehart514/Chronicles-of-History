// Religion and faith system

import { NationStats } from '../types';

export interface Religion {
  id: string;
  name: string;
  icon: string;
  type: 'christian' | 'islamic' | 'eastern' | 'other';
  modifiers: Partial<NationStats>;
  features: string[];
  holyDays: string[];
}

export interface ReligiousState {
  stateReligion: string;
  tolerance: number; // 0-100
  fervor: number; // 0-100
  minorities: { religion: string; population: number; unrest: number }[];
  papacyRelation?: number; // For Catholics
}

// Religion definitions
export const RELIGIONS: Record<string, Religion> = {
  catholic: {
    id: 'catholic',
    name: 'Catholic',
    icon: '✝️',
    type: 'christian',
    modifiers: { stability: 0.2, prestige: 0.1 },
    features: ['Papal influence', 'Crusades', 'Indulgences'],
    holyDays: ['Easter', 'Christmas', 'Saints Days']
  },
  protestant: {
    id: 'protestant',
    name: 'Protestant',
    icon: '✝️',
    type: 'christian',
    modifiers: { economy: 0.2, innovation: 0.1 },
    features: ['Work ethic', 'Literacy focus', 'No papal tithe'],
    holyDays: ['Easter', 'Christmas', 'Reformation Day']
  },
  orthodox: {
    id: 'orthodox',
    name: 'Orthodox',
    icon: '☦️',
    type: 'christian',
    modifiers: { stability: 0.3 },
    features: ['Caesaropapism', 'Icon veneration', 'Monasticism'],
    holyDays: ['Easter', 'Christmas', 'Theophany']
  },
  sunni: {
    id: 'sunni',
    name: 'Sunni Islam',
    icon: '☪️',
    type: 'islamic',
    modifiers: { military: 0.1, stability: 0.2 },
    features: ['Caliphate', 'Jihad', 'Sharia law'],
    holyDays: ['Eid al-Fitr', 'Eid al-Adha', 'Ramadan']
  },
  shia: {
    id: 'shia',
    name: 'Shia Islam',
    icon: '☪️',
    type: 'islamic',
    modifiers: { stability: 0.2, prestige: 0.1 },
    features: ['Imamate', 'Martyrdom', 'Clergy hierarchy'],
    holyDays: ['Ashura', 'Eid al-Fitr', 'Eid al-Adha']
  },
  jewish: {
    id: 'jewish',
    name: 'Judaism',
    icon: '✡️',
    type: 'other',
    modifiers: { economy: 0.2, innovation: 0.1 },
    features: ['Diaspora networks', 'Education focus', 'Banking'],
    holyDays: ['Passover', 'Yom Kippur', 'Hanukkah']
  }
};

// Religious policies
export interface ReligiousPolicy {
  id: string;
  name: string;
  description: string;
  effects: {
    tolerance: number;
    fervor: number;
    stats: Partial<NationStats>;
  };
  requirements?: { minTolerance?: number; maxTolerance?: number };
}

export const RELIGIOUS_POLICIES: ReligiousPolicy[] = [
  {
    id: 'state_religion',
    name: 'Enforce State Religion',
    description: 'Only the official religion is tolerated',
    effects: {
      tolerance: -30,
      fervor: 20,
      stats: { stability: 0.2 }
    }
  },
  {
    id: 'tolerance_edict',
    name: 'Edict of Tolerance',
    description: 'Allow minority religions to practice',
    effects: {
      tolerance: 30,
      fervor: -10,
      stats: { stability: 0.1, innovation: 0.1 }
    }
  },
  {
    id: 'secularization',
    name: 'Secularization',
    description: 'Reduce church influence in government',
    effects: {
      tolerance: 20,
      fervor: -20,
      stats: { innovation: 0.2, economy: 0.1 }
    },
    requirements: { minTolerance: 30 }
  },
  {
    id: 'religious_unity',
    name: 'Religious Unity',
    description: 'Promote conversion to state religion',
    effects: {
      tolerance: -20,
      fervor: 15,
      stats: { stability: 0.3 }
    }
  },
  {
    id: 'inquisition',
    name: 'Inquisition',
    description: 'Root out heresy through investigation',
    effects: {
      tolerance: -50,
      fervor: 30,
      stats: { stability: -0.2, prestige: -0.1 }
    },
    requirements: { maxTolerance: 30 }
  }
];

// Calculate religious unity
export function calculateReligiousUnity(state: ReligiousState): number {
  const totalMinority = state.minorities.reduce((sum, m) => sum + m.population, 0);
  const majorityShare = 100 - totalMinority;

  let unity = majorityShare;

  // Tolerance bonus
  unity += state.tolerance * 0.2;

  // Fervor bonus
  unity += state.fervor * 0.1;

  return Math.max(0, Math.min(100, unity));
}

// Calculate religious unrest
export function calculateReligiousUnrest(state: ReligiousState): number {
  let unrest = 0;

  for (const minority of state.minorities) {
    // Base unrest from population
    const popUnrest = minority.population * 0.5;

    // Tolerance mitigation
    const toleranceMod = 1 - (state.tolerance / 100);

    unrest += popUnrest * toleranceMod + minority.unrest;
  }

  // High fervor can cause intolerance
  if (state.fervor > 70 && state.tolerance < 30) {
    unrest += 10;
  }

  return Math.max(0, Math.min(100, unrest));
}

// Get religious modifiers for nation stats
export function getReligiousModifiers(
  religionId: string,
  fervor: number
): Partial<NationStats> {
  const religion = RELIGIONS[religionId];
  if (!religion) return {};

  const modifiers: Partial<NationStats> = {};

  // Apply base modifiers scaled by fervor
  const fervorScale = fervor / 50; // 0-2x based on fervor
  for (const [stat, value] of Object.entries(religion.modifiers)) {
    modifiers[stat as keyof NationStats] = value * fervorScale;
  }

  return modifiers;
}

// Process conversion
export function processConversion(
  state: ReligiousState,
  targetReligion: string,
  intensity: number
): ReligiousState {
  const updated = { ...state, minorities: [...state.minorities] };

  for (let i = 0; i < updated.minorities.length; i++) {
    if (updated.minorities[i].religion !== targetReligion) {
      const convertRate = intensity * (1 - state.tolerance / 100) * 0.01;
      const converted = Math.floor(updated.minorities[i].population * convertRate);

      updated.minorities[i] = {
        ...updated.minorities[i],
        population: updated.minorities[i].population - converted,
        unrest: updated.minorities[i].unrest + intensity * 0.5
      };
    }
  }

  // Remove empty minorities
  updated.minorities = updated.minorities.filter(m => m.population > 0);

  return updated;
}

// Religious events
export interface ReligiousEvent {
  id: string;
  name: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral';
  effects: Partial<NationStats>;
  conditions?: {
    religions?: string[];
    minFervor?: number;
    maxTolerance?: number;
  };
}

export const RELIGIOUS_EVENTS: ReligiousEvent[] = [
  {
    id: 'pilgrimage',
    name: 'Great Pilgrimage',
    description: 'Faithful flock to holy sites',
    type: 'positive',
    effects: { prestige: 0.3, stability: 0.2 },
    conditions: { minFervor: 50 }
  },
  {
    id: 'heresy',
    name: 'Heretical Movement',
    description: 'New religious ideas spread',
    type: 'neutral',
    effects: { innovation: 0.2, stability: -0.3 },
    conditions: { maxTolerance: 50 }
  },
  {
    id: 'reformation',
    name: 'Religious Reform',
    description: 'Calls for church reform grow louder',
    type: 'neutral',
    effects: { innovation: 0.3 },
    conditions: { religions: ['catholic'] }
  },
  {
    id: 'persecution',
    name: 'Religious Persecution',
    description: 'Minorities face oppression',
    type: 'negative',
    effects: { stability: -0.3, prestige: -0.2 },
    conditions: { maxTolerance: 20 }
  },
  {
    id: 'revival',
    name: 'Religious Revival',
    description: 'Faith experiences resurgence',
    type: 'positive',
    effects: { stability: 0.3 }
  }
];

// Check if can convert to religion
export function canConvert(
  currentReligion: string,
  targetReligion: string,
  year: number
): boolean {
  // Historical constraints
  if (targetReligion === 'protestant' && year < 1517) return false;

  // Same type conversions are easier
  const current = RELIGIONS[currentReligion];
  const target = RELIGIONS[targetReligion];

  return current?.type === target?.type;
}

export default {
  RELIGIONS,
  RELIGIOUS_POLICIES,
  RELIGIOUS_EVENTS,
  calculateReligiousUnity,
  calculateReligiousUnrest,
  getReligiousModifiers,
  processConversion,
  canConvert
};
