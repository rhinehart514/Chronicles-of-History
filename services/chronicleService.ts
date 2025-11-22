// Chronicle/Newspaper generator for summarizing reigns

import { Nation, LogEntry, NationStats } from '../types';

export interface ChronicleEntry {
  headline: string;
  year: number;
  content: string;
  type: 'major' | 'minor';
}

export interface Chronicle {
  title: string;
  subtitle: string;
  nationName: string;
  rulerName: string;
  startYear: number;
  endYear: number;
  entries: ChronicleEntry[];
  statistics: {
    yearsRuled: number;
    warsWon: number;
    territoriesGained: number;
    peakStats: Partial<NationStats>;
  };
  epitaph: string;
}

// Generate headlines for different event types
function generateHeadline(log: LogEntry): string {
  const content = log.content.toLowerCase();

  if (log.type === 'WAR') {
    if (content.includes('victory')) return 'GLORIOUS VICTORY!';
    if (content.includes('defeat')) return 'DEVASTATING DEFEAT';
    if (content.includes('declares war')) return 'WAR DECLARED!';
    if (content.includes('peace')) return 'PEACE ACHIEVED';
    return 'WAR NEWS';
  }

  if (log.type === 'CONQUEST') {
    return 'TERRITORY ANNEXED!';
  }

  if (log.type === 'DECISION') {
    if (content.includes('reform')) return 'SWEEPING REFORMS';
    if (content.includes('tax')) return 'NEW TAX POLICY';
    if (content.includes('alliance')) return 'NEW ALLIANCE FORMED';
    if (content.includes('trade')) return 'TRADE AGREEMENT SIGNED';
    return 'ROYAL DECREE';
  }

  if (log.type === 'EVENT') {
    if (content.includes('died') || content.includes('death')) return 'MOURNING IN THE REALM';
    if (content.includes('born') || content.includes('heir')) return 'JOYOUS NEWS!';
    if (content.includes('revolt') || content.includes('rebellion')) return 'UNREST IN THE REALM';
    if (content.includes('research') || content.includes('technology')) return 'SCIENTIFIC ADVANCEMENT';
    return 'NEWS FROM THE REALM';
  }

  return 'COURT NEWS';
}

// Generate a chronicle from game logs
export function generateChronicle(
  nation: Nation,
  logs: LogEntry[],
  startYear: number,
  endYear: number
): Chronicle {
  // Filter logs for this nation
  const nationLogs = logs.filter(
    l => l.nationName === nation.name ||
         l.type === 'DECISION' ||
         l.type === 'WAR' ||
         l.type === 'CONQUEST'
  );

  // Group significant events
  const entries: ChronicleEntry[] = nationLogs
    .filter(l => l.type !== 'WORLD_UPDATE')
    .map(log => ({
      headline: generateHeadline(log),
      year: log.year,
      content: log.content,
      type: ['WAR', 'CONQUEST', 'LEGACY'].includes(log.type) ? 'major' : 'minor'
    }))
    .slice(-20); // Keep last 20 entries

  // Calculate statistics
  const warsWon = nationLogs.filter(
    l => l.type === 'WAR' && l.content.toLowerCase().includes('victory')
  ).length;

  const territoriesGained = nationLogs.filter(
    l => l.type === 'CONQUEST'
  ).length;

  // Generate epitaph based on achievements
  let epitaph = 'A reign to be remembered.';
  if (warsWon >= 5) {
    epitaph = 'A warrior ruler whose conquests reshaped the map.';
  } else if (territoriesGained >= 3) {
    epitaph = 'An expansionist who grew the realm to new heights.';
  } else if (nation.stats.economy >= 4) {
    epitaph = 'A merchant sovereign who brought prosperity to all.';
  } else if (nation.stats.innovation >= 4) {
    epitaph = 'A patron of progress and enlightenment.';
  } else if (nation.stats.stability >= 4) {
    epitaph = 'A wise ruler who maintained peace and order.';
  }

  const rulerTitle = nation.court?.leader?.name || nation.rulerTitle || 'The Ruler';

  return {
    title: `The ${nation.name} Chronicle`,
    subtitle: `A Record of the Reign of ${rulerTitle}`,
    nationName: nation.name,
    rulerName: rulerTitle,
    startYear,
    endYear,
    entries,
    statistics: {
      yearsRuled: endYear - startYear,
      warsWon,
      territoriesGained,
      peakStats: { ...nation.stats }
    },
    epitaph
  };
}

// Format chronicle as printable text
export function formatChronicleAsText(chronicle: Chronicle): string {
  const lines: string[] = [
    '═'.repeat(60),
    '',
    chronicle.title.toUpperCase(),
    chronicle.subtitle,
    '',
    '═'.repeat(60),
    '',
    `Years: ${chronicle.startYear} - ${chronicle.endYear}`,
    `Duration: ${chronicle.statistics.yearsRuled} years`,
    '',
    '─'.repeat(60),
    'NOTABLE EVENTS',
    '─'.repeat(60),
    ''
  ];

  // Group entries by year
  const byYear = new Map<number, ChronicleEntry[]>();
  chronicle.entries.forEach(entry => {
    const existing = byYear.get(entry.year) || [];
    byYear.set(entry.year, [...existing, entry]);
  });

  // Add entries
  Array.from(byYear.entries())
    .sort(([a], [b]) => a - b)
    .forEach(([year, entries]) => {
      lines.push(`[${year}]`);
      entries.forEach(entry => {
        const prefix = entry.type === 'major' ? '★ ' : '  ';
        lines.push(`${prefix}${entry.headline}`);
        lines.push(`   ${entry.content}`);
      });
      lines.push('');
    });

  lines.push('─'.repeat(60));
  lines.push('STATISTICS');
  lines.push('─'.repeat(60));
  lines.push(`Wars Won: ${chronicle.statistics.warsWon}`);
  lines.push(`Territories Gained: ${chronicle.statistics.territoriesGained}`);
  lines.push('');
  lines.push('─'.repeat(60));
  lines.push('EPITAPH');
  lines.push('─'.repeat(60));
  lines.push(chronicle.epitaph);
  lines.push('');
  lines.push('═'.repeat(60));

  return lines.join('\n');
}

// Download chronicle as text file
export function downloadChronicle(chronicle: Chronicle): void {
  const text = formatChronicleAsText(chronicle);
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `chronicle_${chronicle.nationName.replace(/\s+/g, '_')}_${chronicle.endYear}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export default {
  generateChronicle,
  formatChronicleAsText,
  downloadChronicle
};
