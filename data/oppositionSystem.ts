// Opposition and Revolutionary Faction System
// Play as government OR face organized opposition challenging your rule

import { Nation, NationStats, Faction, SocialClass } from '../types';

// Opposition types
export type OppositionType =
  | 'LIBERAL_REFORMERS'
  | 'CONSERVATIVE_TRADITIONALISTS'
  | 'RADICAL_REVOLUTIONARIES'
  | 'NATIONALIST_MOVEMENT'
  | 'RELIGIOUS_FACTION'
  | 'MILITARY_JUNTA'
  | 'SEPARATISTS'
  | 'LABOR_MOVEMENT'
  | 'PEASANT_UPRISING';

// Opposition organization level
export type OrganizationLevel = 'SCATTERED' | 'NASCENT' | 'ORGANIZED' | 'MILITANT' | 'REVOLUTIONARY';

// Opposition movement
export interface OppositionMovement {
  id: string;
  type: OppositionType;
  name: string;
  leader?: string;

  // Strength
  support: number; // 0-100, popular support
  organization: OrganizationLevel;
  militancy: number; // 0-100, willingness to use violence
  resources: number; // Funding/arms

  // Goals
  demands: string[];
  ideology: string;

  // Activity
  isActive: boolean;
  inRevolt: boolean;
  controlledProvinces?: string[];

  // Relations
  foreignSupport?: string[]; // Nation IDs backing them
  alliedFactions?: string[]; // Other opposition IDs
}

// Opposition action types
export type OppositionAction =
  | 'PROPAGANDA_CAMPAIGN'
  | 'MASS_PROTEST'
  | 'GENERAL_STRIKE'
  | 'POLITICAL_ASSASSINATION'
  | 'ARMED_UPRISING'
  | 'COUP_ATTEMPT'
  | 'SABOTAGE'
  | 'FOREIGN_APPEAL';

// Government response options
export type GovernmentResponse =
  | 'IGNORE'
  | 'NEGOTIATE'
  | 'CONCESSIONS'
  | 'REFORMS'
  | 'PROPAGANDA'
  | 'INFILTRATE'
  | 'ARREST_LEADERS'
  | 'MILITARY_SUPPRESSION'
  | 'MARTIAL_LAW';

// Opposition templates by era
export const OPPOSITION_TEMPLATES: Record<string, OppositionMovement[]> = {
  ENLIGHTENMENT: [
    {
      id: 'enlightenment_reformers',
      type: 'LIBERAL_REFORMERS',
      name: 'Enlightenment Reformers',
      support: 20,
      organization: 'NASCENT',
      militancy: 10,
      resources: 30,
      demands: ['Constitutional limits on monarchy', 'Freedom of speech', 'Religious tolerance'],
      ideology: 'Liberalism',
      isActive: true,
      inRevolt: false
    },
    {
      id: 'court_conservatives',
      type: 'CONSERVATIVE_TRADITIONALISTS',
      name: 'Court Conservatives',
      support: 30,
      organization: 'ORGANIZED',
      militancy: 20,
      resources: 60,
      demands: ['Preserve noble privileges', 'Maintain church authority', 'Resist reform'],
      ideology: 'Conservatism',
      isActive: true,
      inRevolt: false
    }
  ],
  REVOLUTIONARY: [
    {
      id: 'jacobins',
      type: 'RADICAL_REVOLUTIONARIES',
      name: 'Radical Democrats',
      support: 35,
      organization: 'ORGANIZED',
      militancy: 70,
      resources: 40,
      demands: ['Republic', 'Universal suffrage', 'End aristocracy'],
      ideology: 'Radicalism',
      isActive: true,
      inRevolt: false
    },
    {
      id: 'nationalists',
      type: 'NATIONALIST_MOVEMENT',
      name: 'National Patriots',
      support: 40,
      organization: 'ORGANIZED',
      militancy: 50,
      resources: 35,
      demands: ['National unity', 'Expel foreign influence', 'Territorial integrity'],
      ideology: 'Nationalism',
      isActive: true,
      inRevolt: false
    }
  ],
  INDUSTRIAL: [
    {
      id: 'labor_unions',
      type: 'LABOR_MOVEMENT',
      name: 'Workers\' Movement',
      support: 45,
      organization: 'ORGANIZED',
      militancy: 40,
      resources: 30,
      demands: ['Eight-hour day', 'Right to organize', 'Workplace safety'],
      ideology: 'Socialism',
      isActive: true,
      inRevolt: false
    },
    {
      id: 'socialists',
      type: 'RADICAL_REVOLUTIONARIES',
      name: 'Socialist Party',
      support: 25,
      organization: 'ORGANIZED',
      militancy: 50,
      resources: 25,
      demands: ['Collective ownership', 'End capitalism', 'Workers\' state'],
      ideology: 'Marxism',
      isActive: true,
      inRevolt: false
    }
  ]
};

