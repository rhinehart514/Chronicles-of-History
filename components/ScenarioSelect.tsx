import React, { useState } from 'react';

export interface Scenario {
  id: string;
  name: string;
  description: string;
  icon: string;
  startYear: number;
  endYear: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  nations: string[];
  specialRules?: string[];
  historicalFocus: string;
}

interface ScenarioSelectProps {
  scenarios: Scenario[];
  onSelect: (scenarioId: string, nationId: string) => void;
  onBack: () => void;
}

export const ScenarioSelect: React.FC<ScenarioSelectProps> = ({
  scenarios,
  onSelect,
  onBack
}) => {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [selectedNation, setSelectedNation] = useState<string | null>(null);

  const scenario = scenarios.find(s => s.id === selectedScenario);

  const difficultyColors = {
    easy: 'text-green-600 bg-green-100',
    medium: 'text-amber-600 bg-amber-100',
    hard: 'text-orange-600 bg-orange-100',
    expert: 'text-red-600 bg-red-100'
  };

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-4xl overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-b from-stone-200 to-transparent border-b border-stone-300">
          <h1 className="text-3xl font-bold text-stone-800 text-center font-serif">
            Choose Your Era
          </h1>
          <p className="text-center text-stone-600 mt-2">
            Select a historical scenario to begin your chronicle
          </p>
        </div>

        {!selectedScenario ? (
          /* Scenario list */
          <div className="p-4 grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
            {scenarios.map((scen) => (
              <button
                key={scen.id}
                onClick={() => setSelectedScenario(scen.id)}
                className="p-4 bg-white rounded-lg border-2 border-stone-200 hover:border-amber-400 text-left transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{scen.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-stone-800">{scen.name}</h3>
                    <p className="text-sm text-stone-600 mt-1">{scen.description}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-stone-500">
                        {scen.startYear} - {scen.endYear}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded capitalize ${difficultyColors[scen.difficulty]}`}>
                        {scen.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          /* Scenario details & nation selection */
          <div className="p-4">
            <button
              onClick={() => {
                setSelectedScenario(null);
                setSelectedNation(null);
              }}
              className="text-stone-500 hover:text-stone-700 mb-4"
            >
              ← Back to scenarios
            </button>

            {scenario && (
              <div className="space-y-4">
                {/* Scenario info */}
                <div className="bg-white p-4 rounded-lg border border-stone-200">
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">{scenario.icon}</span>
                    <div>
                      <h2 className="text-xl font-bold text-stone-800">{scenario.name}</h2>
                      <p className="text-stone-600">{scenario.description}</p>
                      <div className="mt-2 flex items-center gap-3 text-sm">
                        <span className="text-stone-500">
                          {scenario.startYear} - {scenario.endYear}
                        </span>
                        <span className={`px-2 py-0.5 rounded capitalize ${difficultyColors[scenario.difficulty]}`}>
                          {scenario.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-semibold text-stone-800">Historical Focus</h4>
                    <p className="text-sm text-stone-600">{scenario.historicalFocus}</p>
                  </div>

                  {scenario.specialRules && scenario.specialRules.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-stone-800">Special Rules</h4>
                      <ul className="text-sm text-stone-600 list-disc list-inside">
                        {scenario.specialRules.map((rule, i) => (
                          <li key={i}>{rule}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Nation selection */}
                <div>
                  <h3 className="font-semibold text-stone-800 mb-2">Select Nation</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {scenario.nations.map((nation) => (
                      <button
                        key={nation}
                        onClick={() => setSelectedNation(nation)}
                        className={`p-3 rounded border-2 text-center transition-all ${
                          selectedNation === nation
                            ? 'border-amber-500 bg-amber-50'
                            : 'border-stone-200 bg-white hover:border-stone-400'
                        }`}
                      >
                        <div className="font-semibold text-stone-800">{nation}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Start button */}
                <button
                  onClick={() => selectedNation && onSelect(scenario.id, selectedNation)}
                  disabled={!selectedNation}
                  className={`w-full py-3 rounded-lg font-bold text-lg ${
                    selectedNation
                      ? 'bg-amber-600 text-white hover:bg-amber-700'
                      : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  Begin Chronicle
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-stone-300 bg-stone-100">
          <button
            onClick={onBack}
            className="text-stone-500 hover:text-stone-700"
          >
            ← Back to Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};

// Default scenarios
export const DEFAULT_SCENARIOS: Scenario[] = [
  {
    id: 'seven_years',
    name: 'Seven Years War',
    description: 'Global conflict between European powers',
    icon: '⚔️',
    startYear: 1756,
    endYear: 1763,
    difficulty: 'medium',
    nations: ['Britain', 'France', 'Prussia', 'Austria', 'Russia', 'Spain'],
    specialRules: ['Colonial territories at stake', 'Complex alliance system'],
    historicalFocus: 'First global war, colonial empires, Prussian rise'
  },
  {
    id: 'french_revolution',
    name: 'Age of Revolution',
    description: 'Revolution sweeps across Europe',
    icon: '🔥',
    startYear: 1789,
    endYear: 1815,
    difficulty: 'hard',
    nations: ['France', 'Britain', 'Austria', 'Prussia', 'Russia', 'Spain'],
    specialRules: ['Revolutionary fervor', 'Coalition wars', 'Napoleon rises'],
    historicalFocus: 'French Revolution, Napoleonic Wars, social upheaval'
  },
  {
    id: 'congress_vienna',
    name: 'Concert of Europe',
    description: 'Post-Napoleonic peace and nationalism',
    icon: '⚖️',
    startYear: 1815,
    endYear: 1848,
    difficulty: 'easy',
    nations: ['Austria', 'Britain', 'France', 'Prussia', 'Russia'],
    specialRules: ['Balance of power', 'Suppress revolutions'],
    historicalFocus: 'Metternich system, nationalism, industrialization'
  },
  {
    id: 'scramble_africa',
    name: 'Age of Empire',
    description: 'Imperial expansion at its height',
    icon: '🌍',
    startYear: 1870,
    endYear: 1914,
    difficulty: 'medium',
    nations: ['Britain', 'France', 'Germany', 'Italy', 'Belgium', 'Portugal'],
    specialRules: ['Colonial competition', 'Berlin Conference rules'],
    historicalFocus: 'Imperialism, colonization, great power rivalry'
  },
  {
    id: 'great_war',
    name: 'The Great War',
    description: 'World War I and its aftermath',
    icon: '💥',
    startYear: 1914,
    endYear: 1918,
    difficulty: 'expert',
    nations: ['Britain', 'France', 'Germany', 'Austria-Hungary', 'Russia', 'Ottoman Empire'],
    specialRules: ['Trench warfare', 'Total war', 'Alliance triggers'],
    historicalFocus: 'WWI, modern warfare, collapse of empires'
  },
  {
    id: 'grand_campaign',
    name: 'Grand Campaign',
    description: 'Full historical experience',
    icon: '📜',
    startYear: 1750,
    endYear: 1950,
    difficulty: 'hard',
    nations: ['Britain', 'France', 'Prussia', 'Austria', 'Russia', 'Spain', 'Ottoman Empire'],
    historicalFocus: 'Two centuries of European history'
  }
];

export default ScenarioSelect;
