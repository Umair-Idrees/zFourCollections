import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { ChevronRight, Heart, ShoppingCart, Eye, Star } from 'lucide-react';
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
    <div className="flex gap-3 sm:gap-4 mt-4">
      {[
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Min', value: timeLeft.minutes },
        { label: 'Sec', value: timeLeft.seconds },
      ].map((item, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <div className="bg-white text-black rounded-lg w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center font-bold text-sm sm:text-lg shadow-md">
            {String(item.value).padStart(2, '0')}
          </div>
          <span className="text-[10px] sm:text-xs text-white mt-1 uppercase tracking-wider font-semibold">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

/**
 * Fashion Hero Section Component
 */
const FashionHeroSection = () => {
  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1591084728795-1149f32d9866?q=80&w=1920&auto=format&fit=crop',
      heading: 'New Winter Collection 2026',
      subtext: 'Premium jackets, hoodies, jeans and sneakers at exclusive prices',
      buttonText: 'Shop Men',
      align: 'left',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1920&auto=format&fit=crop',
      heading: 'Women’s New Arrivals',
      subtext: 'Dresses, handbags, heels and premium fashion accessories',
      buttonText: 'Shop Women',
      align: 'left',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1920&auto=format&fit=crop',
      heading: 'Streetwear Sale Up To 40% Off',
      subtext: 'Oversized hoodies, joggers and urban essentials',
      buttonText: 'Explore Collection',
      align: 'left',
    },
  ];

  const countdownTarget = new Date();
  countdownTarget.setHours(countdownTarget.getHours() + 24);

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT SIDE: Fashion Slider */}
        <div className="h-[300px] sm:h-[460px] rounded-xl overflow-hidden relative group shadow-sm border border-gray-100">
          <Swiper
            modules={[Autoplay, Pagination, EffectFade]}
            effect="fade"
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true, el: '.fashion-pagination' }}
            loop={true}
            className="w-full h-full"
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="relative w-full h-full">
                  <img
                    src={slide.image}
                    alt={slide.heading}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  
                  <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-16 text-white max-w-xl">
                    <h2 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight animate-fashion-slide opacity-0">
                      {slide.heading}
                    </h2>
                    <p className="text-sm sm:text-lg text-white/90 mb-8 animate-fashion-slide delay-100 opacity-0">
                      {slide.subtext}
                    </p>
                    <button className="bg-white text-black px-8 py-3.5 rounded-full font-bold text-sm sm:text-base hover:bg-black hover:text-white transition-all duration-300 w-fit flex items-center gap-2 group/btn shadow-lg animate-fashion-slide delay-200 opacity-0">
                      {slide.buttonText}
                      <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
            <div className="fashion-pagination absolute bottom-6 left-8 sm:left-16 z-10 flex gap-2" />
          </Swiper>
        </div>

        {/* RIGHT SIDE: Fashion Banners */}
        <div className="flex flex-col gap-6">
          
          {/* TOP LARGE BANNER */}
          <div className="h-[220px] rounded-xl overflow-hidden relative group shadow-sm border border-gray-100">
            <img
              src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200&auto=format&fit=crop"
              alt="Flash Sale"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/30" />
            
            <div className="absolute inset-0 flex flex-col justify-center px-8 text-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Flash Sale</span>
                <span className="text-xs font-semibold text-white/90">Ends in 24 Hours</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-1">Premium Streetwear</h3>
              
              <CountdownTimer targetDate={countdownTarget} />
              
              <button className="mt-6 bg-white text-black px-6 py-2 rounded-full text-sm font-bold hover:bg-black hover:text-white transition-all duration-300 w-fit shadow-md">
                Buy Now
              </button>
            </div>
          </div>

          {/* BOTTOM TWO BANNERS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-grow">
            
            {/* Banner 1: Men's Essentials */}
            <div className="h-[216px] rounded-xl overflow-hidden relative group shadow-sm border border-gray-100">
              <img
                src="https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=800&auto=format&fit=crop"
                alt="Men's Essentials"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h4 className="text-xl font-bold">Men’s Essentials</h4>
                <p className="text-sm text-white/80 mb-4">Shirts, jeans & polos</p>
                <button className="text-xs font-bold bg-white text-black px-4 py-2 rounded-lg hover:bg-black hover:text-white transition-all duration-300 w-fit shadow-md">
                  View Details
                </button>
              </div>
            </div>

            {/* Banner 2: Women's Accessories */}
            <div className="h-[216px] rounded-xl overflow-hidden relative group shadow-sm border border-gray-100">
              <img
                src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop"
                alt="Women's Accessories"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h4 className="text-xl font-bold">Women’s Accessories</h4>
                <p className="text-sm text-white/80 mb-4">Bags, heels & dresses</p>
                <button className="text-xs font-bold bg-white text-black px-4 py-2 rounded-lg hover:bg-black hover:text-white transition-all duration-300 w-fit shadow-md">
                  View Details
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        .fashion-pagination .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: rgba(255, 255, 255, 0.4);
          opacity: 1;
          transition: all 0.3s;
          border-radius: 4px;
        }
        .fashion-pagination .swiper-pagination-bullet-active {
          width: 24px;
          background: #fff;
        }
        
        @keyframes fashionSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fashion-slide {
          animation: fashionSlideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .delay-100 { animation-delay: 0.15s; }
        .delay-200 { animation-delay: 0.3s; }
      `}</style>
    </section>
  );
};

export default FashionHeroSection;
