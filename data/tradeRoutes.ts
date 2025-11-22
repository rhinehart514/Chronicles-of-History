// Trade routes and nodes system

export interface TradeNode {
  id: string;
  name: string;
  icon: string;
  region: string;
  isEndNode: boolean;
  totalValue: number;
  outgoingRoutes: string[];
  incomingRoutes: string[];
  position: { x: number; y: number };
}

export interface TradeRoute {
  id: string;
  from: string;
  to: string;
  value: number;
  controlledBy: string[];
}

export interface TradePresence {
  nation: string;
  power: number;
  percentage: number;
  merchants: number;
  transferring: boolean;
  collecting: boolean;
}

// Major trade nodes
export const TRADE_NODES: TradeNode[] = [
  {
    id: 'english_channel',
    name: 'English Channel',
    icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    region: 'Western Europe',
    isEndNode: true,
    totalValue: 0,
    outgoingRoutes: [],
    incomingRoutes: ['north_sea', 'champagne', 'bordeaux'],
    position: { x: 48, y: 51 }
  },
  {
    id: 'north_sea',
    name: 'North Sea',
    icon: '🌊',
    region: 'Northern Europe',
    isEndNode: false,
    totalValue: 0,
    outgoingRoutes: ['english_channel'],
    incomingRoutes: ['lubeck', 'baltic_sea'],
    position: { x: 52, y: 55 }
  },
  {
    id: 'lubeck',
    name: 'Lübeck',
    icon: '⚓',
    region: 'Northern Europe',
    isEndNode: false,
    totalValue: 0,
    outgoingRoutes: ['north_sea', 'champagne'],
    incomingRoutes: ['baltic_sea', 'saxony'],
    position: { x: 53, y: 54 }
  },
  {
    id: 'baltic_sea',
    name: 'Baltic Sea',
    icon: '🌲',
    region: 'Eastern Europe',
    isEndNode: false,
    totalValue: 0,
    outgoingRoutes: ['lubeck', 'north_sea'],
    incomingRoutes: ['novgorod'],
    position: { x: 58, y: 60 }
  },
  {
    id: 'champagne',
    name: 'Champagne',
    icon: '🍇',
    region: 'Western Europe',
    isEndNode: false,
    totalValue: 0,
    outgoingRoutes: ['english_channel'],
    incomingRoutes: ['genoa', 'rheinland', 'lubeck'],
    position: { x: 49, y: 48 }
  },
  {
    id: 'bordeaux',
    name: 'Bordeaux',
    icon: '🍷',
    region: 'Western Europe',
    isEndNode: false,
    totalValue: 0,
    outgoingRoutes: ['english_channel'],
    incomingRoutes: ['seville', 'genoa'],
    position: { x: 46, y: 44 }
  },
  {
    id: 'genoa',
    name: 'Genoa',
    icon: '🏛️',
    region: 'Mediterranean',
    isEndNode: true,
    totalValue: 0,
    outgoingRoutes: [],
    incomingRoutes: ['venice', 'tunis', 'valencia', 'seville'],
    position: { x: 51, y: 44 }
  },
  {
    id: 'venice',
    name: 'Venice',
    icon: '🎭',
    region: 'Mediterranean',
    isEndNode: true,
    totalValue: 0,
    outgoingRoutes: [],
    incomingRoutes: ['ragusa', 'wien', 'alexandria'],
    position: { x: 54, y: 45 }
  },
  {
    id: 'seville',
    name: 'Seville',
    icon: '☀️',
    region: 'Iberia',
    isEndNode: false,
    totalValue: 0,
    outgoingRoutes: ['genoa', 'bordeaux'],
    incomingRoutes: ['valencia', 'ivory_coast', 'caribbean'],
    position: { x: 44, y: 37 }
  },
  {
    id: 'valencia',
    name: 'Valencia',
    icon: '🍊',
    region: 'Iberia',
    isEndNode: false,
    totalValue: 0,
    outgoingRoutes: ['seville', 'genoa'],
    incomingRoutes: ['tunis'],
    position: { x: 46, y: 40 }
  },
  {
    id: 'constantinople',
    name: 'Constantinople',
    icon: '🕌',
    region: 'Anatolia',
    isEndNode: false,
    totalValue: 0,
    outgoingRoutes: ['ragusa', 'alexandria'],
    incomingRoutes: ['aleppo', 'crimea', 'persia'],
    position: { x: 60, y: 41 }
  },
  {
    id: 'alexandria',
    name: 'Alexandria',
    icon: '📜',
    region: 'Egypt',
    isEndNode: false,
    totalValue: 0,
    outgoingRoutes: ['venice', 'ragusa'],
    incomingRoutes: ['aden', 'tunis', 'constantinople'],
    position: { x: 62, y: 31 }
  },
  {
    id: 'novgorod',
    name: 'Novgorod',
    icon: '❄️',
    region: 'Russia',
    isEndNode: false,
    totalValue: 0,
    outgoingRoutes: ['baltic_sea'],
    incomingRoutes: ['kazan', 'astrakhan'],
    position: { x: 62, y: 60 }
  },
  {
    id: 'aden',
    name: 'Aden',
    icon: '🚢',
    region: 'Arabia',
    isEndNode: false,
    totalValue: 0,
    outgoingRoutes: ['alexandria'],
    incomingRoutes: ['hormuz', 'zanzibar', 'coromandel'],
    position: { x: 68, y: 15 }
  },
  {
    id: 'hormuz',
    name: 'Hormuz',
    icon: '🏺',
    region: 'Persia',
    isEndNode: false,
    totalValue: 0,
    outgoingRoutes: ['aden', 'basra'],
    incomingRoutes: ['gujarat', 'lahore'],
    position: { x: 72, y: 27 }
  },
  {
    id: 'malacca',
    name: 'Malacca',
    icon: '🌴',
    region: 'Southeast Asia',
    isEndNode: false,
    totalValue: 0,
    outgoingRoutes: ['coromandel', 'canton'],
    incomingRoutes: ['moluccas', 'philippines'],
    position: { x: 85, y: 3 }
  },
  {
    id: 'canton',
    name: 'Canton',
    icon: '🐉',
    region: 'China',
    isEndNode: false,
    totalValue: 0,
    outgoingRoutes: ['malacca'],
    incomingRoutes: ['hangzhou', 'nippon'],
    position: { x: 87, y: 23 }
  },
  {
    id: 'nippon',
    name: 'Nippon',
    icon: '🗾',
    region: 'Japan',
    isEndNode: false,
    totalValue: 0,
    outgoingRoutes: ['canton', 'hangzhou'],
    incomingRoutes: [],
    position: { x: 93, y: 35 }
  },
  {
    id: 'caribbean',
    name: 'Caribbean',
    icon: '🏝️',
    region: 'Americas',
    isEndNode: false,
    totalValue: 0,
    outgoingRoutes: ['seville', 'bordeaux'],
    incomingRoutes: ['mexico', 'panama'],
    position: { x: 25, y: 17 }
  },
  {
    id: 'mexico',
    name: 'Mexico',
    icon: '🌵',
    region: 'Americas',
    isEndNode: false,
    totalValue: 0,
    outgoingRoutes: ['caribbean'],
    incomingRoutes: [],
    position: { x: 15, y: 20 }
  }
];

