import React, { useState } from 'react';
import { Nation } from '../types';

interface WarGoal {
  id: string;
  name: string;
  description: string;
  aggressionCost: number;
  icon: string;
}

interface WarDeclarationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  playerNation: Nation;
  targetNation: Nation;
  warGoals: WarGoal[];
  playerStrength: number;
  enemyStrength: number;
  onDeclare: (goalId: string) => void;
}

export const WarDeclarationPanel: React.FC<WarDeclarationPanelProps> = ({
  isOpen,
  onClose,
  playerNation,
  targetNation,
  warGoals,
  playerStrength,
  enemyStrength,
  onDeclare
}) => {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  if (!isOpen) return null;

  const strengthRatio = playerStrength / (enemyStrength || 1);
  const outlook = strengthRatio > 1.5 ? 'favorable' :
                  strengthRatio > 0.8 ? 'even' : 'unfavorable';

  const outlookColors = {
    favorable: 'text-green-600 bg-green-100',
    even: 'text-amber-600 bg-amber-100',
    unfavorable: 'text-red-600 bg-red-100'
  };

  const selectedWarGoal = warGoals.find(g => g.id === selectedGoal);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-lg border-4 border-red-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 bg-gradient-to-b from-red-50 to-transparent">
          <h2 className="text-xl font-bold text-red-800 text-center">⚔️ Declaration of War</h2>
          <p className="text-center text-stone-600 mt-1">
            {playerNation.name} vs {targetNation.name}
          </p>
        </div>

        {/* Strength comparison */}
        <div className="p-4 border-b border-stone-200">
          <div className="flex justify-between items-center mb-3">
            <div className="text-center">
              <div className="text-lg font-bold text-stone-800">{playerStrength}</div>
              <div className="text-xs text-stone-500">Your Forces</div>
            </div>
            <div className={`px-3 py-1 rounded text-sm font-semibold ${outlookColors[outlook]}`}>
              {outlook.charAt(0).toUpperCase() + outlook.slice(1)}
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-stone-800">{enemyStrength}</div>
              <div className="text-xs text-stone-500">Enemy Forces</div>
            </div>
          </div>

          {/* Strength bar */}
          <div className="flex h-4 rounded overflow-hidden">
            <div
              className="bg-blue-600"
              style={{ width: `${(playerStrength / (playerStrength + enemyStrength)) * 100}%` }}
            />
            <div
              className="bg-red-600"
              style={{ width: `${(enemyStrength / (playerStrength + enemyStrength)) * 100}%` }}
            />
          </div>
        </div>

        {/* War goals */}
        <div className="p-4">
          <h3 className="font-semibold text-stone-800 mb-2">Select War Goal</h3>
          <div className="space-y-2">
            {warGoals.map((goal) => (
              <button
                key={goal.id}
                onClick={() => setSelectedGoal(goal.id)}
                className={`w-full p-3 rounded border-2 text-left transition-all ${
                  selectedGoal === goal.id
                    ? 'border-red-500 bg-red-50'
                    : 'border-stone-200 bg-white hover:border-stone-400'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{goal.icon}</span>
                    <span className="font-semibold text-stone-800">{goal.name}</span>
                  </div>
                  <span className="text-xs text-orange-600">
                    -{goal.aggressionCost} prestige
                  </span>
                </div>
                <p className="text-sm text-stone-600 mt-1 ml-8">{goal.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Warning */}
        {selectedWarGoal && (
          <div className="px-4 pb-4">
            <div className="bg-amber-50 border border-amber-200 rounded p-3 text-sm">
              <p className="text-amber-800 font-semibold">⚠️ Consequences of War</p>
              <ul className="text-amber-700 mt-1 space-y-1 text-xs">
                <li>• Will cost {selectedWarGoal.aggressionCost} prestige</li>
                <li>• May trigger defensive alliances</li>
                <li>• Economic and stability impacts during war</li>
                <li>• Relationship with {targetNation.name} will be severely damaged</li>
              </ul>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="p-4 border-t border-stone-300 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-stone-200 text-stone-700 rounded font-semibold hover:bg-stone-300"
          >
            Cancel
          </button>
          <button
            onClick={() => selectedGoal && onDeclare(selectedGoal)}
            disabled={!selectedGoal}
            className={`flex-1 py-2 rounded font-semibold ${
              selectedGoal
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-stone-300 text-stone-500 cursor-not-allowed'
            }`}
          >
            Declare War
          </button>
        </div>
      </div>
    </div>
  );
};

// Default war goals
export const DEFAULT_WAR_GOALS: WarGoal[] = [
  {
    id: 'conquest',
    name: 'Conquest',
    description: 'Seize enemy territory for your nation',
    aggressionCost: 20,
    icon: '🏰'
  },
  {
    id: 'subjugation',
    name: 'Subjugation',
    description: 'Force the enemy to become a vassal state',
    aggressionCost: 30,
    icon: '👑'
  },
  {
    id: 'humiliation',
    name: 'Humiliation',
    description: 'Damage enemy prestige and reputation',
    aggressionCost: 10,
    icon: '😤'
  },
  {
    id: 'liberation',
    name: 'Liberation',
    description: 'Free oppressed peoples from enemy rule',
    aggressionCost: 5,
    icon: '🕊️'
  },
  {
    id: 'punitive',
    name: 'Punitive Expedition',
    description: 'Punish the enemy for past transgressions',
    aggressionCost: 15,
    icon: '⚖️'
  }
];

export default WarDeclarationPanel;
