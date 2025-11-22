import React from 'react';

interface Province {
  id: string;
  name: string;
  owner: string;
  controller: string;
  culture: string;
  religion: string;
  terrain: string;
  climate: string;
  development: {
    tax: number;
    production: number;
    manpower: number;
  };
  tradeGood: string;
  tradeGoodPrice: number;
  buildings: string[];
  coreOwners: string[];
  claims: string[];
  autonomy: number;
  unrest: number;
  garrison: number;
  fortLevel: number;
  hasPort: boolean;
  isCapital: boolean;
}

interface ProvinceDetailsProps {
  province: Province;
  isOwned: boolean;
  onClose: () => void;
  onBuildBuilding?: (provinceId: string) => void;
  onDevelop?: (provinceId: string, type: 'tax' | 'production' | 'manpower') => void;
  onChangeTradeGood?: (provinceId: string) => void;
}

export default function ProvinceDetails({
  province,
  isOwned,
  onClose,
  onBuildBuilding,
  onDevelop,
  onChangeTradeGood
}: ProvinceDetailsProps) {
  const totalDev = province.development.tax + province.development.production + province.development.manpower;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-stone-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 border-b border-stone-700 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-amber-100">{province.name}</h2>
            <div className="text-xs text-stone-400">
              {province.terrain} • {province.climate}
              {province.isCapital && ' • 👑 Capital'}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Development */}
          <div className="bg-stone-700 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-amber-100">Development</span>
              <span className="text-lg font-bold text-amber-400">{totalDev}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div
                className={`bg-stone-800 rounded p-2 text-center ${
                  isOwned && onDevelop ? 'cursor-pointer hover:bg-stone-600' : ''
                }`}
                onClick={() => isOwned && onDevelop?.(province.id, 'tax')}
              >
                <div className="text-lg font-bold text-amber-400">{province.development.tax}</div>
                <div className="text-xs text-stone-400">💰 Tax</div>
              </div>
              <div
                className={`bg-stone-800 rounded p-2 text-center ${
                  isOwned && onDevelop ? 'cursor-pointer hover:bg-stone-600' : ''
                }`}
                onClick={() => isOwned && onDevelop?.(province.id, 'production')}
              >
                <div className="text-lg font-bold text-green-400">{province.development.production}</div>
                <div className="text-xs text-stone-400">⚙️ Prod</div>
              </div>
              <div
                className={`bg-stone-800 rounded p-2 text-center ${
                  isOwned && onDevelop ? 'cursor-pointer hover:bg-stone-600' : ''
                }`}
                onClick={() => isOwned && onDevelop?.(province.id, 'manpower')}
              >
                <div className="text-lg font-bold text-red-400">{province.development.manpower}</div>
                <div className="text-xs text-stone-400">👥 MP</div>
              </div>
            </div>
          </div>

          {/* Trade Good */}
          <div className="bg-stone-700 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium text-amber-100">Trade Good</div>
                <div className="text-xs text-stone-400">{province.tradeGood}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-400">{province.tradeGoodPrice.toFixed(2)}</div>
                <div className="text-xs text-stone-400">ducats</div>
              </div>
            </div>
            {isOwned && onChangeTradeGood && (
              <button
                onClick={() => onChangeTradeGood(province.id)}
                className="mt-2 w-full text-xs bg-stone-600 hover:bg-stone-500 py-1 rounded"
              >
                Change Trade Good
              </button>
            )}
          </div>

          {/* Culture & Religion */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-stone-700 rounded-lg p-3">
              <div className="text-xs text-stone-400">Culture</div>
              <div className="text-sm font-medium text-amber-100">{province.culture}</div>
            </div>
            <div className="bg-stone-700 rounded-lg p-3">
              <div className="text-xs text-stone-400">Religion</div>
              <div className="text-sm font-medium text-amber-100">{province.religion}</div>
            </div>
          </div>

          {/* Province Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-stone-700 rounded-lg p-3">
              <div className="text-xs text-stone-400">Autonomy</div>
              <div className={`text-sm font-medium ${
                province.autonomy > 50 ? 'text-red-400' :
                province.autonomy > 25 ? 'text-amber-400' : 'text-green-400'
              }`}>
                {province.autonomy.toFixed(0)}%
              </div>
            </div>
            <div className="bg-stone-700 rounded-lg p-3">
              <div className="text-xs text-stone-400">Unrest</div>
              <div className={`text-sm font-medium ${
                province.unrest > 5 ? 'text-red-400' :
                province.unrest > 0 ? 'text-amber-400' : 'text-green-400'
              }`}>
                {province.unrest.toFixed(1)}
              </div>
            </div>
          </div>

          {/* Fort & Garrison */}
          {(province.fortLevel > 0 || province.garrison > 0) && (
            <div className="bg-stone-700 rounded-lg p-3">
              <div className="flex justify-between">
                <div>
                  <div className="text-xs text-stone-400">Fort Level</div>
                  <div className="text-sm font-medium text-amber-100">
                    {province.fortLevel > 0 ? `🏰 Level ${province.fortLevel}` : 'None'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-stone-400">Garrison</div>
                  <div className="text-sm font-medium text-amber-100">
                    {province.garrison.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Buildings */}
          {province.buildings.length > 0 && (
            <div className="bg-stone-700 rounded-lg p-3">
              <div className="text-xs text-stone-400 mb-2">Buildings</div>
              <div className="flex flex-wrap gap-1">
                {province.buildings.map((building, i) => (
                  <span
                    key={i}
                    className="text-xs bg-stone-600 px-2 py-0.5 rounded"
                  >
                    {building}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Cores & Claims */}
          <div className="grid grid-cols-2 gap-3">
            {province.coreOwners.length > 0 && (
              <div className="bg-stone-700 rounded-lg p-3">
                <div className="text-xs text-stone-400 mb-1">Cores</div>
                <div className="flex flex-wrap gap-1">
                  {province.coreOwners.map((core, i) => (
                    <span key={i} className="text-xs bg-green-900/50 text-green-300 px-1.5 py-0.5 rounded">
                      {core}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {province.claims.length > 0 && (
              <div className="bg-stone-700 rounded-lg p-3">
                <div className="text-xs text-stone-400 mb-1">Claims</div>
                <div className="flex flex-wrap gap-1">
                  {province.claims.map((claim, i) => (
                    <span key={i} className="text-xs bg-amber-900/50 text-amber-300 px-1.5 py-0.5 rounded">
                      {claim}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          {isOwned && (
            <div className="flex gap-2">
              {onBuildBuilding && (
                <button
                  onClick={() => onBuildBuilding(province.id)}
                  className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded text-sm font-medium"
                >
                  🏗️ Build
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
