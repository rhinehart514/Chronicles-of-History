// Trade node and trade flow system

export interface TradeNode {
  id: string;
  name: string;
  region: string;
  baseValue: number;
  totalValue: number;
  outgoing: TradeFlow[];
  incoming: TradeFlow[];
  nations: NodeNation[];
  tradeGoods: string[];
}

export interface TradeFlow {
  targetNode: string;
  value: number;
  controlledBy: string;
}

export interface NodeNation {
  nationId: string;
  name: string;
  flag: string;
  tradePower: number;
  tradePowerShare: number;
  merchants: number;
  income: number;
  collecting: boolean;
  steering: boolean;
  steeringTo?: string;
}

// Default trade nodes for 18th century
export const DEFAULT_TRADE_NODES: TradeNode[] = [
  {
    id: 'english_channel',
    name: 'English Channel',
    region: 'Western Europe',
    baseValue: 20,
    totalValue: 0,
    outgoing: [],
    incoming: [
      { targetNode: 'north_sea', value: 0, controlledBy: '' },
      { targetNode: 'bordeaux', value: 0, controlledBy: '' },
      { targetNode: 'champagne', value: 0, controlledBy: '' }
    ],
    nations: [],
    tradeGoods: ['cloth', 'fish', 'grain']
  },
  {
    id: 'north_sea',
    name: 'North Sea',
    region: 'Northern Europe',
    baseValue: 15,
    totalValue: 0,
    outgoing: [
      { targetNode: 'english_channel', value: 0, controlledBy: '' }
    ],
    incoming: [
      { targetNode: 'lubeck', value: 0, controlledBy: '' },
      { targetNode: 'baltic', value: 0, controlledBy: '' }
    ],
    nations: [],
    tradeGoods: ['fish', 'naval_supplies', 'grain']
  },
  {
    id: 'lubeck',
    name: 'Lübeck',
    region: 'Northern Germany',
    baseValue: 12,
    totalValue: 0,
    outgoing: [
      { targetNode: 'north_sea', value: 0, controlledBy: '' }
    ],
    incoming: [
      { targetNode: 'baltic', value: 0, controlledBy: '' },
      { targetNode: 'saxony', value: 0, controlledBy: '' }
    ],
    nations: [],
    tradeGoods: ['grain', 'fish', 'amber']
  },
  {
    id: 'baltic',
    name: 'Baltic Sea',
    region: 'Baltic',
    baseValue: 10,
    totalValue: 0,
    outgoing: [
      { targetNode: 'north_sea', value: 0, controlledBy: '' },
      { targetNode: 'lubeck', value: 0, controlledBy: '' }
    ],
    incoming: [
      { targetNode: 'novgorod', value: 0, controlledBy: '' }
    ],
    nations: [],
    tradeGoods: ['naval_supplies', 'grain', 'fur']
  },
  {
    id: 'bordeaux',
    name: 'Bordeaux',
    region: 'France',
    baseValue: 14,
    totalValue: 0,
    outgoing: [
      { targetNode: 'english_channel', value: 0, controlledBy: '' }
    ],
    incoming: [
      { targetNode: 'sevilla', value: 0, controlledBy: '' }
    ],
    nations: [],
    tradeGoods: ['wine', 'salt', 'cloth']
  },
  {
    id: 'sevilla',
    name: 'Sevilla',
    region: 'Iberia',
    baseValue: 18,
    totalValue: 0,
    outgoing: [
      { targetNode: 'bordeaux', value: 0, controlledBy: '' },
      { targetNode: 'genoa', value: 0, controlledBy: '' }
    ],
    incoming: [
      { targetNode: 'caribbean', value: 0, controlledBy: '' },
      { targetNode: 'ivory_coast', value: 0, controlledBy: '' }
    ],
    nations: [],
    tradeGoods: ['gold', 'silver', 'sugar']
  },
  {
    id: 'genoa',
    name: 'Genoa',
    region: 'Italy',
    baseValue: 16,
    totalValue: 0,
    outgoing: [
      { targetNode: 'champagne', value: 0, controlledBy: '' }
    ],
    incoming: [
      { targetNode: 'sevilla', value: 0, controlledBy: '' },
      { targetNode: 'venice', value: 0, controlledBy: '' },
      { targetNode: 'tunis', value: 0, controlledBy: '' }
    ],
    nations: [],
    tradeGoods: ['silk', 'spices', 'glass']
  },
  {
    id: 'venice',
    name: 'Venice',
    region: 'Italy',
    baseValue: 18,
    totalValue: 0,
    outgoing: [
      { targetNode: 'genoa', value: 0, controlledBy: '' }
    ],
    incoming: [
      { targetNode: 'constantinople', value: 0, controlledBy: '' },
      { targetNode: 'alexandria', value: 0, controlledBy: '' }
    ],
    nations: [],
    tradeGoods: ['spices', 'silk', 'glass']
  },
  {
    id: 'champagne',
    name: 'Champagne',
    region: 'France',
    baseValue: 10,
    totalValue: 0,
    outgoing: [
      { targetNode: 'english_channel', value: 0, controlledBy: '' }
    ],
    incoming: [
      { targetNode: 'genoa', value: 0, controlledBy: '' },
      { targetNode: 'rheinland', value: 0, controlledBy: '' }
    ],
    nations: [],
    tradeGoods: ['wine', 'cloth', 'wool']
  },
  {
    id: 'caribbean',
    name: 'Caribbean',
    region: 'Americas',
    baseValue: 12,
    totalValue: 0,
    outgoing: [
      { targetNode: 'sevilla', value: 0, controlledBy: '' },
      { targetNode: 'bordeaux', value: 0, controlledBy: '' }
    ],
    incoming: [],
    nations: [],
    tradeGoods: ['sugar', 'tobacco', 'cocoa']
  }
];

