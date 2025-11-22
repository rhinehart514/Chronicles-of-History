import React, { useState } from 'react';
import {
  TradeGood,
  GoodCategory,
  TRADE_GOODS,
  getGoodsByCategory,
  getMostValuableGoods
} from '../data/tradeGoods';

interface MarketPanelProps {
  producedGoods?: string[];
  priceModifiers?: Map<string, number>;
  onClose: () => void;
}

type FilterCategory = 'all' | GoodCategory;

export default function MarketPanel({
  producedGoods = [],
  priceModifiers = new Map(),
  onClose
}: MarketPanelProps) {
  const [filter, setFilter] = useState<FilterCategory>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'category'>('price');
  const [selectedGood, setSelectedGood] = useState<TradeGood | null>(null);

  const categories: { id: FilterCategory; label: string }[] = [
    { id: 'all', label: 'All Goods' },
    { id: 'basic', label: 'Basic' },
    { id: 'luxury', label: 'Luxury' },
    { id: 'military', label: 'Military' },
    { id: 'colonial', label: 'Colonial' }
  ];

  const filteredGoods = filter === 'all'
    ? TRADE_GOODS
    : getGoodsByCategory(filter);

  const sortedGoods = [...filteredGoods].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price':
        return b.basePrice - a.basePrice;
      case 'category':
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  const getEffectivePrice = (good: TradeGood): number => {
    const modifier = priceModifiers.get(good.id) || 0;
    return good.basePrice * (1 + modifier / 100);
  };

  const categoryColors: Record<GoodCategory, string> = {
    basic: 'bg-stone-600',
    luxury: 'bg-purple-600',
    military: 'bg-red-600',
    colonial: 'bg-green-600'
  };

  const mostValuable = getMostValuableGoods(3);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-stone-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-stone-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-amber-100">🏪 Trade Goods Market</h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200"
          >
            ✕
          </button>
        </div>

        {/* Top valuable goods */}
        <div className="p-3 border-b border-stone-700 bg-stone-700/50">
          <div className="text-xs text-stone-400 mb-2">Most Valuable Goods</div>
          <div className="flex gap-3">
            {mostValuable.map(good => (
              <div
                key={good.id}
                className="flex items-center gap-2 bg-amber-900/30 px-3 py-1.5 rounded"
              >
                <span>{good.icon}</span>
                <span className="text-sm text-amber-100">{good.name}</span>
                <span className="text-sm font-bold text-amber-400">
                  {good.basePrice.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="p-3 border-b border-stone-700 flex justify-between items-center">
          <div className="flex gap-1">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  filter === cat.id
                    ? 'bg-amber-600 text-white'
                    : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-stone-700 text-stone-200 text-xs rounded px-2 py-1 border border-stone-600"
            >
              <option value="price">Price</option>
              <option value="name">Name</option>
              <option value="category">Category</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Goods list */}
          <div className="flex-1 overflow-y-auto p-3">
            <div className="grid grid-cols-2 gap-2">
              {sortedGoods.map(good => {
                const isProduced = producedGoods.includes(good.id);
                const effectivePrice = getEffectivePrice(good);

                return (
                  <button
                    key={good.id}
                    onClick={() => setSelectedGood(good)}
                    className={`p-3 rounded text-left transition-colors ${
                      selectedGood?.id === good.id
                        ? 'bg-amber-900/30 border border-amber-700'
                        : 'bg-stone-700 hover:bg-stone-600'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{good.icon}</span>
                        <div>
                          <div className="text-sm font-medium text-amber-100">
                            {good.name}
                          </div>
                          <span className={`text-xs px-1.5 py-0.5 rounded ${categoryColors[good.category]}`}>
                            {good.category}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-amber-400">
                          {effectivePrice.toFixed(1)} 💰
                        </div>
                        {isProduced && (
                          <span className="text-xs text-green-400">Producing</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details panel */}
          {selectedGood && (
            <div className="w-64 border-l border-stone-700 p-4 overflow-y-auto">
              <div className="text-center mb-4">
                <span className="text-4xl">{selectedGood.icon}</span>
                <h3 className="text-lg font-bold text-amber-100 mt-2">
                  {selectedGood.name}
                </h3>
                <span className={`text-xs px-2 py-0.5 rounded ${categoryColors[selectedGood.category]}`}>
                  {selectedGood.category}
                </span>
              </div>

              <div className="bg-stone-700 rounded p-3 mb-4">
                <div className="text-sm text-stone-400">Base Price</div>
                <div className="text-2xl font-bold text-amber-400">
                  {selectedGood.basePrice.toFixed(1)} 💰
                </div>
              </div>

              <p className="text-xs text-stone-400 mb-4">
                {selectedGood.description}
              </p>

              <div>
                <h4 className="text-sm font-medium text-stone-300 mb-2">
                  Production Bonuses
                </h4>
                <div className="space-y-2">
                  {selectedGood.modifiers.map((mod, i) => (
                    <div
                      key={i}
                      className={`text-xs p-2 rounded ${
                        mod.value > 0 ? 'bg-green-900/30' : 'bg-red-900/30'
                      }`}
                    >
                      <div className="flex justify-between">
                        <span className="text-stone-300">
                          {mod.type.replace(/_/g, ' ')}
                        </span>
                        <span className={mod.value > 0 ? 'text-green-400' : 'text-red-400'}>
                          {mod.value > 0 ? '+' : ''}{mod.value}
                          {mod.type.includes('modifier') || mod.type.includes('efficiency') ? '%' : ''}
                        </span>
                      </div>
                      <div className="text-stone-500 mt-1">
                        Scope: {mod.scope}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {producedGoods.includes(selectedGood.id) && (
                <div className="mt-4 bg-green-900/30 border border-green-700 rounded p-3">
                  <div className="text-xs text-green-400 font-medium">
                    ✓ Your nation produces this good
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="p-3 border-t border-stone-700 bg-stone-700/50">
          <div className="flex justify-between text-sm">
            <span className="text-stone-400">
              Showing {sortedGoods.length} goods
            </span>
            {producedGoods.length > 0 && (
              <span className="text-green-400">
                Producing {producedGoods.length} goods
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
