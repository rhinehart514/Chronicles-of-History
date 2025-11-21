import { NationTransformation, GovernmentStructure } from '../types';
import { GOVERNMENT_TEMPLATES } from './governmentTemplates';

// ==================== HISTORICAL TRANSFORMATIONS ====================

export const HISTORICAL_TRANSFORMATIONS: NationTransformation[] = [
  // FRANCE
  {
    id: 'french_revolution',
    triggerYear: 1789,
    fromNationId: 'france',
    toNationId: 'france',
    type: 'REVOLUTION',
    newName: 'French Republic',
    newGovernment: {
      ...GOVERNMENT_TEMPLATES.REPUBLIC,
      leaderTitle: 'First Consul',
      cabinetTitle: 'National Convention',
      roleNames: {
        CHANCELLOR: 'Minister of the Interior',
        TREASURER: 'Minister of Finance',
        GENERAL: 'General of the Republic',
        ADMIRAL: 'Admiral',
        SPYMASTER: 'Committee of Public Safety',
        DIPLOMAT: 'Minister of Foreign Affairs',
        HEIR: 'Deputy'
      }
    },
    narrative: 'The people of France have risen up! The Bastille has fallen, and the monarchy trembles. The Revolution has begun - Liberty, Equality, Fraternity!',
    leaderFate: 'EXECUTED'
  },
  {
    id: 'napoleon_empire',
    triggerYear: 1804,
    fromNationId: 'france',
    toNationId: 'france',
    type: 'REFORM',
    newName: 'French Empire',
    newGovernment: {
      ...GOVERNMENT_TEMPLATES.EMPIRE,
      leaderTitle: 'Emperor',
      cabinetTitle: 'Imperial Council',
      roleNames: {
        CHANCELLOR: 'Arch-Chancellor',
        TREASURER: 'Minister of the Treasury',
        GENERAL: 'Marshal of the Empire',
        ADMIRAL: 'Admiral of the Fleet',
        SPYMASTER: 'Minister of Police',
        DIPLOMAT: 'Minister of Foreign Relations',
        HEIR: 'King of Rome'
      }
    },
    narrative: 'Napoleon Bonaparte crowns himself Emperor of the French at Notre-Dame. A new imperial age begins for France.',
    leaderFate: 'RESIGNED'
  },
  {
    id: 'bourbon_restoration',
    triggerYear: 1815,
    fromNationId: 'france',
    toNationId: 'france',
    type: 'REFORM',
    newName: 'Kingdom of France',
    newGovernment: GOVERNMENT_TEMPLATES.CONSTITUTIONAL_MONARCHY,
    narrative: 'With Napoleon exiled to St. Helena, the Bourbon monarchy is restored under Louis XVIII. France returns to constitutional rule.',
    leaderFate: 'EXILED'
  },
  {
    id: 'july_monarchy',
    triggerYear: 1830,
    fromNationId: 'france',
    toNationId: 'france',
    type: 'REVOLUTION',
    newName: 'Kingdom of France',
    newGovernment: GOVERNMENT_TEMPLATES.CONSTITUTIONAL_MONARCHY,
    narrative: 'The July Revolution! Charles X flees as Louis-Philippe, the "Citizen King," takes the throne, promising liberal reforms.',
    leaderFate: 'EXILED'
  },
  {
    id: 'second_republic',
    triggerYear: 1848,
    fromNationId: 'france',
    toNationId: 'france',
    type: 'REVOLUTION',
    newName: 'French Second Republic',
    newGovernment: GOVERNMENT_TEMPLATES.REPUBLIC,
    narrative: 'Revolution sweeps Europe! The February Revolution ends the July Monarchy as France declares its Second Republic.',
    leaderFate: 'EXILED'
  },
  {
    id: 'second_empire',
    triggerYear: 1852,
    fromNationId: 'france',
    toNationId: 'france',
    type: 'REFORM',
    newName: 'Second French Empire',
    newGovernment: GOVERNMENT_TEMPLATES.EMPIRE,
    narrative: 'Louis-Napoleon Bonaparte declares himself Emperor Napoleon III. The Second Empire rises from the ashes of the Republic.',
    leaderFate: 'RETAINED'
  },
  {
    id: 'third_republic',
    triggerYear: 1870,
    fromNationId: 'france',
    toNationId: 'france',
    type: 'REVOLUTION',
    newName: 'French Third Republic',
    newGovernment: GOVERNMENT_TEMPLATES.REPUBLIC,
    narrative: 'Defeat at Sedan! Napoleon III is captured and the Third Republic is proclaimed. France must rebuild from the humiliation of Prussian victory.',
    leaderFate: 'EXILED'
  },

  // PRUSSIA / GERMANY
  {
    id: 'german_unification',
    triggerYear: 1871,
    fromNationId: 'prussia',
    toNationId: 'germany',
    type: 'UNIFICATION',
    newName: 'German Empire',
    newGovernment: {
      ...GOVERNMENT_TEMPLATES.EMPIRE,
      leaderTitle: 'Kaiser',
      legislatureTitle: 'Reichstag',
      cabinetTitle: 'Imperial Cabinet',
      roleNames: {
        CHANCELLOR: 'Imperial Chancellor',
        TREASURER: 'State Secretary of the Treasury',
        GENERAL: 'Chief of the General Staff',
        ADMIRAL: 'State Secretary of the Navy',
        SPYMASTER: 'Chief of Intelligence',
        DIPLOMAT: 'State Secretary of Foreign Affairs',
        HEIR: 'Crown Prince'
      }
    },
    narrative: 'In the Hall of Mirrors at Versailles, Wilhelm I is proclaimed German Emperor. The German states unite under Prussian leadership - a new great power is born!',
    leaderFate: 'RETAINED'
  },
  {
    id: 'weimar_republic',
    triggerYear: 1918,
    fromNationId: 'germany',
    toNationId: 'germany',
    type: 'REVOLUTION',
    newName: 'Weimar Republic',
    newGovernment: GOVERNMENT_TEMPLATES.FEDERAL_REPUBLIC,
    narrative: 'The Kaiser abdicates! Revolution sweeps through Germany as the war ends. The Weimar Republic is proclaimed amid chaos and uncertainty.',
    leaderFate: 'EXILED'
  },
  {
    id: 'nazi_germany',
    triggerYear: 1933,
    fromNationId: 'germany',
    toNationId: 'germany',
    type: 'REFORM',
    newName: 'Third Reich',
    newGovernment: GOVERNMENT_TEMPLATES.FASCIST_STATE,
    narrative: 'Hitler becomes Chancellor. Democracy dies to thunderous applause as the Third Reich rises from the ashes of Weimar.',
    leaderFate: 'RESIGNED'
  },

  // RUSSIA
  {
    id: 'russian_revolution',
    triggerYear: 1917,
    fromNationId: 'russia',
    toNationId: 'russia',
    type: 'REVOLUTION',
    newName: 'Russian Soviet Republic',
    newGovernment: GOVERNMENT_TEMPLATES.COMMUNIST_STATE,
    narrative: 'The October Revolution! The Bolsheviks seize power. The Romanov dynasty ends as Russia embarks on the world\'s first communist experiment.',
    leaderFate: 'EXECUTED'
  },
  {
    id: 'soviet_union',
    triggerYear: 1922,
    fromNationId: 'russia',
    toNationId: 'ussr',
    type: 'REFORM',
    newName: 'Union of Soviet Socialist Republics',
    newGovernment: {
      ...GOVERNMENT_TEMPLATES.COMMUNIST_STATE,
      leaderTitle: 'General Secretary',
      legislatureTitle: 'Supreme Soviet',
      cabinetTitle: 'Politburo'
    },
    narrative: 'The USSR is officially established. Soviet republics unite under the red banner as a new superpower begins to take shape.',
    leaderFate: 'RETAINED'
  },
  {
    id: 'ussr_collapse',
    triggerYear: 1991,
    fromNationId: 'ussr',
    toNationId: 'russia',
    type: 'COLLAPSE',
    newName: 'Russian Federation',
    newGovernment: GOVERNMENT_TEMPLATES.FEDERAL_REPUBLIC,
    narrative: 'The hammer and sickle falls for the last time. The Soviet Union dissolves as Russia and the former republics chart new courses as independent nations.',
    leaderFate: 'RESIGNED'
  },

  // OTTOMAN / TURKEY
  {
    id: 'ottoman_collapse',
    triggerYear: 1922,
    fromNationId: 'ottoman',
    toNationId: 'turkey',
    type: 'COLLAPSE',
    newName: 'Republic of Turkey',
    newGovernment: GOVERNMENT_TEMPLATES.REPUBLIC,
    narrative: 'The Ottoman Empire breathes its last. From its ashes, Mustafa Kemal Atatürk forges the secular Republic of Turkey.',
    leaderFate: 'EXILED'
  },

  // QING / CHINA
  {
    id: 'xinhai_revolution',
    triggerYear: 1912,
    fromNationId: 'qing',
    toNationId: 'china',
    type: 'REVOLUTION',
    newName: 'Republic of China',
    newGovernment: GOVERNMENT_TEMPLATES.REPUBLIC,
    narrative: 'The Xinhai Revolution topples the Qing Dynasty! After 2,000 years, imperial rule in China ends. Sun Yat-sen proclaims the Republic.',
    leaderFate: 'RESIGNED'
  },
  {
    id: 'prc_founding',
    triggerYear: 1949,
    fromNationId: 'china',
    toNationId: 'china',
    type: 'REVOLUTION',
    newName: "People's Republic of China",
    newGovernment: {
      ...GOVERNMENT_TEMPLATES.COMMUNIST_STATE,
      leaderTitle: 'Chairman',
      cabinetTitle: 'State Council',
      roleNames: {
        CHANCELLOR: 'Premier',
        TREASURER: 'Minister of Finance',
        GENERAL: 'Chairman of Central Military Commission',
        ADMIRAL: 'Commander of the Navy',
        SPYMASTER: 'Minister of State Security',
        DIPLOMAT: 'Minister of Foreign Affairs',
        HEIR: 'Vice Chairman'
      }
    },
    narrative: 'Mao Zedong proclaims the People\'s Republic from Tiananmen. The Nationalists flee to Taiwan. China rises under the red flag.',
    leaderFate: 'EXILED'
  },

  // SPAIN
  {
    id: 'spanish_republic',
    triggerYear: 1931,
    fromNationId: 'spain',
    toNationId: 'spain',
    type: 'REVOLUTION',
    newName: 'Spanish Republic',
    newGovernment: GOVERNMENT_TEMPLATES.REPUBLIC,
    narrative: 'King Alfonso XIII flees as Spain declares its Second Republic. Hope and reform fill the air, but dark clouds gather on the horizon.',
    leaderFate: 'EXILED'
  },
  {
    id: 'franco_spain',
    triggerYear: 1939,
    fromNationId: 'spain',
    toNationId: 'spain',
    type: 'REVOLUTION',
    newName: 'Nationalist Spain',
    newGovernment: GOVERNMENT_TEMPLATES.FASCIST_STATE,
    narrative: 'The Civil War ends. General Franco\'s Nationalists triumph. Spain enters decades of authoritarian rule under the Caudillo.',
    leaderFate: 'EXECUTED'
  },

  // BRITAIN
  {
    id: 'act_of_union',
    triggerYear: 1801,
    fromNationId: 'britain',
    toNationId: 'britain',
    type: 'UNIFICATION',
    newName: 'United Kingdom of Great Britain and Ireland',
    newGovernment: GOVERNMENT_TEMPLATES.CONSTITUTIONAL_MONARCHY,
    narrative: 'The Act of Union! Ireland joins Great Britain to form the United Kingdom. The sun never sets on the growing British Empire.',
    leaderFate: 'RETAINED'
  }
];

