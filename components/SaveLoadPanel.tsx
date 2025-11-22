import React, { useState } from 'react';

interface SaveLoadPanelProps {
  isOpen: boolean;
  onClose: () => void;
  saves: SaveGame[];
  currentGameName: string;
  onSave: (name: string) => void;
  onLoad: (saveId: string) => void;
  onDelete: (saveId: string) => void;
  onExport: (saveId: string) => void;
  onImport: (data: string) => void;
}

interface SaveGame {
  id: string;
  name: string;
  nation: string;
  nationFlag: string;
  date: string;
  year: number;
  savedAt: Date;
  size: number;
  isAutosave: boolean;
  isCloud: boolean;
}

export const SaveLoadPanel: React.FC<SaveLoadPanelProps> = ({
  isOpen,
  onClose,
  saves,
  currentGameName,
  onSave,
  onLoad,
  onDelete,
  onExport,
  onImport
}) => {
  const [mode, setMode] = useState<'save' | 'load'>('save');
  const [saveName, setSaveName] = useState(currentGameName);
  const [selectedSave, setSelectedSave] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [importData, setImportData] = useState('');
  const [showImport, setShowImport] = useState(false);

  if (!isOpen) return null;

  const sortedSaves = [...saves].sort(
    (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
  );

  const selected = saves.find(s => s.id === selectedSave);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSave = () => {
    if (saveName.trim()) {
      onSave(saveName.trim());
      onClose();
    }
  };

  const handleLoad = () => {
    if (selectedSave) {
      onLoad(selectedSave);
      onClose();
    }
  };

  const handleDelete = () => {
    if (selectedSave) {
      onDelete(selectedSave);
      setSelectedSave(null);
      setShowDeleteConfirm(false);
    }
  };

  const handleImport = () => {
    if (importData.trim()) {
      onImport(importData.trim());
      setImportData('');
      setShowImport(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-stone-800">
              💾 {mode === 'save' ? 'Save Game' : 'Load Game'}
            </h2>
            <div className="text-sm text-stone-500">
              {saves.length} saves • {saves.filter(s => s.isCloud).length} in cloud
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Mode toggle */}
        <div className="p-2 border-b border-stone-200 flex gap-2">
          <button
            onClick={() => setMode('save')}
            className={`flex-1 py-2 rounded font-medium ${
              mode === 'save' ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-700'
            }`}
          >
            Save
          </button>
          <button
            onClick={() => setMode('load')}
            className={`flex-1 py-2 rounded font-medium ${
              mode === 'load' ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-700'
            }`}
          >
            Load
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {mode === 'save' ? (
            <>
              {/* Save name input */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-stone-600 mb-1">
                  Save Name
                </label>
                <input
                  type="text"
                  value={saveName}
                  onChange={e => setSaveName(e.target.value)}
                  placeholder="Enter save name..."
                  className="w-full px-3 py-2 border border-stone-300 rounded"
                />
              </div>

              {/* Save button */}
              <button
                onClick={handleSave}
                disabled={!saveName.trim()}
                className={`w-full py-3 rounded font-medium mb-4 ${
                  saveName.trim()
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                }`}
              >
                Save Game
              </button>

              {/* Existing saves to overwrite */}
              {sortedSaves.length > 0 && (
                <>
                  <h3 className="text-sm font-semibold text-stone-600 mb-2">
                    Or overwrite existing save:
                  </h3>
                  <div className="space-y-2">
                    {sortedSaves.slice(0, 5).map(save => (
                      <button
                        key={save.id}
                        onClick={() => setSaveName(save.name)}
                        className="w-full p-3 rounded border border-stone-200 bg-white text-left hover:bg-stone-50"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{save.name}</span>
                          <span className="text-xs text-stone-500">{formatDate(save.savedAt)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              {/* Save list */}
              {sortedSaves.length === 0 ? (
                <p className="text-center text-stone-500 py-8">No saved games</p>
              ) : (
                <div className="space-y-2 mb-4">
                  {sortedSaves.map(save => (
                    <button
                      key={save.id}
                      onClick={() => setSelectedSave(save.id)}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        selectedSave === save.id
                          ? 'border-amber-500 bg-amber-50'
                          : save.isAutosave
                          ? 'border-blue-200 bg-blue-50'
                          : 'border-stone-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{save.nationFlag}</span>
                          <div>
                            <div className="font-semibold text-stone-800">{save.name}</div>
                            <div className="text-xs text-stone-500">
                              {save.nation} • Year {save.year}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {save.isCloud && <span className="text-blue-500 text-sm">☁️</span>}
                          {save.isAutosave && (
                            <span className="text-xs text-blue-600 ml-1">Auto</span>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-stone-500">
                        <span>{formatDate(save.savedAt)}</span>
                        <span>{formatSize(save.size)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Selected save actions */}
              {selected && (
                <div className="space-y-2">
                  <button
                    onClick={handleLoad}
                    className="w-full py-3 bg-amber-600 text-white rounded font-medium hover:bg-amber-700"
                  >
                    Load Game
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onExport(selected.id)}
                      className="flex-1 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700"
                    >
                      Export
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="flex-1 py-2 bg-red-600 text-white rounded font-medium hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}

              {/* Import button */}
              <button
                onClick={() => setShowImport(true)}
                className="w-full mt-4 py-2 bg-stone-200 text-stone-700 rounded hover:bg-stone-300"
              >
                Import Save
              </button>
            </>
          )}
        </div>

        {/* Delete confirmation */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-4 max-w-sm">
              <h3 className="font-bold text-stone-800 mb-2">Delete Save?</h3>
              <p className="text-sm text-stone-600 mb-4">
                Are you sure you want to delete "{selected?.name}"? This cannot be undone.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2 bg-stone-200 text-stone-700 rounded hover:bg-stone-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Import modal */}
        {showImport && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-4 max-w-md w-full">
              <h3 className="font-bold text-stone-800 mb-2">Import Save</h3>
              <p className="text-sm text-stone-600 mb-2">
                Paste the exported save data below:
              </p>
              <textarea
                value={importData}
                onChange={e => setImportData(e.target.value)}
                placeholder="Paste save data here..."
                className="w-full h-32 px-3 py-2 border border-stone-300 rounded mb-3 text-sm font-mono"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowImport(false);
                    setImportData('');
                  }}
                  className="flex-1 py-2 bg-stone-200 text-stone-700 rounded hover:bg-stone-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  disabled={!importData.trim()}
                  className={`flex-1 py-2 rounded font-medium ${
                    importData.trim()
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  Import
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SaveLoadPanel;
