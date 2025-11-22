// Game date manipulation utilities

export function createDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function parseDate(dateString: string): { year: number; month: number; day: number } {
  const [year, month, day] = dateString.split('-').map(Number);
  return { year, month, day };
}

export function addDays(dateString: string, days: number): string {
  const { year, month, day } = parseDate(dateString);
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  let newDay = day + days;
  let newMonth = month;
  let newYear = year;

  while (newDay > daysInMonth[newMonth - 1]) {
    newDay -= daysInMonth[newMonth - 1];
    newMonth++;
    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    }
  }

  while (newDay < 1) {
    newMonth--;
    if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }
    newDay += daysInMonth[newMonth - 1];
  }

  return createDate(newYear, newMonth, newDay);
}

export function addMonths(dateString: string, months: number): string {
  const { year, month, day } = parseDate(dateString);
  let newMonth = month + months;
  let newYear = year;

  while (newMonth > 12) {
    newMonth -= 12;
    newYear++;
  }

  while (newMonth < 1) {
    newMonth += 12;
    newYear--;
  }

  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const newDay = Math.min(day, daysInMonth[newMonth - 1]);

  return createDate(newYear, newMonth, newDay);
}

export function addYears(dateString: string, years: number): string {
  const { year, month, day } = parseDate(dateString);
  return createDate(year + years, month, day);
}

export function compareDates(date1: string, date2: string): number {
  const d1 = parseDate(date1);
  const d2 = parseDate(date2);

  if (d1.year !== d2.year) return d1.year - d2.year;
  if (d1.month !== d2.month) return d1.month - d2.month;
  return d1.day - d2.day;
}

export function daysBetween(date1: string, date2: string): number {
  const d1 = parseDate(date1);
  const d2 = parseDate(date2);

  // Simplified calculation (assumes 30 days per month)
  const days1 = d1.year * 365 + d1.month * 30 + d1.day;
  const days2 = d2.year * 365 + d2.month * 30 + d2.day;

  return Math.abs(days2 - days1);
}

export function isNewMonth(oldDate: string, newDate: string): boolean {
  const old = parseDate(oldDate);
  const current = parseDate(newDate);
  return old.month !== current.month || old.year !== current.year;
}

export function isNewYear(oldDate: string, newDate: string): boolean {
  const old = parseDate(oldDate);
  const current = parseDate(newDate);
  return old.year !== current.year;
}

export function getSeasonForMonth(month: number): string {
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}

export function getEra(year: number): string {
  if (year < 1500) return 'medieval';
  if (year < 1600) return 'renaissance';
  if (year < 1700) return 'reformation';
  if (year < 1800) return 'enlightenment';
  return 'industrial';
}
