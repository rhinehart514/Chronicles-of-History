import React, { useState } from 'react';

interface ArmyMovementProps {
  isOpen: boolean;
  onClose: () => void;
  armies: ArmyUnit[];
  selectedArmy: string | null;
  provinces: ProvinceNode[];
  movementSpeed: number;
  onMove: (armyId: string, path: string[]) => void;
  onMerge: (armyIds: string[]) => void;
  onSplit: (armyId: string, percentage: number) => void;
  onAttach: (armyId: string, leaderId: string) => void;
}

interface ArmyUnit {
  id: string;
  name: string;
  owner: string;
  location: string;
  destination?: string;
  path: string[];
  strength: number;
  morale: number;
  movement: number;
  maxMovement: number;
  leader?: string;
  composition: {
    infantry: number;
    cavalry: number;
    artillery: number;
  };
}

interface ProvinceNode {
  id: string;
  name: string;
  terrain: string;
  owner: string;
  connections: string[];
  movementCost: number;
  attrition: number;
  supply: number;
}

export const ArmyMovement: React.FC<ArmyMovementProps> = ({
  isOpen,
  onClose,
  armies,
  selectedArmy,
  provinces,
  movementSpeed,
  onMove,
  onMerge,
  onSplit,
  onAttach
}) => {
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [splitPercent, setSplitPercent] = useState(50);
  const [mergeTargets, setMergeTargets] = useState<string[]>([]);

  if (!isOpen) return null;

  const army = armies.find(a => a.id === selectedArmy);
  const currentProvince = army
    ? provinces.find(p => p.id === army.location)
    : null;

  const adjacentProvinces = currentProvince
    ? provinces.filter(p => currentProvince.connections.includes(p.id))
    : [];

  const armiesInProvince = army
    ? armies.filter(a => a.location === army.location && a.id !== army.id)
    : [];

  const addToPath = (provinceId: string) => {
    const newPath = [...selectedPath, provinceId];
    setSelectedPath(newPath);
  };

  const clearPath = () => setSelectedPath([]);

  const handleMove = () => {
    if (army && selectedPath.length > 0) {
      onMove(army.id, selectedPath);
      clearPath();
    }
  };

  const handleSplit = () => {
    if (army && splitPercent > 0 && splitPercent < 100) {
      onSplit(army.id, splitPercent);
    }
  };

  const handleMerge = () => {
    if (army && mergeTargets.length > 0) {
      onMerge([army.id, ...mergeTargets]);
      setMergeTargets([]);
    }
  };

  const toggleMergeTarget = (armyId: string) => {
    if (mergeTargets.includes(armyId)) {
      setMergeTargets(mergeTargets.filter(id => id !== armyId));
    } else {
      setMergeTargets([...mergeTargets, armyId]);
    }
  };

  const calculatePathCost = () => {
    let cost = 0;
    for (const provinceId of selectedPath) {
      const province = provinces.find(p => p.id === provinceId);
      if (province) {
        cost += province.movementCost;
      }
    }
    return cost;
  };

  const canMove = army && selectedPath.length > 0 && calculatePathCost() <= army.movement;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-stone-800">🚶 Army Movement</h2>
            <div className="text-sm text-stone-500">
              {army ? army.name : 'No army selected'}
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {army ? (
          <>
            {/* Army info */}
            <div className="p-4 border-b border-stone-200 bg-stone-100">
              <div className="grid grid-cols-4 gap-4 text-center mb-3">
                <div>
                  <div className="text-xs text-stone-500">Strength</div>
                  <div className="font-bold">{army.strength.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-stone-500">Morale</div>
                  <div className="font-bold">{(army.morale * 100).toFixed(0)}%</div>
                </div>
                <div>
                  <div className="text-xs text-stone-500">Movement</div>
                  <div className="font-bold">{army.movement}/{army.maxMovement}</div>
                </div>
                <div>
                  <div className="text-xs text-stone-500">Speed</div>
                  <div className="font-bold">{movementSpeed}</div>
                </div>
              </div>

              <div className="flex justify-around text-sm">
                <span>⚔️ {army.composition.infantry}</span>
                <span>🐎 {army.composition.cavalry}</span>
                <span>💥 {army.composition.artillery}</span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Current location */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-stone-600 mb-2">Current Location</h3>
                <div className="p-3 bg-white rounded-lg border border-stone-200">
                  <div className="font-medium">{currentProvince?.name}</div>
                  <div className="text-xs text-stone-500">
                    {currentProvince?.terrain} • Supply: {currentProvince?.supply}
                  </div>
                </div>
              </div>

              {/* Path selection */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold text-stone-600">Movement Path</h3>
                  {selectedPath.length > 0 && (
                    <button
                      onClick={clearPath}
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {selectedPath.length > 0 ? (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {selectedPath.map((pid, i) => {
                        const prov = provinces.find(p => p.id === pid);
                        return (
                          <React.Fragment key={pid}>
                            {i > 0 && <span className="text-stone-400">→</span>}
                            <span className="px-2 py-1 bg-white rounded text-sm">
                              {prov?.name}
                            </span>
                          </React.Fragment>
                        );
                      })}
                    </div>
                    <div className="text-xs text-stone-600">
                      Cost: {calculatePathCost()} / {army.movement} movement
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-stone-500">Click adjacent provinces to build path</p>
                )}
              </div>

              {/* Adjacent provinces */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-stone-600 mb-2">Adjacent Provinces</h3>
                <div className="grid grid-cols-2 gap-2">
                  {adjacentProvinces.map(province => (
                    <button
                      key={province.id}
                      onClick={() => addToPath(province.id)}
                      className="p-3 bg-white rounded-lg border border-stone-200 text-left hover:bg-stone-50"
                    >
                      <div className="font-medium text-sm">{province.name}</div>
                      <div className="text-xs text-stone-500">
                        {province.terrain} • Cost: {province.movementCost}
                      </div>
                      {province.owner !== army.owner && (
                        <div className="text-xs text-red-600">Enemy territory</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Armies in province */}
              {armiesInProvince.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-stone-600 mb-2">Other Armies Here</h3>
                  <div className="space-y-2">
                    {armiesInProvince.map(other => (
                      <label
                        key={other.id}
                        className="flex items-center gap-2 p-2 bg-white rounded border border-stone-200"
                      >
                        <input
                          type="checkbox"
                          checked={mergeTargets.includes(other.id)}
                          onChange={() => toggleMergeTarget(other.id)}
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium">{other.name}</div>
                          <div className="text-xs text-stone-500">
                            {other.strength.toLocaleString()} troops
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {mergeTargets.length > 0 && (
                    <button
                      onClick={handleMerge}
                      className="w-full mt-2 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                    >
                      Merge Selected Armies
                    </button>
                  )}
                </div>
              )}

              {/* Split army */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-stone-600 mb-2">Split Army</h3>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="10"
                    max="90"
                    step="10"
                    value={splitPercent}
                    onChange={(e) => setSplitPercent(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm w-12">{splitPercent}%</span>
                  <button
                    onClick={handleSplit}
                    className="px-3 py-1 bg-stone-600 text-white rounded text-sm hover:bg-stone-700"
                  >
                    Split
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-stone-300">
              <button
                onClick={handleMove}
                disabled={!canMove}
                className={`w-full py-3 rounded font-medium ${
                  canMove
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                }`}
              >
                {canMove
                  ? `Move Army (${calculatePathCost()} movement)`
                  : selectedPath.length === 0
                  ? 'Select Destination'
                  : 'Not Enough Movement'}
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-stone-500">
            Select an army to manage movement
          </div>
        )}
      </div>
    </div>
  );
};

export default ArmyMovement;
