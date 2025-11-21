import React from 'react';
import { NationStats } from '../types';
import { Sword, Coins, Scale, Lightbulb, Crown } from 'lucide-react';

interface StatDisplayProps {
  stats: NationStats;
  changes?: Partial<NationStats>;
}

const StatRow: React.FC<{ 
  label: string; 
  value: number; 
  icon: React.ReactNode; 
  change?: number 
}> = ({ label, value, icon, change }) => {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#2c241b]/10 last:border-0">
      <div className="flex items-center gap-3 text-[#2c241b]">
        <div className="text-[#b45309]">{icon}</div>
        <span className="font-serif font-bold tracking-wide text-sm">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {/* Stat Pips */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((pip) => (
            <div 
              key={pip} 
              className={`w-2 h-2 rounded-full border border-[#2c241b] ${
                pip <= value ? 'bg-[#b45309]' : 'bg-transparent'
              }`}
            />
          ))}
        </div>
        {/* Change Indicator */}
        {change !== undefined && change !== 0 && (
          <span className={`text-xs font-bold w-6 text-right ${change > 0 ? 'text-green-700' : 'text-red-700'}`}>
            {change > 0 ? '+' : ''}{change}
          </span>
        )}
      </div>
    </div>
  );
};

const StatDisplay: React.FC<StatDisplayProps> = ({ stats, changes }) => {
  return (
    <div className="bg-[#eaddcf]/50 p-4 rounded-lg border border-[#2c241b]/20">
      <StatRow label="Military" value={stats.military} change={changes?.military} icon={<Sword size={16} />} />
      <StatRow label="Economy" value={stats.economy} change={changes?.economy} icon={<Coins size={16} />} />
      <StatRow label="Stability" value={stats.stability} change={changes?.stability} icon={<Scale size={16} />} />
      <StatRow label="Innovation" value={stats.innovation} change={changes?.innovation} icon={<Lightbulb size={16} />} />
      <StatRow label="Prestige" value={stats.prestige} change={changes?.prestige} icon={<Crown size={16} />} />
    </div>
  );
};

export default StatDisplay;