// Calculate trade power modifiers
export function calculateTradePowerModifiers(
  basepower: number,
  modifiers: { type: string; value: number }[]
): number {
  let multiplier = 1;
  for (const mod of modifiers) {
    multiplier += mod.value / 100;
  }
  return basepower * multiplier;
}

// Get downstream value
export function calculateDownstreamValue(
  nodeId: string,
  nodes: TradeNode[],
  routes: TradeRoute[]
): number {
  const node = nodes.find(n => n.id === nodeId);
  if (!node) return 0;

  let value = 0;
  for (const routeId of node.incomingRoutes) {
    const route = routes.find(r => r.to === nodeId && r.from === routeId);
    if (route) {
      value += route.value;
    }
  }
  return value;
}

// Get trade route control
export function getRouteControl(
  route: TradeRoute,
  nationPresence: TradePresence[]
): { nation: string; percentage: number }[] {
  return nationPresence
    .sort((a, b) => b.power - a.power)
    .slice(0, 5)
    .map(p => ({
      nation: p.nation,
      percentage: p.percentage
    }));
}

// Check if nation can steer trade
export function canSteerTrade(
  fromNode: string,
  toNode: string,
  nodes: TradeNode[]
): boolean {
  const from = nodes.find(n => n.id === fromNode);
  if (!from) return false;
  return from.outgoingRoutes.includes(toNode);
}

export default {
  TRADE_NODES,
  calculateTradePowerModifiers,
  calculateDownstreamValue,
  getRouteControl,
  canSteerTrade
};
