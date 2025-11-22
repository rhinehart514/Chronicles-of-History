// Diplomatic actions and relations system

export interface DiplomaticAction {
  id: string;
  name: string;
  icon: string;
  category: ActionCategory;
  cost: ActionCost;
  requirements: ActionRequirement[];
  effects: ActionEffect[];
  cooldown?: number;
  description: string;
}

export type ActionCategory = 'alliance' | 'vassalage' | 'war' | 'trade' | 'influence' | 'dynasty';

export interface ActionCost {
  diplomatic_power?: number;
  prestige?: number;
  gold?: number;
  favors?: number;
}

export interface ActionRequirement {
  type: string;
  value: number | string | boolean;
  operator?: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
}

export interface ActionEffect {
  type: string;
  value: number | string;
  duration?: number;
}

export interface RelationModifier {
  source: string;
  value: number;
  decayPerYear: number;
  maxDuration?: number;
}

// All diplomatic actions
export const DIPLOMATIC_ACTIONS: DiplomaticAction[] = [
  // Alliance actions
  {
    id: 'form_alliance',
    name: 'Form Alliance',
    icon: '🤝',
    category: 'alliance',
    cost: { diplomatic_power: 0 },
    requirements: [
      { type: 'relations', value: 80, operator: 'gte' },
      { type: 'not_rival', value: true },
      { type: 'not_at_war', value: true }
    ],
    effects: [
      { type: 'alliance', value: 'formed' }
    ],
    description: 'Form a mutual defense alliance with this nation.'
  },
  {
    id: 'break_alliance',
    name: 'Break Alliance',
    icon: '💔',
    category: 'alliance',
    cost: { prestige: -25 },
    requirements: [
      { type: 'has_alliance', value: true }
    ],
    effects: [
      { type: 'alliance', value: 'broken' },
      { type: 'relations', value: -100 },
      { type: 'trust', value: -30 }
    ],
    cooldown: 60,
    description: 'End the alliance with this nation.'
  },
  {
    id: 'call_to_arms',
    name: 'Call to Arms',
    icon: '📯',
    category: 'alliance',
    cost: { favors: 10 },
    requirements: [
      { type: 'has_alliance', value: true },
      { type: 'at_war', value: true }
    ],
    effects: [
      { type: 'join_war', value: 'ally' }
    ],
    description: 'Request your ally to join your war.'
  },

  // Vassalage actions
  {
    id: 'offer_vassalization',
    name: 'Offer Vassalization',
    icon: '👑',
    category: 'vassalage',
    cost: { diplomatic_power: 50 },
    requirements: [
      { type: 'relations', value: 190, operator: 'gte' },
      { type: 'target_size', value: 100, operator: 'lt' }
    ],
    effects: [
      { type: 'vassal', value: 'created' }
    ],
    description: 'Offer to make this nation your vassal.'
  },
  {
    id: 'annex_vassal',
    name: 'Annex Vassal',
    icon: '🏰',
    category: 'vassalage',
    cost: { diplomatic_power: 1, gold: 0 },
    requirements: [
      { type: 'is_vassal', value: true },
      { type: 'vassal_years', value: 10, operator: 'gte' },
      { type: 'vassal_relations', value: 190, operator: 'gte' }
    ],
    effects: [
      { type: 'annex', value: 'complete' }
    ],
    description: 'Integrate the vassal into your nation.'
  },
  {
    id: 'release_vassal',
    name: 'Release Vassal',
    icon: '🗝️',
    category: 'vassalage',
    cost: { prestige: -10 },
    requirements: [
      { type: 'is_vassal', value: true }
    ],
    effects: [
      { type: 'independence', value: 'granted' },
      { type: 'relations', value: 100 }
    ],
    description: 'Grant independence to your vassal.'
  },

  // War actions
  {
    id: 'declare_war',
    name: 'Declare War',
    icon: '⚔️',
    category: 'war',
    cost: { stability: -1 },
    requirements: [
      { type: 'has_cb', value: true },
      { type: 'truce', value: false }
    ],
    effects: [
      { type: 'war', value: 'declared' }
    ],
    description: 'Declare war on this nation.'
  },
  {
    id: 'offer_peace',
    name: 'Offer Peace',
    icon: '🕊️',
    category: 'war',
    cost: {},
    requirements: [
      { type: 'at_war', value: true }
    ],
    effects: [
      { type: 'peace_offer', value: 'sent' }
    ],
    description: 'Send a peace offer to end the war.'
  },
  {
    id: 'demand_tribute',
    name: 'Demand Tribute',
    icon: '💰',
    category: 'war',
    cost: { diplomatic_power: 20 },
    requirements: [
      { type: 'relative_power', value: 2, operator: 'gt' }
    ],
    effects: [
      { type: 'tribute', value: 'demanded' }
    ],
    description: 'Demand tribute payment from a weaker nation.'
  },

  // Trade actions
  {
    id: 'request_trade_agreement',
    name: 'Trade Agreement',
    icon: '📦',
    category: 'trade',
    cost: { diplomatic_power: 20 },
    requirements: [
      { type: 'relations', value: 0, operator: 'gte' }
    ],
    effects: [
      { type: 'trade_agreement', value: 'formed' },
      { type: 'trade_power', value: 10 }
    ],
    description: 'Establish a trade agreement for mutual benefit.'
  },
  {
    id: 'embargo',
    name: 'Embargo',
    icon: '🚫',
    category: 'trade',
    cost: { diplomatic_power: 25 },
    requirements: [
      { type: 'relations', value: 0, operator: 'lt' }
    ],
    effects: [
      { type: 'embargo', value: 'active' },
      { type: 'trade_power', value: -50 }
    ],
    description: 'Embargo trade with this nation.'
  },
  {
    id: 'transfer_trade_power',
    name: 'Transfer Trade Power',
    icon: '💱',
    category: 'trade',
    cost: { diplomatic_power: 30 },
    requirements: [
      { type: 'is_vassal', value: true }
    ],
    effects: [
      { type: 'trade_power_transfer', value: 50 }
    ],
    description: 'Have your subject transfer trade power to you.'
  },

  // Influence actions
  {
    id: 'improve_relations',
    name: 'Improve Relations',
    icon: '❤️',
    category: 'influence',
    cost: { diplomatic_power: 0 },
    requirements: [],
    effects: [
      { type: 'relations', value: 3, duration: -1 }
    ],
    description: 'Send a diplomat to improve relations.'
  },
  {
    id: 'insult',
    name: 'Insult',
    icon: '😠',
    category: 'influence',
    cost: { prestige: 5 },
    requirements: [
      { type: 'is_rival', value: true }
    ],
    effects: [
      { type: 'relations', value: -50 },
      { type: 'prestige', value: 5 }
    ],
    cooldown: 60,
    description: 'Insult your rival for prestige.'
  },
  {
    id: 'guarantee',
    name: 'Guarantee Independence',
    icon: '🛡️',
    category: 'influence',
    cost: { diplomatic_power: 10 },
    requirements: [
      { type: 'target_size', value: 50, operator: 'lt' }
    ],
    effects: [
      { type: 'guarantee', value: 'active' }
    ],
    description: 'Guarantee this nation against aggression.'
  },
  {
    id: 'warn',
    name: 'Warn',
    icon: '⚠️',
    category: 'influence',
    cost: {},
    requirements: [
      { type: 'shares_border', value: true }
    ],
    effects: [
      { type: 'warning', value: 'active' }
    ],
    description: 'Warn this nation not to attack neighbors.'
  },

  // Dynasty actions
  {
    id: 'royal_marriage',
    name: 'Royal Marriage',
    icon: '💍',
    category: 'dynasty',
    cost: {},
    requirements: [
      { type: 'relations', value: 0, operator: 'gte' },
      { type: 'is_monarchy', value: true }
    ],
    effects: [
      { type: 'royal_marriage', value: 'formed' },
      { type: 'relations', value: 25 }
    ],
    description: 'Arrange a royal marriage between dynasties.'
  },
  {
    id: 'claim_throne',
    name: 'Claim Throne',
    icon: '👑',
    category: 'dynasty',
    cost: { diplomatic_power: 50, prestige: -20 },
    requirements: [
      { type: 'royal_marriage', value: true },
      { type: 'weak_heir', value: true }
    ],
    effects: [
      { type: 'throne_claim', value: 'active' },
      { type: 'relations', value: -100 }
    ],
    description: 'Claim their throne for your dynasty.'
  },
  {
    id: 'support_heir',
    name: 'Support Heir',
    icon: '🤴',
    category: 'dynasty',
    cost: { diplomatic_power: 20 },
    requirements: [
      { type: 'elective_monarchy', value: true }
    ],
    effects: [
      { type: 'heir_support', value: 20 }
    ],
    description: 'Support a candidate in elective succession.'
  }
];

