import React, { useState } from 'react';

interface SpyNetwork {
  targetId: string;
  targetName: string;
  targetFlag: string;
  networkStrength: number;
  isRival: boolean;
  activeMissions: number;
}

interface SpyAction {
  id: string;
  name: string;
  icon: string;
  category: string;
  networkCost: number;
  duration: number;
  successChance: number;
  description: string;
}

interface SpyNetworkPanelProps {
  networks: SpyNetwork[];
  availableActions: SpyAction[];
  diplomatCount: number;
  maxDiplomats: number;
  spyOffense: number;
  onBuildNetwork?: (targetId: string) => void;
  onPerformAction?: (targetId: string, actionId: string) => void;
  onClose: () => void;
}

export default function SpyNetworkPanel({
  networks,
  availableActions,
  diplomatCount,
  maxDiplomats,
  spyOffense,
  onBuildNetwork,
  onPerformAction,
  onClose
}: SpyNetworkPanelProps) {
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'networks' | 'actions'>('networks');

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      intelligence: 'text-blue-400',
      sabotage: 'text-red-400',
      diplomatic: 'text-yellow-400',
      military: 'text-orange-400'
    };
    return colors[category] || 'text-stone-400';
  };

  const selectedNetwork = networks.find(n => n.targetId === selectedTarget);

  const renderNetworks = () => (
    <div className="space-y-3">
      {networks.length === 0 ? (
        <div className="text-center py-8 text-stone-400">
          <div className="text-3xl mb-2">🕵️</div>
          <div>No active spy networks</div>
          <div className="text-xs mt-1">Send a diplomat to build networks</div>
        </div>
      ) : (
        networks.map(network => (
          <div
            key={network.targetId}
            onClick={() => setSelectedTarget(network.targetId)}
            className={`bg-stone-700 rounded-lg p-3 cursor-pointer transition-colors ${
              selectedTarget === network.targetId ? 'ring-2 ring-amber-500' : 'hover:bg-stone-600'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{network.targetFlag}</span>
                <div>
                  <div className="font-medium">{network.targetName}</div>
                  {network.isRival && (
                    <span className="text-xs text-red-400">Rival</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-amber-400">
                  {network.networkStrength}%
                </div>
                <div className="text-xs text-stone-400">Network</div>
              </div>
            </div>

            {/* Network Strength Bar */}
            <div className="h-2 bg-stone-800 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-amber-500 transition-all"
                style={{ width: `${network.networkStrength}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-stone-400">
              <span>Active missions: {network.activeMissions}/3</span>
              {network.networkStrength >= 100 && (
                <span className="text-green-400">Maximum</span>
              )}
            </div>
          </div>
        ))
      )}

      {/* Build Network Button */}
      <button
        onClick={() => onBuildNetwork?.(selectedTarget || '')}
        disabled={diplomatCount >= maxDiplomats}
        className={`w-full py-2 rounded text-sm ${
          diplomatCount < maxDiplomats
            ? 'bg-amber-600 hover:bg-amber-700 text-white'
            : 'bg-stone-600 text-stone-400 cursor-not-allowed'
        }`}
      >
        {diplomatCount < maxDiplomats
          ? 'Build New Network'
          : 'No Diplomats Available'}
      </button>
    </div>
  );

  const renderActions = () => (
    <div className="space-y-3">
      {!selectedNetwork ? (
        <div className="text-center py-8 text-stone-400">
          Select a network to view available actions
        </div>
      ) : (
        <>
          <div className="bg-stone-900 rounded p-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{selectedNetwork.targetFlag}</span>
              <div>
                <div className="font-medium">{selectedNetwork.targetName}</div>
                <div className="text-xs text-stone-400">
                  Network: {selectedNetwork.networkStrength}%
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {availableActions.map(action => {
              const canPerform = selectedNetwork.networkStrength >= action.networkCost &&
                                selectedNetwork.activeMissions < 3;

              return (
                <div
                  key={action.id}
                  className={`bg-stone-700 rounded-lg p-3 ${
                    canPerform ? 'hover:bg-stone-600 cursor-pointer' : 'opacity-60'
                  }`}
                  onClick={() => canPerform && onPerformAction?.(selectedNetwork.targetId, action.id)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span>{action.icon}</span>
                      <span className="font-medium text-sm">{action.name}</span>
                    </div>
                    <span className={`text-xs ${getCategoryColor(action.category)}`}>
                      {action.category}
                    </span>
                  </div>

                  <div className="text-xs text-stone-400 mb-2">
                    {action.description}
                  </div>

                  <div className="flex justify-between text-xs">
                    <span>
                      Cost: <span className="text-amber-400">{action.networkCost}%</span>
                    </span>
                    <span>
                      Duration: <span className="text-blue-400">{action.duration}mo</span>
                    </span>
                    <span>
                      Success: <span className={action.successChance >= 70 ? 'text-green-400' : action.successChance >= 50 ? 'text-yellow-400' : 'text-red-400'}>
                        {action.successChance}%
                      </span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );

  const tabs = [
    { id: 'networks' as const, label: 'Networks' },
    { id: 'actions' as const, label: 'Actions' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-stone-800 rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-stone-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-amber-100">Espionage</h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200"
          >
            ✕
          </button>
        </div>

        {/* Summary */}
        <div className="px-4 py-2 bg-stone-900 flex justify-around text-center">
          <div>
            <div className="text-lg font-bold text-amber-400">
              {diplomatCount}/{maxDiplomats}
            </div>
            <div className="text-xs text-stone-400">Diplomats</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-400">{networks.length}</div>
            <div className="text-xs text-stone-400">Networks</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-400">+{spyOffense}%</div>
            <div className="text-xs text-stone-400">Spy Offense</div>
          </div>
        </div>

        {/* Tabs */}
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
          {activeTab === 'networks' && renderNetworks()}
          {activeTab === 'actions' && renderActions()}
        </div>
      </div>
    </div>
  );
}
