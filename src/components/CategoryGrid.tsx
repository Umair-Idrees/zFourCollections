import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { cn } from '../lib/utils';

interface CategoryGridProps {
  onSelectCategory?: (category: string) => void;
}

export default function CategoryGrid({ onSelectCategory }: CategoryGridProps) {
  const { products, loading } = useProducts();

  const categories = useMemo(() => {
    const displayCategories = [
      { 
        id: 'unstitched', 
        name: 'Unstitched', 
        image: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop',
        originalName: 'Unstitched'
      },
      { 
        id: 'ready-to-wear', 
        name: 'Ready-to-Wear', 
        image: 'https://www.polkadots.pk/cdn/shop/files/Peach_3e6d7b4b-b270-443d-ac1d-f47acbfc0e10.jpg?v=1769846025&width=600',
        originalName: 'Ready-to-Wear'
      },
      { 
        id: 'festive', 
        name: 'Festive Wear', 
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop',
        originalName: 'Festive'
      },
      { 
        id: 'western', 
        name: 'Western Style', 
        image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop',
        originalName: 'Western'
      },
      { 
        id: 'accessories', 
        name: 'Boutique Extras', 
        image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop',
        originalName: 'Accessories'
      }
    ];

    return displayCategories.map(cat => ({
      ...cat,
      count: products.filter(p => 
        p.category === cat.originalName || 
        (cat.id === 'unstitched' && p.category === 'Fabric')
      ).length
    }));
  }, [products]);

  const handleCategoryClick = (categoryName: string) => {
    onSelectCategory?.(categoryName);
    const productsSection = document.getElementById('featured-products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <section className="py-24 max-w-[1440px] mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-10">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="bg-gray-100 animate-pulse rounded-full w-32 h-32 md:w-36 md:h-36"></div>
              <div className="h-4 w-20 bg-gray-100 mt-4 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 max-w-[1440px] mx-auto px-4" id="browse-categories">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 text-accent font-black uppercase tracking-[0.2em] mb-3 text-[10px]">
          <Sparkles size={12} className="animate-pulse" />
          <span>Curated Picks</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-primary uppercase tracking-tighter leading-none mb-4">
          Popular <span className="text-accent underline decoration-4 underline-offset-8">Categories</span>
        </h2>
        <p className="text-gray-500 font-medium text-sm max-w-lg mx-auto leading-relaxed">
          Explore our most impactful collections, from premium unstitched suits to high-end festive wear.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
        {categories.map((cat, idx) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="group cursor-pointer text-center"
            onClick={() => handleCategoryClick(cat.originalName)}
          >
            <div className="relative w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden bg-gray-50 mb-6 border-4 border-transparent group-hover:border-black group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 group-hover:-translate-y-2">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors"></div>
            </div>
            <h3 className="text-lg font-black text-primary uppercase tracking-tight group-hover:text-accent transition-colors">
              {cat.name}
            </h3>
            <p className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {cat.count} Products Available
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <button 
          onClick={() => onSelectCategory?.('')}
          className="text-xs font-black uppercase tracking-[0.3em] border-b-2 border-primary hover:border-accent hover:text-accent transition-all pb-1"
        >
          View All Categories
        </button>
      </div>
    </section>
  );
}
