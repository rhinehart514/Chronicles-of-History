import React, { useState } from 'react';

interface DecisionsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  availableDecisions: Decision[];
  completedDecisions: string[];
  onExecuteDecision: (decisionId: string) => void;
}

export interface Decision {
  id: string;
  name: string;
  icon: string;
  category: DecisionCategory;
  description: string;
  requirements: DecisionRequirement[];
  effects: DecisionEffect[];
  aiWillDo: number;
  isFormation?: boolean;
  formTag?: string;
}

export type DecisionCategory = 'country' | 'religious' | 'economic' | 'military' | 'cultural';

export interface DecisionRequirement {
  type: string;
  value: string | number | boolean;
  description: string;
  met: boolean;
}

export interface DecisionEffect {
  type: 'add' | 'remove' | 'change' | 'unlock';
  target: string;
  value: string | number;
  description: string;
}

export const DecisionsPanel: React.FC<DecisionsPanelProps> = ({
  isOpen,
  onClose,
  availableDecisions,
  completedDecisions,
  onExecuteDecision
}) => {
  const [categoryFilter, setCategoryFilter] = useState<DecisionCategory | 'all'>('all');
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories: { id: DecisionCategory | 'all'; name: string; icon: string }[] = [
    { id: 'all', name: 'All', icon: '📋' },
    { id: 'country', name: 'Country', icon: '🏛️' },
    { id: 'religious', name: 'Religious', icon: '⛪' },
    { id: 'economic', name: 'Economic', icon: '💰' },
    { id: 'military', name: 'Military', icon: '⚔️' },
    { id: 'cultural', name: 'Cultural', icon: '🎭' }
  ];

  const filteredDecisions = categoryFilter === 'all'
    ? availableDecisions
    : availableDecisions.filter(d => d.category === categoryFilter);

  const selected = availableDecisions.find(d => d.id === selectedDecision);
  const isCompleted = selectedDecision ? completedDecisions.includes(selectedDecision) : false;

  const canExecute = (decision: Decision) => {
    return decision.requirements.every(req => req.met) &&
           !completedDecisions.includes(decision.id);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-stone-800">📜 Decisions</h2>
            <div className="text-sm text-stone-500">
              {availableDecisions.length} available • {completedDecisions.length} completed
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Category filter */}
        <div className="p-2 border-b border-stone-200 flex gap-1 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1 rounded text-sm ${
                categoryFilter === cat.id ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-700'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Decision list */}
          <div className="w-1/2 border-r border-stone-200 overflow-y-auto p-3">
            {filteredDecisions.length === 0 ? (
              <p className="text-center text-stone-500 py-8">No decisions available</p>
            ) : (
              <div className="space-y-2">
                {filteredDecisions.map(decision => {
                  const completed = completedDecisions.includes(decision.id);
                  const available = canExecute(decision);

                  return (
                    <button
                      key={decision.id}
                      onClick={() => setSelectedDecision(decision.id)}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        selectedDecision === decision.id
                          ? 'border-amber-500 bg-amber-50'
                          : completed
                          ? 'border-stone-200 bg-stone-100 opacity-60'
                          : available
                          ? 'border-green-300 bg-green-50'
                          : 'border-stone-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{decision.icon}</span>
                        <div className="flex-1">
                          <div className="font-semibold text-stone-800">
                            {decision.name}
                            {decision.isFormation && (
                              <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-1 rounded">
                                Formation
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-stone-500 capitalize">{decision.category}</div>
                        </div>
                        {completed && <span className="text-stone-400">✓</span>}
                        {!completed && available && <span className="text-green-500">!</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected decision details */}
          <div className="w-1/2 p-4 overflow-y-auto">
            {selected ? (
              <>
                <div className="text-center mb-4">
                  <span className="text-4xl">{selected.icon}</span>
                  <h3 className="font-bold text-stone-800 mt-2">{selected.name}</h3>
                  {selected.isFormation && (
                    <div className="text-sm text-purple-600 mt-1">
                      Form {selected.formTag}
                    </div>
                  )}
                </div>

                <p className="text-sm text-stone-600 mb-4 text-center">
                  {selected.description}
                </p>

                {/* Requirements */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-stone-600 mb-2">Requirements</h4>
                  <div className="space-y-1">
                    {selected.requirements.map((req, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-2 text-sm p-2 rounded ${
                          req.met ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}
                      >
                        <span>{req.met ? '✓' : '✗'}</span>
                        <span>{req.description}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Effects */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-stone-600 mb-2">Effects</h4>
                  <div className="space-y-1">
                    {selected.effects.map((effect, i) => (
                      <div
                        key={i}
                        className={`text-sm p-2 rounded ${
                          effect.type === 'add' || effect.type === 'unlock'
                            ? 'bg-green-50 text-green-700'
                            : effect.type === 'remove'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {effect.description}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action button */}
                {isCompleted ? (
                  <div className="text-center py-3 bg-stone-100 text-stone-500 rounded">
                    Already Completed
                  </div>
                ) : (
                  <button
                    onClick={() => onExecuteDecision(selected.id)}
                    disabled={!canExecute(selected)}
                    className={`w-full py-3 rounded font-medium ${
                      canExecute(selected)
                        ? 'bg-amber-600 text-white hover:bg-amber-700'
                        : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                    }`}
                  >
                    {canExecute(selected) ? 'Execute Decision' : 'Requirements Not Met'}
                  </button>
                )}
              </>
            ) : (
              <p className="text-center text-stone-500 py-8">
                Select a decision to view details
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionsPanel;
