import { useEffect, useRef, useCallback } from 'react';

interface GameLoopOptions {
  onTick: (deltaTime: number) => void;
  targetFPS?: number;
  isPaused?: boolean;
}

export function useGameLoop({ onTick, targetFPS = 60, isPaused = false }: GameLoopOptions) {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const accumulatorRef = useRef(0);

  const frameTime = 1000 / targetFPS;

  const animate = useCallback((time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      accumulatorRef.current += deltaTime;

      // Fixed timestep for consistent game logic
      while (accumulatorRef.current >= frameTime) {
        if (!isPaused) {
          onTick(frameTime / 1000); // Convert to seconds
        }
        accumulatorRef.current -= frameTime;
      }
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, [onTick, frameTime, isPaused]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate]);
}

export default useGameLoop;
