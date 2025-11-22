import React, { useState } from 'react';

interface ArmyCompositionProps {
  isOpen: boolean;
  onClose: () => void;
  armies: Army[];
  unitTypes: UnitType[];
  manpowerAvailable: number;
  goldAvailable: number;
  forceLimit: number;
  currentForces: number;
  onRecruit: (armyId: string, unitType: string, amount: number) => void;
  onDisband: (armyId: string, unitType: string, amount: number) => void;
  onMerge: (armyIds: string[]) => void;
  onSplit: (armyId: string) => void;
}

interface Army {
  id: string;
  name: string;
  location: string;
  units: ArmyUnit[];
  morale: number;
  strength: number;
  leader?: string;
}

interface ArmyUnit {
  type: string;
  count: number;
  strength: number;
}

interface UnitType {
  id: string;
  name: string;
  icon: string;
  category: 'infantry' | 'cavalry' | 'artillery';
  cost: number;
  maintenance: number;
  manpower: number;
}

export const ArmyComposition: React.FC<ArmyCompositionProps> = ({
  isOpen,
  onClose,
  armies,
  unitTypes,
  manpowerAvailable,
  goldAvailable,
  forceLimit,
  currentForces,
  onRecruit,
  onDisband,
  onMerge,
  onSplit
}) => {
  const [selectedArmy, setSelectedArmy] = useState<string | null>(null);
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [recruitAmount, setRecruitAmount] = useState(1);

  if (!isOpen) return null;

  const selected = armies.find(a => a.id === selectedArmy);

  const totalInfantry = armies.reduce((sum, a) =>
    sum + a.units.filter(u => {
      const type = unitTypes.find(t => t.id === u.type);
      return type?.category === 'infantry';
    }).reduce((s, u) => s + u.count, 0), 0);

  const totalCavalry = armies.reduce((sum, a) =>
    sum + a.units.filter(u => {
      const type = unitTypes.find(t => t.id === u.type);
      return type?.category === 'cavalry';
    }).reduce((s, u) => s + u.count, 0), 0);

  const totalArtillery = armies.reduce((sum, a) =>
    sum + a.units.filter(u => {
      const type = unitTypes.find(t => t.id === u.type);
      return type?.category === 'artillery';
    }).reduce((s, u) => s + u.count, 0), 0);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'infantry': return 'text-blue-600';
      case 'cavalry': return 'text-amber-600';
      case 'artillery': return 'text-red-600';
      default: return 'text-stone-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-stone-800">🎖️ Army Composition</h2>
            <div className="text-sm text-stone-500">
              {armies.length} armies • {currentForces}/{forceLimit} force limit
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Stats */}
        <div className="p-3 border-b border-stone-200 bg-stone-100 grid grid-cols-5 gap-3 text-center">
          <div>
            <div className="text-xs text-stone-500">Infantry</div>
            <div className="font-bold text-blue-600">{totalInfantry.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-stone-500">Cavalry</div>
            <div className="font-bold text-amber-600">{totalCavalry.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-stone-500">Artillery</div>
            <div className="font-bold text-red-600">{totalArtillery.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-stone-500">Manpower</div>
            <div className="font-bold text-stone-800">{manpowerAvailable.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-stone-500">Treasury</div>
            <div className="font-bold text-amber-600">{goldAvailable.toLocaleString()}</div>
          </div>
        </div>

        {/* Force limit bar */}
        <div className="p-3 border-b border-stone-200">
          <div className="flex justify-between text-sm mb-1">
            <span>Force Limit</span>
            <span className={currentForces > forceLimit ? 'text-red-600' : 'text-stone-600'}>
              {currentForces} / {forceLimit}
            </span>
          </div>
          <div className="w-full bg-stone-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full ${currentForces > forceLimit ? 'bg-red-500' : 'bg-green-500'}`}
              style={{ width: `${Math.min(100, (currentForces / forceLimit) * 100)}%` }}
            />
          </div>
          {currentForces > forceLimit && (
            <div className="text-xs text-red-600 mt-1">
              ⚠️ Over force limit - increased maintenance costs
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Army list */}
          <div className="w-1/2 border-r border-stone-200 overflow-y-auto p-3">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-stone-600">Armies</h3>
              {selectedUnits.length >= 2 && (
                <button
                  onClick={() => {
                    onMerge(selectedUnits);
                    setSelectedUnits([]);
                  }}
                  className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
                >
                  Merge Selected
                </button>
              )}
            </div>
            {armies.length === 0 ? (
              <p className="text-center text-stone-500 py-8">No armies</p>
            ) : (
              <div className="space-y-2">
                {armies.map(army => (
                  <div
                    key={army.id}
                    className={`p-3 rounded-lg border-2 ${
                      selectedArmy === army.id
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-stone-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <button
                        onClick={() => setSelectedArmy(army.id)}
                        className="text-left flex-1"
                      >
                        <div className="font-semibold text-stone-800">{army.name}</div>
                        <div className="text-xs text-stone-500">{army.location}</div>
                      </button>
                      <input
                        type="checkbox"
                        checked={selectedUnits.includes(army.id)}
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedUnits([...selectedUnits, army.id]);
                          } else {
                            setSelectedUnits(selectedUnits.filter(id => id !== army.id));
                          }
                        }}
                        className="w-4 h-4"
                      />
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>{army.strength.toLocaleString()} troops</span>
                      <span className={army.morale >= 3 ? 'text-green-600' : 'text-red-600'}>
                        Morale: {army.morale.toFixed(1)}
                      </span>
                    </div>
                    {army.leader && (
                      <div className="text-xs text-blue-600 mt-1">
                        Leader: {army.leader}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Army details / Recruit */}
          <div className="w-1/2 p-4 overflow-y-auto">
            {selected ? (
              <>
                <div className="text-center mb-4">
                  <h3 className="font-bold text-stone-800 text-lg">{selected.name}</h3>
                  <p className="text-sm text-stone-600">{selected.location}</p>
                </div>

                {/* Unit composition */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-stone-600 mb-2">Composition</h4>
                  {selected.units.length === 0 ? (
                    <p className="text-sm text-stone-500">No units</p>
                  ) : (
                    <div className="space-y-2">
                      {selected.units.map(unit => {
                        const type = unitTypes.find(t => t.id === unit.type);
                        if (!type) return null;
                        return (
                          <div
                            key={unit.type}
                            className="flex items-center justify-between p-2 bg-stone-100 rounded"
                          >
                            <div className="flex items-center gap-2">
                              <span>{type.icon}</span>
                              <span className={getCategoryColor(type.category)}>
                                {type.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{unit.count.toLocaleString()}</span>
                              <button
                                onClick={() => onDisband(selected.id, unit.type, 1)}
                                className="text-red-500 text-sm hover:text-red-700"
                              >
                                -
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Recruit units */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-stone-600 mb-2">Recruit Units</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm">Amount:</span>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={recruitAmount}
                      onChange={e => setRecruitAmount(parseInt(e.target.value) || 1)}
                      className="w-16 px-2 py-1 border border-stone-300 rounded"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {unitTypes.map(type => (
                      <button
                        key={type.id}
                        onClick={() => onRecruit(selected.id, type.id, recruitAmount)}
                        disabled={manpowerAvailable < type.manpower * recruitAmount}
                        className={`p-2 rounded border text-left text-sm ${
                          manpowerAvailable >= type.manpower * recruitAmount
                            ? 'border-stone-200 bg-white hover:bg-stone-50'
                            : 'border-stone-200 bg-stone-100 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center gap-1 mb-1">
                          <span>{type.icon}</span>
                          <span className={getCategoryColor(type.category)}>{type.name}</span>
                        </div>
                        <div className="text-xs text-stone-500">
                          {type.cost} gold • {type.manpower} MP
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <button
                  onClick={() => onSplit(selected.id)}
                  disabled={selected.units.length === 0}
                  className={`w-full py-2 rounded font-medium ${
                    selected.units.length > 0
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  Split Army
                </button>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-stone-500">Select an army to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArmyComposition;
