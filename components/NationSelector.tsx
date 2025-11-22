import React, { useState } from 'react';

interface NationSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  nations: SelectableNation[];
  recommendedNations: string[];
  onSelectNation: (nationId: string) => void;
}

interface SelectableNation {
  id: string;
  name: string;
  flag: string;
  government: string;
  religion: string;
  religionIcon: string;
  culture: string;
  development: number;
  provinces: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'very_hard';
  region: string;
  description: string;
  startingPosition: string;
}

const DIFFICULTY_INFO = {
  easy: { label: 'Easy', color: 'bg-green-100 text-green-700', stars: 1 },
  medium: { label: 'Medium', color: 'bg-blue-100 text-blue-700', stars: 2 },
  hard: { label: 'Hard', color: 'bg-amber-100 text-amber-700', stars: 3 },
  very_hard: { label: 'Very Hard', color: 'bg-red-100 text-red-700', stars: 4 }
};

const REGIONS = [
  'All',
  'Western Europe',
  'Eastern Europe',
  'Middle East',
  'Africa',
  'India',
  'East Asia',
  'Americas'
];

export const NationSelector: React.FC<NationSelectorProps> = ({
  isOpen,
  onClose,
  nations,
  recommendedNations,
  onSelectNation
}) => {
  const [selectedNation, setSelectedNation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  if (!isOpen) return null;

  const filteredNations = nations.filter(nation => {
    if (searchQuery && !nation.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (regionFilter !== 'All' && nation.region !== regionFilter) {
      return false;
    }
    if (difficultyFilter !== 'all' && nation.difficulty !== difficultyFilter) {
      return false;
    }
    return true;
  });

  const selected = nations.find(n => n.id === selectedNation);

  const renderStars = (count: number) => {
    return '⭐'.repeat(count);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-stone-800">🌍 Select Your Nation</h2>
            <div className="text-sm text-stone-500">
              Choose a nation to lead through history
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Filters */}
        <div className="p-3 border-b border-stone-200 bg-stone-100">
          <div className="flex gap-3 items-center">
            <input
              type="text"
              placeholder="Search nations..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 px-3 py-2 border border-stone-300 rounded"
            />
            <select
              value={regionFilter}
              onChange={e => setRegionFilter(e.target.value)}
              className="px-3 py-2 border border-stone-300 rounded"
            >
              {REGIONS.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
            <select
              value={difficultyFilter}
              onChange={e => setDifficultyFilter(e.target.value)}
              className="px-3 py-2 border border-stone-300 rounded"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="very_hard">Very Hard</option>
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Nation list */}
          <div className="w-1/2 border-r border-stone-200 overflow-y-auto p-3">
            {/* Recommended */}
            {recommendedNations.length > 0 && regionFilter === 'All' && !searchQuery && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-stone-600 mb-2">
                  ⭐ Recommended for Beginners
                </h3>
                <div className="space-y-2">
                  {nations
                    .filter(n => recommendedNations.includes(n.id))
                    .map(nation => (
                      <button
                        key={nation.id}
                        onClick={() => setSelectedNation(nation.id)}
                        className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                          selectedNation === nation.id
                            ? 'border-amber-500 bg-amber-50'
                            : 'border-green-300 bg-green-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{nation.flag}</span>
                          <div>
                            <div className="font-semibold text-stone-800">{nation.name}</div>
                            <div className="text-xs text-stone-500">
                              {nation.development} dev • {nation.provinces} provinces
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* All nations */}
            <h3 className="text-sm font-semibold text-stone-600 mb-2">
              All Nations ({filteredNations.length})
            </h3>
            <div className="space-y-2">
              {filteredNations.map(nation => {
                const diffInfo = DIFFICULTY_INFO[nation.difficulty];
                return (
                  <button
                    key={nation.id}
                    onClick={() => setSelectedNation(nation.id)}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                      selectedNation === nation.id
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-stone-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{nation.flag}</span>
                        <div>
                          <div className="font-semibold text-stone-800">{nation.name}</div>
                          <div className="text-xs text-stone-500">{nation.region}</div>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs ${diffInfo.color}`}>
                        {renderStars(diffInfo.stars)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nation details */}
          <div className="w-1/2 p-4 overflow-y-auto">
            {selected ? (
              <>
                <div className="text-center mb-4">
                  <span className="text-6xl">{selected.flag}</span>
                  <h3 className="font-bold text-stone-800 text-xl mt-2">{selected.name}</h3>
                  <span className={`inline-block px-3 py-1 rounded mt-2 text-sm ${
                    DIFFICULTY_INFO[selected.difficulty].color
                  }`}>
                    {DIFFICULTY_INFO[selected.difficulty].label}
                  </span>
                </div>

                <p className="text-stone-600 text-sm mb-4 text-center">
                  {selected.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-stone-100 rounded text-center">
                    <div className="text-xs text-stone-500">Government</div>
                    <div className="font-medium text-sm">{selected.government}</div>
                  </div>
                  <div className="p-3 bg-stone-100 rounded text-center">
                    <div className="text-xs text-stone-500">Religion</div>
                    <div className="font-medium text-sm">
                      {selected.religionIcon} {selected.religion}
                    </div>
                  </div>
                  <div className="p-3 bg-stone-100 rounded text-center">
                    <div className="text-xs text-stone-500">Culture</div>
                    <div className="font-medium text-sm capitalize">{selected.culture}</div>
                  </div>
                  <div className="p-3 bg-stone-100 rounded text-center">
                    <div className="text-xs text-stone-500">Region</div>
                    <div className="font-medium text-sm">{selected.region}</div>
                  </div>
                </div>

                {/* Development */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-amber-50 rounded text-center">
                    <div className="text-xs text-stone-500">Development</div>
                    <div className="font-bold text-amber-600 text-lg">{selected.development}</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded text-center">
                    <div className="text-xs text-stone-500">Provinces</div>
                    <div className="font-bold text-blue-600 text-lg">{selected.provinces}</div>
                  </div>
                </div>

                {/* Starting position */}
                <div className="p-3 bg-stone-100 rounded mb-4">
                  <div className="text-xs text-stone-500 mb-1">Starting Position</div>
                  <div className="text-sm text-stone-700">{selected.startingPosition}</div>
                </div>

                {/* Play button */}
                <button
                  onClick={() => onSelectNation(selected.id)}
                  className="w-full py-4 bg-amber-600 text-white rounded-lg font-bold text-lg hover:bg-amber-700"
                >
                  Play as {selected.name}
                </button>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-stone-500">Select a nation to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NationSelector;
