// Idea groups data

export interface Idea {
  id: string;
  name: string;
  effects: Record<string, number>;
}

export interface IdeaGroup {
  id: string;
  name: string;
  category: 'administrative' | 'diplomatic' | 'military';
  ideas: Idea[];
  bonus: Record<string, number>;
  triggerEffect?: string;
}

export const ideaGroups: Record<string, IdeaGroup> = {
  // Administrative idea groups
  administrative: {
    id: 'administrative',
    name: 'Administrative Ideas',
    category: 'administrative',
    ideas: [
      { id: 'adm_1', name: 'Organized Mercenary Payments', effects: { mercenaryMaintenance: -0.25 } },
      { id: 'adm_2', name: 'Administrative Efficiency', effects: { coreCost: -0.1 } },
      { id: 'adm_3', name: 'Benefits of Bankruptcy', effects: { interestPerAnnum: -0.5 } },
      { id: 'adm_4', name: 'Bookkeeping', effects: { mercenaryMaintenance: -0.25 } },
      { id: 'adm_5', name: 'Civil Service', effects: { advisorCost: -0.1 } },
      { id: 'adm_6', name: 'Administrative Centralization', effects: { stateMaintenance: -0.25 } },
      { id: 'adm_7', name: 'Adaptability', effects: { coreCost: -0.15 } },
    ],
    bonus: { mercenaryDiscipline: 0.05 },
  },

  innovative: {
    id: 'innovative',
    name: 'Innovative Ideas',
    category: 'administrative',
    ideas: [
      { id: 'inn_1', name: 'Patron of the Arts', effects: { prestigeDecay: -0.01 } },
      { id: 'inn_2', name: 'Empiricism', effects: { institutionSpread: 0.25 } },
      { id: 'inn_3', name: 'Scientific Revolution', effects: { techCost: -0.1 } },
      { id: 'inn_4', name: 'Dynamic Court', effects: { advisorCost: -0.1 } },
      { id: 'inn_5', name: 'Print Culture', effects: { ideaCost: -0.1 } },
      { id: 'inn_6', name: 'Optimism', effects: { warExhaustion: -0.05 } },
      { id: 'inn_7', name: 'Formalized Officer Corps', effects: { leaderCost: -1 } },
    ],
    bonus: { advisorPool: 1 },
  },

  religious: {
    id: 'religious',
    name: 'Religious Ideas',
    category: 'administrative',
    ideas: [
      { id: 'rel_1', name: 'Deus Vult', effects: { casusBelli: 1 } },
      { id: 'rel_2', name: 'Missionary Schools', effects: { missionaryStrength: 0.01 } },
      { id: 'rel_3', name: 'Church Attendance Duty', effects: { stabilityBoost: 1 } },
      { id: 'rel_4', name: 'Divine Supremacy', effects: { missionaryStrength: 0.01 } },
      { id: 'rel_5', name: 'Devoutness', effects: { papalInfluence: 2 } },
      { id: 'rel_6', name: 'Religious Tradition', effects: { missionaries: 1 } },
      { id: 'rel_7', name: 'Inquisition', effects: { toleranceHeretic: -2, missionaryStrength: 0.02 } },
    ],
    bonus: { culturalConversionCost: -0.25 },
  },

  // Diplomatic idea groups
  diplomatic: {
    id: 'diplomatic',
    name: 'Diplomatic Ideas',
    category: 'diplomatic',
    ideas: [
      { id: 'dip_1', name: 'Grand Banquets', effects: { improveRelations: 0.3 } },
      { id: 'dip_2', name: 'Foreign Embassies', effects: { diplomats: 1 } },
      { id: 'dip_3', name: 'Cabinet', effects: { diplomaticRelations: 1 } },
      { id: 'dip_4', name: 'Benign Diplomats', effects: { improveRelations: 0.3 } },
      { id: 'dip_5', name: 'Experienced Diplomats', effects: { diplomaticReputation: 2 } },
      { id: 'dip_6', name: 'Flexible Negotiations', effects: { provincesWarScoreCost: -0.2 } },
      { id: 'dip_7', name: 'Diplomatic Corps', effects: { dipRelations: 1 } },
    ],
    bonus: { diplomaticRelations: 1 },
  },

  trade: {
    id: 'trade',
    name: 'Trade Ideas',
    category: 'diplomatic',
    ideas: [
      { id: 'tra_1', name: 'Shrewd Commerce Practice', effects: { tradeEfficiency: 0.1 } },
      { id: 'tra_2', name: 'Free Trade', effects: { merchants: 1 } },
      { id: 'tra_3', name: 'Merchant Adventures', effects: { tradeRange: 0.25 } },
      { id: 'tra_4', name: 'National Trade Policy', effects: { tradeSteering: 0.25 } },
      { id: 'tra_5', name: 'Overseas Merchants', effects: { merchants: 1 } },
      { id: 'tra_6', name: 'Trade Manipulation', effects: { tradeEfficiency: 0.1 } },
      { id: 'tra_7', name: 'Fast Negotiations', effects: { caravan: 0.33 } },
    ],
    bonus: { merchants: 1 },
  },

  exploration: {
    id: 'exploration',
    name: 'Exploration Ideas',
    category: 'diplomatic',
    ideas: [
      { id: 'exp_1', name: 'Quest for the New World', effects: { explorers: 1 } },
      { id: 'exp_2', name: 'Colonial Ventures', effects: { colonists: 1 } },
      { id: 'exp_3', name: 'Overseas Exploration', effects: { colonialRange: 0.5 } },
      { id: 'exp_4', name: 'Land of Opportunity', effects: { globalSettlerIncrease: 10 } },
      { id: 'exp_5', name: 'Viceroys', effects: { tariffs: 0.1 } },
      { id: 'exp_6', name: 'Free Colonies', effects: { globalSettlerIncrease: 10 } },
      { id: 'exp_7', name: 'Global Empire', effects: { navalForceLimit: 0.25 } },
    ],
    bonus: { colonists: 1 },
  },

  // Military idea groups
  offensive: {
    id: 'offensive',
    name: 'Offensive Ideas',
    category: 'military',
    ideas: [
      { id: 'off_1', name: 'Bayonet Leaders', effects: { landLeaderShock: 1 } },
      { id: 'off_2', name: 'National Conscripts', effects: { forceLimit: 0.2 } },
      { id: 'off_3', name: 'Superior Firepower', effects: { landLeaderFire: 1 } },
      { id: 'off_4', name: 'Improved Foraging', effects: { landAttrition: -0.25 } },
      { id: 'off_5', name: 'Grand Army', effects: { landForceLimit: 0.1 } },
      { id: 'off_6', name: 'Glorious Arms', effects: { prestige: 1 } },
      { id: 'off_7', name: 'Napoleonic Warfare', effects: { discipline: 0.05 } },
    ],
    bonus: { siegeAbility: 0.2 },
  },

  defensive: {
    id: 'defensive',
    name: 'Defensive Ideas',
    category: 'military',
    ideas: [
      { id: 'def_1', name: 'Battlefield Commissions', effects: { landMorale: 0.15 } },
      { id: 'def_2', name: 'Military Drill', effects: { armyTradition: 0.5 } },
      { id: 'def_3', name: 'Engineer Corps', effects: { fortDefense: 0.25 } },
      { id: 'def_4', name: 'Regimental System', effects: { reinforceSpeed: 0.33 } },
      { id: 'def_5', name: 'Defensive Mentality', effects: { hostileAttrition: 1 } },
      { id: 'def_6', name: 'Supply Trains', effects: { reinforceSpeed: 0.33 } },
      { id: 'def_7', name: 'Improved Maneuver', effects: { landMorale: 0.15 } },
    ],
    bonus: { garrisons: 0.5 },
  },

  quality: {
    id: 'quality',
    name: 'Quality Ideas',
    category: 'military',
    ideas: [
      { id: 'qua_1', name: 'Private to Marshal', effects: { infantryCombat: 0.1 } },
      { id: 'qua_2', name: 'Quality Education', effects: { armyTradition: 0.5 } },
      { id: 'qua_3', name: 'Finest of Horses', effects: { cavalryCombat: 0.1 } },
      { id: 'qua_4', name: 'Escort Ships', effects: { shipDurability: 0.05 } },
      { id: 'qua_5', name: 'Naval Drill', effects: { navalMorale: 0.1 } },
      { id: 'qua_6', name: 'Copper Bottoms', effects: { navalAttrition: -0.25 } },
      { id: 'qua_7', name: 'Massed Battery', effects: { artilleryCombat: 0.1 } },
    ],
    bonus: { discipline: 0.05 },
  },

  quantity: {
    id: 'quantity',
    name: 'Quantity Ideas',
    category: 'military',
    ideas: [
      { id: 'qnt_1', name: 'Mass Army', effects: { manpower: 0.5 } },
      { id: 'qnt_2', name: 'Expanded Supply Trains', effects: { landForceLimit: 0.33 } },
      { id: 'qnt_3', name: 'National Conscripts', effects: { manpowerRecovery: 0.2 } },
      { id: 'qnt_4', name: 'Garrison Conscription', effects: { garrisonSize: 0.5 } },
      { id: 'qnt_5', name: 'Reinforcement Drafts', effects: { reinforceSpeed: 0.33 } },
      { id: 'qnt_6', name: 'The Young can Serve', effects: { manpower: 0.25 } },
      { id: 'qnt_7', name: 'Enforced Service', effects: { manpowerRecovery: 0.1 } },
    ],
    bonus: { landMaintenanceCost: -0.05 },
  },
};

export const ideaGroupsList = Object.values(ideaGroups);

export function getIdeaGroup(id: string): IdeaGroup | undefined {
  return ideaGroups[id];
}

export function getIdeaGroupsByCategory(category: IdeaGroup['category']): IdeaGroup[] {
  return ideaGroupsList.filter(g => g.category === category);
}
