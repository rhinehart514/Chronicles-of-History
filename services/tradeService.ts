// Trade route and commerce system

import { NationStats } from '../types';
import { Resources } from './resourceService';

export interface TradeRoute {
  id: string;
  partnerNationId: string;
  partnerName: string;
  type: TradeType;
  resources: TradeResource[];
  income: number;
  duration: number; // -1 for permanent
  turnsRemaining: number;
  relationBonus: number;
  active: boolean;
}

export type TradeType = 'bilateral' | 'export' | 'import' | 'exclusive';

export interface TradeResource {
  resource: keyof Resources;
  amount: number;
  direction: 'export' | 'import';
  value: number;
}

export interface TradeAgreement {
  id: string;
  name: string;
  description: string;
  type: TradeType;
  duration: number;
  requirements: {
    minRelation?: number;
    minPrestige?: number;
    resources?: Partial<Resources>;
  };
  benefits: {
    income: number;
    relationBonus: number;
    statBonuses?: Partial<NationStats>;
  };
}

// Trade agreement templates
export const TRADE_AGREEMENTS: TradeAgreement[] = [
  {
    id: 'basic_trade',
    name: 'Basic Trade Agreement',
    description: 'Simple exchange of goods',
    type: 'bilateral',
    duration: 10,
    requirements: {
      minRelation: 0
    },
    benefits: {
      income: 5,
      relationBonus: 5
    }
  },
  {
    id: 'commercial_treaty',
    name: 'Commercial Treaty',
    description: 'Comprehensive trade deal with tariff reductions',
    type: 'bilateral',
    duration: 20,
    requirements: {
      minRelation: 20,
      minPrestige: 2
    },
    benefits: {
      income: 15,
      relationBonus: 10,
      statBonuses: { economy: 0.2 }
    }
  },
  {
    id: 'exclusive_rights',
    name: 'Exclusive Trading Rights',
    description: 'Monopoly on trade with this nation',
    type: 'exclusive',
    duration: 30,
    requirements: {
      minRelation: 50,
      minPrestige: 3
    },
    benefits: {
      income: 30,
      relationBonus: 15,
      statBonuses: { economy: 0.4, prestige: 0.2 }
    }
  },
  {
    id: 'resource_export',
    name: 'Resource Export Deal',
    description: 'Sell surplus resources at premium prices',
    type: 'export',
    duration: 15,
    requirements: {
      minRelation: 10
    },
    benefits: {
      income: 20,
      relationBonus: 5
    }
  },
  {
    id: 'technology_trade',
    name: 'Technology Exchange',
    description: 'Share technological advances',
    type: 'bilateral',
    duration: 25,
    requirements: {
      minRelation: 30,
      minPrestige: 3
    },
    benefits: {
      income: 5,
      relationBonus: 15,
      statBonuses: { innovation: 0.3 }
    }
  }
];

// Market prices (fluctuate based on supply/demand)
export interface MarketPrices {
  treasury: number;
  manpower: number;
  food: number;
  iron: number;
  coal: number;
  textiles: number;
  luxuries: number;
}

export const BASE_PRICES: MarketPrices = {
  treasury: 1,
  manpower: 5,
  food: 2,
  iron: 8,
  coal: 6,
  textiles: 4,
  luxuries: 15
};

// Calculate trade route income
export function calculateRouteIncome(route: TradeRoute, prices: MarketPrices): number {
  let income = 0;

  for (const res of route.resources) {
    const price = prices[res.resource];
    if (res.direction === 'export') {
      income += res.amount * price * 0.8; // 80% of value for exports
    } else {
      income -= res.amount * price * 1.2; // 120% cost for imports
    }
  }

  return Math.round(income);
}

// Get total trade income from all routes
export function getTotalTradeIncome(routes: TradeRoute[], prices: MarketPrices): number {
  return routes
    .filter(r => r.active)
    .reduce((sum, route) => sum + calculateRouteIncome(route, prices), 0);
}

