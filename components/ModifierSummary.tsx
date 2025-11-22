import React from 'react';

interface ModifierSummaryProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ModifierCategory[];
}

interface ModifierCategory {
  id: string;
  name: string;
  icon: string;
  modifiers: ModifierEntry[];
}

interface ModifierEntry {
  name: string;
  value: number;
  source: string;
  expiry?: string;
}

export const ModifierSummary: React.FC<ModifierSummaryProps> = ({
  isOpen,
  onClose,
  categories
}) => {
  if (!isOpen) return null;

  const formatValue = (value: number, type: string) => {
    const isPercent = type.includes('efficiency') || type.includes('cost') ||
                      type.includes('morale') || type.includes('discipline');
    if (isPercent) {
      return `${value > 0 ? '+' : ''}${value}%`;
    }
    return value > 0 ? `+${value}` : value.toString();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-stone-800">📊 Active Modifiers</h2>
            <div className="text-sm text-stone-500">
              All bonuses and penalties affecting your nation
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            {categories.map(category => (
              <div key={category.id}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{category.icon}</span>
                  <h3 className="font-bold text-stone-800">{category.name}</h3>
                </div>

                {category.modifiers.length === 0 ? (
                  <p className="text-sm text-stone-500 ml-8">No active modifiers</p>
                ) : (
                  <div className="space-y-2">
                    {category.modifiers.map((mod, i) => {
                      const total = category.modifiers
                        .filter(m => m.name === mod.name)
                        .reduce((sum, m) => sum + m.value, 0);

                      // Show individual sources
                      const sameNameMods = category.modifiers.filter(m => m.name === mod.name);
                      const isFirst = sameNameMods[0] === mod;

                      if (!isFirst) return null;

                      return (
                        <div key={i} className="bg-white rounded-lg border border-stone-200 overflow-hidden">
                          <div className="p-3 flex items-center justify-between">
                            <span className="font-medium text-stone-800">{mod.name}</span>
                            <span className={`font-bold ${
                              total > 0 ? 'text-green-600' :
                              total < 0 ? 'text-red-600' :
                              'text-stone-600'
                            }`}>
                              {formatValue(total, category.id)}
                            </span>
                          </div>

                          {/* Sources breakdown */}
                          <div className="px-3 pb-3 space-y-1">
                            {sameNameMods.map((source, j) => (
                              <div key={j} className="flex items-center justify-between text-xs">
                                <span className="text-stone-500">{source.source}</span>
                                <div className="flex items-center gap-2">
                                  <span className={source.value > 0 ? 'text-green-600' : 'text-red-600'}>
                                    {formatValue(source.value, category.id)}
                                  </span>
                                  {source.expiry && (
                                    <span className="text-stone-400">({source.expiry})</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-300 bg-stone-100">
          <div className="flex justify-between text-sm">
            <span className="text-stone-500">Temporary modifiers show remaining duration</span>
            <button
              onClick={onClose}
              className="px-4 py-1 bg-stone-600 text-white rounded hover:bg-stone-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifierSummary;
