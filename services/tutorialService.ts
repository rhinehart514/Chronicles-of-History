// Tutorial and onboarding system

export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  target?: string; // CSS selector for highlighting
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: 'click' | 'hover' | 'any';
  nextCondition?: string; // Event that triggers next step
}

export interface Tutorial {
  id: string;
  name: string;
  description: string;
  steps: TutorialStep[];
}

// Main game tutorial
export const MAIN_TUTORIAL: Tutorial = {
  id: 'main',
  name: 'Getting Started',
  description: 'Learn the basics of ruling your nation',
  steps: [
    {
      id: 'welcome',
      title: 'Welcome to Chronicles of History',
      content: 'You are about to guide a nation through centuries of history. Every decision you make will shape the future. Let\'s learn the basics.',
      position: 'center'
    },
    {
      id: 'select_nation',
      title: 'Select Your Nation',
      content: 'Click on any nation on the map to see its profile and start your reign. Each nation has unique strengths and challenges.',
      position: 'center',
      action: 'click'
    },
    {
      id: 'nation_stats',
      title: 'Understanding Stats',
      content: 'Every nation has 5 key stats: Military (combat strength), Economy (wealth), Stability (internal order), Innovation (progress), and Prestige (reputation). Balance them wisely.',
      position: 'top'
    },
    {
      id: 'factions',
      title: 'Managing Factions',
      content: 'Your nation has internal factions with their own agendas. Keep them satisfied or risk rebellion. Watch their approval ratings carefully.',
      position: 'top'
    },
    {
      id: 'decisions',
      title: 'Making Decisions',
      content: 'Each turn, you\'ll face important choices. Read your advisors\' reports carefully - they contain valuable information about the consequences of each option.',
      position: 'bottom'
    },
    {
      id: 'court',
      title: 'Your Court',
      content: 'Press "C" or click the Court button to see your ruler and advisors. Each has traits that affect their competence. A skilled Treasurer will boost your economy.',
      position: 'left'
    },
    {
      id: 'diplomacy',
      title: 'Diplomacy',
      content: 'Press "D" to view diplomatic relations. Form alliances, arrange marriages, or declare war. Your actions affect how other nations perceive you.',
      position: 'left'
    },
    {
      id: 'research',
      title: 'Research',
      content: 'Press "R" to access the technology tree. Research new technologies to gain advantages in war, trade, and governance.',
      position: 'left'
    },
    {
      id: 'save_game',
      title: 'Saving Your Game',
      content: 'Press Ctrl+S to save your progress. The game also autosaves after each turn. You can have multiple save files.',
      position: 'center'
    },
    {
      id: 'end_turn',
      title: 'Ending Your Turn',
      content: 'When you\'ve made your decision, click "End Turn" to advance time. Watch as the world reacts to your choices and new events unfold.',
      position: 'bottom'
    },
    {
      id: 'complete',
      title: 'You\'re Ready!',
      content: 'You now know the basics. Remember: there are no wrong choices, only consequences. Good luck, and may your reign be legendary!',
      position: 'center'
    }
  ]
};

// Quick tips that can appear during gameplay
export const GAMEPLAY_TIPS: string[] = [
  'Low stability can trigger rebellions. Keep your factions happy.',
  'Alliances can save you in war, but they come with obligations.',
  'A strong economy funds everything - wars, buildings, and reforms.',
  'Research technologies that complement your nation\'s strengths.',
  'Royal marriages can prevent wars and secure alliances.',
  'Watch your neighbors - aggressive expansion makes enemies.',
  'Some decisions have consequences that echo for generations.',
  'Your ruler\'s traits affect which decisions are available.',
  'Trade deals boost economy but create dependencies.',
  'Espionage can reveal enemy plans before war breaks out.',
  'Prestige affects diplomatic leverage - guard your reputation.',
  'Natural disasters and plagues can strike without warning.',
  'Court advisors die - plan for succession.',
  'High innovation unlocks powerful reform options.',
  'War exhaustion affects stability - don\'t overextend.'
];

const STORAGE_KEY = 'chronicles_tutorial';

interface TutorialState {
  completed: string[];
  currentStep: number;
  activeTutorial: string | null;
  tipsShown: number[];
}

// Load tutorial state
export function loadTutorialState(): TutorialState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load tutorial state:', e);
  }
  return {
    completed: [],
    currentStep: 0,
    activeTutorial: null,
    tipsShown: []
  };
}

// Save tutorial state
export function saveTutorialState(state: TutorialState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save tutorial state:', e);
  }
}

// Check if tutorial is completed
export function isTutorialCompleted(tutorialId: string): boolean {
  const state = loadTutorialState();
  return state.completed.includes(tutorialId);
}

// Mark tutorial as completed
export function completeTutorial(tutorialId: string): void {
  const state = loadTutorialState();
  if (!state.completed.includes(tutorialId)) {
    state.completed.push(tutorialId);
    state.activeTutorial = null;
    state.currentStep = 0;
    saveTutorialState(state);
  }
}

// Get a random tip that hasn't been shown recently
export function getRandomTip(): string {
  const state = loadTutorialState();
  const availableIndices = GAMEPLAY_TIPS
    .map((_, i) => i)
    .filter(i => !state.tipsShown.includes(i));

  if (availableIndices.length === 0) {
    // Reset if all tips shown
    state.tipsShown = [];
    saveTutorialState(state);
    return GAMEPLAY_TIPS[Math.floor(Math.random() * GAMEPLAY_TIPS.length)];
  }

  const index = availableIndices[Math.floor(Math.random() * availableIndices.length)];
  state.tipsShown.push(index);
  saveTutorialState(state);

  return GAMEPLAY_TIPS[index];
}

// Reset all tutorial progress
export function resetTutorials(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export default {
  MAIN_TUTORIAL,
  GAMEPLAY_TIPS,
  loadTutorialState,
  saveTutorialState,
  isTutorialCompleted,
  completeTutorial,
  getRandomTip,
  resetTutorials
};
