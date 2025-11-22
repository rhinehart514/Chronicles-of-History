import React, { useState } from 'react';

interface RebelFaction {
  id: string;
  name: string;
  type: string;
  icon: string;
  provinces: string[];
  progress: number;
  size: number;
  demands: string[];
}

interface RebelArmy {
  id: string;
  factionId: string;
  size: number;
  location: string;
  morale: number;
}

interface RebelManagementProps {
  factions: RebelFaction[];
  armies: RebelArmy[];
  militaryPower: number;
  onAcceptDemands?: (factionId: string) => void;
  onHarshTreatment?: (provinceId: string) => void;
  onClose: () => void;
}

export default function RebelManagement({
  factions,
  armies,
  militaryPower,
  onAcceptDemands,
  onHarshTreatment,
  onClose
}: RebelManagementProps) {
  const [activeTab, setActiveTab] = useState<'factions' | 'armies'>('factions');
  const [selectedFaction, setSelectedFaction] = useState<string | null>(null);

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-red-500';
    if (progress >= 50) return 'bg-orange-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      nationalist: 'text-blue-400',
      religious: 'text-purple-400',
      pretender: 'text-yellow-400',
      noble: 'text-amber-400',
      peasant: 'text-green-400',
      particularist: 'text-orange-400',
      revolutionary: 'text-red-400'
    };
    return colors[type] || 'text-stone-400';
  };

  const selectedFactionData = factions.find(f => f.id === selectedFaction);

  const renderFactions = () => (
    <div className="space-y-3">
      {factions.length === 0 ? (
        <div className="text-center py-8 text-stone-400">
          <div className="text-3xl mb-2">✓</div>
          <div>No active rebel factions</div>
        </div>
      ) : (
        factions.map(faction => (
          <div
            key={faction.id}
            onClick={() => setSelectedFaction(faction.id)}
            className={`bg-stone-700 rounded-lg p-3 cursor-pointer transition-colors ${
              selectedFaction === faction.id ? 'ring-2 ring-amber-500' : 'hover:bg-stone-600'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{faction.icon}</span>
                <div>
                  <div className="font-medium">{faction.name}</div>
                  <div className={`text-xs ${getTypeColor(faction.type)}`}>
                    {faction.type.charAt(0).toUpperCase() + faction.type.slice(1)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">{faction.size}K</div>
                <div className="text-xs text-stone-400">Strength</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Uprising Progress</span>
                <span>{faction.progress}%</span>
              </div>
              <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getProgressColor(faction.progress)} transition-all`}
                  style={{ width: `${faction.progress}%` }}
                />
              </div>
            </div>

            <div className="text-xs text-stone-400">
              {faction.provinces.length} province{faction.provinces.length !== 1 ? 's' : ''} affected
            </div>
          </div>
        ))
      )}

      {/* Selected Faction Details */}
      {selectedFactionData && (
        <div className="bg-stone-900 rounded-lg p-3 mt-4">
          <h4 className="font-medium mb-2">Demands</h4>
          <ul className="text-sm text-stone-300 space-y-1 mb-3">
            {selectedFactionData.demands.map((demand, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="text-red-400">•</span>
                {demand}
              </li>
            ))}
          </ul>
          <button
            onClick={() => onAcceptDemands?.(selectedFactionData.id)}
            className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
          >
            Accept Demands
          </button>
        </div>
      )}
    </div>
  );

  const renderArmies = () => (
    <div className="space-y-3">
      {armies.length === 0 ? (
        <div className="text-center py-8 text-stone-400">
          <div className="text-3xl mb-2">⚔️</div>
          <div>No rebel armies active</div>
        </div>
      ) : (
        armies.map(army => {
          const faction = factions.find(f => f.id === army.factionId);
          return (
            <div key={army.id} className="bg-stone-700 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{faction?.icon || '⚔️'}</span>
                  <div>
                    <div className="font-medium">{faction?.name || 'Unknown'}</div>
                    <div className="text-xs text-stone-400">{army.location}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{army.size}K</div>
                  <div className="text-xs text-stone-400">Troops</div>
                </div>
              </div>

              {/* Morale Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Morale</span>
                  <span>{(army.morale * 100).toFixed(0)}%</span>
                </div>
                <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${army.morale * 100}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );

  const tabs = [
    { id: 'factions' as const, label: 'Factions', count: factions.length },
    { id: 'armies' as const, label: 'Armies', count: armies.length }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-stone-800 rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-stone-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-amber-100">Rebel Management</h2>
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
            <div className="text-lg font-bold text-red-400">{factions.length}</div>
            <div className="text-xs text-stone-400">Factions</div>
          </div>
          <div>
            <div className="text-lg font-bold text-orange-400">{armies.length}</div>
            <div className="text-xs text-stone-400">Armies</div>
          </div>
          <div>
            <div className="text-lg font-bold text-amber-400">{militaryPower}</div>
            <div className="text-xs text-stone-400">Mil Power</div>
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
                {tab.count > 0 && (
                  <span className="ml-1 text-xs bg-red-600 text-white px-1.5 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          {activeTab === 'factions' && renderFactions()}
          {activeTab === 'armies' && renderArmies()}
        </div>

        {/* Harsh Treatment */}
        <div className="p-3 border-t border-stone-700">
          <div className="text-xs text-stone-400 mb-2">
            Harsh Treatment reduces unrest in a province at the cost of military power
          </div>
          <button
            onClick={() => onHarshTreatment?.('selected')}
            disabled={militaryPower < 50}
            className={`w-full py-2 rounded text-sm ${
              militaryPower >= 50
                ? 'bg-stone-600 hover:bg-stone-500'
                : 'bg-stone-700 text-stone-500 cursor-not-allowed'
            }`}
          >
            Apply Harsh Treatment (50 Mil)
          </button>
        </div>
      </div>
    </div>
  );
}
