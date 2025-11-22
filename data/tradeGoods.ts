// Trade goods system

export interface TradeGood {
  id: string;
  name: string;
  icon: string;
  basePrice: number;
  modifiers: TradeGoodModifier[];
  description: string;
  category: GoodCategory;
}

export type GoodCategory = 'basic' | 'luxury' | 'military' | 'colonial';

export interface TradeGoodModifier {
  type: string;
  value: number;
  scope: 'local' | 'national';
}

export interface MarketPrice {
  goodId: string;
  currentPrice: number;
  priceHistory: number[];
  supply: number;
  demand: number;
}

// All trade goods
export const TRADE_GOODS: TradeGood[] = [
  {
    id: 'grain',
    name: 'Grain',
    icon: '🌾',
    basePrice: 2.0,
    modifiers: [
      { type: 'local_manpower', value: 10, scope: 'local' },
      { type: 'supply_limit', value: 1, scope: 'local' }
    ],
    description: 'Basic foodstuff that supports population growth.',
    category: 'basic'
  },
  {
    id: 'fish',
    name: 'Fish',
    icon: '🐟',
    basePrice: 2.5,
    modifiers: [
      { type: 'local_manpower', value: 5, scope: 'local' },
      { type: 'naval_forcelimit', value: 5, scope: 'local' }
    ],
    description: 'Coastal food source that supports sailors and navies.',
    category: 'basic'
  },
  {
    id: 'wine',
    name: 'Wine',
    icon: '🍷',
    basePrice: 2.5,
    modifiers: [
      { type: 'prestige', value: 0.5, scope: 'national' },
      { type: 'diplomats', value: 0.1, scope: 'national' }
    ],
    description: 'Refined beverage valued in diplomacy and trade.',
    category: 'basic'
  },
  {
    id: 'wool',
    name: 'Wool',
    icon: '🐑',
    basePrice: 2.5,
    modifiers: [
      { type: 'trade_value', value: 5, scope: 'local' }
    ],
    description: 'Raw material for textile production.',
    category: 'basic'
  },
  {
    id: 'cloth',
    name: 'Cloth',
    icon: '🧵',
    basePrice: 3.0,
    modifiers: [
      { type: 'trade_efficiency', value: 5, scope: 'national' }
    ],
    description: 'Finished textile goods for domestic and export markets.',
    category: 'basic'
  },
  {
    id: 'salt',
    name: 'Salt',
    icon: '🧂',
    basePrice: 3.0,
    modifiers: [
      { type: 'local_tax', value: 10, scope: 'local' },
      { type: 'local_defensiveness', value: 5, scope: 'local' }
    ],
    description: 'Essential preservative and trade commodity.',
    category: 'basic'
  },
  {
    id: 'fur',
    name: 'Fur',
    icon: '🦊',
    basePrice: 3.0,
    modifiers: [
      { type: 'prestige', value: 0.25, scope: 'national' }
    ],
    description: 'Luxury pelts from northern regions.',
    category: 'luxury'
  },
  {
    id: 'copper',
    name: 'Copper',
    icon: '🟤',
    basePrice: 3.0,
    modifiers: [
      { type: 'land_forcelimit', value: 5, scope: 'local' },
      { type: 'artillery_cost', value: -5, scope: 'national' }
    ],
    description: 'Essential metal for bronze and brass production.',
    category: 'military'
  },
  {
    id: 'iron',
    name: 'Iron',
    icon: '⚙️',
    basePrice: 3.5,
    modifiers: [
      { type: 'land_forcelimit', value: 10, scope: 'local' },
      { type: 'regiment_cost', value: -5, scope: 'national' }
    ],
    description: 'Vital metal for weapons and tools.',
    category: 'military'
  },
  {
    id: 'naval_supplies',
    name: 'Naval Supplies',
    icon: '⚓',
    basePrice: 3.0,
    modifiers: [
      { type: 'naval_forcelimit', value: 15, scope: 'local' },
      { type: 'ship_cost', value: -10, scope: 'national' }
    ],
    description: 'Timber, rope, and tar for shipbuilding.',
    category: 'military'
  },
  {
    id: 'silk',
    name: 'Silk',
    icon: '🎀',
    basePrice: 4.0,
    modifiers: [
      { type: 'trade_efficiency', value: 10, scope: 'national' },
      { type: 'prestige', value: 0.5, scope: 'national' }
    ],
    description: 'Luxurious fabric from the East.',
    category: 'luxury'
  },
  {
    id: 'dyes',
    name: 'Dyes',
    icon: '🎨',
    basePrice: 4.0,
    modifiers: [
      { type: 'trade_efficiency', value: 10, scope: 'national' }
    ],
    description: 'Colorful substances for textile industry.',
    category: 'luxury'
  },
  {
    id: 'spices',
    name: 'Spices',
    icon: '🌶️',
    basePrice: 5.0,
    modifiers: [
      { type: 'trade_efficiency', value: 15, scope: 'national' },
      { type: 'prestige', value: 0.25, scope: 'national' }
    ],
    description: 'Exotic seasonings from distant lands.',
    category: 'colonial'
  },
  {
    id: 'sugar',
    name: 'Sugar',
    icon: '🍬',
    basePrice: 4.0,
    modifiers: [
      { type: 'global_tariffs', value: 10, scope: 'national' }
    ],
    description: 'Sweet commodity from tropical plantations.',
    category: 'colonial'
  },
  {
    id: 'tobacco',
    name: 'Tobacco',
    icon: '🚬',
    basePrice: 4.0,
    modifiers: [
      { type: 'global_tariffs', value: 10, scope: 'national' },
      { type: 'colonist_placement_chance', value: 5, scope: 'national' }
    ],
    description: 'Addictive plant from the New World.',
    category: 'colonial'
  },
  {
    id: 'cotton',
    name: 'Cotton',
    icon: '☁️',
    basePrice: 3.5,
    modifiers: [
      { type: 'global_tariffs', value: 5, scope: 'national' },
      { type: 'trade_value', value: 10, scope: 'local' }
    ],
    description: 'Versatile fiber for textile production.',
    category: 'colonial'
  },
  {
    id: 'coffee',
    name: 'Coffee',
    icon: '☕',
    basePrice: 4.5,
    modifiers: [
      { type: 'global_tariffs', value: 10, scope: 'national' },
      { type: 'advisor_cost', value: -5, scope: 'national' }
    ],
    description: 'Stimulating beverage growing in popularity.',
    category: 'colonial'
  },
  {
    id: 'tea',
    name: 'Tea',
    icon: '🍵',
    basePrice: 4.5,
    modifiers: [
      { type: 'global_tariffs', value: 10, scope: 'national' },
      { type: 'prestige', value: 0.5, scope: 'national' }
    ],
    description: 'Refined beverage from Asia.',
    category: 'colonial'
  },
  {
    id: 'ivory',
    name: 'Ivory',
    icon: '🦏',
    basePrice: 4.0,
    modifiers: [
      { type: 'prestige', value: 1, scope: 'national' }
    ],
    description: 'Precious material from African elephants.',
    category: 'luxury'
  },
  {
    id: 'slaves',
    name: 'Slaves',
    icon: '⛓️',
    basePrice: 3.5,
    modifiers: [
      { type: 'local_production', value: 15, scope: 'local' }
    ],
    description: 'Forced labor for colonial enterprises.',
    category: 'colonial'
  },
  {
    id: 'gold',
    name: 'Gold',
    icon: '🥇',
    basePrice: 6.0,
    modifiers: [
      { type: 'local_tax', value: 100, scope: 'local' },
      { type: 'inflation', value: 0.5, scope: 'national' }
    ],
    description: 'Precious metal that directly fills the treasury.',
    category: 'luxury'
  },
  {
    id: 'gems',
    name: 'Gems',
    icon: '💎',
    basePrice: 5.0,
    modifiers: [
      { type: 'prestige', value: 1, scope: 'national' },
      { type: 'local_tax', value: 25, scope: 'local' }
    ],
    description: 'Precious stones valued for their beauty.',
    category: 'luxury'
  },
  {
    id: 'chinaware',
    name: 'Chinaware',
    icon: '🏺',
    basePrice: 5.0,
    modifiers: [
      { type: 'prestige', value: 0.5, scope: 'national' },
      { type: 'trade_efficiency', value: 10, scope: 'national' }
    ],
    description: 'Fine porcelain from the Orient.',
    category: 'luxury'
  },
  {
    id: 'paper',
    name: 'Paper',
    icon: '📜',
    basePrice: 3.5,
    modifiers: [
      { type: 'institution_spread', value: 10, scope: 'local' },
      { type: 'tech_cost', value: -5, scope: 'national' }
    ],
    description: 'Essential material for administration and learning.',
    category: 'basic'
  },
  {
    id: 'glass',
    name: 'Glass',
    icon: '🔮',
    basePrice: 3.5,
    modifiers: [
      { type: 'institution_spread', value: 10, scope: 'local' },
      { type: 'prestige', value: 0.25, scope: 'national' }
    ],
    description: 'Manufactured material for windows and vessels.',
    category: 'luxury'
  },
  {
    id: 'livestock',
    name: 'Livestock',
    icon: '🐄',
    basePrice: 2.0,
    modifiers: [
      { type: 'cavalry_cost', value: -10, scope: 'national' },
      { type: 'local_manpower', value: 5, scope: 'local' }
    ],
    description: 'Domesticated animals for food and labor.',
    category: 'basic'
  },
  {
    id: 'incense',
    name: 'Incense',
    icon: '🕯️',
    basePrice: 4.0,
    modifiers: [
      { type: 'tolerance_own', value: 1, scope: 'national' },
      { type: 'prestige', value: 0.5, scope: 'national' }
    ],
    description: 'Aromatic substance used in religious ceremonies.',
    category: 'luxury'
  },
  {
    id: 'tropical_wood',
    name: 'Tropical Wood',
    icon: '🪵',
    basePrice: 3.5,
    modifiers: [
      { type: 'ship_durability', value: 5, scope: 'national' },
      { type: 'naval_forcelimit', value: 10, scope: 'local' }
    ],
    description: 'Exotic hardwoods for shipbuilding and furniture.',
    category: 'colonial'
  },
  {
    id: 'cocoa',
    name: 'Cocoa',
    icon: '🍫',
    basePrice: 4.0,
    modifiers: [
      { type: 'global_tariffs', value: 10, scope: 'national' }
    ],
    description: 'Bean used to make chocolate beverages.',
    category: 'colonial'
  },
  {
    id: 'cloves',
    name: 'Cloves',
    icon: '🌸',
    basePrice: 5.5,
    modifiers: [
      { type: 'trade_efficiency', value: 20, scope: 'national' },
      { type: 'prestige', value: 0.25, scope: 'national' }
    ],
    description: 'Rare spice from the Moluccas.',
    category: 'colonial'
  }
];

