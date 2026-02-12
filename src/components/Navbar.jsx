import React from 'react';
import { Home, TrendingUp, Users, Sparkles } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'debts', label: 'Debts', icon: Users },
    { id: 'coach', label: 'Coach', icon: Sparkles },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-3 shadow-lg transition-colors duration-300 z-50">
      <div className="max-w-7xl mx-auto flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-4 py-1 rounded-lg transition-all ${
                isActive 
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-indigo-500'
              }`}
            >
              <Icon size={isActive ? 24 : 20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Navbar;