import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, UserCheck, UserX, Share2, Phone, Bell, Check, 
  AlertTriangle, ShieldAlert, Activity, ChevronDown, ChevronUp, Clock, FileText 
} from 'lucide-react';

const CaregiverDashboard = () => {
  const [viewMode, setViewMode] = useState('caregiver'); // 'patient' or 'caregiver'
  const [expandedPatient, setExpandedPatient] = useState(null);
  const [showCallModal, setShowCallModal] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const caregivers = [
    { id: 1, name: 'Dr. Sarah Jenkins', relation: 'Primary Care', lastViewed: '2 hours ago', access: true, avatar: 'SJ' },
    { id: 2, name: 'Michael (Son)', relation: 'Family', lastViewed: 'Yesterday', access: true, avatar: 'M' },
    { id: 3, name: 'City Hospital', relation: 'Clinic', lastViewed: '1 week ago', access: false, avatar: 'CH' },
  ];

  const patients = [
    { 
      id: 1, name: 'Alice Johnson', age: 72, condition: 'Diabetes Type 2', 
      adherence: 95, lastActive: '10 mins ago', avatar: 'AJ',
      schedule: [
        { time: '08:00 AM', med: 'Metformin', status: 'Taken' },
        { time: '02:00 PM', med: 'Lisinopril', status: 'Upcoming' }
      ]
    },
    { 
      id: 2, name: 'Robert Smith', age: 78, condition: 'Hypertension', 
      adherence: 65, lastActive: 'Yesterday', avatar: 'RS',
      schedule: [
        { time: '09:00 AM', med: 'Amlodipine', status: 'Missed' },
        { time: '08:00 PM', med: 'Atorvastatin', status: 'Upcoming' }
      ]
    },
    { 
      id: 3, name: 'Mary Wilson', age: 65, condition: 'Osteoporosis', 
      adherence: 100, lastActive: '1 hour ago', avatar: 'MW',
      schedule: [
        { time: '08:00 AM', med: 'Alendronate', status: 'Taken' }
      ]
    },
  ];

  const getRiskBadge = (adherence) => {
    if (adherence >= 90) return { label: 'Low Risk', color: 'emerald' };
    if (adherence >= 70) return { label: 'Medium Risk', color: 'amber' };
    return { label: 'High Risk', color: 'rose' };
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#1C2033] border border-emerald-500/50 shadow-[0_10px_25px_rgba(16,185,129,0.2)] rounded-full px-6 py-3 flex items-center gap-3"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white"><Check size={14}/></div>
            <span className="font-bold text-white">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Caregiver Hub</h1>
          <p className="text-slate-400">Manage connections and monitor patient adherence.</p>
        </div>
        <div className="bg-[#1C2033] p-1 rounded-xl flex border border-white/10">
          <button 
            onClick={() => setViewMode('patient')} 
            className={`px-6 py-2 rounded-lg font-bold transition-all text-sm ${viewMode === 'patient' ? 'bg-[#4FACFE] text-white' : 'text-slate-400 hover:text-white'}`}
          >
            My Caregivers
          </button>
          <button 
            onClick={() => setViewMode('caregiver')} 
            className={`px-6 py-2 rounded-lg font-bold transition-all text-sm ${viewMode === 'caregiver' ? 'bg-[#4FACFE] text-white' : 'text-slate-400 hover:text-white'}`}
          >
            My Patients
          </button>
        </div>
      </div>

      {viewMode === 'patient' ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-[#1C2033] p-6 rounded-2xl border border-white/10">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Generate Adherence Report</h2>
              <p className="text-slate-400 text-sm">Download a summary PDF to share with your doctor.</p>
            </div>
            <button onClick={() => window.print()} className="btn-primary">
              <FileText size={20} /> Share Report
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {caregivers.map((c) => (
              <div key={c.id} className="glass-card p-6 flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white mb-4 ${c.access ? 'bg-gradient-to-br from-[#6C63FF] to-[#4FACFE]' : 'bg-slate-700'}`}>
                  {c.avatar}
                </div>
                <h3 className="text-lg font-bold text-white">{c.name}</h3>
                <p className="text-slate-400 text-sm mb-1">{c.relation}</p>
                <p className="text-xs text-slate-500 mb-6">Last viewed: {c.lastViewed}</p>
                
                <button className={`w-full py-2 rounded-xl flex items-center justify-center gap-2 font-bold transition-colors ${c.access ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white border border-emerald-500/20'}`}>
                  {c.access ? <><UserX size={18}/> Revoke Access</> : <><UserCheck size={18}/> Grant Access</>}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Patient List */}
          <div className="xl:col-span-2 space-y-4">
            {patients.map((p) => {
              const isExpanded = expandedPatient === p.id;
              const risk = getRiskBadge(p.adherence);
              
              return (
                <div key={p.id} className="glass-card overflow-hidden transition-all duration-300">
                  <div 
                    className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer hover:bg-white/5 transition-colors gap-4"
                    onClick={() => setExpandedPatient(isExpanded ? null : p.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {p.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-white">{p.name}</h3>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-${risk.color}-500/20 text-${risk.color}-400 border border-${risk.color}-500/30`}>
                            {risk.label}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400">{p.age} yrs • {p.condition}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 w-full md:w-auto mt-4 md:mt-0">
                      <div className="flex-1 md:w-32">
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-slate-400">Adherence</span>
                          <span className={`text-${risk.color}-400`}>{p.adherence}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                          <div className={`h-full bg-${risk.color}-500 rounded-full`} style={{ width: `${p.adherence}%` }} />
                        </div>
                      </div>
                      <div className="text-slate-400 hidden md:block">
                        {isExpanded ? <ChevronUp size={24}/> : <ChevronDown size={24}/>}
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/10 bg-black/20 overflow-hidden"
                      >
                        <div className="p-6">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-white flex items-center gap-2"><Activity size={18} className="text-[#4FACFE]"/> Today's Schedule</h4>
                            <div className="flex gap-2">
                              <button onClick={() => showToast(`Reminder sent to ${p.name}`)} className="btn-secondary py-1.5 px-3 text-sm flex items-center gap-2 bg-[#4FACFE]/10 text-[#4FACFE] border-[#4FACFE]/20 hover:bg-[#4FACFE] hover:text-white">
                                <Bell size={14}/> Remind
                              </button>
                              <button onClick={() => setShowCallModal(p)} className="btn-secondary py-1.5 px-3 text-sm flex items-center gap-2 bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500 hover:text-white">
                                <Phone size={14}/> Call
                              </button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            {p.schedule.map((s, i) => (
                              <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                                <div className="flex items-center gap-3">
                                  <div className="w-16 font-mono font-bold text-slate-400 text-sm">{s.time}</div>
                                  <div className="font-medium text-white">{s.med}</div>
                                </div>
                                <div className={`text-xs font-bold uppercase px-2 py-1 rounded ${s.status === 'Taken' ? 'bg-emerald-500/20 text-emerald-400' : s.status === 'Missed' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-500/20 text-slate-300'}`}>
                                  {s.status}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Alert Feed */}
          <div className="glass-card flex flex-col h-[600px]">
            <div className="p-6 border-b border-white/10 flex items-center gap-2">
              <AlertTriangle className="text-amber-500" size={20} />
              <h2 className="text-xl font-bold text-white">Alert Feed</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500 rounded-l-xl" />
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-white text-sm">Robert Smith missed dose</h4>
                  <span className="text-xs text-slate-500 font-mono">10:00 AM</span>
                </div>
                <p className="text-slate-400 text-xs">Amlodipine 10mg scheduled for 09:00 AM was not taken.</p>
              </div>
              
              <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 rounded-l-xl" />
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-white text-sm">Alice Johnson refill due</h4>
                  <span className="text-xs text-slate-500 font-mono">Yesterday</span>
                </div>
                <p className="text-slate-400 text-xs">Lisinopril supply drops below 5 days.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call Modal */}
      <AnimatePresence>
        {showCallModal && (
          <div className="modal-overlay" onClick={() => setShowCallModal(null)}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="modal-content text-center" onClick={e => e.stopPropagation()}
            >
              <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                <Phone size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Calling {showCallModal.name}...</h2>
              <p className="text-slate-400 font-mono text-lg mb-8">+1 (555) 019-2834</p>
              <button onClick={() => setShowCallModal(null)} className="w-full btn-primary bg-rose-500 hover:bg-rose-600 justify-center py-3">
                End Call
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CaregiverDashboard;
