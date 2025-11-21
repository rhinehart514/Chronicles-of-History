import { Nation, Era, GovernmentType } from '../types';

// ==================== DYNAMIC EVENT TYPES ====================

export type EventCategory =
  | 'POLITICAL' | 'ECONOMIC' | 'MILITARY' | 'DIPLOMATIC'
  | 'SOCIAL' | 'CULTURAL' | 'RELIGIOUS' | 'NATURAL_DISASTER'
  | 'SCIENTIFIC' | 'COURT_INTRIGUE';

export type EventSeverity = 'MINOR' | 'MODERATE' | 'MAJOR' | 'CRITICAL';

export interface EventChoice {
  id: string;
  text: string;
  effects: {
    stability?: number;
    economy?: number;
    military?: number;
    prestige?: number;
    innovation?: number;
    opinion?: { nationId: string; change: number }[];
    factionApproval?: { factionName: string; change: number }[];
    customEffect?: string;
  };
  requirements?: {
    minStat?: { stat: keyof Nation['stats']; value: number };
    governmentType?: GovernmentType[];
    era?: Era[];
  };
}

export interface DynamicEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  severity: EventSeverity;
  choices: EventChoice[];

  // Trigger conditions
  conditions: {
    minYear?: number;
    maxYear?: number;
    eras?: Era[];
    governmentTypes?: GovernmentType[];
    minStability?: number;
    maxStability?: number;
    atWar?: boolean;
    hasRivalry?: boolean;
    hasAlliance?: boolean;
    customCondition?: (nation: Nation, year: number) => boolean;
  };

  // Probability
  baseChance: number; // 0-100
  cooldown: number; // Years before this event can fire again
  unique?: boolean; // Can only happen once per game

  // For narrative
  imagePrompt?: string;
}

// ==================== EVENT TEMPLATES ====================

