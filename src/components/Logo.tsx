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
      case 'light': return { primary: '#FFFFFF', accent: '#F27D26' };
      case 'accent': return { primary: '#F27D26', accent: '#1a1a1a' };
      case 'dark': 
      default: return { primary: '#1a1a1a', accent: '#F27D26' };
    }
  };

  const colors = getColors();

  return (
    <div className={cn("flex items-center gap-2 select-none", className)}>
      <div className="relative w-10 h-10 flex items-center justify-center">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Dynamic Background Ring */}
          <motion.circle 
            cx="50" 
            cy="50" 
            r="42" 
            stroke={colors.accent} 
            strokeWidth="1" 
            strokeDasharray="4 8"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="opacity-40"
          />

          {/* Stylized 'Z' */}
          <motion.path
            d="M25 35H75L25 65H75"
            stroke={colors.primary}
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
          
          {/* Vertical '4' bar accent */}
          <motion.path
            d="M50 25V75"
            stroke={colors.accent}
            strokeWidth="6"
            strokeLinecap="round"
            initial={{ pathLength: 0, scaleY: 0 }}
            animate={{ pathLength: 1, scaleY: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "backOut" }}
          />

          {/* Aesthetic Dots */}
          <circle cx="25" cy="35" r="4" fill={colors.accent} />
          <circle cx="75" cy="65" r="4" fill={colors.accent} />
        </svg>
      </div>
      
      {showText && (
        <div className="flex flex-col leading-none">
          <span 
            className={cn(
              "text-xl font-black tracking-tighter uppercase italic",
              variant === 'light' ? "text-white" : "text-primary"
            )}
          >
            zFour
          </span>
          <span 
            className={cn(
              "text-[9px] font-bold tracking-[0.4em] uppercase opacity-60 ml-0.5",
              variant === 'light' ? "text-white/70" : "text-gray-500"
            )}
          >
            Collection
          </span>
        </div>
      )}
    </div>
  );
};

// We need to import motion but Logo is a simple component. 
// I'll wrap it in a proper file with imports.
export default Logo;
