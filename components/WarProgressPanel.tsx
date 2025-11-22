import React from 'react';

export interface WarProgress {
  warId: string;
  enemyName: string;
  startYear: number;
  warScore: number; // -100 to 100
  battles: Battle[];
  casualties: { player: number; enemy: number };
  territoriesGained: string[];
  territoriesLost: string[];
  warGoal: string;
  allies: string[];
  enemyAllies: string[];
}

export interface Battle {
  id: string;
  name: string;
  year: number;
  result: 'victory' | 'defeat' | 'draw';
  casualties: { player: number; enemy: number };
  significance: 'minor' | 'major' | 'decisive';
}

interface WarProgressPanelProps {
  isOpen: boolean;
  onClose: () => void;
  wars: WarProgress[];
  onSuePeace: (warId: string) => void;
  onEscalate: (warId: string) => void;
}

export const WarProgressPanel: React.FC<WarProgressPanelProps> = ({
  isOpen,
  onClose,
  wars,
  onSuePeace,
  onEscalate
}) => {
  const [selectedWar, setSelectedWar] = React.useState<string | null>(
    wars.length > 0 ? wars[0].warId : null
  );

  if (!isOpen) return null;

  const war = wars.find(w => w.warId === selectedWar);

  const getWarScoreColor = (score: number) => {
    if (score > 50) return 'text-green-600';
    if (score > 20) return 'text-green-500';
    if (score > -20) return 'text-amber-500';
    if (score > -50) return 'text-orange-500';
    return 'text-red-600';
  };

  const getBattleIcon = (result: Battle['result']) => {
    switch (result) {
      case 'victory': return '⚔️';
      case 'defeat': return '💀';
      case 'draw': return '🤝';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border-4 border-red-700">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 bg-gradient-to-b from-red-50 to-transparent flex justify-between items-center">
          <h2 className="text-xl font-bold text-red-800">⚔️ Active Wars</h2>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {wars.length === 0 ? (
          <div className="p-8 text-center text-stone-500">
            <p className="text-4xl mb-4">🕊️</p>
            <p>Your nation is at peace</p>
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
            {/* War list */}
            {wars.length > 1 && (
              <div className="w-1/3 border-r border-stone-200 overflow-y-auto">
                {wars.map((w) => (
                  <button
                    key={w.warId}
                    onClick={() => setSelectedWar(w.warId)}
                    className={`w-full p-3 text-left border-b border-stone-100 ${
                      selectedWar === w.warId ? 'bg-red-50' : 'hover:bg-stone-50'
                    }`}
                  >
                    <div className="font-semibold text-stone-800">vs {w.enemyName}</div>
                    <div className="text-sm text-stone-500">Since {w.startYear}</div>
                    <div className={`text-sm font-bold ${getWarScoreColor(w.warScore)}`}>
                      {w.warScore > 0 ? '+' : ''}{w.warScore}%
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* War details */}
            <div className={`${wars.length > 1 ? 'w-2/3' : 'w-full'} overflow-y-auto p-4`}>
              {war && (
                <div className="space-y-4">
                  {/* War overview */}
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-stone-800">
                      War against {war.enemyName}
                    </h3>
                    <p className="text-sm text-stone-500">
                      Started {war.startYear} • Goal: {war.warGoal}
                    </p>
                  </div>

                  {/* War score */}
                  <div className="bg-white p-4 rounded border border-stone-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-stone-800">War Score</span>
                      <span className={`text-2xl font-bold ${getWarScoreColor(war.warScore)}`}>
                        {war.warScore > 0 ? '+' : ''}{war.warScore}%
                      </span>
                    </div>
                    <div className="w-full bg-stone-200 rounded h-4 overflow-hidden">
                      <div className="h-full flex">
                        <div
                          className="bg-blue-600"
                          style={{ width: `${50 + war.warScore / 2}%` }}
                        />
                        <div
                          className="bg-red-600"
                          style={{ width: `${50 - war.warScore / 2}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-stone-500 mt-1">
                      <span>You</span>
                      <span>{war.enemyName}</span>
                    </div>
                  </div>

                  {/* Casualties & Territories */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded border border-stone-200">
                      <h4 className="font-semibold text-stone-800 mb-2">Casualties</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-stone-600">Your losses</span>
                          <span className="text-red-600">{war.casualties.player.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-600">Enemy losses</span>
                          <span className="text-green-600">{war.casualties.enemy.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded border border-stone-200">
                      <h4 className="font-semibold text-stone-800 mb-2">Territory</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-stone-600">Gained</span>
                          <span className="text-green-600">{war.territoriesGained.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-600">Lost</span>
                          <span className="text-red-600">{war.territoriesLost.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Allies */}
                  {(war.allies.length > 0 || war.enemyAllies.length > 0) && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 p-3 rounded border border-blue-200">
                        <h4 className="font-semibold text-blue-800 mb-1">Your Allies</h4>
                        {war.allies.length > 0 ? (
                          <ul className="text-sm text-blue-700">
                            {war.allies.map(a => <li key={a}>• {a}</li>)}
                          </ul>
                        ) : (
                          <p className="text-sm text-blue-600">Fighting alone</p>
                        )}
                      </div>
                      <div className="bg-red-50 p-3 rounded border border-red-200">
                        <h4 className="font-semibold text-red-800 mb-1">Enemy Allies</h4>
                        {war.enemyAllies.length > 0 ? (
                          <ul className="text-sm text-red-700">
                            {war.enemyAllies.map(a => <li key={a}>• {a}</li>)}
                          </ul>
                        ) : (
                          <p className="text-sm text-red-600">None</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Battles */}
                  {war.battles.length > 0 && (
                    <div className="bg-white p-3 rounded border border-stone-200">
                      <h4 className="font-semibold text-stone-800 mb-2">Recent Battles</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {war.battles.slice(-5).reverse().map((battle) => (
                          <div
                            key={battle.id}
                            className={`p-2 rounded text-sm ${
                              battle.result === 'victory'
                                ? 'bg-green-50 border-l-4 border-green-500'
                                : battle.result === 'defeat'
                                ? 'bg-red-50 border-l-4 border-red-500'
                                : 'bg-stone-50 border-l-4 border-stone-400'
                            }`}
                          >
                            <div className="flex justify-between">
                              <span className="font-medium">
                                {getBattleIcon(battle.result)} {battle.name}
                              </span>
                              <span className="text-stone-500">{battle.year}</span>
                            </div>
                            <div className="text-xs text-stone-500 mt-1">
                              {battle.significance} battle •
                              Losses: {battle.casualties.player} / {battle.casualties.enemy}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => onSuePeace(war.warId)}
                      className="flex-1 py-2 bg-amber-600 text-white rounded font-semibold hover:bg-amber-700"
                    >
                      Sue for Peace
                    </button>
                    <button
                      onClick={() => onEscalate(war.warId)}
                      className="flex-1 py-2 bg-red-600 text-white rounded font-semibold hover:bg-red-700"
                    >
                      Escalate War
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WarProgressPanel;
