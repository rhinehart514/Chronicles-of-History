import React, { useState } from 'react';
import {
  Religion,
  RELIGIONS,
  getReligionsByGroup,
  getReligionIcon
} from '../data/religionSystem';

interface ReligionPanelProps {
  currentReligion: Religion;
  religiousUnity: number;
  piety?: number;
  authority?: number;
  fervor?: number;
  toleranceOwn: number;
  toleranceHeretic: number;
  toleranceHeathen: number;
  missionaryStrength: number;
  defendersOfFaith?: boolean;
  onClose: () => void;
  onConvert?: (religionId: string) => void;
}

export default function ReligionPanel({
  currentReligion,
  religiousUnity,
  piety,
  authority,
  fervor,
  toleranceOwn,
  toleranceHeretic,
  toleranceHeathen,
  missionaryStrength,
  defendersOfFaith,
  onClose,
  onConvert
}: ReligionPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'conversion' | 'mechanics'>('overview');

  const tabs = [
    { id: 'overview' as const, label: 'Overview' },
    { id: 'mechanics' as const, label: 'Mechanics' },
    { id: 'conversion' as const, label: 'Convert' }
  ];

  const renderOverview = () => (
    <div className="space-y-4">
      {/* Current religion */}
      <div className="bg-stone-700 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{getReligionIcon(currentReligion.group)}</span>
          <div>
            <h3 className="font-bold text-amber-100">{currentReligion.name}</h3>
            <div className="text-xs text-stone-400 capitalize">{currentReligion.group}</div>
          </div>
        </div>

        <p className="text-sm text-stone-300 mb-3">{currentReligion.description}</p>

        {currentReligion.modifiers && currentReligion.modifiers.length > 0 && (
          <div>
            <div className="text-xs text-stone-400 mb-1">Bonuses:</div>
            <div className="space-y-1">
              {currentReligion.modifiers.map((mod, i) => (
                <div key={i} className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded">
                  {mod.value > 0 ? '+' : ''}{mod.value}% {mod.type.replace(/_/g, ' ')}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Religious unity */}
      <div className="bg-stone-700 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-stone-400">Religious Unity</span>
          <span className={`font-bold ${
            religiousUnity >= 100 ? 'text-green-400' :
            religiousUnity >= 50 ? 'text-amber-400' : 'text-red-400'
          }`}>
            {religiousUnity.toFixed(0)}%
          </span>
        </div>
        <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
          <div
            className={`h-full ${
              religiousUnity >= 100 ? 'bg-green-500' :
              religiousUnity >= 50 ? 'bg-amber-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(100, religiousUnity)}%` }}
          />
        </div>
        <div className="text-xs text-stone-400 mt-1">
          Affects stability and unrest
        </div>
      </div>

      {/* Special mechanics */}
      {(piety !== undefined || authority !== undefined || fervor !== undefined) && (
        <div className="bg-stone-700 rounded-lg p-4">
          <div className="text-xs text-stone-400 mb-2">Special Mechanic</div>
          {piety !== undefined && (
            <div>
              <div className="flex justify-between mb-1">
                <span>Piety</span>
                <span className={piety >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {piety >= 0 ? '+' : ''}{piety.toFixed(0)}
                </span>
              </div>
              <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500"
                  style={{ width: `${((piety + 100) / 200) * 100}%` }}
                />
              </div>
            </div>
          )}
          {authority !== undefined && (
            <div>
              <div className="flex justify-between mb-1">
                <span>Papal Authority</span>
                <span className="text-amber-400">{authority.toFixed(0)}</span>
              </div>
              <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500"
                  style={{ width: `${authority}%` }}
                />
              </div>
            </div>
          )}
          {fervor !== undefined && (
            <div>
              <div className="flex justify-between mb-1">
                <span>Fervor</span>
                <span className="text-red-400">{fervor.toFixed(0)}</span>
              </div>
              <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500"
                  style={{ width: `${fervor}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tolerance */}
      <div className="bg-stone-700 rounded-lg p-4">
        <div className="text-xs text-stone-400 mb-2">Tolerance</div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>True Faith</span>
            <span className={toleranceOwn >= 0 ? 'text-green-400' : 'text-red-400'}>
              {toleranceOwn >= 0 ? '+' : ''}{toleranceOwn}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Heretics</span>
            <span className={toleranceHeretic >= 0 ? 'text-green-400' : 'text-red-400'}>
              {toleranceHeretic >= 0 ? '+' : ''}{toleranceHeretic}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Heathens</span>
            <span className={toleranceHeathen >= 0 ? 'text-green-400' : 'text-red-400'}>
              {toleranceHeathen >= 0 ? '+' : ''}{toleranceHeathen}
            </span>
          </div>
        </div>
      </div>

      {defendersOfFaith && (
        <div className="bg-amber-900/30 border border-amber-700 rounded-lg p-3 text-center">
          <span className="text-amber-100 font-medium">🛡️ Defender of the Faith</span>
        </div>
      )}
    </div>
  );

  const renderMechanics = () => (
    <div className="space-y-4">
      <div className="bg-stone-700 rounded-lg p-4">
        <h4 className="font-medium text-amber-100 mb-3">Missionary Strength</h4>
        <div className="text-2xl font-bold text-center text-green-400">
          +{missionaryStrength.toFixed(1)}%
        </div>
      </div>

      {currentReligion.mechanics && currentReligion.mechanics.length > 0 && (
        <div>
          <h4 className="text-xs text-stone-400 mb-2">Special Mechanics</h4>
          <div className="space-y-2">
            {currentReligion.mechanics.map((mechanic, i) => (
              <div key={i} className="bg-stone-700 rounded-lg p-3">
                <div className="font-medium text-amber-100 mb-1">{mechanic.name}</div>
                <p className="text-xs text-stone-300">{mechanic.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderConversion = () => {
    const religionGroups = ['christian', 'muslim', 'eastern', 'pagan'];

    return (
      <div className="space-y-4">
        <div className="bg-amber-900/30 border border-amber-700 rounded-lg p-3 text-sm text-amber-200">
          ⚠️ Converting to a new religion will cause stability loss and potential unrest.
        </div>

        {religionGroups.map(group => {
          const religions = getReligionsByGroup(group);
          if (religions.length === 0) return null;

          return (
            <div key={group}>
              <h4 className="text-xs text-stone-400 mb-2 capitalize flex items-center gap-2">
                <span>{getReligionIcon(group)}</span>
                {group}
              </h4>
              <div className="space-y-1">
                {religions.map(religion => (
                  <div
                    key={religion.id}
                    className={`bg-stone-700 rounded p-2 flex justify-between items-center ${
                      religion.id === currentReligion.id
                        ? 'ring-2 ring-amber-500'
                        : onConvert ? 'cursor-pointer hover:bg-stone-600' : ''
                    }`}
                    onClick={() => {
                      if (onConvert && religion.id !== currentReligion.id) {
                        onConvert(religion.id);
                      }
                    }}
                  >
                    <span className="text-sm">{religion.name}</span>
                    {religion.id === currentReligion.id && (
                      <span className="text-xs bg-green-700 text-white px-2 py-0.5 rounded">
                        Current
                      </span>
                    )}
                  </div>
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
      <div className="bg-stone-800 rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-stone-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-amber-100">⛪ Religion</h2>
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
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'mechanics' && renderMechanics()}
          {activeTab === 'conversion' && renderConversion()}
        </div>
      </div>
    </div>
  );
}
