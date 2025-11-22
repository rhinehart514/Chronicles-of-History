import React, { useState } from 'react';

export interface Policy {
  id: string;
  name: string;
  icon: string;
  category: PolicyCategory;
  description: string;
  effects: PolicyEffect[];
  mutuallyExclusive?: string[];
  cost?: number;
}

export type PolicyCategory = 'military' | 'economic' | 'diplomatic' | 'social' | 'religious';

export interface PolicyEffect {
  stat: string;
  value: number;
  description: string;
}

interface PolicyPanelProps {
  isOpen: boolean;
  onClose: () => void;
  availablePolicies: Policy[];
  activePolicies: string[];
  maxPolicies: number;
  treasury: number;
  onEnact: (policyId: string) => void;
  onRevoke: (policyId: string) => void;
}

export const DEFAULT_POLICIES: Policy[] = [
  // Military policies
  {
    id: 'conscription',
    name: 'Conscription',
    icon: '⚔️',
    category: 'military',
    description: 'Mandatory military service for all able-bodied citizens',
    effects: [
      { stat: 'manpower', value: 25, description: '+25% Manpower' },
      { stat: 'unrest', value: 2, description: '+2 Unrest' }
    ],
    mutuallyExclusive: ['professional_army_policy']
  },
  {
    id: 'professional_army_policy',
    name: 'Professional Army',
    icon: '🎖️',
    category: 'military',
    description: 'Well-trained career soldiers',
    effects: [
      { stat: 'discipline', value: 10, description: '+10% Discipline' },
      { stat: 'army_maintenance', value: 20, description: '+20% Army maintenance' }
    ],
    mutuallyExclusive: ['conscription']
  },
  {
    id: 'defensive_focus',
    name: 'Defensive Doctrine',
    icon: '🛡️',
    category: 'military',
    description: 'Focus on territorial defense',
    effects: [
      { stat: 'fort_defense', value: 20, description: '+20% Fort defense' },
      { stat: 'army_morale', value: 10, description: '+10% Morale when defending' }
    ]
  },

  // Economic policies
  {
    id: 'free_trade',
    name: 'Free Trade',
    icon: '🚢',
    category: 'economic',
    description: 'Minimal tariffs and trade restrictions',
    effects: [
      { stat: 'trade_income', value: 20, description: '+20% Trade income' },
      { stat: 'production', value: -10, description: '-10% Production' }
    ],
    mutuallyExclusive: ['mercantilism']
  },
  {
    id: 'mercantilism',
    name: 'Mercantilism',
    icon: '💰',
    category: 'economic',
    description: 'Protect domestic industry with tariffs',
    effects: [
      { stat: 'production', value: 20, description: '+20% Production' },
      { stat: 'trade_income', value: -10, description: '-10% Trade income' }
    ],
    mutuallyExclusive: ['free_trade']
  },
  {
    id: 'state_banking',
    name: 'State Banking',
    icon: '🏦',
    category: 'economic',
    description: 'Government-controlled central bank',
    effects: [
      { stat: 'loan_interest', value: -1, description: '-1% Loan interest' },
      { stat: 'inflation', value: -0.1, description: '-0.1 Inflation' }
    ],
    cost: 500
  },

  // Diplomatic policies
  {
    id: 'expansionism',
    name: 'Expansionism',
    icon: '🌍',
    category: 'diplomatic',
    description: 'Aggressive territorial expansion',
    effects: [
      { stat: 'aggressive_expansion', value: -25, description: '-25% AE impact' },
      { stat: 'diplomatic_reputation', value: -1, description: '-1 Diplomatic reputation' }
    ],
    mutuallyExclusive: ['pacifism']
  },
  {
    id: 'pacifism',
    name: 'Peaceful Diplomacy',
    icon: '🕊️',
    category: 'diplomatic',
    description: 'Avoid war when possible',
    effects: [
      { stat: 'diplomatic_reputation', value: 2, description: '+2 Diplomatic reputation' },
      { stat: 'war_exhaustion', value: 0.1, description: '+10% War exhaustion' }
    ],
    mutuallyExclusive: ['expansionism']
  },

  // Social policies
  {
    id: 'education_reform',
    name: 'Public Education',
    icon: '📚',
    category: 'social',
    description: 'State-funded schools for all',
    effects: [
      { stat: 'innovation', value: 0.5, description: '+0.5 Innovation' },
      { stat: 'literacy', value: 1, description: '+1% Literacy/year' }
    ],
    cost: 200
  },
  {
    id: 'serfdom',
    name: 'Serfdom',
    icon: '⛓️',
    category: 'social',
    description: 'Tie peasants to the land',
    effects: [
      { stat: 'production', value: 15, description: '+15% Production' },
      { stat: 'unrest', value: 3, description: '+3 Unrest' },
      { stat: 'innovation', value: -0.5, description: '-0.5 Innovation' }
    ],
    mutuallyExclusive: ['free_peasants']
  },
  {
    id: 'free_peasants',
    name: 'Free Peasantry',
    icon: '🌾',
    category: 'social',
    description: 'Allow free movement and ownership',
    effects: [
      { stat: 'unrest', value: -2, description: '-2 Unrest' },
      { stat: 'manpower', value: 10, description: '+10% Manpower' }
    ],
    mutuallyExclusive: ['serfdom']
  },

  // Religious policies
  {
    id: 'religious_unity',
    name: 'Religious Unity',
    icon: '⛪',
    category: 'religious',
    description: 'Enforce state religion',
    effects: [
      { stat: 'stability', value: 0.5, description: '+0.5 Stability' },
      { stat: 'tolerance', value: -2, description: '-2 Tolerance' }
    ],
    mutuallyExclusive: ['religious_tolerance']
  },
  {
    id: 'religious_tolerance',
    name: 'Religious Tolerance',
    icon: '☮️',
    category: 'religious',
    description: 'Allow freedom of worship',
    effects: [
      { stat: 'tolerance', value: 2, description: '+2 Tolerance' },
      { stat: 'unrest', value: -1, description: '-1 Unrest from religion' }
    ],
    mutuallyExclusive: ['religious_unity']
  }
];

