import React, { useState } from 'react';
import { Nation } from '../types';
import {
  Resources,
  ResourceBalance,
  RESOURCE_ICONS,
  RESOURCE_DESCRIPTIONS
} from '../services/resourceService';

interface EconomyPanelProps {
  isOpen: boolean;
  onClose: () => void;
  nation: Nation;
  resources: Resources;
  balances: ResourceBalance[];
  tradeRoutes?: { partner: string; resource: keyof Resources; amount: number; income: number }[];
  onBuildImprovement?: (type: string) => void;
  onTrade?: (resource: keyof Resources, amount: number, buy: boolean) => void;
}

export const EconomyPanel: React.FC<EconomyPanelProps> = ({
  isOpen,
  onClose,
  nation,
  resources,
  balances,
  tradeRoutes = [],
  onBuildImprovement,
  onTrade
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'trade' | 'improvements'>('overview');

  if (!isOpen) return null;

  const getBalanceColor = (net: number) => {
    if (net > 5) return 'text-green-600';
    if (net > 0) return 'text-green-500';
    if (net === 0) return 'text-stone-500';
    if (net > -5) return 'text-orange-500';
    return 'text-red-600';
  };

  const totalIncome = balances.reduce((sum, b) => sum + Math.max(0, b.net), 0);
  const totalExpenses = balances.reduce((sum, b) => sum + Math.abs(Math.min(0, b.net)), 0);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border-4 border-amber-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <h2 className="text-xl font-bold text-stone-800">💰 Economy - {nation.name}</h2>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Summary bar */}
        <div className="p-3 bg-stone-100 border-b border-stone-200 flex justify-around text-sm">
          <div className="text-center">
            <div className="text-green-600 font-bold">+{totalIncome}</div>
            <div className="text-xs text-stone-500">Income</div>
          </div>
          <div className="text-center">
            <div className="text-red-600 font-bold">-{totalExpenses}</div>
            <div className="text-xs text-stone-500">Expenses</div>
          </div>
          <div className="text-center">
            <div className={`font-bold ${getBalanceColor(totalIncome - totalExpenses)}`}>
              {totalIncome - totalExpenses >= 0 ? '+' : ''}{totalIncome - totalExpenses}
            </div>
            <div className="text-xs text-stone-500">Net</div>
          </div>
          <div className="text-center">
            <div className="text-amber-600 font-bold">{resources.treasury}</div>
            <div className="text-xs text-stone-500">Treasury</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-200">
          {(['overview', 'trade', 'improvements'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 font-semibold capitalize text-sm ${
                activeTab === tab
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'overview' && (
            <div className="space-y-3">
              {balances.map((balance) => (
                <div
                  key={balance.resource}
                  className="bg-white p-3 rounded border border-stone-200"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {RESOURCE_ICONS[balance.resource]}
                      </span>
                      <div>
                        <div className="font-semibold text-stone-800 capitalize">
                          {balance.resource}
                        </div>
                        <div className="text-xs text-stone-500">
                          {RESOURCE_DESCRIPTIONS[balance.resource]}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-stone-800">{balance.reserves}</div>
                      <div className={`text-sm font-semibold ${getBalanceColor(balance.net)}`}>
                        {balance.net >= 0 ? '+' : ''}{balance.net}/turn
                      </div>
                    </div>
                  </div>

                  {/* Production/Consumption bar */}
                  <div className="flex gap-4 text-xs">
                    <div className="flex-1">
                      <div className="flex justify-between text-stone-500 mb-1">
                        <span>Production</span>
                        <span className="text-green-600">+{balance.production}</span>
                      </div>
                      <div className="w-full bg-stone-200 rounded h-1.5">
                        <div
                          className="bg-green-500 h-1.5 rounded"
                          style={{ width: `${Math.min(100, (balance.production / 50) * 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-stone-500 mb-1">
                        <span>Consumption</span>
                        <span className="text-red-600">-{balance.consumption}</span>
                      </div>
                      <div className="w-full bg-stone-200 rounded h-1.5">
                        <div
                          className="bg-red-500 h-1.5 rounded"
                          style={{ width: `${Math.min(100, (balance.consumption / 50) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Warning */}
                  {balance.turnsUntilDepletion && balance.turnsUntilDepletion <= 5 && (
                    <div className="mt-2 text-xs text-red-600 font-semibold">
                      ⚠️ Will be depleted in {balance.turnsUntilDepletion} turns!
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'trade' && (
            <div className="space-y-4">
              {/* Active trade routes */}
              <div>
                <h3 className="font-semibold text-stone-800 mb-2">Active Trade Routes</h3>
                {tradeRoutes.length === 0 ? (
                  <p className="text-stone-500 text-sm">No active trade routes</p>
                ) : (
                  <div className="space-y-2">
                    {tradeRoutes.map((route, i) => (
                      <div key={i} className="bg-white p-3 rounded border border-stone-200 flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-stone-800">{route.partner}</div>
                          <div className="text-sm text-stone-600">
                            {RESOURCE_ICONS[route.resource]} {route.amount} {route.resource}
                          </div>
                        </div>
                        <div className="text-green-600 font-bold">
                          +{route.income} 💰
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Trade actions */}
              <div>
                <h3 className="font-semibold text-stone-800 mb-2">Quick Trade</h3>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(RESOURCE_ICONS) as (keyof Resources)[])
                    .filter(r => r !== 'treasury')
                    .map((resource) => (
                      <div key={resource} className="bg-white p-2 rounded border border-stone-200">
                        <div className="flex items-center gap-2 mb-2">
                          <span>{RESOURCE_ICONS[resource]}</span>
                          <span className="text-sm font-medium capitalize">{resource}</span>
                          <span className="text-xs text-stone-500 ml-auto">
                            {resources[resource]}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => onTrade?.(resource, 10, true)}
                            className="flex-1 text-xs py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                          >
                            Buy
                          </button>
                          <button
                            onClick={() => onTrade?.(resource, 10, false)}
                            className="flex-1 text-xs py-1 bg-amber-100 text-amber-700 rounded hover:bg-amber-200"
                          >
                            Sell
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'improvements' && (
            <div className="space-y-4">
              <p className="text-sm text-stone-600">
                Build improvements to boost resource production.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'farm', name: 'Farm', icon: '🌾', cost: 50, bonus: '+5 Food/turn' },
                  { id: 'mine', name: 'Mine', icon: '⛏️', cost: 80, bonus: '+3 Iron, +2 Coal/turn' },
                  { id: 'workshop', name: 'Workshop', icon: '🔨', cost: 100, bonus: '+4 Textiles/turn' },
                  { id: 'market', name: 'Market', icon: '🏪', cost: 60, bonus: '+8 Treasury/turn' },
                  { id: 'barracks', name: 'Barracks', icon: '🏛️', cost: 120, bonus: '+5 Manpower/turn' },
                  { id: 'university', name: 'University', icon: '📚', cost: 150, bonus: '+Innovation' },
                ].map((improvement) => (
                  <button
                    key={improvement.id}
                    onClick={() => onBuildImprovement?.(improvement.id)}
                    disabled={resources.treasury < improvement.cost}
                    className={`p-3 rounded border-2 text-left ${
                      resources.treasury >= improvement.cost
                        ? 'bg-white border-stone-200 hover:border-amber-400'
                        : 'bg-stone-100 border-stone-200 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{improvement.icon}</span>
                      <span className="font-semibold text-stone-800">{improvement.name}</span>
                    </div>
                    <div className="text-xs text-green-600 mb-1">{improvement.bonus}</div>
                    <div className="text-xs text-amber-600">Cost: {improvement.cost} 💰</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EconomyPanel;
