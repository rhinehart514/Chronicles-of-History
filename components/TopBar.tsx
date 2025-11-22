import React from 'react';

interface TopBarProps {
  nationName: string;
  nationFlag?: string;
  gold: number;
  goldIncome: number;
  manpower: number;
  maxManpower: number;
  sailors: number;
  maxSailors: number;
  adminPoints: number;
  diploPoints: number;
  milPoints: number;
  stability: number;
  prestige: number;
  legitimacy: number;
  currentDate: string;
  speed: number;
  isPaused: boolean;
  onTogglePause: () => void;
  onChangeSpeed: (speed: number) => void;
  onOpenMenu?: (menu: string) => void;
}

export default function TopBar({
  nationName,
  nationFlag,
  gold,
  goldIncome,
  manpower,
  maxManpower,
  sailors,
  maxSailors,
  adminPoints,
  diploPoints,
  milPoints,
  stability,
  prestige,
  legitimacy,
  currentDate,
  speed,
  isPaused,
  onTogglePause,
  onChangeSpeed,
  onOpenMenu
}: TopBarProps) {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="bg-stone-800 border-b border-stone-700 px-4 py-2">
      <div className="flex items-center justify-between">
        {/* Nation info */}
        <div className="flex items-center gap-4">
          <div
            className="flex items-center gap-2 cursor-pointer hover:bg-stone-700 px-2 py-1 rounded"
            onClick={() => onOpenMenu?.('nation')}
          >
            <span className="text-xl">{nationFlag || '🏴'}</span>
            <span className="font-semibold text-amber-100">{nationName}</span>
          </div>

          {/* Resources */}
          <div className="flex items-center gap-3 text-sm">
            <div
              className="flex items-center gap-1 cursor-pointer hover:bg-stone-700 px-2 py-1 rounded"
              onClick={() => onOpenMenu?.('economy')}
              title="Treasury"
            >
              <span>💰</span>
              <span className="text-amber-400">{gold.toFixed(0)}</span>
              <span className={`text-xs ${goldIncome >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ({goldIncome >= 0 ? '+' : ''}{goldIncome.toFixed(1)})
              </span>
            </div>

            <div
              className="flex items-center gap-1 cursor-pointer hover:bg-stone-700 px-2 py-1 rounded"
              onClick={() => onOpenMenu?.('military')}
              title="Manpower"
            >
              <span>👥</span>
              <span className="text-red-400">{formatNumber(manpower)}</span>
              <span className="text-xs text-stone-400">/{formatNumber(maxManpower)}</span>
            </div>

            <div
              className="flex items-center gap-1 cursor-pointer hover:bg-stone-700 px-2 py-1 rounded"
              onClick={() => onOpenMenu?.('naval')}
              title="Sailors"
            >
              <span>⚓</span>
              <span className="text-blue-400">{formatNumber(sailors)}</span>
              <span className="text-xs text-stone-400">/{formatNumber(maxSailors)}</span>
            </div>
          </div>
        </div>

        {/* Monarch points */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-1 cursor-pointer hover:bg-stone-700 px-2 py-1 rounded"
            onClick={() => onOpenMenu?.('technology')}
            title="Administrative Power"
          >
            <span className="text-amber-500">📜</span>
            <span className="text-amber-400 font-medium">{adminPoints}</span>
          </div>
          <div
            className="flex items-center gap-1 cursor-pointer hover:bg-stone-700 px-2 py-1 rounded"
            onClick={() => onOpenMenu?.('technology')}
            title="Diplomatic Power"
          >
            <span className="text-blue-500">🤝</span>
            <span className="text-blue-400 font-medium">{diploPoints}</span>
          </div>
          <div
            className="flex items-center gap-1 cursor-pointer hover:bg-stone-700 px-2 py-1 rounded"
            onClick={() => onOpenMenu?.('technology')}
            title="Military Power"
          >
            <span className="text-red-500">⚔️</span>
            <span className="text-red-400 font-medium">{milPoints}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-sm">
          <div
            className="cursor-pointer hover:bg-stone-700 px-2 py-1 rounded"
            onClick={() => onOpenMenu?.('stability')}
            title="Stability"
          >
            <span className={`font-medium ${
              stability >= 1 ? 'text-green-400' :
              stability <= -1 ? 'text-red-400' : 'text-stone-400'
            }`}>
              ⚖️ {stability >= 0 ? '+' : ''}{stability}
            </span>
          </div>

          <div
            className="cursor-pointer hover:bg-stone-700 px-2 py-1 rounded"
            onClick={() => onOpenMenu?.('prestige')}
            title="Prestige"
          >
            <span className={`font-medium ${
              prestige >= 50 ? 'text-amber-400' :
              prestige <= 0 ? 'text-red-400' : 'text-stone-400'
            }`}>
              ⭐ {prestige.toFixed(0)}
            </span>
          </div>

          <div
            className="cursor-pointer hover:bg-stone-700 px-2 py-1 rounded"
            onClick={() => onOpenMenu?.('government')}
            title="Legitimacy"
          >
            <span className={`font-medium ${
              legitimacy >= 50 ? 'text-purple-400' : 'text-red-400'
            }`}>
              👑 {legitimacy.toFixed(0)}
            </span>
          </div>
        </div>

        {/* Date and speed controls */}
        <div className="flex items-center gap-3">
          <div className="text-amber-100 font-medium">
            {currentDate}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onTogglePause}
              className={`px-2 py-1 rounded text-sm ${
                isPaused
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {isPaused ? '▶' : '⏸'}
            </button>

            {[1, 2, 3, 4, 5].map(s => (
              <button
                key={s}
                onClick={() => onChangeSpeed(s)}
                className={`w-6 h-6 rounded text-xs ${
                  speed === s
                    ? 'bg-amber-600 text-white'
                    : 'bg-stone-700 text-stone-400 hover:bg-stone-600'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
