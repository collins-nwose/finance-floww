import React, { useState } from 'react';
import { X } from 'lucide-react';

const DebtModal = ({ onClose, onAdd }) => {
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

export default DebtModal;