import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star, ShoppingBag, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const collections = [
  {
    title: "Boho Charm Set",
    description: "Flowy floral patterns with vintage earthy tones.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSglkOLGA6MxKnIGquJ8W7T8DDFotZa_r8wKQ&s",
    tag: "Trending",
    color: "bg-amber-50"
  },
  {
    title: "Denim & Daisy Mix",
    description: "Soft denim layers paired with playful floral skirts.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbVrULCgTRys2duV4cXOEACIYhat9fCJfLpg&s",
    tag: "Casual Chic",
    color: "bg-blue-50"
  },
  {
    title: "Country Chic",
    description: "Romantic ruffled skirts with classic western accents.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNZD8P-ReM7ea3ZDdYfIjNjpBcRuJowRYvVg&s",
    tag: "Style Icon",
    color: "bg-stone-50"
  },
  {
    title: "Vintage Tiered Maxi",
    description: "Multi-layered ethereal skirts for a timeless look.",
    image: "https://www.shutterstock.com/image-photo/rack-stylish-womens-clothes-on-260nw-2391831755.jpg",
    tag: "Luxury",
    color: "bg-rose-50"
  },
  {
    title: "Urban Hat & Knit",
    description: "Contemporary knits styled with boutique hats.",
    image: "https://www.shutterstock.com/image-photo/pensive-young-woman-choosing-between-260nw-2345230445.jpg",
    tag: "Modern",
    color: "bg-neutral-50"
  }
];

const highlights = [
  {
    title: "Velvet Festive",
    detail: "Intricate gold embroidery on deep maroon velvet.",
    image: "https://media.istockphoto.com/id/804153464/photo/a-great-variety-of-dresses-in-wardrobe.jpg?s=612x612&w=0&k=20&c=sXbkrRj7QNu0MQQEgiW5QZnXyeYXOv08Jr4NLqbDC9M=",
    price: "$129.00"
  },
  {
    title: "Printed Lawn",
    detail: "Digital prints for everyday comfort.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUI4Fpt_oUvX-l-H_q-YZ9_hNh8uBL4VFGng&s",
    price: "$59.00"
  }
];

export default function GirlsCollection() {
  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-12 gap-6">
          <div className="max-w-4xl w-full">
            <div className="flex items-center justify-center gap-2 text-accent font-black uppercase tracking-[0.2em] mb-3 text-[10px]">
              <Sparkles size={12} className="animate-pulse" />
              <span>New Arrival</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-primary mb-3 tracking-tight leading-none uppercase whitespace-nowrap">
              The Girls' <span className="text-accent underline decoration-4 underline-offset-8">Suits</span> Collection
            </h2>
            <p className="text-sm text-gray-500 font-medium max-w-lg mx-auto leading-relaxed">
              From cinematic ethnic loungewear to minimalist western power suits.
            </p>
          </div>
          <Link 
            to="/shop" 
            className="group flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[11px] hover:text-accent transition-all"
          >
            Explore Full Range <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid - Adjusted for 5 items and smaller size */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
          {collections.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className={`aspect-[4/5] rounded-[1.5rem] overflow-hidden mb-3 ${item.color} relative`}>
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-md text-primary text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                    {item.tag}
                  </span>
                </div>
              </div>
              <h3 className="text-sm font-black text-primary mb-1 uppercase tracking-tight">{item.title}</h3>
              <p className="text-gray-500 text-[11px] font-medium leading-tight mb-3 line-clamp-1">{item.description}</p>
              <button className="flex items-center gap-1.5 text-accent font-black text-[9px] uppercase tracking-widest group-hover:gap-3 transition-all">
                Shop Now <ArrowRight size={10} />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Bestseller Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {highlights.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-[2.5rem] p-6 sm:p-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-10 group hover:bg-primary hover:text-white transition-all duration-500"
            >
              <div className="w-full sm:w-52 aspect-square rounded-[1.5rem] overflow-hidden shadow-xl flex-shrink-0">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <div className="flex items-center gap-1 text-accent mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <h4 className="text-3xl font-black uppercase mb-4 tracking-tight group-hover:text-white transition-colors">
                  {item.title}
                </h4>
                <p className="text-gray-500 group-hover:text-gray-300 text-sm font-medium leading-relaxed mb-8 transition-colors">
                  {item.detail}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black">{item.price}</span>
                  <button className="bg-primary text-white group-hover:bg-white group-hover:text-primary px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg active:scale-95">
                    <ShoppingBag size={16} /> Add To Bag
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
