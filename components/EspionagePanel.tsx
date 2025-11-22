import React, { useState } from 'react';

export interface SpyNetwork {
  nationId: string;
  nationName: string;
  flag: string;
  networkStrength: number;
  spiesAssigned: number;
  discovered: boolean;
}

export interface EspionageMission {
  id: string;
  name: string;
  icon: string;
  description: string;
  baseCost: number;
  duration: number;
  minNetwork: number;
  risk: number;
  effects: string[];
}

export interface ActiveOperation {
  id: string;
  missionId: string;
  targetNation: string;
  progress: number;
  totalDuration: number;
  spy: string;
}

interface EspionagePanelProps {
  isOpen: boolean;
  onClose: () => void;
  spyNetworks: SpyNetwork[];
  availableSpies: number;
  maxSpies: number;
  missions: EspionageMission[];
  activeOperations: ActiveOperation[];
  treasury: number;
  onBuildNetwork: (nationId: string) => void;
  onStartMission: (missionId: string, nationId: string) => void;
  onCancelOperation: (operationId: string) => void;
  onRecallSpies: (nationId: string) => void;
}

export const DEFAULT_ESPIONAGE_MISSIONS: EspionageMission[] = [
  {
    id: 'gather_intel',
    name: 'Gather Intelligence',
    icon: '🔍',
    description: 'Gather information about the target nation',
    baseCost: 50,
    duration: 6,
    minNetwork: 10,
    risk: 10,
    effects: ['Reveal army compositions', 'Show diplomatic relations']
  },
  {
    id: 'steal_tech',
    name: 'Steal Technology',
    icon: '📜',
    description: 'Steal technological secrets',
    baseCost: 200,
    duration: 12,
    minNetwork: 40,
    risk: 30,
    effects: ['+10% research progress', 'May reveal technology']
  },
  {
    id: 'sow_discord',
    name: 'Sow Discord',
    icon: '🗣️',
    description: 'Spread propaganda and unrest',
    baseCost: 100,
    duration: 8,
    minNetwork: 25,
    risk: 20,
    effects: ['+3 Unrest in target', '-10 Relations with neighbors']
  },
  {
    id: 'sabotage',
    name: 'Sabotage',
    icon: '💣',
    description: 'Sabotage military or economic targets',
    baseCost: 150,
    duration: 10,
    minNetwork: 35,
    risk: 40,
    effects: ['-20% Production for 1 year', 'Damage to buildings']
  },
  {
    id: 'fabricate_claims',
    name: 'Fabricate Claims',
    icon: '📋',
    description: 'Create false claims on provinces',
    baseCost: 100,
    duration: 24,
    minNetwork: 20,
    risk: 15,
    effects: ['Gain casus belli', 'Claims on border provinces']
  },
  {
    id: 'support_rebels',
    name: 'Support Rebels',
    icon: '🔥',
    description: 'Fund and arm rebel groups',
    baseCost: 300,
    duration: 12,
    minNetwork: 50,
    risk: 50,
    effects: ['Spawn rebel army', '+5 Unrest nationwide']
  },
  {
    id: 'assassinate',
    name: 'Assassination',
    icon: '🗡️',
    description: 'Attempt to assassinate a leader',
    baseCost: 500,
    duration: 18,
    minNetwork: 70,
    risk: 80,
    effects: ['Kill advisor/general', 'Massive relations penalty if caught']
  },
  {
    id: 'counter_espionage',
    name: 'Counter-Espionage',
    icon: '🛡️',
    description: 'Hunt foreign spies in your nation',
    baseCost: 75,
    duration: 6,
    minNetwork: 0,
    risk: 0,
    effects: ['Discover enemy networks', 'Capture spies']
  }
];

