import { Leader, CourtMember, Court } from '../types';

// ==================== BRITAIN ====================

const georgeII: Leader = {
  id: 'george_ii',
  name: 'George II',
  title: 'King of Great Britain',
  birthYear: 1683,
  deathYear: 1760,
  reignStart: 1727,
  personality: {
    traits: ['WARRIOR_KING', 'TRADITIONALIST'],
    temperament: 'AGGRESSIVE',
    priorities: ['MILITARY', 'STABILITY']
  },
  epithet: 'The Last Warrior King',
  historicalNote: 'The last British monarch to personally lead troops in battle at Dettingen (1743). More interested in Hanover than Britain.',
  portraitPrompt: 'King George II of Britain, elderly man in red coat with white wig, stern military bearing, 1750s portrait'
};

const britainCourt: CourtMember[] = [
  {
    id: 'henry_pelham',
    name: 'Henry Pelham',
    role: 'CHANCELLOR',
    birthYear: 1694,
    deathYear: 1754,
    competence: 4,
    loyalty: 85,
    traits: ['FRUGAL', 'MASTER_DIPLOMAT'],
    historicalNote: 'Prime Minister who reduced national debt and maintained peace. Brother of Duke of Newcastle.',
    isHistorical: true
  },
  {
    id: 'duke_cumberland',
    name: 'Prince William, Duke of Cumberland',
    role: 'GENERAL',
    birthYear: 1721,
    deathYear: 1765,
    competence: 3,
    loyalty: 95,
    traits: ['RUTHLESS', 'WARRIOR_KING'],
    faction: 'The Army',
    historicalNote: 'Son of George II. Crushed Jacobite rebellion at Culloden (1746). Known as "Butcher Cumberland".',
    isHistorical: true
  },
  {
    id: 'george_anson',
    name: 'George Anson, 1st Baron Anson',
    role: 'ADMIRAL',
    birthYear: 1697,
    deathYear: 1762,
    competence: 5,
    loyalty: 90,
    traits: ['BRILLIANT_STRATEGIST', 'REFORMER'],
    historicalNote: 'Circumnavigated the globe, reformed the Royal Navy. First Lord of the Admiralty.',
    isHistorical: true
  },
  {
    id: 'frederick_prince_wales',
    name: 'Frederick, Prince of Wales',
    role: 'HEIR',
    birthYear: 1707,
    deathYear: 1751, // Dies early!
    competence: 3,
    loyalty: 40, // Hated his father
    traits: ['PATRON_OF_ARTS', 'REFORMER'],
    faction: 'Opposition Whigs',
    historicalNote: 'Heir apparent who died before his father. Patron of arts, opposed his father politically.',
    isHistorical: true
  },
  {
    id: 'newcastle',
    name: 'Thomas Pelham-Holles, Duke of Newcastle',
    role: 'DIPLOMAT',
    birthYear: 1693,
    deathYear: 1768,
    competence: 4,
    loyalty: 80,
    traits: ['MASTER_DIPLOMAT', 'PARANOID'],
    historicalNote: 'Secretary of State. Master of patronage and political management.',
    isHistorical: true
  }
];

// ==================== FRANCE ====================

const louisXV: Leader = {
  id: 'louis_xv',
  name: 'Louis XV',
  title: 'King of France',
  birthYear: 1710,
  deathYear: 1774,
  reignStart: 1715,
  personality: {
    traits: ['PATRON_OF_ARTS', 'WEAK_WILLED', 'EXTRAVAGANT'],
    temperament: 'ERRATIC',
    priorities: ['CULTURE', 'EXPANSION']
  },
  epithet: 'The Beloved',
  historicalNote: 'Initially popular, became increasingly unpopular. Left France weakened. Famous for "Après moi, le déluge."',
  portraitPrompt: 'King Louis XV of France, handsome middle-aged man, ornate French court dress, powdered wig, 1750s Versailles portrait'
};

