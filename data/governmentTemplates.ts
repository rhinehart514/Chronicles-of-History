import { GovernmentStructure, GovernmentType, Era, EraInfo } from '../types';

// ==================== GOVERNMENT TEMPLATES ====================

export const GOVERNMENT_TEMPLATES: Record<GovernmentType, GovernmentStructure> = {
  ABSOLUTE_MONARCHY: {
    type: 'ABSOLUTE_MONARCHY',
    leaderTitle: 'King',
    cabinetTitle: 'Royal Court',
    roleNames: {
      CHANCELLOR: 'Grand Chancellor',
      TREASURER: 'Lord Treasurer',
      GENERAL: 'Field Marshal',
      ADMIRAL: 'Lord High Admiral',
      SPYMASTER: 'Spymaster',
      DIPLOMAT: 'Foreign Secretary',
      HEIR: 'Crown Prince'
    },
    successionType: 'PRIMOGENITURE',
    canBeOverthrown: true,
    revolutionRisk: 30
  },

  CONSTITUTIONAL_MONARCHY: {
    type: 'CONSTITUTIONAL_MONARCHY',
    leaderTitle: 'King',
    legislatureTitle: 'Parliament',
    cabinetTitle: 'Cabinet',
    roleNames: {
      CHANCELLOR: 'Prime Minister',
      TREASURER: 'Chancellor of the Exchequer',
      GENERAL: 'Chief of the Imperial General Staff',
      ADMIRAL: 'First Lord of the Admiralty',
      SPYMASTER: 'Director of Intelligence',
      DIPLOMAT: 'Foreign Secretary',
      HEIR: 'Crown Prince'
    },
    successionType: 'PRIMOGENITURE',
    canBeOverthrown: true,
    revolutionRisk: 15
  },

  REPUBLIC: {
    type: 'REPUBLIC',
    leaderTitle: 'President',
    legislatureTitle: 'National Assembly',
    cabinetTitle: 'Cabinet',
    roleNames: {
      CHANCELLOR: 'Prime Minister',
      TREASURER: 'Finance Minister',
      GENERAL: 'Chief of Staff',
      ADMIRAL: 'Navy Minister',
      SPYMASTER: 'Intelligence Director',
      DIPLOMAT: 'Foreign Minister',
      HEIR: 'Vice President'
    },
    successionType: 'ELECTIVE',
    termLength: 4,
    canBeOverthrown: true,
    revolutionRisk: 20
  },

  FEDERAL_REPUBLIC: {
    type: 'FEDERAL_REPUBLIC',
    leaderTitle: 'President',
    legislatureTitle: 'Congress',
    cabinetTitle: 'Cabinet',
    roleNames: {
      CHANCELLOR: 'Secretary of State',
      TREASURER: 'Secretary of the Treasury',
      GENERAL: 'Chairman of Joint Chiefs',
      ADMIRAL: 'Secretary of the Navy',
      SPYMASTER: 'Director of Central Intelligence',
      DIPLOMAT: 'Secretary of State',
      HEIR: 'Vice President'
    },
    successionType: 'ELECTIVE',
    termLength: 4,
    canBeOverthrown: false,
    revolutionRisk: 5
  },

  EMPIRE: {
    type: 'EMPIRE',
    leaderTitle: 'Emperor',
    cabinetTitle: 'Imperial Court',
    roleNames: {
      CHANCELLOR: 'Grand Vizier',
      TREASURER: 'Imperial Treasurer',
      GENERAL: 'Supreme Commander',
      ADMIRAL: 'Grand Admiral',
      SPYMASTER: 'Imperial Spymaster',
      DIPLOMAT: 'Imperial Envoy',
      HEIR: 'Crown Prince'
    },
    successionType: 'AGNATIC',
    canBeOverthrown: true,
    revolutionRisk: 25
  },

  THEOCRACY: {
    type: 'THEOCRACY',
    leaderTitle: 'Supreme Leader',
    legislatureTitle: 'Council of Guardians',
    cabinetTitle: 'Supreme Council',
    roleNames: {
      CHANCELLOR: 'Prime Minister',
      TREASURER: 'Guardian of the Treasury',
      GENERAL: 'Commander of the Faithful',
      ADMIRAL: 'Naval Commander',
      SPYMASTER: 'Guardian of Secrets',
      DIPLOMAT: 'Ambassador of the Faith',
      HEIR: 'Designated Successor'
    },
    successionType: 'ELECTIVE',
    canBeOverthrown: true,
    revolutionRisk: 35
  },

  OLIGARCHY: {
    type: 'OLIGARCHY',
    leaderTitle: 'First Citizen',
    legislatureTitle: 'Council of Nobles',
    cabinetTitle: 'Inner Council',
    roleNames: {
      CHANCELLOR: 'Chief Minister',
      TREASURER: 'Banker',
      GENERAL: 'Captain-General',
      ADMIRAL: 'Admiral of the Fleet',
      SPYMASTER: 'Master of Whispers',
      DIPLOMAT: 'Ambassador',
      HEIR: 'Heir Apparent'
    },
    successionType: 'ELECTIVE',
    canBeOverthrown: true,
    revolutionRisk: 40
  },

  MILITARY_JUNTA: {
    type: 'MILITARY_JUNTA',
    leaderTitle: 'Generalissimo',
    cabinetTitle: 'Military Council',
    roleNames: {
      CHANCELLOR: 'Chief of Government',
      TREASURER: 'Economic Minister',
      GENERAL: 'Army Commander',
      ADMIRAL: 'Navy Commander',
      SPYMASTER: 'Security Chief',
      DIPLOMAT: 'Foreign Minister',
      HEIR: 'Deputy Commander'
    },
    successionType: 'ABSOLUTE',
    canBeOverthrown: true,
    revolutionRisk: 50
  },

  COMMUNIST_STATE: {
    type: 'COMMUNIST_STATE',
    leaderTitle: 'General Secretary',
    legislatureTitle: 'Supreme Soviet',
    cabinetTitle: 'Politburo',
    roleNames: {
      CHANCELLOR: 'Premier',
      TREASURER: 'Minister of Finance',
      GENERAL: 'Marshal',
      ADMIRAL: 'Admiral of the Fleet',
      SPYMASTER: 'KGB Chairman',
      DIPLOMAT: 'Foreign Minister',
      HEIR: 'Deputy General Secretary'
    },
    successionType: 'ELECTIVE',
    canBeOverthrown: true,
    revolutionRisk: 30
  },

  FASCIST_STATE: {
    type: 'FASCIST_STATE',
    leaderTitle: 'Leader',
    legislatureTitle: 'Grand Council',
    cabinetTitle: 'Inner Circle',
    roleNames: {
      CHANCELLOR: 'Deputy Leader',
      TREASURER: 'Economic Minister',
      GENERAL: 'Supreme Commander',
      ADMIRAL: 'Grand Admiral',
      SPYMASTER: 'Security Chief',
      DIPLOMAT: 'Foreign Minister',
      HEIR: 'Designated Successor'
    },
    successionType: 'ABSOLUTE',
    canBeOverthrown: true,
    revolutionRisk: 45
  },

  COLONIAL: {
    type: 'COLONIAL',
    leaderTitle: 'Governor',
    legislatureTitle: 'Colonial Assembly',
    cabinetTitle: 'Colonial Council',
    roleNames: {
      CHANCELLOR: 'Lieutenant Governor',
      TREASURER: 'Colonial Treasurer',
      GENERAL: 'Commander of Forces',
      ADMIRAL: 'Naval Commander',
      SPYMASTER: 'Intelligence Officer',
      DIPLOMAT: 'Colonial Secretary',
      HEIR: 'Deputy Governor'
    },
    successionType: 'ABSOLUTE',
    canBeOverthrown: true,
    revolutionRisk: 60
  }
};

