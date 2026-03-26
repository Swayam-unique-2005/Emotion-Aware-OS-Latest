import React, { useMemo, useState, useEffect } from 'react';
import { useMood } from '../contexts/MoodContext';
import { Activity, Heart, Zap, ArrowLeft, Music, Quote, Lightbulb, Clock, CalendarCheck } from 'lucide-react';
import { Mood } from '../types';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { currentTheme, moodHistory, currentMood, navigateTo } = useMood();
  const c = currentTheme.colors;
  const [advice, setAdvice] = useState<{type: string, text: string, sub: string} | null>(null);

  // 1. Diverse Advice Logic
  useEffect(() => {
    const getDiverseAdvice = (mood: Mood) => {
      const suggestions = {
        Happy: [
          { type: 'song', text: "Song Recommendation: 'Walking on Sunshine' by Katrina & The Waves", sub: "Keep the vibe high!" },
          { type: 'quote', text: "“The only way to do great work is to love what you do.”", sub: "- Steve Jobs" },
          { type: 'action', text: "You're in a flow state. Tackle that creative project now.", sub: "Productivity Tip" }
        ],
        Sad: [
          { type: 'song', text: "Song Recommendation: 'Three Little Birds' by Bob Marley", sub: "Don't worry about a thing." },
          { type: 'quote', text: "“This too shall pass.”", sub: "Ancient Wisdom" },
          { type: 'action', text: "Try the 5-4-3-2-1 grounding technique to reset.", sub: "Anxiety Relief" }
        ],
        Angry: [
          { type: 'song', text: "Song Recommendation: 'Weightless' by Marconi Union", sub: "Scientifically proven to reduce anxiety." },
          { type: 'quote', text: "“Speak when you are angry and you will make the best speech you will ever regret.”", sub: "- Ambrose Bierce" },
          { type: 'action', text: "Box Breathing: Inhale 4s, Hold 4s, Exhale 4s.", sub: "Immediate Relief" }
        ]
      };
      const list = suggestions[mood];
      return list[Math.floor(Math.random() * list.length)];
    };
    setAdvice(getDiverseAdvice(currentMood));
    const interval = setInterval(() => {
        setAdvice(getDiverseAdvice(currentMood));
    }, 15000);
    return () => clearInterval(interval);
  }, [currentMood]);

  const getIcon = (type: string) => {
      if (type === 'song') return Music;
      if (type === 'quote') return Quote;
      return Lightbulb;
  }
  
  const AdviceIcon = advice ? getIcon(advice.type) : Lightbulb;

  // 2. Data Processing for Graphs
  const getMoodColor = (mood: Mood) => {
      switch(mood) {
          case 'Happy': return '#d97706'; // Amber-600
          case 'Sad': return '#2563eb';   // Blue-600
          case 'Angry': return '#dc2626'; // Red-600
      }
  };

  const getMoodYValue = (mood: Mood) => {
      switch(mood) {
          case 'Happy': return 20; 
          case 'Sad': return 50;   
          case 'Angry': return 80; 
      }
  };

  const graphData = useMemo(() => moodHistory.slice(0, 15).reverse(), [moodHistory]);

  // 3. Duration Summary Calculation (Fitness Style)
  const durationStats = useMemo(() => {
    // Mock Calculation: Each log entry represents approx 15 minutes in a real app, 
    // or we just count count occurrences for the prototype.
    const stats = { Happy: 0, Sad: 0, Angry: 0 };
    let totalLogs = 0;
    
    moodHistory.forEach(entry => {
        if (stats[entry.mood] !== undefined) {
            stats[entry.mood]++;
            totalLogs++;
        }
    });

    // Avoid divide by zero
    if (totalLogs === 0) totalLogs = 1;

    return {
        Happy: { count: stats.Happy, percent: (stats.Happy / totalLogs) * 100 },
        Sad: { count: stats.Sad, percent: (stats.Sad / totalLogs) * 100 },
        Angry: { count: stats.Angry, percent: (stats.Angry / totalLogs) * 100 },
        totalLogs
    };
  }, [moodHistory]);

  // Helper to format "time" (simulated)
  const formatTime = (count: number) => {
      const minutes = count * 15; // Assume 15 mins per log block for simulation
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      if (h > 0) return `${h}h ${m}m`;
      return `${m}m`;
  };

  return (
    <div className="h-full w-full flex flex-col pt-8 px-6 pb-6 overflow-y-auto no-scrollbar animate-fade-in bg-transparent">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigateTo('Home')} className="p-2 rounded-full hover:bg-black/5 transition-colors" style={{ color: c.textMain }}>
            <ArrowLeft size={24} />
        </button>
        <div>
            <h2 className="text-2xl font-bold leading-none" style={{ color: c.textMain }}>Mood Dashboard</h2>
            <span className="text-xs opacity-60 font-medium" style={{ color: c.textSecondary }}>Daily Overview</span>
        </div>
      </div>

      {/* Daily Summary (Fitness Style) */}
      <div className="mb-6 p-6 rounded-[32px] shadow-sm border border-black/5" style={{ backgroundColor: c.surfaceHighlight }}>
          <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm" style={{ color: c.textMain }}>Today's Emotion Duration</h3>
              <CalendarCheck size={16} style={{ color: c.textSecondary }} />
          </div>

          <div className="flex flex-col gap-4">
              {/* Happy Bar */}
              <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-600 flex items-center justify-center">
                      <Zap size={16} fill="currentColor" />
                  </div>
                  <div className="flex-1">
                      <div className="flex justify-between text-xs font-bold mb-1" style={{ color: c.textMain }}>
                          <span>Happy</span>
                          <span>{formatTime(durationStats.Happy.count)}</span>
                      </div>
                      <div className="w-full h-2.5 bg-black/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${durationStats.Happy.percent}%` }}
                            transition={{ duration: 1 }}
                            className="h-full bg-amber-500 rounded-full"
                          />
                      </div>
                  </div>
              </div>

              {/* Sad Bar */}
              <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-600 flex items-center justify-center">
                      <Heart size={16} fill="currentColor" />
                  </div>
                  <div className="flex-1">
                      <div className="flex justify-between text-xs font-bold mb-1" style={{ color: c.textMain }}>
                          <span>Sad</span>
                          <span>{formatTime(durationStats.Sad.count)}</span>
                      </div>
                      <div className="w-full h-2.5 bg-black/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${durationStats.Sad.percent}%` }}
                            transition={{ duration: 1 }}
                            className="h-full bg-blue-500 rounded-full"
                          />
                      </div>
                  </div>
              </div>

              {/* Angry Bar */}
              <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-600 flex items-center justify-center">
                      <Activity size={16} fill="currentColor" />
                  </div>
                  <div className="flex-1">
                      <div className="flex justify-between text-xs font-bold mb-1" style={{ color: c.textMain }}>
                          <span>Angry</span>
                          <span>{formatTime(durationStats.Angry.count)}</span>
                      </div>
                      <div className="w-full h-2.5 bg-black/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${durationStats.Angry.percent}%` }}
                            transition={{ duration: 1 }}
                            className="h-full bg-red-500 rounded-full"
                          />
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* Expanded AI Suggestion Area */}
      <div className="flex-1 min-h-[180px] p-6 rounded-[32px] mb-6 shadow-sm transition-colors duration-500 relative overflow-hidden flex flex-col justify-center border border-black/5" 
           style={{ backgroundColor: c.surface, color: c.textMain }}>
         
         {advice && (
           <>
             <div className="absolute -bottom-4 -right-4 opacity-10 rotate-12">
                <AdviceIcon size={140} />
             </div>
             
             <div className="relative z-10">
               <div className="flex items-center gap-2 mb-3">
                 <div className="p-1.5 rounded-full bg-black/5">
                    <AdviceIcon size={14} />
                 </div>
                 <span className="font-bold text-[10px] uppercase tracking-widest opacity-60">Insight</span>
               </div>
               
               <h3 className="text-xl font-bold leading-tight mb-2 animate-fade-in pr-8">
                 {advice.text}
               </h3>
               
               <div className="inline-block px-3 py-1 rounded-full bg-black/5 text-[10px] font-bold opacity-70">
                  {advice.sub}
               </div>
             </div>
           </>
         )}
      </div>

      {/* Timeline Graph */}
      <div className="p-6 rounded-[32px] min-h-[240px] flex flex-col shadow-sm border border-black/5" style={{ backgroundColor: c.surface }}>
        <h3 className="font-bold text-sm mb-4 opacity-80" style={{ color: c.textMain }}>Timeline (Last Hour)</h3>
        
        <div className="flex-1 relative w-full h-full flex items-end pb-6 pl-8">
            <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[9px] font-bold opacity-40 py-2" style={{ color: c.textMain }}>
                <span>Happy</span>
                <span>Sad</span>
                <span>Angry</span>
            </div>

            {graphData.length > 1 ? (
                <svg className="w-full h-full overflow-visible">
                    {/* Grid Lines */}
                    <line x1="0" y1="20%" x2="100%" y2="20%" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="4 4" />
                    <line x1="0" y1="50%" x2="100%" y2="50%" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="4 4" />
                    <line x1="0" y1="80%" x2="100%" y2="80%" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="4 4" />

                    {/* Connecting Lines */}
                    {graphData.map((entry, i) => {
                        if (i === 0) return null;
                        const prev = graphData[i-1];
                        const x1 = ((i-1) / (graphData.length - 1)) * 100;
                        const x2 = (i / (graphData.length - 1)) * 100;
                        const y1 = getMoodYValue(prev.mood);
                        const y2 = getMoodYValue(entry.mood);
                        
                        return (
                            <line 
                                key={`line-${i}`}
                                x1={`${x1}%`} y1={`${y1}%`}
                                x2={`${x2}%`} y2={`${y2}%`}
                                stroke={getMoodColor(entry.mood)}
                                strokeWidth="2"
                                strokeLinecap="round"
                                className="transition-all duration-500"
                            />
                        );
                    })}

                    {/* Points */}
                    {graphData.map((entry, i) => {
                        const x = (i / (graphData.length - 1)) * 100;
                        const y = getMoodYValue(entry.mood);
                        const color = getMoodColor(entry.mood);
                        
                        return (
                            <circle 
                                key={`point-${i}`}
                                cx={`${x}%`} cy={`${y}%`} r="4" 
                                fill={color} 
                                className="transition-all duration-500 hover:r-6"
                            />
                        );
                    })}
                </svg>
            ) : (
                <div className="w-full h-full flex items-center justify-center opacity-40 text-xs">
                    Logging data...
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;