const franceCourt: CourtMember[] = [
  {
    id: 'machault',
    name: "Jean-Baptiste de Machault d'Arnouville",
    role: 'TREASURER',
    birthYear: 1701,
    deathYear: 1794,
    competence: 4,
    loyalty: 75,
    traits: ['REFORMER', 'FRUGAL'],
    historicalNote: 'Controller-General who attempted tax reforms. Opposed by clergy and parlements.',
    isHistorical: true
  },
  {
    id: 'maurice_saxe',
    name: 'Maurice de Saxe',
    role: 'GENERAL',
    birthYear: 1696,
    deathYear: 1750, // Dies this year!
    competence: 5,
    loyalty: 85,
    traits: ['BRILLIANT_STRATEGIST', 'CHARISMATIC'],
    historicalNote: 'Marshal of France. Won Battle of Fontenoy (1745). One of the greatest generals of his era.',
    isHistorical: true
  },
  {
    id: 'louis_dauphin',
    name: 'Louis, Dauphin of France',
    role: 'HEIR',
    birthYear: 1729,
    deathYear: 1765,
    competence: 3,
    loyalty: 90,
    traits: ['PIOUS', 'TRADITIONALIST'],
    faction: 'Dévots',
    historicalNote: 'Pious and studious heir. Father of future Louis XVI, Louis XVIII, and Charles X.',
    isHistorical: true
  },
  {
    id: 'argenson',
    name: "Marc-Pierre de Voyer de Paulmy d'Argenson",
    role: 'DIPLOMAT',
    birthYear: 1696,
    deathYear: 1764,
    competence: 4,
    loyalty: 70,
    traits: ['MASTER_DIPLOMAT', 'REFORMER'],
    historicalNote: 'Secretary of State for War. Advocated for military reforms.',
    isHistorical: true
  },
  {
    id: 'pompadour',
    name: 'Madame de Pompadour',
    role: 'CHANCELLOR', // Chief advisor in practice
    birthYear: 1721,
    deathYear: 1764,
    competence: 4,
    loyalty: 95,
    traits: ['PATRON_OF_ARTS', 'MASTER_DIPLOMAT', 'CHARISMATIC'],
    historicalNote: 'Official chief mistress and most powerful woman in France. Patron of Enlightenment thinkers.',
    isHistorical: true
  }
];

// ==================== PRUSSIA ====================

const frederickII: Leader = {
  id: 'frederick_ii',
  name: 'Frederick II',
  title: 'King of Prussia',
  birthYear: 1712,
  deathYear: 1786,
  reignStart: 1740,
  personality: {
    traits: ['BRILLIANT_STRATEGIST', 'ENLIGHTENED_DESPOT', 'PATRON_OF_ARTS'],
    temperament: 'AGGRESSIVE',
    priorities: ['MILITARY', 'EXPANSION', 'CULTURE']
  },
  epithet: 'The Great',
  historicalNote: 'Transformed Prussia into a major power. Military genius, philosopher, flautist. Corresponded with Voltaire.',
  portraitPrompt: 'Frederick the Great of Prussia, middle-aged man in blue Prussian uniform, tricorn hat, sharp intelligent eyes, 1750s military portrait'
};

const prussiaCourt: CourtMember[] = [
  {
    id: 'cocceji',
    name: 'Samuel von Cocceji',
    role: 'CHANCELLOR',
    birthYear: 1679,
    deathYear: 1755,
    competence: 5,
    loyalty: 90,
    traits: ['REFORMER', 'ENLIGHTENED_DESPOT'],
    historicalNote: 'Grand Chancellor who reformed Prussian legal system. Created efficient, uncorrupt judiciary.',
    isHistorical: true
  },
  {
    id: 'winterfeldt',
    name: 'Hans Karl von Winterfeldt',
    role: 'GENERAL',
    birthYear: 1707,
    deathYear: 1757,
    competence: 4,
    loyalty: 95,
    traits: ['BRILLIANT_STRATEGIST', 'WARRIOR_KING'],
    historicalNote: "Frederick's trusted military advisor and friend. Killed at Battle of Moys.",
    isHistorical: true
  },
  {
    id: 'podewils',
    name: 'Heinrich von Podewils',
    role: 'DIPLOMAT',
    birthYear: 1696,
    deathYear: 1760,
    competence: 4,
    loyalty: 85,
    traits: ['MASTER_DIPLOMAT', 'CAUTIOUS'],
    historicalNote: 'Foreign Minister who managed Prussian diplomacy during the Silesian Wars.',
    isHistorical: true
  },
  {
    id: 'august_wilhelm',
    name: 'Prince August Wilhelm',
    role: 'HEIR',
    birthYear: 1722,
    deathYear: 1758,
    competence: 2,
    loyalty: 75,
    traits: ['WEAK_WILLED'],
    historicalNote: "Frederick's younger brother and heir. Disgraced after military failures.",
    isHistorical: true
  }
];

