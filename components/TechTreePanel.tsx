import React, { useState } from 'react';

interface TechLevel {
  level: number;
  name: string;
  year: number;
  cost: number;
  effects: string[];
  unlocks: string[];
  isResearched: boolean;
}

interface TechCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  currentLevel: number;
  pointsAvailable: number;
  levels: TechLevel[];
}

interface TechTreePanelProps {
  categories: TechCategory[];
  currentYear: number;
  institutionPenalty: number;
  neighborBonus: number;
  onResearch?: (categoryId: string) => void;
  onClose: () => void;
}

export default function TechTreePanel({
  categories,
  currentYear,
  institutionPenalty,
  neighborBonus,
  onResearch,
  onClose
}: TechTreePanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]?.id || '');

  const selectedCategoryData = categories.find(c => c.id === selectedCategory);

  const getNextLevel = (category: TechCategory): TechLevel | undefined => {
    return category.levels.find(l => !l.isResearched);
  };

  const isAheadOfTime = (year: number) => currentYear < year;

  const getCostColor = (cost: number, available: number) => {
    if (available >= cost) return 'text-green-400';
    if (available >= cost * 0.5) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-stone-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="p-4 border-b border-stone-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-amber-100">Technology</h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200"
          >
            ✕
          </button>
        </div>

        {/* Category Tabs */}
        <div className="border-b border-stone-700">
          <div className="flex">
            {categories.map(category => {
              const nextLevel = getNextLevel(category);
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? `text-${category.color}-400 border-b-2 border-${category.color}-400`
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </div>
                  <div className="text-xs mt-1">
                    Level {category.currentLevel}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tech Modifiers */}
        <div className="px-4 py-2 bg-stone-900 flex justify-around text-xs">
          <div>
            <span className="text-stone-400">Institution Penalty: </span>
            <span className={institutionPenalty > 0 ? 'text-red-400' : 'text-green-400'}>
              {institutionPenalty > 0 ? '+' : ''}{institutionPenalty}%
            </span>
          </div>
          <div>
            <span className="text-stone-400">Neighbor Bonus: </span>
            <span className={neighborBonus < 0 ? 'text-green-400' : 'text-stone-400'}>
              {neighborBonus}%
            </span>
          </div>
          <div>
            <span className="text-stone-400">Year: </span>
            <span className="text-amber-400">{currentYear}</span>
          </div>
        </div>

        {/* Selected Category Details */}
        {selectedCategoryData && (
          <div className="p-4 overflow-y-auto flex-1">
            {/* Current Research */}
            {(() => {
              const nextLevel = getNextLevel(selectedCategoryData);
              if (!nextLevel) {
                return (
                  <div className="bg-green-900/30 rounded-lg p-4 mb-4 text-center">
                    <div className="text-2xl mb-2">✓</div>
                    <div className="text-green-400 font-medium">Maximum Level Reached</div>
                  </div>
                );
              }

              const aheadOfTime = isAheadOfTime(nextLevel.year);

              return (
                <div className="bg-stone-700 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="text-lg font-bold">
                        {selectedCategoryData.icon} Level {nextLevel.level}
                      </div>
                      <div className="text-sm text-stone-400">
                        {nextLevel.name}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={getCostColor(nextLevel.cost, selectedCategoryData.pointsAvailable)}>
                        {nextLevel.cost} points
                      </div>
                      <div className="text-xs text-stone-400">
                        Available: {selectedCategoryData.pointsAvailable}
                      </div>
                    </div>
                  </div>

                  {aheadOfTime && (
                    <div className="bg-orange-900/50 text-orange-300 text-xs px-2 py-1 rounded mb-2">
                      Ahead of time - Available year: {nextLevel.year}
                    </div>
                  )}

                  {/* Effects */}
                  {nextLevel.effects.length > 0 && (
                    <div className="mb-3">
                      <div className="text-xs text-stone-400 mb-1">Effects:</div>
                      <div className="space-y-1">
                        {nextLevel.effects.map((effect, i) => (
                          <div key={i} className="text-sm text-green-400">
                            • {effect}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Unlocks */}
                  {nextLevel.unlocks.length > 0 && (
                    <div className="mb-3">
                      <div className="text-xs text-stone-400 mb-1">Unlocks:</div>
                      <div className="flex flex-wrap gap-1">
                        {nextLevel.unlocks.map((unlock, i) => (
                          <span key={i} className="text-xs bg-stone-600 px-2 py-0.5 rounded">
                            {unlock}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => onResearch?.(selectedCategoryData.id)}
                    disabled={selectedCategoryData.pointsAvailable < nextLevel.cost}
                    className={`w-full py-2 rounded font-medium ${
                      selectedCategoryData.pointsAvailable >= nextLevel.cost
                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                        : 'bg-stone-600 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    Research Level {nextLevel.level}
                  </button>
                </div>
              );
            })()}

            {/* Tech History */}
            <div>
              <h3 className="text-sm font-medium text-stone-400 mb-2">Research History</h3>
              <div className="space-y-2">
                {selectedCategoryData.levels
                  .filter(l => l.isResearched)
                  .reverse()
                  .slice(0, 5)
                  .map(level => (
                    <div key={level.level} className="bg-stone-700/50 rounded p-2">
                      <div className="flex justify-between items-center">
                        <div className="text-sm">
                          <span className="font-medium">Level {level.level}</span>
                          <span className="text-stone-400 ml-2">{level.name}</span>
                        </div>
                        <span className="text-xs text-green-400">✓</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
