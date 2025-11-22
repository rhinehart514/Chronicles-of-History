import React, { useState, useMemo } from 'react';
import { Nation, LogEntry } from '../types';
import { calculateLegacyScore, saveHighScore, getHighScores, LegacyScore } from '../services/legacyScoreService';
import { generateTimelineComparison, TimelineComparison } from '../services/timelineService';
import { generateChronicle, Chronicle, downloadChronicle } from '../services/chronicleService';
import { generateShareableStory, shareToTwitter, copyToClipboard, downloadShareImage } from '../services/shareService';
import { loadStats } from '../services/achievementService';

interface EndGamePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onNewGame: () => void;
  nation: Nation;
  startYear: number;
  endYear: number;
  logs: LogEntry[];
}

export const EndGamePanel: React.FC<EndGamePanelProps> = ({
  isOpen,
  onClose,
  onNewGame,
  nation,
  startYear,
  endYear,
  logs
}) => {
  const [activeTab, setActiveTab] = useState<'score' | 'timeline' | 'chronicle' | 'highscores'>('score');
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => loadStats(), []);

  const legacyScore = useMemo(() =>
    calculateLegacyScore(nation, startYear, endYear, logs, stats),
    [nation, startYear, endYear, logs, stats]
  );

  const timeline = useMemo(() =>
    generateTimelineComparison(logs, startYear, endYear, nation.id),
    [logs, startYear, endYear, nation.id]
  );

  const chronicle = useMemo(() =>
    generateChronicle(nation, logs, startYear, endYear),
    [nation, logs, startYear, endYear]
  );

  const highScores = useMemo(() => getHighScores(), []);

  // Save high score on mount
  useMemo(() => {
    saveHighScore(legacyScore, nation.name);
  }, [legacyScore, nation.name]);

  if (!isOpen) return null;

  const handleShare = async () => {
    const story = generateShareableStory(nation, startYear, endYear, logs);
    const success = await copyToClipboard(story);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTwitter = () => {
    const story = generateShareableStory(nation, startYear, endYear, logs);
    shareToTwitter(story);
  };

  const handleDownloadImage = async () => {
    const story = generateShareableStory(nation, startYear, endYear, logs);
    await downloadShareImage(story);
  };

  const gradeColors: Record<string, string> = {
    S: 'text-purple-600',
    A: 'text-green-600',
    B: 'text-blue-600',
    C: 'text-amber-600',
    D: 'text-orange-600',
    E: 'text-red-500',
    F: 'text-red-700'
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border-4 border-amber-600">
        {/* Header */}
        <div className="p-6 border-b border-stone-300 text-center bg-gradient-to-b from-amber-50 to-transparent">
          <h2 className="text-2xl font-bold text-stone-800">Your Legacy</h2>
          <h3 className={`text-3xl font-bold mt-2 ${gradeColors[legacyScore.grade]}`}>
            {legacyScore.title}
          </h3>
          <div className="flex items-center justify-center gap-4 mt-3">
            <div className={`text-5xl font-bold ${gradeColors[legacyScore.grade]}`}>
              {legacyScore.grade}
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold text-stone-800">{legacyScore.total} pts</div>
              <div className="text-sm text-stone-600">{endYear - startYear} years</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-300">
          {(['score', 'timeline', 'chronicle', 'highscores'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 font-semibold capitalize text-sm ${
                activeTab === tab
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
              }`}
            >
              {tab === 'highscores' ? 'High Scores' : tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'score' && (
            <div className="space-y-4">
              {/* Score breakdown */}
              {legacyScore.breakdown.map((cat) => (
                <div key={cat.name} className="bg-white p-3 rounded border border-stone-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-stone-800">{cat.name}</span>
                    <span className="text-amber-600 font-bold">{cat.score}/{cat.maxScore}</span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-2">
                    <div
                      className="bg-amber-600 h-2 rounded-full"
                      style={{ width: `${(cat.score / cat.maxScore) * 100}%` }}
                    />
                  </div>
                  <p className="text-sm text-stone-600 mt-1">{cat.description}</p>
                </div>
              ))}

              {/* Historical comparison */}
              <div className="bg-purple-50 p-3 rounded border border-purple-200">
                <h4 className="font-semibold text-purple-800">Historical Comparison</h4>
                <p className="text-purple-700 mt-1">
                  Your reign most resembles <strong>{legacyScore.comparison.historicalFigure}</strong>
                </p>
                <p className="text-sm text-purple-600">{legacyScore.comparison.reason}</p>
                <div className="text-xs text-purple-500 mt-1">
                  {legacyScore.comparison.similarity}% similarity
                </div>
              </div>

              {/* Epitaph */}
              <div className="bg-stone-100 p-4 rounded border border-stone-300 text-center italic text-stone-700">
                "{legacyScore.epitaph}"
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-stone-800">
                  Alternate History Score: {timeline.alternatHistoryScore}/100
                </div>
                <p className="text-sm text-stone-600">
                  How much your actions diverged from real history
                </p>
              </div>

              {timeline.divergencePoints.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="font-semibold text-stone-800">Divergence Points</h4>
                  {timeline.divergencePoints.map((div, i) => (
                    <div key={i} className={`p-3 rounded border ${
                      div.impact === 'critical' ? 'bg-red-50 border-red-200' :
                      div.impact === 'major' ? 'bg-amber-50 border-amber-200' :
                      'bg-blue-50 border-blue-200'
                    }`}>
                      <div className="flex justify-between">
                        <span className="font-bold">{div.year}</span>
                        <span className={`text-xs uppercase ${
                          div.impact === 'critical' ? 'text-red-600' :
                          div.impact === 'major' ? 'text-amber-600' : 'text-blue-600'
                        }`}>{div.impact}</span>
                      </div>
                      <p className="text-sm text-stone-600 mt-1">{div.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-stone-600">
                  Your timeline closely followed real history.
                </p>
              )}
            </div>
          )}

          {activeTab === 'chronicle' && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-bold text-stone-800">{chronicle.title}</h3>
                <p className="text-stone-600">{chronicle.subtitle}</p>
              </div>

              <div className="bg-white p-3 rounded border border-stone-200 max-h-64 overflow-y-auto">
                {chronicle.entries.slice(-10).map((entry, i) => (
                  <div key={i} className="py-2 border-b border-stone-100 last:border-0">
                    <div className="flex items-center gap-2">
                      {entry.type === 'major' && <span>★</span>}
                      <span className="font-semibold text-stone-800">[{entry.year}]</span>
                      <span className="text-amber-700">{entry.headline}</span>
                    </div>
                    <p className="text-sm text-stone-600 mt-1">{entry.content}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => downloadChronicle(chronicle)}
                className="w-full py-2 bg-stone-200 text-stone-700 rounded hover:bg-stone-300"
              >
                Download Chronicle
              </button>
            </div>
          )}

          {activeTab === 'highscores' && (
            <div className="space-y-2">
              {highScores.length === 0 ? (
                <p className="text-center text-stone-600 py-4">No high scores yet</p>
              ) : (
                highScores.map((score, i) => (
                  <div key={i} className={`p-3 rounded border ${
                    i === 0 ? 'bg-amber-50 border-amber-300' : 'bg-white border-stone-200'
                  }`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold text-stone-800">#{i + 1}</span>
                        <span className="ml-2 text-stone-700">{score.title}</span>
                      </div>
                      <div className="text-right">
                        <span className={`font-bold ${gradeColors[score.grade]}`}>{score.grade}</span>
                        <span className="ml-2 text-stone-600">{score.score} pts</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-300 flex gap-2">
          <button
            onClick={handleShare}
            className="flex-1 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700"
          >
            {copied ? '✓ Copied!' : 'Copy to Share'}
          </button>
          <button
            onClick={handleTwitter}
            className="px-4 py-2 bg-stone-200 text-stone-700 rounded hover:bg-stone-300"
          >
            Twitter
          </button>
          <button
            onClick={handleDownloadImage}
            className="px-4 py-2 bg-stone-200 text-stone-700 rounded hover:bg-stone-300"
          >
            Image
          </button>
          <button
            onClick={onNewGame}
            className="flex-1 py-2 bg-amber-600 text-white rounded font-semibold hover:bg-amber-700"
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default EndGamePanel;
