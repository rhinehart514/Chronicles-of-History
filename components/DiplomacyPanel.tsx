import React, { useState } from 'react';
import { Globe, Handshake, Swords, TrendingUp, TrendingDown, Shield, Crown } from 'lucide-react';
import { Diplomacy, DiplomaticRelation, Nation } from '../types';
import { getStanceColor, getOpinionDescription } from '../data/historicalDiplomacy';

interface DiplomacyPanelProps {
  diplomacy?: Diplomacy;
  nations: Nation[];
  nationName: string;
}

const DiplomacyPanel: React.FC<DiplomacyPanelProps> = ({ diplomacy, nations, nationName }) => {
  const [selectedRelation, setSelectedRelation] = useState<string | null>(null);

  if (!diplomacy) {
    return (
      <div className="bg-[#f4efe4] rounded-lg shadow-xl p-4 font-serif">
        <h3 className="text-lg font-bold text-stone-800 mb-2">Diplomacy</h3>
        <p className="text-stone-600 text-sm italic">Diplomatic information not yet available.</p>
      </div>
    );
  }

  const getRelationIcon = (relation: DiplomaticRelation) => {
    if (relation.stance === 'AT_WAR') return <Swords size={14} className="text-red-600" />;
    if (relation.relations.includes('ALLIANCE')) return <Shield size={14} className="text-green-600" />;
    if (relation.relations.includes('ROYAL_MARRIAGE')) return <Crown size={14} className="text-purple-600" />;
    if (relation.relations.includes('RIVALRY')) return <Swords size={14} className="text-orange-500" />;
    return <Handshake size={14} className="text-stone-400" />;
  };

  const getNationName = (nationId: string): string => {
    const nation = nations.find(n => n.id === nationId);
    return nation?.name || nationId;
  };

  const getRelationTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      'ALLIANCE': 'Alliance',
      'DEFENSIVE_PACT': 'Defensive Pact',
      'NON_AGGRESSION': 'Non-Aggression',
      'TRADE_AGREEMENT': 'Trade Agreement',
      'RIVALRY': 'Rivalry',
      'WAR': 'At War',
      'VASSAL': 'Vassal',
      'OVERLORD': 'Overlord',
      'ROYAL_MARRIAGE': 'Royal Marriage',
      'GUARANTEE': 'Guarantee'
    };
    return labels[type] || type;
  };

  const selectedDetails = selectedRelation
    ? diplomacy.relations.find(r => r.targetNationId === selectedRelation)
    : null;

  return (
    <div className="bg-[#f4efe4] rounded-lg shadow-xl font-serif overflow-hidden">
      {/* Header */}
      <div className="bg-stone-700 text-amber-100 px-4 py-2 flex items-center gap-2">
        <Globe size={18} />
        <h3 className="font-bold">Diplomatic Relations</h3>
      </div>

      <div className="p-4 max-h-96 overflow-y-auto">
        {/* Reputation & AE */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-stone-100 rounded p-2 text-center">
            <div className="text-xs text-stone-500">Reputation</div>
            <div className={`font-bold ${diplomacy.reputation >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {diplomacy.reputation > 0 ? '+' : ''}{diplomacy.reputation}
            </div>
          </div>
          <div className="bg-stone-100 rounded p-2 text-center">
            <div className="text-xs text-stone-500">Aggr. Expansion</div>
            <div className={`font-bold ${diplomacy.aggressiveExpansion > 50 ? 'text-red-600' : 'text-stone-700'}`}>
              {diplomacy.aggressiveExpansion}%
            </div>
          </div>
        </div>

        {/* Relations List */}
        <div className="space-y-2">
          {diplomacy.relations.map(relation => (
            <div
              key={relation.targetNationId}
              className={`bg-stone-100 rounded p-2 cursor-pointer hover:bg-stone-200 transition-colors
                ${selectedRelation === relation.targetNationId ? 'ring-2 ring-amber-500' : ''}`}
              onClick={() => setSelectedRelation(
                selectedRelation === relation.targetNationId ? null : relation.targetNationId
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getRelationIcon(relation)}
                  <span className="font-medium text-sm">{getNationName(relation.targetNationId)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium ${getStanceColor(relation.stance)}`}>
                    {relation.stance.replace('_', ' ')}
                  </span>
                  <span className={`text-xs ${relation.opinion >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {relation.opinion > 0 ? '+' : ''}{relation.opinion}
                  </span>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedRelation === relation.targetNationId && (
                <div className="mt-2 pt-2 border-t border-stone-300 text-xs">
                  {/* Treaties/Relations */}
                  {relation.relations.length > 0 && (
                    <div className="mb-2">
                      <span className="text-stone-500">Relations: </span>
                      {relation.relations.map(r => getRelationTypeLabel(r)).join(', ')}
                    </div>
                  )}

                  {/* Historical Context */}
                  {relation.historicalContext && (
                    <div className="mb-2 italic text-stone-600">
                      "{relation.historicalContext}"
                    </div>
                  )}

                  {/* Opinion Modifiers */}
                  {relation.modifiers.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-stone-500 font-medium">Opinion Modifiers:</div>
                      {relation.modifiers.map((mod, i) => (
                        <div key={i} className="flex justify-between pl-2">
                          <span>{mod.name}</span>
                          <span className={mod.value >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {mod.value > 0 ? '+' : ''}{mod.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Casus Belli */}
        {diplomacy.availableCasusBelli.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-bold text-stone-700 mb-2">Available Casus Belli</h4>
            {diplomacy.availableCasusBelli.map((cb, i) => (
              <div key={i} className="bg-red-50 rounded p-2 text-xs mb-1">
                <div className="font-medium text-red-800">{cb.name}</div>
                <div className="text-red-600">{cb.wargoal}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiplomacyPanel;
