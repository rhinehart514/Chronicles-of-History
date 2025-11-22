// Shared type definitions for Chronicles of History

// Basic game types
export type ResourceType = 'gold' | 'manpower' | 'sailors' | 'adminPower' | 'dipPower' | 'milPower';
export type MapMode = 'political' | 'terrain' | 'trade' | 'religion' | 'culture' | 'development' | 'diplomatic';
export type GameSpeed = 0 | 1 | 2 | 3 | 4 | 5;

// Government types
export type GovernmentType =
  | 'monarchy'
  | 'republic'
  | 'theocracy'
  | 'tribal'
  | 'steppe_horde';

export type GovernmentRank = 1 | 2 | 3; // Duchy, Kingdom, Empire

// Religion types
export type ReligionGroup = 'christian' | 'muslim' | 'eastern' | 'dharmic' | 'pagan';

// Technology groups
export type TechGroup =
  | 'western'
  | 'eastern'
  | 'anatolian'
  | 'muslim'
  | 'indian'
  | 'chinese'
  | 'nomad_group'
  | 'sub_saharan'
  | 'mesoamerican'
  | 'andean';

// Terrain types
export type TerrainType =
  | 'plains'
  | 'farmlands'
  | 'forest'
  | 'hills'
  | 'mountains'
  | 'marsh'
  | 'desert'
  | 'jungle'
  | 'steppe'
  | 'coastline'
  | 'highlands'
  | 'woods'
  | 'glacier'
  | 'drylands';

// Trade goods
export type TradeGood =
  | 'grain'
  | 'wine'
  | 'wool'
  | 'cloth'
  | 'fish'
  | 'fur'
  | 'salt'
  | 'iron'
  | 'copper'
  | 'gold'
  | 'ivory'
  | 'slaves'
  | 'spices'
  | 'silk'
  | 'gems'
  | 'sugar'
  | 'tobacco'
  | 'coffee'
  | 'cotton'
  | 'dyes'
  | 'naval_supplies'
  | 'paper'
  | 'glass'
  | 'chinaware';

// Unit types
export type UnitType = 'infantry' | 'cavalry' | 'artillery';
export type NavalUnitType = 'heavy_ship' | 'light_ship' | 'galley' | 'transport';

// Diplomatic relations
export type DiplomaticRelationType =
  | 'alliance'
  | 'royal_marriage'
  | 'guarantee'
  | 'military_access'
  | 'warning'
  | 'rivalry'
  | 'coalition'
  | 'truce'
  | 'vassal'
  | 'personal_union'
  | 'tributary';

// War-related types
export type WarGoal =
  | 'conquest'
  | 'superiority'
  | 'take_capital'
  | 'defend_capital'
  | 'humiliate'
  | 'religious'
  | 'trade_war'
  | 'independence';

export type CasusBelli =
  | 'reconquest'
  | 'holy_war'
  | 'imperialism'
  | 'restoration_of_union'
  | 'claim_throne'
  | 'trade_dispute'
  | 'tribal_conquest'
  | 'colonial_conquest';

// Idea groups
export type IdeaGroupCategory = 'administrative' | 'diplomatic' | 'military';

// Building types
export type BuildingType =
  | 'temple'
  | 'workshop'
  | 'courthouse'
  | 'barracks'
  | 'shipyard'
  | 'fort'
  | 'marketplace'
  | 'university'
  | 'manufactory'
  | 'trade_depot'
  | 'dock'
  | 'regimental_camp';

// Advisor types
export type AdvisorType =
  | 'philosopher'
  | 'natural_scientist'
  | 'artist'
  | 'statesman'
  | 'trader'
  | 'spymaster'
  | 'army_reformer'
  | 'commandant'
  | 'quartermaster'
  | 'theologian'
  | 'inquisitor'
  | 'colonial_governor'
  | 'diplomat'
  | 'naval_reformer'
  | 'grand_captain';

// Modifier interface
export interface Modifier {
  id: string;
  name: string;
  duration?: number; // -1 for permanent
  effects: Record<string, number>;
}

// Leader/Ruler interface
export interface Ruler {
  name: string;
  dynasty?: string;
  adm: number;
  dip: number;
  mil: number;
  birthDate?: string;
  traits?: string[];
}

// Army/Navy unit
export interface MilitaryUnit {
  id: string;
  name: string;
  type: UnitType | NavalUnitType;
  strength: number;
  maxStrength: number;
  morale: number;
  maxMorale: number;
  location: string;
  leader?: string;
}

// Event interface
export interface GameEvent {
  id: string;
  title: string;
  description: string;
  triggeredDate?: string;
  options: EventOption[];
  isTriggered?: boolean;
}

export interface EventOption {
  id: string;
  text: string;
  effects: Record<string, number>;
  aiWeight?: number;
}

// Mission interface
export interface Mission {
  id: string;
  name: string;
  description: string;
  icon: string;
  prerequisites: string[];
  conditions: MissionCondition[];
  rewards: Record<string, number>;
  completed: boolean;
}

export interface MissionCondition {
  type: string;
  target: string | number;
  current?: string | number;
}

// Trade node
export interface TradeNode {
  id: string;
  name: string;
  location: string;
  value: number;
  incoming: string[];
  outgoing: string[];
}

// Coordinate for map
export interface Coordinate {
  x: number;
  y: number;
}

// Color for rendering
export interface Color {
  r: number;
  g: number;
  b: number;
}
