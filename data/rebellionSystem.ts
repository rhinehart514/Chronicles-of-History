// Rebellion and revolt system

export interface Rebellion {
  id: string;
  name: string;
  type: RebellionType;
  provinces: string[];
  strength: number;
  progress: number; // 0-100, rebels win at 100
  demands: RebellionDemand[];
  leader: string | null;
}

export type RebellionType =
  | 'peasant'
  | 'noble'
  | 'religious'
  | 'nationalist'
  | 'separatist'
  | 'pretender';

export interface RebellionDemand {
  type: string;
  description: string;
  effect: string;
}

export interface RebellionRisk {
  province: string;
  risk: number; // 0-100
  factors: RiskFactor[];
  potentialType: RebellionType;
}

export interface RiskFactor {
  name: string;
  value: number;
  icon: string;
}

// Rebellion type definitions
export const REBELLION_TYPES: Record<RebellionType, {
  name: string;
  icon: string;
  causes: string[];
  demands: RebellionDemand[];
}> = {
  peasant: {
    name: 'Peasant Uprising',
    icon: '🌾',
    causes: ['High taxes', 'Food shortage', 'Harsh laws'],
    demands: [
      { type: 'reduce_taxes', description: 'Lower taxes for common folk', effect: '-20% Tax rate' },
      { type: 'food_relief', description: 'Provide food assistance', effect: '-500 Gold' }
    ]
  },
  noble: {
    name: 'Noble Revolt',
    icon: '👑',
    causes: ['Centralization', 'Loss of privileges', 'Succession crisis'],
    demands: [
      { type: 'restore_privileges', description: 'Restore noble privileges', effect: '+10% Autonomy' },
      { type: 'council_power', description: 'Give nobles more power', effect: '-0.5 Stability' }
    ]
  },
  religious: {
    name: 'Religious Uprising',
    icon: '⛪',
    causes: ['Religious persecution', 'Conversion attempts', 'Heresy'],
    demands: [
      { type: 'religious_freedom', description: 'Grant religious tolerance', effect: '+Religious tolerance' },
      { type: 'end_persecution', description: 'Stop religious persecution', effect: '-Religious unity' }
    ]
  },
  nationalist: {
    name: 'Nationalist Revolt',
    icon: '🏴',
    causes: ['Foreign rule', 'Cultural oppression', 'National awakening'],
    demands: [
      { type: 'cultural_rights', description: 'Grant cultural autonomy', effect: '+25% Autonomy' },
      { type: 'independence', description: 'Grant independence', effect: 'Lose provinces' }
    ]
  },
  separatist: {
    name: 'Separatist Movement',
    icon: '🗺️',
    causes: ['Distance from capital', 'Different culture', 'Economic neglect'],
    demands: [
      { type: 'autonomy', description: 'Grant regional autonomy', effect: '+50% Autonomy' },
      { type: 'secession', description: 'Allow secession', effect: 'Province becomes independent' }
    ]
  },
  pretender: {
    name: 'Pretender Rebellion',
    icon: '⚔️',
    causes: ['Weak ruler', 'Succession dispute', 'Low legitimacy'],
    demands: [
      { type: 'abdication', description: 'Pretender takes throne', effect: 'New ruler' },
      { type: 'recognition', description: 'Recognize pretender claims', effect: '-1 Stability' }
    ]
  }
};

// Calculate rebellion risk for a province
export function calculateRebellionRisk(
  unrest: number,
  autonomy: number,
  culture: boolean,
  religion: boolean,
  taxRate: number,
  stability: number,
  food: number
): RebellionRisk['factors'] {
  const factors: RiskFactor[] = [];

  // Unrest is the primary factor
  if (unrest > 0) {
    factors.push({
      name: 'Local Unrest',
      value: Math.floor(unrest * 3),
      icon: '😠'
    });
  }

  // High autonomy reduces risk
  if (autonomy > 50) {
    factors.push({
      name: 'High Autonomy',
      value: Math.floor((autonomy - 50) * -0.3),
      icon: '🏛️'
    });
  }

  // Wrong culture
  if (!culture) {
    factors.push({
      name: 'Non-accepted Culture',
      value: 10,
      icon: '🗣️'
    });
  }

  // Wrong religion
  if (!religion) {
    factors.push({
      name: 'Religious Differences',
      value: 8,
      icon: '⛪'
    });
  }

  // High taxes
  if (taxRate > 30) {
    factors.push({
      name: 'Heavy Taxation',
      value: Math.floor((taxRate - 30) * 0.5),
      icon: '💰'
    });
  }

  // Low stability
  if (stability < 3) {
    factors.push({
      name: 'Low Stability',
      value: Math.floor((3 - stability) * 5),
      icon: '⚖️'
    });
  }

  // Food shortage
  if (food < 100) {
    factors.push({
      name: 'Food Shortage',
      value: Math.floor((100 - food) * 0.3),
      icon: '🌾'
    });
  }

  return factors;
}

