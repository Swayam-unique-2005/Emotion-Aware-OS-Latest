import React from 'react';
import { Delete, ChevronDown } from 'lucide-react';
import { useMood } from '../contexts/MoodContext';

const Calculator: React.FC = () => {
  const { currentTheme } = useMood();
  const c = currentTheme.colors;

  const CalcButton = ({ label, type = 'num' }: { label: React.ReactNode, type?: 'num' | 'op' | 'fn' }) => {
    let bg = 'transparent';
    let text = c.textMain;

    if (type === 'fn') {
      bg = c.surfaceHighlight; // Example: AC, (), %
    } else if (type === 'op') {
      bg = c.surface; // Example: /, x, -, +, =
    }

    return (
      <button 
        className="h-16 w-16 rounded-full flex items-center justify-center text-2xl font-medium transition-transform active:scale-90 shadow-sm"
        style={{ backgroundColor: bg, color: text }}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="h-full w-full flex flex-col relative">
      {/* Display Area */}
      <div className="flex-1 p-6 flex flex-col items-end justify-end transition-colors duration-500" style={{ backgroundColor: c.surface }}>
        <div className="w-full flex justify-between text-xs font-bold tracking-widest opacity-60 mb-auto" style={{ color: c.textSecondary }}>
           <span>DEG</span>
           <span>⋮</span>
        </div>
        
        <div className="text-6xl font-light tracking-tight mb-2" style={{ color: c.textMain }}>
          9×13<span className="animate-pulse opacity-50">|</span>
        </div>
        <div className="text-4xl opacity-60" style={{ color: c.textSecondary }}>
          117
        </div>
        
        {/* Handle bar visual */}
        <div className="w-8 h-1 bg-gray-400/30 rounded-full mx-auto mt-6"></div>
      </div>

      {/* Keypad */}
      <div className="bg-opacity-50 flex flex-col gap-4 p-6 pt-2" style={{ backgroundColor: 'transparent' }}>
        
        {/* Scientific Row */}
        <div className="flex justify-between px-2 mb-2 opacity-70" style={{ color: c.textMain }}>
           <span className="text-lg">√</span>
           <span className="text-lg">π</span>
           <span className="text-lg">e</span>
           <span className="text-lg">!</span>
           <ChevronDown size={20} />
        </div>

        <div className="grid grid-cols-4 gap-4 place-items-center">
          <CalcButton label="AC" type="fn" />
          <CalcButton label="( )" type="fn" />
          <CalcButton label="%" type="fn" />
          <CalcButton label="÷" type="fn" />

          <CalcButton label="7" />
          <CalcButton label="8" />
          <CalcButton label="9" />
          <CalcButton label="×" type="fn" />

          <CalcButton label="4" />
          <CalcButton label="5" />
          <CalcButton label="6" />
          <CalcButton label="-" type="fn" />

          <CalcButton label="1" />
          <CalcButton label="2" />
          <CalcButton label="3" />
          <CalcButton label="+" type="fn" />

          <CalcButton label="0" />
          <CalcButton label="." />
          <button className="h-16 w-16 flex items-center justify-center opacity-60 transition-opacity active:opacity-100" style={{ color: c.textMain }}>
            <Delete size={24} />
          </button>
          <CalcButton label="=" type="fn" />
        </div>
      </div>
    </div>
  );
};

export default Calculator;