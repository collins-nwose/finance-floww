import { useState } from 'react';
import { supabase } from './supabase';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    setLoading(true);
    await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
  };

  const signUp = async () => {
    setLoading(true);
    await supabase.auth.signUp({ email, password });
    setLoading(false);
  };

  return (
   // Change this line in Auth.jsx
<div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900" 
     style={{ backgroundColor: 'red', minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-center">FinanceFlow Login</h2>

        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-4 p-2 border rounded"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />

        <button
          onClick={signIn}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded mb-2"
        >
          Sign In
        </button>

        <button
          onClick={signUp}
          disabled={loading}
          className="w-full bg-slate-700 text-white py-2 rounded"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
