import React from 'react';
import { Feather } from 'lucide-react';

interface LoaderProps {
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ text = "Consulting the Archives..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 h-full min-h-[300px]">
      <div className="relative mb-6">
        <Feather className="w-12 h-12 text-[#b45309] animate-bounce" />
      </div>
      <h3 className="font-serif text-xl text-[#2c241b] animate-pulse text-center">{text}</h3>
      <div className="mt-4 w-48 h-1 bg-[#eaddcf] rounded-full overflow-hidden">
        <div className="h-full bg-[#b45309] animate-[progress_2s_ease-in-out_infinite] origin-left w-full scale-x-0"></div>
      </div>
      <style>{`
        @keyframes progress {
          0% { transform: scaleX(0); transform-origin: left; }
          50% { transform: scaleX(1); transform-origin: left; }
          51% { transform: scaleX(1); transform-origin: right; }
          100% { transform: scaleX(0); transform-origin: right; }
        }
      `}</style>
    </div>
  );
};

export default Loader;