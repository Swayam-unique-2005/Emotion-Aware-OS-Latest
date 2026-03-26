import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudSun, Calendar, Music, CloudRain, CloudLightning, Sun, Play, Pause, SkipForward, Rewind } from 'lucide-react';
import { useMood } from '../contexts/MoodContext';

const SmartStack: React.FC = () => {
  const { currentTheme, currentMood, musicState, toggleMusicPlay } = useMood();
  const [index, setIndex] = useState(0);
  const c = currentTheme.colors;
  const [weatherData, setWeatherData] = useState<any>(null);

  const widgets = ['Weather', 'Calendar', 'Music'];

  // Real-Time Weather Fetch
  useEffect(() => {
    const fetchWeather = async () => {
        try {
            // Default to San Francisco coords if geolocation fails or just for prototype stability
            const lat = 37.7749;
            const lon = -122.4194;
            
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&temperature_unit=fahrenheit`);
            const data = await response.json();
            setWeatherData(data);
        } catch (e) {
            console.error("Weather fetch failed", e);
        }
    };
    fetchWeather();
    const interval = setInterval(fetchWeather, 600000); // 10 mins
    return () => clearInterval(interval);
  }, []);

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.y < -50) {
      setIndex((prev) => (prev + 1) % widgets.length);
    } else if (info.offset.y > 50) {
      setIndex((prev) => (prev - 1 + widgets.length) % widgets.length);
    }
  };

  // Weather Logic
  const getWeatherIcon = (code: number) => {
      if (code <= 3) return Sun; // Clear
      if (code <= 48) return CloudSun; // Cloudy
      if (code <= 67) return CloudRain; // Rain
      return CloudLightning; // Storm/Snow
  };

  const WeatherDisplay = () => {
      const temp = weatherData?.current?.temperature_2m 
        ? Math.round(weatherData.current.temperature_2m) + '°' 
        : '--';
      const Icon = weatherData?.current?.weather_code 
        ? getWeatherIcon(weatherData.current.weather_code) 
        : CloudSun;

      return (
        <>
            <div className="flex justify-between items-start w-full">
                <div className="flex flex-col text-white">
                <span className="font-bold text-lg">San Francisco</span>
                <span className="text-5xl font-light tracking-tighter">{temp}</span>
                </div>
                <Icon size={40} className="text-yellow-300 drop-shadow-lg" />
            </div>
            <div className="flex justify-between items-end text-white/80 text-xs font-medium w-full">
                <span>{weatherData ? 'Live Update' : 'Loading...'}</span>
                <span>H:72° L:55°</span>
            </div>
        </>
      );
  };

  // Calendar Logic (Real Date)
  const CalendarDisplay = () => {
      const today = new Date();
      const events = [
          { title: 'Design Review', time: '10:00 AM' },
          { title: 'Lunch with Team', time: '12:30 PM' },
          { title: 'Project Sync', time: '3:00 PM' }
      ];
      // Filter passed events roughly
      const upcoming = events.filter(e => {
          const [hour, period] = e.time.split(/:| /);
          const eventHour = period === 'PM' && hour !== '12' ? parseInt(hour) + 12 : parseInt(hour);
          return eventHour >= today.getHours();
      });

      const nextEvent = upcoming[0] || { title: 'No more events', time: 'Relax' };

      return (
        <>
            <div className="flex items-center gap-2 text-white w-full">
                <Calendar size={20} className="text-red-400" />
                <span className="font-bold uppercase text-xs tracking-wider">Up Next</span>
            </div>
            <div className="flex flex-col gap-1 text-white w-full mt-2">
                <span className="font-bold text-xl leading-tight truncate">{nextEvent.title}</span>
                <span className="text-sm opacity-70">{nextEvent.time}</span>
                <div className="flex -space-x-2 mt-3">
                    <img src="https://picsum.photos/seed/u1/30" className="w-6 h-6 rounded-full border border-black/20" />
                    <img src="https://picsum.photos/seed/u2/30" className="w-6 h-6 rounded-full border border-black/20" />
                    <div className="w-6 h-6 rounded-full bg-white/20 border border-black/20 flex items-center justify-center text-[8px] font-bold">+2</div>
                </div>
            </div>
        </>
      );
  };

  // Music Logic
  const MusicDisplay = () => (
      <>
            <div className="flex gap-4 items-center w-full">
            <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg relative">
                <img src={musicState.cover} className={`w-full h-full object-cover ${musicState.isPlaying ? 'animate-pulse' : ''}`} />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                   <Music size={16} className="text-white opacity-80" />
                </div>
            </div>
            <div className="flex flex-col text-white min-w-0 flex-1">
                <span className="font-bold text-lg truncate">{musicState.trackName}</span>
                <span className="text-sm opacity-70 truncate">{musicState.artist}</span>
            </div>
            </div>
            
            <div className="w-full flex flex-col gap-2 mt-1">
                <div className="flex items-center justify-between px-2">
                     <Rewind size={20} className="fill-white text-white opacity-70" />
                     <button onClick={(e) => { e.stopPropagation(); toggleMusicPlay(); }}>
                        {musicState.isPlaying ? <Pause size={28} className="fill-white text-white" /> : <Play size={28} className="fill-white text-white" />}
                     </button>
                     <SkipForward size={20} className="fill-white text-white opacity-70" />
                </div>
                <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: '0%' }}
                        animate={{ width: `${musicState.progress}%` }}
                        className="bg-white h-full" 
                    />
                </div>
            </div>
      </>
  );

  return (
    <div className="w-full h-44 relative rounded-[32px] overflow-hidden shadow-2xl border border-white/10 group cursor-grab active:cursor-grabbing">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={index}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          onDragEnd={handleDragEnd}
          initial={{ y: 100, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -100, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute inset-0 p-6 flex flex-col justify-between backdrop-blur-3xl bg-opacity-80"
          style={{ backgroundColor: c.surface }}
        >
            {widgets[index] === 'Weather' && <WeatherDisplay />}
            {widgets[index] === 'Calendar' && <CalendarDisplay />}
            {widgets[index] === 'Music' && <MusicDisplay />}

            {/* Pagination Dots */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 p-1 bg-black/10 rounded-full backdrop-blur-sm">
                {widgets.map((_, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === index ? 'bg-white scale-125' : 'bg-white/40'}`} />
                ))}
            </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SmartStack;