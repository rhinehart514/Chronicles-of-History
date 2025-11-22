// Ironman mode - single save, no reloading, permanent consequences

import { GameSave } from './saveService';

const IRONMAN_KEY = 'chronicles_ironman';

export interface IronmanState {
  isActive: boolean;
  saveId: string | null;
  startTime: number;
  nationId: string;
  checksum: string;
}

// Generate checksum to detect save tampering
function generateChecksum(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

// Start a new ironman game
export function startIronman(nationId: string): IronmanState {
  const state: IronmanState = {
    isActive: true,
    saveId: `ironman_${Date.now()}`,
    startTime: Date.now(),
    nationId,
    checksum: generateChecksum(`${nationId}_${Date.now()}`)
  };

  localStorage.setItem(IRONMAN_KEY, JSON.stringify(state));
  return state;
}

// Load ironman state
export function loadIronmanState(): IronmanState | null {
  try {
    const saved = localStorage.getItem(IRONMAN_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load ironman state:', e);
  }
  return null;
}

// Save ironman progress (only one save allowed)
export function saveIronman(save: Omit<GameSave, 'version' | 'timestamp' | 'name'>): void {
  const state = loadIronmanState();
  if (!state || !state.isActive) return;

  const ironmanSave: GameSave = {
    ...save,
    version: 1,
    timestamp: Date.now(),
    name: `Ironman - ${save.nations.find(n => n.id === state.nationId)?.name || 'Unknown'}`,
    firedEvents: Array.from(save.firedEvents as unknown as Map<string, number>)
  };

  // Store with checksum
  const saveData = JSON.stringify(ironmanSave);
  const checksum = generateChecksum(saveData);

  localStorage.setItem(`${IRONMAN_KEY}_save`, saveData);
  localStorage.setItem(`${IRONMAN_KEY}_checksum`, checksum);
}

// Load ironman save
export function loadIronman(): GameSave | null {
  try {
    const saveData = localStorage.getItem(`${IRONMAN_KEY}_save`);
    const savedChecksum = localStorage.getItem(`${IRONMAN_KEY}_checksum`);

    if (!saveData || !savedChecksum) return null;

    // Verify checksum
    const currentChecksum = generateChecksum(saveData);
    if (currentChecksum !== savedChecksum) {
      console.error('Ironman save corrupted or tampered with');
      return null;
    }

    return JSON.parse(saveData);
  } catch (e) {
    console.error('Failed to load ironman save:', e);
    return null;
  }
}

// End ironman game (victory or defeat)
export function endIronman(reason: 'victory' | 'defeat' | 'abandoned'): void {
  const state = loadIronmanState();
  if (!state) return;

  // Record completion
  const completions = JSON.parse(localStorage.getItem(`${IRONMAN_KEY}_history`) || '[]');
  completions.push({
    nationId: state.nationId,
    startTime: state.startTime,
    endTime: Date.now(),
    reason,
    duration: Date.now() - state.startTime
  });
  localStorage.setItem(`${IRONMAN_KEY}_history`, JSON.stringify(completions));

  // Clear current ironman
  localStorage.removeItem(IRONMAN_KEY);
  localStorage.removeItem(`${IRONMAN_KEY}_save`);
  localStorage.removeItem(`${IRONMAN_KEY}_checksum`);
}

// Check if currently in ironman mode
export function isIronmanActive(): boolean {
  const state = loadIronmanState();
  return state?.isActive ?? false;
}

// Get ironman history
export function getIronmanHistory(): Array<{
  nationId: string;
  startTime: number;
  endTime: number;
  reason: string;
  duration: number;
}> {
  try {
    return JSON.parse(localStorage.getItem(`${IRONMAN_KEY}_history`) || '[]');
  } catch {
    return [];
  }
}

// Validate that player can't load other saves during ironman
export function canLoadSave(saveId: string): boolean {
  const state = loadIronmanState();
  if (!state || !state.isActive) return true;

  // In ironman, can only load the ironman save
  return saveId === state.saveId;
}

export default {
  startIronman,
  loadIronmanState,
  saveIronman,
  loadIronman,
  endIronman,
  isIronmanActive,
  getIronmanHistory,
  canLoadSave
};
