import React, { useState, useEffect } from 'react';

import { motion } from 'framer-motion';
import { Users, AlertCircle, TrendingUp, Phone, MessageCircle, Calendar, ChevronRight, Activity } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const CaregiverDashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [patients, setPatients] = useState([
    { id: 1, name: 'Alice Johnson', age: 72, status: 'On Track', adherence: 95, missed: 0, lastTaken: '2 hours ago', color: '#059669' },
    { id: 2, name: 'Robert Smith', age: 78, status: 'Missed Dose', adherence: 65, missed: 3, lastTaken: 'Yesterday', color: '#f43f5e' },
    { id: 3, name: 'Mary Wilson', age: 65, status: 'On Track', adherence: 100, missed: 0, lastTaken: '1 hour ago', color: '#059669' },
  ]);

  useEffect(() => {
    const fetchPatients = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch('http://localhost:5000/api/caregiver/patients', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setPatients(data.map(p => ({
              ...p,
              age: Math.floor(Math.random() * 20) + 60, // Mock age as it's not in DB
              status: p.missedCount > 0 ? 'Missed Dose' : 'On Track',
              adherence: 100 - (p.missedCount * 10), // Mock adherence calculation
              missed: p.missedCount,
              lastTaken: '2 hours ago',
              color: p.missedCount > 0 ? '#f43f5e' : '#059669'
            })));
          }
        }
      } catch (err) {
        console.error('Error fetching caregiver patients:', err);
      }
    };

    fetchPatients();
  }, []);

  const historyData = [
    { day: 'Mon', alice: 100, robert: 60 },
    { day: 'Tue', alice: 100, robert: 40 },
    { day: 'Wed', alice: 80, robert: 70 },
    { day: 'Thu', alice: 100, robert: 50 },
    { day: 'Fri', alice: 100, robert: 80 },
    { day: 'Sat', alice: 100, robert: 60 },
    { day: 'Sun', alice: 100, robert: 40 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Caregiver Hub</h1>
          <p className="text-slate-500">Monitoring {patients.length} patients in real-time</p>
        </div>
        <div className="flex gap-2">
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-slate-600">Live Updates Active</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Patient Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider px-2">Patient List</h3>
          {patients.map((p) => (
            <motion.button
              key={p.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedPatient(p)}
              className={`w-full glass-card p-4 text-left border-2 transition-all ${selectedPatient?.id === p.id ? 'border-emerald-600 ring-2 ring-emerald-500/20' : 'border-transparent'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-slate-600">{p.name[0]}</span>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${p.status === 'On Track' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                  {p.status}
                </span>
              </div>
              <h4 className="font-bold text-slate-800">{p.name}</h4>
              <p className="text-xs text-slate-400 mb-3">{p.age} years old</p>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="h-full transition-all duration-500" style={{ width: `${p.adherence}%`, backgroundColor: p.color }}></div>
              </div>
              <div className="flex justify-between mt-1 text-[10px] font-bold text-slate-500">
                <span>ADHERENCE</span>
                <span>{p.adherence}%</span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {!selectedPatient ? (
            <div className="glass-card h-[60vh] flex flex-col items-center justify-center text-center p-12">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mb-6">
                <Users size={40} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Select a patient to monitor</h2>
              <p className="text-slate-500 max-w-md mx-auto">Get real-time insights into medication adherence, missed dose alerts, and historical trends for each patient in your care.</p>
            </div>
          ) : (
            <>
              {/* Patient Header Card */}
              <div className="glass-card p-8 flex flex-col md:flex-row justify-between items-center gap-6 border-b-4" style={{ borderColor: selectedPatient.color }}>
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center text-3xl">
                    {selectedPatient.name[0]}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-800">{selectedPatient.name}</h2>
                    <p className="text-slate-500 flex items-center gap-2">
                      <Activity size={16} className="text-emerald-500" />
                      Status: <span className="font-bold" style={{ color: selectedPatient.color }}>{selectedPatient.status}</span>
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="p-4 bg-emerald-600 text-white rounded-2xl shadow-lg hover:shadow-emerald-500/30 transition-all">
                    <Phone size={24} />
                  </button>
                  <button className="p-4 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all">
                    <MessageCircle size={24} />
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Weekly Adherence</p>
                  <p className="text-3xl font-bold text-slate-800">{selectedPatient.adherence}%</p>
                  <div className="mt-4 h-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={historyData}>
                        <Area type="monotone" dataKey={selectedPatient.id === 1 ? 'alice' : 'robert'} stroke={selectedPatient.color} fill={selectedPatient.color} fillOpacity={0.1} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="glass-card p-6">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Missed Doses</p>
                  <p className="text-3xl font-bold text-rose-600">{selectedPatient.missed}</p>
                  <p className="text-xs text-slate-400 mt-2">In the last 7 days</p>
                  {selectedPatient.missed > 0 && (
                    <div className="mt-4 p-2 bg-rose-50 text-rose-700 text-[10px] font-bold rounded-lg flex items-center gap-2">
                      <AlertCircle size={14} /> PERSISTENT NON-ADHERENCE
                    </div>
                  )}
                </div>

                <div className="glass-card p-6">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Last Logged</p>
                  <p className="text-2xl font-bold text-slate-800">{selectedPatient.lastTaken}</p>
                  <p className="text-xs text-slate-400 mt-2">Morning Metformin 500mg</p>
                  <button className="w-full mt-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50">View Full History</button>
                </div>
              </div>

              {/* AI Alerts Section */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="text-emerald-600" />
                  <h3 className="text-lg font-bold">AI Risk Assessment</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 mb-2 uppercase">Risk Level</p>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${selectedPatient.missed > 2 ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'bg-emerald-500'}`}></div>
                      <span className="font-bold text-slate-800">{selectedPatient.missed > 2 ? 'High Risk' : 'Low Risk'}</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <p className="text-xs font-bold text-emerald-700 mb-1 uppercase">Recommendation</p>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      {selectedPatient.missed > 2 
                        ? "Patient is struggling with evening doses. Recommend phone intervention at 8:00 PM."
                        : "Adherence is optimal. Continue routine monitoring."}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaregiverDashboard;
