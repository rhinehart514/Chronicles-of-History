import React from 'react';
import { NationStats } from '../types';

export interface VictoryCondition {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'domination' | 'economic' | 'cultural' | 'diplomatic' | 'survival' | 'custom';
  requirements: VictoryRequirement[];
  reward: string;
  difficulty: 'standard' | 'challenging' | 'legendary';
}

export interface VictoryRequirement {
  id: string;
  description: string;
  current: number;
  target: number;
  completed: boolean;
}

interface VictoryTrackerProps {
  isOpen: boolean;
  onClose: () => void;
  conditions: VictoryCondition[];
  currentYear: number;
  endYear: number;
  nationName: string;
}

export const VictoryTracker: React.FC<VictoryTrackerProps> = ({
  isOpen,
  onClose,
  conditions,
  currentYear,
  endYear,
  nationName
}) => {
  if (!isOpen) return null;

  const yearsRemaining = endYear - currentYear;
  const timeProgress = ((currentYear - 1750) / (endYear - 1750)) * 100;

  const getTypeColor = (type: VictoryCondition['type']) => {
    switch (type) {
      case 'domination': return 'border-red-500 bg-red-50';
      case 'economic': return 'border-amber-500 bg-amber-50';
      case 'cultural': return 'border-purple-500 bg-purple-50';
      case 'diplomatic': return 'border-green-500 bg-green-50';
      case 'survival': return 'border-blue-500 bg-blue-50';
      case 'custom': return 'border-stone-500 bg-stone-50';
    }
  };

  const getDifficultyStars = (difficulty: VictoryCondition['difficulty']) => {
    switch (difficulty) {
      case 'standard': return '⭐';
      case 'challenging': return '⭐⭐';
      case 'legendary': return '⭐⭐⭐';
    }
  };

  const getOverallProgress = (condition: VictoryCondition): number => {
    const completed = condition.requirements.filter(r => r.completed).length;
    return (completed / condition.requirements.length) * 100;
  };

  const completedConditions = conditions.filter(c =>
    c.requirements.every(r => r.completed)
  );

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border-4 border-amber-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 bg-gradient-to-b from-amber-50 to-transparent">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-stone-800">🏆 Victory Conditions</h2>
            <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
              ×
            </button>
          </div>
          <p className="text-sm text-stone-600 mt-1">{nationName}'s Path to Glory</p>
        </div>

        {/* Time remaining */}
        <div className="p-3 bg-stone-100 border-b border-stone-200">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-stone-600">Campaign Progress</span>
            <span className="text-sm font-bold text-stone-800">
              {yearsRemaining} years remaining
            </span>
          </div>
          <div className="w-full bg-stone-300 rounded h-2">
            <div
              className="bg-amber-600 h-2 rounded"
              style={{ width: `${timeProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-stone-500 mt-1">
            <span>1750</span>
            <span>{currentYear}</span>
            <span>{endYear}</span>
          </div>
        </div>

        {/* Victory conditions list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {conditions.map((condition) => {
            const progress = getOverallProgress(condition);
            const isComplete = progress === 100;

            return (
              <div
                key={condition.id}
                className={`rounded-lg border-l-4 ${getTypeColor(condition.type)} ${
                  isComplete ? 'ring-2 ring-green-500' : ''
                }`}
              >
                <div className="p-4">
                  {/* Condition header */}
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{condition.icon}</span>
                      <div>
                        <h3 className="font-bold text-stone-800">{condition.name}</h3>
                        <p className="text-xs text-stone-500">{condition.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-stone-500">
                        {getDifficultyStars(condition.difficulty)}
                      </div>
                      {isComplete && (
                        <span className="text-xs text-green-600 font-bold">✓ ACHIEVED</span>
                      )}
                    </div>
                  </div>

                  {/* Overall progress bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-stone-500 mb-1">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-stone-200 rounded h-2">
                      <div
                        className={`h-2 rounded ${isComplete ? 'bg-green-500' : 'bg-amber-500'}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="space-y-2">
                    {condition.requirements.map((req) => (
                      <div
                        key={req.id}
                        className={`flex items-center gap-2 text-sm ${
                          req.completed ? 'text-green-600' : 'text-stone-600'
                        }`}
                      >
                        <span>{req.completed ? '✓' : '○'}</span>
                        <span className="flex-1">{req.description}</span>
                        <span className="font-mono text-xs">
                          {req.current}/{req.target}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Reward */}
                  <div className="mt-3 pt-3 border-t border-stone-200">
                    <span className="text-xs text-stone-500">Reward: </span>
                    <span className="text-xs text-amber-600 font-semibold">{condition.reward}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer summary */}
        <div className="p-3 border-t border-stone-300 bg-stone-100 flex justify-between items-center">
          <span className="text-sm text-stone-600">
            {completedConditions.length}/{conditions.length} victories achieved
          </span>
          {completedConditions.length > 0 && (
            <span className="text-sm text-green-600 font-bold">
              🎉 Victory possible!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Default victory conditions
export const DEFAULT_VICTORY_CONDITIONS: Omit<VictoryCondition, 'requirements'>[] = [
  {
    id: 'domination',
    name: 'Continental Dominance',
    description: 'Become the supreme military power',
    icon: '⚔️',
    type: 'domination',
    reward: '+50 Prestige, "Conqueror" title',
    difficulty: 'challenging'
  },
  {
    id: 'economic',
    name: 'Economic Hegemon',
    description: 'Build an unrivaled economy',
    icon: '💰',
    type: 'economic',
    reward: '+30 Economy bonus, "Merchant Prince" title',
    difficulty: 'standard'
  },
  {
    id: 'cultural',
    name: 'Cultural Renaissance',
    description: 'Lead the world in culture and innovation',
    icon: '🎭',
    type: 'cultural',
    reward: '+40 Prestige, "Enlightened Ruler" title',
    difficulty: 'standard'
  },
  {
    id: 'diplomatic',
    name: 'Master Diplomat',
    description: 'Create a web of alliances and influence',
    icon: '🤝',
    type: 'diplomatic',
    reward: 'Permanent alliance bonuses, "Peacemaker" title',
    difficulty: 'challenging'
  },
  {
    id: 'survival',
    name: 'The Long Reign',
    description: 'Survive and thrive for 200 years',
    icon: '👑',
    type: 'survival',
    reward: 'Legacy score multiplier, "The Eternal" title',
    difficulty: 'standard'
  },
  {
    id: 'revolutionary',
    name: 'Revolutionary',
    description: 'Transform society through reform',
    icon: '🔥',
    type: 'custom',
    reward: 'Unique government options, "Reformer" title',
    difficulty: 'legendary'
  }
];

export default VictoryTracker;
