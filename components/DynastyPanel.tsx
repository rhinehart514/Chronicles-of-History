import React, { useState } from 'react';
import {
  Dynasty,
  Ruler,
  Heir,
  RulerTrait,
  DynastyTrait,
  SuccessionLaw,
  RULER_TRAITS,
  DYNASTY_TRAITS,
  SUCCESSION_LAWS,
  calculateRulerQuality,
  getClaimDescription,
  getDynastyPrestigeLevel
} from '../data/dynastySystem';

interface DynastyPanelProps {
  dynasty: Dynasty;
  ruler: Ruler;
  heirs: Heir[];
  successionLaw: SuccessionLaw;
  onClose: () => void;
  onChangeSuccession?: (lawId: string) => void;
}

type TabType = 'ruler' | 'dynasty' | 'heirs' | 'succession';

export default function DynastyPanel({
  dynasty,
  ruler,
  heirs,
  successionLaw,
  onClose,
  onChangeSuccession
}: DynastyPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('ruler');

  const tabs: { id: TabType; label: string }[] = [
    { id: 'ruler', label: 'Ruler' },
    { id: 'dynasty', label: 'Dynasty' },
    { id: 'heirs', label: 'Heirs' },
    { id: 'succession', label: 'Succession' }
  ];

  const rulerQuality = calculateRulerQuality(ruler.stats);
  const qualityColors = {
    poor: 'text-red-400',
    average: 'text-stone-400',
    good: 'text-green-400',
    excellent: 'text-amber-400'
  };

  const renderRuler = () => (
    <div className="space-y-4">
      <div className="bg-stone-700 rounded-lg p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold text-amber-100">{ruler.name}</h3>
            <p className="text-sm text-stone-400">House of {dynasty.name}</p>
          </div>
          <span className={`text-sm font-medium ${qualityColors[rulerQuality]}`}>
            {rulerQuality.charAt(0).toUpperCase() + rulerQuality.slice(1)} Ruler
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-stone-800 rounded p-3 text-center">
            <div className="text-2xl font-bold text-red-400">{ruler.stats.admin}</div>
            <div className="text-xs text-stone-400">Administrative</div>
          </div>
          <div className="bg-stone-800 rounded p-3 text-center">
            <div className="text-2xl font-bold text-blue-400">{ruler.stats.diplo}</div>
            <div className="text-xs text-stone-400">Diplomatic</div>
          </div>
          <div className="bg-stone-800 rounded p-3 text-center">
            <div className="text-2xl font-bold text-green-400">{ruler.stats.military}</div>
            <div className="text-xs text-stone-400">Military</div>
          </div>
        </div>

        <div className="text-sm text-stone-400">
          <span>Born: {ruler.birthYear}</span>
          <span className="mx-2">•</span>
          <span>Age: {new Date().getFullYear() - ruler.birthYear + 1444}</span>
        </div>
      </div>

      {ruler.traits.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-stone-300 mb-2">Ruler Traits</h4>
          <div className="space-y-2">
            {ruler.traits.map(trait => (
              <div key={trait.id} className="bg-stone-700 rounded p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span>{trait.icon}</span>
                  <span className="text-amber-100">{trait.name}</span>
                </div>
                <p className="text-xs text-stone-400 mb-2">{trait.description}</p>
                <div className="flex flex-wrap gap-2">
                  {trait.effects.map((effect, i) => (
                    <span
                      key={i}
                      className={`text-xs px-2 py-0.5 rounded ${
                        effect.value > 0 ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                      }`}
                    >
                      {effect.value > 0 ? '+' : ''}{effect.value} {effect.type.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderDynasty = () => (
    <div className="space-y-4">
      <div className="bg-stone-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-amber-100 mb-1">House of {dynasty.name}</h3>
        <p className="text-sm text-stone-400 mb-3">Founded {dynasty.foundedYear}</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-stone-800 rounded p-3">
            <div className="text-lg font-bold text-amber-400">{dynasty.prestige}</div>
            <div className="text-xs text-stone-400">Dynasty Prestige</div>
            <div className="text-xs text-amber-300">{getDynastyPrestigeLevel(dynasty.prestige)}</div>
          </div>
          <div className="bg-stone-800 rounded p-3">
            <div className="text-lg font-bold text-blue-400">{dynasty.legitimacy}%</div>
            <div className="text-xs text-stone-400">Legitimacy</div>
          </div>
        </div>

        <div className="text-sm text-stone-400">
          Origin Culture: <span className="text-stone-200">{dynasty.originCulture}</span>
        </div>
      </div>

      {dynasty.traits.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-stone-300 mb-2">Dynasty Traits</h4>
          <div className="space-y-2">
            {dynasty.traits.map(trait => (
              <div key={trait.id} className="bg-stone-700 rounded p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span>{trait.icon}</span>
                  <span className="text-amber-100">{trait.name}</span>
                </div>
                <p className="text-xs text-stone-400 mb-2">{trait.description}</p>
                <div className="flex flex-wrap gap-2">
                  {trait.effects.map((effect, i) => (
                    <span
                      key={i}
                      className={`text-xs px-2 py-0.5 rounded ${
                        effect.value > 0 ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                      }`}
                    >
                      {effect.value > 0 ? '+' : ''}{effect.value} {effect.type.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h4 className="text-sm font-medium text-stone-300 mb-2">All Dynasty Traits</h4>
        <div className="grid grid-cols-2 gap-2">
          {DYNASTY_TRAITS.map(trait => {
            const hasTrait = dynasty.traits.some(t => t.id === trait.id);
            return (
              <div
                key={trait.id}
                className={`p-2 rounded text-xs ${
                  hasTrait ? 'bg-amber-900/30 border border-amber-700' : 'bg-stone-800 opacity-50'
                }`}
              >
                <span className="mr-1">{trait.icon}</span>
                {trait.name}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderHeirs = () => (
    <div className="space-y-4">
      {heirs.length === 0 ? (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">⚠️</div>
          <div className="text-red-300 font-medium">No Heirs</div>
          <p className="text-xs text-stone-400 mt-1">
            The dynasty has no heirs. A succession crisis may occur upon ruler death.
          </p>
        </div>
      ) : (
        heirs.map((heir, index) => (
          <div key={heir.id} className="bg-stone-700 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-2">
                  {index === 0 && (
                    <span className="text-xs bg-amber-600 text-white px-2 py-0.5 rounded">
                      Primary Heir
                    </span>
                  )}
                  <span className="text-xs text-stone-400">#{index + 1}</span>
                </div>
                <h3 className="text-lg font-semibold text-amber-100">{heir.name}</h3>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${
                  heir.claimStrength >= 60 ? 'text-green-400' :
                  heir.claimStrength >= 30 ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {getClaimDescription(heir.claimStrength)}
                </div>
                <div className="text-xs text-stone-400">{heir.claimStrength}% claim</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="bg-stone-800 rounded p-2 text-center">
                <div className="text-lg font-bold text-red-400">{heir.stats.admin}</div>
                <div className="text-xs text-stone-400">ADM</div>
              </div>
              <div className="bg-stone-800 rounded p-2 text-center">
                <div className="text-lg font-bold text-blue-400">{heir.stats.diplo}</div>
                <div className="text-xs text-stone-400">DIP</div>
              </div>
              <div className="bg-stone-800 rounded p-2 text-center">
                <div className="text-lg font-bold text-green-400">{heir.stats.military}</div>
                <div className="text-xs text-stone-400">MIL</div>
              </div>
            </div>

            <div className="text-sm text-stone-400 mb-2">
              Born: {heir.birthYear} • Age: {new Date().getFullYear() - heir.birthYear + 1444}
            </div>

            {heir.traits.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {heir.traits.map(trait => (
                  <span
                    key={trait.id}
                    className="text-xs bg-stone-800 px-2 py-0.5 rounded"
                    title={trait.description}
                  >
                    {trait.icon} {trait.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );

  const renderSuccession = () => (
    <div className="space-y-4">
      <div className="bg-stone-700 rounded-lg p-4">
        <h4 className="text-sm font-medium text-stone-300 mb-2">Current Succession Law</h4>
        <div className="bg-amber-900/30 border border-amber-700 rounded p-3">
          <div className="font-semibold text-amber-100">{successionLaw.name}</div>
          <p className="text-xs text-stone-400 mt-1">{successionLaw.description}</p>
          {successionLaw.effects.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {successionLaw.effects.map((effect, i) => (
                <span
                  key={i}
                  className={`text-xs px-2 py-0.5 rounded ${
                    effect.value > 0 ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                  }`}
                >
                  {effect.value > 0 ? '+' : ''}{effect.value} {effect.type.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-stone-300 mb-2">Available Succession Laws</h4>
        <div className="space-y-2">
          {SUCCESSION_LAWS.map(law => {
            const isActive = law.id === successionLaw.id;
            const canChange = law.requirements.length === 0;

            return (
              <div
                key={law.id}
                className={`rounded p-3 ${
                  isActive
                    ? 'bg-amber-900/30 border border-amber-700'
                    : 'bg-stone-700'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-amber-100">{law.name}</div>
                    <p className="text-xs text-stone-400 mt-1">{law.description}</p>
                  </div>
                  {!isActive && onChangeSuccession && (
                    <button
                      onClick={() => onChangeSuccession(law.id)}
                      disabled={!canChange}
                      className={`text-xs px-2 py-1 rounded ${
                        canChange
                          ? 'bg-amber-600 hover:bg-amber-700 text-white'
                          : 'bg-stone-600 text-stone-400 cursor-not-allowed'
                      }`}
                    >
                      {canChange ? 'Adopt' : 'Locked'}
                    </button>
                  )}
                </div>

                {law.requirements.length > 0 && (
                  <div className="mt-2 text-xs text-stone-400">
                    Requires: {law.requirements.map(r => `${r.type}: ${r.value}`).join(', ')}
                  </div>
                )}

                {law.effects.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {law.effects.map((effect, i) => (
                      <span
                        key={i}
                        className={`text-xs px-1.5 py-0.5 rounded ${
                          effect.value > 0 ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'
                        }`}
                      >
                        {effect.value > 0 ? '+' : ''}{effect.value} {effect.type.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-stone-800 rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-stone-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-amber-100">👑 Dynasty & Succession</h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200"
          >
            ✕
          </button>
        </div>

        <div className="border-b border-stone-700">
          <div className="flex">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-amber-400 border-b-2 border-amber-400'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          {activeTab === 'ruler' && renderRuler()}
          {activeTab === 'dynasty' && renderDynasty()}
          {activeTab === 'heirs' && renderHeirs()}
          {activeTab === 'succession' && renderSuccession()}
        </div>
      </div>
    </div>
  );
}
