import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Game state types
export interface GameState {
  // Time
  currentDate: string;
  speed: number;
  isPaused: boolean;

  // Player nation
  playerNation: string;
  treasury: number;
  manpower: number;
  maxManpower: number;
  stability: number;
  legitimacy: number;
  prestige: number;
  corruption: number;
  inflation: number;
  warExhaustion: number;
  overextension: number;

  // Resources
  adminPower: number;
  diploPower: number;
  milPower: number;
  monthlyAdmin: number;
  monthlyDiplo: number;
  monthlyMil: number;

  // Military
  armySize: number;
  navySize: number;
  manpowerRecovery: number;
  forcelimit: number;
  navalForcelimit: number;

  // Technology
  adminTech: number;
  diploTech: number;
  milTech: number;

  // Economy
  monthlyIncome: number;
  monthlyExpenses: number;
  loans: number;

  // Diplomacy
  allies: string[];
  rivals: string[];
  truces: { nation: string; expires: string }[];
  wars: string[];

  // Internal
  provinces: string[];
  totalDevelopment: number;
  coreProvinces: number;
  subjects: string[];

  // UI state
  selectedProvince: string | null;
  selectedArmy: string | null;
  activePanel: string | null;
  mapMode: string;

  // Notifications
  unreadNotifications: number;
}

// Initial state
export const initialGameState: GameState = {
  currentDate: '1444-11-11',
  speed: 3,
  isPaused: true,

  playerNation: '',
  treasury: 100,
  manpower: 10000,
  maxManpower: 15000,
  stability: 0,
  legitimacy: 100,
  prestige: 0,
  corruption: 0,
  inflation: 0,
  warExhaustion: 0,
  overextension: 0,

  adminPower: 100,
  diploPower: 100,
  milPower: 100,
  monthlyAdmin: 7,
  monthlyDiplo: 7,
  monthlyMil: 7,

  armySize: 0,
  navySize: 0,
  manpowerRecovery: 500,
  forcelimit: 20,
  navalForcelimit: 10,

  adminTech: 3,
  diploTech: 3,
  milTech: 3,

  monthlyIncome: 10,
  monthlyExpenses: 5,
  loans: 0,

  allies: [],
  rivals: [],
  truces: [],
  wars: [],

  provinces: [],
  totalDevelopment: 0,
  coreProvinces: 0,
  subjects: [],

  selectedProvince: null,
  selectedArmy: null,
  activePanel: null,
  mapMode: 'political',

  unreadNotifications: 0
};

// Action types
export type GameAction =
  | { type: 'SET_DATE'; payload: string }
  | { type: 'SET_SPEED'; payload: number }
  | { type: 'TOGGLE_PAUSE' }
  | { type: 'SET_PLAYER_NATION'; payload: string }
  | { type: 'UPDATE_TREASURY'; payload: number }
  | { type: 'UPDATE_MANPOWER'; payload: number }
  | { type: 'UPDATE_STABILITY'; payload: number }
  | { type: 'UPDATE_POWER'; payload: { type: 'admin' | 'diplo' | 'mil'; value: number } }
  | { type: 'RESEARCH_TECH'; payload: { category: 'admin' | 'diplo' | 'mil' } }
  | { type: 'SELECT_PROVINCE'; payload: string | null }
  | { type: 'SELECT_ARMY'; payload: string | null }
  | { type: 'SET_ACTIVE_PANEL'; payload: string | null }
  | { type: 'SET_MAP_MODE'; payload: string }
  | { type: 'ADD_ALLY'; payload: string }
  | { type: 'REMOVE_ALLY'; payload: string }
  | { type: 'ADD_WAR'; payload: string }
  | { type: 'END_WAR'; payload: string }
  | { type: 'TAKE_LOAN' }
  | { type: 'REPAY_LOAN' }
  | { type: 'MONTH_TICK' }
  | { type: 'LOAD_GAME'; payload: Partial<GameState> };

