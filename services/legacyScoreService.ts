// Legacy score system - rates your reign and compares to history

import { Nation, LogEntry, War } from '../types';
import { PlayerStats } from './achievementService';

export interface LegacyScore {
  total: number;
  grade: string;
  title: string;
  breakdown: ScoreCategory[];
  comparison: HistoricalComparison;
  epitaph: string;
}

export interface ScoreCategory {
  name: string;
  score: number;
  maxScore: number;
  description: string;
}

export interface HistoricalComparison {
  historicalFigure: string;
  similarity: number;
  reason: string;
}

// Calculate legacy score from game state
export function calculateLegacyScore(
  nation: Nation,
  startYear: number,
  endYear: number,
  logs: LogEntry[],
  stats: Partial<PlayerStats>
): LegacyScore {
  const categories: ScoreCategory[] = [];
  let totalScore = 0;
  let maxPossible = 0;

  // Military Glory (0-25 points)
  const militaryScore = calculateMilitaryScore(nation, stats, logs);
  categories.push({
    name: 'Military Glory',
    score: militaryScore,
    maxScore: 25,
    description: getMilitaryDescription(militaryScore)
  });
  totalScore += militaryScore;
  maxPossible += 25;

  // Economic Prosperity (0-25 points)
  const economyScore = calculateEconomyScore(nation, stats);
  categories.push({
    name: 'Economic Prosperity',
    score: economyScore,
    maxScore: 25,
    description: getEconomyDescription(economyScore)
  });
  totalScore += economyScore;
  maxPossible += 25;

  // Diplomatic Influence (0-20 points)
  const diplomacyScore = calculateDiplomacyScore(nation, stats);
  categories.push({
    name: 'Diplomatic Influence',
    score: diplomacyScore,
    maxScore: 20,
    description: getDiplomacyDescription(diplomacyScore)
  });
  totalScore += diplomacyScore;
  maxPossible += 20;

  // Cultural Legacy (0-15 points)
  const cultureScore = calculateCultureScore(nation, stats);
  categories.push({
    name: 'Cultural Legacy',
    score: cultureScore,
    maxScore: 15,
    description: getCultureDescription(cultureScore)
  });
  totalScore += cultureScore;
  maxPossible += 15;

  // Longevity (0-15 points)
  const yearsRuled = endYear - startYear;
  const longevityScore = Math.min(15, Math.floor(yearsRuled / 10));
  categories.push({
    name: 'Longevity',
    score: longevityScore,
    maxScore: 15,
    description: `Ruled for ${yearsRuled} years`
  });
  totalScore += longevityScore;
  maxPossible += 15;

  // Determine grade and title
  const percentage = (totalScore / maxPossible) * 100;
  const { grade, title } = getGradeAndTitle(percentage, nation.name);

  // Find historical comparison
  const comparison = findHistoricalComparison(categories, nation);

  // Generate epitaph
  const epitaph = generateEpitaph(categories, nation, yearsRuled);

  return {
    total: totalScore,
    grade,
    title,
    breakdown: categories,
    comparison,
    epitaph
  };
}

function calculateMilitaryScore(nation: Nation, stats: Partial<PlayerStats>, logs: LogEntry[]): number {
  let score = 0;

  // Base military stat
  score += nation.stats.military * 2; // 0-10

  // Wars won
  score += Math.min(10, (stats.warsWon || 0) * 2); // 0-10

  // Territories conquered
  score += Math.min(5, (stats.territoriesConquered || 0)); // 0-5

  return Math.min(25, score);
}

function calculateEconomyScore(nation: Nation, stats: Partial<PlayerStats>): number {
  let score = 0;

  // Base economy stat
  score += nation.stats.economy * 3; // 0-15

  // Trade deals
  score += Math.min(5, (stats.tradeDealsMade || 0)); // 0-5

  // Max economy reached bonus
  if ((stats.maxEconomyReached || 0) >= 5) score += 5;

  return Math.min(25, score);
}

function calculateDiplomacyScore(nation: Nation, stats: Partial<PlayerStats>): number {
  let score = 0;

  // Alliances
  score += Math.min(8, (stats.alliancesFormed || 0) * 2); // 0-8

  // Treaties
  score += Math.min(6, (stats.treatiesSigned || 0)); // 0-6

  // Royal marriages
  score += Math.min(6, (stats.royalMarriages || 0) * 2); // 0-6

  return Math.min(20, score);
}

function calculateCultureScore(nation: Nation, stats: Partial<PlayerStats>): number {
  let score = 0;

  // Innovation stat
  score += nation.stats.innovation * 2; // 0-10

  // Techs researched
  score += Math.min(5, Math.floor((stats.techsResearched || 0) / 4)); // 0-5

  return Math.min(15, score);
}

