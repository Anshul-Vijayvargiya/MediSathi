import React, { useState } from 'react';
import OCRScanner from '../components/OCRScanner';

const OCRScannerPage = () => {
  const [isOpen, setIsOpen] = useState(true);

  // If closed, show a button to reopen
  return (
    <div className="h-full flex flex-col items-center justify-center animate-fade-in relative">
      {!isOpen ? (
        <div className="text-center glass-card p-12">
          <h2 className="text-2xl font-bold text-white mb-4">Scanner Closed</h2>
          <button onClick={() => setIsOpen(true)} className="btn-primary">Open Scanner Again</button>
        </div>
      ) : (
        <div className="w-full max-w-4xl">
           <OCRScanner isOpen={isOpen} onClose={() => setIsOpen(false)} onSave={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default OCRScannerPage;
