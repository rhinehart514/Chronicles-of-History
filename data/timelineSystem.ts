// Historical timeline and event tracking system

export interface HistoricalEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  category: EventCategory;
  importance: EventImportance;
  participants: string[];
  effects?: string[];
  relatedEvents?: string[];
}

export type EventCategory =
  | 'war'
  | 'diplomacy'
  | 'economy'
  | 'religion'
  | 'dynasty'
  | 'discovery'
  | 'disaster'
  | 'reform'
  | 'achievement';

export type EventImportance = 'minor' | 'normal' | 'major' | 'critical';

export interface TimelinePeriod {
  name: string;
  startYear: number;
  endYear: number;
  description: string;
  keyEvents: string[];
}

export interface StatSnapshot {
  date: string;
  development: number;
  income: number;
  manpower: number;
  provinces: number;
  score: number;
}

// Historical periods
export const TIMELINE_PERIODS: TimelinePeriod[] = [
  {
    name: 'Age of Discovery',
    startYear: 1444,
    endYear: 1500,
    description: 'The beginning of European exploration and colonial expansion.',
    keyEvents: []
  },
  {
    name: 'Age of Reformation',
    startYear: 1500,
    endYear: 1600,
    description: 'Religious upheaval and the Protestant Reformation.',
    keyEvents: []
  },
  {
    name: 'Age of Absolutism',
    startYear: 1600,
    endYear: 1700,
    description: 'The rise of powerful centralized monarchies.',
    keyEvents: []
  },
  {
    name: 'Age of Revolutions',
    startYear: 1700,
    endYear: 1821,
    description: 'Political and industrial revolutions reshape the world.',
    keyEvents: []
  }
];

// Event importance modifiers
export const IMPORTANCE_MODIFIERS: Record<EventImportance, number> = {
  minor: 1,
  normal: 2,
  major: 5,
  critical: 10
};

// Get category icon
export function getCategoryIcon(category: EventCategory): string {
  const icons: Record<EventCategory, string> = {
    war: '⚔️',
    diplomacy: '🤝',
    economy: '💰',
    religion: '✝️',
    dynasty: '👑',
    discovery: '🗺️',
    disaster: '🔥',
    reform: '📜',
    achievement: '🏆'
  };
  return icons[category];
}

// Get category color
export function getCategoryColor(category: EventCategory): string {
  const colors: Record<EventCategory, string> = {
    war: 'red',
    diplomacy: 'blue',
    economy: 'yellow',
    religion: 'purple',
    dynasty: 'amber',
    discovery: 'green',
    disaster: 'orange',
    reform: 'cyan',
    achievement: 'gold'
  };
  return colors[category];
}

// Get importance color
export function getImportanceColor(importance: EventImportance): string {
  const colors: Record<EventImportance, string> = {
    minor: 'stone',
    normal: 'blue',
    major: 'amber',
    critical: 'red'
  };
  return colors[importance];
}

// Get period for year
export function getPeriodForYear(year: number): TimelinePeriod | undefined {
  return TIMELINE_PERIODS.find(p => year >= p.startYear && year < p.endYear);
}

// Filter events by category
export function filterEventsByCategory(
  events: HistoricalEvent[],
  category: EventCategory
): HistoricalEvent[] {
  return events.filter(e => e.category === category);
}

// Filter events by importance
export function filterEventsByImportance(
  events: HistoricalEvent[],
  minImportance: EventImportance
): HistoricalEvent[] {
  const importanceOrder: EventImportance[] = ['minor', 'normal', 'major', 'critical'];
  const minIndex = importanceOrder.indexOf(minImportance);
  return events.filter(e => importanceOrder.indexOf(e.importance) >= minIndex);
}

// Filter events by date range
export function filterEventsByDateRange(
  events: HistoricalEvent[],
  startDate: string,
  endDate: string
): HistoricalEvent[] {
  return events.filter(e => e.date >= startDate && e.date <= endDate);
}

// Sort events by date
export function sortEventsByDate(
  events: HistoricalEvent[],
  ascending: boolean = true
): HistoricalEvent[] {
  return [...events].sort((a, b) => {
    return ascending
      ? a.date.localeCompare(b.date)
      : b.date.localeCompare(a.date);
  });
}

// Get events for nation
export function getEventsForNation(
  events: HistoricalEvent[],
  nationId: string
): HistoricalEvent[] {
  return events.filter(e => e.participants.includes(nationId));
}

// Calculate timeline score
export function calculateTimelineScore(events: HistoricalEvent[]): number {
  return events.reduce((sum, e) => sum + IMPORTANCE_MODIFIERS[e.importance], 0);
}

// Get related events
export function getRelatedEvents(
  events: HistoricalEvent[],
  eventId: string
): HistoricalEvent[] {
  const event = events.find(e => e.id === eventId);
  if (!event?.relatedEvents) return [];
  return events.filter(e => event.relatedEvents?.includes(e.id));
}

// Create war event
export function createWarEvent(
  id: string,
  date: string,
  warName: string,
  participants: string[],
  isStart: boolean
): HistoricalEvent {
  return {
    id,
    date,
    title: isStart ? `${warName} Begins` : `${warName} Ends`,
    description: isStart
      ? `War declared between ${participants.join(' and ')}`
      : `Peace treaty signed ending ${warName}`,
    category: 'war',
    importance: 'major',
    participants
  };
}

// Create dynasty event
export function createDynastyEvent(
  id: string,
  date: string,
  rulerName: string,
  nationId: string,
  eventType: 'coronation' | 'death' | 'heir'
): HistoricalEvent {
  const titles: Record<string, string> = {
    coronation: `${rulerName} Crowned`,
    death: `${rulerName} Dies`,
    heir: `Heir ${rulerName} Born`
  };

  return {
    id,
    date,
    title: titles[eventType],
    description: `${eventType === 'coronation' ? 'New ruler' : eventType === 'death' ? 'Ruler' : 'Heir'} of the nation`,
    category: 'dynasty',
    importance: eventType === 'coronation' ? 'major' : 'normal',
    participants: [nationId]
  };
}

// Format date for display
export function formatDate(date: string): string {
  const [year, month, day] = date.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${day} ${months[parseInt(month) - 1]} ${year}`;
}

export default {
  TIMELINE_PERIODS,
  IMPORTANCE_MODIFIERS,
  getCategoryIcon,
  getCategoryColor,
  getImportanceColor,
  getPeriodForYear,
  filterEventsByCategory,
  filterEventsByImportance,
  filterEventsByDateRange,
  sortEventsByDate,
  getEventsForNation,
  calculateTimelineScore,
  getRelatedEvents,
  createWarEvent,
  createDynastyEvent,
  formatDate
};
