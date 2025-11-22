import React, { useState } from 'react';
import {
  Fleet,
  Ship,
  ShipType,
  MissionType,
  SHIP_TYPES,
  MISSION_EFFECTS,
  getShip,
  calculateFleetStrength,
  calculateFleetMaintenance,
  getFleetComposition,
  canPerformMission
} from '../data/navalSystem';

interface NavalOverviewProps {
  fleets: Fleet[];
  sailors: number;
  maxSailors: number;
  navalForceLimit: number;
  onClose: () => void;
  onSelectFleet?: (fleetId: string) => void;
  onAssignMission?: (fleetId: string, mission: MissionType) => void;
}

type TabType = 'fleets' | 'ships' | 'missions';

export default function NavalOverview({
  fleets,
  sailors,
  maxSailors,
  navalForceLimit,
  onClose,
  onSelectFleet,
  onAssignMission
}: NavalOverviewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('fleets');
  const [selectedFleet, setSelectedFleet] = useState<Fleet | null>(
    fleets.length > 0 ? fleets[0] : null
  );

  const tabs: { id: TabType; label: string }[] = [
    { id: 'fleets', label: `Fleets (${fleets.length})` },
    { id: 'ships', label: 'Ship Types' },
    { id: 'missions', label: 'Missions' }
  ];

  const totalShips = fleets.reduce((sum, f) => sum + f.ships.length, 0);

  const renderFleets = () => (
    <div className="space-y-3">
      {fleets.length === 0 ? (
        <div className="text-center py-8 text-stone-400">
          <div className="text-3xl mb-2">⚓</div>
          <div>No fleets available</div>
        </div>
      ) : (
        fleets.map(fleet => {
          const strength = calculateFleetStrength(fleet.ships);
          const composition = getFleetComposition(fleet.ships);

          return (
            <div
              key={fleet.id}
              onClick={() => {
                setSelectedFleet(fleet);
                if (onSelectFleet) onSelectFleet(fleet.id);
              }}
              className={`bg-stone-700 rounded-lg p-4 cursor-pointer transition-colors ${
                selectedFleet?.id === fleet.id
                  ? 'ring-2 ring-amber-500'
                  : 'hover:bg-stone-600'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-amber-100">{fleet.name}</h3>
                  <div className="text-xs text-stone-400">
                    {fleet.location}
                    {fleet.admiral && ` • Admiral ${fleet.admiral.name}`}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-blue-400">{strength}</div>
                  <div className="text-xs text-stone-400">Strength</div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-3 text-xs">
                <div className="bg-stone-800 rounded p-2 text-center">
                  <div className="font-bold text-amber-400">{composition.heavy}</div>
                  <div className="text-stone-500">Heavy</div>
                </div>
                <div className="bg-stone-800 rounded p-2 text-center">
                  <div className="font-bold text-blue-400">{composition.light}</div>
                  <div className="text-stone-500">Light</div>
                </div>
                <div className="bg-stone-800 rounded p-2 text-center">
                  <div className="font-bold text-green-400">{composition.galley}</div>
                  <div className="text-stone-500">Galley</div>
                </div>
                <div className="bg-stone-800 rounded p-2 text-center">
                  <div className="font-bold text-purple-400">{composition.transport}</div>
                  <div className="text-stone-500">Transport</div>
                </div>
              </div>

              {fleet.mission ? (
                <div className="text-xs bg-blue-900/30 px-2 py-1 rounded">
                  Mission: {fleet.mission.type.replace(/_/g, ' ')}
                </div>
              ) : (
                <div className="text-xs text-stone-500">No mission assigned</div>
              )}
            </div>
          );
        })
      )}
    </div>
  );

  const renderShips = () => (
    <div className="space-y-2">
      {SHIP_TYPES.map(ship => (
        <div key={ship.id} className="bg-stone-700 rounded p-3">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">{ship.icon}</span>
              <div>
                <div className="font-medium text-amber-100">{ship.name}</div>
                <span className={`text-xs px-1.5 py-0.5 rounded ${
                  ship.type === 'heavy' ? 'bg-amber-900 text-amber-300' :
                  ship.type === 'light' ? 'bg-blue-900 text-blue-300' :
                  ship.type === 'galley' ? 'bg-green-900 text-green-300' :
                  'bg-purple-900 text-purple-300'
                }`}>
                  {ship.type}
                </span>
              </div>
            </div>
            <div className="text-right text-xs">
              <div className="text-amber-400">{ship.cost} 💰</div>
              <div className="text-stone-400">{ship.buildTime}mo</div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 text-xs mb-2">
            <div>
              <span className="text-stone-400">Hull:</span>{' '}
              <span className="text-stone-200">{ship.hull}</span>
            </div>
            <div>
              <span className="text-stone-400">Guns:</span>{' '}
              <span className="text-stone-200">{ship.cannons}</span>
            </div>
            <div>
              <span className="text-stone-400">Crew:</span>{' '}
              <span className="text-stone-200">{ship.sailors}</span>
            </div>
            <div>
              <span className="text-stone-400">Speed:</span>{' '}
              <span className="text-stone-200">{ship.speed}</span>
            </div>
          </div>

          {ship.abilities.length > 0 && (
            <div className="text-xs">
              {ship.abilities.map(ability => (
                <span
                  key={ability.id}
                  className="bg-stone-800 px-2 py-0.5 rounded mr-1"
                >
                  {ability.name}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderMissions = () => {
    const missions: { type: MissionType; name: string; icon: string; description: string }[] = [
      { type: 'patrol', name: 'Patrol', icon: '👁️', description: 'Patrol waters and detect enemy fleets' },
      { type: 'privateer', name: 'Privateer', icon: '🏴‍☠️', description: 'Raid enemy trade routes' },
      { type: 'protect_trade', name: 'Protect Trade', icon: '🛡️', description: 'Protect trade routes from pirates' },
      { type: 'hunt_pirates', name: 'Hunt Pirates', icon: '⚔️', description: 'Hunt and destroy pirates' },
      { type: 'blockade', name: 'Blockade', icon: '🚫', description: 'Blockade enemy ports' },
      { type: 'explore', name: 'Explore', icon: '🧭', description: 'Explore unknown waters' },
      { type: 'transport', name: 'Transport', icon: '📦', description: 'Transport troops and supplies' }
    ];

    return (
      <div className="space-y-2">
        {missions.map(mission => {
          const canAssign = selectedFleet && canPerformMission(selectedFleet.ships, mission.type);
          const effects = MISSION_EFFECTS[mission.type];

          return (
            <div key={mission.type} className="bg-stone-700 rounded p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{mission.icon}</span>
                  <div>
                    <div className="font-medium text-amber-100">{mission.name}</div>
                    <div className="text-xs text-stone-400">{mission.description}</div>
                  </div>
                </div>
                {onAssignMission && selectedFleet && (
                  <button
                    onClick={() => onAssignMission(selectedFleet.id, mission.type)}
                    disabled={!canAssign}
                    className={`text-xs px-2 py-1 rounded ${
                      canAssign
                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                        : 'bg-stone-600 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    Assign
                  </button>
                )}
              </div>

              <div className="text-xs">
                {effects.map((effect, i) => (
                  <span
                    key={i}
                    className="bg-green-900/30 text-green-400 px-2 py-0.5 rounded mr-1"
                  >
                    +{effect.value}% {effect.type.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-stone-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-stone-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-amber-100">⚓ Naval Overview</h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200"
          >
            ✕
          </button>
        </div>

        {/* Summary bar */}
        <div className="p-3 border-b border-stone-700 bg-stone-700/50">
          <div className="flex justify-between text-sm">
            <div>
              <span className="text-stone-400">Ships:</span>{' '}
              <span className={totalShips > navalForceLimit ? 'text-red-400' : 'text-amber-400'}>
                {totalShips}/{navalForceLimit}
              </span>
            </div>
            <div>
              <span className="text-stone-400">Sailors:</span>{' '}
              <span className="text-blue-400">{sailors.toLocaleString()}/{maxSailors.toLocaleString()}</span>
            </div>
          </div>
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
          {activeTab === 'fleets' && renderFleets()}
          {activeTab === 'ships' && renderShips()}
          {activeTab === 'missions' && renderMissions()}
        </div>
      </div>
    </div>
  );
}
