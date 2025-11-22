import React, { useState } from 'react';

interface TutorialPanelProps {
  isOpen: boolean;
  onClose: () => void;
  tutorials: Tutorial[];
  completedTutorials: string[];
  activeTutorial?: ActiveTutorial;
  onStartTutorial: (tutorialId: string) => void;
  onStepNext: () => void;
  onStepBack: () => void;
  onSkipTutorial: () => void;
}

interface Tutorial {
  id: string;
  name: string;
  description: string;
  category: string;
  steps: TutorialStep[];
  rewards?: { type: string; value: number }[];
}

interface TutorialStep {
  id: string;
  title: string;
  content: string;
  position?: string;
}

interface ActiveTutorial {
  id: string;
  currentStep: number;
  totalSteps: number;
}

const CATEGORY_INFO: Record<string, { icon: string; color: string }> = {
  basics: { icon: '📖', color: 'green' },
  economy: { icon: '💰', color: 'amber' },
  military: { icon: '⚔️', color: 'red' },
  diplomacy: { icon: '🤝', color: 'blue' },
  trade: { icon: '🚢', color: 'cyan' },
  colonization: { icon: '🌍', color: 'emerald' },
  advanced: { icon: '🎓', color: 'purple' }
};

export const TutorialPanel: React.FC<TutorialPanelProps> = ({
  isOpen,
  onClose,
  tutorials,
  completedTutorials,
  activeTutorial,
  onStartTutorial,
  onStepNext,
  onStepBack,
  onSkipTutorial
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const categories = ['all', ...new Set(tutorials.map(t => t.category))];

  const filteredTutorials = selectedCategory === 'all'
    ? tutorials
    : tutorials.filter(t => t.category === selectedCategory);

  const completedCount = completedTutorials.length;
  const totalCount = tutorials.length;
  const progress = Math.round((completedCount / totalCount) * 100);

  const currentTutorial = activeTutorial
    ? tutorials.find(t => t.id === activeTutorial.id)
    : null;

  const currentStep = currentTutorial && activeTutorial
    ? currentTutorial.steps[activeTutorial.currentStep]
    : null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-stone-800">📚 Tutorials</h2>
            <div className="text-sm text-stone-500">
              {completedCount}/{totalCount} completed • {progress}%
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Progress bar */}
        <div className="p-3 border-b border-stone-200 bg-stone-100">
          <div className="w-full bg-stone-300 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Active tutorial step */}
        {currentTutorial && currentStep && (
          <div className="p-4 border-b border-stone-200 bg-blue-50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-blue-800">{currentStep.title}</h3>
              <span className="text-sm text-blue-600">
                Step {(activeTutorial?.currentStep ?? 0) + 1} of {activeTutorial?.totalSteps ?? 0}
              </span>
            </div>
            <p className="text-sm text-stone-700 mb-3">{currentStep.content}</p>
            <div className="flex justify-between">
              <button
                onClick={onStepBack}
                disabled={(activeTutorial?.currentStep ?? 0) === 0}
                className={`px-3 py-1 rounded text-sm ${
                  (activeTutorial?.currentStep ?? 0) > 0
                    ? 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                    : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                }`}
              >
                Back
              </button>
              <div className="flex gap-2">
                <button
                  onClick={onSkipTutorial}
                  className="px-3 py-1 bg-stone-200 text-stone-700 rounded text-sm hover:bg-stone-300"
                >
                  Skip
                </button>
                <button
                  onClick={onStepNext}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  {(activeTutorial?.currentStep ?? 0) === (activeTutorial?.totalSteps ?? 1) - 1
                    ? 'Finish'
                    : 'Next'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Category filter */}
        <div className="p-2 border-b border-stone-200 flex gap-1 flex-wrap">
          {categories.map(cat => {
            const info = CATEGORY_INFO[cat] || { icon: '📁', color: 'stone' };
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded text-sm ${
                  selectedCategory === cat
                    ? 'bg-amber-600 text-white'
                    : 'bg-stone-200 text-stone-700'
                }`}
              >
                {cat === 'all' ? 'All' : `${info.icon} ${cat.charAt(0).toUpperCase() + cat.slice(1)}`}
              </button>
            );
          })}
        </div>

        {/* Tutorial list */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {filteredTutorials.map(tutorial => {
              const isCompleted = completedTutorials.includes(tutorial.id);
              const isActive = activeTutorial?.id === tutorial.id;
              const info = CATEGORY_INFO[tutorial.category] || { icon: '📁', color: 'stone' };

              return (
                <div
                  key={tutorial.id}
                  className={`p-4 rounded-lg border-2 ${
                    isActive
                      ? 'border-blue-500 bg-blue-50'
                      : isCompleted
                      ? 'border-green-300 bg-green-50'
                      : 'border-stone-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{info.icon}</span>
                        <h4 className="font-semibold text-stone-800">{tutorial.name}</h4>
                        {isCompleted && (
                          <span className="text-green-500">✓</span>
                        )}
                      </div>
                      <p className="text-sm text-stone-600 mb-2">{tutorial.description}</p>
                      <div className="flex items-center gap-3 text-xs text-stone-500">
                        <span>{tutorial.steps.length} steps</span>
                        {tutorial.rewards && tutorial.rewards.length > 0 && (
                          <span className="text-amber-600">
                            Rewards: {tutorial.rewards.map(r => `${r.value} ${r.type}`).join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                    {!isActive && !isCompleted && (
                      <button
                        onClick={() => onStartTutorial(tutorial.id)}
                        className="px-4 py-2 bg-amber-600 text-white rounded font-medium hover:bg-amber-700"
                      >
                        Start
                      </button>
                    )}
                    {isActive && (
                      <span className="px-3 py-1 bg-blue-200 text-blue-700 rounded text-sm">
                        In Progress
                      </span>
                    )}
                    {isCompleted && !isActive && (
                      <button
                        onClick={() => onStartTutorial(tutorial.id)}
                        className="px-4 py-2 bg-stone-200 text-stone-700 rounded hover:bg-stone-300"
                      >
                        Replay
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialPanel;
