import { Nation, GovernmentType, GovernmentStructure } from '../types';
import { GOVERNMENT_TEMPLATES } from './governmentTemplates';

// ==================== PLAYER-INITIATED ACTIONS ====================

export type MajorActionType =
  | 'DECLARE_INDEPENDENCE' | 'FORM_UNION' | 'CHANGE_GOVERNMENT'
  | 'ABOLISH_MONARCHY' | 'RESTORE_MONARCHY' | 'DECLARE_EMPIRE'
  | 'ANNEX_TERRITORY' | 'RELEASE_VASSAL' | 'FORM_CONFEDERATION'
  | 'SECEDE_REGION' | 'COLONIAL_EXPANSION' | 'DECOLONIZE';

export interface MajorAction {
  type: MajorActionType;
  name: string;
  description: string;
  requirements: {
    minStability?: number;
    maxStability?: number;
    minPrestige?: number;
    minMilitary?: number;
    governmentTypes?: GovernmentType[];
    notGovernmentTypes?: GovernmentType[];
    atWar?: boolean;
    hasColonies?: boolean;
    era?: string[];
  };
  cost: {
    stability?: number;
    prestige?: number;
    economy?: number;
  };
  effects: {
    newGovernment?: GovernmentType;
    newName?: string;
    stabilityChange?: number;
    prestigeChange?: number;
    economyChange?: number;
    militaryChange?: number;
  };
  warRisk?: number; // Chance other nations declare war
  confirmationText: string;
}

// ==================== AVAILABLE ACTIONS ====================

export const MAJOR_ACTIONS: MajorAction[] = [
  // Government Changes
  {
    type: 'ABOLISH_MONARCHY',
    name: 'Abolish the Monarchy',
    description: 'Overthrow the crown and establish a republic. A radical break with tradition.',
    requirements: {
      governmentTypes: ['ABSOLUTE_MONARCHY', 'CONSTITUTIONAL_MONARCHY'],
      maxStability: 3
    },
    cost: { stability: -2, prestige: -1 },
    effects: {
      newGovernment: 'REPUBLIC',
      stabilityChange: -2,
      prestigeChange: 1
    },
    warRisk: 30,
    confirmationText: 'This will cause significant instability and may provoke foreign intervention. Proceed?'
  },
  {
    type: 'RESTORE_MONARCHY',
    name: 'Restore the Monarchy',
    description: 'Return to monarchical rule under a new dynasty or restored line.',
    requirements: {
      governmentTypes: ['REPUBLIC', 'MILITARY_JUNTA'],
      minStability: 2
    },
    cost: { prestige: -1 },
    effects: {
      newGovernment: 'CONSTITUTIONAL_MONARCHY',
      stabilityChange: 1
    },
    warRisk: 10,
    confirmationText: 'Restore monarchical government?'
  },
  {
    type: 'DECLARE_EMPIRE',
    name: 'Declare Empire',
    description: 'Proclaim an empire with yourself as emperor. A bold claim to greatness.',
    requirements: {
      minPrestige: 4,
      minMilitary: 4,
      notGovernmentTypes: ['EMPIRE']
    },
    cost: { stability: -1 },
    effects: {
      newGovernment: 'EMPIRE',
      prestigeChange: 2
    },
    warRisk: 40,
    confirmationText: 'Declaring an empire will alarm neighboring powers. Proceed?'
  },
  {
    type: 'CHANGE_GOVERNMENT',
    name: 'Constitutional Reform',
    description: 'Transition to constitutional government with limited powers.',
    requirements: {
      governmentTypes: ['ABSOLUTE_MONARCHY'],
      minStability: 3
    },
    cost: { prestige: -1 },
    effects: {
      newGovernment: 'CONSTITUTIONAL_MONARCHY',
      stabilityChange: 1,
      prestigeChange: 1
    },
    warRisk: 5,
    confirmationText: 'Grant a constitution and limit royal powers?'
  },

  // Territory & Independence
  {
    type: 'DECLARE_INDEPENDENCE',
    name: 'Declare Independence',
    description: 'Break away from overlord and establish independent nation.',
    requirements: {
      governmentTypes: ['COLONIAL'] // Or has overlord
    },
    cost: { stability: -2 },
    effects: {
      newGovernment: 'REPUBLIC',
      stabilityChange: -1,
      prestigeChange: 2
    },
    warRisk: 90,
    confirmationText: 'Declaring independence will almost certainly mean war. Proceed?'
  },
  {
    type: 'FORM_UNION',
    name: 'Form Political Union',
    description: 'Unite with allied nations to form a larger state.',
    requirements: {
      minPrestige: 3,
      minStability: 3
    },
    cost: { prestige: -1 },
    effects: {
      prestigeChange: 3,
      militaryChange: 1
    },
    warRisk: 20,
    confirmationText: 'Form a political union with allied states?'
  },
  {
    type: 'RELEASE_VASSAL',
    name: 'Grant Independence',
    description: 'Release a subject nation as an independent state.',
    requirements: {
      minStability: 2
    },
    cost: {},
    effects: {
      prestigeChange: 1,
      stabilityChange: 1
    },
    warRisk: 0,
    confirmationText: 'Grant independence to a subject territory?'
  },
  {
    type: 'ANNEX_TERRITORY',
    name: 'Annex Territory',
    description: 'Formally annex conquered or ceded territory.',
    requirements: {
      minMilitary: 3
    },
    cost: { stability: -1 },
    effects: {
      prestigeChange: 1
    },
    warRisk: 25,
    confirmationText: 'Annexing territory will increase aggressive expansion. Proceed?'
  },

  // Colonial
  {
    type: 'COLONIAL_EXPANSION',
    name: 'Colonial Expansion',
    description: 'Establish new colonies in unclaimed territories.',
    requirements: {
      minEconomy: 3,
      minMilitary: 3
    },
    cost: { economy: -1 },
    effects: {
      prestigeChange: 1,
      economyChange: 1
    },
    warRisk: 15,
    confirmationText: 'Establish new colonial holdings?'
  },
  {
    type: 'DECOLONIZE',
    name: 'Decolonize',
    description: 'Grant independence to colonial possessions.',
    requirements: {
      hasColonies: true
    },
    cost: {},
    effects: {
      economyChange: -1,
      prestigeChange: -1,
      stabilityChange: 2
    },
    warRisk: 0,
    confirmationText: 'Release colonial territories?'
  }
];

