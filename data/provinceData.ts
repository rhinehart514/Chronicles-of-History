// Province and region data for the game map

export interface Province {
  id: string;
  name: string;
  region: string;
  continent: string;
  terrain: string;
  climate: string;
  development: {
    tax: number;
    production: number;
    manpower: number;
  };
  tradeGood: string;
  religion: string;
  culture: string;
  owner?: string;
  controller?: string;
  cores: string[];
  isCoastal: boolean;
  hasPort: boolean;
  fortLevel: number;
  buildings: string[];
  modifiers: string[];
}

export interface Region {
  id: string;
  name: string;
  superRegion: string;
  provinces: string[];
  tradeNode: string;
}

export interface Continent {
  id: string;
  name: string;
  regions: string[];
}

// Sample provinces (would be much larger in real game)
export const PROVINCES: Province[] = [
  // Western Europe
  {
    id: 'paris',
    name: 'Paris',
    region: 'ile_de_france',
    continent: 'europe',
    terrain: 'farmlands',
    climate: 'temperate',
    development: { tax: 10, production: 10, manpower: 8 },
    tradeGood: 'cloth',
    religion: 'catholic',
    culture: 'francien',
    owner: 'FRA',
    controller: 'FRA',
    cores: ['FRA'],
    isCoastal: false,
    hasPort: false,
    fortLevel: 3,
    buildings: ['cathedral', 'university'],
    modifiers: ['center_of_trade']
  },
  {
    id: 'london',
    name: 'London',
    region: 'home_counties',
    continent: 'europe',
    terrain: 'farmlands',
    climate: 'temperate',
    development: { tax: 9, production: 9, manpower: 7 },
    tradeGood: 'cloth',
    religion: 'catholic',
    culture: 'english',
    owner: 'ENG',
    controller: 'ENG',
    cores: ['ENG'],
    isCoastal: true,
    hasPort: true,
    fortLevel: 2,
    buildings: ['marketplace', 'temple'],
    modifiers: ['center_of_trade', 'estuary']
  },
  {
    id: 'rome',
    name: 'Roma',
    region: 'lazio',
    continent: 'europe',
    terrain: 'hills',
    climate: 'temperate',
    development: { tax: 8, production: 6, manpower: 5 },
    tradeGood: 'paper',
    religion: 'catholic',
    culture: 'umbrian',
    owner: 'PAP',
    controller: 'PAP',
    cores: ['PAP'],
    isCoastal: true,
    hasPort: true,
    fortLevel: 2,
    buildings: ['cathedral'],
    modifiers: ['religious_center']
  },
  {
    id: 'wien',
    name: 'Wien',
    region: 'austria_proper',
    continent: 'europe',
    terrain: 'hills',
    climate: 'temperate',
    development: { tax: 7, production: 7, manpower: 6 },
    tradeGood: 'cloth',
    religion: 'catholic',
    culture: 'austrian',
    owner: 'HAB',
    controller: 'HAB',
    cores: ['HAB'],
    isCoastal: false,
    hasPort: false,
    fortLevel: 3,
    buildings: ['castle', 'marketplace'],
    modifiers: []
  },
  {
    id: 'constantinople',
    name: 'Constantinople',
    region: 'thrace',
    continent: 'europe',
    terrain: 'farmlands',
    climate: 'temperate',
    development: { tax: 10, production: 10, manpower: 8 },
    tradeGood: 'cloth',
    religion: 'orthodox',
    culture: 'greek',
    owner: 'BYZ',
    controller: 'BYZ',
    cores: ['BYZ'],
    isCoastal: true,
    hasPort: true,
    fortLevel: 4,
    buildings: ['cathedral', 'marketplace', 'shipyard'],
    modifiers: ['center_of_trade', 'bosphorus_crossing']
  },
  {
    id: 'moscow',
    name: 'Moskva',
    region: 'moscow',
    continent: 'europe',
    terrain: 'forest',
    climate: 'temperate',
    development: { tax: 6, production: 5, manpower: 7 },
    tradeGood: 'fur',
    religion: 'orthodox',
    culture: 'muscovite',
    owner: 'MOS',
    controller: 'MOS',
    cores: ['MOS'],
    isCoastal: false,
    hasPort: false,
    fortLevel: 2,
    buildings: ['temple'],
    modifiers: []
  },
  // Add more provinces...
];

