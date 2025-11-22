import React, { useState } from 'react';

interface GameSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSaveSettings: (settings: Settings) => void;
  onResetDefaults: () => void;
}

interface Settings {
  // Graphics
  mapQuality: 'low' | 'medium' | 'high' | 'ultra';
  uiScale: number;
  showBorders: boolean;
  showProvinceNames: boolean;
  animationsEnabled: boolean;
  particleEffects: boolean;

  // Audio
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  ambienceVolume: number;
  muteWhenUnfocused: boolean;

  // Gameplay
  autosaveInterval: number;
  autosaveCount: number;
  pauseOnEvents: boolean;
  confirmImportantDecisions: boolean;
  showTutorialHints: boolean;
  difficultyLevel: 'easy' | 'normal' | 'hard' | 'very_hard';

  // Controls
  edgeScrolling: boolean;
  scrollSpeed: number;
  keyboardShortcuts: boolean;
  tooltipDelay: number;

  // Notifications
  notifyWar: boolean;
  notifyTreaty: boolean;
  notifyConstruction: boolean;
  notifyResearch: boolean;
  notifyEvent: boolean;
}

export const GameSettings: React.FC<GameSettingsProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onResetDefaults
}) => {
  const [currentSettings, setCurrentSettings] = useState<Settings>(settings);
  const [activeTab, setActiveTab] = useState<'graphics' | 'audio' | 'gameplay' | 'controls' | 'notifications'>('graphics');

  if (!isOpen) return null;

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setCurrentSettings({ ...currentSettings, [key]: value });
  };

  const handleSave = () => {
    onSaveSettings(currentSettings);
    onClose();
  };

  const handleReset = () => {
    onResetDefaults();
  };

  const tabs = [
    { id: 'graphics', name: 'Graphics', icon: '🖥️' },
    { id: 'audio', name: 'Audio', icon: '🔊' },
    { id: 'gameplay', name: 'Gameplay', icon: '🎮' },
    { id: 'controls', name: 'Controls', icon: '⌨️' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' }
  ];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <h2 className="text-xl font-bold text-stone-800">⚙️ Game Settings</h2>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 text-sm font-medium ${
                activeTab === tab.id
                  ? 'bg-amber-100 text-amber-700 border-b-2 border-amber-500'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {tab.icon} {tab.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'graphics' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Map Quality</label>
                <select
                  value={currentSettings.mapQuality}
                  onChange={e => updateSetting('mapQuality', e.target.value as any)}
                  className="w-full px-3 py-2 border border-stone-300 rounded"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="ultra">Ultra</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  UI Scale: {currentSettings.uiScale}%
                </label>
                <input
                  type="range"
                  min={50}
                  max={150}
                  value={currentSettings.uiScale}
                  onChange={e => updateSetting('uiScale', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={currentSettings.showBorders}
                  onChange={e => updateSetting('showBorders', e.target.checked)}
                />
                <span className="text-sm text-stone-700">Show province borders</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={currentSettings.showProvinceNames}
                  onChange={e => updateSetting('showProvinceNames', e.target.checked)}
                />
                <span className="text-sm text-stone-700">Show province names</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={currentSettings.animationsEnabled}
                  onChange={e => updateSetting('animationsEnabled', e.target.checked)}
                />
                <span className="text-sm text-stone-700">Enable animations</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={currentSettings.particleEffects}
                  onChange={e => updateSetting('particleEffects', e.target.checked)}
                />
                <span className="text-sm text-stone-700">Particle effects</span>
              </label>
            </div>
          )}

          {activeTab === 'audio' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Master Volume: {currentSettings.masterVolume}%
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={currentSettings.masterVolume}
                  onChange={e => updateSetting('masterVolume', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Music Volume: {currentSettings.musicVolume}%
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={currentSettings.musicVolume}
                  onChange={e => updateSetting('musicVolume', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Sound Effects: {currentSettings.sfxVolume}%
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={currentSettings.sfxVolume}
                  onChange={e => updateSetting('sfxVolume', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Ambience: {currentSettings.ambienceVolume}%
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={currentSettings.ambienceVolume}
                  onChange={e => updateSetting('ambienceVolume', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={currentSettings.muteWhenUnfocused}
                  onChange={e => updateSetting('muteWhenUnfocused', e.target.checked)}
                />
                <span className="text-sm text-stone-700">Mute when game is unfocused</span>
              </label>
            </div>
          )}

          {activeTab === 'gameplay' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Difficulty</label>
                <select
                  value={currentSettings.difficultyLevel}
                  onChange={e => updateSetting('difficultyLevel', e.target.value as any)}
                  className="w-full px-3 py-2 border border-stone-300 rounded"
                >
                  <option value="easy">Easy</option>
                  <option value="normal">Normal</option>
                  <option value="hard">Hard</option>
                  <option value="very_hard">Very Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Autosave Interval (minutes)
                </label>
                <select
                  value={currentSettings.autosaveInterval}
                  onChange={e => updateSetting('autosaveInterval', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-stone-300 rounded"
                >
                  <option value={1}>1 minute</option>
                  <option value={5}>5 minutes</option>
                  <option value={10}>10 minutes</option>
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Autosave Count
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={currentSettings.autosaveCount}
                  onChange={e => updateSetting('autosaveCount', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-stone-300 rounded"
                />
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={currentSettings.pauseOnEvents}
                  onChange={e => updateSetting('pauseOnEvents', e.target.checked)}
                />
                <span className="text-sm text-stone-700">Pause game on events</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={currentSettings.confirmImportantDecisions}
                  onChange={e => updateSetting('confirmImportantDecisions', e.target.checked)}
                />
                <span className="text-sm text-stone-700">Confirm important decisions</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={currentSettings.showTutorialHints}
                  onChange={e => updateSetting('showTutorialHints', e.target.checked)}
                />
                <span className="text-sm text-stone-700">Show tutorial hints</span>
              </label>
            </div>
          )}

          {activeTab === 'controls' && (
            <div className="space-y-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={currentSettings.edgeScrolling}
                  onChange={e => updateSetting('edgeScrolling', e.target.checked)}
                />
                <span className="text-sm text-stone-700">Edge scrolling</span>
              </label>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Scroll Speed: {currentSettings.scrollSpeed}
                </label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={currentSettings.scrollSpeed}
                  onChange={e => updateSetting('scrollSpeed', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={currentSettings.keyboardShortcuts}
                  onChange={e => updateSetting('keyboardShortcuts', e.target.checked)}
                />
                <span className="text-sm text-stone-700">Enable keyboard shortcuts</span>
              </label>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Tooltip Delay (ms)
                </label>
                <input
                  type="number"
                  min={0}
                  max={2000}
                  step={100}
                  value={currentSettings.tooltipDelay}
                  onChange={e => updateSetting('tooltipDelay', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-stone-300 rounded"
                />
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <p className="text-sm text-stone-600 mb-4">
                Choose which notifications to show:
              </p>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={currentSettings.notifyWar}
                  onChange={e => updateSetting('notifyWar', e.target.checked)}
                />
                <span className="text-sm text-stone-700">War declarations and peace offers</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={currentSettings.notifyTreaty}
                  onChange={e => updateSetting('notifyTreaty', e.target.checked)}
                />
                <span className="text-sm text-stone-700">Treaty offers</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={currentSettings.notifyConstruction}
                  onChange={e => updateSetting('notifyConstruction', e.target.checked)}
                />
                <span className="text-sm text-stone-700">Construction completed</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={currentSettings.notifyResearch}
                  onChange={e => updateSetting('notifyResearch', e.target.checked)}
                />
                <span className="text-sm text-stone-700">Research completed</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={currentSettings.notifyEvent}
                  onChange={e => updateSetting('notifyEvent', e.target.checked)}
                />
                <span className="text-sm text-stone-700">Events</span>
              </label>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-300 flex justify-between">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-stone-200 text-stone-700 rounded hover:bg-stone-300"
          >
            Reset to Defaults
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-stone-200 text-stone-700 rounded hover:bg-stone-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-amber-600 text-white rounded font-medium hover:bg-amber-700"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameSettings;