// Reducer
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_DATE':
      return { ...state, currentDate: action.payload };

    case 'SET_SPEED':
      return { ...state, speed: Math.max(0, Math.min(5, action.payload)) };

    case 'TOGGLE_PAUSE':
      return { ...state, isPaused: !state.isPaused };

    case 'SET_PLAYER_NATION':
      return { ...state, playerNation: action.payload };

    case 'UPDATE_TREASURY':
      return { ...state, treasury: Math.max(0, state.treasury + action.payload) };

    case 'UPDATE_MANPOWER':
      return {
        ...state,
        manpower: Math.max(0, Math.min(state.maxManpower, state.manpower + action.payload))
      };

    case 'UPDATE_STABILITY':
      return {
        ...state,
        stability: Math.max(-3, Math.min(3, state.stability + action.payload))
      };

    case 'UPDATE_POWER': {
      const { type, value } = action.payload;
      const key = type === 'admin' ? 'adminPower' : type === 'diplo' ? 'diploPower' : 'milPower';
      return { ...state, [key]: Math.max(0, Math.min(999, state[key] + value)) };
    }

    case 'RESEARCH_TECH': {
      const { category } = action.payload;
      const techKey = category === 'admin' ? 'adminTech' : category === 'diplo' ? 'diploTech' : 'milTech';
      return { ...state, [techKey]: state[techKey] + 1 };
    }

    case 'SELECT_PROVINCE':
      return { ...state, selectedProvince: action.payload };

    case 'SELECT_ARMY':
      return { ...state, selectedArmy: action.payload };

    case 'SET_ACTIVE_PANEL':
      return { ...state, activePanel: action.payload };

    case 'SET_MAP_MODE':
      return { ...state, mapMode: action.payload };

    case 'ADD_ALLY':
      return { ...state, allies: [...state.allies, action.payload] };

    case 'REMOVE_ALLY':
      return { ...state, allies: state.allies.filter(a => a !== action.payload) };

    case 'ADD_WAR':
      return { ...state, wars: [...state.wars, action.payload] };

    case 'END_WAR':
      return { ...state, wars: state.wars.filter(w => w !== action.payload) };

    case 'TAKE_LOAN':
      return {
        ...state,
        treasury: state.treasury + state.monthlyIncome * 5,
        loans: state.loans + 1,
        inflation: state.inflation + 0.1
      };

    case 'REPAY_LOAN':
      if (state.loans > 0 && state.treasury >= state.monthlyIncome * 5) {
        return {
          ...state,
          treasury: state.treasury - state.monthlyIncome * 5,
          loans: state.loans - 1
        };
      }
      return state;

    case 'MONTH_TICK': {
      // Monthly updates
      const balance = state.monthlyIncome - state.monthlyExpenses;
      const interest = state.loans * state.monthlyIncome * 0.04 / 12;

      return {
        ...state,
        treasury: state.treasury + balance - interest,
        manpower: Math.min(state.maxManpower, state.manpower + state.manpowerRecovery),
        adminPower: Math.min(999, state.adminPower + state.monthlyAdmin),
        diploPower: Math.min(999, state.diploPower + state.monthlyDiplo),
        milPower: Math.min(999, state.milPower + state.monthlyMil)
      };
    }

    case 'LOAD_GAME':
      return { ...state, ...action.payload };

    default:
      return state;
  }
}

// Context
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider
export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

// Hook
export function useGameState() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameProvider');
  }
  return context;
}

// Selectors
export const selectIsAtWar = (state: GameState) => state.wars.length > 0;
export const selectMonthlyBalance = (state: GameState) => state.monthlyIncome - state.monthlyExpenses;
export const selectTotalTech = (state: GameState) => state.adminTech + state.diploTech + state.milTech;
export const selectManpowerPercent = (state: GameState) => (state.manpower / state.maxManpower) * 100;

export default GameContext;
