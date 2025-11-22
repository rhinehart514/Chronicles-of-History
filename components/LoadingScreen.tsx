import React, { useState, useEffect } from 'react';
import { getRandomTip } from '../services/tutorialService';

interface LoadingScreenProps {
  message?: string;
  showTip?: boolean;
  progress?: number; // 0-100
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Loading...',
  showTip = true,
  progress
}) => {
  const [tip, setTip] = useState<string>('');
  const [dots, setDots] = useState('');

  // Rotate tips
  useEffect(() => {
    if (showTip) {
      setTip(getRandomTip());
      const interval = setInterval(() => {
        setTip(getRandomTip());
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [showTip]);

  // Animate dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#2c241b] flex items-center justify-center z-50">
      <div className="text-center max-w-md px-4">
        {/* Spinner */}
        <div className="mb-6">
          <div className="w-16 h-16 border-4 border-amber-600/30 border-t-amber-600 rounded-full animate-spin mx-auto" />
        </div>

        {/* Message */}
        <h2 className="text-xl font-serif text-[#f4efe4] mb-2">
          {message}{dots}
        </h2>

        {/* Progress bar */}
        {progress !== undefined && (
          <div className="w-full bg-stone-700 rounded-full h-2 mb-4">
            <div
              className="bg-amber-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Tip */}
        {showTip && tip && (
          <div className="mt-6 p-4 bg-stone-800/50 rounded-lg border border-stone-700">
            <p className="text-sm text-stone-400 mb-1">💡 Tip</p>
            <p className="text-sm text-[#d4c4a8]">{tip}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Smaller inline loader
export const InlineLoader: React.FC<{ text?: string }> = ({ text = 'Loading' }) => (
  <div className="flex items-center gap-2 text-stone-500">
    <div className="w-4 h-4 border-2 border-stone-400/30 border-t-stone-400 rounded-full animate-spin" />
    <span className="text-sm">{text}</span>
  </div>
);

// Skeleton loader for content
export const SkeletonLoader: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
  <div className="space-y-2 animate-pulse">
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className="h-4 bg-stone-300 rounded"
        style={{ width: `${100 - i * 15}%` }}
      />
    ))}
  </div>
);

export default LoadingScreen;
