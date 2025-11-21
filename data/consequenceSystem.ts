// Consequence Chains System - Realistic cause-and-effect relationships
// Models how events cascade into larger consequences

import { Nation, NationStats, SocialClass } from '../types';
import { calculateClassUnrest, checkClassConflict } from './populationSystem';

// Consequence severity levels
export type ConsequenceSeverity = 'MINOR' | 'MODERATE' | 'SEVERE' | 'CRITICAL';

// Types of consequences
export type ConsequenceType =
  | 'FAMINE'
  | 'EPIDEMIC'
  | 'RIOT'
  | 'REBELLION'
  | 'REVOLUTION'
  | 'ECONOMIC_CRISIS'
  | 'MILITARY_MUTINY'
  | 'RELIGIOUS_CONFLICT'
  | 'ETHNIC_TENSION'
  | 'BRAIN_DRAIN'
  | 'MASS_EMIGRATION'
  | 'FOREIGN_INTERVENTION';

// Consequence definition
export interface Consequence {
  id: string;
  type: ConsequenceType;
  name: string;
  severity: ConsequenceSeverity;
  description: string;
  narrative: string;

  // Effects
  statEffects: Partial<NationStats>;
  duration: number; // Years the consequence lasts
  spreadChance?: number; // Chance to spread/escalate (0-100)

  // Can lead to
  escalatesTo?: ConsequenceType;
  escalationThreshold?: number; // Conditions for escalation

  // Resolution
  resolvedBy?: string[];
  autoResolveChance?: number;
}

// Condition triggers
export interface ConsequenceTrigger {
  type: ConsequenceType;
  conditions: {
    statThreshold?: { stat: keyof NationStats; below: number };
    classUnrest?: number;
    warDuration?: number;
    consecurtiveYears?: number;
    probability?: number;
  };
  modifiers: {
    stability?: number;
    economy?: number;
    military?: number;
  };
}

// Define consequence triggers
export const CONSEQUENCE_TRIGGERS: ConsequenceTrigger[] = [
  // Famine triggers
  {
    type: 'FAMINE',
    conditions: {
      statThreshold: { stat: 'economy', below: 2 },
      probability: 30
    },
    modifiers: { stability: 1, economy: -1 }
  },
  // Riots from unrest
  {
    type: 'RIOT',
    conditions: {
      classUnrest: 50,
      probability: 40
    },
    modifiers: { stability: -1 }
  },
  // Rebellion from severe conditions
  {
    type: 'REBELLION',
    conditions: {
      statThreshold: { stat: 'stability', below: 2 },
      classUnrest: 60,
      probability: 25
    },
    modifiers: { stability: -1, military: -1 }
  },
  // Revolution from extreme conditions
  {
    type: 'REVOLUTION',
    conditions: {
      statThreshold: { stat: 'stability', below: 1 },
      classUnrest: 80,
      probability: 40
    },
    modifiers: { stability: -2, prestige: -1 }
  },
  // Economic crisis
  {
    type: 'ECONOMIC_CRISIS',
    conditions: {
      statThreshold: { stat: 'economy', below: 2 },
      consecurtiveYears: 3,
      probability: 50
    },
    modifiers: { economy: -1, stability: -1 }
  },
  // Military mutiny
  {
    type: 'MILITARY_MUTINY',
    conditions: {
      warDuration: 5,
      statThreshold: { stat: 'stability', below: 2 },
      probability: 30
    },
    modifiers: { military: -2, stability: -1 }
  },
  // Mass emigration
  {
    type: 'MASS_EMIGRATION',
    conditions: {
      statThreshold: { stat: 'stability', below: 2 },
      probability: 40
    },
    modifiers: { economy: -1, innovation: -1 }
  }
];

