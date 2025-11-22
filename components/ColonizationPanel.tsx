import React, { useState } from 'react';

interface ColonizationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  colonists: ColonistInfo[];
  colonies: Colony[];
  availableProvinces: ColonizableProvince[];
  monthlyGold: number;
  globalSettlerChance: number;
  onStartColony: (provinceId: string, colonistId: string) => void;
  onAbandonColony: (colonyId: string) => void;
  onRecallColonist: (colonistId: string) => void;
}

interface ColonistInfo {
  id: string;
  source: string;
  status: 'available' | 'colonizing' | 'returning';
  targetColony?: string;
}

interface Colony {
  id: string;
  provinceId: string;
  name: string;
  population: number;
  targetPopulation: number;
  monthlyGrowth: number;
  nativeHostility: number;
  terrain: string;
  climate: string;
  tradeGood: string;
}

interface ColonizableProvince {
  id: string;
  name: string;
  terrain: string;
  climate: string;
  tradeGood: string;
  natives: number;
  nativeAggressiveness: number;
  distance: number;
  baseTax: number;
  production: number;
  manpower: number;
}

export const ColonizationPanel: React.FC<ColonizationPanelProps> = ({
  isOpen,
  onClose,
  colonists,
  colonies,
  availableProvinces,
  monthlyGold,
  globalSettlerChance,
  onStartColony,
  onAbandonColony,
  onRecallColonist
}) => {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'trade' | 'development' | 'safe'>('all');

  if (!isOpen) return null;

  const availableColonists = colonists.filter(c => c.status === 'available');

  const filteredProvinces = availableProvinces.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'trade') return p.tradeGood !== 'Unknown';
    if (filter === 'development') return p.baseTax + p.production + p.manpower >= 6;
    if (filter === 'safe') return p.nativeAggressiveness <= 3;
    return true;
  });

  const selected = availableProvinces.find(p => p.id === selectedProvince);

  const getTradeGoodIcon = (good: string) => {
    const icons: Record<string, string> = {
      'Grain': '🌾', 'Fish': '🐟', 'Fur': '🦊', 'Gold': '🥇', 'Silver': '🥈',
      'Sugar': '🍬', 'Tobacco': '🚬', 'Cotton': '🧵', 'Coffee': '☕', 'Ivory': '🐘',
      'Spices': '🌶️', 'Tea': '🍵', 'Silk': '🧣', 'Unknown': '❓'
    };
    return icons[good] || '📦';
  };

  const getClimateColor = (climate: string) => {
    switch (climate) {
      case 'temperate': return 'text-green-600';
      case 'tropical': return 'text-amber-600';
      case 'arid': return 'text-orange-600';
      case 'arctic': return 'text-blue-600';
      default: return 'text-stone-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-stone-800">🌍 Colonization</h2>
            <div className="text-sm text-stone-500">
              {availableColonists.length} colonists available • {colonies.length} active colonies
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Stats */}
        <div className="p-3 border-b border-stone-200 bg-stone-100 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs text-stone-500">Colonial Maintenance</div>
            <div className="font-bold text-red-600">-{monthlyGold}/month</div>
          </div>
          <div>
            <div className="text-xs text-stone-500">Global Settler Chance</div>
            <div className="font-bold text-green-600">+{globalSettlerChance}%</div>
          </div>
          <div>
            <div className="text-xs text-stone-500">Active Colonies</div>
            <div className="font-bold text-stone-800">{colonies.length}</div>
          </div>
        </div>

        {/* Active colonies */}
        {colonies.length > 0 && (
          <div className="p-3 border-b border-stone-200">
            <h3 className="text-sm font-semibold text-stone-600 mb-2">Active Colonies</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {colonies.map(colony => (
                <div
                  key={colony.id}
                  className="flex-shrink-0 p-3 bg-white rounded-lg border border-stone-200 w-48"
                >
                  <div className="font-semibold text-stone-800 text-sm mb-1">{colony.name}</div>
                  <div className="text-xs text-stone-500 mb-2">
                    {getTradeGoodIcon(colony.tradeGood)} {colony.tradeGood}
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-2 mb-1">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(colony.population / colony.targetPopulation) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-stone-500">
                    {colony.population}/{colony.targetPopulation} (+{colony.monthlyGrowth}/mo)
                  </div>
                  <button
                    onClick={() => onAbandonColony(colony.id)}
                    className="mt-2 text-xs text-red-600 hover:text-red-800"
                  >
                    Abandon
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="p-2 border-b border-stone-200 flex gap-1">
          {['all', 'trade', 'development', 'safe'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-3 py-1 rounded text-sm capitalize ${
                filter === f ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-700'
              }`}
            >
              {f === 'trade' ? 'Good Trade Goods' :
               f === 'development' ? 'High Dev' :
               f === 'safe' ? 'Low Hostility' : 'All'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Province list */}
          <div className="w-1/2 border-r border-stone-200 overflow-y-auto p-3">
            {filteredProvinces.length === 0 ? (
              <p className="text-center text-stone-500 py-8">No provinces available</p>
            ) : (
              <div className="space-y-2">
                {filteredProvinces.map(province => (
                  <button
                    key={province.id}
                    onClick={() => setSelectedProvince(province.id)}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                      selectedProvince === province.id
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-stone-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-stone-800 text-sm">{province.name}</span>
                      <span className="text-lg">{getTradeGoodIcon(province.tradeGood)}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-stone-500">
                        Dev: {province.baseTax + province.production + province.manpower}
                      </div>
                      <div className={getClimateColor(province.climate)}>
                        {province.climate}
                      </div>
                      <div className={province.nativeAggressiveness > 5 ? 'text-red-600' : 'text-stone-500'}>
                        Risk: {province.nativeAggressiveness}/10
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Province details */}
          <div className="w-1/2 p-4 overflow-y-auto">
            {selected ? (
              <>
                <div className="text-center mb-4">
                  <span className="text-4xl">{getTradeGoodIcon(selected.tradeGood)}</span>
                  <h3 className="font-bold text-stone-800 mt-2">{selected.name}</h3>
                  <p className="text-sm text-stone-600">{selected.tradeGood}</p>
                </div>

                {/* Province stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-2 bg-stone-100 rounded text-center">
                    <div className="text-xs text-stone-500">Terrain</div>
                    <div className="font-medium capitalize">{selected.terrain}</div>
                  </div>
                  <div className="p-2 bg-stone-100 rounded text-center">
                    <div className="text-xs text-stone-500">Climate</div>
                    <div className={`font-medium capitalize ${getClimateColor(selected.climate)}`}>
                      {selected.climate}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  <div className="p-2 bg-amber-50 rounded">
                    <div className="text-xs text-stone-500">Tax</div>
                    <div className="font-bold text-amber-600">{selected.baseTax}</div>
                  </div>
                  <div className="p-2 bg-blue-50 rounded">
                    <div className="text-xs text-stone-500">Prod</div>
                    <div className="font-bold text-blue-600">{selected.production}</div>
                  </div>
                  <div className="p-2 bg-red-50 rounded">
                    <div className="text-xs text-stone-500">Man</div>
                    <div className="font-bold text-red-600">{selected.manpower}</div>
                  </div>
                </div>

                {/* Native info */}
                <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="text-sm font-semibold text-orange-800 mb-2">Native Population</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-stone-500">Population: </span>
                      <span>{selected.natives.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-stone-500">Hostility: </span>
                      <span className={selected.nativeAggressiveness > 5 ? 'text-red-600' : 'text-green-600'}>
                        {selected.nativeAggressiveness}/10
                      </span>
                    </div>
                  </div>
                </div>

                {/* Distance */}
                <div className="mb-4 text-sm">
                  <span className="text-stone-500">Distance from nearest core: </span>
                  <span className={selected.distance > 100 ? 'text-red-600' : 'text-stone-800'}>
                    {selected.distance} units
                  </span>
                </div>

                {/* Colonize button */}
                {availableColonists.length > 0 ? (
                  <button
                    onClick={() => onStartColony(selected.id, availableColonists[0].id)}
                    className="w-full py-3 bg-amber-600 text-white rounded font-medium hover:bg-amber-700"
                  >
                    Send Colonist
                  </button>
                ) : (
                  <div className="text-center py-3 bg-stone-100 text-stone-500 rounded">
                    No colonists available
                  </div>
                )}
              </>
            ) : (
              <p className="text-center text-stone-500 py-8">
                Select a province to view details
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColonizationPanel;
