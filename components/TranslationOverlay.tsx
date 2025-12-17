import React, { useRef, useState } from 'react';
import { TranslationItem } from '../types';

interface TranslationOverlayProps {
  imageSrc: string;
  items: TranslationItem[];
  highlightedId: string | null;
  onHover: (id: string | null) => void;
}

export const TranslationOverlay: React.FC<TranslationOverlayProps> = ({ 
  imageSrc, 
  items, 
  highlightedId, 
  onHover 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="relative w-full h-full overflow-auto flex items-center justify-center p-8 custom-pattern-bg">
      <div 
        ref={containerRef} 
        className="relative shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-xl inline-block bg-white group/image"
      >
        {/* The Image */}
        <img 
          src={imageSrc} 
          alt="Original" 
          className="max-w-full max-h-[75vh] block object-contain rounded-xl"
          onLoad={() => setImageLoaded(true)}
        />

        {/* Overlay Markers */}
        {imageLoaded && items.map((item, index) => {
          const [ymin, xmin, ymax, xmax] = item.bbox;
          
          // Position Logic: Top-Right Corner
          // ymin = Top edge
          // xmax = Right edge
          const top = ymin * 100;
          const left = xmax * 100;

          const isHighlighted = highlightedId === item.id;
          
          return (
            <div
              key={item.id}
              style={{
                top: `${top}%`,
                left: `${left}%`,
                // Center the circle marker exactly on the corner point
                transform: 'translate(-50%, -50%)' 
              }}
              className={`
                absolute flex items-center justify-center
                cursor-pointer transition-transform duration-200 ease-out z-20
                ${isHighlighted ? 'scale-150 z-50' : 'hover:scale-110'}
              `}
              onMouseEnter={() => onHover(item.id)}
              onMouseLeave={() => onHover(null)}
            >
              {/* Circular Marker (Round) */}
              <div 
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%', // Perfect Circle
                  // 3D Semi-transparent yellow gradient
                  background: isHighlighted 
                    ? 'radial-gradient(circle at 30% 30%, rgba(255, 255, 200, 1), rgba(255, 215, 0, 1))' 
                    : 'radial-gradient(circle at 30% 30%, rgba(255, 255, 220, 0.9), rgba(255, 200, 0, 0.6))',
                  // Soft shadow + border definition
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2), inset 0 0 0 1px rgba(255,255,255,0.3)',
                  backdropFilter: 'blur(2px)'
                }}
                className="flex items-center justify-center border border-yellow-200/50"
              >
                <span className="text-[10px] font-black text-[#78350f] select-none">
                  {index + 1}
                </span>
              </div>

              {/* Tooltip Popup */}
              <div className={`
                absolute top-full mt-3 left-1/2 -translate-x-1/2 
                bg-white text-slate-800 text-left rounded-xl 
                shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] 
                min-w-[240px] max-w-[320px] border-2 border-indigo-50
                pointer-events-none transition-all duration-200 z-[60] overflow-hidden
                ${isHighlighted ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-2 invisible'}
              `}>
                 {/* Decorative Header Bar */}
                 <div className="h-1 w-full bg-yellow-400"></div>

                 {/* Triangle Arrow */}
                 <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t-2 border-l-2 border-indigo-50 transform rotate-45"></div>
                 
                 <div className="p-4">
                   <p className="font-['ZCOOL_KuaiLe'] text-xl leading-snug text-slate-800 mb-2">{item.translation}</p>
                   <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                     <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-1.5 rounded">{item.type}</span>
                     <p className="text-xs text-slate-400 font-medium italic truncate flex-1">{item.original}</p>
                   </div>
                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};