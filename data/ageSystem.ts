// Historical ages and era progression system

export interface Age {
  id: string;
  name: string;
  icon: string;
  startYear: number;
  endYear: number;
  objectives: AgeObjective[];
  abilities: AgeAbility[];
  goldenEraSplendor: number;
  description: string;
}

export interface AgeObjective {
  id: string;
  name: string;
  description: string;
  splendorReward: number;
  condition: string;
}

export interface AgeAbility {
  id: string;
  name: string;
  icon: string;
  cost: number;
  effects: AgeEffect[];
  duration?: number;
  description: string;
}

export interface AgeEffect {
  type: string;
  value: number;
}

export interface GoldenEra {
  active: boolean;
  startDate?: string;
  duration: number;
  bonuses: AgeEffect[];
}

// Historical ages
export const AGES: Age[] = [
  {
    id: 'discovery',
    name: 'Age of Discovery',
    icon: '🧭',
    startYear: 1444,
    endYear: 1500,
    objectives: [
      {
        id: 'discover_new_world',
        name: 'Discover the New World',
        description: 'Have a colonial subject in the Americas',
        splendorReward: 300,
        condition: 'has_colonial_subject'
      },
      {
        id: 'large_army',
        name: 'Large Army',
        description: 'Have 100 regiments',
        splendorReward: 200,
        condition: 'army_size >= 100'
      },
      {
        id: 'high_development',
        name: 'High Development',
        description: 'Have 300 development',
        splendorReward: 200,
        condition: 'total_development >= 300'
      }
    ],
    abilities: [
      {
        id: 'transfer_subject',
        name: 'Transfer Subject',
        icon: '🤝',
        cost: 400,
        effects: [{ type: 'can_transfer_subject', value: 1 }],
        description: 'Transfer a subject nation to another overlord'
      },
      {
        id: 'feudal_ties',
        name: 'Feudal Ties',
        icon: '⚔️',
        cost: 200,
        effects: [{ type: 'diplomatic_annexation_cost', value: -25 }],
        duration: 25,
        description: 'Reduced cost to annex vassals'
      }
    ],
    goldenEraSplendor: 800,
    description: 'An era of exploration and colonial expansion.'
  },
  {
    id: 'reformation',
    name: 'Age of Reformation',
    icon: '✝️',
    startYear: 1500,
    endYear: 1600,
    objectives: [
      {
        id: 'religious_unity',
        name: 'Religious Unity',
        description: 'Have 90% religious unity',
        splendorReward: 300,
        condition: 'religious_unity >= 90'
      },
      {
        id: 'convert_center',
        name: 'Convert Center of Reformation',
        description: 'Convert a center of reformation',
        splendorReward: 200,
        condition: 'converted_center'
      },
      {
        id: 'strong_trade',
        name: 'Strong Trade',
        description: 'Have 25% trade income share globally',
        splendorReward: 200,
        condition: 'global_trade_share >= 25'
      }
    ],
    abilities: [
      {
        id: 'religious_wars',
        name: 'Religious Wars',
        icon: '🔥',
        cost: 400,
        effects: [{ type: 'cb_on_religious_enemies', value: 1 }],
        description: 'Gain casus belli on nations of different faith'
      },
      {
        id: 'loyal_subjects',
        name: 'Loyal Subjects',
        icon: '🛡️',
        cost: 200,
        effects: [{ type: 'liberty_desire', value: -15 }],
        duration: 25,
        description: 'Reduced liberty desire in subjects'
      }
    ],
    goldenEraSplendor: 800,
    description: 'Religious turmoil and reformation reshape the world.'
  },
  {
    id: 'absolutism',
    name: 'Age of Absolutism',
    icon: '👑',
    startYear: 1600,
    endYear: 1700,
    objectives: [
      {
        id: 'high_absolutism',
        name: 'High Absolutism',
        description: 'Have 80 absolutism',
        splendorReward: 300,
        condition: 'absolutism >= 80'
      },
      {
        id: 'large_empire',
        name: 'Large Empire',
        description: 'Have 1000 development',
        splendorReward: 200,
        condition: 'total_development >= 1000'
      },
      {
        id: 'court_culture',
        name: 'Court Culture',
        description: 'Have all level 3 advisors',
        splendorReward: 200,
        condition: 'all_advisors_level_3'
      }
    ],
    abilities: [
      {
        id: 'court_at_war',
        name: 'Court at War',
        icon: '⚔️',
        cost: 400,
        effects: [
          { type: 'war_exhaustion', value: -0.03 },
          { type: 'ae_impact', value: -10 }
        ],
        description: 'Reduced war exhaustion and aggressive expansion'
      },
      {
        id: 'state_propaganda',
        name: 'State Propaganda',
        icon: '📜',
        cost: 200,
        effects: [{ type: 'global_unrest', value: -3 }],
        duration: 25,
        description: 'Reduced global unrest'
      }
    ],
    goldenEraSplendor: 800,
    description: 'Powerful centralized monarchies dominate.'
  },
  {
    id: 'revolutions',
    name: 'Age of Revolutions',
    icon: '🗽',
    startYear: 1700,
    endYear: 1821,
    objectives: [
      {
        id: 'revolutionary',
        name: 'Embrace the Revolution',
        description: 'Have revolutionary government or crush revolution',
        splendorReward: 300,
        condition: 'is_revolutionary OR crushed_revolution'
      },
      {
        id: 'industrialization',
        name: 'Industrialization',
        description: 'Have level 5 production buildings in 20 provinces',
        splendorReward: 200,
        condition: 'manufactories >= 20'
      },
      {
        id: 'global_empire',
        name: 'Global Empire',
        description: 'Have colonies on 4 continents',
        splendorReward: 200,
        condition: 'colonial_continents >= 4'
      }
    ],
    abilities: [
      {
        id: 'liberty_or_death',
        name: 'Liberty or Death',
        icon: '🔥',
        cost: 400,
        effects: [
          { type: 'discipline', value: 5 },
          { type: 'morale', value: 10 }
        ],
        description: 'Increased discipline and morale'
      },
      {
        id: 'napoleonic_warfare',
        name: 'Napoleonic Warfare',
        icon: '🎖️',
        cost: 200,
        effects: [{ type: 'siege_ability', value: 25 }],
        duration: 25,
        description: 'Increased siege ability'
      }
    ],
    goldenEraSplendor: 800,
    description: 'Political and industrial revolutions transform society.'
  }
];

