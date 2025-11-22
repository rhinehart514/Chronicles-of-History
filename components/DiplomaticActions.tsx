import React, { useState } from 'react';

export type DiplomaticActionType =
  | 'declare_war'
  | 'offer_peace'
  | 'form_alliance'
  | 'break_alliance'
  | 'improve_relations'
  | 'insult'
  | 'royal_marriage'
  | 'guarantee'
  | 'embargo'
  | 'subsidize'
  | 'demand_tribute'
  | 'offer_vassalization';

export interface DiplomaticAction {
  id: DiplomaticActionType;
  name: string;
  icon: string;
  description: string;
  cost: number;
  cooldown: number;
  requirements: string[];
  effects: string[];
}

interface TargetNation {
  id: string;
  name: string;
  flag: string;
  relations: number;
  attitude: 'friendly' | 'neutral' | 'hostile' | 'rival';
  atWar: boolean;
  isAlly: boolean;
  isVassal: boolean;
}

interface DiplomaticActionsProps {
  isOpen: boolean;
  onClose: () => void;
  targetNation: TargetNation;
  playerDiplomacy: number;
  onAction: (action: DiplomaticActionType) => void;
}

const DIPLOMATIC_ACTIONS: DiplomaticAction[] = [
  {
    id: 'improve_relations',
    name: 'Improve Relations',
    icon: '🤝',
    description: 'Send diplomats to improve relations over time',
    cost: 25,
    cooldown: 0,
    requirements: ['Not at war'],
    effects: ['+1 Relations per month', 'Costs 25 gold/month']
  },
  {
    id: 'form_alliance',
    name: 'Form Alliance',
    icon: '⚔️',
    description: 'Propose a defensive alliance',
    cost: 50,
    cooldown: 12,
    requirements: ['Relations > 100', 'Not rivals', 'Compatible religions'],
    effects: ['Mutual defense pact', 'Call to arms obligations']
  },
  {
    id: 'break_alliance',
    name: 'Break Alliance',
    icon: '💔',
    description: 'End your alliance with this nation',
    cost: 0,
    cooldown: 60,
    requirements: ['Must be allied'],
    effects: ['-50 Relations', '-1 Stability', 'Cannot re-ally for 5 years']
  },
  {
    id: 'royal_marriage',
    name: 'Royal Marriage',
    icon: '💒',
    description: 'Arrange a marriage between royal families',
    cost: 100,
    cooldown: 12,
    requirements: ['Relations > 50', 'Both monarchies', 'Eligible heirs'],
    effects: ['+25 Relations', 'Succession claims', 'Alliance bonus']
  },
  {
    id: 'guarantee',
    name: 'Guarantee Independence',
    icon: '🛡️',
    description: 'Promise to defend this nation from attackers',
    cost: 0,
    cooldown: 12,
    requirements: ['Weaker nation', 'Not rivals'],
    effects: ['Must defend if attacked', '+50 Relations', 'Prestige cost if broken']
  },
  {
    id: 'subsidize',
    name: 'Subsidize',
    icon: '💰',
    description: 'Send monthly payments to support this nation',
    cost: 100,
    cooldown: 0,
    requirements: ['Not at war with target'],
    effects: ['+2 Relations per month', 'Target gains 100 gold/month']
  },
  {
    id: 'embargo',
    name: 'Embargo',
    icon: '🚫',
    description: 'Cut off trade with this nation',
    cost: 0,
    cooldown: 12,
    requirements: ['Not allied'],
    effects: ['-50 Relations', 'Target loses trade income', 'Your merchants affected']
  },
  {
    id: 'insult',
    name: 'Insult',
    icon: '😤',
    description: 'Publicly insult this nation',
    cost: 0,
    cooldown: 12,
    requirements: [],
    effects: ['-50 Relations', '+5 Prestige', 'May cause rivalry']
  },
  {
    id: 'declare_war',
    name: 'Declare War',
    icon: '⚔️',
    description: 'Declare war on this nation',
    cost: 0,
    cooldown: 60,
    requirements: ['Not allied', 'Casus belli for no penalty'],
    effects: ['Begin war', 'Allies may join', 'Stability cost without CB']
  },
  {
    id: 'offer_peace',
    name: 'Offer Peace',
    icon: '🕊️',
    description: 'Send a peace offer to end the war',
    cost: 0,
    cooldown: 0,
    requirements: ['Must be at war'],
    effects: ['End war if accepted', 'Terms based on war score']
  },
  {
    id: 'demand_tribute',
    name: 'Demand Tribute',
    icon: '👑',
    description: 'Demand this nation pay you tribute',
    cost: 0,
    cooldown: 24,
    requirements: ['Much stronger', 'Relations < 0'],
    effects: ['Yearly gold payment', '-100 Relations', 'May cause war']
  },
  {
    id: 'offer_vassalization',
    name: 'Offer Vassalization',
    icon: '🏰',
    description: 'Offer to become their overlord',
    cost: 0,
    cooldown: 60,
    requirements: ['Much stronger', 'High relations or conquered'],
    effects: ['They become your vassal', 'Tribute and levies', 'Diplomatic annexation']
  }
];

