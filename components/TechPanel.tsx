import React, { useState } from 'react';
import { Lightbulb, BookOpen, Check, Lock, ChevronRight } from 'lucide-react';
import { Nation, Era } from '../types';
import { Technology, getAvailableTechs, getTechById, getCategoryIcon, calculateResearchPoints } from '../data/technologySystem';

interface TechPanelProps {
  nation: Nation;
  onSelectTech: (techId: string) => void;
}

const TechPanel: React.FC<TechPanelProps> = ({ nation, onSelectTech }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (!nation.research) {
    return (
      <div className="bg-[#f4efe4] rounded-lg shadow-xl p-4 font-serif">
        <h3 className="text-lg font-bold text-stone-800 mb-2">Research</h3>
        <p className="text-stone-600 text-sm italic">Research system not yet available.</p>
      </div>
    );
  }

  const research = nation.research;
  const availableTechs = getAvailableTechs(research.completedTechs, nation.currentEra || 'ENLIGHTENMENT');
  const currentTech = research.currentTech ? getTechById(research.currentTech) : null;
  const pointsPerTurn = calculateResearchPoints(nation.stats.innovation, nation.stats.economy);

  // Group available techs by category
  const techsByCategory = availableTechs.reduce((acc, tech) => {
    if (!acc[tech.category]) acc[tech.category] = [];
    acc[tech.category].push(tech);
    return acc;
  }, {} as Record<string, Technology[]>);

  const categories = Object.keys(techsByCategory);

  return (
    <div className="bg-[#f4efe4] rounded-lg shadow-xl font-serif overflow-hidden">
      {/* Header */}
      <div className="bg-indigo-700 text-amber-100 px-4 py-2 flex items-center gap-2">
        <Lightbulb size={18} />
        <h3 className="font-bold">Research & Technology</h3>
      </div>

      <div className="p-4 max-h-96 overflow-y-auto">
        {/* Research Points */}
        <div className="bg-indigo-50 rounded p-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-indigo-800">Research Points</span>
            <span className="font-bold text-indigo-700">{research.researchPoints} pts</span>
          </div>
          <div className="text-xs text-indigo-600 mt-1">
            +{pointsPerTurn} per turn (Innovation: {nation.stats.innovation}, Economy: {nation.stats.economy})
          </div>
        </div>

        {/* Current Research */}
        {currentTech && (
          <div className="bg-amber-50 rounded p-3 mb-4 border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={14} className="text-amber-600" />
              <span className="text-sm font-bold text-amber-800">Researching</span>
            </div>
            <div className="font-medium text-stone-800">{currentTech.name}</div>
            <div className="text-xs text-stone-600 mb-2">{currentTech.description}</div>
            <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all"
                style={{ width: `${research.progress}%` }}
              />
            </div>
            <div className="text-xs text-stone-500 mt-1 text-right">
              {research.progress}% ({Math.ceil((currentTech.researchCost * (100 - research.progress)) / 100 / pointsPerTurn)} turns remaining)
            </div>
          </div>
        )}

        {/* Completed Techs Count */}
        <div className="text-xs text-stone-500 mb-3">
          <Check size={12} className="inline mr-1" />
          {research.completedTechs.length} technologies researched
        </div>

        {/* Available Technologies */}
        {!currentTech && (
          <>
            <h4 className="text-sm font-bold text-stone-700 mb-2">Available Research</h4>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-1 mb-3">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`text-xs px-2 py-1 rounded ${
                  selectedCategory === null
                    ? 'bg-indigo-600 text-white'
                    : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                }`}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-2 py-1 rounded ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white'
                      : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                  }`}
                >
                  {getCategoryIcon(cat as any)} {cat.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Tech List */}
            <div className="space-y-2">
              {availableTechs
                .filter(tech => !selectedCategory || tech.category === selectedCategory)
                .slice(0, 8) // Limit display
                .map(tech => (
                  <button
                    key={tech.id}
                    onClick={() => onSelectTech(tech.id)}
                    className="w-full bg-stone-100 rounded p-2 text-left hover:bg-indigo-50 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>{getCategoryIcon(tech.category)}</span>
                        <span className="font-medium text-sm text-stone-800">{tech.name}</span>
                      </div>
                      <ChevronRight size={14} className="text-stone-400 group-hover:text-indigo-600" />
                    </div>
                    <div className="text-xs text-stone-500 mt-1 pl-6">{tech.description}</div>
                    <div className="flex items-center gap-2 mt-1 pl-6">
                      <span className="text-xs text-indigo-600">
                        {tech.researchCost} pts (~{Math.ceil(tech.researchCost / pointsPerTurn)} turns)
                      </span>
                      {/* Show effects */}
                      {tech.effects.military && (
                        <span className="text-xs text-red-600">⚔️+{tech.effects.military}</span>
                      )}
                      {tech.effects.economy && (
                        <span className="text-xs text-yellow-600">💰+{tech.effects.economy}</span>
                      )}
                      {tech.effects.innovation && (
                        <span className="text-xs text-blue-600">💡+{tech.effects.innovation}</span>
                      )}
                    </div>
                  </button>
                ))}
            </div>

            {availableTechs.length === 0 && (
              <div className="text-sm text-stone-500 italic text-center py-4">
                No technologies available. Advance to a new era or complete prerequisites.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TechPanel;