// Calculate opposition strength
export function calculateOppositionStrength(movement: OppositionMovement): number {
  const orgMultiplier: Record<OrganizationLevel, number> = {
    SCATTERED: 0.3,
    NASCENT: 0.5,
    ORGANIZED: 0.8,
    MILITANT: 1.0,
    REVOLUTIONARY: 1.2
  };

  return (movement.support * 0.4 + movement.militancy * 0.3 + movement.resources * 0.3)
    * orgMultiplier[movement.organization];
}

// Check if opposition takes action
export function checkOppositionAction(
  movement: OppositionMovement,
  nation: Nation
): { action: OppositionAction; narrative: string } | null {
  const strength = calculateOppositionStrength(movement);

  // Higher chance of action with low stability
  const actionChance = strength * (1 + (5 - nation.stats.stability) * 0.2);

  if (Math.random() * 100 > actionChance) return null;

  // Determine action based on militancy and organization
  let action: OppositionAction;
  let narrative: string;

  if (movement.militancy > 70 && movement.organization === 'REVOLUTIONARY') {
    action = 'ARMED_UPRISING';
    narrative = `${movement.name} has launched an armed uprising! Rebels take to the streets demanding ${movement.demands[0]}.`;
  } else if (movement.militancy > 60 && strength > 50) {
    action = 'COUP_ATTEMPT';
    narrative = `${movement.name} has attempted a coup! Military units loyal to the movement move against the government.`;
  } else if (movement.organization === 'ORGANIZED' && movement.support > 40) {
    action = 'GENERAL_STRIKE';
    narrative = `${movement.name} has called a general strike. Workers across the nation lay down their tools.`;
  } else if (movement.support > 30) {
    action = 'MASS_PROTEST';
    narrative = `${movement.name} organizes mass protests in major cities. Crowds demand ${movement.demands[0]}.`;
  } else {
    action = 'PROPAGANDA_CAMPAIGN';
    narrative = `${movement.name} spreads pamphlets and gives speeches promoting their cause.`;
  }

  return { action, narrative };
}

// Apply government response
export function applyGovernmentResponse(
  movement: OppositionMovement,
  response: GovernmentResponse,
  nation: Nation
): { updatedMovement: OppositionMovement; statChanges: Partial<NationStats>; narrative: string } {
  const updated = { ...movement };
  const statChanges: Partial<NationStats> = {};
  let narrative = '';

  switch (response) {
    case 'IGNORE':
      updated.support += 5;
      updated.organization = upgradeOrganization(updated.organization);
      narrative = `The government ignores ${movement.name}. They grow bolder.`;
      break;

    case 'NEGOTIATE':
      updated.militancy -= 10;
      statChanges.prestige = -1;
      narrative = `The government opens negotiations with ${movement.name}. Violence decreases but some see weakness.`;
      break;

    case 'CONCESSIONS':
      updated.support -= 15;
      updated.militancy -= 20;
      statChanges.stability = 1;
      narrative = `The government grants concessions to ${movement.name}. Tensions ease.`;
      break;

    case 'REFORMS':
      updated.support -= 25;
      updated.militancy -= 30;
      statChanges.stability = 1;
      statChanges.innovation = 1;
      narrative = `Major reforms address ${movement.name}'s demands. The movement loses momentum.`;
      break;

    case 'PROPAGANDA':
      updated.support -= 10;
      statChanges.prestige = 1;
      narrative = `Government propaganda counters ${movement.name}'s message.`;
      break;

    case 'INFILTRATE':
      updated.organization = downgradeOrganization(updated.organization);
      updated.resources -= 20;
      narrative = `Secret police infiltrate ${movement.name}, disrupting their operations.`;
      break;

    case 'ARREST_LEADERS':
      updated.organization = downgradeOrganization(updated.organization);
      updated.militancy += 15;
      statChanges.stability = -1;
      narrative = `${movement.name} leaders are arrested. The movement is disrupted but radicalized.`;
      break;

    case 'MILITARY_SUPPRESSION':
      updated.support -= 20;
      updated.resources -= 40;
      updated.militancy += 25;
      statChanges.stability = -1;
      statChanges.prestige = -1;
      narrative = `The military crushes ${movement.name} protests. Blood is spilled in the streets.`;
      break;

    case 'MARTIAL_LAW':
      updated.isActive = false;
      updated.support -= 30;
      statChanges.stability = -2;
      statChanges.economy = -1;
      narrative = `Martial law declared. ${movement.name} is driven underground, but at great cost.`;
      break;
  }

  // Clamp values
  updated.support = Math.max(0, Math.min(100, updated.support));
  updated.militancy = Math.max(0, Math.min(100, updated.militancy));
  updated.resources = Math.max(0, Math.min(100, updated.resources));

  return { updatedMovement: updated, statChanges, narrative };
}