// Regions
export const REGIONS: Region[] = [
  {
    id: 'ile_de_france',
    name: 'Île-de-France',
    superRegion: 'france',
    provinces: ['paris', 'champagne', 'orleanais'],
    tradeNode: 'champagne'
  },
  {
    id: 'home_counties',
    name: 'Home Counties',
    superRegion: 'british_isles',
    provinces: ['london', 'kent', 'essex'],
    tradeNode: 'english_channel'
  },
  {
    id: 'lazio',
    name: 'Lazio',
    superRegion: 'italy',
    provinces: ['rome', 'ancona'],
    tradeNode: 'genoa'
  },
  {
    id: 'austria_proper',
    name: 'Austria Proper',
    superRegion: 'south_germany',
    provinces: ['wien', 'steiermark', 'tirol'],
    tradeNode: 'wien'
  },
  {
    id: 'thrace',
    name: 'Thrace',
    superRegion: 'balkans',
    provinces: ['constantinople', 'edirne', 'kirkkilise'],
    tradeNode: 'constantinople'
  },
  {
    id: 'moscow',
    name: 'Moscow',
    superRegion: 'russia',
    provinces: ['moskva', 'vladimir', 'ryazan'],
    tradeNode: 'novgorod'
  }
];

// Continents
export const CONTINENTS: Continent[] = [
  {
    id: 'europe',
    name: 'Europe',
    regions: ['ile_de_france', 'home_counties', 'lazio', 'austria_proper', 'thrace', 'moscow']
  },
  {
    id: 'asia',
    name: 'Asia',
    regions: ['anatolia', 'persia', 'india', 'china', 'japan']
  },
  {
    id: 'africa',
    name: 'Africa',
    regions: ['maghreb', 'egypt', 'sahel', 'horn', 'central_africa', 'south_africa']
  },
  {
    id: 'north_america',
    name: 'North America',
    regions: ['eastern_america', 'great_lakes', 'mississippi', 'great_plains', 'california']
  },
  {
    id: 'south_america',
    name: 'South America',
    regions: ['colombia', 'peru', 'brazil', 'la_plata']
  },
  {
    id: 'oceania',
    name: 'Oceania',
    regions: ['australia', 'indonesia', 'polynesia']
  }
];

// Helper functions
export function getProvince(id: string): Province | undefined {
  return PROVINCES.find(p => p.id === id);
}

export function getProvincesByOwner(owner: string): Province[] {
  return PROVINCES.filter(p => p.owner === owner);
}

export function getProvincesByRegion(region: string): Province[] {
  return PROVINCES.filter(p => p.region === region);
}

export function getRegion(id: string): Region | undefined {
  return REGIONS.find(r => r.id === id);
}

export function getContinent(id: string): Continent | undefined {
  return CONTINENTS.find(c => c.id === id);
}

export function calculateProvinceDevelopment(province: Province): number {
  return province.development.tax + province.development.production + province.development.manpower;
}

export function getProvincesByTradeGood(good: string): Province[] {
  return PROVINCES.filter(p => p.tradeGood === good);
}

export function getCoastalProvinces(): Province[] {
  return PROVINCES.filter(p => p.isCoastal);
}

export default {
  PROVINCES,
  REGIONS,
  CONTINENTS,
  getProvince,
  getProvincesByOwner,
  getProvincesByRegion,
  getRegion,
  getContinent,
  calculateProvinceDevelopment,
  getProvincesByTradeGood,
  getCoastalProvinces
};
