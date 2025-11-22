import React from 'react';

interface SiegeViewProps {
  isOpen: boolean;
  onClose: () => void;
  siege: SiegeInfo;
  onAssault: () => void;
  onRetreat: () => void;
}

interface SiegeInfo {
  provinceId: string;
  provinceName: string;
  fortLevel: number;
  garrison: number;
  maxGarrison: number;
  siegeProgress: number;
  daysRemaining: number;
  besiegingArmy: ArmyInfo;
  defenderArmy?: ArmyInfo;
  modifiers: SiegeModifier[];
  breaches: number;
  blockaded: boolean;
}

interface ArmyInfo {
  id: string;
  name: string;
  owner: string;
  ownerFlag: string;
  infantry: number;
  cavalry: number;
  artillery: number;
  morale: number;
  strength: number;
}

interface SiegeModifier {
  name: string;
  value: number;
  icon: string;
}

export const SiegeView: React.FC<SiegeViewProps> = ({
  isOpen,
  onClose,
  siege,
  onAssault,
  onRetreat
}) => {
  if (!isOpen) return null;

  const garrisonPercent = (siege.garrison / siege.maxGarrison) * 100;
  const progressPercent = (siege.siegeProgress / 100) * 100;

  // Calculate assault chance
  const baseAssaultChance = 10;
  const breachBonus = siege.breaches * 15;
  const garrisonPenalty = garrisonPercent > 50 ? -10 : garrisonPercent > 25 ? -5 : 0;
  const assaultChance = Math.min(90, Math.max(5, baseAssaultChance + breachBonus + garrisonPenalty));

  // Estimated casualties
  const attackerCasualties = Math.round(siege.besiegingArmy.strength * 0.3 * (1 - assaultChance / 100));
  const defenderCasualties = Math.round(siege.garrison * 0.5 * (assaultChance / 100));

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-2xl border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center bg-red-50">
          <div>
            <h2 className="text-xl font-bold text-stone-800">🏰 Siege of {siege.provinceName}</h2>
            <div className="text-sm text-stone-500">
              Fort Level {siege.fortLevel} • Day {Math.ceil(siege.siegeProgress)}
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Siege progress */}
        <div className="p-4 border-b border-stone-200">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-stone-600">Siege Progress</span>
            <span className="font-bold">{siege.siegeProgress.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-stone-200 rounded-full h-4 mb-2">
            <div
              className="bg-red-500 h-4 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-xs text-stone-500 text-center">
            Estimated {siege.daysRemaining} days until fall
          </div>
        </div>

        {/* Forces comparison */}
        <div className="p-4 border-b border-stone-200 grid grid-cols-2 gap-4">
          {/* Attacker */}
          <div className="bg-red-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <span>{siege.besiegingArmy.ownerFlag}</span>
              <div>
                <div className="font-semibold text-stone-800 text-sm">{siege.besiegingArmy.name}</div>
                <div className="text-xs text-stone-500">Besieger</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs text-center">
              <div>
                <div className="font-bold">{siege.besiegingArmy.infantry.toLocaleString()}</div>
                <div className="text-stone-500">Infantry</div>
              </div>
              <div>
                <div className="font-bold">{siege.besiegingArmy.cavalry.toLocaleString()}</div>
                <div className="text-stone-500">Cavalry</div>
              </div>
              <div>
                <div className="font-bold text-amber-600">{siege.besiegingArmy.artillery.toLocaleString()}</div>
                <div className="text-stone-500">Artillery</div>
              </div>
            </div>
            <div className="mt-2 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Morale</span>
                <span>{(siege.besiegingArmy.morale * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Total Strength</span>
                <span>{siege.besiegingArmy.strength.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Defender */}
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="mb-2">
              <div className="font-semibold text-stone-800 text-sm">Garrison</div>
              <div className="text-xs text-stone-500">Defender</div>
            </div>
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span>Garrison</span>
                <span>{siege.garrison.toLocaleString()}/{siege.maxGarrison.toLocaleString()}</span>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${garrisonPercent}%` }}
                />
              </div>
            </div>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-stone-500">Fort Level</span>
                <span>{siege.fortLevel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Breaches</span>
                <span className={siege.breaches > 0 ? 'text-red-600' : ''}>{siege.breaches}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Blockaded</span>
                <span>{siege.blockaded ? '✓ Yes' : '✗ No'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modifiers */}
        <div className="p-4 border-b border-stone-200">
          <h3 className="text-sm font-semibold text-stone-600 mb-2">Siege Modifiers</h3>
          <div className="grid grid-cols-2 gap-2">
            {siege.modifiers.map((mod, i) => (
              <div
                key={i}
                className={`flex items-center justify-between px-2 py-1 rounded text-xs ${
                  mod.value > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                <span>{mod.icon} {mod.name}</span>
                <span>{mod.value > 0 ? '+' : ''}{mod.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Assault option */}
        <div className="p-4 border-b border-stone-200 bg-amber-50">
          <h3 className="text-sm font-semibold text-stone-800 mb-2">⚔️ Assault Fort</h3>
          <p className="text-xs text-stone-600 mb-3">
            Launch an immediate assault instead of waiting for the siege to complete.
            High risk but potentially faster resolution.
          </p>
          <div className="grid grid-cols-3 gap-3 text-center mb-3">
            <div>
              <div className="text-xs text-stone-500">Success Chance</div>
              <div className={`font-bold ${
                assaultChance >= 50 ? 'text-green-600' :
                assaultChance >= 30 ? 'text-amber-600' :
                'text-red-600'
              }`}>
                {assaultChance}%
              </div>
            </div>
            <div>
              <div className="text-xs text-stone-500">Est. Attacker Loss</div>
              <div className="font-bold text-red-600">{attackerCasualties.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-stone-500">Est. Defender Loss</div>
              <div className="font-bold text-blue-600">{defenderCasualties.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 flex justify-between">
          <button
            onClick={onRetreat}
            className="px-4 py-2 bg-stone-200 text-stone-700 rounded hover:bg-stone-300"
          >
            🏃 Lift Siege
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-stone-200 text-stone-700 rounded hover:bg-stone-300"
            >
              Close
            </button>
            <button
              onClick={onAssault}
              className="px-6 py-2 bg-red-600 text-white rounded font-medium hover:bg-red-700"
            >
              ⚔️ Assault ({assaultChance}%)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiegeView;
