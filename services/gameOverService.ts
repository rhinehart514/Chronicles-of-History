// Game over condition checking

import { Nation, War, LogEntry } from '../types';

export type GameOverReason =
  | 'stability_collapse'
  | 'conquered'
  | 'revolution'
  | 'bankruptcy'
  | 'dynasty_end'
  | 'victory'
  | 'abdication';

export interface GameOverState {
  isGameOver: boolean;
  reason?: GameOverReason;
  title: string;
  description: string;
  canContinue: boolean;
}

// Check all game over conditions
export function checkGameOver(
  nation: Nation,
  wars: War[],
  logs: LogEntry[],
  year: number
): GameOverState {
  // Check stability collapse
  if (nation.stats.stability <= 0) {
    return {
      isGameOver: true,
      reason: 'stability_collapse',
      title: 'The Nation Collapses',
      description: `${nation.name} has fallen into complete chaos. The government has lost all control and the nation descends into anarchy.`,
      canContinue: false
    };
  }

  // Check if conquered (no territories left)
  if (nation.geoNames && nation.geoNames.length === 0) {
    return {
      isGameOver: true,
      reason: 'conquered',
      title: 'Total Defeat',
      description: `${nation.name} has lost all its territories. The nation ceases to exist as a sovereign state.`,
      canContinue: false
    };
  }

  // Check economic collapse
  if (nation.stats.economy <= 0) {
    return {
      isGameOver: true,
      reason: 'bankruptcy',
      title: 'Economic Collapse',
      description: `${nation.name} has gone completely bankrupt. Unable to pay its debts or fund basic services, the government collapses.`,
      canContinue: false
    };
  }

  // Check for revolution (very low stability + low faction approval)
  const avgFactionApproval = nation.factions
    ? nation.factions.reduce((sum, f) => sum + f.approval, 0) / nation.factions.length
    : 50;

  if (nation.stats.stability <= 1 && avgFactionApproval < 20) {
    return {
      isGameOver: true,
      reason: 'revolution',
      title: 'Revolution!',
      description: `The people of ${nation.name} have risen up! The government has been overthrown in a violent revolution.`,
      canContinue: false
    };
  }

  // Check dynasty end (no heir and old ruler)
  if (nation.court?.succession?.crisisRisk && nation.court.succession.crisisRisk >= 100) {
    return {
      isGameOver: true,
      reason: 'dynasty_end',
      title: 'Dynasty Ends',
      description: `The ruling dynasty of ${nation.name} has ended with no clear heir. A succession crisis tears the nation apart.`,
      canContinue: false
    };
  }

  // Check for victory conditions
  const victoryCheck = checkVictoryConditions(nation, year, logs);
  if (victoryCheck) {
    return victoryCheck;
  }

  // Game continues
  return {
    isGameOver: false,
    title: '',
    description: '',
    canContinue: true
  };
}

// Check various victory conditions
function checkVictoryConditions(
  nation: Nation,
  year: number,
  logs: LogEntry[]
): GameOverState | null {
  // Domination victory - control many territories
  if (nation.geoNames && nation.geoNames.length >= 15) {
    return {
      isGameOver: true,
      reason: 'victory',
      title: 'Domination Victory!',
      description: `${nation.name} has achieved dominance over a vast empire spanning ${nation.geoNames.length} territories!`,
      canContinue: true // Can keep playing
    };
  }

  // Golden age victory - all stats maxed
  const allMaxed = Object.values(nation.stats).every(s => s >= 5);
  if (allMaxed) {
    return {
      isGameOver: true,
      reason: 'victory',
      title: 'Golden Age Victory!',
      description: `${nation.name} has achieved a perfect golden age! All aspects of the nation are at their peak.`,
      canContinue: true
    };
  }

  // Longevity victory - survive 200 years
  const conquests = logs.filter(l => l.type === 'CONQUEST').length;
  const yearsPlayed = logs.length > 0 ? year - logs[0].year : 0;

  if (yearsPlayed >= 200) {
    return {
      isGameOver: true,
      reason: 'victory',
      title: 'Enduring Legacy Victory!',
      description: `${nation.name} has stood the test of time for over 200 years. A truly enduring legacy!`,
      canContinue: true
    };
  }

  return null;
}

// Get warning messages for near-game-over states
export function getWarnings(nation: Nation): string[] {
  const warnings: string[] = [];

  if (nation.stats.stability <= 2) {
    warnings.push('⚠️ Stability critical! Risk of collapse.');
  }

  if (nation.stats.economy <= 1) {
    warnings.push('⚠️ Economy failing! Bankruptcy imminent.');
  }

  const avgApproval = nation.factions
    ? nation.factions.reduce((sum, f) => sum + f.approval, 0) / nation.factions.length
    : 50;

  if (avgApproval < 30) {
    warnings.push('⚠️ Faction unrest! Revolution brewing.');
  }

  if (nation.court?.succession?.crisisRisk && nation.court.succession.crisisRisk >= 80) {
    warnings.push('⚠️ Succession crisis looming!');
  }

  return warnings;
}

// Check if player should receive a warning
export function shouldWarn(nation: Nation): boolean {
  return getWarnings(nation).length > 0;
}

export default {
  checkGameOver,
  getWarnings,
  shouldWarn
};
