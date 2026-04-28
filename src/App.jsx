import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import PatientDashboard from './dashboards/Patient/PatientDashboard';
import CaregiverDashboard from './dashboards/Caregiver/CaregiverDashboard';
import Login from './pages/Login';
import Medications from './pages/Medications';
import History from './pages/History';
import Insights from './pages/Insights';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import OCRScannerPage from './pages/OCRScannerPage';
import Onboarding from './components/Onboarding';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Basic local storage persistence
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      // Auto-mock user for development
      const mockUser = { id: 1, name: 'Anshul Vijayvargiya', role: 'Patient' };
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <Onboarding />
      <Routes>
        <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />} />
        
        {/* Protected Routes wrapped in AppLayout */}
        <Route
          path="/*"
          element={
            user ? (
              <AppLayout user={user} onLogout={handleLogout}>
                <Routes>
                  <Route 
                    path="/" 
                    element={user.role === 'Caregiver' ? <Navigate to="/caregiver" /> : <PatientDashboard />} 
                  />
                  <Route 
                    path="/caregiver" 
                    element={user.role === 'Caregiver' ? <CaregiverDashboard /> : <Navigate to="/" />} 
                  />
                  <Route path="/medications" element={<Medications />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/insights" element={<Insights />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/scanner" element={<OCRScannerPage />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </AppLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
