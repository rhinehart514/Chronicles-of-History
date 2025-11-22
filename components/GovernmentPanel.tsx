import React, { useState } from 'react';
import {
  GovernmentType,
  GovernmentCategory,
  GOVERNMENT_TYPES,
  getGovernmentsByCategory,
  getGovernmentIcon
} from '../data/governmentTypes';

interface GovernmentPanelProps {
  currentGovernment: GovernmentType;
  governmentReforms: string[];
  legitimacy: number;
  republicanTradition: number;
  devotion: number;
  absolutism: number;
  maxAbsolutism: number;
  onClose: () => void;
  onChangeGovernment?: (governmentId: string) => void;
}

export default function GovernmentPanel({
  currentGovernment,
  governmentReforms,
  legitimacy,
  republicanTradition,
  devotion,
  absolutism,
  maxAbsolutism,
  onClose,
  onChangeGovernment
}: GovernmentPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'reforms' | 'types'>('overview');

  const tabs = [
    { id: 'overview' as const, label: 'Overview' },
    { id: 'reforms' as const, label: 'Reforms' },
    { id: 'types' as const, label: 'Government Types' }
  ];

  const getGovernmentStat = (): { name: string; value: number; color: string } => {
    switch (currentGovernment.category) {
      case 'monarchy':
        return { name: 'Legitimacy', value: legitimacy, color: 'text-amber-400' };
      case 'republic':
        return { name: 'Republican Tradition', value: republicanTradition, color: 'text-blue-400' };
      case 'theocracy':
        return { name: 'Devotion', value: devotion, color: 'text-purple-400' };
      default:
        return { name: 'Authority', value: 50, color: 'text-stone-400' };
    }
  };

  const stat = getGovernmentStat();

  const renderOverview = () => (
    <div className="space-y-4">
      <div className="bg-stone-700 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{getGovernmentIcon(currentGovernment.category)}</span>
          <div>
            <h3 className="font-bold text-amber-100">{currentGovernment.name}</h3>
            <div className="text-xs text-stone-400 capitalize">{currentGovernment.category}</div>
          </div>
        </div>

        <p className="text-sm text-stone-300 mb-4">{currentGovernment.description}</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-stone-800 rounded p-3">
            <div className="text-xs text-stone-400 mb-1">{stat.name}</div>
            <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="h-1.5 bg-stone-900 rounded-full mt-1 overflow-hidden">
              <div
                className={`h-full ${
                  stat.value >= 50 ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: `${stat.value}%` }}
              />
            </div>
          </div>
          <div className="bg-stone-800 rounded p-3">
            <div className="text-xs text-stone-400 mb-1">Absolutism</div>
            <div className="text-xl font-bold text-red-400">
              {absolutism}/{maxAbsolutism}
            </div>
            <div className="h-1.5 bg-stone-900 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-red-500"
                style={{ width: `${(absolutism / maxAbsolutism) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {currentGovernment.modifiers.length > 0 && (
          <div>
            <div className="text-xs text-stone-400 mb-2">Bonuses:</div>
            <div className="space-y-1">
              {currentGovernment.modifiers.map((mod, i) => (
                <div
                  key={i}
                  className={`text-xs px-2 py-1 rounded ${
                    mod.value > 0
                      ? 'bg-green-900/30 text-green-400'
                      : 'bg-red-900/30 text-red-400'
                  }`}
                >
                  {mod.value > 0 ? '+' : ''}{mod.value}{mod.isPercent ? '%' : ''} {mod.type.replace(/_/g, ' ')}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-stone-700 rounded-lg p-4">
        <h4 className="font-medium text-amber-100 mb-3">Government Mechanics</h4>
        <div className="space-y-2 text-xs text-stone-300">
          {currentGovernment.category === 'monarchy' && (
            <>
              <div>• Rulers serve until death</div>
              <div>• Heirs inherit the throne</div>
              <div>• Royal marriages available</div>
              <div>• Can claim foreign thrones</div>
            </>
          )}
          {currentGovernment.category === 'republic' && (
            <>
              <div>• Rulers are elected periodically</div>
              <div>• Re-election costs republican tradition</div>
              <div>• Higher ruler stats from elections</div>
              <div>• No royal marriages</div>
            </>
          )}
          {currentGovernment.category === 'theocracy' && (
            <>
              <div>• Rulers appointed for life</div>
              <div>• Devotion affects papal relations</div>
              <div>• Religious conversion bonuses</div>
              <div>• Can declare religious wars</div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderReforms = () => (
    <div className="space-y-3">
      <div className="text-sm text-stone-400 mb-2">
        Active Reforms: {governmentReforms.length}
      </div>

      {governmentReforms.length === 0 ? (
        <div className="text-center py-8 text-stone-400">
          <div className="text-3xl mb-2">📜</div>
          <div>No reforms enacted</div>
          <div className="text-xs mt-1">Unlock reforms through government capacity</div>
        </div>
      ) : (
        governmentReforms.map((reformId, index) => (
          <div key={reformId} className="bg-stone-700 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <span className="text-sm bg-amber-900/50 text-amber-300 w-6 h-6 rounded flex items-center justify-center">
                {index + 1}
              </span>
              <span className="font-medium text-amber-100">
                {reformId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderTypes = () => {
    const categoryGroups: GovernmentCategory[] = ['monarchy', 'republic', 'theocracy', 'tribal', 'native'];

    return (
      <div className="space-y-4">
        {categoryGroups.map(category => {
          const govs = getGovernmentsByCategory(category);
          if (govs.length === 0) return null;

          return (
            <div key={category}>
              <h4 className="text-sm font-medium text-stone-400 mb-2 capitalize flex items-center gap-2">
                <span>{getGovernmentIcon(category)}</span>
                {category}
              </h4>
              <div className="space-y-2">
                {govs.map(gov => (
                  <div
                    key={gov.id}
                    className={`bg-stone-700 rounded-lg p-3 ${
                      gov.id === currentGovernment.id
                        ? 'ring-2 ring-amber-500'
                        : onChangeGovernment ? 'cursor-pointer hover:bg-stone-600' : ''
                    }`}
                    onClick={() => {
                      if (onChangeGovernment && gov.id !== currentGovernment.id) {
                        onChangeGovernment(gov.id);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-amber-100">{gov.name}</span>
                      {gov.id === currentGovernment.id && (
                        <span className="text-xs bg-green-700 text-white px-2 py-0.5 rounded">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-stone-400">
                      {gov.modifiers.slice(0, 2).map(m =>
                        `${m.value > 0 ? '+' : ''}${m.value}${m.isPercent ? '%' : ''} ${m.type.replace(/_/g, ' ')}`
                      ).join(' • ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-stone-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-stone-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-amber-100">🏛️ Government</h2>
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
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'reforms' && renderReforms()}
          {activeTab === 'types' && renderTypes()}
        </div>
      </div>
    </div>
  );
}
