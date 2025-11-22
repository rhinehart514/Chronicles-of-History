import React, { useState } from 'react';
import {
  Rebellion,
  RebelType,
  UnrestFactor,
  REBEL_TYPES,
  getRebelType,
  calculateRebellionProgress,
  getUnrestSeverity,
  getUnrestColor,
  calculateHarshTreatmentCost
} from '../data/rebellionSystem';

interface RebellionTrackerProps {
  rebellions: Rebellion[];
  provinces: ProvinceUnrest[];
  militaryPower: number;
  onClose: () => void;
  onSuppress?: (rebellionId: string) => void;
  onAcceptDemands?: (rebellionId: string) => void;
}

interface ProvinceUnrest {
  id: string;
  name: string;
  unrest: number;
  factors: UnrestFactor[];
  rebelProgress: number;
  potentialRebelType?: string;
}

type TabType = 'active' | 'potential' | 'provinces';

export default function RebellionTracker({
  rebellions,
  provinces,
  militaryPower,
  onClose,
  onSuppress,
  onAcceptDemands
}: RebellionTrackerProps) {
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [selectedProvince, setSelectedProvince] = useState<ProvinceUnrest | null>(null);

  const tabs: { id: TabType; label: string; count: number }[] = [
    { id: 'active', label: 'Active', count: rebellions.length },
    { id: 'potential', label: 'Brewing', count: provinces.filter(p => p.rebelProgress > 50).length },
    { id: 'provinces', label: 'Provinces', count: provinces.filter(p => p.unrest > 0).length }
  ];

  const sortedProvinces = [...provinces].sort((a, b) => b.unrest - a.unrest);

  const renderActive = () => (
    <div className="space-y-3">
      {rebellions.length === 0 ? (
        <div className="text-center py-8 text-stone-400">
          <div className="text-3xl mb-2">☮️</div>
          <div>No active rebellions</div>
        </div>
      ) : (
        rebellions.map(rebellion => {
          const rebelType = getRebelType(rebellion.type.id);
          const suppressCost = calculateHarshTreatmentCost(militaryPower, rebellion.strength);

          return (
            <div key={rebellion.id} className="bg-stone-700 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{rebelType?.icon || '🏴'}</span>
                  <div>
                    <h3 className="font-semibold text-amber-100">{rebellion.name}</h3>
                    <div className="text-xs text-stone-400">{rebelType?.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-red-400">
                    {rebellion.strength.toLocaleString()}
                  </div>
                  <div className="text-xs text-stone-400">Strength</div>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-xs text-stone-400 mb-1">
                  <span>Uprising Progress</span>
                  <span>{rebellion.progress}%</span>
                </div>
                <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500"
                    style={{ width: `${rebellion.progress}%` }}
                  />
                </div>
              </div>

              <div className="text-xs text-stone-400 mb-3">
                Provinces: {rebellion.provinces.length} •
                {rebellion.leader && ` Leader: ${rebellion.leader.name}`}
              </div>

              <div className="mb-3">
                <div className="text-xs text-stone-400 mb-1">Demands:</div>
                <div className="space-y-1">
                  {rebellion.demands.map(demand => (
                    <div
                      key={demand.id}
                      className="text-xs bg-red-900/30 px-2 py-1 rounded"
                    >
                      {demand.name}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                {onSuppress && (
                  <button
                    onClick={() => onSuppress(rebellion.id)}
                    disabled={militaryPower < suppressCost}
                    className={`flex-1 px-3 py-2 text-xs rounded ${
                      militaryPower >= suppressCost
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-stone-600 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    Suppress ({suppressCost} MIL)
                  </button>
                )}
                {onAcceptDemands && (
                  <button
                    onClick={() => onAcceptDemands(rebellion.id)}
                    className="flex-1 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs rounded"
                  >
                    Accept Demands
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );

  const renderPotential = () => {
    const brewingRebellions = provinces.filter(p => p.rebelProgress > 50);

    return (
      <div className="space-y-2">
        {brewingRebellions.length === 0 ? (
          <div className="text-center py-8 text-stone-400">
            <div className="text-3xl mb-2">✨</div>
            <div>No brewing rebellions</div>
          </div>
        ) : (
          brewingRebellions.map(province => {
            const rebelType = province.potentialRebelType
              ? getRebelType(province.potentialRebelType)
              : null;

            return (
              <div key={province.id} className="bg-stone-700 rounded p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium text-amber-100">{province.name}</div>
                    <div className="text-xs text-stone-400">
                      {rebelType?.name || 'Unknown rebels'}
                    </div>
                  </div>
                  <span className="text-xl">{rebelType?.icon || '❓'}</span>
                </div>

                <div className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-stone-400">Progress to uprising</span>
                    <span className={province.rebelProgress >= 80 ? 'text-red-400' : 'text-amber-400'}>
                      {province.rebelProgress}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        province.rebelProgress >= 80 ? 'bg-red-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${province.rebelProgress}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-stone-400">Unrest</span>
                  <span className={getUnrestColor(province.unrest)}>
                    {province.unrest.toFixed(1)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  };

  const renderProvinces = () => (
    <div className="space-y-2">
      {sortedProvinces.filter(p => p.unrest > 0).length === 0 ? (
        <div className="text-center py-8 text-stone-400">
          <div className="text-3xl mb-2">😊</div>
          <div>All provinces are calm</div>
        </div>
      ) : (
        sortedProvinces.filter(p => p.unrest > 0).map(province => (
          <button
            key={province.id}
            onClick={() => setSelectedProvince(
              selectedProvince?.id === province.id ? null : province
            )}
            className={`w-full text-left bg-stone-700 rounded p-3 transition-colors ${
              selectedProvince?.id === province.id
                ? 'ring-1 ring-amber-500'
                : 'hover:bg-stone-600'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-amber-100">{province.name}</span>
              <span className={`font-bold ${getUnrestColor(province.unrest)}`}>
                {province.unrest.toFixed(1)}
              </span>
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-stone-400">
                {getUnrestSeverity(province.unrest)}
              </span>
              <span className="text-stone-400">
                {province.rebelProgress}% progress
              </span>
            </div>

            {selectedProvince?.id === province.id && (
              <div className="mt-3 pt-3 border-t border-stone-600">
                <div className="text-xs text-stone-400 mb-2">Unrest Factors:</div>
                <div className="space-y-1">
                  {province.factors.map((factor, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span className="text-stone-300">{factor.source}</span>
                      <span className={factor.value > 0 ? 'text-red-400' : 'text-green-400'}>
                        {factor.value > 0 ? '+' : ''}{factor.value.toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </button>
        ))
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-stone-800 rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-stone-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-amber-100">🏴 Rebellion Tracker</h2>
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
                    activeTab === tab.id ? 'bg-amber-600' : 'bg-stone-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          {activeTab === 'active' && renderActive()}
          {activeTab === 'potential' && renderPotential()}
          {activeTab === 'provinces' && renderProvinces()}
        </div>

        <div className="p-3 border-t border-stone-700 bg-stone-700/50">
          <div className="text-xs text-stone-400">
            Military Power: <span className="text-amber-400">{militaryPower}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
