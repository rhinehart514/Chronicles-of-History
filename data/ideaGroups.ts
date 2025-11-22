// National idea groups system

export interface IdeaGroup {
  id: string;
  name: string;
  icon: string;
  category: IdeaCategory;
  ideas: Idea[];
  traditions: IdeaEffect[];
  ambition: IdeaEffect;
  description: string;
}

export type IdeaCategory = 'administrative' | 'diplomatic' | 'military';

export interface Idea {
  id: string;
  name: string;
  cost: number;
  effects: IdeaEffect[];
  description: string;
}

export interface IdeaEffect {
  type: string;
  value: number;
}

// All idea groups
export const IDEA_GROUPS: IdeaGroup[] = [
  // Administrative Ideas
  {
    id: 'administrative',
    name: 'Administrative Ideas',
    icon: '📋',
    category: 'administrative',
    traditions: [
      { type: 'core_creation', value: -10 }
    ],
    ideas: [
      {
        id: 'bureaucracy',
        name: 'Bureaucracy',
        cost: 400,
        effects: [{ type: 'advisor_cost', value: -25 }],
        description: 'Efficient bureaucratic systems.'
      },
      {
        id: 'administrative_efficiency',
        name: 'Administrative Efficiency',
        cost: 400,
        effects: [{ type: 'core_creation', value: -10 }],
        description: 'Streamlined administration.'
      },
      {
        id: 'adaptability',
        name: 'Adaptability',
        cost: 400,
        effects: [{ type: 'culture_conversion', value: -25 }],
        description: 'Flexible governance approaches.'
      },
      {
        id: 'civil_servants',
        name: 'Civil Servants',
        cost: 400,
        effects: [{ type: 'stability_cost', value: -25 }],
        description: 'Professional civil service.'
      },
      {
        id: 'centralization',
        name: 'Centralization',
        cost: 400,
        effects: [{ type: 'governing_capacity', value: 250 }],
        description: 'Centralized state authority.'
      },
      {
        id: 'organized_mercenary_payments',
        name: 'Organized Payments',
        cost: 400,
        effects: [{ type: 'mercenary_cost', value: -25 }],
        description: 'Efficient mercenary contracts.'
      },
      {
        id: 'administrative_absolutism',
        name: 'Administrative Absolutism',
        cost: 400,
        effects: [{ type: 'administrative_efficiency', value: 5 }],
        description: 'Absolute administrative control.'
      }
    ],
    ambition: { type: 'mercenary_discipline', value: 5 },
    description: 'Focus on efficient state administration.'
  },
  {
    id: 'economic',
    name: 'Economic Ideas',
    icon: '💰',
    category: 'administrative',
    traditions: [
      { type: 'inflation_reduction', value: 0.1 }
    ],
    ideas: [
      {
        id: 'bureaucracy_econ',
        name: 'Bureaucracy',
        cost: 400,
        effects: [{ type: 'interest', value: -1 }],
        description: 'Financial bureaucracy.'
      },
      {
        id: 'organized_construction',
        name: 'Organized Construction',
        cost: 400,
        effects: [{ type: 'build_cost', value: -10 }],
        description: 'Efficient construction methods.'
      },
      {
        id: 'national_bank',
        name: 'National Bank',
        cost: 400,
        effects: [{ type: 'inflation_reduction', value: 0.1 }],
        description: 'Central banking institution.'
      },
      {
        id: 'debt_and_loans',
        name: 'Debt and Loans',
        cost: 400,
        effects: [{ type: 'loan_size', value: 50 }],
        description: 'Advanced debt instruments.'
      },
      {
        id: 'centralization_econ',
        name: 'Centralization',
        cost: 400,
        effects: [{ type: 'global_tax', value: 10 }],
        description: 'Centralized tax collection.'
      },
      {
        id: 'nationalistic_enthusiasm',
        name: 'Nationalistic Enthusiasm',
        cost: 400,
        effects: [{ type: 'land_maintenance', value: -5 }],
        description: 'Patriotic military service.'
      },
      {
        id: 'smithian_economics',
        name: 'Smithian Economics',
        cost: 400,
        effects: [{ type: 'production_efficiency', value: 10 }],
        description: 'Modern economic theory.'
      }
    ],
    ambition: { type: 'development_cost', value: -10 },
    description: 'Focus on economic growth and stability.'
  },
  {
    id: 'innovative',
    name: 'Innovative Ideas',
    icon: '💡',
    category: 'administrative',
    traditions: [
      { type: 'prestige_decay', value: -1 }
    ],
    ideas: [
      {
        id: 'patron_of_arts',
        name: 'Patron of the Arts',
        cost: 400,
        effects: [{ type: 'prestige', value: 1 }],
        description: 'Support artistic endeavors.'
      },
      {
        id: 'pragmatism',
        name: 'Pragmatism',
        cost: 400,
        effects: [{ type: 'advisor_pool', value: 1 }],
        description: 'Practical approach to problems.'
      },
      {
        id: 'scientific_revolution',
        name: 'Scientific Revolution',
        cost: 400,
        effects: [{ type: 'institution_spread', value: 25 }],
        description: 'Embrace scientific methods.'
      },
      {
        id: 'dynamic_court',
        name: 'Dynamic Court',
        cost: 400,
        effects: [{ type: 'advisor_cost', value: -25 }],
        description: 'Vibrant royal court.'
      },
      {
        id: 'print_culture',
        name: 'Print Culture',
        cost: 400,
        effects: [{ type: 'idea_cost', value: -10 }],
        description: 'Widespread printing.'
      },
      {
        id: 'optimism',
        name: 'Optimism',
        cost: 400,
        effects: [{ type: 'war_exhaustion', value: -0.05 }],
        description: 'Positive national outlook.'
      },
      {
        id: 'formalized_officer_corps',
        name: 'Formalized Officer Corps',
        cost: 400,
        effects: [{ type: 'free_leader_pool', value: 1 }],
        description: 'Professional officer training.'
      }
    ],
    ambition: { type: 'technology_cost', value: -10 },
    description: 'Focus on innovation and progress.'
  },

  // Diplomatic Ideas
  {
    id: 'diplomatic',
    name: 'Diplomatic Ideas',
    icon: '🤝',
    category: 'diplomatic',
    traditions: [
      { type: 'diplomats', value: 1 }
    ],
    ideas: [
      {
        id: 'foreign_embassies',
        name: 'Foreign Embassies',
        cost: 400,
        effects: [{ type: 'diplomatic_reputation', value: 1 }],
        description: 'Permanent diplomatic missions.'
      },
      {
        id: 'cabinet',
        name: 'Cabinet',
        cost: 400,
        effects: [{ type: 'diplomatic_upkeep', value: 1 }],
        description: 'Foreign policy cabinet.'
      },
      {
        id: 'war_cabinet',
        name: 'War Cabinet',
        cost: 400,
        effects: [{ type: 'war_exhaustion', value: -0.03 }],
        description: 'Wartime diplomatic coordination.'
      },
      {
        id: 'benign_diplomats',
        name: 'Benign Diplomats',
        cost: 400,
        effects: [{ type: 'improve_relations', value: 25 }],
        description: 'Skilled diplomatic corps.'
      },
      {
        id: 'experienced_diplomats',
        name: 'Experienced Diplomats',
        cost: 400,
        effects: [{ type: 'ae_impact', value: -20 }],
        description: 'Veteran negotiators.'
      },
      {
        id: 'flexible_negotiations',
        name: 'Flexible Negotiations',
        cost: 400,
        effects: [{ type: 'province_warscore', value: -20 }],
        description: 'Adaptable peace terms.'
      },
      {
        id: 'diplomatic_corps',
        name: 'Diplomatic Corps',
        cost: 400,
        effects: [{ type: 'diplomats', value: 1 }],
        description: 'Expanded diplomatic service.'
      }
    ],
    ambition: { type: 'diplomatic_annexation', value: -25 },
    description: 'Focus on diplomacy and relations.'
  },
  {
    id: 'trade',
    name: 'Trade Ideas',
    icon: '📦',
    category: 'diplomatic',
    traditions: [
      { type: 'merchants', value: 1 }
    ],
    ideas: [
      {
        id: 'shrewd_commerce',
        name: 'Shrewd Commerce',
        cost: 400,
        effects: [{ type: 'global_trade_power', value: 20 }],
        description: 'Aggressive trade practices.'
      },
      {
        id: 'free_trade',
        name: 'Free Trade',
        cost: 400,
        effects: [{ type: 'merchants', value: 1 }],
        description: 'Open trade policies.'
      },
      {
        id: 'merchant_adventures',
        name: 'Merchant Adventures',
        cost: 400,
        effects: [{ type: 'trade_range', value: 25 }],
        description: 'Long-distance trade ventures.'
      },
      {
        id: 'national_trade_policy',
        name: 'National Trade Policy',
        cost: 400,
        effects: [{ type: 'trade_efficiency', value: 10 }],
        description: 'Coordinated trade strategy.'
      },
      {
        id: 'overseas_merchants',
        name: 'Overseas Merchants',
        cost: 400,
        effects: [{ type: 'merchants', value: 1 }],
        description: 'Colonial trade networks.'
      },
      {
        id: 'trade_manipulation',
        name: 'Trade Manipulation',
        cost: 400,
        effects: [{ type: 'trade_steering', value: 25 }],
        description: 'Control trade flow.'
      },
      {
        id: 'fast_negotiations',
        name: 'Fast Negotiations',
        cost: 400,
        effects: [{ type: 'caravan_power', value: 25 }],
        description: 'Quick trade deals.'
      }
    ],
    ambition: { type: 'global_trade_goods_size', value: 10 },
    description: 'Focus on trade and commerce.'
  },
  {
    id: 'exploration',
    name: 'Exploration Ideas',
    icon: '🧭',
    category: 'diplomatic',
    traditions: [
      { type: 'may_explore', value: 1 }
    ],
    ideas: [
      {
        id: 'quest_for_new_world',
        name: 'Quest for the New World',
        cost: 400,
        effects: [{ type: 'colonial_range', value: 50 }],
        description: 'Seek new continents.'
      },
      {
        id: 'colonial_ventures',
        name: 'Colonial Ventures',
        cost: 400,
        effects: [{ type: 'colonists', value: 1 }],
        description: 'Fund colonial expeditions.'
      },
      {
        id: 'overseas_exploration',
        name: 'Overseas Exploration',
        cost: 400,
        effects: [{ type: 'range', value: 50 }],
        description: 'Extended naval range.'
      },
      {
        id: 'land_of_opportunity',
        name: 'Land of Opportunity',
        cost: 400,
        effects: [{ type: 'global_colonial_growth', value: 20 }],
        description: 'Attract settlers.'
      },
      {
        id: 'viceroys',
        name: 'Viceroys',
        cost: 400,
        effects: [{ type: 'global_tariffs', value: 10 }],
        description: 'Colonial administration.'
      },
      {
        id: 'free_colonies',
        name: 'Free Colonies',
        cost: 400,
        effects: [{ type: 'expel_minorities', value: 1 }],
        description: 'Colonial freedoms.'
      },
      {
        id: 'global_empire',
        name: 'Global Empire',
        cost: 400,
        effects: [{ type: 'naval_forcelimit', value: 25 }],
        description: 'Worldwide presence.'
      }
    ],
    ambition: { type: 'colonists', value: 1 },
    description: 'Focus on exploration and colonization.'
  },

  // Military Ideas
  {
    id: 'offensive',
    name: 'Offensive Ideas',
    icon: '⚔️',
    category: 'military',
    traditions: [
      { type: 'land_leader_shock', value: 1 }
    ],
    ideas: [
      {
        id: 'bayonet_leaders',
        name: 'Bayonet Leaders',
        cost: 400,
        effects: [{ type: 'land_leader_shock', value: 1 }],
        description: 'Aggressive commanders.'
      },
      {
        id: 'national_conscripts',
        name: 'National Conscripts',
        cost: 400,
        effects: [{ type: 'manpower', value: 20 }],
        description: 'Mass conscription.'
      },
      {
        id: 'superior_firepower',
        name: 'Superior Firepower',
        cost: 400,
        effects: [{ type: 'land_leader_fire', value: 1 }],
        description: 'Enhanced firepower.'
      },
      {
        id: 'glorious_arms',
        name: 'Glorious Arms',
        cost: 400,
        effects: [{ type: 'prestige_from_land', value: 100 }],
        description: 'Military prestige.'
      },
      {
        id: 'engineer_corps',
        name: 'Engineer Corps',
        cost: 400,
        effects: [{ type: 'siege_ability', value: 20 }],
        description: 'Military engineers.'
      },
      {
        id: 'grand_army',
        name: 'Grand Army',
        cost: 400,
        effects: [{ type: 'land_forcelimit', value: 15 }],
        description: 'Expanded military.'
      },
      {
        id: 'napoleonic_warfare',
        name: 'Napoleonic Warfare',
        cost: 400,
        effects: [{ type: 'discipline', value: 5 }],
        description: 'Revolutionary tactics.'
      }
    ],
    ambition: { type: 'recover_army_morale', value: 5 },
    description: 'Focus on aggressive warfare.'
  },
  {
    id: 'defensive',
    name: 'Defensive Ideas',
    icon: '🛡️',
    category: 'military',
    traditions: [
      { type: 'army_tradition', value: 0.5 }
    ],
    ideas: [
      {
        id: 'battlefield_commissions',
        name: 'Battlefield Commissions',
        cost: 400,
        effects: [{ type: 'army_tradition', value: 0.5 }],
        description: 'Merit-based promotion.'
      },
      {
        id: 'military_drill',
        name: 'Military Drill',
        cost: 400,
        effects: [{ type: 'land_morale', value: 15 }],
        description: 'Rigorous training.'
      },
      {
        id: 'improved_foraging',
        name: 'Improved Foraging',
        cost: 400,
        effects: [{ type: 'reinforce_speed', value: 33 }],
        description: 'Better logistics.'
      },
      {
        id: 'regimental_system',
        name: 'Regimental System',
        cost: 400,
        effects: [{ type: 'land_maintenance', value: -10 }],
        description: 'Efficient organization.'
      },
      {
        id: 'defensive_mentality',
        name: 'Defensive Mentality',
        cost: 400,
        effects: [{ type: 'fort_defense', value: 25 }],
        description: 'Fortification focus.'
      },
      {
        id: 'supply_trains',
        name: 'Supply Trains',
        cost: 400,
        effects: [{ type: 'reinforce_cost', value: -25 }],
        description: 'Efficient resupply.'
      },
      {
        id: 'improved_maneuver',
        name: 'Improved Maneuver',
        cost: 400,
        effects: [{ type: 'maneuver', value: 1 }],
        description: 'Better movement.'
      }
    ],
    ambition: { type: 'hostile_attrition', value: 1 },
    description: 'Focus on defensive warfare.'
  },
  {
    id: 'quality',
    name: 'Quality Ideas',
    icon: '🎖️',
    category: 'military',
    traditions: [
      { type: 'cavalry_combat', value: 10 }
    ],
    ideas: [
      {
        id: 'private_to_marshal',
        name: 'Private to Marshal',
        cost: 400,
        effects: [{ type: 'army_tradition', value: 0.5 }],
        description: 'Career advancement.'
      },
      {
        id: 'quality_education',
        name: 'Quality Education',
        cost: 400,
        effects: [{ type: 'infantry_combat', value: 10 }],
        description: 'Trained infantry.'
      },
      {
        id: 'finest_of_horses',
        name: 'Finest of Horses',
        cost: 400,
        effects: [{ type: 'cavalry_combat', value: 10 }],
        description: 'Superior cavalry.'
      },
      {
        id: 'escort_ships',
        name: 'Escort Ships',
        cost: 400,
        effects: [{ type: 'ship_durability', value: 5 }],
        description: 'Naval escorts.'
      },
      {
        id: 'naval_drill',
        name: 'Naval Drill',
        cost: 400,
        effects: [{ type: 'naval_morale', value: 10 }],
        description: 'Naval training.'
      },
      {
        id: 'copper_bottoms',
        name: 'Copper Bottoms',
        cost: 400,
        effects: [{ type: 'naval_attrition', value: -25 }],
        description: 'Ship maintenance.'
      },
      {
        id: 'massed_battery',
        name: 'Massed Battery',
        cost: 400,
        effects: [{ type: 'artillery_combat', value: 10 }],
        description: 'Artillery mastery.'
      }
    ],
    ambition: { type: 'discipline', value: 5 },
    description: 'Focus on military quality.'
  }
];

