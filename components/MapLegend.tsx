import React, { useState } from 'react';

export type MapMode =
  | 'political'
  | 'terrain'
  | 'religion'
  | 'trade'
  | 'military'
  | 'development';

interface MapLegendProps {
  currentMode: MapMode;
  onModeChange: (mode: MapMode) => void;
  collapsed?: boolean;
}

export const MapLegend: React.FC<MapLegendProps> = ({
  currentMode,
  onModeChange,
  collapsed = false
}) => {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);

  const modes: { id: MapMode; name: string; icon: string }[] = [
    { id: 'political', name: 'Political', icon: '🏳️' },
    { id: 'terrain', name: 'Terrain', icon: '🏔️' },
    { id: 'religion', name: 'Religion', icon: '⛪' },
    { id: 'trade', name: 'Trade', icon: '💰' },
    { id: 'military', name: 'Military', icon: '⚔️' },
    { id: 'development', name: 'Development', icon: '🏗️' }
  ];

  const legendItems: Record<MapMode, { color: string; label: string }[]> = {
    political: [
      { color: '#2563eb', label: 'Your Nation' },
      { color: '#16a34a', label: 'Allies' },
      { color: '#eab308', label: 'Neutral' },
      { color: '#dc2626', label: 'Enemies' },
      { color: '#6b7280', label: 'Uncolonized' }
    ],
    terrain: [
      { color: '#22c55e', label: 'Plains' },
      { color: '#14532d', label: 'Forest' },
      { color: '#a16207', label: 'Desert' },
      { color: '#78716c', label: 'Mountains' },
      { color: '#0ea5e9', label: 'Water' }
    ],
    religion: [
      { color: '#fbbf24', label: 'Catholic' },
      { color: '#3b82f6', label: 'Protestant' },
      { color: '#8b5cf6', label: 'Orthodox' },
      { color: '#10b981', label: 'Islamic' },
      { color: '#f97316', label: 'Other' }
    ],
    trade: [
      { color: '#15803d', label: 'High Trade' },
      { color: '#84cc16', label: 'Medium Trade' },
      { color: '#fde047', label: 'Low Trade' },
      { color: '#9ca3af', label: 'No Trade' }
    ],
    military: [
      { color: '#dc2626', label: 'Active Combat' },
      { color: '#f97316', label: 'High Presence' },
      { color: '#eab308', label: 'Moderate' },
      { color: '#22c55e', label: 'Peaceful' }
    ],
    development: [
      { color: '#3b82f6', label: 'Highly Developed' },
      { color: '#06b6d4', label: 'Developed' },
      { color: '#84cc16', label: 'Developing' },
      { color: '#f59e0b', label: 'Undeveloped' }
    ]
  };

  return (
    <div className="absolute bottom-4 left-4 bg-[#f4efe4] rounded-lg shadow-lg border border-stone-300 overflow-hidden z-30">
      {/* Header */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full px-3 py-2 bg-stone-200 flex justify-between items-center hover:bg-stone-300"
      >
        <span className="font-semibold text-stone-800 text-sm">Map Legend</span>
        <span className="text-stone-600">{isCollapsed ? '▲' : '▼'}</span>
      </button>

      {!isCollapsed && (
        <>
          {/* Mode selector */}
          <div className="p-2 border-b border-stone-200">
            <div className="grid grid-cols-3 gap-1">
              {modes.map(mode => (
                <button
                  key={mode.id}
                  onClick={() => onModeChange(mode.id)}
                  className={`px-2 py-1 rounded text-xs ${
                    currentMode === mode.id
                      ? 'bg-amber-600 text-white'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                  title={mode.name}
                >
                  {mode.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Legend items */}
          <div className="p-2 space-y-1">
            {legendItems[currentMode].map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-4 h-3 rounded"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-stone-700">{item.label}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Map mode quick selector for header
export const MapModeSelector: React.FC<{
  currentMode: MapMode;
  onModeChange: (mode: MapMode) => void;
}> = ({ currentMode, onModeChange }) => {
  const modes: { id: MapMode; icon: string; label: string }[] = [
    { id: 'political', icon: '🏳️', label: 'Political' },
    { id: 'trade', icon: '💰', label: 'Trade' },
    { id: 'military', icon: '⚔️', label: 'Military' }
  ];

  return (
    <div className="flex gap-1">
      {modes.map(mode => (
        <button
          key={mode.id}
          onClick={() => onModeChange(mode.id)}
          className={`px-2 py-1 rounded text-sm ${
            currentMode === mode.id
              ? 'bg-amber-600 text-white'
              : 'bg-stone-600 text-stone-200 hover:bg-stone-500'
          }`}
          title={mode.label}
        >
          {mode.icon}
        </button>
      ))}
    </div>
  );
};

export default MapLegend;
