import React, { useState } from 'react';

interface SaveGame {
  id: string;
  name: string;
  nation: string;
  year: number;
  date: string;
  playtime: number;
}

interface MainMenuProps {
  onNewGame: () => void;
  onLoadGame: (saveId: string) => void;
  onSettings: () => void;
  onCredits: () => void;
  savedGames: SaveGame[];
  onDeleteSave: (saveId: string) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onNewGame,
  onLoadGame,
  onSettings,
  onCredits,
  savedGames,
  onDeleteSave
}) => {
  const [showLoadMenu, setShowLoadMenu] = useState(false);
  const [selectedSave, setSelectedSave] = useState<string | null>(null);

  const formatPlaytime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-stone-900 to-stone-800 flex flex-col">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Title */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-amber-500 mb-2" style={{
            textShadow: '0 4px 8px rgba(0,0,0,0.5)'
          }}>
            Chronicles of History
          </h1>
          <p className="text-xl text-stone-400">Shape the destiny of nations</p>
        </div>

        {/* Menu buttons */}
        {!showLoadMenu ? (
          <div className="space-y-4 w-64">
            <button
              onClick={onNewGame}
              className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold text-lg rounded-lg shadow-lg transition-all transform hover:scale-105"
            >
              🏰 New Campaign
            </button>

            <button
              onClick={() => setShowLoadMenu(true)}
              disabled={savedGames.length === 0}
              className={`w-full py-4 font-bold text-lg rounded-lg shadow-lg transition-all ${
                savedGames.length > 0
                  ? 'bg-stone-600 hover:bg-stone-500 text-white transform hover:scale-105'
                  : 'bg-stone-700 text-stone-500 cursor-not-allowed'
              }`}
            >
              📜 Load Game {savedGames.length > 0 && `(${savedGames.length})`}
            </button>

            <button
              onClick={onSettings}
              className="w-full py-4 bg-stone-600 hover:bg-stone-500 text-white font-bold text-lg rounded-lg shadow-lg transition-all transform hover:scale-105"
            >
              ⚙️ Settings
            </button>

            <button
              onClick={onCredits}
              className="w-full py-4 bg-stone-600 hover:bg-stone-500 text-white font-bold text-lg rounded-lg shadow-lg transition-all transform hover:scale-105"
            >
              📖 Credits
            </button>
          </div>
        ) : (
          /* Load game menu */
          <div className="bg-stone-800 rounded-lg p-6 w-96 max-h-[60vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Load Game</h2>
              <button
                onClick={() => {
                  setShowLoadMenu(false);
                  setSelectedSave(null);
                }}
                className="text-stone-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 mb-4">
              {savedGames.map(save => (
                <button
                  key={save.id}
                  onClick={() => setSelectedSave(save.id)}
                  className={`w-full p-3 rounded text-left transition-all ${
                    selectedSave === save.id
                      ? 'bg-amber-600 text-white'
                      : 'bg-stone-700 text-stone-200 hover:bg-stone-600'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{save.name}</div>
                      <div className="text-sm opacity-75">
                        {save.nation} • Year {save.year}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSave(save.id);
                      }}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                  <div className="text-xs opacity-50 mt-1">
                    {save.date} • {formatPlaytime(save.playtime)}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowLoadMenu(false);
                  setSelectedSave(null);
                }}
                className="flex-1 py-2 bg-stone-600 hover:bg-stone-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => selectedSave && onLoadGame(selectedSave)}
                disabled={!selectedSave}
                className={`flex-1 py-2 rounded font-medium ${
                  selectedSave
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-stone-700 text-stone-500 cursor-not-allowed'
                }`}
              >
                Load
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Version info */}
      <div className="p-4 text-center text-stone-500 text-sm">
        Version 1.0.0 • Powered by Gemini AI
      </div>
    </div>
  );
};

export default MainMenu;
