import React, { useState } from 'react';

interface CoalitionManagerProps {
  isOpen: boolean;
  onClose: () => void;
  currentAE: AggressiveExpansion[];
  coalitions: Coalition[];
  playerAggressiveExpansion: number;
  onImproveRelations: (nationId: string) => void;
}

interface AggressiveExpansion {
  nation: string;
  nationFlag: string;
  value: number;
  decay: number;
  opinion: number;
  inCoalition: boolean;
  willingToJoin: boolean;
}

interface Coalition {
  id: string;
  leader: string;
  leaderFlag: string;
  members: CoalitionMember[];
  totalStrength: number;
  warLikelihood: number;
}

interface CoalitionMember {
  id: string;
  name: string;
  flag: string;
  military: number;
  ae: number;
}

export const CoalitionManager: React.FC<CoalitionManagerProps> = ({
  isOpen,
  onClose,
  currentAE,
  coalitions,
  playerAggressiveExpansion,
  onImproveRelations
}) => {
  const [selectedNation, setSelectedNation] = useState<string | null>(null);
  const [view, setView] = useState<'ae' | 'coalitions'>('ae');

  if (!isOpen) return null;

  const selected = currentAE.find(ae => ae.nation === selectedNation);

  const sortedAE = [...currentAE].sort((a, b) => b.value - a.value);
  const dangerousAE = currentAE.filter(ae => ae.value >= 50);
  const activeCoalitionMembers = currentAE.filter(ae => ae.inCoalition).length;

  const getAEColor = (value: number) => {
    if (value >= 50) return 'text-red-600';
    if (value >= 30) return 'text-orange-600';
    if (value >= 15) return 'text-amber-600';
    return 'text-stone-600';
  };

  const getAEBarColor = (value: number) => {
    if (value >= 50) return 'bg-red-500';
    if (value >= 30) return 'bg-orange-500';
    if (value >= 15) return 'bg-amber-500';
    return 'bg-green-500';
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border-4 border-red-800">
        {/* Header */}
        <div className="p-4 border-b border-red-300 bg-red-50 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-red-800">⚠️ Coalition & Aggressive Expansion</h2>
            <div className="text-sm text-red-600">
              {dangerousAE.length} nations have dangerous AE • {activeCoalitionMembers} in coalition
            </div>
          </div>
          <button onClick={onClose} className="text-red-500 hover:text-red-700 text-2xl">
            ×
          </button>
        </div>

        {/* Stats */}
        <div className="p-3 border-b border-stone-200 bg-stone-100 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs text-stone-500">Total AE Generated</div>
            <div className="font-bold text-red-600">{playerAggressiveExpansion}</div>
          </div>
          <div>
            <div className="text-xs text-stone-500">Nations with AE</div>
            <div className="font-bold text-amber-600">{currentAE.length}</div>
          </div>
          <div>
            <div className="text-xs text-stone-500">Active Coalitions</div>
            <div className={`font-bold ${coalitions.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {coalitions.length}
            </div>
          </div>
        </div>

        {/* View toggle */}
        <div className="p-2 border-b border-stone-200 flex gap-2">
          <button
            onClick={() => setView('ae')}
            className={`px-4 py-1 rounded text-sm ${
              view === 'ae' ? 'bg-red-600 text-white' : 'bg-stone-200 text-stone-700'
            }`}
          >
            Aggressive Expansion ({currentAE.length})
          </button>
          <button
            onClick={() => setView('coalitions')}
            className={`px-4 py-1 rounded text-sm ${
              view === 'coalitions' ? 'bg-red-600 text-white' : 'bg-stone-200 text-stone-700'
            }`}
          >
            Coalitions ({coalitions.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {view === 'ae' ? (
            <>
              {/* AE list */}
              <div className="w-1/2 border-r border-stone-200 overflow-y-auto p-3">
                {sortedAE.length === 0 ? (
                  <p className="text-center text-stone-500 py-8">
                    No aggressive expansion with any nation
                  </p>
                ) : (
                  <div className="space-y-2">
                    {sortedAE.map(ae => (
                      <button
                        key={ae.nation}
                        onClick={() => setSelectedNation(ae.nation)}
                        className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                          selectedNation === ae.nation
                            ? 'border-red-500 bg-red-50'
                            : ae.inCoalition
                            ? 'border-red-300 bg-red-50'
                            : ae.willingToJoin
                            ? 'border-orange-300 bg-orange-50'
                            : 'border-stone-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{ae.nationFlag}</span>
                            <div>
                              <div className="font-semibold text-stone-800">{ae.nation}</div>
                              <div className="text-xs text-stone-500">
                                Opinion: {ae.opinion > 0 ? '+' : ''}{ae.opinion}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold ${getAEColor(ae.value)}`}>
                              {ae.value.toFixed(0)}
                            </div>
                            <div className="text-xs text-green-600">-{ae.decay.toFixed(1)}/year</div>
                          </div>
                        </div>
                        <div className="w-full bg-stone-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getAEBarColor(ae.value)}`}
                            style={{ width: `${Math.min(100, ae.value)}%` }}
                          />
                        </div>
                        {ae.inCoalition && (
                          <div className="text-xs text-red-600 mt-1">⚠️ In coalition against you</div>
                        )}
                        {ae.willingToJoin && !ae.inCoalition && (
                          <div className="text-xs text-orange-600 mt-1">⚠️ Willing to join coalition</div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected nation details */}
              <div className="w-1/2 p-4 overflow-y-auto">
                {selected ? (
                  <>
                    <div className="text-center mb-4">
                      <span className="text-4xl">{selected.nationFlag}</span>
                      <h3 className="font-bold text-stone-800 mt-2">{selected.nation}</h3>
                    </div>

                    {/* AE meter */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Aggressive Expansion</span>
                        <span className={getAEColor(selected.value)}>{selected.value.toFixed(1)}</span>
                      </div>
                      <div className="w-full bg-stone-200 rounded-full h-4 relative">
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-red-600"
                          style={{ left: '50%' }}
                          title="Coalition threshold"
                        />
                        <div
                          className={`h-4 rounded-full ${getAEBarColor(selected.value)}`}
                          style={{ width: `${Math.min(100, selected.value)}%` }}
                        />
                      </div>
                      <div className="text-xs text-stone-500 text-center mt-1">
                        50+ AE and negative opinion = willing to join coalition
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="p-3 bg-stone-100 rounded text-center">
                        <div className="text-xs text-stone-500">Opinion</div>
                        <div className={`font-bold ${selected.opinion >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {selected.opinion > 0 ? '+' : ''}{selected.opinion}
                        </div>
                      </div>
                      <div className="p-3 bg-stone-100 rounded text-center">
                        <div className="text-xs text-stone-500">Yearly Decay</div>
                        <div className="font-bold text-green-600">-{selected.decay.toFixed(1)}</div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className={`p-3 rounded-lg mb-4 ${
                      selected.inCoalition
                        ? 'bg-red-100 border border-red-300'
                        : selected.willingToJoin
                        ? 'bg-orange-100 border border-orange-300'
                        : 'bg-green-100 border border-green-300'
                    }`}>
                      <div className={`font-semibold ${
                        selected.inCoalition ? 'text-red-700' :
                        selected.willingToJoin ? 'text-orange-700' : 'text-green-700'
                      }`}>
                        {selected.inCoalition
                          ? '⚠️ Currently in coalition'
                          : selected.willingToJoin
                          ? '⚠️ Willing to join coalition'
                          : '✓ Not threatening to join coalition'}
                      </div>
                      <div className="text-xs text-stone-600 mt-1">
                        {selected.inCoalition
                          ? 'This nation is actively hostile and may attack'
                          : selected.willingToJoin
                          ? 'Improve relations or wait for AE to decay'
                          : 'AE is below dangerous threshold'}
                      </div>
                    </div>

                    {/* Actions */}
                    <button
                      onClick={() => onImproveRelations(selected.nation)}
                      className="w-full py-3 bg-blue-600 text-white rounded font-medium hover:bg-blue-700"
                    >
                      Improve Relations
                    </button>

                    {/* Tips */}
                    <div className="mt-4 p-3 bg-amber-50 rounded-lg text-sm">
                      <h4 className="font-semibold text-amber-800 mb-1">Tips to Reduce AE</h4>
                      <ul className="text-xs text-amber-700 space-y-1">
                        <li>• Improve relations to prevent coalition joining</li>
                        <li>• Wait for AE to naturally decay over time</li>
                        <li>• Use claims to reduce AE from conquest</li>
                        <li>• Take fewer provinces in peace deals</li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <p className="text-center text-stone-500 py-8">
                    Select a nation to view details
                  </p>
                )}
              </div>
            </>
          ) : (
            /* Coalitions view */
            <div className="flex-1 overflow-y-auto p-4">
              {coalitions.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">✓</div>
                  <p className="text-green-600 font-semibold">No active coalitions</p>
                  <p className="text-sm text-stone-500 mt-1">
                    Keep aggressive expansion low to prevent coalitions forming
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {coalitions.map(coalition => (
                    <div
                      key={coalition.id}
                      className="p-4 bg-red-50 rounded-lg border-2 border-red-300"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{coalition.leaderFlag}</span>
                          <div>
                            <div className="font-bold text-red-800">
                              Coalition led by {coalition.leader}
                            </div>
                            <div className="text-sm text-stone-600">
                              {coalition.members.length} members
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-red-600">
                            {coalition.totalStrength.toLocaleString()}
                          </div>
                          <div className="text-xs text-stone-500">Total strength</div>
                        </div>
                      </div>

                      {/* War likelihood */}
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>War Likelihood</span>
                          <span className={coalition.warLikelihood > 50 ? 'text-red-600' : 'text-amber-600'}>
                            {coalition.warLikelihood}%
                          </span>
                        </div>
                        <div className="w-full bg-stone-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              coalition.warLikelihood > 50 ? 'bg-red-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${coalition.warLikelihood}%` }}
                          />
                        </div>
                      </div>

                      {/* Members */}
                      <div>
                        <h4 className="text-sm font-semibold text-stone-600 mb-2">Members</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {coalition.members.map(member => (
                            <div
                              key={member.id}
                              className="flex items-center justify-between p-2 bg-white rounded border border-stone-200"
                            >
                              <div className="flex items-center gap-1">
                                <span>{member.flag}</span>
                                <span className="text-sm">{member.name}</span>
                              </div>
                              <span className="text-xs text-stone-500">
                                {member.military.toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoalitionManager;
