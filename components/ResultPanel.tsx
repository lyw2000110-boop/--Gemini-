import React from 'react';
import { TranslationItem } from '../types';

interface ResultPanelProps {
  items: TranslationItem[];
  highlightedId: string | null;
  onHover: (id: string | null) => void;
}

export const ResultPanel: React.FC<ResultPanelProps> = ({ items, highlightedId, onHover }) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-indigo-300 p-8 text-center">
        <div className="text-6xl mb-4 grayscale opacity-50">💤</div>
        <p className="font-bold text-lg">Waiting for magic...</p>
      </div>
    );
  }

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'dialogue': return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-500', icon: '💬' };
      case 'sfx': return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-500', icon: '💥' };
      case 'narration': return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-500', icon: '📝' };
      default: return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-500', icon: '📄' };
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 bg-transparent">
      <h2 className="text-xl font-black text-indigo-800 mb-6 sticky top-0 bg-white/95 backdrop-blur py-4 border-b-2 border-indigo-50 z-10 flex items-center gap-2">
        <span>✨</span> Translations ({items.length})
      </h2>
      
      <div className="space-y-4 pb-8">
        {items.map((item, index) => {
          const style = getTypeStyle(item.type);
          const isHighlighted = highlightedId === item.id;
          
          return (
            <div
              key={item.id}
              id={`result-item-${item.id}`}
              onMouseEnter={() => onHover(item.id)}
              onMouseLeave={() => onHover(null)}
              className={`
                relative p-5 rounded-3xl border-2 transition-all duration-300 cursor-pointer
                ${isHighlighted 
                  ? 'border-yellow-400 bg-yellow-50 shadow-[0_8px_0_rgba(250,204,21,0.4)] -translate-y-1 scale-[1.02] z-10' 
                  : `${style.border} ${style.bg} hover:shadow-[0_4px_0_rgba(0,0,0,0.05)] hover:-translate-y-0.5`}
              `}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold text-amber-950 bg-yellow-400 ring-2 ring-yellow-200`}>
                    {index + 1}
                  </span>
                  <span className={`text-[10px] font-black px-2 py-1 rounded-lg bg-white/50 border ${style.border} ${style.text} uppercase tracking-wider`}>
                    {style.icon} {item.type}
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-lg text-slate-800 font-bold leading-snug">{item.translation}</p>
              </div>

              <div className="pt-3 border-t border-black/5">
                 <p className="text-xs text-slate-400 font-medium italic">{item.original}</p>
              </div>

              {item.bg_color && (
                <div className="absolute -right-1 -bottom-1 opacity-50">
                   <div 
                      className="w-4 h-4 rounded-full border border-white shadow-sm flex items-center justify-center text-[8px]"
                      style={{ backgroundColor: item.bg_color === 'complex' ? '#eee' : item.bg_color }}
                    >
                    </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};