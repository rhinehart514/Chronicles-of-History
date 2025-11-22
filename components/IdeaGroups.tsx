import React, { useState } from 'react';

interface IdeaGroupsProps {
  isOpen: boolean;
  onClose: () => void;
  availableGroups: IdeaGroup[];
  unlockedGroups: UnlockedGroup[];
  maxGroups: number;
  ideaPoints: number;
  onUnlockGroup: (groupId: string) => void;
  onUnlockIdea: (groupId: string, ideaIndex: number) => void;
}

export interface IdeaGroup {
  id: string;
  name: string;
  icon: string;
  category: 'administrative' | 'diplomatic' | 'military';
  description: string;
  ideas: Idea[];
  bonus: IdeaEffect;
}

export interface Idea {
  name: string;
  description: string;
  effects: IdeaEffect[];
  cost: number;
}

export interface IdeaEffect {
  type: string;
  value: number;
  description: string;
}

export interface UnlockedGroup {
  groupId: string;
  unlockedIdeas: number;
}

export const IdeaGroups: React.FC<IdeaGroupsProps> = ({
  isOpen,
  onClose,
  availableGroups,
  unlockedGroups,
  maxGroups,
  ideaPoints,
  onUnlockGroup,
  onUnlockIdea
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  if (!isOpen) return null;

  const categories = ['all', 'administrative', 'diplomatic', 'military'];

  const filteredGroups = categoryFilter === 'all'
    ? availableGroups
    : availableGroups.filter(g => g.category === categoryFilter);

  const selected = availableGroups.find(g => g.id === selectedGroup);
  const selectedUnlocked = unlockedGroups.find(u => u.groupId === selectedGroup);

  const isGroupUnlocked = (groupId: string) =>
    unlockedGroups.some(u => u.groupId === groupId);

  const canUnlockGroup = unlockedGroups.length < maxGroups && ideaPoints >= 400;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'administrative': return 'amber';
      case 'diplomatic': return 'blue';
      case 'military': return 'red';
      default: return 'stone';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-stone-800">💡 National Ideas</h2>
            <div className="text-sm text-stone-500">
              {unlockedGroups.length}/{maxGroups} idea groups unlocked
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Idea points */}
        <div className="p-3 border-b border-stone-200 bg-stone-100">
          <div className="flex justify-between items-center">
            <span className="text-stone-600">Idea Points</span>
            <span className="font-bold text-lg">{ideaPoints}</span>
          </div>
        </div>

        {/* Category filter */}
        <div className="p-2 border-b border-stone-200 flex gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded text-sm capitalize ${
                categoryFilter === cat ? 'bg-stone-600 text-white' : 'bg-stone-200 text-stone-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Group list */}
          <div className="w-1/2 border-r border-stone-200 overflow-y-auto p-3">
            <div className="space-y-2">
              {filteredGroups.map(group => {
                const unlocked = isGroupUnlocked(group.id);
                const unlockedData = unlockedGroups.find(u => u.groupId === group.id);
                const color = getCategoryColor(group.category);

                return (
                  <button
                    key={group.id}
                    onClick={() => setSelectedGroup(group.id)}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                      selectedGroup === group.id
                        ? `border-${color}-500 bg-${color}-50`
                        : unlocked
                        ? 'border-green-300 bg-green-50'
                        : 'border-stone-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{group.icon}</span>
                      <div>
                        <div className="font-semibold text-stone-800">{group.name}</div>
                        <div className="text-xs text-stone-500 capitalize">{group.category}</div>
                      </div>
                      {unlocked && (
                        <div className="ml-auto text-xs text-green-600">
                          {unlockedData?.unlockedIdeas || 0}/7
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-stone-600">{group.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected group details */}
          <div className="w-1/2 p-4 overflow-y-auto">
            {selected ? (
              <>
                <div className="text-center mb-4">
                  <span className="text-4xl">{selected.icon}</span>
                  <h3 className="font-bold text-stone-800 mt-2">{selected.name}</h3>
                  <p className="text-sm text-stone-600">{selected.description}</p>
                </div>

                {/* Unlock group button */}
                {!isGroupUnlocked(selected.id) && (
                  <button
                    onClick={() => onUnlockGroup(selected.id)}
                    disabled={!canUnlockGroup}
                    className={`w-full py-2 rounded mb-4 font-medium ${
                      canUnlockGroup
                        ? 'bg-amber-600 text-white hover:bg-amber-700'
                        : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                    }`}
                  >
                    {canUnlockGroup ? 'Unlock Group (400 points)' :
                      unlockedGroups.length >= maxGroups ? 'Max groups reached' : 'Need 400 points'}
                  </button>
                )}

                {/* Ideas list */}
                <div className="space-y-2">
                  {selected.ideas.map((idea, i) => {
                    const isUnlocked = selectedUnlocked && i < selectedUnlocked.unlockedIdeas;
                    const canUnlock = selectedUnlocked &&
                      i === selectedUnlocked.unlockedIdeas &&
                      ideaPoints >= idea.cost;

                    return (
                      <div
                        key={i}
                        className={`p-3 rounded-lg border ${
                          isUnlocked
                            ? 'border-green-300 bg-green-50'
                            : canUnlock
                            ? 'border-amber-300 bg-amber-50'
                            : 'border-stone-200 bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-stone-800 text-sm">
                            {i + 1}. {idea.name}
                          </span>
                          {isUnlocked ? (
                            <span className="text-green-500 text-xs">✓</span>
                          ) : (
                            <span className="text-xs text-stone-500">{idea.cost} pts</span>
                          )}
                        </div>
                        <div className="space-y-1">
                          {idea.effects.map((effect, j) => (
                            <div
                              key={j}
                              className={`text-xs ${
                                effect.value > 0 ? 'text-green-600' : 'text-red-600'
                              }`}
                            >
                              {effect.description}
                            </div>
                          ))}
                        </div>
                        {canUnlock && (
                          <button
                            onClick={() => onUnlockIdea(selected.id, i)}
                            className="w-full mt-2 py-1 bg-amber-600 text-white rounded text-sm hover:bg-amber-700"
                          >
                            Unlock ({idea.cost})
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Completion bonus */}
                <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="text-sm font-semibold text-purple-800 mb-1">
                    Completion Bonus
                  </div>
                  <div className="text-xs text-purple-600">
                    {selected.bonus.description}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-center text-stone-500 py-8">
                Select an idea group to view details
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaGroups;
