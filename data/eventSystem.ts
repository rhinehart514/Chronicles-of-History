// Game events system

export interface GameEvent {
  id: string;
  title: string;
  icon: string;
  description: string;
  category: EventCategory;
  options: EventOption[];
  trigger: EventTrigger;
  meanTimeToHappen?: number; // months
  immediate?: EventEffect[];
  hidden: boolean;
}

export type EventCategory = 'political' | 'economic' | 'military' | 'religious' | 'cultural' | 'natural' | 'diplomatic';

export interface EventOption {
  id: string;
  name: string;
  description: string;
  effects: EventEffect[];
  aiWeight?: number;
}

export interface EventEffect {
  type: string;
  value: number | string;
  scope?: 'nation' | 'province' | 'ruler';
  duration?: number;
}

export interface EventTrigger {
  type: TriggerType;
  conditions: TriggerCondition[];
}

export type TriggerType = 'on_monthly' | 'on_yearly' | 'on_war_start' | 'on_peace' | 'on_ruler_death' | 'immediate';

export interface TriggerCondition {
  type: string;
  value: string | number | boolean;
  operator?: 'eq' | 'gt' | 'lt' | 'gte' | 'lte';
}

// Sample events
export const GAME_EVENTS: GameEvent[] = [
  {
    id: 'comet_sighted',
    title: 'Comet Sighted',
    icon: '☄️',
    description: 'A comet has been sighted in the sky! The common folk see this as an omen, but our court astronomers assure us it is merely a natural phenomenon.',
    category: 'natural',
    options: [
      {
        id: 'good_omen',
        name: 'It is a good omen!',
        description: 'The people will be heartened by this sign',
        effects: [
          { type: 'prestige', value: 10 },
          { type: 'stability', value: 0.5 }
        ]
      },
      {
        id: 'bad_omen',
        name: 'It is a bad omen...',
        description: 'We should prepare for difficult times',
        effects: [
          { type: 'stability', value: -1 }
        ]
      },
      {
        id: 'sacrifice',
        name: 'Sacrifice a human heart to appease the gods',
        description: 'Available for certain religions',
        effects: [
          { type: 'stability', value: 1 },
          { type: 'manpower', value: -1000 }
        ]
      }
    ],
    trigger: {
      type: 'on_yearly',
      conditions: []
    },
    meanTimeToHappen: 600,
    hidden: false
  },
  {
    id: 'peasant_revolt',
    title: 'Peasants Demand Reform',
    icon: '🔱',
    description: 'The peasants in our realm are growing restless. They demand lower taxes and better working conditions. If we do not act, this could spiral into open rebellion.',
    category: 'political',
    options: [
      {
        id: 'lower_taxes',
        name: 'Lower taxes for a year',
        description: 'This will calm the peasants but hurt our income',
        effects: [
          { type: 'tax_income_modifier', value: -25, duration: 12 },
          { type: 'stability', value: 1 }
        ]
      },
      {
        id: 'send_troops',
        name: 'Send troops to restore order',
        description: 'Show them who is in charge',
        effects: [
          { type: 'stability', value: -2 },
          { type: 'unrest', value: 3, scope: 'province' }
        ]
      },
      {
        id: 'reforms',
        name: 'Promise gradual reforms',
        description: 'A diplomatic solution',
        effects: [
          { type: 'prestige', value: -5 },
          { type: 'stability', value: 0 }
        ]
      }
    ],
    trigger: {
      type: 'on_yearly',
      conditions: [
        { type: 'stability', value: 0, operator: 'lt' },
        { type: 'unrest_any', value: 3, operator: 'gt' }
      ]
    },
    meanTimeToHappen: 120,
    hidden: false
  },
  {
    id: 'talented_minister',
    title: 'A Talented Minister',
    icon: '👨‍💼',
    description: 'A remarkably talented individual has come to our attention. Their skills could greatly benefit our administration, but employing them would be costly.',
    category: 'political',
    options: [
      {
        id: 'hire',
        name: 'Hire them immediately',
        description: 'Pay the cost for their services',
        effects: [
          { type: 'gold', value: -200 },
          { type: 'advisor_cost', value: -10, duration: 60 }
        ]
      },
      {
        id: 'decline',
        name: 'We cannot afford such luxuries',
        description: 'Let them go',
        effects: []
      }
    ],
    trigger: {
      type: 'on_yearly',
      conditions: []
    },
    meanTimeToHappen: 300,
    hidden: false
  },
  {
    id: 'trade_dispute',
    title: 'Trade Dispute',
    icon: '⚖️',
    description: 'Foreign merchants complain that our tariffs are too high and threaten to take their business elsewhere. Our own merchants argue the tariffs protect their livelihoods.',
    category: 'economic',
    options: [
      {
        id: 'lower_tariffs',
        name: 'Lower tariffs to encourage trade',
        description: 'Foreign merchants will be pleased',
        effects: [
          { type: 'trade_efficiency', value: 10, duration: 60 },
          { type: 'global_tariffs', value: -10, duration: 60 }
        ]
      },
      {
        id: 'maintain',
        name: 'Maintain current tariffs',
        description: 'Our merchants must be protected',
        effects: [
          { type: 'trade_efficiency', value: -5, duration: 60 },
          { type: 'production_efficiency', value: 5, duration: 60 }
        ]
      }
    ],
    trigger: {
      type: 'on_monthly',
      conditions: [
        { type: 'trade_income', value: 10, operator: 'gt' }
      ]
    },
    meanTimeToHappen: 240,
    hidden: false
  },
  {
    id: 'military_genius',
    title: 'Military Genius',
    icon: '🎖️',
    description: 'A young officer has shown exceptional tactical brilliance in recent exercises. Some suggest promoting them to a command position.',
    category: 'military',
    options: [
      {
        id: 'promote',
        name: 'Promote them to general',
        description: 'Give them a chance to prove themselves',
        effects: [
          { type: 'army_tradition', value: 5 },
          { type: 'free_leader', value: 1 }
        ]
      },
      {
        id: 'wait',
        name: 'They need more experience',
        description: 'Let them prove themselves in the field first',
        effects: [
          { type: 'army_tradition', value: 2 }
        ]
      }
    ],
    trigger: {
      type: 'on_yearly',
      conditions: [
        { type: 'army_tradition', value: 40, operator: 'gt' }
      ]
    },
    meanTimeToHappen: 400,
    hidden: false
  },
  {
    id: 'religious_fervor',
    title: 'Religious Fervor',
    icon: '⛪',
    description: 'A wave of religious enthusiasm sweeps through our nation. The faithful are more devoted than ever, but some worry about intolerance towards minorities.',
    category: 'religious',
    options: [
      {
        id: 'encourage',
        name: 'Encourage the fervor',
        description: 'Our faith is our strength',
        effects: [
          { type: 'missionary_strength', value: 2, duration: 120 },
          { type: 'tolerance_heretic', value: -1, duration: 120 }
        ]
      },
      {
        id: 'moderate',
        name: 'Call for moderation',
        description: 'Faith and tolerance can coexist',
        effects: [
          { type: 'stability', value: 1 }
        ]
      }
    ],
    trigger: {
      type: 'on_yearly',
      conditions: [
        { type: 'religious_unity', value: 0.8, operator: 'gt' }
      ]
    },
    meanTimeToHappen: 360,
    hidden: false
  },
  {
    id: 'epidemic',
    title: 'Epidemic Outbreak',
    icon: '🦠',
    description: 'A terrible disease has broken out in one of our provinces! The sick fill the streets and fear spreads faster than the illness itself.',
    category: 'natural',
    options: [
      {
        id: 'quarantine',
        name: 'Quarantine the affected areas',
        description: 'Contain the spread at all costs',
        effects: [
          { type: 'province_manpower', value: -2000, scope: 'province' },
          { type: 'devastation', value: 10, scope: 'province' }
        ]
      },
      {
        id: 'doctors',
        name: 'Send doctors and supplies',
        description: 'Help our people recover',
        effects: [
          { type: 'gold', value: -100 },
          { type: 'province_manpower', value: -1000, scope: 'province' }
        ]
      },
      {
        id: 'pray',
        name: 'Pray for divine intervention',
        description: 'Perhaps the gods will help',
        effects: [
          { type: 'province_manpower', value: -3000, scope: 'province' },
          { type: 'prestige', value: -10 }
        ]
      }
    ],
    trigger: {
      type: 'on_yearly',
      conditions: []
    },
    meanTimeToHappen: 500,
    hidden: false
  },
  {
    id: 'succession_crisis',
    title: 'Succession Crisis',
    icon: '👑',
    description: 'Our ruler has died without a clear heir! Multiple claimants vie for the throne, each backed by powerful factions.',
    category: 'political',
    options: [
      {
        id: 'eldest',
        name: 'Support the eldest claimant',
        description: 'Tradition must be upheld',
        effects: [
          { type: 'legitimacy', value: -20 },
          { type: 'stability', value: -1 }
        ]
      },
      {
        id: 'strongest',
        name: 'Support the strongest claimant',
        description: 'We need a capable ruler',
        effects: [
          { type: 'legitimacy', value: -40 },
          { type: 'prestige', value: 10 }
        ]
      },
      {
        id: 'election',
        name: 'Let the estates decide',
        description: 'A democratic solution',
        effects: [
          { type: 'legitimacy', value: -10 },
          { type: 'stability', value: -2 }
        ]
      }
    ],
    trigger: {
      type: 'on_ruler_death',
      conditions: [
        { type: 'has_heir', value: false }
      ]
    },
    hidden: false
  }
];

// Get events by category
export function getEventsByCategory(category: EventCategory): GameEvent[] {
  return GAME_EVENTS.filter(e => e.category === category);
}

// Check if event can trigger
export function canEventTrigger(
  event: GameEvent,
  gameState: Record<string, any>
): boolean {
  for (const condition of event.trigger.conditions) {
    const value = gameState[condition.type];
    if (value === undefined) return false;

    const target = condition.value;
    switch (condition.operator) {
      case 'gt':
        if (value <= target) return false;
        break;
      case 'lt':
        if (value >= target) return false;
        break;
      case 'gte':
        if (value < target) return false;
        break;
      case 'lte':
        if (value > target) return false;
        break;
      default:
        if (value !== target) return false;
    }
  }
  return true;
}

// Roll for event occurrence
export function shouldEventFire(
  event: GameEvent,
  monthsPassed: number
): boolean {
  if (!event.meanTimeToHappen) return true;
  const probability = 1 - Math.pow(1 - 1/event.meanTimeToHappen, monthsPassed);
  return Math.random() < probability;
}

export default {
  GAME_EVENTS,
  getEventsByCategory,
  canEventTrigger,
  shouldEventFire
};
