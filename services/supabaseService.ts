import { createClient } from '@supabase/supabase-js';
import { LogEntry, Mood } from '../types';

let supabase: any = null;

export const initSupabase = (url: string, key: string) => {
  try {
    supabase = createClient(url, key);
    console.log("Supabase initialized");
  } catch (error) {
    console.error("Failed to initialize Supabase:", error);
  }
};

export const logMood = async (mood: Mood, source: 'Manual' | 'AI') => {
  if (!supabase) {
    console.warn("Supabase not initialized. Logging to console only:", { mood, timestamp: new Date(), source });
    return;
  }

  try {
    const { error } = await supabase
      .from('mood_logs')
      .insert([
        { mood: mood, source: source, timestamp: new Date().toISOString() }
      ]);

    if (error) {
      console.error("Error logging mood to Supabase:", error);
    } else {
      console.log("Mood logged to Supabase successfully.");
    }
  } catch (err) {
    console.error("Unexpected error during Supabase log:", err);
  }
};