// Determine rebellion type based on factors
export function determineRebellionType(
  culture: boolean,
  religion: boolean,
  autonomy: number,
  taxRate: number,
  hasNobles: boolean,
  lowLegitimacy: boolean
): RebellionType {
  // Priority order
  if (!religion) return 'religious';
  if (!culture && autonomy < 30) return 'nationalist';
  if (!culture) return 'separatist';
  if (lowLegitimacy) return 'pretender';
  if (hasNobles && autonomy < 30) return 'noble';
  return 'peasant';
}

// Create a new rebellion
export function createRebellion(
  type: RebellionType,
  provinces: string[],
  year: number
): Rebellion {
  const typeInfo = REBELLION_TYPES[type];

  return {
    id: `rebellion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: `${typeInfo.name} of ${year}`,
    type,
    provinces,
    strength: 1000 + Math.floor(Math.random() * 2000),
    progress: 0,
    demands: typeInfo.demands,
    leader: generateRebelLeader(type)
  };
}

// Generate rebel leader name
function generateRebelLeader(type: RebellionType): string {
  const peasantNames = ['John the Bold', 'Thomas Farmer', 'William Reaper'];
  const nobleNames = ['Duke of Cornwall', 'Count Malcontent', 'Baron Defiant'];
  const religiousNames = ['Father Marcus', 'Brother Zealot', 'Prophet Elijah'];
  const nationalistNames = ['The Liberator', 'Freedom Fighter', 'Patriot Chief'];

  switch (type) {
    case 'peasant':
      return peasantNames[Math.floor(Math.random() * peasantNames.length)];
    case 'noble':
      return nobleNames[Math.floor(Math.random() * nobleNames.length)];
    case 'religious':
      return religiousNames[Math.floor(Math.random() * religiousNames.length)];
    default:
      return nationalistNames[Math.floor(Math.random() * nationalistNames.length)];
  }
}

// Calculate rebellion strength growth
export function calculateStrengthGrowth(
  rebellion: Rebellion,
  unrest: number,
  popularity: number
): number {
  let growth = 100; // Base growth

  // Unrest feeds rebellion
  growth += unrest * 20;

  // Popularity of cause
  growth += popularity * 10;

  // Diminishing returns at high strength
  if (rebellion.strength > 5000) {
    growth *= 0.7;
  }

  return Math.floor(growth);
}

// Calculate progress toward rebel victory
export function calculateProgress(
  rebellion: Rebellion,
  controlledProvinces: number,
  totalProvinces: number
): number {
  const controlRatio = controlledProvinces / totalProvinces;
  return Math.min(100, rebellion.progress + controlRatio * 10);
}

// Effects of accepting rebel demands
export function getAcceptanceEffects(rebellion: Rebellion): {
  stability: number;
  autonomy: number;
  prestige: number;
  gold: number;
} {
  const effects = {
    stability: -1,
    autonomy: 0,
    prestige: -10,
    gold: 0
  };

  switch (rebellion.type) {
    case 'peasant':
      effects.gold = -500;
      break;
    case 'noble':
      effects.autonomy = 10;
      effects.stability = -0.5;
      break;
    case 'religious':
      effects.stability = -0.5;
      break;
    case 'nationalist':
    case 'separatist':
      effects.autonomy = 25;
      effects.prestige = -20;
      break;
    case 'pretender':
      effects.stability = -2;
      effects.prestige = -30;
      break;
  }

  return effects;
}

export default {
  REBELLION_TYPES,
  calculateRebellionRisk,
  determineRebellionType,
  createRebellion,
  calculateStrengthGrowth,
  calculateProgress,
  getAcceptanceEffects
};
