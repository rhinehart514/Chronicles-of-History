import React from 'react';
import { Calendar, Crown, Flag, Clock } from 'lucide-react';
import { Era, GovernmentStructure, Nation } from '../types';
import { getEraInfo } from '../data/governmentTemplates';

interface EraStatusBarProps {
  nation: Nation;
  year: number;
}

const EraStatusBar: React.FC<EraStatusBarProps> = ({ nation, year }) => {
  const eraInfo = nation.currentEra ? getEraInfo(nation.currentEra) : null;

  const getEraDisplayName = (era: Era): string => {
    const names: Record<Era, string> = {
      'EARLY_MODERN': 'Early Modern Era',
      'ENLIGHTENMENT': 'Age of Enlightenment',
      'REVOLUTIONARY': 'Revolutionary Era',
      'INDUSTRIAL': 'Industrial Age',
      'IMPERIAL': 'Age of Empire',
      'GREAT_WAR': 'The Great War',
      'INTERWAR': 'Interwar Period',
      'WORLD_WAR': 'World War',
      'COLD_WAR': 'Cold War Era',
      'MODERN': 'Modern Era'
    };
    return names[era] || era;
  };

  const getEraColor = (era: Era): string => {
    const colors: Record<Era, string> = {
      'EARLY_MODERN': 'bg-amber-600',
      'ENLIGHTENMENT': 'bg-yellow-500',
      'REVOLUTIONARY': 'bg-red-600',
      'INDUSTRIAL': 'bg-gray-600',
      'IMPERIAL': 'bg-purple-600',
      'GREAT_WAR': 'bg-red-800',
      'INTERWAR': 'bg-orange-600',
      'WORLD_WAR': 'bg-red-900',
      'COLD_WAR': 'bg-blue-800',
      'MODERN': 'bg-cyan-600'
    };
    return colors[era] || 'bg-stone-600';
  };

  return (
    <div className="bg-stone-800/90 backdrop-blur-sm text-amber-100 px-4 py-2 flex items-center justify-between text-sm">
      {/* Left: Nation & Government */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Flag size={14} className="text-amber-400" />
          <span className="font-semibold">{nation.name}</span>
        </div>
        {nation.government && (
          <div className="flex items-center gap-2 text-stone-300">
            <Crown size={12} />
            <span>{nation.government.type.replace(/_/g, ' ')}</span>
          </div>
        )}
      </div>

      {/* Center: Era */}
      {nation.currentEra && (
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getEraColor(nation.currentEra)} text-white`}>
            {getEraDisplayName(nation.currentEra)}
          </span>
          {eraInfo && (
            <span className="text-xs text-stone-400">
              {eraInfo.characteristics.warfare}
            </span>
          )}
        </div>
      )}

      {/* Right: Year & Leader */}
      <div className="flex items-center gap-4">
        {nation.court?.leader && (
          <div className="text-stone-300 text-xs">
            {nation.government?.leaderTitle}: {nation.court.leader.name}
          </div>
        )}
        <div className="flex items-center gap-1 font-mono">
          <Calendar size={14} className="text-amber-400" />
          <span className="font-bold">{year}</span>
        </div>
      </div>
    </div>
  );
};

export default EraStatusBar;
