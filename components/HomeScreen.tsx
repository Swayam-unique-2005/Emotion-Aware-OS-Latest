import React from 'react';
import { Mail, Phone, Calculator, LayoutDashboard, Camera, Chrome, Music, MapPin, MessageCircle, Heart, Wind, ChevronRight } from 'lucide-react';
import { useMood } from '../contexts/MoodContext';
import { AppScreen, Mood } from '../types';
import SmartStack from './SmartStack';
import { motion, PanInfo } from 'framer-motion';

const HomeScreen: React.FC = () => {
  const { currentTheme, navigateTo, currentMood, setIsAppDrawerOpen, triggerHaptic } = useMood();
  const c = currentTheme.colors;

  const AppIcon = ({ icon: Icon, label, target, color }: { icon: any, label: string, target?: AppScreen, color?: string }) => (
    <motion.button 
      whileTap={{ scale: 0.9 }}
      onClick={() => { if(target) navigateTo(target); }}
      className="flex flex-col items-center gap-1.5 group w-full"
    >
      <div 
        className="w-[58px] h-[58px] rounded-[18px] flex items-center justify-center shadow-lg border border-white/10 relative overflow-hidden transition-all duration-300 group-hover:brightness-110"
        style={{ 
          backgroundColor: color || 'rgba(255,255,255,0.1)', 
          backdropFilter: 'blur(12px)',
          color: 'white'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
        <Icon size={26} strokeWidth={2} className="drop-shadow-sm relative z-10" />
      </div>
      <span className="text-[10px] font-medium tracking-wide text-white drop-shadow-md opacity-90">{label}</span>
    </motion.button>
  );

  const getQuickAction = (mood: Mood) => {
    switch (mood) {
        case 'Happy': return { label: 'Journal', icon: MessageCircle, action: () => alert("Opening Gratitude Journal...") };
        case 'Sad': return { label: 'Meditate', icon: Heart, action: () => alert("Starting 5 min breathing...") };
        case 'Angry': return { label: 'Breathe', icon: Wind, action: () => alert("Inhale... Exhale...") };
    }
  }

  const quickAction = getQuickAction(currentMood);
  const QuickIcon = quickAction.icon;

  const handlePanEnd = (e: any, info: PanInfo) => {
    // Swipe Down -> Notification Panel
    if (info.offset.y > 60 && Math.abs(info.offset.x) < 50) {
        triggerHaptic();
        navigateTo('NotificationPanel');
    }
    // Swipe Up -> App Drawer (handled by bottom bar usually, but added here for ease)
    if (info.offset.y < -60 && Math.abs(info.offset.x) < 50) {
        triggerHaptic();
        setIsAppDrawerOpen(true);
    }
  }

  return (
    <motion.div 
        className="h-full w-full flex flex-col px-6 pt-6 pb-2 relative overflow-hidden"
        onPanEnd={handlePanEnd}
    >
      
      {/* Top Section: Date & SmartStack */}
      <div className="flex flex-col gap-5 mb-4 z-10">
        {/* Modern Date Header */}
        <div className="flex justify-between items-end px-1">
            <div className="flex flex-col">
                <span className="text-xs font-bold text-white/60 uppercase tracking-[0.2em]">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</span>
                <span className="text-4xl font-semibold text-white tracking-tight leading-none mt-1">
                    {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                </span>
            </div>
            {/* Context Pill */}
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 flex items-center gap-2">
                <div 
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: c.accent }} // Use Theme Accent for dot color
                 />
                <span className="text-[10px] font-bold text-white/90 uppercase">{currentMood} Mode</span>
            </div>
        </div>
        
        {/* Widget */}
        <SmartStack />
      </div>

      {/* Suggestion Strip - Uses Theme Surface */}
      <div className="w-full mb-6">
         <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={quickAction.action}
            className="w-full h-14 rounded-[24px] backdrop-blur-xl border border-white/10 shadow-lg flex items-center justify-between px-2 pl-4 transition-colors duration-500 overflow-hidden relative"
            style={{ backgroundColor: c.surface }}
         >
            <div className="flex items-center gap-3 relative z-10">
                <div className="p-2 rounded-full bg-white/20" style={{ color: c.textMain }}>
                    <QuickIcon size={16} />
                </div>
                <div className="flex flex-col items-start">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-60" style={{ color: c.textSecondary }}>Suggested</span>
                    <span className="text-sm font-bold" style={{ color: c.textMain }}>{quickAction.label}</span>
                </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center opacity-50" style={{ color: c.textMain }}>
                <ChevronRight size={18} />
            </div>
         </motion.button>
      </div>

      {/* App Grid - Fixed Layout */}
      <div className="grid grid-cols-4 gap-y-6 gap-x-2 flex-1 content-start z-10">
        <AppIcon icon={Mail} label="Mail" target="MailInbox" color="#3b82f6" />
        <AppIcon icon={Phone} label="Phone" target="Dialer" color="#10b981" />
        <AppIcon icon={Calculator} label="Calc" target="Calculator" color="#f59e0b" />
        <AppIcon icon={LayoutDashboard} label="Moods" target="Dashboard" color="#ec4899" />
        <AppIcon icon={Camera} label="Camera" color="#8b5cf6" /> 
        <AppIcon icon={Chrome} label="Web" color="#06b6d4" />
        <AppIcon icon={Music} label="Music" target="NotificationPanel" color="#ef4444" />
        <AppIcon icon={MapPin} label="Maps" color="#22c55e" />
      </div>
      
      {/* Dock Area - Glassmorphism */}
      <div className="relative mx-2 mb-2 p-3 rounded-[36px] bg-white/5 backdrop-blur-3xl border border-white/10 flex justify-between px-6 shadow-2xl z-20 items-center">
        <motion.button whileTap={{ scale: 0.85 }} onClick={() => navigateTo('Dialer')} className="p-3.5 rounded-2xl bg-green-500/90 text-white shadow-lg shadow-green-500/20">
            <Phone size={24} fill="currentColor" />
        </motion.button>
        <motion.button whileTap={{ scale: 0.85 }} onClick={() => navigateTo('MailInbox')} className="p-3.5 rounded-2xl bg-blue-500/90 text-white shadow-lg shadow-blue-500/20">
            <Mail size={24} />
        </motion.button>
        <motion.button whileTap={{ scale: 0.85 }} onClick={() => navigateTo('Dashboard')} className="p-3.5 rounded-2xl bg-pink-500/90 text-white shadow-lg shadow-pink-500/20">
            <LayoutDashboard size={24} />
        </motion.button>
        <motion.button whileTap={{ scale: 0.85 }} className="p-3.5 rounded-2xl bg-purple-500/90 text-white shadow-lg shadow-purple-500/20">
            <Camera size={24} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default HomeScreen;