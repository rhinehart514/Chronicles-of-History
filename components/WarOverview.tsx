import React, { useState } from 'react';
import {
  War,
  WarGoal,
  Battle,
  WAR_GOALS,
  WAR_EXHAUSTION_EFFECTS,
  getWarExhaustionEffects,
  getWarStatus
} from '../data/warSystem';

interface WarOverviewProps {
  wars: War[];
  playerNationId: string;
  onClose: () => void;
  onSelectWar?: (warId: string) => void;
  onPeaceDeal?: (warId: string) => void;
}

type TabType = 'active' | 'history' | 'exhaustion';

export default function WarOverview({
  wars,
  playerNationId,
  onClose,
  onSelectWar,
  onPeaceDeal
}: WarOverviewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [selectedWar, setSelectedWar] = useState<War | null>(
    wars.length > 0 ? wars[0] : null
  );

  const activeWars = wars.filter(w => !w.warScore || Math.abs(w.warScore) < 100);

  const tabs: { id: TabType; label: string }[] = [
    { id: 'active', label: `Active Wars (${activeWars.length})` },
    { id: 'exhaustion', label: 'War Exhaustion' }
  ];

  const isAttacker = (war: War) =>
    war.attackers.some(p => p.nationId === playerNationId);

  const getPlayerParticipant = (war: War) => {
    return war.attackers.find(p => p.nationId === playerNationId) ||
           war.defenders.find(p => p.nationId === playerNationId);
  };

  const getScoreColor = (score: number, isAttacker: boolean) => {
    const playerScore = isAttacker ? score : -score;
    if (playerScore >= 50) return 'text-green-400';
    if (playerScore >= 0) return 'text-amber-400';
    return 'text-red-400';
  };

  const renderActiveWars = () => (
    <div className="space-y-3">
      {activeWars.length === 0 ? (
        <div className="text-center py-8 text-stone-400">
          <div className="text-3xl mb-2">☮️</div>
          <div>Your nation is at peace</div>
        </div>
      ) : (
        activeWars.map(war => {
          const attacker = isAttacker(war);
          const participant = getPlayerParticipant(war);

          return (
            <div
              key={war.id}
              className={`bg-stone-700 rounded-lg p-4 cursor-pointer transition-colors ${
                selectedWar?.id === war.id ? 'ring-2 ring-amber-500' : 'hover:bg-stone-600'
              }`}
              onClick={() => setSelectedWar(war)}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-amber-100">{war.name}</h3>
                  <div className="text-xs text-stone-400">
                    Started: {war.startDate} • {attacker ? 'Attacking' : 'Defending'}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span>{war.warGoal.icon}</span>
                  <span className="text-sm">{war.warGoal.name}</span>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-xs text-stone-400 mb-1">
                  <span>War Score</span>
                  <span className={getScoreColor(war.warScore, attacker)}>
                    {war.warScore > 0 ? '+' : ''}{war.warScore}%
                  </span>
                </div>
                <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      (attacker && war.warScore > 0) || (!attacker && war.warScore < 0)
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }`}
                    style={{
                      width: `${Math.abs(war.warScore)}%`,
                      marginLeft: war.warScore < 0 ? 'auto' : 0
                    }}
                  />
                </div>
                <div className="text-xs text-center mt-1 text-stone-300">
                  {getWarStatus(attacker ? war.warScore : -war.warScore)}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-stone-800 rounded p-2">
                  <div className="text-stone-400">Battles</div>
                  <div className="font-medium">{war.battles.length}</div>
                </div>
                <div className="bg-stone-800 rounded p-2">
                  <div className="text-stone-400">Casualties</div>
                  <div className="font-medium text-red-400">
                    {participant?.casualties?.toLocaleString() || 0}
                  </div>
                </div>
                <div className="bg-stone-800 rounded p-2">
                  <div className="text-stone-400">Exhaustion</div>
                  <div className="font-medium text-amber-400">
                    {participant?.warExhaustion?.toFixed(1) || 0}
                  </div>
                </div>
              </div>

              {onPeaceDeal && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPeaceDeal(war.id);
                  }}
                  className="w-full mt-3 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm rounded"
                >
                  Sue for Peace
                </button>
              )}
            </div>
          );
        })
      )}
    </div>
  );

  const renderExhaustion = () => {
    const totalExhaustion = activeWars.reduce((sum, war) => {
      const p = getPlayerParticipant(war);
      return sum + (p?.warExhaustion || 0);
    }, 0);

    const effects = getWarExhaustionEffects(totalExhaustion);

    return (
      <div className="space-y-4">
        <div className="bg-stone-700 rounded-lg p-4">
          <div className="text-sm text-stone-400 mb-2">Total War Exhaustion</div>
          <div className={`text-3xl font-bold ${
            totalExhaustion >= 15 ? 'text-red-400' :
            totalExhaustion >= 10 ? 'text-amber-400' : 'text-green-400'
          }`}>
            {totalExhaustion.toFixed(1)}
          </div>
          <div className="h-2 bg-stone-800 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full ${
                totalExhaustion >= 15 ? 'bg-red-500' :
                totalExhaustion >= 10 ? 'bg-amber-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(100, totalExhaustion * 5)}%` }}
            />
          </div>
        </div>

        {effects.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-stone-300 mb-2">Active Effects</h4>
            <div className="space-y-2">
              {effects.map((effect, i) => (
                <div
                  key={i}
                  className="bg-red-900/30 border border-red-700 rounded p-2 flex justify-between"
                >
                  <span className="text-sm text-stone-300">
                    {effect.type.replace(/_/g, ' ')}
                  </span>
                  <span className="text-sm text-red-400">
                    {typeof effect.value === 'number'
                      ? (effect.value > 0 ? '+' : '') + effect.value + '%'
                      : effect.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="text-sm font-medium text-stone-300 mb-2">Exhaustion Thresholds</h4>
          <div className="space-y-2">
            {WAR_EXHAUSTION_EFFECTS.slice(1).map(level => (
              <div
                key={level.threshold}
                className={`rounded p-2 text-xs ${
                  totalExhaustion >= level.threshold
                    ? 'bg-red-900/30 border border-red-700'
                    : 'bg-stone-700'
                }`}
              >
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{level.threshold}+ Exhaustion</span>
                  {totalExhaustion >= level.threshold && (
                    <span className="text-red-400">Active</span>
                  )}
                </div>
                <div className="text-stone-400">
                  {level.effects.map(e =>
                    `${e.type.replace(/_/g, ' ')}: ${e.value}`
                  ).join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-stone-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-stone-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-amber-100">⚔️ War Overview</h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200"
          >
            ✕
          </button>
        </div>

        <div className="border-b border-stone-700">
          <div className="flex">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-amber-400 border-b-2 border-amber-400'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          {activeTab === 'active' && renderActiveWars()}
          {activeTab === 'exhaustion' && renderExhaustion()}
        </div>

        {selectedWar && activeTab === 'active' && (
          <div className="p-3 border-t border-stone-700 bg-stone-700/50">
            <div className="text-xs text-stone-400">
              Recent Battle: {selectedWar.battles[selectedWar.battles.length - 1]?.location || 'None'} •{' '}
              Participants: {selectedWar.attackers.length + selectedWar.defenders.length} nations
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
