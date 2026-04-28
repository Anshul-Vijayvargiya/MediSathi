import React, { useState } from 'react';
import { Bell, CheckCircle2, AlertTriangle, Pill, Activity, Calendar, Filter, Trash2, Check } from 'lucide-react';

const Notifications = () => {
  const [filter, setFilter] = useState('All');
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'alert', title: 'Missed Dose: Metformin', time: '2 hours ago', read: false, icon: AlertTriangle, color: 'rose' },
    { id: 2, type: 'success', title: 'Weekly Adherence Goal Met!', time: 'Yesterday', read: true, icon: Activity, color: 'emerald' },
    { id: 3, type: 'info', title: 'Upcoming Refill: Lisinopril', time: '2 days ago', read: true, icon: Pill, color: 'amber' },
    { id: 4, type: 'schedule', title: 'Schedule Updated by Dr. Jenkins', time: '1 week ago', read: true, icon: Calendar, color: 'blue' },
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filtered = filter === 'All' ? notifications : filter === 'Unread' ? notifications.filter(n => !n.read) : notifications.filter(n => n.type === filter.toLowerCase());

  return (
    <div className="space-y-6 pb-20 animate-fade-in max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Notifications Center</h1>
          <p className="text-slate-400">Stay updated on your health and schedule.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={markAllRead} className="btn-secondary py-2 flex items-center gap-2"><Check size={16}/> Mark All Read</button>
          <button onClick={clearAll} className="btn-secondary py-2 flex items-center gap-2 text-rose-400 hover:bg-rose-500 hover:text-white border-rose-500/30"><Trash2 size={16}/> Clear All</button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-light flex gap-2 overflow-x-auto">
          {['All', 'Unread', 'Alert', 'Success', 'Info'].map(f => (
            <button 
              key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === f ? 'bg-[#4FACFE] text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="divide-y divide-light">
          {filtered.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <Bell className="text-slate-600 mb-4" size={48} />
              <h3 className="text-lg font-medium text-white mb-1">No notifications</h3>
              <p className="text-slate-400 text-sm">You're all caught up!</p>
            </div>
          ) : (
            filtered.map(n => {
              const Icon = n.icon;
              const colorMap = { rose: 'text-rose-500 bg-rose-500/10 border-rose-500/20', emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20', blue: 'text-[#4FACFE] bg-[#4FACFE]/10 border-[#4FACFE]/20' };
              const cClass = colorMap[n.color];

              return (
                <div key={n.id} className={`p-4 hover:bg-white/5 transition-colors cursor-pointer flex items-start gap-4 ${!n.read ? 'bg-white/5' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${cClass}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${!n.read ? 'text-white font-bold' : 'text-slate-300'}`}>{n.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">{n.time}</p>
                  </div>
                  {!n.read && <div className="w-2.5 h-2.5 rounded-full bg-[#4FACFE] mt-2 shadow-[0_0_8px_rgba(79,172,254,0.8)]"></div>}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
