import React from 'react';

interface AgeObjective {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  splendorReward: number;
}

interface AgeAbility {
  id: string;
  name: string;
  icon: string;
  cost: number;
  description: string;
  active: boolean;
  available: boolean;
}

interface AgeOverviewProps {
  ageName: string;
  ageIcon: string;
  currentYear: number;
  endYear: number;
  splendor: number;
  goldenEraThreshold: number;
  objectives: AgeObjective[];
  abilities: AgeAbility[];
  goldenEraActive: boolean;
  goldenEraAvailable: boolean;
  onActivateAbility?: (abilityId: string) => void;
  onTriggerGoldenEra?: () => void;
  onClose: () => void;
}

export default function AgeOverview({
  ageName,
  ageIcon,
  currentYear,
  endYear,
  splendor,
  goldenEraThreshold,
  objectives,
  abilities,
  goldenEraActive,
  goldenEraAvailable,
  onActivateAbility,
  onTriggerGoldenEra,
  onClose
}: AgeOverviewProps) {
  const completedObjectives = objectives.filter(o => o.completed).length;
  const yearsRemaining = endYear - currentYear;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-stone-800 rounded-lg shadow-xl w-full max-w-md max-h-[85vh] flex flex-col">
        <div className="p-4 border-b border-stone-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-amber-100 flex items-center gap-2">
              <span>{ageIcon}</span>
              {ageName}
            </h2>
            <div className="text-xs text-stone-400">
              {yearsRemaining} years remaining
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200"
          >
            ✕
          </button>
        </div>

        {/* Splendor & Golden Era */}
        <div className="px-4 py-3 bg-stone-900">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-stone-400">Splendor</span>
            <span className="text-lg font-bold text-amber-400">
              {splendor} / {goldenEraThreshold}
            </span>
          </div>
          <div className="h-2 bg-stone-700 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-amber-500 transition-all"
              style={{ width: `${Math.min(100, (splendor / goldenEraThreshold) * 100)}%` }}
            />
          </div>

          {goldenEraActive ? (
            <div className="bg-amber-900/50 text-amber-300 text-center py-2 rounded text-sm">
              🌟 Golden Era Active!
            </div>
          ) : (
            <button
              onClick={onTriggerGoldenEra}
              disabled={!goldenEraAvailable}
              className={`w-full py-2 rounded text-sm ${
                goldenEraAvailable
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-stone-600 text-stone-400 cursor-not-allowed'
              }`}
            >
              {goldenEraAvailable ? 'Trigger Golden Era' : `Need ${goldenEraThreshold - splendor} more Splendor`}
            </button>
          )}
        </div>

        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {/* Objectives */}
          <div>
            <h3 className="text-sm font-medium text-stone-400 mb-2">
              Objectives ({completedObjectives}/{objectives.length})
            </h3>
            <div className="space-y-2">
              {objectives.map(objective => (
                <div
                  key={objective.id}
                  className={`bg-stone-700 rounded p-2 ${
                    objective.completed ? 'border-l-2 border-green-500' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-medium flex items-center gap-1">
                        {objective.completed && <span className="text-green-400">✓</span>}
                        {objective.name}
                      </div>
                      <div className="text-xs text-stone-400">{objective.description}</div>
                    </div>
                    <span className="text-xs text-amber-400">
                      +{objective.splendorReward}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Abilities */}
          <div>
            <h3 className="text-sm font-medium text-stone-400 mb-2">Age Abilities</h3>
            <div className="space-y-2">
              {abilities.map(ability => (
                <div
                  key={ability.id}
                  className={`bg-stone-700 rounded p-2 ${
                    ability.active ? 'ring-1 ring-amber-500' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <span>{ability.icon}</span>
                      <span className="text-sm font-medium">{ability.name}</span>
                    </div>
                    {ability.active ? (
                      <span className="text-xs text-green-400">Active</span>
                    ) : (
                      <span className="text-xs text-amber-400">{ability.cost}</span>
                    )}
                  </div>
                  <div className="text-xs text-stone-400 mb-2">{ability.description}</div>
                  {!ability.active && (
                    <button
                      onClick={() => onActivateAbility?.(ability.id)}
                      disabled={!ability.available}
                      className={`w-full py-1 rounded text-xs ${
                        ability.available
                          ? 'bg-stone-600 hover:bg-stone-500'
                          : 'bg-stone-700 text-stone-500 cursor-not-allowed'
                      }`}
                    >
                      {ability.available ? 'Activate' : 'Not enough Splendor'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
