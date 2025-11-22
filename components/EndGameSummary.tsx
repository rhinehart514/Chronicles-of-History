import React from 'react';

interface GameStats {
  duration: string;
  startDate: string;
  endDate: string;
  startingProvinces: number;
  endingProvinces: number;
  startingDevelopment: number;
  endingDevelopment: number;
  totalIncome: number;
  warsWon: number;
  warsLost: number;
  battlesWon: number;
  battlesLost: number;
  provincesConquered: number;
  provincesLost: number;
  rulersReigned: number;
  ideasCompleted: number;
  achievements: string[];
  score: number;
  rank: number;
}

interface EndGameSummaryProps {
  nationName: string;
  nationFlag: string;
  stats: GameStats;
  onClose: () => void;
  onNewGame?: () => void;
  onContinue?: () => void;
}

export default function EndGameSummary({
  nationName,
  nationFlag,
  stats,
  onClose,
  onNewGame,
  onContinue
}: EndGameSummaryProps) {
  const growthPercent = stats.startingDevelopment > 0
    ? ((stats.endingDevelopment - stats.startingDevelopment) / stats.startingDevelopment * 100)
    : 0;

  const totalWars = stats.warsWon + stats.warsLost;
  const totalBattles = stats.battlesWon + stats.battlesLost;
  const warWinRate = totalWars > 0 ? (stats.warsWon / totalWars * 100) : 0;
  const battleWinRate = totalBattles > 0 ? (stats.battlesWon / totalBattles * 100) : 0;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-stone-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 text-center border-b border-stone-700">
          <div className="text-4xl mb-3">{nationFlag}</div>
          <h2 className="text-2xl font-bold text-amber-100">{nationName}</h2>
          <div className="text-sm text-stone-400">
            {stats.startDate} - {stats.endDate}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Score and Rank */}
          <div className="bg-amber-900/30 rounded-lg p-4 text-center">
            <div className="text-4xl font-bold text-amber-400">{stats.score.toLocaleString()}</div>
            <div className="text-sm text-stone-400">Final Score</div>
            <div className="text-lg text-amber-100 mt-2">Rank #{stats.rank}</div>
          </div>

          {/* Growth Stats */}
          <div>
            <h3 className="text-sm font-medium text-stone-400 mb-3">Nation Growth</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-stone-700 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-400">
                  {stats.endingProvinces}
                </div>
                <div className="text-xs text-stone-400">
                  Provinces (from {stats.startingProvinces})
                </div>
              </div>
              <div className="bg-stone-700 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-400">
                  {stats.endingDevelopment}
                </div>
                <div className="text-xs text-stone-400">
                  Development ({growthPercent >= 0 ? '+' : ''}{growthPercent.toFixed(0)}%)
                </div>
              </div>
            </div>
          </div>

          {/* Military Stats */}
          <div>
            <h3 className="text-sm font-medium text-stone-400 mb-3">Military Record</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-stone-700 rounded-lg p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Wars</span>
                  <span className="text-sm text-amber-400">{warWinRate.toFixed(0)}%</span>
                </div>
                <div className="text-xs text-stone-400">
                  Won: {stats.warsWon} | Lost: {stats.warsLost}
                </div>
              </div>
              <div className="bg-stone-700 rounded-lg p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Battles</span>
                  <span className="text-sm text-amber-400">{battleWinRate.toFixed(0)}%</span>
                </div>
                <div className="text-xs text-stone-400">
                  Won: {stats.battlesWon} | Lost: {stats.battlesLost}
                </div>
              </div>
            </div>
          </div>

          {/* Expansion */}
          <div>
            <h3 className="text-sm font-medium text-stone-400 mb-3">Expansion</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-stone-700 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-green-400">+{stats.provincesConquered}</div>
                <div className="text-xs text-stone-400">Provinces Conquered</div>
              </div>
              <div className="bg-stone-700 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-red-400">-{stats.provincesLost}</div>
                <div className="text-xs text-stone-400">Provinces Lost</div>
              </div>
            </div>
          </div>

          {/* Other Stats */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-stone-700 rounded-lg p-3">
              <div className="text-xl font-bold text-amber-400">{stats.rulersReigned}</div>
              <div className="text-xs text-stone-400">Rulers</div>
            </div>
            <div className="bg-stone-700 rounded-lg p-3">
              <div className="text-xl font-bold text-amber-400">{stats.ideasCompleted}</div>
              <div className="text-xs text-stone-400">Ideas</div>
            </div>
            <div className="bg-stone-700 rounded-lg p-3">
              <div className="text-xl font-bold text-amber-400">{stats.totalIncome.toLocaleString()}</div>
              <div className="text-xs text-stone-400">Total Income</div>
            </div>
          </div>

          {/* Achievements */}
          {stats.achievements.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-stone-400 mb-3">
                Achievements ({stats.achievements.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {stats.achievements.map((achievement, i) => (
                  <span
                    key={i}
                    className="text-xs bg-amber-900/50 text-amber-300 px-2 py-1 rounded"
                  >
                    🏆 {achievement}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-stone-700 flex gap-3">
          {onContinue && (
            <button
              onClick={onContinue}
              className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium"
            >
              Continue Playing
            </button>
          )}
          {onNewGame && (
            <button
              onClick={onNewGame}
              className="flex-1 py-3 bg-stone-600 hover:bg-stone-500 rounded font-medium"
            >
              New Game
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-stone-700 hover:bg-stone-600 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
