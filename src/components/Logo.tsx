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
      case 'light': return { primary: '#FFFFFF', accent: '#e11d48' };
      case 'accent': return { primary: '#e11d48', accent: '#111111' };
      case 'dark': 
      default: return { primary: '#111111', accent: '#e11d48' };
    }
  };

  const colors = getColors();

  return (
    <div className={cn("flex items-center gap-3 select-none group cursor-pointer", className)}>
      <div className="relative flex items-center justify-center">
        {/* Luxury Circular Icon */}
        <div className={cn(
          "w-12 h-12 rounded-full border-[3px] flex items-center justify-center transition-all duration-700 group-hover:rotate-[360deg]",
          variant === 'light' ? "border-white/30 group-hover:border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]" : "border-primary/10 group-hover:border-accent shadow-[0_0_15px_rgba(0,0,0,0.05)]"
        )}>
          <span className={cn(
            "text-xl font-serif italic font-black",
            variant === 'light' ? "text-white" : "text-primary group-hover:text-accent"
          )}>
            C
          </span>
          <span className={cn(
            "text-xl font-serif italic font-black -ml-0.5",
            "text-accent drop-shadow-sm"
          )}>
            N
          </span>
        </div>
      </div>
      
      {showText && (
        <div className="flex flex-col leading-none">
          <span 
            className={cn(
              "text-3xl font-serif font-black tracking-tight uppercase italic transition-all duration-300",
              variant === 'light' ? "text-white" : "text-primary group-hover:tracking-wider"
            )}
          >
            Care<span className="text-accent underline decoration-4 underline-offset-4">Nexon</span>
          </span>
          <div className="flex items-center gap-2 mt-2 opacity-70">
            <div className={cn("h-[1px] w-5", variant === 'light' ? "bg-white" : "bg-accent")} />
            <span 
              className={cn(
                "text-[7px] font-bold tracking-[0.5em] uppercase",
                variant === 'light' ? "text-white" : "text-primary"
              )}
            >
              Luxury Boutique
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// We need to import motion but Logo is a simple component. 
// I'll wrap it in a proper file with imports.
export default Logo;
