import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import Coach from './components/Coach';
import Navbar from './components/Navbar';
import { CATEGORIES } from './constants';
import ExpenseModal from './components/ExpenseModal';
import DebtModal from './components/DebtModal';
import Auth from './Auth';
import Analytics from './components/Analytics';
import { PlusCircle, TrendingUp, Users, Home, DollarSign, Calendar, Trash2, Check, X, Moon, Sun, LogOut } from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [expenses, setExpenses] = useState([]);
  const [debts, setDebts] = useState([]);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddDebt, setShowAddDebt] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Theme Management
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

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

  // 2. Auth Session Management
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 3. Database Fetchers (The real link to Supabase)
  const fetchExpenses = async () => {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false });

    if (!error) setExpenses(data || []);
  };

  const fetchDebts = async () => {
    const { data, error } = await supabase
      .from('debts')
      .select('*')
      .order('date', { ascending: false });

    if (!error) setDebts(data || []);
  };

  useEffect(() => {
    if (session) {
      fetchExpenses();
      fetchDebts();
    }
  }, [session]);

  // 4. Action Handlers (Writing to Database)
  const addExpense = async (expense) => {
    const { error } = await supabase.from('expenses').insert({
      amount: parseFloat(expense.amount),
      category: expense.category,
      note: expense.note,
      user_id: session.user.id,
      date: new Date().toISOString()
    });

    if (!error) fetchExpenses();
    else console.error("Error adding expense:", error.message);
  };

  const deleteExpense = async (id) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (!error) fetchExpenses();
  };

  const addDebt = async (debt) => {
    const { error } = await supabase.from('debts').insert({
      person: debt.person,
      amount: parseFloat(debt.amount),
      reason: debt.reason,
      type: debt.type,
      user_id: session.user.id,
      date: new Date().toISOString(),
      settled: false
    });

    if (!error) fetchDebts();
    else console.error("Error adding debt:", error.message);
  };

  const settleDebt = async (id) => {
    const { error } = await supabase
      .from('debts')
      .update({ settled: true })
      .eq('id', id);

    if (!error) fetchDebts();
  };

  const deleteDebt = async (id) => {
    const { error } = await supabase.from('debts').delete().eq('id', id);
    if (!error) fetchDebts();
  };

  // 5. Calculations
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthExpenses = expenses.filter(e => {
    const expenseDate = new Date(e.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });

  const totalMonthSpent = monthExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const activeDebts = debts.filter(d => !d.settled);
  const moneyOwedToMe = activeDebts.filter(d => d.type === 'lent').reduce((sum, d) => sum + parseFloat(d.amount), 0);
  const moneyIOwe = activeDebts.filter(d => d.type === 'owed').reduce((sum, d) => sum + parseFloat(d.amount), 0);

  // 6. Gatekeepers
  if (loading) return <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center dark:text-white">Loading Flow...</div>;
  if (!session) return <Auth />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300 pb-20 md:pb-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 transition-colors duration-300 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 py-3 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">💰 FinanceFlow</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleDarkMode} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700">
              {darkMode ? <Sun className="text-amber-500 w-5 h-5" /> : <Moon className="text-slate-600 w-5 h-5" />}
            </button>
            <button onClick={() => supabase.auth.signOut()} className="p-2 text-slate-500 hover:text-red-500">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'home' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 text-sm">Monthly Spend</span>
                <div className="text-3xl font-bold dark:text-white">€{totalMonthSpent.toFixed(2)}</div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-emerald-200">
                <span className="text-emerald-600 text-sm">Owed to Me</span>
                <div className="text-3xl font-bold text-emerald-600">€{moneyOwedToMe.toFixed(2)}</div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-amber-200">
                <span className="text-amber-600 text-sm">I Owe</span>
                <div className="text-3xl font-bold text-amber-600">€{moneyIOwe.toFixed(2)}</div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowAddExpense(true)} className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg">Add Expense</button>
              <button onClick={() => setShowAddDebt(true)} className="flex-1 bg-purple-600 text-white py-4 rounded-xl font-bold shadow-lg">Add Debt</button>
            </div>

            {/* Recent Expenses List */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
              <h2 className="font-bold mb-4 dark:text-white">Recent Expenses</h2>
              <div className="space-y-3">
                {monthExpenses.map(expense => (
                  <div key={expense.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <div className="dark:text-white">
                      <div className="font-semibold">{expense.category}</div>
                      <div className="text-xs text-slate-500">{expense.note}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold dark:text-white">€{parseFloat(expense.amount).toFixed(2)}</span>
                      <button onClick={() => deleteExpense(expense.id)} className="text-red-500"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <Analytics monthExpenses={monthExpenses} totalMonthSpent={totalMonthSpent} darkMode={darkMode} />
        )}

        {activeTab === 'debts' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold dark:text-white">Active Debts</h2>
            {activeDebts.map(debt => (
              <div key={debt.id} className={`flex justify-between p-4 rounded-xl border ${debt.type === 'lent' ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                <div>
                  <div className="font-bold">{debt.person}</div>
                  <div className="text-sm opacity-75">{debt.reason}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg">€{parseFloat(debt.amount).toFixed(2)}</span>
                  <button onClick={() => settleDebt(debt.id)} className="bg-white p-2 rounded-lg text-slate-600"><Check size={16} /></button>
                  <button onClick={() => deleteDebt(debt.id)} className="text-red-500"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'coach' && (
       <Coach expenses={monthExpenses} debts={debts} />
)}
      </div>

     {/* Rest of my stuff.. content above... */}
      
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Modals below... */}
      {showAddExpense && <ExpenseModal onClose={() => setShowAddExpense(false)} onAdd={addExpense} />}
      {showAddDebt && <DebtModal onClose={() => setShowAddDebt(false)} onAdd={addDebt} />}
    </div>
  );
};

export default App;