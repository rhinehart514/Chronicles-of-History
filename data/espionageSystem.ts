// Espionage and Intelligence System - Covert operations and information warfare
// Spies, counter-intelligence, and clandestine actions

import { Nation, NationStats } from '../types';

// Agent types
export type AgentType = 'SPY' | 'DIPLOMAT' | 'SABOTEUR' | 'ASSASSIN' | 'PROPAGANDIST' | 'INFORMANT';

// Agent skill levels
export type SkillLevel = 'NOVICE' | 'TRAINED' | 'VETERAN' | 'MASTER' | 'LEGENDARY';

// Mission types
export type MissionType =
  | 'GATHER_INTELLIGENCE'
  | 'STEAL_TECHNOLOGY'
  | 'SABOTAGE_INFRASTRUCTURE'
  | 'SABOTAGE_MILITARY'
  | 'ASSASSINATE_LEADER'
  | 'ASSASSINATE_GENERAL'
  | 'INCITE_REBELLION'
  | 'SPREAD_PROPAGANDA'
  | 'DIPLOMATIC_PRESSURE'
  | 'FORGE_DOCUMENTS'
  | 'COUNTER_ESPIONAGE'
  | 'ESTABLISH_NETWORK';

// Agent definition
export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  skill: SkillLevel;
  experience: number;
  loyalty: number; // 0-100
  cover: string; // Cover identity
  location?: string; // Nation ID where deployed
  mission?: ActiveMission;
  compromised: boolean;
  yearsOfService: number;
}

// Mission definition
export interface Mission {
  type: MissionType;
  name: string;
  description: string;
  requiredSkill: SkillLevel;
  duration: number; // Turns
  baseCost: number;
  riskLevel: number; // 1-10
  effects: {
    targetStat?: keyof NationStats;
    statChange?: number;
    specialEffect?: string;
  };
}

// Active mission
export interface ActiveMission {
  mission: Mission;
  target: string; // Nation ID
  startYear: number;
  turnsRemaining: number;
  progress: number; // 0-100
  detected: boolean;
}

// Intelligence report
export interface IntelligenceReport {
  id: string;
  year: number;
  source: string;
  targetNation: string;
  category: 'MILITARY' | 'ECONOMIC' | 'POLITICAL' | 'DIPLOMATIC' | 'TECHNOLOGICAL';
  reliability: number; // 0-100
  content: string;
  actionable: boolean;
  expiresYear?: number;
}

// Counter-intelligence status
export interface CounterIntelligence {
  level: number; // 1-5
  awareness: number; // 0-100, how alert to spies
  knownAgents: string[]; // Agent IDs of detected foreign spies
  doubleAgents: string[]; // Turned enemy agents
}

// Full intelligence apparatus
export interface IntelligenceApparatus {
  budget: number;
  agents: Agent[];
  reports: IntelligenceReport[];
  counterIntel: CounterIntelligence;
  networks: { nationId: string; strength: number }[]; // Spy networks abroad
  reputation: number; // -100 to 100, notorious to unknown
}

