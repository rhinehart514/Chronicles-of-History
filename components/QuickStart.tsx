import React from 'react';
import { Nation } from '../types';
import { DifficultyLevel, DIFFICULTY_PRESETS } from '../data/difficultySettings';
import { hasAutosave } from '../services/saveService';
import { isTutorialCompleted } from '../services/tutorialService';

interface QuickStartProps {
  nations: Nation[];
  onSelectNation: (nationId: string) => void;
  onLoadAutosave: () => void;
  onSelectDifficulty: (difficulty: DifficultyLevel) => void;
  selectedDifficulty: DifficultyLevel;
  onStartTutorial: () => void;
}

export const QuickStart: React.FC<QuickStartProps> = ({
  nations,
  onSelectNation,
  onLoadAutosave,
  onSelectDifficulty,
  selectedDifficulty,
  onStartTutorial
}) => {
  const showTutorial = !isTutorialCompleted('main');
  const hasAutoSave = hasAutosave();

  // Recommended nations for beginners
  const recommended = ['britain', 'france', 'prussia'];

  const sortedNations = [...nations].sort((a, b) => {
    const aRec = recommended.includes(a.id) ? 0 : 1;
    const bRec = recommended.includes(b.id) ? 0 : 1;
    return aRec - bRec;
  });

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-40">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border-4 border-stone-600">
        {/* Header */}
        <div className="p-6 bg-gradient-to-b from-amber-100 to-transparent text-center">
          <h1 className="text-3xl font-bold text-stone-800 font-serif">
            Chronicles of History
          </h1>
          <p className="text-stone-600 mt-2">
            Guide a nation through centuries of alternate history
          </p>
        </div>

        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {/* Continue / Tutorial */}
          <div className="flex gap-2 mb-4">
            {hasAutoSave && (
              <button
                onClick={onLoadAutosave}
                className="flex-1 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
              >
                Continue Game
              </button>
            )}
            {showTutorial && (
              <button
                onClick={onStartTutorial}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
              >
                Start Tutorial
              </button>
            )}
          </div>

          {/* Difficulty Selection */}
          <div className="mb-4">
            <h3 className="font-semibold text-stone-800 mb-2">Difficulty</h3>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(DIFFICULTY_PRESETS) as DifficultyLevel[]).map((level) => {
                const preset = DIFFICULTY_PRESETS[level];
                return (
                  <button
                    key={level}
                    onClick={() => onSelectDifficulty(level)}
                    className={`p-2 rounded text-sm font-medium transition-all ${
                      selectedDifficulty === level
                        ? 'bg-amber-600 text-white'
                        : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                    }`}
                  >
                    {preset.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nation Selection */}
          <div>
            <h3 className="font-semibold text-stone-800 mb-2">Choose Your Nation</h3>
            <div className="grid gap-2">
              {sortedNations.map((nation) => {
                const isRecommended = recommended.includes(nation.id);

                return (
                  <button
                    key={nation.id}
                    onClick={() => onSelectNation(nation.id)}
                    className={`p-3 rounded-lg border-2 text-left transition-all hover:border-amber-400 ${
                      isRecommended
                        ? 'bg-amber-50 border-amber-200'
                        : 'bg-white border-stone-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-stone-800">
                          {nation.name}
                          {isRecommended && (
                            <span className="ml-2 text-xs bg-amber-200 text-amber-800 px-1 rounded">
                              Recommended
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-stone-600 mt-1">
                          {nation.description}
                        </div>
                      </div>
                    </div>

                    {/* Mini stats */}
                    <div className="flex gap-3 mt-2 text-xs text-stone-500">
                      <span>⚔️ {nation.stats.military}</span>
                      <span>💰 {nation.stats.economy}</span>
                      <span>⚖️ {nation.stats.stability}</span>
                      <span>💡 {nation.stats.innovation}</span>
                      <span>⭐ {nation.stats.prestige}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer hint */}
        <div className="p-3 bg-stone-100 text-center text-xs text-stone-500">
          Or click any nation on the map to learn more before starting
        </div>
      </div>
    </div>
  );
};

export default QuickStart;
