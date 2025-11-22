// Timeline comparison - shows alternate history vs real history

import { LogEntry } from '../types';

export interface TimelineEvent {
  year: number;
  event: string;
  type: 'player' | 'historical' | 'divergence';
}

export interface TimelineComparison {
  playerTimeline: TimelineEvent[];
  historicalTimeline: TimelineEvent[];
  divergencePoints: DivergencePoint[];
  alternatHistoryScore: number;
}

export interface DivergencePoint {
  year: number;
  playerEvent: string;
  historicalEvent: string;
  impact: 'minor' | 'major' | 'critical';
  description: string;
}

// Major historical events by year range
const HISTORICAL_EVENTS: Record<string, TimelineEvent[]> = {
  '1750-1760': [
    { year: 1756, event: 'Seven Years War begins', type: 'historical' },
    { year: 1757, event: 'Battle of Plassey - British victory in India', type: 'historical' }
  ],
  '1760-1770': [
    { year: 1762, event: 'Catherine the Great becomes Empress of Russia', type: 'historical' },
    { year: 1763, event: 'Treaty of Paris ends Seven Years War', type: 'historical' }
  ],
  '1770-1780': [
    { year: 1773, event: 'Boston Tea Party', type: 'historical' },
    { year: 1775, event: 'American Revolutionary War begins', type: 'historical' },
    { year: 1776, event: 'Declaration of Independence', type: 'historical' }
  ],
  '1780-1790': [
    { year: 1783, event: 'Treaty of Paris - American independence', type: 'historical' },
    { year: 1789, event: 'French Revolution begins', type: 'historical' },
    { year: 1789, event: 'George Washington becomes first US President', type: 'historical' }
  ],
  '1790-1800': [
    { year: 1793, event: 'Louis XVI executed', type: 'historical' },
    { year: 1799, event: 'Napoleon becomes First Consul', type: 'historical' }
  ],
  '1800-1810': [
    { year: 1804, event: 'Napoleon crowned Emperor', type: 'historical' },
    { year: 1805, event: 'Battle of Trafalgar', type: 'historical' },
    { year: 1805, event: 'Battle of Austerlitz', type: 'historical' }
  ],
  '1810-1820': [
    { year: 1812, event: 'Napoleon invades Russia', type: 'historical' },
    { year: 1815, event: 'Battle of Waterloo - Napoleon defeated', type: 'historical' },
    { year: 1815, event: 'Congress of Vienna', type: 'historical' }
  ],
  '1820-1830': [
    { year: 1821, event: 'Greek War of Independence begins', type: 'historical' },
    { year: 1825, event: 'Decembrist Revolt in Russia', type: 'historical' }
  ],
  '1830-1840': [
    { year: 1830, event: 'July Revolution in France', type: 'historical' },
    { year: 1837, event: 'Queen Victoria crowned', type: 'historical' }
  ],
  '1840-1850': [
    { year: 1848, event: 'Revolutions of 1848 across Europe', type: 'historical' },
    { year: 1848, event: 'Communist Manifesto published', type: 'historical' }
  ],
  '1850-1860': [
    { year: 1853, event: 'Crimean War begins', type: 'historical' },
    { year: 1857, event: 'Indian Rebellion', type: 'historical' }
  ],
  '1860-1870': [
    { year: 1861, event: 'American Civil War begins', type: 'historical' },
    { year: 1866, event: 'Austro-Prussian War', type: 'historical' },
    { year: 1867, event: 'Meiji Restoration in Japan', type: 'historical' }
  ],
  '1870-1880': [
    { year: 1870, event: 'Franco-Prussian War', type: 'historical' },
    { year: 1871, event: 'German Empire proclaimed', type: 'historical' }
  ]
};

