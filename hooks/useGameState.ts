// Custom hook for managing game state

import { useState, useCallback, useEffect, useRef } from 'react';
import { NationStats } from '../types';

export interface GameState {
  year: number;
  turn: number;
  isPaused: boolean;
  speed: number;
  playerNation: string;
  selectedProvince: string | null;
  mapMode: string;
}

export interface UseGameStateReturn {
  state: GameState;
  // Time controls
  pause: () => void;
  resume: () => void;
  togglePause: () => void;
  setSpeed: (speed: number) => void;
  // Turn processing
  nextTurn: () => void;
  // Selection
  selectProvince: (id: string | null) => void;
  setMapMode: (mode: string) => void;
  // State management
  resetGame: () => void;
  loadState: (state: GameState) => void;
}

const DEFAULT_STATE: GameState = {
  year: 1700,
  turn: 0,
  isPaused: true,
  speed: 3,
  playerNation: '',
  selectedProvince: null,
  mapMode: 'political'
};

export function useGameState(
  initialState: Partial<GameState> = {},
  onTurnEnd?: (turn: number, year: number) => void
): UseGameStateReturn {
  const [state, setState] = useState<GameState>({
    ...DEFAULT_STATE,
    ...initialState
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Speed to milliseconds mapping
  const speedToMs = (speed: number): number => {
    switch (speed) {
      case 1: return 2000;
      case 2: return 1000;
      case 3: return 500;
      case 4: return 250;
      case 5: return 100;
      default: return 500;
    }
  };

  // Advance turn
  const nextTurn = useCallback(() => {
    setState(prev => {
      const newTurn = prev.turn + 1;
      const newYear = prev.year + (newTurn % 4 === 0 ? 1 : 0);

      if (onTurnEnd) {
        onTurnEnd(newTurn, newYear);
      }

      return {
        ...prev,
        turn: newTurn,
        year: newYear
      };
    });
  }, [onTurnEnd]);

  // Pause/resume
  const pause = useCallback(() => {
    setState(prev => ({ ...prev, isPaused: true }));
  }, []);

  const resume = useCallback(() => {
    setState(prev => ({ ...prev, isPaused: false }));
  }, []);

  const togglePause = useCallback(() => {
    setState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const setSpeed = useCallback((speed: number) => {
    setState(prev => ({ ...prev, speed: Math.max(1, Math.min(5, speed)) }));
  }, []);

  // Selection
  const selectProvince = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, selectedProvince: id }));
  }, []);

  const setMapMode = useCallback((mode: string) => {
    setState(prev => ({ ...prev, mapMode: mode }));
  }, []);

  // Reset
  const resetGame = useCallback(() => {
    setState({ ...DEFAULT_STATE, ...initialState });
  }, [initialState]);

  // Load state
  const loadState = useCallback((newState: GameState) => {
    setState(newState);
  }, []);

  // Auto-advance when not paused
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (!state.isPaused) {
      intervalRef.current = setInterval(nextTurn, speedToMs(state.speed));
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isPaused, state.speed, nextTurn]);

  return {
    state,
    pause,
    resume,
    togglePause,
    setSpeed,
    nextTurn,
    selectProvince,
    setMapMode,
    resetGame,
    loadState
  };
}

// Hook for tracking stat changes
export function useStatHistory(
  initialStats: NationStats,
  maxHistory: number = 100
) {
  const [history, setHistory] = useState<{ year: number; stats: NationStats }[]>([]);
  const [currentStats, setCurrentStats] = useState<NationStats>(initialStats);

  const recordStats = useCallback((year: number, stats: NationStats) => {
    setCurrentStats(stats);
    setHistory(prev => {
      const newHistory = [...prev, { year, stats }];
      if (newHistory.length > maxHistory) {
        return newHistory.slice(-maxHistory);
      }
      return newHistory;
    });
  }, [maxHistory]);

  const getStatTrend = useCallback((stat: keyof NationStats, periods: number = 5): 'up' | 'down' | 'stable' => {
    if (history.length < 2) return 'stable';

    const recent = history.slice(-periods);
    const first = recent[0]?.stats[stat] || 0;
    const last = recent[recent.length - 1]?.stats[stat] || 0;

    const change = last - first;
    if (change > 0.1) return 'up';
    if (change < -0.1) return 'down';
    return 'stable';
  }, [history]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    currentStats,
    history,
    recordStats,
    getStatTrend,
    clearHistory
  };
}

// Hook for notifications
export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

export function useNotifications(maxNotifications: number = 50) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((
    type: Notification['type'],
    title: string,
    message: string
  ) => {
    const notification: Notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      message,
      timestamp: Date.now(),
      read: false
    };

    setNotifications(prev => {
      const newNotifications = [notification, ...prev];
      if (newNotifications.length > maxNotifications) {
        return newNotifications.slice(0, maxNotifications);
      }
      return newNotifications;
    });

    return notification.id;
  }, [maxNotifications]);

  const markRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    addNotification,
    markRead,
    markAllRead,
    dismiss,
    clearAll
  };
}

export default useGameState;
