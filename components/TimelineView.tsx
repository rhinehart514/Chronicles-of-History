import React, { useState } from 'react';
import { LogEntry } from '../types';

interface TimelineViewProps {
  isOpen: boolean;
  onClose: () => void;
  logs: LogEntry[];
  currentYear: number;
  startYear: number;
  onYearClick?: (year: number) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  isOpen,
  onClose,
  logs,
  currentYear,
  startYear,
  onYearClick
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [selectedDecade, setSelectedDecade] = useState<number | null>(null);

  if (!isOpen) return null;

  const eventTypes = [
    { id: 'all', label: 'All', icon: '📜' },
    { id: 'WAR', label: 'Wars', icon: '⚔️' },
    { id: 'TREATY', label: 'Treaties', icon: '📝' },
    { id: 'CONQUEST', label: 'Conquests', icon: '🏰' },
    { id: 'REFORM', label: 'Reforms', icon: '⚖️' },
    { id: 'TECH', label: 'Technology', icon: '💡' },
    { id: 'CRISIS', label: 'Crises', icon: '⚠️' },
  ];

  const filteredLogs = logs.filter(log => {
    if (filter !== 'all' && log.type !== filter) return false;
    if (selectedDecade !== null) {
      const logDecade = Math.floor(log.year / 10) * 10;
      if (logDecade !== selectedDecade) return false;
    }
    return true;
  });

  // Group logs by year
  const logsByYear = filteredLogs.reduce((acc, log) => {
    if (!acc[log.year]) acc[log.year] = [];
    acc[log.year].push(log);
    return acc;
  }, {} as Record<number, LogEntry[]>);

  const years = Object.keys(logsByYear).map(Number).sort((a, b) => b - a);

  // Generate decades for quick navigation
  const decades: number[] = [];
  for (let d = Math.floor(startYear / 10) * 10; d <= currentYear; d += 10) {
    decades.push(d);
  }

  const getEventIcon = (type: string): string => {
    const found = eventTypes.find(t => t.id === type);
    return found?.icon || '📌';
  };

  const getEventColor = (type: string): string => {
    switch (type) {
      case 'WAR': return 'border-red-500 bg-red-50';
      case 'TREATY': return 'border-green-500 bg-green-50';
      case 'CONQUEST': return 'border-purple-500 bg-purple-50';
      case 'REFORM': return 'border-blue-500 bg-blue-50';
      case 'TECH': return 'border-amber-500 bg-amber-50';
      case 'CRISIS': return 'border-orange-500 bg-orange-50';
      default: return 'border-stone-400 bg-stone-50';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <h2 className="text-xl font-bold text-stone-800">📅 Timeline</h2>
          <div className="flex items-center gap-4">
            <span className="text-stone-600 text-sm">
              {startYear} - {currentYear} ({currentYear - startYear} years)
            </span>
            <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
              ×
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-3 border-b border-stone-200 space-y-2">
          {/* Event type filter */}
          <div className="flex flex-wrap gap-1">
            {eventTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setFilter(type.id)}
                className={`px-2 py-1 rounded text-xs font-medium ${
                  filter === type.id
                    ? 'bg-amber-600 text-white'
                    : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                }`}
              >
                {type.icon} {type.label}
              </button>
            ))}
          </div>

          {/* Decade quick select */}
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setSelectedDecade(null)}
              className={`px-2 py-0.5 rounded text-xs ${
                selectedDecade === null
                  ? 'bg-stone-600 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              All
            </button>
            {decades.map((decade) => (
              <button
                key={decade}
                onClick={() => setSelectedDecade(decade)}
                className={`px-2 py-0.5 rounded text-xs ${
                  selectedDecade === decade
                    ? 'bg-stone-600 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {decade}s
              </button>
            ))}
          </div>
        </div>

        {/* Timeline content */}
        <div className="flex-1 overflow-y-auto p-4">
          {years.length === 0 ? (
            <p className="text-center text-stone-500 py-8">No events match the current filter</p>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-stone-300" />

              {/* Events */}
              <div className="space-y-4">
                {years.map((year) => (
                  <div key={year} className="relative pl-10">
                    {/* Year marker */}
                    <div
                      className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer transition-colors ${
                        year === currentYear
                          ? 'bg-amber-600 text-white'
                          : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                      }`}
                      onClick={() => onYearClick?.(year)}
                    >
                      {year.toString().slice(-2)}
                    </div>

                    {/* Year's events */}
                    <div className="space-y-2">
                      <div className="text-sm font-bold text-stone-700">{year}</div>
                      {logsByYear[year].map((log, i) => (
                        <div
                          key={i}
                          className={`p-2 rounded border-l-4 ${getEventColor(log.type)}`}
                        >
                          <div className="flex items-start gap-2">
                            <span>{getEventIcon(log.type)}</span>
                            <div className="flex-1">
                              <p className="text-sm text-stone-800">{log.text}</p>
                              {log.effects && log.effects.length > 0 && (
                                <div className="mt-1 text-xs text-stone-500">
                                  {log.effects.join(' • ')}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer stats */}
        <div className="p-3 border-t border-stone-300 bg-stone-100 flex justify-around text-xs text-stone-600">
          <span>Total Events: {logs.length}</span>
          <span>Wars: {logs.filter(l => l.type === 'WAR').length}</span>
          <span>Treaties: {logs.filter(l => l.type === 'TREATY').length}</span>
          <span>Conquests: {logs.filter(l => l.type === 'CONQUEST').length}</span>
        </div>
      </div>
    </div>
  );
};

export default TimelineView;