export const DYNAMIC_EVENTS: DynamicEvent[] = [
  // ==================== POLITICAL EVENTS ====================
  {
    id: 'peasant_unrest',
    title: 'Peasant Unrest',
    description: 'Reports arrive of growing discontent in the countryside. Peasants complain of heavy taxation and poor harvests. Local officials warn that without intervention, the situation could escalate.',
    category: 'POLITICAL',
    severity: 'MODERATE',
    choices: [
      {
        id: 'reduce_taxes',
        text: 'Reduce taxes to ease their burden',
        effects: {
          stability: 1,
          economy: -1,
          factionApproval: [
            { factionName: 'Peasantry', change: 20 },
            { factionName: 'Aristocracy', change: -10 }
          ]
        }
      },
      {
        id: 'send_troops',
        text: 'Send troops to restore order',
        effects: {
          stability: -1,
          military: 0,
          factionApproval: [
            { factionName: 'Peasantry', change: -25 },
            { factionName: 'Military', change: 10 }
          ],
          customEffect: 'Unrest suppressed but resentment grows'
        }
      },
      {
        id: 'investigate',
        text: 'Send investigators to assess the situation',
        effects: {
          stability: 0,
          prestige: 1,
          customEffect: 'Gain insight into regional problems'
        }
      }
    ],
    conditions: {
      maxStability: 3
    },
    baseChance: 15,
    cooldown: 10
  },

  {
    id: 'succession_crisis',
    title: 'Succession Crisis',
    description: 'The question of succession has become a pressing matter. Multiple factions at court champion different candidates, threatening to tear the realm apart.',
    category: 'COURT_INTRIGUE',
    severity: 'MAJOR',
    choices: [
      {
        id: 'support_eldest',
        text: 'Support the eldest legitimate heir',
        effects: {
          stability: 1,
          factionApproval: [
            { factionName: 'Traditionalists', change: 25 },
            { factionName: 'Reformists', change: -15 }
          ]
        }
      },
      {
        id: 'support_capable',
        text: 'Support the most capable candidate',
        effects: {
          stability: -1,
          innovation: 1,
          factionApproval: [
            { factionName: 'Traditionalists', change: -20 },
            { factionName: 'Military', change: 15 }
          ]
        }
      },
      {
        id: 'delay_decision',
        text: 'Delay the decision to gather more support',
        effects: {
          stability: -1,
          prestige: -1,
          customEffect: 'Uncertainty prolongs'
        }
      }
    ],
    conditions: {
      governmentTypes: ['ABSOLUTE_MONARCHY', 'CONSTITUTIONAL_MONARCHY', 'EMPIRE']
    },
    baseChance: 8,
    cooldown: 25,
    unique: false
  },

  {
    id: 'reform_movement',
    title: 'Reform Movement',
    description: 'Intellectuals and progressive nobles call for modernizing reforms. They demand constitutional changes, freedom of the press, and limits on absolute power.',
    category: 'POLITICAL',
    severity: 'MAJOR',
    choices: [
      {
        id: 'embrace_reforms',
        text: 'Embrace the reforms',
        effects: {
          stability: -1,
          innovation: 2,
          prestige: 1,
          factionApproval: [
            { factionName: 'Reformists', change: 30 },
            { factionName: 'Conservatives', change: -25 }
          ]
        }
      },
      {
        id: 'moderate_reforms',
        text: 'Implement moderate reforms',
        effects: {
          innovation: 1,
          factionApproval: [
            { factionName: 'Reformists', change: 10 },
            { factionName: 'Conservatives', change: -10 }
          ]
        }
      },
      {
        id: 'suppress_movement',
        text: 'Suppress the reform movement',
        effects: {
          stability: 1,
          innovation: -1,
          prestige: -1,
          factionApproval: [
            { factionName: 'Reformists', change: -30 },
            { factionName: 'Conservatives', change: 20 }
          ]
        }
      }
    ],
    conditions: {
      eras: ['ENLIGHTENMENT', 'REVOLUTIONARY', 'INDUSTRIAL'],
      governmentTypes: ['ABSOLUTE_MONARCHY', 'EMPIRE']
    },
    baseChance: 12,
    cooldown: 15
  },

  // ==================== ECONOMIC EVENTS ====================
  {
    id: 'trade_boom',
    title: 'Trade Boom',
    description: 'Merchants report exceptional profits as trade flourishes. New markets have opened and demand for our goods is at an all-time high.',
    category: 'ECONOMIC',
    severity: 'MODERATE',
    choices: [
      {
        id: 'invest_infrastructure',
        text: 'Invest profits in infrastructure',
        effects: {
          economy: 2,
          innovation: 1,
          customEffect: 'Roads and ports improved'
        }
      },
      {
        id: 'military_expansion',
        text: 'Fund military expansion',
        effects: {
          economy: 1,
          military: 2,
          factionApproval: [
            { factionName: 'Military', change: 20 }
          ]
        }
      },
      {
        id: 'reduce_taxes',
        text: 'Reduce taxes and share prosperity',
        effects: {
          economy: 1,
          stability: 1,
          prestige: 1
        }
      }
    ],
    conditions: {
      minStability: 3
    },
    baseChance: 10,
    cooldown: 8
  },

  {
    id: 'economic_crisis',
    title: 'Economic Crisis',
    description: 'A financial panic has gripped the markets. Banks are failing, merchants are going bankrupt, and unemployment is rising rapidly.',
    category: 'ECONOMIC',
    severity: 'MAJOR',
    choices: [
      {
        id: 'bail_out',
        text: 'Use treasury reserves to bail out banks',
        effects: {
          economy: 1,
          stability: 1,
          prestige: -1,
          factionApproval: [
            { factionName: 'Merchants', change: 25 },
            { factionName: 'Peasantry', change: -15 }
          ]
        }
      },
      {
        id: 'let_fail',
        text: 'Let the market correct itself',
        effects: {
          economy: -2,
          stability: -1,
          factionApproval: [
            { factionName: 'Merchants', change: -20 }
          ],
          customEffect: 'Many businesses fail but survivors are stronger'
        }
      },
      {
        id: 'public_works',
        text: 'Launch public works programs',
        effects: {
          economy: 0,
          stability: 1,
          innovation: 1,
          customEffect: 'Employment stabilized through state projects'
        }
      }
    ],
    conditions: {
      maxStability: 3
    },
    baseChance: 8,
    cooldown: 15
  },

  // ==================== MILITARY EVENTS ====================
  {
    id: 'border_incident',
    title: 'Border Incident',
    description: 'A skirmish has erupted along our border. Local commanders report casualties and demand reinforcements. The neighboring nation claims we provoked them.',
    category: 'MILITARY',
    severity: 'MODERATE',
    choices: [
      {
        id: 'escalate',
        text: 'Send reinforcements and demand reparations',
        effects: {
          military: 1,
          stability: -1,
          opinion: [{ nationId: 'rival', change: -25 }],
          customEffect: 'Risk of war increases'
        }
      },
      {
        id: 'negotiate',
        text: 'Open diplomatic negotiations',
        effects: {
          prestige: -1,
          stability: 1,
          opinion: [{ nationId: 'rival', change: 5 }]
        }
      },
      {
        id: 'fortify',
        text: 'Quietly fortify the border',
        effects: {
          military: 1,
          economy: -1,
          customEffect: 'Defenses strengthened'
        }
      }
    ],
    conditions: {
      hasRivalry: true
    },
    baseChance: 12,
    cooldown: 10
  },

  {
    id: 'military_genius',
    title: 'Military Genius Emerges',
    description: 'A brilliant young officer has come to our attention. His tactical innovations and leadership have impressed all who serve with him.',
    category: 'MILITARY',
    severity: 'MODERATE',
    choices: [
      {
        id: 'promote',
        text: 'Promote him to high command',
        effects: {
          military: 2,
          factionApproval: [
            { factionName: 'Military', change: 15 }
          ],
          customEffect: 'New general inspires the army'
        }
      },
      {
        id: 'academy',
        text: 'Put him in charge of the military academy',
        effects: {
          military: 1,
          innovation: 1,
          customEffect: 'Officer training improved'
        }
      },
      {
        id: 'watch',
        text: 'Keep him under observation - such ambition is dangerous',
        effects: {
          prestige: -1,
          customEffect: 'Potential wasted but threat contained'
        }
      }
    ],
    conditions: {},
    baseChance: 6,
    cooldown: 20
  },

  // ==================== DIPLOMATIC EVENTS ====================
  {
    id: 'alliance_offer',
    title: 'Alliance Proposal',
    description: 'An ambassador arrives with a proposal for a formal alliance. They offer military support and favorable trade terms in exchange for our commitment.',
    category: 'DIPLOMATIC',
    severity: 'MAJOR',
    choices: [
      {
        id: 'accept',
        text: 'Accept the alliance',
        effects: {
          prestige: 1,
          military: 1,
          opinion: [{ nationId: 'proposer', change: 40 }],
          customEffect: 'Alliance formed'
        }
      },
      {
        id: 'counter',
        text: 'Make a counter-proposal with better terms',
        effects: {
          prestige: 1,
          opinion: [{ nationId: 'proposer', change: -10 }],
          customEffect: 'Negotiations continue'
        }
      },
      {
        id: 'decline',
        text: 'Politely decline',
        effects: {
          opinion: [{ nationId: 'proposer', change: -20 }],
          customEffect: 'Independence maintained'
        }
      }
    ],
    conditions: {},
    baseChance: 8,
    cooldown: 15
  },

  // ==================== NATURAL DISASTER EVENTS ====================
  {
    id: 'famine',
    title: 'Famine Strikes',
    description: 'Crop failures have led to widespread famine. People are starving in the streets and disease follows in hunger\'s wake. Immediate action is required.',
    category: 'NATURAL_DISASTER',
    severity: 'CRITICAL',
    choices: [
      {
        id: 'import_grain',
        text: 'Import grain at any cost',
        effects: {
          stability: 1,
          economy: -2,
          customEffect: 'Famine eased but treasury depleted'
        }
      },
      {
        id: 'redistribute',
        text: 'Seize noble granaries and redistribute',
        effects: {
          stability: 1,
          factionApproval: [
            { factionName: 'Peasantry', change: 30 },
            { factionName: 'Aristocracy', change: -35 }
          ],
          customEffect: 'Nobles outraged but people fed'
        }
      },
      {
        id: 'pray',
        text: 'Order national days of prayer and fasting',
        effects: {
          stability: -2,
          prestige: -1,
          factionApproval: [
            { factionName: 'Clergy', change: 15 }
          ],
          customEffect: 'People lose faith in leadership'
        }
      }
    ],
    conditions: {},
    baseChance: 5,
    cooldown: 20
  },

  {
    id: 'plague_outbreak',
    title: 'Plague Outbreak',
    description: 'A deadly plague has broken out in a major city. It spreads rapidly and threatens to devastate the population if not contained.',
    category: 'NATURAL_DISASTER',
    severity: 'CRITICAL',
    choices: [
      {
        id: 'quarantine',
        text: 'Impose strict quarantine',
        effects: {
          stability: 0,
          economy: -2,
          customEffect: 'Plague contained but trade disrupted'
        }
      },
      {
        id: 'physicians',
        text: 'Send physicians and fund research',
        effects: {
          economy: -1,
          innovation: 1,
          prestige: 1,
          customEffect: 'Medical knowledge advances'
        }
      },
      {
        id: 'flee',
        text: 'Relocate the court to safety',
        effects: {
          stability: -2,
          prestige: -2,
          customEffect: 'Leadership seen as cowardly'
        }
      }
    ],
    conditions: {},
    baseChance: 4,
    cooldown: 25
  },

  // ==================== SCIENTIFIC/CULTURAL EVENTS ====================
  {
    id: 'scientific_breakthrough',
    title: 'Scientific Breakthrough',
    description: 'Scholars at the royal academy have made a significant discovery that could revolutionize industry or warfare.',
    category: 'SCIENTIFIC',
    severity: 'MODERATE',
    choices: [
      {
        id: 'military_application',
        text: 'Fund military applications',
        effects: {
          military: 2,
          innovation: 1
        }
      },
      {
        id: 'civilian_application',
        text: 'Develop civilian applications',
        effects: {
          economy: 2,
          innovation: 1,
          prestige: 1
        }
      },
      {
        id: 'publish',
        text: 'Publish findings for international prestige',
        effects: {
          prestige: 2,
          innovation: 1,
          opinion: [{ nationId: 'all', change: 5 }]
        }
      }
    ],
    conditions: {
      eras: ['ENLIGHTENMENT', 'INDUSTRIAL', 'IMPERIAL', 'MODERN']
    },
    baseChance: 8,
    cooldown: 12
  },

  {
    id: 'cultural_renaissance',
    title: 'Cultural Renaissance',
    description: 'A flowering of the arts is taking place. Painters, writers, and musicians are creating works that capture the spirit of the age.',
    category: 'CULTURAL',
    severity: 'MINOR',
    choices: [
      {
        id: 'patronize',
        text: 'Become a patron of the arts',
        effects: {
          prestige: 2,
          economy: -1,
          customEffect: 'Cultural golden age begins'
        }
      },
      {
        id: 'regulate',
        text: 'Regulate content to serve state interests',
        effects: {
          prestige: -1,
          stability: 1,
          factionApproval: [
            { factionName: 'Intellectuals', change: -20 }
          ]
        }
      },
      {
        id: 'ignore',
        text: 'Let culture develop without interference',
        effects: {
          prestige: 1,
          customEffect: 'Arts flourish naturally'
        }
      }
    ],
    conditions: {
      minStability: 3
    },
    baseChance: 10,
    cooldown: 15
  }
];

