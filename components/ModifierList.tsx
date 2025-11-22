import React, { useState } from 'react';
import {
  Modifier,
  ModifierType,
  MODIFIER_CATEGORIES,
  formatModifierValue,
  isEffectBeneficial,
  aggregateModifiers,
  getModifiersByType
} from '../data/modifierSystem';

interface ModifierListProps {
  modifiers: Modifier[];
  currentDate?: string;
  onClose: () => void;
}

type ViewMode = 'list' | 'summary';

export default function ModifierList({
  modifiers,
  currentDate = '1444-11-11',
  onClose
}: ModifierListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [filterType, setFilterType] = useState<ModifierType | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredModifiers = filterType === 'all'
    ? modifiers
    : getModifiersByType(modifiers, filterType);

  const aggregatedStats = aggregateModifiers(modifiers);

  const renderList = () => (
    <div className="space-y-2">
      {filteredModifiers.length === 0 ? (
        <div className="text-center py-8 text-stone-400">
          <div className="text-3xl mb-2">📊</div>
          <div>No active modifiers</div>
        </div>
      ) : (
        filteredModifiers.map(mod => {
          const isExpanded = expandedId === mod.id;

          return (
            <div
              key={mod.id}
              className={`bg-stone-700 rounded-lg overflow-hidden transition-all ${
                isExpanded ? 'ring-1 ring-amber-500' : ''
              }`}
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : mod.id)}
                className="w-full p-3 text-left flex items-center justify-between hover:bg-stone-600 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{mod.icon}</span>
                  <div>
                    <div className="font-medium text-amber-100">{mod.name}</div>
                    <div className="text-xs text-stone-400">{mod.source}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {mod.duration && (
                    <span className="text-xs text-stone-400">
                      {mod.duration}mo
                    </span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    mod.type === 'military' ? 'bg-red-900 text-red-300' :
                    mod.type === 'economic' ? 'bg-amber-900 text-amber-300' :
                    mod.type === 'diplomatic' ? 'bg-blue-900 text-blue-300' :
                    mod.type === 'administrative' ? 'bg-purple-900 text-purple-300' :
                    mod.type === 'religious' ? 'bg-yellow-900 text-yellow-300' :
                    'bg-green-900 text-green-300'
                  }`}>
                    {mod.type}
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div className="px-3 pb-3 border-t border-stone-600">
                  <div className="pt-3 space-y-2">
                    {mod.effects.map((effect, i) => {
                      const beneficial = isEffectBeneficial(effect);
                      return (
                        <div
                          key={i}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-stone-300">
                            {effect.stat.replace(/_/g, ' ')}
                          </span>
                          <span className={beneficial ? 'text-green-400' : 'text-red-400'}>
                            {formatModifierValue(effect)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-3 pt-2 border-t border-stone-600 text-xs text-stone-400">
                    <div className="flex justify-between">
                      <span>Scope:</span>
                      <span className="capitalize">{mod.scope}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Stackable:</span>
                      <span>{mod.stackable ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );

  const renderSummary = () => (
    <div className="space-y-4">
      {MODIFIER_CATEGORIES.map(category => {
        const categoryStats = category.stats.filter(stat =>
          aggregatedStats.has(stat.id)
        );

        if (categoryStats.length === 0) return null;

        return (
          <div key={category.id} className="bg-stone-700 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-3">
              <span>{category.icon}</span>
              <span className="font-medium text-amber-100">{category.name}</span>
            </div>

            <div className="space-y-2">
              {categoryStats.map(stat => {
                const value = aggregatedStats.get(stat.id) || 0;
                const beneficial = stat.isPositiveGood ? value > 0 : value < 0;

                return (
                  <div key={stat.id} className="flex justify-between text-sm">
                    <span className="text-stone-300">{stat.name}</span>
                    <span className={beneficial ? 'text-green-400' : 'text-red-400'}>
                      {value > 0 ? '+' : ''}{value}
                      {stat.format === 'percentage' ? '%' : ''}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {aggregatedStats.size === 0 && (
        <div className="text-center py-8 text-stone-400">
          <div className="text-3xl mb-2">📊</div>
          <div>No modifier effects</div>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-stone-800 rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-stone-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-amber-100">📊 Active Modifiers</h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200"
          >
            ✕
          </button>
        </div>

        {/* View toggle */}
        <div className="p-3 border-b border-stone-700 flex justify-between items-center">
          <div className="flex gap-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-xs rounded ${
                viewMode === 'list'
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('summary')}
              className={`px-3 py-1 text-xs rounded ${
                viewMode === 'summary'
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
              }`}
            >
              Summary
            </button>
          </div>

          {viewMode === 'list' && (
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as ModifierType | 'all')}
              className="bg-stone-700 text-stone-200 text-xs rounded px-2 py-1 border border-stone-600"
            >
              <option value="all">All Types</option>
              <option value="military">Military</option>
              <option value="economic">Economic</option>
              <option value="diplomatic">Diplomatic</option>
              <option value="administrative">Administrative</option>
              <option value="religious">Religious</option>
              <option value="provincial">Provincial</option>
            </select>
          )}
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          {viewMode === 'list' && renderList()}
          {viewMode === 'summary' && renderSummary()}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-stone-700 bg-stone-700/50">
          <div className="flex justify-between text-xs text-stone-400">
            <span>{modifiers.length} active modifiers</span>
            <span>{aggregatedStats.size} affected stats</span>
          </div>
        </div>
      </div>
    </div>
  );
}
