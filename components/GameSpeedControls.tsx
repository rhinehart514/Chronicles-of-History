import React from 'react';
import { GameSpeed } from '../hooks/useGameSpeed';

interface GameSpeedControlsProps {
  currentSpeed: GameSpeed;
  onSpeedChange: (speed: GameSpeed) => void;
  onPause: () => void;
  onResume: () => void;
  isPaused: boolean;
  year: number;
  phase?: string;
}

export const GameSpeedControls: React.FC<GameSpeedControlsProps> = ({
  currentSpeed,
  onSpeedChange,
  onPause,
  onResume,
  isPaused,
  year,
  phase
}) => {
  const speeds: { speed: GameSpeed; label: string; icon: string }[] = [
    { speed: 'normal', label: 'Normal', icon: '▶' },
    { speed: 'fast', label: 'Fast', icon: '▶▶' },
    { speed: 'fastest', label: 'Fastest', icon: '▶▶▶' }
  ];

  return (
    <div className="flex items-center gap-2 bg-stone-800 rounded-lg px-3 py-2">
      {/* Year display */}
      <div className="text-amber-400 font-bold font-serif text-lg min-w-[60px]">
        {year}
      </div>

      {/* Phase indicator */}
      {phase && (
        <div className="text-stone-400 text-sm px-2 border-l border-stone-600">
          {phase}
        </div>
      )}

      {/* Divider */}
      <div className="w-px h-6 bg-stone-600 mx-1" />

      {/* Pause/Play button */}
      <button
        onClick={isPaused ? onResume : onPause}
        className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
          isPaused
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-stone-600 hover:bg-stone-500 text-stone-200'
        }`}
        title={isPaused ? 'Resume (Space)' : 'Pause (Space)'}
      >
        {isPaused ? '▶' : '⏸'}
      </button>

      {/* Speed controls */}
      <div className="flex gap-1">
        {speeds.map(({ speed, label, icon }) => (
          <button
            key={speed}
            onClick={() => onSpeedChange(speed)}
            disabled={isPaused}
            className={`px-2 py-1 rounded text-xs font-semibold transition-colors ${
              currentSpeed === speed && !isPaused
                ? 'bg-amber-600 text-white'
                : isPaused
                ? 'bg-stone-700 text-stone-500 cursor-not-allowed'
                : 'bg-stone-600 text-stone-300 hover:bg-stone-500'
            }`}
            title={`${label} Speed`}
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
};

// Compact version for smaller spaces
export const GameSpeedControlsCompact: React.FC<{
  currentSpeed: GameSpeed;
  onSpeedChange: (speed: GameSpeed) => void;
  isPaused: boolean;
  onTogglePause: () => void;
}> = ({ currentSpeed, onSpeedChange, isPaused, onTogglePause }) => {
  const cycleSpeed = () => {
    const speeds: GameSpeed[] = ['normal', 'fast', 'fastest'];
    const currentIndex = speeds.indexOf(currentSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    onSpeedChange(speeds[nextIndex]);
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onTogglePause}
        className={`w-6 h-6 rounded text-xs ${
          isPaused ? 'bg-green-600 text-white' : 'bg-stone-600 text-stone-300'
        }`}
      >
        {isPaused ? '▶' : '⏸'}
      </button>
      <button
        onClick={cycleSpeed}
        disabled={isPaused}
        className={`px-2 py-1 rounded text-xs ${
          isPaused ? 'bg-stone-700 text-stone-500' : 'bg-stone-600 text-stone-300'
        }`}
      >
        {currentSpeed === 'normal' ? '1x' : currentSpeed === 'fast' ? '2x' : '3x'}
      </button>
    </div>
  );
};

export default GameSpeedControls;
