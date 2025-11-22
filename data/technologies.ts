// Technology definitions for the tech tree

import { Technology } from '../components/TechTree';

export const TECHNOLOGIES: Technology[] = [
  // Military technologies
  {
    id: 'flintlock',
    name: 'Flintlock Weapons',
    description: 'Reliable firearms that transform infantry warfare',
    icon: '🔫',
    category: 'military',
    cost: 100,
    prerequisites: [],
    effects: ['+10% Infantry combat', '-Reload time'],
    yearAvailable: 1700
  },
  {
    id: 'line_tactics',
    name: 'Line Infantry Tactics',
    description: 'Organized formations maximize firepower',
    icon: '🎖️',
    category: 'military',
    cost: 120,
    prerequisites: ['flintlock'],
    effects: ['+15% Army discipline', '+Morale recovery'],
    yearAvailable: 1710
  },
  {
    id: 'military_staff',
    name: 'Military Staff System',
    description: 'Professional officer corps for strategic planning',
    icon: '📋',
    category: 'military',
    cost: 150,
    prerequisites: ['line_tactics'],
    effects: ['+20% Maneuver speed', '+Supply efficiency'],
    yearAvailable: 1750
  },
  {
    id: 'rifled_muskets',
    name: 'Rifled Muskets',
    description: 'Increased accuracy at longer ranges',
    icon: '🎯',
    category: 'military',
    cost: 180,
    prerequisites: ['flintlock'],
    effects: ['+25% Fire range', '+Infantry damage'],
    yearAvailable: 1800
  },
  {
    id: 'mobile_artillery',
    name: 'Mobile Artillery',
    description: 'Faster, more maneuverable cannons',
    icon: '💥',
    category: 'military',
    cost: 200,
    prerequisites: ['military_staff'],
    effects: ['+Artillery mobility', '+Siege effectiveness'],
    yearAvailable: 1820
  },
  {
    id: 'ironclads',
    name: 'Ironclad Warships',
    description: 'Steam-powered armored vessels dominate the seas',
    icon: '🚢',
    category: 'military',
    cost: 250,
    prerequisites: ['steam_power'],
    effects: ['+Naval combat', '+Blockade effectiveness'],
    yearAvailable: 1860
  },

  // Economy technologies
  {
    id: 'mercantilism',
    name: 'Mercantilism',
    description: 'State control of trade for national benefit',
    icon: '⚖️',
    category: 'economy',
    cost: 80,
    prerequisites: [],
    effects: ['+10% Trade income', '+Tariff efficiency'],
    yearAvailable: 1700
  },
  {
    id: 'banking',
    name: 'Modern Banking',
    description: 'Financial institutions enable larger investments',
    icon: '🏦',
    category: 'economy',
    cost: 120,
    prerequisites: ['mercantilism'],
    effects: ['+Interest income', '+Loan capacity'],
    yearAvailable: 1750
  },
  {
    id: 'steam_power',
    name: 'Steam Power',
    description: 'Revolutionary energy source transforms industry',
    icon: '💨',
    category: 'economy',
    cost: 200,
    prerequisites: ['banking'],
    effects: ['+30% Production', '+Factory efficiency'],
    yearAvailable: 1780
  },
  {
    id: 'railways',
    name: 'Railways',
    description: 'Rapid transportation of goods and troops',
    icon: '🚂',
    category: 'economy',
    cost: 250,
    prerequisites: ['steam_power'],
    effects: ['+Movement speed', '+Trade range', '+Supply lines'],
    yearAvailable: 1830
  },
  {
    id: 'mass_production',
    name: 'Mass Production',
    description: 'Standardized parts and assembly lines',
    icon: '🏭',
    category: 'economy',
    cost: 300,
    prerequisites: ['railways'],
    effects: ['+50% Factory output', '-Production costs'],
    yearAvailable: 1880
  },
  {
    id: 'free_trade',
    name: 'Free Trade',
    description: 'Reduced barriers increase commerce',
    icon: '🌐',
    category: 'economy',
    cost: 180,
    prerequisites: ['banking'],
    effects: ['+Trade efficiency', '+Diplomatic relations'],
    yearAvailable: 1840
  },

  // Government technologies
  {
    id: 'enlightened_thought',
    name: 'Enlightened Thought',
    description: 'Reason and individual rights gain prominence',
    icon: '💭',
    category: 'government',
    cost: 100,
    prerequisites: [],
    effects: ['+Innovation', '+Stability in educated classes'],
    yearAvailable: 1700
  },
  {
    id: 'bureaucracy',
    name: 'Professional Bureaucracy',
    description: 'Efficient administration through trained officials',
    icon: '📝',
    category: 'government',
    cost: 120,
    prerequisites: ['enlightened_thought'],
    effects: ['+Tax efficiency', '-Corruption'],
    yearAvailable: 1750
  },
  {
    id: 'constitutional_gov',
    name: 'Constitutional Government',
    description: 'Written laws limit royal power',
    icon: '📜',
    category: 'government',
    cost: 180,
    prerequisites: ['enlightened_thought'],
    effects: ['+Stability', '+Reform acceptance', '-Absolutism'],
    yearAvailable: 1780
  },
  {
    id: 'nationalism',
    name: 'Nationalism',
    description: 'National identity unites the people',
    icon: '🏳️',
    category: 'government',
    cost: 150,
    prerequisites: ['constitutional_gov'],
    effects: ['+Manpower', '+Army morale', '-Minority stability'],
    yearAvailable: 1800
  },
  {
    id: 'public_education',
    name: 'Public Education',
    description: 'State-funded schools for all citizens',
    icon: '🎓',
    category: 'government',
    cost: 200,
    prerequisites: ['bureaucracy'],
    effects: ['+Literacy', '+Innovation', '+Workforce quality'],
    yearAvailable: 1850
  },
  {
    id: 'social_reforms',
    name: 'Social Reforms',
    description: 'Labor protections and welfare systems',
    icon: '🤝',
    category: 'government',
    cost: 220,
    prerequisites: ['public_education'],
    effects: ['+Worker stability', '-Revolution risk'],
    yearAvailable: 1880
  },

  // Culture technologies
  {
    id: 'printing_press',
    name: 'Advanced Printing',
    description: 'Faster, cheaper book production',
    icon: '📰',
    category: 'culture',
    cost: 80,
    prerequisites: [],
    effects: ['+Idea spread', '+Innovation'],
    yearAvailable: 1700
  },
  {
    id: 'scientific_method',
    name: 'Scientific Method',
    description: 'Systematic approach to knowledge',
    icon: '🔬',
    category: 'culture',
    cost: 120,
    prerequisites: ['printing_press'],
    effects: ['+Research speed', '+Innovation'],
    yearAvailable: 1720
  },
  {
    id: 'academies',
    name: 'Royal Academies',
    description: 'Institutions dedicated to advancing knowledge',
    icon: '🏛️',
    category: 'culture',
    cost: 150,
    prerequisites: ['scientific_method'],
    effects: ['+Prestige', '+Research points', '+Attract scholars'],
    yearAvailable: 1760
  },
  {
    id: 'romanticism',
    name: 'Romanticism',
    description: 'Emotional expression and national culture flourish',
    icon: '🎭',
    category: 'culture',
    cost: 100,
    prerequisites: ['enlightened_thought'],
    effects: ['+Prestige', '+National identity'],
    yearAvailable: 1800
  },
  {
    id: 'archaeology',
    name: 'Archaeology',
    description: 'Scientific study of the past',
    icon: '🏺',
    category: 'culture',
    cost: 130,
    prerequisites: ['academies'],
    effects: ['+Prestige', '+National heritage'],
    yearAvailable: 1820
  },
  {
    id: 'modern_medicine',
    name: 'Modern Medicine',
    description: 'Scientific approach to health and disease',
    icon: '💊',
    category: 'culture',
    cost: 200,
    prerequisites: ['scientific_method'],
    effects: ['+Population growth', '-Plague impact'],
    yearAvailable: 1850
  },
  {
    id: 'telegraph',
    name: 'Telegraph',
    description: 'Instant long-distance communication',
    icon: '📡',
    category: 'culture',
    cost: 180,
    prerequisites: ['railways'],
    effects: ['+Coordination', '+Trade info', '+Military response'],
    yearAvailable: 1840
  },
  {
    id: 'electricity',
    name: 'Electricity',
    description: 'New power source transforms society',
    icon: '⚡',
    category: 'culture',
    cost: 280,
    prerequisites: ['telegraph', 'mass_production'],
    effects: ['+All production', '+Innovation', '+Quality of life'],
    yearAvailable: 1880
  }
];

// Get technologies by category
export function getTechsByCategory(category: string): Technology[] {
  return TECHNOLOGIES.filter(t => t.category === category);
}

// Get available technologies for a given year with researched techs
export function getAvailableTechs(year: number, researched: string[]): Technology[] {
  return TECHNOLOGIES.filter(tech => {
    if (researched.includes(tech.id)) return false;
    if (tech.yearAvailable > year) return false;
    if (tech.prerequisites.some(p => !researched.includes(p))) return false;
    return true;
  });
}

// Calculate total research cost for remaining techs
export function getRemainingResearchCost(researched: string[]): number {
  return TECHNOLOGIES
    .filter(t => !researched.includes(t.id))
    .reduce((sum, t) => sum + t.cost, 0);
}

export default TECHNOLOGIES;
