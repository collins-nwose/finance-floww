import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, RefreshCw, Send } from 'lucide-react';
import { getFinancialAdvice } from '../services/aiService';

const Coach = ({ expenses, debts }) => {
  const [chatHistory, setChatHistory] = useState([]); // Stores the whole talk
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to the bottom when a new message arrives in ...
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput(""); // Clear input
    setLoading(true);

    // 1. Add your message to the screen...
    setChatHistory(prev => [...prev, { role: 'user', text: userMessage }]);

    // 2. Get AI response (we pass the user's specific question now)
    const result = await getFinancialAdvice(expenses, debts, userMessage);

    // 3. Add AI response to the screen
    setChatHistory(prev => [...prev, { role: 'ai', text: result }]);
    setLoading(false);
  };

  return (
    // Updated Responsive Container
<div className="w-full max-w-4xl mx-auto h-[70vh] md:h-[600px] lg:h-[700px] bg-white dark:bg-slate-800 rounded-2xl flex flex-col shadow-lg border border-indigo-100 dark:border-indigo-900/30 overflow-hidden">
  
  {/* Header: Compact on mobile, more breathing room on desktop */}
  <div className="p-3 md:p-4 border-b dark:border-slate-700 flex items-center justify-between bg-indigo-50/50 dark:bg-indigo-900/10">
    <div className="flex items-center gap-2">
      <Sparkles className="text-indigo-500 w-5 h-5" />
      <h2 className="font-bold text-sm md:text-base dark:text-white leading-tight">AI Financial Coach</h2>
    </div>
    <span className="text-[10px] uppercase font-bold text-slate-400">Live 2026 Analysis</span>
  </div>

  {/* Chat Area: Flex-1 ensures this grows to fill all space except header/input */}
  <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 scroll-smooth">
    {/* ... (Existing Message Logic) ... */}
  </div>

  {/* Input Area: Sticky at bottom, padding adapts to screen size */}
  <form onSubmit={handleSend} className="p-3 md:p-4 border-t dark:border-slate-700 bg-white dark:bg-slate-800 flex gap-2">
    <input 
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Ask about your budget..."
      className="flex-1 bg-slate-50 dark:bg-slate-900 border-none rounded-xl px-4 py-2 text-sm md:text-base focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none"
    />
    <button 
      type="submit"
      disabled={loading}
      className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 md:p-3 rounded-xl transition-all active:scale-95 disabled:opacity-50"
    >
      <Send className="w-5 h-5" />
    </button>
  </form>
</div>
  );
};

export default Coach;