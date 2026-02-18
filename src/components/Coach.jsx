import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, RefreshCw, Send } from 'lucide-react';
import { getFinancialAdvice } from '../services/aiService';

const Coach = ({ expenses, debts }) => {
  const [chatHistory, setChatHistory] = useState([]); // Stores the whole talk
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to the bottom when a new message arrives
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput(""); // Clear input
    setLoading(true);

    // 1. Add your message to the screen
    setChatHistory(prev => [...prev, { role: 'user', text: userMessage }]);

    // 2. Get AI response (we pass the user's specific question now)
    const result = await getFinancialAdvice(expenses, debts, userMessage);

    // 3. Add AI response to the screen
    setChatHistory(prev => [...prev, { role: 'ai', text: result }]);
    setLoading(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl flex flex-col h-[500px] shadow-lg border border-indigo-100 dark:border-indigo-900/30 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b dark:border-slate-700 flex items-center gap-2 bg-indigo-50/50 dark:bg-indigo-900/10">
        <Sparkles className="text-indigo-500 w-5 h-5" />
        <h2 className="font-bold dark:text-white">AI Financial Coach</h2>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.length === 0 && !loading && (
          <div className="text-center py-10 text-slate-400 text-sm">
            Ask me anything about your spending or debts!
          </div>
        )}
        
        {chatHistory.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-slate-100 dark:bg-slate-700 dark:text-slate-200 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-indigo-500 animate-spin" />
              <span className="text-xs text-slate-500">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 border-t dark:border-slate-700 bg-white dark:bg-slate-800 flex gap-2">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Can I afford a €20 pizza?"
          className="flex-1 bg-slate-50 dark:bg-slate-900 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white"
        />
        <button 
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl transition-colors disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default Coach;