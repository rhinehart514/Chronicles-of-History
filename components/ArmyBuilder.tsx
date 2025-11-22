import React, { useState, useMemo } from 'react';
import {
  UnitType,
  ArmyTemplate,
  TemplateUnit,
  UNIT_TYPES,
  DEFAULT_TEMPLATES,
  calculateTemplateTotals,
  isUnitAvailable
} from '../data/armyTemplates';

interface ArmyBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  techLevel: number;
  buildings: string[];
  resources: string[];
  availableManpower: number;
  availableGold: number;
  savedTemplates: ArmyTemplate[];
  onBuildArmy: (units: TemplateUnit[], name: string) => void;
  onSaveTemplate: (template: ArmyTemplate) => void;
  onDeleteTemplate: (templateId: string) => void;
}

export const ArmyBuilder: React.FC<ArmyBuilderProps> = ({
  isOpen,
  onClose,
  techLevel,
  buildings,
  resources,
  availableManpower,
  availableGold,
  savedTemplates,
  onBuildArmy,
  onSaveTemplate,
  onDeleteTemplate
}) => {
  const [selectedUnits, setSelectedUnits] = useState<TemplateUnit[]>([]);
  const [armyName, setArmyName] = useState('New Army');
  const [activeTab, setActiveTab] = useState<'build' | 'templates'>('build');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  if (!isOpen) return null;

  const categories = ['all', 'infantry', 'cavalry', 'artillery', 'special'];

  const filteredUnits = categoryFilter === 'all'
    ? UNIT_TYPES
    : UNIT_TYPES.filter(u => u.category === categoryFilter);

  const totals = useMemo(() => calculateTemplateTotals(selectedUnits), [selectedUnits]);

  const canAfford = totals.manpower <= availableManpower && totals.cost <= availableGold;

  const addUnit = (unitTypeId: string) => {
    const existing = selectedUnits.find(u => u.unitTypeId === unitTypeId);
    if (existing) {
      setSelectedUnits(selectedUnits.map(u =>
        u.unitTypeId === unitTypeId ? { ...u, count: u.count + 1 } : u
      ));
    } else {
      setSelectedUnits([...selectedUnits, { unitTypeId, count: 1 }]);
    }
  };

  const removeUnit = (unitTypeId: string) => {
    const existing = selectedUnits.find(u => u.unitTypeId === unitTypeId);
    if (existing && existing.count > 1) {
      setSelectedUnits(selectedUnits.map(u =>
        u.unitTypeId === unitTypeId ? { ...u, count: u.count - 1 } : u
      ));
    } else {
      setSelectedUnits(selectedUnits.filter(u => u.unitTypeId !== unitTypeId));
    }
  };

  const clearUnits = () => setSelectedUnits([]);

  const handleBuild = () => {
    if (canAfford && selectedUnits.length > 0) {
      onBuildArmy(selectedUnits, armyName);
      clearUnits();
      setArmyName('New Army');
    }
  };

  const handleSaveTemplate = () => {
    if (selectedUnits.length > 0) {
      const template: ArmyTemplate = {
        id: `custom_${Date.now()}`,
        name: armyName,
        icon: '📋',
        units: [...selectedUnits],
        totalManpower: totals.manpower,
        totalCost: totals.cost,
        totalMaintenance: totals.maintenance
      };
      onSaveTemplate(template);
    }
  };

  const loadTemplate = (template: ArmyTemplate) => {
    setSelectedUnits([...template.units]);
    setArmyName(template.name);
    setActiveTab('build');
  };

  const allTemplates = [...DEFAULT_TEMPLATES, ...savedTemplates];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-stone-800">🛠️ Army Builder</h2>
            <div className="text-sm text-stone-500">
              Design and recruit military forces
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-200">
          <button
            onClick={() => setActiveTab('build')}
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === 'build'
                ? 'bg-amber-100 text-amber-700 border-b-2 border-amber-600'
                : 'text-stone-600'
            }`}
          >
            Build Army
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === 'templates'
                ? 'bg-amber-100 text-amber-700 border-b-2 border-amber-600'
                : 'text-stone-600'
            }`}
          >
            Templates ({allTemplates.length})
          </button>
        </div>

        {activeTab === 'build' ? (
          <>
            {/* Resources */}
            <div className="p-3 border-b border-stone-200 grid grid-cols-4 gap-4 bg-stone-100">
              <div className="text-center">
                <div className="text-xs text-stone-500">Manpower</div>
                <div className={`font-bold ${totals.manpower > availableManpower ? 'text-red-600' : 'text-stone-800'}`}>
                  {totals.manpower.toLocaleString()}/{availableManpower.toLocaleString()}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-stone-500">Gold Cost</div>
                <div className={`font-bold ${totals.cost > availableGold ? 'text-red-600' : 'text-amber-600'}`}>
                  {totals.cost.toLocaleString()}/{availableGold.toLocaleString()}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-stone-500">Maintenance</div>
                <div className="font-bold text-stone-800">{totals.maintenance.toFixed(1)}/month</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-stone-500">Combat Power</div>
                <div className="font-bold text-red-600">⚔️ {totals.attack} / 🛡️ {totals.defense}</div>
              </div>
            </div>

            {/* Category filter */}
            <div className="p-2 border-b border-stone-200 flex gap-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1 rounded text-sm capitalize ${
                    categoryFilter === cat ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex">
              {/* Unit types */}
              <div className="w-1/2 border-r border-stone-200 overflow-y-auto p-3">
                <div className="space-y-2">
                  {filteredUnits.map(unit => {
                    const available = isUnitAvailable(unit, techLevel, buildings, resources);
                    return (
                      <div
                        key={unit.id}
                        className={`p-3 rounded-lg border ${
                          available ? 'border-stone-200 bg-white' : 'border-stone-200 bg-stone-100 opacity-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{unit.icon}</span>
                            <div>
                              <div className="font-semibold text-stone-800 text-sm">{unit.name}</div>
                              <div className="text-xs text-stone-500 capitalize">{unit.category}</div>
                            </div>
                          </div>
                          {available && (
                            <button
                              onClick={() => addUnit(unit.id)}
                              className="px-2 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                            >
                              +
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-4 gap-1 text-xs">
                          <div className="text-stone-600">⚔️ {unit.attack}</div>
                          <div className="text-stone-600">🛡️ {unit.defense}</div>
                          <div className="text-stone-600">❤️ {unit.morale}</div>
                          <div className="text-stone-600">💨 {unit.speed}</div>
                        </div>
                        <div className="mt-1 text-xs text-amber-600">
                          {unit.manpowerCost} manpower • {unit.goldCost} gold • {unit.maintenanceCost}/mo
                        </div>
                        {!available && unit.requirements.length > 0 && (
                          <div className="mt-1 text-xs text-red-500">
                            Requires: {unit.requirements.map(r => `${r.type} ${r.value}`).join(', ')}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selected units */}
              <div className="w-1/2 p-3 overflow-y-auto">
                <div className="flex items-center justify-between mb-3">
                  <input
                    type="text"
                    value={armyName}
                    onChange={(e) => setArmyName(e.target.value)}
                    className="px-2 py-1 border border-stone-300 rounded text-sm font-semibold"
                    placeholder="Army name"
                  />
                  <button
                    onClick={clearUnits}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Clear
                  </button>
                </div>

                {selectedUnits.length === 0 ? (
                  <p className="text-center text-stone-500 py-8 text-sm">
                    Add units to build your army
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedUnits.map(unit => {
                      const unitType = UNIT_TYPES.find(u => u.id === unit.unitTypeId);
                      if (!unitType) return null;
                      return (
                        <div
                          key={unit.unitTypeId}
                          className="flex items-center justify-between p-2 bg-white rounded border border-stone-200"
                        >
                          <div className="flex items-center gap-2">
                            <span>{unitType.icon}</span>
                            <span className="text-sm font-medium">{unitType.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => removeUnit(unit.unitTypeId)}
                              className="w-6 h-6 bg-stone-200 rounded text-sm hover:bg-stone-300"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-bold">{unit.count}</span>
                            <button
                              onClick={() => addUnit(unit.unitTypeId)}
                              className="w-6 h-6 bg-stone-200 rounded text-sm hover:bg-stone-300"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Actions */}
                <div className="mt-4 space-y-2">
                  <button
                    onClick={handleSaveTemplate}
                    disabled={selectedUnits.length === 0}
                    className={`w-full py-2 rounded text-sm font-medium ${
                      selectedUnits.length > 0
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                    }`}
                  >
                    Save as Template
                  </button>
                  <button
                    onClick={handleBuild}
                    disabled={!canAfford || selectedUnits.length === 0}
                    className={`w-full py-3 rounded font-medium ${
                      canAfford && selectedUnits.length > 0
                        ? 'bg-amber-600 text-white hover:bg-amber-700'
                        : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                    }`}
                  >
                    {!canAfford
                      ? 'Insufficient Resources'
                      : `Build Army (${totals.cost} gold)`}
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Templates tab */
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 gap-3">
              {allTemplates.map(template => {
                const isCustom = template.id.startsWith('custom_');
                return (
                  <div
                    key={template.id}
                    className="p-3 rounded-lg border-2 border-stone-200 bg-white"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{template.icon}</span>
                        <div>
                          <div className="font-semibold text-stone-800">{template.name}</div>
                          <div className="text-xs text-stone-500">
                            {template.units.reduce((sum, u) => sum + u.count, 0)} units
                          </div>
                        </div>
                      </div>
                      {isCustom && (
                        <button
                          onClick={() => onDeleteTemplate(template.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          🗑️
                        </button>
                      )}
                    </div>

                    <div className="text-xs space-y-1 mb-3">
                      {template.units.map(unit => {
                        const unitType = UNIT_TYPES.find(u => u.id === unit.unitTypeId);
                        return (
                          <div key={unit.unitTypeId} className="flex justify-between">
                            <span>{unitType?.icon} {unitType?.name}</span>
                            <span className="font-medium">×{unit.count}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="text-xs text-stone-500 mb-2">
                      {template.totalManpower.toLocaleString()} manpower • {template.totalCost} gold
                    </div>

                    <button
                      onClick={() => loadTemplate(template)}
                      className="w-full py-1 bg-amber-600 text-white rounded text-sm hover:bg-amber-700"
                    >
                      Load Template
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArmyBuilder;