// Mission definitions
export const MISSIONS: Record<MissionType, Mission> = {
  GATHER_INTELLIGENCE: {
    type: 'GATHER_INTELLIGENCE',
    name: 'Gather Intelligence',
    description: 'Collect information on target nation\'s capabilities',
    requiredSkill: 'NOVICE',
    duration: 2,
    baseCost: 100,
    riskLevel: 2,
    effects: { specialEffect: 'Generate intelligence report' }
  },
  STEAL_TECHNOLOGY: {
    type: 'STEAL_TECHNOLOGY',
    name: 'Steal Technology',
    description: 'Acquire technological secrets from target',
    requiredSkill: 'TRAINED',
    duration: 4,
    baseCost: 500,
    riskLevel: 6,
    effects: { targetStat: 'innovation', statChange: -1, specialEffect: 'Gain research progress' }
  },
  SABOTAGE_INFRASTRUCTURE: {
    type: 'SABOTAGE_INFRASTRUCTURE',
    name: 'Sabotage Infrastructure',
    description: 'Damage roads, railways, or factories',
    requiredSkill: 'TRAINED',
    duration: 3,
    baseCost: 300,
    riskLevel: 7,
    effects: { targetStat: 'economy', statChange: -1 }
  },
  SABOTAGE_MILITARY: {
    type: 'SABOTAGE_MILITARY',
    name: 'Sabotage Military',
    description: 'Destroy weapons, supplies, or fortifications',
    requiredSkill: 'VETERAN',
    duration: 3,
    baseCost: 400,
    riskLevel: 8,
    effects: { targetStat: 'military', statChange: -1 }
  },
  ASSASSINATE_LEADER: {
    type: 'ASSASSINATE_LEADER',
    name: 'Assassinate Leader',
    description: 'Eliminate the head of state',
    requiredSkill: 'MASTER',
    duration: 6,
    baseCost: 2000,
    riskLevel: 10,
    effects: { targetStat: 'stability', statChange: -3, specialEffect: 'Trigger succession crisis' }
  },
  ASSASSINATE_GENERAL: {
    type: 'ASSASSINATE_GENERAL',
    name: 'Assassinate General',
    description: 'Eliminate a military commander',
    requiredSkill: 'VETERAN',
    duration: 4,
    baseCost: 800,
    riskLevel: 8,
    effects: { targetStat: 'military', statChange: -1 }
  },
  INCITE_REBELLION: {
    type: 'INCITE_REBELLION',
    name: 'Incite Rebellion',
    description: 'Foment unrest and armed uprising',
    requiredSkill: 'VETERAN',
    duration: 5,
    baseCost: 1000,
    riskLevel: 9,
    effects: { targetStat: 'stability', statChange: -2, specialEffect: 'Trigger rebellion event' }
  },
  SPREAD_PROPAGANDA: {
    type: 'SPREAD_PROPAGANDA',
    name: 'Spread Propaganda',
    description: 'Undermine government legitimacy',
    requiredSkill: 'TRAINED',
    duration: 3,
    baseCost: 200,
    riskLevel: 4,
    effects: { targetStat: 'stability', statChange: -1 }
  },
  DIPLOMATIC_PRESSURE: {
    type: 'DIPLOMATIC_PRESSURE',
    name: 'Diplomatic Pressure',
    description: 'Blackmail or coerce diplomats',
    requiredSkill: 'TRAINED',
    duration: 2,
    baseCost: 300,
    riskLevel: 5,
    effects: { targetStat: 'prestige', statChange: -1 }
  },
  FORGE_DOCUMENTS: {
    type: 'FORGE_DOCUMENTS',
    name: 'Forge Documents',
    description: 'Create false treaties or orders',
    requiredSkill: 'VETERAN',
    duration: 3,
    baseCost: 400,
    riskLevel: 6,
    effects: { specialEffect: 'Create diplomatic incident' }
  },
  COUNTER_ESPIONAGE: {
    type: 'COUNTER_ESPIONAGE',
    name: 'Counter-Espionage',
    description: 'Hunt and capture foreign spies',
    requiredSkill: 'TRAINED',
    duration: 4,
    baseCost: 300,
    riskLevel: 3,
    effects: { specialEffect: 'Identify and capture enemy agents' }
  },
  ESTABLISH_NETWORK: {
    type: 'ESTABLISH_NETWORK',
    name: 'Establish Network',
    description: 'Build informant network in target nation',
    requiredSkill: 'VETERAN',
    duration: 6,
    baseCost: 600,
    riskLevel: 5,
    effects: { specialEffect: 'Create permanent intelligence network' }
  }
};

// Skill level multipliers
const SKILL_MULTIPLIERS: Record<SkillLevel, number> = {
  NOVICE: 0.6,
  TRAINED: 0.8,
  VETERAN: 1.0,
  MASTER: 1.3,
  LEGENDARY: 1.6
};

