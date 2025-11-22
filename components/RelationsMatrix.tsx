import React, { useState } from 'react';

interface RelationsMatrixProps {
  isOpen: boolean;
  onClose: () => void;
  nations: NationInfo[];
  relations: RelationData[];
  playerNationId: string;
}

interface NationInfo {
  id: string;
  name: string;
  flag: string;
}

interface RelationData {
  nation1: string;
  nation2: string;
  value: number;
  opinion: string;
  treaties: string[];
}

export const RelationsMatrix: React.FC<RelationsMatrixProps> = ({
  isOpen,
  onClose,
  nations,
  relations,
  playerNationId
}) => {
  const [hoveredCell, setHoveredCell] = useState<{ row: string; col: string } | null>(null);
  const [selectedNation, setSelectedNation] = useState<string | null>(null);

  if (!isOpen) return null;

  const getRelation = (nation1: string, nation2: string): RelationData | undefined => {
    return relations.find(
      r => (r.nation1 === nation1 && r.nation2 === nation2) ||
           (r.nation1 === nation2 && r.nation2 === nation1)
    );
  };

  const getRelationColor = (value: number) => {
    if (value >= 100) return 'bg-green-600 text-white';
    if (value >= 50) return 'bg-green-400 text-white';
    if (value >= 0) return 'bg-green-200 text-green-800';
    if (value >= -50) return 'bg-red-200 text-red-800';
    if (value >= -100) return 'bg-red-400 text-white';
    return 'bg-red-600 text-white';
  };

  const selectedNationInfo = selectedNation
    ? nations.find(n => n.id === selectedNation)
    : null;

  const selectedRelations = selectedNation
    ? relations.filter(r => r.nation1 === selectedNation || r.nation2 === selectedNation)
    : [];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-stone-800">🌐 Relations Matrix</h2>
            <div className="text-sm text-stone-500">
              Diplomatic relations between nations
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Matrix */}
          <div className="flex-1 overflow-auto p-4">
            <div className="inline-block">
              <table className="border-collapse">
                <thead>
                  <tr>
                    <th className="p-2 border border-stone-200 bg-stone-100"></th>
                    {nations.map(nation => (
                      <th
                        key={nation.id}
                        className={`p-2 border border-stone-200 text-center cursor-pointer ${
                          nation.id === playerNationId ? 'bg-amber-100' : 'bg-stone-100'
                        }`}
                        onClick={() => setSelectedNation(nation.id)}
                      >
                        <div className="text-lg">{nation.flag}</div>
                        <div className="text-xs truncate max-w-16">{nation.name}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {nations.map(nation1 => (
                    <tr key={nation1.id}>
                      <td
                        className={`p-2 border border-stone-200 cursor-pointer ${
                          nation1.id === playerNationId ? 'bg-amber-100' : 'bg-stone-100'
                        }`}
                        onClick={() => setSelectedNation(nation1.id)}
                      >
                        <div className="flex items-center gap-1">
                          <span>{nation1.flag}</span>
                          <span className="text-xs truncate max-w-16">{nation1.name}</span>
                        </div>
                      </td>
                      {nations.map(nation2 => {
                        if (nation1.id === nation2.id) {
                          return (
                            <td
                              key={nation2.id}
                              className="p-2 border border-stone-200 bg-stone-300 text-center"
                            >
                              -
                            </td>
                          );
                        }

                        const relation = getRelation(nation1.id, nation2.id);
                        const value = relation?.value || 0;

                        return (
                          <td
                            key={nation2.id}
                            className={`p-2 border border-stone-200 text-center cursor-pointer ${getRelationColor(value)}`}
                            onMouseEnter={() => setHoveredCell({ row: nation1.id, col: nation2.id })}
                            onMouseLeave={() => setHoveredCell(null)}
                          >
                            <span className="text-sm font-bold">{value}</span>
                            {relation?.treaties.includes('alliance') && (
                              <span className="block text-xs">🤝</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Hover tooltip */}
            {hoveredCell && (
              <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-stone-800 text-white p-3 rounded-lg shadow-lg text-sm">
                {(() => {
                  const n1 = nations.find(n => n.id === hoveredCell.row);
                  const n2 = nations.find(n => n.id === hoveredCell.col);
                  const rel = getRelation(hoveredCell.row, hoveredCell.col);
                  return (
                    <>
                      <div className="font-bold mb-1">
                        {n1?.flag} {n1?.name} → {n2?.flag} {n2?.name}
                      </div>
                      <div>Relations: {rel?.value || 0}</div>
                      <div>Opinion: {rel?.opinion || 'Neutral'}</div>
                      {rel?.treaties.length > 0 && (
                        <div>Treaties: {rel.treaties.join(', ')}</div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Selected nation details */}
          {selectedNationInfo && (
            <div className="w-64 border-l border-stone-200 p-4 overflow-y-auto">
              <div className="text-center mb-4">
                <span className="text-4xl">{selectedNationInfo.flag}</span>
                <h3 className="font-bold text-stone-800 mt-1">{selectedNationInfo.name}</h3>
              </div>

              <h4 className="text-sm font-semibold text-stone-600 mb-2">Relations</h4>
              <div className="space-y-2">
                {selectedRelations.map((rel, i) => {
                  const otherId = rel.nation1 === selectedNation ? rel.nation2 : rel.nation1;
                  const other = nations.find(n => n.id === otherId);
                  return (
                    <div
                      key={i}
                      className={`p-2 rounded text-sm ${getRelationColor(rel.value)}`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{other?.flag} {other?.name}</span>
                        <span className="font-bold">{rel.value}</span>
                      </div>
                      {rel.treaties.length > 0 && (
                        <div className="text-xs mt-1 opacity-75">
                          {rel.treaties.join(', ')}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="p-3 border-t border-stone-300 bg-stone-100">
          <div className="flex justify-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
              <span>Allied (100+)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-green-200 rounded"></div>
              <span>Friendly (0+)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-red-200 rounded"></div>
              <span>Unfriendly (0-)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-red-600 rounded"></div>
              <span>Hostile (-100)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelationsMatrix;
