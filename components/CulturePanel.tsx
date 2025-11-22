import React, { useState } from 'react';
import { CulturalProject } from '../services/cultureService';

export interface CultureInfo {
  id: string;
  name: string;
  provinces: number;
  percentage: number;
  accepted: boolean;
}

interface CulturePanelProps {
  isOpen: boolean;
  onClose: () => void;
  primaryCulture: string;
  cultures: CultureInfo[];
  culturalUnity: number;
  prestige: number;
  activeProjects: CulturalProject[];
  availableProjects: CulturalProject[];
  onStartProject: (projectId: string) => void;
  onAcceptCulture: (cultureId: string) => void;
  onRemoveAccepted: (cultureId: string) => void;
}

export const CulturePanel: React.FC<CulturePanelProps> = ({
  isOpen,
  onClose,
  primaryCulture,
  cultures,
  culturalUnity,
  prestige,
  activeProjects,
  availableProjects,
  onStartProject,
  onAcceptCulture,
  onRemoveAccepted
}) => {
  const [tab, setTab] = useState<'overview' | 'projects' | 'cultures'>('overview');

  if (!isOpen) return null;

  const acceptedCultures = cultures.filter(c => c.accepted);
  const unacceptedCultures = cultures.filter(c => !c.accepted && c.id !== primaryCulture);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <h2 className="text-xl font-bold text-stone-800">🎭 Culture & Prestige</h2>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Stats bar */}
        <div className="p-3 border-b border-stone-200 grid grid-cols-3 gap-4 bg-stone-100">
          <div className="text-center">
            <div className="text-xs text-stone-500">Primary Culture</div>
            <div className="font-bold text-stone-800">{primaryCulture}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-stone-500">Cultural Unity</div>
            <div className={`font-bold ${culturalUnity > 70 ? 'text-green-600' : culturalUnity > 40 ? 'text-amber-600' : 'text-red-600'}`}>
              {culturalUnity}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-stone-500">Prestige</div>
            <div className="font-bold text-purple-600">{prestige.toFixed(1)}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="p-2 border-b border-stone-200 flex gap-2">
          {(['overview', 'projects', 'cultures'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded text-sm font-medium ${
                tab === t
                  ? 'bg-purple-600 text-white'
                  : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {tab === 'overview' && (
            <div className="space-y-4">
              {/* Cultural unity breakdown */}
              <div className="bg-stone-100 rounded-lg p-4">
                <h3 className="font-semibold text-stone-800 mb-3">Cultural Composition</h3>
                <div className="space-y-2">
                  {cultures
                    .sort((a, b) => b.percentage - a.percentage)
                    .slice(0, 5)
                    .map(culture => (
                      <div key={culture.id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className={culture.id === primaryCulture ? 'font-bold text-purple-600' : 'text-stone-700'}>
                            {culture.name}
                            {culture.accepted && culture.id !== primaryCulture && ' ✓'}
                          </span>
                          <span className="text-stone-500">
                            {culture.percentage.toFixed(1)}% ({culture.provinces} provinces)
                          </span>
                        </div>
                        <div className="w-full bg-stone-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              culture.id === primaryCulture
                                ? 'bg-purple-500'
                                : culture.accepted
                                ? 'bg-green-500'
                                : 'bg-stone-400'
                            }`}
                            style={{ width: `${culture.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Active cultural projects */}
              {activeProjects.length > 0 && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="font-semibold text-stone-800 mb-3">Active Projects</h3>
                  <div className="space-y-2">
                    {activeProjects.map(project => (
                      <div key={project.id} className="bg-white rounded p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{project.icon}</span>
                          <div className="flex-1">
                            <div className="font-medium text-stone-800">{project.name}</div>
                            <div className="text-xs text-stone-500">{project.category}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Prestige effects */}
              <div className="bg-stone-100 rounded-lg p-4">
                <h3 className="font-semibold text-stone-800 mb-3">Prestige Effects</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className={prestige >= 3 ? 'text-green-600' : 'text-stone-400'}>
                    ✓ Diplomatic reputation bonus
                  </div>
                  <div className={prestige >= 4 ? 'text-green-600' : 'text-stone-400'}>
                    ✓ Improved alliance acceptance
                  </div>
                  <div className={prestige >= 5 ? 'text-green-600' : 'text-stone-400'}>
                    ✓ Reduced advisor costs
                  </div>
                  <div className={prestige >= 6 ? 'text-green-600' : 'text-stone-400'}>
                    ✓ Increased legitimacy
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'projects' && (
            <div className="space-y-3">
              {availableProjects.map(project => (
                <div key={project.id} className="bg-stone-100 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{project.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-stone-800">{project.name}</h4>
                      <p className="text-sm text-stone-600 mb-2">{project.description}</p>

                      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                        <div>
                          <span className="text-stone-500">Duration:</span>
                          <span className="ml-1 font-medium">{project.duration} turns</span>
                        </div>
                        <div>
                          <span className="text-stone-500">Cost:</span>
                          <span className="ml-1 font-medium text-amber-600">{project.cost}💰</span>
                        </div>
                      </div>

                      <button
                        onClick={() => onStartProject(project.id)}
                        className="px-4 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                      >
                        Start Project
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'cultures' && (
            <div className="space-y-4">
              {/* Accepted cultures */}
              <div>
                <h3 className="font-semibold text-stone-800 mb-3">Accepted Cultures</h3>
                <div className="space-y-2">
                  <div className="bg-purple-100 rounded p-3 flex justify-between items-center">
                    <span className="font-medium text-purple-700">{primaryCulture}</span>
                    <span className="text-xs text-purple-600">Primary</span>
                  </div>
                  {acceptedCultures.map(culture => (
                    <div key={culture.id} className="bg-green-100 rounded p-3 flex justify-between items-center">
                      <span className="font-medium text-green-700">{culture.name}</span>
                      <button
                        onClick={() => onRemoveAccepted(culture.id)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Unaccepted cultures */}
              {unacceptedCultures.length > 0 && (
                <div>
                  <h3 className="font-semibold text-stone-800 mb-3">Unaccepted Cultures</h3>
                  <div className="space-y-2">
                    {unacceptedCultures.map(culture => (
                      <div key={culture.id} className="bg-stone-100 rounded p-3 flex justify-between items-center">
                        <div>
                          <span className="font-medium text-stone-700">{culture.name}</span>
                          <span className="ml-2 text-xs text-stone-500">
                            {culture.percentage.toFixed(1)}%
                          </span>
                        </div>
                        <button
                          onClick={() => onAcceptCulture(culture.id)}
                          className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                        >
                          Accept
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CulturePanel;
