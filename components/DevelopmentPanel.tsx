import React, { useState } from 'react';

interface DevelopmentPanelProps {
  isOpen: boolean;
  onClose: () => void;
  province: ProvinceInfo;
  availableGold: number;
  availableManpower: number;
  techLevel: number;
  modifiers: DevelopmentModifier[];
  onDevelop: (type: DevelopmentType, amount: number) => void;
}

interface ProvinceInfo {
  id: string;
  name: string;
  baseTax: number;
  production: number;
  manpower: number;
  totalDevelopment: number;
  terrain: string;
  climate: string;
  tradeGood: string;
  culture: string;
  religion: string;
}

interface DevelopmentModifier {
  name: string;
  value: number;
}

type DevelopmentType = 'tax' | 'production' | 'manpower';

export const DevelopmentPanel: React.FC<DevelopmentPanelProps> = ({
  isOpen,
  onClose,
  province,
  availableGold,
  availableManpower,
  techLevel,
  modifiers,
  onDevelop
}) => {
  const [selectedType, setSelectedType] = useState<DevelopmentType>('tax');
  const [amount, setAmount] = useState(1);

  if (!isOpen) return null;

  const developmentTypes: { id: DevelopmentType; name: string; icon: string; color: string }[] = [
    { id: 'tax', name: 'Base Tax', icon: '💰', color: 'amber' },
    { id: 'production', name: 'Production', icon: '⚙️', color: 'blue' },
    { id: 'manpower', name: 'Manpower', icon: '👥', color: 'red' }
  ];

  // Base cost increases with total development
  const baseCost = 50 * Math.pow(1.1, province.totalDevelopment);

  // Apply terrain modifiers
  const terrainMod = {
    plains: 0,
    hills: 10,
    mountains: 25,
    forest: 5,
    jungle: 20,
    desert: 15,
    marsh: 20,
    farmland: -10
  }[province.terrain] || 0;

  // Apply climate modifiers
  const climateMod = {
    temperate: 0,
    tropical: 10,
    arid: 15,
    arctic: 25
  }[province.climate] || 0;

  // Calculate total modifier
  const totalModifier = modifiers.reduce((sum, m) => sum + m.value, 0) + terrainMod + climateMod;
  const finalCost = Math.round(baseCost * (1 + totalModifier / 100));
  const totalCost = finalCost * amount;

  const canAfford = totalCost <= availableGold;

  const getCurrentValue = (type: DevelopmentType) => {
    switch (type) {
      case 'tax': return province.baseTax;
      case 'production': return province.production;
      case 'manpower': return province.manpower;
    }
  };

  const handleDevelop = () => {
    if (canAfford) {
      onDevelop(selectedType, amount);
      setAmount(1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-lg border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-stone-800">📈 Develop Province</h2>
            <div className="text-sm text-stone-500">{province.name}</div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Province info */}
        <div className="p-4 border-b border-stone-200 bg-stone-100">
          <div className="grid grid-cols-4 gap-3 text-center mb-3">
            <div>
              <div className="text-xs text-stone-500">Total Dev</div>
              <div className="font-bold text-stone-800">{province.totalDevelopment}</div>
            </div>
            <div>
              <div className="text-xs text-stone-500">Terrain</div>
              <div className="font-medium text-stone-800 text-sm capitalize">{province.terrain}</div>
            </div>
            <div>
              <div className="text-xs text-stone-500">Trade Good</div>
              <div className="font-medium text-stone-800 text-sm">{province.tradeGood}</div>
            </div>
            <div>
              <div className="text-xs text-stone-500">Culture</div>
              <div className="font-medium text-stone-800 text-sm">{province.culture}</div>
            </div>
          </div>

          {/* Current development */}
          <div className="flex justify-around">
            {developmentTypes.map(type => (
              <div key={type.id} className="text-center">
                <div className="text-lg">{type.icon}</div>
                <div className="font-bold">{getCurrentValue(type.id)}</div>
                <div className="text-xs text-stone-500">{type.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Development type selection */}
        <div className="p-4 border-b border-stone-200">
          <h3 className="text-sm font-semibold text-stone-600 mb-2">Development Type</h3>
          <div className="flex gap-2">
            {developmentTypes.map(type => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`flex-1 py-3 rounded-lg border-2 ${
                  selectedType === type.id
                    ? `border-${type.color}-500 bg-${type.color}-50`
                    : 'border-stone-200 bg-white'
                }`}
              >
                <div className="text-xl mb-1">{type.icon}</div>
                <div className="text-xs font-medium">{type.name}</div>
                <div className="text-sm font-bold">{getCurrentValue(type.id)}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Amount selection */}
        <div className="p-4 border-b border-stone-200">
          <h3 className="text-sm font-semibold text-stone-600 mb-2">Amount to Develop</h3>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setAmount(Math.max(1, amount - 1))}
              className="w-10 h-10 bg-stone-200 rounded text-lg hover:bg-stone-300"
            >
              -
            </button>
            <div className="flex-1 text-center">
              <div className="text-3xl font-bold text-stone-800">+{amount}</div>
              <div className="text-xs text-stone-500">
                {getCurrentValue(selectedType)} → {getCurrentValue(selectedType) + amount}
              </div>
            </div>
            <button
              onClick={() => setAmount(Math.min(10, amount + 1))}
              className="w-10 h-10 bg-stone-200 rounded text-lg hover:bg-stone-300"
            >
              +
            </button>
          </div>
        </div>

        {/* Cost breakdown */}
        <div className="p-4 border-b border-stone-200">
          <h3 className="text-sm font-semibold text-stone-600 mb-2">Cost</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-600">Base cost</span>
              <span>{Math.round(baseCost)}</span>
            </div>
            {terrainMod !== 0 && (
              <div className="flex justify-between">
                <span className="text-stone-600">Terrain ({province.terrain})</span>
                <span className={terrainMod > 0 ? 'text-red-600' : 'text-green-600'}>
                  {terrainMod > 0 ? '+' : ''}{terrainMod}%
                </span>
              </div>
            )}
            {climateMod !== 0 && (
              <div className="flex justify-between">
                <span className="text-stone-600">Climate ({province.climate})</span>
                <span className={climateMod > 0 ? 'text-red-600' : 'text-green-600'}>
                  {climateMod > 0 ? '+' : ''}{climateMod}%
                </span>
              </div>
            )}
            {modifiers.map((mod, i) => (
              <div key={i} className="flex justify-between">
                <span className="text-stone-600">{mod.name}</span>
                <span className={mod.value > 0 ? 'text-red-600' : 'text-green-600'}>
                  {mod.value > 0 ? '+' : ''}{mod.value}%
                </span>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t border-stone-200 font-semibold">
              <span>Cost per point</span>
              <span>{finalCost}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total cost</span>
              <span className={canAfford ? 'text-amber-600' : 'text-red-600'}>
                {totalCost.toLocaleString()} 💰
              </span>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="p-4 border-b border-stone-200">
          <h3 className="text-sm font-semibold text-stone-600 mb-2">Benefits</h3>
          <div className="text-sm text-green-600 space-y-1">
            {selectedType === 'tax' && (
              <>
                <div>• +{(amount * 0.1).toFixed(1)} monthly tax income</div>
                <div>• +{amount} fort defense</div>
              </>
            )}
            {selectedType === 'production' && (
              <>
                <div>• +{(amount * 0.2).toFixed(1)} goods produced</div>
                <div>• +{(amount * 0.1).toFixed(1)} trade value</div>
              </>
            )}
            {selectedType === 'manpower' && (
              <>
                <div>• +{(amount * 250).toLocaleString()} provincial manpower</div>
                <div>• +{(amount * 50).toLocaleString()} sailors (coastal)</div>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-200 text-stone-700 rounded hover:bg-stone-300"
          >
            Cancel
          </button>
          <button
            onClick={handleDevelop}
            disabled={!canAfford}
            className={`px-6 py-2 rounded font-medium ${
              canAfford
                ? 'bg-amber-600 text-white hover:bg-amber-700'
                : 'bg-stone-300 text-stone-500 cursor-not-allowed'
            }`}
          >
            {canAfford ? `Develop (${totalCost} gold)` : 'Insufficient Gold'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DevelopmentPanel;
