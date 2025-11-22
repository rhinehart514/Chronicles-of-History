import { Nation, GamePhase, LogEntry, War, WorldState } from '../types';
import { Territory } from '../data/territorySystem';
import { DynamicEvent } from '../data/dynamicEvents';
import { MajorAction } from '../data/playerActions';

export interface GameSave {
  version: number;
  timestamp: number;
  name: string;

  // Core game state
  year: number;
  phase: GamePhase;
  nations: Nation[];
  wars: War[];
  logs: LogEntry[];
  historyContext: string[];

  // Current reign
  currentNationId: string | null;
  reignStartYear: number;
  reignLogs: string[];

  // World state
  worldState: WorldState | null;

  // Events
  currentEvent: DynamicEvent | null;
  firedEvents: [string, number][]; // Map serialized as array

  // Territory
  territories: Territory[];
  availableActions: MajorAction[];
}

const SAVE_VERSION = 1;
const STORAGE_KEY = 'chronicles_saves';
const AUTOSAVE_KEY = 'chronicles_autosave';

export interface SaveMetadata {
  id: string;
  name: string;
  timestamp: number;
  year: number;
  nationName: string;
}

// Get all save metadata without loading full saves
export function getSaveList(): SaveMetadata[] {
  try {
    const saves = localStorage.getItem(STORAGE_KEY);
    if (!saves) return [];

    const parsed = JSON.parse(saves) as Record<string, GameSave>;
    return Object.entries(parsed).map(([id, save]) => ({
      id,
      name: save.name,
      timestamp: save.timestamp,
      year: save.year,
      nationName: save.nations.find(n => n.id === save.currentNationId)?.name || 'Unknown'
    })).sort((a, b) => b.timestamp - a.timestamp);
  } catch (e) {
    console.error('Failed to get save list:', e);
    return [];
  }
}

// Save game to localStorage
export function saveGame(state: Omit<GameSave, 'version' | 'timestamp' | 'name'>, name?: string): string {
  try {
    const saves = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const id = `save_${Date.now()}`;
    const nationName = state.nations.find(n => n.id === state.currentNationId)?.name || 'Unknown';

    const save: GameSave = {
      ...state,
      version: SAVE_VERSION,
      timestamp: Date.now(),
      name: name || `${nationName} - Year ${state.year}`,
      firedEvents: Array.from(state.firedEvents as unknown as Map<string, number>)
    };

    saves[id] = save;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saves));

    return id;
  } catch (e) {
    console.error('Failed to save game:', e);
    throw new Error('Failed to save game. Storage may be full.');
  }
}

// Load game from localStorage
export function loadGame(id: string): GameSave | null {
  try {
    const saves = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const save = saves[id];

    if (!save) return null;

    // Migrate old saves if needed
    if (save.version !== SAVE_VERSION) {
      return migrateSave(save);
    }

    return save;
  } catch (e) {
    console.error('Failed to load game:', e);
    return null;
  }
}

// Delete a save
export function deleteSave(id: string): boolean {
  try {
    const saves = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    delete saves[id];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saves));
    return true;
  } catch (e) {
    console.error('Failed to delete save:', e);
    return false;
  }
}

// Autosave (overwrites previous autosave)
export function autosave(state: Omit<GameSave, 'version' | 'timestamp' | 'name'>): void {
  try {
    const nationName = state.nations.find(n => n.id === state.currentNationId)?.name || 'Unknown';

    const save: GameSave = {
      ...state,
      version: SAVE_VERSION,
      timestamp: Date.now(),
      name: `Autosave - ${nationName} - Year ${state.year}`,
      firedEvents: Array.from(state.firedEvents as unknown as Map<string, number>)
    };

    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(save));
  } catch (e) {
    console.error('Failed to autosave:', e);
  }
}

// Load autosave
export function loadAutosave(): GameSave | null {
  try {
    const save = localStorage.getItem(AUTOSAVE_KEY);
    if (!save) return null;
    return JSON.parse(save);
  } catch (e) {
    console.error('Failed to load autosave:', e);
    return null;
  }
}

// Check if autosave exists
export function hasAutosave(): boolean {
  return localStorage.getItem(AUTOSAVE_KEY) !== null;
}

// Export save to file
export function exportSave(id: string): void {
  const save = loadGame(id);
  if (!save) return;

  const blob = new Blob([JSON.stringify(save, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `chronicles_${save.name.replace(/\s+/g, '_')}_${save.year}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Import save from file
export function importSave(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const save = JSON.parse(e.target?.result as string) as GameSave;

        // Validate save structure
        if (!save.version || !save.year || !save.nations) {
          throw new Error('Invalid save file format');
        }

        // Store imported save
        const saves = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        const id = `import_${Date.now()}`;
        saves[id] = save;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saves));

        resolve(id);
      } catch (err) {
        reject(new Error('Failed to import save file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

// Migrate old save versions
function migrateSave(save: GameSave): GameSave {
  // Add migration logic here as save format evolves
  return { ...save, version: SAVE_VERSION };
}

// Convert loaded save back to usable state (deserialize Map)
export function deserializeSave(save: GameSave): Omit<GameSave, 'version' | 'timestamp' | 'name' | 'firedEvents'> & { firedEvents: Map<string, number> } {
  return {
    ...save,
    firedEvents: new Map(save.firedEvents)
  };
}

// Clear all saves (dangerous!)
export function clearAllSaves(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(AUTOSAVE_KEY);
}
