import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export default function SpecialOffer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3); // 3 days from now

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 p-8 md:p-16">
            <span className="bg-sale text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-6 inline-block">
              Limited Time Offer
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight">
              Special Weekend Sale <br />
              <span className="text-accent">Up to 60% Off</span>
            </h2>
            <p className="text-gray-600 text-lg mb-10 leading-relaxed">
              Don't miss out on our biggest sale of the season. Premium electronics, fashion, and accessories at unbeatable prices.
            </p>

            {/* Countdown */}
            <div className="flex gap-4 md:gap-8 mb-10">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Mins', value: timeLeft.minutes },
                { label: 'Secs', value: timeLeft.seconds }
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-primary text-white rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-bold mb-2">
                    {item.value.toString().padStart(2, '0')}
                  </div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.label}</p>
                </div>
              ))}
            </div>

            <button className="bg-accent text-white px-10 py-4 rounded-full font-bold hover:bg-blue-600 transition-all shadow-lg hover:shadow-accent/30 hover:-translate-y-1">
              Shop the Sale
            </button>
          </div>

          <div className="lg:w-1/2 relative h-[400px] lg:h-[600px] w-full">
            <img
              src="https://picsum.photos/seed/sale-banner/1000/1000"
              alt="Special Offer"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Floating badge */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-sale text-white rounded-full flex flex-col items-center justify-center shadow-2xl animate-bounce">
              <span className="text-3xl font-bold">60%</span>
              <span className="text-xs font-bold uppercase">OFF</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