// Consequence definitions
export const CONSEQUENCES: Record<ConsequenceType, Consequence> = {
  FAMINE: {
    id: 'famine',
    type: 'FAMINE',
    name: 'Famine',
    severity: 'SEVERE',
    description: 'Widespread food shortages threaten the population',
    narrative: 'Crops have failed and granaries stand empty. The specter of hunger stalks the land, and the desperate cries of the starving echo in the streets.',
    statEffects: { stability: -1, economy: -1 },
    duration: 2,
    spreadChance: 30,
    escalatesTo: 'RIOT',
    escalationThreshold: 60,
    resolvedBy: ['Import grain', 'Emergency relief', 'Good harvest'],
    autoResolveChance: 40
  },
  EPIDEMIC: {
    id: 'epidemic',
    type: 'EPIDEMIC',
    name: 'Epidemic',
    severity: 'SEVERE',
    description: 'Disease spreads through the population',
    narrative: 'A terrible sickness sweeps through cities and countryside alike. The dead are counted in thousands, and fear grips the nation.',
    statEffects: { stability: -1, economy: -1 },
    duration: 2,
    spreadChance: 50,
    resolvedBy: ['Medical advances', 'Quarantine measures'],
    autoResolveChance: 50
  },
  RIOT: {
    id: 'riot',
    type: 'RIOT',
    name: 'Civil Unrest',
    severity: 'MODERATE',
    description: 'Angry mobs take to the streets',
    narrative: 'The people have risen in anger. Mobs roam the streets, smashing windows and confronting authorities. Order hangs by a thread.',
    statEffects: { stability: -1 },
    duration: 1,
    spreadChance: 40,
    escalatesTo: 'REBELLION',
    escalationThreshold: 70,
    resolvedBy: ['Reforms', 'Military suppression', 'Concessions'],
    autoResolveChance: 60
  },
  REBELLION: {
    id: 'rebellion',
    type: 'REBELLION',
    name: 'Armed Rebellion',
    severity: 'SEVERE',
    description: 'Armed rebels challenge the government',
    narrative: 'Open rebellion has erupted. Armed bands defy the government, and entire regions slip from control. Blood is spilled in the streets and countryside.',
    statEffects: { stability: -2, military: -1 },
    duration: 3,
    spreadChance: 50,
    escalatesTo: 'REVOLUTION',
    escalationThreshold: 80,
    resolvedBy: ['Military victory', 'Negotiated peace', 'Major reforms'],
    autoResolveChance: 20
  },
  REVOLUTION: {
    id: 'revolution',
    type: 'REVOLUTION',
    name: 'Revolution',
    severity: 'CRITICAL',
    description: 'The old order is overthrown',
    narrative: 'Revolution! The old regime crumbles as the people seize power. Institutions fall, leaders flee or face judgment, and a new order rises from the ashes.',
    statEffects: { stability: -3, prestige: -2 },
    duration: 5,
    resolvedBy: ['New government established', 'Counter-revolution'],
    autoResolveChance: 10
  },
  ECONOMIC_CRISIS: {
    id: 'economic_crisis',
    type: 'ECONOMIC_CRISIS',
    name: 'Economic Crisis',
    severity: 'SEVERE',
    description: 'Financial collapse threatens the economy',
    narrative: 'Banks fail, businesses close, and unemployment soars. The economy teeters on the brink of collapse as confidence evaporates.',
    statEffects: { economy: -2, stability: -1 },
    duration: 4,
    spreadChance: 30,
    escalatesTo: 'RIOT',
    escalationThreshold: 50,
    resolvedBy: ['Economic reforms', 'Foreign loans', 'Trade deals'],
    autoResolveChance: 30
  },
  MILITARY_MUTINY: {
    id: 'military_mutiny',
    type: 'MILITARY_MUTINY',
    name: 'Military Mutiny',
    severity: 'SEVERE',
    description: 'Soldiers refuse orders and rebel',
    narrative: 'The army turns against its masters. Exhausted and unpaid soldiers lay down their arms or turn them against their officers.',
    statEffects: { military: -2, stability: -1 },
    duration: 2,
    spreadChance: 60,
    escalatesTo: 'REBELLION',
    escalationThreshold: 70,
    resolvedBy: ['Pay arrears', 'End war', 'Military reforms'],
    autoResolveChance: 40
  },
  RELIGIOUS_CONFLICT: {
    id: 'religious_conflict',
    type: 'RELIGIOUS_CONFLICT',
    name: 'Religious Conflict',
    severity: 'MODERATE',
    description: 'Religious tensions erupt into violence',
    narrative: 'Faith divides the nation. Sectarian violence breaks out as religious communities clash, their hatred stoked by demagogues.',
    statEffects: { stability: -1 },
    duration: 3,
    spreadChance: 40,
    escalatesTo: 'REBELLION',
    escalationThreshold: 60,
    resolvedBy: ['Religious tolerance', 'Separation of church and state'],
    autoResolveChance: 30
  },
  ETHNIC_TENSION: {
    id: 'ethnic_tension',
    type: 'ETHNIC_TENSION',
    name: 'Ethnic Tensions',
    severity: 'MODERATE',
    description: 'Ethnic groups clash',
    narrative: 'Ancient grievances and modern fears combine as ethnic communities turn against each other. The bonds of nationhood strain to breaking.',
    statEffects: { stability: -1 },
    duration: 3,
    spreadChance: 30,
    escalatesTo: 'REBELLION',
    escalationThreshold: 65,
    resolvedBy: ['Autonomy', 'Cultural rights', 'Forced assimilation'],
    autoResolveChance: 25
  },
  BRAIN_DRAIN: {
    id: 'brain_drain',
    type: 'BRAIN_DRAIN',
    name: 'Brain Drain',
    severity: 'MODERATE',
    description: 'Educated citizens flee the country',
    narrative: 'The best and brightest abandon their homeland, seeking opportunity and safety abroad. Universities empty and innovation stalls.',
    statEffects: { innovation: -1 },
    duration: 5,
    resolvedBy: ['Political reform', 'Economic opportunity', 'Academic freedom'],
    autoResolveChance: 20
  },
  MASS_EMIGRATION: {
    id: 'mass_emigration',
    type: 'MASS_EMIGRATION',
    name: 'Mass Emigration',
    severity: 'MODERATE',
    description: 'Large numbers flee the country',
    narrative: 'Ships sail packed with emigrants, their holds filled with the desperate and dispossessed. The nation hemorrhages its population.',
    statEffects: { economy: -1 },
    duration: 4,
    resolvedBy: ['Improved conditions', 'Land reform', 'Economic opportunity'],
    autoResolveChance: 30
  },
  FOREIGN_INTERVENTION: {
    id: 'foreign_intervention',
    type: 'FOREIGN_INTERVENTION',
    name: 'Foreign Intervention',
    severity: 'SEVERE',
    description: 'Foreign powers intervene in national affairs',
    narrative: 'Foreign armies cross the border, claiming to restore order or protect interests. National sovereignty hangs in the balance.',
    statEffects: { prestige: -2, stability: -1 },
    duration: 3,
    resolvedBy: ['Diplomatic solution', 'Military resistance', 'Capitulation'],
    autoResolveChance: 40
  }
};

