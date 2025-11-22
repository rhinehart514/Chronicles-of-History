import { useState, useCallback, useRef, useEffect } from 'react';

export type GameSpeed = 'paused' | 'normal' | 'fast' | 'fastest';

export interface GameSpeedConfig {
  speed: GameSpeed;
  label: string;
  icon: string;
  autoAdvanceDelay: number; // ms, 0 = manual only
}

export const GAME_SPEEDS: Record<GameSpeed, GameSpeedConfig> = {
  paused: {
    speed: 'paused',
    label: 'Paused',
    icon: '⏸',
    autoAdvanceDelay: 0
  },
  normal: {
    speed: 'normal',
    label: 'Normal',
    icon: '▶',
    autoAdvanceDelay: 0 // Manual advancement
  },
  fast: {
    speed: 'fast',
    label: 'Fast',
    icon: '⏩',
    autoAdvanceDelay: 3000 // Auto-advance after 3 seconds
  },
  fastest: {
    speed: 'fastest',
    label: 'Fastest',
    icon: '⏭',
    autoAdvanceDelay: 1000 // Auto-advance after 1 second
  }
};

interface UseGameSpeedReturn {
  currentSpeed: GameSpeed;
  speedConfig: GameSpeedConfig;
  setSpeed: (speed: GameSpeed) => void;
  cycleSpeed: () => void;
  isPaused: boolean;
  isAutoAdvancing: boolean;
}

export function useGameSpeed(
  onAutoAdvance?: () => void,
  canAutoAdvance: boolean = true
): UseGameSpeedReturn {
  const [currentSpeed, setCurrentSpeed] = useState<GameSpeed>('normal');
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const speedConfig = GAME_SPEEDS[currentSpeed];
  const isPaused = currentSpeed === 'paused';
  const isAutoAdvancing = speedConfig.autoAdvanceDelay > 0 && canAutoAdvance;

  // Clear any existing timer
  const clearAutoAdvance = useCallback(() => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  }, []);

  // Set up auto-advance timer when speed changes
  useEffect(() => {
    clearAutoAdvance();

    if (isAutoAdvancing && onAutoAdvance) {
      autoAdvanceTimerRef.current = setTimeout(() => {
        onAutoAdvance();
      }, speedConfig.autoAdvanceDelay);
    }

    return clearAutoAdvance;
  }, [currentSpeed, canAutoAdvance, onAutoAdvance, speedConfig.autoAdvanceDelay, isAutoAdvancing, clearAutoAdvance]);

  const setSpeed = useCallback((speed: GameSpeed) => {
    setCurrentSpeed(speed);
  }, []);

  const cycleSpeed = useCallback(() => {
    const speeds: GameSpeed[] = ['paused', 'normal', 'fast', 'fastest'];
    const currentIndex = speeds.indexOf(currentSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setCurrentSpeed(speeds[nextIndex]);
  }, [currentSpeed]);

  return {
    currentSpeed,
    speedConfig,
    setSpeed,
    cycleSpeed,
    isPaused,
    isAutoAdvancing
  };
}

// Speed control component for easy integration
export const SpeedControlButton: React.FC<{
  currentSpeed: GameSpeed;
  onCycle: () => void;
}> = ({ currentSpeed, onCycle }) => {
  const config = GAME_SPEEDS[currentSpeed];

  return (
    <button
      onClick={onCycle}
      className="px-3 py-2 rounded-lg shadow-lg transition-all bg-[#f4efe4] text-stone-700 hover:bg-stone-200 border-2 border-stone-400"
      title={`Speed: ${config.label} (click to cycle)`}
    >
      {config.icon} {config.label}
    </button>
  );
};

export default useGameSpeed;
