// Leader generation and management system

export interface Leader {
  id: string;
  name: string;
  type: LeaderType;
  portrait: string;
  age: number;
  skills: LeaderSkills;
  traits: LeaderTrait[];
  loyalty: number;
  prestige: number;
  hireCost: number;
  salary: number;
}

export type LeaderType = 'general' | 'admiral' | 'governor' | 'diplomat' | 'spy';

export interface LeaderSkills {
  primary: number;    // Main skill (0-6)
  secondary: number;  // Secondary skill (0-6)
  tertiary: number;   // Third skill (0-6)
}

export interface LeaderTrait {
  id: string;
  name: string;
  icon: string;
  effects: string[];
  modifier: number;
}

// Leader traits by type
export const LEADER_TRAITS: Record<LeaderType, LeaderTrait[]> = {
  general: [
    { id: 'brave', name: 'Brave', icon: '🦁', effects: ['+10% Morale'], modifier: 1 },
    { id: 'cautious', name: 'Cautious', icon: '🛡️', effects: ['-20% Casualties'], modifier: 1 },
    { id: 'aggressive', name: 'Aggressive', icon: '⚔️', effects: ['+15% Attack'], modifier: 1 },
    { id: 'defensive', name: 'Defensive', icon: '🏰', effects: ['+20% Defense'], modifier: 1 },
    { id: 'inspiring', name: 'Inspiring', icon: '🎺', effects: ['+15% Morale recovery'], modifier: 1 },
    { id: 'ruthless', name: 'Ruthless', icon: '💀', effects: ['+25% Siege speed'], modifier: 1 },
    { id: 'tactician', name: 'Tactician', icon: '📋', effects: ['+1 Maneuver'], modifier: 2 },
    { id: 'drillmaster', name: 'Drillmaster', icon: '🎖️', effects: ['+Experience gain'], modifier: 1 },
    { id: 'reckless', name: 'Reckless', icon: '💨', effects: ['+30% Attack, +20% Casualties'], modifier: -1 },
    { id: 'coward', name: 'Coward', icon: '🏃', effects: ['-20% Morale'], modifier: -2 }
  ],
  admiral: [
    { id: 'sea_wolf', name: 'Sea Wolf', icon: '🐺', effects: ['+15% Naval combat'], modifier: 1 },
    { id: 'navigator', name: 'Navigator', icon: '🧭', effects: ['+20% Speed'], modifier: 1 },
    { id: 'blockader', name: 'Blockader', icon: '⚓', effects: ['+25% Blockade efficiency'], modifier: 1 },
    { id: 'trader', name: 'Trader', icon: '📦', effects: ['+10% Trade protection'], modifier: 1 },
    { id: 'explorer', name: 'Explorer', icon: '🗺️', effects: ['+Colonial range'], modifier: 1 },
    { id: 'storm_rider', name: 'Storm Rider', icon: '⛈️', effects: ['-50% Storm damage'], modifier: 1 },
    { id: 'seasick', name: 'Seasick', icon: '🤢', effects: ['-10% Combat effectiveness'], modifier: -1 }
  ],
  governor: [
    { id: 'administrator', name: 'Administrator', icon: '📊', effects: ['+10% Tax'], modifier: 1 },
    { id: 'builder', name: 'Builder', icon: '🏗️', effects: ['-20% Building cost'], modifier: 1 },
    { id: 'populist', name: 'Populist', icon: '👥', effects: ['-2 Unrest'], modifier: 1 },
    { id: 'harsh', name: 'Harsh', icon: '👊', effects: ['+15% Tax, +1 Unrest'], modifier: 0 },
    { id: 'cultured', name: 'Cultured', icon: '🎭', effects: ['+Cultural conversion'], modifier: 1 },
    { id: 'corrupt', name: 'Corrupt', icon: '💸', effects: ['-15% Tax'], modifier: -2 },
    { id: 'efficient', name: 'Efficient', icon: '⚙️', effects: ['+20% Production'], modifier: 1 }
  ],
  diplomat: [
    { id: 'silver_tongue', name: 'Silver Tongue', icon: '🗣️', effects: ['+20% Improve relations'], modifier: 2 },
    { id: 'intimidating', name: 'Intimidating', icon: '😠', effects: ['+15% Demand acceptance'], modifier: 1 },
    { id: 'charming', name: 'Charming', icon: '😊', effects: ['+Alliance acceptance'], modifier: 1 },
    { id: 'honest', name: 'Honest', icon: '🤝', effects: ['+Trust, -Deception'], modifier: 1 },
    { id: 'schemer', name: 'Schemer', icon: '🎭', effects: ['+Claims fabrication'], modifier: 1 },
    { id: 'blunt', name: 'Blunt', icon: '😤', effects: ['-10% Negotiation'], modifier: -1 }
  ],
  spy: [
    { id: 'shadow', name: 'Shadow', icon: '👤', effects: ['+30% Infiltration'], modifier: 2 },
    { id: 'poisoner', name: 'Poisoner', icon: '☠️', effects: ['+Assassination success'], modifier: 1 },
    { id: 'forger', name: 'Forger', icon: '📜', effects: ['+Claims fabrication'], modifier: 1 },
    { id: 'saboteur', name: 'Saboteur', icon: '💣', effects: ['+Sabotage effectiveness'], modifier: 1 },
    { id: 'informant', name: 'Informant', icon: '👁️', effects: ['+Intel gathering'], modifier: 1 },
    { id: 'double_agent', name: 'Double Agent', icon: '🔄', effects: ['Risk of betrayal'], modifier: -2 }
  ]
};

