import React, { useState } from 'react';
import { DifficultyLevel, DIFFICULTY_PRESETS, getDifficulty } from '../data/difficultySettings';
import { SHORTCUT_HELP } from '../hooks/useKeyboardShortcuts';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDifficulty: DifficultyLevel;
  onDifficultyChange: (difficulty: DifficultyLevel) => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentDifficulty,
  onDifficultyChange,
  soundEnabled,
  onSoundToggle
}) => {
  const [activeTab, setActiveTab] = useState<'gameplay' | 'audio' | 'shortcuts'>('gameplay');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-300">
          <h2 className="text-xl font-bold text-stone-800">Settings</h2>
          <button
            onClick={onClose}
            className="text-stone-500 hover:text-stone-800 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-300">
          {(['gameplay', 'audio', 'shortcuts'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 font-semibold capitalize ${
                activeTab === tab
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'gameplay' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-stone-800">Difficulty</h3>
              <div className="space-y-2">
                {(Object.keys(DIFFICULTY_PRESETS) as DifficultyLevel[]).map((level) => {
                  const preset = getDifficulty(level);
                  const isSelected = level === currentDifficulty;

                  return (
                    <button
                      key={level}
                      onClick={() => onDifficultyChange(level)}
                      className={`w-full p-3 rounded border-2 text-left transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-stone-300 hover:border-amber-300'
                      }`}
                    >
                      <div className="font-semibold text-stone-800">
                        {preset.name}
                        {isSelected && <span className="ml-2 text-amber-600">✓</span>}
                      </div>
                      <div className="text-sm text-stone-600">{preset.description}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'audio' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-stone-800">Sound Effects</h3>
                  <p className="text-sm text-stone-600">Play sounds for events and actions</p>
                </div>
                <button
                  onClick={onSoundToggle}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    soundEnabled ? 'bg-amber-600' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                      soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'shortcuts' && (
            <div className="space-y-2">
              <h3 className="font-semibold text-stone-800 mb-3">Keyboard Shortcuts</h3>
              {SHORTCUT_HELP.map((shortcut, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-stone-200 last:border-0"
                >
                  <span className="text-stone-700">{shortcut.action}</span>
                  <kbd className="px-2 py-1 bg-stone-200 rounded text-sm font-mono text-stone-600">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-300">
          <button
            onClick={onClose}
            className="w-full py-2 bg-stone-200 text-stone-700 rounded font-semibold hover:bg-stone-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