// ==================== RUSSIA ====================

const elizabethRussia: Leader = {
  id: 'elizabeth_russia',
  name: 'Elizabeth',
  title: 'Empress of Russia',
  birthYear: 1709,
  deathYear: 1762,
  reignStart: 1741,
  personality: {
    traits: ['PATRON_OF_ARTS', 'EXTRAVAGANT', 'CHARISMATIC'],
    temperament: 'ERRATIC',
    priorities: ['CULTURE', 'EXPANSION', 'STABILITY']
  },
  epithet: 'The Merciful',
  historicalNote: 'Daughter of Peter the Great. Never signed a death warrant. Loved French culture and elaborate balls.',
  portraitPrompt: 'Empress Elizabeth of Russia, beautiful woman in elaborate Russian court dress, pearls and jewels, ornate Winter Palace setting, 1750s portrait'
};

const russiaCourt: CourtMember[] = [
  {
    id: 'bestuzhev',
    name: 'Aleksey Bestuzhev-Ryumin',
    role: 'CHANCELLOR',
    birthYear: 1693,
    deathYear: 1766,
    competence: 4,
    loyalty: 70,
    traits: ['MASTER_DIPLOMAT', 'PARANOID'],
    historicalNote: 'Grand Chancellor who oriented Russia toward Britain and Austria against Prussia and France.',
    isHistorical: true
  },
  {
    id: 'apraksin',
    name: 'Stepan Apraksin',
    role: 'GENERAL',
    birthYear: 1702,
    deathYear: 1758,
    competence: 3,
    loyalty: 65,
    traits: ['CAUTIOUS', 'TRADITIONALIST'],
    historicalNote: 'Field Marshal during Seven Years War. Retreated after victory at Gross-Jägersdorf.',
    isHistorical: true
  },
  {
    id: 'peter_heir',
    name: 'Grand Duke Peter',
    role: 'HEIR',
    birthYear: 1728,
    deathYear: 1762,
    competence: 2,
    loyalty: 50,
    traits: ['WEAK_WILLED', 'TRADITIONALIST'], // Pro-Prussian
    faction: 'Holstein Party',
    historicalNote: 'Nephew of Elizabeth. Admired Frederick the Great. Would become Peter III briefly.',
    isHistorical: true
  },
  {
    id: 'shuvalov',
    name: 'Ivan Shuvalov',
    role: 'TREASURER',
    birthYear: 1727,
    deathYear: 1797,
    competence: 4,
    loyalty: 95,
    traits: ['PATRON_OF_ARTS', 'REFORMER'],
    historicalNote: "Elizabeth's favorite. Founded Moscow University. Patron of Lomonosov.",
    isHistorical: true
  }
];

// ==================== OTTOMAN EMPIRE ====================

const mahmudI: Leader = {
  id: 'mahmud_i',
  name: 'Mahmud I',
  title: 'Sultan of the Ottoman Empire',
  birthYear: 1696,
  deathYear: 1754,
  reignStart: 1730,
  personality: {
    traits: ['PATRON_OF_ARTS', 'PIOUS', 'CAUTIOUS'],
    temperament: 'CAUTIOUS',
    priorities: ['STABILITY', 'CULTURE']
  },
  historicalNote: 'Restored order after Patrona Halil rebellion. Built mosques and libraries. Largely peaceful reign.',
  portraitPrompt: 'Sultan Mahmud I, middle-aged Ottoman ruler in white turban with jeweled aigrette, fur-lined kaftan, Istanbul palace setting, 1750s portrait'
};

const ottomanCourt: CourtMember[] = [
  {
    id: 'raghib_pasha',
    name: 'Koca Ragıp Pasha',
    role: 'CHANCELLOR',
    birthYear: 1699,
    deathYear: 1763,
    competence: 5,
    loyalty: 85,
    traits: ['MASTER_DIPLOMAT', 'REFORMER', 'PATRON_OF_ARTS'],
    historicalNote: 'Grand Vizier and poet. Skilled diplomat who kept peace with Europe.',
    isHistorical: true
  },
  {
    id: 'yegenoglu',
    name: 'Yeğen Mehmed Pasha',
    role: 'GENERAL',
    birthYear: 1690,
    deathYear: 1757,
    competence: 3,
    loyalty: 80,
    traits: ['WARRIOR_KING', 'TRADITIONALIST'],
    historicalNote: 'Commander who fought against Persia and maintained eastern borders.',
    isHistorical: true
  },
  {
    id: 'osman_heir',
    name: 'Şehzade Osman',
    role: 'HEIR',
    birthYear: 1720,
    deathYear: 1757,
    competence: 3,
    loyalty: 85,
    traits: ['PIOUS', 'TRADITIONALIST'],
    historicalNote: "Mahmud's brother and heir. Would briefly reign as Osman III.",
    isHistorical: true
  }
];

