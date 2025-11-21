import { Era } from '../types';

// ==================== TECHNOLOGY TYPES ====================

export type TechCategory =
  | 'MILITARY' | 'NAVAL' | 'ECONOMIC' | 'ADMINISTRATIVE'
  | 'CULTURAL' | 'INDUSTRIAL' | 'MEDICAL' | 'AGRICULTURAL';

export interface Technology {
  id: string;
  name: string;
  description: string;
  category: TechCategory;
  era: Era;
  researchCost: number; // Points needed to unlock
  effects: {
    military?: number;
    economy?: number;
    stability?: number;
    innovation?: number;
    prestige?: number;
    special?: string;
  };
  prerequisites?: string[]; // Tech IDs required first
  unlocks?: string[]; // What this tech enables
  historicalNote?: string;
}

export interface ResearchState {
  currentTech?: string; // Currently researching
  progress: number; // 0-100 progress on current
  completedTechs: string[];
  availableTechs: string[];
  researchPoints: number; // Generated per turn
}

// ==================== TECHNOLOGY TREE ====================

export const TECHNOLOGIES: Technology[] = [
  // ==================== ENLIGHTENMENT ERA ====================
  // Military
  {
    id: 'linear_tactics',
    name: 'Linear Tactics',
    description: 'Organized infantry formations with disciplined volley fire.',
    category: 'MILITARY',
    era: 'ENLIGHTENMENT',
    researchCost: 100,
    effects: { military: 1 },
    historicalNote: 'The foundation of 18th century warfare'
  },
  {
    id: 'improved_artillery',
    name: 'Improved Artillery',
    description: 'Better casting techniques for more reliable cannons.',
    category: 'MILITARY',
    era: 'ENLIGHTENMENT',
    researchCost: 120,
    effects: { military: 1 },
    prerequisites: ['linear_tactics'],
    historicalNote: 'Gribeauval system standardized French artillery'
  },
  {
    id: 'military_academies',
    name: 'Military Academies',
    description: 'Professional training for officers.',
    category: 'MILITARY',
    era: 'ENLIGHTENMENT',
    researchCost: 150,
    effects: { military: 1, prestige: 1 },
    prerequisites: ['linear_tactics'],
    unlocks: ['Better generals available']
  },

  // Naval
  {
    id: 'ship_of_the_line',
    name: 'Ship of the Line',
    description: 'Powerful warships forming the backbone of naval power.',
    category: 'NAVAL',
    era: 'ENLIGHTENMENT',
    researchCost: 130,
    effects: { military: 1, prestige: 1 },
    historicalNote: 'Britain\'s dominance built on these vessels'
  },
  {
    id: 'naval_hospitals',
    name: 'Naval Hospitals',
    description: 'Better care for sailors reduces losses to disease.',
    category: 'NAVAL',
    era: 'ENLIGHTENMENT',
    researchCost: 100,
    effects: { stability: 1 },
    prerequisites: ['ship_of_the_line']
  },

  // Economic
  {
    id: 'banking_systems',
    name: 'Banking Systems',
    description: 'Formal banking institutions and credit systems.',
    category: 'ECONOMIC',
    era: 'ENLIGHTENMENT',
    researchCost: 120,
    effects: { economy: 1 },
    historicalNote: 'Bank of England model spreads across Europe'
  },
  {
    id: 'mercantilism',
    name: 'Mercantilism',
    description: 'State-directed trade policies to maximize exports.',
    category: 'ECONOMIC',
    era: 'ENLIGHTENMENT',
    researchCost: 100,
    effects: { economy: 1, prestige: 1 },
    historicalNote: 'Dominant economic theory of the era'
  },
  {
    id: 'joint_stock_companies',
    name: 'Joint Stock Companies',
    description: 'Corporate structures for large enterprises.',
    category: 'ECONOMIC',
    era: 'ENLIGHTENMENT',
    researchCost: 140,
    effects: { economy: 2 },
    prerequisites: ['banking_systems'],
    historicalNote: 'East India Companies dominate global trade'
  },

  // Administrative
  {
    id: 'centralized_bureaucracy',
    name: 'Centralized Bureaucracy',
    description: 'Professional civil service with standardized procedures.',
    category: 'ADMINISTRATIVE',
    era: 'ENLIGHTENMENT',
    researchCost: 150,
    effects: { stability: 1, innovation: 1 },
    historicalNote: 'Prussia leads in administrative efficiency'
  },
  {
    id: 'census_taking',
    name: 'Census Taking',
    description: 'Systematic population counts for better governance.',
    category: 'ADMINISTRATIVE',
    era: 'ENLIGHTENMENT',
    researchCost: 80,
    effects: { stability: 1 },
    unlocks: ['population_policy']
  },

  // Cultural
  {
    id: 'scientific_societies',
    name: 'Scientific Societies',
    description: 'Academies for sharing knowledge and discoveries.',
    category: 'CULTURAL',
    era: 'ENLIGHTENMENT',
    researchCost: 100,
    effects: { innovation: 2, prestige: 1 },
    historicalNote: 'Royal Society, Académie des Sciences'
  },
  {
    id: 'encyclopedias',
    name: 'Encyclopedias',
    description: 'Compiling human knowledge in accessible form.',
    category: 'CULTURAL',
    era: 'ENLIGHTENMENT',
    researchCost: 120,
    effects: { innovation: 1, prestige: 1 },
    prerequisites: ['scientific_societies'],
    historicalNote: 'Diderot\'s Encyclopédie spreads Enlightenment ideas'
  },

  // ==================== REVOLUTIONARY ERA ====================
  {
    id: 'levee_en_masse',
    name: 'Levée en Masse',
    description: 'Mass conscription creating citizen armies.',
    category: 'MILITARY',
    era: 'REVOLUTIONARY',
    researchCost: 150,
    effects: { military: 2, stability: -1 },
    prerequisites: ['military_academies'],
    historicalNote: 'Revolutionary France mobilizes the nation'
  },
  {
    id: 'corps_system',
    name: 'Corps System',
    description: 'Self-sufficient army divisions for flexible warfare.',
    category: 'MILITARY',
    era: 'REVOLUTIONARY',
    researchCost: 180,
    effects: { military: 2 },
    prerequisites: ['levee_en_masse'],
    historicalNote: 'Napoleon\'s military innovation'
  },

  // ==================== INDUSTRIAL ERA ====================
  {
    id: 'steam_power',
    name: 'Steam Power',
    description: 'Harnessing steam for mechanical work.',
    category: 'INDUSTRIAL',
    era: 'INDUSTRIAL',
    researchCost: 200,
    effects: { economy: 2, innovation: 1 },
    historicalNote: 'Watt\'s steam engine transforms industry'
  },
  {
    id: 'railways',
    name: 'Railways',
    description: 'Steam-powered rail transport.',
    category: 'INDUSTRIAL',
    era: 'INDUSTRIAL',
    researchCost: 250,
    effects: { economy: 2, military: 1 },
    prerequisites: ['steam_power'],
    historicalNote: 'Revolutionizes transportation and logistics'
  },
  {
    id: 'telegraph',
    name: 'Telegraph',
    description: 'Instant long-distance communication.',
    category: 'INDUSTRIAL',
    era: 'INDUSTRIAL',
    researchCost: 180,
    effects: { innovation: 2, military: 1 },
    historicalNote: 'Morse code connects continents'
  },
  {
    id: 'factory_system',
    name: 'Factory System',
    description: 'Centralized production with division of labor.',
    category: 'INDUSTRIAL',
    era: 'INDUSTRIAL',
    researchCost: 200,
    effects: { economy: 2, stability: -1 },
    prerequisites: ['steam_power'],
    historicalNote: 'Birth of industrial capitalism'
  },
  {
    id: 'rifled_weapons',
    name: 'Rifled Weapons',
    description: 'Accurate long-range firearms.',
    category: 'MILITARY',
    era: 'INDUSTRIAL',
    researchCost: 180,
    effects: { military: 2 },
    prerequisites: ['improved_artillery'],
    historicalNote: 'Transforms infantry warfare'
  },
  {
    id: 'ironclad_warships',
    name: 'Ironclad Warships',
    description: 'Steam-powered armored vessels.',
    category: 'NAVAL',
    era: 'INDUSTRIAL',
    researchCost: 220,
    effects: { military: 2, prestige: 1 },
    prerequisites: ['steam_power', 'ship_of_the_line'],
    historicalNote: 'CSS Virginia vs USS Monitor'
  },
  {
    id: 'public_health',
    name: 'Public Health',
    description: 'Sanitation and disease prevention measures.',
    category: 'MEDICAL',
    era: 'INDUSTRIAL',
    researchCost: 150,
    effects: { stability: 2 },
    historicalNote: 'Cholera epidemics drive reforms'
  },
  {
    id: 'crop_rotation',
    name: 'Advanced Agriculture',
    description: 'Scientific farming methods increase yields.',
    category: 'AGRICULTURAL',
    era: 'INDUSTRIAL',
    researchCost: 120,
    effects: { economy: 1, stability: 1 },
    historicalNote: 'Agricultural revolution feeds growing cities'
  },

  // ==================== IMPERIAL ERA ====================
  {
    id: 'machine_guns',
    name: 'Machine Guns',
    description: 'Rapid-fire automatic weapons.',
    category: 'MILITARY',
    era: 'IMPERIAL',
    researchCost: 200,
    effects: { military: 2 },
    prerequisites: ['rifled_weapons'],
    historicalNote: 'Maxim gun gives colonial powers overwhelming advantage'
  },
  {
    id: 'dreadnoughts',
    name: 'Dreadnought Battleships',
    description: 'All-big-gun turbine-powered warships.',
    category: 'NAVAL',
    era: 'IMPERIAL',
    researchCost: 280,
    effects: { military: 2, prestige: 2 },
    prerequisites: ['ironclad_warships'],
    historicalNote: 'HMS Dreadnought makes all other ships obsolete'
  },
  {
    id: 'electricity',
    name: 'Electrical Power',
    description: 'Harnessing electricity for light and power.',
    category: 'INDUSTRIAL',
    era: 'IMPERIAL',
    researchCost: 250,
    effects: { economy: 2, innovation: 2 },
    prerequisites: ['telegraph'],
    historicalNote: 'Edison, Tesla, and the second industrial revolution'
  },
  {
    id: 'germ_theory',
    name: 'Germ Theory',
    description: 'Understanding disease transmission.',
    category: 'MEDICAL',
    era: 'IMPERIAL',
    researchCost: 180,
    effects: { stability: 1, innovation: 1 },
    prerequisites: ['public_health'],
    historicalNote: 'Pasteur and Koch revolutionize medicine'
  },

  // ==================== GREAT WAR ERA ====================
  {
    id: 'trench_warfare',
    name: 'Trench Warfare',
    description: 'Defensive fortifications and static warfare.',
    category: 'MILITARY',
    era: 'GREAT_WAR',
    researchCost: 150,
    effects: { military: 1, stability: -1 },
    historicalNote: 'The Western Front stalemate'
  },
  {
    id: 'tanks',
    name: 'Tank Warfare',
    description: 'Armored fighting vehicles.',
    category: 'MILITARY',
    era: 'GREAT_WAR',
    researchCost: 250,
    effects: { military: 2 },
    prerequisites: ['machine_guns'],
    historicalNote: 'British invention breaks the deadlock'
  },
  {
    id: 'aircraft',
    name: 'Military Aviation',
    description: 'Airplanes for reconnaissance and combat.',
    category: 'MILITARY',
    era: 'GREAT_WAR',
    researchCost: 280,
    effects: { military: 2, innovation: 1 },
    historicalNote: 'From observation to air combat'
  },
  {
    id: 'submarines',
    name: 'Submarine Warfare',
    description: 'Underwater vessels for naval warfare.',
    category: 'NAVAL',
    era: 'GREAT_WAR',
    researchCost: 220,
    effects: { military: 2 },
    prerequisites: ['dreadnoughts'],
    historicalNote: 'U-boats threaten Allied shipping'
  },

  // ==================== MODERN ERA ====================
  {
    id: 'nuclear_power',
    name: 'Nuclear Technology',
    description: 'Harnessing atomic energy.',
    category: 'INDUSTRIAL',
    era: 'COLD_WAR',
    researchCost: 400,
    effects: { military: 3, economy: 2, innovation: 2 },
    historicalNote: 'The atomic age begins'
  },
  {
    id: 'computers',
    name: 'Computer Technology',
    description: 'Electronic computing machines.',
    category: 'INDUSTRIAL',
    era: 'COLD_WAR',
    researchCost: 350,
    effects: { economy: 2, innovation: 3 },
    prerequisites: ['electricity'],
    historicalNote: 'From ENIAC to personal computers'
  },
  {
    id: 'space_program',
    name: 'Space Program',
    description: 'Rockets and orbital spaceflight.',
    category: 'MILITARY',
    era: 'COLD_WAR',
    researchCost: 400,
    effects: { prestige: 3, innovation: 2 },
    prerequisites: ['aircraft'],
    historicalNote: 'The space race captures imagination'
  },
  {
    id: 'internet',
    name: 'Internet',
    description: 'Global computer network.',
    category: 'INDUSTRIAL',
    era: 'MODERN',
    researchCost: 300,
    effects: { economy: 3, innovation: 3 },
    prerequisites: ['computers'],
    historicalNote: 'Information revolution transforms society'
  }
];

