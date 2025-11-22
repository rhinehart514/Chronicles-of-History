// Disaster and crisis system

export interface Disaster {
  id: string;
  name: string;
  icon: string;
  description: string;
  triggerConditions: DisasterCondition[];
  progressRate: number;
  effects: DisasterEffect[];
  endConditions: DisasterCondition[];
  events: string[];
  rewards?: DisasterReward[];
}

export interface DisasterCondition {
  type: string;
  value: number | string | boolean;
  operator?: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
}

export interface DisasterEffect {
  type: string;
  value: number;
}

export interface DisasterReward {
  type: string;
  value: number;
  description: string;
}

export interface ActiveDisaster {
  disasterId: string;
  progress: number;
  isActive: boolean;
  startDate?: string;
  ticksActive: number;
}

// All disasters
export const DISASTERS: Disaster[] = [
  {
    id: 'peasant_war',
    name: 'Peasant War',
    icon: '🔱',
    description: 'The peasants are rising up against their oppressors! Mass rebellion threatens to tear the nation apart.',
    triggerConditions: [
      { type: 'stability', value: 0, operator: 'lt' },
      { type: 'war_exhaustion', value: 5, operator: 'gt' },
      { type: 'unrest_provinces', value: 3, operator: 'gte' }
    ],
    progressRate: 2,
    effects: [
      { type: 'national_unrest', value: 10 },
      { type: 'stability_cost', value: 50 },
      { type: 'manpower_recovery', value: -50 }
    ],
    endConditions: [
      { type: 'stability', value: 1, operator: 'gte' },
      { type: 'active_rebels', value: 0 }
    ],
    events: ['peasant_leader_emerges', 'city_sacked', 'noble_murdered'],
    rewards: [
      { type: 'stability', value: 1, description: 'Restored order' },
      { type: 'prestige', value: 10, description: 'Authority reaffirmed' }
    ]
  },
  {
    id: 'civil_war',
    name: 'Civil War',
    icon: '⚔️',
    description: 'The nation is split! Rival factions fight for control of the government.',
    triggerConditions: [
      { type: 'legitimacy', value: 50, operator: 'lt' },
      { type: 'stability', value: -1, operator: 'lt' },
      { type: 'pretender_rebels', value: true }
    ],
    progressRate: 3,
    effects: [
      { type: 'national_unrest', value: 15 },
      { type: 'discipline', value: -10 },
      { type: 'tax_income', value: -33 }
    ],
    endConditions: [
      { type: 'legitimacy', value: 90, operator: 'gte' },
      { type: 'stability', value: 0, operator: 'gte' }
    ],
    events: ['rival_claimant', 'foreign_intervention', 'battle_of_succession'],
    rewards: [
      { type: 'legitimacy', value: 50, description: 'Undisputed rule' },
      { type: 'stability', value: 2, description: 'Peace restored' }
    ]
  },
  {
    id: 'religious_turmoil',
    name: 'Religious Turmoil',
    icon: '⛪',
    description: 'Religious divisions threaten to tear the nation apart as different faiths clash.',
    triggerConditions: [
      { type: 'religious_unity', value: 0.5, operator: 'lt' },
      { type: 'tolerance_heretic', value: -1, operator: 'lt' }
    ],
    progressRate: 2,
    effects: [
      { type: 'national_unrest', value: 5 },
      { type: 'missionary_strength', value: -3 },
      { type: 'tolerance_own', value: -2 }
    ],
    endConditions: [
      { type: 'religious_unity', value: 0.75, operator: 'gte' }
    ],
    events: ['heretic_burning', 'religious_war', 'convert_or_die'],
    rewards: [
      { type: 'papal_influence', value: 50, description: 'Religious authority' }
    ]
  },
  {
    id: 'corruption_crisis',
    name: 'Corruption Crisis',
    icon: '💸',
    description: 'Corruption has become endemic! Officials line their pockets while the state crumbles.',
    triggerConditions: [
      { type: 'corruption', value: 50, operator: 'gt' },
      { type: 'overextension', value: 50, operator: 'gt' }
    ],
    progressRate: 1.5,
    effects: [
      { type: 'all_power_costs', value: 25 },
      { type: 'advisor_cost', value: 50 },
      { type: 'global_unrest', value: 3 }
    ],
    endConditions: [
      { type: 'corruption', value: 10, operator: 'lt' }
    ],
    events: ['corrupt_official', 'bribery_scandal', 'treasury_theft'],
    rewards: [
      { type: 'corruption', value: -10, description: 'Clean government' }
    ]
  },
  {
    id: 'succession_crisis',
    name: 'Succession Crisis',
    icon: '👑',
    description: 'The succession is unclear! Multiple claimants vie for the throne.',
    triggerConditions: [
      { type: 'has_heir', value: false },
      { type: 'ruler_age', value: 50, operator: 'gt' }
    ],
    progressRate: 4,
    effects: [
      { type: 'legitimacy', value: -2 },
      { type: 'diplomatic_reputation', value: -3 },
      { type: 'ae_impact', value: 25 }
    ],
    endConditions: [
      { type: 'has_heir', value: true },
      { type: 'heir_claim', value: 60, operator: 'gte' }
    ],
    events: ['pretender_appears', 'noble_support', 'foreign_claim'],
    rewards: [
      { type: 'legitimacy', value: 25, description: 'Clear succession' }
    ]
  },
  {
    id: 'internal_conflict',
    name: 'Internal Conflicts',
    icon: '🏛️',
    description: 'Nobles and estates clash with royal authority, threatening stability.',
    triggerConditions: [
      { type: 'estate_influence_total', value: 200, operator: 'gt' },
      { type: 'stability', value: 1, operator: 'lt' }
    ],
    progressRate: 2,
    effects: [
      { type: 'global_autonomy', value: 0.1 },
      { type: 'stability_cost', value: 25 },
      { type: 'estate_loyalty', value: -10 }
    ],
    endConditions: [
      { type: 'estate_influence_total', value: 150, operator: 'lt' },
      { type: 'stability', value: 2, operator: 'gte' }
    ],
    events: ['noble_demand', 'estate_seizure', 'royal_decree'],
    rewards: [
      { type: 'absolutism', value: 10, description: 'Royal authority' }
    ]
  },
  {
    id: 'court_intrigue',
    name: 'Court and Country',
    icon: '🎭',
    description: 'Court factions scheme against each other, paralyzing government.',
    triggerConditions: [
      { type: 'absolutism', value: 50, operator: 'lt' },
      { type: 'admin_tech', value: 20, operator: 'gte' }
    ],
    progressRate: 1,
    effects: [
      { type: 'global_unrest', value: 5 },
      { type: 'autonomy_change', value: 0.1 },
      { type: 'institution_spread', value: -25 }
    ],
    endConditions: [
      { type: 'absolutism', value: 65, operator: 'gte' }
    ],
    events: ['faction_leader', 'court_plot', 'reform_demand'],
    rewards: [
      { type: 'max_absolutism', value: 20, description: 'Absolute power' },
      { type: 'stability', value: 3, description: 'Complete control' }
    ]
  },
  {
    id: 'revolution',
    name: 'Revolution',
    icon: '🔥',
    description: 'Revolutionary fervor sweeps the nation! The old order is under attack.',
    triggerConditions: [
      { type: 'year', value: 1750, operator: 'gte' },
      { type: 'stability', value: 0, operator: 'lt' },
      { type: 'war_exhaustion', value: 8, operator: 'gt' }
    ],
    progressRate: 3,
    effects: [
      { type: 'national_unrest', value: 20 },
      { type: 'legitimacy', value: -5 },
      { type: 'republican_tradition', value: -5 }
    ],
    endConditions: [
      { type: 'is_revolutionary', value: true }
    ],
    events: ['storming', 'declaration_rights', 'terror'],
    rewards: [
      { type: 'revolutionary_target', value: 1, description: 'Revolutionary state' }
    ]
  }
];

