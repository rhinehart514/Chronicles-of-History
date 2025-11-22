import React, { useState } from 'react';
import { Reform, GOVERNMENT_REFORMS, canEnactReform } from '../data/reformSystem';

interface ReformPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentReforms: string[];
  reformProgress: number;
  maxProgress: number;
  techLevel: number;
  year: number;
  government: string;
  onEnactReform: (reformId: string) => void;
}

export const ReformPanel: React.FC<ReformPanelProps> = ({
  isOpen,
  onClose,
  currentReforms,
  reformProgress,
  maxProgress,
  techLevel,
  year,
  government,
  onEnactReform
}) => {
  const [selectedTier, setSelectedTier] = useState(1);
  const [selectedReform, setSelectedReform] = useState<string | null>(null);

  if (!isOpen) return null;

  const tiers = [1, 2, 3, 4, 5];
  const tierReforms = GOVERNMENT_REFORMS.filter(r => r.tier === selectedTier);
  const selected = GOVERNMENT_REFORMS.find(r => r.id === selectedReform);

  const getReformStatus = (reform: Reform) => {
    if (currentReforms.includes(reform.id)) return 'enacted';
    const check = canEnactReform(reform, currentReforms, techLevel, year, government);
    if (check.canEnact && reformProgress >= reform.cost) return 'available';
    return 'locked';
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-stone-800">⚙️ Government Reforms</h2>
            <div className="text-sm text-stone-500">
              {currentReforms.length} reforms enacted
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Reform progress */}
        <div className="p-3 border-b border-stone-200 bg-stone-100">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-stone-600">Reform Progress</span>
            <span className="font-bold">{reformProgress}/{maxProgress}</span>
          </div>
          <div className="w-full bg-stone-200 rounded-full h-2">
            <div
              className="bg-amber-500 h-2 rounded-full"
              style={{ width: `${(reformProgress / maxProgress) * 100}%` }}
            />
          </div>
        </div>

        {/* Tier selection */}
        <div className="p-2 border-b border-stone-200 flex gap-2">
          {tiers.map(tier => {
            const tierEnacted = GOVERNMENT_REFORMS
              .filter(r => r.tier === tier)
              .some(r => currentReforms.includes(r.id));
            return (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={`px-4 py-2 rounded text-sm font-medium ${
                  selectedTier === tier
                    ? 'bg-amber-600 text-white'
                    : tierEnacted
                    ? 'bg-green-100 text-green-700'
                    : 'bg-stone-200 text-stone-700'
                }`}
              >
                Tier {tier}
                {tierEnacted && ' ✓'}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Reform list */}
          <div className="w-1/2 border-r border-stone-200 overflow-y-auto p-4">
            <div className="space-y-3">
              {tierReforms.map(reform => {
                const status = getReformStatus(reform);
                return (
                  <button
                    key={reform.id}
                    onClick={() => setSelectedReform(reform.id)}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                      selectedReform === reform.id
                        ? 'border-amber-500'
                        : status === 'enacted'
                        ? 'border-green-500 bg-green-50'
                        : status === 'available'
                        ? 'border-stone-300 bg-white'
                        : 'border-stone-200 bg-stone-100 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{reform.icon}</span>
                      <span className="font-semibold text-stone-800">{reform.name}</span>
                      {status === 'enacted' && (
                        <span className="text-green-500">✓</span>
                      )}
                    </div>
                    <p className="text-xs text-stone-600 mb-2">{reform.description}</p>
                    {status !== 'enacted' && (
                      <div className="text-xs text-amber-600">
                        Cost: {reform.cost} progress
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected reform details */}
          <div className="w-1/2 p-4 overflow-y-auto">
            {selected ? (
              <>
                <div className="text-center mb-4">
                  <span className="text-4xl">{selected.icon}</span>
                  <h3 className="font-bold text-stone-800 mt-2">{selected.name}</h3>
                  <p className="text-sm text-stone-600">{selected.description}</p>
                </div>

                {/* Effects */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-stone-600 mb-2">Effects</h4>
                  <div className="space-y-1">
                    {selected.effects.map((effect, i) => (
                      <div
                        key={i}
                        className={`text-sm px-2 py-1 rounded ${
                          typeof effect.value === 'number' && effect.value > 0
                            ? 'bg-green-100 text-green-700'
                            : typeof effect.value === 'number' && effect.value < 0
                            ? 'bg-red-100 text-red-700'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {effect.description}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                {selected.requirements.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-stone-600 mb-2">Requirements</h4>
                    <div className="space-y-1 text-xs">
                      {selected.requirements.map((req, i) => {
                        let met = false;
                        if (req.type === 'tech') met = techLevel >= (req.value as number);
                        if (req.type === 'year') met = year >= (req.value as number);
                        if (req.type === 'government') met = government === req.value;
                        if (req.type === 'reform') met = currentReforms.includes(req.value as string);

                        return (
                          <div
                            key={i}
                            className={met ? 'text-green-600' : 'text-red-600'}
                          >
                            {met ? '✓' : '✗'} {req.type}: {req.value}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Mutually exclusive */}
                {selected.mutuallyExclusive.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-stone-600 mb-2">
                      Mutually Exclusive With
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {selected.mutuallyExclusive.map(id => {
                        const reform = GOVERNMENT_REFORMS.find(r => r.id === id);
                        const isEnacted = currentReforms.includes(id);
                        return (
                          <span
                            key={id}
                            className={`px-2 py-1 rounded text-xs ${
                              isEnacted
                                ? 'bg-red-100 text-red-700'
                                : 'bg-stone-100 text-stone-600'
                            }`}
                          >
                            {reform?.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Action button */}
                {(() => {
                  const status = getReformStatus(selected);
                  if (status === 'enacted') {
                    return (
                      <div className="text-center py-3 bg-green-100 text-green-700 rounded">
                        ✓ Reform Enacted
                      </div>
                    );
                  }
                  const check = canEnactReform(selected, currentReforms, techLevel, year, government);
                  const canAfford = reformProgress >= selected.cost;
                  return (
                    <button
                      onClick={() => onEnactReform(selected.id)}
                      disabled={!check.canEnact || !canAfford}
                      className={`w-full py-3 rounded font-medium ${
                        check.canEnact && canAfford
                          ? 'bg-amber-600 text-white hover:bg-amber-700'
                          : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                      }`}
                    >
                      {!check.canEnact
                        ? check.reason
                        : !canAfford
                        ? `Need ${selected.cost} progress`
                        : `Enact Reform (${selected.cost})`}
                    </button>
                  );
                })()}
              </>
            ) : (
              <p className="text-center text-stone-500 py-8">
                Select a reform to view details
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReformPanel;
