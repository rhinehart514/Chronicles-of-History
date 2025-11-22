import React, { useState } from 'react';

interface WarDeclarationProps {
  isOpen: boolean;
  onClose: () => void;
  targetNation: TargetNation;
  casusBelli: CasusBelli[];
  playerAllies: AllyInfo[];
  targetAllies: AllyInfo[];
  warExhaustion: number;
  stability: number;
  manpower: number;
  onDeclareWar: (casusBelliId: string, callAllies: string[]) => void;
}

interface TargetNation {
  id: string;
  name: string;
  flag: string;
  government: string;
  military: number;
  allies: number;
  relations: number;
}

interface CasusBelli {
  id: string;
  name: string;
  icon: string;
  description: string;
  warGoal: string;
  aggressiveExpansion: number;
  available: boolean;
  reason?: string;
}

interface AllyInfo {
  id: string;
  name: string;
  flag: string;
  military: number;
  willJoin: boolean;
  reason?: string;
}

export const WarDeclaration: React.FC<WarDeclarationProps> = ({
  isOpen,
  onClose,
  targetNation,
  casusBelli,
  playerAllies,
  targetAllies,
  warExhaustion,
  stability,
  manpower,
  onDeclareWar
}) => {
  const [selectedCB, setSelectedCB] = useState<string | null>(null);
  const [selectedAllies, setSelectedAllies] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  const selectedCasusBelli = casusBelli.find(cb => cb.id === selectedCB);

  const playerStrength = manpower + playerAllies
    .filter(a => selectedAllies.includes(a.id) && a.willJoin)
    .reduce((sum, a) => sum + a.military, 0);

  const enemyStrength = targetNation.military + targetAllies
    .filter(a => a.willJoin)
    .reduce((sum, a) => sum + a.military, 0);

  const strengthRatio = enemyStrength > 0 ? playerStrength / enemyStrength : 999;

  const toggleAlly = (allyId: string) => {
    if (selectedAllies.includes(allyId)) {
      setSelectedAllies(selectedAllies.filter(id => id !== allyId));
    } else {
      setSelectedAllies([...selectedAllies, allyId]);
    }
  };

  const handleDeclare = () => {
    if (selectedCB && confirmed) {
      onDeclareWar(selectedCB, selectedAllies);
    }
  };

  const canDeclare = selectedCB && confirmed && warExhaustion < 20 && stability > -3;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border-4 border-red-800">
        {/* Header */}
        <div className="p-4 border-b border-red-300 bg-red-50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚔️</span>
            <div>
              <h2 className="text-xl font-bold text-red-800">Declare War</h2>
              <div className="text-sm text-red-600">
                Target: {targetNation.flag} {targetNation.name}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-red-500 hover:text-red-700 text-2xl">
            ×
          </button>
        </div>

        {/* Target info */}
        <div className="p-4 border-b border-stone-200 bg-stone-100 grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-xs text-stone-500">Government</div>
            <div className="font-medium text-stone-800 text-sm">{targetNation.government}</div>
          </div>
          <div>
            <div className="text-xs text-stone-500">Military</div>
            <div className="font-medium text-red-600">{targetNation.military.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-stone-500">Allies</div>
            <div className="font-medium text-stone-800">{targetNation.allies}</div>
          </div>
          <div>
            <div className="text-xs text-stone-500">Relations</div>
            <div className={`font-medium ${targetNation.relations >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {targetNation.relations > 0 ? '+' : ''}{targetNation.relations}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Casus Belli selection */}
          <div className="mb-4">
            <h3 className="font-semibold text-stone-800 mb-2">Select Casus Belli</h3>
            <div className="space-y-2">
              {casusBelli.map(cb => (
                <button
                  key={cb.id}
                  onClick={() => cb.available && setSelectedCB(cb.id)}
                  disabled={!cb.available}
                  className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                    selectedCB === cb.id
                      ? 'border-red-500 bg-red-50'
                      : cb.available
                      ? 'border-stone-200 bg-white hover:border-stone-300'
                      : 'border-stone-200 bg-stone-100 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{cb.icon}</span>
                      <div>
                        <div className="font-semibold text-stone-800">{cb.name}</div>
                        <div className="text-xs text-stone-500">{cb.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-stone-600">Goal: {cb.warGoal}</div>
                      <div className="text-xs text-red-600">AE: +{cb.aggressiveExpansion}</div>
                    </div>
                  </div>
                  {!cb.available && cb.reason && (
                    <div className="mt-2 text-xs text-red-500">{cb.reason}</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Allies */}
          <div className="grid grid-cols-2 gap-4">
            {/* Player allies */}
            <div>
              <h3 className="font-semibold text-stone-800 mb-2">Call Allies to War</h3>
              {playerAllies.length === 0 ? (
                <p className="text-sm text-stone-500">No allies</p>
              ) : (
                <div className="space-y-2">
                  {playerAllies.map(ally => (
                    <button
                      key={ally.id}
                      onClick={() => ally.willJoin && toggleAlly(ally.id)}
                      disabled={!ally.willJoin}
                      className={`w-full p-2 rounded border text-left text-sm ${
                        selectedAllies.includes(ally.id)
                          ? 'border-green-500 bg-green-50'
                          : ally.willJoin
                          ? 'border-stone-200 bg-white'
                          : 'border-stone-200 bg-stone-100 opacity-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{ally.flag} {ally.name}</span>
                        <span className="text-xs">{ally.military.toLocaleString()}</span>
                      </div>
                      {!ally.willJoin && ally.reason && (
                        <div className="text-xs text-red-500 mt-1">{ally.reason}</div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Enemy allies */}
            <div>
              <h3 className="font-semibold text-stone-800 mb-2">Enemy Allies</h3>
              {targetAllies.length === 0 ? (
                <p className="text-sm text-stone-500">No allies</p>
              ) : (
                <div className="space-y-2">
                  {targetAllies.map(ally => (
                    <div
                      key={ally.id}
                      className={`p-2 rounded border text-sm ${
                        ally.willJoin
                          ? 'border-red-200 bg-red-50'
                          : 'border-stone-200 bg-stone-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{ally.flag} {ally.name}</span>
                        <span className="text-xs">{ally.military.toLocaleString()}</span>
                      </div>
                      <div className="text-xs mt-1">
                        {ally.willJoin
                          ? <span className="text-red-600">Will join defender</span>
                          : <span className="text-stone-500">{ally.reason || 'Will not join'}</span>
                        }
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Strength comparison */}
          <div className="mt-4 p-3 bg-stone-100 rounded-lg">
            <h3 className="font-semibold text-stone-800 mb-2 text-center">Military Strength</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1 text-center">
                <div className="text-sm text-stone-600">Your Side</div>
                <div className="text-lg font-bold text-green-600">
                  {playerStrength.toLocaleString()}
                </div>
              </div>
              <div className="text-center">
                <div className={`text-lg font-bold ${
                  strengthRatio >= 1.5 ? 'text-green-600' :
                  strengthRatio >= 1 ? 'text-amber-600' :
                  'text-red-600'
                }`}>
                  {strengthRatio.toFixed(1)}:1
                </div>
              </div>
              <div className="flex-1 text-center">
                <div className="text-sm text-stone-600">Enemy Side</div>
                <div className="text-lg font-bold text-red-600">
                  {enemyStrength.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Warnings */}
          <div className="mt-4 space-y-2">
            {warExhaustion >= 20 && (
              <div className="p-2 bg-red-100 text-red-700 rounded text-sm">
                ⚠️ War exhaustion too high ({warExhaustion}%)
              </div>
            )}
            {stability <= -3 && (
              <div className="p-2 bg-red-100 text-red-700 rounded text-sm">
                ⚠️ Stability too low ({stability})
              </div>
            )}
            {targetNation.relations > 100 && (
              <div className="p-2 bg-amber-100 text-amber-700 rounded text-sm">
                ⚠️ Declaring war on a friendly nation will harm your reputation
              </div>
            )}
            {strengthRatio < 0.5 && (
              <div className="p-2 bg-amber-100 text-amber-700 rounded text-sm">
                ⚠️ The enemy is significantly stronger than you
              </div>
            )}
          </div>

          {/* Confirmation */}
          <div className="mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-stone-700">
                I understand this will start a war and may have serious consequences
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-300 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-200 text-stone-700 rounded hover:bg-stone-300"
          >
            Cancel
          </button>
          <button
            onClick={handleDeclare}
            disabled={!canDeclare}
            className={`px-6 py-2 rounded font-medium ${
              canDeclare
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

export default WarDeclaration;
