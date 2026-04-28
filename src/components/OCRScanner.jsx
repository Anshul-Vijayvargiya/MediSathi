import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, UploadCloud, FileText, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';

const OCRScanner = ({ isOpen, onClose, onSave }) => {
  const [step, setStep] = useState('upload'); // 'upload' | 'processing' | 'results'
  const [isDragging, setIsDragging] = useState(false);
  const [results, setResults] = useState(null);

  if (!isOpen) return null;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const simulateUpload = () => {
    setStep('processing');
    setTimeout(() => {
      setResults({
        medName: 'Lisinopril',
        dosage: '10mg',
        instructions: 'Take 1 tablet daily',
        doctor: 'Dr. Sarah Jenkins',
        date: '2026-04-28'
      });
      setStep('results');
    }, 2500);
  };

  const reset = () => {
    setStep('upload');
    setResults(null);
  };

  const handleSave = () => {
    onSave(results);
    reset();
  };

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="modal-content relative" 
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: '480px' }}
      >
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors z-10"
        >
          <X size={18} />
        </button>

        <div className="p-8">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: UPLOAD */}
            {step === 'upload' && (
              <motion.div key="upload" variants={variants} initial="hidden" animate="visible" exit="exit" className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#6366F1]/10 text-[#6366F1] flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Camera size={32} strokeWidth={2} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Scan Prescription</h2>
                <p className="text-slate-400 text-sm mb-8 px-4">Take a photo or upload your prescription to automatically extract medication details.</p>

                <div 
                  className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer overflow-hidden relative ${isDragging ? 'border-[#6366F1] bg-[#6366F1]/5 scale-[1.02]' : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => { e.preventDefault(); setIsDragging(false); simulateUpload(); }}
                  onClick={simulateUpload}
                >
                  {/* Ghost UI Illustration */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
                    <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                      <line x1="12" y1="18" x2="12.01" y2="18"></line>
                      <rect x="3" y="6" width="18" height="12" rx="1" ry="1"></rect>
                    </svg>
                  </div>

                  <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-slate-400 mb-4 shadow-sm relative z-10">
                    <UploadCloud size={24} />
                  </div>
                  <p className="text-white font-semibold mb-1 relative z-10">Click or drag image here</p>
                  <p className="text-xs text-slate-500">Supports JPG, PNG, PDF up to 10MB</p>
                </div>
              </motion.div>
            )}

            {/* STEP 2: PROCESSING */}
            {step === 'processing' && (
              <motion.div key="processing" variants={variants} initial="hidden" animate="visible" exit="exit" className="text-center py-12">
                <div className="relative w-24 h-24 mx-auto mb-8">
                  {/* Outer glow ring */}
                  <div className="absolute inset-0 rounded-full border border-[#6366F1]/30 animate-ping"></div>
                  {/* Inner spinner */}
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#6366F1] border-r-[#818CF8]"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileText size={32} className="text-[#6366F1]" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Extracting Details...</h3>
                <p className="text-slate-400 text-sm">Our AI is securely analyzing your prescription.</p>
              </motion.div>
            )}

            {/* STEP 3: RESULTS */}
            {step === 'results' && results && (
              <motion.div key="results" variants={variants} initial="hidden" animate="visible" exit="exit">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <CheckCircle2 size={32} strokeWidth={2.5} />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Scan Complete</h2>
                  <p className="text-slate-400 text-sm">Please verify the extracted information below.</p>
                </div>

                <div className="bg-[#0B0D12]/50 border border-white/5 rounded-2xl p-5 mb-8 space-y-4 shadow-inner">
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Medication</span>
                    <span className="text-sm font-bold text-white">{results.medName}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Dosage</span>
                    <span className="text-sm font-bold text-white">{results.dosage}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Instructions</span>
                    <span className="text-sm font-bold text-white">{results.instructions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Doctor</span>
                    <span className="text-sm font-medium text-slate-300">{results.doctor}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={reset} className="btn-secondary flex-1 py-3 bg-white/5">
                    <RefreshCw size={18} /> Rescan
                  </button>
                  <button onClick={handleSave} className="btn-primary flex-1 py-3">
                    Add to Schedule
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default OCRScanner;