// Initialize intelligence apparatus
export function initializeIntelligence(nationId: string, year: number): IntelligenceApparatus {
  return {
    budget: 1000,
    agents: generateInitialAgents(nationId, year),
    reports: [],
    counterIntel: {
      level: 2,
      awareness: 50,
      knownAgents: [],
      doubleAgents: []
    },
    networks: [],
    reputation: 0
  };
}

// Generate starting agents
function generateInitialAgents(nationId: string, year: number): Agent[] {
  const firstNames = ['Alexander', 'William', 'Charles', 'Henri', 'Johann', 'Ivan', 'Ahmed', 'Giuseppe'];
  const lastNames = ['Shadow', 'Grey', 'Black', 'Swift', 'Frost', 'Stone', 'Wolf', 'Raven'];

  const agents: Agent[] = [];

  // Start with 3 agents
  for (let i = 0; i < 3; i++) {
    agents.push({
      id: `agent_${nationId}_${i}`,
      name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      type: i === 0 ? 'SPY' : i === 1 ? 'INFORMANT' : 'DIPLOMAT',
      skill: i === 0 ? 'TRAINED' : 'NOVICE',
      experience: 0,
      loyalty: 70 + Math.floor(Math.random() * 20),
      cover: generateCover(),
      compromised: false,
      yearsOfService: 0
    });
  }

  return agents;
}

// Generate cover identity
function generateCover(): string {
  const covers = [
    'Merchant', 'Diplomat', 'Scholar', 'Artist', 'Priest', 'Doctor',
    'Journalist', 'Engineer', 'Banker', 'Translator', 'Teacher'
  ];
  return covers[Math.floor(Math.random() * covers.length)];
}

// Calculate mission success chance
export function calculateMissionSuccess(agent: Agent, mission: Mission, targetCounterIntel: number): number {
  const skillMultiplier = SKILL_MULTIPLIERS[agent.skill];
  const experienceBonus = agent.experience * 0.5;
  const loyaltyFactor = agent.loyalty / 100;

  // Base success from skill
  let successChance = 50 * skillMultiplier + experienceBonus;

  // Reduce by risk and counter-intel
  successChance -= mission.riskLevel * 3;
  successChance -= targetCounterIntel * 5;

  // Loyalty affects commitment
  successChance *= loyaltyFactor;

  // Compromised agents are likely to fail
  if (agent.compromised) {
    successChance *= 0.3;
  }

  return Math.max(5, Math.min(95, successChance));
}

// Execute mission
export function executeMission(
  agent: Agent,
  mission: Mission,
  targetNation: Nation
): { success: boolean; narrative: string; detected: boolean; agentLost: boolean } {
  const targetCounterIntel = 3; // Default value
  const successChance = calculateMissionSuccess(agent, mission, targetCounterIntel);

  const roll = Math.random() * 100;
  const success = roll < successChance;

  // Detection chance
  const detectionChance = mission.riskLevel * 10 + (success ? 0 : 20);
  const detected = Math.random() * 100 < detectionChance;

  // Agent loss chance if detected
  const agentLost = detected && Math.random() * 100 < 50;

  // Generate narrative
  let narrative = '';
  if (success) {
    narrative = `Mission "${mission.name}" against ${targetNation.name} succeeded. `;
    if (mission.effects.specialEffect) {
      narrative += mission.effects.specialEffect + '. ';
    }
  } else {
    narrative = `Mission "${mission.name}" against ${targetNation.name} failed. `;
  }

  if (detected) {
    narrative += `Agent ${agent.name} was detected by enemy counter-intelligence. `;
    if (agentLost) {
      narrative += `The agent was captured and executed.`;
    } else {
      narrative += `The agent managed to escape but their cover is blown.`;
    }
  }

  return { success, narrative, detected, agentLost };
}

