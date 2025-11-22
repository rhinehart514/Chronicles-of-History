// Great projects and monuments system

export interface GreatProject {
  id: string;
  name: string;
  icon: string;
  description: string;
  type: ProjectType;
  buildTime: number; // months
  costs: ProjectCost[];
  levels: ProjectLevel[];
  requirements: ProjectRequirement[];
}

export type ProjectType = 'monument' | 'canal' | 'university' | 'religious' | 'military' | 'wonder';

export interface ProjectCost {
  type: 'gold' | 'manpower' | 'prestige';
  value: number;
}

export interface ProjectLevel {
  level: number;
  name: string;
  effects: ProjectEffect[];
  upgradeCost: number;
  upgradeTime: number;
}

export interface ProjectEffect {
  type: string;
  value: number;
  description: string;
  scope: 'province' | 'nation' | 'area';
}

export interface ProjectRequirement {
  type: 'tech' | 'religion' | 'culture' | 'development';
  value: string | number;
}

// Default great projects
export const GREAT_PROJECTS: GreatProject[] = [
  {
    id: 'pyramid',
    name: 'Great Pyramid',
    icon: '🔺',
    description: 'An ancient wonder of the world',
    type: 'wonder',
    buildTime: 120,
    costs: [
      { type: 'gold', value: 5000 },
      { type: 'manpower', value: 10000 }
    ],
    levels: [
      {
        level: 1,
        name: 'Restoration',
        effects: [
          { type: 'prestige', value: 0.5, description: '+0.5 Yearly prestige', scope: 'nation' },
          { type: 'local_development_cost', value: -5, description: '-5% Development cost', scope: 'province' }
        ],
        upgradeCost: 2000,
        upgradeTime: 24
      },
      {
        level: 2,
        name: 'Expanded Complex',
        effects: [
          { type: 'prestige', value: 1, description: '+1 Yearly prestige', scope: 'nation' },
          { type: 'local_tax', value: 25, description: '+25% Local tax', scope: 'province' }
        ],
        upgradeCost: 5000,
        upgradeTime: 48
      },
      {
        level: 3,
        name: 'World Wonder',
        effects: [
          { type: 'prestige', value: 2, description: '+2 Yearly prestige', scope: 'nation' },
          { type: 'legitimacy', value: 1, description: '+1 Yearly legitimacy', scope: 'nation' }
        ],
        upgradeCost: 10000,
        upgradeTime: 60
      }
    ],
    requirements: []
  },
  {
    id: 'grand_cathedral',
    name: 'Grand Cathedral',
    icon: '⛪',
    description: 'A magnificent religious structure',
    type: 'religious',
    buildTime: 60,
    costs: [
      { type: 'gold', value: 2000 },
      { type: 'prestige', value: 20 }
    ],
    levels: [
      {
        level: 1,
        name: 'Humble Cathedral',
        effects: [
          { type: 'local_missionary_strength', value: 2, description: '+2% Missionary strength', scope: 'province' },
          { type: 'tolerance_true', value: 0.5, description: '+0.5 Tolerance of true faith', scope: 'nation' }
        ],
        upgradeCost: 1000,
        upgradeTime: 24
      },
      {
        level: 2,
        name: 'Inspiring Cathedral',
        effects: [
          { type: 'local_missionary_strength', value: 3, description: '+3% Missionary strength', scope: 'province' },
          { type: 'papal_influence', value: 1, description: '+1 Yearly papal influence', scope: 'nation' }
        ],
        upgradeCost: 3000,
        upgradeTime: 36
      },
      {
        level: 3,
        name: 'Holy Cathedral',
        effects: [
          { type: 'local_missionary_strength', value: 5, description: '+5% Missionary strength', scope: 'province' },
          { type: 'stability_cost', value: -10, description: '-10% Stability cost', scope: 'nation' }
        ],
        upgradeCost: 5000,
        upgradeTime: 48
      }
    ],
    requirements: [
      { type: 'religion', value: 'christian' }
    ]
  },
  {
    id: 'fortress',
    name: 'Star Fortress',
    icon: '🏰',
    description: 'An impregnable military fortification',
    type: 'military',
    buildTime: 48,
    costs: [
      { type: 'gold', value: 3000 },
      { type: 'manpower', value: 5000 }
    ],
    levels: [
      {
        level: 1,
        name: 'Basic Fortification',
        effects: [
          { type: 'local_defensiveness', value: 15, description: '+15% Local defensiveness', scope: 'province' },
          { type: 'garrison_size', value: 25, description: '+25% Garrison size', scope: 'province' }
        ],
        upgradeCost: 1500,
        upgradeTime: 24
      },
      {
        level: 2,
        name: 'Advanced Fortification',
        effects: [
          { type: 'local_defensiveness', value: 25, description: '+25% Local defensiveness', scope: 'province' },
          { type: 'attrition', value: 1, description: '+1 Attrition to enemies', scope: 'province' }
        ],
        upgradeCost: 3000,
        upgradeTime: 36
      },
      {
        level: 3,
        name: 'Impregnable Fortress',
        effects: [
          { type: 'local_defensiveness', value: 50, description: '+50% Local defensiveness', scope: 'province' },
          { type: 'fort_maintenance', value: -20, description: '-20% Fort maintenance', scope: 'nation' }
        ],
        upgradeCost: 6000,
        upgradeTime: 48
      }
    ],
    requirements: [
      { type: 'tech', value: 12 }
    ]
  },
  {
    id: 'university',
    name: 'Grand University',
    icon: '🏛️',
    description: 'A center of learning and innovation',
    type: 'university',
    buildTime: 36,
    costs: [
      { type: 'gold', value: 1500 },
      { type: 'prestige', value: 10 }
    ],
    levels: [
      {
        level: 1,
        name: 'Academy',
        effects: [
          { type: 'local_institution_spread', value: 25, description: '+25% Institution spread', scope: 'province' },
          { type: 'advisor_cost', value: -5, description: '-5% Advisor cost', scope: 'nation' }
        ],
        upgradeCost: 800,
        upgradeTime: 18
      },
      {
        level: 2,
        name: 'Renowned University',
        effects: [
          { type: 'local_institution_spread', value: 50, description: '+50% Institution spread', scope: 'province' },
          { type: 'technology_cost', value: -5, description: '-5% Technology cost', scope: 'nation' }
        ],
        upgradeCost: 2000,
        upgradeTime: 30
      },
      {
        level: 3,
        name: 'Prestigious University',
        effects: [
          { type: 'local_institution_spread', value: 100, description: '+100% Institution spread', scope: 'province' },
          { type: 'idea_cost', value: -10, description: '-10% Idea cost', scope: 'nation' }
        ],
        upgradeCost: 4000,
        upgradeTime: 42
      }
    ],
    requirements: [
      { type: 'tech', value: 15 },
      { type: 'development', value: 20 }
    ]
  },
  {
    id: 'canal',
    name: 'Grand Canal',
    icon: '🌊',
    description: 'A massive waterway connecting regions',
    type: 'canal',
    buildTime: 180,
    costs: [
      { type: 'gold', value: 10000 },
      { type: 'manpower', value: 20000 }
    ],
    levels: [
      {
        level: 1,
        name: 'Basic Canal',
        effects: [
          { type: 'trade_value', value: 25, description: '+25% Local trade value', scope: 'province' },
          { type: 'trade_steering', value: 10, description: '+10% Trade steering', scope: 'area' }
        ],
        upgradeCost: 5000,
        upgradeTime: 60
      },
      {
        level: 2,
        name: 'Improved Canal',
        effects: [
          { type: 'trade_value', value: 50, description: '+50% Local trade value', scope: 'province' },
          { type: 'naval_forcelimit', value: 5, description: '+5 Naval force limit', scope: 'nation' }
        ],
        upgradeCost: 10000,
        upgradeTime: 90
      },
      {
        level: 3,
        name: 'Grand Canal',
        effects: [
          { type: 'trade_value', value: 100, description: '+100% Local trade value', scope: 'province' },
          { type: 'global_trade_power', value: 10, description: '+10% Global trade power', scope: 'nation' }
        ],
        upgradeCost: 20000,
        upgradeTime: 120
      }
    ],
    requirements: [
      { type: 'tech', value: 20 }
    ]
  },
  {
    id: 'palace',
    name: 'Royal Palace',
    icon: '👑',
    description: 'A grand residence for royalty',
    type: 'monument',
    buildTime: 60,
    costs: [
      { type: 'gold', value: 3000 },
      { type: 'prestige', value: 25 }
    ],
    levels: [
      {
        level: 1,
        name: 'Modest Palace',
        effects: [
          { type: 'legitimacy', value: 0.5, description: '+0.5 Yearly legitimacy', scope: 'nation' },
          { type: 'diplomatic_reputation', value: 0.5, description: '+0.5 Diplomatic reputation', scope: 'nation' }
        ],
        upgradeCost: 1500,
        upgradeTime: 24
      },
      {
        level: 2,
        name: 'Grand Palace',
        effects: [
          { type: 'legitimacy', value: 1, description: '+1 Yearly legitimacy', scope: 'nation' },
          { type: 'state_maintenance', value: -10, description: '-10% State maintenance', scope: 'nation' }
        ],
        upgradeCost: 4000,
        upgradeTime: 48
      },
      {
        level: 3,
        name: 'Magnificent Palace',
        effects: [
          { type: 'legitimacy', value: 2, description: '+2 Yearly legitimacy', scope: 'nation' },
          { type: 'max_absolutism', value: 10, description: '+10 Max absolutism', scope: 'nation' }
        ],
        upgradeCost: 8000,
        upgradeTime: 60
      }
    ],
    requirements: [
      { type: 'development', value: 30 }
    ]
  }
];

// Get projects by type
export function getProjectsByType(type: ProjectType): GreatProject[] {
  return GREAT_PROJECTS.filter(p => p.type === type);
}

// Calculate project effects at a given level
export function calculateProjectEffects(
  projectId: string,
  level: number
): ProjectEffect[] {
  const project = GREAT_PROJECTS.find(p => p.id === projectId);
  if (!project || level < 1 || level > project.levels.length) return [];

  return project.levels[level - 1].effects;
}

// Check if requirements are met
export function canBuildProject(
  project: GreatProject,
  techLevel: number,
  religion: string,
  culture: string,
  provinceDev: number
): { canBuild: boolean; reason?: string } {
  for (const req of project.requirements) {
    switch (req.type) {
      case 'tech':
        if (techLevel < (req.value as number)) {
          return { canBuild: false, reason: `Requires tech level ${req.value}` };
        }
        break;
      case 'development':
        if (provinceDev < (req.value as number)) {
          return { canBuild: false, reason: `Province needs ${req.value} development` };
        }
        break;
    }
  }
  return { canBuild: true };
}

export default {
  GREAT_PROJECTS,
  getProjectsByType,
  calculateProjectEffects,
  canBuildProject
};
