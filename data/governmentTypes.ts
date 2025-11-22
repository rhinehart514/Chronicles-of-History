// Government type definitions

import { NationStats } from '../types';

export interface GovernmentType {
  id: string;
  name: string;
  description: string;
  icon: string;
  modifiers: Partial<Record<keyof NationStats, number>>;
  special: string[];
  reforms: string[];
  prerequisites?: {
    year?: number;
    techs?: string[];
    stats?: Partial<NationStats>;
  };
  canTransitionTo: string[];
}

export const GOVERNMENT_TYPES: GovernmentType[] = [
  {
    id: 'absolute_monarchy',
    name: 'Absolute Monarchy',
    description: 'All power resides in the monarch',
    icon: '👑',
    modifiers: {
      stability: 0.3,
      military: 0.2,
      innovation: -0.2
    },
    special: [
      'Quick decisions',
      'Strong centralization',
      '-Reform acceptance'
    ],
    reforms: [
      'Royal courts',
      'Divine right',
      'Centralized taxation'
    ],
    canTransitionTo: ['constitutional_monarchy', 'enlightened_despotism']
  },
  {
    id: 'constitutional_monarchy',
    name: 'Constitutional Monarchy',
    description: 'Monarch shares power with parliament',
    icon: '⚜️',
    modifiers: {
      stability: 0.2,
      innovation: 0.2,
      economy: 0.1
    },
    special: [
      'Balanced power',
      '+Reform acceptance',
      '+Stability in crisis'
    ],
    reforms: [
      'Parliamentary system',
      'Bill of rights',
      'Limited monarchy'
    ],
    prerequisites: {
      techs: ['constitutional_gov']
    },
    canTransitionTo: ['parliamentary_monarchy', 'republic']
  },
  {
    id: 'enlightened_despotism',
    name: 'Enlightened Despotism',
    description: 'Absolute power guided by reason',
    icon: '💡',
    modifiers: {
      innovation: 0.3,
      economy: 0.2,
      prestige: 0.2
    },
    special: [
      '+Research speed',
      '+Modernization',
      'Top-down reforms'
    ],
    reforms: [
      'Legal codification',
      'Religious tolerance',
      'Education expansion'
    ],
    prerequisites: {
      techs: ['enlightened_thought']
    },
    canTransitionTo: ['constitutional_monarchy', 'absolute_monarchy']
  },
  {
    id: 'parliamentary_monarchy',
    name: 'Parliamentary Monarchy',
    description: 'Parliament holds real power, monarch ceremonial',
    icon: '🏛️',
    modifiers: {
      stability: 0.3,
      economy: 0.3,
      innovation: 0.2
    },
    special: [
      '+Democratic stability',
      '+Trade agreements',
      'Slower decisions'
    ],
    reforms: [
      'Prime minister',
      'Cabinet system',
      'Electoral expansion'
    ],
    prerequisites: {
      year: 1800,
      techs: ['constitutional_gov', 'nationalism']
    },
    canTransitionTo: ['republic']
  },
  {
    id: 'republic',
    name: 'Republic',
    description: 'Elected officials govern',
    icon: '🗳️',
    modifiers: {
      innovation: 0.3,
      economy: 0.2,
      prestige: 0.1
    },
    special: [
      '+Civic participation',
      '+Economic growth',
      'Election cycles'
    ],
    reforms: [
      'Written constitution',
      'Separation of powers',
      'Term limits'
    ],
    prerequisites: {
      year: 1780,
      techs: ['constitutional_gov']
    },
    canTransitionTo: ['presidential_republic', 'parliamentary_republic']
  },
  {
    id: 'presidential_republic',
    name: 'Presidential Republic',
    description: 'Strong executive president',
    icon: '🦅',
    modifiers: {
      military: 0.2,
      stability: 0.1,
      economy: 0.2
    },
    special: [
      'Decisive leadership',
      '+Military spending',
      'Executive power'
    ],
    reforms: [
      'Presidential veto',
      'Federal system',
      'Direct election'
    ],
    prerequisites: {
      year: 1800
    },
    canTransitionTo: ['republic', 'dictatorship']
  },
  {
    id: 'parliamentary_republic',
    name: 'Parliamentary Republic',
    description: 'Parliament selects executive',
    icon: '🏛️',
    modifiers: {
      stability: 0.2,
      innovation: 0.2,
      economy: 0.3
    },
    special: [
      '+Coalition building',
      '+Diplomatic relations',
      'Frequent elections'
    ],
    reforms: [
      'Proportional representation',
      'Coalition government',
      'Ceremonial president'
    ],
    prerequisites: {
      year: 1850
    },
    canTransitionTo: ['republic', 'presidential_republic']
  },
  {
    id: 'oligarchy',
    name: 'Oligarchy',
    description: 'Rule by wealthy elite',
    icon: '💰',
    modifiers: {
      economy: 0.3,
      stability: -0.2,
      prestige: -0.1
    },
    special: [
      '+Trade income',
      '-Popular support',
      'Elite control'
    ],
    reforms: [
      'Merchant councils',
      'Wealth requirements',
      'Trade monopolies'
    ],
    canTransitionTo: ['republic', 'absolute_monarchy']
  },
  {
    id: 'theocracy',
    name: 'Theocracy',
    description: 'Religious authority governs',
    icon: '⛪',
    modifiers: {
      stability: 0.3,
      innovation: -0.3,
      prestige: 0.2
    },
    special: [
      '+Religious unity',
      '-Scientific progress',
      '+Legitimacy'
    ],
    reforms: [
      'Religious law',
      'Church-state union',
      'Clerical councils'
    ],
    canTransitionTo: ['absolute_monarchy', 'constitutional_monarchy']
  },
  {
    id: 'military_dictatorship',
    name: 'Military Dictatorship',
    description: 'Army controls government',
    icon: '🎖️',
    modifiers: {
      military: 0.5,
      stability: -0.2,
      economy: -0.1
    },
    special: [
      '+Army strength',
      '+Quick mobilization',
      '-Diplomatic reputation'
    ],
    reforms: [
      'Martial law',
      'Military tribunals',
      'Conscription'
    ],
    prerequisites: {
      year: 1800
    },
    canTransitionTo: ['republic', 'absolute_monarchy']
  }
];

