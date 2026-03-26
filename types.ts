export type Mood = 'Happy' | 'Sad' | 'Angry';

export interface Theme {
  id: Mood;
  isDark: boolean; // Added to track specific mode
  colors: {
    background: string;
    surface: string;
    surfaceHighlight: string;
    primary: string;
    secondary: string;
    textMain: string;
    textSecondary: string;
    accent: string;
    divider: string;
  };
  backgroundImage?: string;
}

export type AppScreen = 'Lockscreen' | 'NotificationPanel' | 'MailInbox' | 'Calculator' | 'Dialer' | 'Home' | 'Dashboard' | 'Recents' | 'Settings' | 'GPay' | 'GeoMood' | 'DataInsights';

export interface LogEntry {
  mood: Mood;
  timestamp: string;
  source: 'Manual' | 'AI';
  confidence?: number;
  location?: string;
}

export interface ClockStyle {
  font: string;
  color: string;
}

// New Interface for Notification Data
export interface NotificationItem {
  id: string;
  name: string; // Source App / Sender
  time: string;
  content: string;
  category: 'Important' | 'Unimportant';
  count?: number;
  image?: string;
}

// Music State Interface
export interface MusicState {
  isPlaying: boolean;
  trackName: string;
  artist: string;
  cover: string;
  progress: number; // 0-100
}