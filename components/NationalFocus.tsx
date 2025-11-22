import React, { useState } from 'react';
import { NationStats } from '../types';

export interface Focus {
  id: string;
  name: string;
  icon: string;
  description: string;
  duration: number; // Turns to complete
  cost: number;
  requirements: FocusRequirement[];
  effects: FocusEffect[];
  unlocks?: string[]; // IDs of focuses this unlocks
}

export interface FocusRequirement {
  type: 'stat' | 'year' | 'tech' | 'focus';
  value: string | number;
  comparison?: 'gte' | 'lte' | 'eq';
}

export interface FocusEffect {
  type: 'stat' | 'modifier' | 'unlock' | 'event';
  target: string;
  value: number | string;
}

interface NationalFocusProps {
  isOpen: boolean;
  onClose: () => void;
  focuses: Focus[];
  completedFocuses: string[];
  currentFocus: string | null;
  focusProgress: number;
  treasury: number;
  stats: NationStats;
  onSelectFocus: (focusId: string) => void;
  onCancelFocus: () => void;
}

// Default national focuses
export const DEFAULT_FOCUSES: Focus[] = [
  // Military branch
  {
    id: 'military_buildup',
    name: 'Military Buildup',
    icon: '⚔️',
    description: 'Expand and modernize the armed forces',
    duration: 20,
    cost: 500,
    requirements: [],
    effects: [
      { type: 'stat', target: 'military', value: 0.5 },
      { type: 'modifier', target: 'army_maintenance', value: -10 }
    ],
    unlocks: ['professional_army', 'fortification_program']
  },
  {
    id: 'professional_army',
    name: 'Professional Army',
    icon: '🎖️',
    description: 'Create a standing professional military',
    duration: 30,
    cost: 1000,
    requirements: [
      { type: 'focus', value: 'military_buildup' }
    ],
    effects: [
      { type: 'stat', target: 'military', value: 1 },
      { type: 'modifier', target: 'discipline', value: 10 }
    ]
  },
  {
    id: 'fortification_program',
    name: 'Fortification Program',
    icon: '🏰',
    description: 'Build defensive fortifications across the nation',
    duration: 40,
    cost: 2000,
    requirements: [
      { type: 'focus', value: 'military_buildup' }
    ],
    effects: [
      { type: 'modifier', target: 'fort_defense', value: 25 },
      { type: 'stat', target: 'stability', value: 0.2 }
    ]
  },

  // Economic branch
  {
    id: 'economic_reform',
    name: 'Economic Reform',
    icon: '💰',
    description: 'Modernize economic institutions',
    duration: 25,
    cost: 750,
    requirements: [],
    effects: [
      { type: 'stat', target: 'economy', value: 0.5 },
      { type: 'modifier', target: 'tax_efficiency', value: 10 }
    ],
    unlocks: ['banking_system', 'trade_expansion']
  },
  {
    id: 'banking_system',
    name: 'National Banking',
    icon: '🏦',
    description: 'Establish a national banking system',
    duration: 35,
    cost: 1500,
    requirements: [
      { type: 'focus', value: 'economic_reform' }
    ],
    effects: [
      { type: 'stat', target: 'economy', value: 1 },
      { type: 'modifier', target: 'loan_interest', value: -20 }
    ]
  },
  {
    id: 'trade_expansion',
    name: 'Trade Expansion',
    icon: '🚢',
    description: 'Develop trade infrastructure and agreements',
    duration: 30,
    cost: 1200,
    requirements: [
      { type: 'focus', value: 'economic_reform' }
    ],
    effects: [
      { type: 'modifier', target: 'trade_income', value: 20 },
      { type: 'modifier', target: 'merchant_slots', value: 2 }
    ]
  },

  // Stability branch
  {
    id: 'centralization',
    name: 'Centralization',
    icon: '🏛️',
    description: 'Strengthen central government authority',
    duration: 30,
    cost: 800,
    requirements: [],
    effects: [
      { type: 'stat', target: 'stability', value: 0.5 },
      { type: 'modifier', target: 'autonomy_change', value: -0.05 }
    ],
    unlocks: ['legal_reform', 'state_religion']
  },
  {
    id: 'legal_reform',
    name: 'Legal Reform',
    icon: '⚖️',
    description: 'Codify laws and improve justice system',
    duration: 40,
    cost: 1000,
    requirements: [
      { type: 'focus', value: 'centralization' }
    ],
    effects: [
      { type: 'stat', target: 'stability', value: 1 },
      { type: 'modifier', target: 'unrest', value: -2 }
    ]
  },

  // Innovation branch
  {
    id: 'patronage_arts',
    name: 'Patronage of Arts',
    icon: '🎨',
    description: 'Support artists and cultural development',
    duration: 25,
    cost: 600,
    requirements: [],
    effects: [
      { type: 'stat', target: 'prestige', value: 0.5 },
      { type: 'stat', target: 'innovation', value: 0.3 }
    ],
    unlocks: ['academy_sciences', 'cultural_renaissance']
  },
  {
    id: 'academy_sciences',
    name: 'Academy of Sciences',
    icon: '🔬',
    description: 'Found institutions for scientific research',
    duration: 40,
    cost: 2000,
    requirements: [
      { type: 'focus', value: 'patronage_arts' },
      { type: 'stat', value: 3, comparison: 'gte' }
    ],
    effects: [
      { type: 'stat', target: 'innovation', value: 1.5 },
      { type: 'modifier', target: 'tech_cost', value: -15 }
    ]
  }
];