// Common relation modifiers
export const RELATION_MODIFIERS: RelationModifier[] = [
  { source: 'Allied', value: 50, decayPerYear: 0 },
  { source: 'Royal Marriage', value: 25, decayPerYear: 0 },
  { source: 'Trade Agreement', value: 15, decayPerYear: 0 },
  { source: 'Guarantee', value: 10, decayPerYear: 0 },
  { source: 'Recent War', value: -100, decayPerYear: 5, maxDuration: 20 },
  { source: 'Insulted', value: -50, decayPerYear: 5, maxDuration: 10 },
  { source: 'Broke Alliance', value: -100, decayPerYear: 2, maxDuration: 50 },
  { source: 'Dishonored Call', value: -75, decayPerYear: 2, maxDuration: 30 }
];

// Get action by id
export function getAction(id: string): DiplomaticAction | undefined {
  return DIPLOMATIC_ACTIONS.find(a => a.id === id);
}

// Get actions by category
export function getActionsByCategory(category: ActionCategory): DiplomaticAction[] {
  return DIPLOMATIC_ACTIONS.filter(a => a.category === category);
}

// Check if action requirements are met
export function canPerformAction(
  action: DiplomaticAction,
  gameState: Record<string, any>
): boolean {
  for (const req of action.requirements) {
    const value = gameState[req.type];
    if (value === undefined) continue;

    switch (req.operator) {
      case 'gt':
        if (value <= req.value) return false;
        break;
      case 'lt':
        if (value >= req.value) return false;
        break;
      case 'gte':
        if (value < req.value) return false;
        break;
      case 'lte':
        if (value > req.value) return false;
        break;
      default:
        if (value !== req.value) return false;
    }
  }
  return true;
}

// Calculate total relations
export function calculateTotalRelations(modifiers: RelationModifier[]): number {
  return Math.max(-200, Math.min(200,
    modifiers.reduce((sum, m) => sum + m.value, 0)
  ));
}

// Get relation description
export function getRelationDescription(relations: number): string {
  if (relations >= 150) return 'Excellent';
  if (relations >= 100) return 'Very Good';
  if (relations >= 50) return 'Good';
  if (relations >= 0) return 'Neutral';
  if (relations >= -50) return 'Poor';
  if (relations >= -100) return 'Bad';
  return 'Hostile';
}

// Get relation color
export function getRelationColor(relations: number): string {
  if (relations >= 100) return 'text-green-400';
  if (relations >= 50) return 'text-green-300';
  if (relations >= 0) return 'text-stone-400';
  if (relations >= -50) return 'text-amber-400';
  return 'text-red-400';
}

export default {
  DIPLOMATIC_ACTIONS,
  RELATION_MODIFIERS,
  getAction,
  getActionsByCategory,
  canPerformAction,
  calculateTotalRelations,
  getRelationDescription,
  getRelationColor
};
