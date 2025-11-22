// Mission and objective system

export interface Mission {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: MissionCategory;
  requirements: MissionRequirement[];
  rewards: MissionReward[];
  duration?: number; // Optional time limit
  repeatable: boolean;
  prerequisites?: string[]; // Other missions that must be completed
}

export type MissionCategory = 'expansion' | 'military' | 'economic' | 'diplomatic' | 'cultural' | 'special';

export interface MissionRequirement {
  type: string;
  target: string | number;
  description: string;
}

export interface MissionReward {
  type: 'stat' | 'modifier' | 'unlock' | 'resource' | 'claim' | 'event';
  target: string;
  value: number | string;
  description: string;
}

export interface MissionProgress {
  missionId: string;
  requirements: { description: string; completed: boolean }[];
  claimed: boolean;
  startedAt?: number;
}

// Default missions
export const DEFAULT_MISSIONS: Mission[] = [
  // Expansion missions
  {
    id: 'first_conquest',
    name: 'First Conquest',
    description: 'Conquer your first province',
    icon: '🏴',
    category: 'expansion',
    requirements: [
      { type: 'provinces_conquered', target: 1, description: 'Conquer 1 province' }
    ],
    rewards: [
      { type: 'stat', target: 'prestige', value: 10, description: '+10 Prestige' },
      { type: 'resource', target: 'gold', value: 500, description: '+500 Gold' }
    ],
    repeatable: false
  },
  {
    id: 'expand_borders',
    name: 'Expand the Borders',
    description: 'Control 10 provinces',
    icon: '🗺️',
    category: 'expansion',
    requirements: [
      { type: 'total_provinces', target: 10, description: 'Control 10 provinces' }
    ],
    rewards: [
      { type: 'modifier', target: 'coring_cost', value: -10, description: '-10% Coring cost' },
      { type: 'stat', target: 'prestige', value: 20, description: '+20 Prestige' }
    ],
    repeatable: false,
    prerequisites: ['first_conquest']
  },
  {
    id: 'regional_power',
    name: 'Regional Power',
    description: 'Control 25 provinces',
    icon: '👑',
    category: 'expansion',
    requirements: [
      { type: 'total_provinces', target: 25, description: 'Control 25 provinces' }
    ],
    rewards: [
      { type: 'claim', target: 'neighbors', value: 'all', description: 'Claims on neighboring provinces' },
      { type: 'stat', target: 'prestige', value: 50, description: '+50 Prestige' }
    ],
    repeatable: false,
    prerequisites: ['expand_borders']
  },

  // Military missions
  {
    id: 'standing_army',
    name: 'Standing Army',
    description: 'Maintain an army of 10,000 troops',
    icon: '⚔️',
    category: 'military',
    requirements: [
      { type: 'army_size', target: 10000, description: 'Have 10,000 troops' }
    ],
    rewards: [
      { type: 'modifier', target: 'discipline', value: 5, description: '+5% Discipline' },
      { type: 'resource', target: 'manpower', value: 5000, description: '+5000 Manpower' }
    ],
    repeatable: false
  },
  {
    id: 'naval_power',
    name: 'Naval Power',
    description: 'Build a fleet of 20 ships',
    icon: '⚓',
    category: 'military',
    requirements: [
      { type: 'total_ships', target: 20, description: 'Have 20 ships' }
    ],
    rewards: [
      { type: 'modifier', target: 'naval_morale', value: 10, description: '+10% Naval morale' },
      { type: 'resource', target: 'sailors', value: 2000, description: '+2000 Sailors' }
    ],
    repeatable: false
  },
  {
    id: 'military_tradition',
    name: 'Military Tradition',
    description: 'Win 10 battles',
    icon: '🎖️',
    category: 'military',
    requirements: [
      { type: 'battles_won', target: 10, description: 'Win 10 battles' }
    ],
    rewards: [
      { type: 'modifier', target: 'army_tradition', value: 20, description: '+20 Army tradition' },
      { type: 'unlock', target: 'elite_units', value: 'true', description: 'Unlock elite units' }
    ],
    repeatable: false,
    prerequisites: ['standing_army']
  },

  // Economic missions
  {
    id: 'balanced_budget',
    name: 'Balanced Budget',
    description: 'Have a positive monthly income',
    icon: '💰',
    category: 'economic',
    requirements: [
      { type: 'monthly_income', target: 1, description: 'Positive monthly income' }
    ],
    rewards: [
      { type: 'resource', target: 'gold', value: 1000, description: '+1000 Gold' }
    ],
    repeatable: false
  },
  {
    id: 'trade_empire',
    name: 'Trading Empire',
    description: 'Control 5 trade routes',
    icon: '🚢',
    category: 'economic',
    requirements: [
      { type: 'trade_routes', target: 5, description: 'Control 5 trade routes' }
    ],
    rewards: [
      { type: 'modifier', target: 'trade_efficiency', value: 15, description: '+15% Trade efficiency' },
      { type: 'stat', target: 'economy', value: 0.5, description: '+0.5 Economy' }
    ],
    repeatable: false
  },
  {
    id: 'industrialization',
    name: 'Industrialization',
    description: 'Build 10 factories',
    icon: '🏭',
    category: 'economic',
    requirements: [
      { type: 'buildings', target: 10, description: 'Build 10 factories' }
    ],
    rewards: [
      { type: 'modifier', target: 'production', value: 20, description: '+20% Production' },
      { type: 'stat', target: 'innovation', value: 0.5, description: '+0.5 Innovation' }
    ],
    repeatable: false
  },

  // Diplomatic missions
  {
    id: 'first_alliance',
    name: 'Diplomatic Beginnings',
    description: 'Form your first alliance',
    icon: '🤝',
    category: 'diplomatic',
    requirements: [
      { type: 'alliances', target: 1, description: 'Have 1 ally' }
    ],
    rewards: [
      { type: 'modifier', target: 'diplomatic_reputation', value: 1, description: '+1 Diplomatic reputation' }
    ],
    repeatable: false
  },
  {
    id: 'great_alliance',
    name: 'Great Alliance',
    description: 'Have 3 allies simultaneously',
    icon: '🌐',
    category: 'diplomatic',
    requirements: [
      { type: 'alliances', target: 3, description: 'Have 3 allies' }
    ],
    rewards: [
      { type: 'modifier', target: 'ae_impact', value: -10, description: '-10% Aggressive expansion' },
      { type: 'stat', target: 'prestige', value: 30, description: '+30 Prestige' }
    ],
    repeatable: false,
    prerequisites: ['first_alliance']
  },
  {
    id: 'royal_connections',
    name: 'Royal Connections',
    description: 'Have 3 royal marriages',
    icon: '💒',
    category: 'diplomatic',
    requirements: [
      { type: 'royal_marriages', target: 3, description: 'Have 3 royal marriages' }
    ],
    rewards: [
      { type: 'modifier', target: 'legitimacy', value: 0.5, description: '+0.5 Yearly legitimacy' },
      { type: 'stat', target: 'stability', value: 0.5, description: '+0.5 Stability' }
    ],
    repeatable: false
  },

  // Cultural missions
  {
    id: 'patron_of_arts',
    name: 'Patron of the Arts',
    description: 'Complete a cultural project',
    icon: '🎨',
    category: 'cultural',
    requirements: [
      { type: 'cultural_projects', target: 1, description: 'Complete 1 cultural project' }
    ],
    rewards: [
      { type: 'stat', target: 'prestige', value: 20, description: '+20 Prestige' },
      { type: 'stat', target: 'innovation', value: 0.3, description: '+0.3 Innovation' }
    ],
    repeatable: false
  },
  {
    id: 'enlightened_nation',
    name: 'Enlightened Nation',
    description: 'Achieve 50% literacy',
    icon: '📚',
    category: 'cultural',
    requirements: [
      { type: 'literacy', target: 50, description: '50% literacy rate' }
    ],
    rewards: [
      { type: 'modifier', target: 'tech_cost', value: -10, description: '-10% Technology cost' },
      { type: 'stat', target: 'innovation', value: 1, description: '+1 Innovation' }
    ],
    repeatable: false
  },

  // Special missions
  {
    id: 'survive_decade',
    name: 'First Decade',
    description: 'Survive for 10 years',
    icon: '⏳',
    category: 'special',
    requirements: [
      { type: 'years_played', target: 10, description: 'Play for 10 years' }
    ],
    rewards: [
      { type: 'resource', target: 'gold', value: 2000, description: '+2000 Gold' },
      { type: 'stat', target: 'stability', value: 1, description: '+1 Stability' }
    ],
    repeatable: false
  },
  {
    id: 'great_power',
    name: 'Great Power',
    description: 'Become one of the great powers',
    icon: '🏆',
    category: 'special',
    requirements: [
      { type: 'great_power', target: 1, description: 'Rank in top 8 nations' }
    ],
    rewards: [
      { type: 'modifier', target: 'all_power', value: 10, description: '+10% All power gains' },
      { type: 'stat', target: 'prestige', value: 100, description: '+100 Prestige' }
    ],
    repeatable: false
  }
];

// Check if mission requirements are met
export function checkMissionRequirements(
  mission: Mission,
  gameStats: Record<string, number>
): boolean {
  return mission.requirements.every(req => {
    const value = gameStats[req.type];
    if (value === undefined) return false;
    return value >= (typeof req.target === 'number' ? req.target : 1);
  });
}

// Get missions by category
export function getMissionsByCategory(category: MissionCategory): Mission[] {
  return DEFAULT_MISSIONS.filter(m => m.category === category);
}

// Get available missions (not completed, prerequisites met)
export function getAvailableMissions(
  completedMissions: string[],
  progressMissions: string[]
): Mission[] {
  return DEFAULT_MISSIONS.filter(mission => {
    if (completedMissions.includes(mission.id)) return false;
    if (progressMissions.includes(mission.id)) return true;
    if (!mission.prerequisites) return true;
    return mission.prerequisites.every(prereq => completedMissions.includes(prereq));
  });
}

export default {
  DEFAULT_MISSIONS,
  checkMissionRequirements,
  getMissionsByCategory,
  getAvailableMissions
};
