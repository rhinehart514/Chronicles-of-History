import React, { useState } from 'react';

interface TradeCompanyPanelProps {
  isOpen: boolean;
  onClose: () => void;
  tradeCompanies: TradeCompany[];
  availableRegions: TradeRegion[];
  merchantsAvailable: number;
  onCreateCompany: (regionId: string) => void;
  onAddProvince: (companyId: string, provinceId: string) => void;
  onRemoveProvince: (companyId: string, provinceId: string) => void;
  onInvestment: (companyId: string, investmentId: string) => void;
}

export interface TradeCompany {
  id: string;
  name: string;
  region: string;
  provinces: TradeCompanyProvince[];
  investments: string[];
  totalTradePower: number;
  income: number;
  goodsProduced: number;
}

export interface TradeCompanyProvince {
  id: string;
  name: string;
  development: number;
  tradeGood: string;
  tradePower: number;
}

export interface TradeRegion {
  id: string;
  name: string;
  icon: string;
  continent: string;
  provinces: TradeRegionProvince[];
  bonusThreshold: number;
}

export interface TradeRegionProvince {
  id: string;
  name: string;
  owner: string;
  available: boolean;
}

const INVESTMENTS = [
  {
    id: 'local_quarter',
    name: 'Local Quarter',
    icon: '🏘️',
    cost: 200,
    effects: ['+0.5 Goods produced', '+10% Provincial trade power']
  },
  {
    id: 'officers_mess',
    name: "Officers' Mess",
    icon: '🎖️',
    cost: 200,
    effects: ['+5% Discipline', '+10% Manpower recovery']
  },
  {
    id: 'harbor',
    name: 'Company Harbor',
    icon: '⚓',
    cost: 200,
    effects: ['+25% Naval force limit', '+0.5 Yearly navy tradition']
  },
  {
    id: 'warehouse',
    name: 'Company Warehouse',
    icon: '📦',
    cost: 200,
    effects: ['+50% Trade goods size', '+25% Trade power']
  },
  {
    id: 'township',
    name: 'Township',
    icon: '🏛️',
    cost: 200,
    effects: ['+100% Institution spread', '-10% Development cost']
  }
];