// Golden era bonuses
export const GOLDEN_ERA_BONUSES: AgeEffect[] = [
  { type: 'all_power_costs', value: -10 },
  { type: 'morale', value: 10 },
  { type: 'prestige', value: 0.5 },
  { type: 'max_absolutism', value: 5 }
];

// Get age by id
export function getAge(id: string): Age | undefined {
  return AGES.find(a => a.id === id);
}

// Get current age by year
export function getCurrentAge(year: number): Age | undefined {
  return AGES.find(a => year >= a.startYear && year < a.endYear);
}

// Check if objective is complete
export function isObjectiveComplete(
  objective: AgeObjective,
  gameState: Record<string, any>
): boolean {
  // Simplified check - in real implementation would evaluate condition
  return false;
}

// Calculate splendor
export function calculateSplendor(
  completedObjectives: string[],
  age: Age
): number {
  return age.objectives
    .filter(o => completedObjectives.includes(o.id))
    .reduce((sum, o) => sum + o.splendorReward, 0);
}

// Check if can trigger golden era
export function canTriggerGoldenEra(
  splendor: number,
  age: Age,
  hasUsed: boolean
): boolean {
  return splendor >= age.goldenEraSplendor && !hasUsed;
}

// Get ability cost
export function getAbilityCost(
  ability: AgeAbility,
  modifiers: number = 0
): number {
  return Math.floor(ability.cost * (1 + modifiers / 100));
}

export default {
  AGES,
  GOLDEN_ERA_BONUSES,
  getAge,
  getCurrentAge,
  isObjectiveComplete,
  calculateSplendor,
  canTriggerGoldenEra,
  getAbilityCost
};
