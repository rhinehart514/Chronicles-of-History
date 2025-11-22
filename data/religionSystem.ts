// Religion system with denominations and mechanics

export interface Religion {
  id: string;
  name: string;
  icon: string;
  group: ReligionGroup;
  color: string;
  mechanics: ReligionMechanic[];
  modifiers: ReligionModifier[];
  holyPlaces?: string[];
}

export type ReligionGroup = 'christian' | 'muslim' | 'eastern' | 'pagan' | 'dharmic' | 'jewish';

export interface ReligionMechanic {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface ReligionModifier {
  type: string;
  value: number;
  description: string;
}

export const RELIGIONS: Religion[] = [
  {
    id: 'catholic',
    name: 'Catholic',
    icon: '✝️',
    group: 'christian',
    color: '#FFD700',
    mechanics: [
      { id: 'papal_influence', name: 'Papal Influence', description: 'Gain papal influence', icon: '⛪' }
    ],
    modifiers: [
      { type: 'stability_cost', value: -10, description: '-10% Stability cost' }
    ],
    holyPlaces: ['rome', 'jerusalem']
  },
  {
    id: 'protestant',
    name: 'Protestant',
    icon: '✝️',
    group: 'christian',
    color: '#4169E1',
    mechanics: [
      { id: 'church_aspects', name: 'Church Aspects', description: 'Customize your church', icon: '📖' }
    ],
    modifiers: [
      { type: 'tech_cost', value: -5, description: '-5% Technology cost' }
    ]
  },
  {
    id: 'orthodox',
    name: 'Orthodox',
    icon: '☦️',
    group: 'christian',
    color: '#8B4513',
    mechanics: [
      { id: 'icons', name: 'Icons', description: 'Consecrate icons', icon: '🖼️' }
    ],
    modifiers: [
      { type: 'manpower', value: 10, description: '+10% National manpower' }
    ]
  },
  {
    id: 'sunni',
    name: 'Sunni',
    icon: '☪️',
    group: 'muslim',
    color: '#228B22',
    mechanics: [
      { id: 'schools', name: 'Schools of Law', description: 'Legal traditions', icon: '🏫' }
    ],
    modifiers: [
      { type: 'trade_efficiency', value: 10, description: '+10% Trade efficiency' }
    ],
    holyPlaces: ['mecca', 'medina']
  },
  {
    id: 'shia',
    name: 'Shia',
    icon: '☪️',
    group: 'muslim',
    color: '#006400',
    mechanics: [],
    modifiers: [
      { type: 'morale', value: 10, description: '+10% Morale' }
    ]
  },
  {
    id: 'buddhism',
    name: 'Buddhist',
    icon: '☸️',
    group: 'eastern',
    color: '#FF8C00',
    mechanics: [
      { id: 'karma', name: 'Karma', description: 'Balance karma', icon: '⚖️' }
    ],
    modifiers: [
      { type: 'tolerance_true', value: 2, description: '+2 Tolerance' }
    ]
  },
  {
    id: 'confucianism',
    name: 'Confucian',
    icon: '🈵',
    group: 'eastern',
    color: '#DAA520',
    mechanics: [
      { id: 'harmony', name: 'Harmony', description: 'Maintain harmony', icon: '🕊️' }
    ],
    modifiers: [
      { type: 'advisor_cost', value: -10, description: '-10% Advisor cost' }
    ]
  },
  {
    id: 'hinduism',
    name: 'Hindu',
    icon: '🕉️',
    group: 'dharmic',
    color: '#FF4500',
    mechanics: [
      { id: 'deity', name: 'Patron Deity', description: 'Choose a deity', icon: '🙏' }
    ],
    modifiers: [
      { type: 'land_morale', value: 5, description: '+5% Land morale' }
    ]
  },
  {
    id: 'norse',
    name: 'Norse',
    icon: '⚡',
    group: 'pagan',
    color: '#4682B4',
    mechanics: [
      { id: 'raiding', name: 'Raiders', description: 'Raid coasts', icon: '⛵' }
    ],
    modifiers: [
      { type: 'naval_morale', value: 20, description: '+20% Naval morale' }
    ]
  },
  {
    id: 'jewish',
    name: 'Jewish',
    icon: '✡️',
    group: 'jewish',
    color: '#0000CD',
    mechanics: [],
    modifiers: [
      { type: 'advisor_cost', value: -15, description: '-15% Advisor cost' }
    ],
    holyPlaces: ['jerusalem']
  }
];

export function getReligionsByGroup(group: ReligionGroup): Religion[] {
  return RELIGIONS.filter(r => r.group === group);
}

export function getReligionIcon(religionId: string): string {
  return RELIGIONS.find(r => r.id === religionId)?.icon || '❓';
}

export default { RELIGIONS, getReligionsByGroup, getReligionIcon };
