import React, { useState } from 'react';

interface MercenaryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  availableCompanies: MercenaryCompany[];
  hiredMercenaries: HiredMercenary[];
  availableGold: number;
  currentManpower: number;
  maxManpower: number;
  mercenaryModifier: number;
  onHire: (companyId: string) => void;
  onDisband: (companyId: string) => void;
}

interface MercenaryCompany {
  id: string;
  name: string;
  origin: string;
  icon: string;
  size: number;
  composition: { type: string; count: number }[];
  cost: number;
  hireCost: number;
  morale: number;
  discipline: number;
  maneuver: number;
  available: boolean;
  cooldown?: number;
}

interface HiredMercenary extends MercenaryCompany {
  contractEnd: number;
  currentStrength: number;
  location: string;
}

export const MercenaryPanel: React.FC<MercenaryPanelProps> = ({
  isOpen,
  onClose,
  availableCompanies,
  hiredMercenaries,
  availableGold,
  currentManpower,
  maxManpower,
  mercenaryModifier,
  onHire,
  onDisband
}) => {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [filter, setFilter] = useState<'available' | 'hired'>('available');

  if (!isOpen) return null;

  const calculateHireCost = (company: MercenaryCompany) => {
    let cost = company.hireCost;
    const manpowerRatio = currentManpower / maxManpower;
    if (manpowerRatio < 0.25) cost *= 1.5;
    else if (manpowerRatio < 0.5) cost *= 1.25;
    cost *= (1 + mercenaryModifier / 100);
    return Math.round(cost);
  };

  const calculateMonthlyCost = (company: MercenaryCompany) => {
    return Math.round(company.cost * (1 + mercenaryModifier / 100));
  };

  const totalMonthlyCost = hiredMercenaries.reduce(
    (sum, m) => sum + calculateMonthlyCost(m),
    0
  );

  const totalMercStrength = hiredMercenaries.reduce(
    (sum, m) => sum + m.currentStrength,
    0
  );

  const selected = filter === 'available'
    ? availableCompanies.find(c => c.id === selectedCompany)
    : hiredMercenaries.find(c => c.id === selectedCompany);

  const hiredSelected = hiredMercenaries.find(c => c.id === selectedCompany);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-stone-800">⚔️ Mercenary Companies</h2>
            <div className="text-sm text-stone-500">
              {hiredMercenaries.length} hired • {totalMercStrength.toLocaleString()} troops
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Stats */}
        <div className="p-3 border-b border-stone-200 bg-stone-100 grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-xs text-stone-500">Available Gold</div>
            <div className="font-bold text-amber-600">{availableGold.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-stone-500">Monthly Cost</div>
            <div className="font-bold text-red-600">-{totalMonthlyCost.toFixed(1)}</div>
          </div>
          <div>
            <div className="text-xs text-stone-500">Your Manpower</div>
            <div className={`font-bold ${currentManpower / maxManpower < 0.25 ? 'text-red-600' : 'text-stone-800'}`}>
              {Math.round((currentManpower / maxManpower) * 100)}%
            </div>
          </div>
          <div>
            <div className="text-xs text-stone-500">Cost Modifier</div>
            <div className={`font-bold ${mercenaryModifier > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {mercenaryModifier > 0 ? '+' : ''}{mercenaryModifier}%
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="p-2 border-b border-stone-200 flex gap-2">
          <button
            onClick={() => setFilter('available')}
            className={`px-4 py-1 rounded text-sm ${
              filter === 'available' ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-700'
            }`}
          >
            Available ({availableCompanies.filter(c => c.available).length})
          </button>
          <button
            onClick={() => setFilter('hired')}
            className={`px-4 py-1 rounded text-sm ${
              filter === 'hired' ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-700'
            }`}
          >
            Hired ({hiredMercenaries.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Company list */}
          <div className="w-1/2 border-r border-stone-200 overflow-y-auto p-3">
            {filter === 'available' ? (
              <div className="space-y-2">
                {availableCompanies.map(company => {
                  const hireCost = calculateHireCost(company);
                  return (
                    <button
                      key={company.id}
                      onClick={() => setSelectedCompany(company.id)}
                      disabled={!company.available}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        selectedCompany === company.id
                          ? 'border-amber-500 bg-amber-50'
                          : company.available
                          ? 'border-stone-200 bg-white'
                          : 'border-stone-200 bg-stone-100 opacity-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{company.icon}</span>
                          <div>
                            <div className="font-semibold text-stone-800">{company.name}</div>
                            <div className="text-xs text-stone-500">{company.origin}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-amber-600">{hireCost}</div>
                          <div className="text-xs text-stone-500">hire</div>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>{company.size.toLocaleString()} troops</span>
                        <span className="text-green-600">+{calculateMonthlyCost(company)}/mo</span>
                      </div>
                      {!company.available && company.cooldown && (
                        <div className="text-xs text-red-500 mt-1">
                          Available in {company.cooldown} months
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2">
                {hiredMercenaries.length === 0 ? (
                  <p className="text-center text-stone-500 py-8">No mercenaries hired</p>
                ) : (
                  hiredMercenaries.map(merc => (
                    <button
                      key={merc.id}
                      onClick={() => setSelectedCompany(merc.id)}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        selectedCompany === merc.id
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-stone-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{merc.icon}</span>
                          <div>
                            <div className="font-semibold text-stone-800">{merc.name}</div>
                            <div className="text-xs text-stone-500">{merc.location}</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>{merc.currentStrength.toLocaleString()}/{merc.size.toLocaleString()}</span>
                        <span className="text-red-600">-{calculateMonthlyCost(merc)}/mo</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Company details */}
          <div className="w-1/2 p-4 overflow-y-auto">
            {selected ? (
              <>
                <div className="text-center mb-4">
                  <span className="text-4xl">{selected.icon}</span>
                  <h3 className="font-bold text-stone-800 mt-2">{selected.name}</h3>
                  <p className="text-sm text-stone-600">{selected.origin}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  <div className="p-2 bg-blue-50 rounded">
                    <div className="text-xs text-stone-500">Morale</div>
                    <div className="font-bold text-blue-600">{selected.morale.toFixed(1)}</div>
                  </div>
                  <div className="p-2 bg-purple-50 rounded">
                    <div className="text-xs text-stone-500">Discipline</div>
                    <div className="font-bold text-purple-600">{selected.discipline}%</div>
                  </div>
                  <div className="p-2 bg-green-50 rounded">
                    <div className="text-xs text-stone-500">Maneuver</div>
                    <div className="font-bold text-green-600">{selected.maneuver}</div>
                  </div>
                </div>

                {/* Composition */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-stone-600 mb-2">Composition</h4>
                  <div className="space-y-1">
                    {selected.composition.map((unit, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="capitalize">{unit.type}</span>
                        <span className="font-medium">{unit.count.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm pt-1 border-t border-stone-200 font-semibold">
                      <span>Total</span>
                      <span>{selected.size.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Costs */}
                <div className="mb-4 p-3 bg-stone-100 rounded-lg">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Hire cost</span>
                    <span className="font-bold text-amber-600">{calculateHireCost(selected)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Monthly cost</span>
                    <span className="font-bold text-red-600">{calculateMonthlyCost(selected)}</span>
                  </div>
                </div>

                {/* Actions */}
                {filter === 'available' && selected.available ? (
                  <button
                    onClick={() => onHire(selected.id)}
                    disabled={availableGold < calculateHireCost(selected)}
                    className={`w-full py-3 rounded font-medium ${
                      availableGold >= calculateHireCost(selected)
                        ? 'bg-amber-600 text-white hover:bg-amber-700'
                        : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                    }`}
                  >
                    {availableGold >= calculateHireCost(selected)
                      ? `Hire Company (${calculateHireCost(selected)} gold)`
                      : 'Insufficient Gold'}
                  </button>
                ) : hiredSelected && (
                  <>
                    <div className="mb-3 p-3 bg-blue-50 rounded-lg text-sm">
                      <div className="flex justify-between mb-1">
                        <span>Current strength</span>
                        <span>{hiredSelected.currentStrength.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Contract ends</span>
                        <span>{hiredSelected.contractEnd}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onDisband(hiredSelected.id)}
                      className="w-full py-3 bg-red-600 text-white rounded font-medium hover:bg-red-700"
                    >
                      Disband Company
                    </button>
                  </>
                )}
              </>
            ) : (
              <p className="text-center text-stone-500 py-8">
                Select a company to view details
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MercenaryPanel;
