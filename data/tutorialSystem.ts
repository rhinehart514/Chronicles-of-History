// Tutorial and guidance system

export interface Tutorial {
  id: string;
  name: string;
  description: string;
  category: TutorialCategory;
  steps: TutorialStep[];
  requirements?: TutorialRequirement[];
  rewards?: TutorialReward[];
}

export type TutorialCategory = 'basics' | 'economy' | 'military' | 'diplomacy' | 'trade' | 'colonization' | 'advanced';

export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  action?: string;
  highlight?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  waitForAction?: boolean;
}

export interface TutorialRequirement {
  type: string;
  value: string | number;
}

export interface TutorialReward {
  type: 'gold' | 'prestige' | 'monarch_points' | 'manpower';
  value: number;
}

// Available tutorials
export const TUTORIALS: Tutorial[] = [
  {
    id: 'basics_intro',
    name: 'Welcome to Chronicles',
    description: 'Learn the basics of the game interface',
    category: 'basics',
    steps: [
      {
        id: 'welcome',
        title: 'Welcome!',
        content: 'Welcome to Chronicles of History! This tutorial will guide you through the basics of running your nation.',
        position: 'center'
      },
      {
        id: 'map',
        title: 'The Map',
        content: 'The main map shows your territory and the world around you. Click on provinces to select them.',
        highlight: 'map',
        position: 'center'
      },
      {
        id: 'top_bar',
        title: 'Resource Bar',
        content: 'The top bar shows your resources: gold, manpower, monarch points, and more. Keep an eye on these!',
        highlight: 'top-bar',
        position: 'bottom'
      },
      {
        id: 'date',
        title: 'Date and Speed',
        content: 'Control time with the date controls. Pause, play, or speed up time as needed.',
        highlight: 'date-controls',
        position: 'bottom'
      },
      {
        id: 'menu',
        title: 'Main Menu',
        content: 'Access various game features through the main menu buttons on the left side.',
        highlight: 'main-menu',
        position: 'right'
      }
    ],
    rewards: [
      { type: 'gold', value: 100 }
    ]
  },
  {
    id: 'economy_basics',
    name: 'Managing Your Economy',
    description: 'Learn how to manage taxes, trade, and production',
    category: 'economy',
    steps: [
      {
        id: 'income',
        title: 'Income Sources',
        content: 'Your income comes from taxes, production, and trade. Each province contributes based on its development.',
        position: 'center'
      },
      {
        id: 'taxes',
        title: 'Taxation',
        content: 'Tax income is based on base tax development. Higher tax means more gold but also potential unrest.',
        highlight: 'economy-panel',
        position: 'right'
      },
      {
        id: 'production',
        title: 'Production',
        content: 'Provinces produce goods that generate income. The type and amount depend on the trade good and development.',
        position: 'center'
      },
      {
        id: 'trade',
        title: 'Trade',
        content: 'Trade flows through trade nodes. Control nodes and steer trade to your home node for maximum profit.',
        position: 'center'
      },
      {
        id: 'buildings',
        title: 'Buildings',
        content: 'Construct buildings to boost province output. Marketplaces increase trade, workshops increase production.',
        action: 'Open building menu',
        waitForAction: true
      }
    ],
    rewards: [
      { type: 'gold', value: 200 }
    ]
  },
  {
    id: 'military_basics',
    name: 'Building Your Army',
    description: 'Learn how to recruit, organize, and command armies',
    category: 'military',
    steps: [
      {
        id: 'manpower',
        title: 'Manpower',
        content: 'Manpower is used to recruit units. It regenerates over time based on your provinces.',
        highlight: 'manpower',
        position: 'bottom'
      },
      {
        id: 'recruitment',
        title: 'Recruiting Units',
        content: 'Click on a province to recruit infantry, cavalry, or artillery. Each has different costs and uses.',
        position: 'center'
      },
      {
        id: 'armies',
        title: 'Army Organization',
        content: 'Group units into armies. A balanced army needs infantry frontline, cavalry flanks, and artillery support.',
        position: 'center'
      },
      {
        id: 'movement',
        title: 'Moving Armies',
        content: 'Select an army and right-click to move. Terrain and supply affect movement speed.',
        position: 'center'
      },
      {
        id: 'combat',
        title: 'Combat',
        content: 'When armies meet enemies, combat begins. Morale, discipline, and numbers determine victory.',
        position: 'center'
      }
    ],
    rewards: [
      { type: 'manpower', value: 5000 }
    ]
  },
  {
    id: 'diplomacy_basics',
    name: 'Diplomatic Relations',
    description: 'Learn how to interact with other nations',
    category: 'diplomacy',
    steps: [
      {
        id: 'relations',
        title: 'Relations',
        content: 'Each nation has an opinion of you from -200 to +200. Positive relations enable cooperation.',
        position: 'center'
      },
      {
        id: 'alliances',
        title: 'Alliances',
        content: 'Form alliances for mutual defense. Allies will join your wars if their opinion is high enough.',
        position: 'center'
      },
      {
        id: 'marriages',
        title: 'Royal Marriages',
        content: 'Royal marriages improve relations and can lead to personal unions or succession claims.',
        position: 'center'
      },
      {
        id: 'trade_agreements',
        title: 'Trade Agreements',
        content: 'Sign trade agreements to share trade bonuses and improve economic ties.',
        position: 'center'
      },
      {
        id: 'war',
        title: 'Declaring War',
        content: 'You need a casus belli to declare war without penalties. Claims and missions provide them.',
        position: 'center'
      }
    ],
    rewards: [
      { type: 'prestige', value: 10 }
    ]
  },
  {
    id: 'trade_advanced',
    name: 'Mastering Trade',
    description: 'Advanced trade mechanics and optimization',
    category: 'trade',
    steps: [
      {
        id: 'nodes',
        title: 'Trade Nodes',
        content: 'Trade flows through nodes in specific directions toward end nodes where it can be collected.',
        position: 'center'
      },
      {
        id: 'merchants',
        title: 'Merchants',
        content: 'Assign merchants to nodes to collect trade or steer it toward your home node.',
        position: 'center'
      },
      {
        id: 'trade_power',
        title: 'Trade Power',
        content: 'Your share of trade depends on your trade power in the node. Build trade buildings and light ships.',
        position: 'center'
      },
      {
        id: 'steering',
        title: 'Trade Steering',
        content: 'Merchants steering trade add a bonus to the value. Chain multiple steers for maximum profit.',
        position: 'center'
      },
      {
        id: 'optimization',
        title: 'Optimization',
        content: 'Focus on dominating a few key nodes rather than spreading thin across many.',
        position: 'center'
      }
    ],
    rewards: [
      { type: 'gold', value: 300 }
    ]
  },
  {
    id: 'colonization_basics',
    name: 'Colonizing the World',
    description: 'Learn how to explore and colonize new lands',
    category: 'colonization',
    requirements: [
      { type: 'tech', value: 7 }
    ],
    steps: [
      {
        id: 'exploration',
        title: 'Exploration',
        content: 'First, explore unknown regions with explorers and conquistadors to reveal the map.',
        position: 'center'
      },
      {
        id: 'colonists',
        title: 'Colonists',
        content: 'Colonists establish new settlements. You need exploration or expansion ideas to get them.',
        position: 'center'
      },
      {
        id: 'settling',
        title: 'Starting a Colony',
        content: 'Send a colonist to an empty province. The colony grows until reaching city status.',
        position: 'center'
      },
      {
        id: 'maintenance',
        title: 'Colony Maintenance',
        content: 'Colonies cost monthly maintenance. Native uprisings can occur if natives are not dealt with.',
        position: 'center'
      },
      {
        id: 'colonial_nations',
        title: 'Colonial Nations',
        content: 'Five colonies in a colonial region form a colonial nation that pays you tariffs.',
        position: 'center'
      }
    ],
    rewards: [
      { type: 'monarch_points', value: 50 }
    ]
  }
];

// Get tutorials by category
export function getTutorialsByCategory(category: TutorialCategory): Tutorial[] {
  return TUTORIALS.filter(t => t.category === category);
}

// Check if tutorial requirements are met
export function canStartTutorial(
  tutorial: Tutorial,
  gameState: Record<string, any>
): boolean {
  if (!tutorial.requirements) return true;

  for (const req of tutorial.requirements) {
    const value = gameState[req.type];
    if (value === undefined || value < req.value) {
      return false;
    }
  }
  return true;
}

// Calculate total tutorial progress
export function calculateTutorialProgress(
  completedTutorials: string[]
): { completed: number; total: number; percentage: number } {
  const completed = completedTutorials.length;
  const total = TUTORIALS.length;
  return {
    completed,
    total,
    percentage: Math.round((completed / total) * 100)
  };
}

export default {
  TUTORIALS,
  getTutorialsByCategory,
  canStartTutorial,
  calculateTutorialProgress
};