// ==================== QING CHINA ====================

const qianlong: Leader = {
  id: 'qianlong',
  name: 'Qianlong Emperor',
  title: 'Emperor of the Great Qing',
  birthYear: 1711,
  deathYear: 1799,
  reignStart: 1735,
  personality: {
    traits: ['ENLIGHTENED_DESPOT', 'PATRON_OF_ARTS', 'WARRIOR_KING'],
    temperament: 'BALANCED',
    priorities: ['EXPANSION', 'CULTURE', 'STABILITY']
  },
  historicalNote: 'Longest-reigning emperor. Expanded Qing to greatest extent. Patron of arts but began dynasty decline.',
  portraitPrompt: 'Qianlong Emperor of China, dignified middle-aged man in dragon robe, formal Manchu court dress, Forbidden City throne room, 1750s imperial portrait'
};

const qingCourt: CourtMember[] = [
  {
    id: 'zhang_tingyu',
    name: 'Zhang Tingyu',
    role: 'CHANCELLOR',
    birthYear: 1672,
    deathYear: 1755,
    competence: 5,
    loyalty: 90,
    traits: ['TRADITIONALIST', 'FRUGAL'],
    historicalNote: 'Grand Secretary who served three emperors. Only Han Chinese in Qing imperial temple.',
    isHistorical: true
  },
  {
    id: 'fuheng',
    name: 'Fuheng',
    role: 'GENERAL',
    birthYear: 1720,
    deathYear: 1770,
    competence: 4,
    loyalty: 95,
    traits: ['BRILLIANT_STRATEGIST', 'CHARISMATIC'],
    historicalNote: "Empress's brother. Led campaigns against Dzungars and in Burma. Died on campaign.",
    isHistorical: true
  },
  {
    id: 'yongyan_heir',
    name: 'Yongyan',
    role: 'HEIR',
    birthYear: 1760, // Born later - use another prince for 1750
    competence: 3,
    loyalty: 85,
    traits: ['PIOUS', 'REFORMER'],
    historicalNote: 'Would become Jiaqing Emperor. Selected secretly as heir.',
    isHistorical: true
  },
  {
    id: 'ortai',
    name: "E'ertai (Ortai)",
    role: 'DIPLOMAT',
    birthYear: 1677,
    deathYear: 1745, // Just died
    competence: 5,
    loyalty: 90,
    traits: ['MASTER_DIPLOMAT', 'TRADITIONALIST'],
    historicalNote: 'Grand Secretary who managed minority regions and expanded into Tibet.',
    isHistorical: true
  }
];

// ==================== SPAIN ====================

const ferdinandVI: Leader = {
  id: 'ferdinand_vi',
  name: 'Ferdinand VI',
  title: 'King of Spain',
  birthYear: 1713,
  deathYear: 1759,
  reignStart: 1746,
  personality: {
    traits: ['FRUGAL', 'PIOUS', 'WEAK_WILLED'],
    temperament: 'CAUTIOUS',
    priorities: ['STABILITY', 'ECONOMY']
  },
  epithet: 'The Learned',
  historicalNote: 'Peaceful king who kept Spain neutral. Suffered from melancholia. Devoted to his wife Barbara.',
  portraitPrompt: 'King Ferdinand VI of Spain, melancholic middle-aged man in Spanish court dress, powdered wig, Madrid palace setting, 1750s portrait'
};