export const EspionagePanel: React.FC<EspionagePanelProps> = ({
  isOpen,
  onClose,
  spyNetworks,
  availableSpies,
  maxSpies,
  missions,
  activeOperations,
  treasury,
  onBuildNetwork,
  onStartMission,
  onCancelOperation,
  onRecallSpies
}) => {
  const [tab, setTab] = useState<'networks' | 'missions' | 'operations'>('networks');
  const [selectedNation, setSelectedNation] = useState<string | null>(null);
  const [selectedMission, setSelectedMission] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedNetwork = spyNetworks.find(n => n.nationId === selectedNation);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-stone-800">🕵️ Espionage</h2>
            <div className="text-sm text-stone-500">
              {availableSpies}/{maxSpies} spies available
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="p-2 border-b border-stone-200 flex gap-2">
          <button
            onClick={() => setTab('networks')}
            className={`px-4 py-2 rounded text-sm font-medium ${
              tab === 'networks' ? 'bg-stone-700 text-white' : 'bg-stone-200 text-stone-700'
            }`}
          >
            Networks ({spyNetworks.length})
          </button>
          <button
            onClick={() => setTab('missions')}
            className={`px-4 py-2 rounded text-sm font-medium ${
              tab === 'missions' ? 'bg-stone-700 text-white' : 'bg-stone-200 text-stone-700'
            }`}
          >
            Missions
          </button>
          <button
            onClick={() => setTab('operations')}
            className={`px-4 py-2 rounded text-sm font-medium ${
              tab === 'operations' ? 'bg-stone-700 text-white' : 'bg-stone-200 text-stone-700'
            }`}
          >
            Active ({activeOperations.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {tab === 'networks' && (
            <div className="space-y-3">
              {spyNetworks.length === 0 ? (
                <p className="text-center text-stone-500 py-8">
                  No spy networks established
                </p>
              ) : (
                spyNetworks.map(network => (
                  <div
                    key={network.nationId}
                    className={`bg-stone-100 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedNation === network.nationId ? 'ring-2 ring-stone-500' : ''
                    } ${network.discovered ? 'border-2 border-red-300' : ''}`}
                    onClick={() => setSelectedNation(network.nationId)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{network.flag}</span>
                        <div>
                          <div className="font-semibold text-stone-800">{network.nationName}</div>
                          <div className="text-xs text-stone-500">
                            {network.spiesAssigned} spies assigned
                          </div>
                        </div>
                      </div>
                      {network.discovered && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">
                          Discovered!
                        </span>
                      )}
                    </div>

                    <div className="mb-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-stone-500">Network Strength</span>
                        <span className="font-medium">{network.networkStrength}%</span>
                      </div>
                      <div className="w-full bg-stone-200 rounded-full h-2">
                        <div
                          className="bg-stone-600 h-2 rounded-full"
                          style={{ width: `${network.networkStrength}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onBuildNetwork(network.nationId);
                        }}
                        disabled={availableSpies === 0}
                        className={`flex-1 py-1 rounded text-xs ${
                          availableSpies > 0
                            ? 'bg-stone-600 text-white hover:bg-stone-700'
                            : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                        }`}
                      >
                        +1 Spy
                      </button>
                      {network.spiesAssigned > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRecallSpies(network.nationId);
                          }}
                          className="flex-1 py-1 rounded text-xs bg-amber-600 text-white hover:bg-amber-700"
                        >
                          Recall
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'missions' && (
            <div className="grid grid-cols-2 gap-3">
              {missions.map(mission => {
                const canAfford = treasury >= mission.baseCost;
                const hasNetwork = selectedNetwork && selectedNetwork.networkStrength >= mission.minNetwork;

                return (
                  <div
                    key={mission.id}
                    className={`rounded-lg p-4 border-2 ${
                      selectedMission === mission.id
                        ? 'border-stone-500 bg-stone-100'
                        : 'border-stone-200 bg-white'
                    }`}
                    onClick={() => setSelectedMission(mission.id)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{mission.icon}</span>
                      <h4 className="font-semibold text-stone-800 text-sm">{mission.name}</h4>
                    </div>
                    <p className="text-xs text-stone-600 mb-2">{mission.description}</p>

                    <div className="grid grid-cols-2 gap-1 text-xs mb-2">
                      <div>
                        <span className="text-stone-500">Cost:</span>
                        <span className={`ml-1 ${canAfford ? '' : 'text-red-600'}`}>
                          {mission.baseCost}💰
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-500">Duration:</span>
                        <span className="ml-1">{mission.duration}mo</span>
                      </div>
                      <div>
                        <span className="text-stone-500">Min Network:</span>
                        <span className={`ml-1 ${hasNetwork ? '' : 'text-red-600'}`}>
                          {mission.minNetwork}%
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-500">Risk:</span>
                        <span className={`ml-1 ${mission.risk > 50 ? 'text-red-600' : ''}`}>
                          {mission.risk}%
                        </span>
                      </div>
                    </div>

                    {selectedNation && (
                      <button
                        onClick={() => onStartMission(mission.id, selectedNation)}
                        disabled={!canAfford || !hasNetwork}
                        className={`w-full py-1 rounded text-xs ${
                          canAfford && hasNetwork
                            ? 'bg-stone-600 text-white hover:bg-stone-700'
                            : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                        }`}
                      >
                        Execute
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {tab === 'operations' && (
            activeOperations.length === 0 ? (
              <p className="text-center text-stone-500 py-8">No active operations</p>
            ) : (
              <div className="space-y-3">
                {activeOperations.map(op => {
                  const mission = missions.find(m => m.id === op.missionId);
                  return (
                    <div key={op.id} className="bg-stone-100 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold text-stone-800">
                            {mission?.icon} {mission?.name}
                          </div>
                          <div className="text-xs text-stone-500">
                            Target: {op.targetNation} • Agent: {op.spy}
                          </div>
                        </div>
                        <button
                          onClick={() => onCancelOperation(op.id)}
                          className="text-red-500 hover:text-red-700 text-xs"
                        >
                          Abort
                        </button>
                      </div>
                      <div className="w-full bg-stone-200 rounded-full h-2">
                        <div
                          className="bg-stone-600 h-2 rounded-full"
                          style={{ width: `${(op.progress / op.totalDuration) * 100}%` }}
                        />
                      </div>
                      <div className="text-xs text-stone-500 mt-1">
                        {op.progress}/{op.totalDuration} months
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>

        {/* Selected mission effects */}
        {tab === 'missions' && selectedMission && (
          <div className="p-3 border-t border-stone-300 bg-stone-100">
            <h4 className="text-xs font-semibold text-stone-500 mb-1">Effects</h4>
            <div className="text-xs text-stone-600">
              {missions.find(m => m.id === selectedMission)?.effects.join(' • ')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EspionagePanel;
