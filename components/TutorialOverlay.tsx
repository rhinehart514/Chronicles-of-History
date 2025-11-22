import React, { useState } from 'react';

export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  target?: string; // CSS selector for highlighting
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: string;
}

interface TutorialOverlayProps {
  isActive: boolean;
  steps: TutorialStep[];
  currentStep: number;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  onComplete: () => void;
}

export const DEFAULT_TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Chronicles of History!',
    content: 'This tutorial will guide you through the basics of ruling your nation. You can skip at any time.',
    position: 'center'
  },
  {
    id: 'nation_stats',
    title: 'Nation Statistics',
    content: 'These bars show your nation\'s key statistics: Military, Economy, Stability, Innovation, and Prestige. Keep them balanced for success.',
    target: '.nation-stats',
    position: 'bottom'
  },
  {
    id: 'treasury',
    title: 'Treasury & Resources',
    content: 'Your treasury shows available gold. Monitor your income and expenses to maintain a healthy economy.',
    target: '.treasury-display',
    position: 'bottom'
  },
  {
    id: 'time_controls',
    title: 'Time Controls',
    content: 'Use these buttons to pause, play, and adjust game speed. Time passes in seasons (4 per year).',
    target: '.time-controls',
    position: 'top'
  },
  {
    id: 'map',
    title: 'The World Map',
    content: 'Click on provinces to view details and take actions. Your nation is highlighted. Different map modes show various information.',
    target: '.game-map',
    position: 'center'
  },
  {
    id: 'events',
    title: 'Events & Decisions',
    content: 'Events will appear requiring your decisions. Choose wisely as they affect your nation\'s future!',
    position: 'center'
  },
  {
    id: 'diplomacy',
    title: 'Diplomacy',
    content: 'Manage relations with other nations. Form alliances, declare wars, or negotiate trade agreements.',
    position: 'center'
  },
  {
    id: 'military',
    title: 'Military',
    content: 'Build armies and navies to defend your nation or expand your territory. Watch morale and supplies!',
    position: 'center'
  },
  {
    id: 'complete',
    title: 'Ready to Begin!',
    content: 'You now know the basics. Explore the game to discover more features. Good luck, ruler!',
    position: 'center'
  }
];

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  isActive,
  steps,
  currentStep,
  onNext,
  onPrevious,
  onSkip,
  onComplete
}) => {
  if (!isActive || currentStep >= steps.length) return null;

  const step = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  const getPositionClasses = () => {
    switch (step.position) {
      case 'top':
        return 'top-4 left-1/2 -translate-x-1/2';
      case 'bottom':
        return 'bottom-4 left-1/2 -translate-x-1/2';
      case 'left':
        return 'left-4 top-1/2 -translate-y-1/2';
      case 'right':
        return 'right-4 top-1/2 -translate-y-1/2';
      default:
        return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Tutorial card */}
      <div className={`absolute ${getPositionClasses()} w-96 bg-[#f4efe4] rounded-lg shadow-2xl border-4 border-amber-600`}>
        {/* Header */}
        <div className="p-4 border-b border-stone-300 bg-amber-100 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-stone-800">{step.title}</h3>
            <span className="text-sm text-stone-500">
              {currentStep + 1} / {steps.length}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-stone-700">{step.content}</p>
          {step.action && (
            <p className="mt-2 text-sm text-amber-600 font-medium">
              👆 {step.action}
            </p>
          )}
        </div>

        {/* Progress bar */}
        <div className="px-4 pb-2">
          <div className="w-full bg-stone-200 rounded-full h-1">
            <div
              className="bg-amber-500 h-1 rounded-full transition-all"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-stone-200 flex justify-between">
          <button
            onClick={onSkip}
            className="text-stone-500 hover:text-stone-700 text-sm"
          >
            Skip Tutorial
          </button>
          <div className="flex gap-2">
            {!isFirst && (
              <button
                onClick={onPrevious}
                className="px-4 py-2 bg-stone-200 text-stone-700 rounded hover:bg-stone-300"
              >
                Previous
              </button>
            )}
            {isLast ? (
              <button
                onClick={onComplete}
                className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
              >
                Start Playing!
              </button>
            ) : (
              <button
                onClick={onNext}
                className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Hook for managing tutorial state
export function useTutorial(steps: TutorialStep[] = DEFAULT_TUTORIAL_STEPS) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const start = () => {
    setCurrentStep(0);
    setIsActive(true);
  };

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const previous = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const skip = () => {
    setIsActive(false);
    setCurrentStep(0);
    // Store in localStorage that tutorial was skipped
    localStorage.setItem('tutorial_completed', 'true');
  };

  const complete = () => {
    setIsActive(false);
    setCurrentStep(0);
    localStorage.setItem('tutorial_completed', 'true');
  };

  const shouldShowTutorial = () => {
    return !localStorage.getItem('tutorial_completed');
  };

  return {
    isActive,
    currentStep,
    step: steps[currentStep],
    start,
    next,
    previous,
    skip,
    complete,
    shouldShowTutorial
  };
}

export default TutorialOverlay;