// Active consequence tracking
export interface ActiveConsequence {
  consequence: Consequence;
  startYear: number;
  remainingDuration: number;
  escalationRisk: number;
}

// Check for new consequences based on nation state
export function checkForConsequences(
  nation: Nation,
  year: number,
  warYears: number,
  activeConsequences: ActiveConsequence[]
): ActiveConsequence[] {
  const newConsequences: ActiveConsequence[] = [];

  // Calculate class unrest if demographics available
  let classUnrest = 0;
  if (nation.demographics?.socialClasses) {
    classUnrest = calculateClassUnrest(nation.demographics.socialClasses);
  }

  // Check each trigger
  for (const trigger of CONSEQUENCE_TRIGGERS) {
    // Skip if this type is already active
    if (activeConsequences.some(ac => ac.consequence.type === trigger.type)) {
      continue;
    }

    let triggered = false;
    let probability = trigger.conditions.probability || 50;

    // Check stat threshold
    if (trigger.conditions.statThreshold) {
      const { stat, below } = trigger.conditions.statThreshold;
      if (nation.stats[stat] < below) {
        triggered = true;
      } else {
        continue; // Condition not met
      }
    }

    // Check class unrest
    if (trigger.conditions.classUnrest) {
      if (classUnrest >= trigger.conditions.classUnrest) {
        triggered = true;
        probability += (classUnrest - trigger.conditions.classUnrest);
      } else if (trigger.conditions.statThreshold === undefined) {
        continue;
      }
    }

    // Check war duration
    if (trigger.conditions.warDuration) {
      if (warYears >= trigger.conditions.warDuration) {
        triggered = true;
        probability += (warYears - trigger.conditions.warDuration) * 5;
      } else if (trigger.conditions.statThreshold === undefined && trigger.conditions.classUnrest === undefined) {
        continue;
      }
    }

    // Roll for consequence
    if (triggered && Math.random() * 100 < probability) {
      const consequence = CONSEQUENCES[trigger.type];
      newConsequences.push({
        consequence,
        startYear: year,
        remainingDuration: consequence.duration,
        escalationRisk: 0
      });
    }
  }

  return newConsequences;
}

