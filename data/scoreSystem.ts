// Nation scoring and ranking system

export interface NationScore {
  nationId: string;
  totalScore: number;
  components: ScoreComponent[];
  rank: number;
  previousRank?: number;
  history: ScoreHistory[];
}

export interface ScoreComponent {
  category: ScoreCategory;
  value: number;
  weight: number;
  contribution: number;
}

export type ScoreCategory =
  | 'military'
  | 'economic'
  | 'diplomatic'
  | 'administrative'
  | 'innovation';

export interface ScoreHistory {
  date: string;
  score: number;
  rank: number;
}

export interface ScoreWeight {
  category: ScoreCategory;
  weight: number;
  description: string;
  factors: ScoreFactor[];
}

export interface ScoreFactor {
  id: string;
  name: string;
  multiplier: number;
  description: string;
}

export interface Leaderboard {
  category: ScoreCategory | 'total';
  rankings: LeaderboardEntry[];
}

export interface LeaderboardEntry {
  nationId: string;
  nationName: string;
  score: number;
  rank: number;
  change: number;
}

// Score category weights and factors
export const SCORE_WEIGHTS: ScoreWeight[] = [
  {
    category: 'military',
    weight: 20,
    description: 'Military strength and martial prowess',
    factors: [
      { id: 'army_size', name: 'Army Size', multiplier: 0.3, description: 'Total army force limit' },
      { id: 'navy_size', name: 'Navy Size', multiplier: 0.2, description: 'Total naval force limit' },
      { id: 'mil_tech', name: 'Military Tech', multiplier: 0.2, description: 'Military technology level' },
      { id: 'army_tradition', name: 'Army Tradition', multiplier: 0.15, description: 'Army tradition value' },
      { id: 'battles_won', name: 'Battles Won', multiplier: 0.15, description: 'Total battles won' }
    ]
  },
  {
    category: 'economic',
    weight: 25,
    description: 'Economic power and wealth',
    factors: [
      { id: 'income', name: 'Monthly Income', multiplier: 0.3, description: 'Total monthly income' },
      { id: 'development', name: 'Development', multiplier: 0.25, description: 'Total development' },
      { id: 'trade_power', name: 'Trade Power', multiplier: 0.2, description: 'Global trade power' },
      { id: 'production', name: 'Production', multiplier: 0.15, description: 'Total goods produced' },
      { id: 'treasury', name: 'Treasury', multiplier: 0.1, description: 'Current treasury' }
    ]
  },
  {
    category: 'diplomatic',
    weight: 15,
    description: 'Diplomatic influence and prestige',
    factors: [
      { id: 'prestige', name: 'Prestige', multiplier: 0.25, description: 'Current prestige' },
      { id: 'allies', name: 'Allies', multiplier: 0.2, description: 'Number of allies' },
      { id: 'subjects', name: 'Subjects', multiplier: 0.25, description: 'Subject nations' },
      { id: 'diplo_tech', name: 'Diplomatic Tech', multiplier: 0.15, description: 'Diplomatic technology' },
      { id: 'great_power', name: 'Great Power', multiplier: 0.15, description: 'Great power influence' }
    ]
  },
  {
    category: 'administrative',
    weight: 20,
    description: 'Administrative efficiency and stability',
    factors: [
      { id: 'provinces', name: 'Provinces', multiplier: 0.25, description: 'Total provinces owned' },
      { id: 'stability', name: 'Stability', multiplier: 0.2, description: 'National stability' },
      { id: 'admin_tech', name: 'Admin Tech', multiplier: 0.2, description: 'Administrative technology' },
      { id: 'legitimacy', name: 'Legitimacy', multiplier: 0.15, description: 'Ruler legitimacy' },
      { id: 'advisors', name: 'Advisors', multiplier: 0.2, description: 'Advisor skill total' }
    ]
  },
  {
    category: 'innovation',
    weight: 20,
    description: 'Technological and cultural advancement',
    factors: [
      { id: 'total_tech', name: 'Technology', multiplier: 0.3, description: 'Combined tech level' },
      { id: 'ideas', name: 'Ideas', multiplier: 0.25, description: 'Unlocked ideas' },
      { id: 'institutions', name: 'Institutions', multiplier: 0.25, description: 'Embraced institutions' },
      { id: 'innovations', name: 'Innovations', multiplier: 0.2, description: 'Special innovations' }
    ]
  }
];

