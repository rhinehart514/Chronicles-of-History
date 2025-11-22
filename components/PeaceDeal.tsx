import React, { useState } from 'react';

interface PeaceDealProps {
  isOpen: boolean;
  onClose: () => void;
  warScore: number;
  playerSide: WarSide;
  enemySide: WarSide;
  availableDemands: PeaceDemand[];
  onSendOffer: (demands: string[]) => void;
  onAcceptWhitePeace: () => void;
}

interface WarSide {
  leader: Nation;
  participants: Nation[];
  warGoal: string;
  warGoalProgress: number;
}

interface Nation {
  id: string;
  name: string;
  flag: string;
  warExhaustion: number;
}

interface PeaceDemand {
  id: string;
  type: DemandType;
  name: string;
  description: string;
  target: string;
  cost: number;
  aggressiveExpansion: number;
  available: boolean;
  reason?: string;
}

type DemandType = 'province' | 'gold' | 'vassal' | 'release' | 'concede_defeat' | 'annul_treaties' | 'war_reparations';

export const PeaceDeal: React.FC<PeaceDealProps> = ({
  isOpen,
  onClose,
  warScore,
  playerSide,
  enemySide,
  availableDemands,
  onSendOffer,
  onAcceptWhitePeace
}) => {
  const [selectedDemands, setSelectedDemands] = useState<string[]>([]);
  const [filter, setFilter] = useState<DemandType | 'all'>('all');

  if (!isOpen) return null;

  const filteredDemands = availableDemands.filter(d =>
    filter === 'all' || d.type === filter
  );

  const totalCost = selectedDemands.reduce((sum, id) => {
    const demand = availableDemands.find(d => d.id === id);
    return sum + (demand?.cost || 0);
  }, 0);

  const totalAE = selectedDemands.reduce((sum, id) => {
    const demand = availableDemands.find(d => d.id === id);
    return sum + (demand?.aggressiveExpansion || 0);
  }, 0);

  const toggleDemand = (demandId: string) => {
    if (selectedDemands.includes(demandId)) {
      setSelectedDemands(selectedDemands.filter(id => id !== demandId));
    } else {
      setSelectedDemands([...selectedDemands, demandId]);
    }
  };

  const canSend = totalCost <= warScore;

  const getWarScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 25) return 'text-amber-600';
    if (score > -25) return 'text-stone-600';
    return 'text-red-600';
  };

  const getDemandIcon = (type: DemandType) => {
    switch (type) {
      case 'province': return '🗺️';
      case 'gold': return '💰';
      case 'vassal': return '👑';
      case 'release': return '🏴';
      case 'concede_defeat': return '🏳️';
      case 'annul_treaties': return '📜';
      case 'war_reparations': return '💸';
      default: return '❓';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-stone-800">🕊️ Peace Negotiations</h2>
            <div className="text-sm text-stone-500">
              War against {enemySide.leader.flag} {enemySide.leader.name}
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* War score bar */}
        <div className="p-4 border-b border-stone-200 bg-stone-100">
          <div className="flex justify-between items-center mb-2">
            <div className="text-center">
              <div className="text-sm text-stone-600">{playerSide.leader.name}</div>
              <div className="text-xs text-stone-500">
                Exhaustion: {playerSide.leader.warExhaustion.toFixed(1)}%
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getWarScoreColor(warScore)}`}>
                {warScore > 0 ? '+' : ''}{warScore}%
              </div>
              <div className="text-xs text-stone-500">War Score</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-stone-600">{enemySide.leader.name}</div>
              <div className="text-xs text-stone-500">
                Exhaustion: {enemySide.leader.warExhaustion.toFixed(1)}%
              </div>
            </div>
          </div>
          <div className="w-full bg-stone-300 rounded-full h-4 relative">
            <div
              className="absolute top-0 bottom-0 w-1 bg-stone-500"
              style={{ left: '50%' }}
            />
            <div
              className={`h-4 rounded-full ${warScore >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
              style={{
                width: `${Math.abs(warScore) / 2}%`,
                marginLeft: warScore >= 0 ? '50%' : `${50 - Math.abs(warScore) / 2}%`
              }}
            />
          </div>
        </div>

        {/* War goals */}
        <div className="p-3 border-b border-stone-200 grid grid-cols-2 gap-4">
          <div className="p-2 bg-green-50 rounded">
            <div className="text-xs text-stone-500">Your War Goal</div>
            <div className="font-semibold text-stone-800">{playerSide.warGoal}</div>
            <div className="text-xs text-green-600">{playerSide.warGoalProgress}% complete</div>
          </div>
          <div className="p-2 bg-red-50 rounded">
            <div className="text-xs text-stone-500">Enemy War Goal</div>
            <div className="font-semibold text-stone-800">{enemySide.warGoal}</div>
            <div className="text-xs text-red-600">{enemySide.warGoalProgress}% complete</div>
          </div>
        </div>

        {/* Filter */}
        <div className="p-2 border-b border-stone-200 flex gap-1 flex-wrap">
          {[
            { id: 'all', name: 'All' },
            { id: 'province', name: 'Provinces' },
            { id: 'gold', name: 'Gold' },
            { id: 'vassal', name: 'Vassalize' },
            { id: 'release', name: 'Release' },
            { id: 'annul_treaties', name: 'Annul Treaties' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-3 py-1 rounded text-sm ${
                filter === f.id ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-700'
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Available demands */}
          <div className="w-2/3 border-r border-stone-200 overflow-y-auto p-3">
            <h3 className="text-sm font-semibold text-stone-600 mb-2">Available Demands</h3>
            <div className="space-y-2">
              {filteredDemands.map(demand => (
                <button
                  key={demand.id}
                  onClick={() => demand.available && toggleDemand(demand.id)}
                  disabled={!demand.available}
                  className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                    selectedDemands.includes(demand.id)
                      ? 'border-amber-500 bg-amber-50'
                      : demand.available
                      ? 'border-stone-200 bg-white hover:border-stone-300'
                      : 'border-stone-200 bg-stone-100 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getDemandIcon(demand.type)}</span>
                      <div>
                        <div className="font-semibold text-stone-800">{demand.name}</div>
                        <div className="text-xs text-stone-500">{demand.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${demand.cost <= warScore ? 'text-amber-600' : 'text-red-600'}`}>
                        {demand.cost}%
                      </div>
                      {demand.aggressiveExpansion > 0 && (
                        <div className="text-xs text-red-500">AE: +{demand.aggressiveExpansion}</div>
                      )}
                    </div>
                  </div>
                  {!demand.available && demand.reason && (
                    <div className="mt-1 text-xs text-red-500">{demand.reason}</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Selected demands / summary */}
          <div className="w-1/3 p-4 overflow-y-auto">
            <h3 className="text-sm font-semibold text-stone-600 mb-2">Peace Offer</h3>

            {selectedDemands.length === 0 ? (
              <p className="text-sm text-stone-500 py-4">
                Select demands to add to the peace offer
              </p>
            ) : (
              <div className="space-y-2 mb-4">
                {selectedDemands.map(id => {
                  const demand = availableDemands.find(d => d.id === id);
                  if (!demand) return null;
                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between p-2 bg-white rounded border border-stone-200"
                    >
                      <div className="flex items-center gap-2">
                        <span>{getDemandIcon(demand.type)}</span>
                        <span className="text-sm">{demand.name}</span>
                      </div>
                      <button
                        onClick={() => toggleDemand(id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Cost summary */}
            <div className="p-3 bg-stone-100 rounded-lg mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>War Score Cost</span>
                <span className={totalCost <= warScore ? 'text-amber-600' : 'text-red-600'}>
                  {totalCost}%
                </span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span>Available</span>
                <span className={getWarScoreColor(warScore)}>{warScore}%</span>
              </div>
              {totalAE > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Total AE</span>
                  <span className="text-red-600">+{totalAE}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={() => onSendOffer(selectedDemands)}
                disabled={!canSend || selectedDemands.length === 0}
                className={`w-full py-3 rounded font-medium ${
                  canSend && selectedDemands.length > 0
                    ? 'bg-amber-600 text-white hover:bg-amber-700'
                    : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                }`}
              >
                Send Peace Offer
              </button>
              <button
                onClick={onAcceptWhitePeace}
                className="w-full py-2 bg-stone-200 text-stone-700 rounded hover:bg-stone-300"
              >
                Offer White Peace
              </button>
            </div>

            {/* Warning */}
            {totalAE > 50 && (
              <div className="mt-3 p-2 bg-red-100 text-red-700 rounded text-xs">
                ⚠️ High aggressive expansion may cause a coalition to form against you
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeaceDeal;
