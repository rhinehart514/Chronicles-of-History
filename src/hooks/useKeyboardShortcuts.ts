import { useEffect, useCallback } from 'react';

type KeyHandler = (event: KeyboardEvent) => void;

interface ShortcutConfig {
  key: string;
  handler: KeyHandler;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  preventDefault?: boolean;
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    for (const shortcut of shortcuts) {
      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
      const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
      const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
      const altMatch = shortcut.alt ? event.altKey : !event.altKey;

      if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
        if (shortcut.preventDefault !== false) {
          event.preventDefault();
        }
        shortcut.handler(event);
        break;
      }
    }
  }, [shortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

// Common game shortcuts
export const GAME_SHORTCUTS = {
  PAUSE: ' ',
  SPEED_1: '1',
  SPEED_2: '2',
  SPEED_3: '3',
  SPEED_4: '4',
  SPEED_5: '5',
  MAP_POLITICAL: 'q',
  MAP_TERRAIN: 'w',
  MAP_TRADE: 'e',
  MAP_RELIGION: 'r',
  DIPLOMACY: 'f1',
  MILITARY: 'f2',
  ECONOMY: 'f3',
  TRADE: 'f4',
  TECHNOLOGY: 'f5',
  IDEAS: 'f6',
  MISSIONS: 'f7',
  DECISIONS: 'f8',
  ESCAPE: 'escape',
  SAVE: 's',
  LOAD: 'l',
};

export default useKeyboardShortcuts;
