import { Nation, Court, CourtMember, Leader, Era, GovernmentStructure, NationTransformation } from '../types';
import { getEraForYear, getEraInfo, ERA_DEFINITIONS } from '../data/governmentTemplates';
import { getDeathsInYear, leaderDiesInYear } from '../data/historicalLeaders';
import { shouldTransform, getUpcomingTransformations } from '../data/historicalTransformations';
import { getEventsForNation, HistoricalEvent, getHistoricalQuote } from '../data/historicalEvents';

// ==================== ERA PROGRESSION ====================

export interface EraTransition {
  previousEra: Era;
  newEra: Era;
  narrative: string;
  innovations: string[];
  characteristics: {
    warfare: string;
    economy: string;
    communication: string;
    transportation: string;
  };
}

export const checkEraTransition = (previousYear: number, currentYear: number): EraTransition | null => {
  const previousEra = getEraForYear(previousYear);
  const currentEra = getEraForYear(currentYear);

  if (previousEra !== currentEra) {
    const eraInfo = getEraInfo(currentEra);
    if (eraInfo) {
      return {
        previousEra,
        newEra: currentEra,
        narrative: generateEraTransitionNarrative(previousEra, currentEra, currentYear),
        innovations: eraInfo.innovations,
        characteristics: eraInfo.characteristics
      };
    }
  }

  return null;
};

const generateEraTransitionNarrative = (from: Era, to: Era, year: number): string => {
  const narratives: Record<Era, string> = {
    'EARLY_MODERN': 'The world enters the Early Modern period...',
    'ENLIGHTENMENT': `The year ${year} marks the dawn of the Age of Enlightenment. Reason and science challenge old traditions, as philosophers question the divine right of kings and the nature of government itself.`,
    'REVOLUTIONARY': `The revolutionary spirit sweeps across nations in ${year}. The old order trembles as new ideas of liberty, equality, and national sovereignty inspire peoples to rise up against their rulers.`,
    'INDUSTRIAL': `The Industrial Revolution transforms society in ${year}. Steam engines roar to life, factories reshape cities, and new economic powers emerge from the smoke and steel.`,
    'IMPERIAL': `The Age of Empire reaches its zenith in ${year}. Great powers carve up the globe, as nationalism and industrial might fuel an unprecedented scramble for colonies and influence.`,
    'GREAT_WAR': `The Great War erupts in ${year}. The world plunges into a conflict of unprecedented scale, as the old empires clash with modern weapons of terrible destruction.`,
    'INTERWAR': `A fragile peace descends in ${year}. The world attempts to rebuild, but economic turmoil and the rise of new ideologies cast dark shadows over the future.`,
    'WORLD_WAR': `Global war engulfs the world again in ${year}. Total war, ideology, and technology combine in the most destructive conflict in human history.`,
    'COLD_WAR': `The Cold War begins in ${year}. Two superpowers face off across an iron curtain, their rivalry shaping every corner of the globe under the shadow of nuclear annihilation.`,
    'MODERN': `The modern era dawns in ${year}. Globalization, digital revolution, and new challenges reshape the world order as humanity faces an uncertain future.`
  };

  return narratives[to] || `A new era begins in ${year}.`;
};

// ==================== DEATH & SUCCESSION ====================

export interface DeathEvent {
  person: Leader | CourtMember;
  type: 'LEADER' | 'COURT_MEMBER';
  role?: string;
  narrative: string;
  year: number;
}

export interface SuccessionEvent {
  previousLeader: Leader;
  newLeader: Leader;
  type: 'NATURAL' | 'ASSASSINATION' | 'ABDICATION' | 'COUP';
  narrative: string;
  stabilityImpact: number; // -20 to +10
  courtChanges?: CourtMember[]; // New court members after succession
}

export const checkDeaths = (nationId: string, year: number, court: Court): DeathEvent[] => {
  const deaths: DeathEvent[] = [];

  // Check leader death
  if (court.leader.deathYear === year) {
    deaths.push({
      person: court.leader,
      type: 'LEADER',
      narrative: generateDeathNarrative(court.leader, 'LEADER'),
      year
    });
  }

  // Check court member deaths
  for (const member of court.members) {
    if (member.deathYear === year) {
      deaths.push({
        person: member,
        type: 'COURT_MEMBER',
        role: member.role,
        narrative: generateDeathNarrative(member, 'COURT_MEMBER'),
        year
      });
    }
  }

  return deaths;
};

