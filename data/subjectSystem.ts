// Subject nations and vassal management system

export interface SubjectType {
  id: string;
  name: string;
  icon: string;
  category: SubjectCategory;
  libertyDesireBase: number;
  incomeShare: number;
  forcelimitContribution: number;
  canAnnex: boolean;
  annexCost: number;
  integrationTime: number;
  description: string;
}

export type SubjectCategory = 'vassal' | 'march' | 'union' | 'colony' | 'tributary' | 'protectorate';

export interface SubjectRelation {
  overlordId: string;
  subjectId: string;
  subjectType: SubjectType;
  libertyDesire: number;
  loyaltyModifiers: LoyaltyModifier[];
  yearsUnderRule: number;
  developmentWhenSubjected: number;
}

export interface LoyaltyModifier {
  id: string;
  name: string;
  value: number;
  duration?: number;
}

export interface AnnexationProgress {
  subjectId: string;
  progress: number;
  monthlyProgress: number;
  diploPointCost: number;
}

// Subject types
export const SUBJECT_TYPES: SubjectType[] = [
  {
    id: 'vassal',
    name: 'Vassal',
    icon: '🛡️',
    category: 'vassal',
    libertyDesireBase: 25,
    incomeShare: 10,
    forcelimitContribution: 100,
    canAnnex: true,
    annexCost: 8,
    integrationTime: 10,
    description: 'A dependent state that provides military support and tribute.'
  },
  {
    id: 'march',
    name: 'March',
    icon: '⚔️',
    category: 'march',
    libertyDesireBase: -15,
    incomeShare: 0,
    forcelimitContribution: 150,
    canAnnex: false,
    annexCost: 0,
    integrationTime: 0,
    description: 'A militarized vassal focused on border defense.'
  },
  {
    id: 'personal_union',
    name: 'Personal Union',
    icon: '👑',
    category: 'union',
    libertyDesireBase: 50,
    incomeShare: 0,
    forcelimitContribution: 100,
    canAnnex: true,
    annexCost: 8,
    integrationTime: 50,
    description: 'Two nations sharing the same monarch through inheritance.'
  },
  {
    id: 'colonial_nation',
    name: 'Colonial Nation',
    icon: '🏴',
    category: 'colony',
    libertyDesireBase: 10,
    incomeShare: 50,
    forcelimitContribution: 50,
    canAnnex: false,
    annexCost: 0,
    integrationTime: 0,
    description: 'An overseas colonial administration.'
  },
  {
    id: 'tributary',
    name: 'Tributary',
    icon: '💰',
    category: 'tributary',
    libertyDesireBase: 0,
    incomeShare: 25,
    forcelimitContribution: 0,
    canAnnex: false,
    annexCost: 0,
    integrationTime: 0,
    description: 'A state that pays tribute but maintains independence.'
  },
  {
    id: 'protectorate',
    name: 'Protectorate',
    icon: '📜',
    category: 'protectorate',
    libertyDesireBase: 15,
    incomeShare: 5,
    forcelimitContribution: 25,
    canAnnex: false,
    annexCost: 0,
    integrationTime: 0,
    description: 'A nation under your diplomatic protection.'
  },
  {
    id: 'client_state',
    name: 'Client State',
    icon: '🤝',
    category: 'vassal',
    libertyDesireBase: 0,
    incomeShare: 10,
    forcelimitContribution: 100,
    canAnnex: true,
    annexCost: 8,
    integrationTime: 10,
    description: 'A custom nation created to manage conquered territory.'
  }
];

// Liberty desire modifiers
export const LIBERTY_DESIRE_MODIFIERS = {
  relativePower: 0.5, // per % of overlord's development
  diplomaticReputation: -3, // per point
  prestige: -0.1, // per point
  supportIndependence: 50, // from great power
  historicalFriend: -50,
  sameDynasty: -10, // for PUs
  differentReligion: 25,
  differentCulture: 15
};

// Get subject type by id
export function getSubjectType(id: string): SubjectType | undefined {
  return SUBJECT_TYPES.find(t => t.id === id);
}

// Get types by category
export function getTypesByCategory(category: SubjectCategory): SubjectType[] {
  return SUBJECT_TYPES.filter(t => t.category === category);
}

// Calculate liberty desire
export function calculateLibertyDesire(
  subjectType: SubjectType,
  subjectDevelopment: number,
  overlordDevelopment: number,
  modifiers: LoyaltyModifier[]
): number {
  let desire = subjectType.libertyDesireBase;

  // Relative power
  const powerRatio = (subjectDevelopment / overlordDevelopment) * 100;
  desire += powerRatio * LIBERTY_DESIRE_MODIFIERS.relativePower;

  // Apply modifiers
  for (const mod of modifiers) {
    desire += mod.value;
  }

  return Math.max(0, Math.min(100, desire));
}

// Check if subject is loyal
export function isLoyal(libertyDesire: number): boolean {
  return libertyDesire < 50;
}

// Get loyalty status text
export function getLoyaltyStatus(libertyDesire: number): string {
  if (libertyDesire >= 100) return 'Rebellious';
  if (libertyDesire >= 75) return 'Disloyal';
  if (libertyDesire >= 50) return 'Discontent';
  if (libertyDesire >= 25) return 'Content';
  return 'Loyal';
}

// Calculate annexation progress per month
export function calculateAnnexationProgress(
  baseDiplomatic: number,
  development: number,
  modifiers: number = 0
): number {
  return (baseDiplomatic / development) * (1 + modifiers / 100);
}

// Calculate total annex cost
export function calculateTotalAnnexCost(
  subjectType: SubjectType,
  development: number
): number {
  return subjectType.annexCost * development;
}

// Calculate income from subject
export function calculateSubjectIncome(
  subjectIncome: number,
  subjectType: SubjectType,
  tariffEfficiency: number = 0
): number {
  const share = subjectType.incomeShare / 100;
  return subjectIncome * share * (1 + tariffEfficiency / 100);
}

// Calculate forcelimit contribution
export function calculateForcelimitContribution(
  subjectForcelimit: number,
  subjectType: SubjectType
): number {
  return Math.floor(subjectForcelimit * (subjectType.forcelimitContribution / 100));
}

// Check if can start annexation
export function canStartAnnexation(
  subjectType: SubjectType,
  yearsUnderRule: number,
  libertyDesire: number,
  relations: number
): boolean {
  if (!subjectType.canAnnex) return false;
  if (yearsUnderRule < subjectType.integrationTime) return false;
  if (libertyDesire >= 50) return false;
  if (relations < 190) return false;
  return true;
}

// Get loyalty color
export function getLoyaltyColor(libertyDesire: number): string {
  if (libertyDesire >= 75) return 'red';
  if (libertyDesire >= 50) return 'orange';
  if (libertyDesire >= 25) return 'yellow';
  return 'green';
}

export default {
  SUBJECT_TYPES,
  LIBERTY_DESIRE_MODIFIERS,
  getSubjectType,
  getTypesByCategory,
  calculateLibertyDesire,
  isLoyal,
  getLoyaltyStatus,
  calculateAnnexationProgress,
  calculateTotalAnnexCost,
  calculateSubjectIncome,
  calculateForcelimitContribution,
  canStartAnnexation,
  getLoyaltyColor
};
