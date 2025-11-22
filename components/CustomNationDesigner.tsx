import React, { useState } from 'react';
import {
  NationTrait,
  TraitCategory,
  NATION_TRAITS,
  getTraitsByCategory,
  calculateTraitCost,
  calculateTraitEffects
} from '../data/customNationSystem';

interface CustomNationDesignerProps {
  maxPoints: number;
  availableCultures: string[];
  availableReligions: string[];
  availableGovernments: string[];
  onClose: () => void;
  onCreate?: (nation: CustomNationData) => void;
}

interface CustomNationData {
  name: string;
  adjective: string;
  primaryColor: string;
  secondaryColor: string;
  capital: string;
  culture: string;
  religion: string;
  government: string;
  traits: string[];
}

export default function CustomNationDesigner({
  maxPoints,
  availableCultures,
  availableReligions,
  availableGovernments,
  onClose,
  onCreate
}: CustomNationDesignerProps) {
  const [name, setName] = useState('');
  const [adjective, setAdjective] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#8B4513');
  const [secondaryColor, setSecondaryColor] = useState('#FFD700');
  const [culture, setCulture] = useState(availableCultures[0] || '');
  const [religion, setReligion] = useState(availableReligions[0] || '');
  const [government, setGovernment] = useState(availableGovernments[0] || '');
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<TraitCategory>('military');

  const currentCost = calculateTraitCost(selectedTraits);
  const remainingPoints = maxPoints - currentCost;
  const effects = calculateTraitEffects(selectedTraits);

  const categories: { id: TraitCategory; label: string; icon: string }[] = [
    { id: 'military', label: 'Military', icon: '⚔️' },
    { id: 'economic', label: 'Economic', icon: '💰' },
    { id: 'diplomatic', label: 'Diplomatic', icon: '🤝' },
    { id: 'administrative', label: 'Administrative', icon: '📜' }
  ];

  const toggleTrait = (traitId: string) => {
    if (selectedTraits.includes(traitId)) {
      setSelectedTraits(selectedTraits.filter(id => id !== traitId));
    } else {
      const trait = NATION_TRAITS.find(t => t.id === traitId);
      if (trait && trait.cost <= remainingPoints) {
        setSelectedTraits([...selectedTraits, traitId]);
      }
    }
  };

  const handleCreate = () => {
    if (!name || !onCreate) return;

    onCreate({
      name,
      adjective: adjective || `${name}n`,
      primaryColor,
      secondaryColor,
      capital: '',
      culture,
      religion,
      government,
      traits: selectedTraits
    });
  };

  const canCreate = name.length >= 3 && culture && religion && government;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-stone-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-stone-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-amber-100">🎨 Custom Nation Designer</h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Left panel - Basic info */}
          <div className="w-1/3 p-4 border-r border-stone-700 overflow-y-auto space-y-4">
            <div>
              <label className="block text-xs text-stone-400 mb-1">Nation Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter nation name..."
                className="w-full bg-stone-700 px-3 py-2 rounded text-amber-100"
              />
            </div>

            <div>
              <label className="block text-xs text-stone-400 mb-1">Adjective</label>
              <input
                type="text"
                value={adjective}
                onChange={e => setAdjective(e.target.value)}
                placeholder={name ? `${name}n` : 'e.g., French'}
                className="w-full bg-stone-700 px-3 py-2 rounded text-amber-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-stone-400 mb-1">Primary Color</label>
                <input
                  type="color"
                  value={primaryColor}
                  onChange={e => setPrimaryColor(e.target.value)}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs text-stone-400 mb-1">Secondary Color</label>
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={e => setSecondaryColor(e.target.value)}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-stone-400 mb-1">Culture</label>
              <select
                value={culture}
                onChange={e => setCulture(e.target.value)}
                className="w-full bg-stone-700 px-3 py-2 rounded text-amber-100"
              >
                {availableCultures.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-stone-400 mb-1">Religion</label>
              <select
                value={religion}
                onChange={e => setReligion(e.target.value)}
                className="w-full bg-stone-700 px-3 py-2 rounded text-amber-100"
              >
                {availableReligions.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-stone-400 mb-1">Government</label>
              <select
                value={government}
                onChange={e => setGovernment(e.target.value)}
                className="w-full bg-stone-700 px-3 py-2 rounded text-amber-100"
              >
                {availableGovernments.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Points display */}
            <div className="bg-stone-700 rounded-lg p-3">
              <div className="flex justify-between mb-2">
                <span className="text-xs text-stone-400">Points Used</span>
                <span className={`font-bold ${
                  remainingPoints < 0 ? 'text-red-400' :
                  remainingPoints < maxPoints * 0.25 ? 'text-amber-400' :
                  'text-green-400'
                }`}>
                  {currentCost}/{maxPoints}
                </span>
              </div>
              <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    currentCost > maxPoints ? 'bg-red-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.min(100, (currentCost / maxPoints) * 100)}%` }}
                />
              </div>
            </div>

            {/* Active effects */}
            {effects.size > 0 && (
              <div className="bg-stone-700 rounded-lg p-3">
                <div className="text-xs text-stone-400 mb-2">Total Effects</div>
                <div className="space-y-1">
                  {Array.from(effects.entries()).map(([type, value]) => (
                    <div key={type} className="text-xs text-green-400">
                      {value > 0 ? '+' : ''}{value} {type.replace(/_/g, ' ')}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right panel - Traits */}
          <div className="flex-1 flex flex-col">
            {/* Category tabs */}
            <div className="border-b border-stone-700 flex">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex-1 px-3 py-2 text-sm transition-colors ${
                    activeCategory === cat.id
                      ? 'text-amber-400 border-b-2 border-amber-400'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>

            {/* Trait list */}
            <div className="flex-1 p-4 overflow-y-auto space-y-2">
              {getTraitsByCategory(activeCategory).map(trait => {
                const isSelected = selectedTraits.includes(trait.id);
                const canAfford = trait.cost <= remainingPoints;

                return (
                  <div
                    key={trait.id}
                    onClick={() => toggleTrait(trait.id)}
                    className={`rounded-lg p-3 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-900/50 ring-2 ring-amber-500'
                        : canAfford
                          ? 'bg-stone-700 hover:bg-stone-600'
                          : 'bg-stone-700 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{trait.icon}</span>
                        <div>
                          <div className="font-medium text-amber-100">{trait.name}</div>
                          <div className="text-xs text-stone-400">{trait.description}</div>
                        </div>
                      </div>
                      <span className={`text-sm font-bold ${
                        isSelected ? 'text-green-400' : 'text-amber-400'
                      }`}>
                        {trait.cost}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {trait.effects.map((effect, i) => (
                        <span
                          key={i}
                          className="text-xs bg-stone-800 text-green-400 px-2 py-0.5 rounded"
                        >
                          {effect.value > 0 ? '+' : ''}{effect.value}{effect.isPercent ? '%' : ''} {effect.type.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-700 flex justify-between items-center">
          <div className="text-sm text-stone-400">
            Selected Traits: {selectedTraits.length}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-stone-700 hover:bg-stone-600 rounded text-sm"
            >
              Cancel
            </button>
            {onCreate && (
              <button
                onClick={handleCreate}
                disabled={!canCreate}
                className={`px-4 py-2 rounded text-sm font-medium ${
                  canCreate
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-stone-600 text-stone-400 cursor-not-allowed'
                }`}
              >
                Create Nation
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
