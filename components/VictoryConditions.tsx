import React from 'react';

interface VictoryConditionsProps {
  isOpen: boolean;
  onClose: () => void;
  conditions: VictoryCondition[];
  currentScore: number;
  targetScore: number;
  gameEndYear: number;
  currentYear: number;
  rankings: NationRanking[];
  playerNationId: string;
}

export interface VictoryCondition {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: 'domination' | 'economic' | 'diplomatic' | 'cultural' | 'religious';
  requirements: VictoryRequirement[];
  points: number;
  achieved: boolean;
}

export interface VictoryRequirement {
  description: string;
  current: number;
  target: number;
  completed: boolean;
}

export interface NationRanking {
  id: string;
  name: string;
  flag: string;
  score: number;
  rank: number;
}

export const VictoryConditions: React.FC<VictoryConditionsProps> = ({
  isOpen,
  onClose,
  conditions,
  currentScore,
  targetScore,
  gameEndYear,
  currentYear,
  rankings,
  playerNationId
}) => {
  if (!isOpen) return null;

  const yearsRemaining = gameEndYear - currentYear;
  const achievedCount = conditions.filter(c => c.achieved).length;
  const playerRank = rankings.find(r => r.id === playerNationId)?.rank || 0;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'domination': return '⚔️';
      case 'economic': return '💰';
      case 'diplomatic': return '🤝';
      case 'cultural': return '🎭';
      case 'religious': return '⛪';
      default: return '🏆';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'domination': return 'red';
      case 'economic': return 'amber';
      case 'diplomatic': return 'blue';
      case 'cultural': return 'purple';
      case 'religious': return 'green';
      default: return 'stone';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border-4 border-amber-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 bg-amber-50 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-stone-800">🏆 Victory Conditions</h2>
            <div className="text-sm text-stone-500">
              {achievedCount} of {conditions.length} conditions achieved
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Score overview */}
        <div className="p-4 border-b border-stone-200 bg-stone-100">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xs text-stone-500">Your Score</div>
              <div className="text-2xl font-bold text-amber-600">{currentScore}</div>
            </div>
            <div>
              <div className="text-xs text-stone-500">World Rank</div>
              <div className="text-2xl font-bold text-stone-800">#{playerRank}</div>
            </div>
            <div>
              <div className="text-xs text-stone-500">Years Remaining</div>
              <div className="text-2xl font-bold text-stone-800">{yearsRemaining}</div>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress to Victory</span>
              <span>{currentScore}/{targetScore}</span>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-3">
              <div
                className="bg-amber-500 h-3 rounded-full transition-all"
                style={{ width: `${Math.min(100, (currentScore / targetScore) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Conditions */}
          <div className="w-2/3 border-r border-stone-200 overflow-y-auto p-4">
            <div className="space-y-4">
              {conditions.map(condition => {
                const color = getCategoryColor(condition.category);
                const progress = condition.requirements.filter(r => r.completed).length;
                const total = condition.requirements.length;

                return (
                  <div
                    key={condition.id}
                    className={`p-4 rounded-lg border-2 ${
                      condition.achieved
                        ? 'border-green-500 bg-green-50'
                        : `border-stone-200 bg-white`
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{condition.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-800">{condition.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded bg-${color}-100 text-${color}-700`}>
                            {getCategoryIcon(condition.category)} {condition.category}
                          </span>
                        </div>
                        <div className="text-xs text-stone-500">{condition.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-amber-600">+{condition.points}</div>
                        <div className="text-xs text-stone-500">points</div>
                      </div>
                    </div>

                    {/* Requirements */}
                    <div className="space-y-2 mt-3">
                      {condition.requirements.map((req, i) => (
                        <div key={i}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className={req.completed ? 'text-green-600' : 'text-stone-600'}>
                              {req.completed ? '✓' : '○'} {req.description}
                            </span>
                            <span className="text-xs text-stone-500">
                              {req.current}/{req.target}
                            </span>
                          </div>
                          <div className="w-full bg-stone-200 rounded-full h-1">
                            <div
                              className={`h-1 rounded-full ${
                                req.completed ? 'bg-green-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${Math.min(100, (req.current / req.target) * 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {condition.achieved && (
                      <div className="mt-3 text-center text-green-600 font-medium">
                        ✓ Condition Achieved!
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="w-1/3 p-4 overflow-y-auto">
            <h3 className="font-bold text-stone-800 mb-3">🏅 Leaderboard</h3>
            <div className="space-y-2">
              {rankings.slice(0, 10).map((nation, i) => (
                <div
                  key={nation.id}
                  className={`p-2 rounded flex items-center justify-between ${
                    nation.id === playerNationId
                      ? 'bg-amber-100 border border-amber-300'
                      : 'bg-white border border-stone-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-6 text-center font-bold ${
                      i < 3 ? 'text-amber-600' : 'text-stone-500'
                    }`}>
                      {nation.rank}
                    </span>
                    <span>{nation.flag}</span>
                    <span className="text-sm font-medium truncate">
                      {nation.name}
                    </span>
                  </div>
                  <span className="font-bold text-stone-800">{nation.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-300 bg-stone-100">
          <div className="text-center text-sm text-stone-600">
            Game ends in {gameEndYear}. Highest score wins!
          </div>
        </div>
      </div>
    </div>
  );
};

export default VictoryConditions;
