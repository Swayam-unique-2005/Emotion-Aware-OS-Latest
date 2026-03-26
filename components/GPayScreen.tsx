import React from 'react';
import { ArrowLeft, ScanLine, Send, History, CreditCard, Wallet } from 'lucide-react';
import { useMood } from '../contexts/MoodContext';

const GPayScreen: React.FC = () => {
  const { currentTheme, navigateTo } = useMood();
  const c = currentTheme.colors;

  return (
    <div className="h-full w-full flex flex-col pt-8 px-6 pb-6 relative bg-white text-black animate-fade-in">
       {/* Header */}
       <div className="flex items-center gap-4 mb-8">
         <button onClick={() => navigateTo('Lockscreen')} className="p-2 rounded-full hover:bg-black/5">
            <ArrowLeft size={24} className="text-gray-800" />
         </button>
         <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight text-gray-800">GPay</span>
            </div>
         </div>
         <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
            JD
         </div>
       </div>

       {/* Payment Card */}
       <div className="w-full aspect-[1.58] bg-gradient-to-br from-gray-800 to-black rounded-2xl shadow-xl p-6 flex flex-col justify-between mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="flex justify-between items-start z-10">
             <CreditCard size={24} />
             <span className="font-mono text-sm opacity-80">Debit</span>
          </div>
          <div className="z-10">
             <span className="font-mono text-lg tracking-widest">•••• •••• •••• 4242</span>
          </div>
          <div className="flex justify-between items-end z-10">
             <span className="text-xs opacity-70">John Doe</span>
             <span className="text-lg font-bold">VISA</span>
          </div>
       </div>

       {/* Actions */}
       <div className="grid grid-cols-4 gap-4 mb-8">
         <div className="flex flex-col items-center gap-2">
            <button className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-1">
                <ScanLine size={24} />
            </button>
            <span className="text-xs font-medium text-gray-600">Scan</span>
         </div>
         <div className="flex flex-col items-center gap-2">
            <button className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-1">
                <Send size={24} />
            </button>
            <span className="text-xs font-medium text-gray-600">Send</span>
         </div>
         <div className="flex flex-col items-center gap-2">
            <button className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-1">
                <History size={24} />
            </button>
            <span className="text-xs font-medium text-gray-600">History</span>
         </div>
         <div className="flex flex-col items-center gap-2">
            <button className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-1">
                <Wallet size={24} />
            </button>
            <span className="text-xs font-medium text-gray-600">Bank</span>
         </div>
       </div>

       {/* Recent Activity */}
       <div className="flex-1">
         <h3 className="font-bold text-sm text-gray-800 mb-4">People</h3>
         <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
            {[1,2,3,4,5].map(i => (
                <div key={i} className="flex flex-col items-center gap-1 min-w-[60px]">
                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                        <img src={`https://picsum.photos/seed/${i}/100`} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[10px] text-gray-600 truncate w-full text-center">User {i}</span>
                </div>
            ))}
         </div>
       </div>

       <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <span className="text-[10px] text-gray-400">Simulation Only</span>
       </div>
    </div>
  );
};

export default GPayScreen;