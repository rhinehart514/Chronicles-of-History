import React from 'react';

export interface BudgetItem {
  name: string;
  amount: number;
  icon: string;
  category: 'income' | 'expense';
  trend?: 'up' | 'down' | 'stable';
}

interface BudgetOverviewProps {
  isOpen: boolean;
  onClose: () => void;
  treasury: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  budgetItems: BudgetItem[];
  loans: { amount: number; interest: number; duration: number }[];
  onTakeLoan: (amount: number) => void;
  onRepayLoan: (index: number) => void;
  maxLoan: number;
}

export const BudgetOverview: React.FC<BudgetOverviewProps> = ({
  isOpen,
  onClose,
  treasury,
  monthlyIncome,
  monthlyExpenses,
  budgetItems,
  loans,
  onTakeLoan,
  onRepayLoan,
  maxLoan
}) => {
  if (!isOpen) return null;

  const netIncome = monthlyIncome - monthlyExpenses;
  const incomeItems = budgetItems.filter(i => i.category === 'income');
  const expenseItems = budgetItems.filter(i => i.category === 'expense');
  const totalDebt = loans.reduce((sum, l) => sum + l.amount, 0);

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <h2 className="text-xl font-bold text-stone-800">💰 Budget Overview</h2>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Summary */}
        <div className="p-4 border-b border-stone-200 bg-stone-100">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xs text-stone-500">Treasury</div>
              <div className="text-xl font-bold text-amber-600">
                {treasury.toLocaleString()}💰
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-stone-500">Income</div>
              <div className="text-xl font-bold text-green-600">
                +{monthlyIncome.toLocaleString()}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-stone-500">Expenses</div>
              <div className="text-xl font-bold text-red-600">
                -{monthlyExpenses.toLocaleString()}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-stone-500">Net</div>
              <div className={`text-xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {netIncome >= 0 ? '+' : ''}{netIncome.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-6">
            {/* Income */}
            <div>
              <h3 className="font-semibold text-green-600 mb-3">📈 Income</h3>
              <div className="space-y-2">
                {incomeItems.map((item, i) => (
                  <div key={i} className="flex justify-between items-center bg-green-50 p-2 rounded">
                    <span className="flex items-center gap-2 text-sm">
                      <span>{item.icon}</span>
                      <span className="text-stone-700">{item.name}</span>
                      {item.trend && <span className="text-xs">{getTrendIcon(item.trend)}</span>}
                    </span>
                    <span className="font-medium text-green-600">+{item.amount}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center bg-green-100 p-2 rounded font-semibold">
                  <span className="text-stone-800">Total Income</span>
                  <span className="text-green-600">+{monthlyIncome}</span>
                </div>
              </div>
            </div>

            {/* Expenses */}
            <div>
              <h3 className="font-semibold text-red-600 mb-3">📉 Expenses</h3>
              <div className="space-y-2">
                {expenseItems.map((item, i) => (
                  <div key={i} className="flex justify-between items-center bg-red-50 p-2 rounded">
                    <span className="flex items-center gap-2 text-sm">
                      <span>{item.icon}</span>
                      <span className="text-stone-700">{item.name}</span>
                      {item.trend && <span className="text-xs">{getTrendIcon(item.trend)}</span>}
                    </span>
                    <span className="font-medium text-red-600">-{item.amount}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center bg-red-100 p-2 rounded font-semibold">
                  <span className="text-stone-800">Total Expenses</span>
                  <span className="text-red-600">-{monthlyExpenses}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Loans section */}
          <div className="mt-6">
            <h3 className="font-semibold text-stone-800 mb-3">🏦 Loans & Debt</h3>

            {totalDebt > 0 && (
              <div className="mb-4 p-3 bg-red-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-stone-700">Total Debt</span>
                  <span className="font-bold text-red-600">{totalDebt.toLocaleString()}💰</span>
                </div>
              </div>
            )}

            {loans.length > 0 && (
              <div className="space-y-2 mb-4">
                {loans.map((loan, i) => (
                  <div key={i} className="flex justify-between items-center bg-stone-100 p-3 rounded">
                    <div>
                      <div className="font-medium text-stone-800">{loan.amount.toLocaleString()}💰</div>
                      <div className="text-xs text-stone-500">
                        {loan.interest}% interest • {loan.duration} months remaining
                      </div>
                    </div>
                    <button
                      onClick={() => onRepayLoan(i)}
                      disabled={treasury < loan.amount}
                      className={`px-3 py-1 rounded text-sm ${
                        treasury >= loan.amount
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                      }`}
                    >
                      Repay
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Take loan */}
            <div className="bg-stone-100 rounded-lg p-4">
              <h4 className="font-medium text-stone-800 mb-3">Take a Loan</h4>
              <div className="grid grid-cols-3 gap-2">
                {[500, 1000, 2000].map(amount => (
                  <button
                    key={amount}
                    onClick={() => onTakeLoan(amount)}
                    disabled={totalDebt + amount > maxLoan}
                    className={`py-2 rounded text-sm ${
                      totalDebt + amount <= maxLoan
                        ? 'bg-amber-600 text-white hover:bg-amber-700'
                        : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                    }`}
                  >
                    {amount}💰
                  </button>
                ))}
              </div>
              <div className="text-xs text-stone-500 mt-2">
                Max loan capacity: {maxLoan.toLocaleString()}💰 (currently: {totalDebt.toLocaleString()})
              </div>
            </div>
          </div>
        </div>

        {/* Projection */}
        <div className="p-4 border-t border-stone-300 bg-stone-100">
          <div className="flex justify-between items-center">
            <span className="text-stone-600">Projected Treasury (12 months)</span>
            <span className={`font-bold ${treasury + netIncome * 12 >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {(treasury + netIncome * 12).toLocaleString()}💰
            </span>
          </div>
          {netIncome < 0 && (
            <div className="text-xs text-red-600 mt-1">
              ⚠️ Warning: At current rate, treasury will be depleted in {Math.floor(treasury / Math.abs(netIncome))} months
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetOverview;
