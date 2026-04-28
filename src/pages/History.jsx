import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Download, ChevronLeft, ChevronRight, Activity, TrendingUp } from 'lucide-react';

const History = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const canvasRef = useRef(null);

  // Generate mock calendar data
  const generateMonthData = () => {
    const daysInMonth = 30; // Mock 30 days
    const data = [];
    for (let i = 1; i <= daysInMonth; i++) {
      let status = 'future';
      if (i < 25) {
        const rand = Math.random();
        if (rand > 0.3) status = 'full';
        else if (rand > 0.1) status = 'partial';
        else status = 'missed';
      }
      data.push({
        day: i,
        status,
        date: new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), i)
      });
    }
    return data;
  };

  const days = generateMonthData();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Pad the beginning of the calendar grid (assuming month starts on a Tuesday for mock)
  const paddedDays = [null, null, ...days];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    const mockData = [70, 85, 90, 100, 60, 80, 95, 100];
    const gap = 6;
    const barWidth = (width - (gap * (mockData.length - 1))) / mockData.length;
    
    mockData.forEach((val, i) => {
      const x = i * (barWidth + gap);
      const barHeight = (val / 100) * (height - 30);
      const y = height - 20 - barHeight;
      
      // Select color based on value
      let baseColor = '244, 63, 94'; // danger
      if (val >= 80) baseColor = '16, 185, 129'; // success
      else if (val >= 50) baseColor = '245, 158, 11'; // warning
      
      // Draw subtle gradient fill underneath the bar
      const fillGradient = ctx.createLinearGradient(0, y, 0, height - 20);
      fillGradient.addColorStop(0, `rgba(${baseColor}, 0.2)`);
      fillGradient.addColorStop(1, `rgba(${baseColor}, 0)`);
      
      ctx.fillStyle = fillGradient;
      ctx.beginPath();
      ctx.rect(x - gap/2, y, barWidth + gap, height - 20 - y);
      ctx.fill();

      // Draw shadow/glow
      ctx.shadowColor = `rgb(${baseColor})`;
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 0;
      
      // Draw bar with rounded top only
      ctx.fillStyle = `rgb(${baseColor})`;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, [6, 6, 0, 0]);
      ctx.fill();
      
      // Reset shadow for text
      ctx.shadowBlur = 0;
      
      // Draw label
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = '600 11px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(`W${i+1}`, x + barWidth / 2, height - 2);
      
      // Draw value text inside/above bar
      if (barHeight > 24) {
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.font = '700 12px "Space Mono"';
        ctx.fillText(`${val}%`, x + barWidth / 2, y + 16);
      }
    });
  }, []);

  return (
    <div className="space-y-8 animate-fade-in pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="page-title">History & Insights</h1>
          <p className="text-slate-400 text-sm">Track your adherence trends and detailed logs over time.</p>
        </div>
        <button className="btn-secondary px-4 py-2 flex items-center gap-2">
          <Download size={16} /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Calendar View */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 glass-card flex flex-col p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-base font-bold text-white flex items-center gap-2 tracking-wide">
              <CalendarIcon className="text-[#4FACFE]" size={20} />
              April 2026
            </h3>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors border border-white/5">
                <ChevronLeft size={16} />
              </button>
              <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors border border-white/5">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="grid grid-cols-7 gap-1.5 mb-3">
              {weekDays.map(d => (
                <div key={d} className="text-center font-semibold text-slate-500 uppercase tracking-widest" style={{ fontSize: '10px' }}>{d}</div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1.5">
              {paddedDays.map((d, i) => {
                if (!d) return <div key={`empty-${i}`} className="h-10 sm:h-12 md:h-[50px]" />;
                
                let bgStyle = { backgroundColor: 'rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.05)' };
                let dotColor = null;
                
                if (d.status === 'full') {
                  bgStyle = { backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(16, 185, 129, 0.2)' };
                  dotColor = '#10B981';
                }
                if (d.status === 'partial') {
                  bgStyle = { backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(245, 158, 11, 0.2)' };
                  dotColor = '#F59E0B';
                }
                if (d.status === 'missed') {
                  bgStyle = { backgroundColor: 'rgba(244, 63, 94, 0.1)', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(244, 63, 94, 0.2)' };
                  dotColor = '#F43F5E';
                }

                const isSelected = selectedDay?.date.getTime() === d.date.getTime();

                return (
                  <button
                    key={i}
                    disabled={d.status === 'future'}
                    onClick={() => setSelectedDay(d)}
                    className={`h-12 sm:h-14 md:h-[60px] rounded-xl flex flex-col items-center justify-center font-bold text-sm transition-all outline-none relative ${isSelected ? 'ring-2 ring-white scale-105 shadow-lg' : 'hover:scale-105 hover:bg-white/10'} ${d.status === 'future' ? '' : 'cursor-pointer'}`}
                    style={bgStyle}
                  >
                    <span>{d.day}</span>
                    {dotColor && (
                      <div className="w-1.5 h-1.5 rounded-full mt-1 shadow-sm" style={{ backgroundColor: dotColor, boxShadow: `0 0 8px ${dotColor}` }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-8 pt-6 border-t border-white/5">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400"><div className="w-3 h-3 rounded-md bg-[#22C55E] opacity-80" /> Taken</div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400"><div className="w-3 h-3 rounded-md bg-[#F59E0B] opacity-80" /> Partial</div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400"><div className="w-3 h-3 rounded-md bg-[#EF4444] opacity-80" /> Missed</div>
          </div>
        </motion.div>

        <div className="space-y-6 lg:col-span-1">
          {/* Trends */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
            <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2 tracking-wide">
              <TrendingUp className="text-[#4FACFE]" size={20} />
              8-Week Trend
            </h3>
            <div className="h-48 w-full flex items-end">
              <canvas ref={canvasRef} width={400} height={200} className="w-full h-full" />
            </div>
          </motion.div>

          {/* Selected Day Details */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
            <h3 className="text-base font-bold text-white mb-2 tracking-wide">Daily Log</h3>
            <p className="text-slate-400 text-sm mb-6">{selectedDay ? `Details for April ${selectedDay.day}, 2026` : 'Select a day to view log'}</p>
            
            {!selectedDay ? (
              <div className="h-32 flex items-center justify-center border border-dashed border-white/10 rounded-2xl bg-white/5">
                <span className="text-slate-500 text-sm">No day selected</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white">Metformin 500mg</h4>
                    <p className="text-xs text-slate-500 mt-0.5">8:00 AM</p>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-emerald-500/20">Taken</span>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white">Atorvastatin 20mg</h4>
                    <p className="text-xs text-slate-500 mt-0.5">2:00 PM</p>
                  </div>
                  <span className={`px-2.5 py-1 ${selectedDay.status === 'full' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'} text-[10px] font-bold uppercase tracking-wider rounded-lg border`}>
                    {selectedDay.status === 'full' ? 'Taken' : 'Missed'}
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default History;
