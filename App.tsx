import React, { useState } from 'react';
import { MoodProvider, useMood } from './contexts/MoodContext';
import { AppScreen } from './types';
import { initSupabase } from './services/supabaseService';
import PhoneFrame from './components/PhoneFrame';
import LockScreen from './components/LockScreen';
import NotificationPanel from './components/NotificationPanel';
import Dialer from './components/Dialer';
import Calculator from './components/Calculator';
import MailInbox from './components/MailInbox';
import HomeScreen from './components/HomeScreen';
import Dashboard from './components/Dashboard';
import AppDrawer from './components/AppDrawer';
import RecentsView from './components/RecentsView';
import SettingsScreen from './components/SettingsScreen';
import GPayScreen from './components/GPayScreen';
import CameraCapture from './components/CameraCapture';
import GeoMood from './components/GeoMood';
import DataInsights from './components/DataInsights';
import { Lock, Smartphone, Bell, Mail, Calculator as CalcIcon, Settings, Home, LayoutDashboard, Menu, X, Layers, CreditCard, MapPin, Activity, Upload, Power } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Papa from 'papaparse';

const AppContent: React.FC = () => {
  const { currentMood, setMood, currentTheme, activeScreen, navigateTo, isAppDrawerOpen, apiEnabled, setApiEnabled, setUploadedDataset } = useMood();
  const [showSettings, setShowSettings] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [supabaseConfig, setSupabaseConfig] = useState({ url: '', key: '' });

  // Handle Supabase initialization
  const handleSupabaseInit = () => {
    if (supabaseConfig.url && supabaseConfig.key) {
      initSupabase(supabaseConfig.url, supabaseConfig.key);
      alert("Supabase Initialized!");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          setUploadedDataset(results.data);
          navigateTo('DataInsights');
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
          alert("Failed to parse CSV file.");
        }
      });
    }
  };

  const renderScreen = () => {
    const ScreenComponent = (() => {
      switch (activeScreen) {
        case 'Lockscreen': return LockScreen;
        case 'NotificationPanel': return NotificationPanel;
        case 'Dialer': return Dialer;
        case 'Calculator': return Calculator;
        case 'MailInbox': return MailInbox;
        case 'Home': return HomeScreen;
        case 'Dashboard': return Dashboard;
        case 'Recents': return RecentsView;
        case 'Settings': return SettingsScreen;
        case 'GPay': return GPayScreen;
        case 'GeoMood': return GeoMood;
        case 'DataInsights': return DataInsights;
        default: return HomeScreen;
      }
    })();

    return (
      <ScreenComponent />
    );
  };

  const c = currentTheme.colors;

  return (
    <div className="flex h-screen w-full bg-[#0a0a0a] text-gray-100 overflow-hidden font-sans selection:bg-blue-500/30">
      
      {/* Toggle Button for Mobile/Small screens */}
      <button 
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-gray-800/50 backdrop-blur-md rounded-full lg:hidden"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Controls */}
      <div className={`${isSidebarOpen ? 'w-72 opacity-100 translate-x-0' : 'w-0 opacity-0 -translate-x-10 overflow-hidden'} transition-all duration-300 flex flex-col border-r border-white/5 bg-[#0f0f11] p-0 z-40 shadow-2xl`}>
        <div className="p-6 border-b border-white/5">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Emotion OS</h1>
          <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">Prototype Build v1.2</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {/* Mood Controls */}
          <div className="mb-8">
            <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Emulation Mode</h2>
            <div className="flex gap-2 p-1 bg-gray-900/50 rounded-lg border border-white/5">
              {(['Happy', 'Sad', 'Angry'] as const).map((mood) => (
                <button
                  key={mood}
                  onClick={() => setMood(mood, 'Manual')}
                  className={`flex-1 py-2 rounded-md text-xs font-medium transition-all ${currentMood === mood ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>

          {/* AI Camera Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Gemini Vision</h2>
              <button 
                onClick={() => setApiEnabled(!apiEnabled)}
                className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${apiEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-800 text-gray-500'}`}
              >
                <Power size={10} />
                {apiEnabled ? 'API ON' : 'API OFF'}
              </button>
            </div>
            <CameraCapture />
          </div>

          {/* Dataset Upload */}
          <div className="mb-8">
            <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Data Analysis</h2>
            <label className="w-full flex items-center justify-center gap-2 px-3 py-3 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all cursor-pointer">
              <Upload size={16} />
              Upload Mood Dataset (CSV)
              <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>

          {/* App Navigation */}
          <div className="mb-8">
            <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Apps</h2>
            <div className="space-y-1">
              {[
                { id: 'Home', icon: Home, label: 'Home Screen' },
                { id: 'Dashboard', icon: LayoutDashboard, label: 'Mood Dashboard' },
                { id: 'GeoMood', icon: MapPin, label: 'Location Emotion' },
                { id: 'DataInsights', icon: Activity, label: 'Data Insights' },
                { id: 'Recents', icon: Layers, label: 'Multitasking' },
                { id: 'Lockscreen', icon: Lock, label: 'Lock Screen' },
                { id: 'NotificationPanel', icon: Bell, label: 'Notification Center' },
                { id: 'MailInbox', icon: Mail, label: 'Inbox' },
                { id: 'Dialer', icon: Smartphone, label: 'Phone' },
                { id: 'Calculator', icon: CalcIcon, label: 'Calculator' },
                { id: 'GPay', icon: CreditCard, label: 'GPay Simulator' },
              ].map((item) => (
                <button 
                  key={item.id}
                  onClick={() => navigateTo(item.id as any)} 
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 border border-transparent
                    ${activeScreen === item.id 
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  <item.icon size={16} /> {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Config Toggle */}
          <button onClick={() => setShowSettings(!showSettings)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-gray-500 hover:text-white hover:bg-white/5 transition-all">
            <Settings size={16} /> System Config
          </button>

          {showSettings && (
            <div className="mt-4 p-4 bg-black/20 rounded-xl border border-white/5 animate-in slide-in-from-top-2">
               <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Supabase Connect</h3>
               <input className="w-full bg-gray-900 border border-white/10 rounded px-3 py-2 text-xs mb-2 text-white focus:border-blue-500/50 outline-none" placeholder="Project URL" value={supabaseConfig.url} onChange={e => setSupabaseConfig({...supabaseConfig, url: e.target.value})} />
               <input className="w-full bg-gray-900 border border-white/10 rounded px-3 py-2 text-xs mb-3 text-white focus:border-blue-500/50 outline-none" placeholder="Anon Key" type="password" value={supabaseConfig.key} onChange={e => setSupabaseConfig({...supabaseConfig, key: e.target.value})} />
               <button onClick={handleSupabaseInit} className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded py-2 text-xs font-medium transition-colors">Connect</button>
            </div>
          )}
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative p-8">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(17,24,39,1),_rgba(5,5,5,1))] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Phone Frame Container */}
        <div className="relative h-[85vh] w-auto aspect-[9/19.5] z-10 transition-transform duration-500">
          <PhoneFrame>
             <AnimatePresence mode="wait">
                <motion.div
                  key={activeScreen}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ type: "spring", damping: 20, stiffness: 100 }}
                  className="w-full h-full"
                >
                  {renderScreen()}
                </motion.div>
             </AnimatePresence>
             
             {/* Overlay Components */}
             <AnimatePresence>
                {isAppDrawerOpen && <AppDrawer />}
             </AnimatePresence>
          </PhoneFrame>
        </div>

        {/* Legend */}
        <div className="absolute bottom-8 right-8 flex flex-col gap-3 p-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl hidden xl:flex">
           <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Theme Palette</span>
           <div className="flex items-center gap-3 text-xs text-gray-300">
              <span className="w-3 h-3 rounded-full shadow-lg" style={{ background: c.background }}></span>
              Base
           </div>
           <div className="flex items-center gap-3 text-xs text-gray-300">
              <span className="w-3 h-3 rounded-full shadow-lg" style={{ background: c.surface }}></span>
              Surface
           </div>
           <div className="flex items-center gap-3 text-xs text-gray-300">
              <span className="w-3 h-3 rounded-full shadow-lg" style={{ background: c.accent }}></span>
              Accent
           </div>
        </div>
      </div>

    </div>
  );
}

const App: React.FC = () => {
  return (
    <MoodProvider>
      <AppContent />
    </MoodProvider>
  );
}

export default App;