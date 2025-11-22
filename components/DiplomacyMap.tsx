import React from 'react';

export interface NationRelation {
  nationId: string;
  name: string;
  flag: string;
  relations: number;
  attitude: 'friendly' | 'neutral' | 'hostile' | 'rival' | 'ally';
  opinion: string;
  modifiers: RelationModifier[];
}

export interface RelationModifier {
  name: string;
  value: number;
  duration?: number;
}

interface DiplomacyMapProps {
  nations: NationRelation[];
  playerNation: string;
  onSelectNation: (nationId: string) => void;
  selectedNation: string | null;
}

export const DiplomacyMap: React.FC<DiplomacyMapProps> = ({
  nations,
  playerNation,
  onSelectNation,
  selectedNation
}) => {
  const getAttitudeColor = (attitude: NationRelation['attitude']) => {
    switch (attitude) {
      case 'ally': return 'bg-green-500';
      case 'friendly': return 'bg-green-300';
      case 'neutral': return 'bg-amber-300';
      case 'hostile': return 'bg-orange-400';
      case 'rival': return 'bg-red-500';
    }
  };

  const getRelationColor = (relations: number) => {
    if (relations >= 100) return 'text-green-600';
    if (relations >= 50) return 'text-green-500';
    if (relations >= 0) return 'text-amber-500';
    if (relations >= -50) return 'text-orange-500';
    return 'text-red-600';
  };

  const selected = nations.find(n => n.nationId === selectedNation);

  return (
    <div className="h-full flex flex-col">
      {/* Nation list */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-2 p-2">
          {nations.map(nation => (
            <button
              key={nation.nationId}
              onClick={() => onSelectNation(nation.nationId)}
              className={`p-3 rounded-lg border text-left transition-all ${
                selectedNation === nation.nationId
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{nation.flag}</span>
                  <span className="font-medium text-stone-800 text-sm">{nation.name}</span>
                </div>
                <span className={`w-3 h-3 rounded-full ${getAttitudeColor(nation.attitude)}`} />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-stone-500">{nation.attitude}</span>
                <span className={getRelationColor(nation.relations)}>
                  {nation.relations > 0 ? '+' : ''}{nation.relations}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected nation details */}
      {selected && (
        <div className="border-t border-stone-200 p-4 bg-stone-50">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{selected.flag}</span>
            <div>
              <h3 className="font-bold text-stone-800">{selected.name}</h3>
              <p className="text-sm text-stone-600">{selected.opinion}</p>
            </div>
          </div>

          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-stone-600">Relations</span>
              <span className={`font-bold ${getRelationColor(selected.relations)}`}>
                {selected.relations > 0 ? '+' : ''}{selected.relations}
              </span>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 ${selected.relations >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                style={{
                  width: `${Math.abs(selected.relations) / 2}%`,
                  marginLeft: selected.relations >= 0 ? '50%' : `${50 - Math.abs(selected.relations) / 2}%`
                }}
              />
            </div>
          </div>

          {/* Modifiers */}
          {selected.modifiers.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-stone-500 mb-2">Opinion Modifiers</h4>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {selected.modifiers.map((mod, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="text-stone-600">{mod.name}</span>
                    <span className={mod.value >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {mod.value > 0 ? '+' : ''}{mod.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Compact relations indicator for header
export const RelationsIndicator: React.FC<{
  allies: number;
  rivals: number;
  wars: number;
  onClick: () => void;
}> = ({ allies, rivals, wars, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1 bg-stone-600 rounded hover:bg-stone-500"
    >
      {allies > 0 && (
        <span className="flex items-center gap-1 text-green-400 text-sm">
          🤝 {allies}
        </span>
      )}
      {rivals > 0 && (
        <span className="flex items-center gap-1 text-orange-400 text-sm">
          😤 {rivals}
        </span>
      )}
      {wars > 0 && (
        <span className="flex items-center gap-1 text-red-400 text-sm">
          ⚔️ {wars}
        </span>
      )}
    </button>
  );
};

export default DiplomacyMap;
