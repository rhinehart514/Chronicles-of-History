// Rebel faction and uprising system

export interface RebelFaction {
  id: string;
  name: string;
  type: RebelType;
  icon: string;
  demands: RebelDemand[];
  unitTypes: string[];
  spawnModifier: number;
  description: string;
}

export type RebelType =
  | 'nationalist'
  | 'religious'
  | 'pretender'
  | 'noble'
  | 'peasant'
  | 'particularist'
  | 'revolutionary';

export interface RebelDemand {
  type: string;
  description: string;
  effect: string;
}

export interface ActiveRebellion {
  factionId: string;
  provinces: string[];
  progress: number;
  strength: number;
  leader?: string;
  demands: string[];
}

export interface RebelArmy {
  id: string;
  factionId: string;
  size: number;
  morale: number;
  provinceId: string;
  movement?: string;
}

// Rebel faction types
export const REBEL_FACTIONS: RebelFaction[] = [
  {
    id: 'nationalists',
    name: 'Nationalist Rebels',
    type: 'nationalist',
    icon: '🏴',
    demands: [
      { type: 'independence', description: 'Demand independence', effect: 'Create new nation from rebel provinces' },
      { type: 'defection', description: 'Join mother country', effect: 'Provinces defect to cultural union leader' }
    ],
    unitTypes: ['infantry', 'cavalry'],
    spawnModifier: 1.0,
    description: 'Seek independence or unification with their cultural homeland.'
  },
  {
    id: 'religious',
    name: 'Religious Zealots',
    type: 'religious',
    icon: '✝️',
    demands: [
      { type: 'conversion', description: 'Convert provinces', effect: 'Convert rebel provinces to their religion' },
      { type: 'state_religion', description: 'Change state religion', effect: 'Force nation to adopt rebel religion' }
    ],
    unitTypes: ['infantry'],
    spawnModifier: 1.2,
    description: 'Fight for religious conversion and the true faith.'
  },
  {
    id: 'pretender',
    name: 'Pretender Rebels',
    type: 'pretender',
    icon: '👑',
    demands: [
      { type: 'new_ruler', description: 'Install pretender', effect: 'Replace current ruler with pretender' }
    ],
    unitTypes: ['infantry', 'cavalry', 'artillery'],
    spawnModifier: 0.8,
    description: 'Support a rival claimant to the throne.'
  },
  {
    id: 'noble',
    name: 'Noble Rebels',
    type: 'noble',
    icon: '🏰',
    demands: [
      { type: 'autonomy', description: 'Increase autonomy', effect: 'Increase autonomy in rebel provinces by 25%' },
      { type: 'privileges', description: 'Restore privileges', effect: 'Grant nobility estate privileges' }
    ],
    unitTypes: ['cavalry', 'infantry'],
    spawnModifier: 0.9,
    description: 'Aristocrats demanding greater privileges and autonomy.'
  },
  {
    id: 'peasant',
    name: 'Peasant Rebels',
    type: 'peasant',
    icon: '🌾',
    demands: [
      { type: 'reduce_taxes', description: 'Lower taxes', effect: 'Reduce tax income by 20% for 5 years' },
      { type: 'autonomy', description: 'Increase autonomy', effect: 'Increase autonomy in rebel provinces by 10%' }
    ],
    unitTypes: ['infantry'],
    spawnModifier: 1.5,
    description: 'Common people rising against oppressive taxation.'
  },
  {
    id: 'particularist',
    name: 'Particularist Rebels',
    type: 'particularist',
    icon: '📜',
    demands: [
      { type: 'autonomy', description: 'Provincial autonomy', effect: 'Increase autonomy in all provinces by 10%' },
      { type: 'local_rule', description: 'Local governance', effect: 'Decentralize government' }
    ],
    unitTypes: ['infantry', 'cavalry'],
    spawnModifier: 1.0,
    description: 'Demand greater local autonomy and self-governance.'
  },
  {
    id: 'revolutionary',
    name: 'Revolutionary Rebels',
    type: 'revolutionary',
    icon: '🔥',
    demands: [
      { type: 'government_change', description: 'Change government', effect: 'Convert to revolutionary republic' },
      { type: 'abolish_monarchy', description: 'End monarchy', effect: 'Execute ruler and establish republic' }
    ],
    unitTypes: ['infantry', 'artillery'],
    spawnModifier: 0.7,
    description: 'Seek to overthrow the government and establish a new order.'
  }
];