// Generate timeline comparison
export function generateTimelineComparison(
  logs: LogEntry[],
  startYear: number,
  endYear: number,
  nationId: string
): TimelineComparison {
  // Extract player events
  const playerTimeline: TimelineEvent[] = logs
    .filter(l => l.type === 'WAR' || l.type === 'CONQUEST' || l.type === 'DECISION')
    .filter(l => l.year >= startYear && l.year <= endYear)
    .map(l => ({
      year: l.year,
      event: l.content.length > 100 ? l.content.slice(0, 100) + '...' : l.content,
      type: 'player' as const
    }))
    .slice(-30);

  // Get historical events for the period
  const historicalTimeline: TimelineEvent[] = [];
  for (const [range, events] of Object.entries(HISTORICAL_EVENTS)) {
    const [rangeStart, rangeEnd] = range.split('-').map(Number);
    if (rangeEnd >= startYear && rangeStart <= endYear) {
      historicalTimeline.push(...events.filter(e => e.year >= startYear && e.year <= endYear));
    }
  }

  // Find divergence points
  const divergencePoints = findDivergences(playerTimeline, historicalTimeline);

  // Calculate how alternate the history is
  const alternatHistoryScore = calculateAlternateScore(divergencePoints, playerTimeline.length);

  return {
    playerTimeline,
    historicalTimeline,
    divergencePoints,
    alternatHistoryScore
  };
}

function findDivergences(
  playerEvents: TimelineEvent[],
  historicalEvents: TimelineEvent[]
): DivergencePoint[] {
  const divergences: DivergencePoint[] = [];

  // Check for major historical events that player may have altered
  for (const hist of historicalEvents) {
    // Find player events near this historical event
    const nearbyPlayer = playerEvents.filter(
      p => Math.abs(p.year - hist.year) <= 2
    );

    if (nearbyPlayer.length > 0) {
      // Check if player action might have changed history
      const playerEvent = nearbyPlayer[0];

      if (playerEvent.event.toLowerCase().includes('war') ||
          playerEvent.event.toLowerCase().includes('defeat') ||
          playerEvent.event.toLowerCase().includes('conquer')) {

        divergences.push({
          year: hist.year,
          playerEvent: playerEvent.event,
          historicalEvent: hist.event,
          impact: determineImpact(playerEvent.event, hist.event),
          description: `Your actions may have altered the course of "${hist.event}"`
        });
      }
    }
  }

  return divergences.slice(0, 10); // Limit to 10 divergences
}

function determineImpact(playerEvent: string, historicalEvent: string): 'minor' | 'major' | 'critical' {
  const criticalKeywords = ['revolution', 'independence', 'empire', 'emperor', 'war begins'];
  const majorKeywords = ['battle', 'treaty', 'alliance', 'conquest'];

  const combined = (playerEvent + historicalEvent).toLowerCase();

  if (criticalKeywords.some(k => combined.includes(k))) return 'critical';
  if (majorKeywords.some(k => combined.includes(k))) return 'major';
  return 'minor';
}

function calculateAlternateScore(divergences: DivergencePoint[], playerEventCount: number): number {
  let score = 0;

  // Base score from number of events
  score += Math.min(30, playerEventCount * 2);

  // Score from divergences
  for (const div of divergences) {
    if (div.impact === 'critical') score += 20;
    else if (div.impact === 'major') score += 10;
    else score += 5;
  }

  return Math.min(100, score);
}

// Format timeline for display
export function formatTimelineText(comparison: TimelineComparison): string {
  const lines: string[] = [
    '═══════════════════════════════════════════',
    '         YOUR ALTERNATE HISTORY',
    '═══════════════════════════════════════════',
    '',
    `Alternate History Score: ${comparison.alternatHistoryScore}/100`,
    '',
    '───────────────────────────────────────────',
    '          DIVERGENCE POINTS',
    '───────────────────────────────────────────',
    ''
  ];

  if (comparison.divergencePoints.length === 0) {
    lines.push('Your timeline closely followed real history.');
  } else {
    for (const div of comparison.divergencePoints) {
      lines.push(`[${div.year}] ${div.impact.toUpperCase()}`);
      lines.push(`  Historical: ${div.historicalEvent}`);
      lines.push(`  Your action: ${div.playerEvent.slice(0, 60)}...`);
      lines.push(`  Impact: ${div.description}`);
      lines.push('');
    }
  }

  lines.push('───────────────────────────────────────────');
  lines.push('          YOUR KEY EVENTS');
  lines.push('───────────────────────────────────────────');
  lines.push('');

  for (const event of comparison.playerTimeline.slice(-10)) {
    lines.push(`[${event.year}] ${event.event}`);
  }

  return lines.join('\n');
}

export default {
  generateTimelineComparison,
  formatTimelineText
};
