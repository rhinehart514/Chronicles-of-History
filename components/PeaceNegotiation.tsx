import React, { useState } from 'react';

export interface PeaceDemand {
  id: string;
  type: DemandType;
  name: string;
  description: string;
  cost: number; // War score cost
  target?: string; // Province/nation ID
}

export type DemandType =
  | 'concede_defeat'
  | 'white_peace'
  | 'cede_province'
  | 'release_nation'
  | 'become_vassal'
  | 'pay_reparations'
  | 'revoke_claims'
  | 'return_cores'
  | 'humiliate'
  | 'trade_agreement';

interface WarParticipant {
  id: string;
  name: string;
  flag: string;
  isLeader: boolean;
  warScore: number;
  casualties: number;
}

interface PeaceNegotiationProps {
  isOpen: boolean;
  onClose: () => void;
  warName: string;
  warScore: number; // -100 to 100
  attackers: WarParticipant[];
  defenders: WarParticipant[];
  playerSide: 'attacker' | 'defender';
  availableDemands: PeaceDemand[];
  onProposePeace: (demands: PeaceDemand[]) => void;
  onAcceptAI: (aiDemands: PeaceDemand[]) => void;
}

export const PeaceNegotiation: React.FC<PeaceNegotiationProps> = ({
  isOpen,
  onClose,
  warName,
  warScore,
  attackers,
  defenders,
  playerSide,
  availableDemands,
  onProposePeace,
  onAcceptAI
}) => {
  const [selectedDemands, setSelectedDemands] = useState<PeaceDemand[]>([]);
  const [tab, setTab] = useState<'demands' | 'overview'>('demands');

  if (!isOpen) return null;

  const totalCost = selectedDemands.reduce((sum, d) => sum + d.cost, 0);
  const availableScore = playerSide === 'attacker'
    ? Math.max(0, warScore)
    : Math.max(0, -warScore);

  const canAddDemand = (demand: PeaceDemand) => {
    return totalCost + demand.cost <= availableScore;
  };

  const toggleDemand = (demand: PeaceDemand) => {
    if (selectedDemands.find(d => d.id === demand.id)) {
      setSelectedDemands(selectedDemands.filter(d => d.id !== demand.id));
    } else if (canAddDemand(demand)) {
      setSelectedDemands([...selectedDemands, demand]);
    }
  };

  const getScoreColor = (score: number) => {
    if (score > 25) return 'text-green-600';
    if (score < -25) return 'text-red-600';
    return 'text-amber-600';
  };

  const getDemandIcon = (type: DemandType) => {
    switch (type) {
      case 'concede_defeat': return '🏳️';
      case 'white_peace': return '🕊️';
      case 'cede_province': return '🗺️';
      case 'release_nation': return '🏛️';
      case 'become_vassal': return '👑';
      case 'pay_reparations': return '💰';
      case 'revoke_claims': return '📜';
      case 'return_cores': return '🔙';
      case 'humiliate': return '😤';
      case 'trade_agreement': return '🤝';
      default: return '📋';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-stone-800">🕊️ Peace Negotiation</h2>
            <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
              ×
            </button>
          </div>
          <div className="text-sm text-stone-600 mt-1">{warName}</div>
        </div>

        {/* War score bar */}
        <div className="p-4 border-b border-stone-200 bg-stone-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-stone-600">War Score</span>
            <span className={`font-bold ${getScoreColor(warScore)}`}>
              {warScore > 0 ? '+' : ''}{warScore}%
            </span>
          </div>
          <div className="relative h-4 bg-stone-300 rounded-full overflow-hidden">
            <div className="absolute inset-0 flex">
              <div className="w-1/2 bg-red-200" />
              <div className="w-1/2 bg-green-200" />
            </div>
            <div
              className="absolute top-0 bottom-0 w-1 bg-stone-800"
              style={{ left: `${50 + warScore / 2}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-stone-500 mt-1">
            <span>Defender Victory</span>
            <span>Attacker Victory</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="p-2 border-b border-stone-200 flex gap-2">
          <button
            onClick={() => setTab('demands')}
            className={`px-4 py-2 rounded text-sm font-medium ${
              tab === 'demands'
                ? 'bg-amber-600 text-white'
                : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
            }`}
          >
            Peace Terms
          </button>
          <button
            onClick={() => setTab('overview')}
            className={`px-4 py-2 rounded text-sm font-medium ${
              tab === 'overview'
                ? 'bg-amber-600 text-white'
                : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
            }`}
          >
            War Overview
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {tab === 'demands' && (
            <div className="flex gap-4">
              {/* Available demands */}
              <div className="flex-1">
                <h3 className="font-semibold text-stone-800 mb-3">Available Demands</h3>
                <div className="space-y-2">
                  {availableDemands.map(demand => {
                    const isSelected = selectedDemands.find(d => d.id === demand.id);
                    const canAdd = canAddDemand(demand);
                    return (
                      <button
                        key={demand.id}
                        onClick={() => toggleDemand(demand)}
                        disabled={!isSelected && !canAdd}
                        className={`w-full p-3 rounded-lg border text-left transition-all ${
                          isSelected
                            ? 'border-green-500 bg-green-50'
                            : canAdd
                            ? 'border-stone-200 hover:border-amber-500 hover:bg-amber-50'
                            : 'border-stone-200 bg-stone-100 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <span>{getDemandIcon(demand.type)}</span>
                            <div>
                              <div className="font-medium text-stone-800 text-sm">
                                {demand.name}
                              </div>
                              <div className="text-xs text-stone-500">
                                {demand.description}
                              </div>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            isSelected ? 'bg-green-200 text-green-800' : 'bg-stone-200 text-stone-700'
                          }`}>
                            {demand.cost}%
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected demands */}
              <div className="w-64 border-l border-stone-200 pl-4">
                <h3 className="font-semibold text-stone-800 mb-3">Selected Terms</h3>
                {selectedDemands.length === 0 ? (
                  <p className="text-sm text-stone-500">No terms selected</p>
                ) : (
                  <div className="space-y-2">
                    {selectedDemands.map(demand => (
                      <div key={demand.id} className="flex justify-between items-center bg-green-50 p-2 rounded">
                        <span className="text-sm text-stone-800">{demand.name}</span>
                        <button
                          onClick={() => toggleDemand(demand)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-stone-200">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-stone-600">Cost:</span>
                    <span className="font-bold">{totalCost}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600">Available:</span>
                    <span className="font-bold">{availableScore}%</span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-2 mt-2">
                    <div
                      className={`h-2 rounded-full ${
                        totalCost > availableScore ? 'bg-red-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(100, (totalCost / availableScore) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'overview' && (
            <div className="grid grid-cols-2 gap-6">
              {/* Attackers */}
              <div>
                <h3 className="font-semibold text-red-600 mb-3">⚔️ Attackers</h3>
                <div className="space-y-2">
                  {attackers.map(p => (
                    <div key={p.id} className="bg-red-50 rounded p-3">
                      <div className="flex items-center gap-2">
                        <span>{p.flag}</span>
                        <span className="font-medium text-stone-800">
                          {p.name}
                          {p.isLeader && ' (Leader)'}
                        </span>
                      </div>
                      <div className="text-xs text-stone-500 mt-1">
                        Casualties: {p.casualties.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Defenders */}
              <div>
                <h3 className="font-semibold text-blue-600 mb-3">🛡️ Defenders</h3>
                <div className="space-y-2">
                  {defenders.map(p => (
                    <div key={p.id} className="bg-blue-50 rounded p-3">
                      <div className="flex items-center gap-2">
                        <span>{p.flag}</span>
                        <span className="font-medium text-stone-800">
                          {p.name}
                          {p.isLeader && ' (Leader)'}
                        </span>
                      </div>
                      <div className="text-xs text-stone-500 mt-1">
                        Casualties: {p.casualties.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-300 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-300 text-stone-700 rounded hover:bg-stone-400"
          >
            Cancel
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => onProposePeace([])}
              className="px-4 py-2 bg-white border border-stone-300 text-stone-700 rounded hover:bg-stone-100"
            >
              🕊️ White Peace
            </button>
            <button
              onClick={() => onProposePeace(selectedDemands)}
              disabled={selectedDemands.length === 0 || totalCost > availableScore}
              className={`px-4 py-2 rounded font-medium ${
                selectedDemands.length > 0 && totalCost <= availableScore
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-stone-300 text-stone-500 cursor-not-allowed'
              }`}
            >
              Send Peace Offer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeaceNegotiation;
