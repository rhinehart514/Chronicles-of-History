import React, { useState } from 'react';

export interface Technology {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'military' | 'economy' | 'culture' | 'government';
  cost: number;
  prerequisites: string[];
  effects: string[];
  yearAvailable: number;
}

interface TechTreeProps {
  isOpen: boolean;
  onClose: () => void;
  technologies: Technology[];
  researched: string[];
  currentResearch?: string;
  researchProgress?: number;
  researchPoints: number;
  currentYear: number;
  onStartResearch: (techId: string) => void;
}

export const TechTree: React.FC<TechTreeProps> = ({
  isOpen,
  onClose,
  technologies,
  researched,
  currentResearch,
  researchProgress = 0,
  researchPoints,
  currentYear,
  onStartResearch
}) => {
  const [filter, setFilter] = useState<'all' | Technology['category']>('all');
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  if (!isOpen) return null;

  const categoryColors = {
    military: 'border-red-500 bg-red-50',
    economy: 'border-amber-500 bg-amber-50',
    culture: 'border-purple-500 bg-purple-50',
    government: 'border-blue-500 bg-blue-50'
  };

  const categoryIcons = {
    military: '⚔️',
    economy: '💰',
    culture: '🎭',
    government: '⚖️'
  };

  const filteredTechs = technologies.filter(t =>
    filter === 'all' || t.category === filter
  );

  const canResearch = (tech: Technology): boolean => {
    if (researched.includes(tech.id)) return false;
    if (tech.yearAvailable > currentYear) return false;
    if (tech.prerequisites.some(p => !researched.includes(p))) return false;
    return true;
  };

  const getTechStatus = (tech: Technology): 'researched' | 'available' | 'locked' | 'future' => {
    if (researched.includes(tech.id)) return 'researched';
    if (tech.yearAvailable > currentYear) return 'future';
    if (tech.prerequisites.some(p => !researched.includes(p))) return 'locked';
    return 'available';
  };

  const selected = technologies.find(t => t.id === selectedTech);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <h2 className="text-xl font-bold text-stone-800">💡 Technology</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-stone-600">
              Research Points: <span className="font-bold text-amber-600">{researchPoints}</span>
            </span>
            <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
              ×
            </button>
          </div>
        </div>

        {/* Current research */}
        {currentResearch && (
          <div className="p-3 bg-amber-50 border-b border-amber-200">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-amber-800">
                Researching: {technologies.find(t => t.id === currentResearch)?.name}
              </span>
              <span className="text-sm text-amber-600">{researchProgress}%</span>
            </div>
            <div className="w-full bg-amber-200 rounded h-2">
              <div
                className="bg-amber-600 h-2 rounded transition-all"
                style={{ width: `${researchProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="p-3 border-b border-stone-200 flex gap-2">
          {(['all', 'military', 'economy', 'culture', 'government'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded text-sm font-medium capitalize ${
                filter === cat
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
              }`}
            >
              {cat === 'all' ? '📜 All' : `${categoryIcons[cat]} ${cat}`}
            </button>
          ))}
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Tech list */}
          <div className="w-1/2 border-r border-stone-200 overflow-y-auto p-3">
            <div className="space-y-2">
              {filteredTechs.map((tech) => {
                const status = getTechStatus(tech);
                return (
                  <button
                    key={tech.id}
                    onClick={() => setSelectedTech(tech.id)}
                    className={`w-full p-3 rounded border-l-4 text-left transition-all ${
                      selectedTech === tech.id
                        ? `${categoryColors[tech.category]} border-l-4`
                        : status === 'researched'
                        ? 'bg-green-50 border-green-500 opacity-75'
                        : status === 'available'
                        ? 'bg-white border-stone-300 hover:border-amber-400'
                        : 'bg-stone-100 border-stone-300 opacity-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{tech.icon}</span>
                        <div>
                          <div className="font-semibold text-stone-800">{tech.name}</div>
                          <div className="text-xs text-stone-500">{tech.category}</div>
                        </div>
                      </div>
                      {status === 'researched' && (
                        <span className="text-green-600 text-sm">✓</span>
                      )}
                      {status === 'future' && (
                        <span className="text-xs text-stone-400">{tech.yearAvailable}+</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details */}
          <div className="w-1/2 overflow-y-auto p-4">
            {selected ? (
              <div className="space-y-4">
                <div className="text-center">
                  <span className="text-4xl">{selected.icon}</span>
                  <h3 className="text-lg font-bold text-stone-800 mt-2">{selected.name}</h3>
                  <p className="text-sm text-stone-600">{selected.description}</p>
                </div>

                {/* Effects */}
                <div className="bg-white p-3 rounded border border-stone-200">
                  <h4 className="font-semibold text-stone-800 mb-2">Effects</h4>
                  <ul className="space-y-1">
                    {selected.effects.map((effect, i) => (
                      <li key={i} className="text-sm text-green-600 flex items-center gap-2">
                        <span>✓</span>
                        {effect}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Prerequisites */}
                {selected.prerequisites.length > 0 && (
                  <div className="bg-white p-3 rounded border border-stone-200">
                    <h4 className="font-semibold text-stone-800 mb-2">Prerequisites</h4>
                    <ul className="space-y-1">
                      {selected.prerequisites.map((prereq) => {
                        const prereqTech = technologies.find(t => t.id === prereq);
                        const hasPrereq = researched.includes(prereq);
                        return (
                          <li
                            key={prereq}
                            className={`text-sm flex items-center gap-2 ${
                              hasPrereq ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            <span>{hasPrereq ? '✓' : '✗'}</span>
                            {prereqTech?.name || prereq}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* Cost & availability */}
                <div className="bg-stone-100 p-3 rounded">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600">Cost</span>
                    <span className="font-bold text-amber-600">{selected.cost} points</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-stone-600">Available</span>
                    <span className="text-stone-800">{selected.yearAvailable}+</span>
                  </div>
                </div>

                {/* Research button */}
                {canResearch(selected) && (
                  <button
                    onClick={() => onStartResearch(selected.id)}
                    disabled={currentResearch === selected.id}
                    className={`w-full py-2 rounded font-semibold ${
                      currentResearch === selected.id
                        ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                        : 'bg-amber-600 text-white hover:bg-amber-700'
                    }`}
                  >
                    {currentResearch === selected.id ? 'Researching...' : 'Start Research'}
                  </button>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-stone-500">
                Select a technology to view details
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-stone-300 bg-stone-100 flex justify-around text-xs text-stone-600">
          <span>Researched: {researched.length}/{technologies.length}</span>
          <span>Available: {technologies.filter(t => canResearch(t)).length}</span>
        </div>
      </div>
    </div>
  );
};

export default TechTree;
