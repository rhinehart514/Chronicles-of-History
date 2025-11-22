// National economy and budget management system

export interface Budget {
  income: IncomeSource[];
  expenses: ExpenseSource[];
  balance: number;
  treasury: number;
  inflation: number;
  loans: Loan[];
}

export interface IncomeSource {
  id: string;
  name: string;
  icon: string;
  category: IncomeCategory;
  baseValue: number;
  modifiers: number;
  total: number;
}

export type IncomeCategory = 'taxes' | 'production' | 'trade' | 'gold' | 'subjects' | 'other';

export interface ExpenseSource {
  id: string;
  name: string;
  icon: string;
  category: ExpenseCategory;
  baseValue: number;
  modifiers: number;
  total: number;
}

export type ExpenseCategory = 'military' | 'state' | 'interest' | 'subsidies' | 'other';

export interface Loan {
  id: string;
  principal: number;
  interest: number;
  duration: number;
  monthsRemaining: number;
}

export interface EconomyModifier {
  type: string;
  value: number;
  source: string;
}

// Default income sources
export const DEFAULT_INCOME_SOURCES: Omit<IncomeSource, 'baseValue' | 'modifiers' | 'total'>[] = [
  { id: 'tax', name: 'Taxation', icon: '💰', category: 'taxes' },
  { id: 'production', name: 'Production', icon: '⚙️', category: 'production' },
  { id: 'trade', name: 'Trade', icon: '🚢', category: 'trade' },
  { id: 'gold', name: 'Gold Mines', icon: '⛏️', category: 'gold' },
  { id: 'tariffs', name: 'Tariffs', icon: '📦', category: 'subjects' },
  { id: 'vassals', name: 'Vassal Income', icon: '🛡️', category: 'subjects' },
  { id: 'spoils', name: 'Spoils of War', icon: '⚔️', category: 'other' }
];

// Default expense sources
export const DEFAULT_EXPENSE_SOURCES: Omit<ExpenseSource, 'baseValue' | 'modifiers' | 'total'>[] = [
  { id: 'army', name: 'Army Maintenance', icon: '⚔️', category: 'military' },
  { id: 'navy', name: 'Naval Maintenance', icon: '⚓', category: 'military' },
  { id: 'forts', name: 'Fort Maintenance', icon: '🏰', category: 'military' },
  { id: 'advisors', name: 'Advisor Salaries', icon: '👨‍🎓', category: 'state' },
  { id: 'state', name: 'State Maintenance', icon: '🏛️', category: 'state' },
  { id: 'interest', name: 'Interest', icon: '📊', category: 'interest' },
  { id: 'subsidies', name: 'Subsidies', icon: '💸', category: 'subsidies' },
  { id: 'colonies', name: 'Colonial Maintenance', icon: '🏴', category: 'state' }
];

// Loan constants
export const LOAN_CONSTANTS = {
  interestRate: 4,
  duration: 60, // months
  maxLoans: 25,
  bankruptcyThreshold: -100
};

// Inflation constants
export const INFLATION_CONSTANTS = {
  fromGold: 0.5,
  fromLoans: 0.1,
  yearlyDecay: -0.1,
  maxInflation: 100,
  advisorReduction: -0.1
};

// Calculate total income
export function calculateTotalIncome(sources: IncomeSource[]): number {
  return sources.reduce((sum, s) => sum + s.total, 0);
}

// Calculate total expenses
export function calculateTotalExpenses(sources: ExpenseSource[]): number {
  return sources.reduce((sum, s) => sum + s.total, 0);
}

// Calculate balance
export function calculateBalance(income: number, expenses: number): number {
  return income - expenses;
}

// Calculate loan size
export function calculateLoanSize(
  monthlyIncome: number,
  inflation: number
): number {
  const base = monthlyIncome * 5;
  const inflationMod = 1 - (inflation / 100);
  return Math.floor(base * inflationMod);
}

// Calculate loan interest
export function calculateLoanInterest(
  principal: number,
  interestRate: number = LOAN_CONSTANTS.interestRate
): number {
  return principal * (interestRate / 100) / 12;
}

// Calculate months to pay off loans
export function calculatePayoffTime(
  totalDebt: number,
  monthlyBalance: number
): number {
  if (monthlyBalance <= 0) return Infinity;
  return Math.ceil(totalDebt / monthlyBalance);
}

// Check if can take loan
export function canTakeLoan(
  currentLoans: number,
  maxLoans: number = LOAN_CONSTANTS.maxLoans
): boolean {
  return currentLoans < maxLoans;
}

// Calculate bankruptcy effects
export function getBankruptcyEffects(): Record<string, number> {
  return {
    army_morale: -50,
    legitimacy: -50,
    prestige: -100,
    corruption: 5,
    global_unrest: 5
  };
}

// Calculate tax efficiency
export function calculateTaxEfficiency(
  autonomy: number,
  corruption: number,
  modifiers: number = 0
): number {
  let efficiency = 100;
  efficiency -= autonomy;
  efficiency -= corruption;
  efficiency += modifiers;
  return Math.max(0, efficiency);
}

// Calculate production efficiency
export function calculateProductionEfficiency(
  autonomy: number,
  devastation: number,
  modifiers: number = 0
): number {
  let efficiency = 100;
  efficiency -= autonomy;
  efficiency -= devastation;
  efficiency += modifiers;
  return Math.max(0, efficiency);
}

// Calculate trade value
export function calculateTradeValue(
  production: number,
  tradePower: number,
  modifiers: number = 0
): number {
  return production * (tradePower / 100) * (1 + modifiers / 100);
}

// Calculate inflation from gold income
export function calculateInflationFromGold(
  goldIncome: number,
  totalIncome: number
): number {
  if (totalIncome === 0) return 0;
  const goldRatio = goldIncome / totalIncome;
  return goldRatio * INFLATION_CONSTANTS.fromGold;
}

// Get economic health status
export function getEconomicHealth(
  balance: number,
  loans: number,
  inflation: number
): string {
  if (loans > 15 || inflation > 50) return 'Critical';
  if (balance < 0 || loans > 10 || inflation > 30) return 'Poor';
  if (loans > 5 || inflation > 15) return 'Strained';
  if (balance > 0 && loans < 3 && inflation < 10) return 'Healthy';
  return 'Stable';
}

// Get health color
export function getHealthColor(health: string): string {
  const colors: Record<string, string> = {
    Critical: 'red',
    Poor: 'orange',
    Strained: 'yellow',
    Stable: 'stone',
    Healthy: 'green'
  };
  return colors[health] || 'stone';
}

// Calculate war taxes
export function calculateWarTaxes(
  baseIncome: number,
  warExhaustion: number
): number {
  const bonus = baseIncome * 0.25;
  const exhaustionPenalty = warExhaustion * 0.02;
  return bonus * (1 - exhaustionPenalty);
}

export default {
  DEFAULT_INCOME_SOURCES,
  DEFAULT_EXPENSE_SOURCES,
  LOAN_CONSTANTS,
  INFLATION_CONSTANTS,
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateBalance,
  calculateLoanSize,
  calculateLoanInterest,
  calculatePayoffTime,
  canTakeLoan,
  getBankruptcyEffects,
  calculateTaxEfficiency,
  calculateProductionEfficiency,
  calculateTradeValue,
  calculateInflationFromGold,
  getEconomicHealth,
  getHealthColor,
  calculateWarTaxes
};
