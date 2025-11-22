import React, { useState } from 'react';

export interface Ship {
  id: string;
  name: string;
  type: ShipType;
  strength: number;
  maxStrength: number;
  morale: number;
  experience: number;
}

export type ShipType = 'galley' | 'caravel' | 'galleon' | 'frigate' | 'ship_of_line' | 'transport';

export interface Fleet {
  id: string;
  name: string;
  ships: Ship[];
  admiral: string | null;
  location: string;
  mission: 'patrol' | 'blockade' | 'transport' | 'explore' | 'idle';
  supplies: number;
}

interface NavyManagementProps {
  isOpen: boolean;
  onClose: () => void;
  fleets: Fleet[];
  treasury: number;
  sailors: number;
  maxSailors: number;
  onBuildShip: (type: ShipType) => void;
  onSetMission: (fleetId: string, mission: Fleet['mission']) => void;
  onMergeFleets: (fleet1Id: string, fleet2Id: string) => void;
  onSplitFleet: (fleetId: string, shipIds: string[]) => void;
}

const SHIP_TYPES: Record<ShipType, {
  name: string;
  icon: string;
  cost: number;
  sailors: number;
  strength: number;
  speed: number;
  description: string;
}> = {
  galley: {
    name: 'Galley',
    icon: '🚣',
    cost: 50,
    sailors: 100,
    strength: 10,
    speed: 3,
    description: 'Oar-powered, good in coastal waters'
  },
  caravel: {
    name: 'Caravel',
    icon: '⛵',
    cost: 100,
    sailors: 50,
    strength: 15,
    speed: 5,
    description: 'Fast exploration vessel'
  },
  galleon: {
    name: 'Galleon',
    icon: '🚢',
    cost: 200,
    sailors: 150,
    strength: 30,
    speed: 4,
    description: 'Heavy cargo and combat ship'
  },
  frigate: {
    name: 'Frigate',
    icon: '⚓',
    cost: 300,
    sailors: 200,
    strength: 40,
    speed: 6,
    description: 'Fast warship for raids'
  },
  ship_of_line: {
    name: 'Ship of the Line',
    icon: '🛳️',
    cost: 500,
    sailors: 400,
    strength: 80,
    speed: 3,
    description: 'Powerful battleship'
  },
  transport: {
    name: 'Transport',
    icon: '📦',
    cost: 75,
    sailors: 30,
    strength: 5,
    speed: 4,
    description: 'Carries troops overseas'
  }
};