// Organization level transitions
function upgradeOrganization(level: OrganizationLevel): OrganizationLevel {
  const levels: OrganizationLevel[] = ['SCATTERED', 'NASCENT', 'ORGANIZED', 'MILITANT', 'REVOLUTIONARY'];
  const idx = levels.indexOf(level);
  return idx < levels.length - 1 ? levels[idx + 1] : level;
}

function downgradeOrganization(level: OrganizationLevel): OrganizationLevel {
  const levels: OrganizationLevel[] = ['SCATTERED', 'NASCENT', 'ORGANIZED', 'MILITANT', 'REVOLUTIONARY'];
  const idx = levels.indexOf(level);
  return idx > 0 ? levels[idx - 1] : level;
}

// Check for revolution trigger
export function checkRevolutionTrigger(
  movements: OppositionMovement[],
  nation: Nation
): { revolution: boolean; leader: OppositionMovement | null; narrative: string } {
  // Find strongest revolutionary movement
  const revolutionaries = movements.filter(m =>
    m.organization === 'REVOLUTIONARY' &&
    m.militancy > 70 &&
    m.support > 50
  );

  if (revolutionaries.length === 0) {
    return { revolution: false, leader: null, narrative: '' };
  }

  // Check trigger conditions
  const strongest = revolutionaries.reduce((a, b) =>
    calculateOppositionStrength(a) > calculateOppositionStrength(b) ? a : b
  );

  const triggerChance = calculateOppositionStrength(strongest) *
    (6 - nation.stats.stability) *
    (6 - nation.stats.military) / 100;

  if (Math.random() * 100 < triggerChance) {
    return {
      revolution: true,
      leader: strongest,
      narrative: `REVOLUTION! ${strongest.name} has seized power! The old regime falls as ${strongest.leader || 'revolutionary forces'} takes control.`
    };
  }

  return { revolution: false, leader: null, narrative: '' };
}

// Generate opposition for nation
export function initializeOpposition(nationId: string, era: string): OppositionMovement[] {
  const templates = OPPOSITION_TEMPLATES[era] || OPPOSITION_TEMPLATES.ENLIGHTENMENT;

  return templates.map(t => ({
    ...t,
    id: `${nationId}_${t.id}`,
    support: t.support + Math.floor(Math.random() * 20) - 10,
    resources: t.resources + Math.floor(Math.random() * 20) - 10
  }));
}

// Simulate opposition activity for a year
export function simulateOppositionYear(
  movements: OppositionMovement[],
  nation: Nation,
  year: number
): { updated: OppositionMovement[]; events: string[] } {
  const events: string[] = [];
  const updated: OppositionMovement[] = [];

  for (const movement of movements) {
    const m = { ...movement };

    // Natural growth/decay
    if (nation.stats.stability <= 2) {
      m.support += 5;
      m.militancy += 3;
    } else if (nation.stats.stability >= 4) {
      m.support -= 3;
      m.militancy -= 2;
    }

    // Economic conditions affect labor movements
    if (m.type === 'LABOR_MOVEMENT' && nation.stats.economy <= 2) {
      m.support += 10;
      events.push(`Economic hardship swells support for ${m.name}.`);
    }

    // Check for spontaneous action
    const action = checkOppositionAction(m, nation);
    if (action) {
      events.push(action.narrative);

      // Actions increase militancy
      m.militancy += 5;
    }

    // Clamp values
    m.support = Math.max(0, Math.min(100, m.support));
    m.militancy = Math.max(0, Math.min(100, m.militancy));

    updated.push(m);
  }

  return { updated, events };
}

// Get narrative for opposition state
export function getOppositionNarrative(movements: OppositionMovement[]): string {
  const active = movements.filter(m => m.isActive && m.support > 20);

  if (active.length === 0) {
    return 'Political opposition remains quiet.';
  }

  const strongest = active.reduce((a, b) => a.support > b.support ? a : b);

  let narrative = `${strongest.name} leads the opposition with ${strongest.support}% support. `;

  if (strongest.militancy > 60) {
    narrative += 'They grow increasingly radical. ';
  }

  if (strongest.organization === 'REVOLUTIONARY') {
    narrative += 'Revolution may be imminent!';
  } else if (strongest.organization === 'MILITANT') {
    narrative += 'Armed resistance is possible.';
  }

  return narrative;
}
