import React, { useState } from 'react';

interface TimelineProps {
  isOpen: boolean;
  onClose: () => void;
  events: TimelineEvent[];
  currentYear: number;
  startYear: number;
}

export interface TimelineEvent {
  id: string;
  year: number;
  month: number;
  day?: number;
  title: string;
  description: string;
  type: EventType;
  icon: string;
  importance: 'minor' | 'normal' | 'major' | 'critical';
  related?: {
    nationId?: string;
    provinceId?: string;
    characterId?: string;
  };
}

type EventType =
  | 'war_declared'
  | 'war_ended'
  | 'battle'
  | 'siege'
  | 'peace_treaty'
  | 'alliance'
  | 'royal_marriage'
  | 'succession'
  | 'death'
  | 'birth'
  | 'discovery'
  | 'reform'
  | 'rebellion'
  | 'conquest'
  | 'colonization'
  | 'trade'
  | 'disaster'
  | 'achievement';

export const Timeline: React.FC<TimelineProps> = ({
  isOpen,
  onClose,
  events,
  currentYear,
  startYear
}) => {
  const [filterType, setFilterType] = useState<EventType | 'all'>('all');
  const [filterImportance, setFilterImportance] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  if (!isOpen) return null;

  const eventTypes: { id: EventType; name: string; icon: string }[] = [
    { id: 'war_declared', name: 'Wars', icon: '⚔️' },
    { id: 'battle', name: 'Battles', icon: '🗡️' },
    { id: 'peace_treaty', name: 'Treaties', icon: '📜' },
    { id: 'alliance', name: 'Diplomacy', icon: '🤝' },
    { id: 'succession', name: 'Rulers', icon: '👑' },
    { id: 'conquest', name: 'Conquest', icon: '🏴' },
    { id: 'reform', name: 'Reforms', icon: '⚙️' },
    { id: 'discovery', name: 'Discovery', icon: '🔭' }
  ];

  const filteredEvents = events
    .filter(e => filterType === 'all' || e.type === filterType)
    .filter(e => filterImportance === 'all' || e.importance === filterImportance)
    .sort((a, b) => {
      if (b.year !== a.year) return b.year - a.year;
      if (b.month !== a.month) return b.month - a.month;
      return (b.day || 1) - (a.day || 1);
    });

  const selected = events.find(e => e.id === selectedEvent);

  // Group events by year
  const eventsByYear: Record<number, TimelineEvent[]> = {};
  filteredEvents.forEach(event => {
    if (!eventsByYear[event.year]) {
      eventsByYear[event.year] = [];
    }
    eventsByYear[event.year].push(event);
  });

  const years = Object.keys(eventsByYear)
    .map(Number)
    .sort((a, b) => b - a);

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'critical': return 'bg-red-500';
      case 'major': return 'bg-amber-500';
      case 'normal': return 'bg-blue-500';
      case 'minor': return 'bg-stone-400';
      default: return 'bg-stone-400';
    }
  };

  const getTypeIcon = (type: EventType) => {
    const typeInfo = eventTypes.find(t => t.id === type);
    return typeInfo?.icon || '📝';
  };

  const formatDate = (year: number, month: number, day?: number) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (day) {
      return `${months[month - 1]} ${day}, ${year}`;
    }
    return `${months[month - 1]} ${year}`;
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-stone-800">📜 Chronicle</h2>
            <div className="text-sm text-stone-500">
              {events.length} events from {startYear} to {currentYear}
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Filters */}
        <div className="p-3 border-b border-stone-200 space-y-2">
          <div className="flex gap-1 flex-wrap">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded text-sm ${
                filterType === 'all' ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-700'
              }`}
            >
              All
            </button>
            {eventTypes.map(type => (
              <button
                key={type.id}
                onClick={() => setFilterType(type.id)}
                className={`px-3 py-1 rounded text-sm ${
                  filterType === type.id ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-700'
                }`}
              >
                {type.icon} {type.name}
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            {['all', 'critical', 'major', 'normal', 'minor'].map(imp => (
              <button
                key={imp}
                onClick={() => setFilterImportance(imp)}
                className={`px-3 py-1 rounded text-sm capitalize ${
                  filterImportance === imp ? 'bg-stone-600 text-white' : 'bg-stone-200 text-stone-700'
                }`}
              >
                {imp}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Timeline */}
          <div className="w-2/3 border-r border-stone-200 overflow-y-auto p-4">
            {years.length === 0 ? (
              <p className="text-center text-stone-500 py-8">No events match your filters</p>
            ) : (
              <div className="space-y-6">
                {years.map(year => (
                  <div key={year}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="font-bold text-lg text-stone-800">{year}</div>
                      <div className="flex-1 h-px bg-stone-300" />
                    </div>
                    <div className="space-y-2 ml-4 border-l-2 border-stone-300 pl-4">
                      {eventsByYear[year].map(event => (
                        <button
                          key={event.id}
                          onClick={() => setSelectedEvent(event.id)}
                          className={`w-full text-left p-2 rounded-lg transition-all ${
                            selectedEvent === event.id
                              ? 'bg-amber-100 border-amber-300'
                              : 'bg-white hover:bg-stone-50'
                          } border`}
                        >
                          <div className="flex items-start gap-2">
                            <div className={`w-2 h-2 rounded-full mt-1.5 ${getImportanceColor(event.importance)}`} />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span>{event.icon}</span>
                                <span className="font-medium text-stone-800 text-sm">{event.title}</span>
                              </div>
                              <div className="text-xs text-stone-500">
                                {formatDate(event.year, event.month, event.day)}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Event details */}
          <div className="w-1/3 p-4 overflow-y-auto">
            {selected ? (
              <>
                <div className="text-center mb-4">
                  <span className="text-4xl">{selected.icon}</span>
                  <h3 className="font-bold text-stone-800 mt-2">{selected.title}</h3>
                  <p className="text-sm text-stone-500">
                    {formatDate(selected.year, selected.month, selected.day)}
                  </p>
                </div>

                <div className="mb-4">
                  <div className={`inline-block px-2 py-1 rounded text-xs text-white ${getImportanceColor(selected.importance)}`}>
                    {selected.importance.toUpperCase()}
                  </div>
                </div>

                <p className="text-sm text-stone-700 mb-4">
                  {selected.description}
                </p>

                {selected.related && (
                  <div className="text-xs text-stone-500 space-y-1">
                    {selected.related.nationId && (
                      <div>Nation: {selected.related.nationId}</div>
                    )}
                    {selected.related.provinceId && (
                      <div>Province: {selected.related.provinceId}</div>
                    )}
                    {selected.related.characterId && (
                      <div>Character: {selected.related.characterId}</div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <p className="text-center text-stone-500 py-8">
                Select an event to view details
              </p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="p-3 border-t border-stone-300 bg-stone-100">
          <div className="flex justify-around text-center text-xs">
            <div>
              <div className="font-bold text-stone-800">{events.filter(e => e.type === 'war_declared').length}</div>
              <div className="text-stone-500">Wars</div>
            </div>
            <div>
              <div className="font-bold text-stone-800">{events.filter(e => e.type === 'battle').length}</div>
              <div className="text-stone-500">Battles</div>
            </div>
            <div>
              <div className="font-bold text-stone-800">{events.filter(e => e.type === 'conquest').length}</div>
              <div className="text-stone-500">Conquests</div>
            </div>
            <div>
              <div className="font-bold text-stone-800">{events.filter(e => e.importance === 'critical').length}</div>
              <div className="text-stone-500">Critical</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
