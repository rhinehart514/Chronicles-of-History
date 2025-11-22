import React, { useState } from 'react';

interface IncomeSource {
  id: string;
  name: string;
  icon: string;
  value: number;
}

interface ExpenseSource {
  id: string;
  name: string;
  icon: string;
  value: number;
}

interface Loan {
  id: string;
  amount: number;
  monthsRemaining: number;
}

interface BudgetPanelProps {
  income: IncomeSource[];
  expenses: ExpenseSource[];
  treasury: number;
  inflation: number;
  loans: Loan[];
  maxLoans: number;
  onTakeLoan?: () => void;
  onRepayLoan?: (loanId: string) => void;
  onReduceInflation?: () => void;
  onClose: () => void;
}

export default function BudgetPanel({
  income,
  expenses,
  treasury,
  inflation,
  loans,
  maxLoans,
  onTakeLoan,
  onRepayLoan,
  onReduceInflation,
  onClose
}: BudgetPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'income' | 'expenses' | 'loans'>('overview');

  const totalIncome = income.reduce((sum, s) => sum + s.value, 0);
  const totalExpenses = expenses.reduce((sum, s) => sum + s.value, 0);
  const balance = totalIncome - totalExpenses;

  const totalDebt = loans.reduce((sum, l) => sum + l.amount, 0);

  const getBalanceColor = () => {
    if (balance > 5) return 'text-green-400';
    if (balance > 0) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getInflationColor = () => {
    if (inflation < 5) return 'text-green-400';
    if (inflation < 15) return 'text-yellow-400';
    return 'text-red-400';
  };

  const renderOverview = () => (
    <div className="space-y-4">
      {/* Balance Summary */}
      <div className="bg-stone-700 rounded-lg p-4 text-center">
        <div className={`text-3xl font-bold ${getBalanceColor()}`}>
          {balance >= 0 ? '+' : ''}{balance.toFixed(2)}
        </div>
        <div className="text-sm text-stone-400">Monthly Balance</div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-stone-700 rounded-lg p-3">
          <div className="text-lg font-bold text-green-400">{totalIncome.toFixed(2)}</div>
          <div className="text-xs text-stone-400">Monthly Income</div>
        </div>
        <div className="bg-stone-700 rounded-lg p-3">
          <div className="text-lg font-bold text-red-400">{totalExpenses.toFixed(2)}</div>
          <div className="text-xs text-stone-400">Monthly Expenses</div>
        </div>
        <div className="bg-stone-700 rounded-lg p-3">
          <div className="text-lg font-bold text-amber-400">{treasury.toFixed(0)}</div>
          <div className="text-xs text-stone-400">Treasury</div>
        </div>
        <div className="bg-stone-700 rounded-lg p-3">
          <div className={`text-lg font-bold ${getInflationColor()}`}>{inflation.toFixed(1)}%</div>
          <div className="text-xs text-stone-400">Inflation</div>
        </div>
      </div>

      {/* Top Income */}
      <div>
        <div className="text-sm font-medium text-stone-400 mb-2">Top Income Sources</div>
        <div className="space-y-1">
          {income
            .sort((a, b) => b.value - a.value)
            .slice(0, 3)
            .map(source => (
              <div key={source.id} className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-1">
                  <span>{source.icon}</span>
                  {source.name}
                </span>
                <span className="text-green-400">+{source.value.toFixed(2)}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Top Expenses */}
      <div>
        <div className="text-sm font-medium text-stone-400 mb-2">Top Expenses</div>
        <div className="space-y-1">
          {expenses
            .sort((a, b) => b.value - a.value)
            .slice(0, 3)
            .map(source => (
              <div key={source.id} className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-1">
                  <span>{source.icon}</span>
                  {source.name}
                </span>
                <span className="text-red-400">-{source.value.toFixed(2)}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderIncome = () => (
    <div className="space-y-2">
      {income.map(source => (
        <div key={source.id} className="bg-stone-700 rounded p-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span>{source.icon}</span>
            <span className="text-sm">{source.name}</span>
          </div>
          <span className="text-green-400 font-medium">+{source.value.toFixed(2)}</span>
        </div>
      ))}
      <div className="border-t border-stone-600 pt-2 flex justify-between">
        <span className="font-medium">Total Income</span>
        <span className="text-green-400 font-bold">{totalIncome.toFixed(2)}</span>
      </div>
    </div>
  );

  const renderExpenses = () => (
    <div className="space-y-2">
      {expenses.map(source => (
        <div key={source.id} className="bg-stone-700 rounded p-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span>{source.icon}</span>
            <span className="text-sm">{source.name}</span>
          </div>
          <span className="text-red-400 font-medium">-{source.value.toFixed(2)}</span>
        </div>
      ))}
      <div className="border-t border-stone-600 pt-2 flex justify-between">
        <span className="font-medium">Total Expenses</span>
        <span className="text-red-400 font-bold">{totalExpenses.toFixed(2)}</span>
      </div>
    </div>
  );

  const renderLoans = () => (
    <div className="space-y-3">
      <div className="bg-stone-700 rounded-lg p-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-stone-400">Total Debt</span>
          <span className="text-lg font-bold text-red-400">{totalDebt.toFixed(0)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-stone-400">Active Loans</span>
          <span className="text-sm">{loans.length} / {maxLoans}</span>
        </div>
      </div>

      {loans.length === 0 ? (
        <div className="text-center py-4 text-stone-400 text-sm">
          No active loans
        </div>
      ) : (
        <div className="space-y-2">
          {loans.map(loan => (
            <div key={loan.id} className="bg-stone-700 rounded p-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">{loan.amount.toFixed(0)} gold</span>
                <span className="text-xs text-stone-400">{loan.monthsRemaining} months</span>
              </div>
              <button
                onClick={() => onRepayLoan?.(loan.id)}
                disabled={treasury < loan.amount}
                className={`w-full py-1 rounded text-xs ${
                  treasury >= loan.amount
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-stone-600 text-stone-400 cursor-not-allowed'
                }`}
              >
                Repay
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onTakeLoan}
        disabled={loans.length >= maxLoans}
        className={`w-full py-2 rounded ${
          loans.length < maxLoans
            ? 'bg-amber-600 hover:bg-amber-700 text-white'
            : 'bg-stone-600 text-stone-400 cursor-not-allowed'
        }`}
      >
        Take Loan
      </button>

      <button
        onClick={onReduceInflation}
        className="w-full py-2 bg-stone-600 hover:bg-stone-500 rounded text-sm"
      >
        Reduce Inflation (75 Admin)
      </button>
    </div>
  );

  const tabs = [
    { id: 'overview' as const, label: 'Overview' },
    { id: 'income' as const, label: 'Income' },
    { id: 'expenses' as const, label: 'Expenses' },
    { id: 'loans' as const, label: 'Loans' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-stone-800 rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-stone-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-amber-100">Economy</h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-stone-700">
          <div className="flex">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-amber-400 border-b-2 border-amber-400'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'income' && renderIncome()}
          {activeTab === 'expenses' && renderExpenses()}
          {activeTab === 'loans' && renderLoans()}
        </div>
      </div>
    </div>
  );
}