// Calculate trade power for a nation in a node
export function calculateTradePower(
  provinces: number,
  merchants: number,
  buildings: number,
  lightShips: number,
  modifiers: number
): number {
  let power = 0;

  // Province base power
  power += provinces * 2;

  // Merchant bonus
  power += merchants * 10;

  // Trade buildings
  power += buildings * 5;

  // Light ships protecting trade
  power += lightShips * 2;

  // Apply modifiers
  power *= (1 + modifiers / 100);

  return Math.round(power);
}

// Calculate income from trade node
export function calculateTradeIncome(
  nodeValue: number,
  tradePowerShare: number,
  efficiency: number,
  collecting: boolean
): number {
  if (!collecting) return 0;

  let income = nodeValue * (tradePowerShare / 100);
  income *= (efficiency / 100);

  return Math.round(income * 10) / 10;
}

// Calculate steering effectiveness
export function calculateSteeringPower(
  tradePower: number,
  steeringBonus: number
): number {
  return tradePower * (1 + steeringBonus / 100);
}

// Get downstream nodes
export function getDownstreamNodes(
  nodeId: string,
  nodes: TradeNode[]
): string[] {
  const node = nodes.find(n => n.id === nodeId);
  if (!node) return [];
  return node.outgoing.map(o => o.targetNode);
}

// Get upstream nodes
export function getUpstreamNodes(
  nodeId: string,
  nodes: TradeNode[]
): string[] {
  const node = nodes.find(n => n.id === nodeId);
  if (!node) return [];
  return node.incoming.map(i => i.targetNode);
}

// Calculate total node value including incoming flows
export function calculateTotalNodeValue(
  node: TradeNode,
  nodes: TradeNode[]
): number {
  let total = node.baseValue;

  // Add incoming flows
  for (const incoming of node.incoming) {
    const sourceNode = nodes.find(n => n.id === incoming.targetNode);
    if (sourceNode) {
      total += incoming.value;
    }
  }

  return total;
}

// Simulate trade flow for one turn
export function simulateTradeFlow(nodes: TradeNode[]): TradeNode[] {
  const updatedNodes = JSON.parse(JSON.stringify(nodes)) as TradeNode[];

  // Calculate total values
  for (const node of updatedNodes) {
    node.totalValue = calculateTotalNodeValue(node, updatedNodes);
  }

  // Calculate nation shares and income
  for (const node of updatedNodes) {
    const totalPower = node.nations.reduce((sum, n) => sum + n.tradePower, 0);

    for (const nation of node.nations) {
      nation.tradePowerShare = totalPower > 0
        ? (nation.tradePower / totalPower) * 100
        : 0;

      if (nation.collecting) {
        nation.income = calculateTradeIncome(
          node.totalValue,
          nation.tradePowerShare,
          100, // Base efficiency
          true
        );
      }
    }
  }

  return updatedNodes;
}

// Get trade good bonus
export function getTradeGoodBonus(good: string): { production: number; value: number } {
  const bonuses: Record<string, { production: number; value: number }> = {
    gold: { production: 0, value: 3 },
    silver: { production: 0, value: 2.5 },
    spices: { production: 0, value: 3 },
    silk: { production: 0, value: 2.5 },
    sugar: { production: 0.1, value: 2 },
    tobacco: { production: 0.1, value: 1.5 },
    cloth: { production: 0.2, value: 1.5 },
    wine: { production: 0.1, value: 1.5 },
    grain: { production: 0, value: 1 },
    fish: { production: 0, value: 1 },
    fur: { production: 0, value: 2 },
    naval_supplies: { production: 0, value: 1.5 },
    iron: { production: 0.3, value: 1 },
    coal: { production: 0.3, value: 1 }
  };

  return bonuses[good] || { production: 0, value: 1 };
}

export default {
  DEFAULT_TRADE_NODES,
  calculateTradePower,
  calculateTradeIncome,
  calculateSteeringPower,
  getDownstreamNodes,
  getUpstreamNodes,
  calculateTotalNodeValue,
  simulateTradeFlow,
  getTradeGoodBonus
};