export const PolicyPanel: React.FC<PolicyPanelProps> = ({
  isOpen,
  onClose,
  availablePolicies,
  activePolicies,
  maxPolicies,
  treasury,
  onEnact,
  onRevoke
}) => {
  const [selectedCategory, setSelectedCategory] = useState<PolicyCategory | 'all'>('all');

  if (!isOpen) return null;

  const categories: PolicyCategory[] = ['military', 'economic', 'diplomatic', 'social', 'religious'];

  const filteredPolicies = selectedCategory === 'all'
    ? availablePolicies
    : availablePolicies.filter(p => p.category === selectedCategory);

  const getCategoryIcon = (cat: PolicyCategory) => {
    switch (cat) {
      case 'military': return '⚔️';
      case 'economic': return '💰';
      case 'diplomatic': return '🤝';
      case 'social': return '👥';
      case 'religious': return '⛪';
    }
  };

  const isBlocked = (policy: Policy) => {
    if (!policy.mutuallyExclusive) return false;
    return policy.mutuallyExclusive.some(id => activePolicies.includes(id));
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-stone-800">📜 National Policies</h2>
            <div className="text-sm text-stone-500">
              {activePolicies.length}/{maxPolicies} policies active
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Category filter */}
        <div className="p-2 border-b border-stone-200 flex gap-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded text-sm ${
              selectedCategory === 'all'
                ? 'bg-amber-600 text-white'
                : 'bg-stone-200 text-stone-700'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded text-sm ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-200 text-stone-700'
              }`}
            >
              {getCategoryIcon(cat)}
            </button>
          ))}
        </div>

        {/* Policies */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {filteredPolicies.map(policy => {
              const isActive = activePolicies.includes(policy.id);
              const blocked = isBlocked(policy);
              const canAfford = !policy.cost || treasury >= policy.cost;
              const canEnact = !isActive && !blocked && canAfford && activePolicies.length < maxPolicies;

              return (
                <div
                  key={policy.id}
                  className={`rounded-lg p-4 border-2 ${
                    isActive
                      ? 'border-green-500 bg-green-50'
                      : blocked
                      ? 'border-red-200 bg-red-50 opacity-60'
                      : 'border-stone-200 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{policy.icon}</span>
                      <div>
                        <h4 className="font-semibold text-stone-800">{policy.name}</h4>
                        <span className="text-xs text-stone-500">{policy.category}</span>
                      </div>
                    </div>
                    {isActive ? (
                      <button
                        onClick={() => onRevoke(policy.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                      >
                        Revoke
                      </button>
                    ) : (
                      <button
                        onClick={() => canEnact && onEnact(policy.id)}
                        disabled={!canEnact}
                        className={`px-3 py-1 rounded text-sm ${
                          canEnact
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                        }`}
                      >
                        Enact {policy.cost && `(${policy.cost}💰)`}
                      </button>
                    )}
                  </div>

                  <p className="text-sm text-stone-600 mb-2">{policy.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {policy.effects.map((effect, i) => (
                      <span
                        key={i}
                        className={`px-2 py-1 rounded text-xs ${
                          effect.value > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {effect.description}
                      </span>
                    ))}
                  </div>

                  {blocked && (
                    <div className="mt-2 text-xs text-red-600">
                      ⚠️ Blocked by active policy
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyPanel;
