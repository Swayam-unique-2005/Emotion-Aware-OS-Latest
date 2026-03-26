import React from 'react';
import { ArrowLeft, Moon, Type, Volume2, Shield } from 'lucide-react';
import { useMood } from '../contexts/MoodContext';

const SettingsScreen: React.FC = () => {
  const { currentTheme, navigateTo, systemState, toggleSystemState } = useMood();
  const c = currentTheme.colors;

  const SettingItem = ({ icon: Icon, label, value, onClick }: any) => (
    <div 
        onClick={onClick}
        className="flex items-center justify-between p-4 border-b border-white/5 cursor-pointer active:bg-white/5 transition-colors"
    >
        <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-white/10" style={{ color: c.textMain }}>
                <Icon size={20} />
            </div>
            <span className="text-sm font-medium" style={{ color: c.textMain }}>{label}</span>
        </div>
        {value !== undefined && (
            <div className="text-xs font-bold opacity-60" style={{ color: c.textSecondary }}>
                {value}
            </div>
        )}
    </div>
  );

  return (
    <div className="h-full w-full flex flex-col pt-8 px-0 pb-6 overflow-y-auto no-scrollbar animate-fade-in" style={{ backgroundColor: c.background }}>
      <div className="flex items-center gap-4 px-6 mb-6">
        <button onClick={() => navigateTo('NotificationPanel')} className="p-2 rounded-full hover:bg-white/10" style={{ color: c.textMain }}>
            <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold" style={{ color: c.textMain }}>Settings</h2>
      </div>

      <div className="mx-6 rounded-[24px] overflow-hidden shadow-sm backdrop-blur-xl border border-white/10" style={{ backgroundColor: c.surface }}>
         <SettingItem 
            icon={Moon} 
            label="Dark Mode" 
            value={systemState.isDarkMode ? "On" : "Off"} 
            onClick={() => toggleSystemState('isDarkMode')}
         />
         <SettingItem icon={Volume2} label="Sound & Haptics" value="Adaptive" />
         <SettingItem icon={Type} label="Display & Brightness" />
         <SettingItem icon={Shield} label="Privacy & Security" />
      </div>

      <div className="mx-6 mt-6 p-4 rounded-2xl border border-white/10 opacity-60" style={{ backgroundColor: c.surface, color: c.textMain }}>
        <h3 className="text-xs font-bold uppercase mb-2">Simulation Info</h3>
        <p className="text-[10px] leading-relaxed">
            Emotion-Aware OS Prototype v1.2<br/>
            Current Theme: {currentTheme.id} ({systemState.isDarkMode ? 'Dark' : 'Light'})
        </p>
      </div>
    </div>
  );
};

export default SettingsScreen;