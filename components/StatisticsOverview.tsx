import React, { useState } from 'react';

interface StatisticsOverviewProps {
  isOpen: boolean;
  onClose: () => void;
  statistics: GameStatistics;
  history: HistoricalData[];
}

interface GameStatistics {
  military: {
    armySize: number;
    navySize: number;
    manpowerPool: number;
    maxManpower: number;
    armyMaintenance: number;
    navyMaintenance: number;
    warScore: number;
    battlesWon: number;
    battlesLost: number;
    armyTradition: number;
    navyTradition: number;
  };
  economy: {
    income: number;
    expenses: number;
    balance: number;
    treasury: number;
    inflation: number;
    corruption: number;
    loans: number;
    tradeIncome: number;
    taxIncome: number;
    productionIncome: number;
  };
  diplomacy: {
    allies: number;
    subjects: number;
    royalMarriages: number;
    truces: number;
    diplomaticReputation: number;
    aggressiveExpansion: number;
    overextension: number;
  };
  development: {
    totalDevelopment: number;
    averageDevelopment: number;
    provinces: number;
    cores: number;
    states: number;
  };
  technology: {
    adminTech: number;
    diploTech: number;
    milTech: number;
    ideaGroups: number;
    institutions: number;
  };
}

interface HistoricalData {
  year: number;
  development: number;
  income: number;
  armySize: number;
  provinces: number;
}

