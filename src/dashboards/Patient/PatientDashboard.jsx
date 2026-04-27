import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, AlertTriangle, MessageSquare, Volume2, Plus, TrendingUp, Calendar, Pill, Camera } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from 'recharts';
import OCRScanner from '../../components/OCRScanner';

const PatientDashboard = () => {
  const [meds, setMeds] = useState([
    { id: 1, name: 'Metformin', dosage: '500mg', time: '08:00 AM', status: 'Taken', color: '#059669' },
    { id: 2, name: 'Lisinopril', dosage: '10mg', time: '09:00 AM', status: 'Taken', color: '#059669' },
    { id: 3, name: 'Atorvastatin', dosage: '20mg', time: '02:00 PM', status: 'Pending', color: '#3b82f6' },
    { id: 4, name: 'Vitamin D3', dosage: '1000IU', time: '08:00 PM', status: 'Pending', color: '#3b82f6' },
  ]);
  const [aiInsight, setAiInsight] = useState({
    recommendation: 'Your adherence is high this week—keep it up!',
    riskScore: 'Low',
    nextAction: 'Take your next dose in 1 hour'
  });
  const [isOcrOpen, setIsOcrOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const medRes = await fetch('http://localhost:5000/api/medications', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (medRes.ok) {
          const medData = await medRes.json();
          if (medData.length > 0) {
            setMeds(medData.map(m => ({
              ...m,
              time: m.frequency,
              status: 'Pending',
              color: '#3b82f6'
            })));
          }
        }

        const aiRes = await fetch('http://localhost:5000/api/ai/analysis', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (aiRes.ok) {
          const aiData = await aiRes.json();
          setAiInsight(aiData);
        }
      } catch (err) {
        console.error('Error fetching patient data:', err);
      }
    };

    fetchData();
  }, []);

  const adherenceData = [
    { day: 'Mon', rate: 100 },
    { day: 'Tue', rate: 80 },
    { day: 'Wed', rate: 100 },
    { day: 'Thu', rate: 60 },
    { day: 'Fri', rate: 100 },
    { day: 'Sat', rate: 100 },
    { day: 'Sun', rate: 75 },
  ];

  const stats = [
    { name: 'Taken', value: 3, color: '#059669' },
    { name: 'Pending', value: 2, color: '#e2e8f0' },
  ];

  const handleMarkAsTaken = (id) => {
    setMeds(meds.map(m => m.id === id ? { ...m, status: 'Taken', color: '#059669' } : m));
    if ('speechSynthesis' in window) {
      const msg = new SpeechSynthesisUtterance('Medication marked as taken. Well done!');
      window.speechSynthesis.speak(msg);
    }
  };

  return (
    <>
      <div className="space-y-6 animate-fade-in">
        {/* AI Action Card */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 rounded-[2rem] text-white shadow-lg flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 bg-white/20 w-fit px-3 py-1 rounded-full text-sm backdrop-blur-sm">
              <TrendingUp size={16} />
              <span>AI INSIGHT: {aiInsight.riskScore} Risk</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">{aiInsight.nextAction}</h2>
            <p className="text-emerald-50 text-lg">{aiInsight.recommendation}</p>
          </div>
          <button className="bg-white text-emerald-700 px-6 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-emerald-50 transition-colors shadow-xl">
            <Volume2 size={24} />
            Read Instructions
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Schedule */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl flex items-center gap-2">
                  <Clock className="text-emerald-600" />
                  Today's Schedule
                </h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsOcrOpen(true)}
                    className="bg-emerald-50 text-emerald-600 font-medium flex items-center gap-2 hover:bg-emerald-100 px-4 py-2 rounded-xl transition-all"
                  >
                    <Camera size={18} /> 
                    <span className="hidden sm:inline">Scan Prescription</span>
                  </button>
                  <button className="text-emerald-600 font-medium flex items-center gap-1 hover:bg-emerald-50 px-3 py-1 rounded-lg">
                    <Plus size={18} /> Add New
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                {meds.map((med, index) => (
                  <motion.div 
                    key={med.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${med.status === 'Taken' ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-50 hover:border-slate-200'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white`} style={{ backgroundColor: med.color }}>
                        <Pill size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{med.name} {med.dosage}</h4>
                        <p className="text-slate-400 text-sm flex items-center gap-1">
                          <Clock size={14} /> {med.time}
                        </p>
                      </div>
                    </div>
                    
                    {med.status === 'Taken' ? (
                      <div className="bg-emerald-500 text-white p-2 rounded-full shadow-md">
                        <Check size={20} />
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleMarkAsTaken(med.id)}
                        className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl font-semibold hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                      >
                        Mark Taken
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="text-emerald-600" />
                  7-Day Adherence
                </h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={adherenceData}>
                      <XAxis dataKey="day" axisLine={false} tickLine={false} />
                      <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="rate" radius={[6, 6, 0, 0]}>
                        {adherenceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.rate === 100 ? '#059669' : '#fbbf24'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Calendar className="text-emerald-600" />
                  Refill Alerts
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-amber-900">Metformin</p>
                      <p className="text-xs text-amber-700">Runs out in 5 days</p>
                    </div>
                    <button className="ml-auto bg-amber-600 text-white text-xs px-3 py-1 rounded-md">Refill</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Progress & Caregiver */}
          <div className="space-y-6">
            <div className="glass-card p-6 text-center">
              <h3 className="text-lg font-bold mb-4">Daily Progress</h3>
              <div className="relative h-48 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-slate-800">60%</span>
                  <span className="text-xs text-slate-400">3 of 5 Taken</span>
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-4 italic">“Consistency is your best medicine.”</p>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-bold mb-4">Caregiver Linked</h3>
              <div className="flex items-center gap-4 mb-4">
                <img src="https://ui-avatars.com/api/?name=Jane+Doe&background=7c3aed&color=fff" className="w-12 h-12 rounded-full" alt="Caregiver" />
                <div>
                  <p className="font-bold text-slate-800">Jane Doe</p>
                  <p className="text-xs text-slate-400">Primary Caregiver</p>
                </div>
                <button className="ml-auto w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-100">
                  <MessageSquare size={20} />
                </button>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl text-xs text-slate-500">
                Jane is notified when you miss a dose. Mode: <span className="text-emerald-600 font-bold">Active Care</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <OCRScanner 
        isOpen={isOcrOpen} 
        onClose={() => setIsOcrOpen(false)} 
        onSave={(newMeds) => {
          const formattedMeds = newMeds.map((m, i) => ({
            id: Date.now() + i,
            name: m.name,
            dosage: m.dosage,
            time: m.frequency,
            status: 'Pending',
            color: '#3b82f6'
          }));
          setMeds([...formattedMeds, ...meds]);
        }} 
      />
    </>
  );
};

export default PatientDashboard;
