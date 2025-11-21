import { Diplomacy, DiplomaticRelation, CasusBelli } from '../types';

// ==================== HISTORICAL DIPLOMATIC RELATIONS (1750) ====================

// Helper to create relations
const createRelation = (
  targetNationId: string,
  stance: DiplomaticRelation['stance'],
  opinion: number,
  relations: DiplomaticRelation['relations'],
  modifiers: DiplomaticRelation['modifiers'] = [],
  historicalContext?: string
): DiplomaticRelation => ({
  targetNationId,
  stance,
  opinion,
  relations,
  modifiers,
  historicalContext
});

// ==================== BRITAIN ====================
export const BRITAIN_DIPLOMACY_1750: Diplomacy = {
  relations: [
    createRelation('france', 'HOSTILE', -60, ['RIVALRY'], [
      { name: 'Colonial Rivalry', value: -30 },
      { name: 'Historical Enemy', value: -20 },
      { name: 'Trade Competition', value: -10 }
    ], 'Centuries of conflict over European dominance and colonial empire'),

    createRelation('prussia', 'CORDIAL', 40, ['TRADE_AGREEMENT'], [
      { name: 'Common Enemy (France)', value: +20 },
      { name: 'Protestant Solidarity', value: +10 }
    ], 'Growing friendship against French hegemony'),

    createRelation('russia', 'NEUTRAL', 10, [], [
      { name: 'Trade Partners', value: +10 }
    ], 'Distant but growing trade relationship'),

    createRelation('ottoman', 'NEUTRAL', 0, [], [
      { name: 'Trade Interests', value: +5 }
    ], 'Commercial relations in the Levant'),

    createRelation('spain', 'COOL', -20, ['RIVALRY'], [
      { name: 'Colonial Competition', value: -20 }
    ], 'Competing for colonies in the Americas'),

    createRelation('qing', 'NEUTRAL', -5, ['TRADE_AGREEMENT'], [
      { name: 'Trade Imbalance', value: -10 },
      { name: 'Canton Trade', value: +5 }
    ], 'Limited trade through Canton')
  ],
  reputation: 30,
  aggressiveExpansion: 20,
  availableCasusBelli: []
};

// ==================== FRANCE ====================
export const FRANCE_DIPLOMACY_1750: Diplomacy = {
  relations: [
    createRelation('britain', 'HOSTILE', -60, ['RIVALRY'], [
      { name: 'Colonial Rivalry', value: -30 },
      { name: 'Historical Enemy', value: -20 },
      { name: 'Trade Competition', value: -10 }
    ], 'The eternal enemy across the Channel'),

    createRelation('prussia', 'COOL', -30, [], [
      { name: 'Rising Threat', value: -20 },
      { name: 'Silesian Wars', value: -10 }
    ], 'Wary of Prussian military power'),

    createRelation('russia', 'CORDIAL', 35, ['DEFENSIVE_PACT'], [
      { name: 'Alliance Against Prussia', value: +25 },
      { name: 'Diplomatic Reversal', value: +10 }
    ], 'The Diplomatic Revolution brings new allies'),

    createRelation('ottoman', 'FRIENDLY', 50, ['TRADE_AGREEMENT', 'NON_AGGRESSION'], [
      { name: 'Capitulations', value: +30 },
      { name: 'Alliance of Convenience', value: +20 }
    ], 'Traditional ally against Habsburg Austria'),

    createRelation('spain', 'FRIENDLY', 60, ['ALLIANCE', 'ROYAL_MARRIAGE'], [
      { name: 'Family Compact', value: +40 },
      { name: 'Bourbon Dynasty', value: +20 }
    ], 'The Bourbon Family Compact unites the crowns'),

    createRelation('qing', 'NEUTRAL', 0, [], [], 'Minimal direct contact')
  ],
  reputation: 40,
  aggressiveExpansion: 35,
  availableCasusBelli: []
};

