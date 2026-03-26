import React from 'react';
import { Menu, Search, Star, PenSquare, Mail, MessageSquare, Users, Video, ChevronLeft, Archive, Trash, MoreHorizontal, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useMood } from '../contexts/MoodContext';
import { motion, PanInfo } from 'framer-motion';

// Defined outside to prevent re-creation on render
const MailItem = ({ sender, subject, preview, time, active = false, star = false, initials, color, category, isAngry, themeColors }: any) => {
  const c = themeColors;
  // Logic for Angry Mood: Dim work emails, Highlight family
  const isWork = category === 'Work';
  const isFamily = category === 'Family';
  
  let opacityClass = "opacity-100";
  let highlightClass = "";

  if (isAngry) {
      if (isWork) opacityClass = "opacity-40 grayscale"; // Dim work
      if (isFamily) highlightClass = "bg-green-500/10 ring-1 ring-green-500/30 rounded-lg"; // Highlight family
  }

  return (
      <div className={`flex gap-4 py-4 px-4 border-b border-black/5 last:border-0 hover:bg-black/5 transition-all cursor-pointer group ${opacityClass} ${highlightClass}`}>
      <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm flex-shrink-0"
          style={{ backgroundColor: color || '#9ca3af' }}
      >
          {initials}
      </div>
      <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline mb-0.5">
          <h3 className={`text-sm truncate ${active ? 'font-bold' : 'font-semibold'}`} style={{ color: c.textMain }}>
              {sender}
              {isAngry && isWork && <span className="ml-2 text-[9px] px-1.5 py-0.5 bg-red-100 text-red-600 rounded">Avoid</span>}
              {isAngry && isFamily && <span className="ml-2 text-[9px] px-1.5 py-0.5 bg-green-100 text-green-600 rounded">Safe</span>}
          </h3>
          <span className="text-[10px] font-medium opacity-60" style={{ color: c.textSecondary }}>{time}</span>
          </div>
          <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold truncate mb-0.5" style={{ color: c.textMain }}>{subject}</h4>
              <p className="text-xs truncate opacity-70 leading-relaxed" style={{ color: c.textSecondary }}>{preview}</p>
          </div>
          <Star size={14} className={`${star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
          </div>
      </div>
      </div>
  );
};

const MailInbox: React.FC = () => {
  const { currentTheme, navigateTo, currentMood } = useMood();
  const c = currentTheme.colors;

  const handlePanEnd = (event: any, info: PanInfo) => {
    if (info.offset.x < -100) {
        navigateTo('Home');
    }
  };

  const isAngry = currentMood === 'Angry';

  return (
    <motion.div 
        className="h-full w-full flex flex-col relative"
        style={{ backgroundColor: c.background }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.05}
        onPanEnd={handlePanEnd}
    >
       {/* Safeguard Banner for Angry Mood */}
       {isAngry && (
           <div className="bg-red-500 text-white px-4 py-3 text-xs font-medium flex items-center justify-center gap-2 animate-in slide-in-from-top z-20 shadow-lg">
               <AlertTriangle size={14} className="animate-pulse" />
               <span>High Stress Detected. Avoid sending work emails.</span>
           </div>
       )}

       {/* Enterprise Header */}
       <div className={`pt-4 pb-4 px-4 flex flex-col gap-4 shadow-sm z-10 transition-colors ${isAngry ? 'pt-2' : 'pt-14'}`} style={{ backgroundColor: c.surface }}>
          <div className="flex items-center justify-between">
              <button onClick={() => navigateTo('Home')} className="p-2 -ml-2 rounded-full hover:bg-black/5" style={{ color: c.textMain }}>
                  <ChevronLeft size={24} />
              </button>
              <span className="text-sm font-bold tracking-wide" style={{ color: c.textMain }}>Inbox</span>
              <button className="p-2 -mr-2 rounded-full hover:bg-black/5" style={{ color: c.textMain }}>
                  <MoreHorizontal size={20} />
              </button>
          </div>

          <div className="h-10 rounded-xl flex items-center px-3 gap-3" style={{ backgroundColor: c.surfaceHighlight }}>
             <Search size={16} style={{ color: c.textSecondary }} />
             <input 
               type="text" 
               placeholder="Search mail" 
               className="flex-1 bg-transparent outline-none text-sm placeholder-opacity-50"
               style={{ color: c.textMain }} 
             />
             <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
                JD
             </div>
          </div>
       </div>

       {/* List Container */}
       <div className="flex-1 overflow-y-auto no-scrollbar px-3 pb-20 pt-2">
          <div className="rounded-2xl overflow-hidden shadow-sm border border-black/5" style={{ backgroundColor: c.surface }}>
            <MailItem category="Work" initials="ER" color="#3b82f6" sender="Boss (Ethan)" subject="URGENT: Google TO Presentations" preview="The new slides need review immediately..." time="10:42 AM" star isAngry={isAngry} themeColors={c} />
            <MailItem category="Work" initials="AJ" color="#10b981" sender="Alan, Jeffery" subject="Project Deadline Missed" preview="We need to discuss why this happened." time="9:15 AM" star isAngry={isAngry} themeColors={c} />
            <MailItem category="Family" initials="M" color="#f59e0b" sender="Mom" subject="Sunday Dinner?" preview="Hey! Are you free to come over this weekend?" time="8:32 AM" active isAngry={isAngry} themeColors={c} />
            <MailItem category="Family" initials="D" color="#8b5cf6" sender="Dad" subject="Car trouble" preview="Can you call me when you have a sec?" time="8:00 AM" isAngry={isAngry} themeColors={c} />
            <MailItem category="Work" initials="LS" color="#ec4899" sender="HR Dept" subject="Quarterly Review" preview="Please sign the attached document..." time="Yesterday" isAngry={isAngry} themeColors={c} />
            <MailItem category="Family" initials="S" color="#ef4444" sender="Sister" subject="Photos from trip" preview="Look at these!" time="Yesterday" isAngry={isAngry} themeColors={c} />
          </div>
          
          {isAngry && (
              <div className="mt-4 p-4 rounded-xl border border-dashed border-red-400/50 flex flex-col items-center justify-center text-center gap-2 opacity-70">
                  <ShieldCheck size={24} className="text-red-400" />
                  <p className="text-[10px]" style={{ color: c.textMain }}>AI has hidden 3 potentially stressful work emails.</p>
              </div>
          )}
       </div>

       {/* Floating Action Button */}
       <motion.button 
         whileTap={{ scale: 0.9 }}
         className={`absolute bottom-6 right-6 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-shadow hover:shadow-2xl z-20 ${isAngry ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
         style={{ backgroundColor: c.accent, color: 'white' }}
         onClick={() => isAngry && alert("AI Advice: Don't write emails while angry.")}
       >
         <PenSquare size={24} />
       </motion.button>

    </motion.div>
  );
};

export default MailInbox;