// Get disaster by id
export function getDisaster(id: string): Disaster | undefined {
  return DISASTERS.find(d => d.id === id);
}

// Check if disaster can trigger
export function canDisasterTrigger(
  disaster: Disaster,
  gameState: Record<string, any>
): boolean {
  for (const condition of disaster.triggerConditions) {
    const value = gameState[condition.type];
    if (value === undefined) return false;

    switch (condition.operator) {
      case 'gt':
        if (value <= condition.value) return false;
        break;
      case 'lt':
        if (value >= condition.value) return false;
        break;
      case 'gte':
        if (value < condition.value) return false;
        break;
      case 'lte':
        if (value > condition.value) return false;
        break;
      default:
        if (value !== condition.value) return false;
    }
  }
  return true;
}

// Check if disaster can end
export function canDisasterEnd(
  disaster: Disaster,
  gameState: Record<string, any>
): boolean {
  for (const condition of disaster.endConditions) {
    const value = gameState[condition.type];
    if (value === undefined) continue;

    let met = false;
    switch (condition.operator) {
      case 'gt':
        met = value > condition.value;
        break;
      case 'lt':
        met = value < condition.value;
        break;
      case 'gte':
        met = value >= condition.value;
        break;
      case 'lte':
        met = value <= condition.value;
        break;
      default:
        met = value === condition.value;
    }
    if (met) return true;
  }
  return false;
}

// Calculate disaster progress
export function updateDisasterProgress(
  active: ActiveDisaster,
  canTrigger: boolean
): number {
  const disaster = getDisaster(active.disasterId);
  if (!disaster) return active.progress;

  if (active.isActive) {
    return 100; // Already active
  }

  if (canTrigger) {
    return Math.min(100, active.progress + disaster.progressRate);
  } else {
    return Math.max(0, active.progress - 1);
  }
}

// Get disaster severity
export function getDisasterSeverity(progress: number): string {
  if (progress >= 100) return 'Active';
  if (progress >= 75) return 'Imminent';
  if (progress >= 50) return 'Growing';
  if (progress >= 25) return 'Brewing';
  return 'Dormant';
}

// Get severity color
export function getSeverityColor(progress: number): string {
  if (progress >= 100) return 'text-red-500';
  if (progress >= 75) return 'text-red-400';
  if (progress >= 50) return 'text-orange-400';
  if (progress >= 25) return 'text-amber-400';
  return 'text-stone-400';
}

export default {
  DISASTERS,
  getDisaster,
  canDisasterTrigger,
  canDisasterEnd,
  updateDisasterProgress,
  getDisasterSeverity,
  getSeverityColor
};