// ==================== PRUSSIA ====================
export const PRUSSIA_DIPLOMACY_1750: Diplomacy = {
  relations: [
    createRelation('britain', 'CORDIAL', 40, ['TRADE_AGREEMENT'], [
      { name: 'Common Enemy (France)', value: +20 },
      { name: 'Protestant Solidarity', value: +10 },
      { name: 'Hanoverian Connection', value: +10 }
    ], 'Natural allies against France and Austria'),

    createRelation('france', 'COOL', -30, [], [
      { name: 'Rising Threat', value: -20 },
      { name: 'Silesian Wars', value: -10 }
    ], 'Former ally turned rival'),

    createRelation('russia', 'HOSTILE', -50, ['RIVALRY'], [
      { name: 'Elizabeth\'s Hatred', value: -40 },
      { name: 'Territorial Ambitions', value: -10 }
    ], 'Empress Elizabeth despises Frederick'),

    createRelation('ottoman', 'NEUTRAL', 5, [], [], 'Distant but not unfriendly'),

    createRelation('spain', 'NEUTRAL', 0, [], [], 'No significant relations'),

    createRelation('qing', 'NEUTRAL', 0, [], [], 'No direct relations')
  ],
  reputation: 20,
  aggressiveExpansion: 45,
  availableCasusBelli: [
    {
      type: 'RECONQUEST',
      name: 'Silesian Claim',
      wargoal: 'Defend Silesia from Austrian reconquest',
      aggressiveExpansion: 5
    }
  ]
};

// ==================== RUSSIA ====================
export const RUSSIA_DIPLOMACY_1750: Diplomacy = {
  relations: [
    createRelation('britain', 'NEUTRAL', 10, [], [
      { name: 'Trade Partners', value: +10 }
    ], 'Growing commercial ties'),

    createRelation('france', 'CORDIAL', 35, ['DEFENSIVE_PACT'], [
      { name: 'Alliance Against Prussia', value: +25 },
      { name: 'Diplomatic Reversal', value: +10 }
    ], 'United against Frederick\'s Prussia'),

    createRelation('prussia', 'HOSTILE', -50, ['RIVALRY'], [
      { name: 'Elizabeth\'s Hatred', value: -40 },
      { name: 'Territorial Ambitions', value: -10 }
    ], 'The Empress seeks to crush Prussia'),

    createRelation('ottoman', 'HOSTILE', -40, ['RIVALRY'], [
      { name: 'Black Sea Ambitions', value: -30 },
      { name: 'Orthodox Protector', value: -10 }
    ], 'Constant wars over the Black Sea'),

    createRelation('spain', 'NEUTRAL', 0, [], [], 'No significant relations'),

    createRelation('qing', 'COOL', -10, [], [
      { name: 'Border Disputes', value: -10 }
    ], 'Tension along the Siberian frontier')
  ],
  reputation: 25,
  aggressiveExpansion: 30,
  availableCasusBelli: [
    {
      type: 'HOLY_WAR',
      name: 'Protector of the Orthodox',
      wargoal: 'Liberate Orthodox Christians from Ottoman rule',
      aggressiveExpansion: 15
    }
  ]
};

// ==================== OTTOMAN ====================
export const OTTOMAN_DIPLOMACY_1750: Diplomacy = {
  relations: [
    createRelation('britain', 'NEUTRAL', 0, [], [
      { name: 'Trade Interests', value: +5 }
    ], 'Commercial relations'),

    createRelation('france', 'FRIENDLY', 50, ['TRADE_AGREEMENT', 'NON_AGGRESSION'], [
      { name: 'Capitulations', value: +30 },
      { name: 'Alliance of Convenience', value: +20 }
    ], 'France: the traditional Christian ally'),

    createRelation('prussia', 'NEUTRAL', 5, [], [], 'Distant but cordial'),

    createRelation('russia', 'HOSTILE', -40, ['RIVALRY'], [
      { name: 'Black Sea Wars', value: -30 },
      { name: 'Orthodox Rebellion', value: -10 }
    ], 'The eternal enemy from the north'),

    createRelation('spain', 'COOL', -15, [], [
      { name: 'Mediterranean Rivalry', value: -15 }
    ], 'Old Mediterranean rivals'),

    createRelation('qing', 'NEUTRAL', 0, [], [], 'No direct relations')
  ],
  reputation: 35,
  aggressiveExpansion: 15,
  availableCasusBelli: []
};

