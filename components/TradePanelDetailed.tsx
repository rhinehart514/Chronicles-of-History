import React, { useState } from 'react';

export interface TradeGood {
  id: string;
  name: string;
  icon: string;
  basePrice: number;
  currentPrice: number;
  trend: 'rising' | 'stable' | 'falling';
  supply: number;
  demand: number;
}

export interface TradeRoute {
  id: string;
  from: string;
  to: string;
  good: string;
  volume: number;
  income: number;
  efficiency: number;
  risk: number;
}

export interface Merchant {
  id: string;
  name: string;
  skill: number;
  location: string;
  assignment: string | null;
}

interface TradePanelDetailedProps {
  isOpen: boolean;
  onClose: () => void;
  goods: TradeGood[];
  routes: TradeRoute[];
  merchants: Merchant[];
  tradePower: number;
  merchantCount: number;
  maxMerchants: number;
  onCreateRoute: (from: string, to: string, good: string) => void;
  onCancelRoute: (routeId: string) => void;
  onAssignMerchant: (merchantId: string, nodeId: string) => void;
}

export const TradePanelDetailed: React.FC<TradePanelDetailedProps> = ({
  isOpen,
  onClose,
  goods,
  routes,
  merchants,
  tradePower,
  merchantCount,
  maxMerchants,
  onCreateRoute,
  onCancelRoute,
  onAssignMerchant
}) => {
  const [tab, setTab] = useState<'goods' | 'routes' | 'merchants'>('goods');
  const [selectedGood, setSelectedGood] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalIncome = routes.reduce((sum, r) => sum + r.income, 0);

  const getTrendIcon = (trend: TradeGood['trend']) => {
    switch (trend) {
      case 'rising': return '📈';
      case 'falling': return '📉';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend: TradeGood['trend']) => {
    switch (trend) {
      case 'rising': return 'text-green-600';
      case 'falling': return 'text-red-600';
      default: return 'text-stone-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <h2 className="text-xl font-bold text-stone-800">💰 Trade & Commerce</h2>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Stats bar */}
        <div className="p-3 border-b border-stone-200 grid grid-cols-4 gap-4 bg-stone-100">
          <div className="text-center">
            <div className="text-xs text-stone-500">Trade Power</div>
            <div className="font-bold text-stone-800">{tradePower.toFixed(1)}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-stone-500">Trade Income</div>
            <div className="font-bold text-amber-600">+{totalIncome.toFixed(0)}💰</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-stone-500">Active Routes</div>
            <div className="font-bold text-stone-800">{routes.length}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-stone-500">Merchants</div>
            <div className="font-bold text-stone-800">{merchantCount}/{maxMerchants}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="p-2 border-b border-stone-200 flex gap-2">
          {(['goods', 'routes', 'merchants'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded text-sm font-medium ${
                tab === t
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {tab === 'goods' && (
            <div className="space-y-2">
              {goods.map(good => (
                <div
                  key={good.id}
                  onClick={() => setSelectedGood(good.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedGood === good.id
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{good.icon}</span>
                      <div>
                        <div className="font-semibold text-stone-800">{good.name}</div>
                        <div className="text-xs text-stone-500">
                          Base: {good.basePrice}💰
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-amber-600">
                        {good.currentPrice}💰
                      </div>
                      <div className={`text-xs flex items-center gap-1 ${getTrendColor(good.trend)}`}>
                        {getTrendIcon(good.trend)} {good.trend}
                      </div>
                    </div>
                  </div>

                  {selectedGood === good.id && (
                    <div className="mt-3 pt-3 border-t border-stone-200">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-stone-500">Supply:</span>
                          <div className="w-full bg-stone-200 rounded-full h-2 mt-1">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${Math.min(100, good.supply)}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <span className="text-stone-500">Demand:</span>
                          <div className="w-full bg-stone-200 rounded-full h-2 mt-1">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${Math.min(100, good.demand)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-stone-500">
                        Price modifier: {((good.demand / good.supply - 1) * 100).toFixed(0)}%
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {tab === 'routes' && (
            <div className="space-y-3">
              {routes.length === 0 ? (
                <p className="text-center text-stone-500 py-8">No active trade routes</p>
              ) : (
                routes.map(route => (
                  <div key={route.id} className="bg-stone-100 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold text-stone-800">
                          {route.from} → {route.to}
                        </div>
                        <div className="text-sm text-stone-500">
                          Trading {route.good} • {route.volume} units
                        </div>
                      </div>
                      <button
                        onClick={() => onCancelRoute(route.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-xs text-stone-500">Income</div>
                        <div className="font-bold text-amber-600">+{route.income}💰</div>
                      </div>
                      <div>
                        <div className="text-xs text-stone-500">Efficiency</div>
                        <div className="font-bold text-green-600">{route.efficiency}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-stone-500">Risk</div>
                        <div className={`font-bold ${route.risk > 50 ? 'text-red-600' : 'text-stone-600'}`}>
                          {route.risk}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'merchants' && (
            <div className="space-y-3">
              {merchants.length === 0 ? (
                <p className="text-center text-stone-500 py-8">No merchants available</p>
              ) : (
                merchants.map(merchant => (
                  <div key={merchant.id} className="bg-stone-100 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-stone-800">
                          👤 {merchant.name}
                        </div>
                        <div className="text-sm text-stone-500">
                          Skill: {'⭐'.repeat(merchant.skill)} • {merchant.location}
                        </div>
                      </div>
                      <div>
                        {merchant.assignment ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                            Assigned: {merchant.assignment}
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-stone-200 text-stone-600 rounded text-xs">
                            Idle
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradePanelDetailed;
