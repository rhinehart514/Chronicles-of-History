import React from 'react';

interface Province {
  id: string;
  x: number;
  y: number;
  owner: string;
  color: string;
}

interface Army {
  id: string;
  x: number;
  y: number;
  owner: string;
}

interface MiniMapProps {
  provinces: Province[];
  armies: Army[];
  playerNation: string;
  viewportX: number;
  viewportY: number;
  viewportWidth: number;
  viewportHeight: number;
  mapWidth: number;
  mapHeight: number;
  onNavigate?: (x: number, y: number) => void;
}

export default function MiniMap({
  provinces,
  armies,
  playerNation,
  viewportX,
  viewportY,
  viewportWidth,
  viewportHeight,
  mapWidth,
  mapHeight,
  onNavigate
}: MiniMapProps) {
  const miniMapWidth = 200;
  const miniMapHeight = 120;

  const scaleX = miniMapWidth / mapWidth;
  const scaleY = miniMapHeight / mapHeight;

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!onNavigate) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / miniMapWidth) * mapWidth;
    const y = ((e.clientY - rect.top) / miniMapHeight) * mapHeight;

    onNavigate(x, y);
  };

  return (
    <div className="bg-stone-800 rounded-lg p-2 shadow-lg">
      <svg
        width={miniMapWidth}
        height={miniMapHeight}
        className="bg-stone-900 rounded cursor-pointer"
        onClick={handleClick}
      >
        {/* Provinces */}
        {provinces.map(province => (
          <rect
            key={province.id}
            x={province.x * scaleX}
            y={province.y * scaleY}
            width={4}
            height={4}
            fill={province.owner === playerNation ? '#fbbf24' : province.color}
            opacity={0.8}
          />
        ))}

        {/* Armies */}
        {armies.map(army => (
          <circle
            key={army.id}
            cx={army.x * scaleX}
            cy={army.y * scaleY}
            r={2}
            fill={army.owner === playerNation ? '#22c55e' : '#ef4444'}
          />
        ))}

        {/* Viewport indicator */}
        <rect
          x={viewportX * scaleX}
          y={viewportY * scaleY}
          width={viewportWidth * scaleX}
          height={viewportHeight * scaleY}
          fill="none"
          stroke="#ffffff"
          strokeWidth={1}
          opacity={0.7}
        />
      </svg>

      <div className="flex justify-between mt-1 text-xs text-stone-400">
        <span>📍 {Math.round(viewportX)}, {Math.round(viewportY)}</span>
        <span>🗺️</span>
      </div>
    </div>
  );
}
