import React from 'react';

interface Army {
  name: string;
  flag: string;
  infantry: number;
  cavalry: number;
  artillery: number;
  morale: number;
  maxMorale: number;
  leader?: string;
  leaderBonus?: { fire: number; shock: number; maneuver: number };
}

interface BattlePhase {
  phase: number;
  type: 'fire' | 'shock';
  attackerDamage: number;
  defenderDamage: number;
}

interface CombatResolverProps {
  attacker: Army;
  defender: Army;
  terrain: string;
  currentPhase: number;
  phases: BattlePhase[];
  attackerCasualties: number;
  defenderCasualties: number;
  isComplete: boolean;
  winner?: string;
  onRetreat?: () => void;
  onClose: () => void;
}

export default function CombatResolver({
  attacker,
  defender,
  terrain,
  currentPhase,
  phases,
  attackerCasualties,
  defenderCasualties,
  isComplete,
  winner,
  onRetreat,
  onClose
}: CombatResolverProps) {
  const getArmyStrength = (army: Army) =>
    army.infantry + army.cavalry + army.artillery;

  const getMoralePercent = (current: number, max: number) =>
    Math.max(0, (current / max) * 100);

  const getMoraleColor = (percent: number) => {
    if (percent >= 60) return 'bg-green-500';
    if (percent >= 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const renderArmy = (army: Army, isAttacker: boolean, casualties: number) => {
    const moralePercent = getMoralePercent(army.morale, army.maxMorale);

    return (
      <div className={`bg-stone-700 rounded-lg p-3 ${isAttacker ? '' : ''}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{army.flag}</span>
            <div>
              <div className="font-medium text-sm">{army.name}</div>
              {army.leader && (
                <div className="text-xs text-amber-400">{army.leader}</div>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">{getArmyStrength(army)}K</div>
            <div className="text-xs text-stone-400">
              {isAttacker ? 'Attacker' : 'Defender'}
            </div>
          </div>
        </div>

        {/* Morale Bar */}
        <div className="mb-2">
          <div className="flex justify-between text-xs mb-1">
            <span>Morale</span>
            <span>{army.morale.toFixed(2)} / {army.maxMorale.toFixed(2)}</span>
          </div>
          <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
            <div
              className={`h-full ${getMoraleColor(moralePercent)} transition-all`}
              style={{ width: `${moralePercent}%` }}
            />
          </div>
        </div>

        {/* Unit Composition */}
        <div className="grid grid-cols-3 gap-1 text-xs mb-2">
          <div className="bg-stone-600 rounded px-2 py-1 text-center">
            <div className="font-bold">{army.infantry}K</div>
            <div className="text-stone-400">Inf</div>
          </div>
          <div className="bg-stone-600 rounded px-2 py-1 text-center">
            <div className="font-bold">{army.cavalry}K</div>
            <div className="text-stone-400">Cav</div>
          </div>
          <div className="bg-stone-600 rounded px-2 py-1 text-center">
            <div className="font-bold">{army.artillery}K</div>
            <div className="text-stone-400">Art</div>
          </div>
        </div>

        {/* Casualties */}
        <div className="text-center">
          <span className="text-red-400 text-sm font-bold">
            -{casualties.toLocaleString()} casualties
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-stone-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 border-b border-stone-700">
          <div className="text-center">
            <h2 className="text-xl font-bold text-amber-100">
              {isComplete ? 'Battle Complete' : 'Battle in Progress'}
            </h2>
            <div className="text-sm text-stone-400">
              Terrain: {terrain.charAt(0).toUpperCase() + terrain.slice(1)}
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Armies */}
          <div className="grid grid-cols-2 gap-3">
            {renderArmy(attacker, true, attackerCasualties)}
            {renderArmy(defender, false, defenderCasualties)}
          </div>

          {/* Phase Display */}
          {!isComplete && (
            <div className="bg-stone-900 rounded-lg p-3">
              <div className="text-center mb-2">
                <span className="text-sm font-medium">
                  Phase {currentPhase}: {phases[currentPhase - 1]?.type === 'fire' ? '🔥 Fire' : '⚡ Shock'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-center">
                  <div className="text-red-400">
                    -{phases[currentPhase - 1]?.attackerDamage || 0}
                  </div>
                  <div className="text-stone-400">Attacker Damage</div>
                </div>
                <div className="text-center">
                  <div className="text-red-400">
                    -{phases[currentPhase - 1]?.defenderDamage || 0}
                  </div>
                  <div className="text-stone-400">Defender Damage</div>
                </div>
              </div>
            </div>
          )}

          {/* Battle Result */}
          {isComplete && (
            <div className={`rounded-lg p-4 text-center ${
              winner === attacker.name ? 'bg-green-900/50' : 'bg-red-900/50'
            }`}>
              <div className="text-2xl font-bold mb-1">
                {winner === attacker.name ? '🏆 Victory!' : '💀 Defeat'}
              </div>
              <div className="text-sm text-stone-300">
                {winner} has won the battle
              </div>
            </div>
          )}

          {/* Phase History */}
          {phases.length > 0 && (
            <div>
              <div className="text-xs text-stone-400 mb-2">Battle Phases</div>
              <div className="flex gap-1 flex-wrap">
                {phases.map((phase, i) => (
                  <div
                    key={i}
                    className={`text-xs px-2 py-1 rounded ${
                      i === currentPhase - 1 ? 'bg-amber-600' : 'bg-stone-600'
                    }`}
                  >
                    {phase.type === 'fire' ? '🔥' : '⚡'}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-3 border-t border-stone-700 flex gap-2">
          {!isComplete && onRetreat && (
            <button
              onClick={onRetreat}
              className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
            >
              Retreat
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-stone-600 hover:bg-stone-500 rounded"
          >
            {isComplete ? 'Close' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
