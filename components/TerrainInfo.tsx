import React, { useState } from 'react';
import {
  TerrainType,
  TERRAIN_TYPES,
  TERRAIN_COMBAT_MODIFIERS,
  getTerrainType
} from '../data/terrainTypes';

interface TerrainInfoProps {
  selectedTerrain?: string;
  onClose: () => void;
}

export default function TerrainInfo({
  selectedTerrain,
  onClose
}: TerrainInfoProps) {
  const [activeTerrain, setActiveTerrain] = useState<string>(
    selectedTerrain || TERRAIN_TYPES[0].id
  );

  const terrain = getTerrainType(activeTerrain);
  const combatMod = TERRAIN_COMBAT_MODIFIERS.find(m => m.terrainId === activeTerrain);

  if (!terrain) return null;

  const getModifierColor = (value: number) => {
    if (value > 0) return 'text-green-400';
    if (value < 0) return 'text-red-400';
    return 'text-stone-400';
  };

  const formatModifier = (value: number) => {
    if (value === 0) return '0';
    return value > 0 ? `+${value}` : value.toString();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-stone-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-stone-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-amber-100">🗺️ Terrain Types</h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Terrain list */}
          <div className="w-48 border-r border-stone-700 overflow-y-auto">
            {TERRAIN_TYPES.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTerrain(t.id)}
                className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-colors ${
                  activeTerrain === t.id
                    ? 'bg-amber-900/30 text-amber-100'
                    : 'text-stone-300 hover:bg-stone-700'
                }`}
              >
                <span
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: t.color }}
                />
                <span>{t.icon}</span>
                <span>{t.name}</span>
              </button>
            ))}
          </div>

          {/* Terrain details */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{terrain.icon}</span>
              <div>
                <h3 className="text-xl font-bold text-amber-100">{terrain.name}</h3>
                <p className="text-sm text-stone-400">{terrain.description}</p>
              </div>
            </div>

            {/* Basic stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-stone-700 rounded p-3">
                <div className="text-sm text-stone-400">Movement Cost</div>
                <div className={`text-lg font-bold ${
                  terrain.movementCost <= 1 ? 'text-green-400' :
                  terrain.movementCost <= 1.5 ? 'text-amber-400' : 'text-red-400'
                }`}>
                  ×{terrain.movementCost}
                </div>
              </div>
              <div className="bg-stone-700 rounded p-3">
                <div className="text-sm text-stone-400">Combat Width</div>
                <div className="text-lg font-bold text-blue-400">{terrain.combatWidth}</div>
              </div>
              <div className="bg-stone-700 rounded p-3">
                <div className="text-sm text-stone-400">Defender Bonus</div>
                <div className={`text-lg font-bold ${
                  terrain.defenderBonus > 0 ? 'text-green-400' : 'text-stone-400'
                }`}>
                  +{terrain.defenderBonus}
                </div>
              </div>
              <div className="bg-stone-700 rounded p-3">
                <div className="text-sm text-stone-400">Supply Limit</div>
                <div className={`text-lg font-bold ${
                  terrain.supplyLimit >= 7 ? 'text-green-400' :
                  terrain.supplyLimit >= 5 ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {terrain.supplyLimit}
                </div>
              </div>
            </div>

            {/* Development modifiers */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-stone-300 mb-2">Development Modifiers</h4>
              <div className="bg-stone-700 rounded p-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Tax:</span>
                    <span className={getModifierColor(terrain.development.taxModifier)}>
                      {formatModifier(terrain.development.taxModifier)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Production:</span>
                    <span className={getModifierColor(terrain.development.productionModifier)}>
                      {formatModifier(terrain.development.productionModifier)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Manpower:</span>
                    <span className={getModifierColor(terrain.development.manpowerModifier)}>
                      {formatModifier(terrain.development.manpowerModifier)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Build Cost:</span>
                    <span className={getModifierColor(-terrain.development.buildCostModifier)}>
                      {formatModifier(terrain.development.buildCostModifier)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Combat modifiers */}
            {combatMod && (
              <div>
                <h4 className="text-sm font-medium text-stone-300 mb-2">Combat Modifiers</h4>
                <div className="bg-stone-700 rounded p-3">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-xs text-stone-400 mb-1">Infantry</div>
                      <div className={`text-lg font-bold ${getModifierColor(combatMod.infantryModifier)}`}>
                        {formatModifier(combatMod.infantryModifier)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-stone-400 mb-1">Cavalry</div>
                      <div className={`text-lg font-bold ${getModifierColor(combatMod.cavalryModifier)}`}>
                        {formatModifier(combatMod.cavalryModifier)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-stone-400 mb-1">Artillery</div>
                      <div className={`text-lg font-bold ${getModifierColor(combatMod.artilleryModifier)}`}>
                        {formatModifier(combatMod.artilleryModifier)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="mt-4 bg-amber-900/20 border border-amber-700/50 rounded p-3">
              <h4 className="text-sm font-medium text-amber-100 mb-1">Strategic Tips</h4>
              <p className="text-xs text-stone-400">
                {terrain.defenderBonus >= 2
                  ? 'Excellent defensive terrain. Lure enemies here for battles.'
                  : terrain.development.taxModifier > 0
                  ? 'High development potential. Prioritize for your capital region.'
                  : terrain.movementCost >= 1.8
                  ? 'Difficult to traverse. Plan supply lines carefully.'
                  : terrain.supplyLimit <= 4
                  ? 'Low supply limits. Keep armies small or risk attrition.'
                  : 'Balanced terrain with no major advantages or disadvantages.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
