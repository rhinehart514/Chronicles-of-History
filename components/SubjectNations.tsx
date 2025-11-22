import React, { useState } from 'react';

interface SubjectNationsProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: SubjectNation[];
  overlordBonuses: OverlordBonus[];
  onChangeSubjectType: (subjectId: string, newType: string) => void;
  onAnnex: (subjectId: string) => void;
  onRelease: (subjectId: string) => void;
  onInteraction: (subjectId: string, interactionId: string) => void;
}

interface SubjectNation {
  id: string;
  name: string;
  flag: string;
  type: SubjectType;
  liberty: number;
  development: number;
  manpower: number;
  income: number;
  annexProgress?: number;
  yearsAsSubject: number;
  interactions: SubjectInteraction[];
}

type SubjectType = 'vassal' | 'march' | 'personal_union' | 'colonial' | 'tributary' | 'client_state';

interface SubjectInteraction {
  id: string;
  name: string;
  icon: string;
  description: string;
  active: boolean;
  cost?: number;
  cooldown?: number;
}

interface OverlordBonus {
  type: string;
  value: number;
  description: string;
}

const SUBJECT_TYPE_INFO: Record<SubjectType, { name: string; icon: string; color: string }> = {
  vassal: { name: 'Vassal', icon: '🛡️', color: 'blue' },
  march: { name: 'March', icon: '⚔️', color: 'red' },
  personal_union: { name: 'Personal Union', icon: '👑', color: 'purple' },
  colonial: { name: 'Colonial Nation', icon: '🌍', color: 'green' },
  tributary: { name: 'Tributary', icon: '💰', color: 'amber' },
  client_state: { name: 'Client State', icon: '📜', color: 'stone' }
};

