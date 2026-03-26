import React, { useState, useRef, useEffect } from 'react';
import { CreditCard, ChevronDown, Phone, Wallet, ScanFace, Lock, Unlock } from 'lucide-react';
import { useMood } from '../contexts/MoodContext';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Mood } from '../types';

const LockScreen: React.FC = () => {
  const { currentTheme, triggerHaptic, currentMood, navigateTo } = useMood();
  const [isEditing, setIsEditing] = useState(false);
  const [fontStyle, setFontStyle] = useState('font-thin');
  const [customColor, setCustomColor] = useState<string | null>(null);
  const [unlockStatus, setUnlockStatus] = useState<'locked' | 'scanning' | 'unlocked'>('locked');
  
  const c = currentTheme.colors;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-scan on mount
  useEffect(() => {
    setUnlockStatus('scanning');
    const timer = setTimeout(() => {
        setUnlockStatus('unlocked');
        triggerHaptic();
    }, 1500); // Simulate scan time
    return () => clearTimeout(timer);
  }, []);

  // --------------------------------------------------
  // WALLPAPER LOGIC
  // --------------------------------------------------
  const getWallpaper = (mood: Mood) => {
    switch(mood) {
      case 'Happy': 
        // Bright, warm, nature/sun (Yellow/Green)
        return 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=1080&auto=format&fit=crop'; 
      case 'Sad': 
        // Calm, soothing, rain/clouds (Blue/Grey)
        return 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=1080&auto=format&fit=crop'; 
      case 'Angry': 
        // Calm, abstract, dark gradients (Red/Dark)
        return 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1080&auto=format&fit=crop'; 
      default:
        return 'https://picsum.photos/seed/nature/1080/2400';
    }
  }

  const handleTouchStart = () => {
    timeoutRef.current = setTimeout(() => {
        triggerHaptic();
        setIsEditing(true);
    }, 800);
  };

  const handleTouchEnd = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handlePanEnd = (event: any, info: PanInfo) => {
    // Swipe Up to Unlock
    if (info.offset.y < -100) { 
        triggerHaptic();
        navigateTo('Home');
    }
  };

  const fonts = ['font-thin', 'font-bold', 'font-serif', 'font-mono'];
  const colors = ['#ffffff', '#f87171', '#60a5fa', '#facc15', '#a78bfa'];

  return (
    <motion.div 
        className="h-full w-full flex flex-col relative pt-16 px-6 select-none"
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onPanEnd={handlePanEnd}
    >
      {/* Dynamic Emotion Wallpaper */}
      <div 
        className={`absolute inset-0 z-0 bg-cover bg-center transition-all duration-700 ease-in-out ${isEditing ? 'scale-90 blur-sm rounded-[40px] my-10' : ''}`}
        style={{ backgroundImage: `url(${getWallpaper(currentMood)})` }} 
      />
      {/* Overlay to ensure text readability and theme tint */}
      <div 
        className={`absolute inset-0 z-0 opacity-60 mix-blend-overlay transition-colors duration-700 ${isEditing ? 'scale-90 rounded-[40px] my-10' : ''}`}
        style={{ background: currentTheme.backgroundImage }}
      />
      
      {/* Face ID Status Icon */}
      {!isEditing && (
          <div className="absolute top-8 left-0 right-0 flex justify-center z-20">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                key={unlockStatus}
                className="flex items-center gap-2 text-white/80"
              >
                  {unlockStatus === 'locked' && <Lock size={20} />}
                  {unlockStatus === 'scanning' && <ScanFace size={20} className="animate-pulse" />}
                  {unlockStatus === 'unlocked' && <Unlock size={20} className="text-green-400" />}
                  
                  <span className="text-[10px] uppercase font-bold tracking-widest">
                      {unlockStatus === 'scanning' ? 'Scanning...' : unlockStatus === 'unlocked' ? 'Unlocked' : ''}
                  </span>
              </motion.div>
          </div>
      )}

      {/* Content */}
      <div className={`z-10 drop-shadow-md transition-all duration-300 mt-6 ${isEditing ? 'scale-90' : ''}`}>
        <motion.div 
            layout
            className={`border-2 ${isEditing ? 'border-white/50 bg-black/20' : 'border-transparent'} rounded-3xl p-4 text-center mb-4`}
        >
            <h1 
                className={`text-8xl tracking-tighter transition-all duration-300 ${fontStyle}`} 
                style={{ color: customColor || '#fff' }}
            >
                12:47
            </h1>
            <div className="mt-2 flex justify-center items-center gap-2 text-lg font-medium opacity-90 text-white">
               <span>Lunch in 30 min</span>
            </div>
        </motion.div>
        
        {!isEditing && (
            <div className="text-sm opacity-80 flex justify-center items-center gap-2 text-white">
               <span className="w-4 h-4 border border-white/60 rounded-sm inline-block"></span>
               12:30 - 1:00 PM
            </div>
        )}
      </div>

      {/* Editing Controls */}
      <AnimatePresence>
        {isEditing && (
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="absolute bottom-24 left-0 right-0 z-50 flex flex-col items-center gap-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-black/60 backdrop-blur-xl p-2 rounded-2xl flex gap-3 overflow-x-auto max-w-[90%]">
                    {fonts.map(f => (
                        <button key={f} onClick={() => setFontStyle(f)} className="px-4 py-2 bg-white/10 rounded-xl text-white text-xs">Abc</button>
                    ))}
                </div>
                <div className="bg-black/60 backdrop-blur-xl p-2 rounded-2xl flex gap-3">
                    {colors.map(col => (
                        <button 
                            key={col} 
                            onClick={() => setCustomColor(col)} 
                            className="w-8 h-8 rounded-full border-2 border-white/20"
                            style={{ backgroundColor: col }}
                        />
                    ))}
                </div>
                <button 
                    onClick={() => setIsEditing(false)} 
                    className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm shadow-lg"
                >
                    Done
                </button>
            </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1" />

      {/* Notifications on Lockscreen (Hidden when editing) */}
      {!isEditing && (
        <div className="z-10 flex flex-col gap-2 mb-12 animate-fade-in pointer-events-none">
            <div 
            className="rounded-[20px] p-4 flex items-start justify-between shadow-sm backdrop-blur-sm transition-colors duration-500 pointer-events-auto"
            style={{ backgroundColor: c.surface, color: c.textMain }}
            >
            <div className="flex items-center gap-3">
                <img src="https://picsum.photos/seed/Jane/40" className="w-10 h-10 rounded-full" alt="Jane" />
                <div>
                <div className="flex items-baseline gap-2">
                    <span className="font-bold text-sm">Jane</span>
                    <span className="text-xs opacity-60">2m</span>
                </div>
                <p className="text-sm opacity-90">Text me when you get here!</p>
                </div>
            </div>
            <div className="bg-white/30 px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
                2 <ChevronDown size={12} />
            </div>
            </div>
        </div>
      )}
      
      {/* Swipe Cue */}
      {!isEditing && (
         <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 0.6, y: [0, -10, 0] }}
           transition={{ delay: 2, duration: 2, repeat: Infinity }}
           className="absolute bottom-28 left-0 right-0 flex flex-col items-center gap-1 pointer-events-none z-0"
         >
            <ChevronDown size={20} className="rotate-180 text-white" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-white shadow-sm">Swipe to Unlock</span>
         </motion.div>
      )}

      {/* Bottom Shortcuts - Dual Setup */}
      {!isEditing && (
        <div className="z-10 flex justify-between items-end pb-8 px-4 w-full">
            {/* Left: Call */}
            <motion.button 
                whileTap={{ scale: 0.9 }}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => { e.stopPropagation(); navigateTo('Dialer'); }}
                className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg backdrop-blur-md bg-black/40 border border-white/10 text-white"
            >
                <Phone size={20} fill="currentColor" />
            </motion.button>

            {/* Right: GPay */}
            <motion.button 
                whileTap={{ scale: 0.9 }}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => { e.stopPropagation(); navigateTo('GPay'); }}
                className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg backdrop-blur-md bg-black/40 border border-white/10 text-white"
            >
                <Wallet size={20} />
            </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default LockScreen;