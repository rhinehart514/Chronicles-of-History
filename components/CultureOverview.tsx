import React, { useState } from 'react';

interface CultureOverviewProps {
  isOpen: boolean;
  onClose: () => void;
  primaryCulture: string;
  acceptedCultures: string[];
  cultureGroups: CultureGroup[];
  provinces: CultureProvince[];
  onAcceptCulture: (cultureId: string) => void;
  onRemoveCulture: (cultureId: string) => void;
  onPromoteCulture: (cultureId: string) => void;
}

interface CultureGroup {
  id: string;
  name: string;
  cultures: Culture[];
  bonuses: { type: string; value: number; description: string }[];
}

interface Culture {
  id: string;
  name: string;
}

interface CultureProvince {
  id: string;
  name: string;
  culture: string;
  development: number;
}

export const CultureOverview: React.FC<CultureOverviewProps> = ({
  isOpen,
  onClose,
  primaryCulture,
  acceptedCultures,
  cultureGroups,
  provinces,
  onAcceptCulture,
  onRemoveCulture,
  onPromoteCulture
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedCulture, setSelectedCulture] = useState<string | null>(null);

  if (!isOpen) return null;

  // Get all cultures from selected group
  const selectedGroupData = cultureGroups.find(g => g.id === selectedGroup);

  // Get culture statistics
  const cultureStats = provinces.reduce((acc, p) => {
    if (!acc[p.culture]) {
      acc[p.culture] = { count: 0, development: 0 };
    }
    acc[p.culture].count++;
    acc[p.culture].development += p.development;
    return acc;
  }, {} as Record<string, { count: number; development: number }>);

  // Find primary culture group
  const primaryGroup = cultureGroups.find(g =>
    g.cultures.some(c => c.id === primaryCulture)
  );

  const totalDev = provinces.reduce((sum, p) => sum + p.development, 0);
  const acceptedDev = provinces
    .filter(p => p.culture === primaryCulture || acceptedCultures.includes(p.culture))
    .reduce((sum, p) => sum + p.development, 0);

  const culturalUnity = totalDev > 0 ? Math.round((acceptedDev / totalDev) * 100) : 100;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-stone-800">🎭 Culture Overview</h2>
            <div className="text-sm text-stone-500">
              Primary: {primaryCulture} • {acceptedCultures.length} accepted
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Stats */}
        <div className="p-3 border-b border-stone-200 bg-stone-100 grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-xs text-stone-500">Primary Culture</div>
            <div className="font-bold text-stone-800 capitalize">{primaryCulture}</div>
          </div>
          <div>
            <div className="text-xs text-stone-500">Accepted</div>
            <div className="font-bold text-green-600">{acceptedCultures.length}</div>
          </div>
          <div>
            <div className="text-xs text-stone-500">Cultural Unity</div>
            <div className={`font-bold ${culturalUnity >= 50 ? 'text-green-600' : 'text-red-600'}`}>
              {culturalUnity}%
            </div>
          </div>
          <div>
            <div className="text-xs text-stone-500">Unique Cultures</div>
            <div className="font-bold text-blue-600">{Object.keys(cultureStats).length}</div>
          </div>
        </div>

        {/* Primary culture bonuses */}
        {primaryGroup && (
          <div className="p-3 border-b border-stone-200 bg-blue-50">
            <div className="text-xs font-semibold text-stone-600 mb-1">
              {primaryGroup.name} Culture Group Bonuses
            </div>
            <div className="flex flex-wrap gap-3">
              {primaryGroup.bonuses.map((bonus, i) => (
                <span key={i} className="text-xs text-blue-700">
                  {bonus.description}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Culture groups */}
          <div className="w-1/3 border-r border-stone-200 overflow-y-auto p-3">
            <h3 className="text-sm font-semibold text-stone-600 mb-2">Culture Groups</h3>
            <div className="space-y-2">
              {cultureGroups.map(group => {
                const groupCultures = group.cultures.map(c => c.id);
                const groupProvinces = provinces.filter(p => groupCultures.includes(p.culture));
                const isPrimary = group.cultures.some(c => c.id === primaryCulture);

                return (
                  <button
                    key={group.id}
                    onClick={() => {
                      setSelectedGroup(group.id);
                      setSelectedCulture(null);
                    }}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                      selectedGroup === group.id
                        ? 'border-amber-500 bg-amber-50'
                        : isPrimary
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-stone-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-stone-800">{group.name}</div>
                      {isPrimary && <span className="text-blue-500 text-xs">Primary</span>}
                    </div>
                    <div className="text-xs text-stone-500">
                      {group.cultures.length} cultures • {groupProvinces.length} provinces
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cultures in group / details */}
          <div className="w-2/3 p-4 overflow-y-auto">
            {selectedGroupData ? (
              <>
                <div className="mb-4">
                  <h3 className="font-bold text-stone-800">{selectedGroupData.name}</h3>
                  <div className="text-sm text-stone-600 mb-2">
                    {selectedGroupData.cultures.length} cultures
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedGroupData.bonuses.map((bonus, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs"
                      >
                        {bonus.description}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  {selectedGroupData.cultures.map(culture => {
                    const stats = cultureStats[culture.id] || { count: 0, development: 0 };
                    const isPrimary = culture.id === primaryCulture;
                    const isAccepted = acceptedCultures.includes(culture.id);

                    return (
                      <div
                        key={culture.id}
                        className={`p-3 rounded-lg border ${
                          isPrimary
                            ? 'border-blue-300 bg-blue-50'
                            : isAccepted
                            ? 'border-green-300 bg-green-50'
                            : 'border-stone-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="font-semibold text-stone-800">{culture.name}</span>
                            {isPrimary && (
                              <span className="ml-2 px-2 py-0.5 bg-blue-200 text-blue-700 rounded text-xs">
                                Primary
                              </span>
                            )}
                            {isAccepted && !isPrimary && (
                              <span className="ml-2 px-2 py-0.5 bg-green-200 text-green-700 rounded text-xs">
                                Accepted
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-stone-600">
                            {stats.count} provinces • {stats.development} dev
                          </div>
                        </div>

                        {!isPrimary && (
                          <div className="flex gap-2">
                            {!isAccepted ? (
                              <button
                                onClick={() => onAcceptCulture(culture.id)}
                                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                              >
                                Accept
                              </button>
                            ) : (
                              <button
                                onClick={() => onRemoveCulture(culture.id)}
                                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                              >
                                Remove
                              </button>
                            )}
                            {stats.development > 0 && (
                              <button
                                onClick={() => onPromoteCulture(culture.id)}
                                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                              >
                                Promote to Primary
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-stone-500 mb-4">Select a culture group to view details</p>

                {/* Show accepted cultures */}
                {acceptedCultures.length > 0 && (
                  <div className="text-left">
                    <h4 className="text-sm font-semibold text-stone-600 mb-2">Accepted Cultures</h4>
                    <div className="flex flex-wrap gap-2">
                      {acceptedCultures.map(culture => (
                        <span
                          key={culture}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded capitalize"
                        >
                          {culture}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CultureOverview;