// Helper functions
export const getTransformationsForYear = (year: number): NationTransformation[] => {
  return HISTORICAL_TRANSFORMATIONS.filter(t => t.triggerYear === year);
};

export const getTransformationForNation = (nationId: string, year: number): NationTransformation | undefined => {
  return HISTORICAL_TRANSFORMATIONS.find(t =>
    t.fromNationId === nationId && t.triggerYear === year
  );
};

export const getUpcomingTransformations = (nationId: string, currentYear: number, lookahead: number = 20): NationTransformation[] => {
  return HISTORICAL_TRANSFORMATIONS.filter(t =>
    t.fromNationId === nationId &&
    t.triggerYear > currentYear &&
    t.triggerYear <= currentYear + lookahead
  );
};

// Check if a transformation is due (can be modified by player actions)
export const shouldTransform = (
  nationId: string,
  year: number,
  stability: number,
  revolutionRisk: number
): NationTransformation | null => {
  const transformation = getTransformationForNation(nationId, year);

  if (!transformation) return null;

  // For revolutions, check if conditions are met
  if (transformation.type === 'REVOLUTION') {
    // Low stability increases chance of revolution
    // Can be delayed if stability is very high
    if (stability >= 4 && revolutionRisk < 30) {
      return null; // Stable enough to resist
    }
  }

  return transformation;
};
