import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { db, collection, getDocs, onSnapshot, query, orderBy } from '../lib/firebase';
import ProductCard from '../components/ProductCard';
import { Filter, Search, ChevronDown, LayoutGrid, List as ListIcon } from 'lucide-react';
import { Product } from '../types';

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
                  className={`w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedCategory === cat ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Price Range</h3>
            <div className="space-y-4">
              <input type="range" className="w-full accent-blue-600" />
              <div className="flex justify-between text-xs text-gray-400 font-bold uppercase tracking-widest">
                <span>$0</span>
                <span>$10,000</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
            <h4 className="font-bold text-blue-900 mb-2">Special Offer</h4>
            <p className="text-xs text-blue-700 mb-4">Get 20% off on your first order with code: <span className="font-bold">WELCOME20</span></p>
            <button className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all">
              Copy Code
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-100 rounded-2xl py-3 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm" 
              />
            </div>
            
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="flex items-center bg-white border border-gray-100 rounded-2xl p-1 shadow-sm">
                <button className="p-2 bg-gray-50 text-blue-600 rounded-xl"><LayoutGrid size={18} /></button>
                <button className="p-2 text-gray-400 hover:text-blue-600 rounded-xl"><ListIcon size={18} /></button>
              </div>
              
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold text-gray-600 focus:outline-none shadow-sm flex-1 sm:flex-none"
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
