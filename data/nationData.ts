// Nation definitions and starting data

export interface Nation {
  id: string;
  name: string;
  adjective: string;
  flag: string;
  color: string;
  government: string;
  religion: string;
  primaryCulture: string;
  acceptedCultures: string[];
  capital: string;
  techGroup: string;
  historicalRivals: string[];
  historicalFriends: string[];
  ideas: string[];
  rulerTitle: string;
}

export interface Ruler {
  name: string;
  dynasty: string;
  birthDate: string;
  stats: { adm: number; dip: number; mil: number };
  traits: string[];
}

export interface StartingData {
  nationId: string;
  treasury: number;
  manpower: number;
  stability: number;
  prestige: number;
  legitimacy: number;
  provinces: string[];
  cores: string[];
  allies: string[];
  vassals: string[];
  royalMarriages: string[];
  ruler: Ruler;
  heir?: Ruler;
}

// Major nations
export const NATIONS: Nation[] = [
  {
    id: 'FRA',
    name: 'France',
    adjective: 'French',
    flag: '🇫🇷',
    color: '#2E5EAA',
    government: 'feudal_monarchy',
    religion: 'catholic',
    primaryCulture: 'francien',
    acceptedCultures: ['occitan', 'breton', 'gascon'],
    capital: 'paris',
    techGroup: 'western',
    historicalRivals: ['ENG', 'HAB', 'SPA'],
    historicalFriends: ['SCO'],
    ideas: ['french_ideas'],
    rulerTitle: 'King'
  },
  {
    id: 'ENG',
    name: 'England',
    adjective: 'English',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    color: '#C73E3A',
    government: 'feudal_monarchy',
    religion: 'catholic',
    primaryCulture: 'english',
    acceptedCultures: ['welsh'],
    capital: 'london',
    techGroup: 'western',
    historicalRivals: ['FRA', 'SCO'],
    historicalFriends: ['POR', 'BUR'],
    ideas: ['english_ideas'],
    rulerTitle: 'King'
  },
  {
    id: 'CAS',
    name: 'Castile',
    adjective: 'Castilian',
    flag: '🇪🇸',
    color: '#FAF000',
    government: 'feudal_monarchy',
    religion: 'catholic',
    primaryCulture: 'castilian',
    acceptedCultures: ['leonese'],
    capital: 'toledo',
    techGroup: 'western',
    historicalRivals: ['GRA', 'MOR'],
    historicalFriends: ['ARA', 'POR'],
    ideas: ['castilian_ideas'],
    rulerTitle: 'King'
  },
  {
    id: 'HAB',
    name: 'Austria',
    adjective: 'Austrian',
    flag: '🇦🇹',
    color: '#FFFFFF',
    government: 'feudal_monarchy',
    religion: 'catholic',
    primaryCulture: 'austrian',
    acceptedCultures: [],
    capital: 'wien',
    techGroup: 'western',
    historicalRivals: ['FRA', 'TUR', 'PRU'],
    historicalFriends: ['SPA'],
    ideas: ['austrian_ideas'],
    rulerTitle: 'Archduke'
  },
  {
    id: 'TUR',
    name: 'Ottomans',
    adjective: 'Ottoman',
    flag: '🇹🇷',
    color: '#5E8C31',
    government: 'ottoman_government',
    religion: 'sunni',
    primaryCulture: 'turkish',
    acceptedCultures: [],
    capital: 'edirne',
    techGroup: 'anatolian',
    historicalRivals: ['VEN', 'HAB', 'PER'],
    historicalFriends: [],
    ideas: ['ottoman_ideas'],
    rulerTitle: 'Sultan'
  },
  {
    id: 'MOS',
    name: 'Muscovy',
    adjective: 'Muscovite',
    flag: '🇷🇺',
    color: '#568203',
    government: 'russian_principality',
    religion: 'orthodox',
    primaryCulture: 'muscovite',
    acceptedCultures: ['novgorodian', 'ryazanian'],
    capital: 'moskva',
    techGroup: 'eastern',
    historicalRivals: ['LIT', 'NOV', 'KAZ'],
    historicalFriends: [],
    ideas: ['russian_ideas'],
    rulerTitle: 'Grand Prince'
  },
  {
    id: 'BYZ',
    name: 'Byzantium',
    adjective: 'Byzantine',
    flag: '☦️',
    color: '#6B1B6B',
    government: 'despotic_monarchy',
    religion: 'orthodox',
    primaryCulture: 'greek',
    acceptedCultures: [],
    capital: 'constantinople',
    techGroup: 'eastern',
    historicalRivals: ['TUR', 'VEN'],
    historicalFriends: [],
    ideas: ['byzantine_ideas'],
    rulerTitle: 'Basileus'
  },
  {
    id: 'VEN',
    name: 'Venice',
    adjective: 'Venetian',
    flag: '🦁',
    color: '#009E8C',
    government: 'merchant_republic',
    religion: 'catholic',
    primaryCulture: 'venetian',
    acceptedCultures: [],
    capital: 'venezia',
    techGroup: 'western',
    historicalRivals: ['TUR', 'GEN'],
    historicalFriends: [],
    ideas: ['venetian_ideas'],
    rulerTitle: 'Doge'
  },
  {
    id: 'POR',
    name: 'Portugal',
    adjective: 'Portuguese',
    flag: '🇵🇹',
    color: '#00943E',
    government: 'feudal_monarchy',
    religion: 'catholic',
    primaryCulture: 'portugese',
    acceptedCultures: [],
    capital: 'lisboa',
    techGroup: 'western',
    historicalRivals: ['MOR', 'CAS'],
    historicalFriends: ['ENG'],
    ideas: ['portuguese_ideas'],
    rulerTitle: 'King'
  },
  {
    id: 'POL',
    name: 'Poland',
    adjective: 'Polish',
    flag: '🇵🇱',
    color: '#A12D4A',
    government: 'elective_monarchy',
    religion: 'catholic',
    primaryCulture: 'polish',
    acceptedCultures: [],
    capital: 'krakow',
    techGroup: 'eastern',
    historicalRivals: ['TEU', 'MOS'],
    historicalFriends: ['LIT'],
    ideas: ['polish_ideas'],
    rulerTitle: 'King'
  }
];