export const NationalFocus: React.FC<NationalFocusProps> = ({
  isOpen,
  onClose,
  focuses,
  completedFocuses,
  currentFocus,
  focusProgress,
  treasury,
  stats,
  onSelectFocus,
  onCancelFocus
}) => {
  const [selectedFocus, setSelectedFocus] = useState<string | null>(null);

  if (!isOpen) return null;

  const isCompleted = (id: string) => completedFocuses.includes(id);
  const isAvailable = (focus: Focus) => {
    if (isCompleted(focus.id)) return false;
    if (treasury < focus.cost) return false;

    return focus.requirements.every(req => {
      if (req.type === 'focus') {
        return completedFocuses.includes(req.value as string);
      }
      return true;
    });
  };

  const selected = focuses.find(f => f.id === selectedFocus);
  const current = focuses.find(f => f.id === currentFocus);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <h2 className="text-xl font-bold text-stone-800">🎯 National Focus</h2>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Current focus progress */}
        {current && (
          <div className="p-4 border-b border-stone-200 bg-amber-50">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{current.icon}</span>
                <span className="font-semibold text-stone-800">{current.name}</span>
              </div>
              <button
                onClick={onCancelFocus}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Cancel
              </button>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-3">
              <div
                className="bg-amber-500 h-3 rounded-full transition-all"
                style={{ width: `${(focusProgress / current.duration) * 100}%` }}
              />
            </div>
            <div className="text-xs text-stone-500 mt-1">
              {focusProgress} / {current.duration} turns
            </div>
          </div>
        )}

        {/* Focus tree */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-3 gap-4">
            {focuses.map(focus => {
              const completed = isCompleted(focus.id);
              const available = isAvailable(focus);
              const isCurrent = currentFocus === focus.id;
              const isSelected = selectedFocus === focus.id;

              return (
                <button
                  key={focus.id}
                  onClick={() => setSelectedFocus(focus.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    completed
                      ? 'border-green-500 bg-green-50'
                      : isCurrent
                      ? 'border-amber-500 bg-amber-50'
                      : available
                      ? 'border-stone-300 hover:border-amber-500 bg-white'
                      : 'border-stone-200 bg-stone-100 opacity-50'
                  } ${isSelected ? 'ring-2 ring-amber-400' : ''}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{focus.icon}</span>
                    <span className="font-semibold text-stone-800 text-sm">{focus.name}</span>
                    {completed && <span className="text-green-500">✓</span>}
                  </div>
                  <p className="text-xs text-stone-600 line-clamp-2">{focus.description}</p>
                  <div className="mt-2 flex justify-between text-xs">
                    <span className="text-stone-500">{focus.duration} turns</span>
                    <span className="text-amber-600">{focus.cost}💰</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected focus details */}
        {selected && (
          <div className="p-4 border-t border-stone-300 bg-stone-100">
            <div className="flex items-start gap-4">
              <span className="text-4xl">{selected.icon}</span>
              <div className="flex-1">
                <h3 className="font-bold text-stone-800">{selected.name}</h3>
                <p className="text-sm text-stone-600 mb-2">{selected.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-semibold text-stone-500 mb-1">Requirements</h4>
                    <ul className="text-xs text-stone-600">
                      {selected.requirements.length === 0 ? (
                        <li className="text-green-600">• None</li>
                      ) : (
                        selected.requirements.map((req, i) => (
                          <li key={i}>
                            • {req.type === 'focus' ? `Complete ${req.value}` : `${req.type} ${req.comparison || '>='} ${req.value}`}
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-stone-500 mb-1">Effects</h4>
                    <ul className="text-xs text-stone-600">
                      {selected.effects.map((effect, i) => (
                        <li key={i} className="text-green-600">
                          • {effect.target}: +{effect.value}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {!isCompleted(selected.id) && !currentFocus && (
              <button
                onClick={() => {
                  if (isAvailable(selected)) {
                    onSelectFocus(selected.id);
                  }
                }}
                disabled={!isAvailable(selected)}
                className={`mt-4 w-full py-2 rounded font-medium ${
                  isAvailable(selected)
                    ? 'bg-amber-600 text-white hover:bg-amber-700'
                    : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                }`}
              >
                Start Focus ({selected.cost}💰)
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NationalFocus;