export const StatisticsOverview: React.FC<StatisticsOverviewProps> = ({
  isOpen,
  onClose,
  statistics,
  history
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'military' | 'economy' | 'diplomacy' | 'development'>('overview');

  if (!isOpen) return null;

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'military', name: 'Military', icon: '⚔️' },
    { id: 'economy', name: 'Economy', icon: '💰' },
    { id: 'diplomacy', name: 'Diplomacy', icon: '🤝' },
    { id: 'development', name: 'Development', icon: '📈' }
  ];

  const StatRow = ({ label, value, color = 'stone' }: { label: string; value: string | number; color?: string }) => (
    <div className="flex justify-between py-1 border-b border-stone-100">
      <span className="text-stone-600 text-sm">{label}</span>
      <span className={`font-medium text-sm text-${color}-600`}>{value}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-stone-800">📊 Statistics</h2>
            <div className="text-sm text-stone-500">
              National overview and historical data
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 text-sm font-medium ${
                activeTab === tab.id
                  ? 'bg-amber-100 text-amber-700 border-b-2 border-amber-500'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {tab.icon} {tab.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Summary boxes */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{statistics.development.totalDevelopment}</div>
                  <div className="text-xs text-stone-500">Total Development</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">+{statistics.economy.balance.toFixed(1)}</div>
                  <div className="text-xs text-stone-500">Monthly Balance</div>
                </div>
                <div className="p-3 bg-red-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600">{statistics.military.armySize.toLocaleString()}</div>
                  <div className="text-xs text-stone-500">Army Size</div>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-amber-600">{statistics.development.provinces}</div>
                  <div className="text-xs text-stone-500">Provinces</div>
                </div>
              </div>

              {/* Tech summary */}
              <div className="p-3 bg-stone-100 rounded-lg">
                <h4 className="font-semibold text-stone-700 mb-2">Technology</h4>
                <div className="flex justify-around text-center">
                  <div>
                    <div className="text-lg font-bold text-red-600">{statistics.technology.adminTech}</div>
                    <div className="text-xs text-stone-500">Admin</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">{statistics.technology.diploTech}</div>
                    <div className="text-xs text-stone-500">Diplo</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">{statistics.technology.milTech}</div>
                    <div className="text-xs text-stone-500">Military</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'military' && (
            <div className="space-y-4">
              <div className="p-3 bg-white rounded-lg border border-stone-200">
                <h4 className="font-semibold text-stone-700 mb-2">Land Forces</h4>
                <StatRow label="Army Size" value={statistics.military.armySize.toLocaleString()} color="red" />
                <StatRow label="Manpower" value={`${statistics.military.manpowerPool.toLocaleString()} / ${statistics.military.maxManpower.toLocaleString()}`} />
                <StatRow label="Army Maintenance" value={`-${statistics.military.armyMaintenance.toFixed(1)}`} color="red" />
                <StatRow label="Army Tradition" value={statistics.military.armyTradition.toFixed(1)} color="green" />
              </div>

              <div className="p-3 bg-white rounded-lg border border-stone-200">
                <h4 className="font-semibold text-stone-700 mb-2">Naval Forces</h4>
                <StatRow label="Navy Size" value={statistics.military.navySize.toLocaleString()} color="blue" />
                <StatRow label="Navy Maintenance" value={`-${statistics.military.navyMaintenance.toFixed(1)}`} color="red" />
                <StatRow label="Navy Tradition" value={statistics.military.navyTradition.toFixed(1)} color="green" />
              </div>

              <div className="p-3 bg-white rounded-lg border border-stone-200">
                <h4 className="font-semibold text-stone-700 mb-2">Combat Record</h4>
                <StatRow label="Battles Won" value={statistics.military.battlesWon} color="green" />
                <StatRow label="Battles Lost" value={statistics.military.battlesLost} color="red" />
                <StatRow label="War Score" value={`${statistics.military.warScore}%`} />
              </div>
            </div>
          )}

          {activeTab === 'economy' && (
            <div className="space-y-4">
              <div className="p-3 bg-white rounded-lg border border-stone-200">
                <h4 className="font-semibold text-stone-700 mb-2">Income</h4>
                <StatRow label="Tax Income" value={`+${statistics.economy.taxIncome.toFixed(1)}`} color="green" />
                <StatRow label="Production Income" value={`+${statistics.economy.productionIncome.toFixed(1)}`} color="green" />
                <StatRow label="Trade Income" value={`+${statistics.economy.tradeIncome.toFixed(1)}`} color="green" />
                <StatRow label="Total Income" value={`+${statistics.economy.income.toFixed(1)}`} color="green" />
              </div>

              <div className="p-3 bg-white rounded-lg border border-stone-200">
                <h4 className="font-semibold text-stone-700 mb-2">Finances</h4>
                <StatRow label="Expenses" value={`-${statistics.economy.expenses.toFixed(1)}`} color="red" />
                <StatRow label="Balance" value={`${statistics.economy.balance >= 0 ? '+' : ''}${statistics.economy.balance.toFixed(1)}`} color={statistics.economy.balance >= 0 ? 'green' : 'red'} />
                <StatRow label="Treasury" value={statistics.economy.treasury.toLocaleString()} color="amber" />
                <StatRow label="Loans" value={statistics.economy.loans} color={statistics.economy.loans > 0 ? 'red' : 'green'} />
              </div>

              <div className="p-3 bg-white rounded-lg border border-stone-200">
                <h4 className="font-semibold text-stone-700 mb-2">Modifiers</h4>
                <StatRow label="Inflation" value={`${statistics.economy.inflation.toFixed(1)}%`} color={statistics.economy.inflation > 5 ? 'red' : 'stone'} />
                <StatRow label="Corruption" value={`${statistics.economy.corruption.toFixed(1)}%`} color={statistics.economy.corruption > 0 ? 'red' : 'green'} />
              </div>
            </div>
          )}

          {activeTab === 'diplomacy' && (
            <div className="space-y-4">
              <div className="p-3 bg-white rounded-lg border border-stone-200">
                <h4 className="font-semibold text-stone-700 mb-2">Relations</h4>
                <StatRow label="Allies" value={statistics.diplomacy.allies} color="green" />
                <StatRow label="Subjects" value={statistics.diplomacy.subjects} color="blue" />
                <StatRow label="Royal Marriages" value={statistics.diplomacy.royalMarriages} color="purple" />
                <StatRow label="Truces" value={statistics.diplomacy.truces} />
              </div>

              <div className="p-3 bg-white rounded-lg border border-stone-200">
                <h4 className="font-semibold text-stone-700 mb-2">Reputation</h4>
                <StatRow label="Diplomatic Reputation" value={statistics.diplomacy.diplomaticReputation.toFixed(1)} color="blue" />
                <StatRow label="Aggressive Expansion" value={statistics.diplomacy.aggressiveExpansion.toFixed(0)} color={statistics.diplomacy.aggressiveExpansion > 25 ? 'red' : 'stone'} />
                <StatRow label="Overextension" value={`${statistics.diplomacy.overextension.toFixed(0)}%`} color={statistics.diplomacy.overextension > 100 ? 'red' : 'stone'} />
              </div>
            </div>
          )}

          {activeTab === 'development' && (
            <div className="space-y-4">
              <div className="p-3 bg-white rounded-lg border border-stone-200">
                <h4 className="font-semibold text-stone-700 mb-2">Territory</h4>
                <StatRow label="Total Development" value={statistics.development.totalDevelopment} color="amber" />
                <StatRow label="Average Development" value={statistics.development.averageDevelopment.toFixed(1)} />
                <StatRow label="Provinces" value={statistics.development.provinces} />
                <StatRow label="Cores" value={statistics.development.cores} />
                <StatRow label="States" value={statistics.development.states} />
              </div>

              <div className="p-3 bg-white rounded-lg border border-stone-200">
                <h4 className="font-semibold text-stone-700 mb-2">Progress</h4>
                <StatRow label="Idea Groups" value={`${statistics.technology.ideaGroups}/8`} />
                <StatRow label="Institutions" value={`${statistics.technology.institutions}/8`} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticsOverview;
