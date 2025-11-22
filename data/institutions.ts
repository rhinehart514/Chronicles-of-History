// Institutions system for technology advancement

export interface Institution {
  id: string;
  name: string;
  icon: string;
  description: string;
  year: number; // Year it becomes available
  originConditions: OriginCondition[];
  spreadConditions: SpreadCondition[];
  effects: InstitutionEffect[];
}

export interface OriginCondition {
  type: 'province_is' | 'has_tech' | 'has_building' | 'development' | 'is_capital';
  value: string | number;
  description: string;
}

export interface SpreadCondition {
  type: string;
  value: number;
  description: string;
}

export interface InstitutionEffect {
  type: string;
  value: number;
  description: string;
}

// Default institutions
export const INSTITUTIONS: Institution[] = [
  {
    id: 'feudalism',
    name: 'Feudalism',
    icon: '🏰',
    description: 'A system of lords and vassals organizing society',
    year: 1000,
    originConditions: [
      { type: 'is_capital', value: true, description: 'All starting capitals' }
    ],
    spreadConditions: [
      { type: 'adjacent_province', value: 3, description: '+3% from adjacent province with institution' },
      { type: 'development', value: 0.3, description: '+0.3% per development' }
    ],
    effects: [
      { type: 'tech_cost', value: -5, description: '-5% Technology cost' }
    ]
  },
  {
    id: 'renaissance',
    name: 'Renaissance',
    icon: '🎨',
    description: 'A cultural and intellectual rebirth',
    year: 1450,
    originConditions: [
      { type: 'development', value: 20, description: 'Development 20+' },
      { type: 'province_is', value: 'italy', description: 'Italian province' }
    ],
    spreadConditions: [
      { type: 'adjacent_province', value: 5, description: '+5% from adjacent province' },
      { type: 'development', value: 0.5, description: '+0.5% per development' },
      { type: 'has_building', value: 1, description: '+1% if has university' }
    ],
    effects: [
      { type: 'tech_cost', value: -5, description: '-5% Technology cost' },
      { type: 'advisor_cost', value: -5, description: '-5% Advisor cost' }
    ]
  },
  {
    id: 'colonialism',
    name: 'Colonialism',
    icon: '🌍',
    description: 'The age of exploration and colonial expansion',
    year: 1500,
    originConditions: [
      { type: 'has_tech', value: 7, description: 'Diplomatic tech 7' },
      { type: 'province_is', value: 'coastal', description: 'Coastal province' }
    ],
    spreadConditions: [
      { type: 'adjacent_province', value: 3, description: '+3% from adjacent province' },
      { type: 'port', value: 2, description: '+2% if port' },
      { type: 'trade_node_controller', value: 5, description: '+5% if controls trade node' }
    ],
    effects: [
      { type: 'tech_cost', value: -5, description: '-5% Technology cost' },
      { type: 'global_colonial_growth', value: 10, description: '+10 Global settler increase' }
    ]
  },
  {
    id: 'printing_press',
    name: 'Printing Press',
    icon: '📰',
    description: 'Revolutionary technology for spreading information',
    year: 1550,
    originConditions: [
      { type: 'has_tech', value: 15, description: 'Administrative tech 15' },
      { type: 'province_is', value: 'protestant', description: 'Protestant or Reformed province' }
    ],
    spreadConditions: [
      { type: 'adjacent_province', value: 4, description: '+4% from adjacent province' },
      { type: 'same_religion', value: 2, description: '+2% if same religion as origin' },
      { type: 'development', value: 0.3, description: '+0.3% per development' }
    ],
    effects: [
      { type: 'tech_cost', value: -5, description: '-5% Technology cost' },
      { type: 'stability_cost', value: -5, description: '-5% Stability cost' }
    ]
  },
  {
    id: 'global_trade',
    name: 'Global Trade',
    icon: '🚢',
    description: 'Worldwide commercial networks',
    year: 1600,
    originConditions: [
      { type: 'has_tech', value: 17, description: 'Diplomatic tech 17' },
      { type: 'province_is', value: 'trade_center', description: 'Level 2 trade center' }
    ],
    spreadConditions: [
      { type: 'adjacent_province', value: 3, description: '+3% from adjacent province' },
      { type: 'trade_company', value: 5, description: '+5% if in trade company' },
      { type: 'development', value: 0.4, description: '+0.4% per development' }
    ],
    effects: [
      { type: 'tech_cost', value: -5, description: '-5% Technology cost' },
      { type: 'trade_efficiency', value: 5, description: '+5% Trade efficiency' }
    ]
  },
  {
    id: 'manufactories',
    name: 'Manufactories',
    icon: '🏭',
    description: 'Large-scale production facilities',
    year: 1650,
    originConditions: [
      { type: 'has_tech', value: 19, description: 'Administrative tech 19' },
      { type: 'has_building', value: 'manufactory', description: 'Has manufactory' }
    ],
    spreadConditions: [
      { type: 'adjacent_province', value: 3, description: '+3% from adjacent province' },
      { type: 'has_building', value: 3, description: '+3% if has manufactory' },
      { type: 'development', value: 0.5, description: '+0.5% per development' }
    ],
    effects: [
      { type: 'tech_cost', value: -5, description: '-5% Technology cost' },
      { type: 'production_efficiency', value: 5, description: '+5% Production efficiency' }
    ]
  },
  {
    id: 'enlightenment',
    name: 'Enlightenment',
    icon: '💡',
    description: 'The age of reason and scientific thinking',
    year: 1700,
    originConditions: [
      { type: 'has_tech', value: 20, description: 'Any tech at level 20' },
      { type: 'has_building', value: 'university', description: 'Has university' }
    ],
    spreadConditions: [
      { type: 'adjacent_province', value: 4, description: '+4% from adjacent province' },
      { type: 'has_building', value: 2, description: '+2% if has university' },
      { type: 'development', value: 0.6, description: '+0.6% per development' }
    ],
    effects: [
      { type: 'tech_cost', value: -5, description: '-5% Technology cost' },
      { type: 'idea_cost', value: -5, description: '-5% Idea cost' }
    ]
  },
  {
    id: 'industrialization',
    name: 'Industrialization',
    icon: '⚙️',
    description: 'The industrial revolution transforms society',
    year: 1750,
    originConditions: [
      { type: 'has_tech', value: 23, description: 'Administrative tech 23' },
      { type: 'development', value: 30, description: 'Development 30+' }
    ],
    spreadConditions: [
      { type: 'adjacent_province', value: 5, description: '+5% from adjacent province' },
      { type: 'coal_province', value: 10, description: '+10% if produces coal' },
      { type: 'development', value: 0.8, description: '+0.8% per development' }
    ],
    effects: [
      { type: 'tech_cost', value: -5, description: '-5% Technology cost' },
      { type: 'goods_produced', value: 10, description: '+10% Goods produced' }
    ]
  }
];

// Calculate tech cost penalty from missing institutions
export function calculateTechPenalty(
  embracedInstitutions: string[],
  availableInstitutions: string[],
  year: number
): number {
  const missing = availableInstitutions.filter(
    inst => INSTITUTIONS.find(i => i.id === inst)!.year <= year &&
            !embracedInstitutions.includes(inst)
  );
  return missing.length * 10; // 10% penalty per missing institution
}

// Get institutions available at a given year
export function getAvailableInstitutions(year: number): Institution[] {
  return INSTITUTIONS.filter(inst => inst.year <= year);
}

// Calculate embrace cost
export function calculateEmbraceCost(
  development: number,
  currentSpread: number
): number {
  return Math.round(development * 2.5 * (100 - currentSpread) / 100);
}

export default {
  INSTITUTIONS,
  calculateTechPenalty,
  getAvailableInstitutions,
  calculateEmbraceCost
};
