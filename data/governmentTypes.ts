// Government types and mechanics

export interface GovernmentType {
  id: string;
  name: string;
  icon: string;
  category: GovernmentCategory;
  description: string;
  modifiers: GovernmentModifier[];
  maxAbsolutism: number;
}

export type GovernmentCategory = 'monarchy' | 'republic' | 'theocracy' | 'tribal';

export interface GovernmentModifier {
  type: string;
  value: number;
  description: string;
}

export const GOVERNMENT_TYPES: GovernmentType[] = [
  {
    id: 'feudal_monarchy',
    name: 'Feudal Monarchy',
    icon: '👑',
    category: 'monarchy',
    description: 'Traditional monarchy with nobles',
    modifiers: [
      { type: 'vassal_income', value: 10, description: '+10% Vassal income' }
    ],
    maxAbsolutism: 65
  },
  {
    id: 'despotic_monarchy',
    name: 'Despotic Monarchy',
    icon: '🗡️',
    category: 'monarchy',
    description: 'Absolute ruler',
    modifiers: [
      { type: 'unjustified_demands', value: -10, description: '-10% Unjustified demands' }
    ],
    maxAbsolutism: 100
  },
  {
    id: 'administrative_monarchy',
    name: 'Administrative Monarchy',
    icon: '📋',
    category: 'monarchy',
    description: 'Centralized bureaucracy',
    modifiers: [
      { type: 'admin_efficiency', value: 5, description: '+5% Admin efficiency' }
    ],
    maxAbsolutism: 75
  },
  {
    id: 'constitutional_monarchy',
    name: 'Constitutional Monarchy',
    icon: '📜',
    category: 'monarchy',
    description: 'Limited by constitution',
    modifiers: [
      { type: 'global_unrest', value: -2, description: '-2 Global unrest' }
    ],
    maxAbsolutism: 50
  },
  {
    id: 'merchant_republic',
    name: 'Merchant Republic',
    icon: '💰',
    category: 'republic',
    description: 'Ruled by merchants',
    modifiers: [
      { type: 'trade_efficiency', value: 20, description: '+20% Trade efficiency' }
    ],
    maxAbsolutism: 30
  },
  {
    id: 'noble_republic',
    name: 'Noble Republic',
    icon: '🏛️',
    category: 'republic',
    description: 'Only nobles hold office',
    modifiers: [
      { type: 'diplomatic_reputation', value: 1, description: '+1 Diplomatic reputation' }
    ],
    maxAbsolutism: 40
  },
  {
    id: 'oligarchic_republic',
    name: 'Oligarchic Republic',
    icon: '🎩',
    category: 'republic',
    description: 'Controlled by elite',
    modifiers: [
      { type: 'governing_capacity', value: 50, description: '+50 Governing capacity' }
    ],
    maxAbsolutism: 45
  },
  {
    id: 'theocracy',
    name: 'Theocracy',
    icon: '⛪',
    category: 'theocracy',
    description: 'Ruled by religious authorities',
    modifiers: [
      { type: 'tolerance_true', value: 2, description: '+2 Tolerance' }
    ],
    maxAbsolutism: 70
  },
  {
    id: 'monastic_order',
    name: 'Monastic Order',
    icon: '✝️',
    category: 'theocracy',
    description: 'Military-religious order',
    modifiers: [
      { type: 'discipline', value: 5, description: '+5% Discipline' }
    ],
    maxAbsolutism: 60
  },
  {
    id: 'steppe_horde',
    name: 'Steppe Horde',
    icon: '🐎',
    category: 'tribal',
    description: 'Nomadic warriors',
    modifiers: [
      { type: 'cavalry_combat', value: 25, description: '+25% Cavalry combat' }
    ],
    maxAbsolutism: 100
  },
  {
    id: 'tribal_federation',
    name: 'Tribal Federation',
    icon: '🏕️',
    category: 'tribal',
    description: 'Federation of tribes',
    modifiers: [
      { type: 'manpower', value: 20, description: '+20% Manpower' }
    ],
    maxAbsolutism: 50
  }
];

export function getGovernmentsByCategory(category: GovernmentCategory): GovernmentType[] {
  return GOVERNMENT_TYPES.filter(g => g.category === category);
}

export function getGovernmentIcon(govId: string): string {
  return GOVERNMENT_TYPES.find(g => g.id === govId)?.icon || '🏛️';
}

export default { GOVERNMENT_TYPES, getGovernmentsByCategory, getGovernmentIcon };
