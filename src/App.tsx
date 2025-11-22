import React, { useState, useEffect } from 'react';
import { GameProvider, useGameState } from './GameContext';

// Import components (these would be properly imported in real app)
// import { TopBar, MiniMap, ProvinceDetails, ... } from '../components';

function GameApp() {
  const { state, dispatch } = useGameState();
  const [showMainMenu, setShowMainMenu] = useState(true);

  // Game loop
  useEffect(() => {
    if (state.isPaused || showMainMenu) return;

    const speeds = [0, 500, 200, 100, 50, 20]; // ms per day
    const interval = setInterval(() => {
      // Advance date
      const date = new Date(state.currentDate);
      date.setDate(date.getDate() + 1);

      // Check for month tick
      if (date.getDate() === 1) {
        dispatch({ type: 'MONTH_TICK' });
      }

      dispatch({ type: 'SET_DATE', payload: date.toISOString().split('T')[0] });
    }, speeds[state.speed]);

    return () => clearInterval(interval);
  }, [state.isPaused, state.speed, state.currentDate, showMainMenu, dispatch]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        dispatch({ type: 'TOGGLE_PAUSE' });
      } else if (e.key === 'Escape') {
        dispatch({ type: 'SET_ACTIVE_PANEL', payload: null });
      } else if (e.key >= '1' && e.key <= '5') {
        dispatch({ type: 'SET_SPEED', payload: parseInt(e.key) });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  if (showMainMenu) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <div className="bg-stone-800 rounded-lg p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-amber-100 text-center mb-8">
            Chronicles of History
          </h1>
          <div className="space-y-3">
            <button
              onClick={() => setShowMainMenu(false)}
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium"
            >
              New Game
            </button>
            <button className="w-full py-3 bg-stone-700 hover:bg-stone-600 rounded-lg">
              Load Game
            </button>
            <button className="w-full py-3 bg-stone-700 hover:bg-stone-600 rounded-lg">
              Settings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-900 text-white flex flex-col">
      {/* Top Bar */}
      <header className="bg-stone-800 border-b border-stone-700 px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Resources */}
          <div className="flex items-center gap-4 text-sm">
            <span className="text-yellow-400">💰 {state.treasury.toFixed(0)}</span>
            <span className="text-red-400">⚔️ {state.manpower.toLocaleString()}</span>
            <span className="text-amber-400">📜 {state.adminPower}</span>
            <span className="text-blue-400">🤝 {state.diploPower}</span>
            <span className="text-green-400">🎖️ {state.milPower}</span>
          </div>

          {/* Date & Speed */}
          <div className="flex items-center gap-3">
            <span className="text-amber-100 font-medium">{state.currentDate}</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(s => (
                <button
                  key={s}
                  onClick={() => dispatch({ type: 'SET_SPEED', payload: s })}
                  className={`w-6 h-6 rounded text-xs ${
                    state.speed === s ? 'bg-amber-600' : 'bg-stone-700 hover:bg-stone-600'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_PAUSE' })}
              className={`px-3 py-1 rounded text-sm ${
                state.isPaused ? 'bg-green-600' : 'bg-red-600'
              }`}
            >
              {state.isPaused ? '▶' : '⏸'}
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch({ type: 'SET_ACTIVE_PANEL', payload: 'budget' })}
              className="px-3 py-1 bg-stone-700 hover:bg-stone-600 rounded text-sm"
            >
              Budget
            </button>
            <button
              onClick={() => dispatch({ type: 'SET_ACTIVE_PANEL', payload: 'military' })}
              className="px-3 py-1 bg-stone-700 hover:bg-stone-600 rounded text-sm"
            >
              Military
            </button>
            <button
              onClick={() => dispatch({ type: 'SET_ACTIVE_PANEL', payload: 'diplomacy' })}
              className="px-3 py-1 bg-stone-700 hover:bg-stone-600 rounded text-sm"
            >
              Diplomacy
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex">
        {/* Map Area */}
        <div className="flex-1 bg-stone-800 relative">
          <div className="absolute inset-0 flex items-center justify-center text-stone-600">
            <div className="text-center">
              <div className="text-6xl mb-4">🗺️</div>
              <div>Map View</div>
              <div className="text-sm mt-2">Mode: {state.mapMode}</div>
            </div>
          </div>

          {/* Minimap */}
          <div className="absolute bottom-4 right-4 w-48 h-32 bg-stone-900 rounded border border-stone-700">
            <div className="text-xs text-stone-500 p-2">Minimap</div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-80 bg-stone-800 border-l border-stone-700 p-4 overflow-y-auto">
          {state.selectedProvince ? (
            <div>
              <h3 className="font-bold text-amber-100 mb-2">Province Details</h3>
              <p className="text-sm text-stone-400">Selected: {state.selectedProvince}</p>
            </div>
          ) : (
            <div>
              <h3 className="font-bold text-amber-100 mb-3">Nation Overview</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-400">Stability</span>
                  <span>{state.stability}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Legitimacy</span>
                  <span>{state.legitimacy}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Prestige</span>
                  <span>{state.prestige}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Admin Tech</span>
                  <span>{state.adminTech}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Diplo Tech</span>
                  <span>{state.diploTech}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Mil Tech</span>
                  <span>{state.milTech}</span>
                </div>
              </div>
            </div>
          )}
        </aside>
      </main>

      {/* Bottom Bar */}
      <footer className="bg-stone-800 border-t border-stone-700 px-4 py-1">
        <div className="flex items-center justify-between text-xs text-stone-400">
          <span>
            Balance: {(state.monthlyIncome - state.monthlyExpenses).toFixed(2)}/month
          </span>
          <span>
            {state.wars.length > 0 ? `At war (${state.wars.length})` : 'At peace'}
          </span>
          <span>
            Allies: {state.allies.length} | Subjects: {state.subjects.length}
          </span>
        </div>
      </footer>
    </div>
  );
}

// Root component with provider
export default function App() {
  return (
    <GameProvider>
      <GameApp />
    </GameProvider>
  );
}
