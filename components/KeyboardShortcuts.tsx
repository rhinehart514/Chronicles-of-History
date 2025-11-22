import React, { useState } from 'react';

export interface Shortcut {
  key: string;
  description: string;
  category: string;
}

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DEFAULT_SHORTCUTS: Shortcut[] = [
  // Time controls
  { key: 'Space', description: 'Pause/Resume', category: 'Time' },
  { key: '+', description: 'Increase speed', category: 'Time' },
  { key: '-', description: 'Decrease speed', category: 'Time' },
  { key: '1-5', description: 'Set speed directly', category: 'Time' },

  // Map controls
  { key: 'Q', description: 'Political map', category: 'Map' },
  { key: 'W', description: 'Terrain map', category: 'Map' },
  { key: 'E', description: 'Trade map', category: 'Map' },
  { key: 'R', description: 'Military map', category: 'Map' },
  { key: 'Arrow Keys', description: 'Pan map', category: 'Map' },
  { key: 'Scroll', description: 'Zoom in/out', category: 'Map' },
  { key: 'Home', description: 'Center on capital', category: 'Map' },

  // Panels
  { key: 'F1', description: 'Open Economy', category: 'Panels' },
  { key: 'F2', description: 'Open Military', category: 'Panels' },
  { key: 'F3', description: 'Open Diplomacy', category: 'Panels' },
  { key: 'F4', description: 'Open Technology', category: 'Panels' },
  { key: 'F5', description: 'Open Statistics', category: 'Panels' },
  { key: 'F6', description: 'Open Ledger', category: 'Panels' },
  { key: 'F9', description: 'Quick Save', category: 'Panels' },
  { key: 'F10', description: 'Quick Load', category: 'Panels' },
  { key: 'Esc', description: 'Close panel / Menu', category: 'Panels' },

  // Actions
  { key: 'B', description: 'Build/Construct', category: 'Actions' },
  { key: 'D', description: 'Develop province', category: 'Actions' },
  { key: 'A', description: 'Select all armies', category: 'Actions' },
  { key: 'N', description: 'Next notification', category: 'Actions' },
  { key: 'Tab', description: 'Cycle through armies', category: 'Actions' },
  { key: 'Delete', description: 'Delete unit', category: 'Actions' },

  // Selection
  { key: 'Click', description: 'Select province/unit', category: 'Selection' },
  { key: 'Shift+Click', description: 'Add to selection', category: 'Selection' },
  { key: 'Ctrl+Click', description: 'Remove from selection', category: 'Selection' },
  { key: 'Double Click', description: 'Open detail view', category: 'Selection' },
  { key: 'Right Click', description: 'Context menu / Move', category: 'Selection' },

  // Interface
  { key: '?', description: 'Show shortcuts', category: 'Interface' },
  { key: 'Ctrl+S', description: 'Save game', category: 'Interface' },
  { key: 'Ctrl+L', description: 'Load game', category: 'Interface' },
  { key: 'F11', description: 'Toggle fullscreen', category: 'Interface' },
  { key: 'M', description: 'Toggle minimap', category: 'Interface' },
  { key: 'L', description: 'Toggle ledger', category: 'Interface' },
];

export const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({
  isOpen,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const categories = [...new Set(DEFAULT_SHORTCUTS.map(s => s.category))];

  const filteredShortcuts = searchTerm
    ? DEFAULT_SHORTCUTS.filter(
        s =>
          s.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : DEFAULT_SHORTCUTS;

  const shortcutsByCategory = categories.reduce<Record<string, Shortcut[]>>((acc, cat) => {
    acc[cat] = filteredShortcuts.filter(s => s.category === cat);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <h2 className="text-xl font-bold text-stone-800">⌨️ Keyboard Shortcuts</h2>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-stone-200">
          <input
            type="text"
            placeholder="Search shortcuts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-stone-300 rounded text-sm"
          />
        </div>

        {/* Shortcuts */}
        <div className="flex-1 overflow-y-auto p-4">
          {categories.map(category => {
            const shortcuts = shortcutsByCategory[category];
            if (shortcuts.length === 0) return null;

            return (
              <div key={category} className="mb-6">
                <h3 className="font-semibold text-stone-800 mb-3">{category}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {shortcuts.map(shortcut => (
                    <div
                      key={shortcut.key + shortcut.description}
                      className="flex items-center justify-between bg-stone-100 rounded p-2"
                    >
                      <span className="text-sm text-stone-600">{shortcut.description}</span>
                      <kbd className="px-2 py-1 bg-white border border-stone-300 rounded text-xs font-mono">
                        {shortcut.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {filteredShortcuts.length === 0 && (
            <p className="text-center text-stone-500 py-8">
              No shortcuts found for "{searchTerm}"
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-stone-300 bg-stone-100 text-center text-xs text-stone-500">
          Press <kbd className="px-1 bg-white border rounded">?</kbd> anytime to show this dialog
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcuts;
