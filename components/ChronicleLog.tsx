import React, { useState } from 'react';

interface ChronicleEntry {
  id: string;
  date: string;
  type: EntryType;
  title: string;
  description: string;
  importance: 'minor' | 'normal' | 'major' | 'legendary';
  tags: string[];
}

type EntryType =
  | 'war'
  | 'battle'
  | 'peace'
  | 'ruler'
  | 'reform'
  | 'discovery'
  | 'disaster'
  | 'achievement'
  | 'diplomacy'
  | 'economy';

interface ChronicleLogProps {
  entries: ChronicleEntry[];
  currentYear: number;
  onClose: () => void;
  onJumpToDate?: (date: string) => void;
}

export default function ChronicleLog({
  entries,
  currentYear,
  onClose,
  onJumpToDate
}: ChronicleLogProps) {
  const [filter, setFilter] = useState<EntryType | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getTypeIcon = (type: EntryType): string => {
    switch (type) {
      case 'war': return '⚔️';
      case 'battle': return '⚔️';
      case 'peace': return '🕊️';
      case 'ruler': return '👑';
      case 'reform': return '📜';
      case 'discovery': return '🔭';
      case 'disaster': return '💀';
      case 'achievement': return '🏆';
      case 'diplomacy': return '🤝';
      case 'economy': return '💰';
    }
  };

  const getImportanceColor = (importance: ChronicleEntry['importance']): string => {
    switch (importance) {
      case 'minor': return 'border-stone-600';
      case 'normal': return 'border-blue-600';
      case 'major': return 'border-amber-600';
      case 'legendary': return 'border-purple-600';
    }
  };

  const filteredEntries = entries
    .filter(e => filter === 'all' || e.type === filter)
    .filter(e =>
      searchTerm === '' ||
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => b.date.localeCompare(a.date));

  const filters: { id: EntryType | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'All', icon: '📖' },
    { id: 'war', label: 'Wars', icon: '⚔️' },
    { id: 'ruler', label: 'Rulers', icon: '👑' },
    { id: 'diplomacy', label: 'Diplomacy', icon: '🤝' },
    { id: 'discovery', label: 'Discovery', icon: '🔭' },
    { id: 'achievement', label: 'Achievements', icon: '🏆' }
  ];

  // Group entries by decade
  const groupedEntries = filteredEntries.reduce((groups, entry) => {
    const year = parseInt(entry.date.split('-')[0]);
    const decade = Math.floor(year / 10) * 10;
    const key = `${decade}s`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(entry);
    return groups;
  }, {} as Record<string, ChronicleEntry[]>);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-stone-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col">
        <div className="p-4 border-b border-stone-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-amber-100">📜 Chronicle</h2>
            <div className="text-xs text-stone-400">
              {entries.length} entries • Current Year: {currentYear}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200"
          >
            ✕
          </button>
        </div>

        {/* Search and filters */}
        <div className="p-3 border-b border-stone-700 space-y-3">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search chronicles..."
            className="w-full bg-stone-700 px-3 py-2 rounded text-sm"
          />

          <div className="flex flex-wrap gap-1">
            {filters.map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-2 py-1 text-xs rounded ${
                  filter === f.id
                    ? 'bg-amber-600 text-white'
                    : 'bg-stone-700 text-stone-400 hover:bg-stone-600'
                }`}
              >
                {f.icon} {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Entries */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-8 text-stone-400">
              <div className="text-3xl mb-2">📜</div>
              <div>No chronicle entries found</div>
            </div>
          ) : (
            Object.entries(groupedEntries)
              .sort((a, b) => b[0].localeCompare(a[0]))
              .map(([decade, decadeEntries]) => (
                <div key={decade} className="mb-6">
                  <div className="text-sm font-medium text-stone-400 mb-3 sticky top-0 bg-stone-800 py-1">
                    {decade}
                  </div>
                  <div className="space-y-3 pl-4 border-l-2 border-stone-700">
                    {decadeEntries.map(entry => (
                      <div
                        key={entry.id}
                        className={`bg-stone-700 rounded-lg p-3 border-l-4 ${getImportanceColor(entry.importance)}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getTypeIcon(entry.type)}</span>
                            <div>
                              <h3 className="font-medium text-amber-100">{entry.title}</h3>
                              <div
                                className="text-xs text-stone-400 cursor-pointer hover:text-stone-200"
                                onClick={() => onJumpToDate?.(entry.date)}
                              >
                                {entry.date}
                              </div>
                            </div>
                          </div>
                          {entry.importance !== 'normal' && (
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              entry.importance === 'legendary' ? 'bg-purple-900 text-purple-300' :
                              entry.importance === 'major' ? 'bg-amber-900 text-amber-300' :
                              'bg-stone-600 text-stone-400'
                            }`}>
                              {entry.importance}
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-stone-300 mb-2">{entry.description}</p>

                        {entry.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {entry.tags.map(tag => (
                              <span key={tag} className="text-xs bg-stone-600 px-1.5 py-0.5 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
          )}
        </div>

        {/* Stats footer */}
        <div className="p-3 border-t border-stone-700 bg-stone-700/50">
          <div className="flex justify-around text-xs text-stone-400">
            <span>⚔️ Wars: {entries.filter(e => e.type === 'war').length}</span>
            <span>👑 Rulers: {entries.filter(e => e.type === 'ruler').length}</span>
            <span>🏆 Achievements: {entries.filter(e => e.type === 'achievement').length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
