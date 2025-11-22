import React, { useState } from 'react';

interface ConversionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  provinces: ConvertibleProvince[];
  missionaries: number;
  missionaryStrength: number;
  stateReligion: string;
  stateReligionIcon: string;
  stateCulture: string;
  onConvertReligion: (provinceId: string) => void;
  onConvertCulture: (provinceId: string) => void;
  onCancelConversion: (provinceId: string) => void;
}

interface ConvertibleProvince {
  id: string;
  name: string;
  religion: string;
  religionIcon: string;
  culture: string;
  development: number;
  unrest: number;
  converting?: {
    type: 'religion' | 'culture';
    progress: number;
    monthsRemaining: number;
  };
  conversionCost: {
    religion: number;
    culture: number;
  };
  conversionTime: {
    religion: number;
    culture: number;
  };
}

export const ConversionPanel: React.FC<ConversionPanelProps> = ({
  isOpen,
  onClose,
  provinces,
  missionaries,
  missionaryStrength,
  stateReligion,
  stateReligionIcon,
  stateCulture,
  onConvertReligion,
  onConvertCulture,
  onCancelConversion
}) => {
  const [filter, setFilter] = useState<'all' | 'religion' | 'culture' | 'converting'>('all');
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

  if (!isOpen) return null;

  const wrongReligion = provinces.filter(p => p.religion !== stateReligion && !p.converting);
  const wrongCulture = provinces.filter(p => p.culture !== stateCulture && !p.converting);
  const converting = provinces.filter(p => p.converting);

  const filteredProvinces = provinces.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'religion') return p.religion !== stateReligion;
    if (filter === 'culture') return p.culture !== stateCulture;
    if (filter === 'converting') return p.converting;
    return true;
  });

  const selected = provinces.find(p => p.id === selectedProvince);

  const usedMissionaries = converting.filter(p => p.converting?.type === 'religion').length;
  const availableMissionaries = missionaries - usedMissionaries;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-stone-800">✝️ Religious & Cultural Conversion</h2>
            <div className="text-sm text-stone-500">
              {wrongReligion.length} provinces of wrong religion • {wrongCulture.length} of wrong culture
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Stats */}
        <div className="p-3 border-b border-stone-200 bg-stone-100 grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-xs text-stone-500">State Religion</div>
            <div className="font-bold">{stateReligionIcon} {stateReligion}</div>
          </div>
          <div>
            <div className="text-xs text-stone-500">State Culture</div>
            <div className="font-bold">{stateCulture}</div>
          </div>
          <div>
            <div className="text-xs text-stone-500">Missionaries</div>
            <div className="font-bold">{availableMissionaries}/{missionaries}</div>
          </div>
          <div>
            <div className="text-xs text-stone-500">Strength</div>
            <div className="font-bold text-green-600">+{missionaryStrength}%</div>
          </div>
        </div>

        {/* Filter */}
        <div className="p-2 border-b border-stone-200 flex gap-2">
          {[
            { id: 'all', name: 'All' },
            { id: 'religion', name: `Wrong Religion (${wrongReligion.length})` },
            { id: 'culture', name: `Wrong Culture (${wrongCulture.length})` },
            { id: 'converting', name: `Converting (${converting.length})` }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-3 py-1 rounded text-sm ${
                filter === f.id ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-700'
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Province list */}
          <div className="w-1/2 border-r border-stone-200 overflow-y-auto p-3">
            {filteredProvinces.length === 0 ? (
              <p className="text-center text-stone-500 py-8">No provinces match filter</p>
            ) : (
              <div className="space-y-2">
                {filteredProvinces.map(province => {
                  const wrongRel = province.religion !== stateReligion;
                  const wrongCul = province.culture !== stateCulture;

                  return (
                    <button
                      key={province.id}
                      onClick={() => setSelectedProvince(province.id)}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        selectedProvince === province.id
                          ? 'border-amber-500 bg-amber-50'
                          : province.converting
                          ? 'border-blue-300 bg-blue-50'
                          : 'border-stone-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-stone-800">{province.name}</span>
                        <span className="text-sm text-stone-500">Dev {province.development}</span>
                      </div>

                      <div className="flex gap-3 text-xs">
                        <span className={wrongRel ? 'text-red-600' : 'text-green-600'}>
                          {province.religionIcon} {province.religion}
                        </span>
                        <span className={wrongCul ? 'text-orange-600' : 'text-green-600'}>
                          {province.culture}
                        </span>
                      </div>

                      {province.converting && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-blue-600">
                              Converting {province.converting.type}
                            </span>
                            <span>{province.converting.monthsRemaining}mo</span>
                          </div>
                          <div className="w-full bg-stone-200 rounded-full h-1">
                            <div
                              className="bg-blue-500 h-1 rounded-full"
                              style={{ width: `${province.converting.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected province details */}
          <div className="w-1/2 p-4 overflow-y-auto">
            {selected ? (
              <>
                <div className="text-center mb-4">
                  <h3 className="font-bold text-stone-800 text-lg">{selected.name}</h3>
                  <p className="text-sm text-stone-600">Development: {selected.development}</p>
                </div>

                {/* Current state */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className={`p-3 rounded-lg ${
                    selected.religion !== stateReligion
                      ? 'bg-red-50 border border-red-200'
                      : 'bg-green-50 border border-green-200'
                  }`}>
                    <div className="text-xs text-stone-500">Religion</div>
                    <div className="font-bold">{selected.religionIcon} {selected.religion}</div>
                  </div>
                  <div className={`p-3 rounded-lg ${
                    selected.culture !== stateCulture
                      ? 'bg-orange-50 border border-orange-200'
                      : 'bg-green-50 border border-green-200'
                  }`}>
                    <div className="text-xs text-stone-500">Culture</div>
                    <div className="font-bold">{selected.culture}</div>
                  </div>
                </div>

                {/* Unrest */}
                {selected.unrest > 0 && (
                  <div className="mb-4 p-3 bg-red-50 rounded-lg">
                    <div className="text-sm text-red-700">
                      ⚠️ Local unrest: {selected.unrest.toFixed(1)}
                    </div>
                  </div>
                )}

                {/* Conversion in progress */}
                {selected.converting ? (
                  <div className="mb-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2">
                        Converting {selected.converting.type}...
                      </h4>
                      <div className="w-full bg-stone-200 rounded-full h-3 mb-2">
                        <div
                          className="bg-blue-500 h-3 rounded-full"
                          style={{ width: `${selected.converting.progress}%` }}
                        />
                      </div>
                      <div className="text-xs text-blue-600 text-center">
                        {selected.converting.monthsRemaining} months remaining
                      </div>
                    </div>
                    <button
                      onClick={() => onCancelConversion(selected.id)}
                      className="w-full mt-2 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                    >
                      Cancel Conversion
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Religion conversion */}
                    {selected.religion !== stateReligion && (
                      <div className="p-3 bg-white rounded-lg border border-stone-200">
                        <h4 className="font-semibold text-stone-800 mb-2">
                          Convert to {stateReligionIcon} {stateReligion}
                        </h4>
                        <div className="text-xs text-stone-600 mb-2">
                          Cost: {selected.conversionCost.religion} • Time: {selected.conversionTime.religion} months
                        </div>
                        <button
                          onClick={() => onConvertReligion(selected.id)}
                          disabled={availableMissionaries <= 0}
                          className={`w-full py-2 rounded font-medium ${
                            availableMissionaries > 0
                              ? 'bg-purple-600 text-white hover:bg-purple-700'
                              : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                          }`}
                        >
                          {availableMissionaries > 0 ? 'Send Missionary' : 'No Missionaries Available'}
                        </button>
                      </div>
                    )}

                    {/* Culture conversion */}
                    {selected.culture !== stateCulture && (
                      <div className="p-3 bg-white rounded-lg border border-stone-200">
                        <h4 className="font-semibold text-stone-800 mb-2">
                          Convert to {stateCulture}
                        </h4>
                        <div className="text-xs text-stone-600 mb-2">
                          Cost: {selected.conversionCost.culture} • Time: {selected.conversionTime.culture} months
                        </div>
                        <button
                          onClick={() => onConvertCulture(selected.id)}
                          className="w-full py-2 bg-orange-600 text-white rounded font-medium hover:bg-orange-700"
                        >
                          Convert Culture ({selected.conversionCost.culture} diplo)
                        </button>
                      </div>
                    )}

                    {selected.religion === stateReligion && selected.culture === stateCulture && (
                      <div className="text-center py-4 text-green-600">
                        ✓ Province is already converted
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <p className="text-center text-stone-500 py-8">
                Select a province to convert
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversionPanel;
