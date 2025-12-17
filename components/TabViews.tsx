import React from 'react';
import { RepositoryItem, HistoryItem, LanguageMode, LANGUAGE_OPTIONS } from '../types';

// --- Repository View ---
interface RepositoryViewProps {
  items: RepositoryItem[];
  onSelect: (item: RepositoryItem) => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const RepositoryView: React.FC<RepositoryViewProps> = ({ items, onSelect, onUpload }) => {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black text-indigo-800">📚 Material Warehouse</h2>
          <label className="jelly-btn cursor-pointer bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-6 rounded-full shadow-[0_4px_0_rgb(67,56,202)] active:shadow-none active:translate-y-1 transition-all">
            + Import File
            <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
          </label>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 opacity-50">
            <div className="text-6xl mb-4">🕸️</div>
            <p className="font-bold text-indigo-300">It's empty here! Add some manga.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {items.map((item) => (
              <div 
                key={item.id}
                onClick={() => onSelect(item)}
                className="group cursor-pointer bg-[#FFFBF0] rounded-2xl p-3 shadow-sm border-2 border-[#FFE4C4] hover:border-indigo-300 hover:shadow-md transition-all relative"
              >
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-white mb-3 relative">
                  <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/20 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 bg-white text-indigo-600 font-bold px-3 py-1 rounded-full text-sm shadow-sm transform translate-y-4 group-hover:translate-y-0 transition-all">Analyze</span>
                  </div>
                </div>
                <p className="font-bold text-slate-700 text-sm truncate px-1">{item.name}</p>
                <p className="text-xs text-slate-400 px-1">{new Date(item.timestamp).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Settings View ---
interface SettingsViewProps {
  currentMode: LanguageMode;
  onModeChange: (mode: LanguageMode) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ currentMode, onModeChange }) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
      <div className="max-w-md w-full">
        <h2 className="text-3xl font-black text-indigo-800 mb-2 text-center">⚙️ Language Engine</h2>
        <p className="text-center text-slate-400 mb-10 font-medium">Select your translation direction</p>

        <div className="space-y-4">
          {(Object.keys(LANGUAGE_OPTIONS) as LanguageMode[]).map((mode) => {
             const isActive = currentMode === mode;
             return (
               <div 
                 key={mode}
                 onClick={() => onModeChange(mode)}
                 className={`
                   relative overflow-hidden cursor-pointer p-6 rounded-3xl border-4 transition-all duration-200
                   ${isActive 
                     ? 'bg-white border-green-400 shadow-[0_8px_0_rgb(74,222,128)] scale-105 z-10' 
                     : 'bg-white/60 border-indigo-100 hover:bg-white hover:border-indigo-200 text-slate-500'}
                 `}
               >
                 <div className="flex items-center justify-between relative z-10">
                   <div className="flex items-center gap-3">
                      <span className="text-2xl">{isActive ? '🟢' : '⚪'}</span>
                      <span className={`font-black text-lg ${isActive ? 'text-slate-800' : 'text-slate-400'}`}>
                        {LANGUAGE_OPTIONS[mode].label}
                      </span>
                   </div>
                   {isActive && <div className="text-2xl animate-pulse">✨</div>}
                 </div>
                 {isActive && <div className="absolute inset-0 bg-green-50 opacity-50 z-0"></div>}
               </div>
             );
          })}
        </div>
      </div>
    </div>
  );
};

// --- History View ---
interface HistoryViewProps {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ items, onSelect }) => {
  return (
    <div className="flex-1 overflow-y-auto p-6">
       <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-black text-indigo-800 mb-8">👤 Translation History</h2>

        {items.length === 0 ? (
          <div className="text-center py-20 opacity-50">
            <div className="text-6xl mb-4">🕰️</div>
            <p className="font-bold text-indigo-300">No history yet. Start translating!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
             {items.map((item) => (
               <div 
                 key={item.id}
                 onClick={() => onSelect(item)}
                 className="cursor-pointer group relative"
               >
                 <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-slate-200 shadow-md border-2 border-white group-hover:shadow-lg group-hover:-translate-y-1 transition-all">
                    <img src={item.thumbnail} alt="history" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Badge */}
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                       {items.indexOf(item) + 1}
                    </div>
                 </div>
                 <div className="mt-2 text-center">
                    <span className="text-[10px] font-bold text-indigo-400 bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-wide">
                      {LANGUAGE_OPTIONS[item.languageMode].label.split(' ')[0]}
                    </span>
                    <p className="text-xs text-slate-400 mt-1">{new Date(item.timestamp).toLocaleTimeString()}</p>
                 </div>
               </div>
             ))}
          </div>
        )}
       </div>
    </div>
  );
};