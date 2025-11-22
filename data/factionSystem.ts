// Faction system for internal politics

import { NationStats } from '../types';

export interface Faction {
  id: string;
  name: string;
  description: string;
  icon: string;
  ideology: 'conservative' | 'liberal' | 'militarist' | 'mercantile' | 'clerical' | 'nationalist';
  influence: number; // 0-100
  happiness: number; // 0-100
  demands: FactionDemand[];
  bonusesWhenHappy: Partial<NationStats>;
  penaltiesWhenUnhappy: Partial<NationStats>;
}

export interface FactionDemand {
  id: string;
  text: string;
  type: 'policy' | 'war' | 'reform' | 'appointment';
  urgency: 'low' | 'medium' | 'high';
  reward: Partial<NationStats>;
  penalty: Partial<NationStats>;
  expires?: number; // turns until demand expires
}

export interface FactionAction {
  id: string;
  name: string;
  description: string;
  cost: number;
  effect: (faction: Faction) => Partial<Faction>;
  cooldown: number;
}

// Default factions
export const DEFAULT_FACTIONS: Omit<Faction, 'demands'>[] = [
  {
    id: 'nobility',
    name: 'Nobility',
    description: 'The landed aristocracy and traditional power holders',
    icon: '👑',
    ideology: 'conservative',
    influence: 30,
    happiness: 60,
    bonusesWhenHappy: { stability: 0.3, prestige: 0.2 },
    penaltiesWhenUnhappy: { stability: -0.5, military: -0.2 }
  },
  {
    id: 'clergy',
    name: 'Clergy',
    description: 'Religious authorities and institutions',
    icon: '⛪',
    ideology: 'clerical',
    influence: 20,
    happiness: 60,
    bonusesWhenHappy: { stability: 0.3 },
    penaltiesWhenUnhappy: { stability: -0.3, prestige: -0.2 }
  },
  {
    id: 'merchants',
    name: 'Merchant Class',
    description: 'Traders, bankers, and businessmen',
    icon: '💰',
    ideology: 'mercantile',
    influence: 25,
    happiness: 60,
    bonusesWhenHappy: { economy: 0.4 },
    penaltiesWhenUnhappy: { economy: -0.5 }
  },
  {
    id: 'military',
    name: 'Military',
    description: 'Army officers and military establishment',
    icon: '⚔️',
    ideology: 'militarist',
    influence: 20,
    happiness: 60,
    bonusesWhenHappy: { military: 0.3 },
    penaltiesWhenUnhappy: { military: -0.4, stability: -0.3 }
  },
  {
    id: 'intellectuals',
    name: 'Intellectuals',
    description: 'Scholars, scientists, and reformers',
    icon: '📚',
    ideology: 'liberal',
    influence: 15,
    happiness: 60,
    bonusesWhenHappy: { innovation: 0.4, prestige: 0.2 },
    penaltiesWhenUnhappy: { innovation: -0.3 }
  },
  {
    id: 'peasantry',
    name: 'Peasantry',
    description: 'Rural farmers and common people',
    icon: '🌾',
    ideology: 'conservative',
    influence: 25,
    happiness: 50,
    bonusesWhenHappy: { stability: 0.2 },
    penaltiesWhenUnhappy: { stability: -0.5, economy: -0.3 }
  }
];

// Faction demands by ideology
export const FACTION_DEMANDS: Record<string, FactionDemand[]> = {
  conservative: [
    {
      id: 'preserve_traditions',
      text: 'Preserve our ancient traditions',
      type: 'policy',
      urgency: 'medium',
      reward: { stability: 0.3 },
      penalty: { stability: -0.3 }
    },
    {
      id: 'limit_reforms',
      text: 'Slow down these dangerous reforms',
      type: 'reform',
      urgency: 'high',
      reward: { stability: 0.2 },
      penalty: { innovation: 0.2, stability: -0.2 }
    }
  ],
  liberal: [
    {
      id: 'expand_rights',
      text: 'Expand civil liberties',
      type: 'reform',
      urgency: 'high',
      reward: { innovation: 0.3, prestige: 0.2 },
      penalty: { stability: -0.2 }
    },
    {
      id: 'education_funding',
      text: 'Increase education funding',
      type: 'policy',
      urgency: 'medium',
      reward: { innovation: 0.3 },
      penalty: { economy: -0.2 }
    }
  ],
  militarist: [
    {
      id: 'military_funding',
      text: 'Increase military budget',
      type: 'policy',
      urgency: 'high',
      reward: { military: 0.4 },
      penalty: { economy: -0.3 }
    },
    {
      id: 'show_strength',
      text: 'Demonstrate military strength',
      type: 'war',
      urgency: 'medium',
      reward: { military: 0.2, prestige: 0.2 },
      penalty: { prestige: -0.3 }
    }
  ],
  mercantile: [
    {
      id: 'trade_agreements',
      text: 'Negotiate new trade agreements',
      type: 'policy',
      urgency: 'medium',
      reward: { economy: 0.4 },
      penalty: { economy: -0.2 }
    },
    {
      id: 'lower_tariffs',
      text: 'Reduce tariffs on imports',
      type: 'reform',
      urgency: 'low',
      reward: { economy: 0.3 },
      penalty: { economy: -0.2 }
    }
  ],
  clerical: [
    {
      id: 'church_authority',
      text: 'Strengthen church authority',
      type: 'policy',
      urgency: 'medium',
      reward: { stability: 0.3 },
      penalty: { innovation: -0.2 }
    },
    {
      id: 'religious_education',
      text: 'Expand religious education',
      type: 'policy',
      urgency: 'low',
      reward: { stability: 0.2 },
      penalty: { innovation: -0.1 }
    }
  ],
  nationalist: [
    {
      id: 'national_pride',
      text: 'Promote national identity',
      type: 'policy',
      urgency: 'medium',
      reward: { prestige: 0.3, military: 0.2 },
      penalty: { prestige: -0.2 }
    },
    {
      id: 'reclaim_territory',
      text: 'Reclaim our rightful territory',
      type: 'war',
      urgency: 'high',
      reward: { prestige: 0.4 },
      penalty: { prestige: -0.3, stability: -0.2 }
    }
  ]
};

