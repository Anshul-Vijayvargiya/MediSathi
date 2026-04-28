import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, Clock, AlertTriangle, Volume2, 
  TrendingUp, Camera, Bell, Activity, Target, Flame, X, Coffee, Pill
} from 'lucide-react';
import OCRScanner from '../../components/OCRScanner';

const AdherenceRing = ({ percentage, dosesTaken, totalDoses, nextMedTimer }) => {
  const [offset, setOffset] = useState(502.65);
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  
  let color = 'var(--danger)';
  if (percentage >= 80) color = 'var(--success)';
  else if (percentage >= 50) color = 'var(--warning)';

  useEffect(() => {
    setTimeout(() => {
      setOffset(circumference - (percentage / 100) * circumference);
    }, 300);
  }, [percentage, circumference]);

  return (
    <div className="relative w-56 h-56 mx-auto flex items-center justify-center group">
      {/* Outer Glow */}
      <div className="absolute inset-0 rounded-full blur-[30px] opacity-20 transition-opacity duration-1000 group-hover:opacity-40" style={{ backgroundColor: color }} />
      
      <svg className="w-full h-full transform -rotate-90 relative z-10 drop-shadow-xl">
        <circle 
          cx="112" cy="112" r={radius} 
          stroke="var(--border-light)" 
          strokeWidth="8" fill="none" 
        />
        <circle 
          cx="112" cy="112" r={radius} 
          stroke={color} 
          strokeWidth="12" fill="none" 
          strokeLinecap="round"
          style={{ strokeDasharray: circumference, strokeDashoffset: offset, transition: 'stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center relative z-20">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Next Dose</span>
        <span className="text-3xl font-bold mono text-white tracking-tight">
          {nextMedTimer.split(':')[0]}:{nextMedTimer.split(':')[1]}
        </span>
        <span className="text-xs text-slate-500 font-medium mt-1">{percentage}% Adherence</span>
      </div>
    </div>
  );
};

const CountUp = ({ end, duration }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return <span>{count}</span>;
};

const QuickStatChip = ({ icon: Icon, value, label, colorClass, bgClass, suffix = '' }) => (
  <div className="card stat-card">
    <div className="flex justify-between items-start">
      <span className="label">{label}</span>
      <div className={`icon ${bgClass} ${colorClass}`}>
        <Icon size={18} strokeWidth={2.5} />
      </div>
    </div>
    <div className="value">
      {typeof value === 'number' ? <CountUp end={value} duration={1} /> : value}
      {suffix && <span className="text-2xl text-slate-500 font-semibold ml-1">{suffix}</span>}
    </div>
  </div>
);

const PatientDashboard = () => {
  const [meds, setMeds] = useState([
    { id: 1, name: 'Metformin', dosage: '500mg', time: '08:00 AM', status: 'Taken', color: 'var(--primary-dark)', instruction: 'After Meal', type: 'Morning' },
    { id: 2, name: 'Lisinopril', dosage: '10mg', time: '09:00 AM', status: 'Taken', color: 'var(--success)', instruction: 'Before Meal', type: 'Morning' },
    { id: 3, name: 'Atorvastatin', dosage: '20mg', time: '02:00 PM', status: 'Overdue', color: 'var(--danger)', instruction: 'With Food', type: 'Afternoon' },
    { id: 4, name: 'Vitamin D3', dosage: '1000IU', time: '08:00 PM', status: 'Upcoming', color: 'var(--warning)', instruction: 'After Meal', type: 'Evening' },
  ]);
  const [isOcrOpen, setIsOcrOpen] = useState(false);
  const [nextMedTimer, setNextMedTimer] = useState('02:15:30');

  const adherenceStats = {
    today: 50,
    dosesTaken: 2,
    totalDoses: 4,
    weeklyAvg: 85,
    streak: 12,
    missedThisMonth: 3
  };

  const handleAction = (id, action) => {
    setMeds(meds.map(m => {
      if (m.id === id) {
        let newStatus = m.status;
        if (action === 'take') newStatus = 'Taken';
        if (action === 'snooze') newStatus = 'Snoozed';
        if (action === 'skip') newStatus = 'Skipped';
        return { ...m, status: newStatus };
      }
      return m;
    }));
  };

  const allDone = meds.every(m => m.status === 'Taken' || m.status === 'Skipped');

  return (
    <div className="animate-fade-in max-w-6xl mx-auto w-full">
      
      {/* AI Insight Banner */}
      <div className="insight-banner">
        <div className="left flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#6366F1]/20 flex items-center justify-center">
            <TrendingUp size={20} className="text-[#6366F1]" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-base mb-0.5">Your adherence is looking strong.</h2>
            <p className="text-slate-400 text-[14px]">You're on a 12-day streak. Take Atorvastatin soon to maintain your perfect score.</p>
          </div>
        </div>
        <div className="right">
          <button className="btn-secondary flex items-center gap-2">
            <Volume2 size={16} className="text-[#6366F1]" />
            Play Audio Guide
          </button>
        </div>
      </div>

      {/* Massive Stats Bar */}
      <div className="stats-row">
        <QuickStatChip icon={Target} value={adherenceStats.today} suffix="%" label="Today's Score" colorClass="text-[#6366F1]" bgClass="bg-[#6366F1]/10" />
        <QuickStatChip icon={Activity} value={adherenceStats.weeklyAvg} suffix="%" label="Weekly Avg" colorClass="text-emerald-500" bgClass="bg-emerald-500/10" />
        <QuickStatChip icon={Flame} value={adherenceStats.streak} label="Day Streak" colorClass="text-amber-500" bgClass="bg-amber-500/10" />
      </div>

      <div className="dashboard-grid">
        {/* Left Col: Schedule */}
        <div className="card schedule-card flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="page-title !mb-1 !text-2xl">Today's Schedule</h3>
              <p className="accent-label">4 medications remaining</p>
            </div>
            <button 
              onClick={() => setIsOcrOpen(true)}
              className="btn-primary"
            >
              <Camera size={16} className="mr-2" /> 
              <span>Scan Rx</span>
            </button>
          </div>
          
          <div className="flex flex-col">
              {allDone ? (
                <div className="m-auto text-center py-12">
                  <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <Check size={40} strokeWidth={2} />
                  </div>
                  <h3 className="text-2xl font-light text-white mb-2">All done for today!</h3>
                  <p className="text-slate-500 text-sm">You have successfully completed your schedule.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {meds.map((med, index) => {
                    let dotColor = 'bg-slate-500';
                    let trClass = '';
                    
                    if (med.status === 'Taken') { dotColor = 'bg-status-green'; }
                    else if (med.status === 'Pending') { dotColor = 'bg-[#6366F1]'; }
                    else if (med.status === 'Overdue') { dotColor = 'bg-rose-500'; trClass = 'status-overdue'; }
                    else if (med.status === 'Snoozed') { dotColor = 'bg-status-amber'; }

                    return (
                      <div key={med.id} className={`dose-row hover:bg-white/[0.02] transition-colors rounded-xl ${trClass}`}>
                        {/* Time */}
                        <div className="flex flex-col">
                          <span className="font-semibold text-white mono text-[15px]">{med.time.split(' ')[0]}</span>
                          <span className="accent-label !text-[10px]">{med.time.split(' ')[1]}</span>
                        </div>
                        
                        {/* Dot */}
                        <div className={`w-2 h-2 rounded-full ${dotColor} shadow-sm justify-self-center`} />
                        
                        {/* Medicine */}
                        <div className="flex flex-col justify-center">
                          <h4 className="font-bold text-white text-[15px] flex items-center gap-2">
                            {med.name} 
                            <span className="accent-label !text-[10px] bg-white/5 px-1.5 py-0.5 rounded border border-white/5">{med.dosage}</span>
                          </h4>
                          <div className="text-[14px] text-[#a1a1aa] mt-0.5">
                            {med.instruction}
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-3">
                          {med.status === 'Taken' && (
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                              <Check size={14} strokeWidth={3} /> Taken
                            </span>
                          )}
                          
                          {med.status === 'Overdue' && (
                            <span className="text-xs font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5 animate-pulse bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20">
                              <AlertTriangle size={14} /> Overdue
                            </span>
                          )}

                          {med.status !== 'Taken' && (
                            <div className="flex items-center gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => handleAction(med.id, 'take')}
                                className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all border border-emerald-500/20 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                              >
                                <Check size={14} strokeWidth={2.5} /> Take
                              </button>
                              <button 
                                onClick={() => handleAction(med.id, 'snooze')}
                                className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors border border-white/5"
                                title="Snooze"
                              >
                                <Clock size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
        </div>

        {/* Right Col: Super Component */}
        <div className="right-panel h-full">
          <div className="card ring-card flex-1 justify-center relative">
            <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
              <h3 className="accent-label">Status</h3>
              <button className="text-slate-400 hover:text-white transition-colors">
                <Bell size={16} />
              </button>
            </div>

            <AdherenceRing 
              percentage={adherenceStats.today} 
              dosesTaken={adherenceStats.dosesTaken} 
              totalDoses={adherenceStats.totalDoses}
              nextMedTimer={nextMedTimer}
            />
          </div>

          <div className="card upnext-card mt-auto shrink-0">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 border border-rose-500/20">
              <Pill size={24} strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1 ml-2">
              <p className="accent-label !mb-1">Up Next</p>
              <h4 className="font-bold text-white text-[16px] truncate">Atorvastatin</h4>
              <p className="text-[14px] text-[#a1a1aa] mt-0.5 truncate">2:00 PM <span className="mx-1">•</span> 20mg</p>
            </div>
          </div>
        </div>
      </div>

      <OCRScanner isOpen={isOcrOpen} onClose={() => setIsOcrOpen(false)} onSave={() => setIsOcrOpen(false)} />
    </div>
  );
};

export default PatientDashboard;