// ==================== ERA DEFINITIONS ====================

export const ERA_DEFINITIONS: EraInfo[] = [
  {
    era: 'EARLY_MODERN',
    startYear: 1500,
    endYear: 1750,
    characteristics: {
      warfare: 'Pike and shot, line infantry',
      economy: 'Mercantilism, guild system',
      communication: 'Couriers, printed pamphlets',
      transportation: 'Horse, sailing ships'
    },
    innovations: ['Printing press', 'Gunpowder weapons', 'Navigation', 'Joint-stock companies'],
    majorEvents: ['Protestant Reformation', 'Age of Exploration', 'Scientific Revolution']
  },
  {
    era: 'ENLIGHTENMENT',
    startYear: 1750,
    endYear: 1800,
    characteristics: {
      warfare: 'Professional armies, bayonet infantry',
      economy: 'Early capitalism, colonial trade',
      communication: 'Postal services, newspapers',
      transportation: 'Improved roads, canal systems'
    },
    innovations: ['Steam engine', 'Encyclopedias', 'Scientific method', 'Modern banking'],
    majorEvents: ['American Revolution', 'French Revolution', 'Industrial Revolution begins']
  },
  {
    era: 'REVOLUTIONARY',
    startYear: 1789,
    endYear: 1848,
    characteristics: {
      warfare: 'Mass conscription, Napoleonic tactics',
      economy: 'Factory system, early industry',
      communication: 'Newspapers, early telegraph',
      transportation: 'Early railways, steamships'
    },
    innovations: ['Steam locomotive', 'Telegraph', 'Vaccination', 'Cotton gin'],
    majorEvents: ['Napoleonic Wars', 'Latin American independence', 'Revolutions of 1848']
  },
  {
    era: 'INDUSTRIAL',
    startYear: 1800,
    endYear: 1900,
    characteristics: {
      warfare: 'Rifles, ironclads, artillery',
      economy: 'Industrial capitalism, urbanization',
      communication: 'Telegraph, mass newspapers',
      transportation: 'Railways, steamships'
    },
    innovations: ['Electricity', 'Telegraph', 'Photography', 'Steel production'],
    majorEvents: ['Crimean War', 'American Civil War', 'Unification of Germany/Italy']
  },
  {
    era: 'IMPERIAL',
    startYear: 1870,
    endYear: 1914,
    characteristics: {
      warfare: 'Machine guns, dreadnoughts, artillery',
      economy: 'High imperialism, global trade',
      communication: 'Telephone, radio experiments',
      transportation: 'Ocean liners, automobiles'
    },
    innovations: ['Automobile', 'Telephone', 'Radio', 'Airplane'],
    majorEvents: ['Scramble for Africa', 'Russo-Japanese War', 'Arms race']
  },
  {
    era: 'GREAT_WAR',
    startYear: 1914,
    endYear: 1918,
    characteristics: {
      warfare: 'Trench warfare, tanks, gas',
      economy: 'War economy, rationing',
      communication: 'Radio, propaganda',
      transportation: 'Trucks, early aircraft'
    },
    innovations: ['Tanks', 'Chemical weapons', 'Aircraft combat', 'Submarines'],
    majorEvents: ['World War I', 'Russian Revolution', 'Ottoman collapse']
  },
  {
    era: 'INTERWAR',
    startYear: 1918,
    endYear: 1939,
    characteristics: {
      warfare: 'Mechanization, air power theory',
      economy: 'Boom and bust, Great Depression',
      communication: 'Radio broadcasting, cinema',
      transportation: 'Mass automobiles, commercial aviation'
    },
    innovations: ['Radio broadcasting', 'Television', 'Penicillin', 'Jet engine'],
    majorEvents: ['Great Depression', 'Rise of fascism', 'Spanish Civil War']
  },
  {
    era: 'WORLD_WAR',
    startYear: 1939,
    endYear: 1945,
    characteristics: {
      warfare: 'Blitzkrieg, strategic bombing, carriers',
      economy: 'Total war economy',
      communication: 'Radio, radar, codebreaking',
      transportation: 'Mechanized armies, long-range aircraft'
    },
    innovations: ['Nuclear weapons', 'Radar', 'Jet aircraft', 'Computers'],
    majorEvents: ['World War II', 'Holocaust', 'Atomic bombings']
  },
  {
    era: 'COLD_WAR',
    startYear: 1945,
    endYear: 1991,
    characteristics: {
      warfare: 'Nuclear deterrence, proxy wars',
      economy: 'Superpower competition, welfare states',
      communication: 'Television, satellites',
      transportation: 'Jet travel, space exploration'
    },
    innovations: ['Nuclear power', 'Satellites', 'Computers', 'Internet'],
    majorEvents: ['Korean War', 'Vietnam War', 'Space Race', 'Fall of USSR']
  },
  {
    era: 'MODERN',
    startYear: 1991,
    endYear: 2100,
    characteristics: {
      warfare: 'Precision weapons, drones, cyber',
      economy: 'Globalization, digital economy',
      communication: 'Internet, smartphones',
      transportation: 'Global air travel, high-speed rail'
    },
    innovations: ['Internet', 'Smartphones', 'AI', 'Renewable energy'],
    majorEvents: ['War on Terror', 'Rise of China', 'Climate change']
  }
];

