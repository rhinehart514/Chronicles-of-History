import React, { useState } from 'react';
import { Estate } from '../data/estatesSystem';

interface EstatesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  estates: Estate[];
  activePrivileges: Record<string, string[]>;
  crownlandPercent: number;
  onGrantPrivilege: (estateId: string, privilegeId: string) => void;
  onRevokePrivilege: (estateId: string, privilegeId: string) => void;
  onInteract: (estateId: string, interactionId: string) => void;
}

export const EstatesPanel: React.FC<EstatesPanelProps> = ({
  isOpen,
  onClose,
  estates,
  activePrivileges,
  crownlandPercent,
  onGrantPrivilege,
  onRevokePrivilege,
  onInteract
}) => {
  const [selectedEstate, setSelectedEstate] = useState<string | null>(null);

  if (!isOpen) return null;

  const selected = estates.find(e => e.id === selectedEstate);
  const selectedPrivileges = activePrivileges[selectedEstate || ''] || [];

  const getLoyaltyColor = (loyalty: number) => {
    if (loyalty >= 60) return 'text-green-600';
    if (loyalty >= 40) return 'text-amber-600';
    return 'text-red-600';
  };

  const getInfluenceColor = (influence: number) => {
    if (influence >= 80) return 'text-red-600';
    if (influence >= 60) return 'text-amber-600';
    return 'text-stone-800';
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-stone-800">🏛️ Estates</h2>
            <div className="text-sm text-stone-500">
              Manage relations with powerful groups
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Crownland */}
        <div className="p-3 border-b border-stone-200 bg-stone-100">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-stone-600">Crown Land</span>
            <span className="font-bold">{crownlandPercent}%</span>
          </div>
          <div className="w-full bg-stone-200 rounded-full h-2">
            <div
              className="bg-amber-500 h-2 rounded-full"
              style={{ width: `${crownlandPercent}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Estate list */}
          <div className="w-1/2 border-r border-stone-200 overflow-y-auto p-3">
            <div className="space-y-3">
              {estates.map(estate => (
                <button
                  key={estate.id}
                  onClick={() => setSelectedEstate(estate.id)}
                  className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                    selectedEstate === estate.id
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-stone-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{estate.icon}</span>
                    <div>
                      <div className="font-semibold text-stone-800">{estate.name}</div>
                      <div className="text-xs text-stone-500">
                        {activePrivileges[estate.id]?.length || 0} privileges
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-stone-500">Loyalty: </span>
                      <span className={getLoyaltyColor(estate.loyalty)}>
                        {estate.loyalty}%
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-500">Influence: </span>
                      <span className={getInfluenceColor(estate.influence)}>
                        {estate.influence}%
                      </span>
                    </div>
                  </div>

                  {/* Warning indicators */}
                  {estate.influence >= 80 && (
                    <div className="mt-2 text-xs text-red-600">
                      ⚠️ Influence too high!
                    </div>
                  )}
                  {estate.loyalty <= 30 && (
                    <div className="mt-2 text-xs text-red-600">
                      ⚠️ Loyalty dangerously low!
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Selected estate details */}
          <div className="w-1/2 p-4 overflow-y-auto">
            {selected ? (
              <>
                <div className="text-center mb-4">
                  <span className="text-4xl">{selected.icon}</span>
                  <h3 className="font-bold text-stone-800 mt-2">{selected.name}</h3>
                  <p className="text-sm text-stone-600">{selected.description}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-stone-100 rounded-lg text-center">
                    <div className="text-xs text-stone-500">Loyalty</div>
                    <div className={`text-xl font-bold ${getLoyaltyColor(selected.loyalty)}`}>
                      {selected.loyalty}%
                    </div>
                  </div>
                  <div className="p-3 bg-stone-100 rounded-lg text-center">
                    <div className="text-xs text-stone-500">Influence</div>
                    <div className={`text-xl font-bold ${getInfluenceColor(selected.influence)}`}>
                      {selected.influence}%
                    </div>
                  </div>
                </div>

                {/* Interactions */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-stone-600 mb-2">Interactions</h4>
                  <div className="space-y-2">
                    {selected.interactions.map(interaction => (
                      <button
                        key={interaction.id}
                        onClick={() => onInteract(selected.id, interaction.id)}
                        className="w-full p-2 bg-white rounded border border-stone-200 text-left hover:bg-stone-50"
                      >
                        <div className="flex items-center gap-2">
                          <span>{interaction.icon}</span>
                          <span className="text-sm font-medium">{interaction.name}</span>
                        </div>
                        <div className="text-xs mt-1">
                          <span className={interaction.loyaltyGain >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {interaction.loyaltyGain > 0 ? '+' : ''}{interaction.loyaltyGain} loyalty
                          </span>
                          {' • '}
                          <span className={interaction.influenceGain >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {interaction.influenceGain > 0 ? '+' : ''}{interaction.influenceGain} influence
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Privileges */}
                <div>
                  <h4 className="text-sm font-semibold text-stone-600 mb-2">Privileges</h4>
                  <div className="space-y-2">
                    {selected.privileges.map(privilege => {
                      const isActive = selectedPrivileges.includes(privilege.id);
                      return (
                        <div
                          key={privilege.id}
                          className={`p-3 rounded border ${
                            isActive ? 'border-green-300 bg-green-50' : 'border-stone-200 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span>{privilege.icon}</span>
                              <span className="text-sm font-medium">{privilege.name}</span>
                            </div>
                            <button
                              onClick={() => isActive
                                ? onRevokePrivilege(selected.id, privilege.id)
                                : onGrantPrivilege(selected.id, privilege.id)
                              }
                              className={`px-2 py-1 rounded text-xs ${
                                isActive
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              {isActive ? 'Revoke' : 'Grant'}
                            </button>
                          </div>
                          <p className="text-xs text-stone-600 mb-2">{privilege.description}</p>
                          <div className="space-y-1">
                            {privilege.effects.map((effect, i) => (
                              <div
                                key={i}
                                className={`text-xs ${
                                  effect.value > 0 ? 'text-green-600' : 'text-red-600'
                                }`}
                              >
                                {effect.description}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-center text-stone-500 py-8">
                Select an estate to view details
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstatesPanel;