// Actions player can take with factions
export const FACTION_ACTIONS: FactionAction[] = [
  {
    id: 'grant_privileges',
    name: 'Grant Privileges',
    description: 'Give special rights to increase happiness',
    cost: 30,
    effect: (f) => ({ happiness: Math.min(100, f.happiness + 15) }),
    cooldown: 5
  },
  {
    id: 'appoint_leader',
    name: 'Appoint Faction Leader',
    description: 'Give them a position of power',
    cost: 50,
    effect: (f) => ({ happiness: Math.min(100, f.happiness + 20), influence: Math.min(100, f.influence + 5) }),
    cooldown: 10
  },
  {
    id: 'suppress',
    name: 'Suppress Faction',
    description: 'Reduce their influence through force',
    cost: 40,
    effect: (f) => ({ influence: Math.max(0, f.influence - 15), happiness: Math.max(0, f.happiness - 20) }),
    cooldown: 8
  },
  {
    id: 'propaganda',
    name: 'Propaganda Campaign',
    description: 'Shift public opinion against them',
    cost: 25,
    effect: (f) => ({ influence: Math.max(0, f.influence - 10) }),
    cooldown: 5
  },
  {
    id: 'negotiate',
    name: 'Negotiate',
    description: 'Address some of their concerns',
    cost: 20,
    effect: (f) => ({ happiness: Math.min(100, f.happiness + 10) }),
    cooldown: 3
  }
];

// Calculate total faction effects on nation
export function calculateFactionEffects(factions: Faction[]): Partial<NationStats> {
  const effects: Partial<NationStats> = {};

  for (const faction of factions) {
    const weight = faction.influence / 100;
    const mods = faction.happiness >= 50
      ? faction.bonusesWhenHappy
      : faction.penaltiesWhenUnhappy;

    for (const [stat, value] of Object.entries(mods)) {
      const key = stat as keyof NationStats;
      effects[key] = (effects[key] || 0) + value * weight;
    }
  }

  return effects;
}

// Check for rebellion risk
export function getRevoltRisk(factions: Faction[]): number {
  let risk = 0;

  for (const faction of factions) {
    if (faction.happiness < 30 && faction.influence > 20) {
      risk += (30 - faction.happiness) * (faction.influence / 100);
    }
  }

  return Math.min(100, risk);
}

// Generate random demand for faction
export function generateDemand(faction: Faction): FactionDemand | null {
  const demands = FACTION_DEMANDS[faction.ideology];
  if (!demands || demands.length === 0) return null;

  const demand = demands[Math.floor(Math.random() * demands.length)];
  return {
    ...demand,
    expires: 5 + Math.floor(Math.random() * 5)
  };
}

// Update faction happiness based on player actions
export function updateFactionHappiness(
  faction: Faction,
  action: string,
  year: number
): number {
  let change = 0;

  // Example action impacts
  switch (action) {
    case 'declare_war':
      if (faction.ideology === 'militarist') change = 10;
      else if (faction.ideology === 'mercantile') change = -10;
      break;
    case 'sign_treaty':
      if (faction.ideology === 'militarist') change = -5;
      else change = 5;
      break;
    case 'pass_reform':
      if (faction.ideology === 'liberal') change = 15;
      else if (faction.ideology === 'conservative') change = -10;
      break;
    case 'raise_taxes':
      if (faction.ideology === 'mercantile') change = -15;
      else if (faction.id === 'peasantry') change = -20;
      break;
    case 'lower_taxes':
      if (faction.ideology === 'mercantile') change = 10;
      else if (faction.id === 'peasantry') change = 15;
      break;
  }

  return Math.max(0, Math.min(100, faction.happiness + change));
}

export default {
  DEFAULT_FACTIONS,
  FACTION_DEMANDS,
  FACTION_ACTIONS,
  calculateFactionEffects,
  getRevoltRisk,
  generateDemand,
  updateFactionHappiness
};