// Get government type by ID
export function getGovernmentType(id: string): GovernmentType | undefined {
  return GOVERNMENT_TYPES.find(g => g.id === id);
}

// Check if transition is valid
export function canTransition(fromId: string, toId: string): boolean {
  const from = getGovernmentType(fromId);
  return from?.canTransitionTo.includes(toId) ?? false;
}

// Get available government types for current situation
export function getAvailableGovernments(
  currentGov: string,
  year: number,
  researchedTechs: string[],
  stats: NationStats
): GovernmentType[] {
  const current = getGovernmentType(currentGov);
  if (!current) return [];

  return GOVERNMENT_TYPES.filter(gov => {
    // Can transition from current?
    if (!current.canTransitionTo.includes(gov.id)) return false;

    // Check prerequisites
    if (gov.prerequisites) {
      if (gov.prerequisites.year && year < gov.prerequisites.year) return false;
      if (gov.prerequisites.techs) {
        if (gov.prerequisites.techs.some(t => !researchedTechs.includes(t))) return false;
      }
      if (gov.prerequisites.stats) {
        for (const [stat, min] of Object.entries(gov.prerequisites.stats)) {
          if (stats[stat as keyof NationStats] < min) return false;
        }
      }
    }

    return true;
  });
}

// Calculate modifier totals
export function getGovernmentModifiers(govId: string): Partial<NationStats> {
  const gov = getGovernmentType(govId);
  return gov?.modifiers ?? {};
}

export default GOVERNMENT_TYPES;
