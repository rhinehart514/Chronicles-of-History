import React, { useState } from 'react';
import {
  NationScore,
  ScoreCategory,
  SCORE_WEIGHTS,
  getRankTier,
  getTierColor,
  getRankChangeDescription,
  getCategoryIcon,
  generateScoreBreakdown
} from '../data/scoreSystem';

interface ScoreBoardProps {
  scores: NationScore[];
  playerNationId: string;
  onClose: () => void;
  onSelectNation?: (nationId: string) => void;
}

type FilterType = 'total' | ScoreCategory;

export default function ScoreBoard({
  scores,
  playerNationId,
  onClose,
  onSelectNation
}: ScoreBoardProps) {
  const [filter, setFilter] = useState<FilterType>('total');
  const [selectedScore, setSelectedScore] = useState<NationScore | null>(null);

  const filters: { id: FilterType; label: string; icon: string }[] = [
    { id: 'total', label: 'Total', icon: '🏆' },
    { id: 'military', label: 'Military', icon: '⚔️' },
    { id: 'economic', label: 'Economic', icon: '💰' },
    { id: 'diplomatic', label: 'Diplomatic', icon: '🤝' },
    { id: 'administrative', label: 'Admin', icon: '📋' },
    { id: 'innovation', label: 'Innovation', icon: '💡' }
  ];

  const sortedScores = [...scores].sort((a, b) => {
    if (filter === 'total') {
      return b.totalScore - a.totalScore;
    }
    const aComp = a.components.find(c => c.category === filter);
    const bComp = b.components.find(c => c.category === filter);
    return (bComp?.contribution || 0) - (aComp?.contribution || 0);
  });

  const playerScore = scores.find(s => s.nationId === playerNationId);
  const playerRank = sortedScores.findIndex(s => s.nationId === playerNationId) + 1;

  const getScoreValue = (score: NationScore): number => {
    if (filter === 'total') return score.totalScore;
    const comp = score.components.find(c => c.category === filter);
    return comp?.contribution || 0;
  };

  const getRankColor = (rank: number): string => {
    if (rank === 1) return 'text-amber-400';
    if (rank === 2) return 'text-gray-300';
    if (rank === 3) return 'text-amber-600';
    return 'text-stone-400';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-stone-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-stone-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-amber-100">🏆 World Rankings</h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200"
          >
            ✕
          </button>
        </div>

        {/* Player summary */}
        {playerScore && (
          <div className="p-3 border-b border-stone-700 bg-amber-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`text-2xl font-bold ${getRankColor(playerRank)}`}>
                  #{playerRank}
                </div>
                <div>
                  <div className="text-amber-100 font-medium">Your Nation</div>
                  <div className={`text-sm ${getTierColor(getRankTier(playerRank, scores.length))}`}>
                    {getRankTier(playerRank, scores.length)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-amber-400">
                  {playerScore.totalScore.toLocaleString()}
                </div>
                <div className="text-xs text-stone-400">Total Score</div>
              </div>
            </div>
          </div>
        )}

        {/* Category filters */}
        <div className="p-2 border-b border-stone-700 flex gap-1 overflow-x-auto">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 text-xs rounded whitespace-nowrap flex items-center gap-1 transition-colors ${
                filter === f.id
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
              }`}
            >
              <span>{f.icon}</span>
              <span>{f.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Rankings list */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-stone-800">
                <tr className="text-xs text-stone-400 border-b border-stone-700">
                  <th className="py-2 px-3 text-left">Rank</th>
                  <th className="py-2 px-3 text-left">Nation</th>
                  <th className="py-2 px-3 text-right">Score</th>
                  <th className="py-2 px-3 text-center">Change</th>
                </tr>
              </thead>
              <tbody>
                {sortedScores.map((score, index) => {
                  const rank = index + 1;
                  const isPlayer = score.nationId === playerNationId;
                  const change = score.previousRank
                    ? getRankChangeDescription(rank, score.previousRank)
                    : '−';

                  return (
                    <tr
                      key={score.nationId}
                      onClick={() => {
                        setSelectedScore(score);
                        if (onSelectNation) onSelectNation(score.nationId);
                      }}
                      className={`border-b border-stone-700/50 cursor-pointer transition-colors ${
                        isPlayer
                          ? 'bg-amber-900/30'
                          : selectedScore?.nationId === score.nationId
                          ? 'bg-stone-700'
                          : 'hover:bg-stone-700/50'
                      }`}
                    >
                      <td className="py-2 px-3">
                        <span className={`font-bold ${getRankColor(rank)}`}>
                          {rank}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <span className={isPlayer ? 'text-amber-100' : 'text-stone-200'}>
                            {score.nationId}
                          </span>
                          {isPlayer && (
                            <span className="text-xs bg-amber-600 text-white px-1.5 py-0.5 rounded">
                              You
                            </span>
                          )}
                        </div>
                        <div className={`text-xs ${getTierColor(getRankTier(rank, scores.length))}`}>
                          {getRankTier(rank, scores.length)}
                        </div>
                      </td>
                      <td className="py-2 px-3 text-right">
                        <div className="font-bold text-amber-400">
                          {getScoreValue(score).toLocaleString()}
                        </div>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className={
                          change.includes('↑') ? 'text-green-400' :
                          change.includes('↓') ? 'text-red-400' : 'text-stone-500'
                        }>
                          {change}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Details panel */}
          {selectedScore && (
            <div className="w-64 border-l border-stone-700 p-4 overflow-y-auto">
              <h3 className="font-bold text-amber-100 mb-3">{selectedScore.nationId}</h3>

              <div className="bg-stone-700 rounded p-3 mb-4">
                <div className="text-sm text-stone-400">Total Score</div>
                <div className="text-2xl font-bold text-amber-400">
                  {selectedScore.totalScore.toLocaleString()}
                </div>
              </div>

              <h4 className="text-sm font-medium text-stone-300 mb-2">Score Breakdown</h4>
              <div className="space-y-2">
                {generateScoreBreakdown(selectedScore).map(item => (
                  <div key={item.category} className="bg-stone-700 rounded p-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-stone-300 flex items-center gap-1">
                        <span>{getCategoryIcon(item.category as ScoreCategory)}</span>
                        {item.category}
                      </span>
                      <span className="text-xs font-medium text-amber-400">
                        {item.value.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-stone-500 mt-1">
                      {item.percentage}% of total
                    </div>
                  </div>
                ))}
              </div>

              {selectedScore.history.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-stone-300 mb-2">Recent History</h4>
                  <div className="space-y-1 text-xs">
                    {selectedScore.history.slice(-5).reverse().map((h, i) => (
                      <div key={i} className="flex justify-between text-stone-400">
                        <span>{h.date}</span>
                        <span>#{h.rank} ({h.score.toLocaleString()})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-stone-700 bg-stone-700/50">
          <div className="flex justify-between text-xs text-stone-400">
            <span>{scores.length} nations ranked</span>
            <span>Updated monthly</span>
          </div>
        </div>
      </div>
    </div>
  );
}
