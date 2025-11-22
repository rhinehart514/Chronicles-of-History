// Cultural influence and soft power system

import { NationStats } from '../types';

export interface CulturalInfluence {
  nationId: string;
  influence: number; // 0-100
  trend: 'rising' | 'stable' | 'falling';
  dominantCulture: boolean;
}

export interface CulturalProject {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: ProjectType;
  cost: number;
  duration: number;
  prestige: number;
  influenceGain: number;
  requirements?: {
    techs?: string[];
    minPrestige?: number;
    minInnovation?: number;
  };
  bonuses?: Partial<NationStats>;
}

export type ProjectType = 'monument' | 'institution' | 'arts' | 'science' | 'event';

// Cultural projects
export const CULTURAL_PROJECTS: CulturalProject[] = [
  // Monuments
  {
    id: 'grand_palace',
    name: 'Grand Palace',
    description: 'A magnificent royal residence that showcases national glory',
    icon: '🏰',
    type: 'monument',
    cost: 200,
    duration: 5,
    prestige: 30,
    influenceGain: 15,
    bonuses: { prestige: 0.3, stability: 0.1 }
  },
  {
    id: 'national_cathedral',
    name: 'National Cathedral',
    description: 'A grand religious center that inspires the faithful',
    icon: '⛪',
    type: 'monument',
    cost: 180,
    duration: 6,
    prestige: 25,
    influenceGain: 10,
    bonuses: { stability: 0.3 }
  },
  {
    id: 'triumphal_arch',
    name: 'Triumphal Arch',
    description: 'A monument to military victories',
    icon: '🏛️',
    type: 'monument',
    cost: 120,
    duration: 3,
    prestige: 20,
    influenceGain: 10,
    requirements: { minPrestige: 3 },
    bonuses: { military: 0.1, prestige: 0.2 }
  },

  // Institutions
  {
    id: 'national_university',
    name: 'National University',
    description: 'Premier institution of higher learning',
    icon: '🎓',
    type: 'institution',
    cost: 150,
    duration: 4,
    prestige: 20,
    influenceGain: 15,
    requirements: { minInnovation: 3 },
    bonuses: { innovation: 0.4 }
  },
  {
    id: 'national_museum',
    name: 'National Museum',
    description: 'Preserve and display cultural treasures',
    icon: '🏛️',
    type: 'institution',
    cost: 100,
    duration: 3,
    prestige: 15,
    influenceGain: 12,
    bonuses: { prestige: 0.2 }
  },
  {
    id: 'royal_academy',
    name: 'Royal Academy of Sciences',
    description: 'Advances scientific knowledge',
    icon: '🔬',
    type: 'institution',
    cost: 130,
    duration: 4,
    prestige: 18,
    influenceGain: 10,
    requirements: { techs: ['academies'] },
    bonuses: { innovation: 0.3, prestige: 0.1 }
  },

  // Arts
  {
    id: 'national_opera',
    name: 'National Opera House',
    description: 'Center for performing arts',
    icon: '🎭',
    type: 'arts',
    cost: 120,
    duration: 3,
    prestige: 15,
    influenceGain: 12,
    bonuses: { prestige: 0.2 }
  },
  {
    id: 'art_patronage',
    name: 'Royal Art Patronage',
    description: 'Support artists and create masterworks',
    icon: '🎨',
    type: 'arts',
    cost: 80,
    duration: 2,
    prestige: 12,
    influenceGain: 8,
    bonuses: { prestige: 0.15 }
  },
  {
    id: 'literary_salon',
    name: 'Literary Salon',
    description: 'Gathering place for intellectuals',
    icon: '📚',
    type: 'arts',
    cost: 50,
    duration: 2,
    prestige: 8,
    influenceGain: 6,
    bonuses: { innovation: 0.1, prestige: 0.1 }
  },

  // Events
  {
    id: 'world_fair',
    name: 'World Fair',
    description: 'International exhibition of achievements',
    icon: '🎪',
    type: 'event',
    cost: 250,
    duration: 1,
    prestige: 40,
    influenceGain: 25,
    requirements: { minPrestige: 4 },
    bonuses: { economy: 0.3, prestige: 0.4, innovation: 0.2 }
  },
  {
    id: 'coronation',
    name: 'Grand Coronation',
    description: 'Lavish ceremony for new ruler',
    icon: '👑',
    type: 'event',
    cost: 100,
    duration: 1,
    prestige: 20,
    influenceGain: 15,
    bonuses: { stability: 0.2, prestige: 0.3 }
  },
  {
    id: 'royal_wedding',
    name: 'Royal Wedding',
    description: 'Celebration of dynastic union',
    icon: '💒',
    type: 'event',
    cost: 80,
    duration: 1,
    prestige: 15,
    influenceGain: 10,
    bonuses: { stability: 0.1, prestige: 0.2 }
  }
];

