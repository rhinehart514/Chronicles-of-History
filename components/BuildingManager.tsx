import React, { useState } from 'react';
import { Building, BUILDINGS, canConstruct } from '../data/buildings';

interface BuildingManagerProps {
  isOpen: boolean;
  onClose: () => void;
  provinceName: string;
  existingBuildings: string[];
  techLevel: number;
  provinceDev: number;
  isCoastal: boolean;
  isCapital: boolean;
  gold: number;
  constructionQueue: QueuedBuilding[];
  onConstruct: (buildingId: string) => void;
  onCancel: (queueIndex: number) => void;
  onDestroy: (buildingId: string) => void;
}

interface QueuedBuilding {
  buildingId: string;
  monthsRemaining: number;
}

export const BuildingManager: React.FC<BuildingManagerProps> = ({
  isOpen,
  onClose,
  provinceName,
  existingBuildings,
  techLevel,
  provinceDev,
  isCoastal,
  isCapital,
  gold,
  constructionQueue,
  onConstruct,
  onCancel,
  onDestroy
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = ['all', 'government', 'military', 'economic', 'religious', 'cultural'];

  const filteredBuildings = categoryFilter === 'all'
    ? BUILDINGS
    : BUILDINGS.filter(b => b.category === categoryFilter);

  const selected = BUILDINGS.find(b => b.id === selectedBuilding);
  const isBuilt = selectedBuilding ? existingBuildings.includes(selectedBuilding) : false;
  const isQueued = selectedBuilding
    ? constructionQueue.some(q => q.buildingId === selectedBuilding)
    : false;

  const totalMaintenance = existingBuildings.reduce((sum, id) => {
    const building = BUILDINGS.find(b => b.id === id);
    return sum + (building?.maintenance || 0);
  }, 0);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'government': return '🏛️';
      case 'military': return '⚔️';
      case 'economic': return '💰';
      case 'religious': return '⛪';
      case 'cultural': return '🎭';
      default: return '📋';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-stone-800">🏗️ Buildings - {provinceName}</h2>
            <div className="text-sm text-stone-500">
              {existingBuildings.length} buildings • {totalMaintenance} maintenance
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Construction queue */}
        {constructionQueue.length > 0 && (
          <div className="p-3 border-b border-stone-200 bg-amber-50">
            <h3 className="text-sm font-semibold text-stone-600 mb-2">Construction Queue</h3>
            <div className="flex gap-2 overflow-x-auto">
              {constructionQueue.map((queued, i) => {
                const building = BUILDINGS.find(b => b.id === queued.buildingId);
                return (
                  <div
                    key={i}
                    className="flex-shrink-0 p-2 bg-white rounded border border-stone-200"
                  >
                    <div className="flex items-center gap-2">
                      <span>{building?.icon}</span>
                      <div>
                        <div className="text-sm font-medium">{building?.name}</div>
                        <div className="text-xs text-stone-500">{queued.monthsRemaining} months</div>
                      </div>
                      <button
                        onClick={() => onCancel(i)}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Category filter */}
        <div className="p-2 border-b border-stone-200 flex gap-1 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded text-sm capitalize ${
                categoryFilter === cat ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-700'
              }`}
            >
              {cat === 'all' ? 'All' : `${getCategoryIcon(cat)} ${cat}`}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Building list */}
          <div className="w-1/2 border-r border-stone-200 overflow-y-auto p-3">
            <div className="space-y-2">
              {filteredBuildings.map(building => {
                const built = existingBuildings.includes(building.id);
                const queued = constructionQueue.some(q => q.buildingId === building.id);
                const check = canConstruct(
                  building, techLevel, provinceDev, isCoastal, isCapital, existingBuildings
                );
                const affordable = gold >= building.cost;

                return (
                  <button
                    key={building.id}
                    onClick={() => setSelectedBuilding(building.id)}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                      selectedBuilding === building.id
                        ? 'border-amber-500 bg-amber-50'
                        : built
                        ? 'border-green-300 bg-green-50'
                        : queued
                        ? 'border-blue-300 bg-blue-50'
                        : check.canBuild && affordable
                        ? 'border-stone-200 bg-white'
                        : 'border-stone-200 bg-stone-100 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{building.icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-stone-800">{building.name}</div>
                        <div className="text-xs text-stone-500">{building.category}</div>
                      </div>
                      {built && <span className="text-green-500">✓</span>}
                      {queued && <span className="text-blue-500">🔨</span>}
                    </div>
                    {!built && !queued && (
                      <div className="text-xs">
                        <span className={affordable ? 'text-amber-600' : 'text-red-600'}>
                          {building.cost} gold
                        </span>
                        <span className="text-stone-400"> • </span>
                        <span className="text-stone-500">{building.time} months</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected building details */}
          <div className="w-1/2 p-4 overflow-y-auto">
            {selected ? (
              <>
                <div className="text-center mb-4">
                  <span className="text-4xl">{selected.icon}</span>
                  <h3 className="font-bold text-stone-800 mt-2">{selected.name}</h3>
                  <p className="text-sm text-stone-600">{selected.description}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  <div className="p-2 bg-amber-50 rounded">
                    <div className="text-xs text-stone-500">Cost</div>
                    <div className="font-bold text-amber-600">{selected.cost}</div>
                  </div>
                  <div className="p-2 bg-blue-50 rounded">
                    <div className="text-xs text-stone-500">Time</div>
                    <div className="font-bold text-blue-600">{selected.time}mo</div>
                  </div>
                  <div className="p-2 bg-red-50 rounded">
                    <div className="text-xs text-stone-500">Maint</div>
                    <div className="font-bold text-red-600">{selected.maintenance}</div>
                  </div>
                </div>

                {/* Effects */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-stone-600 mb-2">Effects</h4>
                  <div className="space-y-1">
                    {selected.effects.map((effect, i) => (
                      <div
                        key={i}
                        className={`text-sm p-2 rounded ${
                          effect.value > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {effect.description}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                {selected.requirements.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-stone-600 mb-2">Requirements</h4>
                    <div className="space-y-1 text-xs">
                      {selected.requirements.map((req, i) => {
                        let met = false;
                        if (req.type === 'tech') met = techLevel >= (req.value as number);
                        if (req.type === 'development') met = provinceDev >= (req.value as number);
                        if (req.type === 'coastal') met = isCoastal;
                        if (req.type === 'capital') met = isCapital;

                        return (
                          <div key={i} className={met ? 'text-green-600' : 'text-red-600'}>
                            {met ? '✓' : '✗'} {req.type}: {String(req.value)}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Upgrade info */}
                {selected.upgradeTo && (
                  <div className="mb-4 p-2 bg-purple-50 rounded text-sm text-purple-700">
                    Upgrades to: {BUILDINGS.find(b => b.id === selected.upgradeTo)?.name}
                  </div>
                )}

                {/* Action buttons */}
                {isBuilt ? (
                  <button
                    onClick={() => onDestroy(selected.id)}
                    className="w-full py-3 bg-red-600 text-white rounded font-medium hover:bg-red-700"
                  >
                    Destroy Building
                  </button>
                ) : isQueued ? (
                  <div className="text-center py-3 bg-blue-100 text-blue-700 rounded">
                    Under Construction
                  </div>
                ) : (
                  <button
                    onClick={() => onConstruct(selected.id)}
                    disabled={!canConstruct(selected, techLevel, provinceDev, isCoastal, isCapital, existingBuildings).canBuild || gold < selected.cost}
                    className={`w-full py-3 rounded font-medium ${
                      canConstruct(selected, techLevel, provinceDev, isCoastal, isCapital, existingBuildings).canBuild && gold >= selected.cost
                        ? 'bg-amber-600 text-white hover:bg-amber-700'
                        : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                    }`}
                  >
                    {gold < selected.cost
                      ? 'Cannot Afford'
                      : canConstruct(selected, techLevel, provinceDev, isCoastal, isCapital, existingBuildings).canBuild
                      ? `Build (${selected.cost} gold)`
                      : canConstruct(selected, techLevel, provinceDev, isCoastal, isCapital, existingBuildings).reason}
                  </button>
                )}
              </>
            ) : (
              <p className="text-center text-stone-500 py-8">
                Select a building to view details
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildingManager;
