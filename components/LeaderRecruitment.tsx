import React, { useState } from 'react';
import { Leader, LeaderType, getSkillNames } from '../data/leaderSystem';

interface LeaderRecruitmentProps {
  isOpen: boolean;
  onClose: () => void;
  availableLeaders: Leader[];
  currentLeaders: Leader[];
  maxLeaders: number;
  treasury: number;
  onHire: (leaderId: string) => void;
  onDismiss: (leaderId: string) => void;
  onRefresh: () => void;
  refreshCost: number;
}

export const LeaderRecruitment: React.FC<LeaderRecruitmentProps> = ({
  isOpen,
  onClose,
  availableLeaders,
  currentLeaders,
  maxLeaders,
  treasury,
  onHire,
  onDismiss,
  onRefresh,
  refreshCost
}) => {
  const [tab, setTab] = useState<'recruit' | 'current'>('recruit');
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);
  const [filterType, setFilterType] = useState<LeaderType | 'all'>('all');

  if (!isOpen) return null;

  const filteredAvailable = filterType === 'all'
    ? availableLeaders
    : availableLeaders.filter(l => l.type === filterType);

  const filteredCurrent = filterType === 'all'
    ? currentLeaders
    : currentLeaders.filter(l => l.type === filterType);

  const canHire = currentLeaders.length < maxLeaders;

  const getTypeColor = (type: LeaderType) => {
    switch (type) {
      case 'general': return 'bg-red-100 text-red-700';
      case 'admiral': return 'bg-blue-100 text-blue-700';
      case 'governor': return 'bg-green-100 text-green-700';
      case 'diplomat': return 'bg-purple-100 text-purple-700';
      case 'spy': return 'bg-stone-100 text-stone-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-stone-800">👤 Leader Recruitment</h2>
            <div className="text-sm text-stone-500">
              {currentLeaders.length}/{maxLeaders} leaders employed
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Tabs and filter */}
        <div className="p-2 border-b border-stone-200 flex justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setTab('recruit')}
              className={`px-4 py-2 rounded text-sm font-medium ${
                tab === 'recruit'
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-200 text-stone-700'
              }`}
            >
              Recruit ({availableLeaders.length})
            </button>
            <button
              onClick={() => setTab('current')}
              className={`px-4 py-2 rounded text-sm font-medium ${
                tab === 'current'
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-200 text-stone-700'
              }`}
            >
              Current ({currentLeaders.length})
            </button>
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as LeaderType | 'all')}
            className="px-3 py-1 border border-stone-300 rounded text-sm"
          >
            <option value="all">All Types</option>
            <option value="general">Generals</option>
            <option value="admiral">Admirals</option>
            <option value="governor">Governors</option>
            <option value="diplomat">Diplomats</option>
            <option value="spy">Spies</option>
          </select>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Leader list */}
          <div className="w-1/2 border-r border-stone-200 overflow-y-auto">
            {tab === 'recruit' && (
              <>
                <div className="p-2 bg-stone-100 border-b border-stone-200">
                  <button
                    onClick={onRefresh}
                    disabled={treasury < refreshCost}
                    className={`w-full py-2 rounded text-sm ${
                      treasury >= refreshCost
                        ? 'bg-amber-600 text-white hover:bg-amber-700'
                        : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                    }`}
                  >
                    🔄 Refresh Pool ({refreshCost}💰)
                  </button>
                </div>
                {filteredAvailable.map(leader => (
                  <LeaderCard
                    key={leader.id}
                    leader={leader}
                    isSelected={selectedLeader?.id === leader.id}
                    onClick={() => setSelectedLeader(leader)}
                    typeColor={getTypeColor(leader.type)}
                  />
                ))}
              </>
            )}
            {tab === 'current' && (
              filteredCurrent.length === 0 ? (
                <p className="p-4 text-center text-stone-500">No leaders employed</p>
              ) : (
                filteredCurrent.map(leader => (
                  <LeaderCard
                    key={leader.id}
                    leader={leader}
                    isSelected={selectedLeader?.id === leader.id}
                    onClick={() => setSelectedLeader(leader)}
                    typeColor={getTypeColor(leader.type)}
                  />
                ))
              )
            )}
          </div>

          {/* Leader details */}
          <div className="w-1/2 p-4 overflow-y-auto">
            {selectedLeader ? (
              <>
                <div className="text-center mb-4">
                  <span className="text-5xl">{selectedLeader.portrait}</span>
                  <h3 className="font-bold text-stone-800 mt-2">{selectedLeader.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${getTypeColor(selectedLeader.type)}`}>
                    {selectedLeader.type.charAt(0).toUpperCase() + selectedLeader.type.slice(1)}
                  </span>
                  <div className="text-sm text-stone-500 mt-1">Age: {selectedLeader.age}</div>
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-stone-600 mb-2">Skills</h4>
                  {renderSkills(selectedLeader)}
                </div>

                {/* Traits */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-stone-600 mb-2">Traits</h4>
                  {selectedLeader.traits.map(trait => (
                    <div key={trait.id} className="bg-stone-100 rounded p-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span>{trait.icon}</span>
                        <span className="font-medium text-stone-800 text-sm">{trait.name}</span>
                      </div>
                      <div className="text-xs text-stone-500 mt-1">
                        {trait.effects.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="mb-4 grid grid-cols-2 gap-2">
                  <div className="bg-stone-100 rounded p-2 text-center">
                    <div className="text-xs text-stone-500">Loyalty</div>
                    <div className="font-bold text-stone-800">{selectedLeader.loyalty}%</div>
                  </div>
                  <div className="bg-stone-100 rounded p-2 text-center">
                    <div className="text-xs text-stone-500">Prestige</div>
                    <div className="font-bold text-stone-800">{selectedLeader.prestige}</div>
                  </div>
                </div>

                {/* Action button */}
                {tab === 'recruit' ? (
                  <button
                    onClick={() => onHire(selectedLeader.id)}
                    disabled={!canHire || treasury < selectedLeader.hireCost}
                    className={`w-full py-3 rounded font-medium ${
                      canHire && treasury >= selectedLeader.hireCost
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                    }`}
                  >
                    Hire ({selectedLeader.hireCost}💰 + {selectedLeader.salary}💰/year)
                  </button>
                ) : (
                  <button
                    onClick={() => onDismiss(selectedLeader.id)}
                    className="w-full py-3 rounded font-medium bg-red-600 text-white hover:bg-red-700"
                  >
                    Dismiss Leader
                  </button>
                )}
              </>
            ) : (
              <p className="text-center text-stone-500">Select a leader to view details</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Leader card component
const LeaderCard: React.FC<{
  leader: Leader;
  isSelected: boolean;
  onClick: () => void;
  typeColor: string;
}> = ({ leader, isSelected, onClick, typeColor }) => (
  <button
    onClick={onClick}
    className={`w-full p-3 text-left border-b border-stone-200 hover:bg-stone-100 ${
      isSelected ? 'bg-stone-100' : ''
    }`}
  >
    <div className="flex items-center gap-3">
      <span className="text-2xl">{leader.portrait}</span>
      <div className="flex-1">
        <div className="font-semibold text-stone-800 text-sm">{leader.name}</div>
        <div className="flex items-center gap-2 mt-1">
          <span className={`px-1.5 py-0.5 rounded text-xs ${typeColor}`}>
            {leader.type}
          </span>
          <span className="text-xs text-stone-500">
            {leader.skills.primary}/{leader.skills.secondary}/{leader.skills.tertiary}
          </span>
        </div>
      </div>
      <div className="text-right">
        <div className="text-xs text-amber-600 font-medium">{leader.hireCost}💰</div>
        <div className="text-xs text-stone-500">Age {leader.age}</div>
      </div>
    </div>
  </button>
);

// Render skills with bars
function renderSkills(leader: Leader) {
  const skillNames = getSkillNames(leader.type);
  const skills = [
    { name: skillNames.primary, value: leader.skills.primary },
    { name: skillNames.secondary, value: leader.skills.secondary },
    { name: skillNames.tertiary, value: leader.skills.tertiary }
  ];

  return (
    <div className="space-y-2">
      {skills.map(skill => (
        <div key={skill.name}>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-stone-600">{skill.name}</span>
            <span className="font-medium">{skill.value}</span>
          </div>
          <div className="w-full bg-stone-200 rounded-full h-2">
            <div
              className="bg-amber-500 h-2 rounded-full"
              style={{ width: `${(skill.value / 6) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default LeaderRecruitment;
