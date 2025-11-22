import React, { useState } from 'react';

interface HistoricalEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  category: string;
  importance: string;
  icon: string;
}

interface TimelinePeriod {
  name: string;
  startYear: number;
  endYear: number;
}

interface HistoryTimelineProps {
  events: HistoricalEvent[];
  periods: TimelinePeriod[];
  currentYear: number;
  nationName: string;
  onEventClick?: (eventId: string) => void;
  onClose: () => void;
}

export default function HistoryTimeline({
  events,
  periods,
  currentYear,
  nationName,
  onEventClick,
  onClose
}: HistoryTimelineProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<TimelinePeriod | null>(null);

  const categories = [
    { id: 'war', label: 'Wars', icon: '⚔️' },
    { id: 'diplomacy', label: 'Diplomacy', icon: '🤝' },
    { id: 'dynasty', label: 'Dynasty', icon: '👑' },
    { id: 'economy', label: 'Economy', icon: '💰' },
    { id: 'discovery', label: 'Discovery', icon: '🗺️' },
    { id: 'achievement', label: 'Achievements', icon: '🏆' }
  ];

  const getImportanceColor = (importance: string) => {
    const colors: Record<string, string> = {
      minor: 'border-stone-500',
      normal: 'border-blue-500',
      major: 'border-amber-500',
      critical: 'border-red-500'
    };
    return colors[importance] || 'border-stone-500';
  };

  const getCurrentPeriod = () => {
    return periods.find(p => currentYear >= p.startYear && currentYear < p.endYear);
  };

  const filteredEvents = events
    .filter(e => !selectedCategory || e.category === selectedCategory)
    .filter(e => {
      if (!selectedPeriod) return true;
      const eventYear = parseInt(e.date.split('-')[0]);
      return eventYear >= selectedPeriod.startYear && eventYear < selectedPeriod.endYear;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-stone-800 rounded-lg shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col">
        <div className="p-4 border-b border-stone-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-amber-100">History of {nationName}</h2>
            <div className="text-xs text-stone-400">
              {getCurrentPeriod()?.name || 'Unknown Era'} • Year {currentYear}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200"
          >
            ✕
          </button>
        </div>

        {/* Period Selection */}
        <div className="px-4 py-2 bg-stone-900 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setSelectedPeriod(null)}
            className={`px-3 py-1 rounded text-xs whitespace-nowrap ${
              !selectedPeriod
                ? 'bg-amber-600 text-white'
                : 'bg-stone-700 hover:bg-stone-600'
            }`}
          >
            All Time
          </button>
          {periods.map(period => (
            <button
              key={period.name}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 rounded text-xs whitespace-nowrap ${
                selectedPeriod?.name === period.name
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-700 hover:bg-stone-600'
              }`}
            >
              {period.name}
            </button>
          ))}
        </div>

        {/* Category Filters */}
        <div className="px-4 py-2 border-b border-stone-700 flex gap-1 flex-wrap">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-2 py-1 rounded text-xs ${
              !selectedCategory
                ? 'bg-amber-600 text-white'
                : 'bg-stone-700 hover:bg-stone-600'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2 py-1 rounded text-xs ${
                selectedCategory === cat.id
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-700 hover:bg-stone-600'
              }`}
            >
              {cat.icon}
            </button>
          ))}
        </div>

        {/* Events List */}
        <div className="p-4 overflow-y-auto flex-1">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-8 text-stone-400">
              <div className="text-3xl mb-2">📜</div>
              <div>No events recorded</div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEvents.map(event => (
                <div
                  key={event.id}
                  onClick={() => onEventClick?.(event.id)}
                  className={`bg-stone-700 rounded-lg p-3 border-l-4 ${getImportanceColor(event.importance)} cursor-pointer hover:bg-stone-600 transition-colors`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{event.icon}</span>
                      <span className="font-medium text-sm">{event.title}</span>
                    </div>
                    <span className="text-xs text-stone-400 whitespace-nowrap ml-2">
                      {event.date.split('-').reverse().join('.')}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400">{event.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="p-3 border-t border-stone-700 bg-stone-900">
          <div className="flex justify-around text-center text-xs">
            <div>
              <div className="font-bold text-amber-400">{events.length}</div>
              <div className="text-stone-400">Total Events</div>
            </div>
            <div>
              <div className="font-bold text-red-400">
                {events.filter(e => e.category === 'war').length}
              </div>
              <div className="text-stone-400">Wars</div>
            </div>
            <div>
              <div className="font-bold text-green-400">
                {events.filter(e => e.importance === 'critical' || e.importance === 'major').length}
              </div>
              <div className="text-stone-400">Major Events</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
