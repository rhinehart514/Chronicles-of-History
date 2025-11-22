import React, { useState } from 'react';

interface Unit {
  type: string;
  count: number;
  strength: number;
  morale: number;
}

interface Army {
  id: string;
  name: string;
  location: string;
  units: Unit[];
  general?: General;
  morale: number;
  maxMorale: number;
  supply: number;
  maintenance: number;
  attrition: number;
}

interface General {
  id: string;
  name: string;
  fire: number;
  shock: number;
  maneuver: number;
  siege: number;
  traits: string[];
}

interface ArmyDetailsProps {
  army: Army;
  isOwned: boolean;
  onClose: () => void;
  onRename?: (armyId: string, name: string) => void;
  onSplit?: (armyId: string) => void;
  onMerge?: (armyId: string) => void;
  onAssignGeneral?: (armyId: string) => void;
  onDisband?: (armyId: string) => void;
}

export default function ArmyDetails({
  army,
  isOwned,
  onClose,
  onRename,
  onSplit,
  onMerge,
  onAssignGeneral,
  onDisband
}: ArmyDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(army.name);

  const totalUnits = army.units.reduce((sum, u) => sum + u.count, 0);
  const avgStrength = army.units.length > 0
    ? army.units.reduce((sum, u) => sum + u.strength * u.count, 0) / totalUnits
    : 0;

  const handleRename = () => {
    if (onRename && newName.trim()) {
      onRename(army.id, newName.trim());
      setIsEditing(false);
    }
  };

  const unitCategories = [
    { type: 'infantry', icon: '🗡️', label: 'Infantry' },
    { type: 'cavalry', icon: '🐎', label: 'Cavalry' },
    { type: 'artillery', icon: '💣', label: 'Artillery' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-stone-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 border-b border-stone-700 flex justify-between items-center">
          <div className="flex-1">
            {isEditing && isOwned ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="flex-1 bg-stone-700 px-2 py-1 rounded text-amber-100"
                  autoFocus
                  onKeyDown={e => e.key === 'Enter' && handleRename()}
                />
                <button
                  onClick={handleRename}
                  className="text-green-400 hover:text-green-300"
                >
                  ✓
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-red-400 hover:text-red-300"
                >
                  ✕
                </button>
              </div>
            ) : (
              <h2
                className={`text-lg font-bold text-amber-100 ${
                  isOwned && onRename ? 'cursor-pointer hover:text-amber-200' : ''
                }`}
                onClick={() => isOwned && onRename && setIsEditing(true)}
              >
                ⚔️ {army.name}
              </h2>
            )}
            <div className="text-xs text-stone-400">{army.location}</div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Army Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-stone-700 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-amber-400">{totalUnits.toLocaleString()}</div>
              <div className="text-xs text-stone-400">Total Units</div>
            </div>
            <div className="bg-stone-700 rounded-lg p-3 text-center">
              <div className={`text-2xl font-bold ${
                avgStrength >= 75 ? 'text-green-400' :
                avgStrength >= 50 ? 'text-amber-400' : 'text-red-400'
              }`}>
                {avgStrength.toFixed(0)}%
              </div>
              <div className="text-xs text-stone-400">Strength</div>
            </div>
            <div className="bg-stone-700 rounded-lg p-3 text-center">
              <div className={`text-2xl font-bold ${
                army.morale / army.maxMorale >= 0.75 ? 'text-green-400' :
                army.morale / army.maxMorale >= 0.5 ? 'text-amber-400' : 'text-red-400'
              }`}>
                {((army.morale / army.maxMorale) * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-stone-400">Morale</div>
            </div>
          </div>

          {/* Unit Breakdown */}
          <div className="bg-stone-700 rounded-lg p-3">
            <div className="text-xs text-stone-400 mb-2">Unit Composition</div>
            <div className="space-y-2">
              {unitCategories.map(category => {
                const unit = army.units.find(u => u.type === category.type);
                if (!unit || unit.count === 0) return null;

                return (
                  <div key={category.type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span className="text-sm text-stone-200">{category.label}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-amber-100">
                        {unit.count.toLocaleString()}
                      </span>
                      <span className="text-xs text-stone-400 ml-1">
                        ({unit.strength.toFixed(0)}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* General */}
          <div className="bg-stone-700 rounded-lg p-3">
            <div className="text-xs text-stone-400 mb-2">General</div>
            {army.general ? (
              <div>
                <div className="font-medium text-amber-100 mb-2">{army.general.name}</div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="text-center">
                    <div className="font-bold text-red-400">{army.general.fire}</div>
                    <div className="text-stone-500">Fire</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-amber-400">{army.general.shock}</div>
                    <div className="text-stone-500">Shock</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-green-400">{army.general.maneuver}</div>
                    <div className="text-stone-500">Maneuver</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-blue-400">{army.general.siege}</div>
                    <div className="text-stone-500">Siege</div>
                  </div>
                </div>
                {army.general.traits.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {army.general.traits.map((trait, i) => (
                      <span key={i} className="text-xs bg-stone-600 px-1.5 py-0.5 rounded">
                        {trait}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-stone-400">No general assigned</div>
            )}
            {isOwned && onAssignGeneral && (
              <button
                onClick={() => onAssignGeneral(army.id)}
                className="mt-2 w-full text-xs bg-stone-600 hover:bg-stone-500 py-1 rounded"
              >
                {army.general ? 'Replace General' : 'Assign General'}
              </button>
            )}
          </div>

          {/* Supply & Maintenance */}
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="bg-stone-700 rounded p-2 text-center">
              <div className="text-stone-400">Supply</div>
              <div className={`font-medium ${army.supply >= 50 ? 'text-green-400' : 'text-red-400'}`}>
                {army.supply}%
              </div>
            </div>
            <div className="bg-stone-700 rounded p-2 text-center">
              <div className="text-stone-400">Maintenance</div>
              <div className="font-medium text-amber-400">{army.maintenance.toFixed(1)}</div>
            </div>
            <div className="bg-stone-700 rounded p-2 text-center">
              <div className="text-stone-400">Attrition</div>
              <div className={`font-medium ${army.attrition > 0 ? 'text-red-400' : 'text-green-400'}`}>
                {army.attrition.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Actions */}
          {isOwned && (
            <div className="flex gap-2">
              {onSplit && (
                <button
                  onClick={() => onSplit(army.id)}
                  className="flex-1 py-2 bg-stone-600 hover:bg-stone-500 rounded text-sm"
                >
                  Split
                </button>
              )}
              {onMerge && (
                <button
                  onClick={() => onMerge(army.id)}
                  className="flex-1 py-2 bg-stone-600 hover:bg-stone-500 rounded text-sm"
                >
                  Merge
                </button>
              )}
              {onDisband && (
                <button
                  onClick={() => onDisband(army.id)}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 rounded text-sm"
                >
                  Disband
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
