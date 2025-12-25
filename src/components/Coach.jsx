import React, { useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { getFinancialAdvice } from '../services/aiService';

const Coach = ({ expenses, debts }) => {
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAdvice = async () => {
    setLoading(true);
    const result = await getFinancialAdvice(expenses, debts);
    setAdvice(result);
    setLoading(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-indigo-100 dark:border-indigo-900/30 transition-all duration-300">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-indigo-500 w-6 h-6" />
        <h2 className="text-xl font-bold dark:text-white">AI Financial Coach</h2>
      </div>

      {!advice && !loading && (
        <button 
          onClick={fetchAdvice}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition-all shadow-md"
        >
          Analyze My Spending
        </button>
      )}

      {loading && (
        <div className="flex flex-col items-center py-8">
          <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mb-2" />
          <p className="text-slate-500 text-sm">Reviewing your bank statements...</p>
        </div>
      )}

      {advice && !loading && (
        <div className="space-y-4">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line border border-indigo-100 dark:border-indigo-900/50">
            {advice}
          </div>
          <button 
            onClick={fetchAdvice}
            className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" /> Get fresh advice
          </button>
        </div>
      )}
    </div>
  );
};

export default Coach;