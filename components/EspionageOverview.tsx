import React, { useState } from 'react';

interface Spy {
  id: string;
  name: string;
  skill: number;
  location: string;
  mission?: SpyMission;
  discovered: boolean;
}

interface SpyMission {
  type: MissionType;
  target: string;
  progress: number;
  timeRemaining: number;
}

type MissionType =
  | 'build_spy_network'
  | 'study_technology'
  | 'support_rebels'
  | 'sabotage_recruitment'
  | 'sow_discontent'
  | 'steal_maps'
  | 'infiltrate_administration'
  | 'counter_espionage';

interface EspionageOverviewProps {
  spies: Spy[];
  maxSpies: number;
  spyNetworks: Map<string, number>;
  counterIntelligence: number;
  onClose: () => void;
  onAssignMission?: (spyId: string, mission: MissionType, target: string) => void;
  onRecallSpy?: (spyId: string) => void;
  onRecruitSpy?: () => void;
}

export default function EspionageOverview({
  spies,
  maxSpies,
  spyNetworks,
  counterIntelligence,
  onClose,
  onAssignMission,
  onRecallSpy,
  onRecruitSpy
}: EspionageOverviewProps) {
  const [selectedSpy, setSelectedSpy] = useState<Spy | null>(
    spies.length > 0 ? spies[0] : null
  );
  const [selectedMission, setSelectedMission] = useState<MissionType | null>(null);

  const missions: { type: MissionType; name: string; icon: string; description: string }[] = [
    { type: 'build_spy_network', name: 'Build Network', icon: '🕸️', description: 'Build spy network in target nation' },
    { type: 'study_technology', name: 'Study Technology', icon: '📚', description: 'Study target\'s technology' },
    { type: 'support_rebels', name: 'Support Rebels', icon: '🔥', description: 'Support rebel factions' },
    { type: 'sabotage_recruitment', name: 'Sabotage Recruitment', icon: '⚔️', description: 'Disrupt military recruitment' },
    { type: 'sow_discontent', name: 'Sow Discontent', icon: '😠', description: 'Increase unrest in provinces' },
    { type: 'steal_maps', name: 'Steal Maps', icon: '🗺️', description: 'Reveal unexplored territory' },
    { type: 'infiltrate_administration', name: 'Infiltrate', icon: '🏛️', description: 'Infiltrate government' },
    { type: 'counter_espionage', name: 'Counter Espionage', icon: '🛡️', description: 'Protect against enemy spies' }
  ];

  const getMissionIcon = (type: MissionType): string => {
    return missions.find(m => m.type === type)?.icon || '🕵️';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-stone-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-stone-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-amber-100">🕵️ Espionage</h2>
            <div className="text-xs text-stone-400">
              Spies: {spies.length}/{maxSpies} • Counter Intel: {counterIntelligence}%
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Spy list */}
          <div className="w-1/3 p-4 border-r border-stone-700 overflow-y-auto space-y-2">
            {spies.length === 0 ? (
              <div className="text-center py-8 text-stone-400">
                <div className="text-3xl mb-2">🕵️</div>
                <div>No spies recruited</div>
              </div>
            ) : (
              spies.map(spy => (
                <div
                  key={spy.id}
                  onClick={() => setSelectedSpy(spy)}
                  className={`bg-stone-700 rounded-lg p-3 cursor-pointer transition-colors ${
                    selectedSpy?.id === spy.id
                      ? 'ring-2 ring-amber-500'
                      : 'hover:bg-stone-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-amber-100">{spy.name}</span>
                    <span className="text-xs bg-stone-600 px-1.5 py-0.5 rounded">
                      Skill: {spy.skill}
                    </span>
                  </div>

                  {spy.mission ? (
                    <div className="text-xs">
                      <div className="flex items-center gap-1 text-stone-300 mb-1">
                        <span>{getMissionIcon(spy.mission.type)}</span>
                        <span>{spy.mission.type.replace(/_/g, ' ')}</span>
                      </div>
                      <div className="h-1 bg-stone-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500"
                          style={{ width: `${spy.mission.progress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-stone-400">
                      {spy.location ? `In ${spy.location}` : 'Idle'}
                    </div>
                  )}

                  {spy.discovered && (
                    <div className="mt-1 text-xs text-red-400">
                      ⚠️ Discovered!
                    </div>
                  )}
                </div>
              ))
            )}

            {onRecruitSpy && spies.length < maxSpies && (
              <button
                onClick={onRecruitSpy}
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded text-sm"
              >
                + Recruit Spy
              </button>
            )}
          </div>

          {/* Spy details / Mission assignment */}
          <div className="flex-1 p-4 overflow-y-auto">
            {selectedSpy ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🕵️</span>
                  <div>
                    <h3 className="font-bold text-amber-100">{selectedSpy.name}</h3>
                    <div className="text-sm text-stone-400">
                      Skill Level: {selectedSpy.skill}
                    </div>
                  </div>
                </div>

                {/* Current mission */}
                {selectedSpy.mission && (
                  <div className="bg-stone-700 rounded-lg p-3">
                    <div className="text-xs text-stone-400 mb-1">Current Mission</div>
                    <div className="font-medium text-amber-100 mb-2">
                      {getMissionIcon(selectedSpy.mission.type)} {selectedSpy.mission.type.replace(/_/g, ' ')}
                    </div>
                    <div className="text-xs text-stone-300 mb-2">
                      Target: {selectedSpy.mission.target}
                    </div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>{selectedSpy.mission.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500"
                        style={{ width: `${selectedSpy.mission.progress}%` }}
                      />
                    </div>
                    <div className="text-xs text-stone-400 mt-2">
                      Time remaining: {selectedSpy.mission.timeRemaining} months
                    </div>
                    {onRecallSpy && (
                      <button
                        onClick={() => onRecallSpy(selectedSpy.id)}
                        className="mt-2 w-full py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
                      >
                        Recall Spy
                      </button>
                    )}
                  </div>
                )}

                {/* Available missions */}
                {!selectedSpy.mission && (
                  <div>
                    <h4 className="text-xs text-stone-400 mb-2">Available Missions</h4>
                    <div className="space-y-2">
                      {missions.map(mission => (
                        <div
                          key={mission.type}
                          onClick={() => setSelectedMission(mission.type)}
                          className={`bg-stone-700 rounded-lg p-3 cursor-pointer transition-colors ${
                            selectedMission === mission.type
                              ? 'ring-2 ring-amber-500'
                              : 'hover:bg-stone-600'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span>{mission.icon}</span>
                            <span className="font-medium text-amber-100">{mission.name}</span>
                          </div>
                          <p className="text-xs text-stone-400">{mission.description}</p>
                        </div>
                      ))}
                    </div>

                    {selectedMission && onAssignMission && (
                      <button
                        onClick={() => {
                          onAssignMission(selectedSpy.id, selectedMission, '');
                          setSelectedMission(null);
                        }}
                        className="mt-3 w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded text-sm"
                      >
                        Assign Mission
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-stone-400">
                <div className="text-3xl mb-2">🕵️</div>
                <div>Select a spy to view details</div>
              </div>
            )}
          </div>

          {/* Spy networks */}
          <div className="w-1/4 p-4 border-l border-stone-700 overflow-y-auto">
            <h4 className="text-xs text-stone-400 mb-3">Spy Networks</h4>
            {spyNetworks.size === 0 ? (
              <div className="text-xs text-stone-500 text-center py-4">
                No networks established
              </div>
            ) : (
              <div className="space-y-2">
                {Array.from(spyNetworks.entries()).map(([nation, strength]) => (
                  <div key={nation} className="bg-stone-700 rounded p-2">
                    <div className="text-xs font-medium text-amber-100 mb-1">{nation}</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-stone-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{ width: `${strength}%` }}
                        />
                      </div>
                      <span className="text-xs text-green-400">{strength}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
