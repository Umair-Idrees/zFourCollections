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
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQv6O5alfrlMXASqLit_jIeExQ6Ql5TVNeXiQ&s',
      heading: 'Elegant Festive Formals',
      subtext: 'Discover timeless elegance with our hand-embroidered festive collection perfect for celebrations.',
      buttonText: 'Shop Ethnic',
    },
    {
      id: 2,
      image: 'https://media.istockphoto.com/id/120119485/photo/female-clothes-on-hangers-and-shoes.jpg?s=612x612&w=0&k=20&c=qSTWbfnNK7fdMBz-9jYalZqUvpBHi9_il3YBP0gLasM=',
      heading: 'Chic Ready-to-Wear',
      subtext: 'Effortless style with our vibrant printed kurtas and contemporary girls\' fashion.',
      buttonText: 'Shop Instant',
    },
    {
      id: 3,
      image: 'https://static.vecteezy.com/system/resources/thumbnails/072/153/747/small/black-tshirt-hanging-on-clothes-hanger-a-minimalist-fashion-apparel-mockup-for-design-presentation-featuring-simple-elegance-and-versatile-style-ideal-for-clothing-brands-and-style-blogs-highlighti-photo.jpg',
      heading: 'Premium Luxury Lawn',
      subtext: 'Experience the softness of our signature unstitched collections with intricate lace detailing.',
      buttonText: 'Explore Fabric',
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
                {({ isActive }) => (
                  <div className="relative w-full h-full">
                    <img
                      src={slide.image}
                      alt={slide.heading}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    
                    {isActive && (
                      <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-16 text-white max-w-xl z-20">
                        <h2 className="text-3xl sm:text-5xl font-extrabold mb-4 leading-tight tracking-tight animate-fashion-slide uppercase">
                          {slide.heading}
                        </h2>
                        <p className="text-sm sm:text-lg text-white/90 mb-8 font-medium animate-fashion-slide delay-100 italic">
                          {slide.subtext}
                        </p>
                        <button className="bg-white text-black px-8 py-3.5 rounded-full font-black text-sm sm:text-base hover:bg-black hover:text-white transition-all duration-300 w-fit flex items-center gap-2 group/btn shadow-lg uppercase tracking-wider animate-fashion-slide delay-200">
                          {slide.buttonText}
                          <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
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
              src="https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop"
              alt="Flash Sale"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/30" />
            
            <div className="absolute inset-0 flex flex-col justify-center px-8 text-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">New Arrival</span>
                <span className="text-xs font-bold text-white/90 uppercase tracking-wider">Limited Edition</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black mb-1 tracking-tight">Velvet Festive Suits</h3>
              <p className="text-sm text-white/80 font-medium">Intricate gold embroidery & luxury fabric</p>
              
              <div className="mt-4">
                <button className="bg-white text-black px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300 shadow-md">
                  Shop Now
                </button>
              </div>
            </div>
          </div>

          {/* BOTTOM TWO BANNERS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-grow">
            
            {/* Banner 1: Ethnic Wear */}
            <div className="h-[216px] rounded-xl overflow-hidden relative group shadow-sm border border-gray-100">
              <img
                src="https://zfourcollections.com/wp-content/uploads/2026/04/1-1-2048x1150.png"
                alt="Ethnic Kurtas"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h4 className="text-xl font-black uppercase tracking-tight">Ready-to-Wear</h4>
                <p className="text-sm text-white/80 font-medium mb-4">Kurtas, palazzo & more</p>
                <button className="text-[10px] font-black bg-white text-black px-4 py-2 rounded-lg hover:bg-black hover:text-white transition-all duration-300 w-fit shadow-md uppercase tracking-widest">
                  View Collection
                </button>
              </div>
            </div>

            {/* Banner 2: Detail Focus */}
            <div className="h-[216px] rounded-xl overflow-hidden relative group shadow-sm border border-gray-100">
              <img
                src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop"
                alt="Fabric Detail"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h4 className="text-xl font-black uppercase tracking-tight">Craftsmanship</h4>
                <p className="text-sm text-white/80 font-medium mb-4">Precision stitching & lace</p>
                <button className="text-[10px] font-black bg-white text-black px-4 py-2 rounded-lg hover:bg-black hover:text-white transition-all duration-300 w-fit shadow-md uppercase tracking-widest">
                  Explore Quality
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
