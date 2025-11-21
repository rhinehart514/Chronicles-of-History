// Player Actions Panel - World Spirit guidance filtered through ruler competence

import React, { useState } from 'react';
import { Nation } from '../types';
import {
  ActionCategory,
  PlayerAction,
  getAvailablePlayerActions,
  getActionsByCategory,
  calculateActionSuccess,
  executePlayerAction
} from '../data/playerActionsAdvanced';
import {
  Coins,
  Sword,
  Eye,
  Home,
  Handshake,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface PlayerActionsPanelProps {
  nation: Nation;
  onActionExecuted: (result: {
    success: boolean;
    narrative: string;
    statChanges: Partial<Nation['stats']>;
    specialEffect?: string;
  }) => void;
  actionsRemaining: number;
  maxActions: number;
}

const CATEGORY_ICONS: Record<ActionCategory, React.ReactNode> = {
  ECONOMIC: <Coins size={16} />,
  MILITARY: <Sword size={16} />,
  ESPIONAGE: <Eye size={16} />,
  DOMESTIC: <Home size={16} />,
  DIPLOMATIC: <Handshake size={16} />
};

const CATEGORY_LABELS: Record<ActionCategory, string> = {
  ECONOMIC: 'Treasury',
  MILITARY: 'War Council',
  ESPIONAGE: 'Intelligence',
  DOMESTIC: 'Domestic Affairs',
  DIPLOMATIC: 'Foreign Office'
};

const PlayerActionsPanel: React.FC<PlayerActionsPanelProps> = ({
  nation,
  onActionExecuted,
  actionsRemaining,
  maxActions
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ActionCategory>('ECONOMIC');
  const [selectedAction, setSelectedAction] = useState<PlayerAction | null>(null);
  const [lastResult, setLastResult] = useState<{
    success: boolean;
    narrative: string;
  } | null>(null);

  const categories: ActionCategory[] = ['ECONOMIC', 'MILITARY', 'ESPIONAGE', 'DOMESTIC', 'DIPLOMATIC'];
  const availableActions = getActionsByCategory(nation, selectedCategory);

  const handleExecuteAction = (action: PlayerAction) => {
    if (actionsRemaining <= 0) return;

    const result = executePlayerAction(action, nation);
    setLastResult({ success: result.success, narrative: result.narrative });
    onActionExecuted(result);
    setSelectedAction(null);
  };

  const getSuccessColor = (chance: number) => {
    if (chance >= 70) return 'text-green-700';
    if (chance >= 40) return 'text-yellow-600';
    return 'text-red-700';
  };

  const getRiskColor = (risk: number) => {
    if (risk <= 3) return 'bg-green-100 text-green-800';
    if (risk <= 6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="bg-[#fdf6e3] rounded-lg border border-[#2c241b]/20 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-[#2c241b] text-[#fdf6e3] p-4">
        <div className="flex justify-between items-center">
          <h3 className="font-serif text-lg font-bold">Royal Directives</h3>
          <span className="text-sm bg-[#b45309] px-3 py-1 rounded-full">
            {actionsRemaining}/{maxActions} Actions
          </span>
        </div>
        <p className="text-xs italic opacity-70 mt-1">
          Guide your nation through those who serve the crown
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex border-b border-[#2c241b]/10 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setSelectedAction(null);
              setLastResult(null);
            }}
            className={`flex-1 min-w-[100px] px-3 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors ${
              selectedCategory === cat
                ? 'bg-[#b45309] text-white'
                : 'text-[#2c241b]/60 hover:bg-[#eaddcf]'
            }`}
          >
            {CATEGORY_ICONS[cat]}
            <span className="hidden sm:inline">{CATEGORY_LABELS[cat].split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Last Result Banner */}
      {lastResult && (
        <div
          className={`p-3 flex items-start gap-2 text-sm ${
            lastResult.success ? 'bg-green-50 border-b border-green-200' : 'bg-red-50 border-b border-red-200'
          }`}
        >
          {lastResult.success ? (
            <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
          ) : (
            <XCircle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
          )}
          <p className={`font-serif italic ${lastResult.success ? 'text-green-800' : 'text-red-800'}`}>
            {lastResult.narrative}
          </p>
        </div>
      )}

      {/* Actions List */}
      <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
        {actionsRemaining === 0 ? (
          <div className="text-center py-8 text-[#2c241b]/50">
            <p className="font-serif italic">No actions remaining this turn</p>
          </div>
        ) : availableActions.length === 0 ? (
          <div className="text-center py-8 text-[#2c241b]/50">
            <p className="font-serif italic">No actions available in this category</p>
          </div>
        ) : (
          availableActions.map((action) => {
            const { chance, executor } = calculateActionSuccess(action, nation);
            const isSelected = selectedAction?.id === action.id;

            return (
              <div key={action.id} className="border border-[#2c241b]/10 rounded-lg overflow-hidden">
                <button
                  onClick={() => setSelectedAction(isSelected ? null : action)}
                  className={`w-full p-3 text-left transition-colors ${
                    isSelected ? 'bg-[#eaddcf]' : 'bg-white hover:bg-[#fdf6e3]'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-serif font-bold text-[#2c241b]">{action.name}</h4>
                      <p className="text-xs text-[#2c241b]/60 mt-1">{action.description}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <span className={`text-xs font-bold ${getSuccessColor(chance)}`}>
                        {Math.round(chance)}%
                      </span>
                      <ChevronRight
                        size={16}
                        className={`transform transition-transform ${isSelected ? 'rotate-90' : ''}`}
                      />
                    </div>
                  </div>
                </button>

                {/* Expanded Details */}
                {isSelected && (
                  <div className="p-4 bg-[#eaddcf]/50 border-t border-[#2c241b]/10 space-y-3">
                    {/* Guidance Text */}
                    <p className="font-serif text-sm italic text-[#2c241b] border-l-2 border-[#b45309] pl-3">
                      {action.guidanceText}
                    </p>

                    {/* Executor Info */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#2c241b]/60">
                        Executor: <span className="font-bold text-[#2c241b]">{executor}</span>
                      </span>
                      <span className={`px-2 py-0.5 rounded ${getRiskColor(action.riskLevel)}`}>
                        Risk: {action.riskLevel}/10
                      </span>
                    </div>

                    {/* Effects Preview */}
                    {action.baseEffects.statChanges && (
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(action.baseEffects.statChanges).map(([stat, change]) => (
                          <span
                            key={stat}
                            className={`text-xs px-2 py-0.5 rounded ${
                              change > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {stat} {change > 0 ? '+' : ''}{change}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Failure Consequences */}
                    {action.failureConsequences && (
                      <div className="flex items-start gap-1 text-xs text-red-700">
                        <AlertTriangle size={12} className="mt-0.5 flex-shrink-0" />
                        <span>
                          Failure risk:{' '}
                          {Object.entries(action.failureConsequences)
                            .map(([stat, change]) => `${stat} ${change}`)
                            .join(', ')}
                        </span>
                      </div>
                    )}

                    {/* Execute Button */}
                    <button
                      onClick={() => handleExecuteAction(action)}
                      className="w-full py-2 bg-[#b45309] text-white font-bold rounded hover:bg-[#92400e] transition-colors flex items-center justify-center gap-2"
                    >
                      Issue Directive
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer with Ruler Info */}
      {nation.court?.leader && (
        <div className="bg-[#2c241b]/5 p-3 border-t border-[#2c241b]/10">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#2c241b]/60">
              Ruler: <span className="font-bold text-[#2c241b]">{nation.court.leader.name}</span>
            </span>
            <div className="flex gap-1">
              {nation.court.leader.personality.traits.slice(0, 2).map((trait) => (
                <span
                  key={trait}
                  className="bg-[#b45309]/10 text-[#b45309] px-2 py-0.5 rounded text-[10px] uppercase"
                >
                  {trait.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerActionsPanel;
