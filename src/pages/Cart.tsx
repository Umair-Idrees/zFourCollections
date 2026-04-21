import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ChevronLeft, ShieldCheck, Truck, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { formatPrice } from '../lib/utils';

interface CartProps {
  cart: any[];
  setCart: React.Dispatch<React.SetStateAction<any[]>>;
}

const Cart: React.FC<CartProps> = ({ cart, setCart }) => {
  const subtotal = cart.reduce((acc, item) => acc + (item.salePrice * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 10;
  const total = subtotal + shipping;

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <div className="w-24 h-24 bg-linen rounded-full flex items-center justify-center mx-auto mb-8">
          <ShoppingBag size={48} className="text-primary" />
        </div>
        <h2 className="text-3xl font-black text-primary mb-4 uppercase tracking-tight">Your cart is empty</h2>
        <p className="text-gray-500 mb-10 max-w-md mx-auto font-medium">Looks like you haven't added anything to your cart yet. Start shopping and discover our latest boutique collection.</p>
        <Link 
          to="/shop" 
          className="inline-flex items-center gap-3 bg-accent text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-neutral-900 transition-all shadow-xl shadow-accent/10 active:scale-95"
        >
          Start Shopping
          <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-12">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronLeft size={12} className="rotate-180" />
        <span className="text-primary">Shopping Cart</span>
      </div>

      <h1 className="text-4xl font-black text-primary mb-12 uppercase tracking-tight">Shopping Cart ({cart.length})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <motion.div 
              layout
              key={item.id} 
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-6 items-center"
            >
              <div className="w-32 h-32 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div className="text-[10px] text-accent font-black uppercase tracking-widest">{item.category}</div>
                <h3 className="text-lg font-black text-primary line-clamp-1">{item.name}</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest tracking-tighter">SKU: {item.sku || 'N/A'}</p>
                <div className="text-xl font-black text-primary mt-2">{formatPrice(item.salePrice)}</div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                  <button 
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-2 hover:bg-white rounded-lg transition-colors text-gray-500"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center font-bold text-gray-900">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-2 hover:bg-white rounded-lg transition-colors text-gray-500"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <button 
                  onClick={() => removeItem(item.id)}
                  className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Order Summary</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Subtotal</span>
                <span className="text-gray-900 font-bold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Shipping</span>
                <span className="text-gray-900 font-bold">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Estimated Tax</span>
                <span className="text-gray-900 font-bold">{formatPrice(0)}</span>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
              <span className="text-lg font-black text-primary uppercase tracking-tight">Total</span>
              <span className="text-2xl font-black text-primary">{formatPrice(total)}</span>
            </div>

            <Link 
              to="/checkout" 
              className="w-full bg-accent text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-neutral-900 transition-all shadow-xl shadow-accent/10 flex items-center justify-center gap-3 active:scale-95"
            >
              Proceed to Checkout
              <ArrowRight size={18} />
            </Link>

            <div className="pt-4 space-y-4">
              <div className="flex items-center gap-3 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                <ShieldCheck size={18} className="text-green-500" />
                <span>Secure Checkout Guaranteed</span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                <Truck size={18} className="text-primary" />
                <span>Fast & Reliable Shipping</span>
              </div>
            </div>
          </div>

          <div className="bg-primary p-8 rounded-[2.5rem] text-white shadow-xl shadow-primary/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -mr-16 -mt-16"></div>
            <h4 className="font-black uppercase tracking-[0.2em] text-xs mb-6 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-gold"></span>
              Have a Coupon?
            </h4>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Enter code" 
                className="w-full bg-white/10 border border-white/20 rounded-xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-gold text-sm placeholder:text-white/40"
              />
              <button className="absolute right-2 top-2 bg-white text-primary px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-gold transition-all">
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
