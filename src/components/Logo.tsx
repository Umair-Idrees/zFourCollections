import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'accent';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className, variant = 'dark', showText = true }) => {
  const getColors = () => {
    switch (variant) {
      case 'light': return { primary: '#FFFFFF', accent: '#c5a059' };
      case 'accent': return { primary: '#c5a059', accent: '#111111' };
      case 'dark': 
      default: return { primary: '#111111', accent: '#c5a059' };
    }
  };

  const colors = getColors();

  return (
    <div className={cn("flex items-center gap-2 select-none", className)}>
      <div className="relative w-12 h-12 flex items-center justify-center">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Elegant Circular Frame */}
          <circle cx="50" cy="50" r="48" stroke={colors.accent} strokeWidth="0.5" strokeDasharray="2 4" className="opacity-40" />
          <circle cx="50" cy="50" r="42" stroke={colors.accent} strokeWidth="2" />
          
          {/* Serif Monogram 'CN' */}
          <text 
            x="50" 
            y="58" 
            fill={colors.accent} 
            fontSize="32" 
            fontWeight="900" 
            fontFamily="serif" 
            textAnchor="middle" 
            className="italic font-serif"
          >
            CN
          </text>

          {/* Luxury Accents */}
          <circle cx="50" cy="18" r="3" fill={colors.accent} />
          <circle cx="50" cy="82" r="3" fill={colors.accent} />
        </svg>
      </div>
      
      {showText && (
        <div className="flex flex-col leading-none">
          <span 
            className={cn(
              "text-2xl font-serif font-black tracking-tight uppercase italic",
              variant === 'light' ? "text-white" : "text-primary"
            )}
          >
            Care<span className="text-accent">Nexon</span>
          </span>
          <span 
            className={cn(
              "text-[8px] font-bold tracking-[0.5em] uppercase opacity-70 ml-0.5 mt-0.5",
              variant === 'light' ? "text-white/70" : "text-accent"
            )}
          >
            Luxury Boutique
          </span>
        </div>
      )}
    </div>
  );
};

// We need to import motion but Logo is a simple component. 
// I'll wrap it in a proper file with imports.
export default Logo;