// Check if nation can establish trade agreement
export function canEstablishTrade(
  agreement: TradeAgreement,
  relation: number,
  prestige: number,
  resources: Resources
): { canEstablish: boolean; reason?: string } {
  if (agreement.requirements.minRelation && relation < agreement.requirements.minRelation) {
    return { canEstablish: false, reason: `Requires ${agreement.requirements.minRelation} relation` };
  }

  if (agreement.requirements.minPrestige && prestige < agreement.requirements.minPrestige) {
    return { canEstablish: false, reason: `Requires ${agreement.requirements.minPrestige} prestige` };
  }

  if (agreement.requirements.resources) {
    for (const [res, amount] of Object.entries(agreement.requirements.resources)) {
      if (resources[res as keyof Resources] < amount) {
        return { canEstablish: false, reason: `Insufficient ${res}` };
      }
    }
  }

  return { canEstablish: true };
}

// Create a new trade route
export function createTradeRoute(
  agreement: TradeAgreement,
  partnerId: string,
  partnerName: string,
  resources: TradeResource[]
): TradeRoute {
  return {
    id: `trade_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    partnerNationId: partnerId,
    partnerName,
    type: agreement.type,
    resources,
    income: agreement.benefits.income,
    duration: agreement.duration,
    turnsRemaining: agreement.duration,
    relationBonus: agreement.benefits.relationBonus,
    active: true
  };
}

// Process trade routes each turn
export function processTradeRoutes(routes: TradeRoute[]): TradeRoute[] {
  return routes.map(route => {
    if (!route.active || route.duration === -1) return route;

    const updated = { ...route, turnsRemaining: route.turnsRemaining - 1 };

    if (updated.turnsRemaining <= 0) {
      updated.active = false;
    }

    return updated;
  });
}

// Calculate market price fluctuation
export function updateMarketPrices(
  basePrices: MarketPrices,
  globalSupply: Partial<Resources>,
  globalDemand: Partial<Resources>
): MarketPrices {
  const updated = { ...basePrices };

  for (const key of Object.keys(basePrices) as (keyof MarketPrices)[]) {
    const supply = globalSupply[key as keyof Resources] || 100;
    const demand = globalDemand[key as keyof Resources] || 100;

    // Price increases when demand > supply
    const ratio = demand / supply;
    updated[key] = Math.round(basePrices[key] * ratio * 10) / 10;

    // Clamp prices
    updated[key] = Math.max(basePrices[key] * 0.5, Math.min(basePrices[key] * 2, updated[key]));
  }

  return updated;
}

// Get trade stat bonuses from all active routes
export function getTradeStatBonuses(routes: TradeRoute[], agreements: TradeAgreement[]): Partial<NationStats> {
  const bonuses: Partial<NationStats> = {};

  for (const route of routes.filter(r => r.active)) {
    const agreement = agreements.find(a => a.type === route.type);
    if (agreement?.benefits.statBonuses) {
      for (const [stat, value] of Object.entries(agreement.benefits.statBonuses)) {
        const key = stat as keyof NationStats;
        bonuses[key] = (bonuses[key] || 0) + value;
      }
    }
  }

  return bonuses;
}

// Calculate trade power
export function calculateTradePower(
  economy: number,
  routes: TradeRoute[],
  navalStrength: number
): number {
  const basepower = economy * 10;
  const routeBonus = routes.filter(r => r.active).length * 5;
  const navalBonus = navalStrength * 2;

  return basepower + routeBonus + navalBonus;
}

export default {
  TRADE_AGREEMENTS,
  BASE_PRICES,
  calculateRouteIncome,
  getTotalTradeIncome,
  canEstablishTrade,
  createTradeRoute,
  processTradeRoutes,
  updateMarketPrices,
  getTradeStatBonuses,
  calculateTradePower
};