export const TradeCompanyPanel: React.FC<TradeCompanyPanelProps> = ({
  isOpen,
  onClose,
  tradeCompanies,
  availableRegions,
  merchantsAvailable,
  onCreateCompany,
  onAddProvince,
  onRemoveProvince,
  onInvestment
}) => {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  if (!isOpen) return null;

  const selected = tradeCompanies.find(c => c.id === selectedCompany);
  const selectedReg = availableRegions.find(r => r.id === selectedRegion);

  const totalIncome = tradeCompanies.reduce((sum, c) => sum + c.income, 0);
  const totalProvinces = tradeCompanies.reduce((sum, c) => sum + c.provinces.length, 0);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-stone-800">🏢 Trade Companies</h2>
            <div className="text-sm text-stone-500">
              {tradeCompanies.length} companies • {totalProvinces} provinces
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Stats */}
        <div className="p-3 border-b border-stone-200 bg-stone-100 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs text-stone-500">Total Income</div>
            <div className="font-bold text-green-600">+{totalIncome.toFixed(1)}/mo</div>
          </div>
          <div>
            <div className="text-xs text-stone-500">Merchants Available</div>
            <div className="font-bold text-stone-800">{merchantsAvailable}</div>
          </div>
          <div>
            <div className="text-xs text-stone-500">Total Trade Power</div>
            <div className="font-bold text-blue-600">
              {tradeCompanies.reduce((sum, c) => sum + c.totalTradePower, 0).toFixed(0)}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Company list */}
          <div className="w-1/3 border-r border-stone-200 overflow-y-auto p-3">
            <h3 className="text-sm font-semibold text-stone-600 mb-2">Your Companies</h3>
            <div className="space-y-2 mb-4">
              {tradeCompanies.map(company => (
                <button
                  key={company.id}
                  onClick={() => {
                    setSelectedCompany(company.id);
                    setSelectedRegion(null);
                  }}
                  className={`w-full p-3 rounded-lg border-2 text-left ${
                    selectedCompany === company.id
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-stone-200 bg-white'
                  }`}
                >
                  <div className="font-semibold text-stone-800">{company.name}</div>
                  <div className="text-xs text-stone-500">
                    {company.provinces.length} provinces • +{company.income.toFixed(1)}/mo
                  </div>
                </button>
              ))}
            </div>

            <h3 className="text-sm font-semibold text-stone-600 mb-2">Available Regions</h3>
            <div className="space-y-2">
              {availableRegions.map(region => {
                const hasCompany = tradeCompanies.some(c => c.region === region.id);
                return (
                  <button
                    key={region.id}
                    onClick={() => {
                      setSelectedRegion(region.id);
                      setSelectedCompany(null);
                    }}
                    disabled={hasCompany}
                    className={`w-full p-3 rounded-lg border-2 text-left ${
                      selectedRegion === region.id
                        ? 'border-blue-500 bg-blue-50'
                        : hasCompany
                        ? 'border-stone-200 bg-stone-100 opacity-50'
                        : 'border-stone-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{region.icon}</span>
                      <div>
                        <div className="font-semibold text-stone-800">{region.name}</div>
                        <div className="text-xs text-stone-500">
                          {region.continent} • {region.provinces.filter(p => p.available).length} available
                        </div>
                      </div>
                    </div>
                    {hasCompany && <div className="text-xs text-green-600 mt-1">✓ Company exists</div>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details */}
          <div className="w-2/3 p-4 overflow-y-auto">
            {selected ? (
              <>
                <div className="text-center mb-4">
                  <h3 className="font-bold text-stone-800 text-lg">{selected.name}</h3>
                  <p className="text-sm text-stone-600">Trade Company in {selected.region}</p>
                </div>

                {/* Company stats */}
                <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                  <div className="p-2 bg-green-50 rounded">
                    <div className="text-xs text-stone-500">Income</div>
                    <div className="font-bold text-green-600">+{selected.income.toFixed(1)}</div>
                  </div>
                  <div className="p-2 bg-blue-50 rounded">
                    <div className="text-xs text-stone-500">Trade Power</div>
                    <div className="font-bold text-blue-600">{selected.totalTradePower.toFixed(0)}</div>
                  </div>
                  <div className="p-2 bg-amber-50 rounded">
                    <div className="text-xs text-stone-500">Goods</div>
                    <div className="font-bold text-amber-600">{selected.goodsProduced.toFixed(1)}</div>
                  </div>
                </div>

                {/* Provinces */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-stone-600 mb-2">
                    Provinces ({selected.provinces.length})
                  </h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {selected.provinces.map(prov => (
                      <div
                        key={prov.id}
                        className="flex items-center justify-between p-2 bg-white rounded border border-stone-200"
                      >
                        <div>
                          <div className="text-sm font-medium">{prov.name}</div>
                          <div className="text-xs text-stone-500">
                            Dev {prov.development} • {prov.tradeGood}
                          </div>
                        </div>
                        <button
                          onClick={() => onRemoveProvince(selected.id, prov.id)}
                          className="text-xs text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Investments */}
                <div>
                  <h4 className="text-sm font-semibold text-stone-600 mb-2">Investments</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {INVESTMENTS.map(inv => {
                      const hasInvestment = selected.investments.includes(inv.id);
                      return (
                        <button
                          key={inv.id}
                          onClick={() => !hasInvestment && onInvestment(selected.id, inv.id)}
                          disabled={hasInvestment}
                          className={`p-3 rounded border text-left ${
                            hasInvestment
                              ? 'border-green-300 bg-green-50'
                              : 'border-stone-200 bg-white hover:bg-stone-50'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span>{inv.icon}</span>
                            <span className="text-sm font-medium">{inv.name}</span>
                            {hasInvestment && <span className="text-green-500 text-xs">✓</span>}
                          </div>
                          <div className="text-xs text-green-600">
                            {inv.effects.join(', ')}
                          </div>
                          {!hasInvestment && (
                            <div className="text-xs text-amber-600 mt-1">{inv.cost} gold</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : selectedReg ? (
              <>
                <div className="text-center mb-4">
                  <span className="text-4xl">{selectedReg.icon}</span>
                  <h3 className="font-bold text-stone-800 mt-2">{selectedReg.name}</h3>
                  <p className="text-sm text-stone-600">{selectedReg.continent}</p>
                </div>

                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-700">
                    Control {selectedReg.bonusThreshold}+ provinces to unlock the regional bonus merchant
                  </div>
                </div>

                {/* Available provinces */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-stone-600 mb-2">
                    Available Provinces ({selectedReg.provinces.filter(p => p.available).length})
                  </h4>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {selectedReg.provinces.map(prov => (
                      <div
                        key={prov.id}
                        className={`p-2 rounded text-sm ${
                          prov.available
                            ? 'bg-white border border-stone-200'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        {prov.name}
                        {!prov.available && (
                          <span className="text-xs ml-2">({prov.owner})</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => onCreateCompany(selectedReg.id)}
                  disabled={selectedReg.provinces.filter(p => p.available).length === 0}
                  className="w-full py-3 bg-amber-600 text-white rounded font-medium hover:bg-amber-700"
                >
                  Create Trade Company
                </button>
              </>
            ) : (
              <p className="text-center text-stone-500 py-8">
                Select a company or region to view details
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeCompanyPanel;
