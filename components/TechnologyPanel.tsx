import React, { useState } from 'react';

interface Technology {
  id: string;
  name: string;
  level: number;
  cost: number;
  year: number;
  effects: TechEffect[];
  unlocks: string[];
}

interface TechEffect {
  type: string;
  value: number;
}

interface TechProgress {
  category: TechCategory;
  currentLevel: number;
  progress: number;
  nextTech: Technology | null;
}

type TechCategory = 'administrative' | 'diplomatic' | 'military';

interface TechnologyPanelProps {
  techProgress: Record<TechCategory, TechProgress>;
  monarchPoints: { admin: number; diplo: number; mil: number };
  institutionPenalty: number;
  currentYear: number;
  onClose: () => void;
  onResearch?: (category: TechCategory) => void;
}

export default function TechnologyPanel({
  techProgress,
  monarchPoints,
  institutionPenalty,
  currentYear,
  onClose,
  onResearch
}: TechnologyPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<TechCategory>('administrative');

  const categories: { id: TechCategory; label: string; icon: string; color: string }[] = [
    { id: 'administrative', label: 'Administrative', icon: '📜', color: 'amber' },
    { id: 'diplomatic', label: 'Diplomatic', icon: '🤝', color: 'blue' },
    { id: 'military', label: 'Military', icon: '⚔️', color: 'red' }
  ];

  const getPointsForCategory = (category: TechCategory): number => {
    switch (category) {
      case 'administrative': return monarchPoints.admin;
      case 'diplomatic': return monarchPoints.diplo;
      case 'military': return monarchPoints.mil;
    }
  };

  const calculateEffectiveCost = (baseCost: number, tech: Technology | null): number => {
    if (!tech) return 0;
    let cost = baseCost;

    // Ahead of time penalty
    if (tech.year > currentYear) {
      const yearsAhead = tech.year - currentYear;
      cost += yearsAhead * 10;
    }

    // Institution penalty
    cost *= (1 + institutionPenalty / 100);

    return Math.round(cost);
  };

  const canAfford = (category: TechCategory): boolean => {
    const progress = techProgress[category];
    if (!progress.nextTech) return false;
    const cost = calculateEffectiveCost(progress.nextTech.cost, progress.nextTech);
    return getPointsForCategory(category) >= cost;
  };

  const renderCategoryCard = (category: typeof categories[0]) => {
    const progress = techProgress[category.id];
    const points = getPointsForCategory(category.id);
    const nextTech = progress.nextTech;
    const effectiveCost = nextTech ? calculateEffectiveCost(nextTech.cost, nextTech) : 0;
    const affordable = canAfford(category.id);

    return (
      <div
        key={category.id}
        onClick={() => setSelectedCategory(category.id)}
        className={`bg-stone-700 rounded-lg p-4 cursor-pointer transition-all ${
          selectedCategory === category.id
            ? `ring-2 ring-${category.color}-500`
            : 'hover:bg-stone-600'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{category.icon}</span>
            <div>
              <h3 className="font-semibold text-amber-100">{category.label}</h3>
              <div className="text-xs text-stone-400">Level {progress.currentLevel}</div>
            </div>
          </div>
          <div className={`text-lg font-bold text-${category.color}-400`}>
            {points}
          </div>
        </div>

        {nextTech ? (
          <>
            <div className="text-sm text-stone-300 mb-2">
              Next: {nextTech.name}
            </div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-stone-400">Cost</span>
              <span className={affordable ? 'text-green-400' : 'text-red-400'}>
                {effectiveCost}
              </span>
            </div>
            {nextTech.year > currentYear && (
              <div className="text-xs text-orange-400">
                Ahead of time: +{(nextTech.year - currentYear) * 10} cost
              </div>
            )}
          </>
        ) : (
          <div className="text-sm text-stone-500">Max level reached</div>
        )}
      </div>
    );
  };

  const renderTechDetails = () => {
    const progress = techProgress[selectedCategory];
    const nextTech = progress.nextTech;
    const category = categories.find(c => c.id === selectedCategory)!;
    const points = getPointsForCategory(selectedCategory);
    const effectiveCost = nextTech ? calculateEffectiveCost(nextTech.cost, nextTech) : 0;

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{category.icon}</span>
          <div>
            <h3 className="font-bold text-amber-100">{category.label} Technology</h3>
            <div className="text-sm text-stone-400">Current Level: {progress.currentLevel}</div>
          </div>
        </div>

        {nextTech ? (
          <>
            <div className="bg-stone-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-amber-100">{nextTech.name}</h4>
                  <div className="text-xs text-stone-400">Level {nextTech.level}</div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${points >= effectiveCost ? 'text-green-400' : 'text-red-400'}`}>
                    {effectiveCost}
                  </div>
                  <div className="text-xs text-stone-400">Cost</div>
                </div>
              </div>

              {nextTech.effects.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs text-stone-400 mb-1">Effects:</div>
                  <div className="space-y-1">
                    {nextTech.effects.map((effect, i) => (
                      <div key={i} className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded">
                        {effect.value > 0 ? '+' : ''}{effect.value}% {effect.type.replace(/_/g, ' ')}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {nextTech.unlocks.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs text-stone-400 mb-1">Unlocks:</div>
                  <div className="flex flex-wrap gap-1">
                    {nextTech.unlocks.map((unlock, i) => (
                      <span key={i} className="text-xs bg-amber-900/30 text-amber-300 px-2 py-0.5 rounded">
                        {unlock}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {nextTech.year > currentYear && (
                <div className="text-xs text-orange-400 mb-3">
                  ⚠️ Available in {nextTech.year} ({nextTech.year - currentYear} years ahead)
                </div>
              )}

              {onResearch && (
                <button
                  onClick={() => onResearch(selectedCategory)}
                  disabled={points < effectiveCost}
                  className={`w-full py-2 rounded font-medium text-sm ${
                    points >= effectiveCost
                      ? 'bg-amber-600 hover:bg-amber-700 text-white'
                      : 'bg-stone-600 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  Research ({effectiveCost} points)
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="bg-stone-700 rounded-lg p-4 text-center text-stone-400">
            <div className="text-3xl mb-2">🎓</div>
            <div>Maximum technology level reached!</div>
          </div>
        )}

        {institutionPenalty > 0 && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-3">
            <div className="text-sm text-red-300 font-medium">Institution Penalty</div>
            <div className="text-xs text-red-400">
              +{institutionPenalty}% tech cost from missing institutions
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-stone-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-stone-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-amber-100">🔬 Technology</h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          <div className="w-1/2 p-4 border-r border-stone-700 space-y-3">
            {categories.map(renderCategoryCard)}
          </div>

          <div className="w-1/2 p-4 overflow-y-auto">
            {renderTechDetails()}
          </div>
        </div>
      </div>
    </div>
  );
}
