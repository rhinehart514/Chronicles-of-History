import React from 'react';
import { Nation } from '../types';

interface PauseMenuProps {
  isOpen: boolean;
  onResume: () => void;
  onSave: () => void;
  onLoad: () => void;
  onSettings: () => void;
  onMainMenu: () => void;
  nation?: Nation;
  year: number;
}

export const PauseMenu: React.FC<PauseMenuProps> = ({
  isOpen,
  onResume,
  onSave,
  onLoad,
  onSettings,
  onMainMenu,
  nation,
  year
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-sm border-4 border-stone-600 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-b from-stone-200 to-transparent text-center border-b border-stone-300">
          <h2 className="text-2xl font-bold text-stone-800 font-serif">
            Game Paused
          </h2>
          {nation && (
            <div className="mt-2 text-stone-600">
              <span className="font-semibold">{nation.name}</span>
              <span className="mx-2">•</span>
              <span>{year}</span>
            </div>
          )}
        </div>

        {/* Menu Options */}
        <div className="p-4 space-y-2">
          <button
            onClick={onResume}
            className="w-full py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors"
          >
            Resume Game
          </button>

          <button
            onClick={onSave}
            className="w-full py-3 bg-stone-200 text-stone-700 rounded-lg font-semibold hover:bg-stone-300 transition-colors"
          >
            Save Game
          </button>

          <button
            onClick={onLoad}
            className="w-full py-3 bg-stone-200 text-stone-700 rounded-lg font-semibold hover:bg-stone-300 transition-colors"
          >
            Load Game
          </button>

          <button
            onClick={onSettings}
            className="w-full py-3 bg-stone-200 text-stone-700 rounded-lg font-semibold hover:bg-stone-300 transition-colors"
          >
            Settings
          </button>

          <div className="pt-2 border-t border-stone-300">
            <button
              onClick={onMainMenu}
              className="w-full py-3 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-colors"
            >
              Exit to Main Menu
            </button>
          </div>
        </div>

        {/* Keyboard hint */}
        <div className="p-3 bg-stone-100 text-center text-xs text-stone-500">
          Press <kbd className="px-1 py-0.5 bg-stone-200 rounded">Esc</kbd> to resume
        </div>
      </div>
    </div>
  );
};

export default PauseMenu;
