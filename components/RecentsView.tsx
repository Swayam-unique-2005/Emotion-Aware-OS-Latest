import React from 'react';
import { motion } from 'framer-motion';
import { X, Smartphone, Mail, Calculator, LayoutDashboard, Bell, Home } from 'lucide-react';
import { useMood } from '../contexts/MoodContext';
import { AppScreen } from '../types';

const RecentsView: React.FC = () => {
  const { recentApps, navigateTo, currentTheme } = useMood();
  const c = currentTheme.colors;

  const getIcon = (screen: AppScreen) => {
    switch(screen) {
        case 'Dialer': return Smartphone;
        case 'MailInbox': return Mail;
        case 'Calculator': return Calculator;
        case 'Dashboard': return LayoutDashboard;
        case 'NotificationPanel': return Bell;
        default: return Home;
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute inset-0 z-30 bg-black/80 backdrop-blur-md flex items-center overflow-x-auto no-scrollbar px-10 gap-6 snap-x snap-mandatory"
    >
        {recentApps.length === 0 && (
            <div className="w-full text-center text-white/50 text-sm">No recent apps</div>
        )}

        {recentApps.map((screen, idx) => {
            const Icon = getIcon(screen);
            return (
                <motion.div 
                    key={`${screen}-${idx}`}
                    layoutId={`card-${screen}`}
                    className="flex-shrink-0 w-[240px] h-[420px] rounded-[32px] overflow-hidden relative shadow-2xl snap-center flex flex-col"
                    onClick={() => navigateTo(screen)}
                >
                    {/* Header */}
                    <div className="flex items-center gap-2 p-4 bg-gray-800 text-white text-xs font-bold uppercase tracking-wider">
                        <Icon size={14} />
                        {screen}
                    </div>
                    {/* Mock Preview Body */}
                    <div 
                        className="flex-1 p-4 flex items-center justify-center relative"
                        style={{ backgroundColor: c.background }}
                    >
                        <div className="absolute inset-0 opacity-10 bg-white" />
                        <Icon size={64} style={{ color: c.textMain, opacity: 0.2 }} />
                        <div className="absolute inset-x-4 top-10 h-2 bg-black/10 rounded-full" />
                        <div className="absolute inset-x-4 top-16 h-2 bg-black/10 rounded-full w-2/3" />
                    </div>
                </motion.div>
            )
        })}
    </motion.div>
  );
};

export default RecentsView;