// Calculate cultural influence over other nations
export function calculateCulturalInfluence(
  prestige: number,
  innovation: number,
  projects: string[],
  tradRoutes: number
): number {
  let influence = 0;

  // Base from prestige
  influence += prestige * 10;

  // Innovation bonus
  influence += innovation * 5;

  // Completed projects
  for (const projectId of projects) {
    const project = CULTURAL_PROJECTS.find(p => p.id === projectId);
    if (project) {
      influence += project.influenceGain;
    }
  }

  // Trade connections spread culture
  influence += tradRoutes * 3;

  return Math.min(100, influence);
}

// Get cultural spread to specific nation
export function getCulturalSpread(
  sourceInfluence: number,
  distance: number,
  relations: number,
  targetOpenness: number
): number {
  let spread = sourceInfluence;

  // Distance penalty
  spread *= Math.max(0.2, 1 - distance * 0.1);

  // Relations bonus/penalty
  spread *= 1 + (relations / 200);

  // Target openness (affected by their innovation)
  spread *= 0.5 + (targetOpenness / 10);

  return Math.max(0, Math.min(100, spread));
}

// Effects of cultural dominance
export function getCulturalDominanceEffects(
  dominanceLevel: number
): { stats: Partial<NationStats>; special: string[] } {
  const effects: { stats: Partial<NationStats>; special: string[] } = {
    stats: {},
    special: []
  };

  if (dominanceLevel >= 80) {
    effects.stats = { prestige: 0.5, stability: 0.2, economy: 0.2 };
    effects.special = [
      'Cultural hegemon',
      '+Diplomatic influence',
      '+Immigration',
      'Language spreading'
    ];
  } else if (dominanceLevel >= 60) {
    effects.stats = { prestige: 0.3, stability: 0.1 };
    effects.special = [
      'Major cultural power',
      '+Diplomatic weight'
    ];
  } else if (dominanceLevel >= 40) {
    effects.stats = { prestige: 0.2 };
    effects.special = ['Regional cultural influence'];
  }

  return effects;
}

// Check if project can be started
export function canStartProject(
  project: CulturalProject,
  treasury: number,
  researchedTechs: string[],
  prestige: number,
  innovation: number
): { canStart: boolean; reason?: string } {
  if (treasury < project.cost) {
    return { canStart: false, reason: `Need ${project.cost} gold` };
  }

  if (project.requirements) {
    if (project.requirements.techs) {
      const missing = project.requirements.techs.filter(t => !researchedTechs.includes(t));
      if (missing.length > 0) {
        return { canStart: false, reason: `Missing tech: ${missing.join(', ')}` };
      }
    }

    if (project.requirements.minPrestige && prestige < project.requirements.minPrestige) {
      return { canStart: false, reason: `Need ${project.requirements.minPrestige} prestige` };
    }

    if (project.requirements.minInnovation && innovation < project.requirements.minInnovation) {
      return { canStart: false, reason: `Need ${project.requirements.minInnovation} innovation` };
    }
  }

  return { canStart: true };
}

// Get available projects
export function getAvailableProjects(
  completedProjects: string[],
  treasury: number,
  researchedTechs: string[],
  prestige: number,
  innovation: number
): CulturalProject[] {
  return CULTURAL_PROJECTS.filter(project => {
    if (completedProjects.includes(project.id)) return false;
    const check = canStartProject(project, treasury, researchedTechs, prestige, innovation);
    return check.canStart;
  });
}

export default {
  CULTURAL_PROJECTS,
  calculateCulturalInfluence,
  getCulturalSpread,
  getCulturalDominanceEffects,
  canStartProject,
  getAvailableProjects
};
