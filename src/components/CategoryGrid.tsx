import React, { useEffect, useState } from 'react';
import { db, collection, onSnapshot, query, orderBy } from '../lib/firebase';
import { motion } from 'motion/react';
import { CATEGORIES } from '../constants';
import { cn } from '../lib/utils';

interface CategoryGridProps {
  onSelectCategory?: (category: string) => void;
}

export default function CategoryGrid({ onSelectCategory }: CategoryGridProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'categories'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setCategories(CATEGORIES);
      } else {
        const catList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategories(catList);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching categories:", error);
      setCategories(CATEGORIES);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(categoryName);
    onSelectCategory?.(categoryName);
    
    // Scroll to products section
    const productsSection = document.getElementById('featured-products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <section className="py-16 max-w-7xl mx-auto px-4" id="browse-categories">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="bg-gray-100 animate-pulse rounded-full aspect-square"></div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 max-w-7xl mx-auto px-4" id="browse-categories">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-3xl font-bold text-primary mb-2">Popular Categories</h2>
          <p className="text-gray-500">Explore our wide range of premium products</p>
        </div>
        <button 
          onClick={() => {
            setActiveCategory(null);
            onSelectCategory?.('');
          }}
          className="text-accent font-bold hover:underline"
        >
          View All Categories
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
        {categories.map((cat, idx) => (
          <motion.div
            key={cat.id || idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="group cursor-pointer text-center"
            onClick={() => handleCategoryClick(cat.name)}
          >
            <div className={cn(
              "relative aspect-square rounded-full overflow-hidden bg-gray-50 mb-4 border transition-all group-hover:shadow-xl group-hover:-translate-y-2",
              activeCategory === cat.name ? "border-accent ring-4 ring-accent/10" : "border-gray-100 group-hover:border-accent/30"
            )}>
              <img
                src={cat.image || `https://picsum.photos/seed/${cat.name}/300/300`}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors"></div>
            </div>
            <h3 className={cn(
              "font-bold transition-colors",
              activeCategory === cat.name ? "text-accent" : "text-primary group-hover:text-accent"
            )}>{cat.name}</h3>
            <p className="text-xs text-gray-400 font-medium uppercase mt-1">{cat.count || 0} Products</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
