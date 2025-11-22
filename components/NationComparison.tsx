import React from 'react';
import { Nation, NationStats } from '../types';

interface NationComparisonProps {
  isOpen: boolean;
  onClose: () => void;
  playerNation: Nation;
  otherNations: Nation[];
  selectedNations?: string[];
  onSelectNation?: (nationId: string) => void;
}

export const NationComparison: React.FC<NationComparisonProps> = ({
  isOpen,
  onClose,
  playerNation,
  otherNations,
  selectedNations = [],
  onSelectNation
}) => {
  if (!isOpen) return null;

  const allNations = [playerNation, ...otherNations];
  const comparedNations = selectedNations.length > 0
    ? allNations.filter(n => selectedNations.includes(n.id) || n.id === playerNation.id)
    : [playerNation, ...otherNations.slice(0, 3)];

  const stats: (keyof NationStats)[] = ['military', 'economy', 'stability', 'innovation', 'prestige'];

  const getStatMax = (stat: keyof NationStats): number => {
    return Math.max(...comparedNations.map(n => n.stats[stat]));
  };

  const getRank = (nation: Nation): number => {
    const total = stats.reduce((sum, stat) => sum + nation.stats[stat], 0);
    const sorted = allNations
      .map(n => ({ id: n.id, total: stats.reduce((s, stat) => s + n.stats[stat], 0) }))
      .sort((a, b) => b.total - a.total);
    return sorted.findIndex(n => n.id === nation.id) + 1;
  };

  const statIcons: Record<keyof NationStats, string> = {
    military: '⚔️',
    economy: '💰',
    stability: '⚖️',
    innovation: '💡',
    prestige: '👑'
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <h2 className="text-xl font-bold text-stone-800">📊 Nation Comparison</h2>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Nation selector */}
        {onSelectNation && (
          <div className="p-3 border-b border-stone-200 flex flex-wrap gap-2">
            {otherNations.map(nation => (
              <button
                key={nation.id}
                onClick={() => onSelectNation(nation.id)}
                className={`px-2 py-1 rounded text-sm ${
                  selectedNations.includes(nation.id)
                    ? 'bg-amber-600 text-white'
                    : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                }`}
              >
                {nation.name}
              </button>
            ))}
          </div>
        )}

        {/* Comparison table */}
        <div className="flex-1 overflow-auto p-4">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-2 text-stone-600">Stat</th>
                {comparedNations.map(nation => (
                  <th key={nation.id} className="p-2 text-center">
                    <div className={`font-bold ${nation.id === playerNation.id ? 'text-amber-600' : 'text-stone-800'}`}>
                      {nation.name}
                    </div>
                    <div className="text-xs text-stone-500">
                      Rank #{getRank(nation)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.map(stat => {
                const max = getStatMax(stat);
                return (
                  <tr key={stat} className="border-t border-stone-200">
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <span>{statIcons[stat]}</span>
                        <span className="font-medium text-stone-700 capitalize">{stat}</span>
                      </div>
                    </td>
                    {comparedNations.map(nation => {
                      const value = nation.stats[stat];
                      const isMax = value === max;
                      const percentage = (value / 5) * 100;
                      return (
                        <td key={nation.id} className="p-2">
                          <div className="text-center mb-1">
                            <span className={`font-bold ${isMax ? 'text-green-600' : 'text-stone-700'}`}>
                              {value.toFixed(1)}
                            </span>
                            {isMax && <span className="ml-1 text-xs text-green-500">★</span>}
                          </div>
                          <div className="w-full bg-stone-200 rounded h-2">
                            <div
                              className={`h-2 rounded ${
                                nation.id === playerNation.id
                                  ? 'bg-amber-500'
                                  : 'bg-stone-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              {/* Total */}
              <tr className="border-t-2 border-stone-300 bg-stone-50">
                <td className="p-2 font-bold text-stone-800">Total Power</td>
                {comparedNations.map(nation => {
                  const total = stats.reduce((sum, stat) => sum + nation.stats[stat], 0);
                  const maxTotal = Math.max(...comparedNations.map(n =>
                    stats.reduce((s, stat) => s + n.stats[stat], 0)
                  ));
                  return (
                    <td key={nation.id} className="p-2 text-center">
                      <span className={`text-lg font-bold ${
                        total === maxTotal ? 'text-green-600' : 'text-stone-700'
                      }`}>
                        {total.toFixed(1)}
                      </span>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Radar chart placeholder */}
        <div className="p-4 border-t border-stone-200 bg-stone-50">
          <div className="flex justify-center gap-8">
            {comparedNations.slice(0, 4).map(nation => (
              <div key={nation.id} className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                  nation.id === playerNation.id
                    ? 'bg-amber-100 border-2 border-amber-500'
                    : 'bg-stone-100 border-2 border-stone-300'
                }`}>
                  {nation.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="text-xs text-stone-600 mt-1">{nation.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NationComparison;
