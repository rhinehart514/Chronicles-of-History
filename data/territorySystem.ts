import { Nation } from '../types';

// ==================== TERRITORY MANAGEMENT ====================

export interface Territory {
  id: string;
  name: string;
  geoName: string; // Matches GeoJSON property
  ownerId: string;
  population?: number;
  resources?: string[];
  isCapital?: boolean;
  isColony?: boolean;
  coreOf?: string[]; // Nations that have claims
  culture?: string;
}

export interface TerritoryChange {
  territoryId: string;
  fromNationId: string;
  toNationId: string;
  type: 'CONQUEST' | 'CESSION' | 'PURCHASE' | 'INDEPENDENCE' | 'UNIFICATION' | 'COLONIZATION';
  year: number;
  narrative: string;
}

export interface MapState {
  territories: Territory[];
  recentChanges: TerritoryChange[];
  newNations: string[]; // Nations created this session
  deadNations: string[]; // Nations that no longer exist
}

// ==================== INITIAL TERRITORIES (1750) ====================

export const INITIAL_TERRITORIES: Territory[] = [
  // Britain
  { id: 'england', name: 'England', geoName: 'England', ownerId: 'britain', isCapital: true, coreOf: ['britain'] },
  { id: 'scotland', name: 'Scotland', geoName: 'United Kingdom', ownerId: 'britain', coreOf: ['britain'] },
  { id: 'ireland', name: 'Ireland', geoName: 'Ireland', ownerId: 'britain', coreOf: ['britain', 'ireland'] },
  { id: 'british_america', name: 'British America', geoName: 'United States of America', ownerId: 'britain', isColony: true, coreOf: ['usa'] },
  { id: 'british_india', name: 'British India', geoName: 'India', ownerId: 'britain', isColony: true, coreOf: ['india'] },
  { id: 'canada', name: 'British Canada', geoName: 'Canada', ownerId: 'britain', isColony: true, coreOf: ['canada'] },

  // France
  { id: 'france_proper', name: 'France', geoName: 'France', ownerId: 'france', isCapital: true, coreOf: ['france'] },
  { id: 'louisiana', name: 'Louisiana', geoName: 'United States of America', ownerId: 'france', isColony: true },
  { id: 'french_caribbean', name: 'French Caribbean', geoName: 'Haiti', ownerId: 'france', isColony: true, coreOf: ['haiti'] },

  // Prussia/Germany
  { id: 'prussia_proper', name: 'Prussia', geoName: 'Germany', ownerId: 'prussia', isCapital: true, coreOf: ['prussia', 'germany'] },
  { id: 'silesia', name: 'Silesia', geoName: 'Poland', ownerId: 'prussia', coreOf: ['prussia', 'austria'] },

  // Russia
  { id: 'russia_proper', name: 'Russia', geoName: 'Russia', ownerId: 'russia', isCapital: true, coreOf: ['russia'] },
  { id: 'ukraine', name: 'Ukraine', geoName: 'Ukraine', ownerId: 'russia', coreOf: ['russia', 'ukraine'] },
  { id: 'belarus', name: 'Belarus', geoName: 'Belarus', ownerId: 'russia', coreOf: ['russia'] },
  { id: 'siberia', name: 'Siberia', geoName: 'Russia', ownerId: 'russia', coreOf: ['russia'] },

  // Ottoman
  { id: 'anatolia', name: 'Anatolia', geoName: 'Turkey', ownerId: 'ottoman', isCapital: true, coreOf: ['ottoman', 'turkey'] },
  { id: 'greece', name: 'Greece', geoName: 'Greece', ownerId: 'ottoman', coreOf: ['greece'] },
  { id: 'syria', name: 'Syria', geoName: 'Syria', ownerId: 'ottoman', coreOf: ['syria'] },
  { id: 'egypt', name: 'Egypt', geoName: 'Egypt', ownerId: 'ottoman', coreOf: ['egypt'] },
  { id: 'iraq', name: 'Mesopotamia', geoName: 'Iraq', ownerId: 'ottoman', coreOf: ['iraq'] },

  // Qing
  { id: 'china_proper', name: 'China Proper', geoName: 'China', ownerId: 'qing', isCapital: true, coreOf: ['qing', 'china'] },
  { id: 'manchuria', name: 'Manchuria', geoName: 'China', ownerId: 'qing', coreOf: ['qing'] },
  { id: 'mongolia', name: 'Mongolia', geoName: 'Mongolia', ownerId: 'qing', coreOf: ['mongolia'] },
  { id: 'tibet', name: 'Tibet', geoName: 'China', ownerId: 'qing', coreOf: ['tibet'] },

  // Spain
  { id: 'spain_proper', name: 'Spain', geoName: 'Spain', ownerId: 'spain', isCapital: true, coreOf: ['spain'] },
  { id: 'mexico', name: 'New Spain', geoName: 'Mexico', ownerId: 'spain', isColony: true, coreOf: ['mexico'] },
  { id: 'peru', name: 'Peru', geoName: 'Peru', ownerId: 'spain', isColony: true, coreOf: ['peru'] },
  { id: 'argentina', name: 'Rio de la Plata', geoName: 'Argentina', ownerId: 'spain', isColony: true, coreOf: ['argentina'] },
  { id: 'colombia', name: 'New Granada', geoName: 'Colombia', ownerId: 'spain', isColony: true, coreOf: ['colombia'] },
  { id: 'philippines', name: 'Philippines', geoName: 'Philippines', ownerId: 'spain', isColony: true, coreOf: ['philippines'] }
];

// ==================== HELPER FUNCTIONS ====================

export const getTerritoriesForNation = (territories: Territory[], nationId: string): Territory[] => {
  return territories.filter(t => t.ownerId === nationId);
};

