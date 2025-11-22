import { useEffect, useCallback } from 'react';

interface KeyboardShortcuts {
  onSave?: () => void;
  onLoad?: () => void;
  onToggleWorld?: () => void;
  onToggleCourt?: () => void;
  onToggleDiplomacy?: () => void;
  onToggleTech?: () => void;
  onEndTurn?: () => void;
  onEscape?: () => void;
  onNumber?: (num: number) => void;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcuts, enabled: boolean = true) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Don't trigger shortcuts when typing in inputs
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      return;
    }

    const key = event.key.toLowerCase();
    const ctrl = event.ctrlKey || event.metaKey;

    // Ctrl+S - Save
    if (ctrl && key === 's') {
      event.preventDefault();
      shortcuts.onSave?.();
      return;
    }

    // Ctrl+O - Load
    if (ctrl && key === 'o') {
      event.preventDefault();
      shortcuts.onLoad?.();
      return;
    }

    // Escape - Close modals/panels
    if (key === 'escape') {
      shortcuts.onEscape?.();
      return;
    }

    // Number keys 1-9 for quick actions
    if (!ctrl && /^[1-9]$/.test(key)) {
      shortcuts.onNumber?.(parseInt(key));
      return;
    }

    // W - World info
    if (key === 'w' && !ctrl) {
      shortcuts.onToggleWorld?.();
      return;
    }

    // C - Court
    if (key === 'c' && !ctrl) {
      shortcuts.onToggleCourt?.();
      return;
    }

    // D - Diplomacy
    if (key === 'd' && !ctrl) {
      shortcuts.onToggleDiplomacy?.();
      return;
    }

    // R - Research/Tech
    if (key === 'r' && !ctrl) {
      shortcuts.onToggleTech?.();
      return;
    }

    // Space or Enter - End turn (when available)
    if ((key === ' ' || key === 'enter') && !ctrl) {
      event.preventDefault();
      shortcuts.onEndTurn?.();
      return;
    }
  }, [shortcuts, enabled]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

// Help text for displaying shortcuts
export const SHORTCUT_HELP = [
  { key: 'Ctrl+S', action: 'Save game' },
  { key: 'Ctrl+O', action: 'Load game' },
  { key: 'W', action: 'Toggle World info' },
  { key: 'C', action: 'Toggle Court' },
  { key: 'D', action: 'Toggle Diplomacy' },
  { key: 'R', action: 'Toggle Research' },
  { key: 'Space', action: 'End turn' },
  { key: '1-9', action: 'Quick select option' },
  { key: 'Esc', action: 'Close panel/modal' },
];

export default useKeyboardShortcuts;
