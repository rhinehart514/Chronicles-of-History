// Espionage and intelligence operations

import { NationStats } from '../types';

export interface SpyNetwork {
  nationId: string;
  strength: number; // 0-100
  discovered: boolean;
  missions: Mission[];
}

export interface Mission {
  id: string;
  type: MissionType;
  targetNationId: string;
  status: 'planning' | 'active' | 'completed' | 'failed' | 'discovered';
  progress: number; // 0-100
  duration: number; // turns
  turnsRemaining: number;
  successChance: number;
  reward?: MissionReward;
}

export type MissionType =
  | 'gather_intelligence'
  | 'steal_technology'
  | 'sabotage_economy'
  | 'sabotage_military'
  | 'assassinate_leader'
  | 'incite_rebellion'
  | 'forge_documents'
  | 'counter_espionage';

export interface MissionReward {
  stats?: Partial<NationStats>;
  intelligence?: string;
  technology?: string;
  special?: string;
}

export interface MissionTemplate {
  type: MissionType;
  name: string;
  description: string;
  icon: string;
  baseCost: number;
  baseDuration: number;
  baseSuccessRate: number;
  riskLevel: 'low' | 'medium' | 'high' | 'extreme';
  requirements?: {
    networkStrength?: number;
    stats?: Partial<NationStats>;
  };
  effects: {
    onSuccess: (target: string) => MissionReward;
    onFailure: Partial<NationStats>;
    onDiscovery: { diplomatic: number; prestige: number };
  };
}

// Mission definitions
export const MISSION_TEMPLATES: Record<MissionType, MissionTemplate> = {
  gather_intelligence: {
    type: 'gather_intelligence',
    name: 'Gather Intelligence',
    description: 'Learn about enemy military strength and plans',
    icon: '🔍',
    baseCost: 20,
    baseDuration: 2,
    baseSuccessRate: 80,
    riskLevel: 'low',
    effects: {
      onSuccess: (target) => ({
        intelligence: `Detailed report on ${target}'s military disposition`
      }),
      onFailure: {},
      onDiscovery: { diplomatic: -5, prestige: -2 }
    }
  },
  steal_technology: {
    type: 'steal_technology',
    name: 'Steal Technology',
    description: 'Acquire enemy technological secrets',
    icon: '📜',
    baseCost: 50,
    baseDuration: 4,
    baseSuccessRate: 50,
    riskLevel: 'medium',
    requirements: { networkStrength: 30 },
    effects: {
      onSuccess: (target) => ({
        stats: { innovation: 0.3 },
        technology: 'Stolen research data'
      }),
      onFailure: {},
      onDiscovery: { diplomatic: -15, prestige: -10 }
    }
  },
  sabotage_economy: {
    type: 'sabotage_economy',
    name: 'Economic Sabotage',
    description: 'Disrupt enemy trade and production',
    icon: '💣',
    baseCost: 40,
    baseDuration: 3,
    baseSuccessRate: 60,
    riskLevel: 'medium',
    requirements: { networkStrength: 25 },
    effects: {
      onSuccess: () => ({
        special: 'Target economy disrupted for 3 turns'
      }),
      onFailure: {},
      onDiscovery: { diplomatic: -20, prestige: -5 }
    }
  },
  sabotage_military: {
    type: 'sabotage_military',
    name: 'Military Sabotage',
    description: 'Damage enemy military capabilities',
    icon: '⚔️',
    baseCost: 60,
    baseDuration: 4,
    baseSuccessRate: 50,
    riskLevel: 'high',
    requirements: { networkStrength: 40 },
    effects: {
      onSuccess: () => ({
        special: 'Target military weakened for 5 turns'
      }),
      onFailure: {},
      onDiscovery: { diplomatic: -30, prestige: -10 }
    }
  },
  assassinate_leader: {
    type: 'assassinate_leader',
    name: 'Assassination',
    description: 'Eliminate enemy leadership',
    icon: '🗡️',
    baseCost: 100,
    baseDuration: 6,
    baseSuccessRate: 30,
    riskLevel: 'extreme',
    requirements: { networkStrength: 60 },
    effects: {
      onSuccess: () => ({
        special: 'Target nation in succession crisis'
      }),
      onFailure: { prestige: -5 },
      onDiscovery: { diplomatic: -50, prestige: -30 }
    }
  },
  incite_rebellion: {
    type: 'incite_rebellion',
    name: 'Incite Rebellion',
    description: 'Stir up unrest in enemy territory',
    icon: '🔥',
    baseCost: 70,
    baseDuration: 5,
    baseSuccessRate: 45,
    riskLevel: 'high',
    requirements: { networkStrength: 50 },
    effects: {
      onSuccess: () => ({
        special: 'Rebellion outbreak in target territory'
      }),
      onFailure: {},
      onDiscovery: { diplomatic: -40, prestige: -15 }
    }
  },
  forge_documents: {
    type: 'forge_documents',
    name: 'Forge Documents',
    description: 'Create fake evidence to damage reputation',
    icon: '📝',
    baseCost: 35,
    baseDuration: 3,
    baseSuccessRate: 65,
    riskLevel: 'medium',
    requirements: { networkStrength: 20 },
    effects: {
      onSuccess: () => ({
        special: 'Target prestige damaged'
      }),
      onFailure: {},
      onDiscovery: { diplomatic: -25, prestige: -20 }
    }
  },
  counter_espionage: {
    type: 'counter_espionage',
    name: 'Counter-Espionage',
    description: 'Protect against enemy spies',
    icon: '🛡️',
    baseCost: 30,
    baseDuration: 3,
    baseSuccessRate: 70,
    riskLevel: 'low',
    effects: {
      onSuccess: () => ({
        special: 'Enemy spy network exposed',
        stats: { stability: 0.2 }
      }),
      onFailure: {},
      onDiscovery: { diplomatic: 0, prestige: 0 }
    }
  }
};