export const getColoniesForNation = (territories: Territory[], nationId: string): Territory[] => {
  return territories.filter(t => t.ownerId === nationId && t.isColony);
};

export const transferTerritory = (
  territories: Territory[],
  territoryId: string,
  toNationId: string,
  type: TerritoryChange['type'],
  year: number
): { territories: Territory[]; change: TerritoryChange } => {
  const territory = territories.find(t => t.id === territoryId);
  if (!territory) {
    return { territories, change: null as any };
  }

  const fromNationId = territory.ownerId;
  const updatedTerritories = territories.map(t => {
    if (t.id === territoryId) {
      return { ...t, ownerId: toNationId, isColony: type === 'COLONIZATION' };
    }
    return t;
  });

  const change: TerritoryChange = {
    territoryId,
    fromNationId,
    toNationId,
    type,
    year,
    narrative: generateTransferNarrative(territory, fromNationId, toNationId, type)
  };

  return { territories: updatedTerritories, change };
};

const generateTransferNarrative = (
  territory: Territory,
  fromId: string,
  toId: string,
  type: TerritoryChange['type']
): string => {
  switch (type) {
    case 'CONQUEST':
      return `${territory.name} has been conquered and annexed.`;
    case 'CESSION':
      return `${territory.name} has been ceded through treaty.`;
    case 'PURCHASE':
      return `${territory.name} has been purchased.`;
    case 'INDEPENDENCE':
      return `${territory.name} has declared independence!`;
    case 'UNIFICATION':
      return `${territory.name} has joined the union.`;
    case 'COLONIZATION':
      return `${territory.name} has been colonized.`;
    default:
      return `${territory.name} has changed hands.`;
  }
};

// Create a new nation from territories
export const createNationFromTerritory = (
  territory: Territory,
  newNationId: string,
  newNationName: string
): Partial<Nation> => {
  return {
    id: newNationId,
    name: newNationName,
    geoNames: [territory.geoName],
    stats: {
      military: 2,
      economy: 2,
      stability: 2,
      innovation: 2,
      prestige: 2
    }
  };
};

// ==================== HISTORICAL TERRITORY CHANGES ====================

export interface HistoricalTerritoryChange {
  year: number;
  territoryId: string;
  toNationId: string;
  type: TerritoryChange['type'];
  canPrevent?: boolean; // Player can prevent this
  preventConditions?: {
    minStability?: number;
    minMilitary?: number;
    mustWinWar?: boolean;
  };
}

export const HISTORICAL_TERRITORY_CHANGES: HistoricalTerritoryChange[] = [
  // American Revolution
  { year: 1776, territoryId: 'british_america', toNationId: 'usa', type: 'INDEPENDENCE', canPrevent: true, preventConditions: { minStability: 4 } },

  // Louisiana Purchase
  { year: 1803, territoryId: 'louisiana', toNationId: 'usa', type: 'PURCHASE' },

  // Latin American Independence
  { year: 1821, territoryId: 'mexico', toNationId: 'mexico', type: 'INDEPENDENCE', canPrevent: true },
  { year: 1821, territoryId: 'peru', toNationId: 'peru', type: 'INDEPENDENCE', canPrevent: true },
  { year: 1816, territoryId: 'argentina', toNationId: 'argentina', type: 'INDEPENDENCE', canPrevent: true },
  { year: 1819, territoryId: 'colombia', toNationId: 'colombia', type: 'INDEPENDENCE', canPrevent: true },

  // Greek Independence
  { year: 1832, territoryId: 'greece', toNationId: 'greece', type: 'INDEPENDENCE', canPrevent: true, preventConditions: { minMilitary: 4 } },

  // German Unification
  { year: 1871, territoryId: 'prussia_proper', toNationId: 'germany', type: 'UNIFICATION' },

  // Ottoman losses
  { year: 1882, territoryId: 'egypt', toNationId: 'britain', type: 'CONQUEST', canPrevent: true },
];

// Check if a historical change should happen
export const shouldTerritoryChange = (
  change: HistoricalTerritoryChange,
  currentYear: number,
  ownerNation: Nation
): boolean => {
  if (change.year !== currentYear) return false;

  // Check if player can prevent it
  if (change.canPrevent && change.preventConditions) {
    const cond = change.preventConditions;
    if (cond.minStability && ownerNation.stats.stability >= cond.minStability) {
      return false; // Player prevented it
    }
    if (cond.minMilitary && ownerNation.stats.military >= cond.minMilitary) {
      return false;
    }
  }

  return true;
};

// ==================== MAP COLORS ====================

export const getGovernmentColor = (governmentType: string): string => {
  const colors: Record<string, string> = {
    'ABSOLUTE_MONARCHY': '#8B4513', // Brown
    'CONSTITUTIONAL_MONARCHY': '#4169E1', // Royal Blue
    'REPUBLIC': '#228B22', // Forest Green
    'FEDERAL_REPUBLIC': '#32CD32', // Lime Green
    'EMPIRE': '#800080', // Purple
    'THEOCRACY': '#FFD700', // Gold
    'OLIGARCHY': '#708090', // Slate Gray
    'MILITARY_JUNTA': '#8B0000', // Dark Red
    'COMMUNIST_STATE': '#FF0000', // Red
    'FASCIST_STATE': '#000000', // Black
    'COLONIAL': '#D2691E' // Chocolate
  };
  return colors[governmentType] || '#808080';
};

export const getWarIndicatorColor = (isAtWar: boolean, isWinning: boolean): string => {
  if (!isAtWar) return 'transparent';
  return isWinning ? '#FFD700' : '#FF4500';
};
