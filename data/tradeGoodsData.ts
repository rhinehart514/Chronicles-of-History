// Trade goods data

export interface TradeGood {
  id: string;
  name: string;
  basePrice: number;
  modifiers: {
    production?: number;
    tax?: number;
    manpower?: number;
    tradePower?: number;
    navalForceLimit?: number;
    localDefensiveness?: number;
  };
}

export const tradeGoods: Record<string, TradeGood> = {
  grain: {
    id: 'grain',
    name: 'Grain',
    basePrice: 2.5,
    modifiers: { manpower: 0.5 },
  },
  wine: {
    id: 'wine',
    name: 'Wine',
    basePrice: 2.5,
    modifiers: { tax: 0.1 },
  },
  wool: {
    id: 'wool',
    name: 'Wool',
    basePrice: 2.5,
    modifiers: {},
  },
  cloth: {
    id: 'cloth',
    name: 'Cloth',
    basePrice: 3.0,
    modifiers: { production: 0.1 },
  },
  fish: {
    id: 'fish',
    name: 'Fish',
    basePrice: 2.5,
    modifiers: { navalForceLimit: 0.1 },
  },
  fur: {
    id: 'fur',
    name: 'Fur',
    basePrice: 2.0,
    modifiers: {},
  },
  salt: {
    id: 'salt',
    name: 'Salt',
    basePrice: 3.0,
    modifiers: { localDefensiveness: 0.15 },
  },
  iron: {
    id: 'iron',
    name: 'Iron',
    basePrice: 3.0,
    modifiers: { manpower: 0.1 },
  },
  copper: {
    id: 'copper',
    name: 'Copper',
    basePrice: 3.0,
    modifiers: { tradePower: 0.1 },
  },
  gold: {
    id: 'gold',
    name: 'Gold',
    basePrice: 6.0,
    modifiers: { production: -1 }, // Gold gives direct income instead
  },
  ivory: {
    id: 'ivory',
    name: 'Ivory',
    basePrice: 4.0,
    modifiers: {},
  },
  slaves: {
    id: 'slaves',
    name: 'Slaves',
    basePrice: 2.0,
    modifiers: {},
  },
  spices: {
    id: 'spices',
    name: 'Spices',
    basePrice: 5.0,
    modifiers: { tradePower: 0.2 },
  },
  silk: {
    id: 'silk',
    name: 'Silk',
    basePrice: 4.0,
    modifiers: { tradePower: 0.15 },
  },
  gems: {
    id: 'gems',
    name: 'Gems',
    basePrice: 4.0,
    modifiers: { production: 0.15 },
  },
  sugar: {
    id: 'sugar',
    name: 'Sugar',
    basePrice: 3.0,
    modifiers: {},
  },
  tobacco: {
    id: 'tobacco',
    name: 'Tobacco',
    basePrice: 3.0,
    modifiers: {},
  },
  coffee: {
    id: 'coffee',
    name: 'Coffee',
    basePrice: 3.0,
    modifiers: {},
  },
  cotton: {
    id: 'cotton',
    name: 'Cotton',
    basePrice: 3.0,
    modifiers: {},
  },
  dyes: {
    id: 'dyes',
    name: 'Dyes',
    basePrice: 4.0,
    modifiers: {},
  },
  naval_supplies: {
    id: 'naval_supplies',
    name: 'Naval Supplies',
    basePrice: 3.5,
    modifiers: { navalForceLimit: 0.5 },
  },
  paper: {
    id: 'paper',
    name: 'Paper',
    basePrice: 3.5,
    modifiers: {},
  },
  glass: {
    id: 'glass',
    name: 'Glass',
    basePrice: 3.5,
    modifiers: { production: 0.1 },
  },
  chinaware: {
    id: 'chinaware',
    name: 'Chinaware',
    basePrice: 3.5,
    modifiers: { production: 0.1 },
  },
};

export const tradeGoodsList = Object.values(tradeGoods);

export function getTradeGood(id: string): TradeGood | undefined {
  return tradeGoods[id];
}
