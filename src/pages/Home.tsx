import React from 'react';
import Hero from '../components/Hero';
import CategoryGrid from '../components/CategoryGrid';
import ProductSection from '../components/ProductSection';
import { Truck, ShieldCheck, Clock, CreditCard } from 'lucide-react';

interface HomeProps {
  addToCart: (product: any) => void;
}

const Home: React.FC<HomeProps> = ({ addToCart }) => {
  return (
    <div className="space-y-16 pb-20">
      <Hero />
      
      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Free Delivery</h4>
              <p className="text-xs text-gray-500">On all orders over $50</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Secure Payment</h4>
              <p className="text-xs text-gray-500">100% secure payment</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
              <Clock size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">24/7 Support</h4>
              <p className="text-xs text-gray-500">Dedicated support team</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
              <CreditCard size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Money Back</h4>
              <p className="text-xs text-gray-500">30 days return policy</p>
            </div>
          </div>
        </div>
      </section>

      <CategoryGrid />
      
      <ProductSection title="Featured Products" category="Featured" limit={8} addToCart={addToCart} />
      
      <ProductSection title="Latest Arrivals" limit={8} addToCart={addToCart} />

      {/* Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[2.5rem] overflow-hidden bg-gray-900 h-[400px] flex items-center">
          <img 
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1920" 
            alt="Promo" 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="relative z-10 px-12 md:px-20 max-w-2xl">
            <span className="text-blue-400 font-bold uppercase tracking-widest text-sm mb-4 block">Limited Time Offer</span>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">Upgrade Your Style with zFour Collection</h2>
            <p className="text-gray-300 text-lg mb-8">Get up to 50% off on selected items. Don't miss out on the season's hottest trends.</p>
            <button className="bg-white text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-blue-500 hover:text-white transition-all transform hover:scale-105">
              Shop the Sale
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
