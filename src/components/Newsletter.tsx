import React from 'react';
import { Send, Heart, CheckCircle2 } from 'lucide-react';

export default function Newsletter() {
  return (
    <section className="py-24 bg-neutral-950 relative overflow-hidden">
      {/* Immersive background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1600&auto=format&fit=crop" 
          alt="Fabric Background" 
          className="w-full h-full object-cover opacity-[0.05] mix-blend-overlay blur-sm"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-transparent to-neutral-950/80"></div>
      </div>

      {/* Decorative floral-like background patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.05] pointer-events-none text-white">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="floral" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M50 10 Q60 30 50 50 Q40 30 50 10 M50 50 Q70 60 90 50 Q70 40 50 50 M50 50 Q40 70 50 90 Q60 70 50 50 M50 50 Q30 40 10 50 Q30 60 50 50" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#floral)" />
        </svg>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 relative z-10 flex flex-col items-center">
        {/* Boutique Icon */}
        <div className="mb-6 flex items-center justify-center bg-white/5 border border-white/10 backdrop-blur-sm p-4 rounded-full shadow-sm">
          <Heart size={28} className="text-accent fill-accent/20 animate-pulse" />
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-black text-white mb-6 tracking-tight leading-tight italic">
            Join the <span className="text-accent">Fashion Circle</span>
          </h2>
          <p className="text-gray-400 font-medium text-lg md:text-xl mb-10 leading-relaxed max-w-2xl mx-auto">
            Be the first to know about our new arrivals, trending lawn collections, and <span className="text-white font-bold">exclusive member-only sales</span>.
          </p>

          <div className="bg-white/5 backdrop-blur-md p-2 rounded-[2rem] shadow-2xl border border-white/10 max-w-2xl mx-auto mb-12">
            <form className="flex flex-col sm:flex-row gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email address..."
                className="flex-1 bg-transparent border-0 rounded-full py-4 px-8 text-white placeholder:text-gray-500 focus:outline-none transition-all text-base font-medium"
                required
              />
              <button className="bg-accent text-white px-10 py-4 rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-neutral-900 transition-all flex items-center justify-center gap-2 group shadow-lg hover:shadow-accent/30 hover:-translate-y-0.5 active:translate-y-0">
                Unlock 10% Off
                <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10 border-t border-white/5 pt-10">
            <div className="flex items-center gap-3 justify-center text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]">
              <CheckCircle2 size={16} className="text-accent" />
              <span>No Spam</span>
            </div>
            <div className="flex items-center gap-3 justify-center text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]">
              <CheckCircle2 size={16} className="text-accent" />
              <span>Early Sale Access</span>
            </div>
            <div className="flex items-center gap-3 justify-center text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]">
              <CheckCircle2 size={16} className="text-accent" />
              <span>Style Updates</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
