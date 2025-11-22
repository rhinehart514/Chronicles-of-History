import React, { useState } from 'react';

export interface Subject {
  id: string;
  name: string;
  flag: string;
  type: SubjectType;
  liberty: number;
  development: number;
  income: number;
  manpower: number;
  yearsToAnnex: number;
  relations: number;
}

export type SubjectType = 'vassal' | 'march' | 'personal_union' | 'colony' | 'protectorate';

interface SubjectManagerProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  maxSubjects: number;
  onAnnex: (subjectId: string) => void;
  onRelease: (subjectId: string) => void;
  onChangeType: (subjectId: string, newType: SubjectType) => void;
  onGrantLand: (subjectId: string) => void;
  onIncreaseRelations: (subjectId: string) => void;
}

const SUBJECT_TYPE_INFO: Record<SubjectType, {
  name: string;
  icon: string;
  description: string;
  benefits: string[];
}> = {
  vassal: {
    name: 'Vassal',
    icon: '👑',
    description: 'A subordinate nation that pays tribute',
    benefits: ['Income from tribute', 'Manpower', 'Can be annexed']
  },
  march: {
    name: 'March',
    icon: '🛡️',
    description: 'A militarized border vassal',
    benefits: ['Strong military', 'No tribute', 'Defensive bonus']
  },
  personal_union: {
    name: 'Personal Union',
    icon: '👥',
    description: 'Shares the same ruler',
    benefits: ['Full integration potential', 'Diplomatic reputation']
  },
  colony: {
    name: 'Colony',
    icon: '🏝️',
    description: 'An overseas territory',
    benefits: ['Trade goods', 'Naval base', 'Eventually independent']
  },
  protectorate: {
    name: 'Protectorate',
    icon: '🤝',
    description: 'A protected state',
    benefits: ['Trade power', 'No annexation', 'Tech sharing']
  }
};

export const SubjectManager: React.FC<SubjectManagerProps> = ({
  isOpen,
  onClose,
  subjects,
  maxSubjects,
  onAnnex,
  onRelease,
  onChangeType,
  onGrantLand,
  onIncreaseRelations
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  if (!isOpen) return null;

  const selected = subjects.find(s => s.id === selectedSubject);
  const totalIncome = subjects.reduce((sum, s) => sum + s.income, 0);
  const totalManpower = subjects.reduce((sum, s) => sum + s.manpower, 0);

  const getLibertyColor = (liberty: number) => {
    if (liberty >= 100) return 'text-red-600';
    if (liberty >= 50) return 'text-amber-600';
    return 'text-green-600';
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-stone-800">👑 Subject Nations</h2>
            <div className="text-sm text-stone-500">
              {subjects.length}/{maxSubjects} subjects
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Stats */}
        <div className="p-3 border-b border-stone-200 grid grid-cols-3 gap-4 bg-stone-100">
          <div className="text-center">
            <div className="text-xs text-stone-500">Total Tribute</div>
            <div className="font-bold text-amber-600">{totalIncome.toFixed(0)}💰/mo</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-stone-500">Total Manpower</div>
            <div className="font-bold text-stone-800">{totalManpower.toLocaleString()}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-stone-500">Subjects</div>
            <div className="font-bold text-stone-800">{subjects.length}</div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Subject list */}
          <div className="w-1/2 border-r border-stone-200 overflow-y-auto">
            {subjects.length === 0 ? (
              <p className="p-4 text-center text-stone-500">No subject nations</p>
            ) : (
              subjects.map(subject => {
                const typeInfo = SUBJECT_TYPE_INFO[subject.type];
                return (
                  <button
                    key={subject.id}
                    onClick={() => setSelectedSubject(subject.id)}
                    className={`w-full p-3 text-left border-b border-stone-200 hover:bg-stone-100 ${
                      selectedSubject === subject.id ? 'bg-stone-100' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{subject.flag}</span>
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
                  </button>
                );
              })
            )}
          </div>

          {/* Selected subject details */}
          <div className="w-1/2 p-4 overflow-y-auto">
            {selected ? (
              <>
                <div className="text-center mb-4">
                  <span className="text-4xl">{selected.flag}</span>
                  <h3 className="font-bold text-stone-800 mt-2">{selected.name}</h3>
                  <span className="text-sm text-stone-500">
                    {SUBJECT_TYPE_INFO[selected.type].icon} {SUBJECT_TYPE_INFO[selected.type].name}
                  </span>
                </div>

                {/* Liberty desire */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-stone-600">Liberty Desire</span>
                    <span className={`font-bold ${getLibertyColor(selected.liberty)}`}>
                      {selected.liberty}%
                    </span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        selected.liberty >= 100 ? 'bg-red-500' :
                        selected.liberty >= 50 ? 'bg-amber-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(100, selected.liberty)}%` }}
                    />
                  </div>
                  {selected.liberty >= 50 && (
                    <div className="text-xs text-amber-600 mt-1">
                      ⚠️ Subject is disloyal
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-stone-100 rounded p-3 text-center">
                    <div className="text-xs text-stone-500">Development</div>
                    <div className="font-bold text-stone-800">{selected.development}</div>
                  </div>
                  <div className="bg-stone-100 rounded p-3 text-center">
                    <div className="text-xs text-stone-500">Relations</div>
                    <div className={`font-bold ${selected.relations >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {selected.relations}
                    </div>
                  </div>
                  <div className="bg-stone-100 rounded p-3 text-center">
                    <div className="text-xs text-stone-500">Tribute</div>
                    <div className="font-bold text-amber-600">{selected.income}💰</div>
                  </div>
                  <div className="bg-stone-100 rounded p-3 text-center">
                    <div className="text-xs text-stone-500">Manpower</div>
                    <div className="font-bold text-stone-800">{selected.manpower}</div>
                  </div>
                </div>

                {/* Annexation progress */}
                {selected.type !== 'protectorate' && selected.type !== 'colony' && (
                  <div className="mb-4 bg-amber-50 rounded p-3">
                    <div className="text-sm font-medium text-amber-800">Annexation</div>
                    <div className="text-xs text-amber-600">
                      {selected.yearsToAnnex > 0
                        ? `${selected.yearsToAnnex} years until annexation possible`
                        : 'Ready to annex'}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2">
                  <button
                    onClick={() => onIncreaseRelations(selected.id)}
                    className="w-full py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    🤝 Improve Relations
                  </button>

                  <button
                    onClick={() => onGrantLand(selected.id)}
                    className="w-full py-2 bg-amber-600 text-white rounded text-sm hover:bg-amber-700"
                  >
                    🏘️ Grant Land
                  </button>

                  {selected.yearsToAnnex <= 0 && selected.type !== 'protectorate' && (
                    <button
                      onClick={() => onAnnex(selected.id)}
                      disabled={selected.liberty >= 50}
                      className={`w-full py-2 rounded text-sm ${
                        selected.liberty < 50
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                      }`}
                    >
                      👑 Annex Subject
                    </button>
                  )}

                  <button
                    onClick={() => onRelease(selected.id)}
                    className="w-full py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                  >
                    🔓 Release Subject
                  </button>
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

export default SubjectManager;