// Rebel spawn sizes based on development
export const REBEL_SIZE_MODIFIERS = {
  baseSizePerDev: 0.5,
  minSize: 3,
  maxSize: 50,
  leaderChance: 0.3
};

// Get rebel faction by id
export function getRebelFaction(id: string): RebelFaction | undefined {
  return REBEL_FACTIONS.find(f => f.id === id);
}

// Get factions by type
export function getFactionsByType(type: RebelType): RebelFaction[] {
  return REBEL_FACTIONS.filter(f => f.type === type);
}

// Calculate rebel army size
export function calculateRebelSize(
  development: number,
  unrest: number,
  modifiers: number = 0
): number {
  const baseSize = development * REBEL_SIZE_MODIFIERS.baseSizePerDev;
  const unrestMod = 1 + (unrest / 20);
  const size = baseSize * unrestMod * (1 + modifiers / 100);

  return Math.floor(
    Math.min(REBEL_SIZE_MODIFIERS.maxSize,
    Math.max(REBEL_SIZE_MODIFIERS.minSize, size))
  );
}

// Determine rebel type based on province conditions
export function determineRebelType(
  wrongCulture: boolean,
  wrongReligion: boolean,
  hasCoreClaim: boolean,
  legitimacy: number,
  autonomy: number
): RebelType {
  if (wrongCulture && hasCoreClaim) return 'nationalist';
  if (wrongReligion) return 'religious';
  if (legitimacy < 50) return 'pretender';
  if (autonomy < 25) return 'particularist';

  // Random between noble and peasant
  return Math.random() > 0.5 ? 'noble' : 'peasant';
}

// Calculate time until uprising
export function calculateTimeToUprising(
  progress: number,
  monthlyProgress: number
): number {
  if (monthlyProgress <= 0) return Infinity;
  const remaining = 100 - progress;
  return Math.ceil(remaining / monthlyProgress);
}

// Get rebel demands text
export function getRebelDemandsText(faction: RebelFaction): string[] {
  return faction.demands.map(d => d.description);
}

// Calculate acceptance effects
export function getAcceptanceEffects(faction: RebelFaction): string[] {
  return faction.demands.map(d => d.effect);
}

// Check if rebels can enforce demands
export function canEnforceDemands(
  rebelArmyStrength: number,
  nationalArmyStrength: number,
  occupiedCapital: boolean
): boolean {
  if (occupiedCapital) return true;
  return rebelArmyStrength > nationalArmyStrength * 2;
}

// Get harsh treatment cost
export function getHarshTreatmentCost(
  unrest: number,
  development: number
): number {
  return Math.floor(50 + (development * 2) + (unrest * 5));
}

// Calculate unrest reduction from harsh treatment
export function getHarshTreatmentEffect(milPower: number): number {
  return Math.min(10, milPower / 10);
}

// Get rebel icon based on type
export function getRebelIcon(type: RebelType): string {
  const faction = REBEL_FACTIONS.find(f => f.type === type);
  return faction?.icon || '⚔️';
}

// Calculate rebel morale
export function calculateRebelMorale(
  factionType: RebelType,
  unrest: number,
  leadersPresent: boolean
): number {
  let baseMorale = 2.0;

  if (factionType === 'revolutionary') baseMorale += 0.5;
  if (factionType === 'religious') baseMorale += 0.3;
  if (leadersPresent) baseMorale += 0.5;

  baseMorale += unrest / 20;

  return Math.min(4.0, baseMorale);
}

export default {
  REBEL_FACTIONS,
  REBEL_SIZE_MODIFIERS,
  getRebelFaction,
  getFactionsByType,
  calculateRebelSize,
  determineRebelType,
  calculateTimeToUprising,
  getRebelDemandsText,
  getAcceptanceEffects,
  canEnforceDemands,
  getHarshTreatmentCost,
  getHarshTreatmentEffect,
  getRebelIcon,
  calculateRebelMorale
};
