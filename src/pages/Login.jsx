import React, { useState } from 'react';
import { Pill, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

const Login = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Patient');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/auth/${isLogin ? 'login' : 'register'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isLogin ? { email, password } : { name, email, password, role })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        setUser(data.user);
      } else {
        alert(data.message || 'Authentication failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      // Fallback for demo if server is not running
      const mockUser = {
        id: 1,
        name: isLogin ? 'John Doe' : name,
        email,
        role: isLogin ? (email.includes('care') ? 'Caregiver' : 'Patient') : role
      };
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', 'mock_token');
      setUser(mockUser);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md overflow-hidden flex flex-col">
        <div className="p-8 bg-gradient-to-br from-emerald-600 to-teal-700 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
            <Pill size={32} />
          </div>
          <h1 className="text-3xl brand mb-2">MediSathi AI</h1>
          <p className="text-emerald-100 opacity-90">Intelligent Medication Companion</p>
        </div>

        <div className="p-8">
          <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${isLogin ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500'}`}
            >
              Login
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${!isLogin ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500'}`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter your name"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">I am a:</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Patient', 'Caregiver'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`py-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${role === r ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
                    >
                      {r === 'Patient' ? <Heart size={18} /> : <ShieldCheck size={18} />}
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button type="submit" className="w-full btn-primary justify-center py-4 text-lg mt-4">
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-400 text-sm">
              Hint: Use "care" in email for Caregiver role demo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