// 1444 starting data
export const STARTING_DATA_1444: StartingData[] = [
  {
    nationId: 'FRA',
    treasury: 200,
    manpower: 30000,
    stability: 0,
    prestige: 20,
    legitimacy: 100,
    provinces: ['paris', 'champagne', 'orleanais', 'berry', 'bourbonnais'],
    cores: ['paris', 'champagne', 'orleanais', 'berry', 'bourbonnais', 'normandie'],
    allies: ['SCO'],
    vassals: ['PRO', 'ORL', 'BOU'],
    royalMarriages: ['SCO'],
    ruler: {
      name: 'Charles VII',
      dynasty: 'de Valois',
      birthDate: '1403-02-22',
      stats: { adm: 4, dip: 5, mil: 4 },
      traits: ['just']
    },
    heir: {
      name: 'Louis',
      dynasty: 'de Valois',
      birthDate: '1423-07-03',
      stats: { adm: 5, dip: 5, mil: 3 },
      traits: ['ambitious']
    }
  },
  {
    nationId: 'ENG',
    treasury: 250,
    manpower: 20000,
    stability: -1,
    prestige: 30,
    legitimacy: 90,
    provinces: ['london', 'kent', 'essex', 'oxford', 'gloucester'],
    cores: ['london', 'kent', 'essex', 'oxford', 'gloucester', 'normandie', 'maine'],
    allies: ['BUR'],
    vassals: [],
    royalMarriages: ['BUR'],
    ruler: {
      name: 'Henry VI',
      dynasty: 'Lancaster',
      birthDate: '1421-12-06',
      stats: { adm: 1, dip: 1, mil: 1 },
      traits: ['naive', 'pious']
    }
  },
  {
    nationId: 'TUR',
    treasury: 300,
    manpower: 35000,
    stability: 1,
    prestige: 50,
    legitimacy: 100,
    provinces: ['edirne', 'bursa', 'ankara', 'konya'],
    cores: ['edirne', 'bursa', 'ankara', 'konya', 'constantinople'],
    allies: [],
    vassals: ['SER', 'ATH'],
    royalMarriages: [],
    ruler: {
      name: 'Murad II',
      dynasty: 'Ottoman',
      birthDate: '1404-06-01',
      stats: { adm: 4, dip: 3, mil: 5 },
      traits: ['bold', 'conqueror']
    },
    heir: {
      name: 'Mehmed',
      dynasty: 'Ottoman',
      birthDate: '1432-03-30',
      stats: { adm: 6, dip: 5, mil: 6 },
      traits: ['conqueror']
    }
  }
];

// Helper functions
export function getNation(id: string): Nation | undefined {
  return NATIONS.find(n => n.id === id);
}

export function getNationsByReligion(religion: string): Nation[] {
  return NATIONS.filter(n => n.religion === religion);
}

export function getNationsByTechGroup(techGroup: string): Nation[] {
  return NATIONS.filter(n => n.techGroup === techGroup);
}

export function getStartingData(nationId: string): StartingData | undefined {
  return STARTING_DATA_1444.find(s => s.nationId === nationId);
}

export function isHistoricalRival(nation1: string, nation2: string): boolean {
  const n1 = getNation(nation1);
  return n1?.historicalRivals.includes(nation2) || false;
}

export function isHistoricalFriend(nation1: string, nation2: string): boolean {
  const n1 = getNation(nation1);
  return n1?.historicalFriends.includes(nation2) || false;
}

export default {
  NATIONS,
  STARTING_DATA_1444,
  getNation,
  getNationsByReligion,
  getNationsByTechGroup,
  getStartingData,
  isHistoricalRival,
  isHistoricalFriend
};
