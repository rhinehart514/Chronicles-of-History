import React from 'react';

interface NationStats {
  name: string;
  flag: string;
  government: string;
  ruler: {
    name: string;
    title: string;
    stats: { admin: number; diplo: number; mil: number };
  };
  heir?: {
    name: string;
    stats: { admin: number; diplo: number; mil: number };
    claimStrength: number;
  };
  provinces: number;
  development: number;
  army: number;
  navy: number;
  manpower: { current: number; max: number };
  treasury: number;
  income: number;
  inflation: number;
  corruption: number;
  overextension: number;
  prestige: number;
  legitimacy: number;
  stability: number;
  warExhaustion: number;
  powerProjection: number;
  absolutism: number;
  allies: string[];
  rivals: string[];
  subjects: string[];
}

interface NationOverviewProps {
  nation: NationStats;
  onClose: () => void;
  onViewRuler?: () => void;
  onViewEconomy?: () => void;
  onViewMilitary?: () => void;
  onViewDiplomacy?: () => void;
}

export default function NationOverview({
  nation,
  onClose,
  onViewRuler,
  onViewEconomy,
  onViewMilitary,
  onViewDiplomacy
}: NationOverviewProps) {
  const renderStatBar = (value: number, max: number, color: string) => (
    <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden">
      <div
        className={`h-full ${color}`}
        style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
      />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-stone-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b border-stone-700 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{nation.flag}</span>
            <div>
              <h2 className="text-xl font-bold text-amber-100">{nation.name}</h2>
              <div className="text-sm text-stone-400">{nation.government}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Ruler */}
          <div
            className={`bg-stone-700 rounded-lg p-4 ${onViewRuler ? 'cursor-pointer hover:bg-stone-600' : ''}`}
            onClick={onViewRuler}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-xs text-stone-400">{nation.ruler.title}</div>
                <div className="font-semibold text-amber-100">{nation.ruler.name}</div>
              </div>
              <div className="flex gap-2">
                <div className="text-center">
                  <div className="text-lg font-bold text-amber-400">{nation.ruler.stats.admin}</div>
                  <div className="text-xs text-stone-500">ADM</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-400">{nation.ruler.stats.diplo}</div>
                  <div className="text-xs text-stone-500">DIP</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-red-400">{nation.ruler.stats.mil}</div>
                  <div className="text-xs text-stone-500">MIL</div>
                </div>
              </div>
            </div>

            {nation.heir && (
              <div className="pt-3 border-t border-stone-600">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-xs text-stone-400">Heir</div>
                    <div className="text-sm text-amber-100">{nation.heir.name}</div>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <span className="text-amber-400">{nation.heir.stats.admin}</span>
                    <span className="text-blue-400">{nation.heir.stats.diplo}</span>
                    <span className="text-red-400">{nation.heir.stats.mil}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-stone-700 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-amber-400">{nation.provinces}</div>
              <div className="text-xs text-stone-400">Provinces</div>
            </div>
            <div className="bg-stone-700 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-green-400">{nation.development}</div>
              <div className="text-xs text-stone-400">Development</div>
            </div>
            <div className="bg-stone-700 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-red-400">{nation.army.toLocaleString()}</div>
              <div className="text-xs text-stone-400">Army</div>
            </div>
            <div className="bg-stone-700 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-blue-400">{nation.navy}</div>
              <div className="text-xs text-stone-400">Navy</div>
            </div>
          </div>

          {/* Economy */}
          <div
            className={`bg-stone-700 rounded-lg p-4 ${onViewEconomy ? 'cursor-pointer hover:bg-stone-600' : ''}`}
            onClick={onViewEconomy}
          >
            <div className="text-xs text-stone-400 mb-2">Economy</div>
            <div className="grid grid-cols-4 gap-3 text-sm">
              <div>
                <span className="text-stone-400">Treasury:</span>
                <span className="ml-1 text-amber-400">{nation.treasury.toFixed(0)}</span>
              </div>
              <div>
                <span className="text-stone-400">Income:</span>
                <span className={`ml-1 ${nation.income >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {nation.income >= 0 ? '+' : ''}{nation.income.toFixed(1)}
                </span>
              </div>
              <div>
                <span className="text-stone-400">Inflation:</span>
                <span className={`ml-1 ${nation.inflation > 5 ? 'text-red-400' : 'text-stone-200'}`}>
                  {nation.inflation.toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-stone-400">Corruption:</span>
                <span className={`ml-1 ${nation.corruption > 2 ? 'text-red-400' : 'text-stone-200'}`}>
                  {nation.corruption.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Nation Health */}
          <div className="bg-stone-700 rounded-lg p-4 space-y-3">
            <div className="text-xs text-stone-400 mb-2">Nation Health</div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Prestige</span>
                <span className={nation.prestige >= 0 ? 'text-amber-400' : 'text-red-400'}>
                  {nation.prestige.toFixed(0)}
                </span>
              </div>
              {renderStatBar(nation.prestige + 100, 200, 'bg-amber-500')}
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Legitimacy</span>
                <span className={nation.legitimacy >= 50 ? 'text-purple-400' : 'text-red-400'}>
                  {nation.legitimacy.toFixed(0)}
                </span>
              </div>
              {renderStatBar(nation.legitimacy, 100, 'bg-purple-500')}
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Stability</span>
                <span className={nation.stability >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {nation.stability >= 0 ? '+' : ''}{nation.stability}
                </span>
              </div>
              {renderStatBar(nation.stability + 3, 6, 'bg-green-500')}
            </div>

            {nation.warExhaustion > 0 && (
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>War Exhaustion</span>
                  <span className="text-red-400">{nation.warExhaustion.toFixed(1)}</span>
                </div>
                {renderStatBar(nation.warExhaustion, 20, 'bg-red-500')}
              </div>
            )}

            {nation.overextension > 0 && (
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Overextension</span>
                  <span className={nation.overextension > 100 ? 'text-red-400' : 'text-amber-400'}>
                    {nation.overextension.toFixed(0)}%
                  </span>
                </div>
                {renderStatBar(nation.overextension, 100, nation.overextension > 100 ? 'bg-red-500' : 'bg-amber-500')}
              </div>
            )}
          </div>

          {/* Diplomacy */}
          <div
            className={`bg-stone-700 rounded-lg p-4 ${onViewDiplomacy ? 'cursor-pointer hover:bg-stone-600' : ''}`}
            onClick={onViewDiplomacy}
          >
            <div className="text-xs text-stone-400 mb-2">Diplomacy</div>
            <div className="space-y-2">
              {nation.allies.length > 0 && (
                <div>
                  <span className="text-xs text-green-400">Allies:</span>
                  <span className="text-sm text-stone-200 ml-2">{nation.allies.join(', ')}</span>
                </div>
              )}
              {nation.rivals.length > 0 && (
                <div>
                  <span className="text-xs text-red-400">Rivals:</span>
                  <span className="text-sm text-stone-200 ml-2">{nation.rivals.join(', ')}</span>
                </div>
              )}
              {nation.subjects.length > 0 && (
                <div>
                  <span className="text-xs text-blue-400">Subjects:</span>
                  <span className="text-sm text-stone-200 ml-2">{nation.subjects.join(', ')}</span>
                </div>
              )}
              {nation.allies.length === 0 && nation.rivals.length === 0 && nation.subjects.length === 0 && (
                <div className="text-sm text-stone-400">No diplomatic relations</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
