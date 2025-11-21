
import React from 'react';
import { CountryData, LoadingState } from '../types';
import Loader from './Loader';
import { X, MapPin, Users, Coins, BookOpen, Lightbulb, Compass, Crown } from 'lucide-react';

interface CountrySidebarProps {
  countryData: CountryData | null;
  loadingState: LoadingState;
  onClose: () => void;
  onPlay: () => void;
  selectedCountryName: string | null;
}

const CountrySidebar: React.FC<CountrySidebarProps> = ({ 
  countryData, 
  loadingState, 
  onClose,
  onPlay,
  selectedCountryName 
}) => {
  const isOpen = selectedCountryName !== null;

  return (
    <div 
      className={`fixed top-0 right-0 h-full bg-[#fdf6e3] border-l-4 border-[#2c241b] shadow-[-20px_0_40px_rgba(0,0,0,0.4)] transition-all duration-500 ease-in-out z-40 flex flex-col
        ${isOpen ? 'w-full md:w-[500px] translate-x-0' : 'w-full md:w-[500px] translate-x-full'}
      `}
      style={{
        backgroundImage: `url("https://www.transparenttextures.com/patterns/aged-paper.png")`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b-2 border-[#2c241b]/20 bg-[#eaddcf]">
        <h2 className="text-3xl font-serif font-bold text-[#2c241b] flex items-center gap-3">
          <span className="text-4xl drop-shadow-md">{countryData?.emoji}</span> 
          {selectedCountryName || 'Unknown Region'}
        </h2>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-[#b45309] rounded-full text-[#2c241b] hover:text-[#fdf6e3] transition-colors border border-transparent hover:border-[#2c241b]"
        >
          <X size={24} />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar relative">
        
        {loadingState === LoadingState.LOADING_AI && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#fdf6e3]/80 z-10">
             <Loader text={`Consulting Archives about ${selectedCountryName}...`} />
          </div>
        )}

        {loadingState === LoadingState.ERROR && (
          <div className="p-6 bg-red-900/10 border-2 border-red-800 rounded-lg text-red-900 font-serif text-center">
            The chronicles for this region are lost to time. Please try again.
          </div>
        )}

        {loadingState === LoadingState.SUCCESS && countryData && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Quick Stats Grid - Historical Ticket Style */}
            <div className="grid grid-cols-2 gap-px bg-[#2c241b]/20 border-2 border-[#2c241b] rounded-lg overflow-hidden shadow-md">
              <div className="bg-[#fdf6e3] p-4 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[#b45309] text-xs uppercase font-bold tracking-widest">
                  <MapPin size={14} /> Capital
                </div>
                <p className="text-[#2c241b] font-serif text-lg font-bold leading-tight">{countryData.capital}</p>
              </div>
              <div className="bg-[#fdf6e3] p-4 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[#b45309] text-xs uppercase font-bold tracking-widest">
                  <Users size={14} /> Souls
                </div>
                <p className="text-[#2c241b] font-serif text-lg font-bold leading-tight">{countryData.population}</p>
              </div>
              <div className="bg-[#fdf6e3] p-4 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[#b45309] text-xs uppercase font-bold tracking-widest">
                  <Coins size={14} /> Coinage
                </div>
                <p className="text-[#2c241b] font-serif text-lg font-bold leading-tight">{countryData.currency}</p>
              </div>
              <div className="bg-[#fdf6e3] p-4 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[#b45309] text-xs uppercase font-bold tracking-widest">
                  <BookOpen size={14} /> Tongue
                </div>
                <p className="text-[#2c241b] font-serif text-lg font-bold leading-tight truncate">{countryData.languages[0]}</p>
              </div>
            </div>

            {/* Description - Drop Cap Style */}
            <div className="relative">
               <h3 className="font-serif text-xl font-bold text-[#2c241b] mb-2 border-b border-[#2c241b] inline-block">Historical Record</h3>
               <p className="text-[#2c241b] leading-relaxed font-serif text-lg">
                 {countryData.description}
               </p>
            </div>

            {/* History Snippet - Blockquote */}
            <div className="bg-[#2c241b] p-6 rounded-tr-2xl rounded-bl-2xl shadow-lg relative overflow-hidden">
               <div className="absolute top-0 left-0 p-2 opacity-10">
                 <Crown size={80} color="#fdf6e3" />
               </div>
               <h3 className="relative text-[#b45309] text-xs uppercase tracking-[0.2em] font-bold mb-2 z-10">State of Affairs</h3>
               <p className="relative text-[#fdf6e3] italic font-serif text-lg leading-relaxed z-10">"{countryData.historySnippet}"</p>
            </div>

            {/* Fun Fact */}
            <div className="flex gap-4 items-start bg-[#eaddcf]/50 p-4 rounded-lg border border-[#2c241b]/20">
               <Lightbulb className="text-[#b45309] shrink-0 mt-1" size={24} />
               <div>
                 <h4 className="text-[#2c241b] font-bold font-serif mb-1">Curiosity</h4>
                 <p className="text-[#2c241b]/80 text-sm italic">{countryData.funFact}</p>
               </div>
            </div>

            {/* Travel Tips */}
            <div>
               <h3 className="font-serif text-xl font-bold text-[#2c241b] mb-4 flex items-center gap-2">
                 <Compass className="text-[#b45309]" size={24} /> Traveler's Guide
               </h3>
               <ul className="space-y-3">
                 {countryData.travelTips.map((tip, index) => (
                   <li key={index} className="flex items-start gap-3 text-[#2c241b] text-sm bg-[#fdf6e3] p-3 rounded border border-[#2c241b]/10 shadow-sm">
                     <span className="bg-[#2c241b] text-[#fdf6e3] w-6 h-6 flex items-center justify-center rounded-full font-serif font-bold shrink-0">{index + 1}</span>
                     <span className="pt-0.5">{tip}</span>
                   </li>
                 ))}
               </ul>
            </div>

          </div>
        )}
      </div>
      
      {/* Footer Action */}
      {countryData && (
        <div className="p-6 border-t-2 border-[#2c241b]/20 bg-[#eaddcf]">
           <button 
             onClick={onPlay}
             className="w-full py-4 bg-[#b45309] text-[#fdf6e3] font-serif text-xl font-bold rounded shadow-lg hover:bg-[#92400e] hover:scale-[1.02] transition-all flex items-center justify-center gap-3 border border-[#2c241b]"
           >
             <Crown size={24} />
             Inhabit This Nation
           </button>
        </div>
      )}
    </div>
  );
};

export default CountrySidebar;
