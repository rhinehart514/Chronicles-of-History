// Random event definitions for dynamic gameplay

import { NationStats } from '../types';

export interface RandomEvent {
  id: string;
  name: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral';
  category: 'military' | 'economy' | 'diplomacy' | 'internal' | 'natural' | 'cultural';
  probability: number; // 0-1
  yearsAvailable?: { min?: number; max?: number };
  conditions?: {
    minStat?: Partial<NationStats>;
    maxStat?: Partial<NationStats>;
    atWar?: boolean;
    hasAlliance?: boolean;
  };
  choices: EventChoice[];
}

export interface EventChoice {
  id: string;
  text: string;
  effects: Partial<NationStats>;
  description: string;
  cost?: number;
}

export const RANDOM_EVENTS: RandomEvent[] = [
  // Positive events
  {
    id: 'bumper_harvest',
    name: 'Bumper Harvest',
    description: 'Excellent weather and new farming techniques have yielded an exceptional harvest this year.',
    type: 'positive',
    category: 'economy',
    probability: 0.15,
    choices: [
      {
        id: 'store',
        text: 'Store the surplus',
        effects: { stability: 0.5 },
        description: 'The granaries are full. The people feel secure.'
      },
      {
        id: 'sell',
        text: 'Sell the excess',
        effects: { economy: 0.5 },
        description: 'Trade flourishes as merchants export the surplus.'
      },
      {
        id: 'feast',
        text: 'Hold a great feast',
        effects: { stability: 0.3, prestige: 0.3 },
        description: 'The celebration boosts morale and your reputation.'
      }
    ]
  },
  {
    id: 'gold_discovery',
    name: 'Gold Discovery',
    description: 'Prospectors have discovered a significant gold deposit in the mountains.',
    type: 'positive',
    category: 'economy',
    probability: 0.05,
    choices: [
      {
        id: 'royal_mine',
        text: 'Establish a royal mine',
        effects: { economy: 1.0 },
        description: 'The crown controls the gold, filling the treasury.'
      },
      {
        id: 'private_claims',
        text: 'Allow private claims',
        effects: { economy: 0.5, stability: 0.5 },
        description: 'A gold rush brings settlers and economic growth.'
      }
    ]
  },
  {
    id: 'scientific_breakthrough',
    name: 'Scientific Breakthrough',
    description: 'Scholars at the royal academy have made a significant discovery.',
    type: 'positive',
    category: 'cultural',
    probability: 0.1,
    conditions: { minStat: { innovation: 3 } },
    choices: [
      {
        id: 'publish',
        text: 'Publish the findings',
        effects: { innovation: 0.5, prestige: 0.5 },
        description: 'Your nation gains renown for advancing human knowledge.'
      },
      {
        id: 'military_application',
        text: 'Apply to military',
        effects: { innovation: 0.3, military: 0.5 },
        description: 'The discovery gives your armies a technological edge.'
      }
    ]
  },
  {
    id: 'diplomatic_marriage',
    name: 'Royal Marriage Proposal',
    description: 'A neighboring kingdom proposes a marriage alliance with your royal family.',
    type: 'positive',
    category: 'diplomacy',
    probability: 0.08,
    choices: [
      {
        id: 'accept',
        text: 'Accept the proposal',
        effects: { prestige: 0.5, stability: 0.3 },
        description: 'The union strengthens ties between nations.'
      },
      {
        id: 'decline',
        text: 'Politely decline',
        effects: {},
        description: 'You preserve your independence but miss an opportunity.'
      }
    ]
  },

  // Negative events
  {
    id: 'plague_outbreak',
    name: 'Plague Outbreak',
    description: 'A terrible disease has begun spreading through the population.',
    type: 'negative',
    category: 'natural',
    probability: 0.08,
    choices: [
      {
        id: 'quarantine',
        text: 'Impose strict quarantine',
        effects: { stability: -0.5, economy: -0.5 },
        description: 'Trade suffers but the spread is contained.'
      },
      {
        id: 'pray',
        text: 'Pray for divine intervention',
        effects: { stability: -1.0 },
        description: 'Faith provides comfort but the disease spreads.'
      },
      {
        id: 'doctors',
        text: 'Summon the best doctors',
        effects: { economy: -0.3 },
        description: 'Expensive but effective medical care.',
        cost: 50
      }
    ]
  },
  {
    id: 'famine',
    name: 'Famine Strikes',
    description: 'Crop failures have led to widespread food shortages.',
    type: 'negative',
    category: 'natural',
    probability: 0.1,
    choices: [
      {
        id: 'import_food',
        text: 'Import food',
        effects: { economy: -0.5 },
        description: 'Expensive but saves lives.',
        cost: 30
      },
      {
        id: 'ration',
        text: 'Implement rationing',
        effects: { stability: -0.5 },
        description: 'Fair distribution but low morale.'
      },
      {
        id: 'nothing',
        text: 'Let nature take its course',
        effects: { stability: -1.0, military: -0.3 },
        description: 'Many perish. The survivors remember.'
      }
    ]
  },
  {
    id: 'peasant_revolt',
    name: 'Peasant Revolt',
    description: 'Oppressed peasants have taken up arms against their lords.',
    type: 'negative',
    category: 'internal',
    probability: 0.1,
    conditions: { maxStat: { stability: 2 } },
    choices: [
      {
        id: 'crush',
        text: 'Crush the rebellion',
        effects: { stability: -0.5, military: 0.3 },
        description: 'Order is restored through force.'
      },
      {
        id: 'negotiate',
        text: 'Address their grievances',
        effects: { economy: -0.3, stability: 0.5 },
        description: 'Reforms calm the unrest but cost the treasury.'
      }
    ]
  },
  {
    id: 'noble_conspiracy',
    name: 'Noble Conspiracy',
    description: 'Intelligence reports a plot among the nobility against the crown.',
    type: 'negative',
    category: 'internal',
    probability: 0.07,
    choices: [
      {
        id: 'purge',
        text: 'Purge the conspirators',
        effects: { stability: -0.3, prestige: -0.3 },
        description: 'Brutal but effective. Fear spreads.'
      },
      {
        id: 'appease',
        text: 'Grant concessions',
        effects: { economy: -0.3 },
        description: 'Peace is bought, for now.'
      },
      {
        id: 'ignore',
        text: 'Dismiss the reports',
        effects: { stability: -0.5 },
        description: 'The plot continues to develop...'
      }
    ]
  },
  {
    id: 'border_incident',
    name: 'Border Incident',
    description: 'Troops from a neighboring nation have crossed into your territory.',
    type: 'negative',
    category: 'military',
    probability: 0.12,
    choices: [
      {
        id: 'mobilize',
        text: 'Mobilize for war',
        effects: { military: 0.3, economy: -0.3 },
        description: 'Your forces prepare for conflict.'
      },
      {
        id: 'protest',
        text: 'Lodge formal protest',
        effects: { prestige: -0.3 },
        description: 'Diplomatic weakness is noted.'
      },
      {
        id: 'retaliate',
        text: 'Counter-raid their territory',
        effects: { military: 0.5, stability: -0.3, prestige: -0.5 },
        description: 'Tit for tat. Tensions escalate.'
      }
    ]
  },

  // Neutral/Mixed events
  {
    id: 'religious_reform',
    name: 'Religious Reform Movement',
    description: 'Reformers call for changes to the established church.',
    type: 'neutral',
    category: 'cultural',
    probability: 0.08,
    yearsAvailable: { min: 1500, max: 1700 },
    choices: [
      {
        id: 'support',
        text: 'Support the reformers',
        effects: { innovation: 0.5, stability: -0.5 },
        description: 'Progress comes at the cost of tradition.'
      },
      {
        id: 'suppress',
        text: 'Defend the old faith',
        effects: { stability: 0.3, innovation: -0.3 },
        description: 'Tradition is upheld but ideas spread underground.'
      },
      {
        id: 'tolerance',
        text: 'Allow religious freedom',
        effects: { stability: -0.3, prestige: 0.3 },
        description: 'A bold stance that draws both praise and criticism.'
      }
    ]
  },
  {
    id: 'trade_opportunity',
    name: 'New Trade Opportunity',
    description: 'Merchants propose opening trade with a distant land.',
    type: 'neutral',
    category: 'economy',
    probability: 0.1,
    choices: [
      {
        id: 'invest',
        text: 'Fund the expedition',
        effects: { economy: 0.5, prestige: 0.3 },
        description: 'Risk brings reward. New markets open.',
        cost: 40
      },
      {
        id: 'charter',
        text: 'Grant a charter to merchants',
        effects: { economy: 0.3 },
        description: 'Private enterprise takes the risk.'
      },
      {
        id: 'decline',
        text: 'Too risky',
        effects: {},
        description: 'You play it safe.'
      }
    ]
  },
  {
    id: 'great_thinker',
    name: 'Great Thinker Emerges',
    description: 'A brilliant philosopher has gained prominence in your nation.',
    type: 'neutral',
    category: 'cultural',
    probability: 0.06,
    choices: [
      {
        id: 'patronize',
        text: 'Become their patron',
        effects: { innovation: 0.5, prestige: 0.5 },
        description: 'Your court becomes a center of learning.',
        cost: 25
      },
      {
        id: 'censor',
        text: 'Censor dangerous ideas',
        effects: { stability: 0.3, innovation: -0.3 },
        description: 'Order is maintained but at a cost.'
      }
    ]
  },
  {
    id: 'military_genius',
    name: 'Military Genius',
    description: 'A talented officer has risen through the ranks.',
    type: 'positive',
    category: 'military',
    probability: 0.08,
    choices: [
      {
        id: 'promote',
        text: 'Promote to high command',
        effects: { military: 0.5 },
        description: 'Your armies gain a capable leader.'
      },
      {
        id: 'watch',
        text: 'Keep them under watch',
        effects: { military: 0.3, stability: 0.2 },
        description: 'Talented but potentially dangerous.'
      }
    ]
  },
  {
    id: 'natural_disaster',
    name: 'Earthquake',
    description: 'A powerful earthquake has struck a major city.',
    type: 'negative',
    category: 'natural',
    probability: 0.05,
    choices: [
      {
        id: 'rebuild',
        text: 'Fund reconstruction',
        effects: { stability: 0.3 },
        description: 'Your generosity is remembered.',
        cost: 60
      },
      {
        id: 'minimal',
        text: 'Provide minimal aid',
        effects: { stability: -0.5, economy: -0.2 },
        description: 'The affected population feels abandoned.'
      }
    ]
  }
];

