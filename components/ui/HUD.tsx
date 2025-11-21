import React from 'react';
import {
  Crown, Scroll, Users, Handshake, Lightbulb, Zap,
  ArrowRight, LogOut, Sword, Coins, Scale, Sparkles, Star
} from 'lucide-react';
import { Nation, Era } from '../../types';

interface HUDProps {
  nation: Nation;
  year: number;
  onOpenBriefing: () => void;
  onOpenCourt: () => void;
  onOpenDiplomacy: () => void;
  onOpenResearch: () => void;
  onOpenActions: () => void;
  onEndTurn: () => void;
  onAscend: () => void;
  canEndTurn: boolean;
  isLoading: boolean;
}

const HUD: React.FC<HUDProps> = ({
  nation,
  year,
  onOpenBriefing,
  onOpenCourt,
  onOpenDiplomacy,
  onOpenResearch,
  onOpenActions,
  onEndTurn,
  onAscend,
  canEndTurn,
  isLoading
}) => {
  // Era display names
  const eraNames: Record<Era, string> = {
    'EARLY_MODERN': 'Early Modern',
    'ENLIGHTENMENT': 'Enlightenment',
    'REVOLUTIONARY': 'Revolutionary',
    'INDUSTRIAL': 'Industrial',
    'IMPERIAL': 'Imperial',
    'GREAT_WAR': 'Great War',
    'INTERWAR': 'Interwar',
    'WORLD_WAR': 'World War',
    'COLD_WAR': 'Cold War',
    'MODERN': 'Modern'
  };

  const currentEra = nation.currentEra || 'ENLIGHTENMENT';

  return (
    <>
      {/* Top HUD Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
        <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-b from-black/70 to-transparent">
          {/* Left: Nation Info */}
          <div className="flex items-center gap-4 pointer-events-auto">
            {/* Nation Name & Leader */}
            <div className="bg-[#2c241b]/90 backdrop-blur px-4 py-2 rounded-lg border border-[#8b7355]/50">
              <div className="flex items-center gap-2">
                <Crown size={16} className="text-amber-400" />
                <span className="font-serif font-bold text-[#f4efe4] text-sm">
                  {nation.name}
                </span>
              </div>
              {nation.court?.leader && (
                <div className="text-xs text-[#d4c4a8] mt-0.5">
                  {nation.court.leader.title} {nation.court.leader.name}
                </div>
              )}
            </div>

            {/* Year & Era */}
            <div className="bg-[#2c241b]/90 backdrop-blur px-3 py-2 rounded-lg border border-[#8b7355]/50">
              <div className="text-lg font-bold text-amber-400 font-serif">{year}</div>
              <div className="text-[10px] text-[#d4c4a8] uppercase tracking-wider">
                {eraNames[currentEra]}
              </div>
            </div>
          </div>

          {/* Right: Stats */}
          <div className="flex items-center gap-1 pointer-events-auto">
            <StatBadge icon={<Sword size={12} />} value={nation.stats.military} color="red" label="Military" />
            <StatBadge icon={<Coins size={12} />} value={nation.stats.economy} color="yellow" label="Economy" />
            <StatBadge icon={<Scale size={12} />} value={nation.stats.stability} color="blue" label="Stability" />
            <StatBadge icon={<Sparkles size={12} />} value={nation.stats.innovation} color="purple" label="Innovation" />
            <StatBadge icon={<Star size={12} />} value={nation.stats.prestige} color="amber" label="Prestige" />
          </div>
        </div>
      </div>

      {/* Bottom HUD Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
        <div className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-t from-black/70 to-transparent">
          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Info Modals */}
            <HUDButton onClick={onOpenBriefing} icon={<Scroll size={16} />} label="Briefing" />
            <HUDButton onClick={onOpenCourt} icon={<Crown size={16} />} label="Court" />
            <HUDButton onClick={onOpenDiplomacy} icon={<Handshake size={16} />} label="Diplomacy" />
            <HUDButton onClick={onOpenResearch} icon={<Lightbulb size={16} />} label="Research" />
            <HUDButton onClick={onOpenActions} icon={<Zap size={16} />} label="Actions" highlight />

            {/* Divider */}
            <div className="w-px h-8 bg-[#8b7355]/50 mx-2" />

            {/* Game Actions */}
            <HUDButton
              onClick={onEndTurn}
              icon={<ArrowRight size={16} />}
              label="End Turn"
              primary
              disabled={!canEndTurn || isLoading}
            />
            <HUDButton
              onClick={onAscend}
              icon={<LogOut size={16} />}
              label="Ascend"
              danger
            />
          </div>
        </div>
      </div>
    </>
  );
};

// Stat badge component
const StatBadge: React.FC<{
  icon: React.ReactNode;
  value: number;
  color: string;
  label: string;
}> = ({ icon, value, color, label }) => {
  const colorClasses: Record<string, string> = {
    red: 'text-red-400',
    yellow: 'text-yellow-400',
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    amber: 'text-amber-400'
  };

  return (
    <div
      className="bg-[#2c241b]/90 backdrop-blur px-2 py-1.5 rounded border border-[#8b7355]/50 flex items-center gap-1.5 group relative"
      title={label}
    >
      <span className={colorClasses[color]}>{icon}</span>
      <span className="text-sm font-bold text-[#f4efe4]">{value}</span>
    </div>
  );
};

// HUD button component
const HUDButton: React.FC<{
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  primary?: boolean;
  danger?: boolean;
  highlight?: boolean;
  disabled?: boolean;
}> = ({ onClick, icon, label, primary, danger, highlight, disabled }) => {
  let classes = 'bg-[#2c241b]/90 backdrop-blur text-[#f4efe4] hover:bg-[#3d3225] border-[#8b7355]/50';

  if (primary) {
    classes = 'bg-amber-700/90 backdrop-blur text-white hover:bg-amber-600 border-amber-500/50';
  } else if (danger) {
    classes = 'bg-red-900/90 backdrop-blur text-red-100 hover:bg-red-800 border-red-700/50';
  } else if (highlight) {
    classes = 'bg-indigo-900/90 backdrop-blur text-indigo-100 hover:bg-indigo-800 border-indigo-500/50';
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-3 py-2 rounded-lg border flex items-center gap-2
        font-serif text-sm transition-all
        ${classes}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
};

export default HUD;