// ==================== HELPER FUNCTIONS ====================

export const getTechsForEra = (era: Era): Technology[] => {
  return TECHNOLOGIES.filter(t => t.era === era);
};

export const getTechById = (id: string): Technology | undefined => {
  return TECHNOLOGIES.find(t => t.id === id);
};

export const getAvailableTechs = (completedTechs: string[], currentEra: Era): Technology[] => {
  // Get all techs up to current era
  const eraOrder: Era[] = ['EARLY_MODERN', 'ENLIGHTENMENT', 'REVOLUTIONARY', 'INDUSTRIAL', 'IMPERIAL', 'GREAT_WAR', 'INTERWAR', 'WORLD_WAR', 'COLD_WAR', 'MODERN'];
  const currentEraIndex = eraOrder.indexOf(currentEra);
  const availableEras = eraOrder.slice(0, currentEraIndex + 1);

  return TECHNOLOGIES.filter(tech => {
    // Must be in available era
    if (!availableEras.includes(tech.era)) return false;

    // Must not already be completed
    if (completedTechs.includes(tech.id)) return false;

    // Must have prerequisites met
    if (tech.prerequisites) {
      const prereqsMet = tech.prerequisites.every(prereq => completedTechs.includes(prereq));
      if (!prereqsMet) return false;
    }

    return true;
  });
};

