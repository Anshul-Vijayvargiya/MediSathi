import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, AlertTriangle, TrendingUp, Search, ShieldCheck, ShieldAlert, ArrowRight, Zap, ShoppingCart } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, Tooltip, Cell } from 'recharts';

const CountUp = ({ end, duration }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return <span>{count}</span>;
};

const RiskGauge = ({ score }) => {
  const [offset, setOffset] = useState(251.2);
  const radius = 40;
  const circumference = Math.PI * radius; // Semi-circle

  useEffect(() => {
    setTimeout(() => {
      setOffset(circumference - (score / 100) * circumference);
    }, 300);
  }, [score, circumference]);

  return (
    <div className="relative w-48 h-24 mx-auto overflow-hidden">
      <svg className="w-full h-[200%]" viewBox="0 0 100 100">
        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" strokeLinecap="round" />
        <path 
          d="M 10 50 A 40 40 0 0 1 90 50" 
          fill="none" 
          stroke="url(#gauge-gradient)" 
          strokeWidth="12" 
          strokeLinecap="round"
          style={{ strokeDasharray: circumference, strokeDashoffset: offset, transition: 'stroke-dashoffset 1.5s ease-out' }}
        />
        <defs>
          <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute bottom-0 w-full text-center">
        <span className="text-3xl font-mono font-bold text-white"><CountUp end={score} duration={1.5} /></span>
        <span className="text-xs text-slate-400 block mt-1">Health Score</span>
      </div>
    </div>
  );
};

