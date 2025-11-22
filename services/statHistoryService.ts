// Track nation stats over time for graphs and analysis

import { NationStats } from '../types';

export interface StatSnapshot {
  year: number;
  stats: NationStats;
  territories?: number;
  population?: number;
  wars?: number;
  allies?: number;
}

export interface StatHistory {
  nationId: string;
  snapshots: StatSnapshot[];
}

export interface StatTrend {
  stat: keyof NationStats;
  direction: 'up' | 'down' | 'stable';
  change: number;
  percentChange: number;
}

// Storage key
const HISTORY_KEY = 'coh_stat_history';

// Get stat history for a nation
export function getStatHistory(nationId: string): StatHistory {
  const data = localStorage.getItem(HISTORY_KEY);
  if (!data) {
    return { nationId, snapshots: [] };
  }

  const allHistory: Record<string, StatHistory> = JSON.parse(data);
  return allHistory[nationId] || { nationId, snapshots: [] };
}

// Add a snapshot to history
export function addSnapshot(nationId: string, snapshot: StatSnapshot): void {
  const data = localStorage.getItem(HISTORY_KEY);
  const allHistory: Record<string, StatHistory> = data ? JSON.parse(data) : {};

  if (!allHistory[nationId]) {
    allHistory[nationId] = { nationId, snapshots: [] };
  }

  // Don't duplicate same year
  const existing = allHistory[nationId].snapshots.findIndex(s => s.year === snapshot.year);
  if (existing >= 0) {
    allHistory[nationId].snapshots[existing] = snapshot;
  } else {
    allHistory[nationId].snapshots.push(snapshot);
    // Keep sorted by year
    allHistory[nationId].snapshots.sort((a, b) => a.year - b.year);
  }

  // Limit to last 200 snapshots
  if (allHistory[nationId].snapshots.length > 200) {
    allHistory[nationId].snapshots = allHistory[nationId].snapshots.slice(-200);
  }

  localStorage.setItem(HISTORY_KEY, JSON.stringify(allHistory));
}

// Clear history for a nation (for new game)
export function clearHistory(nationId: string): void {
  const data = localStorage.getItem(HISTORY_KEY);
  if (!data) return;

  const allHistory: Record<string, StatHistory> = JSON.parse(data);
  delete allHistory[nationId];
  localStorage.setItem(HISTORY_KEY, JSON.stringify(allHistory));
}

// Calculate trends over a period
export function calculateTrends(
  history: StatHistory,
  periods: number = 10
): StatTrend[] {
  const snapshots = history.snapshots;
  if (snapshots.length < 2) return [];

  const recent = snapshots.slice(-periods);
  const first = recent[0];
  const last = recent[recent.length - 1];

  const trends: StatTrend[] = [];

  for (const stat of Object.keys(first.stats) as (keyof NationStats)[]) {
    const firstVal = first.stats[stat];
    const lastVal = last.stats[stat];
    const change = lastVal - firstVal;
    const percentChange = firstVal > 0 ? (change / firstVal) * 100 : 0;

    trends.push({
      stat,
      direction: change > 0.1 ? 'up' : change < -0.1 ? 'down' : 'stable',
      change: Math.round(change * 100) / 100,
      percentChange: Math.round(percentChange * 10) / 10
    });
  }

  return trends;
}

// Get peak value for a stat
export function getPeakValue(history: StatHistory, stat: keyof NationStats): { year: number; value: number } | null {
  if (history.snapshots.length === 0) return null;

  let peak = { year: history.snapshots[0].year, value: history.snapshots[0].stats[stat] };

  for (const snapshot of history.snapshots) {
    if (snapshot.stats[stat] > peak.value) {
      peak = { year: snapshot.year, value: snapshot.stats[stat] };
    }
  }

  return peak;
}

// Get lowest value for a stat
export function getLowestValue(history: StatHistory, stat: keyof NationStats): { year: number; value: number } | null {
  if (history.snapshots.length === 0) return null;

  let lowest = { year: history.snapshots[0].year, value: history.snapshots[0].stats[stat] };

  for (const snapshot of history.snapshots) {
    if (snapshot.stats[stat] < lowest.value) {
      lowest = { year: snapshot.year, value: snapshot.stats[stat] };
    }
  }

  return lowest;
}

// Calculate average for a stat over time
export function getAverageValue(history: StatHistory, stat: keyof NationStats): number {
  if (history.snapshots.length === 0) return 0;

  const sum = history.snapshots.reduce((acc, s) => acc + s.stats[stat], 0);
  return Math.round((sum / history.snapshots.length) * 100) / 100;
}

// Get data formatted for charts
export function getChartData(history: StatHistory, stats: (keyof NationStats)[]): {
  labels: number[];
  datasets: { stat: keyof NationStats; data: number[] }[];
} {
  return {
    labels: history.snapshots.map(s => s.year),
    datasets: stats.map(stat => ({
      stat,
      data: history.snapshots.map(s => s.stats[stat])
    }))
  };
}

// Compare two nations' histories
export function compareHistories(
  history1: StatHistory,
  history2: StatHistory,
  stat: keyof NationStats
): { year: number; value1: number; value2: number }[] {
  const years = new Set([
    ...history1.snapshots.map(s => s.year),
    ...history2.snapshots.map(s => s.year)
  ]);

  return Array.from(years).sort((a, b) => a - b).map(year => {
    const snap1 = history1.snapshots.find(s => s.year === year);
    const snap2 = history2.snapshots.find(s => s.year === year);

    return {
      year,
      value1: snap1?.stats[stat] ?? 0,
      value2: snap2?.stats[stat] ?? 0
    };
  });
}

// Get summary statistics
export function getStatSummary(history: StatHistory): Record<keyof NationStats, {
  current: number;
  average: number;
  peak: number;
  lowest: number;
  trend: 'up' | 'down' | 'stable';
}> {
  const stats = ['military', 'economy', 'stability', 'innovation', 'prestige'] as (keyof NationStats)[];
  const result: any = {};

  for (const stat of stats) {
    const current = history.snapshots.length > 0
      ? history.snapshots[history.snapshots.length - 1].stats[stat]
      : 0;

    const peak = getPeakValue(history, stat);
    const lowest = getLowestValue(history, stat);
    const trends = calculateTrends(history);
    const trend = trends.find(t => t.stat === stat);

    result[stat] = {
      current,
      average: getAverageValue(history, stat),
      peak: peak?.value ?? 0,
      lowest: lowest?.value ?? 0,
      trend: trend?.direction ?? 'stable'
    };
  }

  return result;
}

export default {
  getStatHistory,
  addSnapshot,
  clearHistory,
  calculateTrends,
  getPeakValue,
  getLowestValue,
  getAverageValue,
  getChartData,
  compareHistories,
  getStatSummary
};
