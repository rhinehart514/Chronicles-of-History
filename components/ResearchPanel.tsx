import React, { useState } from 'react';
import { Technology } from './TechTree';

export interface ResearchProgress {
  technologyId: string;
  progress: number;
  totalCost: number;
}

interface ResearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
  technologies: Technology[];
  completedTechs: string[];
  currentResearch: ResearchProgress | null;
  monthlyResearch: number;
  researchModifiers: { name: string; value: number }[];
  onSelectResearch: (techId: string) => void;
  onCancelResearch: () => void;
}

export const ResearchPanel: React.FC<ResearchPanelProps> = ({
  isOpen,
  onClose,
  technologies,
  completedTechs,
  currentResearch,
  monthlyResearch,
  researchModifiers,
  onSelectResearch,
  onCancelResearch
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  if (!isOpen) return null;

  const categories = [...new Set(technologies.map(t => t.category))];

  const filteredTechs = categoryFilter === 'all'
    ? technologies
    : technologies.filter(t => t.category === categoryFilter);

  const totalModifier = researchModifiers.reduce((sum, m) => sum + m.value, 0);
  const effectiveResearch = Math.round(monthlyResearch * (1 + totalModifier / 100));

  const isAvailable = (tech: Technology) => {
    if (completedTechs.includes(tech.id)) return false;
    if (currentResearch?.technologyId === tech.id) return true;
    return tech.prerequisites.every(prereq => completedTechs.includes(prereq));
  };

  const currentTech = currentResearch
    ? technologies.find(t => t.id === currentResearch.technologyId)
    : null;

  const remainingMonths = currentResearch && effectiveResearch > 0
    ? Math.ceil((currentResearch.totalCost - currentResearch.progress) / effectiveResearch)
    : null;

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'military': return '⚔️';
      case 'economic': return '💰';
      case 'diplomatic': return '🤝';
      case 'administrative': return '📜';
      default: return '🔬';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-stone-800">🔬 Research</h2>
            <div className="text-sm text-stone-500">
              {completedTechs.length}/{technologies.length} technologies researched
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Stats */}
        <div className="p-3 border-b border-stone-200 grid grid-cols-3 gap-4 bg-stone-100">
          <div className="text-center">
            <div className="text-xs text-stone-500">Base Research</div>
            <div className="font-bold text-stone-800">{monthlyResearch}/month</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-stone-500">Modifier</div>
            <div className={`font-bold ${totalModifier >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalModifier > 0 ? '+' : ''}{totalModifier}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-stone-500">Effective</div>
            <div className="font-bold text-blue-600">{effectiveResearch}/month</div>
          </div>
        </div>

        {/* Current research */}
        {currentResearch && currentTech && (
          <div className="p-4 border-b border-stone-200 bg-blue-50">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{getCategoryIcon(currentTech.category)}</span>
                <div>
                  <div className="font-semibold text-stone-800">{currentTech.name}</div>
                  <div className="text-xs text-stone-500">
                    {remainingMonths !== null && `~${remainingMonths} months remaining`}
                  </div>
                </div>
              </div>
              <button
                onClick={onCancelResearch}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Cancel
              </button>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all"
                style={{ width: `${(currentResearch.progress / currentResearch.totalCost) * 100}%` }}
              />
            </div>
            <div className="text-xs text-stone-500 mt-1 text-right">
              {currentResearch.progress}/{currentResearch.totalCost}
            </div>
          </div>
        )}

        {/* Category filter */}
        <div className="p-3 border-b border-stone-200 flex gap-2">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1 rounded text-sm ${
              categoryFilter === 'all' ? 'bg-stone-600 text-white' : 'bg-stone-200 text-stone-700'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded text-sm ${
                categoryFilter === cat ? 'bg-stone-600 text-white' : 'bg-stone-200 text-stone-700'
              }`}
            >
              {getCategoryIcon(cat)} {cat}
            </button>
          ))}
        </div>

        {/* Technologies */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-3">
            {filteredTechs.map(tech => {
              const isCompleted = completedTechs.includes(tech.id);
              const isCurrent = currentResearch?.technologyId === tech.id;
              const available = isAvailable(tech);

              return (
                <div
                  key={tech.id}
                  className={`rounded-lg p-3 border-2 ${
                    isCompleted
                      ? 'border-green-500 bg-green-50'
                      : isCurrent
                      ? 'border-blue-500 bg-blue-50'
                      : available
                      ? 'border-stone-200 bg-white'
                      : 'border-stone-200 bg-stone-100 opacity-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span>{getCategoryIcon(tech.category)}</span>
                      <div>
                        <div className="font-semibold text-stone-800 text-sm">{tech.name}</div>
                        <div className="text-xs text-stone-500">Year: {tech.year}</div>
                      </div>
                    </div>
                    {isCompleted && <span className="text-green-500">✓</span>}
                  </div>

                  <p className="text-xs text-stone-600 mb-2 line-clamp-2">{tech.description}</p>

                  {!isCompleted && !isCurrent && available && (
                    <button
                      onClick={() => onSelectResearch(tech.id)}
                      className="w-full py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      Research ({tech.cost})
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modifiers breakdown */}
        <div className="p-3 border-t border-stone-300 bg-stone-100">
          <div className="flex justify-between items-center text-xs">
            <span className="text-stone-500">Research Modifiers:</span>
            <div className="flex gap-3">
              {researchModifiers.map((mod, i) => (
                <span
                  key={i}
                  className={mod.value >= 0 ? 'text-green-600' : 'text-red-600'}
                >
                  {mod.name}: {mod.value > 0 ? '+' : ''}{mod.value}%
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchPanel;