// Name pools for leader generation
const FIRST_NAMES = [
  'Alexander', 'Frederick', 'Charles', 'Louis', 'Henry', 'William',
  'James', 'George', 'Peter', 'Philip', 'Arthur', 'Edward',
  'Richard', 'Robert', 'Thomas', 'John', 'Michael', 'David',
  'Catherine', 'Elizabeth', 'Maria', 'Anne', 'Victoria', 'Isabella'
];

const LAST_NAMES = [
  'von Clausewitz', 'de Montfort', 'Wellington', 'Nelson', 'Marlborough',
  'Bonaparte', 'Habsburg', 'Bourbon', 'Stuart', 'Romanov',
  'Medici', 'Valois', 'Tudor', 'Orange', 'Brandenburg'
];

// Generate a random leader
export function generateLeader(type: LeaderType, year: number): Leader {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];

  const age = 25 + Math.floor(Math.random() * 30);
  const experience = Math.floor((age - 20) / 5);

  // Generate skills based on experience
  const baseSkill = Math.min(3, experience);
  const skills: LeaderSkills = {
    primary: Math.min(6, baseSkill + Math.floor(Math.random() * 3)),
    secondary: Math.min(6, baseSkill + Math.floor(Math.random() * 2)),
    tertiary: Math.min(6, Math.floor(Math.random() * 3))
  };

  // Random traits
  const availableTraits = LEADER_TRAITS[type];
  const traitCount = 1 + Math.floor(Math.random() * 2);
  const traits: LeaderTrait[] = [];

  for (let i = 0; i < traitCount; i++) {
    const trait = availableTraits[Math.floor(Math.random() * availableTraits.length)];
    if (!traits.find(t => t.id === trait.id)) {
      traits.push(trait);
    }
  }

  // Calculate cost based on skills and traits
  const skillTotal = skills.primary + skills.secondary + skills.tertiary;
  const traitModifier = traits.reduce((sum, t) => sum + t.modifier, 0);
  const hireCost = (skillTotal * 50 + traitModifier * 100) * (1 + Math.random() * 0.5);
  const salary = Math.floor(hireCost / 10);

  return {
    id: `leader_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: `${firstName} ${lastName}`,
    type,
    portrait: getPortraitEmoji(type),
    age,
    skills,
    traits,
    loyalty: 50 + Math.floor(Math.random() * 50),
    prestige: Math.floor(skillTotal * 10 + traitModifier * 20),
    hireCost: Math.floor(hireCost),
    salary
  };
}

// Get portrait emoji based on type
function getPortraitEmoji(type: LeaderType): string {
  switch (type) {
    case 'general': return '🎖️';
    case 'admiral': return '⚓';
    case 'governor': return '🏛️';
    case 'diplomat': return '🤝';
    case 'spy': return '🕵️';
  }
}

// Generate leader pool for recruitment
export function generateLeaderPool(count: number, year: number): Leader[] {
  const types: LeaderType[] = ['general', 'admiral', 'governor', 'diplomat', 'spy'];
  const leaders: Leader[] = [];

  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    leaders.push(generateLeader(type, year));
  }

  return leaders;
}

// Calculate leader effectiveness
export function calculateEffectiveness(leader: Leader): number {
  const skillBonus = (leader.skills.primary * 3 + leader.skills.secondary * 2 + leader.skills.tertiary) / 6;
  const traitBonus = leader.traits.reduce((sum, t) => sum + t.modifier, 0);
  const loyaltyFactor = leader.loyalty / 100;

  return (skillBonus + traitBonus) * loyaltyFactor;
}

// Age leader by one year
export function ageLeader(leader: Leader): Leader {
  const aged = { ...leader, age: leader.age + 1 };

  // Death chance increases with age
  if (aged.age > 50) {
    const deathChance = (aged.age - 50) * 0.02;
    if (Math.random() < deathChance) {
      return { ...aged, loyalty: 0 }; // Mark as dead
    }
  }

  // Loyalty decay if not treated well
  aged.loyalty = Math.max(0, aged.loyalty - 1);

  return aged;
}

// Get skill name by type
export function getSkillNames(type: LeaderType): { primary: string; secondary: string; tertiary: string } {
  switch (type) {
    case 'general':
      return { primary: 'Fire', secondary: 'Shock', tertiary: 'Maneuver' };
    case 'admiral':
      return { primary: 'Naval Fire', secondary: 'Naval Maneuver', tertiary: 'Siege' };
    case 'governor':
      return { primary: 'Administration', secondary: 'Diplomacy', tertiary: 'Military' };
    case 'diplomat':
      return { primary: 'Negotiation', secondary: 'Intrigue', tertiary: 'Protocol' };
    case 'spy':
      return { primary: 'Infiltration', secondary: 'Sabotage', tertiary: 'Assassination' };
  }
}

export default {
  LEADER_TRAITS,
  generateLeader,
  generateLeaderPool,
  calculateEffectiveness,
  ageLeader,
  getSkillNames
};