// ==================== HELPER FUNCTIONS ====================

export const checkEventConditions = (
  event: DynamicEvent,
  nation: Nation,
  year: number
): boolean => {
  const c = event.conditions;

  if (c.minYear && year < c.minYear) return false;
  if (c.maxYear && year > c.maxYear) return false;
  if (c.eras && nation.currentEra && !c.eras.includes(nation.currentEra)) return false;
  if (c.governmentTypes && nation.government && !c.governmentTypes.includes(nation.government.type)) return false;
  if (c.minStability && nation.stats.stability < c.minStability) return false;
  if (c.maxStability && nation.stats.stability > c.maxStability) return false;

  // Check diplomacy conditions
  if (c.hasRivalry && nation.diplomacy) {
    const hasRival = nation.diplomacy.relations.some(r => r.relations.includes('RIVALRY'));
    if (!hasRival) return false;
  }
  if (c.hasAlliance && nation.diplomacy) {
    const hasAlliance = nation.diplomacy.relations.some(r => r.relations.includes('ALLIANCE'));
    if (!hasAlliance) return false;
  }

  // Custom condition
  if (c.customCondition && !c.customCondition(nation, year)) return false;

  return true;
};

export const rollForEvent = (event: DynamicEvent): boolean => {
  return Math.random() * 100 < event.baseChance;
};

export const selectRandomEvent = (
  nation: Nation,
  year: number,
  firedEvents: Map<string, number> // eventId -> lastFiredYear
): DynamicEvent | null => {
  // Filter eligible events
  const eligibleEvents = DYNAMIC_EVENTS.filter(event => {
    // Check conditions
    if (!checkEventConditions(event, nation, year)) return false;

    // Check cooldown
    const lastFired = firedEvents.get(event.id);
    if (lastFired && year - lastFired < event.cooldown) return false;

    // Check unique
    if (event.unique && lastFired) return false;

    return true;
  });

  if (eligibleEvents.length === 0) return null;

  // Roll for each event
  for (const event of eligibleEvents) {
    if (rollForEvent(event)) {
      return event;
    }
  }

  return null;
};

export const getEventsByCategory = (category: EventCategory): DynamicEvent[] => {
  return DYNAMIC_EVENTS.filter(e => e.category === category);
};

export const getSeverityColor = (severity: EventSeverity): string => {
  const colors: Record<EventSeverity, string> = {
    'MINOR': 'text-stone-600',
    'MODERATE': 'text-amber-600',
    'MAJOR': 'text-orange-600',
    'CRITICAL': 'text-red-600'
  };
  return colors[severity];
};
