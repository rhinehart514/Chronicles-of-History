
export interface NationStats {
  military: number;
  economy: number;
  stability: number;
  innovation: number;
  prestige: number;
}

// ==================== WORLD BUILDING TYPES ====================

// Cultural Systems
export interface Religion {
  name: string; // e.g., "Catholic Christianity", "Sunni Islam", "Confucianism"
  type: 'STATE' | 'MAJORITY' | 'MINORITY' | 'TOLERATED' | 'PERSECUTED';
  influence: number; // 0-100, how much power clergy/religious institutions have
  description: string;
}

export interface Tradition {
  name: string; // e.g., "Code of Chivalry", "Mandate of Heaven", "Bushido"
  category: 'MILITARY' | 'GOVERNANCE' | 'SOCIAL' | 'ECONOMIC' | 'RELIGIOUS';
  effect: string; // Gameplay effect description
  description: string;
}

export interface NationalCharacter {
  traits: string[]; // e.g., ["Militaristic", "Mercantile", "Expansionist"]
  values: string[]; // e.g., ["Honor", "Liberty", "Order"]
  motto: string; // National motto or guiding principle
  culturalIdentity: string; // Description of national identity
}

export interface CulturalSystem {
  religions: Religion[];
  traditions: Tradition[];
  nationalCharacter: NationalCharacter;
  culturalTensions?: string[]; // e.g., "Protestant-Catholic divide", "Urban-Rural conflict"
}

// Population & Demographics
export interface SocialClass {
  name: string; // e.g., "Nobility", "Bourgeoisie", "Peasantry", "Serfs"
  percentage: number; // % of population
  wealth: number; // 1-5 scale
  influence: number; // 1-5 scale, political power
  satisfaction: number; // 0-100
  description: string;
}

export interface Demographics {
  totalPopulation: number; // In thousands
  growthRate: number; // Annual % growth
  urbanization: number; // % living in cities
  literacy: number; // % literacy rate
  socialClasses: SocialClass[];
  ethnicGroups?: { name: string; percentage: number }[];
  populationCenters: { name: string; population: number }[]; // Major cities
}

// Province/Region System
export interface Resource {
  name: string; // e.g., "Iron", "Grain", "Silk", "Silver"
  type: 'RAW_MATERIAL' | 'FOOD' | 'LUXURY' | 'STRATEGIC';
  abundance: number; // 1-5 scale
  exported: boolean;
}

export interface Province {
  id: string;
  name: string;
  type: 'CAPITAL' | 'CORE' | 'TERRITORY' | 'COLONY' | 'VASSAL';
  population: number; // In thousands
  development: number; // 1-10 scale
  resources: Resource[];
  terrain: 'PLAINS' | 'HILLS' | 'MOUNTAINS' | 'FOREST' | 'DESERT' | 'JUNGLE' | 'ARCTIC' | 'COASTAL' | 'ISLANDS';
  climate: 'TROPICAL' | 'ARID' | 'TEMPERATE' | 'CONTINENTAL' | 'POLAR';
  fortification: number; // 0-5, defensive strength
  unrest: number; // 0-100
  description: string;
}

// Trade Network System
export interface TradeGood {
  name: string;
  basePrice: number;
  category: 'GRAIN' | 'LIVESTOCK' | 'TEXTILE' | 'METAL' | 'LUXURY' | 'SPICE' | 'COLONIAL' | 'MANUFACTURED';
}

export interface TradeRoute {
  id: string;
  name: string; // e.g., "Atlantic Triangle", "Silk Road", "Baltic Trade"
  participants: string[]; // Nation IDs
  goods: string[]; // Trade good names
  value: number; // Annual trade value
  security: number; // 0-100, safety from piracy/disruption
  description: string;
}

export interface TradeAgreement {
  partnerId: string;
  type: 'OPEN' | 'PREFERENTIAL' | 'EXCLUSIVE' | 'EMBARGO';
  tariff: number; // % tariff rate
  startYear: number;
  goods: string[];
}

export interface TradeNetwork {
  exports: TradeGood[];
  imports: TradeGood[];
  tradeRoutes: TradeRoute[];
  agreements: TradeAgreement[];
  merchantFleet: number; // Number of trade ships
  tradeBalance: number; // Positive = surplus, negative = deficit
  majorTradingPosts?: string[]; // e.g., "Canton", "Goa", "Havana"
}

// Weather & Seasons System
export type Season = 'SPRING' | 'SUMMER' | 'AUTUMN' | 'WINTER';