const generateDeathNarrative = (person: Leader | CourtMember, type: 'LEADER' | 'COURT_MEMBER'): string => {
  const age = person.deathYear ? person.deathYear - person.birthYear : 'unknown';

  if (type === 'LEADER') {
    const leader = person as Leader;
    return `${leader.name}${leader.epithet ? ` "${leader.epithet}"` : ''} has passed away at the age of ${age}. The nation mourns the loss of their ${leader.title}.`;
  } else {
    const member = person as CourtMember;
    return `${member.name}, serving as ${member.role}, has died at the age of ${age}. A replacement must be found.`;
  }
};

export const handleSuccession = (
  court: Court,
  government: GovernmentStructure,
  year: number
): { newCourt: Court; event: SuccessionEvent } | null => {
  // Check if leader died this year
  if (court.leader.deathYear !== year) {
    return null;
  }

  // Find heir
  const heir = court.members.find(m => m.role === 'HEIR');

  if (!heir) {
    // Crisis - no heir found
    return null;
  }

  // Create new leader from heir
  const newLeader: Leader = {
    id: heir.id,
    name: heir.name,
    title: `${government.leaderTitle} of the Realm`, // Will be properly set by nation
    birthYear: heir.birthYear,
    deathYear: heir.deathYear,
    reignStart: year,
    personality: {
      traits: heir.traits,
      temperament: 'BALANCED', // Default, should be determined by traits
      priorities: ['STABILITY', 'ECONOMY'] // Default priorities
    },
    historicalNote: heir.historicalNote,
    portraitPrompt: `Portrait of ${heir.name}, newly crowned ruler`
  };

  // Determine stability impact based on succession law and circumstances
  let stabilityImpact = 0;
  const crisisRisk = court.succession.crisisRisk;

  if (crisisRisk > 50) {
    stabilityImpact = -15;
  } else if (crisisRisk > 30) {
    stabilityImpact = -5;
  } else {
    stabilityImpact = 0;
  }

  // Remove heir from court members
  const remainingMembers = court.members.filter(m => m.role !== 'HEIR');

  const event: SuccessionEvent = {
    previousLeader: court.leader,
    newLeader,
    type: 'NATURAL',
    narrative: `${court.leader.name} has passed away. ${newLeader.name} ascends to the throne as the new ${government.leaderTitle}.`,
    stabilityImpact
  };

  const newCourt: Court = {
    leader: newLeader,
    members: remainingMembers,
    succession: {
      ...court.succession,
      heir: undefined, // No heir until designated
      crisisRisk: Math.min(100, court.succession.crisisRisk + 20) // Increased risk without heir
    }
  };

  return { newCourt, event };
};

// ==================== COURT MEMBER REPLACEMENT ====================

export const replaceDeadCourtMembers = (
  court: Court,
  year: number
): { updatedMembers: CourtMember[]; replacements: { old: CourtMember; new: CourtMember }[] } => {
  const replacements: { old: CourtMember; new: CourtMember }[] = [];
  const updatedMembers: CourtMember[] = [];

  for (const member of court.members) {
    if (member.deathYear === year) {
      // Generate a replacement
      const replacement = generateReplacementMember(member.role, year);
      replacements.push({ old: member, new: replacement });
      updatedMembers.push(replacement);
    } else {
      updatedMembers.push(member);
    }
  }

  return { updatedMembers, replacements };
};

const generateReplacementMember = (role: string, year: number): CourtMember => {
  // Generate a procedural court member
  const firstNames = ['Thomas', 'William', 'John', 'Charles', 'Henry', 'George', 'Edward', 'Frederick', 'Alexander', 'James'];
  const lastNames = ['Worthington', 'Pemberton', 'Ashford', 'Blackwood', 'Cromwell', 'Fairfax', 'Grenville', 'Hastings', 'Montague', 'Northumberland'];

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

  return {
    id: `generated_${role}_${year}`,
    name: `${firstName} ${lastName}`,
    role: role as any,
    birthYear: year - 30 - Math.floor(Math.random() * 20), // 30-50 years old
    competence: 2 + Math.floor(Math.random() * 3), // 2-4
    loyalty: 50 + Math.floor(Math.random() * 30), // 50-80
    traits: [],
    historicalNote: `Appointed to replace the previous ${role} in ${year}.`,
    isHistorical: false
  };
};

