import React, { useState } from 'react';
import {
  IdeaGroup,
  IdeaCategory,
  IDEA_GROUPS,
  getIdeaGroup,
  getIdeaGroupsByCategory,
  calculateIdeaCost,
  aggregateIdeaEffects
} from '../data/ideaGroups';

interface IdeaGroupPanelProps {
  unlockedGroups: Map<string, number>;
  monarchPoints: { admin: number; diplo: number; mil: number };
  costModifier: number;
  maxGroups: number;
  onClose: () => void;
  onUnlockIdea?: (groupId: string) => void;
  onSelectGroup?: (groupId: string) => void;
}

type ViewMode = 'browse' | 'active';

export default function IdeaGroupPanel({
  unlockedGroups,
  monarchPoints,
  costModifier,
  maxGroups,
  onClose,
  onUnlockIdea,
  onSelectGroup
}: IdeaGroupPanelProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('active');
  const [selectedGroup, setSelectedGroup] = useState<IdeaGroup | null>(null);
  const [filterCategory, setFilterCategory] = useState<IdeaCategory | 'all'>('all');

  const activeGroups = Array.from(unlockedGroups.keys())
    .map(id => getIdeaGroup(id))
    .filter((g): g is IdeaGroup => g !== undefined);

  const availableGroups = IDEA_GROUPS.filter(g => !unlockedGroups.has(g.id));

  const filteredGroups = filterCategory === 'all'
    ? availableGroups
    : getIdeaGroupsByCategory(filterCategory).filter(g => !unlockedGroups.has(g.id));

  const getCategoryColor = (category: IdeaCategory) => {
    switch (category) {
      case 'administrative': return 'bg-red-900 text-red-300';
      case 'diplomatic': return 'bg-blue-900 text-blue-300';
      case 'military': return 'bg-green-900 text-green-300';
    }
  };

  const getPointsForCategory = (category: IdeaCategory): number => {
    switch (category) {
      case 'administrative': return monarchPoints.admin;
      case 'diplomatic': return monarchPoints.diplo;
      case 'military': return monarchPoints.mil;
    }
  };

  const renderActiveGroups = () => (
    <div className="space-y-3">
      {activeGroups.length === 0 ? (
        <div className="text-center py-8 text-stone-400">
          <div className="text-3xl mb-2">📚</div>
          <div>No idea groups selected</div>
          <button
            onClick={() => setViewMode('browse')}
            className="mt-2 text-amber-400 hover:text-amber-300 text-sm"
          >
            Browse available ideas
          </button>
        </div>
      ) : (
        activeGroups.map(group => {
          const unlockedCount = unlockedGroups.get(group.id) || 0;
          const progress = (unlockedCount / group.ideas.length) * 100;
          const nextIdea = group.ideas[unlockedCount];
          const cost = nextIdea ? calculateIdeaCost(nextIdea.cost, costModifier) : 0;
          const points = getPointsForCategory(group.category);

          return (
            <div
              key={group.id}
              className="bg-stone-700 rounded-lg p-4"
              onClick={() => setSelectedGroup(group)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{group.icon}</span>
                  <div>
                    <h3 className="font-semibold text-amber-100">{group.name}</h3>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${getCategoryColor(group.category)}`}>
                      {group.category}
                    </span>
                  </div>
                </div>
                <div className="text-right text-xs text-stone-400">
                  {unlockedCount}/{group.ideas.length}
                </div>
              </div>

              <div className="mb-3">
                <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {nextIdea && onUnlockIdea && (
                <div className="flex items-center justify-between">
                  <div className="text-xs text-stone-300">
                    Next: {nextIdea.name}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUnlockIdea(group.id);
                    }}
                    disabled={points < cost}
                    className={`text-xs px-2 py-1 rounded ${
                      points >= cost
                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                        : 'bg-stone-600 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    {cost} pts
                  </button>
                </div>
              )}

              {unlockedCount >= group.ideas.length && (
                <div className="text-xs text-green-400">
                  ✓ Complete - Ambition unlocked
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );

  const renderBrowseGroups = () => (
    <div>
      {/* Category filter */}
      <div className="flex gap-1 mb-3">
        {(['all', 'administrative', 'diplomatic', 'military'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-2 py-1 text-xs rounded ${
              filterCategory === cat
                ? 'bg-amber-600 text-white'
                : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
            }`}
          >
            {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {filteredGroups.map(group => (
          <button
            key={group.id}
            onClick={() => {
              setSelectedGroup(group);
              if (onSelectGroup) onSelectGroup(group.id);
            }}
            disabled={activeGroups.length >= maxGroups}
            className={`p-3 rounded text-left transition-colors ${
              activeGroups.length >= maxGroups
                ? 'bg-stone-800 opacity-50 cursor-not-allowed'
                : 'bg-stone-700 hover:bg-stone-600'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span>{group.icon}</span>
              <span className="text-sm font-medium text-amber-100">{group.name}</span>
            </div>
            <span className={`text-xs px-1.5 py-0.5 rounded ${getCategoryColor(group.category)}`}>
              {group.category}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderGroupDetails = () => {
    if (!selectedGroup) return null;

    const unlockedCount = unlockedGroups.get(selectedGroup.id) || 0;
    const effects = aggregateIdeaEffects(selectedGroup.id, unlockedCount);

    return (
      <div className="bg-stone-700 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">{selectedGroup.icon}</span>
          <div>
            <h3 className="font-semibold text-amber-100">{selectedGroup.name}</h3>
            <p className="text-xs text-stone-400">{selectedGroup.description}</p>
          </div>
        </div>

        {/* Traditions */}
        <div className="mb-3">
          <div className="text-xs text-stone-400 mb-1">Traditions:</div>
          <div className="flex flex-wrap gap-1">
            {selectedGroup.traditions.map((effect, i) => (
              <span key={i} className="text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded">
                {effect.value > 0 ? '+' : ''}{effect.value} {effect.type.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>

        {/* Ideas */}
        <div className="space-y-2 mb-3">
          {selectedGroup.ideas.map((idea, i) => {
            const isUnlocked = i < unlockedCount;
            return (
              <div
                key={idea.id}
                className={`p-2 rounded text-xs ${
                  isUnlocked ? 'bg-amber-900/30' : 'bg-stone-800'
                }`}
              >
                <div className="flex justify-between mb-1">
                  <span className={isUnlocked ? 'text-amber-100' : 'text-stone-300'}>
                    {i + 1}. {idea.name}
                  </span>
                  {isUnlocked && <span className="text-green-400">✓</span>}
                </div>
                <div className="flex flex-wrap gap-1">
                  {idea.effects.map((effect, j) => (
                    <span
                      key={j}
                      className={`px-1.5 py-0.5 rounded ${
                        isUnlocked ? 'bg-green-900/50 text-green-400' : 'bg-stone-700 text-stone-400'
                      }`}
                    >
                      {effect.value > 0 ? '+' : ''}{effect.value} {effect.type.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Ambition */}
        <div className={`p-2 rounded text-xs ${
          unlockedCount >= selectedGroup.ideas.length ? 'bg-amber-900/30' : 'bg-stone-800 opacity-50'
        }`}>
          <div className="flex justify-between mb-1">
            <span className="text-amber-100">Ambition</span>
            {unlockedCount >= selectedGroup.ideas.length && (
              <span className="text-green-400">✓</span>
            )}
          </div>
          <span className="text-green-400">
            {selectedGroup.ambition.value > 0 ? '+' : ''}
            {selectedGroup.ambition.value} {selectedGroup.ambition.type.replace(/_/g, ' ')}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-stone-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-stone-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-amber-100">📚 Idea Groups</h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200"
          >
            ✕
          </button>
        </div>

        {/* View toggle */}
        <div className="p-3 border-b border-stone-700 flex justify-between items-center">
          <div className="flex gap-1">
            <button
              onClick={() => setViewMode('active')}
              className={`px-3 py-1 text-xs rounded ${
                viewMode === 'active'
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
              }`}
            >
              Active ({activeGroups.length}/{maxGroups})
            </button>
            <button
              onClick={() => setViewMode('browse')}
              className={`px-3 py-1 text-xs rounded ${
                viewMode === 'browse'
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
              }`}
            >
              Browse
            </button>
          </div>
          <div className="text-xs text-stone-400">
            <span className="text-red-400">{monarchPoints.admin}</span> /
            <span className="text-blue-400">{monarchPoints.diplo}</span> /
            <span className="text-green-400">{monarchPoints.mil}</span>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Main content */}
          <div className="flex-1 p-4 overflow-y-auto">
            {viewMode === 'active' && renderActiveGroups()}
            {viewMode === 'browse' && renderBrowseGroups()}
          </div>

          {/* Details panel */}
          {selectedGroup && (
            <div className="w-72 border-l border-stone-700 p-4 overflow-y-auto">
              {renderGroupDetails()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
