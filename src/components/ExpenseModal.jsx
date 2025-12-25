import React, { useState } from 'react';
import { X } from 'lucide-react';

const CATEGORIES = [
  { name: 'Food & Dining', color: '#F59E0B', darkColor: '#FCD34D', icon: '🍔' },
  { name: 'Transportation', color: '#06B6D4', darkColor: '#67E8F9', icon: '🚗' },
  { name: 'Shopping', color: '#8B5CF6', darkColor: '#A78BFA', icon: '🛍️' },
  { name: 'Entertainment', color: '#EC4899', darkColor: '#F9A8D4', icon: '🎬' },
  { name: 'Bills & Utilities', color: '#10B981', darkColor: '#6EE7B7', icon: '💡' },
  { name: 'Health & Fitness', color: '#3B82F6', darkColor: '#93C5FD', icon: '💪' },
  { name: 'Other', color: '#6B7280', darkColor: '#9CA3AF', icon: '📦' }
];

const ExpenseModal = ({ onClose, onAdd }) => {
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

export default ExpenseModal;