// ==================== AGING & HEALTH ====================

export const updateCourtHealth = (court: Court, year: number): {
  warnings: string[];
  upcomingDeaths: { name: string; role?: string; yearsRemaining: number }[];
} => {
  const warnings: string[] = [];
  const upcomingDeaths: { name: string; role?: string; yearsRemaining: number }[] = [];

  // Check leader
  if (court.leader.deathYear) {
    const yearsRemaining = court.leader.deathYear - year;
    if (yearsRemaining <= 5 && yearsRemaining > 0) {
      upcomingDeaths.push({
        name: court.leader.name,
        yearsRemaining
      });
      if (yearsRemaining <= 2) {
        warnings.push(`${court.leader.name}'s health is failing. Succession planning is critical.`);
      }
    }
  }

  // Check court members
  for (const member of court.members) {
    if (member.deathYear) {
      const yearsRemaining = member.deathYear - year;
      if (yearsRemaining <= 5 && yearsRemaining > 0) {
        upcomingDeaths.push({
          name: member.name,
          role: member.role,
          yearsRemaining
        });
      }
    }
  }

  return { warnings, upcomingDeaths };
};

// ==================== COMBINED YEAR PROCESSING ====================

export interface YearEvents {
  eraTransition?: EraTransition;
  transformation?: NationTransformation;
  deaths: DeathEvent[];
  succession?: SuccessionEvent;
  replacements: { old: CourtMember; new: CourtMember }[];
  healthWarnings: string[];
  upcomingTransformations: NationTransformation[];
  historicalEvents: HistoricalEvent[];
  historicalQuote?: { quote: string; attribution: string };
}

export const processYearEvents = (
  nation: Nation,
  previousYear: number,
  currentYear: number
): YearEvents => {
  const events: YearEvents = {
    deaths: [],
    replacements: [],
    healthWarnings: [],
    upcomingTransformations: [],
    historicalEvents: [],
    historicalQuote: undefined
  };

  // Get historical events for this year
  events.historicalEvents = getEventsForNation(nation.id, currentYear);
  events.historicalQuote = getHistoricalQuote(currentYear) || undefined;

  // Check era transition
  events.eraTransition = checkEraTransition(previousYear, currentYear) || undefined;

  // Check for nation transformation (revolution, unification, etc.)
  const revolutionRisk = nation.government?.revolutionRisk || 30;
  const stability = nation.stats.stability;
  const hasReforms = nation.government?.type === 'CONSTITUTIONAL_MONARCHY' || nation.government?.type === 'REPUBLIC';
  const militaryStrength = nation.stats.military;
  events.transformation = shouldTransform(nation.id, currentYear, stability, revolutionRisk, hasReforms, militaryStrength) || undefined;

  // Check for upcoming transformations (warnings)
  events.upcomingTransformations = getUpcomingTransformations(nation.id, currentYear, 10);

  // If nation has court, process deaths and succession
  // Skip if transformation is occurring (new leadership will be installed)
  if (nation.court && nation.government && !events.transformation) {
    // Check for deaths
    events.deaths = checkDeaths(nation.id, currentYear, nation.court);

    // Handle succession if leader died
    const successionResult = handleSuccession(nation.court, nation.government, currentYear);
    if (successionResult) {
      events.succession = successionResult.event;
    }

    // Replace dead court members
    const replacementResult = replaceDeadCourtMembers(nation.court, currentYear);
    events.replacements = replacementResult.replacements;

    // Get health warnings
    const healthInfo = updateCourtHealth(nation.court, currentYear);
    events.healthWarnings = healthInfo.warnings;
  }

  // Add warnings about upcoming transformations
  for (const upcoming of events.upcomingTransformations) {
    const yearsUntil = upcoming.triggerYear - currentYear;
    if (yearsUntil <= 5) {
      events.healthWarnings.push(
        `Political tensions are rising. Whispers of ${upcoming.type.toLowerCase()} grow louder...`
      );
    }
  }

  return events;
};