export const DiplomaticActions: React.FC<DiplomaticActionsProps> = ({
  isOpen,
  onClose,
  targetNation,
  playerDiplomacy,
  onAction
}) => {
  const [selectedAction, setSelectedAction] = useState<DiplomaticAction | null>(null);
  const [confirmAction, setConfirmAction] = useState(false);

  if (!isOpen) return null;

  const getAttitudeColor = (attitude: TargetNation['attitude']) => {
    switch (attitude) {
      case 'friendly': return 'text-green-600';
      case 'neutral': return 'text-yellow-600';
      case 'hostile': return 'text-orange-600';
      case 'rival': return 'text-red-600';
    }
  };

  const canPerformAction = (action: DiplomaticAction): boolean => {
    // Simplified checks
    if (action.id === 'declare_war' && (targetNation.atWar || targetNation.isAlly)) return false;
    if (action.id === 'offer_peace' && !targetNation.atWar) return false;
    if (action.id === 'break_alliance' && !targetNation.isAlly) return false;
    if (action.id === 'form_alliance' && (targetNation.isAlly || targetNation.relations < 100)) return false;
    return true;
  };

  const handleConfirm = () => {
    if (selectedAction) {
      onAction(selectedAction.id);
      setConfirmAction(false);
      setSelectedAction(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{targetNation.flag}</span>
            <div>
              <h2 className="text-xl font-bold text-stone-800">
                Diplomacy with {targetNation.name}
              </h2>
              <div className="flex items-center gap-2 text-sm">
                <span className={getAttitudeColor(targetNation.attitude)}>
                  {targetNation.attitude.charAt(0).toUpperCase() + targetNation.attitude.slice(1)}
                </span>
                <span className="text-stone-500">•</span>
                <span className={targetNation.relations >= 0 ? 'text-green-600' : 'text-red-600'}>
                  Relations: {targetNation.relations > 0 ? '+' : ''}{targetNation.relations}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Status badges */}
        <div className="p-3 border-b border-stone-200 flex gap-2">
          {targetNation.atWar && (
            <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
              ⚔️ At War
            </span>
          )}
          {targetNation.isAlly && (
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
              🤝 Allied
            </span>
          )}
          {targetNation.isVassal && (
            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
              👑 Vassal
            </span>
          )}
        </div>

        {/* Actions grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-3">
            {DIPLOMATIC_ACTIONS.map(action => {
              const canDo = canPerformAction(action);
              return (
                <button
                  key={action.id}
                  onClick={() => canDo && setSelectedAction(action)}
                  disabled={!canDo}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    canDo
                      ? 'border-stone-300 hover:border-amber-500 hover:bg-amber-50'
                      : 'border-stone-200 bg-stone-100 opacity-50 cursor-not-allowed'
                  } ${selectedAction?.id === action.id ? 'border-amber-500 bg-amber-50' : ''}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{action.icon}</span>
                    <span className="font-semibold text-stone-800 text-sm">{action.name}</span>
                  </div>
                  <p className="text-xs text-stone-600">{action.description}</p>
                  {action.cost > 0 && (
                    <div className="mt-1 text-xs text-amber-600">
                      Cost: {action.cost} 💰
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected action details */}
        {selectedAction && (
          <div className="p-4 border-t border-stone-300 bg-stone-100">
            <h3 className="font-bold text-stone-800 mb-2">
              {selectedAction.icon} {selectedAction.name}
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <h4 className="text-xs font-semibold text-stone-500 mb-1">Requirements</h4>
                <ul className="text-xs text-stone-600 space-y-1">
                  {selectedAction.requirements.map((req, i) => (
                    <li key={i}>• {req}</li>
                  ))}
                  {selectedAction.requirements.length === 0 && (
                    <li className="text-green-600">• None</li>
                  )}
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-stone-500 mb-1">Effects</h4>
                <ul className="text-xs text-stone-600 space-y-1">
                  {selectedAction.effects.map((effect, i) => (
                    <li key={i}>• {effect}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedAction(null)}
                className="px-4 py-2 rounded bg-stone-300 text-stone-700 hover:bg-stone-400"
              >
                Cancel
              </button>
              <button
                onClick={() => setConfirmAction(true)}
                className="px-4 py-2 rounded bg-amber-600 text-white hover:bg-amber-700"
              >
                Execute
              </button>
            </div>
          </div>
        )}

        {/* Confirmation dialog */}
        {confirmAction && selectedAction && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-sm">
              <h3 className="font-bold text-lg mb-2">Confirm Action</h3>
              <p className="text-stone-600 mb-4">
                Are you sure you want to {selectedAction.name.toLowerCase()} with {targetNation.name}?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setConfirmAction(false)}
                  className="px-4 py-2 rounded bg-stone-200 hover:bg-stone-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiplomaticActions;
