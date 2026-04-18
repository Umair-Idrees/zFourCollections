import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { db, collection, onSnapshot, query, orderBy } from '../lib/firebase';

const DEFAULT_SLIDES = [
  {
    id: '1',
    title: 'Modern Tech Collection',
    subtitle: 'Exclusive Electronics',
    description: 'Experience the next generation of technology with our premium selection of gadgets and devices.',
    image: 'https://picsum.photos/seed/tech-hero/1920/1080',
    cta: 'Shop Now',
    color: 'bg-blue-50'
  },
  {
    id: '2',
    title: 'Luxury Watch Series',
    subtitle: 'Timeless Elegance',
    description: 'Discover our curated collection of premium timepieces designed for the modern professional.',
    image: 'https://picsum.photos/seed/watch-hero/1920/1080',
    cta: 'Explore',
    color: 'bg-gray-50'
  }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'banners'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bannerList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSlides(bannerList.length > 0 ? bannerList : DEFAULT_SLIDES);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching banners:", error);
      setSlides(DEFAULT_SLIDES);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  if (loading) {
    return <div className="h-[400px] md:h-[600px] w-full bg-gray-100 animate-pulse"></div>;
  }

  const currentSlide = slides[current];

  return (
    <section className="relative h-[400px] md:h-[600px] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className={cn("absolute inset-0 flex items-center", currentSlide.color || 'bg-gray-50')}
        >
          <div className="max-w-7xl mx-auto px-4 w-full grid md:grid-cols-2 items-center gap-12">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="z-10"
            >
              <p className="text-accent font-bold uppercase tracking-widest mb-4 text-sm md:text-base">
                {currentSlide.subtitle}
              </p>
              <h2 className="text-4xl md:text-7xl font-bold text-primary mb-6 leading-tight">
                {currentSlide.title}
              </h2>
              <p className="text-gray-600 text-lg mb-10 max-w-md leading-relaxed">
                {currentSlide.description}
              </p>
              <div className="flex gap-4">
                <button className="bg-primary text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition-all hover:shadow-xl hover:-translate-y-1">
                  {currentSlide.cta || 'Shop Now'}
                </button>
                <button className="bg-white text-primary border border-gray-200 px-8 py-4 rounded-full font-bold hover:bg-gray-50 transition-all">
                  View Details
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="hidden md:block relative"
            >
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  className="w-full h-[450px] object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/80 hover:bg-white shadow-lg text-primary transition-all z-20"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/80 hover:bg-white shadow-lg text-primary transition-all z-20"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "w-3 h-3 rounded-full transition-all",
                current === i ? "bg-primary w-8" : "bg-gray-300 hover:bg-gray-400"
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}