// Calculate score for a category
export function calculateCategoryScore(
  category: ScoreCategory,
  values: Record<string, number>
): number {
  const weight = SCORE_WEIGHTS.find(w => w.category === category);
  if (!weight) return 0;

  let score = 0;
  for (const factor of weight.factors) {
    const value = values[factor.id] || 0;
    score += value * factor.multiplier;
  }

  return Math.round(score * weight.weight);
}

// Calculate total nation score
export function calculateTotalScore(
  categoryScores: Map<ScoreCategory, number>
): number {
  let total = 0;
  categoryScores.forEach(score => {
    total += score;
  });
  return total;
}

// Get rank change description
export function getRankChangeDescription(current: number, previous: number): string {
  const diff = previous - current;
  if (diff > 0) return `↑${diff}`;
  if (diff < 0) return `↓${Math.abs(diff)}`;
  return '−';
}

// Get rank tier
export function getRankTier(rank: number, totalNations: number): string {
  const percentile = rank / totalNations;
  if (percentile <= 0.05) return 'Great Power';
  if (percentile <= 0.15) return 'Major Power';
  if (percentile <= 0.35) return 'Regional Power';
  if (percentile <= 0.60) return 'Secondary Power';
  return 'Minor Power';
}

// Get tier color
export function getTierColor(tier: string): string {
  switch (tier) {
    case 'Great Power': return 'text-amber-400';
    case 'Major Power': return 'text-purple-400';
    case 'Regional Power': return 'text-blue-400';
    case 'Secondary Power': return 'text-green-400';
    default: return 'text-stone-400';
  }
}

// Calculate score change
export function calculateScoreChange(
  current: number,
  previous: number
): { value: number; percentage: number } {
  const value = current - previous;
  const percentage = previous > 0 ? Math.round((value / previous) * 100) : 0;
  return { value, percentage };
}

// Get dominant category for a nation
export function getDominantCategory(
  scores: Map<ScoreCategory, number>
): ScoreCategory {
  let maxCategory: ScoreCategory = 'military';
  let maxScore = 0;

  scores.forEach((score, category) => {
    if (score > maxScore) {
      maxScore = score;
      maxCategory = category;
    }
  });

  return maxCategory;
}

// Get category icon
export function getCategoryIcon(category: ScoreCategory): string {
  switch (category) {
    case 'military': return '⚔️';
    case 'economic': return '💰';
    case 'diplomatic': return '🤝';
    case 'administrative': return '📋';
    case 'innovation': return '💡';
  }
}

// Sort nations by score
export function sortByScore(
  nations: NationScore[],
  category?: ScoreCategory
): NationScore[] {
  return [...nations].sort((a, b) => {
    if (category) {
      const aScore = a.components.find(c => c.category === category)?.contribution || 0;
      const bScore = b.components.find(c => c.category === category)?.contribution || 0;
      return bScore - aScore;
    }
    return b.totalScore - a.totalScore;
  });
}

// Generate score breakdown
export function generateScoreBreakdown(
  score: NationScore
): { category: string; value: number; percentage: number }[] {
  return score.components.map(comp => ({
    category: comp.category,
    value: comp.contribution,
    percentage: Math.round((comp.contribution / score.totalScore) * 100)
  }));
}

export default {
  SCORE_WEIGHTS,
  calculateCategoryScore,
  calculateTotalScore,
  getRankChangeDescription,
  getRankTier,
  getTierColor,
  calculateScoreChange,
  getDominantCategory,
  getCategoryIcon,
  sortByScore,
  generateScoreBreakdown
};
