import React from 'react';

export interface GameOverStats {
  finalYear: number;
  yearsPlayed: number;
  peakTreasury: number;
  peakMilitary: number;
  provincesControlled: number;
  battlesWon: number;
  battlesLost: number;
  warsWon: number;
  warsLost: number;
  alliancesFormed: number;
  technologiesResearched: number;
  buildingsConstructed: number;
  totalPopulation: number;
}

export interface GameOverReason {
  type: 'victory' | 'defeat' | 'abdication';
  title: string;
  description: string;
}

interface GameOverProps {
  isOpen: boolean;
  reason: GameOverReason;
  stats: GameOverStats;
  nationName: string;
  rulerName: string;
  onNewGame: () => void;
  onMainMenu: () => void;
  onContinue?: () => void; // For sandbox mode
}

export const GameOver: React.FC<GameOverProps> = ({
  isOpen,
  reason,
  stats,
  nationName,
  rulerName,
  onNewGame,
  onMainMenu,
  onContinue
}) => {
  if (!isOpen) return null;

  const isVictory = reason.type === 'victory';

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className={`bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border-4 ${
        isVictory ? 'border-amber-500' : 'border-stone-600'
      }`}>
        {/* Header */}
        <div className={`p-6 text-center ${isVictory ? 'bg-amber-100' : 'bg-stone-200'}`}>
          <div className="text-5xl mb-3">
            {isVictory ? '👑' : reason.type === 'defeat' ? '💀' : '🏳️'}
          </div>
          <h2 className={`text-3xl font-bold ${isVictory ? 'text-amber-700' : 'text-stone-700'}`}>
            {reason.title}
          </h2>
          <p className="text-stone-600 mt-2">{reason.description}</p>
        </div>

        {/* Nation info */}
        <div className="p-4 border-b border-stone-200 text-center">
          <div className="text-lg font-semibold text-stone-800">{nationName}</div>
          <div className="text-sm text-stone-500">under {rulerName}</div>
          <div className="text-sm text-stone-600 mt-1">
            {stats.yearsPlayed} years • Final year: {stats.finalYear}
          </div>
        </div>

        {/* Statistics */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="font-semibold text-stone-800 mb-3">Campaign Statistics</h3>

          <div className="grid grid-cols-2 gap-4">
            {/* Military */}
            <div className="bg-red-50 rounded p-3">
              <h4 className="text-xs font-semibold text-red-600 mb-2">⚔️ Military</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-600">Battles Won</span>
                  <span className="font-medium">{stats.battlesWon}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Battles Lost</span>
                  <span className="font-medium">{stats.battlesLost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Wars Won</span>
                  <span className="font-medium">{stats.warsWon}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Wars Lost</span>
                  <span className="font-medium">{stats.warsLost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Peak Military</span>
                  <span className="font-medium">{stats.peakMilitary.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Economy */}
            <div className="bg-amber-50 rounded p-3">
              <h4 className="text-xs font-semibold text-amber-600 mb-2">💰 Economy</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-600">Peak Treasury</span>
                  <span className="font-medium">{stats.peakTreasury.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Buildings Built</span>
                  <span className="font-medium">{stats.buildingsConstructed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Final Population</span>
                  <span className="font-medium">{stats.totalPopulation.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Diplomacy */}
            <div className="bg-green-50 rounded p-3">
              <h4 className="text-xs font-semibold text-green-600 mb-2">🤝 Diplomacy</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-600">Alliances Formed</span>
                  <span className="font-medium">{stats.alliancesFormed}</span>
                </div>
              </div>
            </div>

            {/* Development */}
            <div className="bg-blue-50 rounded p-3">
              <h4 className="text-xs font-semibold text-blue-600 mb-2">📚 Development</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-600">Technologies</span>
                  <span className="font-medium">{stats.technologiesResearched}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Provinces</span>
                  <span className="font-medium">{stats.provincesControlled}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Score calculation */}
          <div className="mt-4 p-3 bg-stone-100 rounded">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-stone-800">Final Score</span>
              <span className={`text-2xl font-bold ${isVictory ? 'text-amber-600' : 'text-stone-600'}`}>
                {calculateScore(stats).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-stone-300 flex justify-between">
          <button
            onClick={onMainMenu}
            className="px-4 py-2 bg-stone-300 text-stone-700 rounded hover:bg-stone-400"
          >
            Main Menu
          </button>
          <div className="flex gap-2">
            {onContinue && (
              <button
                onClick={onContinue}
                className="px-4 py-2 bg-stone-600 text-white rounded hover:bg-stone-700"
              >
                Continue Playing
              </button>
            )}
            <button
              onClick={onNewGame}
              className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
            >
              New Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Calculate final score
function calculateScore(stats: GameOverStats): number {
  let score = 0;

  // Base points for years played
  score += stats.yearsPlayed * 10;

  // Military achievements
  score += stats.battlesWon * 50;
  score += stats.warsWon * 500;
  score -= stats.battlesLost * 10;
  score -= stats.warsLost * 100;

  // Economic achievements
  score += Math.floor(stats.peakTreasury / 1000);
  score += stats.buildingsConstructed * 20;

  // Development
  score += stats.technologiesResearched * 100;
  score += stats.provincesControlled * 50;

  // Population
  score += Math.floor(stats.totalPopulation / 10000);

  // Diplomacy
  score += stats.alliancesFormed * 30;

  return Math.max(0, score);
}

export default GameOver;
