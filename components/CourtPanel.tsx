import React, { useState } from 'react';
import {
  Crown, Shield, Coins, Ship, Eye, Globe, Baby,
  ChevronDown, ChevronRight, Star, AlertTriangle, Heart
} from 'lucide-react';
import { Court, CourtMember, Leader, LeaderTrait, CourtRole, GovernmentStructure } from '../types';

interface CourtPanelProps {
  court?: Court;
  government?: GovernmentStructure;
  nationName: string;
  currentYear: number;
}

const CourtPanel: React.FC<CourtPanelProps> = ({ court, government, nationName, currentYear }) => {
  const [expandedMember, setExpandedMember] = useState<string | null>(null);

  if (!court) {
    return (
      <div className="bg-[#f4efe4] border-2 border-stone-400 rounded-lg shadow-lg p-4">
        <p className="text-stone-500 italic">Court data not yet available...</p>
      </div>
    );
  }

  // Get adaptive role name based on government type
  const getAdaptiveRoleName = (role: CourtRole): string => {
    if (government?.roleNames) {
      return government.roleNames[role] || role;
    }
    // Fallback names
    const fallbacks: Record<CourtRole, string> = {
      CHANCELLOR: 'Chancellor',
      TREASURER: 'Treasurer',
      GENERAL: 'General',
      ADMIRAL: 'Admiral',
      SPYMASTER: 'Spymaster',
      DIPLOMAT: 'Diplomat',
      HEIR: 'Heir'
    };
    return fallbacks[role];
  };

  // Get cabinet title based on government type
  const getCabinetTitle = (): string => {
    return government?.cabinetTitle || 'Royal Court';
  };

  const getRoleIcon = (role: CourtRole) => {
    switch (role) {
      case 'CHANCELLOR': return <Crown size={14} className="text-purple-600" />;
      case 'TREASURER': return <Coins size={14} className="text-yellow-600" />;
      case 'GENERAL': return <Shield size={14} className="text-red-600" />;
      case 'ADMIRAL': return <Ship size={14} className="text-blue-600" />;
      case 'SPYMASTER': return <Eye size={14} className="text-gray-600" />;
      case 'DIPLOMAT': return <Globe size={14} className="text-green-600" />;
      case 'HEIR': return <Baby size={14} className="text-amber-600" />;
      default: return <Star size={14} />;
    }
  };

  // Use adaptive role name (removed duplicate getRoleName)

  const getTraitDisplay = (trait: LeaderTrait) => {
    const traitMap: Record<LeaderTrait, { label: string; color: string }> = {
      BRILLIANT_STRATEGIST: { label: 'Brilliant Strategist', color: 'bg-red-100 text-red-700' },
      ENLIGHTENED_DESPOT: { label: 'Enlightened Despot', color: 'bg-purple-100 text-purple-700' },
      PATRON_OF_ARTS: { label: 'Patron of Arts', color: 'bg-pink-100 text-pink-700' },
      MASTER_DIPLOMAT: { label: 'Master Diplomat', color: 'bg-green-100 text-green-700' },
      RUTHLESS: { label: 'Ruthless', color: 'bg-gray-100 text-gray-700' },
      PIOUS: { label: 'Pious', color: 'bg-amber-100 text-amber-700' },
      MERCHANT_PRINCE: { label: 'Merchant Prince', color: 'bg-yellow-100 text-yellow-700' },
      REFORMER: { label: 'Reformer', color: 'bg-blue-100 text-blue-700' },
      TRADITIONALIST: { label: 'Traditionalist', color: 'bg-stone-100 text-stone-700' },
      WARRIOR_KING: { label: 'Warrior King', color: 'bg-red-100 text-red-700' },
      WEAK_WILLED: { label: 'Weak-Willed', color: 'bg-gray-100 text-gray-500' },
      PARANOID: { label: 'Paranoid', color: 'bg-orange-100 text-orange-700' },
      CHARISMATIC: { label: 'Charismatic', color: 'bg-rose-100 text-rose-700' },
      FRUGAL: { label: 'Frugal', color: 'bg-emerald-100 text-emerald-700' },
      EXTRAVAGANT: { label: 'Extravagant', color: 'bg-violet-100 text-violet-700' }
    };
    return traitMap[trait] || { label: trait, color: 'bg-gray-100 text-gray-600' };
  };

  const getCompetenceColor = (competence: number) => {
    if (competence >= 4) return 'text-green-600';
    if (competence >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getLoyaltyColor = (loyalty: number) => {
    if (loyalty >= 70) return 'bg-green-500';
    if (loyalty >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getAge = (birthYear: number) => currentYear - birthYear;

  const renderLeader = (leader: Leader) => (
    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-lg border-2 border-amber-300 mb-4">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center text-2xl">
          👑
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-amber-900">
            {leader.name}
            {leader.epithet && <span className="text-amber-600 text-sm ml-1">"{leader.epithet}"</span>}
          </h3>
          <p className="text-sm text-amber-700">{leader.title}</p>
          <p className="text-xs text-stone-500 mt-1">
            Age {getAge(leader.birthYear)} • Reigning since {leader.reignStart}
          </p>
        </div>
      </div>

      {/* Personality */}
      <div className="mt-3">
        <p className="text-xs font-medium text-stone-600 mb-1">Personality</p>
        <div className="flex flex-wrap gap-1 mb-2">
          {leader.personality.traits.map((trait, i) => {
            const { label, color } = getTraitDisplay(trait);
            return (
              <span key={i} className={`px-2 py-0.5 rounded text-xs ${color}`}>
                {label}
              </span>
            );
          })}
        </div>
        <div className="flex gap-2 text-xs">
          <span className="text-stone-500">Temperament:</span>
          <span className="font-medium">{leader.personality.temperament}</span>
        </div>
        <div className="flex gap-2 text-xs mt-1">
          <span className="text-stone-500">Priorities:</span>
          <span className="font-medium">{leader.personality.priorities.join(', ')}</span>
        </div>
      </div>

      {/* Historical Note */}
      <p className="text-xs text-stone-600 mt-3 italic border-t border-amber-200 pt-2">
        {leader.historicalNote}
      </p>
    </div>
  );

  const renderCourtMember = (member: CourtMember) => {
    const isExpanded = expandedMember === member.id;
    const age = getAge(member.birthYear);
    const isDying = member.deathYear && member.deathYear <= currentYear + 5;

    return (
      <div key={member.id} className="bg-stone-50 rounded border">
        <button
          className="w-full p-2 flex items-center gap-2 text-left"
          onClick={() => setExpandedMember(isExpanded ? null : member.id)}
        >
          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          {getRoleIcon(member.role)}
          <div className="flex-1">
            <span className="font-medium text-sm">{member.name}</span>
            {isDying && (
              <AlertTriangle size={12} className="inline ml-1 text-orange-500" />
            )}
          </div>
          <span className="text-xs text-stone-500">{getAdaptiveRoleName(member.role)}</span>
        </button>

        {isExpanded && (
          <div className="px-3 pb-3 border-t">
            <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
              <div>
                <span className="text-stone-500">Age: </span>
                <span>{age}</span>
              </div>
              <div>
                <span className="text-stone-500">Competence: </span>
                <span className={`font-medium ${getCompetenceColor(member.competence)}`}>
                  {member.competence}/5
                </span>
              </div>
            </div>

            {/* Loyalty Bar */}
            <div className="mt-2">
              <div className="flex justify-between text-xs text-stone-500 mb-1">
                <span className="flex items-center gap-1">
                  <Heart size={10} /> Loyalty
                </span>
                <span>{member.loyalty}%</span>
              </div>
              <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${getLoyaltyColor(member.loyalty)}`}
                  style={{ width: `${member.loyalty}%` }}
                />
              </div>
            </div>

            {/* Traits */}
            {member.traits.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-stone-500 mb-1">Traits</p>
                <div className="flex flex-wrap gap-1">
                  {member.traits.map((trait, i) => {
                    const { label, color } = getTraitDisplay(trait);
                    return (
                      <span key={i} className={`px-1.5 py-0.5 rounded text-xs ${color}`}>
                        {label}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Faction */}
            {member.faction && (
              <p className="text-xs mt-2">
                <span className="text-stone-500">Faction: </span>
                <span className="font-medium">{member.faction}</span>
              </p>
            )}

            {/* Historical Note */}
            <p className="text-xs text-stone-500 mt-2 italic">
              {member.historicalNote}
            </p>
          </div>
        )}
      </div>
    );
  };

  // Sort court members by role importance
  const sortedMembers = [...court.members].sort((a, b) => {
    const order: CourtRole[] = ['HEIR', 'CHANCELLOR', 'GENERAL', 'ADMIRAL', 'TREASURER', 'DIPLOMAT', 'SPYMASTER'];
    return order.indexOf(a.role) - order.indexOf(b.role);
  });

  return (
    <div className="bg-[#f4efe4] border-2 border-stone-400 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-stone-700 text-amber-100 px-4 py-2">
        <h3 className="font-bold text-lg">The Court of {nationName}</h3>
      </div>

      <div className="p-4 max-h-96 overflow-y-auto">
        {/* Leader Section */}
        {renderLeader(court.leader)}

        {/* Succession Info */}
        {court.succession && (
          <div className={`p-3 rounded border mb-4 ${
            court.succession.crisisRisk > 50
              ? 'bg-red-50 border-red-200'
              : court.succession.crisisRisk > 30
                ? 'bg-yellow-50 border-yellow-200'
                : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex justify-between items-center">
              <span className="font-medium text-sm flex items-center gap-1">
                <Baby size={14} /> Succession
              </span>
              <span className={`text-xs ${
                court.succession.crisisRisk > 50 ? 'text-red-600' : 'text-stone-600'
              }`}>
                Crisis Risk: {court.succession.crisisRisk}%
              </span>
            </div>
            <p className="text-xs text-stone-600 mt-1">
              Law: {court.succession.successionLaw}
            </p>
            {court.succession.heir && (
              <p className="text-xs mt-1">
                <span className="text-stone-500">Heir: </span>
                <span className="font-medium">{court.succession.heir.name}</span>
              </p>
            )}
          </div>
        )}

        {/* Court Members */}
        <div>
          <h4 className="font-semibold text-stone-700 mb-2">{getCabinetTitle()} Members</h4>
          <div className="space-y-2">
            {sortedMembers.map(renderCourtMember)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourtPanel;
