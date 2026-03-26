import React, { useState, useEffect, useMemo } from 'react';
import { Wifi, Bluetooth, Flashlight, Moon, Play, SkipBack, SkipForward, ChevronDown, Music2, Settings, Trash2, Info, Bell } from 'lucide-react';
import { useMood } from '../contexts/MoodContext';
import { Mood, NotificationItem } from '../types';
import { AnimatePresence, motion } from 'framer-motion';

const NotificationPanel: React.FC = () => {
  const { currentTheme, currentMood, systemState, toggleSystemState, navigateTo } = useMood();
  const c = currentTheme.colors;

  // --------------------------------------------------
  // MUSIC LOGIC (Mood-Enhancing / Balancing)
  // --------------------------------------------------
  const getMoodEnhancingTrack = (mood: Mood) => {
    switch(mood) {
        case 'Happy': 
            // SUSTAIN: Energetic / Cheerful
            return { title: "Happy", artist: "Pharrell Williams", moodLabel: "Energetic Sustain" };
        case 'Sad': 
            // SHIFT POSITIVE: Uplifting / Hopeful (No depressing songs)
            return { title: "Here Comes The Sun", artist: "The Beatles", moodLabel: "Uplifting Shift" };
        case 'Angry': 
            // SHIFT CALM: Relaxing / Peaceful (No aggressive songs)
            return { title: "Weightless", artist: "Marconi Union", moodLabel: "Calming Shift" };
    }
  }

  const track = getMoodEnhancingTrack(currentMood);

  // --------------------------------------------------
  // NOTIFICATION DATA (Case-Based)
  // --------------------------------------------------
  const initialNotifications: NotificationItem[] = [
    { id: '1', name: "Gmail", time: "2m", content: "Meeting rescheduled to 3PM", category: "Important" },
    { id: '2', name: "WhatsApp", time: "5m", content: "Mom: Are you coming for dinner?", category: "Important" },
    { id: '3', name: "Clash of Clans", time: "10m", content: "Your troops are ready for battle!", category: "Unimportant" },
    { id: '4', name: "Amazon", time: "1h", content: "Big Sale! 50% off on electronics.", category: "Unimportant" },
    { id: '5', name: "Instagram", time: "2h", content: "Sarah and 4 others liked your story.", category: "Unimportant" },
    { id: '6', name: "Phone", time: "3h", content: "Missed call from John", category: "Important" },
  ];

  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  // --------------------------------------------------
  // FILTERING LOGIC
  // --------------------------------------------------
  const filteredNotifications = useMemo(() => {
    if (currentMood === 'Happy') {
        // HAPPY: Show ALL (User is stable)
        return notifications;
    } else {
        // ANGRY or SAD: Show ONLY IMPORTANT (Reduce load/irritation)
        return notifications.filter(n => n.category === 'Important');
    }
  }, [currentMood, notifications]);

  // Handle Clear All
  const handleClearAll = () => {
    setNotifications([]);
  };

  // --------------------------------------------------
  // UI COMPONENTS
  // --------------------------------------------------
  const QuickTile = ({ icon: Icon, label, isActive, onClick }: { icon: any, label: string, isActive: boolean, onClick: () => void }) => (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 rounded-[24px] h-[80px] transition-all duration-300 shadow-sm active:scale-95 cursor-pointer border`}
      style={{ 
          backgroundColor: isActive ? c.surfaceHighlight : 'rgba(0,0,0,0.05)', 
          color: isActive ? c.textMain : c.textSecondary,
          borderColor: c.divider
      }}
    >
      <div className={`p-2 rounded-full ${isActive ? 'bg-white/20' : 'bg-transparent'}`}>
        <Icon size={24} />
      </div>
      <span className="font-medium text-[11px]">{label}</span>
    </button>
  );

  return (
    <div className="h-full w-full flex flex-col px-4 pt-12 pb-4 overflow-hidden relative">
      
      {/* 1. Quick Settings Grid (Functional) */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <QuickTile 
            icon={Wifi} 
            label={systemState.isWifiOn ? "Wi-Fi On" : "Wi-Fi Off"} 
            isActive={systemState.isWifiOn} 
            onClick={() => toggleSystemState('isWifiOn')} 
        />
        <QuickTile 
            icon={Bluetooth} 
            label={systemState.isBluetoothOn ? "Bluetooth On" : "Bluetooth Off"} 
            isActive={systemState.isBluetoothOn} 
            onClick={() => toggleSystemState('isBluetoothOn')} 
        />
        <QuickTile 
            icon={Flashlight} 
            label={systemState.isFlashlightOn ? "Flashlight On" : "Flashlight Off"} 
            isActive={systemState.isFlashlightOn} 
            onClick={() => toggleSystemState('isFlashlightOn')} 
        />
        <QuickTile 
            icon={Moon} 
            label={systemState.isDarkMode ? "Dark Mode" : "Light Mode"} 
            isActive={systemState.isDarkMode} 
            onClick={() => toggleSystemState('isDarkMode')} 
        />
      </div>

      {/* 2. Media Player (Mood Enhancing) */}
      <div 
        className="rounded-[32px] p-5 mb-6 flex items-center gap-4 shadow-sm relative overflow-hidden transition-colors duration-500 border border-black/5"
        style={{ backgroundColor: c.surface, color: c.textMain }}
      >
        <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-inner relative bg-black/10 flex items-center justify-center">
             <Music2 size={24} className="opacity-60" />
        </div>
        <div className="flex-1 min-w-0 z-10">
          <div className="flex items-center gap-2 mb-0.5">
             <span className="text-[9px] font-bold uppercase tracking-wider opacity-70 border border-current px-1.5 rounded-md">
                Mood-Enhancing Recommendation
             </span>
          </div>
          <h3 className="font-bold text-lg truncate leading-tight">{track.title}</h3>
          <p className="text-sm opacity-75 truncate">{track.artist}</p>
          <div className="flex items-center gap-5 mt-2">
            <SkipBack size={20} className="fill-current cursor-pointer opacity-70" />
            <Play size={20} className="fill-current cursor-pointer hover:scale-110 transition-transform" />
            <SkipForward size={20} className="fill-current cursor-pointer opacity-70" />
          </div>
        </div>
      </div>

      {/* 3. Notifications (Filtered) */}
      <div className="flex flex-col rounded-[28px] overflow-hidden shadow-sm flex-1 backdrop-blur-xl border border-black/5 transition-colors duration-500"
           style={{ backgroundColor: c.surfaceHighlight }}>
        
        {/* Header with Filter Label */}
        <div className="px-5 py-3 border-b border-black/5 flex justify-between items-center" style={{ borderColor: c.divider }}>
            <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wider opacity-70" style={{ color: c.textMain }}>Notification Center</span>
                {currentMood !== 'Happy' && (
                    <span className="text-[9px] flex items-center gap-1 text-red-500 font-medium">
                        <Info size={10} /> Filtered by Mood
                    </span>
                )}
            </div>
            {filteredNotifications.length > 0 && (
                 <span className="bg-black/10 px-2 py-0.5 rounded text-[10px] font-bold" style={{ color: c.textMain }}>
                    {filteredNotifications.length} New
                 </span>
            )}
        </div>

        {/* List */}
        <div className="overflow-y-auto no-scrollbar flex-1 relative">
            <AnimatePresence mode="popLayout">
                {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((n) => (
                        <motion.div 
                            key={n.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            className="w-full p-4 border-b last:border-0"
                            style={{ borderColor: c.divider, color: c.textMain }}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-black/10 overflow-hidden shadow-sm">
                                        <img src={`https://picsum.photos/seed/${n.name}/50`} alt={n.name} className="w-full h-full object-cover" />
                                    </div>
                                    <span className="font-bold text-sm">{n.name}</span>
                                    <span className="text-xs opacity-60">• {n.time}</span>
                                </div>
                                <div className="opacity-30">
                                    <ChevronDown size={14} />
                                </div>
                            </div>
                            <p className="text-sm opacity-80 pl-8 leading-relaxed">{n.content}</p>
                        </motion.div>
                    ))
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-40 gap-2" style={{ color: c.textMain }}>
                        <Bell size={32} />
                        <span className="text-xs font-medium">No notifications to show</span>
                    </div>
                )}
            </AnimatePresence>
        </div>
      </div>

      {/* 4. Bottom Controls (Clear All & Settings) */}
      <div className="flex justify-between mt-4 px-2 gap-4">
         <button 
            onClick={() => navigateTo('Settings')}
            className="flex-1 py-3 rounded-full font-semibold text-xs transition-colors hover:brightness-110 flex items-center justify-center gap-2 shadow-sm" 
            style={{ backgroundColor: c.primary, color: systemState.isDarkMode ? c.textMain : 'white' }}
        >
            <Settings size={14} /> Settings
         </button>
         
         <button 
            onClick={handleClearAll}
            disabled={notifications.length === 0}
            className="flex-1 py-3 rounded-full font-semibold text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border" 
            style={{ backgroundColor: 'transparent', color: c.textMain, borderColor: c.divider }}
         >
            <Trash2 size={14} /> Clear All
         </button>
      </div>
    </div>
  );
};

export default NotificationPanel;