import React, { useState } from 'react';

export interface GameSettings {
  audio: {
    masterVolume: number;
    musicVolume: number;
    sfxVolume: number;
    ambientVolume: number;
    muteOnUnfocus: boolean;
  };
  graphics: {
    mapQuality: 'low' | 'medium' | 'high';
    animations: boolean;
    showBorders: boolean;
    showLabels: boolean;
    colorblindMode: boolean;
  };
  gameplay: {
    autosaveInterval: number;
    pauseOnEvent: boolean;
    confirmActions: boolean;
    tooltipDelay: number;
    gameSpeed: number;
  };
  accessibility: {
    fontSize: 'small' | 'medium' | 'large';
    highContrast: boolean;
    reduceMotion: boolean;
    screenReader: boolean;
  };
}

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onSave: (settings: GameSettings) => void;
  onReset: () => void;
}

export const DEFAULT_SETTINGS: GameSettings = {
  audio: {
    masterVolume: 80,
    musicVolume: 70,
    sfxVolume: 80,
    ambientVolume: 50,
    muteOnUnfocus: true
  },
  graphics: {
    mapQuality: 'high',
    animations: true,
    showBorders: true,
    showLabels: true,
    colorblindMode: false
  },
  gameplay: {
    autosaveInterval: 5,
    pauseOnEvent: true,
    confirmActions: true,
    tooltipDelay: 500,
    gameSpeed: 3
  },
  accessibility: {
    fontSize: 'medium',
    highContrast: false,
    reduceMotion: false,
    screenReader: false
  }
};

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
  onReset
}) => {
  const [currentSettings, setCurrentSettings] = useState<GameSettings>(settings);
  const [activeTab, setActiveTab] = useState<'audio' | 'graphics' | 'gameplay' | 'accessibility'>('audio');

  if (!isOpen) return null;

  const updateSetting = <K extends keyof GameSettings>(
    category: K,
    key: keyof GameSettings[K],
    value: GameSettings[K][keyof GameSettings[K]]
  ) => {
    setCurrentSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    onSave(currentSettings);
    onClose();
  };

  const handleReset = () => {
    setCurrentSettings(DEFAULT_SETTINGS);
    onReset();
  };

  const renderSlider = (
    label: string,
    value: number,
    onChange: (val: number) => void,
    min = 0,
    max = 100
  ) => (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <label className="text-sm text-stone-700">{label}</label>
        <span className="text-sm font-medium text-stone-800">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-stone-300 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );

  const renderToggle = (
    label: string,
    value: boolean,
    onChange: (val: boolean) => void,
    description?: string
  ) => (
    <div className="flex items-center justify-between py-2">
      <div>
        <div className="text-sm font-medium text-stone-700">{label}</div>
        {description && <div className="text-xs text-stone-500">{description}</div>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-12 h-6 rounded-full transition-colors ${
          value ? 'bg-amber-500' : 'bg-stone-300'
        }`}
      >
        <div
          className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
            value ? 'translate-x-6' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );

  const renderSelect = <T extends string>(
    label: string,
    value: T,
    options: { value: T; label: string }[],
    onChange: (val: T) => void
  ) => (
    <div className="mb-4">
      <label className="text-sm text-stone-700 block mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full p-2 border border-stone-300 rounded bg-white text-stone-800"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <h2 className="text-xl font-bold text-stone-800">⚙️ Settings</h2>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="p-2 border-b border-stone-200 flex gap-2">
          {(['audio', 'graphics', 'gameplay', 'accessibility'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded text-sm font-medium ${
                activeTab === tab
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'audio' && (
            <div>
              {renderSlider('Master Volume', currentSettings.audio.masterVolume,
                (v) => updateSetting('audio', 'masterVolume', v))}
              {renderSlider('Music Volume', currentSettings.audio.musicVolume,
                (v) => updateSetting('audio', 'musicVolume', v))}
              {renderSlider('Sound Effects', currentSettings.audio.sfxVolume,
                (v) => updateSetting('audio', 'sfxVolume', v))}
              {renderSlider('Ambient Sounds', currentSettings.audio.ambientVolume,
                (v) => updateSetting('audio', 'ambientVolume', v))}
              {renderToggle('Mute when unfocused', currentSettings.audio.muteOnUnfocus,
                (v) => updateSetting('audio', 'muteOnUnfocus', v),
                'Mute audio when game window loses focus')}
            </div>
          )}

          {activeTab === 'graphics' && (
            <div>
              {renderSelect('Map Quality', currentSettings.graphics.mapQuality, [
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' }
              ], (v) => updateSetting('graphics', 'mapQuality', v))}
              {renderToggle('Animations', currentSettings.graphics.animations,
                (v) => updateSetting('graphics', 'animations', v),
                'Enable UI and map animations')}
              {renderToggle('Show Borders', currentSettings.graphics.showBorders,
                (v) => updateSetting('graphics', 'showBorders', v),
                'Display nation borders on map')}
              {renderToggle('Show Labels', currentSettings.graphics.showLabels,
                (v) => updateSetting('graphics', 'showLabels', v),
                'Display province and city labels')}
              {renderToggle('Colorblind Mode', currentSettings.graphics.colorblindMode,
                (v) => updateSetting('graphics', 'colorblindMode', v),
                'Use colorblind-friendly palette')}
            </div>
          )}

          {activeTab === 'gameplay' && (
            <div>
              {renderSlider('Autosave Interval', currentSettings.gameplay.autosaveInterval,
                (v) => updateSetting('gameplay', 'autosaveInterval', v), 1, 30)}
              <div className="text-xs text-stone-500 -mt-2 mb-4">Minutes between autosaves</div>

              {renderSlider('Game Speed', currentSettings.gameplay.gameSpeed,
                (v) => updateSetting('gameplay', 'gameSpeed', v), 1, 5)}
              <div className="text-xs text-stone-500 -mt-2 mb-4">Default game speed (1-5)</div>

              {renderSlider('Tooltip Delay', currentSettings.gameplay.tooltipDelay,
                (v) => updateSetting('gameplay', 'tooltipDelay', v), 0, 2000)}
              <div className="text-xs text-stone-500 -mt-2 mb-4">Milliseconds before tooltips appear</div>

              {renderToggle('Pause on Events', currentSettings.gameplay.pauseOnEvent,
                (v) => updateSetting('gameplay', 'pauseOnEvent', v),
                'Automatically pause when events occur')}
              {renderToggle('Confirm Actions', currentSettings.gameplay.confirmActions,
                (v) => updateSetting('gameplay', 'confirmActions', v),
                'Show confirmation for major actions')}
            </div>
          )}

          {activeTab === 'accessibility' && (
            <div>
              {renderSelect('Font Size', currentSettings.accessibility.fontSize, [
                { value: 'small', label: 'Small' },
                { value: 'medium', label: 'Medium' },
                { value: 'large', label: 'Large' }
              ], (v) => updateSetting('accessibility', 'fontSize', v))}
              {renderToggle('High Contrast', currentSettings.accessibility.highContrast,
                (v) => updateSetting('accessibility', 'highContrast', v),
                'Increase contrast for better visibility')}
              {renderToggle('Reduce Motion', currentSettings.accessibility.reduceMotion,
                (v) => updateSetting('accessibility', 'reduceMotion', v),
                'Minimize animations and transitions')}
              {renderToggle('Screen Reader Support', currentSettings.accessibility.screenReader,
                (v) => updateSetting('accessibility', 'screenReader', v),
                'Optimize for screen readers')}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-300 flex justify-between">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-stone-300 text-stone-700 rounded hover:bg-stone-400"
          >
            Reset to Defaults
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-stone-300 text-stone-700 rounded hover:bg-stone-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
