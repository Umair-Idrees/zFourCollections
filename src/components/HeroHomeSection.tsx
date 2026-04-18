import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { ChevronRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

/**
 * Utility for merging tailwind classes
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Countdown Timer Component
 */
const CountdownTimer = ({ targetDate }: { targetDate: Date }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-2 sm:gap-4 mt-4">
      {[
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Min', value: timeLeft.minutes },
        { label: 'Sec', value: timeLeft.seconds },
      ].map((item, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <div className="bg-white/20 backdrop-blur-md rounded-lg w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-white font-bold text-sm sm:text-lg border border-white/30 shadow-lg">
            {String(item.value).padStart(2, '0')}
          </div>
          <span className="text-[10px] sm:text-xs text-white/80 mt-1 uppercase tracking-wider font-medium">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

/**
 * Hero Home Section Component
 * Inspired by WoodMart Mega Electronics
 */
const HeroHomeSection = () => {
  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1920&auto=format&fit=crop',
      heading: 'Apple Shopping Event',
      subtext: 'Shop great deals on MacBook, iPad, iPhone and more',
      buttonText: 'Shop Now',
      color: 'from-blue-900/80 to-black/60',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1661347333292-3848348a9907?q=80&w=1920&auto=format&fit=crop',
      heading: 'The New Google Pixel 7',
      subtext: 'Experience the most helpful Google phone yet.',
      buttonText: 'Pre-Order Now',
      color: 'from-emerald-900/80 to-black/60',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1920&auto=format&fit=crop',
      heading: 'Discount on Smart Appliances up to 25%',
      subtext: 'Upgrade your home with the latest smart technology.',
      buttonText: 'Shop Now',
      color: 'from-orange-900/80 to-black/60',
    },
  ];

  // Set target date for countdown (7 days from now)
  const countdownTarget = new Date();
  countdownTarget.setDate(countdownTarget.getDate() + 7);

  return (
    <section id="hero-home-section" className="w-full max-w-[1440px] mx-auto px-4 py-6 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT SIDE: Main Hero Slider */}
        <div className="w-full h-[300px] sm:h-[460px] rounded-2xl overflow-hidden shadow-2xl relative group">
          <Swiper
            modules={[Autoplay, Pagination, EffectFade]}
            effect="fade"
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true, el: '.custom-pagination' }}
            loop={true}
            className="w-full h-full"
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="relative w-full h-full">
                  {/* Background Image */}
                  <img
                    src={slide.image}
                    alt={slide.heading}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {/* Overlay */}
                  <div className={cn("absolute inset-0 bg-gradient-to-r", slide.color)} />
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-16 text-white max-w-2xl">
                    <h2 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight animate-slide-in opacity-0">
                      {slide.heading}
                    </h2>
                    {slide.subtext && (
                      <p className="text-sm sm:text-lg text-white/90 mb-8 max-w-md animate-slide-in delay-100 opacity-0">
                        {slide.subtext}
                      </p>
                    )}
                    <button className="bg-white text-black px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base hover:bg-black hover:text-white transition-all duration-300 w-fit flex items-center gap-2 group/btn shadow-xl animate-slide-in delay-200 opacity-0">
                      {slide.buttonText}
                      <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
            
            {/* Custom Pagination */}
            <div className="custom-pagination absolute bottom-6 left-8 sm:left-16 z-10 flex gap-2" />
          </Swiper>
        </div>

        {/* RIGHT SIDE: Promotional Banners */}
        <div className="flex flex-col gap-6">
          
          {/* TOP LARGE BANNER */}
          <div className="h-[220px] rounded-2xl overflow-hidden relative group shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop"
              alt="Aurora Headset"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-transparent" />
            
            <div className="absolute inset-0 flex flex-col justify-center px-8 text-white">
              <span className="text-xs font-bold uppercase tracking-widest text-purple-300 mb-2">Limited Offer</span>
              <h3 className="text-2xl sm:text-3xl font-bold mb-2">Aurora Headset</h3>
              
              <CountdownTimer targetDate={countdownTarget} />
              
              <button className="mt-6 text-sm font-bold border-b-2 border-white w-fit hover:text-purple-300 hover:border-purple-300 transition-colors">
                Buy Now
              </button>
            </div>
          </div>

          {/* BOTTOM TWO BANNERS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-grow">
            
            {/* Banner 1 */}
            <div className="h-[216px] rounded-2xl overflow-hidden relative group shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=800&auto=format&fit=crop"
                alt="New Dual Sense"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
              
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h4 className="text-xl font-bold">New Dual Sense</h4>
                <p className="text-sm text-white/80 mb-4">For PlayStation 5</p>
                <button className="text-xs font-bold bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg border border-white/30 hover:bg-white hover:text-black transition-all duration-300 w-fit">
                  View Details
                </button>
              </div>
            </div>

            {/* Banner 2 */}
            <div className="h-[216px] rounded-2xl overflow-hidden relative group shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1526170315873-3a98618bb9af?q=80&w=800&auto=format&fit=crop"
                alt="Instant Cameras"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
              
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h4 className="text-xl font-bold">Instant Cameras</h4>
                <p className="text-sm text-white/80 mb-4">Get photo paper as a gift</p>
                <button className="text-xs font-bold bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg border border-white/30 hover:bg-white hover:text-black transition-all duration-300 w-fit">
                  View Details
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        .custom-pagination .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
          transition: all 0.3s;
          border-radius: 5px;
        }
        .custom-pagination .swiper-pagination-bullet-active {
          width: 30px;
          background: #fff;
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slide-in {
          animation: slideInLeft 0.8s ease-out forwards;
        }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
      `}</style>
    </section>
  );
};

export default HeroHomeSection;
