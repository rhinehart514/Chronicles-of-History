import React, { useState } from 'react';
import { NationStats } from '../types';

export interface HistoricalDataPoint {
  year: number;
  stats: NationStats;
  population: number;
  treasury: number;
  territories: number;
}

interface StatisticsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoricalDataPoint[];
  nationName: string;
  currentYear: number;
}

export const StatisticsPanel: React.FC<StatisticsPanelProps> = ({
  isOpen,
  onClose,
  history,
  nationName,
  currentYear
}) => {
  const [selectedStat, setSelectedStat] = useState<keyof NationStats | 'population' | 'treasury' | 'territories'>('economy');
  const [timeRange, setTimeRange] = useState<'all' | '50' | '20'>('all');

  if (!isOpen) return null;

  const stats: { id: keyof NationStats | 'population' | 'treasury' | 'territories'; name: string; icon: string; color: string }[] = [
    { id: 'military', name: 'Military', icon: '⚔️', color: '#dc2626' },
    { id: 'economy', name: 'Economy', icon: '💰', color: '#f59e0b' },
    { id: 'stability', name: 'Stability', icon: '⚖️', color: '#3b82f6' },
    { id: 'innovation', name: 'Innovation', icon: '💡', color: '#8b5cf6' },
    { id: 'prestige', name: 'Prestige', icon: '👑', color: '#ec4899' },
    { id: 'population', name: 'Population', icon: '👥', color: '#10b981' },
    { id: 'treasury', name: 'Treasury', icon: '🏦', color: '#f97316' },
    { id: 'territories', name: 'Territories', icon: '🗺️', color: '#6366f1' }
  ];

  // Filter history by time range
  const filteredHistory = history.filter(h => {
    if (timeRange === 'all') return true;
    const years = parseInt(timeRange);
    return h.year >= currentYear - years;
  });

  // Get values for selected stat
  const getStatValue = (point: HistoricalDataPoint): number => {
    if (selectedStat === 'population') return point.population;
    if (selectedStat === 'treasury') return point.treasury;
    if (selectedStat === 'territories') return point.territories;
    return point.stats[selectedStat as keyof NationStats];
  };

  const values = filteredHistory.map(h => getStatValue(h));
  const maxValue = Math.max(...values, 1);
  const minValue = Math.min(...values);
  const avgValue = values.reduce((a, b) => a + b, 0) / values.length;

  const currentValue = history.length > 0 ? getStatValue(history[history.length - 1]) : 0;
  const previousValue = history.length > 1 ? getStatValue(history[history.length - 2]) : currentValue;
  const change = currentValue - previousValue;

  const selectedStatInfo = stats.find(s => s.id === selectedStat)!;

  // Simple line chart
  const chartHeight = 150;
  const chartWidth = 100;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <h2 className="text-xl font-bold text-stone-800">📊 Statistics - {nationName}</h2>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Stat selector */}
        <div className="p-3 border-b border-stone-200 flex flex-wrap gap-1">
          {stats.map(stat => (
            <button
              key={stat.id}
              onClick={() => setSelectedStat(stat.id)}
              className={`px-2 py-1 rounded text-xs font-medium ${
                selectedStat === stat.id
                  ? 'text-white'
                  : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
              }`}
              style={selectedStat === stat.id ? { backgroundColor: stat.color } : {}}
            >
              {stat.icon} {stat.name}
            </button>
          ))}
        </div>

        {/* Time range */}
        <div className="p-3 border-b border-stone-200 flex gap-2">
          {(['all', '50', '20'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded text-sm ${
                timeRange === range
                  ? 'bg-stone-600 text-white'
                  : 'bg-stone-200 text-stone-700'
              }`}
            >
              {range === 'all' ? 'All Time' : `Last ${range} Years`}
            </button>
          ))}
        </div>

        {/* Current value summary */}
        <div className="p-4 bg-white border-b border-stone-200">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{selectedStatInfo.icon}</span>
            <div>
              <div className="text-3xl font-bold" style={{ color: selectedStatInfo.color }}>
                {selectedStat === 'population' || selectedStat === 'treasury'
                  ? currentValue.toLocaleString()
                  : currentValue.toFixed(2)}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-stone-500">{selectedStatInfo.name}</span>
                <span className={change >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart area */}
        <div className="flex-1 p-4 overflow-hidden">
          {filteredHistory.length < 2 ? (
            <p className="text-center text-stone-500">Not enough data to display chart</p>
          ) : (
            <div className="h-full">
              {/* Simple SVG line chart */}
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-48"
                preserveAspectRatio="none"
              >
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map(pct => (
                  <line
                    key={pct}
                    x1="0"
                    y1={chartHeight - (pct / 100) * chartHeight}
                    x2={chartWidth}
                    y2={chartHeight - (pct / 100) * chartHeight}
                    stroke="#e5e7eb"
                    strokeWidth="0.5"
                  />
                ))}

                {/* Data line */}
                <polyline
                  fill="none"
                  stroke={selectedStatInfo.color}
                  strokeWidth="1"
                  points={filteredHistory.map((point, i) => {
                    const x = (i / (filteredHistory.length - 1)) * chartWidth;
                    const value = getStatValue(point);
                    const y = chartHeight - ((value - minValue) / (maxValue - minValue || 1)) * chartHeight;
                    return `${x},${y}`;
                  }).join(' ')}
                />

                {/* Area fill */}
                <polygon
                  fill={selectedStatInfo.color}
                  fillOpacity="0.1"
                  points={[
                    `0,${chartHeight}`,
                    ...filteredHistory.map((point, i) => {
                      const x = (i / (filteredHistory.length - 1)) * chartWidth;
                      const value = getStatValue(point);
                      const y = chartHeight - ((value - minValue) / (maxValue - minValue || 1)) * chartHeight;
                      return `${x},${y}`;
                    }),
                    `${chartWidth},${chartHeight}`
                  ].join(' ')}
                />
              </svg>

              {/* Axis labels */}
              <div className="flex justify-between text-xs text-stone-500 mt-2">
                <span>{filteredHistory[0]?.year}</span>
                <span>{filteredHistory[filteredHistory.length - 1]?.year}</span>
              </div>
            </div>
          )}
        </div>

        {/* Stats summary */}
        <div className="p-4 border-t border-stone-300 bg-stone-100 grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-xs text-stone-500">Current</div>
            <div className="font-bold text-stone-800">
              {selectedStat === 'population' || selectedStat === 'treasury'
                ? currentValue.toLocaleString()
                : currentValue.toFixed(2)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-stone-500">Average</div>
            <div className="font-bold text-stone-800">
              {selectedStat === 'population' || selectedStat === 'treasury'
                ? Math.round(avgValue).toLocaleString()
                : avgValue.toFixed(2)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-stone-500">Peak</div>
            <div className="font-bold text-green-600">
              {selectedStat === 'population' || selectedStat === 'treasury'
                ? maxValue.toLocaleString()
                : maxValue.toFixed(2)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-stone-500">Low</div>
            <div className="font-bold text-red-600">
              {selectedStat === 'population' || selectedStat === 'treasury'
                ? minValue.toLocaleString()
                : minValue.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPanel;
