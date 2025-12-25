import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { CATEGORIES } from '../constants';

const Analytics = ({ monthExpenses, totalMonthSpent, darkMode }) => {
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

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-slate-200 dark:border-slate-700 transition-colors duration-300">
        <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white mb-3 sm:mb-4">Spending by Category</h2>
        {categoryData.length === 0 ? (
          <p className="text-slate-400 dark:text-slate-500 text-center py-8 sm:py-12 text-sm">No data yet. Start tracking expenses!</p>
        ) : (
          <div>
            {/* Mobile View */}
            <ResponsiveContainer width="100%" height={250} className="sm:hidden">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={false}
                  outerRadius={80}
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
                    color: darkMode ? '#ffffff' : '#000000',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Desktop View */}
            <ResponsiveContainer width="100%" height={300} className="hidden sm:block">
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
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-slate-200 dark:border-slate-700 transition-colors duration-300">
        <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white mb-3 sm:mb-4">Category Breakdown</h2>
        <div className="space-y-3 sm:space-y-4">
          {categoryData.map(cat => {
            const percentage = (cat.value / totalMonthSpent) * 100;
            return (
              <div key={cat.name}>
                <div className="flex justify-between mb-1.5 sm:mb-2">
                  <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">{cat.name}</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">€{cat.value.toFixed(2)}</span>
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
  );
};

export default Analytics;