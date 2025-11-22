import React, { useState } from 'react';
import { Province } from './ProvinceDetail';

interface ProvinceListProps {
  isOpen: boolean;
  onClose: () => void;
  provinces: Province[];
  onSelectProvince: (provinceId: string) => void;
}

type SortField = 'name' | 'development' | 'population' | 'unrest' | 'autonomy';
type SortOrder = 'asc' | 'desc';

export const ProvinceList: React.FC<ProvinceListProps> = ({
  isOpen,
  onClose,
  provinces,
  onSelectProvince
}) => {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [filter, setFilter] = useState('');
  const [terrainFilter, setTerrainFilter] = useState<string>('all');

  if (!isOpen) return null;

  const getTotalDev = (p: Province) => p.development.tax + p.development.production + p.development.manpower;

  const filteredProvinces = provinces.filter(p => {
    if (filter && !p.name.toLowerCase().includes(filter.toLowerCase())) return false;
    if (terrainFilter !== 'all' && p.terrain !== terrainFilter) return false;
    return true;
  });

  const sortedProvinces = [...filteredProvinces].sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'development':
        comparison = getTotalDev(a) - getTotalDev(b);
        break;
      case 'population':
        comparison = a.population - b.population;
        break;
      case 'unrest':
        comparison = a.unrest - b.unrest;
        break;
      case 'autonomy':
        comparison = a.autonomy - b.autonomy;
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const totalDev = provinces.reduce((sum, p) => sum + getTotalDev(p), 0);
  const totalPop = provinces.reduce((sum, p) => sum + p.population, 0);

  const terrains = [...new Set(provinces.map(p => p.terrain))];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-stone-800">🗺️ Province List</h2>
            <div className="text-sm text-stone-500">
              {provinces.length} provinces • {totalDev} development • {totalPop.toLocaleString()} population
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Filters */}
        <div className="p-3 border-b border-stone-200 flex gap-3">
          <input
            type="text"
            placeholder="Search provinces..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-1 px-3 py-1 border border-stone-300 rounded text-sm"
          />
          <select
            value={terrainFilter}
            onChange={(e) => setTerrainFilter(e.target.value)}
            className="px-3 py-1 border border-stone-300 rounded text-sm"
          >
            <option value="all">All Terrain</option>
            {terrains.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Table header */}
        <div className="p-2 border-b border-stone-200 bg-stone-100 grid grid-cols-6 gap-2 text-xs font-semibold text-stone-600">
          <button
            onClick={() => handleSort('name')}
            className="text-left hover:text-stone-800"
          >
            Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('development')}
            className="text-center hover:text-stone-800"
          >
            Dev {sortField === 'development' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('population')}
            className="text-center hover:text-stone-800"
          >
            Pop {sortField === 'population' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('unrest')}
            className="text-center hover:text-stone-800"
          >
            Unrest {sortField === 'unrest' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('autonomy')}
            className="text-center hover:text-stone-800"
          >
            Auto {sortField === 'autonomy' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <div className="text-center">Trade</div>
        </div>

        {/* Province rows */}
        <div className="flex-1 overflow-y-auto">
          {sortedProvinces.map(province => {
            const dev = getTotalDev(province);
            return (
              <button
                key={province.id}
                onClick={() => onSelectProvince(province.id)}
                className="w-full p-3 grid grid-cols-6 gap-2 text-sm border-b border-stone-200 hover:bg-stone-100 text-left"
              >
                <div className="flex items-center gap-2">
                  <span>
                    {province.isCapital && '⭐'}
                    {province.isCoastal && '⚓'}
                  </span>
                  <span className="font-medium text-stone-800 truncate">
                    {province.name}
                  </span>
                </div>
                <div className="text-center">
                  <span className="font-medium">{dev}</span>
                  <span className="text-xs text-stone-500 ml-1">
                    ({province.development.tax}/{province.development.production}/{province.development.manpower})
                  </span>
                </div>
                <div className="text-center text-stone-600">
                  {(province.population / 1000).toFixed(0)}K
                </div>
                <div className={`text-center ${
                  province.unrest > 5 ? 'text-red-600' :
                  province.unrest > 2 ? 'text-amber-600' :
                  'text-green-600'
                }`}>
                  {province.unrest.toFixed(1)}
                </div>
                <div className={`text-center ${
                  province.autonomy > 50 ? 'text-amber-600' : 'text-stone-600'
                }`}>
                  {province.autonomy}%
                </div>
                <div className="text-center text-amber-600">
                  {province.tradeGood}
                </div>
              </button>
            );
          })}
        </div>

        {/* Summary */}
        <div className="p-3 border-t border-stone-300 bg-stone-100 text-xs text-stone-500">
          Showing {sortedProvinces.length} of {provinces.length} provinces
        </div>
      </div>
    </div>
  );
};

export default ProvinceList;