// ==================== HELPER FUNCTIONS ====================

export const getAvailableActions = (nation: Nation): MajorAction[] => {
  return MAJOR_ACTIONS.filter(action => {
    const req = action.requirements;

    // Check stability
    if (req.minStability && nation.stats.stability < req.minStability) return false;
    if (req.maxStability && nation.stats.stability > req.maxStability) return false;

    // Check other stats
    if (req.minPrestige && nation.stats.prestige < req.minPrestige) return false;
    if (req.minMilitary && nation.stats.military < req.minMilitary) return false;

    // Check government type
    if (req.governmentTypes && nation.government) {
      if (!req.governmentTypes.includes(nation.government.type)) return false;
    }
    if (req.notGovernmentTypes && nation.government) {
      if (req.notGovernmentTypes.includes(nation.government.type)) return false;
    }

    return true;
  });
};

export const executeAction = (
  nation: Nation,
  action: MajorAction
): { updatedNation: Nation; narrative: string } => {
  let updatedNation = { ...nation };
  let narrative = '';

  // Apply stat changes
  if (action.effects.stabilityChange) {
    updatedNation.stats = {
      ...updatedNation.stats,
      stability: Math.max(1, Math.min(5, updatedNation.stats.stability + action.effects.stabilityChange))
    };
  }
  if (action.effects.prestigeChange) {
    updatedNation.stats = {
      ...updatedNation.stats,
      prestige: Math.max(1, Math.min(5, updatedNation.stats.prestige + action.effects.prestigeChange))
    };
  }
  if (action.effects.economyChange) {
    updatedNation.stats = {
      ...updatedNation.stats,
      economy: Math.max(1, Math.min(5, updatedNation.stats.economy + action.effects.economyChange))
    };
  }
  if (action.effects.militaryChange) {
    updatedNation.stats = {
      ...updatedNation.stats,
      military: Math.max(1, Math.min(5, updatedNation.stats.military + action.effects.militaryChange))
    };
  }

  // Apply government change
  if (action.effects.newGovernment) {
    const newGovTemplate = GOVERNMENT_TEMPLATES[action.effects.newGovernment];
    updatedNation.government = newGovTemplate;

    // Generate narrative
    const govNames: Record<GovernmentType, string> = {
      'ABSOLUTE_MONARCHY': 'an absolute monarchy',
      'CONSTITUTIONAL_MONARCHY': 'a constitutional monarchy',
      'REPUBLIC': 'a republic',
      'FEDERAL_REPUBLIC': 'a federal republic',
      'EMPIRE': 'an empire',
      'THEOCRACY': 'a theocracy',
      'OLIGARCHY': 'an oligarchy',
      'MILITARY_JUNTA': 'a military junta',
      'COMMUNIST_STATE': 'a communist state',
      'FASCIST_STATE': 'a fascist state',
      'COLONIAL': 'a colonial administration'
    };

    narrative = `${nation.name} has transformed into ${govNames[action.effects.newGovernment]}!`;
  }

  // Apply name change
  if (action.effects.newName) {
    updatedNation.name = action.effects.newName;
    narrative += ` The nation is now known as ${action.effects.newName}.`;
  }

  return { updatedNation, narrative };
};

// ==================== TRANSFORMATION MODIFIERS ====================

// These modify the chance of historical transformations based on player actions
export interface TransformationModifier {
  id: string;
  effect: 'PREVENT' | 'DELAY' | 'ACCELERATE' | 'TRIGGER';
  yearsAffected: number;
  narrative: string;
}

export const calculateTransformationChance = (
  baseChance: number,
  stability: number,
  revolutionRisk: number,
  hasReforms: boolean
): number => {
  let chance = baseChance;

  // High stability reduces revolution chance
  if (stability >= 4) chance -= 40;
  else if (stability >= 3) chance -= 20;
  else if (stability <= 2) chance += 20;

  // Revolution risk modifier
  chance += (revolutionRisk - 30);

  // Reforms can prevent revolutions
  if (hasReforms) chance -= 30;

  return Math.max(0, Math.min(100, chance));
};

// Check if player can prevent an upcoming transformation
export const canPreventTransformation = (nation: Nation, transformationType: string): boolean => {
  // High stability can prevent revolutions
  if (transformationType === 'REVOLUTION' && nation.stats.stability >= 4) {
    return true;
  }

  // Reforms can prevent revolutions
  if (transformationType === 'REVOLUTION') {
    // Check if nation has implemented reforms (would need to track this)
    return false;
  }

  return false;
};
