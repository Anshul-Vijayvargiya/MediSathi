import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pill, Plus, Search, Filter, X, ChevronRight, ChevronLeft, Check, AlertCircle } from 'lucide-react';

const MOCK_MEDS = [
  { id: 1, name: 'Metformin', dosage: '500mg', condition: 'Diabetes', color: 'var(--primary-dark)', stock: 45, nextDose: 'Today 8:00 AM · After meal' },
  { id: 2, name: 'Lisinopril', dosage: '10mg', condition: 'Hypertension', color: 'var(--success)', stock: 12, nextDose: 'Today 9:00 AM · Before meal' },
  { id: 3, name: 'Atorvastatin', dosage: '20mg', condition: 'Cholesterol', color: 'var(--danger)', stock: 5, nextDose: 'Today 2:00 PM · With Food' },
  { id: 4, name: 'Vitamin D3', dosage: '1000IU', condition: 'Supplement', color: 'var(--warning)', stock: 60, nextDose: 'Today 8:00 PM · After meal' },
];

const COLORS = ['#6C63FF', '#4FACFE', '#22C55E', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6', '#14B8A6'];

const AddMedModal = ({ isOpen, onClose, onAdd }) => {
  // Keeping the modal simplified for the sake of the redesign focus.
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', dosage: '', form: 'Tablet', times: ['08:00 AM'], instruction: 'After Meal', stock: '', color: COLORS[0], condition: '' });

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="modal-content" 
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white z-10"><X size={20}/></button>
        <div className="p-6 border-b border-light">
          <h2 className="text-xl font-bold text-white">Add Medication</h2>
          <p className="text-sm text-slate-400 mt-1">Step {step} of 3</p>
        </div>
        <div className="p-6 h-80 flex items-center justify-center text-slate-500">
          Modal contents have been minimized for this view.
        </div>
        <div className="p-4 border-t border-light bg-black/20 flex justify-end">
          <button onClick={onClose} className="btn-primary">Save Medication</button>
        </div>
      </motion.div>
    </div>
  );
};

const Medications = () => {
  const [meds, setMeds] = useState(MOCK_MEDS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStockColor = (stock) => {
    if (stock < 7) return 'bg-rose-500';
    if (stock <= 14) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="space-y-8 animate-fade-in pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="page-title">Medications</h1>
          <p className="text-slate-400 text-sm">Manage your active prescriptions and supplements.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search medications..." 
              className="w-full bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-[#4FACFE] focus:ring-1 focus:ring-[#4FACFE] outline-none transition-all placeholder-slate-500 shadow-inner" 
            />
          </div>
          <button className="btn-secondary px-3 shadow-inner text-slate-400 hover:text-white">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {meds.map((med, i) => {
          const stockColor = getStockColor(med.stock);
          const stockPercent = Math.min((med.stock / 30) * 100, 100);
          
          let tintClass = 'bg-white/0';
          if (med.stock < 7 || med.condition === 'Cholesterol') tintClass = 'bg-rose-500/5';
          else if (med.condition === 'Supplement') tintClass = 'bg-emerald-500/5';

          return (
            <motion.div 
              key={med.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className={`card relative overflow-hidden group cursor-pointer flex flex-col p-6 ${med.stock < 7 ? 'status-overdue' : ''}`}
            >
              {/* Subtle tint wash based on priority */}
              <div className={`absolute inset-0 pointer-events-none transition-colors ${tintClass}`} />
              
              <div className="relative z-10 flex flex-col h-full">
                {/* Header Row: Icon + Name & Details */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm shrink-0" style={{ backgroundColor: `${med.color}20`, color: med.color, border: `1px solid ${med.color}40` }}>
                    <Pill size={24} strokeWidth={2} />
                  </div>
                  <div className="flex flex-col pt-0.5">
                    <h3 className="text-xl font-bold text-white tracking-tight leading-tight mb-1">{med.name}</h3>
                    <p className="text-[14px] text-[#a1a1aa] font-medium">{med.dosage} <span className="mx-1">•</span> {med.nextDose.split('·')[1]?.trim() || 'After meal'}</p>
                  </div>
                </div>

                {/* Accent Labels */}
                <div className="flex flex-col gap-2 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="accent-label">CATEGORY</span>
                    <span className="text-[13px] font-semibold text-slate-300 bg-white/5 px-2 py-0.5 rounded border border-white/5">{med.condition}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="accent-label">NEXT DOSE</span>
                    <span className="text-[13px] font-bold text-[#6366F1]">{med.nextDose.split('·')[0].trim()}</span>
                  </div>
                </div>

                {/* Footer: Stock Bar */}
                <div className="mt-auto pt-6 border-t border-white/5">
                  <div className="flex justify-between items-end mb-2">
                    <span className="accent-label">STOCK</span>
                    <div className="flex items-center gap-2">
                      {med.stock < 7 && (
                        <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wider">Refill needed</span>
                      )}
                      <span className={`text-sm font-bold ${med.stock < 7 ? 'text-rose-500' : 'text-slate-300'} mono`}>{med.stock} <span className="text-[10px] text-slate-500 uppercase">left</span></span>
                    </div>
                  </div>
                  <div className="h-[6px] w-full bg-black/40 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={`h-full ${stockColor} rounded-full relative transition-all duration-1000`} 
                      style={{ width: `${stockPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Premium FAB */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full flex items-center justify-center text-white z-40 border border-white/10 cursor-pointer shadow-lg bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]"
      >
        <Plus size={28} strokeWidth={2.5} />
      </motion.button>

      <AddMedModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={(med) => setMeds([...meds, med])} />
    </div>
  );
};

export default Medications;