const Insights = () => {
  const [search1, setSearch1] = useState('');
  const [search2, setSearch2] = useState('');
  const [interactionResult, setInteractionResult] = useState(null);

  // Mock Data
  const patternData = [
    { hour: '06', misses: 1 }, { hour: '08', misses: 4 }, { hour: '12', misses: 2 }, 
    { hour: '14', misses: 5 }, { hour: '18', misses: 1 }, { hour: '20', misses: 3 }
  ];
  
  const predictionData = [
    { day: 1, val: 80 }, { day: 2, val: 85 }, { day: 3, val: 82 }, { day: 4, val: 90 },
    { day: 5, val: 95 }, { day: 6, val: 92 }, { day: 7, val: 96 }
  ];

  const handleApplyRecommendation = () => {
    localStorage.setItem('reminderShift', 'true');
    alert('Applied! Reminders for afternoon doses shifted by +30 mins.');
  };

  const checkInteraction = () => {
    if (!search1 || !search2) return;
    
    // Mock interaction logic
    if (search1.toLowerCase().includes('lisinopril') && search2.toLowerCase().includes('potassium')) {
      setInteractionResult({
        status: 'High Risk',
        color: 'rose',
        icon: ShieldAlert,
        description: 'Lisinopril can increase potassium levels in your blood. Taking potassium supplements with it may lead to dangerously high potassium levels (hyperkalemia).'
      });
    } else if (search1 && search2) {
      setInteractionResult({
        status: 'Safe',
        color: 'emerald',
        icon: ShieldCheck,
        description: 'No known major interactions between these medications. Always consult your doctor.'
      });
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">AI Insights</h1>
        <p className="text-slate-400">Smart analysis of your adherence patterns and medication risks.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Score Gauge */}
        <div className="card p-6 flex flex-col items-center justify-center text-center">
          <h2 className="text-lg font-bold text-white mb-6">Overall Adherence Score</h2>
          <RiskGauge score={85} />
          <p className="text-sm text-slate-400 mt-6">Your score is in the <span className="text-[#10b981] font-bold">Good</span> range. Keep it up!</p>
        </div>

        {/* Actionable Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pattern Card */}
          <div className="card p-6 border-t-4 border-[#4FACFE] flex flex-col">
            <h3 className="accent-label flex items-center gap-2 mb-4">
              <Activity size={16} className="text-[#4FACFE]" /> Pattern Detected
            </h3>
            <p className="text-white font-medium mb-4 flex-1">You tend to miss doses most frequently around <span className="text-[#4FACFE]">2:00 PM</span>.</p>
            <div className="h-24 w-full mt-auto">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={patternData}>
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#1C2033', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                  <Bar dataKey="misses" radius={[4, 4, 0, 0]}>
                    {patternData.map((entry, i) => (
                      <Cell key={i} fill={entry.hour === '14' ? '#4FACFE' : 'rgba(255,255,255,0.1)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recommendation Card */}
          <div className="card p-6 border-t-4 border-emerald-500 flex flex-col">
            <h3 className="accent-label flex items-center gap-2 mb-4">
              <Zap size={16} className="text-emerald-500" /> Smart Recommendation
            </h3>
            <p className="text-white font-medium mb-4 flex-1">Shift your afternoon reminders by 30 minutes to align better with your typical lunch hour.</p>
            <button onClick={handleApplyRecommendation} className="w-full btn-primary bg-emerald-500 hover:bg-emerald-600 border-none justify-center mt-auto">
              Apply Change
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interaction Checker */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <ShieldAlert className="text-amber-500" /> Drug Interaction Checker
          </h2>
          
          <div className="space-y-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Search first medication (e.g., Lisinopril)" 
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-amber-500 outline-none"
                value={search1} onChange={e => setSearch1(e.target.value)}
              />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Search second medication (e.g., Potassium)" 
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-amber-500 outline-none"
                value={search2} onChange={e => setSearch2(e.target.value)}
              />
            </div>
            <button onClick={checkInteraction} className="w-full btn-primary bg-amber-500 hover:bg-amber-600 justify-center">
              Check Interaction
            </button>
          </div>

          <AnimatePresence mode="wait">
            {interactionResult && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className={`p-4 rounded-xl border bg-${interactionResult.color}-500/10 border-${interactionResult.color}-500/30 flex gap-4`}
              >
                <interactionResult.icon size={24} className={`text-${interactionResult.color}-500 shrink-0 mt-1`} />
                <div>
                  <h4 className={`font-bold text-${interactionResult.color}-400 mb-1`}>{interactionResult.status}</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">{interactionResult.description}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Prediction Sparkline */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="text-[#6C63FF]" /> Future Prediction
          </h2>
          <p className="text-slate-400 mb-8">Based on recent patterns, your adherence is projected to reach <strong className="text-white">96%</strong> by end of week.</p>
          
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={predictionData}>
                <XAxis dataKey="day" hide />
                <Tooltip contentStyle={{ backgroundColor: '#1C2033', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="val" stroke="#6C63FF" strokeWidth={4} dot={{ r: 4, fill: '#1C2033', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Refill Forecast Table */}
      <div className="card overflow-hidden !p-0">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Refill Forecast</h2>
          <ShoppingCart className="text-slate-400" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-light">
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Medicine</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Stock Left</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Daily Dose</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Days Remaining</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Run-Out Date</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light">
              {[
                { name: 'Atorvastatin', stock: 5, daily: 1, days: 5, date: 'May 3, 2026', status: 'critical' },
                { name: 'Lisinopril', stock: 12, daily: 1, days: 12, date: 'May 10, 2026', status: 'warning' },
                { name: 'Metformin', stock: 45, daily: 2, days: 22, date: 'May 20, 2026', status: 'good' },
              ].map((item, i) => {
                const colorMap = { critical: 'rose', warning: 'amber', good: 'emerald' };
                const c = colorMap[item.status];
                return (
                  <tr key={i} className={`hover:bg-white/5 transition-colors ${item.status === 'critical' ? 'bg-rose-500/5' : ''}`}>
                    <td className="p-4 font-bold text-white">{item.name}</td>
                    <td className="p-4 font-mono text-center text-slate-300">{item.stock}</td>
                    <td className="p-4 font-mono text-center text-slate-400">{item.daily}</td>
                    <td className={`p-4 font-mono font-bold text-center text-${c}-400`}>{item.days}</td>
                    <td className="p-4 text-center text-slate-300">{item.date}</td>
                    <td className="p-4 text-right">
                      <button className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-colors ${item.status !== 'good' ? `bg-${c}-500/20 text-${c}-400 border-${c}-500/50 hover:bg-${c}-500 hover:text-white` : 'border-white/10 text-slate-400 hover:text-white'}`}>
                        {item.status !== 'good' ? 'Order Refill' : 'Stock OK'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Insights;
