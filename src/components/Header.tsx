import React, { useState, useEffect } from 'react';
import { Search, User, Heart, ShoppingCart, Menu, ChevronDown, ChevronRight, Phone, MapPin, Facebook, Instagram, Music2, LogOut, LayoutDashboard, X } from 'lucide-react';
import { cn } from '../lib/utils';
import LoginModal from './LoginModal';
import { auth, logout, useAuth } from '../lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { motion, AnimatePresence } from 'motion/react';

import Logo from './Logo';

interface HeaderProps {
  cart?: any[];
}

export default function Header({ cart = [] }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { products } = useProducts();
  const navigate = useNavigate();

  const { user, isAdmin } = useAuth();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + (item.salePrice * item.quantity), 0);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      setShowResults(false);
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const fashionCategories = [
    { 
      id: 'fabrics', 
      title: 'FABRICS (Unstitched)', 
      icon: '🧶',
      subs: ['Lawn Collection', 'Cotton & Linen', 'Luxury Velvet', 'Chiffon & Silk']
    },
    { 
      id: 'pret', 
      title: 'READY-TO-WEAR (Pret)', 
      icon: '👗',
      subs: ['Daily Wear Kurtis', '2-Piece Co-ord Sets', 'Festive Formals', 'Printed Maxis']
    },
    { 
      id: 'bottoms', 
      title: 'BOTTOMS & DUPATTAS', 
      icon: '👖',
      subs: ['Cigarette Pants', 'Tulip Shalwars', 'Organza Dupattas', 'Embroidered Shawls']
    }
  ];

  return (
    <header className="w-full bg-white border-b border-gray-100">
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      {/* Top Bar */}
      <div className="hidden md:flex bg-gray-50 py-2 px-4 justify-between items-center text-xs text-gray-500 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Phone size={12} />
            <span>+1 (234) 567-890</span>
          </div>
          <Link to="/contact" className="flex items-center gap-1 hover:text-accent transition-colors">
            <MapPin size={12} />
            <span>Store Locator</span>
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/admin" className="flex items-center gap-1.5 text-accent font-bold hover:underline group">
            <LayoutDashboard size={14} className="group-hover:rotate-12 transition-transform" />
            <span>Admin Dashboard</span>
            {!isAdmin && <span className="text-[8px] bg-accent/10 px-1.5 py-0.5 rounded-full uppercase tracking-tighter ml-1">Test Access</span>}
          </Link>
          <div className="flex items-center gap-3">
            <a href="https://www.facebook.com/share/1AnztTsb53/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">
              <Facebook size={14} className="cursor-pointer hover:text-accent" />
            </a>
            <a href="https://www.instagram.com/zfour_collections?igsh=MTRxZDVpN3I3bDAycQ%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer">
              <Instagram size={14} className="cursor-pointer hover:text-accent" />
            </a>
            <a href="https://www.tiktok.com/@zfour.collections?_r=1&_t=ZS-93RlJwUsagS" target="_blank" rel="noopener noreferrer">
              <Music2 size={14} className="cursor-pointer hover:text-accent" />
            </a>
          </div>
          <div className="flex items-center gap-4 border-l border-gray-200 pl-4">
            <Link to="/contact" className="cursor-pointer hover:text-accent">Track Order</Link>
            <Link to="/contact" className="cursor-pointer hover:text-accent">Help Center</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-[1440px] mx-auto px-4 py-6 flex items-center justify-between gap-8">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link to="/">
            <Logo variant="dark" className="scale-110 active:scale-95 transition-transform" />
          </Link>
        </div>

        {/* Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-2xl relative">
          <form onSubmit={handleSearch} className="w-full relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
              placeholder="Search for products..."
              className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 px-6 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-14 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
              >
                <X size={16} />
              </button>
            )}
            <button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent text-white p-2 rounded-full hover:bg-neutral-800 transition-colors"
            >
              <Search size={18} />
            </button>
          </form>

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {showResults && searchQuery.length > 0 && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowResults(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                >
                  {filteredProducts.length > 0 ? (
                    <div className="p-2">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 py-2">Products</p>
                      {filteredProducts.map((product) => (
                        <div 
                          key={product.id}
                          onClick={() => {
                            setShowResults(false);
                            setSearchQuery('');
                            navigate(`/product/${product.id}`);
                          }}
                          className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-2xl cursor-pointer transition-colors group"
                        >
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                            <img src={product.mainImage} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div className="flex-grow min-w-0">
                            <h4 className="text-sm font-bold text-primary truncate group-hover:text-accent transition-colors">{product.name}</h4>
                            <p className="text-xs text-gray-400 font-medium">{product.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-primary">${product.salePrice || product.regularPrice}</p>
                          </div>
                        </div>
                      ))}
                      <div className="p-4 border-t border-gray-50 text-center">
                        <button className="text-xs font-bold text-accent hover:underline">View all results</button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-gray-500 text-sm">No products found for "{searchQuery}"</p>
                    </div>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-5">
          {user ? (
            <Link 
              to="/dashboard"
              className="hidden sm:flex items-center gap-3 cursor-pointer group"
            >
              <div className="p-0.5 rounded-full border-2 border-accent/20 group-hover:border-accent transition-all duration-300">
                <img 
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || user.email}`} 
                  alt="User" 
                  className="w-9 h-9 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="hidden xl:block">
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-[0.15em] leading-none mb-1">Welcome</p>
                <p className="text-sm font-black text-primary truncate max-w-[100px] leading-none tracking-tight">
                  {user.displayName?.split(' ')[0] || 'User'}
                </p>
              </div>
            </Link>
          ) : (
            <div 
              className="hidden sm:flex items-center gap-3 cursor-pointer group"
              onClick={() => setIsLoginOpen(true)}
            >
              <div className="p-2.5 rounded-full bg-gray-50 group-hover:bg-accent/10 transition-colors">
                <User size={20} className="text-gray-700 group-hover:text-accent" />
              </div>
              <div className="hidden xl:block">
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-[0.15em] leading-none mb-1">Account</p>
                <p className="text-sm font-black text-primary leading-none tracking-tight">Login</p>
              </div>
            </div>
          )}

          <div className="relative group cursor-pointer">
            <div className="p-2.5 rounded-full bg-gray-50 group-hover:bg-accent/10 transition-colors">
              <Heart size={20} className="text-gray-700 group-hover:text-accent" />
            </div>
            <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm transition-transform group-hover:scale-110">0</span>
          </div>

          <Link to="/cart" className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <div className="p-2.5 rounded-full bg-gray-50 group-hover:bg-accent/10 transition-colors">
                <ShoppingCart size={20} className="text-gray-700 group-hover:text-accent" />
              </div>
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm transition-transform group-hover:scale-110">
                {cartCount}
              </span>
            </div>
            <div className="hidden xl:block">
              <p className="text-[10px] text-gray-400 uppercase font-black tracking-[0.15em] leading-none mb-1">My Cart</p>
              <p className="text-sm font-black text-primary leading-none tracking-tight">
                ${cartTotal.toFixed(2)}
              </p>
            </div>
          </Link>

          <button 
            className="lg:hidden p-2 text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="p-4 space-y-6">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-5 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                />
                <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search size={18} />
                </button>
              </form>

              {/* Mobile Nav Links */}
              <nav className="space-y-1">
                {[
                  { name: 'Home', path: '/' },
                  { name: 'Shop', path: '/shop' },
                  { name: 'New Arrivals', path: '/shop?filter=new' },
                  { name: 'Best Sellers', path: '/shop?filter=best' },
                  { name: 'Special Offers', path: '/shop?filter=sale' },
                  { name: 'Blog', path: '/blog' },
                  { name: 'Contact', path: '/contact' }
                ].map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-3 px-4 text-sm font-bold text-primary hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              {/* Mobile Categories */}
              <div className="pt-6 border-t border-gray-50">
                <h3 className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Categories</h3>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    'FABRICS (Unstitched)', 
                    'READY-TO-WEAR (Pret)', 
                    'BOTTOMS & DUPATTAS'
                  ].map((cat) => (
                    <Link
                      key={cat}
                      to={`/shop?category=${encodeURIComponent(cat)}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="py-3 px-4 text-sm font-bold text-gray-700 bg-gray-50 rounded-xl hover:bg-accent/10 hover:text-accent transition-all flex justify-between items-center"
                    >
                      {cat}
                      <ChevronRight size={14} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Bar */}
      <nav className="hidden lg:block border-t border-gray-100">
        <div className="max-w-[1440px] mx-auto px-4 flex items-center">
          {/* Categories Dropdown */}
          <div className="relative group/main">
            <button className="flex items-center gap-3 bg-accent text-white px-6 py-4 font-bold text-sm tracking-wide uppercase transition-all active:bg-primary active:scale-95 duration-200">
              <Menu size={18} />
              Browse Categories
              <ChevronDown size={16} className="ml-2 group-hover/main:rotate-180 transition-transform" />
            </button>
            
            {/* Dropdown Menu - Narrow Accordion Style */}
            <div className="absolute top-full left-0 w-72 bg-white border border-gray-100 shadow-[0_20px_40px_rgba(0,0,0,0.1)] opacity-0 invisible group-hover/main:opacity-100 group-hover/main:visible transition-all duration-300 z-50 rounded-b-xl overflow-hidden">
              <div className="py-2">
                {fashionCategories.map((category) => (
                  <div key={category.id} className="border-b border-gray-50 last:border-0">
                    <button 
                      onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                      className={cn(
                        "w-full flex items-center justify-between px-6 py-4 cursor-pointer text-[11px] font-black tracking-widest uppercase transition-all",
                        expandedCategory === category.id ? "bg-gray-50 text-accent" : "text-primary hover:bg-gray-50 hover:text-accent"
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-base">{category.icon}</span>
                        {category.title}
                      </span>
                      <ChevronDown 
                        size={14} 
                        className={cn("transition-transform duration-300", expandedCategory === category.id && "rotate-180")} 
                      />
                    </button>

                    <AnimatePresence>
                      {expandedCategory === category.id && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-white"
                        >
                          {category.subs.map((sub) => (
                            <li key={sub}>
                              <Link 
                                to={`/shop?category=${encodeURIComponent(sub)}`}
                                className="block px-12 py-3 text-xs font-bold text-gray-500 hover:text-accent hover:bg-accent/5 transition-all border-l-2 border-transparent hover:border-accent"
                              >
                                {sub}
                              </Link>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Menu */}
          <ul className="flex items-center gap-8 ml-8">
            {[
              { name: 'Home', path: '/' },
              { name: 'Shop', path: '/shop' },
              { name: 'New Arrivals', path: '/shop?filter=new' },
              { name: 'Best Sellers', path: '/shop?filter=best' },
              { name: 'Special Offers', path: '/shop?filter=sale' },
              { name: 'Blog', path: '/blog' },
              { name: 'Contact', path: '/contact' }
            ].map((item) => (
              <li key={item.name}>
                <Link to={item.path} className="text-sm font-bold text-primary hover:text-accent uppercase tracking-wider transition-colors py-4 block relative group">
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Special Link */}
          <div className="ml-auto">
            <Link to="/shop?filter=sale" className="text-sm font-bold text-sale uppercase tracking-wider animate-pulse hover:underline">
              Flash Sale - 50% Off
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
