import React, { useState } from 'react';

interface LedgerProps {
  isOpen: boolean;
  onClose: () => void;
  nations: NationData[];
  playerNationId: string;
  provinces: ProvinceData[];
  wars: WarData[];
  tradeGoods: TradeGoodData[];
}

interface NationData {
  id: string;
  name: string;
  flag: string;
  government: string;
  religion: string;
  development: number;
  provinces: number;
  army: number;
  navy: number;
  income: number;
  manpower: number;
  prestige: number;
  score: number;
}

interface ProvinceData {
  id: string;
  name: string;
  owner: string;
  development: number;
  population: number;
  tradeGood: string;
  terrain: string;
  culture: string;
  religion: string;
}

interface WarData {
  id: string;
  name: string;
  attacker: string;
  defender: string;
  startYear: number;
  warScore: number;
}

interface TradeGoodData {
  id: string;
  name: string;
  icon: string;
  basePrice: number;
  currentPrice: number;
  supply: number;
  demand: number;
}

type LedgerTab = 'nations' | 'provinces' | 'military' | 'economy' | 'wars' | 'trade';

export const Ledger: React.FC<LedgerProps> = ({
  isOpen,
  onClose,
  nations,
  playerNationId,
  provinces,
  wars,
  tradeGoods
}) => {
  const [activeTab, setActiveTab] = useState<LedgerTab>('nations');
  const [sortBy, setSortBy] = useState<string>('score');
  const [sortAsc, setSortAsc] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const tabs: { id: LedgerTab; name: string; icon: string }[] = [
    { id: 'nations', name: 'Nations', icon: '🏛️' },
    { id: 'provinces', name: 'Provinces', icon: '🗺️' },
    { id: 'military', name: 'Military', icon: '⚔️' },
    { id: 'economy', name: 'Economy', icon: '💰' },
    { id: 'wars', name: 'Wars', icon: '🔥' },
    { id: 'trade', name: 'Trade', icon: '📦' }
  ];

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(false);
    }
  };

  const sortData = <T extends Record<string, any>>(data: T[], field: string): T[] => {
    return [...data].sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortAsc ? aVal - bVal : bVal - aVal;
      }
      return sortAsc
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  };

  const SortHeader: React.FC<{ field: string; label: string }> = ({ field, label }) => (
    <th
      onClick={() => handleSort(field)}
      className="px-3 py-2 text-left text-xs font-medium text-stone-500 cursor-pointer hover:text-stone-700"
    >
      {label} {sortBy === field && (sortAsc ? '↑' : '↓')}
    </th>
  );

  const renderNationsTab = () => {
    const sorted = sortData(nations, sortBy);
    const filtered = sorted.filter(n =>
      n.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <table className="w-full">
        <thead className="bg-stone-100 sticky top-0">
          <tr>
            <SortHeader field="name" label="Nation" />
            <SortHeader field="score" label="Score" />
            <SortHeader field="development" label="Dev" />
            <SortHeader field="provinces" label="Prov" />
            <SortHeader field="income" label="Income" />
            <SortHeader field="army" label="Army" />
            <SortHeader field="prestige" label="Prestige" />
          </tr>
        </thead>
        <tbody>
          {filtered.map((nation, i) => (
            <tr
              key={nation.id}
              className={`border-b border-stone-200 ${
                nation.id === playerNationId ? 'bg-amber-50' : i % 2 === 0 ? 'bg-white' : 'bg-stone-50'
              }`}
            >
              <td className="px-3 py-2 text-sm">
                <span className="mr-2">{nation.flag}</span>
                {nation.name}
                {nation.id === playerNationId && <span className="ml-1 text-amber-600">★</span>}
              </td>
              <td className="px-3 py-2 text-sm font-bold">{nation.score}</td>
              <td className="px-3 py-2 text-sm">{nation.development}</td>
              <td className="px-3 py-2 text-sm">{nation.provinces}</td>
              <td className="px-3 py-2 text-sm text-green-600">+{nation.income}</td>
              <td className="px-3 py-2 text-sm">{nation.army.toLocaleString()}</td>
              <td className="px-3 py-2 text-sm">{nation.prestige}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderProvincesTab = () => {
    const sorted = sortData(provinces, sortBy === 'score' ? 'development' : sortBy);
    const filtered = sorted.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <table className="w-full">
        <thead className="bg-stone-100 sticky top-0">
          <tr>
            <SortHeader field="name" label="Province" />
            <SortHeader field="owner" label="Owner" />
            <SortHeader field="development" label="Dev" />
            <SortHeader field="population" label="Pop" />
            <SortHeader field="tradeGood" label="Trade Good" />
            <SortHeader field="terrain" label="Terrain" />
          </tr>
        </thead>
        <tbody>
          {filtered.map((province, i) => (
            <tr
              key={province.id}
              className={`border-b border-stone-200 ${i % 2 === 0 ? 'bg-white' : 'bg-stone-50'}`}
            >
              <td className="px-3 py-2 text-sm font-medium">{province.name}</td>
              <td className="px-3 py-2 text-sm">{province.owner}</td>
              <td className="px-3 py-2 text-sm">{province.development}</td>
              <td className="px-3 py-2 text-sm">{province.population.toLocaleString()}</td>
              <td className="px-3 py-2 text-sm">{province.tradeGood}</td>
              <td className="px-3 py-2 text-sm capitalize">{province.terrain}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderMilitaryTab = () => {
    const sorted = sortData(nations, 'army');
    const filtered = sorted.filter(n =>
      n.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <table className="w-full">
        <thead className="bg-stone-100 sticky top-0">
          <tr>
            <SortHeader field="name" label="Nation" />
            <SortHeader field="army" label="Army Size" />
            <SortHeader field="navy" label="Navy Size" />
            <SortHeader field="manpower" label="Manpower" />
          </tr>
        </thead>
        <tbody>
          {filtered.map((nation, i) => (
            <tr
              key={nation.id}
              className={`border-b border-stone-200 ${
                nation.id === playerNationId ? 'bg-amber-50' : i % 2 === 0 ? 'bg-white' : 'bg-stone-50'
              }`}
            >
              <td className="px-3 py-2 text-sm">
                <span className="mr-2">{nation.flag}</span>
                {nation.name}
              </td>
              <td className="px-3 py-2 text-sm font-bold text-red-600">{nation.army.toLocaleString()}</td>
              <td className="px-3 py-2 text-sm text-blue-600">{nation.navy}</td>
              <td className="px-3 py-2 text-sm">{nation.manpower.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderEconomyTab = () => {
    const sorted = sortData(nations, 'income');
    const filtered = sorted.filter(n =>
      n.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <table className="w-full">
        <thead className="bg-stone-100 sticky top-0">
          <tr>
            <SortHeader field="name" label="Nation" />
            <SortHeader field="income" label="Income" />
            <SortHeader field="development" label="Development" />
            <SortHeader field="provinces" label="Provinces" />
          </tr>
        </thead>
        <tbody>
          {filtered.map((nation, i) => (
            <tr
              key={nation.id}
              className={`border-b border-stone-200 ${
                nation.id === playerNationId ? 'bg-amber-50' : i % 2 === 0 ? 'bg-white' : 'bg-stone-50'
              }`}
            >
              <td className="px-3 py-2 text-sm">
                <span className="mr-2">{nation.flag}</span>
                {nation.name}
              </td>
              <td className="px-3 py-2 text-sm font-bold text-green-600">+{nation.income}</td>
              <td className="px-3 py-2 text-sm">{nation.development}</td>
              <td className="px-3 py-2 text-sm">{nation.provinces}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderWarsTab = () => (
    <div className="p-4">
      {wars.length === 0 ? (
        <p className="text-center text-stone-500 py-8">No active wars</p>
      ) : (
        <div className="space-y-3">
          {wars.map(war => (
            <div key={war.id} className="p-3 bg-white rounded-lg border border-stone-200">
              <div className="font-semibold text-stone-800 mb-2">{war.name}</div>
              <div className="flex justify-between text-sm">
                <div>
                  <span className="text-red-600">⚔️ {war.attacker}</span>
                  <span className="mx-2 text-stone-400">vs</span>
                  <span className="text-blue-600">🛡️ {war.defender}</span>
                </div>
                <div className="text-stone-500">Since {war.startYear}</div>
              </div>
              <div className="mt-2">
                <div className="text-xs text-stone-500 mb-1">War Score</div>
                <div className="w-full bg-stone-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${war.warScore > 0 ? 'bg-red-500' : 'bg-blue-500'}`}
                    style={{
                      width: `${Math.abs(war.warScore)}%`,
                      marginLeft: war.warScore < 0 ? `${50 + war.warScore / 2}%` : '50%'
                    }}
                  />
                </div>
                <div className="text-center text-xs mt-1">
                  {war.warScore > 0 ? '+' : ''}{war.warScore}%
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderTradeTab = () => {
    const sorted = sortData(tradeGoods, 'currentPrice');

    return (
      <table className="w-full">
        <thead className="bg-stone-100 sticky top-0">
          <tr>
            <SortHeader field="name" label="Trade Good" />
            <SortHeader field="basePrice" label="Base" />
            <SortHeader field="currentPrice" label="Current" />
            <SortHeader field="supply" label="Supply" />
            <SortHeader field="demand" label="Demand" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((good, i) => {
            const priceChange = good.currentPrice - good.basePrice;
            return (
              <tr
                key={good.id}
                className={`border-b border-stone-200 ${i % 2 === 0 ? 'bg-white' : 'bg-stone-50'}`}
              >
                <td className="px-3 py-2 text-sm">
                  <span className="mr-2">{good.icon}</span>
                  {good.name}
                </td>
                <td className="px-3 py-2 text-sm">{good.basePrice}</td>
                <td className="px-3 py-2 text-sm font-bold">
                  {good.currentPrice}
                  <span className={`ml-1 text-xs ${priceChange > 0 ? 'text-green-600' : priceChange < 0 ? 'text-red-600' : 'text-stone-400'}`}>
                    {priceChange > 0 ? '+' : ''}{priceChange}
                  </span>
                </td>
                <td className="px-3 py-2 text-sm">{good.supply}</td>
                <td className="px-3 py-2 text-sm">{good.demand}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'nations': return renderNationsTab();
      case 'provinces': return renderProvincesTab();
      case 'military': return renderMilitaryTab();
      case 'economy': return renderEconomyTab();
      case 'wars': return renderWarsTab();
      case 'trade': return renderTradeTab();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-stone-800">📊 Ledger</h2>
            <div className="text-sm text-stone-500">
              World statistics and rankings
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-200 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-amber-100 text-amber-700 border-b-2 border-amber-600'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {tab.icon} {tab.name}
            </button>
          ))}
        </div>

        {/* Search */}
        {activeTab !== 'wars' && (
          <div className="p-3 border-b border-stone-200">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="w-full px-3 py-2 border border-stone-300 rounded text-sm"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {renderContent()}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-stone-300 bg-stone-100 text-xs text-stone-500 text-center">
          Click column headers to sort • Your nation is highlighted
        </div>
      </div>
    </div>
  );
};

export default Ledger;
