import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { Scroll } from 'lucide-react';

interface MessageLogProps {
  logs: LogEntry[];
}

const MessageLog: React.FC<MessageLogProps> = ({ logs }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="h-full flex flex-col bg-[#fdf6e3] border-r border-[#2c241b]/20 shadow-[inset_-10px_0_20px_rgba(0,0,0,0.05)] relative">
      <div className="p-6 border-b-2 border-[#2c241b] flex items-center gap-3 bg-[#eaddcf]">
        <Scroll className="text-[#b45309]" />
        <h2 className="font-serif text-2xl font-bold text-[#2c241b]">Chronicles of History</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {logs.length === 0 && (
          <div className="text-center italic text-[#2c241b]/50 mt-10">
            The pages of history are yet to be written...
          </div>
        )}
        
        {logs.map((log, idx) => (
          <div key={idx} className="animate-fadeIn">
            <div className="flex items-baseline justify-between mb-2 border-b border-[#2c241b]/10 pb-1">
               <span className="font-serif font-bold text-xl text-[#b45309]">AD {log.year}</span>
               {log.nationName && (
                 <span className="text-xs font-bold uppercase tracking-widest text-[#2c241b]/60">{log.nationName}</span>
               )}
            </div>
            <p className={`font-serif leading-relaxed text-lg ${
              log.type === 'DECISION' ? 'text-[#2c241b] italic pl-4 border-l-2 border-[#b45309]' : 
              log.type === 'WORLD_UPDATE' ? 'text-[#4a4a4a]' : 
              'text-[#2c241b]'
            }`}>
              {log.content}
            </p>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      
      <div className="absolute bottom-0 w-full h-12 bg-gradient-to-t from-[#fdf6e3] to-transparent pointer-events-none" />
    </div>
  );
};

export default MessageLog;