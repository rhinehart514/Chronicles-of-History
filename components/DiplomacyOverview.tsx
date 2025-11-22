import React, { useState } from 'react';

export interface DiplomaticSummary {
  allies: { id: string; name: string; flag: string; since: number }[];
  wars: { id: string; enemy: string; flag: string; warScore: number; duration: number }[];
  rivals: { id: string; name: string; flag: string }[];
  royalMarriages: { id: string; name: string; flag: string }[];
  truces: { id: string; name: string; flag: string; expiresIn: number }[];
  guaranteeing: { id: string; name: string; flag: string }[];
  guaranteedBy: { id: string; name: string; flag: string }[];
  vassals: { id: string; name: string; flag: string; liberty: number }[];
}

interface DiplomacyOverviewProps {
  isOpen: boolean;
  onClose: () => void;
  summary: DiplomaticSummary;
  diplomaticReputation: number;
  aggressiveExpansion: number;
  onViewNation: (nationId: string) => void;
  onBreakAlliance: (nationId: string) => void;
  onEndRivalry: (nationId: string) => void;
}

export const DiplomacyOverview: React.FC<DiplomacyOverviewProps> = ({
  isOpen,
  onClose,
  summary,
  diplomaticReputation,
  aggressiveExpansion,
  onViewNation,
  onBreakAlliance,
  onEndRivalry
}) => {
  const [tab, setTab] = useState<'allies' | 'wars' | 'other'>('allies');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <h2 className="text-xl font-bold text-stone-800">🌐 Diplomatic Overview</h2>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Stats */}
        <div className="p-3 border-b border-stone-200 grid grid-cols-4 gap-4 bg-stone-100">
          <div className="text-center">
            <div className="text-xs text-stone-500">Allies</div>
            <div className="font-bold text-green-600">{summary.allies.length}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-stone-500">Wars</div>
            <div className="font-bold text-red-600">{summary.wars.length}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-stone-500">Reputation</div>
            <div className={`font-bold ${diplomaticReputation >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {diplomaticReputation > 0 ? '+' : ''}{diplomaticReputation}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-stone-500">AE</div>
            <div className={`font-bold ${aggressiveExpansion > 50 ? 'text-red-600' : 'text-amber-600'}`}>
              {aggressiveExpansion}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="p-2 border-b border-stone-200 flex gap-2">
          <button
            onClick={() => setTab('allies')}
            className={`px-4 py-2 rounded text-sm font-medium ${
              tab === 'allies' ? 'bg-green-600 text-white' : 'bg-stone-200 text-stone-700'
            }`}
          >
            Allies & Friends
          </button>
          <button
            onClick={() => setTab('wars')}
            className={`px-4 py-2 rounded text-sm font-medium ${
              tab === 'wars' ? 'bg-red-600 text-white' : 'bg-stone-200 text-stone-700'
            }`}
          >
            Wars & Rivals
          </button>
          <button
            onClick={() => setTab('other')}
            className={`px-4 py-2 rounded text-sm font-medium ${
              tab === 'other' ? 'bg-stone-600 text-white' : 'bg-stone-200 text-stone-700'
            }`}
          >
            Other Relations
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {tab === 'allies' && (
            <div className="space-y-4">
              {/* Allies */}
              <div>
                <h3 className="font-semibold text-green-600 mb-3">🤝 Allies</h3>
                {summary.allies.length === 0 ? (
                  <p className="text-stone-500 text-sm">No allies</p>
                ) : (
                  <div className="space-y-2">
                    {summary.allies.map(ally => (
                      <div key={ally.id} className="bg-green-50 rounded p-3 flex items-center justify-between">
                        <button
                          onClick={() => onViewNation(ally.id)}
                          className="flex items-center gap-2 hover:underline"
                        >
                          <span>{ally.flag}</span>
                          <span className="font-medium text-stone-800">{ally.name}</span>
                        </button>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-stone-500">Since {ally.since}</span>
                          <button
                            onClick={() => onBreakAlliance(ally.id)}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            Break
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Royal Marriages */}
              {summary.royalMarriages.length > 0 && (
                <div>
                  <h3 className="font-semibold text-purple-600 mb-3">💒 Royal Marriages</h3>
                  <div className="space-y-2">
                    {summary.royalMarriages.map(marriage => (
                      <div key={marriage.id} className="bg-purple-50 rounded p-3 flex items-center gap-2">
                        <span>{marriage.flag}</span>
                        <span className="font-medium text-stone-800">{marriage.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Guarantees */}
              {(summary.guaranteeing.length > 0 || summary.guaranteedBy.length > 0) && (
                <div>
                  <h3 className="font-semibold text-blue-600 mb-3">🛡️ Guarantees</h3>
                  {summary.guaranteeing.length > 0 && (
                    <div className="mb-2">
                      <div className="text-xs text-stone-500 mb-1">We guarantee:</div>
                      <div className="flex flex-wrap gap-2">
                        {summary.guaranteeing.map(nation => (
                          <span key={nation.id} className="bg-blue-100 px-2 py-1 rounded text-sm">
                            {nation.flag} {nation.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {summary.guaranteedBy.length > 0 && (
                    <div>
                      <div className="text-xs text-stone-500 mb-1">Guaranteed by:</div>
                      <div className="flex flex-wrap gap-2">
                        {summary.guaranteedBy.map(nation => (
                          <span key={nation.id} className="bg-blue-100 px-2 py-1 rounded text-sm">
                            {nation.flag} {nation.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {tab === 'wars' && (
            <div className="space-y-4">
              {/* Active Wars */}
              <div>
                <h3 className="font-semibold text-red-600 mb-3">⚔️ Active Wars</h3>
                {summary.wars.length === 0 ? (
                  <p className="text-stone-500 text-sm">At peace</p>
                ) : (
                  <div className="space-y-2">
                    {summary.wars.map(war => (
                      <div key={war.id} className="bg-red-50 rounded p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span>{war.flag}</span>
                            <span className="font-medium text-stone-800">{war.enemy}</span>
                          </div>
                          <span className={`font-bold ${war.warScore >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {war.warScore > 0 ? '+' : ''}{war.warScore}%
                          </span>
                        </div>
                        <div className="text-xs text-stone-500">
                          Duration: {war.duration} months
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Rivals */}
              <div>
                <h3 className="font-semibold text-orange-600 mb-3">😤 Rivals</h3>
                {summary.rivals.length === 0 ? (
                  <p className="text-stone-500 text-sm">No rivals</p>
                ) : (
                  <div className="space-y-2">
                    {summary.rivals.map(rival => (
                      <div key={rival.id} className="bg-orange-50 rounded p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span>{rival.flag}</span>
                          <span className="font-medium text-stone-800">{rival.name}</span>
                        </div>
                        <button
                          onClick={() => onEndRivalry(rival.id)}
                          className="text-xs text-stone-500 hover:text-stone-700"
                        >
                          End Rivalry
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Truces */}
              {summary.truces.length > 0 && (
                <div>
                  <h3 className="font-semibold text-stone-600 mb-3">🕊️ Truces</h3>
                  <div className="space-y-2">
                    {summary.truces.map(truce => (
                      <div key={truce.id} className="bg-stone-100 rounded p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span>{truce.flag}</span>
                          <span className="font-medium text-stone-800">{truce.name}</span>
                        </div>
                        <span className="text-xs text-stone-500">
                          Expires in {truce.expiresIn} months
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'other' && (
            <div className="space-y-4">
              {/* Vassals */}
              <div>
                <h3 className="font-semibold text-amber-600 mb-3">👑 Subject Nations</h3>
                {summary.vassals.length === 0 ? (
                  <p className="text-stone-500 text-sm">No subject nations</p>
                ) : (
                  <div className="space-y-2">
                    {summary.vassals.map(vassal => (
                      <div key={vassal.id} className="bg-amber-50 rounded p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span>{vassal.flag}</span>
                            <span className="font-medium text-stone-800">{vassal.name}</span>
                          </div>
                          <span className={`text-xs ${vassal.liberty > 50 ? 'text-red-600' : 'text-green-600'}`}>
                            Liberty: {vassal.liberty}%
                          </span>
                        </div>
                        <div className="w-full bg-stone-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${vassal.liberty > 50 ? 'bg-red-500' : 'bg-green-500'}`}
                            style={{ width: `${vassal.liberty}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiplomacyOverview;