// Get trade good by id
export function getTradeGood(id: string): TradeGood | undefined {
  return TRADE_GOODS.find(g => g.id === id);
}

// Get goods by category
export function getGoodsByCategory(category: GoodCategory): TradeGood[] {
  return TRADE_GOODS.filter(g => g.category === category);
}

// Calculate trade good value with modifiers
export function calculateGoodValue(
  goodId: string,
  productionEfficiency: number,
  tradeValueModifier: number
): number {
  const good = getTradeGood(goodId);
  if (!good) return 0;

  const baseValue = good.basePrice;
  const efficiencyBonus = baseValue * (productionEfficiency / 100);
  const tradeBonus = baseValue * (tradeValueModifier / 100);

  return baseValue + efficiencyBonus + tradeBonus;
}

// Get total modifiers from goods produced
export function aggregateGoodModifiers(
  goodIds: string[]
): Map<string, number> {
  const modifiers = new Map<string, number>();

  for (const goodId of goodIds) {
    const good = getTradeGood(goodId);
    if (!good) continue;

    for (const mod of good.modifiers) {
      const current = modifiers.get(mod.type) || 0;
      modifiers.set(mod.type, current + mod.value);
    }
  }

  return modifiers;
}

// Get most valuable goods
export function getMostValuableGoods(limit: number = 5): TradeGood[] {
  return [...TRADE_GOODS]
    .sort((a, b) => b.basePrice - a.basePrice)
    .slice(0, limit);
}

// Calculate market price with supply/demand
export function calculateMarketPrice(
  goodId: string,
  supply: number,
  demand: number
): number {
  const good = getTradeGood(goodId);
  if (!good) return 0;

  const ratio = demand / Math.max(supply, 1);
  const priceModifier = Math.min(Math.max(ratio, 0.5), 2.0);

  return good.basePrice * priceModifier;
}

export default {
  TRADE_GOODS,
  getTradeGood,
  getGoodsByCategory,
  calculateGoodValue,
  aggregateGoodModifiers,
  getMostValuableGoods,
  calculateMarketPrice
};
