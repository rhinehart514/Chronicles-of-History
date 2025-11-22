import React, { useState } from 'react';
import {
  DiplomaticAction,
  ActionCategory,
  RelationModifier,
  DIPLOMATIC_ACTIONS,
  getActionsByCategory,
  canPerformAction,
  getRelationDescription,
  getRelationColor
} from '../data/diplomaticActions';

interface DiplomacyActionPanelProps {
  targetNation: string;
  relations: number;
  relationModifiers: RelationModifier[];
  gameState: Record<string, any>;
  playerResources: {
    diplomatic_power: number;
    prestige: number;
    gold: number;
    favors: number;
  };
  onClose: () => void;
  onPerformAction?: (actionId: string) => void;
}

export default function DiplomacyActionPanel({
  targetNation,
  relations,
  relationModifiers,
  gameState,
  playerResources,
  onClose,
  onPerformAction
}: DiplomacyActionPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<ActionCategory | 'all'>('all');
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const categories: { id: ActionCategory | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'All', icon: '📋' },
    { id: 'alliance', label: 'Alliance', icon: '🤝' },
    { id: 'vassalage', label: 'Vassalage', icon: '👑' },
    { id: 'war', label: 'War', icon: '⚔️' },
    { id: 'trade', label: 'Trade', icon: '📦' },
    { id: 'influence', label: 'Influence', icon: '❤️' },
    { id: 'dynasty', label: 'Dynasty', icon: '💍' }
  ];

  const filteredActions = selectedCategory === 'all'
    ? DIPLOMATIC_ACTIONS
    : getActionsByCategory(selectedCategory);

  const canAffordAction = (action: DiplomaticAction): boolean => {
    const cost = action.cost;
    if (cost.diplomatic_power && playerResources.diplomatic_power < cost.diplomatic_power) return false;
    if (cost.prestige && playerResources.prestige < cost.prestige) return false;
    if (cost.gold && playerResources.gold < cost.gold) return false;
    if (cost.favors && playerResources.favors < cost.favors) return false;
    return true;
  };

  const formatCost = (action: DiplomaticAction): string => {
    const parts: string[] = [];
    const cost = action.cost;
    if (cost.diplomatic_power) parts.push(`${cost.diplomatic_power} DIP`);
    if (cost.prestige) parts.push(`${cost.prestige} Prestige`);
    if (cost.gold) parts.push(`${cost.gold} Gold`);
    if (cost.favors) parts.push(`${cost.favors} Favors`);
    return parts.length > 0 ? parts.join(', ') : 'Free';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-stone-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-stone-700">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-amber-100">
                🤝 Diplomacy with {targetNation}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-stone-400">Relations:</span>
                <span className={`text-lg font-bold ${getRelationColor(relations)}`}>
                  {relations}
                </span>
                <span className={`text-sm ${getRelationColor(relations)}`}>
                  ({getRelationDescription(relations)})
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-200"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Relation modifiers */}
        {relationModifiers.length > 0 && (
          <div className="p-3 border-b border-stone-700 bg-stone-700/50">
            <div className="text-xs text-stone-400 mb-2">Relation Modifiers</div>
            <div className="flex flex-wrap gap-1">
              {relationModifiers.map((mod, i) => (
                <span
                  key={i}
                  className={`text-xs px-2 py-0.5 rounded ${
                    mod.value > 0 ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                  }`}
                >
                  {mod.source}: {mod.value > 0 ? '+' : ''}{mod.value}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Category filters */}
        <div className="p-2 border-b border-stone-700 flex gap-1 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2 py-1 text-xs rounded whitespace-nowrap flex items-center gap-1 transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Actions list */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {filteredActions.map(action => {
              const canPerform = canPerformAction(action, gameState);
              const canAfford = canAffordAction(action);
              const isExpanded = showDetails === action.id;

              return (
                <div
                  key={action.id}
                  className={`bg-stone-700 rounded-lg overflow-hidden ${
                    !canPerform || !canAfford ? 'opacity-60' : ''
                  }`}
                >
                  <div
                    className="p-3 cursor-pointer hover:bg-stone-600 transition-colors"
                    onClick={() => setShowDetails(isExpanded ? null : action.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{action.icon}</span>
                        <div>
                          <div className="font-medium text-amber-100">{action.name}</div>
                          <div className="text-xs text-stone-400">{formatCost(action)}</div>
                        </div>
                      </div>
                      {onPerformAction && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onPerformAction(action.id);
                          }}
                          disabled={!canPerform || !canAfford}
                          className={`px-3 py-1 text-xs rounded ${
                            canPerform && canAfford
                              ? 'bg-amber-600 hover:bg-amber-700 text-white'
                              : 'bg-stone-600 text-stone-400 cursor-not-allowed'
                          }`}
                        >
                          {!canPerform ? 'Requirements' : !canAfford ? 'Cost' : 'Perform'}
                        </button>
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-3 pb-3 border-t border-stone-600">
                      <p className="text-xs text-stone-400 py-2">
                        {action.description}
                      </p>

                      {action.requirements.length > 0 && (
                        <div className="mb-2">
                          <div className="text-xs text-stone-400 mb-1">Requirements:</div>
                          <div className="space-y-1">
                            {action.requirements.map((req, i) => {
                              const met = gameState[req.type] !== undefined;
                              return (
                                <div
                                  key={i}
                                  className={`text-xs px-2 py-1 rounded ${
                                    met ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                                  }`}
                                >
                                  {req.type.replace(/_/g, ' ')}: {
                                    req.operator
                                      ? `${req.operator} ${req.value}`
                                      : String(req.value)
                                  }
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div>
                        <div className="text-xs text-stone-400 mb-1">Effects:</div>
                        <div className="space-y-1">
                          {action.effects.map((effect, i) => (
                            <div
                              key={i}
                              className="text-xs bg-stone-800 px-2 py-1 rounded"
                            >
                              {effect.type.replace(/_/g, ' ')}: {effect.value}
                              {effect.duration && effect.duration > 0 && ` (${effect.duration}mo)`}
                            </div>
                          ))}
                        </div>
                      </div>

                      {action.cooldown && (
                        <div className="text-xs text-stone-500 mt-2">
                          Cooldown: {action.cooldown} months
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Resources footer */}
        <div className="p-3 border-t border-stone-700 bg-stone-700/50">
          <div className="flex justify-between text-xs">
            <span className="text-stone-400">Your Resources:</span>
            <div className="flex gap-3">
              <span>
                <span className="text-blue-400">{playerResources.diplomatic_power}</span> DIP
              </span>
              <span>
                <span className="text-amber-400">{playerResources.prestige}</span> Prestige
              </span>
              <span>
                <span className="text-yellow-400">{playerResources.gold}</span> Gold
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