// Get idea group by id
export function getIdeaGroup(id: string): IdeaGroup | undefined {
  return IDEA_GROUPS.find(g => g.id === id);
}

// Get idea groups by category
export function getIdeaGroupsByCategory(category: IdeaCategory): IdeaGroup[] {
  return IDEA_GROUPS.filter(g => g.category === category);
}

// Calculate total idea cost
export function calculateIdeaCost(baseCost: number, modifiers: number): number {
  return Math.round(baseCost * (1 + modifiers / 100));
}

// Get all effects from unlocked ideas
export function aggregateIdeaEffects(
  groupId: string,
  unlockedCount: number
): Map<string, number> {
  const group = getIdeaGroup(groupId);
  if (!group) return new Map();

  const effects = new Map<string, number>();

  // Add traditions
  for (const effect of group.traditions) {
    effects.set(effect.type, (effects.get(effect.type) || 0) + effect.value);
  }

  // Add unlocked ideas
  for (let i = 0; i < Math.min(unlockedCount, group.ideas.length); i++) {
    for (const effect of group.ideas[i].effects) {
      effects.set(effect.type, (effects.get(effect.type) || 0) + effect.value);
    }
  }

  // Add ambition if fully unlocked
  if (unlockedCount >= group.ideas.length) {
    effects.set(group.ambition.type, (effects.get(group.ambition.type) || 0) + group.ambition.value);
  }

  return effects;
}

export default {
  IDEA_GROUPS,
  getIdeaGroup,
  getIdeaGroupsByCategory,
  calculateIdeaCost,
  aggregateIdeaEffects
};