export interface WeatherCondition {
  type: 'CLEAR' | 'RAIN' | 'STORM' | 'DROUGHT' | 'FLOOD' | 'SNOW' | 'HARSH_WINTER' | 'HEAT_WAVE';
  severity: number; // 1-5
  affectedProvinces: string[];
  effects: {
    military?: number; // Modifier to military operations
    economy?: number; // Modifier to production
    stability?: number; // Effect on population
  };
  description: string;
}

export interface SeasonalEffects {
  currentSeason: Season;
  weatherConditions: WeatherCondition[];
  harvestQuality: number; // 1-5, affects food supply
  campaignSeason: boolean; // Whether military campaigns are favorable
  description: string;
}

// World State - combines all world building elements
export interface WorldState {
  currentSeason: Season;
  globalWeather: WeatherCondition[];
  activeTradeRoutes: TradeRoute[];
  globalEvents?: string[]; // e.g., "European grain shortage", "Silver inflation"
}

// ==================== END WORLD BUILDING TYPES ====================

// ==================== LEADER & COURT TYPES ====================

export type LeaderTrait =
  | 'BRILLIANT_STRATEGIST'    // +1 to military decisions
  | 'ENLIGHTENED_DESPOT'      // +1 to reform decisions
  | 'PATRON_OF_ARTS'          // +1 to prestige, culture events
  | 'MASTER_DIPLOMAT'         // +1 to diplomatic decisions
  | 'RUTHLESS'                // +1 military, -1 stability
  | 'PIOUS'                   // +1 stability with religious factions
  | 'MERCHANT_PRINCE'         // +1 to economic decisions
  | 'REFORMER'                // +1 innovation, may upset traditionalists
  | 'TRADITIONALIST'          // +1 stability, -1 innovation
  | 'WARRIOR_KING'            // +1 military when at war
  | 'WEAK_WILLED'             // -1 to all decisions
  | 'PARANOID'                // +1 intrigue, -1 stability
  | 'CHARISMATIC'             // +1 prestige, faction approval
  | 'FRUGAL'                  // +1 economy, may upset nobility
  | 'EXTRAVAGANT';            // -1 economy, +1 prestige

export type Temperament = 'AGGRESSIVE' | 'CAUTIOUS' | 'BALANCED' | 'DIPLOMATIC' | 'ERRATIC';

export type CourtRole =
  | 'CHANCELLOR'      // Domestic affairs & reforms
  | 'TREASURER'       // Economy & finance
  | 'GENERAL'         // Army commander
  | 'ADMIRAL'         // Navy commander
  | 'SPYMASTER'       // Intrigue & intelligence
  | 'DIPLOMAT'        // Foreign affairs
  | 'HEIR';           // Succession

export interface Leader {
  id: string;
  name: string;                    // "Frederick II"
  title: string;                   // "King of Prussia"
  birthYear: number;
  deathYear?: number;              // If known historically
  reignStart: number;

  personality: {
    traits: LeaderTrait[];
    temperament: Temperament;
    priorities: ('MILITARY' | 'ECONOMY' | 'CULTURE' | 'EXPANSION' | 'STABILITY')[];
  };

  epithet?: string;                // "The Great"
  historicalNote: string;
  portraitPrompt: string;          // For AI image generation
}

export interface CourtMember {
  id: string;
  name: string;
  role: CourtRole;
  birthYear: number;
  deathYear?: number;

  competence: number;              // 1-5, affects outcomes
  loyalty: number;                 // 0-100
  traits: LeaderTrait[];
  faction?: string;                // Aligned political faction

  historicalNote: string;
  isHistorical: boolean;           // true = real person, false = generated
}

export interface Succession {
  heir?: CourtMember;
  lineOfSuccession: string[];      // IDs of potential heirs
  successionLaw: 'PRIMOGENITURE' | 'AGNATIC' | 'ELECTIVE' | 'TANISTRY' | 'ABSOLUTE';
  crisisRisk: number;              // 0-100
}

export interface Court {
  leader: Leader;
  members: CourtMember[];
  succession: Succession;
}

// ==================== END LEADER & COURT TYPES ====================

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
  factions?: Faction[]; // Internal political entities

  // World Building Systems
  culture?: CulturalSystem;
  demographics?: Demographics;
  provinces?: Province[];
  trade?: TradeNetwork;
  seasonalEffects?: SeasonalEffects;

  // Leader & Court System
  court?: Court;
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