export const calculateResearchPoints = (innovation: number, economy: number): number => {
  // Base points plus bonuses from stats
  return 5 + (innovation * 3) + Math.floor(economy * 1.5);
};

export const getInitialResearchState = (nationId: string): ResearchState => {
  // Start with some era-appropriate techs already researched
  const startingTechs: Record<string, string[]> = {
    britain: ['banking_systems', 'ship_of_the_line', 'mercantilism'],
    france: ['scientific_societies', 'linear_tactics', 'centralized_bureaucracy'],
    prussia: ['linear_tactics', 'military_academies', 'centralized_bureaucracy'],
    russia: ['census_taking'],
    ottoman: ['mercantilism'],
    qing: ['census_taking', 'centralized_bureaucracy'],
    spain: ['mercantilism', 'ship_of_the_line']
  };

  return {
    completedTechs: startingTechs[nationId] || [],
    availableTechs: [],
    progress: 0,
    researchPoints: 10
  };
};

export const getCategoryIcon = (category: TechCategory): string => {
  const icons: Record<TechCategory, string> = {
    'MILITARY': '⚔️',
    'NAVAL': '⚓',
    'ECONOMIC': '💰',
    'ADMINISTRATIVE': '📋',
    'CULTURAL': '🎭',
    'INDUSTRIAL': '🏭',
    'MEDICAL': '⚕️',
    'AGRICULTURAL': '🌾'
  };
  return icons[category];
};
