import React from 'react';

interface HotkeyGroup {
  name: string;
  hotkeys: { key: string; description: string }[];
}

interface HotkeyOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HotkeyOverlay: React.FC<HotkeyOverlayProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const hotkeyGroups: HotkeyGroup[] = [
    {
      name: 'Game Controls',
      hotkeys: [
        { key: 'Space', description: 'Pause/Resume game' },
        { key: 'Enter', description: 'End turn / Confirm' },
        { key: 'Esc', description: 'Close modal / Open pause menu' },
        { key: '+/-', description: 'Zoom map in/out' },
      ]
    },
    {
      name: 'Save & Load',
      hotkeys: [
        { key: 'Ctrl+S', description: 'Quick save' },
        { key: 'Ctrl+L', description: 'Quick load' },
        { key: 'F5', description: 'Save game menu' },
        { key: 'F9', description: 'Load game menu' }
      ]
    },
    {
      name: 'Panels',
      hotkeys: [
        { key: 'W', description: 'Toggle world view' },
        { key: 'C', description: 'Toggle court view' },
        { key: 'D', description: 'Toggle diplomacy' },
        { key: 'T', description: 'Toggle technology' },
        { key: 'M', description: 'Toggle military' },
        { key: 'E', description: 'Toggle economy' }
      ]
    },
    {
      name: 'Quick Actions',
      hotkeys: [
        { key: '1-9', description: 'Select option/choice' },
        { key: 'Q', description: 'Open quick actions' },
        { key: 'N', description: 'View notifications' },
        { key: 'A', description: 'View achievements' }
      ]
    },
    {
      name: 'Camera & Map',
      hotkeys: [
        { key: 'Arrow Keys', description: 'Pan map' },
        { key: 'Home', description: 'Center on capital' },
        { key: 'Tab', description: 'Cycle through territories' },
        { key: 'F', description: 'Toggle fullscreen map' }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <h2 className="text-xl font-bold text-stone-800">⌨️ Keyboard Shortcuts</h2>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-4">
            {hotkeyGroups.map((group) => (
              <div key={group.name} className="bg-white rounded border border-stone-200 p-3">
                <h3 className="font-semibold text-stone-800 mb-2 pb-2 border-b border-stone-100">
                  {group.name}
                </h3>
                <div className="space-y-2">
                  {group.hotkeys.map((hotkey) => (
                    <div key={hotkey.key} className="flex justify-between items-center gap-2">
                      <span className="text-sm text-stone-600">{hotkey.description}</span>
                      <kbd className="px-2 py-0.5 bg-stone-100 border border-stone-300 rounded text-xs font-mono text-stone-700 whitespace-nowrap">
                        {hotkey.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-stone-300 bg-stone-100 text-center text-sm text-stone-500">
          Press <kbd className="px-1 py-0.5 bg-stone-200 rounded text-xs">?</kbd> or <kbd className="px-1 py-0.5 bg-stone-200 rounded text-xs">F1</kbd> to toggle this overlay
        </div>
      </div>
    </div>
  );
};

export default HotkeyOverlay;
