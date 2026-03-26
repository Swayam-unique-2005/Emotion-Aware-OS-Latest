import React from 'react';
import { useMood } from '../contexts/MoodContext';
import { MapPin, Clock, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_TIMELINE = [
  { id: 1, location: 'Home', mood: 'Happy', time: '08:00 AM', description: 'Woke up feeling refreshed.' },
  { id: 2, location: 'Office', mood: 'Sad', time: '10:30 AM', description: 'Stressed about the upcoming deadline.' },
  { id: 3, location: 'Cafe', mood: 'Happy', time: '01:15 PM', description: 'Enjoying a nice coffee break.' },
  { id: 4, location: 'Office', mood: 'Angry', time: '04:00 PM', description: 'Frustrated with a difficult meeting.' },
  { id: 5, location: 'Gym', mood: 'Happy', time: '06:30 PM', description: 'Great workout session.' },
  { id: 6, location: 'Home', mood: 'Happy', time: '09:00 PM', description: 'Relaxing after a long day.' },
];

const GeoMood: React.FC = () => {
  const { currentTheme } = useMood();
  const c = currentTheme.colors;

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'Happy': return '#10b981'; // Emerald
      case 'Sad': return '#3b82f6'; // Blue
      case 'Angry': return '#ef4444'; // Red
      default: return '#6b7280'; // Gray
    }
  };

  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden" style={{ backgroundColor: c.background, color: c.textMain }}>
      {/* Header */}
      <div className="pt-12 pb-4 px-6 z-10" style={{ backgroundColor: c.surfaceHighlight }}>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <MapPin size={24} style={{ color: c.primary }} />
          Location Emotion
        </h1>
        <p className="text-sm opacity-70 mt-1">Mood insights based on your locations</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        
        {/* Summary Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl border"
          style={{ backgroundColor: c.surface, borderColor: c.divider }}
        >
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Navigation size={16} style={{ color: c.accent }} />
            Daily Summary
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl" style={{ backgroundColor: c.background }}>
              <p className="text-xs opacity-70">Most Happy At</p>
              <p className="font-bold text-lg">Home</p>
            </div>
            <div className="p-3 rounded-xl" style={{ backgroundColor: c.background }}>
              <p className="text-xs opacity-70">Most Tense At</p>
              <p className="font-bold text-lg">Office</p>
            </div>
          </div>
        </motion.div>

        {/* Timeline */}
        <div>
          <h2 className="text-sm font-semibold mb-4 opacity-80">Today's Timeline</h2>
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
            {MOCK_TIMELINE.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-center justify-between"
              >
                {/* Icon */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 shrink-0 shadow z-10"
                     style={{ backgroundColor: c.surface, borderColor: c.background }}>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getMoodColor(item.mood) }} />
                </div>
                
                {/* Card */}
                <div className="w-[calc(100%-3rem)] p-4 rounded-2xl border shadow-sm ml-4"
                     style={{ backgroundColor: c.surface, borderColor: c.divider }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm">{item.location}</span>
                    <span className="text-xs flex items-center gap-1 opacity-60">
                      <Clock size={12} /> {item.time}
                    </span>
                  </div>
                  <div className="text-xs font-medium mb-2" style={{ color: getMoodColor(item.mood) }}>
                    {item.mood}
                  </div>
                  <p className="text-xs opacity-80 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeoMood;
