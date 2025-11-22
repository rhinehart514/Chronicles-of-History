import React, { useState } from 'react';

export interface Army {
  id: string;
  name: string;
  commander: string;
  size: number;
  morale: number;
  experience: number;
  supplies: number;
  location: string;
  status: 'idle' | 'marching' | 'besieging' | 'defending' | 'retreating';
  composition: {
    infantry: number;
    cavalry: number;
    artillery: number;
  };
}

export interface ArmyUnit {
  type: 'infantry' | 'cavalry' | 'artillery';
  name: string;
  icon: string;
  cost: number;
  maintenance: number;
  strength: number;
  speed: number;
}

interface ArmyManagementProps {
  isOpen: boolean;
  onClose: () => void;
  armies: Army[];
  manpower: number;
  treasury: number;
  onRecruit: (armyId: string, unitType: string, amount: number) => void;
  onDisband: (armyId: string, amount: number) => void;
  onMerge: (army1: string, army2: string) => void;
  onSplit: (armyId: string, newSize: number) => void;
  onRename: (armyId: string, name: string) => void;
}

export const ArmyManagement: React.FC<ArmyManagementProps> = ({
  isOpen,
  onClose,
  armies,
  manpower,
  treasury,
  onRecruit,
  onDisband,
  onMerge,
  onSplit,
  onRename
}) => {
  const [selectedArmy, setSelectedArmy] = useState<string | null>(
    armies.length > 0 ? armies[0].id : null
  );
  const [recruitAmount, setRecruitAmount] = useState(1000);
  const [recruitType, setRecruitType] = useState<'infantry' | 'cavalry' | 'artillery'>('infantry');

  if (!isOpen) return null;

  const army = armies.find(a => a.id === selectedArmy);

  const unitTypes: ArmyUnit[] = [
    { type: 'infantry', name: 'Infantry', icon: '🚶', cost: 10, maintenance: 1, strength: 1, speed: 2 },
    { type: 'cavalry', name: 'Cavalry', icon: '🐎', cost: 30, maintenance: 3, strength: 2, speed: 4 },
    { type: 'artillery', name: 'Artillery', icon: '💥', cost: 50, maintenance: 5, strength: 3, speed: 1 }
  ];

  const totalStrength = armies.reduce((sum, a) => sum + a.size, 0);
  const totalMaintenance = armies.reduce((sum, a) => {
    return sum + a.composition.infantry + a.composition.cavalry * 3 + a.composition.artillery * 5;
  }, 0);

  const getStatusColor = (status: Army['status']) => {
    switch (status) {
      case 'idle': return 'text-green-600 bg-green-100';
      case 'marching': return 'text-blue-600 bg-blue-100';
      case 'besieging': return 'text-orange-600 bg-orange-100';
      case 'defending': return 'text-purple-600 bg-purple-100';
      case 'retreating': return 'text-red-600 bg-red-100';
    }
  };

  const getMoraleColor = (morale: number) => {
    if (morale >= 80) return 'bg-green-500';
    if (morale >= 60) return 'bg-blue-500';
    if (morale >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <h2 className="text-xl font-bold text-stone-800">⚔️ Army Management</h2>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Summary bar */}
        <div className="p-3 bg-stone-100 border-b border-stone-200 flex justify-around text-sm">
          <div className="text-center">
            <div className="font-bold text-stone-800">{armies.length}</div>
            <div className="text-xs text-stone-500">Armies</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-stone-800">{totalStrength.toLocaleString()}</div>
            <div className="text-xs text-stone-500">Total Troops</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-blue-600">{manpower.toLocaleString()}</div>
            <div className="text-xs text-stone-500">Manpower</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-red-600">-{totalMaintenance}</div>
            <div className="text-xs text-stone-500">Monthly Cost</div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Army list */}
          <div className="w-1/3 border-r border-stone-200 overflow-y-auto">
            {armies.length === 0 ? (
              <p className="p-4 text-center text-stone-500">No armies</p>
            ) : (
              <div className="divide-y divide-stone-100">
                {armies.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setSelectedArmy(a.id)}
                    className={`w-full p-3 text-left ${
                      selectedArmy === a.id ? 'bg-amber-50' : 'hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-stone-800">{a.name}</div>
                        <div className="text-xs text-stone-500">{a.commander}</div>
                      </div>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${getStatusColor(a.status)}`}>
                        {a.status}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-stone-600">
                      {a.size.toLocaleString()} troops
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Army details */}
          <div className="w-2/3 overflow-y-auto p-4">
            {army ? (
              <div className="space-y-4">
                {/* Army header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-stone-800">{army.name}</h3>
                    <p className="text-sm text-stone-600">Commander: {army.commander}</p>
                    <p className="text-xs text-stone-500">Location: {army.location}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm font-semibold ${getStatusColor(army.status)}`}>
                    {army.status}
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded border border-stone-200 text-center">
                    <div className="text-xl font-bold text-stone-800">{army.size.toLocaleString()}</div>
                    <div className="text-xs text-stone-500">Total Troops</div>
                  </div>
                  <div className="bg-white p-3 rounded border border-stone-200">
                    <div className="text-sm font-semibold text-stone-700 mb-1">Morale</div>
                    <div className="w-full bg-stone-200 rounded h-2">
                      <div className={`h-2 rounded ${getMoraleColor(army.morale)}`} style={{ width: `${army.morale}%` }} />
                    </div>
                    <div className="text-xs text-stone-500 mt-1">{army.morale}%</div>
                  </div>
                  <div className="bg-white p-3 rounded border border-stone-200 text-center">
                    <div className="text-xl font-bold text-stone-800">{army.experience}</div>
                    <div className="text-xs text-stone-500">Experience</div>
                  </div>
                </div>

                {/* Composition */}
                <div className="bg-white p-3 rounded border border-stone-200">
                  <h4 className="font-semibold text-stone-800 mb-2">Composition</h4>
                  <div className="space-y-2">
                    {unitTypes.map(unit => {
                      const count = army.composition[unit.type];
                      const percentage = (count / army.size) * 100;
                      return (
                        <div key={unit.type} className="flex items-center gap-2">
                          <span className="w-6">{unit.icon}</span>
                          <span className="text-sm text-stone-700 w-20">{unit.name}</span>
                          <div className="flex-1 bg-stone-200 rounded h-3">
                            <div
                              className="bg-amber-500 h-3 rounded"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-stone-600 w-16 text-right">
                            {count.toLocaleString()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recruit */}
                <div className="bg-white p-3 rounded border border-stone-200">
                  <h4 className="font-semibold text-stone-800 mb-2">Recruit Troops</h4>
                  <div className="flex gap-2 mb-2">
                    {unitTypes.map(unit => (
                      <button
                        key={unit.type}
                        onClick={() => setRecruitType(unit.type)}
                        className={`flex-1 py-1 rounded text-sm ${
                          recruitType === unit.type
                            ? 'bg-amber-600 text-white'
                            : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        {unit.icon} {unit.name}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={recruitAmount}
                      onChange={(e) => setRecruitAmount(Math.max(0, parseInt(e.target.value) || 0))}
                      className="flex-1 px-2 py-1 border border-stone-300 rounded"
                      min="0"
                      step="100"
                    />
                    <button
                      onClick={() => onRecruit(army.id, recruitType, recruitAmount)}
                      disabled={manpower < recruitAmount}
                      className={`px-4 py-1 rounded font-semibold ${
                        manpower >= recruitAmount
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                      }`}
                    >
                      Recruit
                    </button>
                  </div>
                  <div className="text-xs text-stone-500 mt-1">
                    Cost: {recruitAmount * unitTypes.find(u => u.type === recruitType)!.cost} gold
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onDisband(army.id, 1000)}
                    className="flex-1 py-2 bg-red-100 text-red-700 rounded font-semibold hover:bg-red-200"
                  >
                    Disband 1000
                  </button>
                  <button
                    onClick={() => onSplit(army.id, Math.floor(army.size / 2))}
                    disabled={army.size < 2000}
                    className="flex-1 py-2 bg-blue-100 text-blue-700 rounded font-semibold hover:bg-blue-200 disabled:opacity-50"
                  >
                    Split Army
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-stone-500">
                Select an army to manage
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArmyManagement;
