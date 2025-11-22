import React, { useState } from 'react';

export interface Coalition {
  id: string;
  name: string;
  target: string;
  targetFlag: string;
  members: CoalitionMember[];
  formed: number;
  warDeclared: boolean;
}

export interface CoalitionMember {
  nationId: string;
  name: string;
  flag: string;
  strength: number;
  leader: boolean;
}

export interface CoalitionTarget {
  nationId: string;
  name: string;
  flag: string;
  aggressiveExpansion: number;
  potentialMembers: number;
  totalStrength: number;
}

interface CoalitionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeCoalitions: Coalition[];
  coalitionTargets: CoalitionTarget[];
  playerAE: number;
  playerInCoalition: boolean;
  onJoinCoalition: (coalitionId: string) => void;
  onLeaveCoalition: (coalitionId: string) => void;
  onFormCoalition: (targetId: string) => void;
  onDeclareCoalitionWar: (coalitionId: string) => void;
}

export const CoalitionPanel: React.FC<CoalitionPanelProps> = ({
  isOpen,
  onClose,
  activeCoalitions,
  coalitionTargets,
  playerAE,
  playerInCoalition,
  onJoinCoalition,
  onLeaveCoalition,
  onFormCoalition,
  onDeclareCoalitionWar
}) => {
  const [tab, setTab] = useState<'active' | 'targets'>('active');

  if (!isOpen) return null;

  const playerCoalition = activeCoalitions.find(c =>
    c.members.some(m => m.leader)
  );

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-stone-800">⚔️ Coalitions</h2>
            <div className="text-sm text-stone-500">
              {activeCoalitions.length} active coalition{activeCoalitions.length !== 1 ? 's' : ''}
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Player AE warning */}
        {playerAE > 50 && (
          <div className="p-3 bg-red-100 border-b border-red-200">
            <div className="flex items-center gap-2 text-red-700">
              <span>⚠️</span>
              <div>
                <div className="font-semibold">High Aggressive Expansion: {playerAE}</div>
                <div className="text-xs">Nations may form a coalition against you!</div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="p-2 border-b border-stone-200 flex gap-2">
          <button
            onClick={() => setTab('active')}
            className={`px-4 py-2 rounded text-sm font-medium ${
              tab === 'active' ? 'bg-red-600 text-white' : 'bg-stone-200 text-stone-700'
            }`}
          >
            Active Coalitions
          </button>
          <button
            onClick={() => setTab('targets')}
            className={`px-4 py-2 rounded text-sm font-medium ${
              tab === 'targets' ? 'bg-red-600 text-white' : 'bg-stone-200 text-stone-700'
            }`}
          >
            Potential Targets
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {tab === 'active' && (
            activeCoalitions.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-4xl">🕊️</span>
                <p className="text-stone-500 mt-2">No active coalitions</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeCoalitions.map(coalition => {
                  const isPlayerTarget = coalition.target === 'player';
                  const totalStrength = coalition.members.reduce((sum, m) => sum + m.strength, 0);

                  return (
                    <div
                      key={coalition.id}
                      className={`rounded-lg border-2 ${
                        isPlayerTarget
                          ? 'border-red-500 bg-red-50'
                          : 'border-stone-200 bg-stone-100'
                      }`}
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-bold text-stone-800">{coalition.name}</h3>
                            <div className="text-sm text-stone-500">
                              Against: {coalition.targetFlag} {coalition.target}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-stone-800">
                              {totalStrength.toLocaleString()}
                            </div>
                            <div className="text-xs text-stone-500">Combined strength</div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="text-xs text-stone-500 mb-2">Members</div>
                          <div className="flex flex-wrap gap-2">
                            {coalition.members.map(member => (
                              <span
                                key={member.nationId}
                                className={`px-2 py-1 rounded text-sm ${
                                  member.leader
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-white text-stone-700'
                                }`}
                              >
                                {member.flag} {member.name}
                                {member.leader && ' 👑'}
                              </span>
                            ))}
                          </div>
                        </div>

                        {!isPlayerTarget && !playerInCoalition && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => onJoinCoalition(coalition.id)}
                              className="flex-1 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                            >
                              Join Coalition
                            </button>
                          </div>
                        )}

                        {playerCoalition?.id === coalition.id && (
                          <div className="flex gap-2">
                            {!coalition.warDeclared && (
                              <button
                                onClick={() => onDeclareCoalitionWar(coalition.id)}
                                className="flex-1 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                              >
                                ⚔️ Declare War
                              </button>
                            )}
                            <button
                              onClick={() => onLeaveCoalition(coalition.id)}
                              className="flex-1 py-2 bg-stone-300 text-stone-700 rounded text-sm hover:bg-stone-400"
                            >
                              Leave
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}

          {tab === 'targets' && (
            coalitionTargets.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-4xl">✨</span>
                <p className="text-stone-500 mt-2">No nations with high aggressive expansion</p>
              </div>
            ) : (
              <div className="space-y-3">
                {coalitionTargets
                  .sort((a, b) => b.aggressiveExpansion - a.aggressiveExpansion)
                  .map(target => (
                    <div key={target.nationId} className="bg-stone-100 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{target.flag}</span>
                          <div>
                            <div className="font-semibold text-stone-800">{target.name}</div>
                            <div className="text-xs text-stone-500">
                              {target.potentialMembers} potential coalition members
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${
                            target.aggressiveExpansion > 75 ? 'text-red-600' :
                            target.aggressiveExpansion > 50 ? 'text-amber-600' :
                            'text-stone-600'
                          }`}>
                            AE: {target.aggressiveExpansion}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-sm text-stone-500">
                          Potential strength: {target.totalStrength.toLocaleString()}
                        </div>
                        {!playerInCoalition && target.aggressiveExpansion >= 50 && (
                          <button
                            onClick={() => onFormCoalition(target.nationId)}
                            className="px-4 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                          >
                            Form Coalition
                          </button>
                        )}
                      </div>
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

export default CoalitionPanel;
