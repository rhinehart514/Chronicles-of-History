import React, { useState } from 'react';

interface ProvinceViewerProps {
  isOpen: boolean;
  onClose: () => void;
  province: Province;
  isOwned: boolean;
  onCorify: () => void;
  onBuild: (buildingId: string) => void;
  onDevelop: (type: string) => void;
  onCreateState: () => void;
}

interface Province {
  id: string;
  name: string;
  owner: string;
  ownerFlag: string;
  controller: string;
  cores: string[];
  claims: string[];
  terrain: string;
  climate: string;
  development: {
    tax: number;
    production: number;
    manpower: number;
    total: number;
  };
  culture: string;
  religion: string;
  religionIcon: string;
  tradeGood: string;
  tradeGoodIcon: string;
  tradeValue: number;
  tradePower: number;
  buildings: Building[];
  modifiers: ProvinceModifier[];
  garrison: number;
  fort: number;
  unrest: number;
  autonomy: number;
  devastation: number;
  isState: boolean;
  isCoastal: boolean;
  hasPort: boolean;
}

interface Building {
  id: string;
  name: string;
  icon: string;
}

interface ProvinceModifier {
  name: string;
  icon: string;
  duration?: number;
}

export const ProvinceViewer: React.FC<ProvinceViewerProps> = ({
  isOpen,
  onClose,
  province,
  isOwned,
  onCorify,
  onBuild,
  onDevelop,
  onCreateState
}) => {
  const [tab, setTab] = useState<'overview' | 'economy' | 'buildings'>('overview');

  if (!isOpen) return null;

  const hasCore = province.cores.includes(province.owner);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-lg border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-stone-800">{province.name}</h2>
              <div className="flex items-center gap-2 text-sm text-stone-500">
                <span>{province.ownerFlag} {province.owner}</span>
                {province.controller !== province.owner && (
                  <span className="text-red-600">(Occupied)</span>
                )}
              </div>
            </div>
            <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
              ×
            </button>
          </div>

          {/* Development display */}
          <div className="flex justify-center gap-6 mt-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">{province.development.tax}</div>
              <div className="text-xs text-stone-500">Tax</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{province.development.production}</div>
              <div className="text-xs text-stone-500">Production</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{province.development.manpower}</div>
              <div className="text-xs text-stone-500">Manpower</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-stone-800">{province.development.total}</div>
              <div className="text-xs text-stone-500">Total</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-200">
          {[
            { id: 'overview', name: 'Overview' },
            { id: 'economy', name: 'Economy' },
            { id: 'buildings', name: 'Buildings' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`flex-1 py-2 text-sm font-medium ${
                tab === t.id
                  ? 'bg-amber-100 text-amber-700 border-b-2 border-amber-500'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 max-h-[50vh] overflow-y-auto">
          {tab === 'overview' && (
            <div className="space-y-4">
              {/* Basic info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2 bg-stone-100 rounded">
                  <div className="text-xs text-stone-500">Terrain</div>
                  <div className="font-medium capitalize">{province.terrain}</div>
                </div>
                <div className="p-2 bg-stone-100 rounded">
                  <div className="text-xs text-stone-500">Climate</div>
                  <div className="font-medium capitalize">{province.climate}</div>
                </div>
                <div className="p-2 bg-stone-100 rounded">
                  <div className="text-xs text-stone-500">Culture</div>
                  <div className="font-medium capitalize">{province.culture}</div>
                </div>
                <div className="p-2 bg-stone-100 rounded">
                  <div className="text-xs text-stone-500">Religion</div>
                  <div className="font-medium">{province.religionIcon} {province.religion}</div>
                </div>
              </div>

              {/* Military */}
              <div>
                <h4 className="text-sm font-semibold text-stone-600 mb-2">Military</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2 bg-stone-100 rounded">
                    <div className="text-xs text-stone-500">Garrison</div>
                    <div className="font-medium">{province.garrison.toLocaleString()}</div>
                  </div>
                  <div className="p-2 bg-stone-100 rounded">
                    <div className="text-xs text-stone-500">Fort Level</div>
                    <div className="font-medium">{province.fort}</div>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <h4 className="text-sm font-semibold text-stone-600 mb-2">Status</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className={`p-2 rounded text-center ${province.unrest > 0 ? 'bg-red-100' : 'bg-green-100'}`}>
                    <div className="text-xs text-stone-500">Unrest</div>
                    <div className={`font-medium ${province.unrest > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {province.unrest.toFixed(1)}
                    </div>
                  </div>
                  <div className="p-2 bg-stone-100 rounded text-center">
                    <div className="text-xs text-stone-500">Autonomy</div>
                    <div className="font-medium">{province.autonomy}%</div>
                  </div>
                  <div className={`p-2 rounded text-center ${province.devastation > 0 ? 'bg-red-100' : 'bg-green-100'}`}>
                    <div className="text-xs text-stone-500">Devastation</div>
                    <div className={`font-medium ${province.devastation > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {province.devastation}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Cores and Claims */}
              <div>
                <h4 className="text-sm font-semibold text-stone-600 mb-2">Cores & Claims</h4>
                <div className="flex flex-wrap gap-1">
                  {province.cores.map(core => (
                    <span key={core} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                      {core} (Core)
                    </span>
                  ))}
                  {province.claims.map(claim => (
                    <span key={claim} className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs">
                      {claim} (Claim)
                    </span>
                  ))}
                </div>
              </div>

              {/* Modifiers */}
              {province.modifiers.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-stone-600 mb-2">Modifiers</h4>
                  <div className="space-y-1">
                    {province.modifiers.map((mod, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-blue-50 rounded text-sm">
                        <span>{mod.icon} {mod.name}</span>
                        {mod.duration && (
                          <span className="text-xs text-stone-500">{mod.duration} months</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'economy' && (
            <div className="space-y-4">
              {/* Trade good */}
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-center">
                <div className="text-2xl mb-1">{province.tradeGoodIcon}</div>
                <div className="font-semibold text-stone-800">{province.tradeGood}</div>
                <div className="text-sm text-amber-600">Trade Value: {province.tradeValue.toFixed(2)}</div>
              </div>

              {/* Trade info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-stone-100 rounded">
                  <div className="text-xs text-stone-500">Local Trade Power</div>
                  <div className="font-bold text-blue-600">{province.tradePower.toFixed(1)}</div>
                </div>
                <div className="p-3 bg-stone-100 rounded">
                  <div className="text-xs text-stone-500">Trade Value</div>
                  <div className="font-bold text-green-600">{province.tradeValue.toFixed(2)}</div>
                </div>
              </div>

              {/* State status */}
              <div className={`p-3 rounded-lg ${province.isState ? 'bg-green-50 border border-green-200' : 'bg-stone-100'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-stone-800">
                      {province.isState ? 'Full State' : 'Territory'}
                    </div>
                    <div className="text-xs text-stone-500">
                      {province.isState
                        ? 'Full economic benefits'
                        : 'Reduced economic output'}
                    </div>
                  </div>
                  {isOwned && !province.isState && (
                    <button
                      onClick={onCreateState}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                    >
                      Create State
                    </button>
                  )}
                </div>
              </div>

              {/* Port info */}
              {province.isCoastal && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="font-semibold text-stone-800">
                    {province.hasPort ? '⚓ Has Port' : '🏖️ Coastal Province'}
                  </div>
                  <div className="text-xs text-stone-500">
                    {province.hasPort
                      ? 'Can build and dock ships'
                      : 'Can build a port for naval access'}
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'buildings' && (
            <div className="space-y-4">
              {/* Current buildings */}
              <div>
                <h4 className="text-sm font-semibold text-stone-600 mb-2">
                  Buildings ({province.buildings.length})
                </h4>
                {province.buildings.length === 0 ? (
                  <p className="text-sm text-stone-500">No buildings constructed</p>
                ) : (
                  <div className="space-y-2">
                    {province.buildings.map(building => (
                      <div
                        key={building.id}
                        className="flex items-center gap-2 p-2 bg-white rounded border border-stone-200"
                      >
                        <span className="text-xl">{building.icon}</span>
                        <span className="font-medium">{building.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Build options placeholder */}
              {isOwned && (
                <button
                  onClick={() => onBuild('marketplace')}
                  className="w-full py-3 bg-amber-600 text-white rounded font-medium hover:bg-amber-700"
                >
                  Open Building Menu
                </button>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        {isOwned && (
          <div className="p-4 border-t border-stone-200 flex gap-2">
            {!hasCore && (
              <button
                onClick={onCorify}
                className="flex-1 py-2 bg-purple-600 text-white rounded font-medium hover:bg-purple-700"
              >
                Core Province
              </button>
            )}
            <button
              onClick={() => onDevelop('tax')}
              className="flex-1 py-2 bg-amber-600 text-white rounded font-medium hover:bg-amber-700"
            >
              Develop
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProvinceViewer;
