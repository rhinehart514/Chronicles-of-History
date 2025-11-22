// Game save and load system

export interface SaveGame {
  id: string;
  name: string;
  date: string;
  gameDate: string;
  nationName: string;
  nationFlag: string;
  playtime: number;
  version: string;
  checksum: string;
  isAutosave: boolean;
  isIronman: boolean;
  thumbnail?: string;
}

export interface SaveMetadata {
  saveCount: number;
  lastSaved: string;
  autosaveInterval: number;
  maxAutosaves: number;
  cloudSync: boolean;
}

export interface SaveOptions {
  name: string;
  compress: boolean;
  cloud: boolean;
  overwrite?: string;
}

export interface LoadResult {
  success: boolean;
  error?: string;
  gameState?: any;
}

// Save system constants
export const SAVE_CONSTANTS = {
  maxSaves: 100,
  maxAutosaves: 3,
  autosaveIntervalMinutes: 15,
  compressionLevel: 6,
  version: '1.0.0'
};

// Save slot types
export const SAVE_TYPES = {
  manual: 'manual',
  autosave: 'autosave',
  ironman: 'ironman',
  cloud: 'cloud'
};

// Format playtime
export function formatPlaytime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

// Format save date
export function formatSaveDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
}

// Generate save name
export function generateSaveName(
  nationName: string,
  gameDate: string,
  isAutosave: boolean = false
): string {
  if (isAutosave) {
    return `${nationName}_autosave_${gameDate}`;
  }
  return `${nationName}_${gameDate}`;
}

// Generate checksum
export function generateChecksum(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

// Validate save
export function validateSave(save: SaveGame): boolean {
  if (!save.id || !save.name) return false;
  if (!save.version) return false;
  if (save.playtime < 0) return false;
  return true;
}

// Sort saves by date
export function sortSavesByDate(saves: SaveGame[]): SaveGame[] {
  return [...saves].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

// Filter saves
export function filterSaves(
  saves: SaveGame[],
  type: 'all' | 'manual' | 'autosave' | 'ironman'
): SaveGame[] {
  switch (type) {
    case 'manual':
      return saves.filter(s => !s.isAutosave && !s.isIronman);
    case 'autosave':
      return saves.filter(s => s.isAutosave);
    case 'ironman':
      return saves.filter(s => s.isIronman);
    default:
      return saves;
  }
}

// Get save size estimate
export function estimateSaveSize(gameState: any): number {
  const json = JSON.stringify(gameState);
  return Math.ceil(json.length / 1024); // KB
}

// Check if can save
export function canSave(
  currentSaves: number,
  isIronman: boolean,
  lastSave: string
): { canSave: boolean; reason?: string } {
  if (currentSaves >= SAVE_CONSTANTS.maxSaves) {
    return { canSave: false, reason: 'Maximum saves reached' };
  }

  if (isIronman) {
    const lastSaveTime = new Date(lastSave).getTime();
    const now = Date.now();
    const minInterval = 60000; // 1 minute
    if (now - lastSaveTime < minInterval) {
      return { canSave: false, reason: 'Please wait before saving again' };
    }
  }

  return { canSave: true };
}

// Get autosave to delete
export function getAutosaveToDelete(
  saves: SaveGame[],
  maxAutosaves: number = SAVE_CONSTANTS.maxAutosaves
): string | undefined {
  const autosaves = saves
    .filter(s => s.isAutosave)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (autosaves.length >= maxAutosaves) {
    return autosaves[0].id;
  }
  return undefined;
}

// Create save game object
export function createSaveGame(
  name: string,
  nationName: string,
  nationFlag: string,
  gameDate: string,
  playtime: number,
  isAutosave: boolean = false,
  isIronman: boolean = false
): SaveGame {
  const id = `save_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  return {
    id,
    name,
    date: new Date().toISOString(),
    gameDate,
    nationName,
    nationFlag,
    playtime,
    version: SAVE_CONSTANTS.version,
    checksum: '',
    isAutosave,
    isIronman
  };
}

// Compare versions
export function isCompatibleVersion(saveVersion: string): boolean {
  const [saveMajor, saveMinor] = saveVersion.split('.').map(Number);
  const [currentMajor, currentMinor] = SAVE_CONSTANTS.version.split('.').map(Number);

  return saveMajor === currentMajor && saveMinor <= currentMinor;
}

export default {
  SAVE_CONSTANTS,
  SAVE_TYPES,
  formatPlaytime,
  formatSaveDate,
  generateSaveName,
  generateChecksum,
  validateSave,
  sortSavesByDate,
  filterSaves,
  estimateSaveSize,
  canSave,
  getAutosaveToDelete,
  createSaveGame,
  isCompatibleVersion
};
