import React, { useState } from 'react';

export interface Province {
  id: string;
  name: string;
  owner: string;
  controller: string;
  terrain: 'plains' | 'forest' | 'mountains' | 'desert' | 'marsh' | 'coastal';
  climate: 'temperate' | 'tropical' | 'arid' | 'arctic';
  development: {
    tax: number;
    production: number;
    manpower: number;
  };
  population: number;
  religion: string;
  culture: string;
  resources: string[];
  buildings: string[];
  unrest: number;
  autonomy: number;
  fortLevel: number;
  isCapital: boolean;
  isCoastal: boolean;
  tradeGood: string;
}

interface ProvinceDetailProps {
  isOpen: boolean;
  onClose: () => void;
  province: Province;
  isOwned: boolean;
  treasury: number;
  onDevelop: (type: 'tax' | 'production' | 'manpower') => void;
  onBuildFort: () => void;
  onChangeAutonomy: (delta: number) => void;
  onCoreProvince: () => void;
}

const TERRAIN_INFO: Record<Province['terrain'], { icon: string; effects: string[] }> = {
  plains: { icon: '🌾', effects: ['+10% Tax', '+Cavalry bonus'] },
  forest: { icon: '🌲', effects: ['+20% Manpower', 'Defensive bonus'] },
  mountains: { icon: '⛰️', effects: ['+30% Defense', '-Movement speed'] },
  desert: { icon: '🏜️', effects: ['-20% Tax', '+Attrition'] },
  marsh: { icon: '🌿', effects: ['-Supply limit', '+Disease risk'] },
  coastal: { icon: '🏖️', effects: ['+Trade', 'Naval access'] }
};

const CLIMATE_INFO: Record<Province['climate'], { icon: string; effect: string }> = {
  temperate: { icon: '🌤️', effect: 'Normal conditions' },
  tropical: { icon: '🌴', effect: '+Disease, +Production' },
  arid: { icon: '☀️', effect: '-Manpower growth' },
  arctic: { icon: '❄️', effect: '+Attrition, -Tax' }
};

