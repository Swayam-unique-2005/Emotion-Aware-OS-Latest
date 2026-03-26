import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Mood, Theme, AppScreen, LogEntry, MusicState } from '../types';
import { getTheme, THEMES } from '../constants';
import { logMood } from '../services/supabaseService';

interface SystemState {
  isWifiOn: boolean;
  isBluetoothOn: boolean;
  isFlashlightOn: boolean;
  isDarkMode: boolean;
}

interface MoodContextType {
  currentMood: Mood;
  currentTheme: Theme;
  setMood: (mood: Mood, source?: 'Manual' | 'AI', confidence?: number) => void;
  isProcessing: boolean;
  setIsProcessing: (val: boolean) => void;
  activeScreen: AppScreen;
  navigateTo: (screen: AppScreen) => void;
  moodHistory: LogEntry[];
  isAppDrawerOpen: boolean;
  setIsAppDrawerOpen: (val: boolean) => void;
  recentApps: AppScreen[];
  triggerHaptic: () => void;
  // System State
  systemState: SystemState;
  toggleSystemState: (key: keyof SystemState) => void;
  // Music State
  musicState: MusicState;
  setMusicState: React.Dispatch<React.SetStateAction<MusicState>>;
  toggleMusicPlay: () => void;
  
  // New features
  apiEnabled: boolean;
  setApiEnabled: (val: boolean) => void;
  uploadedDataset: any[] | null;
  setUploadedDataset: (data: any[] | null) => void;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export const MoodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentMood, setCurrentMood] = useState<Mood>('Happy');
  const [systemState, setSystemState] = useState<SystemState>({
    isWifiOn: true,
    isBluetoothOn: true,
    isFlashlightOn: false,
    isDarkMode: false,
  });
  
  // Music State
  const [musicState, setMusicState] = useState<MusicState>({
    isPlaying: false,
    trackName: 'Solar Power',
    artist: 'Lorde',
    cover: 'https://picsum.photos/seed/music/200',
    progress: 30
  });

  const [currentTheme, setCurrentTheme] = useState<Theme>(getTheme('Happy', false));
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeScreen, setActiveScreen] = useState<AppScreen>('Home');
  const [moodHistory, setMoodHistory] = useState<LogEntry[]>([]);
  const [isAppDrawerOpen, setIsAppDrawerOpen] = useState(false);
  const [recentApps, setRecentApps] = useState<AppScreen[]>([]);
  
  const [apiEnabled, setApiEnabled] = useState(true);
  const [uploadedDataset, setUploadedDataset] = useState<any[] | null>(null);
  
  // Voice AI Logic
  const prevMood = useRef<Mood>(currentMood);

  useEffect(() => {
    // Update theme whenever mood or dark mode changes
    setCurrentTheme(getTheme(currentMood, systemState.isDarkMode));

    // Voice Feedback Trigger
    if (prevMood.current !== currentMood) {
       handleMoodVoiceFeedback(currentMood);
       prevMood.current = currentMood;
    }
  }, [currentMood, systemState.isDarkMode]);

  const handleMoodVoiceFeedback = (mood: Mood) => {
    if (!('speechSynthesis' in window)) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    let text = "";
    if (mood === 'Angry') {
        text = "Calm down. Take a deep breath. Everything will be okay.";
    } else if (mood === 'Sad') {
        text = "It's okay to feel down sometimes. Take it easy.";
    } else if (mood === 'Happy') {
        text = "You're doing great! Keep up the positive energy.";
    }

    if (text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9; // Slightly slower, calmer
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
    }
  };

  const setMood = (mood: Mood, source: 'Manual' | 'AI' = 'Manual', confidence: number = 1.0) => {
    setCurrentMood(mood);
    const newEntry: LogEntry = { 
      mood, 
      source, 
      timestamp: new Date().toISOString(),
      confidence 
    };
    setMoodHistory(prev => [newEntry, ...prev].slice(0, 50));
    logMood(mood, source);
  };

  const navigateTo = (screen: AppScreen) => {
    triggerHaptic();
    if (screen !== 'Recents' && screen !== 'Lockscreen' && screen !== 'Settings' && screen !== activeScreen) {
      setRecentApps(prev => {
        const filtered = prev.filter(s => s !== screen);
        return [screen, ...filtered].slice(0, 5);
      });
    }
    setActiveScreen(screen);
    setIsAppDrawerOpen(false);
  };

  const toggleSystemState = (key: keyof SystemState) => {
    triggerHaptic();
    setSystemState(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleMusicPlay = () => {
    setMusicState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const triggerHaptic = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
  }, []);

  return (
    <MoodContext.Provider value={{ 
      currentMood, 
      currentTheme, 
      setMood, 
      isProcessing, 
      setIsProcessing,
      activeScreen,
      navigateTo,
      moodHistory,
      isAppDrawerOpen,
      setIsAppDrawerOpen,
      recentApps,
      triggerHaptic,
      systemState,
      toggleSystemState,
      musicState,
      setMusicState,
      toggleMusicPlay,
      apiEnabled,
      setApiEnabled,
      uploadedDataset,
      setUploadedDataset
    }}>
      {children}
    </MoodContext.Provider>
  );
};

export const useMood = () => {
  const context = useContext(MoodContext);
  if (!context) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
};