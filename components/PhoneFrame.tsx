import React, { useState, useRef, useEffect } from 'react';
import { useMood } from '../contexts/MoodContext';
import { Wifi, Battery, Signal, Bluetooth, Flashlight, Brain, Sparkles, AppWindow, Zap } from 'lucide-react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import AIAssistant from './AIAssistant';
import { Mood } from '../types';

interface PhoneFrameProps {
  children: React.ReactNode;
}

const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  const { currentTheme, navigateTo, activeScreen, triggerHaptic, systemState, recentApps, currentMood, moodHistory } = useMood();
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isIslandExpanded, setIsIslandExpanded] = useState(false);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Gesture Bar Logic
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info;
    triggerHaptic();

    // Swipe Up -> Home / Recents
    if (offset.y < -40) {
        if (velocity.y < -300) {
             if (activeScreen !== 'Home') navigateTo('Home');
        } else {
             navigateTo('Recents');
        }
    }
    
    // Swipe Left/Right -> App Switching
    if (Math.abs(offset.x) > 60 && Math.abs(offset.y) < 40) {
        if (recentApps.length > 0) {
             const target = recentApps[0];
             if (target && target !== activeScreen) navigateTo(target);
        }
    }
  };

  const handlePressStart = () => {
    pressTimer.current = setTimeout(() => {
        triggerHaptic();
        setIsAssistantOpen(true);
    }, 600);
  };

  const handlePressEnd = () => {
    if (pressTimer.current) {
        clearTimeout(pressTimer.current);
    }
  };

  // --- MOOD AI LOGIC ---
  const latestConfidence = moodHistory[0]?.confidence || 0.88;

  const getMoodColor = (mood: Mood) => {
    switch(mood) {
      case 'Happy': return 'text-amber-400';
      case 'Sad': return 'text-blue-400';
      case 'Angry': return 'text-red-400';
    }
  };

  const getGeneralSuggestion = (mood: Mood) => {
    switch(mood) {
      case 'Happy': return "You're radiating positivity! Use this energy to tackle creative tasks.";
      case 'Sad': return "Low energy detected. Try a 5-minute walk or listen to acoustic tracks.";
      case 'Angry': return "High intensity detected. Take deep breaths before responding to messages.";
    }
  };

  const getAppSuggestion = (mood: Mood, screen: string) => {
    if (screen === 'MailInbox') {
        if (mood === 'Angry') return "Analysis suggests high tension. Re-read drafts twice before sending.";
        if (mood === 'Sad') return "Don't feel pressured to reply immediately. It's okay to wait.";
        return "You are in a good flow state for productivity.";
    }
    if (screen === 'Dialer') {
        if (mood === 'Angry') return "Consider cooling down before making important calls.";
        return "Ready to connect.";
    }
    if (screen === 'Dashboard') return "Reviewing your emotional trends can help build resilience.";
    
    // Default
    if (mood === 'Angry') return "A moment of stillness is recommended.";
    if (mood === 'Happy') return "Great time to explore new features.";
    return "Stay mindful of your energy levels.";
  };

  // Unique Feature: Dynamic Island Pulse Animation based on Mood
  const getPulseVariant = (mood: Mood) => {
      const defaultSpring = { type: "spring", damping: 25, stiffness: 200 };

      if (mood === 'Angry') {
          // Rapid, agitated breathing
          return { 
              scale: [1, 1.05, 1], 
              transition: { 
                  scale: { duration: 0.8, repeat: Infinity, ease: "easeInOut" },
                  default: defaultSpring
              } 
          };
      } else if (mood === 'Happy') {
          // Energetic bounce
          return { 
              scale: [1, 1.02, 1], 
              transition: { 
                  scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
                  default: defaultSpring
              } 
          };
      } else {
          // Slow, calm breathing (Sad)
          return { 
              scale: [1, 1.01, 1], 
              transition: { 
                  scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  default: defaultSpring
              } 
          };
      }
  };

  return (
    <div className="relative w-full h-full bg-black rounded-[50px] shadow-2xl border-[6px] border-[#1a1a1a] overflow-hidden ring-4 ring-gray-800/50 flex flex-col select-none">
      {/* Dynamic Background */}
      <div 
        className="absolute inset-0 transition-colors duration-700 ease-in-out z-0"
        style={{ 
          background: currentTheme.colors.background,
          backgroundImage: currentTheme.backgroundImage 
        }}
      />
      
      {/* Status Bar */}
      <div className="absolute top-0 w-full h-12 z-50 flex justify-between px-8 items-center text-[10px] font-semibold tracking-wide transition-colors duration-500" style={{ color: currentTheme.colors.textMain }}>
         <span>9:41</span>
         <div className="flex gap-1.5 items-center">
           {systemState.isBluetoothOn && <Bluetooth size={12} strokeWidth={2.5} />}
           {systemState.isFlashlightOn && <Flashlight size={12} strokeWidth={2.5} />}
           <Signal size={12} strokeWidth={2.5} />
           {systemState.isWifiOn && <Wifi size={12} strokeWidth={2.5} />}
           <Battery size={16} strokeWidth={2.5} />
         </div>
      </div>

      {/* --- CENTERED DYNAMIC ISLAND --- */}
      <div className="absolute top-3 left-0 right-0 z-[60] flex justify-center pointer-events-none">
          <motion.div 
            layout
            initial={{ width: 120, height: 32, borderRadius: 20 }}
            animate={(isIslandExpanded ? { 
                width: 340,
                height: 360,
                borderRadius: 32,
                scale: 1, // No pulse when expanded
                transition: { type: "spring", damping: 25, stiffness: 200 }
            } : {
                width: 120,
                height: 32,
                borderRadius: 20,
                ...getPulseVariant(currentMood) // Pulse when collapsed
            }) as any}
            className="bg-black shadow-2xl overflow-hidden pointer-events-auto cursor-pointer"
            onClick={() => setIsIslandExpanded(!isIslandExpanded)}
          >
            <AnimatePresence mode="wait">
                {isIslandExpanded ? (
                    /* EXPANDED STATE - 3 SEGMENTS */
                    <motion.div 
                        key="expanded"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col w-full h-full p-6 text-white"
                    >
                        {/* Segment 1: Mood Analysis */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Brain size={16} className={getMoodColor(currentMood)} />
                                <span className="text-xs font-bold uppercase tracking-widest opacity-60">Mood Analysis</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="text-3xl font-bold tracking-tight">{currentMood}</span>
                                <span className="text-xs font-mono opacity-50">{(latestConfidence * 100).toFixed(0)}% Conf</span>
                            </div>
                            {/* Visual Timeline */}
                            <div className="flex gap-1 mt-3 h-1.5 w-full">
                                {moodHistory.slice(0, 20).reverse().map((entry, i) => (
                                    <div 
                                        key={i} 
                                        className={`flex-1 rounded-full ${entry.mood === 'Angry' ? 'bg-red-500' : entry.mood === 'Happy' ? 'bg-amber-500' : 'bg-blue-500'}`} 
                                        style={{ opacity: 1 - (i * 0.05) }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="w-full h-[1px] bg-white/10 mb-6" />

                        {/* Segment 2: Mood AI Suggestions */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles size={16} className="text-purple-400" />
                                <span className="text-xs font-bold uppercase tracking-widest opacity-60">AI Insight</span>
                            </div>
                            <p className="text-sm leading-relaxed opacity-90">
                                {getGeneralSuggestion(currentMood)}
                            </p>
                        </div>

                        <div className="w-full h-[1px] bg-white/10 mb-6" />

                        {/* Segment 3: App-Specific Suggestions */}
                        <div className="flex-1">
                             <div className="flex items-center gap-2 mb-2">
                                <AppWindow size={16} className="text-green-400" />
                                <span className="text-xs font-bold uppercase tracking-widest opacity-60">Context Aware</span>
                            </div>
                             <div className="bg-white/10 rounded-xl p-3 border border-white/5">
                                 <p className="text-xs font-medium italic text-white/80">
                                    "{getAppSuggestion(currentMood, activeScreen)}"
                                 </p>
                             </div>
                        </div>
                        
                        <div className="mt-2 text-center text-[9px] opacity-30">Tap to collapse</div>
                    </motion.div>
                ) : (
                    /* COLLAPSED STATE */
                    <motion.div 
                        key="collapsed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-full flex items-center justify-center gap-2 px-3"
                    >
                        <Zap size={12} className={getMoodColor(currentMood)} fill="currentColor" />
                        <span className="text-[10px] font-bold text-white tracking-wide">
                            AI Active
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
          </motion.div>
      </div>

      {/* Screen Content */}
      <div className="relative z-10 w-full flex-1 pt-8 overflow-hidden">
        {children}
      </div>

      {/* Assistant Overlay */}
      <AIAssistant isOpen={isAssistantOpen} onClose={() => setIsAssistantOpen(false)} />

      {/* Bottom Nav / Gesture Bar - Persistent */}
      <div className="absolute bottom-0 left-0 w-full h-10 z-50 flex items-end justify-center pb-2.5">
         <motion.div 
            drag
            dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            onMouseDown={handlePressStart}
            onMouseUp={handlePressEnd}
            onTouchStart={handlePressStart}
            onTouchEnd={handlePressEnd}
            whileHover={{ scaleX: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-36 h-1.5 bg-white/70 backdrop-blur-md rounded-full shadow-sm cursor-grab active:cursor-grabbing hover:bg-white"
         />
      </div>
    </div>
  );
};

export default PhoneFrame;