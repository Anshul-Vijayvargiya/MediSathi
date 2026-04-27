import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Layout, LogOut, User, Bell, Pill, Activity, Users, Settings } from 'lucide-react';
import PatientDashboard from './dashboards/Patient/PatientDashboard';
import CaregiverDashboard from './dashboards/Caregiver/CaregiverDashboard';
import Login from './pages/Login';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {user && (
          <nav className="glass-card m-4 p-4 flex justify-between items-center sticky top-4 z-50">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
                <Pill size={24} />
              </div>
              <span className="brand text-xl text-slate-800">MediSathi</span>
            </div>
            
            <div className="hidden md:flex gap-6 items-center">
              <Link to="/" className="text-slate-600 hover:text-emerald-600 transition-colors">Dashboard</Link>
              {user.role === 'Caregiver' && (
                <Link to="/patients" className="text-slate-600 hover:text-emerald-600 transition-colors">Patients</Link>
              )}
              <Settings size={20} className="text-slate-400 cursor-pointer hover:text-slate-600" />
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Bell size={20} className="text-slate-400 cursor-pointer" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full">
                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                  <User size={16} className="text-slate-500" />
                </div>
                <span className="text-sm font-medium text-slate-700 hidden sm:block">{user.name}</span>
                <LogOut size={16} className="text-slate-400 cursor-pointer hover:text-rose-500" onClick={handleLogout} />
              </div>
            </div>
          </nav>
        )}

        <main className="flex-1 p-4 max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />} />
            <Route 
              path="/" 
              element={
                user ? (
                  user.role === 'Caregiver' ? <Navigate to="/caregiver" /> : <PatientDashboard />
                ) : <Navigate to="/login" />
              } 
            />
            <Route 
              path="/caregiver" 
              element={user && user.role === 'Caregiver' ? <CaregiverDashboard /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>

        {user && (
          <footer className="p-8 text-center text-slate-400 text-sm">
            <p>Our system supports both independent users and dependent patients through flexible caregiver integration.</p>
            <p className="mt-2">© 2026 MediSathi AI. Intelligent Medication Adherence.</p>
          </footer>
        )}
      </div>
    </Router>
  );
};

export default App;
