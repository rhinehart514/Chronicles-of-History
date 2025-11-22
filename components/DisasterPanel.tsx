import React, { useState } from 'react';
import {
  Disaster,
  ActiveDisaster,
  DISASTERS,
  getDisaster,
  getDisasterSeverity,
  getSeverityColor
} from '../data/disasterSystem';

interface DisasterPanelProps {
  activeDisasters: ActiveDisaster[];
  potentialDisasters: ActiveDisaster[];
  onClose: () => void;
}

type TabType = 'active' | 'potential' | 'all';

export default function DisasterPanel({
  activeDisasters,
  potentialDisasters,
  onClose
}: DisasterPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>(
    activeDisasters.length > 0 ? 'active' : 'potential'
  );
  const [selectedDisaster, setSelectedDisaster] = useState<Disaster | null>(null);

  const tabs: { id: TabType; label: string; count: number }[] = [
    { id: 'active', label: 'Active', count: activeDisasters.filter(d => d.isActive).length },
    { id: 'potential', label: 'Brewing', count: potentialDisasters.filter(d => d.progress > 0).length },
    { id: 'all', label: 'All Disasters', count: DISASTERS.length }
  ];

  const renderActive = () => {
    const active = activeDisasters.filter(d => d.isActive);

    return (
      <div className="space-y-3">
        {active.length === 0 ? (
          <div className="text-center py-8 text-stone-400">
            <div className="text-3xl mb-2">✨</div>
            <div>No active disasters</div>
          </div>
        ) : (
          active.map(ad => {
            const disaster = getDisaster(ad.disasterId);
            if (!disaster) return null;

            return (
              <div
                key={ad.disasterId}
                className="bg-red-900/30 border border-red-700 rounded-lg p-4"
                onClick={() => setSelectedDisaster(disaster)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{disaster.icon}</span>
                    <div>
                      <h3 className="font-semibold text-red-100">{disaster.name}</h3>
                      <div className="text-xs text-red-300">
                        Active for {ad.ticksActive} months
                      </div>
                    </div>
                  </div>
                  <span className="text-xs bg-red-700 text-white px-2 py-0.5 rounded">
                    ACTIVE
                  </span>
                </div>

                <p className="text-xs text-stone-300 mb-3">{disaster.description}</p>

                <div className="mb-3">
                  <div className="text-xs text-red-300 mb-1">Active Effects:</div>
                  <div className="flex flex-wrap gap-1">
                    {disaster.effects.map((effect, i) => (
                      <span
                        key={i}
                        className="text-xs bg-red-900/50 text-red-300 px-2 py-0.5 rounded"
                      >
                        {effect.value > 0 ? '+' : ''}{effect.value} {effect.type.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-stone-400 mb-1">End Conditions:</div>
                  <div className="text-xs text-stone-300">
                    {disaster.endConditions.map(c =>
                      `${c.type.replace(/_/g, ' ')} ${c.operator || '='} ${c.value}`
                    ).join(' OR ')}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  };

  const renderPotential = () => {
    const brewing = potentialDisasters.filter(d => d.progress > 0 && !d.isActive);

    return (
      <div className="space-y-2">
        {brewing.length === 0 ? (
          <div className="text-center py-8 text-stone-400">
            <div className="text-3xl mb-2">😊</div>
            <div>No disasters brewing</div>
          </div>
        ) : (
          brewing.map(pd => {
            const disaster = getDisaster(pd.disasterId);
            if (!disaster) return null;

            const severity = getDisasterSeverity(pd.progress);
            const color = getSeverityColor(pd.progress);

            return (
              <div
                key={pd.disasterId}
                className="bg-stone-700 rounded-lg p-3 cursor-pointer hover:bg-stone-600"
                onClick={() => setSelectedDisaster(disaster)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{disaster.icon}</span>
                    <span className="font-medium text-amber-100">{disaster.name}</span>
                  </div>
                  <span className={`text-sm font-bold ${color}`}>
                    {severity}
                  </span>
                </div>

                <div className="mb-2">
                  <div className="flex justify-between text-xs text-stone-400 mb-1">
                    <span>Progress</span>
                    <span>{pd.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        pd.progress >= 75 ? 'bg-red-500' :
                        pd.progress >= 50 ? 'bg-orange-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${pd.progress}%` }}
                    />
                  </div>
                </div>

                <div className="text-xs text-stone-400">
                  Rate: +{disaster.progressRate}% per month
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  };

  const renderAll = () => (
    <div className="space-y-2">
      {DISASTERS.map(disaster => {
        const active = activeDisasters.find(d => d.disasterId === disaster.id);
        const potential = potentialDisasters.find(d => d.disasterId === disaster.id);
        const progress = active?.progress || potential?.progress || 0;

        return (
          <div
            key={disaster.id}
            className={`rounded-lg p-3 cursor-pointer transition-colors ${
              active?.isActive
                ? 'bg-red-900/30 border border-red-700'
                : 'bg-stone-700 hover:bg-stone-600'
            }`}
            onClick={() => setSelectedDisaster(disaster)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{disaster.icon}</span>
                <span className="font-medium text-amber-100">{disaster.name}</span>
              </div>
              {active?.isActive ? (
                <span className="text-xs bg-red-700 text-white px-2 py-0.5 rounded">
                  ACTIVE
                </span>
              ) : progress > 0 ? (
                <span className={`text-xs ${getSeverityColor(progress)}`}>
                  {progress}%
                </span>
              ) : (
                <span className="text-xs text-stone-500">Dormant</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderDetails = () => {
    if (!selectedDisaster) return null;

    const active = activeDisasters.find(d => d.disasterId === selectedDisaster.id);

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-3xl">{selectedDisaster.icon}</span>
          <div>
            <h3 className="font-bold text-amber-100">{selectedDisaster.name}</h3>
            {active?.isActive && (
              <span className="text-xs bg-red-700 text-white px-2 py-0.5 rounded">
                ACTIVE
              </span>
            )}
          </div>
        </div>

        <p className="text-sm text-stone-300">{selectedDisaster.description}</p>

        <div>
          <h4 className="text-xs text-stone-400 mb-2">Trigger Conditions</h4>
          <div className="space-y-1">
            {selectedDisaster.triggerConditions.map((cond, i) => (
              <div key={i} className="text-xs bg-stone-800 px-2 py-1 rounded">
                {cond.type.replace(/_/g, ' ')} {cond.operator || '='} {String(cond.value)}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs text-stone-400 mb-2">Effects While Active</h4>
          <div className="space-y-1">
            {selectedDisaster.effects.map((effect, i) => (
              <div
                key={i}
                className="text-xs bg-red-900/30 text-red-300 px-2 py-1 rounded"
              >
                {effect.value > 0 ? '+' : ''}{effect.value} {effect.type.replace(/_/g, ' ')}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs text-stone-400 mb-2">End Conditions</h4>
          <div className="space-y-1">
            {selectedDisaster.endConditions.map((cond, i) => (
              <div key={i} className="text-xs bg-green-900/30 text-green-300 px-2 py-1 rounded">
                {cond.type.replace(/_/g, ' ')} {cond.operator || '='} {String(cond.value)}
              </div>
            ))}
          </div>
        </div>

        {selectedDisaster.rewards && selectedDisaster.rewards.length > 0 && (
          <div>
            <h4 className="text-xs text-stone-400 mb-2">Rewards for Ending</h4>
            <div className="space-y-1">
              {selectedDisaster.rewards.map((reward, i) => (
                <div key={i} className="text-xs bg-amber-900/30 text-amber-300 px-2 py-1 rounded">
                  {reward.value > 0 ? '+' : ''}{reward.value} {reward.type} - {reward.description}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-stone-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-stone-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-amber-100">⚠️ Disasters</h2>
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
                {tab.count > 0 && (
                  <span className={`ml-1 px-1.5 py-0.5 text-xs rounded ${
                    tab.id === 'active' && tab.count > 0
                      ? 'bg-red-600'
                      : 'bg-stone-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex">
          <div className="flex-1 p-4 overflow-y-auto">
            {activeTab === 'active' && renderActive()}
            {activeTab === 'potential' && renderPotential()}
            {activeTab === 'all' && renderAll()}
          </div>

          {selectedDisaster && (
            <div className="w-72 border-l border-stone-700 p-4 overflow-y-auto">
              {renderDetails()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
