import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Mic, X } from 'lucide-react';
import { useMood } from '../contexts/MoodContext';
import { getAssistantResponse } from '../services/geminiService';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose }) => {
  const { currentMood, currentTheme } = useMood();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const c = currentTheme.colors;

  useEffect(() => {
    if (isOpen) {
      setHistory([{ role: 'ai', text: `Hi! I noticed you're feeling ${currentMood}. How can I help?` }]);
      setTimeout(() => inputRef.current?.focus(), 300);
    } else {
        setHistory([]);
    }
  }, [isOpen, currentMood]);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const response = await getAssistantResponse(userMsg, currentMood);
    
    setLoading(false);
    setHistory(prev => [...prev, { role: 'ai', text: response }]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Sheet */}
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 rounded-t-[32px] z-50 p-6 flex flex-col gap-4 shadow-2xl border-t border-white/20"
            style={{ 
                background: currentMood === 'Happy' ? 'linear-gradient(to top, #0e7490, #06b6d4)' : 
                            currentMood === 'Sad' ? 'linear-gradient(to top, #5c544e, #8d7f71)' : 
                            'linear-gradient(to top, #450a0a, #7f1d1d)',
                maxHeight: '60%'
            }}
          >
            {/* Handle */}
            <div className="w-12 h-1.5 bg-white/30 rounded-full self-center mb-2" />

            {/* Header */}
            <div className="flex justify-between items-center text-white">
                <div className="flex items-center gap-2">
                    <Sparkles className="animate-pulse text-yellow-300" size={20} />
                    <span className="font-bold text-lg">Gemini Assistant</span>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full"><X size={20} /></button>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-[200px] flex flex-col gap-3 pr-2 no-scrollbar">
                {history.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div 
                            className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                msg.role === 'user' 
                                ? 'bg-white text-black rounded-br-none' 
                                : 'bg-white/20 text-white backdrop-blur-md rounded-bl-none border border-white/10'
                            }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white/20 px-4 py-3 rounded-2xl rounded-bl-none flex gap-1">
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="relative">
                <input 
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask anything..."
                    className="w-full bg-black/20 text-white placeholder-white/50 border border-white/10 rounded-full pl-5 pr-12 py-3.5 focus:outline-none focus:bg-black/30 transition-colors"
                />
                <button 
                    onClick={handleSend}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white text-black rounded-full hover:scale-105 transition-transform disabled:opacity-50"
                    disabled={!input.trim()}
                >
                    <Send size={16} />
                </button>
            </div>
            
            <div className="text-center text-[10px] text-white/40">
                Powered by Google Gemini • Context Aware
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AIAssistant;