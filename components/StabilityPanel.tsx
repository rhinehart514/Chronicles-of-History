import React from 'react';

interface StabilityPanelProps {
  currentStability: number;
  adminPower: number;
  globalUnrest: number;
  warExhaustion: number;
  overextension: number;
  legitimacy: number;
  onIncreaseStability?: () => void;
  onClose: () => void;
}

export default function StabilityPanel({
  currentStability,
  adminPower,
  globalUnrest,
  warExhaustion,
  overextension,
  legitimacy,
  onIncreaseStability,
  onClose
}: StabilityPanelProps) {
  const stabilityLevels = [
    { level: 3, name: 'Golden Era', color: 'text-yellow-400' },
    { level: 2, name: 'Prosperous', color: 'text-green-400' },
    { level: 1, name: 'Stable', color: 'text-green-300' },
    { level: 0, name: 'Neutral', color: 'text-stone-400' },
    { level: -1, name: 'Unstable', color: 'text-orange-400' },
    { level: -2, name: 'Severe Instability', color: 'text-red-400' },
    { level: -3, name: 'Total Collapse', color: 'text-red-600' }
  ];

  const currentLevelData = stabilityLevels.find(l => l.level === currentStability);

  const stabilityCost = Math.max(0, 100 + (currentStability * 50));
  const canIncrease = currentStability < 3 && adminPower >= stabilityCost;

  const getStabilityEffects = (level: number) => {
    if (level >= 3) return ['+15% Tax', '+1.5% Missionary', '-2 Unrest'];
    if (level === 2) return ['+10% Tax', '+1% Missionary', '-1 Unrest'];
    if (level === 1) return ['+5% Tax', '+0.5% Missionary'];
    if (level === 0) return ['No effects'];
    if (level === -1) return ['-10% Tax', '-10% Manpower', '+2 Unrest'];
    if (level === -2) return ['-20% Tax', '-20% Manpower', '+4 Unrest'];
    return ['-33% Tax', '-33% Manpower', '+6 Unrest'];
  };

  const unrestSources = [
    { name: 'Base Unrest', value: globalUnrest, icon: '📊' },
    { name: 'War Exhaustion', value: warExhaustion * 1, icon: '⚔️' },
    { name: 'Overextension', value: overextension > 100 ? (overextension - 100) * 0.05 : 0, icon: '🗺️' },
    { name: 'Low Legitimacy', value: legitimacy < 50 ? (50 - legitimacy) * 0.04 : 0, icon: '👑' }
  ];

  const totalUnrest = unrestSources.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-stone-800 rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-stone-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-amber-100">Stability & Unrest</h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200"
          >
            ✕
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {/* Current Stability */}
          <div className="bg-stone-700 rounded-lg p-4">
            <div className="text-center mb-3">
              <div className={`text-4xl font-bold ${currentLevelData?.color || 'text-stone-400'}`}>
                {currentStability > 0 ? '+' : ''}{currentStability}
              </div>
              <div className="text-sm text-stone-400">{currentLevelData?.name}</div>
            </div>

            {/* Stability Bar */}
            <div className="flex justify-center gap-1 mb-3">
              {stabilityLevels.map(level => (
                <div
                  key={level.level}
                  className={`w-6 h-6 rounded flex items-center justify-center text-xs ${
                    level.level === currentStability
                      ? 'bg-amber-600 text-white'
                      : level.level <= currentStability
                      ? 'bg-stone-600 text-stone-300'
                      : 'bg-stone-800 text-stone-500'
                  }`}
                >
                  {level.level}
                </div>
              ))}
            </div>

            {/* Effects */}
            <div className="text-xs text-stone-400 space-y-1">
              {getStabilityEffects(currentStability).map((effect, i) => (
                <div key={i} className="flex items-center gap-1">
                  <span className={currentStability >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {currentStability >= 0 ? '✓' : '✗'}
                  </span>
                  {effect}
                </div>
              ))}
            </div>
          </div>

          {/* Increase Stability */}
          <div className="bg-stone-700 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Increase Stability</span>
              <span className="text-xs text-stone-400">
                Cost: {stabilityCost} Admin
              </span>
            </div>
            <button
              onClick={onIncreaseStability}
              disabled={!canIncrease}
              className={`w-full py-2 rounded text-sm font-medium ${
                canIncrease
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-stone-600 text-stone-400 cursor-not-allowed'
              }`}
            >
              {currentStability >= 3
                ? 'Maximum Stability'
                : adminPower < stabilityCost
                ? `Need ${stabilityCost - adminPower} more Admin`
                : 'Increase to ' + (currentStability + 1)}
            </button>
            <div className="text-xs text-stone-500 mt-1 text-center">
              Current Admin Power: {adminPower}
            </div>
          </div>

          {/* Unrest Sources */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-stone-400">Unrest Sources</h3>
              <span className={`text-sm font-bold ${
                totalUnrest > 5 ? 'text-red-400' : totalUnrest > 2 ? 'text-orange-400' : 'text-green-400'
              }`}>
                Total: {totalUnrest.toFixed(1)}
              </span>
            </div>
            <div className="space-y-2">
              {unrestSources.filter(s => s.value > 0).map((source, i) => (
                <div key={i} className="bg-stone-700 rounded p-2 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span>{source.icon}</span>
                    <span className="text-sm">{source.name}</span>
                  </div>
                  <span className="text-red-400 text-sm">+{source.value.toFixed(1)}</span>
                </div>
              ))}
              {unrestSources.every(s => s.value === 0) && (
                <div className="text-sm text-stone-500 text-center py-2">
                  No significant unrest sources
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-stone-700 rounded p-2 text-center">
              <div className="text-lg font-bold text-amber-400">{warExhaustion.toFixed(1)}</div>
              <div className="text-xs text-stone-400">War Exhaustion</div>
            </div>
            <div className="bg-stone-700 rounded p-2 text-center">
              <div className={`text-lg font-bold ${overextension > 100 ? 'text-red-400' : 'text-green-400'}`}>
                {overextension}%
              </div>
              <div className="text-xs text-stone-400">Overextension</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
