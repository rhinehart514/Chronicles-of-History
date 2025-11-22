import React, { useState } from 'react';

interface NationRanking {
  id: string;
  name: string;
  flag: string;
  score: number;
  rank: number;
  isPlayer: boolean;
  military: number;
  economic: number;
  diplomatic: number;
}

interface LeaderboardPanelProps {
  rankings: NationRanking[];
  playerRank: number;
  playerScore: number;
  onSelectNation?: (nationId: string) => void;
  onClose: () => void;
}

export default function LeaderboardPanel({
  rankings,
  playerRank,
  playerScore,
  onSelectNation,
  onClose
}: LeaderboardPanelProps) {
  const [sortBy, setSortBy] = useState<'total' | 'military' | 'economic' | 'diplomatic'>('total');

  const sortedRankings = [...rankings].sort((a, b) => {
    switch (sortBy) {
      case 'military':
        return b.military - a.military;
      case 'economic':
        return b.economic - a.economic;
      case 'diplomatic':
        return b.diplomatic - a.diplomatic;
      default:
        return b.score - a.score;
    }
  });

  const getRankColor = (rank: number) => {
    if (rank <= 8) return 'text-yellow-400';
    if (rank <= 20) return 'text-blue-400';
    if (rank <= 50) return 'text-green-400';
    return 'text-stone-400';
  };

  const getRankCategory = (rank: number) => {
    if (rank <= 8) return 'Great Power';
    if (rank <= 20) return 'Major Power';
    if (rank <= 50) return 'Regional';
    return 'Minor';
  };

  const sortOptions = [
    { id: 'total' as const, label: 'Total', icon: '📊' },
    { id: 'military' as const, label: 'Military', icon: '⚔️' },
    { id: 'economic' as const, label: 'Economic', icon: '💰' },
    { id: 'diplomatic' as const, label: 'Diplomatic', icon: '🤝' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-stone-800 rounded-lg shadow-xl w-full max-w-md max-h-[85vh] flex flex-col">
        <div className="p-4 border-b border-stone-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-amber-100">Leaderboard</h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200"
          >
            ✕
          </button>
        </div>

        {/* Player Summary */}
        <div className="px-4 py-3 bg-stone-900">
          <div className="flex justify-between items-center">
            <div>
              <div className={`text-2xl font-bold ${getRankColor(playerRank)}`}>
                #{playerRank}
              </div>
              <div className="text-xs text-stone-400">{getRankCategory(playerRank)}</div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-amber-400">
                {playerScore.toLocaleString()}
              </div>
              <div className="text-xs text-stone-400">Your Score</div>
            </div>
          </div>
        </div>

        {/* Sort Options */}
        <div className="px-4 py-2 border-b border-stone-700 flex gap-1">
          {sortOptions.map(option => (
            <button
              key={option.id}
              onClick={() => setSortBy(option.id)}
              className={`flex-1 px-2 py-1 rounded text-xs ${
                sortBy === option.id
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-700 hover:bg-stone-600'
              }`}
            >
              {option.icon} {option.label}
            </button>
          ))}
        </div>

        {/* Rankings List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2">
          {sortedRankings.map((nation, index) => (
            <div
              key={nation.id}
              onClick={() => onSelectNation?.(nation.id)}
              className={`bg-stone-700 rounded-lg p-2 cursor-pointer transition-colors hover:bg-stone-600 ${
                nation.isPlayer ? 'ring-2 ring-amber-500' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`font-bold w-6 ${getRankColor(index + 1)}`}>
                    #{index + 1}
                  </span>
                  <span className="text-xl">{nation.flag}</span>
                  <div>
                    <div className="text-sm font-medium">{nation.name}</div>
                    {nation.isPlayer && (
                      <div className="text-xs text-amber-400">You</div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">
                    {sortBy === 'total'
                      ? nation.score.toLocaleString()
                      : sortBy === 'military'
                      ? nation.military.toLocaleString()
                      : sortBy === 'economic'
                      ? nation.economic.toLocaleString()
                      : nation.diplomatic.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="mt-2 grid grid-cols-3 gap-1 text-xs">
                <div className="bg-stone-600 rounded px-1 py-0.5 text-center">
                  <span className="text-red-400">⚔️ {nation.military}</span>
                </div>
                <div className="bg-stone-600 rounded px-1 py-0.5 text-center">
                  <span className="text-yellow-400">💰 {nation.economic}</span>
                </div>
                <div className="bg-stone-600 rounded px-1 py-0.5 text-center">
                  <span className="text-blue-400">🤝 {nation.diplomatic}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Great Powers Indicator */}
        <div className="p-3 border-t border-stone-700 bg-stone-900">
          <div className="text-xs text-stone-400 text-center">
            Top 8 nations are <span className="text-yellow-400">Great Powers</span>
          </div>
        </div>
      </div>
    </div>
  );
}
