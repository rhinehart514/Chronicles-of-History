// Date formatting utilities
export function formatGameDate(dateString: string): string {
  const [year, month, day] = dateString.split('-').map(Number);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return `${day} ${months[month - 1]} ${year}`;
}

export function formatShortDate(dateString: string): string {
  const [year, month, day] = dateString.split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${day} ${months[month - 1]} ${year}`;
}

export function getYear(dateString: string): number {
  return parseInt(dateString.split('-')[0], 10);
}

export function getMonth(dateString: string): number {
  return parseInt(dateString.split('-')[1], 10);
}

export function getDay(dateString: string): number {
  return parseInt(dateString.split('-')[2], 10);
}

// Number formatting utilities
export function formatNumber(num: number): string {
  if (Math.abs(num) >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (Math.abs(num) >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toFixed(0);
}

export function formatDecimal(num: number, decimals: number = 2): string {
  return num.toFixed(decimals);
}

export function formatPercent(num: number): string {
  return (num * 100).toFixed(1) + '%';
}

export function formatCurrency(num: number): string {
  const sign = num >= 0 ? '+' : '';
  return sign + num.toFixed(2);
}

export function formatModifier(num: number): string {
  const sign = num >= 0 ? '+' : '';
  return sign + (num * 100).toFixed(0) + '%';
}

// Duration formatting
export function formatDuration(days: number): string {
  if (days >= 365) {
    const years = Math.floor(days / 365);
    const remainingDays = days % 365;
    const months = Math.floor(remainingDays / 30);
    if (months > 0) {
      return `${years}y ${months}m`;
    }
    return `${years} year${years !== 1 ? 's' : ''}`;
  }
  if (days >= 30) {
    const months = Math.floor(days / 30);
    return `${months} month${months !== 1 ? 's' : ''}`;
  }
  return `${days} day${days !== 1 ? 's' : ''}`;
}

// Color utilities
export function getColorForValue(value: number, min: number, max: number): string {
  const normalized = (value - min) / (max - min);
  if (normalized < 0.33) return 'text-red-400';
  if (normalized < 0.66) return 'text-yellow-400';
  return 'text-green-400';
}

export function getModifierColor(value: number): string {
  if (value > 0) return 'text-green-400';
  if (value < 0) return 'text-red-400';
  return 'text-stone-400';
}
