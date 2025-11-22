// Nation ranking and great power system

export interface NationRanking {
  nationId: string;
  name: string;
  flag: string;
  score: number;
  rank: number;
  category: RankCategory;
  components: ScoreComponent[];
}

export type RankCategory = 'great_power' | 'major' | 'regional' | 'minor' | 'insignificant';

export interface ScoreComponent {
  type: ScoreType;
  value: number;
  weight: number;
}

export type ScoreType = 'military' | 'economic' | 'diplomatic' | 'administrative';

export interface GreatPowerBonus {
  id: string;
  name: string;
  description: string;
  minRank: number;
}

// Score weights
export const SCORE_WEIGHTS: Record<ScoreType, number> = {
  military: 1.0,
  economic: 1.0,
  diplomatic: 1.0,
  administrative: 1.0
};

// Rank thresholds
export const RANK_THRESHOLDS = {
  greatPower: 8, // Top 8 nations
  major: 20,
  regional: 50,
  minor: 100
};

// Great power bonuses
export const GREAT_POWER_BONUSES: GreatPowerBonus[] = [
  {
    id: 'influence',
    name: 'Great Power Influence',
    description: 'Gain influence points to spend on great power actions',
    minRank: 8
  },
  {
    id: 'guarantee',
    name: 'Guarantee Independence',
    description: 'Protect smaller nations from aggression',
    minRank: 8
  },
  {
    id: 'intervene',
    name: 'Intervene in War',
    description: 'Join wars to protect the balance of power',
    minRank: 8
  },
  {
    id: 'break_alliance',
    name: 'Break Alliance',
    description: 'Force nations to break their alliances',
    minRank: 4
  },
  {
    id: 'discredit_advisor',
    name: 'Discredit Advisor',
    description: 'Remove an advisor from another nation',
    minRank: 6
  }
];

// Calculate nation score
export function calculateNationScore(
  development: number,
  army: number,
  navy: number,
  treasury: number,
  subjects: number,
  techLevel: number
): { score: number; components: ScoreComponent[] } {
  const components: ScoreComponent[] = [
    {
      type: 'military',
      value: (army * 0.5 + navy * 0.3) * 10,
      weight: SCORE_WEIGHTS.military
    },
    {
      type: 'economic',
      value: (development * 0.5 + treasury * 0.01) * 10,
      weight: SCORE_WEIGHTS.economic
    },
    {
      type: 'diplomatic',
      value: subjects * 50,
      weight: SCORE_WEIGHTS.diplomatic
    },
    {
      type: 'administrative',
      value: techLevel * 30,
      weight: SCORE_WEIGHTS.administrative
    }
  ];

  const score = components.reduce((sum, c) => sum + c.value * c.weight, 0);

  return { score: Math.floor(score), components };
}

// Get rank category from position
export function getRankCategory(rank: number): RankCategory {
  if (rank <= RANK_THRESHOLDS.greatPower) return 'great_power';
  if (rank <= RANK_THRESHOLDS.major) return 'major';
  if (rank <= RANK_THRESHOLDS.regional) return 'regional';
  if (rank <= RANK_THRESHOLDS.minor) return 'minor';
  return 'insignificant';
}

// Get category display name
export function getCategoryName(category: RankCategory): string {
  const names: Record<RankCategory, string> = {
    great_power: 'Great Power',
    major: 'Major Power',
    regional: 'Regional Power',
    minor: 'Minor Nation',
    insignificant: 'Insignificant'
  };
  return names[category];
}

// Get category color
export function getCategoryColor(category: RankCategory): string {
  const colors: Record<RankCategory, string> = {
    great_power: 'gold',
    major: 'blue',
    regional: 'green',
    minor: 'stone',
    insignificant: 'gray'
  };
  return colors[category];
}

// Check if nation is great power
export function isGreatPower(rank: number): boolean {
  return rank <= RANK_THRESHOLDS.greatPower;
}

// Get available GP bonuses
export function getAvailableBonuses(rank: number): GreatPowerBonus[] {
  return GREAT_POWER_BONUSES.filter(b => rank <= b.minRank);
}

// Calculate influence gain
export function calculateInfluenceGain(
  rank: number,
  prestige: number
): number {
  if (rank > RANK_THRESHOLDS.greatPower) return 0;

  const baseGain = (RANK_THRESHOLDS.greatPower - rank + 1) * 0.5;
  const prestigeBonus = prestige * 0.01;
  return baseGain + prestigeBonus;
}

// Sort nations by score
export function sortByScore(nations: NationRanking[]): NationRanking[] {
  return [...nations]
    .sort((a, b) => b.score - a.score)
    .map((nation, index) => ({
      ...nation,
      rank: index + 1,
      category: getRankCategory(index + 1)
    }));
}

// Get score type icon
export function getScoreTypeIcon(type: ScoreType): string {
  const icons: Record<ScoreType, string> = {
    military: '⚔️',
    economic: '💰',
    diplomatic: '🤝',
    administrative: '📜'
  };
  return icons[type];
}

// Calculate score change
export function calculateScoreChange(
  oldScore: number,
  newScore: number
): number {
  return newScore - oldScore;
}

export default {
  SCORE_WEIGHTS,
  RANK_THRESHOLDS,
  GREAT_POWER_BONUSES,
  calculateNationScore,
  getRankCategory,
  getCategoryName,
  getCategoryColor,
  isGreatPower,
  getAvailableBonuses,
  calculateInfluenceGain,
  sortByScore,
  getScoreTypeIcon,
  calculateScoreChange
};