// ==================== SPAIN ====================
export const SPAIN_DIPLOMACY_1750: Diplomacy = {
  relations: [
    createRelation('britain', 'COOL', -20, ['RIVALRY'], [
      { name: 'Colonial Competition', value: -20 }
    ], 'Competing for colonial dominance'),

    createRelation('france', 'FRIENDLY', 60, ['ALLIANCE', 'ROYAL_MARRIAGE'], [
      { name: 'Family Compact', value: +40 },
      { name: 'Bourbon Dynasty', value: +20 }
    ], 'United by blood and interest'),

    createRelation('prussia', 'NEUTRAL', 0, [], [], 'No significant relations'),

    createRelation('russia', 'NEUTRAL', 0, [], [], 'No significant relations'),

    createRelation('ottoman', 'COOL', -15, [], [
      { name: 'Mediterranean Rivalry', value: -15 }
    ], 'Old enemies in the Mediterranean'),

    createRelation('qing', 'NEUTRAL', 5, ['TRADE_AGREEMENT'], [
      { name: 'Manila Trade', value: +5 }
    ], 'Trade through the Philippines')
  ],
  reputation: 30,
  aggressiveExpansion: 20,
  availableCasusBelli: []
};

// ==================== QING ====================
export const QING_DIPLOMACY_1750: Diplomacy = {
  relations: [
    createRelation('britain', 'NEUTRAL', -5, ['TRADE_AGREEMENT'], [
      { name: 'Trade Imbalance', value: -10 },
      { name: 'Canton Trade', value: +5 }
    ], 'Barbarian traders from the West'),

    createRelation('france', 'NEUTRAL', 0, [], [], 'Distant Western nation'),

    createRelation('prussia', 'NEUTRAL', 0, [], [], 'Unknown distant land'),

    createRelation('russia', 'COOL', -10, [], [
      { name: 'Border Tensions', value: -10 }
    ], 'Northern barbarians pressing on the frontier'),

    createRelation('ottoman', 'NEUTRAL', 0, [], [], 'Far western Islamic state'),

    createRelation('spain', 'NEUTRAL', 5, ['TRADE_AGREEMENT'], [
      { name: 'Manila Trade', value: +5 }
    ], 'Trade through the Spanish Philippines')
  ],
  reputation: 50,
  aggressiveExpansion: 10,
  availableCasusBelli: [
    {
      type: 'IMPERIAL',
      name: 'Mandate of Heaven',
      wargoal: 'Subjugate tributary states',
      aggressiveExpansion: 5
    }
  ]
};

// ==================== HELPER FUNCTIONS ====================

export const INITIAL_DIPLOMACY: Record<string, Diplomacy> = {
  britain: BRITAIN_DIPLOMACY_1750,
  france: FRANCE_DIPLOMACY_1750,
  prussia: PRUSSIA_DIPLOMACY_1750,
  russia: RUSSIA_DIPLOMACY_1750,
  ottoman: OTTOMAN_DIPLOMACY_1750,
  spain: SPAIN_DIPLOMACY_1750,
  qing: QING_DIPLOMACY_1750
};

export const getInitialDiplomacy = (nationId: string): Diplomacy | undefined => {
  return INITIAL_DIPLOMACY[nationId];
};

export const getRelationWith = (diplomacy: Diplomacy, targetId: string): DiplomaticRelation | undefined => {
  return diplomacy.relations.find(r => r.targetNationId === targetId);
};

export const getStanceColor = (stance: DiplomaticRelation['stance']): string => {
  const colors: Record<DiplomaticRelation['stance'], string> = {
    'FRIENDLY': 'text-green-600',
    'CORDIAL': 'text-green-400',
    'NEUTRAL': 'text-stone-400',
    'COOL': 'text-yellow-500',
    'HOSTILE': 'text-red-500',
    'AT_WAR': 'text-red-700'
  };
  return colors[stance];
};

export const getOpinionDescription = (opinion: number): string => {
  if (opinion >= 75) return 'Excellent';
  if (opinion >= 50) return 'Good';
  if (opinion >= 25) return 'Positive';
  if (opinion >= 0) return 'Neutral';
  if (opinion >= -25) return 'Poor';
  if (opinion >= -50) return 'Bad';
  return 'Terrible';
};

// Calculate opinion change from events
export const calculateOpinionChange = (
  event: 'BROKE_TREATY' | 'HONORED_ALLIANCE' | 'DECLARED_WAR' | 'GIFTED' | 'INSULTED' | 'TRADE_DEAL',
  value?: number
): number => {
  const changes: Record<string, number> = {
    'BROKE_TREATY': -40,
    'HONORED_ALLIANCE': +20,
    'DECLARED_WAR': -50,
    'GIFTED': value || +15,
    'INSULTED': -25,
    'TRADE_DEAL': +10
  };
  return changes[event] || 0;
};
