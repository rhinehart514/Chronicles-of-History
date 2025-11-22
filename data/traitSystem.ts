// Trait system for nations and leaders

import { NationStats } from '../types';

export interface Trait {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'nation' | 'leader' | 'both';
  category: 'military' | 'economy' | 'diplomacy' | 'government' | 'culture';
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  effects: {
    statModifiers?: Partial<Record<keyof NationStats, number>>;
    eventModifiers?: { eventType: string; probability: number }[];
    special?: string[];
  };
  incompatible?: string[]; // Trait IDs that can't coexist
  prerequisites?: string[]; // Required traits
}

export interface LeaderTrait extends Trait {
  type: 'leader' | 'both';
  ageRange?: { min: number; max: number };
}

export interface NationTrait extends Trait {
  type: 'nation' | 'both';
  historical?: boolean;
}

// Nation traits
export const NATION_TRAITS: NationTrait[] = [
  // Military traits
  {
    id: 'martial_tradition',
    name: 'Martial Tradition',
    description: 'A long history of military excellence',
    icon: '⚔️',
    type: 'nation',
    category: 'military',
    rarity: 'uncommon',
    effects: {
      statModifiers: { military: 0.5 },
      special: ['+10% Army morale', '+5% Battle tactics']
    }
  },
  {
    id: 'naval_power',
    name: 'Naval Power',
    description: 'Masters of the sea',
    icon: '⚓',
    type: 'nation',
    category: 'military',
    rarity: 'uncommon',
    effects: {
      statModifiers: { military: 0.3, economy: 0.2 },
      special: ['Naval dominance', '+20% Trade income']
    }
  },
  {
    id: 'defensive_terrain',
    name: 'Defensive Terrain',
    description: 'Geography favors defense',
    icon: '🏔️',
    type: 'nation',
    category: 'military',
    rarity: 'common',
    effects: {
      special: ['+25% Defensive bonus', '-10% Enemy attrition']
    }
  },

  // Economy traits
  {
    id: 'trade_hub',
    name: 'Trade Hub',
    description: 'A crossroads of commerce',
    icon: '🏪',
    type: 'nation',
    category: 'economy',
    rarity: 'uncommon',
    effects: {
      statModifiers: { economy: 0.5 },
      special: ['+30% Trade income', 'Extra trade route']
    }
  },
  {
    id: 'rich_resources',
    name: 'Rich Resources',
    description: 'Abundant natural wealth',
    icon: '💎',
    type: 'nation',
    category: 'economy',
    rarity: 'rare',
    effects: {
      statModifiers: { economy: 0.5 },
      special: ['+20% Resource production']
    }
  },
  {
    id: 'agrarian_society',
    name: 'Agrarian Society',
    description: 'Fertile lands and skilled farmers',
    icon: '🌾',
    type: 'nation',
    category: 'economy',
    rarity: 'common',
    effects: {
      statModifiers: { stability: 0.3 },
      special: ['+25% Food production', '-Famine chance']
    }
  },

  // Government traits
  {
    id: 'centralized',
    name: 'Centralized State',
    description: 'Strong central authority',
    icon: '👑',
    type: 'nation',
    category: 'government',
    rarity: 'common',
    effects: {
      statModifiers: { stability: 0.3 },
      special: ['+Tax efficiency', '-Local autonomy']
    },
    incompatible: ['decentralized']
  },
  {
    id: 'decentralized',
    name: 'Decentralized',
    description: 'Power shared among regions',
    icon: '🏛️',
    type: 'nation',
    category: 'government',
    rarity: 'common',
    effects: {
      statModifiers: { stability: -0.2, innovation: 0.3 },
      special: ['-Revolt risk', '+Regional diversity']
    },
    incompatible: ['centralized']
  },

  // Culture traits
  {
    id: 'enlightened',
    name: 'Enlightened Society',
    description: 'Values reason and progress',
    icon: '💡',
    type: 'nation',
    category: 'culture',
    rarity: 'rare',
    effects: {
      statModifiers: { innovation: 0.5, prestige: 0.3 },
      special: ['+Research speed', '-Religious unrest']
    }
  },
  {
    id: 'traditional',
    name: 'Traditional Values',
    description: 'Rooted in ancient customs',
    icon: '📜',
    type: 'nation',
    category: 'culture',
    rarity: 'common',
    effects: {
      statModifiers: { stability: 0.3, innovation: -0.2 },
      special: ['+Religious unity', '-Reform acceptance']
    },
    incompatible: ['enlightened']
  },

  // Diplomacy traits
  {
    id: 'diplomatic_tradition',
    name: 'Diplomatic Tradition',
    description: 'Skilled in the art of diplomacy',
    icon: '🤝',
    type: 'nation',
    category: 'diplomacy',
    rarity: 'uncommon',
    effects: {
      statModifiers: { prestige: 0.3 },
      special: ['+Diplomatic reputation', '+1 Diplomat', '-War exhaustion']
    }
  },
  {
    id: 'isolationist',
    name: 'Isolationist',
    description: 'Prefers internal focus',
    icon: '🏝️',
    type: 'nation',
    category: 'diplomacy',
    rarity: 'common',
    effects: {
      statModifiers: { stability: 0.2 },
      special: ['-Foreign influence', '-Alliance formation']
    }
  }
];

