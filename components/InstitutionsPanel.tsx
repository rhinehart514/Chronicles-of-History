import React, { useState } from 'react';
import { Institution, INSTITUTIONS } from '../data/institutions';

interface InstitutionsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentYear: number;
  embracedInstitutions: string[];
  provinceSpread: Record<string, number>;
  totalDevelopment: number;
  gold: number;
  techPenalty: number;
  onEmbrace: (institutionId: string) => void;
  onDevelop: (institutionId: string) => void;
}

export const InstitutionsPanel: React.FC<InstitutionsPanelProps> = ({
  isOpen,
  onClose,
  currentYear,
  embracedInstitutions,
  provinceSpread,
  totalDevelopment,
  gold,
  techPenalty,
  onEmbrace,
  onDevelop
}) => {
  const [selectedInst, setSelectedInst] = useState<string | null>(null);

  if (!isOpen) return null;

  const availableInsts = INSTITUTIONS.filter(inst => inst.year <= currentYear);
  const selected = INSTITUTIONS.find(inst => inst.id === selectedInst);

  const getStatus = (inst: Institution) => {
    if (embracedInstitutions.includes(inst.id)) return 'embraced';
    if (inst.year > currentYear) return 'future';
    const spread = provinceSpread[inst.id] || 0;
    if (spread >= 10) return 'spreading';
    return 'not_present';
  };

  const getEmbraceCost = (instId: string) => {
    const spread = provinceSpread[instId] || 0;
    return Math.round(totalDevelopment * 2.5 * (100 - spread) / 100);
  };

  const canEmbrace = (instId: string) => {
    const spread = provinceSpread[instId] || 0;
    return spread >= 10 && gold >= getEmbraceCost(instId);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-stone-800">🏛️ Institutions</h2>
            <div className="text-sm text-stone-500">
              {embracedInstitutions.length}/{availableInsts.length} embraced
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Tech penalty warning */}
        {techPenalty > 0 && (
          <div className="p-3 bg-red-50 border-b border-red-200">
            <div className="flex items-center gap-2 text-red-700">
              <span>⚠️</span>
              <span className="text-sm">
                Technology cost increased by <strong>+{techPenalty}%</strong> due to missing institutions
              </span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Institution list */}
          <div className="w-1/2 border-r border-stone-200 overflow-y-auto p-3">
            <div className="space-y-2">
              {INSTITUTIONS.map(inst => {
                const status = getStatus(inst);
                const spread = provinceSpread[inst.id] || 0;

                return (
                  <button
                    key={inst.id}
                    onClick={() => setSelectedInst(inst.id)}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                      selectedInst === inst.id
                        ? 'border-amber-500 bg-amber-50'
                        : status === 'embraced'
                        ? 'border-green-300 bg-green-50'
                        : status === 'spreading'
                        ? 'border-blue-300 bg-blue-50'
                        : status === 'future'
                        ? 'border-stone-200 bg-stone-100 opacity-50'
                        : 'border-stone-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{inst.icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-stone-800">{inst.name}</div>
                        <div className="text-xs text-stone-500">Year {inst.year}</div>
                      </div>
                      {status === 'embraced' && (
                        <span className="text-green-500">✓</span>
                      )}
                    </div>

                    {status !== 'future' && status !== 'embraced' && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Spread</span>
                          <span>{spread.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-stone-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              spread >= 10 ? 'bg-green-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${Math.min(100, spread)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected institution details */}
          <div className="w-1/2 p-4 overflow-y-auto">
            {selected ? (
              <>
                <div className="text-center mb-4">
                  <span className="text-4xl">{selected.icon}</span>
                  <h3 className="font-bold text-stone-800 mt-2">{selected.name}</h3>
                  <p className="text-sm text-stone-600">{selected.description}</p>
                  <p className="text-xs text-stone-500 mt-1">Available from {selected.year}</p>
                </div>

                {/* Status */}
                <div className="mb-4 p-3 rounded-lg text-center bg-stone-100">
                  {embracedInstitutions.includes(selected.id) ? (
                    <span className="text-green-600 font-medium">✓ Embraced</span>
                  ) : selected.year > currentYear ? (
                    <span className="text-stone-500">Not yet available</span>
                  ) : (
                    <div>
                      <span className="text-blue-600 font-medium">
                        {(provinceSpread[selected.id] || 0).toFixed(1)}% spread
                      </span>
                      <div className="text-xs text-stone-500 mt-1">
                        Needs 10% to embrace
                      </div>
                    </div>
                  )}
                </div>

                {/* Effects */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-stone-600 mb-2">Effects when Embraced</h4>
                  <div className="space-y-1">
                    {selected.effects.map((effect, i) => (
                      <div key={i} className="text-sm text-green-600">
                        {effect.description}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Origin conditions */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-stone-600 mb-2">Origin Conditions</h4>
                  <div className="space-y-1 text-xs text-stone-600">
                    {selected.originConditions.map((cond, i) => (
                      <div key={i}>• {cond.description}</div>
                    ))}
                  </div>
                </div>

                {/* Spread conditions */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-stone-600 mb-2">Spread Modifiers</h4>
                  <div className="space-y-1 text-xs text-stone-600">
                    {selected.spreadConditions.map((cond, i) => (
                      <div key={i}>• {cond.description}</div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                {!embracedInstitutions.includes(selected.id) && selected.year <= currentYear && (
                  <div className="space-y-2">
                    {(provinceSpread[selected.id] || 0) >= 10 && (
                      <button
                        onClick={() => onEmbrace(selected.id)}
                        disabled={!canEmbrace(selected.id)}
                        className={`w-full py-3 rounded font-medium ${
                          canEmbrace(selected.id)
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                        }`}
                      >
                        Embrace ({getEmbraceCost(selected.id)} gold)
                      </button>
                    )}
                    <button
                      onClick={() => onDevelop(selected.id)}
                      className="w-full py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      Develop Province to Spread
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-center text-stone-500 py-8">
                Select an institution to view details
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionsPanel;
