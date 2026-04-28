import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Pill, Calendar, Activity, 
  Settings as SettingsIcon, Bell, Search, 
  LogOut, Menu, X, Camera, ChevronRight, Check
} from 'lucide-react';

const AppLayout = ({ children, user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Global Keyboard Shortcuts (Cmd+K style search to be added later)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      switch(e.key.toLowerCase()) {
        case 'd': navigate('/'); break;
        case 'm': navigate('/medications'); break;
        case 'h': navigate('/history'); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const navItems = user?.role === 'Caregiver' 
    ? [
        { path: '/caregiver', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/settings', icon: SettingsIcon, label: 'Settings' }
      ]
    : [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/medications', icon: Pill, label: 'Medications' },
        { path: '/history', icon: Calendar, label: 'History' },
        { path: '/insights', icon: Activity, label: 'Insights' },
        { path: '/scanner', icon: Camera, label: 'Scan Rx' },
        { path: '/settings', icon: SettingsIcon, label: 'Settings' }
      ];

  const formatTime = (date) => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const formatDate = (date) => date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="page-wrapper relative z-0">
      {/* Ambient Background Mesh */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#6366F1] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#4FACFE] rounded-full mix-blend-screen filter blur-[150px] opacity-10" />
      </div>

      {/* Sidebar - Fixed */}
      <aside className="sidebar glass-panel border-r border-white/5">
        <div className="px-2 py-4 flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white bg-gradient-to-br from-[#6366F1] to-[#818CF8] shadow-sm">
            <Pill size={16} strokeWidth={2} />
          </div>
          <span className="text-white font-semibold tracking-tight text-lg">MediSaathi</span>
        </div>

        <div className="px-2 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Main</div>
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/' && location.pathname === '/');
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <item.icon size={18} strokeWidth={2} className={isActive ? 'text-[#6366F1]' : ''} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button onClick={onLogout} className="nav-item hover:text-rose-400 hover:bg-rose-500/10 w-full group">
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="content-area relative z-10">
        {/* Top Navbar */}
        <header className="topnav glass-panel border-b border-white/5">
          <div className="topnav-left">
            <button className="md:hidden text-slate-400 hover:text-white mb-2" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="hidden md:flex flex-col">
              <span className="text-sm font-semibold text-slate-200">{formatTime(time)}</span>
              <span className="text-xs text-slate-500 font-medium">{formatDate(time)}</span>
            </div>
          </div>

          <div className="topnav-center">
            <div className="relative">
              <Search size={16} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search medications (Cmd+K)" 
                className="search-bar"
              />
            </div>
          </div>

          <div className="topnav-right">

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 text-slate-400 hover:text-slate-200 transition-colors rounded-full hover:bg-white/5"
              >
                <Bell size={20} strokeWidth={2} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#6366F1] rounded-full border-2 border-main"></span>
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 bg-[#151821] border border-light rounded-2xl shadow-2xl overflow-hidden z-50"
                  >
                    <div className="px-5 py-4 border-b border-light flex justify-between items-center bg-white/5">
                      <h3 className="text-sm font-semibold text-white">Notifications</h3>
                      <button className="text-xs text-[#6366F1] hover:text-white transition-colors">Mark all read</button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      <div className="px-5 py-4 border-b border-light/50 hover:bg-white/5 cursor-pointer flex gap-4 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 mt-0.5">
                          <Pill size={14} />
                        </div>
                        <div>
                          <p className="text-sm text-slate-200 font-medium">Missed Dose: Metformin</p>
                          <p className="text-xs text-slate-500 mt-1">2 hours ago</p>
                        </div>
                      </div>
                      <div className="px-5 py-4 hover:bg-white/5 cursor-pointer flex gap-4 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={14} strokeWidth={3} />
                        </div>
                        <div>
                          <p className="text-sm text-slate-200 font-medium">Weekly Adherence Goal Met!</p>
                          <p className="text-xs text-slate-500 mt-1">Yesterday</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile */}
            <Link to="/settings" className="flex items-center gap-3 pl-2 border-l border-light hover:opacity-80 transition-opacity">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-200">{user?.name || 'Anshul'}</p>
                <p className="text-xs text-slate-500">{user?.role || 'Patient'}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6366F1] to-[#818CF8] flex items-center justify-center text-xs font-bold text-white shadow-sm ring-2 ring-white/5">
                {user?.name ? user.name[0] : 'A'}
              </div>
            </Link>
          </div>
        </header>

        {/* Main Scrollable Area */}
        <main className="page-body">
          {children}
        </main>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 bottom-0 w-64 glass-panel border-r border-white/5 flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 flex items-center justify-between">
                <span className="font-semibold text-white tracking-tight text-lg">MediSaathi</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              
              <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path || (item.path === '/' && location.pathname === '/');
                  return (
                    <Link 
                      key={item.path} 
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 transition-all ${
                        isActive ? 'text-[#6366F1] font-medium' : 'text-slate-400'
                      }`}
                    >
                      {isActive && (
                        <motion.div layoutId="activeNavMobile" className="absolute left-0 w-1.5 h-6 bg-[#6366F1] rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                      )}
                      <item.icon size={18} strokeWidth={2} />
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppLayout;