// Leader traits
export const LEADER_TRAITS: LeaderTrait[] = [
  // Positive traits
  {
    id: 'genius',
    name: 'Genius',
    description: 'Exceptionally intelligent',
    icon: '🧠',
    type: 'leader',
    category: 'culture',
    rarity: 'legendary',
    effects: {
      statModifiers: { innovation: 0.5, prestige: 0.3 },
      special: ['+All skill points']
    }
  },
  {
    id: 'charismatic',
    name: 'Charismatic',
    description: 'Natural leader and speaker',
    icon: '✨',
    type: 'leader',
    category: 'government',
    rarity: 'uncommon',
    effects: {
      statModifiers: { stability: 0.3, prestige: 0.2 },
      special: ['+Faction approval', '-Revolt risk']
    }
  },
  {
    id: 'warrior_king',
    name: 'Warrior King',
    description: 'Leads from the front',
    icon: '⚔️',
    type: 'leader',
    category: 'military',
    rarity: 'rare',
    effects: {
      statModifiers: { military: 0.5 },
      special: ['+Battle bonus when leading', '+Army morale']
    }
  },
  {
    id: 'administrator',
    name: 'Administrator',
    description: 'Master of governance',
    icon: '📋',
    type: 'leader',
    category: 'government',
    rarity: 'uncommon',
    effects: {
      statModifiers: { economy: 0.3, stability: 0.2 },
      special: ['+Tax efficiency', '-Corruption']
    }
  },
  {
    id: 'patron_arts',
    name: 'Patron of Arts',
    description: 'Supports culture and learning',
    icon: '🎨',
    type: 'leader',
    category: 'culture',
    rarity: 'uncommon',
    effects: {
      statModifiers: { prestige: 0.5, innovation: 0.2 },
      special: ['+Cultural development']
    }
  },
  {
    id: 'just',
    name: 'Just',
    description: 'Fair and lawful ruler',
    icon: '⚖️',
    type: 'leader',
    category: 'government',
    rarity: 'uncommon',
    effects: {
      statModifiers: { stability: 0.5 },
      special: ['-Unrest', '+Tax compliance']
    }
  },

  // Negative traits
  {
    id: 'cruel',
    name: 'Cruel',
    description: 'Rules through fear',
    icon: '😈',
    type: 'leader',
    category: 'government',
    rarity: 'uncommon',
    effects: {
      statModifiers: { stability: -0.3 },
      special: ['-Revolt risk (short term)', '+Unrest (long term)']
    },
    incompatible: ['just']
  },
  {
    id: 'paranoid',
    name: 'Paranoid',
    description: 'Trusts no one',
    icon: '👁️',
    type: 'leader',
    category: 'government',
    rarity: 'common',
    effects: {
      statModifiers: { stability: -0.2 },
      special: ['-Advisor effectiveness', '+Plot discovery']
    }
  },
  {
    id: 'spendthrift',
    name: 'Spendthrift',
    description: 'Wasteful with resources',
    icon: '💸',
    type: 'leader',
    category: 'economy',
    rarity: 'common',
    effects: {
      statModifiers: { economy: -0.3, prestige: 0.2 },
      special: ['+Court costs', '-Treasury']
    }
  },
  {
    id: 'weak',
    name: 'Weak',
    description: 'Easily influenced',
    icon: '😰',
    type: 'leader',
    category: 'government',
    rarity: 'common',
    effects: {
      statModifiers: { stability: -0.3 },
      special: ['+Faction influence', '-Authority']
    }
  },
  {
    id: 'rash',
    name: 'Rash',
    description: 'Acts without thinking',
    icon: '⚡',
    type: 'leader',
    category: 'military',
    rarity: 'common',
    effects: {
      statModifiers: { military: 0.2, stability: -0.2 },
      special: ['+Attack bonus', '-Defense', '+Casualties']
    }
  }
];

// Utility functions
export function getTraitEffects(traits: Trait[]): Partial<NationStats> {
  const combined: Partial<NationStats> = {};

  for (const trait of traits) {
    if (trait.effects.statModifiers) {
      for (const [stat, value] of Object.entries(trait.effects.statModifiers)) {
        const key = stat as keyof NationStats;
        combined[key] = (combined[key] || 0) + value;
      }
    }
  }

  return combined;
}

export function areTraitsCompatible(traitIds: string[], allTraits: Trait[]): boolean {
  const traits = allTraits.filter(t => traitIds.includes(t.id));

  for (const trait of traits) {
    if (trait.incompatible) {
      for (const incompatId of trait.incompatible) {
        if (traitIds.includes(incompatId)) {
          return false;
        }
      }
    }
  }

  return true;
}

export function getRandomLeaderTraits(count: number = 2): LeaderTrait[] {
  const selected: LeaderTrait[] = [];
  const available = [...LEADER_TRAITS];

  while (selected.length < count && available.length > 0) {
    // Weight by rarity
    const weights = available.map(t => {
      switch (t.rarity) {
        case 'common': return 4;
        case 'uncommon': return 2;
        case 'rare': return 1;
        case 'legendary': return 0.2;
      }
    });

    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < available.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        const trait = available[i];

        // Check compatibility
        const traitIds = [...selected.map(t => t.id), trait.id];
        if (areTraitsCompatible(traitIds, LEADER_TRAITS)) {
          selected.push(trait);
        }

        available.splice(i, 1);
        break;
      }
    }
  }

  return selected;
}

export default {
  NATION_TRAITS,
  LEADER_TRAITS,
  getTraitEffects,
  areTraitsCompatible,
  getRandomLeaderTraits
};
