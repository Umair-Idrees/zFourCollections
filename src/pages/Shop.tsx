import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { db, collection, getDocs, onSnapshot, query, orderBy } from '../lib/firebase';
import ProductCard from '../components/ProductCard';
import { Filter, Search, ChevronDown, LayoutGrid, List as ListIcon } from 'lucide-react';
import { Product } from '../types';
import { cn } from '../lib/utils';

interface ShopProps {
  addToCart: (product: any) => void;
}

const Shop: React.FC<ShopProps> = ({ addToCart }) => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'All';
  const initialFilter = searchParams.get('filter') || '';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('Latest');
  const [categories, setCategories] = useState<string[]>(['All']);

  useEffect(() => {
    setSearchQuery(initialSearch);
    if (initialCategory !== 'All') {
      setSelectedCategory(initialCategory);
    }
  }, [initialSearch, initialCategory]);

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(prods);
      
      const uniqueCategories = ['All', ...new Set(prods.map(p => p.category))];
      setCategories(uniqueCategories);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    
    let matchesFilter = true;
    if (initialFilter === 'new') {
      // Logic for new arrivals (e.g., added in last 30 days or just the latest ones)
      // For now, we'll just show all since they are sorted by latest anyway
    } else if (initialFilter === 'best') {
      // Logic for best sellers (could check a field like 'soldCount')
    } else if (initialFilter === 'sale') {
      matchesFilter = p.salePrice < p.regularPrice;
    }

    return matchesSearch && matchesCategory && matchesFilter;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'Price: Low to High') return a.salePrice - b.salePrice;
    if (sortBy === 'Price: High to Low') return b.salePrice - a.salePrice;
    return 0; // Default: Latest
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 space-y-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${
                    selectedCategory === cat ? 'bg-accent text-white shadow-xl shadow-accent/20' : 'text-gray-500 hover:bg-linen hover:text-accent'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black text-primary uppercase tracking-[0.2em] mb-4">Price Range</h3>
            <div className="space-y-4">
              <input type="range" className="w-full accent-accent h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer" />
              <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                <span>$0</span>
                <span>$10,000</span>
              </div>
            </div>
          </div>

          <div className="bg-linen p-8 rounded-[2rem] border border-stone-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gold/10 rounded-bl-[3rem] -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>
            <h4 className="font-black text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-gold"></span>
              Special Offer
            </h4>
            <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6">Get 20% off on your first order with code: <span className="text-gold font-black">WELCOME20</span></p>
            <button className="w-full py-4 bg-accent text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-neutral-900 transition-all shadow-lg active:scale-95">
              Copy Code
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-6">
            <div className="relative w-full sm:w-96 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search collection..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-linen border border-transparent rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:bg-white focus:border-stone-100 focus:ring-4 focus:ring-primary/5 transition-all text-sm" 
              />
            </div>
            
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="flex items-center bg-linen rounded-2xl p-1.5">
                <button className={cn("p-2.5 rounded-xl transition-all", true ? "bg-white text-primary shadow-sm" : "text-gray-400 hover:text-primary")}><LayoutGrid size={18} /></button>
                <button className="p-2.5 text-gray-400 hover:text-primary transition-all rounded-xl"><ListIcon size={18} /></button>
              </div>
              
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-linen rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest text-primary focus:outline-none shadow-sm flex-1 sm:flex-none cursor-pointer hover:bg-stone-50 transition-colors"
              >
                <option>Latest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl border border-gray-100 p-4 space-y-4 animate-pulse">
                  <div className="aspect-square bg-gray-100 rounded-2xl"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedProducts.map(product => (
                <ProductCard key={product.id} product={product} addToCart={addToCart} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={40} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your filters or search query.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
