import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Upload, Check, Loader2, Pill, Clock, Trash2, Save } from 'lucide-react';

const OCRScanner = ({ isOpen, onClose, onSave }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setError(null);
    }
  };

  const handleProcess = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('prescription', file);

    try {
      const response = await fetch('http://localhost:5000/api/ocr/scan', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setResults(data.data);
      } else {
        setError(data.message || 'Failed to process image');
      }
    } catch (err) {
      setError('Connection error. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateResult = (index, field, value) => {
    const newResults = [...results];
    newResults[index][field] = value;
    setResults(newResults);
  };

  const handleRemoveResult = (index) => {
    setResults(results.filter((_, i) => i !== index));
  };

  const handleFinalSave = () => {
    onSave(results);
    onClose();
    // Reset state
    setFile(null);
    setPreview(null);
    setResults(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-emerald-600 text-white">
          <div className="flex items-center gap-3">
            <Camera size={24} />
            <h3 className="text-xl font-bold">Prescription Scanner</h3>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {!results ? (
            <div className="space-y-6">
              {/* Upload Area */}
              {!preview ? (
                <label className="border-4 border-dashed border-slate-100 rounded-[2rem] p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all group">
                  <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                    <Upload size={40} />
                  </div>
                  <span className="text-xl font-bold text-slate-700">Upload Prescription</span>
                  <span className="text-slate-400 mt-2 text-center">Click to browse or drag and drop<br/>(JPEG, PNG up to 5MB)</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              ) : (
                <div className="relative rounded-[2rem] overflow-hidden border-4 border-slate-100 shadow-inner">
                  <img src={preview} alt="Preview" className="w-full h-64 object-contain bg-slate-50" />
                  <button 
                    onClick={() => { setFile(null); setPreview(null); }}
                    className="absolute top-4 right-4 bg-rose-500 text-white p-2 rounded-full shadow-lg hover:bg-rose-600 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              )}

              {error && (
                <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl flex items-center gap-3 border border-rose-100">
                  <X size={20} />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              <button 
                onClick={handleProcess}
                disabled={!file || loading}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-emerald-200 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 size={24} className="animate-spin" />
                    Analyzing with AI OCR...
                  </>
                ) : (
                  <>
                    <Check size={24} />
                    Extract Medicine Details
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold text-slate-800">Review Results ({results.length})</h4>
                <p className="text-sm text-slate-400">Edit any details if necessary</p>
              </div>

              <div className="space-y-4">
                {results.map((med, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-50 p-4 rounded-2xl border border-slate-200 relative group"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                        <Pill size={20} />
                      </div>
                      <input 
                        className="bg-transparent font-bold text-slate-800 text-lg flex-1 outline-none border-b border-transparent focus:border-emerald-300"
                        value={med.name}
                        onChange={(e) => handleUpdateResult(index, 'name', e.target.value)}
                        placeholder="Medicine Name"
                      />
                      <button onClick={() => handleRemoveResult(index)} className="text-slate-300 hover:text-rose-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Dosage</label>
                        <input 
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm text-slate-700 focus:ring-2 ring-emerald-100 outline-none"
                          value={med.dosage}
                          onChange={(e) => handleUpdateResult(index, 'dosage', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Frequency</label>
                        <input 
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm text-slate-700 focus:ring-2 ring-emerald-100 outline-none"
                          value={med.frequency}
                          onChange={(e) => handleUpdateResult(index, 'frequency', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Timing / Instructions</label>
                      <input 
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm text-slate-700 focus:ring-2 ring-emerald-100 outline-none"
                        value={med.timing}
                        onChange={(e) => handleUpdateResult(index, 'timing', e.target.value)}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {results.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-slate-400">No medicines detected. Try a clearer image.</p>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setResults(null)}
                  className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Back to Upload
                </button>
                <button 
                  onClick={handleFinalSave}
                  className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-100"
                >
                  <Save size={20} />
                  Save All to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default OCRScanner;
