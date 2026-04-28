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
    <div className="min-h-screen flex items-center justify-center p-4 relative z-0 bg-[#0A0D14]">
      {/* Ambient Background Mesh */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <div className="absolute w-[600px] h-[600px] bg-[#6366F1] rounded-full mix-blend-screen filter blur-[150px] opacity-10 animate-pulse" />
      </div>

      <div className="w-full max-w-[420px] bg-[#141720] border border-white/5 rounded-3xl shadow-2xl relative z-10 flex flex-col overflow-hidden">
        
        {/* Sleek Header */}
        <div className="p-8 pb-6 flex flex-col items-center justify-center relative">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#6366F1]/10 to-transparent pointer-events-none" />
          
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 bg-gradient-to-br from-[#6366F1] to-[#818CF8] shadow-[0_8px_16px_rgba(99,102,241,0.3)] relative z-10">
            <Pill size={26} className="text-white" strokeWidth={2.5} />
          </div>
          
          <h1 className="text-2xl font-bold text-white tracking-tight mb-1 relative z-10">MediSaathi</h1>
          <p className="text-[#6366F1] text-[10px] font-bold uppercase tracking-widest relative z-10">Intelligent Companion</p>
        </div>

        <div className="px-8 pb-8">
          {/* Segmented Control */}
          <div className="flex bg-[#0A0D14] p-1 rounded-xl mb-8 border border-white/5">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all ${isLogin ? 'bg-[#1A1D28] text-white shadow-sm border border-white/5' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Login
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all ${!isLogin ? 'bg-[#1A1D28] text-white shadow-sm border border-white/5' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0A0D14] border border-white/5 rounded-xl px-4 py-3.5 text-sm text-white focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] outline-none transition-all placeholder-slate-600"
                  placeholder="Enter your name"
                />
              </div>
            )}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0A0D14] border border-white/5 rounded-xl px-4 py-3.5 text-sm text-white focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] outline-none transition-all placeholder-slate-600"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0A0D14] border border-white/5 rounded-xl px-4 py-3.5 text-sm text-white focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] outline-none transition-all placeholder-slate-600"
                placeholder="••••••••"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">I am a:</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Patient', 'Caregiver'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`py-3.5 rounded-xl border transition-all flex items-center justify-center gap-2 text-sm font-bold ${role === r ? 'border-[#6366F1] bg-[#6366F1]/10 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'border-white/5 bg-[#0A0D14] text-slate-400 hover:border-white/10 hover:text-slate-300'}`}
                    >
                      {r === 'Patient' ? <Heart size={16} /> : <ShieldCheck size={16} />}
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button type="submit" className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white flex items-center justify-center py-4 text-sm font-bold rounded-xl mt-6 shadow-[0_8px_20px_rgba(99,102,241,0.25)] transition-all">
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight size={16} className="ml-2" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
              Hint: Use "care" in email for Caregiver role demo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
