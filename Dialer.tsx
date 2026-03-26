import React from 'react';
import { Phone, MessageCircle, StickyNote, Video, MicOff, ArrowLeft, MessageSquare, Volume2, Play, AlertCircle } from 'lucide-react';
import { useMood } from '../contexts/MoodContext';

const Dialer: React.FC = () => {
  const { currentTheme, currentMood, navigateTo } = useMood();
  const c = currentTheme.colors;
  const isAngry = currentMood === 'Angry';

  const ActionButton = ({ icon: Icon, label }: { icon: any, label?: string }) => (
    <button 
       className="flex items-center gap-2 px-6 py-3 rounded-full shadow-sm font-medium text-sm transition-transform active:scale-95"
       style={{ backgroundColor: c.surface, color: c.textMain }}
    >
      <Icon size={18} />
      {label && <span>{label}</span>}
    </button>
  );

  const CircleButton = ({ icon: Icon, filled = false }: { icon: any, filled?: boolean }) => (
    <button 
       className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-transform active:scale-95 border ${filled ? 'border-transparent' : 'border-black/5'}`}
       style={{ backgroundColor: filled ? c.surface : 'transparent', color: c.textMain, borderColor: c.divider }}
    >
      <Icon size={20} />
    </button>
  );

  const handleCall = () => {
    if (isAngry) {
        alert("AI Advice: Maybe text them instead? You seem upset.");
    } else {
        alert("Calling Jo Hall...");
    }
  };

  return (
    <div className="h-full w-full flex flex-col pt-8 px-6 pb-8 relative">
       {/* Header */}
       <div className="flex justify-between items-center mb-8" style={{ color: c.textMain }}>
         <button onClick={() => navigateTo('Home')} className="p-2 -ml-2 rounded-full hover:bg-black/5">
            <ArrowLeft size={24} />
         </button>
         <div className="flex gap-6">
           <MessageSquare size={24} />
           <Volume2 size={24} />
         </div>
       </div>

       {/* Contact Info */}
       <div className="flex flex-col items-center">
         <div className="w-16 h-16 rounded-full overflow-hidden mb-4 border-2" style={{ borderColor: c.surfaceHighlight }}>
            <img src="https://picsum.photos/seed/JoHall/200" className="w-full h-full object-cover" alt="Contact" />
         </div>
         <h2 className="text-3xl font-medium mb-1" style={{ color: c.textMain }}>Jo Hall</h2>
         <p className="text-sm opacity-60" style={{ color: c.textSecondary }}>Work Colleague</p>
       </div>

       {/* Hero Image */}
       <div className="flex-1 flex items-center justify-center my-6 relative">
         <div className="relative w-64 h-64">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute w-full h-full drop-shadow-xl" style={{ fill: c.surfaceHighlight }}>
              <path transform="translate(100 100)" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.2,-19.2,95.8,-5.3C93.5,8.6,82,21.5,70.9,32.4C59.8,43.3,49.1,52.2,37.3,60.6C25.5,69,12.7,76.9,-1.2,79C-15.1,81.1,-30.2,77.4,-43.3,69.5C-56.4,61.6,-67.5,49.5,-75.4,36C-83.3,22.5,-88,7.6,-85.7,-6.2C-83.4,-20,-74.1,-32.7,-63.4,-42.6C-52.7,-52.5,-40.6,-59.6,-28.4,-68.2C-16.2,-76.8,-3.9,-86.9,6.7,-98.5L17.3,-110.1" />
            </svg>
            <div className="absolute inset-4 rounded-full overflow-hidden flex items-center justify-center mask-image">
               <img src="https://picsum.photos/seed/person1/400" className={`w-full h-full object-cover transition-all duration-700 ${isAngry ? 'grayscale contrast-125' : ''}`} style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }} alt="Caller" />
            </div>
            
            {/* Angry Warning Overlay on Image */}
            {isAngry && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-red-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-center shadow-2xl border border-red-400 animate-pulse">
                        <AlertCircle size={24} className="mx-auto mb-1" />
                        <span className="text-xs font-bold block uppercase">Caution</span>
                        <span className="text-[10px]">Work Call detected</span>
                    </div>
                </div>
            )}

            {/* Overlay Buttons */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-8">
               <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center bg-black/20 text-white backdrop-blur-md">
                 <Video size={20} />
               </div>
               <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center bg-black/20 text-white backdrop-blur-md">
                 <MicOff size={20} />
               </div>
            </div>
         </div>
       </div>

       {/* Actions */}
       <div className="flex justify-center gap-4 mb-8">
         <ActionButton icon={Play} label="Message" />
         <ActionButton icon={StickyNote} label="Note" />
         <CircleButton icon={MicOff} />
       </div>

       {/* End Call / Tone Warning */}
       <div className="flex flex-col items-center justify-center mb-8 gap-3">
         {isAngry && (
             <div className="text-red-400 text-xs font-bold flex items-center gap-1.5 animate-bounce">
                 <AlertCircle size={12} />
                 Reminder: Keep tone neutral.
             </div>
         )}
         <button 
           className="flex items-center gap-3 px-10 py-4 rounded-full font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 relative overflow-hidden"
           style={{ backgroundColor: c.accent, color: currentTheme.id === 'Sad' ? 'white' : 'black' }}
           onClick={handleCall}
         >
           <Phone size={24} className="fill-current" />
           Call
           {isAngry && <div className="absolute inset-0 bg-red-500/20 pointer-events-none" />}
         </button>
       </div>
       
       <p className="text-center text-xs opacity-60 pb-2" style={{ color: c.textSecondary }}>Call using: (650) 555-0124</p>
    </div>
  );
};

export default Dialer;