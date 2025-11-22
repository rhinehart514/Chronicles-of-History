// Culture groups and cultures system

export interface CultureGroup {
  id: string;
  name: string;
  cultures: Culture[];
  bonuses: CultureBonus[];
}

export interface Culture {
  id: string;
  name: string;
  nameList: string[];
  monarchNames: { male: string[]; female: string[] };
}

export interface CultureBonus {
  type: string;
  value: number;
  description: string;
}

// Culture groups and their cultures
export const CULTURE_GROUPS: CultureGroup[] = [
  {
    id: 'germanic',
    name: 'Germanic',
    cultures: [
      {
        id: 'austrian',
        name: 'Austrian',
        nameList: ['Wien', 'Graz', 'Salzburg', 'Innsbruck'],
        monarchNames: {
          male: ['Friedrich', 'Leopold', 'Maximilian', 'Ferdinand', 'Karl'],
          female: ['Maria', 'Elisabeth', 'Anna', 'Margarethe']
        }
      },
      {
        id: 'bavarian',
        name: 'Bavarian',
        nameList: ['München', 'Augsburg', 'Nürnberg', 'Regensburg'],
        monarchNames: {
          male: ['Ludwig', 'Albrecht', 'Wilhelm', 'Otto'],
          female: ['Hedwig', 'Anna', 'Maria']
        }
      },
      {
        id: 'saxon',
        name: 'Saxon',
        nameList: ['Dresden', 'Leipzig', 'Meissen'],
        monarchNames: {
          male: ['Friedrich', 'August', 'Johann', 'Moritz'],
          female: ['Elisabeth', 'Sophia', 'Charlotte']
        }
      },
      {
        id: 'prussian',
        name: 'Prussian',
        nameList: ['Berlin', 'Königsberg', 'Brandenburg'],
        monarchNames: {
          male: ['Friedrich', 'Wilhelm', 'Albrecht'],
          female: ['Sophie', 'Charlotte', 'Luise']
        }
      }
    ],
    bonuses: [
      { type: 'infantry_combat', value: 10, description: '+10% Infantry combat ability' },
      { type: 'discipline', value: 5, description: '+5% Discipline' }
    ]
  },
  {
    id: 'latin',
    name: 'Latin',
    cultures: [
      {
        id: 'lombard',
        name: 'Lombard',
        nameList: ['Milano', 'Brescia', 'Bergamo', 'Mantova'],
        monarchNames: {
          male: ['Galeazzo', 'Ludovico', 'Francesco'],
          female: ['Bianca', 'Isabella', 'Beatrice']
        }
      },
      {
        id: 'tuscan',
        name: 'Tuscan',
        nameList: ['Firenze', 'Siena', 'Pisa', 'Lucca'],
        monarchNames: {
          male: ['Lorenzo', 'Cosimo', 'Giovanni', 'Piero'],
          female: ['Lucrezia', 'Caterina', 'Maria']
        }
      },
      {
        id: 'neapolitan',
        name: 'Neapolitan',
        nameList: ['Napoli', 'Bari', 'Salerno', 'Taranto'],
        monarchNames: {
          male: ['Alfonso', 'Ferrante', 'Federico'],
          female: ['Giovanna', 'Isabella', 'Maria']
        }
      }
    ],
    bonuses: [
      { type: 'trade_efficiency', value: 10, description: '+10% Trade efficiency' },
      { type: 'build_cost', value: -10, description: '-10% Build cost' }
    ]
  },
  {
    id: 'french',
    name: 'French',
    cultures: [
      {
        id: 'francien',
        name: 'Francien',
        nameList: ['Paris', 'Orléans', 'Tours', 'Chartres'],
        monarchNames: {
          male: ['Louis', 'Charles', 'François', 'Henri'],
          female: ['Marie', 'Anne', 'Jeanne', 'Catherine']
        }
      },
      {
        id: 'occitan',
        name: 'Occitan',
        nameList: ['Toulouse', 'Montpellier', 'Nîmes'],
        monarchNames: {
          male: ['Raimond', 'Guillaume', 'Bernard'],
          female: ['Jeanne', 'Blanche', 'Éléonore']
        }
      },
      {
        id: 'breton',
        name: 'Breton',
        nameList: ['Rennes', 'Nantes', 'Brest'],
        monarchNames: {
          male: ['Jean', 'François', 'Arthur'],
          female: ['Anne', 'Jeanne', 'Marie']
        }
      }
    ],
    bonuses: [
      { type: 'diplomatic_reputation', value: 1, description: '+1 Diplomatic reputation' },
      { type: 'fort_defense', value: 10, description: '+10% Fort defense' }
    ]
  },
  {
    id: 'british',
    name: 'British',
    cultures: [
      {
        id: 'english',
        name: 'English',
        nameList: ['London', 'York', 'Bristol', 'Norwich'],
        monarchNames: {
          male: ['Henry', 'Edward', 'Richard', 'William', 'George'],
          female: ['Elizabeth', 'Mary', 'Anne', 'Margaret']
        }
      },
      {
        id: 'scottish',
        name: 'Scottish',
        nameList: ['Edinburgh', 'Glasgow', 'Aberdeen', 'Stirling'],
        monarchNames: {
          male: ['James', 'Robert', 'David', 'Malcolm'],
          female: ['Mary', 'Margaret', 'Elizabeth']
        }
      },
      {
        id: 'welsh',
        name: 'Welsh',
        nameList: ['Cardiff', 'Swansea', 'Caernarfon'],
        monarchNames: {
          male: ['Llywelyn', 'Owain', 'Dafydd'],
          female: ['Gwenllian', 'Joan', 'Eleanor']
        }
      }
    ],
    bonuses: [
      { type: 'naval_forcelimit', value: 20, description: '+20% Naval force limit' },
      { type: 'global_tariffs', value: 10, description: '+10% Global tariffs' }
    ]
  },
  {
    id: 'iberian',
    name: 'Iberian',
    cultures: [
      {
        id: 'castilian',
        name: 'Castilian',
        nameList: ['Madrid', 'Toledo', 'Valladolid', 'Burgos'],
        monarchNames: {
          male: ['Fernando', 'Alfonso', 'Juan', 'Felipe', 'Carlos'],
          female: ['Isabel', 'Juana', 'María', 'Catalina']
        }
      },
      {
        id: 'catalan',
        name: 'Catalan',
        nameList: ['Barcelona', 'Valencia', 'Tarragona'],
        monarchNames: {
          male: ['Pere', 'Jaume', 'Martí', 'Alfons'],
          female: ['Maria', 'Joana', 'Elionor']
        }
      },
      {
        id: 'portuguese',
        name: 'Portuguese',
        nameList: ['Lisboa', 'Porto', 'Coimbra', 'Faro'],
        monarchNames: {
          male: ['João', 'Manuel', 'Afonso', 'Sebastião'],
          female: ['Maria', 'Isabel', 'Catarina']
        }
      }
    ],
    bonuses: [
      { type: 'colonists', value: 1, description: '+1 Colonist' },
      { type: 'global_settler_increase', value: 10, description: '+10 Global settler increase' }
    ]
  },
  {
    id: 'east_slavic',
    name: 'East Slavic',
    cultures: [
      {
        id: 'muscovite',
        name: 'Muscovite',
        nameList: ['Moskva', 'Novgorod', 'Tver', 'Vladimir'],
        monarchNames: {
          male: ['Ivan', 'Vasily', 'Dmitry', 'Boris'],
          female: ['Sofia', 'Elena', 'Maria', 'Anastasia']
        }
      },
      {
        id: 'ruthenian',
        name: 'Ruthenian',
        nameList: ['Kyiv', 'Lviv', 'Chernihiv'],
        monarchNames: {
          male: ['Volodymyr', 'Yaroslav', 'Sviatoslav'],
          female: ['Olga', 'Anna', 'Maria']
        }
      }
    ],
    bonuses: [
      { type: 'manpower_recovery', value: 10, description: '+10% Manpower recovery' },
      { type: 'cavalry_combat', value: 10, description: '+10% Cavalry combat ability' }
    ]
  },
  {
    id: 'turko_semitic',
    name: 'Turko-Semitic',
    cultures: [
      {
        id: 'turkish',
        name: 'Turkish',
        nameList: ['Konstantiniyye', 'Edirne', 'Bursa', 'Ankara'],
        monarchNames: {
          male: ['Mehmed', 'Bayezid', 'Selim', 'Suleiman', 'Murad'],
          female: ['Hatice', 'Hafsa', 'Mahidevran', 'Hurrem']
        }
      },
      {
        id: 'arabic',
        name: 'Arabic',
        nameList: ['Al-Qahira', 'Dimashq', 'Baghdad', 'Makkah'],
        monarchNames: {
          male: ['Muhammad', 'Ahmad', 'Ali', 'Hassan', 'Khalid'],
          female: ['Fatima', 'Aisha', 'Khadija', 'Zaynab']
        }
      }
    ],
    bonuses: [
      { type: 'core_creation', value: -15, description: '-15% Core creation cost' },
      { type: 'religious_unity', value: 10, description: '+10% Religious unity' }
    ]
  }
];

// Get culture group by culture id
export function getCultureGroup(cultureId: string): CultureGroup | undefined {
  return CULTURE_GROUPS.find(group =>
    group.cultures.some(c => c.id === cultureId)
  );
}

// Get culture by id
export function getCulture(cultureId: string): Culture | undefined {
  for (const group of CULTURE_GROUPS) {
    const culture = group.cultures.find(c => c.id === cultureId);
    if (culture) return culture;
  }
  return undefined;
}

// Check if two cultures are in the same group
export function areCulturesRelated(culture1: string, culture2: string): boolean {
  const group1 = getCultureGroup(culture1);
  const group2 = getCultureGroup(culture2);
  return group1 !== undefined && group1 === group2;
}

// Get random monarch name
export function getRandomMonarchName(
  cultureId: string,
  gender: 'male' | 'female'
): string {
  const culture = getCulture(cultureId);
  if (!culture) return gender === 'male' ? 'Unknown' : 'Unknown';

  const names = culture.monarchNames[gender];
  return names[Math.floor(Math.random() * names.length)];
}

export default {
  CULTURE_GROUPS,
  getCultureGroup,
  getCulture,
  areCulturesRelated,
  getRandomMonarchName
};
