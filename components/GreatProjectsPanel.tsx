import React, { useState } from 'react';
import { GreatProject, GREAT_PROJECTS } from '../data/greatProjects';

interface GreatProjectsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  ownedProjects: OwnedProject[];
  availableProjects: GreatProject[];
  techLevel: number;
  gold: number;
  manpower: number;
  prestige: number;
  onBuildProject: (projectId: string, provinceId: string) => void;
  onUpgradeProject: (projectId: string) => void;
}

interface OwnedProject {
  projectId: string;
  provinceId: string;
  provinceName: string;
  level: number;
  constructing: boolean;
  monthsRemaining?: number;
}

export const GreatProjectsPanel: React.FC<GreatProjectsPanelProps> = ({
  isOpen,
  onClose,
  ownedProjects,
  availableProjects,
  techLevel,
  gold,
  manpower,
  prestige,
  onBuildProject,
  onUpgradeProject
}) => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('all');

  if (!isOpen) return null;

  const types = ['all', 'monument', 'religious', 'military', 'university', 'canal', 'wonder'];

  const filteredProjects = typeFilter === 'all'
    ? GREAT_PROJECTS
    : GREAT_PROJECTS.filter(p => p.type === typeFilter);

  const selected = GREAT_PROJECTS.find(p => p.id === selectedProject);
  const owned = ownedProjects.find(o => o.projectId === selectedProject);

  const canAfford = (project: GreatProject) => {
    for (const cost of project.costs) {
      if (cost.type === 'gold' && gold < cost.value) return false;
      if (cost.type === 'manpower' && manpower < cost.value) return false;
      if (cost.type === 'prestige' && prestige < cost.value) return false;
    }
    return true;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'monument': return '🏛️';
      case 'religious': return '⛪';
      case 'military': return '🏰';
      case 'university': return '📚';
      case 'canal': return '🌊';
      case 'wonder': return '✨';
      default: return '📍';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-stone-800">🏛️ Great Projects</h2>
            <div className="text-sm text-stone-500">
              {ownedProjects.length} projects owned
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Owned projects summary */}
        {ownedProjects.length > 0 && (
          <div className="p-3 border-b border-stone-200 bg-amber-50">
            <h3 className="text-sm font-semibold text-stone-600 mb-2">Your Projects</h3>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {ownedProjects.map(proj => {
                const info = GREAT_PROJECTS.find(p => p.id === proj.projectId);
                return (
                  <button
                    key={proj.projectId}
                    onClick={() => setSelectedProject(proj.projectId)}
                    className={`flex-shrink-0 px-3 py-2 rounded border ${
                      selectedProject === proj.projectId
                        ? 'border-amber-500 bg-amber-100'
                        : 'border-stone-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{info?.icon}</span>
                      <div className="text-left">
                        <div className="text-sm font-medium">{info?.name}</div>
                        <div className="text-xs text-stone-500">
                          Level {proj.level}
                          {proj.constructing && ` • ${proj.monthsRemaining}mo`}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Type filter */}
        <div className="p-2 border-b border-stone-200 flex gap-1 flex-wrap">
          {types.map(type => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1 rounded text-sm capitalize ${
                typeFilter === type ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-700'
              }`}
            >
              {type === 'all' ? 'All' : `${getTypeIcon(type)} ${type}`}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Project list */}
          <div className="w-1/2 border-r border-stone-200 overflow-y-auto p-3">
            <div className="space-y-2">
              {filteredProjects.map(project => {
                const isOwned = ownedProjects.some(o => o.projectId === project.id);
                const affordable = canAfford(project);

                return (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProject(project.id)}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                      selectedProject === project.id
                        ? 'border-amber-500 bg-amber-50'
                        : isOwned
                        ? 'border-green-300 bg-green-50'
                        : 'border-stone-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{project.icon}</span>
                      <div>
                        <div className="font-semibold text-stone-800">{project.name}</div>
                        <div className="text-xs text-stone-500 capitalize">{project.type}</div>
                      </div>
                      {isOwned && <span className="ml-auto text-green-500">✓</span>}
                    </div>
                    <p className="text-xs text-stone-600">{project.description}</p>
                    {!isOwned && (
                      <div className="mt-2 text-xs">
                        <span className={affordable ? 'text-green-600' : 'text-red-600'}>
                          {project.costs.map(c => `${c.value} ${c.type}`).join(' • ')}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Project details */}
          <div className="w-1/2 p-4 overflow-y-auto">
            {selected ? (
              <>
                <div className="text-center mb-4">
                  <span className="text-4xl">{selected.icon}</span>
                  <h3 className="font-bold text-stone-800 mt-2">{selected.name}</h3>
                  <p className="text-sm text-stone-600">{selected.description}</p>
                </div>

                {/* Build time */}
                <div className="mb-4 text-center">
                  <span className="text-sm text-stone-500">Build Time: </span>
                  <span className="font-medium">{selected.buildTime} months</span>
                </div>

                {/* Costs */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-stone-600 mb-2">Construction Cost</h4>
                  <div className="flex gap-3">
                    {selected.costs.map((cost, i) => (
                      <div
                        key={i}
                        className={`flex-1 p-2 rounded text-center ${
                          cost.type === 'gold' ? 'bg-amber-50' :
                          cost.type === 'manpower' ? 'bg-red-50' :
                          'bg-purple-50'
                        }`}
                      >
                        <div className="font-bold">{cost.value.toLocaleString()}</div>
                        <div className="text-xs text-stone-500 capitalize">{cost.type}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Levels */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-stone-600 mb-2">Levels</h4>
                  <div className="space-y-3">
                    {selected.levels.map((level, i) => {
                      const currentLevel = owned?.level || 0;
                      const isUnlocked = currentLevel >= level.level;
                      const canUpgrade = currentLevel === level.level - 1;

                      return (
                        <div
                          key={i}
                          className={`p-3 rounded border ${
                            isUnlocked
                              ? 'border-green-300 bg-green-50'
                              : canUpgrade
                              ? 'border-amber-300 bg-amber-50'
                              : 'border-stone-200 bg-stone-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">
                              Level {level.level}: {level.name}
                            </span>
                            {isUnlocked && <span className="text-green-500 text-xs">✓</span>}
                          </div>
                          <div className="space-y-1 mb-2">
                            {level.effects.map((effect, j) => (
                              <div key={j} className="text-xs text-green-600">
                                {effect.description}
                                {effect.scope !== 'nation' && (
                                  <span className="text-stone-400"> ({effect.scope})</span>
                                )}
                              </div>
                            ))}
                          </div>
                          {!isUnlocked && (
                            <div className="text-xs text-stone-500">
                              Upgrade: {level.upgradeCost} gold • {level.upgradeTime} months
                            </div>
                          )}
                          {canUpgrade && owned && (
                            <button
                              onClick={() => onUpgradeProject(selected.id)}
                              className="mt-2 w-full py-1 bg-amber-600 text-white rounded text-sm hover:bg-amber-700"
                            >
                              Upgrade
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Requirements */}
                {selected.requirements.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-stone-600 mb-2">Requirements</h4>
                    <div className="space-y-1">
                      {selected.requirements.map((req, i) => (
                        <div key={i} className="text-xs text-stone-600">
                          • {req.type}: {req.value}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Build button */}
                {!owned && (
                  <button
                    onClick={() => onBuildProject(selected.id, 'capital')}
                    disabled={!canAfford(selected)}
                    className={`w-full py-3 rounded font-medium ${
                      canAfford(selected)
                        ? 'bg-amber-600 text-white hover:bg-amber-700'
                        : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                    }`}
                  >
                    {canAfford(selected) ? 'Build Project' : 'Cannot Afford'}
                  </button>
                )}
              </>
            ) : (
              <p className="text-center text-stone-500 py-8">
                Select a project to view details
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GreatProjectsPanel;
