import React from 'react';

interface ManpowerSource {
  name: string;
  value: number;
  icon: string;
}

interface ManpowerOverviewProps {
  current: number;
  maximum: number;
  monthlyRecovery: number;
  professionalism: number;
  drillDecay: number;
  sources: ManpowerSource[];
  onSlackenRecruitment?: () => void;
  onRaiseWarTaxes?: () => void;
  onClose: () => void;
}

export default function ManpowerOverview({
  current,
  maximum,
  monthlyRecovery,
  professionalism,
  drillDecay,
  sources,
  onSlackenRecruitment,
  onRaiseWarTaxes,
  onClose
}: ManpowerOverviewProps) {
  const percentage = (current / maximum) * 100;

  const getStatusColor = () => {
    if (percentage >= 60) return 'text-green-400';
    if (percentage >= 30) return 'text-yellow-400';
    if (percentage >= 10) return 'text-orange-400';
    return 'text-red-400';
  };

  const getBarColor = () => {
    if (percentage >= 60) return 'bg-green-500';
    if (percentage >= 30) return 'bg-yellow-500';
    if (percentage >= 10) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getStatus = () => {
    if (percentage >= 90) return 'Full';
    if (percentage >= 60) return 'Good';
    if (percentage >= 30) return 'Low';
    if (percentage >= 10) return 'Critical';
    return 'Depleted';
  };

  const slackenGain = Math.floor(maximum * 0.02);
  const yearsToRecover = monthlyRecovery > 0
    ? ((maximum - current) / monthlyRecovery / 12).toFixed(1)
    : 'Never';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-stone-800 rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-stone-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-amber-100">Manpower</h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200"
          >
            ✕
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {/* Main Display */}
          <div className="bg-stone-700 rounded-lg p-4 text-center">
            <div className={`text-4xl font-bold ${getStatusColor()}`}>
              {(current / 1000).toFixed(1)}K
            </div>
            <div className="text-sm text-stone-400">
              / {(maximum / 1000).toFixed(1)}K maximum
            </div>
            <div className="mt-2 text-sm">{getStatus()}</div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Pool Status</span>
              <span>{percentage.toFixed(1)}%</span>
            </div>
            <div className="h-3 bg-stone-900 rounded-full overflow-hidden">
              <div
                className={`h-full ${getBarColor()} transition-all`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-stone-700 rounded p-3">
              <div className="text-lg font-bold text-green-400">
                +{monthlyRecovery.toLocaleString()}
              </div>
              <div className="text-xs text-stone-400">Monthly Recovery</div>
            </div>
            <div className="bg-stone-700 rounded p-3">
              <div className="text-lg font-bold text-amber-400">
                {yearsToRecover} yr
              </div>
              <div className="text-xs text-stone-400">To Full Recovery</div>
            </div>
            <div className="bg-stone-700 rounded p-3">
              <div className="text-lg font-bold text-blue-400">
                {professionalism}%
              </div>
              <div className="text-xs text-stone-400">Professionalism</div>
            </div>
            <div className="bg-stone-700 rounded p-3">
              <div className="text-lg font-bold text-red-400">
                -{drillDecay.toFixed(2)}
              </div>
              <div className="text-xs text-stone-400">Monthly Drill Decay</div>
            </div>
          </div>

          {/* Sources */}
          <div>
            <h3 className="text-sm font-medium text-stone-400 mb-2">
              Manpower Sources
            </h3>
            <div className="space-y-1">
              {sources.map((source, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-1">
                    <span>{source.icon}</span>
                    {source.name}
                  </span>
                  <span className={source.value >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {source.value >= 0 ? '+' : ''}{source.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button
              onClick={onSlackenRecruitment}
              className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded text-sm"
            >
              Slacken Recruitment Standards (+{slackenGain.toLocaleString()}, -5% Prof)
            </button>
            <button
              onClick={onRaiseWarTaxes}
              className="w-full py-2 bg-stone-600 hover:bg-stone-500 rounded text-sm"
            >
              Raise War Taxes (+30% Recovery, +2 War Exhaustion)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