export const SubjectNations: React.FC<SubjectNationsProps> = ({
  isOpen,
  onClose,
  subjects,
  overlordBonuses,
  onChangeSubjectType,
  onAnnex,
  onRelease,
  onInteraction
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  if (!isOpen) return null;

  const selected = subjects.find(s => s.id === selectedSubject);

  const totalIncome = subjects.reduce((sum, s) => sum + s.income, 0);
  const totalManpower = subjects.reduce((sum, s) => sum + s.manpower, 0);

  const getLibertyColor = (liberty: number) => {
    if (liberty >= 50) return 'text-red-600';
    if (liberty >= 30) return 'text-amber-600';
    return 'text-green-600';
  };

  const getAnnexInfo = (subject: SubjectNation) => {
    if (subject.type === 'personal_union') {
      return { canAnnex: subject.yearsAsSubject >= 50, requirement: '50 years in union' };
    }
    if (subject.type === 'vassal' || subject.type === 'client_state') {
      return { canAnnex: subject.yearsAsSubject >= 10, requirement: '10 years as vassal' };
    }
    return { canAnnex: false, requirement: 'Cannot be annexed' };
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-stone-800">👑 Subject Nations</h2>
            <div className="text-sm text-stone-500">
              {subjects.length} subjects
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Stats */}
        <div className="p-3 border-b border-stone-200 bg-stone-100 grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-xs text-stone-500">Total Subjects</div>
            <div className="font-bold text-stone-800">{subjects.length}</div>
          </div>
          <div>
            <div className="text-xs text-stone-500">Income from Subjects</div>
            <div className="font-bold text-green-600">+{totalIncome.toFixed(1)}/mo</div>
          </div>
          <div>
            <div className="text-xs text-stone-500">Manpower from Subjects</div>
            <div className="font-bold text-red-600">+{totalManpower.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-stone-500">Total Development</div>
            <div className="font-bold text-amber-600">
              {subjects.reduce((sum, s) => sum + s.development, 0)}
            </div>
          </div>
        </div>

        {/* Overlord bonuses */}
        {overlordBonuses.length > 0 && (
          <div className="p-3 border-b border-stone-200 bg-blue-50">
            <div className="text-xs font-semibold text-stone-600 mb-1">Overlord Bonuses</div>
            <div className="flex flex-wrap gap-3">
              {overlordBonuses.map((bonus, i) => (
                <span key={i} className="text-xs text-blue-700">
                  {bonus.description}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Subject list */}
          <div className="w-1/2 border-r border-stone-200 overflow-y-auto p-3">
            {subjects.length === 0 ? (
              <p className="text-center text-stone-500 py-8">No subject nations</p>
            ) : (
              <div className="space-y-2">
                {subjects.map(subject => {
                  const typeInfo = SUBJECT_TYPE_INFO[subject.type];
                  return (
                    <button
                      key={subject.id}
                      onClick={() => setSelectedSubject(subject.id)}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        selectedSubject === subject.id
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-stone-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{subject.flag}</span>
                          <div>
                            <div className="font-semibold text-stone-800">{subject.name}</div>
                            <div className="text-xs text-stone-500">
                              {typeInfo.icon} {typeInfo.name}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${getLibertyColor(subject.liberty)}`}>
                            {subject.liberty}%
                          </div>
                          <div className="text-xs text-stone-500">Liberty</div>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-stone-500">
                        <span>Dev: {subject.development}</span>
                        <span>+{subject.income.toFixed(1)}/mo</span>
                      </div>
                      {subject.annexProgress !== undefined && (
                        <div className="mt-2">
                          <div className="w-full bg-stone-200 rounded-full h-1">
                            <div
                              className="bg-purple-500 h-1 rounded-full"
                              style={{ width: `${subject.annexProgress}%` }}
                            />
                          </div>
                          <div className="text-xs text-purple-600 text-center mt-1">
                            Annexing: {subject.annexProgress}%
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Subject details */}
          <div className="w-1/2 p-4 overflow-y-auto">
            {selected ? (
              <>
                <div className="text-center mb-4">
                  <span className="text-4xl">{selected.flag}</span>
                  <h3 className="font-bold text-stone-800 mt-2">{selected.name}</h3>
                  <p className="text-sm text-stone-600">
                    {SUBJECT_TYPE_INFO[selected.type].icon} {SUBJECT_TYPE_INFO[selected.type].name}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-2 bg-stone-100 rounded text-center">
                    <div className="text-xs text-stone-500">Development</div>
                    <div className="font-bold">{selected.development}</div>
                  </div>
                  <div className="p-2 bg-stone-100 rounded text-center">
                    <div className="text-xs text-stone-500">Years as Subject</div>
                    <div className="font-bold">{selected.yearsAsSubject}</div>
                  </div>
                  <div className="p-2 bg-green-50 rounded text-center">
                    <div className="text-xs text-stone-500">Income</div>
                    <div className="font-bold text-green-600">+{selected.income.toFixed(1)}</div>
                  </div>
                  <div className="p-2 bg-red-50 rounded text-center">
                    <div className="text-xs text-stone-500">Manpower</div>
                    <div className="font-bold text-red-600">+{selected.manpower.toLocaleString()}</div>
                  </div>
                </div>

                {/* Liberty desire */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Liberty Desire</span>
                    <span className={getLibertyColor(selected.liberty)}>{selected.liberty}%</span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        selected.liberty >= 50 ? 'bg-red-500' :
                        selected.liberty >= 30 ? 'bg-amber-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(100, selected.liberty)}%` }}
                    />
                  </div>
                  {selected.liberty >= 50 && (
                    <div className="text-xs text-red-600 mt-1">
                      ⚠️ Subject is disloyal and may refuse to join wars
                    </div>
                  )}
                </div>

                {/* Interactions */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-stone-600 mb-2">Interactions</h4>
                  <div className="space-y-2">
                    {selected.interactions.map(interaction => (
                      <button
                        key={interaction.id}
                        onClick={() => onInteraction(selected.id, interaction.id)}
                        disabled={interaction.active || (interaction.cooldown && interaction.cooldown > 0)}
                        className={`w-full p-2 rounded border text-left text-sm ${
                          interaction.active
                            ? 'border-green-300 bg-green-50'
                            : interaction.cooldown
                            ? 'border-stone-200 bg-stone-100 opacity-50'
                            : 'border-stone-200 bg-white hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span>{interaction.icon}</span>
                            <span>{interaction.name}</span>
                          </div>
                          {interaction.active && (
                            <span className="text-green-500 text-xs">Active</span>
                          )}
                          {interaction.cooldown && interaction.cooldown > 0 && (
                            <span className="text-stone-500 text-xs">
                              {interaction.cooldown}mo
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-stone-500 mt-1">{interaction.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  {getAnnexInfo(selected).canAnnex && (
                    <button
                      onClick={() => onAnnex(selected.id)}
                      disabled={selected.liberty >= 50}
                      className={`w-full py-2 rounded font-medium ${
                        selected.liberty < 50
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                      }`}
                    >
                      Begin Annexation
                    </button>
                  )}
                  {!getAnnexInfo(selected).canAnnex && (
                    <div className="text-xs text-stone-500 text-center">
                      {getAnnexInfo(selected).requirement}
                    </div>
                  )}
                  <button
                    onClick={() => onRelease(selected.id)}
                    className="w-full py-2 bg-red-600 text-white rounded font-medium hover:bg-red-700"
                  >
                    Release Subject
                  </button>
                  {selected.type === 'vassal' && (
                    <button
                      onClick={() => onChangeSubjectType(selected.id, 'march')}
                      className="w-full py-2 bg-stone-200 text-stone-700 rounded hover:bg-stone-300"
                    >
                      Designate as March
                    </button>
                  )}
                  {selected.type === 'march' && (
                    <button
                      onClick={() => onChangeSubjectType(selected.id, 'vassal')}
                      className="w-full py-2 bg-stone-200 text-stone-700 rounded hover:bg-stone-300"
                    >
                      Revoke March Status
                    </button>
                  )}
                </div>
              </>
            ) : (
              <p className="text-center text-stone-500 py-8">
                Select a subject to view details
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectNations;
