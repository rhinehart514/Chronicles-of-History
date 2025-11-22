import React, { useState } from 'react';

export interface WorldStats {
  totalNations: number;
  totalProvinces: number;
  totalPopulation: number;
  activeWars: number;
  greatPowers: string[];
  dominantReligion: string;
  yearStarted: number;
  currentYear: number;
}

export interface NationRanking {
  id: string;
  name: string;
  flag: string;
  score: number;
  military: number;
  economy: number;
  provinces: number;
}

interface WorldInfoProps {
  isOpen: boolean;
  onClose: () => void;
  worldStats: WorldStats;
  rankings: NationRanking[];
  playerNation: string;
}

export const WorldInfo: React.FC<WorldInfoProps> = ({
  isOpen,
  onClose,
  worldStats,
  rankings,
  playerNation
}) => {
  const [tab, setTab] = useState<'overview' | 'rankings' | 'wars'>('overview');
  const [rankingType, setRankingType] = useState<'score' | 'military' | 'economy' | 'provinces'>('score');

  if (!isOpen) return null;

  const sortedRankings = [...rankings].sort((a, b) => b[rankingType] - a[rankingType]);
  const playerRank = sortedRankings.findIndex(r => r.id === playerNation) + 1;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <h2 className="text-xl font-bold text-stone-800">🌍 World Overview</h2>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="p-2 border-b border-stone-200 flex gap-2">
          {(['overview', 'rankings', 'wars'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded text-sm font-medium ${
                tab === t
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {tab === 'overview' && (
            <div className="space-y-4">
              {/* World stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-stone-100 rounded-lg p-4">
                  <div className="text-xs text-stone-500 mb-1">Year</div>
                  <div className="text-2xl font-bold text-stone-800">{worldStats.currentYear}</div>
                  <div className="text-xs text-stone-500">
                    {worldStats.currentYear - worldStats.yearStarted} years elapsed
                  </div>
                </div>
                <div className="bg-stone-100 rounded-lg p-4">
                  <div className="text-xs text-stone-500 mb-1">Active Wars</div>
                  <div className={`text-2xl font-bold ${worldStats.activeWars > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {worldStats.activeWars}
                  </div>
                </div>
                <div className="bg-stone-100 rounded-lg p-4">
                  <div className="text-xs text-stone-500 mb-1">Nations</div>
                  <div className="text-2xl font-bold text-stone-800">{worldStats.totalNations}</div>
                </div>
                <div className="bg-stone-100 rounded-lg p-4">
                  <div className="text-xs text-stone-500 mb-1">World Population</div>
                  <div className="text-2xl font-bold text-stone-800">
                    {(worldStats.totalPopulation / 1000000).toFixed(1)}M
                  </div>
                </div>
              </div>

              {/* Great powers */}
              <div className="bg-amber-50 rounded-lg p-4">
                <h3 className="font-semibold text-stone-800 mb-3">🏆 Great Powers</h3>
                <div className="flex flex-wrap gap-2">
                  {worldStats.greatPowers.map((power, i) => (
                    <span
                      key={power}
                      className={`px-3 py-1 rounded ${
                        power === playerNation
                          ? 'bg-amber-500 text-white'
                          : 'bg-white text-stone-700'
                      }`}
                    >
                      {i + 1}. {power}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dominant religion */}
              <div className="bg-stone-100 rounded-lg p-4">
                <h3 className="font-semibold text-stone-800 mb-2">⛪ Dominant Religion</h3>
                <div className="text-lg">{worldStats.dominantReligion}</div>
              </div>
            </div>
          )}

          {tab === 'rankings' && (
            <div>
              {/* Ranking type selector */}
              <div className="flex gap-2 mb-4">
                {(['score', 'military', 'economy', 'provinces'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setRankingType(type)}
                    className={`px-3 py-1 rounded text-sm ${
                      rankingType === type
                        ? 'bg-stone-600 text-white'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>

              {/* Player rank */}
              {playerRank > 0 && (
                <div className="bg-amber-100 rounded-lg p-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-amber-800">Your Ranking</span>
                    <span className="text-2xl font-bold text-amber-600">#{playerRank}</span>
                  </div>
                </div>
              )}

              {/* Rankings list */}
              <div className="space-y-2">
                {sortedRankings.slice(0, 20).map((nation, i) => {
                  const isPlayer = nation.id === playerNation;
                  return (
                    <div
                      key={nation.id}
                      className={`flex items-center gap-3 p-3 rounded ${
                        isPlayer ? 'bg-amber-100' : 'bg-stone-100'
                      }`}
                    >
                      <span className={`font-bold w-8 ${i < 3 ? 'text-amber-600' : 'text-stone-500'}`}>
                        #{i + 1}
                      </span>
                      <span className="text-lg">{nation.flag}</span>
                      <span className={`flex-1 ${isPlayer ? 'font-bold' : ''}`}>
                        {nation.name}
                      </span>
                      <span className="font-bold text-stone-800">
                        {nation[rankingType].toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === 'wars' && (
            <div className="text-center py-8 text-stone-500">
              <span className="text-4xl">⚔️</span>
              <p className="mt-2">
                {worldStats.activeWars > 0
                  ? `${worldStats.activeWars} wars currently being fought`
                  : 'The world is at peace'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorldInfo;
