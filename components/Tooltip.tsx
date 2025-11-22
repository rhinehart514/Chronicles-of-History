import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 300
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-stone-800',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-stone-800',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-stone-800',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-stone-800'
  };

  return (
    <div
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute z-50 ${positionClasses[position]} pointer-events-none`}
          role="tooltip"
        >
          <div className="bg-stone-800 text-white text-sm px-3 py-2 rounded shadow-lg max-w-xs">
            {content}
          </div>
        </div>
      )}
    </div>
  );
};

// Stat tooltip with game mechanic explanations
export const STAT_TOOLTIPS: Record<string, string> = {
  military: 'Military strength affects combat outcomes, war weariness, and ability to project power. Higher values unlock aggressive diplomatic options.',
  economy: 'Economic power determines income, trade capacity, and ability to fund wars and projects. Affects building speed and maintenance costs.',
  stability: 'Internal stability affects revolt risk, faction loyalty, and reform success. Low stability can trigger civil wars and rebellions.',
  innovation: 'Innovation determines research speed, adoption of new ideas, and cultural influence. Unlocks advanced technologies and reforms.',
  prestige: 'Prestige affects diplomatic weight, alliance attractiveness, and legitimacy. High prestige improves faction approval and foreign relations.'
};

// Tooltip wrapper for stats
export const StatTooltip: React.FC<{
  stat: keyof typeof STAT_TOOLTIPS;
  children: React.ReactNode;
}> = ({ stat, children }) => (
  <Tooltip content={STAT_TOOLTIPS[stat]} position="top">
    {children}
  </Tooltip>
);

export default Tooltip;
