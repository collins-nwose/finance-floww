import React, { useState, useEffect } from 'react';
import { PlusCircle, TrendingUp, Users, Home, DollarSign, Calendar, Trash2, Check, X, Moon, Sun, Settings, LogOut } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CATEGORIES = [
  { name: 'Food & Dining', color: '#F59E0B', darkColor: '#FCD34D', icon: '🍔' },
  { name: 'Transportation', color: '#06B6D4', darkColor: '#67E8F9', icon: '🚗' },
  { name: 'Shopping', color: '#8B5CF6', darkColor: '#A78BFA', icon: '🛍️' },
  { name: 'Entertainment', color: '#EC4899', darkColor: '#F9A8D4', icon: '🎬' },
  { name: 'Bills & Utilities', color: '#10B981', darkColor: '#6EE7B7', icon: '💡' },
  { name: 'Health & Fitness', color: '#3B82F6', darkColor: '#93C5FD', icon: '💪' },
  { name: 'Other', color: '#6B7280', darkColor: '#9CA3AF', icon: '📦' }
];

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [expenses, setExpenses] = useState([]);
  const [debts, setDebts] = useState([]);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddDebt, setShowAddDebt] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  
  // Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };
  
  // Load data from storage
  useEffect(() => {
    const loadData = async () => {
      try {
        const expensesData = await window.storage.get('expenses');
        const debtsData = await window.storage.get('debts');
        
        if (expensesData?.value) {
          setExpenses(JSON.parse(expensesData.value));
        }
        if (debtsData?.value) {
          setDebts(JSON.parse(debtsData.value));
        }
      } catch (error) {
        console.log('No existing data found, starting fresh');
      }
    };
    loadData();
  }, []);

  // Save expenses to storage
  useEffect(() => {
    if (expenses.length > 0) {
      window.storage.set('expenses', JSON.stringify(expenses));
    }
  }, [expenses]);

  // Save debts to storage
  useEffect(() => {
    if (debts.length > 0) {
      window.storage.set('debts', JSON.stringify(debts));
    }
  }, [debts]);

  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: Date.now(),
      date: new Date().toISOString()
    };
    setExpenses([newExpense, ...expenses]);
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const addDebt = (debt) => {
    const newDebt = {
      ...debt,
      id: Date.now(),
      date: new Date().toISOString(),
      settled: false
    };
    setDebts([newDebt, ...debts]);
  };

  const settleDebt = (id) => {
    setDebts(debts.map(d => d.id === id ? { ...d, settled: true } : d));
  };

  const deleteDebt = (id) => {
    setDebts(debts.filter(d => d.id !== id));
  };

  // Calculate current month expenses
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthExpenses = expenses.filter(e => {
    const expenseDate = new Date(e.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });

  const totalMonthSpent = monthExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

  // Calculate category breakdown
  const categoryData = CATEGORIES.map(cat => {
    const total = monthExpenses
      .filter(e => e.category === cat.name)
      .reduce((sum, e) => sum + parseFloat(e.amount), 0);
    return { 
      name: cat.name, 
      value: total, 
      color: darkMode ? cat.darkColor : cat.color 
    };
  }).filter(c => c.value > 0);

  // Calculate debt balances
  const activeDebts = debts.filter(d => !d.settled);
  const moneyOwedToMe = activeDebts.filter(d => d.type === 'lent').reduce((sum, d) => sum + parseFloat(d.amount), 0);
  const moneyIOwe = activeDebts.filter(d => d.type === 'owed').reduce((sum, d) => sum + parseFloat(d.amount), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">💰 FinanceFlow</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Track expenses & manage debts effortlessly</p>
          </div>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-amber-500" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Home Tab */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Monthly Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 transition-colors duration-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-600 dark:text-slate-400 text-sm">This Month</span>
                  <Calendar className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                </div>
                <div className="text-3xl font-bold text-slate-800 dark:text-white">€{totalMonthSpent.toFixed(2)}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{monthExpenses.length} transactions</div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-emerald-200 dark:border-emerald-900/50 transition-colors duration-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-600 dark:text-slate-400 text-sm">Owed to Me</span>
                  <TrendingUp className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                </div>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">€{moneyOwedToMe.toFixed(2)}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{activeDebts.filter(d => d.type === 'lent').length} people</div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-amber-200 dark:border-amber-900/50 transition-colors duration-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-600 dark:text-slate-400 text-sm">I Owe</span>
                  <DollarSign className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                </div>
                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">€{moneyIOwe.toFixed(2)}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{activeDebts.filter(d => d.type === 'owed').length} people</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddExpense(true)}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-500 dark:to-indigo-600 text-white rounded-xl py-4 px-6 font-semibold hover:from-indigo-700 hover:to-indigo-800 dark:hover:from-indigo-600 dark:hover:to-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <PlusCircle className="w-5 h-5" />
                Add Expense
              </button>
              <button
                onClick={() => setShowAddDebt(true)}
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-500 dark:to-purple-600 text-white rounded-xl py-4 px-6 font-semibold hover:from-purple-700 hover:to-purple-800 dark:hover:from-purple-600 dark:hover:to-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Users className="w-5 h-5" />
                Add Debt
              </button>
            </div>

            {/* Recent Expenses */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 transition-colors duration-300">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Recent Expenses</h2>
              {monthExpenses.length === 0 ? (
                <p className="text-slate-400 dark:text-slate-500 text-center py-8">No expenses yet. Add your first expense!</p>
              ) : (
                <div className="space-y-3">
                  {monthExpenses.slice(0, 5).map(expense => {
                    const category = CATEGORIES.find(c => c.name === expense.category);
                    return (
                      <div key={expense.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{category?.icon}</span>
                          <div>
                            <div className="font-semibold text-slate-800 dark:text-white">{expense.category}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">{expense.note || 'No note'}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-slate-800 dark:text-white">€{parseFloat(expense.amount).toFixed(2)}</span>
                          <button
                            onClick={() => deleteExpense(expense.id)}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 transition-colors duration-300">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Spending by Category</h2>
              {categoryData.length === 0 ? (
                <p className="text-slate-400 dark:text-slate-500 text-center py-12">No data yet. Start tracking expenses!</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => `€${value.toFixed(2)}`}
                      contentStyle={{
                        backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                        border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                        borderRadius: '0.5rem',
                        color: darkMode ? '#ffffff' : '#000000'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 transition-colors duration-300">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Category Breakdown</h2>
              <div className="space-y-3">
                {categoryData.map(cat => {
                  const percentage = (cat.value / totalMonthSpent) * 100;
                  return (
                    <div key={cat.name}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{cat.name}</span>
                        <span className="text-sm font-bold text-slate-800 dark:text-white">€{cat.value.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%`, backgroundColor: cat.color }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Debts Tab */}
        {activeTab === 'debts' && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 rounded-2xl p-6 text-white shadow-lg transition-colors duration-300">
                <div className="text-sm opacity-90 mb-1">People Owe Me</div>
                <div className="text-4xl font-bold">€{moneyOwedToMe.toFixed(2)}</div>
              </div>
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 rounded-2xl p-6 text-white shadow-lg transition-colors duration-300">
                <div className="text-sm opacity-90 mb-1">I Owe People</div>
                <div className="text-4xl font-bold">€{moneyIOwe.toFixed(2)}</div>
              </div>
            </div>

            {/* They Owe Me */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 transition-colors duration-300">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-emerald-600 dark:text-emerald-400">↓</span> They Owe Me
              </h2>
              {activeDebts.filter(d => d.type === 'lent').length === 0 ? (
                <p className="text-slate-400 dark:text-slate-500 text-center py-6">No active debts owed to you</p>
              ) : (
                <div className="space-y-3">
                  {activeDebts.filter(d => d.type === 'lent').map(debt => (
                    <div key={debt.id} className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-900/50 transition-colors duration-300">
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-white">{debt.person}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">{debt.reason}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 text-lg">€{parseFloat(debt.amount).toFixed(2)}</span>
                        <button
                          onClick={() => settleDebt(debt.id)}
                          className="bg-emerald-600 dark:bg-emerald-700 text-white p-2 rounded-lg hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteDebt(debt.id)}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* I Owe Them */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 transition-colors duration-300">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-amber-600 dark:text-amber-400">↑</span> I Owe Them
              </h2>
              {activeDebts.filter(d => d.type === 'owed').length === 0 ? (
                <p className="text-slate-400 dark:text-slate-500 text-center py-6">You don't owe anyone—great!</p>
              ) : (
                <div className="space-y-3">
                  {activeDebts.filter(d => d.type === 'owed').map(debt => (
                    <div key={debt.id} className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-900/50 transition-colors duration-300">
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-white">{debt.person}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">{debt.reason}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-amber-700 dark:text-amber-400 text-lg">€{parseFloat(debt.amount).toFixed(2)}</span>
                        <button
                          onClick={() => settleDebt(debt.id)}
                          className="bg-amber-600 dark:bg-amber-700 text-white p-2 rounded-lg hover:bg-amber-700 dark:hover:bg-amber-600 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteDebt(debt.id)}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <ExpenseModal
          onClose={() => setShowAddExpense(false)}
          onAdd={addExpense}
          darkMode={darkMode}
        />
      )}

      {/* Add Debt Modal */}
      {showAddDebt && (
        <DebtModal
          onClose={() => setShowAddDebt(false)}
          onAdd={addDebt}
          darkMode={darkMode}
        />
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shadow-lg transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-around">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'home' 
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30' 
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Home</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'analytics' 
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30' 
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <TrendingUp className="w-6 h-6" />
            <span className="text-xs font-medium">Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab('debts')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'debts' 
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30' 
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Users className="w-6 h-6" />
            <span className="text-xs font-medium">Debts</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const ExpenseModal = ({ onClose, onAdd, darkMode }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].name);
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    if (amount && parseFloat(amount) > 0) {
      onAdd({ amount, category, note });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700 transition-colors duration-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Add Expense</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Amount (€)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 text-slate-800 dark:text-white transition-colors"
              placeholder="0.00"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 text-slate-800 dark:text-white transition-colors"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.name} value={cat.name}>{cat.icon} {cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Note (optional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 text-slate-800 dark:text-white transition-colors"
              placeholder="e.g., Lunch at cafe"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-500 dark:to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 dark:hover:from-indigo-600 dark:hover:to-indigo-700 transition-all shadow-lg"
          >
            Add Expense
          </button>
        </div>
      </div>
    </div>
  );
};

const DebtModal = ({ onClose, onAdd, darkMode }) => {
  const [amount, setAmount] = useState('');
  const [person, setPerson] = useState('');
  const [reason, setReason] = useState('');
  const [type, setType] = useState('lent');

  const handleSubmit = () => {
    if (amount && parseFloat(amount) > 0 && person) {
      onAdd({ amount, person, reason, type });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700 transition-colors duration-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Add Debt</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setType('lent')}
                className={`py-3 rounded-xl font-semibold transition-all ${
                  type === 'lent'
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 dark:from-emerald-500 dark:to-emerald-600 text-white shadow-lg'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                I Lent Money
              </button>
              <button
                onClick={() => setType('owed')}
                className={`py-3 rounded-xl font-semibold transition-all ${
                  type === 'owed'
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 dark:from-amber-500 dark:to-amber-600 text-white shadow-lg'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                I Owe Money
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Amount (€)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 text-slate-800 dark:text-white transition-colors"
              placeholder="0.00"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Person's Name</label>
            <input
              type="text"
              value={person}
              onChange={(e) => setPerson(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 text-slate-800 dark:text-white transition-colors"
              placeholder="e.g., Alex"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Reason</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 text-slate-800 dark:text-white transition-colors"
              placeholder="e.g., Dinner split"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-500 dark:to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 dark:hover:from-indigo-600 dark:hover:to-indigo-700 transition-all shadow-lg"
          >
            Add Debt
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;