export const ProvinceDetail: React.FC<ProvinceDetailProps> = ({
  isOpen,
  onClose,
  province,
  isOwned,
  treasury,
  onDevelop,
  onBuildFort,
  onChangeAutonomy,
  onCoreProvince
}) => {
  const [tab, setTab] = useState<'overview' | 'development' | 'buildings'>('overview');

  if (!isOpen) return null;

  const totalDev = province.development.tax + province.development.production + province.development.manpower;
  const devCost = Math.floor(50 * Math.pow(1.1, totalDev));
  const fortCost = (province.fortLevel + 1) * 200;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-stone-800">{province.name}</h2>
                {province.isCapital && <span className="text-amber-500">⭐</span>}
                {province.isCoastal && <span className="text-blue-500">⚓</span>}
              </div>
              <div className="text-sm text-stone-500">
                {province.owner} • {province.culture} • {province.religion}
              </div>
            </div>
            <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
              ×
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="p-2 border-b border-stone-200 flex gap-2">
          {(['overview', 'development', 'buildings'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded text-sm font-medium ${
                tab === t
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {tab === 'overview' && (
            <div className="space-y-4">
              {/* Terrain & Climate */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-stone-100 rounded p-3">
                  <h4 className="text-sm font-semibold text-stone-600 mb-2">Terrain</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{TERRAIN_INFO[province.terrain].icon}</span>
                    <div>
                      <div className="font-medium text-stone-800">
                        {province.terrain.charAt(0).toUpperCase() + province.terrain.slice(1)}
                      </div>
                      <div className="text-xs text-stone-500">
                        {TERRAIN_INFO[province.terrain].effects.join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-stone-100 rounded p-3">
                  <h4 className="text-sm font-semibold text-stone-600 mb-2">Climate</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{CLIMATE_INFO[province.climate].icon}</span>
                    <div>
                      <div className="font-medium text-stone-800">
                        {province.climate.charAt(0).toUpperCase() + province.climate.slice(1)}
                      </div>
                      <div className="text-xs text-stone-500">
                        {CLIMATE_INFO[province.climate].effect}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Population & Resources */}
              <div className="bg-stone-100 rounded p-3">
                <h4 className="text-sm font-semibold text-stone-600 mb-2">Demographics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-stone-500">Population</div>
                    <div className="font-bold text-stone-800">{province.population.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-stone-500">Trade Good</div>
                    <div className="font-bold text-amber-600">{province.tradeGood}</div>
                  </div>
                </div>
              </div>

              {/* Resources */}
              {province.resources.length > 0 && (
                <div className="bg-stone-100 rounded p-3">
                  <h4 className="text-sm font-semibold text-stone-600 mb-2">Resources</h4>
                  <div className="flex flex-wrap gap-2">
                    {province.resources.map(resource => (
                      <span key={resource} className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs">
                        {resource}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Unrest & Autonomy */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-stone-100 rounded p-3">
                  <h4 className="text-sm font-semibold text-stone-600 mb-2">Unrest</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-stone-300 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          province.unrest > 5 ? 'bg-red-500' : province.unrest > 2 ? 'bg-amber-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(100, province.unrest * 10)}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{province.unrest.toFixed(1)}</span>
                  </div>
                </div>
                <div className="bg-stone-100 rounded p-3">
                  <h4 className="text-sm font-semibold text-stone-600 mb-2">Autonomy</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-stone-300 rounded-full h-3">
                      <div
                        className="bg-purple-500 h-3 rounded-full"
                        style={{ width: `${province.autonomy}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{province.autonomy}%</span>
                  </div>
                  {isOwned && (
                    <div className="flex gap-1 mt-2">
                      <button
                        onClick={() => onChangeAutonomy(-10)}
                        className="flex-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
                        disabled={province.autonomy <= 0}
                      >
                        -10%
                      </button>
                      <button
                        onClick={() => onChangeAutonomy(10)}
                        className="flex-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200"
                        disabled={province.autonomy >= 100}
                      >
                        +10%
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Fort */}
              <div className="bg-stone-100 rounded p-3">
                <h4 className="text-sm font-semibold text-stone-600 mb-2">Fortifications</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-stone-800">
                      {province.fortLevel === 0 ? 'No Fort' : `Level ${province.fortLevel} Fort`}
                    </div>
                    <div className="text-xs text-stone-500">
                      {province.fortLevel === 0 ? 'No defensive bonus' : `+${province.fortLevel * 10}% Defense`}
                    </div>
                  </div>
                  {isOwned && (
                    <button
                      onClick={onBuildFort}
                      disabled={treasury < fortCost}
                      className={`px-3 py-1 rounded text-sm ${
                        treasury >= fortCost
                          ? 'bg-amber-600 text-white hover:bg-amber-700'
                          : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                      }`}
                    >
                      Upgrade ({fortCost}💰)
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {tab === 'development' && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-stone-800">{totalDev}</div>
                <div className="text-sm text-stone-500">Total Development</div>
              </div>

              {/* Development categories */}
              {(['tax', 'production', 'manpower'] as const).map(type => {
                const value = province.development[type];
                const icon = type === 'tax' ? '💰' : type === 'production' ? '⚙️' : '👥';
                const color = type === 'tax' ? 'amber' : type === 'production' ? 'blue' : 'green';

                return (
                  <div key={type} className="bg-stone-100 rounded p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{icon}</span>
                        <span className="font-semibold text-stone-800">
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </span>
                      </div>
                      <span className={`text-xl font-bold text-${color}-600`}>{value}</span>
                    </div>

                    <div className="w-full bg-stone-300 rounded-full h-4 mb-2">
                      <div
                        className={`bg-${color}-500 h-4 rounded-full`}
                        style={{ width: `${Math.min(100, value * 3)}%` }}
                      />
                    </div>

                    {isOwned && (
                      <button
                        onClick={() => onDevelop(type)}
                        disabled={treasury < devCost}
                        className={`w-full py-2 rounded text-sm font-medium ${
                          treasury >= devCost
                            ? 'bg-amber-600 text-white hover:bg-amber-700'
                            : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                        }`}
                      >
                        Develop +1 ({devCost}💰)
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {tab === 'buildings' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-stone-800">Constructed Buildings</h4>
              {province.buildings.length === 0 ? (
                <p className="text-stone-500 text-center py-4">No buildings constructed</p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {province.buildings.map(building => (
                    <div key={building} className="bg-stone-100 rounded p-3">
                      <div className="font-medium text-stone-800">{building}</div>
                    </div>
                  ))}
                </div>
              )}

              {isOwned && (
                <button
                  onClick={onCoreProvince}
                  className="w-full py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  View Building Options
                </button>
              )}
            </div>
          )}
        </div>

        {/* Controller info */}
        {province.owner !== province.controller && (
          <div className="p-3 border-t border-stone-300 bg-red-50">
            <div className="text-sm text-red-700">
              ⚠️ Occupied by {province.controller}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProvinceDetail;
