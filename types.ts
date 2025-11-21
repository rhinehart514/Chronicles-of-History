
export interface NationStats {
  military: number;
  economy: number;
  stability: number;
  innovation: number;
  prestige: number;
}

export interface Faction {
  name: string; // e.g., "The Aristocracy", "The Jacobins"
  approval: number; // 0 to 100
  description: string; // Short status text
}

export interface Nation {
  id: string;
  name: string;
  description: string;
  stats: NationStats;
  rulerTitle: string;
  geoNames?: string[]; // List of GeoJSON property names that map to this nation
  factions?: Faction[]; // New: Internal political entities
}

export interface Choice {
  id: string;
  text: string;
  type: 'MILITARY' | 'DIPLOMATIC' | 'ECONOMIC' | 'INTRIGUE' | 'DOMESTIC';
}

export interface BriefingData {
  situation: string;
  factions: Faction[]; // New: Current internal state
  departments: {
    military: string;
    economic: string;
    domestic: string;
    foreign: string;
    intrigue: string;
  };
  choices: Choice[];
  imagePrompt: string;
}

export interface TerritoryTransfer {
  regionName: string; // The specific name of the region/country lost (e.g. "Scotland", "Poland")
  loserId: string; // ID of nation losing it
  winnerId: string; // ID of nation gaining it
  narrative: string; // "France has formally ceded Quebec..."
}

export interface War {
  id: string;
  attackerId: string;
  defenderId: string;
  startYear: number;
  state: 'ONGOING' | 'STALEMATE' | 'VICTORY_ATTACKER' | 'VICTORY_DEFENDER' | 'PEACE_TREATY';
  narrative: string;
}

export interface ResolutionData {
  narrative: string;
  statChanges: Partial<NationStats>;
  factionChanges?: { name: string; change: number }[]; // New: Impact on factions
  territoryTransfer?: TerritoryTransfer; // New: Land changing hands
  warUpdate?: War; // New: Start or update a war involving the player
  globalReaction: string;
}

export interface GlobalSimulationData {
  summary: string;
  nationUpdates: {
    nationId: string;
    changes: Partial<NationStats>;
  }[];
  newWars?: War[]; // AI vs AI wars started
  endedWars?: War[]; // AI vs AI wars ended
  territoryTransfers?: TerritoryTransfer[]; // Consequence of AI wars
}

export interface LegacyData {
  eraName: string; 
  summary: string;
  majorAchievements: string[];
  lastingImpact: string; 
}

export interface LogEntry {
  year: number;
  type: 'EVENT' | 'DECISION' | 'WORLD_UPDATE' | 'LEGACY' | 'CONQUEST' | 'WAR';
  content: string;
  nationName?: string;
}

export type GamePhase = 'SELECT_NATION' | 'BRIEFING' | 'DECISION' | 'RESOLUTION' | 'SIMULATION' | 'LEGACY_VIEW';

// Types for WorldMap component
export interface GeoJSONFeature {
  type: string;
  properties: {
    name: string;
    [key: string]: any;
  };
  geometry: {
    type: string;
    coordinates: any[];
  };
}

export interface GeoJSONCollection {
  type: string;
  features: GeoJSONFeature[];
}

// Types for CountrySidebar component
export interface CountryData {
  emoji: string;
  capital: string;
  population: string;
  currency: string;
  languages: string[];
  description: string;
  historySnippet: string;
  funFact: string;
  travelTips: string[];
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING_AI = 'LOADING_AI',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