// Process active consequences (escalation, resolution)
export function processConsequences(
  activeConsequences: ActiveConsequence[],
  nation: Nation,
  year: number
): {
  updated: ActiveConsequence[];
  resolved: Consequence[];
  escalated: { from: Consequence; to: Consequence }[];
  effects: Partial<NationStats>;
} {
  const updated: ActiveConsequence[] = [];
  const resolved: Consequence[] = [];
  const escalated: { from: Consequence; to: Consequence }[] = [];
  const effects: Partial<NationStats> = {};

  for (const ac of activeConsequences) {
    // Decrease duration
    ac.remainingDuration--;

    // Apply ongoing effects
    for (const [stat, value] of Object.entries(ac.consequence.statEffects)) {
      effects[stat as keyof NationStats] = (effects[stat as keyof NationStats] || 0) + (value as number);
    }

    // Check for natural resolution
    if (ac.remainingDuration <= 0 || Math.random() * 100 < (ac.consequence.autoResolveChance || 0)) {
      resolved.push(ac.consequence);
      continue;
    }

    // Check for escalation
    if (ac.consequence.escalatesTo && ac.consequence.escalationThreshold) {
      // Increase escalation risk based on conditions
      let riskIncrease = 10;
      if (nation.stats.stability <= 2) riskIncrease += 10;
      if (nation.stats.economy <= 2) riskIncrease += 5;

      ac.escalationRisk += riskIncrease;

      if (ac.escalationRisk >= ac.consequence.escalationThreshold) {
        const escalatedTo = CONSEQUENCES[ac.consequence.escalatesTo];
        escalated.push({ from: ac.consequence, to: escalatedTo });

        // Replace with escalated consequence
        updated.push({
          consequence: escalatedTo,
          startYear: year,
          remainingDuration: escalatedTo.duration,
          escalationRisk: 0
        });
        continue;
      }
    }

    // Keep consequence active
    updated.push(ac);
  }

  return { updated, resolved, escalated, effects };
}

// Get narrative for active consequences
export function getConsequenceNarrative(activeConsequences: ActiveConsequence[]): string {
  if (activeConsequences.length === 0) {
    return '';
  }

  const narratives = activeConsequences.map(ac => {
    const severity = ac.consequence.severity === 'CRITICAL' ? 'A grave crisis:' :
                     ac.consequence.severity === 'SEVERE' ? 'A serious challenge:' : 'A concern:';
    return `${severity} ${ac.consequence.name} - ${ac.consequence.description}`;
  });

  return narratives.join('\n');
}