function getMilitaryDescription(score: number): string {
  if (score >= 20) return 'A legendary conqueror';
  if (score >= 15) return 'A formidable military power';
  if (score >= 10) return 'A respectable military force';
  if (score >= 5) return 'Adequate defense';
  return 'Militarily weak';
}

function getEconomyDescription(score: number): string {
  if (score >= 20) return 'Unprecedented prosperity';
  if (score >= 15) return 'A wealthy nation';
  if (score >= 10) return 'Stable economy';
  if (score >= 5) return 'Struggling finances';
  return 'Economic ruin';
}

function getDiplomacyDescription(score: number): string {
  if (score >= 15) return 'Master of diplomacy';
  if (score >= 10) return 'Well-connected';
  if (score >= 5) return 'Some diplomatic ties';
  return 'Isolated';
}

function getCultureDescription(score: number): string {
  if (score >= 12) return 'Golden age of culture';
  if (score >= 8) return 'Cultural influence';
  if (score >= 4) return 'Modest cultural output';
  return 'Cultural stagnation';
}

function getGradeAndTitle(percentage: number, nationName: string): { grade: string; title: string } {
  if (percentage >= 90) return { grade: 'S', title: `${nationName} the Legendary` };
  if (percentage >= 80) return { grade: 'A', title: `${nationName} the Great` };
  if (percentage >= 70) return { grade: 'B', title: `${nationName} the Magnificent` };
  if (percentage >= 60) return { grade: 'C', title: `${nationName} the Competent` };
  if (percentage >= 50) return { grade: 'D', title: `${nationName} the Mediocre` };
  if (percentage >= 40) return { grade: 'E', title: `${nationName} the Forgettable` };
  return { grade: 'F', title: `${nationName} the Disastrous` };
}

function findHistoricalComparison(categories: ScoreCategory[], nation: Nation): HistoricalComparison {
  const military = categories.find(c => c.name === 'Military Glory')?.score || 0;
  const economy = categories.find(c => c.name === 'Economic Prosperity')?.score || 0;
  const diplomacy = categories.find(c => c.name === 'Diplomatic Influence')?.score || 0;
  const culture = categories.find(c => c.name === 'Cultural Legacy')?.score || 0;

  // Find best match
  if (military >= 20 && economy >= 15) {
    return { historicalFigure: 'Napoleon Bonaparte', similarity: 85, reason: 'Military genius with economic reforms' };
  }
  if (diplomacy >= 15 && military < 10) {
    return { historicalFigure: 'Metternich', similarity: 80, reason: 'Diplomatic mastermind' };
  }
  if (economy >= 20) {
    return { historicalFigure: 'Colbert', similarity: 75, reason: 'Economic visionary' };
  }
  if (military >= 15) {
    return { historicalFigure: 'Frederick the Great', similarity: 70, reason: 'Military excellence' };
  }
  if (culture >= 10) {
    return { historicalFigure: 'Lorenzo de Medici', similarity: 65, reason: 'Patron of arts and learning' };
  }

  return { historicalFigure: 'A minor noble', similarity: 30, reason: 'Unremarkable reign' };
}

function generateEpitaph(categories: ScoreCategory[], nation: Nation, years: number): string {
  const best = categories.reduce((a, b) =>
    (a.score / a.maxScore) > (b.score / b.maxScore) ? a : b
  );

  const epitaphs: Record<string, string> = {
    'Military Glory': `Here lies a ruler who forged ${nation.name} through ${years} years of conquest and glory.`,
    'Economic Prosperity': `Here lies a ruler who brought ${years} years of prosperity and wealth to ${nation.name}.`,
    'Diplomatic Influence': `Here lies a ruler who wove ${nation.name} into the fabric of nations for ${years} years.`,
    'Cultural Legacy': `Here lies a ruler who illuminated ${nation.name} with ${years} years of enlightenment.`,
    'Longevity': `Here lies a ruler who guided ${nation.name} through ${years} years of history.`
  };

  return epitaphs[best.name] || `Here lies a ruler of ${nation.name}.`;
}

// Persist high scores
const SCORES_KEY = 'chronicles_highscores';

export function saveHighScore(score: LegacyScore, nationName: string): void {
  try {
    const scores = JSON.parse(localStorage.getItem(SCORES_KEY) || '[]');
    scores.push({
      score: score.total,
      grade: score.grade,
      title: score.title,
      nationName,
      timestamp: Date.now()
    });
    scores.sort((a: any, b: any) => b.score - a.score);
    localStorage.setItem(SCORES_KEY, JSON.stringify(scores.slice(0, 10)));
  } catch (e) {
    console.error('Failed to save high score:', e);
  }
}

export function getHighScores(): Array<{
  score: number;
  grade: string;
  title: string;
  nationName: string;
  timestamp: number;
}> {
  try {
    return JSON.parse(localStorage.getItem(SCORES_KEY) || '[]');
  } catch {
    return [];
  }
}

export default {
  calculateLegacyScore,
  saveHighScore,
  getHighScores
};