// Helper functions
export const getEraForYear = (year: number): Era => {
  // Go through in reverse to get most specific era
  for (let i = ERA_DEFINITIONS.length - 1; i >= 0; i--) {
    if (year >= ERA_DEFINITIONS[i].startYear) {
      return ERA_DEFINITIONS[i].era;
    }
  }
  return 'EARLY_MODERN';
};

export const getEraInfo = (era: Era): EraInfo | undefined => {
  return ERA_DEFINITIONS.find(e => e.era === era);
};

export const getGovernmentTemplate = (type: GovernmentType): GovernmentStructure => {
  return GOVERNMENT_TEMPLATES[type];
};

// Get role name based on government type
export const getRoleName = (
  role: keyof GovernmentStructure['roleNames'],
  government: GovernmentStructure
): string => {
  return government.roleNames[role];
};

// Initial government types for starting nations (1750)
export const INITIAL_GOVERNMENTS: Record<string, GovernmentType> = {
  britain: 'CONSTITUTIONAL_MONARCHY',
  france: 'ABSOLUTE_MONARCHY',
  prussia: 'ABSOLUTE_MONARCHY',
  russia: 'ABSOLUTE_MONARCHY',
  ottoman: 'EMPIRE',
  qing: 'EMPIRE',
  spain: 'ABSOLUTE_MONARCHY'
};

// Get initial government for a nation
export const getInitialGovernment = (nationId: string): GovernmentStructure => {
  const type = INITIAL_GOVERNMENTS[nationId] || 'ABSOLUTE_MONARCHY';
  return GOVERNMENT_TEMPLATES[type];
};
