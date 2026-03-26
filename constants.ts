import { Theme, Mood } from './types';

// Helper to generate theme based on Mood + Dark Mode state
export const getTheme = (mood: Mood, isDark: boolean): Theme => {
  
  // 1. HAPPY (Unified Warm/Golden tones - Removed Green/Lime)
  if (mood === 'Happy') {
    return {
      id: 'Happy',
      isDark,
      colors: isDark ? {
        // Dark Mode: Deep Amber/Gold
        background: '#422006', // Yellow-950 (Brownish)
        surface: '#713f12',    // Yellow-900
        surfaceHighlight: '#854d0e',
        primary: '#facc15',    // Yellow-400
        secondary: '#3f2c22', 
        textMain: '#fefce8',   // Yellow-50
        textSecondary: '#fde047',
        accent: '#fbbf24',     // Amber-400
        divider: 'rgba(255,255,255,0.15)',
      } : {
        // Light Mode: Rich Sunflower/Marigold (High Contrast)
        background: '#fef3c7', // Amber-100
        surface: '#fde68a',    // Amber-200
        surfaceHighlight: '#fcd34d', // Amber-300
        primary: '#d97706',    // Amber-600
        secondary: '#fffbeb',  // Amber-50
        textMain: '#451a03',   // Amber-950 (Deep Brown for readability)
        textSecondary: '#92400e', // Amber-800
        accent: '#f59e0b',     // Amber-500
        divider: 'rgba(69, 26, 3, 0.1)',
      },
      backgroundImage: isDark 
        ? 'linear-gradient(to bottom right, #422006, #713f12)'
        : 'linear-gradient(to bottom right, #fef3c7, #fde68a)',
    };
  }

  // 2. SAD (Deepened Blue/Grey for better visibility)
  if (mood === 'Sad') {
    return {
      id: 'Sad',
      isDark,
      colors: isDark ? {
        // Dark Mode: Deep Navy
        background: '#0f172a', // Slate-950
        surface: '#1e293b',    // Slate-800
        surfaceHighlight: '#334155',
        primary: '#60a5fa',    // Blue-400
        secondary: '#020617',
        textMain: '#f1f5f9',   // Slate-100
        textSecondary: '#94a3b8',
        accent: '#38bdf8',
        divider: 'rgba(255,255,255,0.1)',
      } : {
        // Light Mode: Calm Slate/Blue (Darker than before)
        background: '#cbd5e1', // Slate-300 (Much darker than white)
        surface: '#e2e8f0',    // Slate-200
        surfaceHighlight: '#94a3b8', // Slate-400
        primary: '#2563eb',    // Blue-600
        secondary: '#f8fafc',
        textMain: '#0f172a',   // Slate-950
        textSecondary: '#334155', // Slate-700
        accent: '#0ea5e9',
        divider: 'rgba(15, 23, 42, 0.1)',
      },
      backgroundImage: isDark
        ? 'linear-gradient(to bottom, #0f172a, #1e293b)'
        : 'linear-gradient(to bottom, #cbd5e1, #e2e8f0)',
    };
  }

  // 3. ANGRY (Red tones)
  else {
    return {
      id: 'Angry',
      isDark,
      colors: isDark ? {
        // Dark Mode: Dark red / deeper crimson
        background: '#450a0a', // Red-950
        surface: '#7f1d1d',    // Red-900
        surfaceHighlight: '#991b1b',
        primary: '#f87171',    // Red-400
        secondary: '#2a0a0a',
        textMain: '#fee2e2',   // Red-100
        textSecondary: '#fca5a5',
        accent: '#ef4444',
        divider: 'rgba(255,255,255,0.1)',
      } : {
        // Light Mode: Soft Red/Rose
        background: '#ffe4e6', // Rose-100
        surface: '#fecdd3',    // Rose-200
        surfaceHighlight: '#fda4af', // Rose-300
        primary: '#be123c',    // Rose-700
        secondary: '#fff1f2',
        textMain: '#881337',   // Rose-900
        textSecondary: '#9f1239',
        accent: '#e11d48',
        divider: 'rgba(136, 19, 55, 0.1)',
      },
      backgroundImage: isDark
        ? 'linear-gradient(to bottom right, #450a0a, #7f1d1d)'
        : 'linear-gradient(to bottom right, #ffe4e6, #fecdd3)',
    };
  }
};

// Keep THEMES for compatibility if needed, but we mostly use getTheme now
export const THEMES = {
  Happy: getTheme('Happy', false),
  Sad: getTheme('Sad', false),
  Angry: getTheme('Angry', false),
};