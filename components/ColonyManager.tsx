import React, { useState } from 'react';

interface Colony {
  id: string;
  name: string;
  population: number;
  targetPopulation: number;
  growthRate: number;
  monthsRemaining: number;
  hasSettler: boolean;
  nativeHostility: number;
  region: string;
}

interface Colonist {
  id: string;
  assigned: boolean;
  colonyId?: string;
}

interface ColonyManagerProps {
  colonies: Colony[];
  colonists: Colonist[];
  colonialMaintenance: number;
  rangeModifier: number;
  onAssignColonist?: (colonyId: string) => void;
  onRecallColonist?: (colonyId: string) => void;
  onAbandonColony?: (colonyId: string) => void;
  onClose: () => void;
}

export default function ColonyManager({
  colonies,
  colonists,
  colonialMaintenance,
  rangeModifier,
  onAssignColonist,
  onRecallColonist,
  onAbandonColony,
  onClose
}: ColonyManagerProps) {
  const [selectedColony, setSelectedColony] = useState<string | null>(null);

  const availableColonists = colonists.filter(c => !c.assigned).length;
  const selectedColonyData = colonies.find(c => c.id === selectedColony);

  const getProgressColor = (population: number, target: number) => {
    const progress = (population / target) * 100;
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const getStatus = (population: number, target: number) => {
    const progress = (population / target) * 100;
    if (progress >= 100) return 'Complete';
    if (progress >= 75) return 'Thriving';
    if (progress >= 50) return 'Growing';
    if (progress >= 25) return 'Struggling';
    return 'Starting';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-stone-800 rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-stone-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-amber-100">Colonies</h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200"
          >
            ✕
          </button>
        </div>

        {/* Summary */}
        <div className="px-4 py-3 bg-stone-900 grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-lg font-bold text-amber-400">{colonies.length}</div>
            <div className="text-xs text-stone-400">Colonies</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-400">
              {availableColonists}/{colonists.length}
            </div>
            <div className="text-xs text-stone-400">Colonists</div>
          </div>
          <div>
            <div className="text-lg font-bold text-red-400">
              {colonialMaintenance.toFixed(1)}
            </div>
            <div className="text-xs text-stone-400">Maintenance</div>
          </div>
        </div>

        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {colonies.length === 0 ? (
            <div className="text-center py-8 text-stone-400">
              <div className="text-3xl mb-2">🏴</div>
              <div>No active colonies</div>
              <div className="text-xs mt-1">
                Range: +{rangeModifier} | {availableColonists} colonist(s) available
              </div>
            </div>
          ) : (
            colonies.map(colony => (
              <div
                key={colony.id}
                onClick={() => setSelectedColony(colony.id)}
                className={`bg-stone-700 rounded-lg p-3 cursor-pointer transition-colors ${
                  selectedColony === colony.id ? 'ring-2 ring-amber-500' : 'hover:bg-stone-600'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium">{colony.name}</div>
                    <div className="text-xs text-stone-400">{colony.region}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">
                      {colony.population} / {colony.targetPopulation}
                    </div>
                    <div className="text-xs text-stone-400">
                      {getStatus(colony.population, colony.targetPopulation)}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-2">
                  <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getProgressColor(colony.population, colony.targetPopulation)} transition-all`}
                      style={{ width: `${(colony.population / colony.targetPopulation) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between text-xs">
                  <span>
                    Growth: <span className="text-green-400">+{colony.growthRate}/mo</span>
                  </span>
                  <span>
                    {colony.monthsRemaining > 0
                      ? `${colony.monthsRemaining} months left`
                      : 'Complete'}
                  </span>
                </div>

                {colony.nativeHostility > 0 && (
                  <div className="mt-1 text-xs text-orange-400">
                    Native hostility: {colony.nativeHostility}
                  </div>
                )}

                {!colony.hasSettler && (
                  <div className="mt-1 text-xs text-red-400">
                    No colonist assigned - growth halted
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Actions for selected colony */}
        {selectedColonyData && (
          <div className="p-3 border-t border-stone-700 space-y-2">
            <div className="text-sm font-medium text-stone-400 mb-2">
              Actions - {selectedColonyData.name}
            </div>
            {selectedColonyData.hasSettler ? (
              <button
                onClick={() => onRecallColonist?.(selectedColonyData.id)}
                className="w-full py-2 bg-stone-600 hover:bg-stone-500 rounded text-sm"
              >
                Recall Colonist
              </button>
            ) : (
              <button
                onClick={() => onAssignColonist?.(selectedColonyData.id)}
                disabled={availableColonists === 0}
                className={`w-full py-2 rounded text-sm ${
                  availableColonists > 0
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-stone-600 text-stone-400 cursor-not-allowed'
                }`}
              >
                Assign Colonist
              </button>
            )}
            <button
              onClick={() => onAbandonColony?.(selectedColonyData.id)}
              className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
            >
              Abandon Colony
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
