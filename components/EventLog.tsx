import React, { useState } from 'react';

export interface LogEntry {
  id: string;
  year: number;
  season: string;
  type: LogEntryType;
  title: string;
  description: string;
  icon: string;
  importance: 'low' | 'medium' | 'high' | 'critical';
}

export type LogEntryType =
  | 'event'
  | 'war'
  | 'diplomacy'
  | 'economy'
  | 'military'
  | 'ruler'
  | 'discovery'
  | 'disaster';

interface EventLogProps {
  isOpen: boolean;
  onClose: () => void;
  entries: LogEntry[];
  currentYear: number;
  onJumpToYear?: (year: number) => void;
}

export const EventLog: React.FC<EventLogProps> = ({
  isOpen,
  onClose,
  entries,
  currentYear,
  onJumpToYear
}) => {
  const [filter, setFilter] = useState<LogEntryType | 'all'>('all');
  const [importanceFilter, setImportanceFilter] = useState<LogEntry['importance'] | 'all'>('all');

  if (!isOpen) return null;

  const filteredEntries = entries.filter(entry => {
    if (filter !== 'all' && entry.type !== filter) return false;
    if (importanceFilter !== 'all' && entry.importance !== importanceFilter) return false;
    return true;
  });

  const types: { id: LogEntryType; icon: string; label: string }[] = [
    { id: 'event', icon: '📜', label: 'Events' },
    { id: 'war', icon: '⚔️', label: 'Wars' },
    { id: 'diplomacy', icon: '🤝', label: 'Diplomacy' },
    { id: 'economy', icon: '💰', label: 'Economy' },
    { id: 'military', icon: '🎖️', label: 'Military' },
    { id: 'ruler', icon: '👑', label: 'Ruler' },
    { id: 'discovery', icon: '🔭', label: 'Discovery' },
    { id: 'disaster', icon: '💀', label: 'Disasters' }
  ];

  const getImportanceColor = (importance: LogEntry['importance']) => {
    switch (importance) {
      case 'critical': return 'bg-red-100 border-red-500 text-red-700';
      case 'high': return 'bg-amber-100 border-amber-500 text-amber-700';
      case 'medium': return 'bg-blue-100 border-blue-500 text-blue-700';
      default: return 'bg-stone-100 border-stone-300 text-stone-700';
    }
  };

  // Group entries by year
  const entriesByYear = filteredEntries.reduce<Record<number, LogEntry[]>>((acc, entry) => {
    if (!acc[entry.year]) acc[entry.year] = [];
    acc[entry.year].push(entry);
    return acc;
  }, {});

  const years = Object.keys(entriesByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-stone-800">📖 Chronicle</h2>
            <div className="text-sm text-stone-500">{entries.length} events recorded</div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Filters */}
        <div className="p-3 border-b border-stone-200 space-y-2">
          {/* Type filter */}
          <div className="flex gap-1 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-2 py-1 rounded text-xs ${
                filter === 'all' ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-700'
              }`}
            >
              All
            </button>
            {types.map(type => (
              <button
                key={type.id}
                onClick={() => setFilter(type.id)}
                className={`px-2 py-1 rounded text-xs ${
                  filter === type.id ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-700'
                }`}
              >
                {type.icon}
              </button>
            ))}
          </div>

          {/* Importance filter */}
          <div className="flex gap-1">
            {(['all', 'critical', 'high', 'medium', 'low'] as const).map(imp => (
              <button
                key={imp}
                onClick={() => setImportanceFilter(imp)}
                className={`px-2 py-1 rounded text-xs ${
                  importanceFilter === imp ? 'bg-stone-600 text-white' : 'bg-stone-200 text-stone-700'
                }`}
              >
                {imp === 'all' ? 'All' : imp.charAt(0).toUpperCase() + imp.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="flex-1 overflow-y-auto p-4">
          {years.length === 0 ? (
            <p className="text-center text-stone-500 py-8">No events match filters</p>
          ) : (
            <div className="space-y-6">
              {years.map(year => (
                <div key={year}>
                  {/* Year header */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="font-bold text-lg text-stone-800">{year}</div>
                    <div className="flex-1 h-px bg-stone-300" />
                    {onJumpToYear && year !== currentYear && (
                      <button
                        onClick={() => onJumpToYear(year)}
                        className="text-xs text-amber-600 hover:text-amber-700"
                      >
                        Jump to
                      </button>
                    )}
                  </div>

                  {/* Events for this year */}
                  <div className="space-y-2 ml-4">
                    {entriesByYear[year].map(entry => (
                      <div
                        key={entry.id}
                        className={`p-3 rounded-lg border-l-4 ${getImportanceColor(entry.importance)}`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-lg">{entry.icon}</span>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-semibold text-stone-800 text-sm">
                                {entry.title}
                              </h4>
                              <span className="text-xs text-stone-500">{entry.season}</span>
                            </div>
                            <p className="text-xs text-stone-600 mt-1">{entry.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="p-3 border-t border-stone-300 bg-stone-100">
          <div className="flex justify-between text-xs text-stone-500">
            <span>
              Showing {filteredEntries.length} of {entries.length} entries
            </span>
            <span>
              {years.length > 0 && `${Math.min(...years)} - ${Math.max(...years)}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventLog;