// Get events valid for current year and nation state
export function getAvailableEvents(
  year: number,
  stats: NationStats,
  atWar: boolean,
  hasAlliance: boolean
): RandomEvent[] {
  return RANDOM_EVENTS.filter(event => {
    // Check year availability
    if (event.yearsAvailable) {
      if (event.yearsAvailable.min && year < event.yearsAvailable.min) return false;
      if (event.yearsAvailable.max && year > event.yearsAvailable.max) return false;
    }

    // Check conditions
    if (event.conditions) {
      if (event.conditions.minStat) {
        for (const [stat, min] of Object.entries(event.conditions.minStat)) {
          if (stats[stat as keyof NationStats] < min) return false;
        }
      }
      if (event.conditions.maxStat) {
        for (const [stat, max] of Object.entries(event.conditions.maxStat)) {
          if (stats[stat as keyof NationStats] > max) return false;
        }
      }
      if (event.conditions.atWar !== undefined && event.conditions.atWar !== atWar) return false;
      if (event.conditions.hasAlliance !== undefined && event.conditions.hasAlliance !== hasAlliance) return false;
    }

    return true;
  });
}

// Roll for random event
export function rollForEvent(
  year: number,
  stats: NationStats,
  atWar: boolean,
  hasAlliance: boolean
): RandomEvent | null {
  const available = getAvailableEvents(year, stats, atWar, hasAlliance);

  for (const event of available) {
    if (Math.random() < event.probability) {
      return event;
    }
  }

  return null;
}

export default RANDOM_EVENTS;