export const NavyManagement: React.FC<NavyManagementProps> = ({
  isOpen,
  onClose,
  fleets,
  treasury,
  sailors,
  maxSailors,
  onBuildShip,
  onSetMission,
  onMergeFleets,
  onSplitFleet
}) => {
  const [selectedFleet, setSelectedFleet] = useState<string | null>(null);
  const [view, setView] = useState<'fleets' | 'build'>('fleets');

  if (!isOpen) return null;

  const totalShips = fleets.reduce((sum, f) => sum + f.ships.length, 0);
  const totalStrength = fleets.reduce(
    (sum, f) => sum + f.ships.reduce((s, ship) => s + ship.strength, 0),
    0
  );

  const fleet = selectedFleet ? fleets.find(f => f.id === selectedFleet) : null;

  const getMissionColor = (mission: Fleet['mission']) => {
    switch (mission) {
      case 'patrol': return 'bg-blue-500';
      case 'blockade': return 'bg-red-500';
      case 'transport': return 'bg-amber-500';
      case 'explore': return 'bg-purple-500';
      default: return 'bg-stone-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <h2 className="text-xl font-bold text-stone-800">⚓ Navy Management</h2>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Stats bar */}
        <div className="p-3 border-b border-stone-200 grid grid-cols-4 gap-4 bg-stone-100">
          <div className="text-center">
            <div className="text-xs text-stone-500">Total Ships</div>
            <div className="font-bold text-stone-800">{totalShips}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-stone-500">Naval Strength</div>
            <div className="font-bold text-stone-800">{totalStrength}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-stone-500">Sailors</div>
            <div className="font-bold text-stone-800">{sailors.toLocaleString()}/{maxSailors.toLocaleString()}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-stone-500">Fleets</div>
            <div className="font-bold text-stone-800">{fleets.length}</div>
          </div>
        </div>

        {/* View tabs */}
        <div className="p-2 border-b border-stone-200 flex gap-2">
          <button
            onClick={() => setView('fleets')}
            className={`px-4 py-2 rounded text-sm font-medium ${
              view === 'fleets'
                ? 'bg-blue-600 text-white'
                : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
            }`}
          >
            ⚓ Fleets
          </button>
          <button
            onClick={() => setView('build')}
            className={`px-4 py-2 rounded text-sm font-medium ${
              view === 'build'
                ? 'bg-blue-600 text-white'
                : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
            }`}
          >
            🔨 Build Ships
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {view === 'fleets' ? (
            <>
              {/* Fleet list */}
              <div className="w-1/3 border-r border-stone-200 overflow-y-auto">
                {fleets.length === 0 ? (
                  <p className="p-4 text-center text-stone-500">No fleets available</p>
                ) : (
                  fleets.map(f => (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFleet(f.id)}
                      className={`w-full p-3 text-left border-b border-stone-200 hover:bg-stone-100 ${
                        selectedFleet === f.id ? 'bg-stone-100' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-stone-800">{f.name}</div>
                          <div className="text-xs text-stone-500">
                            {f.ships.length} ships • {f.location}
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs text-white ${getMissionColor(f.mission)}`}>
                          {f.mission}
                        </span>
                      </div>
                      {f.admiral && (
                        <div className="text-xs text-amber-600 mt-1">
                          👤 {f.admiral}
                        </div>
                      )}
                    </button>
                  ))
                )}
              </div>

              {/* Fleet details */}
              <div className="flex-1 overflow-y-auto p-4">
                {fleet ? (
                  <>
                    <h3 className="text-lg font-bold text-stone-800 mb-3">{fleet.name}</h3>

                    {/* Mission selector */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-stone-600 mb-2">Mission</h4>
                      <div className="flex gap-2">
                        {(['idle', 'patrol', 'blockade', 'transport', 'explore'] as const).map(mission => (
                          <button
                            key={mission}
                            onClick={() => onSetMission(fleet.id, mission)}
                            className={`px-3 py-1 rounded text-sm ${
                              fleet.mission === mission
                                ? `${getMissionColor(mission)} text-white`
                                : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                            }`}
                          >
                            {mission.charAt(0).toUpperCase() + mission.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Supplies */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-stone-600 mb-1">Supplies</h4>
                      <div className="w-full bg-stone-200 rounded-full h-3">
                        <div
                          className="bg-green-500 h-3 rounded-full"
                          style={{ width: `${fleet.supplies}%` }}
                        />
                      </div>
                      <div className="text-xs text-stone-500 mt-1">{fleet.supplies}%</div>
                    </div>

                    {/* Ships */}
                    <h4 className="text-sm font-semibold text-stone-600 mb-2">Ships</h4>
                    <div className="space-y-2">
                      {fleet.ships.map(ship => {
                        const shipInfo = SHIP_TYPES[ship.type];
                        return (
                          <div key={ship.id} className="bg-stone-100 rounded p-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <span>{shipInfo.icon}</span>
                                <div>
                                  <div className="font-medium text-stone-800 text-sm">{ship.name}</div>
                                  <div className="text-xs text-stone-500">{shipInfo.name}</div>
                                </div>
                              </div>
                              <div className="text-right text-xs">
                                <div>⚔️ {ship.strength}/{ship.maxStrength}</div>
                                <div>🎖️ {ship.experience}%</div>
                              </div>
                            </div>
                            <div className="mt-1 w-full bg-stone-300 rounded-full h-1.5">
                              <div
                                className="bg-blue-500 h-1.5 rounded-full"
                                style={{ width: `${ship.morale}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <p className="text-center text-stone-500">Select a fleet to view details</p>
                )}
              </div>
            </>
          ) : (
            /* Build ships view */
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-2 gap-4">
                {(Object.entries(SHIP_TYPES) as [ShipType, typeof SHIP_TYPES[ShipType]][]).map(([type, info]) => {
                  const canAfford = treasury >= info.cost && sailors + info.sailors <= maxSailors;
                  return (
                    <div
                      key={type}
                      className={`bg-stone-100 rounded-lg p-4 border-2 ${
                        canAfford ? 'border-stone-300' : 'border-red-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">{info.icon}</span>
                        <div>
                          <h4 className="font-bold text-stone-800">{info.name}</h4>
                          <p className="text-xs text-stone-500">{info.description}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                        <div>
                          <span className="text-stone-500">Strength:</span>
                          <span className="ml-1 font-medium">{info.strength}</span>
                        </div>
                        <div>
                          <span className="text-stone-500">Speed:</span>
                          <span className="ml-1 font-medium">{info.speed}</span>
                        </div>
                        <div>
                          <span className="text-stone-500">Cost:</span>
                          <span className="ml-1 font-medium text-amber-600">{info.cost}💰</span>
                        </div>
                        <div>
                          <span className="text-stone-500">Sailors:</span>
                          <span className="ml-1 font-medium">{info.sailors}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => onBuildShip(type)}
                        disabled={!canAfford}
                        className={`w-full py-2 rounded text-sm font-medium ${
                          canAfford
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                        }`}
                      >
                        Build Ship
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavyManagement;
