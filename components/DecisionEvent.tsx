import React, { useState } from 'react';
import { NationStats } from '../types';

export interface EventChoice {
  id: string;
  text: string;
  description: string;
  effects: Partial<NationStats>;
  cost?: number;
  requirements?: {
    stats?: Partial<NationStats>;
    resource?: { type: string; amount: number };
  };
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  image?: string;
  type: 'positive' | 'negative' | 'neutral' | 'critical';
  category: string;
  choices: EventChoice[];
}

interface DecisionEventProps {
  event: GameEvent;
  nationStats: NationStats;
  treasury: number;
  onChoice: (choiceId: string) => void;
  onDismiss?: () => void;
}

export const DecisionEvent: React.FC<DecisionEventProps> = ({
  event,
  nationStats,
  treasury,
  onChoice,
  onDismiss
}) => {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  const typeStyles = {
    positive: 'border-green-600 from-green-50',
    negative: 'border-red-600 from-red-50',
    neutral: 'border-amber-600 from-amber-50',
    critical: 'border-purple-600 from-purple-50'
  };

  const typeIcons = {
    positive: '✨',
    negative: '⚠️',
    neutral: '📜',
    critical: '🔥'
  };

  const canAfford = (choice: EventChoice): boolean => {
    if (choice.cost && treasury < choice.cost) return false;
    if (choice.requirements?.stats) {
      for (const [stat, min] of Object.entries(choice.requirements.stats)) {
        if (nationStats[stat as keyof NationStats] < min) return false;
      }
    }
    return true;
  };

  const formatEffect = (stat: string, value: number): string => {
    const sign = value > 0 ? '+' : '';
    const statNames: Record<string, string> = {
      military: 'Military',
      economy: 'Economy',
      stability: 'Stability',
      innovation: 'Innovation',
      prestige: 'Prestige'
    };
    return `${sign}${value} ${statNames[stat] || stat}`;
  };

  const handleConfirm = () => {
    if (selectedChoice) {
      onChoice(selectedChoice);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className={`bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-lg border-4 ${typeStyles[event.type].split(' ')[0]}`}>
        {/* Header */}
        <div className={`p-4 border-b border-stone-300 bg-gradient-to-b ${typeStyles[event.type].split(' ')[1]} to-transparent`}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{typeIcons[event.type]}</span>
            <div>
              <h2 className="text-lg font-bold text-stone-800">{event.title}</h2>
              <span className="text-xs text-stone-500 capitalize">{event.category}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="p-4 border-b border-stone-200">
          <p className="text-stone-700 leading-relaxed">{event.description}</p>
        </div>

        {/* Choices */}
        <div className="p-4 space-y-3">
          {event.choices.map((choice) => {
            const affordable = canAfford(choice);
            const isSelected = selectedChoice === choice.id;

            return (
              <button
                key={choice.id}
                onClick={() => affordable && setSelectedChoice(choice.id)}
                disabled={!affordable}
                className={`w-full p-3 rounded border-2 text-left transition-all ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50'
                    : affordable
                    ? 'border-stone-200 bg-white hover:border-stone-400'
                    : 'border-stone-200 bg-stone-100 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="font-semibold text-stone-800">{choice.text}</div>
                <p className="text-sm text-stone-600 mt-1">{choice.description}</p>

                {/* Effects */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {Object.entries(choice.effects).map(([stat, value]) => (
                    <span
                      key={stat}
                      className={`text-xs px-2 py-0.5 rounded ${
                        value > 0
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {formatEffect(stat, value)}
                    </span>
                  ))}
                  {choice.cost && (
                    <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-700">
                      -{choice.cost} 💰
                    </span>
                  )}
                </div>

                {/* Requirements not met */}
                {!affordable && (
                  <div className="mt-2 text-xs text-red-600">
                    {choice.cost && treasury < choice.cost && (
                      <span>Need {choice.cost} gold (have {treasury})</span>
                    )}
                    {choice.requirements?.stats && (
                      <span>Requirements not met</span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-stone-300 flex gap-2">
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="px-4 py-2 bg-stone-200 text-stone-700 rounded font-semibold hover:bg-stone-300"
            >
              Dismiss
            </button>
          )}
          <button
            onClick={() => setConfirming(true)}
            disabled={!selectedChoice}
            className={`flex-1 py-2 rounded font-semibold ${
              selectedChoice
                ? 'bg-amber-600 text-white hover:bg-amber-700'
                : 'bg-stone-300 text-stone-500 cursor-not-allowed'
            }`}
          >
            Confirm Decision
          </button>
        </div>

        {/* Confirmation overlay */}
        {confirming && selectedChoice && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
            <div className="bg-white p-4 rounded-lg shadow-lg max-w-xs">
              <p className="text-stone-800 mb-4">
                Are you sure? This decision cannot be undone.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirming(false)}
                  className="flex-1 py-2 bg-stone-200 text-stone-700 rounded font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-2 bg-amber-600 text-white rounded font-semibold"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DecisionEvent;
