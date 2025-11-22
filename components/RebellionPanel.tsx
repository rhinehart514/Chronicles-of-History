import React, { useState } from 'react';
import { Rebellion, RebellionRisk, REBELLION_TYPES } from '../data/rebellionSystem';

interface RebellionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeRebellions: Rebellion[];
  atRiskProvinces: RebellionRisk[];
  onSuppressRebellion: (rebellionId: string) => void;
  onNegotiate: (rebellionId: string) => void;
  onReduceUnrest: (province: string) => void;
}

export const RebellionPanel: React.FC<RebellionPanelProps> = ({
  isOpen,
  onClose,
  activeRebellions,
  atRiskProvinces,
  onSuppressRebellion,
  onNegotiate,
  onReduceUnrest
}) => {
  const [tab, setTab] = useState<'active' | 'risk'>('active');
  const [selectedRebellion, setSelectedRebellion] = useState<string | null>(null);

  if (!isOpen) return null;

  const selected = activeRebellions.find(r => r.id === selectedRebellion);
  const highRisk = atRiskProvinces.filter(p => p.risk > 50);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-stone-800">🔥 Rebellions & Unrest</h2>
            {activeRebellions.length > 0 && (
              <div className="text-sm text-red-600">
                {activeRebellions.length} active rebellion{activeRebellions.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="p-2 border-b border-stone-200 flex gap-2">
          <button
            onClick={() => setTab('active')}
            className={`px-4 py-2 rounded text-sm font-medium ${
              tab === 'active'
                ? 'bg-red-600 text-white'
                : 'bg-stone-200 text-stone-700'
            }`}
          >
            Active ({activeRebellions.length})
          </button>
          <button
            onClick={() => setTab('risk')}
            className={`px-4 py-2 rounded text-sm font-medium ${
              tab === 'risk'
                ? 'bg-amber-600 text-white'
                : 'bg-stone-200 text-stone-700'
            }`}
          >
            At Risk ({highRisk.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {tab === 'active' && (
            activeRebellions.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-4xl">✨</span>
                <p className="text-stone-500 mt-2">No active rebellions</p>
                <p className="text-sm text-stone-400">Your realm is at peace</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeRebellions.map(rebellion => {
                  const typeInfo = REBELLION_TYPES[rebellion.type];
                  const isSelected = selectedRebellion === rebellion.id;

                  return (
                    <div
                      key={rebellion.id}
                      className={`bg-red-50 rounded-lg border-2 ${
                        isSelected ? 'border-red-500' : 'border-red-200'
                      }`}
                    >
                      <button
                        onClick={() => setSelectedRebellion(isSelected ? null : rebellion.id)}
                        className="w-full p-4 text-left"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{typeInfo.icon}</span>
                            <div>
                              <h3 className="font-bold text-stone-800">{rebellion.name}</h3>
                              <p className="text-sm text-stone-500">
                                Led by {rebellion.leader || 'Unknown'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-red-600">
                              {rebellion.strength.toLocaleString()} rebels
                            </div>
                            <div className="text-xs text-stone-500">
                              {rebellion.provinces.length} province{rebellion.provinces.length !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="mt-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-stone-500">Rebel Progress</span>
                            <span className="text-red-600">{rebellion.progress}%</span>
                          </div>
                          <div className="w-full bg-stone-200 rounded-full h-2">
                            <div
                              className="bg-red-500 h-2 rounded-full"
                              style={{ width: `${rebellion.progress}%` }}
                            />
                          </div>
                        </div>
                      </button>

                      {/* Expanded details */}
                      {isSelected && (
                        <div className="px-4 pb-4 border-t border-red-200">
                          <div className="mt-3 mb-3">
                            <h4 className="text-sm font-semibold text-stone-600 mb-2">Demands</h4>
                            {rebellion.demands.map((demand, i) => (
                              <div key={i} className="text-sm bg-white rounded p-2 mb-1">
                                <div className="font-medium text-stone-800">{demand.description}</div>
                                <div className="text-xs text-stone-500">{demand.effect}</div>
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => onSuppressRebellion(rebellion.id)}
                              className="flex-1 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium"
                            >
                              ⚔️ Suppress
                            </button>
                            <button
                              onClick={() => onNegotiate(rebellion.id)}
                              className="flex-1 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 text-sm font-medium"
                            >
                              🤝 Negotiate
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          )}

          {tab === 'risk' && (
            atRiskProvinces.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-4xl">✨</span>
                <p className="text-stone-500 mt-2">No provinces at risk</p>
              </div>
            ) : (
              <div className="space-y-3">
                {atRiskProvinces
                  .sort((a, b) => b.risk - a.risk)
                  .map(province => (
                    <div
                      key={province.province}
                      className={`rounded-lg p-4 ${
                        province.risk > 75
                          ? 'bg-red-50 border border-red-200'
                          : province.risk > 50
                          ? 'bg-amber-50 border border-amber-200'
                          : 'bg-stone-50 border border-stone-200'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <span className="font-semibold text-stone-800">{province.province}</span>
                          <span className="ml-2 text-xs text-stone-500">
                            {REBELLION_TYPES[province.potentialType].name}
                          </span>
                        </div>
                        <span className={`font-bold ${
                          province.risk > 75 ? 'text-red-600' :
                          province.risk > 50 ? 'text-amber-600' :
                          'text-stone-600'
                        }`}>
                          {province.risk}% risk
                        </span>
                      </div>

                      {/* Risk factors */}
                      <div className="space-y-1 mb-3">
                        {province.factors.map((factor, i) => (
                          <div key={i} className="flex justify-between text-xs">
                            <span className="flex items-center gap-1 text-stone-600">
                              {factor.icon} {factor.name}
                            </span>
                            <span className={factor.value > 0 ? 'text-red-600' : 'text-green-600'}>
                              {factor.value > 0 ? '+' : ''}{factor.value}%
                            </span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => onReduceUnrest(province.province)}
                        className="w-full py-2 bg-stone-600 text-white rounded text-sm hover:bg-stone-700"
                      >
                        Reduce Unrest
                      </button>
                    </div>
                  ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default RebellionPanel;
