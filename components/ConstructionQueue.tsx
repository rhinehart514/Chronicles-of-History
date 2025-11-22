import React, { useState } from 'react';

export interface QueuedConstruction {
  id: string;
  buildingType: string;
  buildingName: string;
  icon: string;
  province: string;
  progress: number;
  totalTime: number;
  cost: number;
}

export interface AvailableBuilding {
  id: string;
  name: string;
  icon: string;
  category: string;
  cost: number;
  time: number;
  effects: string[];
  requirements?: string[];
  limit?: number;
  currentCount?: number;
}

interface ConstructionQueueProps {
  isOpen: boolean;
  onClose: () => void;
  queue: QueuedConstruction[];
  availableBuildings: AvailableBuilding[];
  selectedProvince: string | null;
  treasury: number;
  onStartConstruction: (buildingId: string, province: string) => void;
  onCancelConstruction: (queueId: string) => void;
  onReorderQueue: (queueId: string, direction: 'up' | 'down') => void;
}

export const ConstructionQueue: React.FC<ConstructionQueueProps> = ({
  isOpen,
  onClose,
  queue,
  availableBuildings,
  selectedProvince,
  treasury,
  onStartConstruction,
  onCancelConstruction,
  onReorderQueue
}) => {
  const [tab, setTab] = useState<'queue' | 'build'>('queue');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  if (!isOpen) return null;

  const categories = [...new Set(availableBuildings.map(b => b.category))];

  const filteredBuildings = categoryFilter === 'all'
    ? availableBuildings
    : availableBuildings.filter(b => b.category === categoryFilter);

  const totalQueueCost = queue.reduce((sum, item) => sum + item.cost, 0);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-stone-800">🏗️ Construction</h2>
            <div className="text-sm text-stone-500">
              {queue.length} project{queue.length !== 1 ? 's' : ''} in queue
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="p-2 border-b border-stone-200 flex gap-2">
          <button
            onClick={() => setTab('queue')}
            className={`px-4 py-2 rounded text-sm font-medium ${
              tab === 'queue'
                ? 'bg-amber-600 text-white'
                : 'bg-stone-200 text-stone-700'
            }`}
          >
            Queue ({queue.length})
          </button>
          <button
            onClick={() => setTab('build')}
            className={`px-4 py-2 rounded text-sm font-medium ${
              tab === 'build'
                ? 'bg-amber-600 text-white'
                : 'bg-stone-200 text-stone-700'
            }`}
          >
            Available Buildings
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {tab === 'queue' && (
            queue.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-4xl">🏗️</span>
                <p className="text-stone-500 mt-2">No construction in progress</p>
                <p className="text-sm text-stone-400">Select a province and start building!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {queue.map((item, index) => (
                  <div key={item.id} className="bg-stone-100 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <div className="font-semibold text-stone-800">{item.buildingName}</div>
                          <div className="text-xs text-stone-500">{item.province}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {index > 0 && (
                          <button
                            onClick={() => onReorderQueue(item.id, 'up')}
                            className="p-1 text-stone-400 hover:text-stone-600"
                          >
                            ▲
                          </button>
                        )}
                        {index < queue.length - 1 && (
                          <button
                            onClick={() => onReorderQueue(item.id, 'down')}
                            className="p-1 text-stone-400 hover:text-stone-600"
                          >
                            ▼
                          </button>
                        )}
                        <button
                          onClick={() => onCancelConstruction(item.id)}
                          className="p-1 text-red-400 hover:text-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-stone-500">Progress</span>
                        <span className="text-stone-600">
                          {item.progress}/{item.totalTime} months
                        </span>
                      </div>
                      <div className="w-full bg-stone-200 rounded-full h-2">
                        <div
                          className="bg-amber-500 h-2 rounded-full transition-all"
                          style={{ width: `${(item.progress / item.totalTime) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-xs text-amber-600">
                      Cost: {item.cost}💰
                    </div>
                  </div>
                ))}

                {/* Total cost */}
                <div className="bg-amber-100 rounded-lg p-3 flex justify-between items-center">
                  <span className="font-medium text-amber-800">Total Queue Cost</span>
                  <span className="font-bold text-amber-600">{totalQueueCost}💰</span>
                </div>
              </div>
            )
          )}

          {tab === 'build' && (
            <>
              {/* Category filter */}
              <div className="flex gap-2 mb-4 flex-wrap">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-3 py-1 rounded text-sm ${
                    categoryFilter === 'all' ? 'bg-stone-600 text-white' : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1 rounded text-sm ${
                      categoryFilter === cat ? 'bg-stone-600 text-white' : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {!selectedProvince && (
                <div className="bg-amber-100 rounded-lg p-3 mb-4 text-sm text-amber-700">
                  ⚠️ Select a province on the map to build there
                </div>
              )}

              {/* Buildings list */}
              <div className="space-y-3">
                {filteredBuildings.map(building => {
                  const canAfford = treasury >= building.cost;
                  const atLimit = building.limit !== undefined &&
                    building.currentCount !== undefined &&
                    building.currentCount >= building.limit;

                  return (
                    <div
                      key={building.id}
                      className={`rounded-lg p-4 border ${
                        canAfford && !atLimit
                          ? 'border-stone-200 bg-white'
                          : 'border-stone-200 bg-stone-100 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{building.icon}</span>
                          <div>
                            <div className="font-semibold text-stone-800">{building.name}</div>
                            <div className="text-xs text-stone-500">{building.category}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => selectedProvince && onStartConstruction(building.id, selectedProvince)}
                          disabled={!canAfford || atLimit || !selectedProvince}
                          className={`px-3 py-1 rounded text-sm ${
                            canAfford && !atLimit && selectedProvince
                              ? 'bg-amber-600 text-white hover:bg-amber-700'
                              : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                          }`}
                        >
                          Build
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-2">
                        {building.effects.map((effect, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs"
                          >
                            {effect}
                          </span>
                        ))}
                      </div>

                      <div className="flex justify-between text-xs text-stone-500">
                        <span>Cost: {building.cost}💰 • Time: {building.time} months</span>
                        {building.limit !== undefined && (
                          <span>
                            {building.currentCount}/{building.limit} built
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConstructionQueue;
