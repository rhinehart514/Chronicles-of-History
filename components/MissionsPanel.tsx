import React, { useState } from 'react';
import { Mission, MissionCategory, MissionProgress } from '../data/missionSystem';

interface MissionsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  missions: Mission[];
  progress: MissionProgress[];
  completedMissions: string[];
  onClaimReward: (missionId: string) => void;
}

export const MissionsPanel: React.FC<MissionsPanelProps> = ({
  isOpen,
  onClose,
  missions,
  progress,
  completedMissions,
  onClaimReward
}) => {
  const [categoryFilter, setCategoryFilter] = useState<MissionCategory | 'all'>('all');
  const [selectedMission, setSelectedMission] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories: { id: MissionCategory; name: string; icon: string }[] = [
    { id: 'expansion', name: 'Expansion', icon: '🗺️' },
    { id: 'military', name: 'Military', icon: '⚔️' },
    { id: 'economic', name: 'Economic', icon: '💰' },
    { id: 'diplomatic', name: 'Diplomatic', icon: '🤝' },
    { id: 'cultural', name: 'Cultural', icon: '🎭' },
    { id: 'special', name: 'Special', icon: '⭐' }
  ];

  const filteredMissions = categoryFilter === 'all'
    ? missions
    : missions.filter(m => m.category === categoryFilter);

  const getMissionStatus = (mission: Mission) => {
    if (completedMissions.includes(mission.id)) return 'completed';
    const prog = progress.find(p => p.missionId === mission.id);
    if (prog) {
      const allComplete = prog.requirements.every(r => r.completed);
      if (allComplete && !prog.claimed) return 'ready';
      return 'active';
    }
    return 'locked';
  };

  const selected = missions.find(m => m.id === selectedMission);
  const selectedProgress = progress.find(p => p.missionId === selectedMission);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-stone-800">🎯 Missions</h2>
            <div className="text-sm text-stone-500">
              {completedMissions.length}/{missions.length} completed
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Category filter */}
        <div className="p-2 border-b border-stone-200 flex gap-1 flex-wrap">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1 rounded text-sm ${
              categoryFilter === 'all' ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-700'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1 rounded text-sm ${
                categoryFilter === cat.id ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-700'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Mission list */}
          <div className="w-1/2 border-r border-stone-200 overflow-y-auto">
            {filteredMissions.map(mission => {
              const status = getMissionStatus(mission);
              return (
                <button
                  key={mission.id}
                  onClick={() => setSelectedMission(mission.id)}
                  className={`w-full p-3 text-left border-b border-stone-200 hover:bg-stone-100 ${
                    selectedMission === mission.id ? 'bg-stone-100' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{mission.icon}</span>
                      <div>
                        <div className="font-semibold text-stone-800 text-sm">{mission.name}</div>
                        <div className="text-xs text-stone-500">{mission.category}</div>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      status === 'completed' ? 'bg-green-100 text-green-700' :
                      status === 'ready' ? 'bg-amber-100 text-amber-700' :
                      status === 'active' ? 'bg-blue-100 text-blue-700' :
                      'bg-stone-100 text-stone-500'
                    }`}>
                      {status === 'completed' ? '✓' :
                       status === 'ready' ? '!' :
                       status === 'active' ? '...' : '🔒'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Mission details */}
          <div className="w-1/2 p-4 overflow-y-auto">
            {selected ? (
              <>
                <div className="text-center mb-4">
                  <span className="text-4xl">{selected.icon}</span>
                  <h3 className="font-bold text-stone-800 mt-2">{selected.name}</h3>
                  <p className="text-sm text-stone-600">{selected.description}</p>
                </div>

                {/* Requirements */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-stone-600 mb-2">Requirements</h4>
                  <div className="space-y-2">
                    {selected.requirements.map((req, i) => {
                      const isComplete = selectedProgress?.requirements[i]?.completed || completedMissions.includes(selected.id);
                      return (
                        <div
                          key={i}
                          className={`p-2 rounded text-sm flex items-center gap-2 ${
                            isComplete ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          <span>{isComplete ? '✓' : '○'}</span>
                          <span>{req.description}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Rewards */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-stone-600 mb-2">Rewards</h4>
                  <div className="space-y-1">
                    {selected.rewards.map((reward, i) => (
                      <div key={i} className="text-sm text-green-600">
                        • {reward.description}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prerequisites */}
                {selected.prerequisites && selected.prerequisites.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-stone-600 mb-2">Prerequisites</h4>
                    <div className="text-xs text-stone-500">
                      {selected.prerequisites.map(prereq => {
                        const prereqMission = missions.find(m => m.id === prereq);
                        const isComplete = completedMissions.includes(prereq);
                        return (
                          <div key={prereq} className={isComplete ? 'text-green-600' : ''}>
                            {isComplete ? '✓' : '○'} {prereqMission?.name || prereq}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Claim button */}
                {getMissionStatus(selected) === 'ready' && (
                  <button
                    onClick={() => onClaimReward(selected.id)}
                    className="w-full py-3 bg-amber-600 text-white rounded font-medium hover:bg-amber-700"
                  >
                    Claim Rewards
                  </button>
                )}

                {getMissionStatus(selected) === 'completed' && (
                  <div className="text-center py-3 bg-green-100 text-green-700 rounded">
                    ✓ Mission Completed
                  </div>
                )}
              </>
            ) : (
              <p className="text-center text-stone-500 py-8">
                Select a mission to view details
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionsPanel;
