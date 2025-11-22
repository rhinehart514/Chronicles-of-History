// Service for creating shareable game stories and screenshots

import { Nation, LogEntry } from '../types';

export interface ShareableStory {
  title: string;
  description: string;
  nationName: string;
  year: number;
  highlights: string[];
  stats: {
    yearsPlayed: number;
    decisionsCount: number;
    warsWon: number;
  };
  url?: string;
}

// Generate a shareable story from game state
export function generateShareableStory(
  nation: Nation,
  startYear: number,
  currentYear: number,
  logs: LogEntry[]
): ShareableStory {
  const nationLogs = logs.filter(
    l => l.nationName === nation.name || l.type === 'DECISION'
  );

  const highlights = nationLogs
    .filter(l => l.type === 'CONQUEST' || l.type === 'WAR' || l.type === 'LEGACY')
    .slice(-5)
    .map(l => l.content);

  const warsWon = nationLogs.filter(
    l => l.type === 'WAR' && l.content.toLowerCase().includes('victory')
  ).length;

  return {
    title: `The ${nation.name} Chronicle`,
    description: `From ${startYear} to ${currentYear}, a tale of ${nation.name}`,
    nationName: nation.name,
    year: currentYear,
    highlights: highlights.length > 0 ? highlights : ['A new chapter begins...'],
    stats: {
      yearsPlayed: currentYear - startYear,
      decisionsCount: nationLogs.filter(l => l.type === 'DECISION').length,
      warsWon
    }
  };
}

// Create text for sharing
export function createShareText(story: ShareableStory): string {
  const lines = [
    `📜 ${story.title}`,
    ``,
    `🏛️ ${story.nationName} (${story.year})`,
    `📅 ${story.stats.yearsPlayed} years of rule`,
    `⚔️ ${story.stats.warsWon} victories`,
    ``,
  ];

  if (story.highlights.length > 0) {
    lines.push('Key moments:');
    story.highlights.slice(0, 3).forEach(h => {
      lines.push(`• ${h.slice(0, 100)}${h.length > 100 ? '...' : ''}`);
    });
  }

  lines.push('', '#ChroniclesOfHistory');

  return lines.join('\n');
}

// Share to Twitter/X
export function shareToTwitter(story: ShareableStory): void {
  const text = encodeURIComponent(createShareText(story));
  const url = `https://twitter.com/intent/tweet?text=${text}`;
  window.open(url, '_blank', 'width=550,height=420');
}

// Share to Reddit
export function shareToReddit(story: ShareableStory): void {
  const title = encodeURIComponent(story.title);
  const text = encodeURIComponent(createShareText(story));
  const url = `https://www.reddit.com/submit?title=${title}&text=${text}`;
  window.open(url, '_blank');
}

// Copy to clipboard
export async function copyToClipboard(story: ShareableStory): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(createShareText(story));
    return true;
  } catch (e) {
    console.error('Failed to copy to clipboard:', e);
    return false;
  }
}

// Generate a canvas image for sharing (basic version)
export async function generateShareImage(
  story: ShareableStory,
  imageUrl?: string
): Promise<Blob | null> {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Background
    ctx.fillStyle = '#2c241b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = '#f4efe4';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Title
    ctx.fillStyle = '#f4efe4';
    ctx.font = 'bold 48px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(story.title, canvas.width / 2, 100);

    // Nation & Year
    ctx.font = '32px Georgia, serif';
    ctx.fillStyle = '#d4a574';
    ctx.fillText(`${story.nationName} • ${story.year}`, canvas.width / 2, 160);

    // Stats
    ctx.font = '24px Georgia, serif';
    ctx.fillStyle = '#f4efe4';
    const statsY = 240;
    ctx.fillText(
      `${story.stats.yearsPlayed} years • ${story.stats.decisionsCount} decisions • ${story.stats.warsWon} victories`,
      canvas.width / 2,
      statsY
    );

    // Highlights
    ctx.font = '20px Georgia, serif';
    ctx.textAlign = 'left';
    let y = 320;
    story.highlights.slice(0, 3).forEach(highlight => {
      const truncated = highlight.length > 80 ? highlight.slice(0, 80) + '...' : highlight;
      ctx.fillText(`• ${truncated}`, 60, y);
      y += 40;
    });

    // Game title
    ctx.textAlign = 'center';
    ctx.font = 'italic 18px Georgia, serif';
    ctx.fillStyle = '#888';
    ctx.fillText('Chronicles of History', canvas.width / 2, canvas.height - 40);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png');
    });
  } catch (e) {
    console.error('Failed to generate share image:', e);
    return null;
  }
}

// Download the share image
export async function downloadShareImage(story: ShareableStory): Promise<void> {
  const blob = await generateShareImage(story);
  if (!blob) return;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `chronicles_${story.nationName.replace(/\s+/g, '_')}_${story.year}.png`;
  a.click();
  URL.revokeObjectURL(url);
}

export default {
  generateShareableStory,
  createShareText,
  shareToTwitter,
  shareToReddit,
  copyToClipboard,
  generateShareImage,
  downloadShareImage
};
