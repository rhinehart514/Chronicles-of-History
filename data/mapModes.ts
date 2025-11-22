// Map display modes system

export interface MapMode {
  id: string;
  name: string;
  icon: string;
  description: string;
  hotkey: string;
  category: MapModeCategory;
  colorScheme: ColorScheme;
  legend: LegendItem[];
}

export type MapModeCategory = 'political' | 'economic' | 'military' | 'diplomatic' | 'misc';

export interface ColorScheme {
  type: 'discrete' | 'gradient' | 'custom';
  colors: string[];
  values?: number[];
}

export interface LegendItem {
  color: string;
  label: string;
  value?: number | string;
}

// Available map modes
export const MAP_MODES: MapMode[] = [
  {
    id: 'political',
    name: 'Political',
    icon: '🗺️',
    description: 'Shows nations and their borders',
    hotkey: 'Q',
    category: 'political',
    colorScheme: {
      type: 'custom',
      colors: []
    },
    legend: [
      { color: '#yourcolor', label: 'Your nation' },
      { color: '#ally', label: 'Allies' },
      { color: '#enemy', label: 'Enemies' },
      { color: '#neutral', label: 'Neutral' }
    ]
  },
  {
    id: 'diplomatic',
    name: 'Diplomatic',
    icon: '🤝',
    description: 'Shows diplomatic relations',
    hotkey: 'W',
    category: 'diplomatic',
    colorScheme: {
      type: 'gradient',
      colors: ['#ff4444', '#ffff00', '#44ff44'],
      values: [-200, 0, 200]
    },
    legend: [
      { color: '#ff4444', label: 'Hostile', value: -200 },
      { color: '#ffff00', label: 'Neutral', value: 0 },
      { color: '#44ff44', label: 'Friendly', value: 200 }
    ]
  },
  {
    id: 'terrain',
    name: 'Terrain',
    icon: '🏔️',
    description: 'Shows terrain types',
    hotkey: 'E',
    category: 'misc',
    colorScheme: {
      type: 'discrete',
      colors: ['#90EE90', '#228B22', '#8B4513', '#808080', '#FFFF00', '#87CEEB']
    },
    legend: [
      { color: '#90EE90', label: 'Plains' },
      { color: '#228B22', label: 'Forest' },
      { color: '#8B4513', label: 'Mountains' },
      { color: '#808080', label: 'Hills' },
      { color: '#FFFF00', label: 'Desert' },
      { color: '#87CEEB', label: 'Coastal' }
    ]
  },
  {
    id: 'trade',
    name: 'Trade',
    icon: '💰',
    description: 'Shows trade value and routes',
    hotkey: 'R',
    category: 'economic',
    colorScheme: {
      type: 'gradient',
      colors: ['#ffcccc', '#ff0000'],
      values: [0, 100]
    },
    legend: [
      { color: '#ffcccc', label: 'Low value', value: 0 },
      { color: '#ff6666', label: 'Medium value', value: 50 },
      { color: '#ff0000', label: 'High value', value: 100 }
    ]
  },
  {
    id: 'development',
    name: 'Development',
    icon: '📈',
    description: 'Shows province development',
    hotkey: 'T',
    category: 'economic',
    colorScheme: {
      type: 'gradient',
      colors: ['#ffffcc', '#ff8800'],
      values: [3, 50]
    },
    legend: [
      { color: '#ffffcc', label: 'Low', value: '3-10' },
      { color: '#ffcc66', label: 'Medium', value: '11-25' },
      { color: '#ff8800', label: 'High', value: '26+' }
    ]
  },
  {
    id: 'religion',
    name: 'Religion',
    icon: '⛪',
    description: 'Shows religious distribution',
    hotkey: 'Y',
    category: 'misc',
    colorScheme: {
      type: 'discrete',
      colors: ['#FFD700', '#800080', '#008000', '#FF4500', '#4169E1']
    },
    legend: [
      { color: '#FFD700', label: 'Catholic' },
      { color: '#800080', label: 'Protestant' },
      { color: '#008000', label: 'Sunni' },
      { color: '#FF4500', label: 'Shia' },
      { color: '#4169E1', label: 'Orthodox' }
    ]
  },
  {
    id: 'culture',
    name: 'Culture',
    icon: '🎭',
    description: 'Shows cultural distribution',
    hotkey: 'U',
    category: 'misc',
    colorScheme: {
      type: 'discrete',
      colors: []
    },
    legend: [
      { color: '#green', label: 'Accepted' },
      { color: '#yellow', label: 'Same group' },
      { color: '#red', label: 'Foreign' }
    ]
  },
  {
    id: 'fort',
    name: 'Fort Level',
    icon: '🏰',
    description: 'Shows fort locations and levels',
    hotkey: 'I',
    category: 'military',
    colorScheme: {
      type: 'discrete',
      colors: ['#888888', '#4444ff', '#8888ff', '#ccccff']
    },
    legend: [
      { color: '#888888', label: 'No fort' },
      { color: '#4444ff', label: 'Level 1-2' },
      { color: '#8888ff', label: 'Level 3-6' },
      { color: '#ccccff', label: 'Level 7+' }
    ]
  },
  {
    id: 'manpower',
    name: 'Manpower',
    icon: '👥',
    description: 'Shows provincial manpower',
    hotkey: 'O',
    category: 'military',
    colorScheme: {
      type: 'gradient',
      colors: ['#ffcccc', '#ff0000'],
      values: [0, 10]
    },
    legend: [
      { color: '#ffcccc', label: 'Low' },
      { color: '#ff6666', label: 'Medium' },
      { color: '#ff0000', label: 'High' }
    ]
  },
  {
    id: 'autonomy',
    name: 'Autonomy',
    icon: '📊',
    description: 'Shows local autonomy levels',
    hotkey: 'P',
    category: 'economic',
    colorScheme: {
      type: 'gradient',
      colors: ['#44ff44', '#ff4444'],
      values: [0, 100]
    },
    legend: [
      { color: '#44ff44', label: '0%' },
      { color: '#ffff44', label: '50%' },
      { color: '#ff4444', label: '100%' }
    ]
  },
  {
    id: 'unrest',
    name: 'Unrest',
    icon: '⚠️',
    description: 'Shows provincial unrest',
    hotkey: 'A',
    category: 'political',
    colorScheme: {
      type: 'gradient',
      colors: ['#44ff44', '#ff4444'],
      values: [0, 10]
    },
    legend: [
      { color: '#44ff44', label: 'Stable', value: 0 },
      { color: '#ffff44', label: 'Restless', value: 5 },
      { color: '#ff4444', label: 'Rebellious', value: 10 }
    ]
  },
  {
    id: 'simple_terrain',
    name: 'Simple Terrain',
    icon: '🌍',
    description: 'Basic terrain view',
    hotkey: 'S',
    category: 'misc',
    colorScheme: {
      type: 'discrete',
      colors: []
    },
    legend: []
  },
  {
    id: 'supply',
    name: 'Supply',
    icon: '🍞',
    description: 'Shows supply limits for armies',
    hotkey: 'D',
    category: 'military',
    colorScheme: {
      type: 'gradient',
      colors: ['#ff4444', '#44ff44'],
      values: [10, 50]
    },
    legend: [
      { color: '#ff4444', label: 'Low supply' },
      { color: '#ffff44', label: 'Medium' },
      { color: '#44ff44', label: 'High supply' }
    ]
  },
  {
    id: 'colonial',
    name: 'Colonial',
    icon: '🌴',
    description: 'Shows colonial regions',
    hotkey: 'F',
    category: 'diplomatic',
    colorScheme: {
      type: 'discrete',
      colors: []
    },
    legend: [
      { color: '#green', label: 'Your colonies' },
      { color: '#yellow', label: 'Claimed' },
      { color: '#gray', label: 'Uncolonized' }
    ]
  }
];

// Get map modes by category
export function getMapModesByCategory(category: MapModeCategory): MapMode[] {
  return MAP_MODES.filter(m => m.category === category);
}

// Get map mode by hotkey
export function getMapModeByHotkey(hotkey: string): MapMode | undefined {
  return MAP_MODES.find(m => m.hotkey.toLowerCase() === hotkey.toLowerCase());
}

// Get default map mode
export function getDefaultMapMode(): MapMode {
  return MAP_MODES[0];
}

export default {
  MAP_MODES,
  getMapModesByCategory,
  getMapModeByHotkey,
  getDefaultMapMode
};
