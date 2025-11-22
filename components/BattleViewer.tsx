import React from 'react';

interface BattlePhase {
  name: string;
  attackerLosses: number;
  defenderLosses: number;
  moraleImpact: number;
}

interface Battle {
  id: string;
  location: string;
  date: string;
  terrain: string;
  attacker: BattleSide;
  defender: BattleSide;
  phases: BattlePhase[];
  winner: 'attacker' | 'defender';
  duration: number;
}

interface BattleSide {
  nation: string;
  general?: {
    name: string;
    fire: number;
    shock: number;
    maneuver: number;
  };
  infantry: number;
  cavalry: number;
  artillery: number;
  morale: number;
  discipline: number;
  losses: {
    infantry: number;
    cavalry: number;
    artillery: number;
  };
}

interface BattleViewerProps {
  battle: Battle;
  playerNation: string;
  onClose: () => void;
}

export default function BattleViewer({
  battle,
  playerNation,
  onClose
}: BattleViewerProps) {
  const isPlayerAttacker = battle.attacker.nation === playerNation;
  const playerWon = (isPlayerAttacker && battle.winner === 'attacker') ||
    (!isPlayerAttacker && battle.winner === 'defender');

  const formatNumber = (n: number) => n.toLocaleString();

  const renderSide = (side: BattleSide, isAttacker: boolean) => {
    const totalForces = side.infantry + side.cavalry + side.artillery;
    const totalLosses = side.losses.infantry + side.losses.cavalry + side.losses.artillery;
    const lossPercent = totalForces > 0 ? (totalLosses / totalForces) * 100 : 0;

    return (
      <div className={`flex-1 ${isAttacker ? 'text-left' : 'text-right'}`}>
        <div className={`font-bold text-lg mb-2 ${
          (isAttacker && battle.winner === 'attacker') ||
          (!isAttacker && battle.winner === 'defender')
            ? 'text-green-400' : 'text-red-400'
        }`}>
          {side.nation}
        </div>

        {side.general && (
          <div className="mb-3">
            <div className="text-sm text-amber-100">{side.general.name}</div>
            <div className="text-xs text-stone-400">
              ⚔️ {side.general.fire} | 💥 {side.general.shock} | 🏃 {side.general.maneuver}
            </div>
          </div>
        )}

        <div className="space-y-1 text-sm mb-3">
          <div className={isAttacker ? '' : 'flex flex-row-reverse'}>
            <span className="text-stone-400">Infantry:</span>
            <span className="mx-1">{formatNumber(side.infantry)}</span>
            <span className="text-red-400">(-{formatNumber(side.losses.infantry)})</span>
          </div>
          <div className={isAttacker ? '' : 'flex flex-row-reverse'}>
            <span className="text-stone-400">Cavalry:</span>
            <span className="mx-1">{formatNumber(side.cavalry)}</span>
            <span className="text-red-400">(-{formatNumber(side.losses.cavalry)})</span>
          </div>
          <div className={isAttacker ? '' : 'flex flex-row-reverse'}>
            <span className="text-stone-400">Artillery:</span>
            <span className="mx-1">{formatNumber(side.artillery)}</span>
            <span className="text-red-400">(-{formatNumber(side.losses.artillery)})</span>
          </div>
        </div>

        <div className="text-xs space-y-1">
          <div className={isAttacker ? '' : 'flex flex-row-reverse justify-end'}>
            <span className="text-stone-400">Morale:</span>
            <span className="mx-1 text-amber-400">{side.morale.toFixed(1)}</span>
          </div>
          <div className={isAttacker ? '' : 'flex flex-row-reverse justify-end'}>
            <span className="text-stone-400">Discipline:</span>
            <span className="mx-1 text-amber-400">{side.discipline.toFixed(0)}%</span>
          </div>
          <div className={isAttacker ? '' : 'flex flex-row-reverse justify-end'}>
            <span className="text-stone-400">Losses:</span>
            <span className={`mx-1 ${lossPercent > 50 ? 'text-red-400' : 'text-amber-400'}`}>
              {lossPercent.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-stone-800 rounded-lg shadow-xl w-full max-w-2xl">
        <div className={`p-4 border-b border-stone-700 ${
          playerWon ? 'bg-green-900/30' : 'bg-red-900/30'
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-amber-100">
                ⚔️ Battle of {battle.location}
              </h2>
              <div className="text-sm text-stone-400">
                {battle.date} • {battle.terrain} • {battle.duration} days
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-200"
            >
              ✕
            </button>
          </div>
          <div className={`mt-2 text-lg font-bold ${playerWon ? 'text-green-400' : 'text-red-400'}`}>
            {playerWon ? '🏆 Victory!' : '💀 Defeat'}
          </div>
        </div>

        <div className="p-4">
          {/* Battle sides */}
          <div className="flex gap-8 mb-6">
            {renderSide(battle.attacker, true)}
            <div className="flex flex-col items-center justify-center">
              <span className="text-2xl">⚔️</span>
              <span className="text-xs text-stone-400">vs</span>
            </div>
            {renderSide(battle.defender, false)}
          </div>

          {/* Battle phases */}
          <div>
            <h3 className="text-xs text-stone-400 mb-2">Battle Phases</h3>
            <div className="space-y-2">
              {battle.phases.map((phase, i) => (
                <div key={i} className="bg-stone-700 rounded p-2 text-xs">
                  <div className="font-medium text-amber-100 mb-1">{phase.name}</div>
                  <div className="flex justify-between">
                    <span className="text-red-400">
                      Attacker: -{formatNumber(phase.attackerLosses)}
                    </span>
                    <span className="text-red-400">
                      Defender: -{formatNumber(phase.defenderLosses)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
