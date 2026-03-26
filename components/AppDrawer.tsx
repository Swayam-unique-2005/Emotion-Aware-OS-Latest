import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Mail, Phone, Calculator, LayoutDashboard, Camera, Chrome, Music, MapPin, Bell, Settings, Calendar, Folder } from 'lucide-react';
import { useMood } from '../contexts/MoodContext';
import { AppScreen } from '../types';

const AppDrawer: React.FC = () => {
  const { currentTheme, navigateTo, setIsAppDrawerOpen } = useMood();
  const [searchTerm, setSearchTerm] = useState('');
  const c = currentTheme.colors;

  const apps = [
    { label: 'Mail', icon: Mail, screen: 'MailInbox' },
    { label: 'Phone', icon: Phone, screen: 'Dialer' },
    { label: 'Calculator', icon: Calculator, screen: 'Calculator' },
    { label: 'Moods', icon: LayoutDashboard, screen: 'Dashboard' },
    { label: 'Camera', icon: Camera, screen: 'Home' }, // Placeholder
    { label: 'Browser', icon: Chrome, screen: 'Home' },
    { label: 'Music', icon: Music, screen: 'NotificationPanel' },
    { label: 'Maps', icon: MapPin, screen: 'Home' },
    { label: 'Settings', icon: Settings, screen: 'Home' },
    { label: 'Calendar', icon: Calendar, screen: 'Home' },
    { label: 'Files', icon: Folder, screen: 'Home' },
    { label: 'Notifs', icon: Bell, screen: 'NotificationPanel' },
  ];

  const filteredApps = apps.filter(app => app.label.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <motion.div 
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="absolute inset-0 z-40 pt-12 px-6 pb-6 bg-black/60 backdrop-blur-2xl flex flex-col"
    >
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          autoFocus
          type="text" 
          placeholder="Search apps..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-800/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm outline-none focus:bg-gray-800 transition-colors"
        />
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-4 gap-x-4 gap-y-8 content-start">
        {filteredApps.map((app, idx) => (
          <button 
            key={idx} 
            onClick={() => { navigateTo(app.screen as AppScreen); setIsAppDrawerOpen(false); }}
            className="flex flex-col items-center gap-2 group"
          >
            <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gray-700/50 text-white shadow-lg transition-transform active:scale-95 group-hover:bg-gray-600/50"
                style={{ backgroundColor: c.surfaceHighlight }}
            >
                <app.icon size={24} />
            </div>
            <span className="text-[10px] text-white/80 font-medium">{app.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default AppDrawer;