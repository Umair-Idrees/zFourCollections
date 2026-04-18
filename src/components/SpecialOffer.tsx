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
      <div className="max-w-[1440px] mx-auto px-4">
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 p-8 md:p-12">
            <span className="bg-sale text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-5 inline-block">
              Limited Time Offer
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-primary mb-5 leading-tight uppercase tracking-tighter">
              Boutique <span className="text-accent underline decoration-4 underline-offset-8">Weekend</span> Sale <br />
              <span className="text-accent mt-2 inline-block">Up to 60% Off</span>
            </h2>
            <p className="text-gray-500 font-medium text-base mb-8 leading-relaxed">
              Don't miss out on our biggest collection sale. Discover premium unstitched 3-piece suits, kurtas, and modern pant-suits at exclusive limited-time prices.
            </p>

            {/* Countdown */}
            <div className="flex gap-4 md:gap-6 mb-8">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Mins', value: timeLeft.minutes },
                { label: 'Secs', value: timeLeft.seconds }
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-primary text-white rounded-xl flex items-center justify-center text-xl md:text-2xl font-bold mb-2">
                    {item.value.toString().padStart(2, '0')}
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</p>
                </div>
              ))}
            </div>

            <button className="bg-accent text-white px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-gold transition-all shadow-xl hover:shadow-accent/20 hover:-translate-y-1">
              Shop the Sale
            </button>
          </div>

          <div className="lg:w-1/2 relative h-[350px] lg:h-[500px] w-full bg-white flex items-center justify-center">
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              src="https://m.media-amazon.com/images/I/81KqtAo5i0L._AC_UY1000_.jpg"
              alt="Premium Boutique Sale Dress"
              className="w-full h-full object-contain p-8"
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
