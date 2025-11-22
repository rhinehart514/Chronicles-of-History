import React, { useState, useRef } from 'react';
import {
  getSaveList,
  saveGame,
  loadGame,
  deleteSave,
  exportSave,
  importSave,
  hasAutosave,
  loadAutosave,
  deserializeSave,
  SaveMetadata,
  GameSave
} from '../services/saveService';

interface SaveLoadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoad: (save: ReturnType<typeof deserializeSave>) => void;
  currentState: Omit<GameSave, 'version' | 'timestamp' | 'name'>;
}

export const SaveLoadModal: React.FC<SaveLoadModalProps> = ({
  isOpen,
  onClose,
  onLoad,
  currentState
}) => {
  const [saves, setSaves] = useState<SaveMetadata[]>(() => getSaveList());
  const [saveName, setSaveName] = useState('');
  const [activeTab, setActiveTab] = useState<'save' | 'load'>('save');
  const [message, setMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const refreshSaves = () => {
    setSaves(getSaveList());
  };

  const handleSave = () => {
    try {
      saveGame(currentState, saveName || undefined);
      setMessage('Game saved!');
      setSaveName('');
      refreshSaves();
      setTimeout(() => setMessage(null), 2000);
    } catch (e) {
      setMessage('Failed to save game');
    }
  };

  const handleLoad = (id: string) => {
    const save = loadGame(id);
    if (save) {
      onLoad(deserializeSave(save));
      onClose();
    } else {
      setMessage('Failed to load save');
    }
  };

  const handleLoadAutosave = () => {
    const save = loadAutosave();
    if (save) {
      onLoad(deserializeSave(save));
      onClose();
    } else {
      setMessage('No autosave found');
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this save?')) {
      deleteSave(id);
      refreshSaves();
    }
  };

  const handleExport = (id: string) => {
    exportSave(id);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await importSave(file);
      refreshSaves();
      setMessage('Save imported!');
      setTimeout(() => setMessage(null), 2000);
    } catch (err) {
      setMessage('Failed to import save');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-300">
          <h2 className="text-xl font-bold text-stone-800">Save / Load Game</h2>
          <button
            onClick={onClose}
            className="text-stone-500 hover:text-stone-800 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-300">
          <button
            onClick={() => setActiveTab('save')}
            className={`flex-1 py-2 font-semibold ${
              activeTab === 'save'
                ? 'bg-amber-600 text-white'
                : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
            }`}
          >
            Save
          </button>
          <button
            onClick={() => setActiveTab('load')}
            className={`flex-1 py-2 font-semibold ${
              activeTab === 'load'
                ? 'bg-amber-600 text-white'
                : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
            }`}
          >
            Load
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {message && (
            <div className="mb-4 p-2 bg-amber-100 border border-amber-400 rounded text-amber-800 text-sm">
              {message}
            </div>
          )}

          {activeTab === 'save' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Save Name (optional)
                </label>
                <input
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder="Enter save name..."
                  className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <button
                onClick={handleSave}
                className="w-full py-2 bg-amber-600 text-white rounded font-semibold hover:bg-amber-700 transition-colors"
              >
                Save Game
              </button>
            </div>
          )}

          {activeTab === 'load' && (
            <div className="space-y-4">
              {/* Autosave */}
              {hasAutosave() && (
                <button
                  onClick={handleLoadAutosave}
                  className="w-full p-3 bg-green-100 border-2 border-green-400 rounded hover:bg-green-200 text-left"
                >
                  <div className="font-semibold text-green-800">Load Autosave</div>
                  <div className="text-sm text-green-600">Continue from last autosave</div>
                </button>
              )}

              {/* Import */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImport}
                  accept=".json"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2 bg-stone-200 text-stone-700 rounded font-semibold hover:bg-stone-300 transition-colors"
                >
                  Import from File
                </button>
              </div>

              {/* Save list */}
              <div className="space-y-2">
                {saves.length === 0 ? (
                  <p className="text-center text-stone-500 py-4">No saves found</p>
                ) : (
                  saves.map((save) => (
                    <div
                      key={save.id}
                      className="p-3 bg-white border border-stone-300 rounded hover:border-amber-400"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-stone-800">{save.name}</div>
                          <div className="text-sm text-stone-500">
                            {save.nationName} • Year {save.year}
                          </div>
                          <div className="text-xs text-stone-400">
                            {formatDate(save.timestamp)}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleLoad(save.id)}
                            className="px-2 py-1 bg-amber-600 text-white text-sm rounded hover:bg-amber-700"
                          >
                            Load
                          </button>
                          <button
                            onClick={() => handleExport(save.id)}
                            className="px-2 py-1 bg-stone-200 text-stone-700 text-sm rounded hover:bg-stone-300"
                            title="Export"
                          >
                            ↓
                          </button>
                          <button
                            onClick={() => handleDelete(save.id)}
                            className="px-2 py-1 bg-red-100 text-red-600 text-sm rounded hover:bg-red-200"
                            title="Delete"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SaveLoadModal;
