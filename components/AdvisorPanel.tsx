import React, { useState } from 'react';
import { Nation } from '../types';

export interface Advisor {
  id: string;
  name: string;
  title: string;
  portrait: string;
  specialty: 'military' | 'economy' | 'diplomacy' | 'culture';
  personality: string;
  bonuses: string[];
}

export interface AdvisorAdvice {
  advisorId: string;
  topic: string;
  advice: string;
  priority: 'urgent' | 'important' | 'suggestion';
  actionable?: { label: string; action: string }[];
}

interface AdvisorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  advisors: Advisor[];
  currentAdvice: AdvisorAdvice[];
  nation: Nation;
  onDismissAdvice: (advisorId: string) => void;
  onTakeAction: (action: string) => void;
}

export const AdvisorPanel: React.FC<AdvisorPanelProps> = ({
  isOpen,
  onClose,
  advisors,
  currentAdvice,
  nation,
  onDismissAdvice,
  onTakeAction
}) => {
  const [selectedAdvisor, setSelectedAdvisor] = useState<string | null>(
    advisors.length > 0 ? advisors[0].id : null
  );

  if (!isOpen) return null;

  const specialtyIcons = {
    military: '⚔️',
    economy: '💰',
    diplomacy: '🤝',
    culture: '🎭'
  };

  const priorityColors = {
    urgent: 'border-red-500 bg-red-50',
    important: 'border-amber-500 bg-amber-50',
    suggestion: 'border-blue-500 bg-blue-50'
  };

  const selected = advisors.find(a => a.id === selectedAdvisor);
  const selectedAdvice = currentAdvice.filter(a => a.advisorId === selectedAdvisor);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <h2 className="text-xl font-bold text-stone-800">🎓 Royal Advisors</h2>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Advisor list */}
          <div className="w-1/3 border-r border-stone-200 overflow-y-auto">
            {advisors.map((advisor) => {
              const adviceCount = currentAdvice.filter(a => a.advisorId === advisor.id).length;
              const hasUrgent = currentAdvice.some(
                a => a.advisorId === advisor.id && a.priority === 'urgent'
              );

              return (
                <button
                  key={advisor.id}
                  onClick={() => setSelectedAdvisor(advisor.id)}
                  className={`w-full p-3 text-left border-b border-stone-100 transition-colors ${
                    selectedAdvisor === advisor.id
                      ? 'bg-amber-50'
                      : 'hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{advisor.portrait}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-stone-800">{advisor.name}</div>
                      <div className="text-xs text-stone-500">
                        {specialtyIcons[advisor.specialty]} {advisor.title}
                      </div>
                    </div>
                    {adviceCount > 0 && (
                      <div className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        hasUrgent ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
                      }`}>
                        {adviceCount}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Advisor details & advice */}
          <div className="w-2/3 overflow-y-auto p-4">
            {selected ? (
              <div className="space-y-4">
                {/* Advisor info */}
                <div className="flex items-start gap-4">
                  <div className="text-5xl">{selected.portrait}</div>
                  <div>
                    <h3 className="text-lg font-bold text-stone-800">{selected.name}</h3>
                    <p className="text-sm text-stone-600">{selected.title}</p>
                    <p className="text-xs text-stone-500 mt-1 italic">"{selected.personality}"</p>
                  </div>
                </div>

                {/* Bonuses */}
                <div className="bg-white p-3 rounded border border-stone-200">
                  <h4 className="font-semibold text-stone-800 mb-2">Bonuses</h4>
                  <ul className="space-y-1">
                    {selected.bonuses.map((bonus, i) => (
                      <li key={i} className="text-sm text-green-600 flex items-center gap-2">
                        <span>✓</span>
                        {bonus}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Current advice */}
                <div>
                  <h4 className="font-semibold text-stone-800 mb-2">Current Advice</h4>
                  {selectedAdvice.length === 0 ? (
                    <p className="text-stone-500 text-sm italic">
                      No pressing matters at this time, Your Majesty.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {selectedAdvice.map((advice, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded border-l-4 ${priorityColors[advice.priority]}`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-semibold text-stone-800">{advice.topic}</span>
                            <button
                              onClick={() => onDismissAdvice(advice.advisorId)}
                              className="text-stone-400 hover:text-stone-600 text-sm"
                            >
                              ×
                            </button>
                          </div>
                          <p className="text-sm text-stone-600">{advice.advice}</p>

                          {advice.actionable && advice.actionable.length > 0 && (
                            <div className="mt-2 flex gap-2">
                              {advice.actionable.map((action, j) => (
                                <button
                                  key={j}
                                  onClick={() => onTakeAction(action.action)}
                                  className="px-2 py-1 bg-amber-600 text-white text-xs rounded hover:bg-amber-700"
                                >
                                  {action.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-stone-500">
                Select an advisor
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-stone-300 bg-stone-100 text-center text-sm text-stone-600">
          {currentAdvice.filter(a => a.priority === 'urgent').length} urgent matters require attention
        </div>
      </div>
    </div>
  );
};

// Default advisors
export const DEFAULT_ADVISORS: Advisor[] = [
  {
    id: 'general',
    name: 'Marshal von Krieg',
    title: 'Chief Military Advisor',
    portrait: '🎖️',
    specialty: 'military',
    personality: 'Victory through superior firepower.',
    bonuses: ['+10% Army morale', '+5% Battle tactics']
  },
  {
    id: 'treasurer',
    name: 'Baron Goldstein',
    title: 'Royal Treasurer',
    portrait: '🧐',
    specialty: 'economy',
    personality: 'A coin saved is a coin earned.',
    bonuses: ['+10% Tax efficiency', '-5% Building costs']
  },
  {
    id: 'diplomat',
    name: 'Countess Versailles',
    title: 'Chief Diplomat',
    portrait: '👩‍💼',
    specialty: 'diplomacy',
    personality: 'Every nation has its price.',
    bonuses: ['+15 Diplomatic reputation', '+1 Diplomat']
  },
  {
    id: 'scholar',
    name: 'Professor Newton',
    title: 'Royal Scholar',
    portrait: '🧑‍🔬',
    specialty: 'culture',
    personality: 'Knowledge is the foundation of empire.',
    bonuses: ['+10% Research speed', '+5% Innovation']
  }
];

export default AdvisorPanel;