// Calculate mission success chance
export function calculateSuccessChance(
  mission: MissionTemplate,
  networkStrength: number,
  playerStats: NationStats,
  targetStrength: number
): number {
  let chance = mission.baseSuccessRate;

  // Network strength bonus
  chance += (networkStrength - 50) * 0.3;

  // Innovation bonus
  chance += (playerStats.innovation - 3) * 5;

  // Target difficulty
  chance -= targetStrength * 0.2;

  return Math.max(5, Math.min(95, chance));
}

// Start a new mission
export function startMission(
  type: MissionType,
  targetNationId: string,
  networkStrength: number,
  playerStats: NationStats
): Mission {
  const template = MISSION_TEMPLATES[type];

  return {
    id: `mission_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    type,
    targetNationId,
    status: 'active',
    progress: 0,
    duration: template.baseDuration,
    turnsRemaining: template.baseDuration,
    successChance: calculateSuccessChance(template, networkStrength, playerStats, 50)
  };
}

// Process mission progress each turn
export function processMission(mission: Mission): Mission {
  if (mission.status !== 'active') return mission;

  const updated = { ...mission };
  updated.turnsRemaining--;
  updated.progress = ((mission.duration - updated.turnsRemaining) / mission.duration) * 100;

  if (updated.turnsRemaining <= 0) {
    // Determine outcome
    const roll = Math.random() * 100;
    if (roll <= mission.successChance) {
      updated.status = 'completed';
      const template = MISSION_TEMPLATES[mission.type];
      updated.reward = template.effects.onSuccess(mission.targetNationId);
    } else if (roll <= mission.successChance + 20) {
      updated.status = 'failed';
    } else {
      updated.status = 'discovered';
    }
  }

  return updated;
}

// Build/strengthen spy network
export function buildNetwork(
  current: number,
  investment: number,
  innovation: number
): number {
  const gain = (investment / 10) * (1 + innovation * 0.1);
  return Math.min(100, current + gain);
}

// Get available missions based on network strength
export function getAvailableMissions(networkStrength: number): MissionTemplate[] {
  return Object.values(MISSION_TEMPLATES).filter(mission => {
    if (mission.requirements?.networkStrength) {
      return networkStrength >= mission.requirements.networkStrength;
    }
    return true;
  });
}

export default {
  MISSION_TEMPLATES,
  calculateSuccessChance,
  startMission,
  processMission,
  buildNetwork,
  getAvailableMissions
};
