import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pill, Bell, ShieldCheck, ChevronRight, X } from 'lucide-react';

const Onboarding = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const hasSeen = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeen) {
      // Small delay for effect
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setIsOpen(false);
  };

  const slides = [
    {
      title: 'Welcome to MediSaathi',
      desc: 'Your intelligent health companion. Let\'s get you set up to track your medications effortlessly.',
      icon: Pill,
      color: 'from-indigo-500 to-purple-500'
    },
    {
      title: 'Never Miss a Dose',
      desc: 'Smart notifications and AI insights will help you build long-lasting healthy habits.',
      icon: Bell,
      color: 'from-[#4FACFE] to-[#00f2fe]'
    },
    {
      title: 'Share with Caregivers',
      desc: 'Easily link your account with family members or doctors for peace of mind.',
      icon: ShieldCheck,
      color: 'from-emerald-500 to-teal-400'
    }
  ];

  if (!isOpen) return null;

  const current = slides[step];
  const Icon = current.icon;

  return (
    <div className="modal-overlay z-[9999]" onClick={handleClose}>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="modal-content overflow-hidden relative max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={handleClose} className="absolute top-4 right-4 text-white/50 hover:text-white z-10"><X size={24}/></button>

        <div className={`h-40 bg-gradient-to-br ${current.color} flex items-center justify-center`}>
          <motion.div 
            key={step} 
            initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 15 }}
            className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30 text-white"
          >
            <Icon size={48} />
          </motion.div>
        </div>

        <div className="p-8 text-center bg-[#1C2033]">
          <motion.h2 key={`title-${step}`} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-2xl font-bold text-white mb-4">{current.title}</motion.h2>
          <motion.p key={`desc-${step}`} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="text-slate-400 mb-8">{current.desc}</motion.p>
          
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {slides.map((_, i) => (
                <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-6 bg-[#4FACFE]' : 'w-2 bg-white/10'}`} />
              ))}
            </div>
            
            <button 
              onClick={() => step < slides.length - 1 ? setStep(s => s + 1) : handleClose()}
              className="btn-primary"
            >
              {step < slides.length - 1 ? 'Next' : 'Get Started'} <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
