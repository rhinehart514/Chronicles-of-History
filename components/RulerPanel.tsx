import React from 'react';
import { LeaderTrait } from '../data/traitSystem';

export interface Ruler {
  id: string;
  name: string;
  title: string;
  dynasty: string;
  age: number;
  reignStart: number;
  portrait?: string;
  traits: LeaderTrait[];
  skills: {
    military: number;
    administration: number;
    diplomacy: number;
  };
  popularity: number;
  health: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  heir?: {
    name: string;
    age: number;
    claim: 'strong' | 'average' | 'weak' | 'disputed';
  };
}

interface RulerPanelProps {
  isOpen: boolean;
  onClose: () => void;
  ruler: Ruler;
  currentYear: number;
  onAbdicate?: () => void;
  onEducateHeir?: () => void;
}

export const RulerPanel: React.FC<RulerPanelProps> = ({
  isOpen,
  onClose,
  ruler,
  currentYear,
  onAbdicate,
  onEducateHeir
}) => {
  if (!isOpen) return null;

  const reignLength = currentYear - ruler.reignStart;

  const healthColors = {
    excellent: 'text-green-600 bg-green-100',
    good: 'text-blue-600 bg-blue-100',
    fair: 'text-amber-600 bg-amber-100',
    poor: 'text-orange-600 bg-orange-100',
    critical: 'text-red-600 bg-red-100'
  };

  const claimColors = {
    strong: 'text-green-600',
    average: 'text-amber-600',
    weak: 'text-orange-600',
    disputed: 'text-red-600'
  };

  const getSkillRating = (value: number): string => {
    if (value >= 4) return 'Exceptional';
    if (value >= 3) return 'Good';
    if (value >= 2) return 'Average';
    return 'Poor';
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-md border-4 border-amber-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 bg-gradient-to-b from-amber-50 to-transparent">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-stone-200 flex items-center justify-center text-4xl border-4 border-amber-500">
              {ruler.portrait || '👑'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-800">{ruler.name}</h2>
              <p className="text-stone-600">{ruler.title}</p>
              <p className="text-sm text-stone-500">House of {ruler.dynasty}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="p-4 space-y-4">
          {/* Basic info */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white p-2 rounded border border-stone-200">
              <div className="text-lg font-bold text-stone-800">{ruler.age}</div>
              <div className="text-xs text-stone-500">Age</div>
            </div>
            <div className="bg-white p-2 rounded border border-stone-200">
              <div className="text-lg font-bold text-stone-800">{reignLength}</div>
              <div className="text-xs text-stone-500">Years Reigning</div>
            </div>
            <div className="bg-white p-2 rounded border border-stone-200">
              <div className="text-lg font-bold text-stone-800">{ruler.popularity}%</div>
              <div className="text-xs text-stone-500">Popularity</div>
            </div>
          </div>

          {/* Health */}
          <div className="flex items-center justify-between bg-white p-3 rounded border border-stone-200">
            <span className="font-medium text-stone-700">Health</span>
            <span className={`px-2 py-1 rounded text-sm font-semibold capitalize ${healthColors[ruler.health]}`}>
              {ruler.health}
            </span>
          </div>

          {/* Skills */}
          <div className="bg-white p-3 rounded border border-stone-200">
            <h3 className="font-semibold text-stone-800 mb-2">Ruler Skills</h3>
            <div className="space-y-2">
              {Object.entries(ruler.skills).map(([skill, value]) => (
                <div key={skill} className="flex items-center gap-2">
                  <span className="text-sm text-stone-600 capitalize w-24">{skill}</span>
                  <div className="flex-1 bg-stone-200 rounded h-2">
                    <div
                      className="bg-amber-500 h-2 rounded"
                      style={{ width: `${(value / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-stone-500 w-20 text-right">
                    {getSkillRating(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Traits */}
          {ruler.traits.length > 0 && (
            <div className="bg-white p-3 rounded border border-stone-200">
              <h3 className="font-semibold text-stone-800 mb-2">Traits</h3>
              <div className="flex flex-wrap gap-2">
                {ruler.traits.map(trait => (
                  <span
                    key={trait.id}
                    className={`px-2 py-1 rounded text-sm ${
                      trait.effects.statModifiers &&
                      Object.values(trait.effects.statModifiers).some(v => v < 0)
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                    title={trait.description}
                  >
                    {trait.icon} {trait.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Heir */}
          {ruler.heir && (
            <div className="bg-amber-50 p-3 rounded border border-amber-200">
              <h3 className="font-semibold text-amber-800 mb-2">Heir Apparent</h3>
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-stone-800">{ruler.heir.name}</div>
                  <div className="text-sm text-stone-600">Age {ruler.heir.age}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-stone-500">Claim Strength</div>
                  <div className={`font-semibold capitalize ${claimColors[ruler.heir.claim]}`}>
                    {ruler.heir.claim}
                  </div>
                </div>
              </div>
              {onEducateHeir && (
                <button
                  onClick={onEducateHeir}
                  className="w-full mt-2 py-1 bg-amber-600 text-white rounded text-sm font-semibold hover:bg-amber-700"
                >
                  Educate Heir
                </button>
              )}
            </div>
          )}

          {!ruler.heir && (
            <div className="bg-red-50 p-3 rounded border border-red-200 text-center">
              <span className="text-red-600 font-semibold">⚠️ No heir designated</span>
              <p className="text-xs text-red-500 mt-1">Succession crisis likely upon death</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-stone-300 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-stone-200 text-stone-700 rounded font-semibold hover:bg-stone-300"
          >
            Close
          </button>
          {onAbdicate && (
            <button
              onClick={onAbdicate}
              className="py-2 px-4 bg-red-600 text-white rounded font-semibold hover:bg-red-700"
            >
              Abdicate
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RulerPanel;