const spainCourt: CourtMember[] = [
  {
    id: 'ensenada',
    name: 'Zenón de Somodevilla, Marquis of Ensenada',
    role: 'CHANCELLOR',
    birthYear: 1702,
    deathYear: 1781,
    competence: 5,
    loyalty: 85,
    traits: ['REFORMER', 'MERCHANT_PRINCE'],
    historicalNote: 'Secretary of State who rebuilt Spanish navy and reformed tax system. Later exiled.',
    isHistorical: true
  },
  {
    id: 'carvajal',
    name: 'José de Carvajal y Lancaster',
    role: 'DIPLOMAT',
    birthYear: 1698,
    deathYear: 1754,
    competence: 4,
    loyalty: 90,
    traits: ['MASTER_DIPLOMAT', 'CAUTIOUS'],
    historicalNote: 'Secretary of State who maintained neutrality and signed Treaty of Madrid with Portugal.',
    isHistorical: true
  },
  {
    id: 'charles_heir',
    name: 'Charles, King of Naples',
    role: 'HEIR',
    birthYear: 1716,
    deathYear: 1788,
    competence: 4,
    loyalty: 75, // Different kingdom
    traits: ['ENLIGHTENED_DESPOT', 'REFORMER'],
    historicalNote: 'Half-brother ruling Naples. Would become Charles III of Spain, an enlightened ruler.',
    isHistorical: true
  },
  {
    id: 'wall',
    name: 'Ricardo Wall',
    role: 'SPYMASTER',
    birthYear: 1694,
    deathYear: 1777,
    competence: 4,
    loyalty: 80,
    traits: ['PARANOID', 'MASTER_DIPLOMAT'],
    historicalNote: 'Irish-born diplomat and later Secretary of State. Managed intelligence.',
    isHistorical: true
  }
];

// ==================== EXPORT COURT DATA BY NATION ID ====================

export const HISTORICAL_COURTS: Record<string, Court> = {
  britain: {
    leader: georgeII,
    members: britainCourt,
    succession: {
      heir: britainCourt.find(m => m.role === 'HEIR'),
      lineOfSuccession: ['frederick_prince_wales', 'george_prince_wales'],
      successionLaw: 'PRIMOGENITURE',
      crisisRisk: 30 // Frederick dislikes his father
    }
  },
  france: {
    leader: louisXV,
    members: franceCourt,
    succession: {
      heir: franceCourt.find(m => m.role === 'HEIR'),
      lineOfSuccession: ['louis_dauphin'],
      successionLaw: 'PRIMOGENITURE',
      crisisRisk: 10
    }
  },
  prussia: {
    leader: frederickII,
    members: prussiaCourt,
    succession: {
      heir: prussiaCourt.find(m => m.role === 'HEIR'),
      lineOfSuccession: ['august_wilhelm'],
      successionLaw: 'AGNATIC',
      crisisRisk: 40 // Frederick has no children
    }
  },
  russia: {
    leader: elizabethRussia,
    members: russiaCourt,
    succession: {
      heir: russiaCourt.find(m => m.role === 'HEIR'),
      lineOfSuccession: ['peter_heir'],
      successionLaw: 'ABSOLUTE',
      crisisRisk: 50 // Peter is unpopular
    }
  },
  ottoman: {
    leader: mahmudI,
    members: ottomanCourt,
    succession: {
      heir: ottomanCourt.find(m => m.role === 'HEIR'),
      lineOfSuccession: ['osman_heir'],
      successionLaw: 'AGNATIC',
      crisisRisk: 20
    }
  },
  qing: {
    leader: qianlong,
    members: qingCourt,
    succession: {
      heir: qingCourt.find(m => m.role === 'HEIR'),
      lineOfSuccession: ['yongyan_heir'],
      successionLaw: 'ABSOLUTE',
      crisisRisk: 15 // Secret succession system
    }
  },
  spain: {
    leader: ferdinandVI,
    members: spainCourt,
    succession: {
      heir: spainCourt.find(m => m.role === 'HEIR'),
      lineOfSuccession: ['charles_heir'],
      successionLaw: 'PRIMOGENITURE',
      crisisRisk: 60 // Ferdinand has no children
    }
  }
};

// Helper to get court for a nation
export const getHistoricalCourt = (nationId: string): Court | undefined => {
  return HISTORICAL_COURTS[nationId];
};

// Helper to check for historical deaths in a given year
export const getDeathsInYear = (nationId: string, year: number): CourtMember[] => {
  const court = HISTORICAL_COURTS[nationId];
  if (!court) return [];

  const deaths: CourtMember[] = [];

  // Check leader
  if (court.leader.deathYear === year) {
    // Leader dies - this is handled separately
  }

  // Check court members
  court.members.forEach(member => {
    if (member.deathYear === year) {
      deaths.push(member);
    }
  });

  return deaths;
};

// Helper to check if leader dies in year
export const leaderDiesInYear = (nationId: string, year: number): boolean => {
  const court = HISTORICAL_COURTS[nationId];
  return court?.leader.deathYear === year;
};