// Generate intelligence report
export function generateIntelligenceReport(
  targetNation: Nation,
  category: IntelligenceReport['category'],
  year: number,
  agentSkill: SkillLevel
): IntelligenceReport {
  const reliability = SKILL_MULTIPLIERS[agentSkill] * 70;

  let content = '';
  let actionable = false;

  switch (category) {
    case 'MILITARY':
      content = `${targetNation.name} military strength assessed at ${targetNation.stats.military}/5. `;
      content += targetNation.stats.military >= 4
        ? 'Their forces are formidable and well-equipped.'
        : 'Their military appears vulnerable to attack.';
      actionable = true;
      break;
    case 'ECONOMIC':
      content = `${targetNation.name} economy rated ${targetNation.stats.economy}/5. `;
      content += targetNation.stats.economy <= 2
        ? 'Economic troubles may lead to instability.'
        : 'Their treasury is well-funded.';
      actionable = true;
      break;
    case 'POLITICAL':
      content = `${targetNation.name} stability assessed at ${targetNation.stats.stability}/5. `;
      content += targetNation.stats.stability <= 2
        ? 'Internal divisions create opportunity for intervention.'
        : 'The government maintains firm control.';
      actionable = targetNation.stats.stability <= 2;
      break;
    case 'DIPLOMATIC':
      content = `Intelligence on ${targetNation.name}'s diplomatic relations gathered. `;
      content += 'Their alliances and rivalries have been mapped.';
      actionable = false;
      break;
    case 'TECHNOLOGICAL':
      content = `${targetNation.name} innovation level: ${targetNation.stats.innovation}/5. `;
      content += targetNation.stats.innovation >= 4
        ? 'They lead in technological advancement.'
        : 'Their technology lags behind the leading powers.';
      actionable = true;
      break;
  }

  return {
    id: `report_${year}_${Math.random().toString(36).substring(7)}`,
    year,
    source: 'Field Agent',
    targetNation: targetNation.id,
    category,
    reliability,
    content,
    actionable,
    expiresYear: year + 5
  };
}

// Simulate year of intelligence operations
export function simulateIntelligenceYear(
  apparatus: IntelligenceApparatus,
  nationId: string,
  year: number
): { updated: IntelligenceApparatus; events: string[] } {
  const events: string[] = [];
  const updated = { ...apparatus };

  // Age agents
  updated.agents = updated.agents.map(agent => ({
    ...agent,
    yearsOfService: agent.yearsOfService + 1,
    experience: Math.min(100, agent.experience + 5),
    // Loyalty degrades slightly over time without attention
    loyalty: Math.max(0, agent.loyalty - 1)
  }));

  // Check for agent retirement or death
  updated.agents = updated.agents.filter(agent => {
    if (agent.yearsOfService > 20 && Math.random() < 0.2) {
      events.push(`Agent ${agent.name} has retired after ${agent.yearsOfService} years of service.`);
      return false;
    }
    return true;
  });

  // Remove expired reports
  updated.reports = updated.reports.filter(report =>
    !report.expiresYear || report.expiresYear > year
  );

  // Degrade network strength over time
  updated.networks = updated.networks.map(network => ({
    ...network,
    strength: Math.max(0, network.strength - 5)
  })).filter(network => network.strength > 0);

  return { updated, events };
}

// Get narrative for intelligence status
export function getIntelligenceNarrative(apparatus: IntelligenceApparatus): string {
  const activeAgents = apparatus.agents.filter(a => !a.compromised).length;
  const networks = apparatus.networks.length;

  let narrative = `Your intelligence service employs ${activeAgents} active agents. `;

  if (networks > 0) {
    narrative += `Networks operate in ${networks} foreign nations. `;
  }

  if (apparatus.counterIntel.level >= 4) {
    narrative += 'Counter-intelligence is highly vigilant. ';
  } else if (apparatus.counterIntel.level <= 2) {
    narrative += 'Counter-intelligence capabilities are lacking. ';
  }

  const recentReports = apparatus.reports.filter(r => r.actionable).length;
  if (recentReports > 0) {
    narrative += `${recentReports} actionable intelligence reports await your attention.`;
  }

  return narrative;
}
