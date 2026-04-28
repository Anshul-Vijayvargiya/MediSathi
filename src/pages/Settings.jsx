import React, { useState } from 'react';
import { User, Smartphone, Globe, Shield, Download, Moon, Sun, ChevronRight, Lock, Monitor, LogOut, CheckCircle2, Sparkles, Palette } from 'lucide-react';
import { motion } from 'framer-motion';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [avatarColor, setAvatarColor] = useState('#6C63FF');
  const colors = ['#6C63FF', '#4FACFE', '#22C55E', '#F59E0B', '#EF4444', '#EC4899'];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="space-y-8 pb-24 max-w-5xl mx-auto overflow-hidden animate-fade-in">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10"
      >
        <div>
          <h1 className="page-title">Account Settings</h1>
          <p className="text-slate-400 text-sm">Manage your profile, preferences, and security.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Left Column: Profile */}
        <motion.div 
          variants={containerVariants} initial="hidden" animate="show"
          className="lg:col-span-1 space-y-6"
        >
          <motion.div variants={itemVariants} className="card p-8 flex flex-col items-center text-center relative overflow-hidden group">
            {/* Soft Glow */}
            <div 
              className="absolute -top-10 -left-10 w-48 h-48 opacity-10 blur-[40px] pointer-events-none transition-all duration-700 group-hover:scale-125"
              style={{ backgroundColor: avatarColor }}
            />
            
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-6 shadow-sm ring-4 ring-white/5 relative z-10 transition-transform hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${avatarColor}, #2A2D3E)` }}
            >
              AV
            </div>
            
            <h2 className="text-xl font-bold text-white mb-1 relative z-10">Anshul Vijayvargiya</h2>
            <div className="flex items-center justify-center gap-2 mb-8 relative z-10">
              <span className="font-semibold text-xs text-slate-400">Patient Account</span>
              <div className="bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                Pro
              </div>
            </div>
            
            <button className="w-full btn-secondary py-2.5 text-sm">
              <User size={16} /> Edit Profile
            </button>
          </motion.div>

          <motion.div variants={itemVariants} className="card p-6">
            <h3 className="accent-label text-center mb-5">
              Theme Color
            </h3>
            <div className="flex gap-3 flex-wrap justify-center">
              {colors.map(c => (
                <button 
                  key={c}
                  onClick={() => setAvatarColor(c)}
                  className={`w-8 h-8 rounded-full transition-all duration-300 ${avatarColor === c ? 'ring-2 ring-white/30 scale-110 shadow-sm' : 'hover:scale-110 opacity-60 hover:opacity-100'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column: Settings */}
        <motion.div 
          variants={containerVariants} initial="hidden" animate="show"
          className="lg:col-span-2 space-y-6"
        >
          {/* Preferences */}
          <motion.div variants={itemVariants} className="card overflow-hidden !p-0">
            <div className="px-6 py-4 border-b border-light bg-white/[0.02] flex items-center gap-3">
              <Globe size={18} className="text-slate-400" />
              <h3 className="text-base font-bold text-white tracking-wide">Preferences</h3>
            </div>
            <div className="p-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 hover:bg-white/5 rounded-xl transition-colors gap-4 cursor-pointer group">
                <div>
                  <h4 className="font-medium text-white text-sm group-hover:text-[#6366F1] transition-colors">Language</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Select your preferred language</p>
                </div>
                <select className="w-full sm:w-auto bg-[#151821] border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-200 outline-none focus:border-[#6366F1] cursor-pointer">
                  <option>English (US)</option><option>हिंदी (Hindi)</option><option>मराठी (Marathi)</option><option>తెలుగు (Telugu)</option>
                </select>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 hover:bg-white/5 rounded-xl transition-colors gap-4 cursor-pointer group">
                <div>
                  <h4 className="font-medium text-white text-sm group-hover:text-[#6366F1] transition-colors">Dark Mode</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Toggle dark or light app theme</p>
                </div>
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative w-12 h-6 rounded-full transition-all duration-300 flex items-center px-1 shadow-inner ${darkMode ? 'bg-[#6366F1]' : 'bg-slate-700'}`}
                >
                  <motion.div layout className="w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-sm">
                  </motion.div>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Linked Devices */}
          <motion.div variants={itemVariants} className="card overflow-hidden !p-0">
            <div className="px-6 py-4 border-b border-light bg-white/[0.02] flex items-center gap-3">
              <Smartphone size={18} className="text-slate-400" />
              <h3 className="text-base font-bold text-white tracking-wide">Linked Devices</h3>
            </div>
            <div className="p-2">
              <div className="p-4 flex justify-between items-center hover:bg-white/5 rounded-xl transition-all group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-xl text-slate-400 group-hover:text-white transition-all"><Smartphone size={20} /></div>
                  <div>
                    <h4 className="font-medium text-white text-sm">iPhone 14 Pro</h4>
                    <p className="text-xs text-[#22C55E] font-semibold flex items-center gap-1.5 mt-0.5"><span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span> Active Now</p>
                  </div>
                </div>
                <button className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"><LogOut size={16}/></button>
              </div>
              <div className="p-4 flex justify-between items-center hover:bg-white/5 rounded-xl transition-all group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-xl text-slate-400 group-hover:text-white transition-all"><Monitor size={20} /></div>
                  <div>
                    <h4 className="font-medium text-white text-sm">MacBook Air M2</h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Last active: 2 days ago</p>
                  </div>
                </div>
                <button className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"><LogOut size={16}/></button>
              </div>
            </div>
          </motion.div>

          {/* Emergency Contact */}
          <motion.div variants={itemVariants} className="card overflow-hidden !p-0">
            <div className="px-6 py-4 border-b border-light bg-white/[0.02] flex items-center gap-3">
              <User size={18} className="text-slate-400" />
              <h3 className="text-base font-bold text-white tracking-wide">Emergency Contact</h3>
            </div>
            <div className="p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] gap-4 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-full bg-[#1A1D28] text-slate-300 flex items-center justify-center font-bold text-lg border border-white/10 shadow-inner">
                    SJ
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-2xl tracking-tight mb-1">Sarah Jenkins</h4>
                    <p className="text-sm text-slate-400 font-medium">Daughter <span className="mx-2 text-slate-600">•</span> +1 (555) 019-2834</p>
                  </div>
                </div>
                <button className="btn-secondary">
                  Update
                </button>
              </div>
            </div>
          </motion.div>

          {/* Data & Security */}
          <motion.div variants={itemVariants} className="card overflow-hidden !p-0">
            <div className="px-6 py-4 border-b border-light bg-white/[0.02] flex items-center gap-3">
              <Shield size={18} className="text-slate-400" />
              <h3 className="text-base font-bold text-white tracking-wide">Data & Security</h3>
            </div>
            <div className="p-2">
              <div className="p-4 flex justify-between items-center hover:bg-white/5 rounded-xl transition-all cursor-pointer group">
                <div className="flex flex-col">
                  <h4 className="font-medium text-white text-sm">Export Profile Data</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Download a JSON backup.</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-[#6366F1]/20 transition-all border border-white/5">
                  <Download size={14} />
                </div>
              </div>
              <div className="p-4 flex justify-between items-center hover:bg-white/5 rounded-xl transition-all cursor-pointer group">
                <div className="flex flex-col">
                  <h4 className="font-medium text-white text-sm">Change Security PIN</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Update your 4-digit access code.</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-white transition-all border border-white/5">
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
