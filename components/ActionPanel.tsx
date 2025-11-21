
import React from 'react';
import { Nation, BriefingData, ResolutionData, GamePhase, Choice, LegacyData, Faction, War } from '../types';
import { DynamicEvent, EventChoice, getSeverityColor } from '../data/dynamicEvents';
import StatDisplay from './StatDisplay';
import Loader from './Loader';
import { ChevronRight, Crown, Map, ScrollText, Feather, Sparkles, Globe, Users, Sword, AlertTriangle } from 'lucide-react';

interface ActionPanelProps {
  phase: GamePhase;
  year: number;
  nations: Nation[];
  currentNation: Nation | null;
  briefing: BriefingData | null;
  resolution: ResolutionData | null;
  legacy: LegacyData | null;
  imageUrl: string | null;
  onSelectNation: (id: string) => void;
  onMakeDecision: (choice: Choice) => void;
  onEndTurn: () => void;
  onAscend: () => void;
  onReturnToMap: () => void;
  loadingMessage?: string | null;
  activeWars?: War[];
  currentEvent?: DynamicEvent | null;
  onEventChoice?: (choice: EventChoice) => void;
}

const FactionDisplay: React.FC<{ factions: Faction[] }> = ({ factions }) => {
  return (
    <div className="bg-[#fdf6e3] p-4 rounded-lg border border-[#2c241b]/20 shadow-sm">
      <h4 className="text-xs font-bold uppercase tracking-widest text-[#b45309] mb-3 flex items-center gap-2">
        <Users size={14} /> Internal Factions
      </h4>
      <div className="space-y-3">
        {factions.map((faction, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-sm font-serif text-[#2c241b]">
              <span className="font-bold">{faction.name}</span>
              <span>{faction.approval}%</span>
            </div>
            <div className="w-full h-2 bg-[#2c241b]/10 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  faction.approval < 30 ? 'bg-red-700' : 
                  faction.approval < 60 ? 'bg-yellow-600' : 'bg-green-700'
                }`}
                style={{ width: `${faction.approval}%` }}
              />
            </div>
            <p className="text-xs italic text-[#2c241b]/60">{faction.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const WarRoom: React.FC<{ wars: War[], currentId: string }> = ({ wars, currentId }) => {
  const myWars = wars.filter(w => w.attackerId === currentId || w.defenderId === currentId);
  
  if (myWars.length === 0) return null;

  return (
    <div className="bg-red-900/10 border-2 border-red-800/30 p-4 rounded-lg mb-6 animate-fadeIn">
      <h3 className="flex items-center gap-2 text-red-900 font-bold font-serif text-lg uppercase tracking-widest mb-2">
        <Sword size={20} /> State of War
      </h3>
      <div className="space-y-2">
        {myWars.map((w, idx) => (
          <div key={idx} className="bg-[#fdf6e3] p-3 rounded border border-red-900/20 flex justify-between items-center">
             <div>
               <span className="font-bold text-[#2c241b]">{w.attackerId === currentId ? `Attacking ${w.defenderId}` : `Defending against ${w.attackerId}`}</span>
               <span className="block text-xs italic text-[#2c241b]/60">{w.narrative}</span>
             </div>
             <span className="text-xs font-bold bg-red-100 text-red-800 px-2 py-1 rounded uppercase">{w.state}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ActionPanel: React.FC<ActionPanelProps> = ({
  phase,
  year,
  nations,
  currentNation,
  briefing,
  resolution,
  legacy,
  imageUrl,
  onSelectNation,
  onMakeDecision,
  onEndTurn,
  onAscend,
  onReturnToMap,
  loadingMessage,
  activeWars = [],
  currentEvent,
  onEventChoice
}) => {

  if (loadingMessage) {
    return (
      <div className="h-full flex flex-col items-center justify-center relative overflow-hidden bg-[#fdf6e3]/90 backdrop-blur-sm z-50">
         <Loader text={loadingMessage} />
      </div>
    );
  }

  // PHASE: SELECT NATION (Map View)
  if (phase === 'SELECT_NATION') {
    return (
      <div className="h-full w-full relative pointer-events-none flex flex-col justify-between p-6 z-20">
        
        {/* Top HUD */}
        <div className="pointer-events-auto flex justify-between items-start max-w-6xl mx-auto w-full">
           <div className="bg-[#fdf6e3]/90 backdrop-blur-md p-6 rounded-xl border-2 border-[#2c241b] shadow-xl text-center mx-auto">
              <h2 className="font-serif text-5xl font-bold text-[#2c241b] mb-1">AD {year}</h2>
              <p className="font-serif text-lg text-[#b45309] italic">The Spirit seeks a new vessel.</p>
           </div>
        </div>

        {/* Bottom Quick Select */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pointer-events-auto opacity-90 hover:opacity-100 transition-opacity mt-auto">
           {nations.slice(0, 6).map(n => (
             <button 
               key={n.id}
               onClick={() => onSelectNation(n.id)}
               className="bg-[#2c241b] text-[#fdf6e3] p-3 rounded border border-[#b45309] hover:bg-[#b45309] transition-colors text-left shadow-lg"
             >
               <div className="font-serif font-bold text-sm">{n.name}</div>
               <div className="text-[10px] uppercase tracking-wider opacity-70">{n.rulerTitle}</div>
             </button>
           ))}
        </div>
      </div>
    );
  }

  // For other phases
  return (
    <div className="h-full flex flex-col bg-[#fdf6e3]/95 backdrop-blur-sm relative overflow-y-auto custom-scrollbar z-30 border-l-4 border-[#2c241b] shadow-[-10px_0_30px_rgba(0,0,0,0.2)]">

      {/* Phase: EVENT */}
      {phase === 'EVENT' && currentEvent && currentNation && onEventChoice && (
        <div className="p-10 flex flex-col items-center justify-center w-full max-w-3xl mx-auto flex-grow">
          <div className="bg-[#eaddcf] p-8 rounded-lg shadow-2xl border-4 border-[#2c241b] w-full relative">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-amber-600 text-white p-3 rounded-full border-4 border-[#eaddcf] shadow-lg">
              <AlertTriangle size={32} />
            </div>

            <div className="text-center mb-6 mt-6">
              <span className={`text-xs font-bold uppercase tracking-widest ${getSeverityColor(currentEvent.severity)} mb-2 block`}>
                {currentEvent.severity} {currentEvent.category.replace('_', ' ')}
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#2c241b] mb-2">{currentEvent.title}</h2>
              <span className="text-[#b45309] font-serif italic">AD {year}</span>
            </div>

            <div className="bg-[#fdf6e3] p-6 rounded border border-[#2c241b]/20 mb-6">
              <p className="font-serif text-lg leading-relaxed text-[#2c241b]">
                {currentEvent.description}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-serif text-xl font-bold text-[#2c241b] text-center mb-4">Your Response</h3>
              {currentEvent.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => onEventChoice(choice)}
                  className="w-full p-4 bg-[#2c241b] text-[#fdf6e3] rounded-lg font-serif text-base hover:bg-[#b45309] transition-all duration-300 text-left flex justify-between items-center group shadow-lg"
                >
                  <div className="flex flex-col flex-1">
                    <span>{choice.text}</span>
                    {/* Show effects preview */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {choice.effects.stability && (
                        <span className={`text-xs px-2 py-0.5 rounded ${choice.effects.stability > 0 ? 'bg-green-700' : 'bg-red-700'}`}>
                          Stability {choice.effects.stability > 0 ? '+' : ''}{choice.effects.stability}
                        </span>
                      )}
                      {choice.effects.economy && (
                        <span className={`text-xs px-2 py-0.5 rounded ${choice.effects.economy > 0 ? 'bg-green-700' : 'bg-red-700'}`}>
                          Economy {choice.effects.economy > 0 ? '+' : ''}{choice.effects.economy}
                        </span>
                      )}
                      {choice.effects.military && (
                        <span className={`text-xs px-2 py-0.5 rounded ${choice.effects.military > 0 ? 'bg-green-700' : 'bg-red-700'}`}>
                          Military {choice.effects.military > 0 ? '+' : ''}{choice.effects.military}
                        </span>
                      )}
                      {choice.effects.prestige && (
                        <span className={`text-xs px-2 py-0.5 rounded ${choice.effects.prestige > 0 ? 'bg-green-700' : 'bg-red-700'}`}>
                          Prestige {choice.effects.prestige > 0 ? '+' : ''}{choice.effects.prestige}
                        </span>
                      )}
                      {choice.effects.innovation && (
                        <span className={`text-xs px-2 py-0.5 rounded ${choice.effects.innovation > 0 ? 'bg-green-700' : 'bg-red-700'}`}>
                          Innovation {choice.effects.innovation > 0 ? '+' : ''}{choice.effects.innovation}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1 ml-2" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Phase: BRIEFING & DECISION */}
      {(phase === 'BRIEFING' || phase === 'DECISION') && currentNation && briefing && (
        <div className="p-8 w-full max-w-4xl mx-auto">
           {/* Header */}
           <div className="flex justify-between items-end mb-6 border-b-2 border-[#2c241b] pb-4">
              <div>
                <h2 className="font-serif text-4xl font-bold text-[#2c241b]">{currentNation.name}</h2>
                <span className="text-[#b45309] font-serif italic text-xl">AD {year}</span>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button 
                  onClick={onAscend}
                  className="text-xs font-bold uppercase tracking-widest text-[#b45309] hover:text-[#2c241b] transition-colors flex items-center gap-1"
                >
                  <Sparkles size={14} /> Ascend / Depart
                </button>
                <div className="flex items-center gap-2 bg-[#2c241b] text-[#fdf6e3] px-4 py-2 rounded-full text-sm font-bold tracking-wider">
                  <ScrollText size={16} />
                  DECISION
                </div>
              </div>
           </div>

           <div className="grid grid-cols-1 gap-8">
              
              {/* WAR ROOM BANNER */}
              <WarRoom wars={activeWars} currentId={currentNation.id} />

              {/* Top Section: Image, Stats, Factions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="aspect-[4/3] bg-[#2c241b] rounded-lg overflow-hidden shadow-xl border-4 border-[#2c241b]/10 md:col-span-1">
                  {imageUrl ? (
                    <img src={imageUrl} alt="Historical Event" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#fdf6e3]/50">No Image</div>
                  )}
                </div>
                <div className="md:col-span-2 flex flex-col gap-4">
                   <StatDisplay stats={currentNation.stats} />
                   {briefing.factions && <FactionDisplay factions={briefing.factions} />}
                </div>
              </div>

              {/* Content: Briefing & Choices */}
              <div className="space-y-6">
                 <div className="bg-[#eaddcf]/40 p-6 rounded-lg border border-[#2c241b]/10">
                    <h3 className="font-serif text-xl font-bold text-[#2c241b] mb-3 flex items-center gap-2">
                      <Map size={20} /> Situation Report
                    </h3>
                    <p className="font-serif text-lg leading-relaxed text-[#2c241b]">{briefing.situation}</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {Object.entries(briefing.departments).map(([dept, text]) => (
                     <div key={dept} className="bg-[#fdf6e3] p-4 rounded border border-[#2c241b]/20 shadow-sm">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-[#b45309] mb-1">{dept}</h4>
                        <p className="text-sm text-[#2c241b]/80 leading-snug font-serif">{text}</p>
                     </div>
                   ))}
                 </div>

                 <div className="pt-6">
                    <h3 className="font-serif text-2xl font-bold text-[#2c241b] mb-4 text-center">Royal Decrees</h3>
                    <div className="space-y-3">
                      {briefing.choices.map((choice) => (
                        <button
                          key={choice.id}
                          onClick={() => onMakeDecision(choice)}
                          className="w-full p-5 bg-[#2c241b] text-[#fdf6e3] rounded-lg font-serif text-lg hover:bg-[#b45309] transition-all duration-300 text-left flex justify-between items-center group shadow-lg border border-transparent hover:border-[#fdf6e3]"
                        >
                          <div className="flex flex-col">
                             <span>{choice.text}</span>
                             <span className="text-xs uppercase opacity-50 tracking-wider mt-1 text-[#eaddcf]">{choice.type}</span>
                          </div>
                          <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                        </button>
                      ))}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Phase: RESOLUTION */}
      {(phase === 'RESOLUTION' || phase === 'SIMULATION') && resolution && currentNation && (
        <div className="p-10 flex flex-col items-center justify-center w-full max-w-3xl mx-auto flex-grow">
           <div className="bg-[#eaddcf] p-8 rounded-lg shadow-2xl border-4 border-[#2c241b] w-full relative">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-[#b45309] text-white p-3 rounded-full border-4 border-[#eaddcf] shadow-lg">
                <Crown size={32} />
              </div>
              
              <div className="text-center mb-8 mt-6">
                <h2 className="font-serif text-3xl font-bold text-[#2c241b] mb-2">The Die is Cast</h2>
                <div className="h-1 w-20 bg-[#b45309] mx-auto"></div>
              </div>
              
              <div className="space-y-6 mb-8">
                <p className="font-serif text-xl text-[#2c241b] leading-relaxed text-center">
                  {resolution.narrative}
                </p>
                
                <div className="bg-[#2c241b]/5 p-4 rounded border-l-4 border-[#b45309]">
                  <p className="text-[#2c241b] italic font-serif text-center">
                    "Global Reaction: {resolution.globalReaction}"
                  </p>
                </div>

                {resolution.territoryTransfer && (
                   <div className="bg-red-900/10 border border-red-900/30 p-4 rounded text-center">
                      <h3 className="text-red-900 font-bold font-serif text-lg flex items-center justify-center gap-2">
                        <Map size={20} /> BORDERS SHIFTED
                      </h3>
                      <p className="text-red-900/80 italic">{resolution.territoryTransfer.narrative}</p>
                   </div>
                )}
                
                <div className="flex justify-center">
                   <StatDisplay stats={currentNation.stats} changes={resolution.statChanges} />
                </div>
              </div>

              <button
                onClick={onEndTurn}
                className="w-full py-4 bg-[#b45309] text-white font-serif text-xl font-bold rounded hover:bg-[#92400e] transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                Next Year ({year + 1}) <ChevronRight />
              </button>
           </div>
        </div>
      )}

      {/* Phase: LEGACY (Ascension) */}
      {phase === 'LEGACY_VIEW' && legacy && currentNation && (
        <div className="p-10 flex flex-col items-center w-full max-w-4xl mx-auto flex-grow">
           <div className="bg-[#fdf6e3] p-12 rounded-lg shadow-2xl border-double border-8 border-[#2c241b] w-full relative max-h-full overflow-y-auto custom-scrollbar">
              
              <div className="text-center mb-12">
                <Feather className="w-16 h-16 text-[#b45309] mx-auto mb-4" />
                <h1 className="font-serif text-5xl font-bold text-[#2c241b] mb-2">{currentNation.name}</h1>
                <h2 className="font-serif text-3xl italic text-[#b45309] mb-6">"{legacy.eraName}"</h2>
                <div className="h-1 w-32 bg-[#2c241b] mx-auto"></div>
              </div>

              <div className="space-y-12 font-serif text-[#2c241b]">
                 <section>
                   <h3 className="text-xl font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                     <ScrollText size={20} /> The Chronicle
                   </h3>
                   <p className="text-xl leading-loose border-l-4 border-[#b45309] pl-6 italic">
                     {legacy.summary}
                   </p>
                 </section>

                 <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div>
                      <h3 className="text-lg font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Crown size={20} /> Major Deeds
                      </h3>
                      <ul className="space-y-4">
                        {legacy.majorAchievements.map((deed, i) => (
                          <li key={i} className="bg-[#eaddcf]/50 p-4 rounded border border-[#2c241b]/10">
                            {deed}
                          </li>
                        ))}
                      </ul>
                   </div>
                   <div>
                      <h3 className="text-lg font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Globe size={20} /> Lasting Impact
                      </h3>
                      <div className="bg-[#2c241b] text-[#fdf6e3] p-6 rounded shadow-lg">
                        <p className="italic leading-relaxed">{legacy.lastingImpact}</p>
                      </div>
                   </div>
                 </section>
              </div>

              <div className="mt-12 text-center">
                 <button 
                   onClick={onReturnToMap}
                   className="bg-[#b45309] text-[#fdf6e3] px-12 py-4 rounded-full font-serif text-xl font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-3 mx-auto"
                 >
                   <Sparkles />
                   Return to the Aether
                 </button>
                 <p className="mt-4 text-sm text-[#2c241b]/60 italic">Find a new vessel to guide...</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ActionPanel;
