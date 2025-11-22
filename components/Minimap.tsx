import React from 'react';

interface Territory {
  id: string;
  name: string;
  color: string;
  center: [number, number]; // lat, lng
}

interface MinimapProps {
  territories: Territory[];
  selectedTerritory?: string;
  onTerritoryClick: (id: string) => void;
  playerNationId: string;
  viewBounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

export const Minimap: React.FC<MinimapProps> = ({
  territories,
  selectedTerritory,
  onTerritoryClick,
  playerNationId,
  viewBounds
}) => {
  // Map bounds (approximate Europe)
  const bounds = {
    minLat: 35,
    maxLat: 70,
    minLng: -10,
    maxLng: 40
  };

  // Convert lat/lng to minimap coordinates
  const toMinimapCoords = (lat: number, lng: number): { x: number; y: number } => {
    const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100;
    const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * 100;
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  };

  return (
    <div className="bg-stone-800 rounded-lg p-2 border border-stone-700">
      <div className="text-xs text-stone-400 mb-1 font-semibold">Map</div>

      <div
        className="relative bg-blue-900/30 rounded"
        style={{ width: '150px', height: '120px' }}
      >
        {/* Territories as dots */}
        {territories.map((territory) => {
          const coords = toMinimapCoords(territory.center[0], territory.center[1]);
          const isPlayer = territory.id === playerNationId;
          const isSelected = territory.id === selectedTerritory;

          return (
            <button
              key={territory.id}
              onClick={() => onTerritoryClick(territory.id)}
              className={`absolute rounded-full transition-all transform -translate-x-1/2 -translate-y-1/2 ${
                isSelected ? 'ring-2 ring-white scale-125' : 'hover:scale-110'
              }`}
              style={{
                left: `${coords.x}%`,
                top: `${coords.y}%`,
                width: isPlayer ? '10px' : '6px',
                height: isPlayer ? '10px' : '6px',
                backgroundColor: territory.color
              }}
              title={territory.name}
            />
          );
        })}

        {/* View bounds indicator */}
        {viewBounds && (
          <div
            className="absolute border-2 border-amber-400/50 bg-amber-400/10 pointer-events-none"
            style={{
              left: `${toMinimapCoords(0, viewBounds.west).x}%`,
              top: `${toMinimapCoords(viewBounds.north, 0).y}%`,
              width: `${toMinimapCoords(0, viewBounds.east).x - toMinimapCoords(0, viewBounds.west).x}%`,
              height: `${toMinimapCoords(viewBounds.south, 0).y - toMinimapCoords(viewBounds.north, 0).y}%`
            }}
          />
        )}

        {/* Cardinal directions */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[8px] text-stone-500">N</div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[8px] text-stone-500">S</div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[8px] text-stone-500">W</div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[8px] text-stone-500">E</div>
      </div>

      {/* Legend */}
      <div className="mt-2 flex items-center gap-2 text-[10px] text-stone-400">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span>You</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-stone-400" />
          <span>Others</span>
        </div>
      </div>
    </div>
  );
};

// Simplified minimap for header
export const MinimapCompact: React.FC<{
  playerPosition: [number, number];
  onClick: () => void;
}> = ({ playerPosition, onClick }) => {
  const bounds = {
    minLat: 35,
    maxLat: 70,
    minLng: -10,
    maxLng: 40
  };

  const x = ((playerPosition[1] - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100;
  const y = ((bounds.maxLat - playerPosition[0]) / (bounds.maxLat - bounds.minLat)) * 100;

  return (
    <button
      onClick={onClick}
      className="relative bg-blue-900/30 rounded border border-stone-600 hover:border-amber-500 transition-colors"
      style={{ width: '40px', height: '32px' }}
      title="Open Map"
    >
      <div
        className="absolute w-2 h-2 bg-amber-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${Math.max(10, Math.min(90, x))}%`,
          top: `${Math.max(10, Math.min(90, y))}%`
        }}
      />
    </button>
  );
};

export default Minimap;
