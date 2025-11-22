// Utility functions for formatting display values

// Format large numbers with suffixes
export function formatNumber(num: number, decimals: number = 1): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(decimals) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(decimals) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(decimals) + 'K';
  }
  return num.toFixed(decimals);
}

// Format currency with locale
export function formatCurrency(amount: number, symbol: string = '💰'): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M ${symbol}`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K ${symbol}`;
  }
  return `${amount.toLocaleString()} ${symbol}`;
}

// Format percentage
export function formatPercent(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

// Format change (with + for positive)
export function formatChange(value: number, decimals: number = 2): string {
  const formatted = value.toFixed(decimals);
  return value >= 0 ? `+${formatted}` : formatted;
}

// Format duration in days
export function formatDuration(days: number): string {
  if (days >= 365) {
    const years = Math.floor(days / 365);
    return `${years} year${years !== 1 ? 's' : ''}`;
  }
  if (days >= 30) {
    const months = Math.floor(days / 30);
    return `${months} month${months !== 1 ? 's' : ''}`;
  }
  return `${days} day${days !== 1 ? 's' : ''}`;
}

// Format time in game speed context
export function formatGameTime(turns: number): string {
  const years = Math.floor(turns / 4);
  const season = turns % 4;
  const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];

  if (years > 0) {
    return `${years}y ${seasons[season]}`;
  }
  return seasons[season];
}

// Format stat value based on type
export function formatStatValue(
  value: number,
  type: 'stat' | 'population' | 'treasury' | 'percent'
): string {
  switch (type) {
    case 'stat':
      return value.toFixed(2);
    case 'population':
      return value.toLocaleString();
    case 'treasury':
      return formatCurrency(value);
    case 'percent':
      return formatPercent(value);
    default:
      return value.toString();
  }
}

// Format date from year
export function formatHistoricalDate(year: number, season?: number): string {
  const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
  if (season !== undefined) {
    return `${seasons[season]} ${year}`;
  }
  return year.toString();
}

// Format ordinal (1st, 2nd, 3rd, etc.)
export function formatOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// Format ratio as X:Y
export function formatRatio(a: number, b: number): string {
  const gcd = (x: number, y: number): number => y === 0 ? x : gcd(y, x % y);
  const divisor = gcd(Math.round(a), Math.round(b));
  return `${Math.round(a / divisor)}:${Math.round(b / divisor)}`;
}

// Format relation value with description
export function formatRelation(value: number): { text: string; color: string } {
  if (value >= 150) return { text: 'Excellent', color: 'text-green-600' };
  if (value >= 100) return { text: 'Very Good', color: 'text-green-500' };
  if (value >= 50) return { text: 'Good', color: 'text-green-400' };
  if (value >= 0) return { text: 'Neutral', color: 'text-amber-500' };
  if (value >= -50) return { text: 'Poor', color: 'text-orange-500' };
  if (value >= -100) return { text: 'Bad', color: 'text-red-500' };
  return { text: 'Terrible', color: 'text-red-600' };
}

// Format military strength
export function formatMilitaryStrength(troops: number): string {
  if (troops >= 100000) {
    return `${(troops / 1000).toFixed(0)}K`;
  }
  return troops.toLocaleString();
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

// Format list with proper grammar
export function formatList(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

// Pluralize word
export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) return `${count} ${singular}`;
  return `${count} ${plural || singular + 's'}`;
}

// Format modifier (for tooltips)
export function formatModifier(
  name: string,
  value: number,
  isPercent: boolean = false
): string {
  const formattedValue = isPercent
    ? `${value > 0 ? '+' : ''}${value}%`
    : `${value > 0 ? '+' : ''}${value.toFixed(2)}`;
  return `${name}: ${formattedValue}`;
}

// Color scale for values
export function getValueColor(
  value: number,
  min: number,
  max: number,
  reverse: boolean = false
): string {
  const ratio = (value - min) / (max - min);
  const adjusted = reverse ? 1 - ratio : ratio;

  if (adjusted >= 0.8) return 'text-green-600';
  if (adjusted >= 0.6) return 'text-green-500';
  if (adjusted >= 0.4) return 'text-amber-500';
  if (adjusted >= 0.2) return 'text-orange-500';
  return 'text-red-500';
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes >= 1048576) {
    return `${(bytes / 1048576).toFixed(2)} MB`;
  }
  if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  }
  return `${bytes} B`;
}

export default {
  formatNumber,
  formatCurrency,
  formatPercent,
  formatChange,
  formatDuration,
  formatGameTime,
  formatStatValue,
  formatHistoricalDate,
  formatOrdinal,
  formatRatio,
  formatRelation,
  formatMilitaryStrength,
  truncateText,
  formatList,
  pluralize,
  formatModifier,
  getValueColor,
  formatFileSize
};
