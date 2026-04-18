import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ChevronLeft, ShieldCheck, Truck, Clock } from 'lucide-react';
import { motion } from 'motion/react';

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
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8">
          <ShoppingBag size={48} className="text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-10 max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Start shopping and discover our latest collection.</p>
        <Link 
          to="/shop" 
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200"
        >
          Start Shopping
          <ArrowRight size={20} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-12">
        <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <ChevronLeft size={14} className="rotate-180" />
        <span className="text-gray-900">Shopping Cart</span>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-12">Shopping Cart ({cart.length})</h1>

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
                <div className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">{item.category}</div>
                <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                <p className="text-sm text-gray-400 font-medium">SKU: {item.sku || 'N/A'}</p>
                <div className="text-xl font-bold text-gray-900 mt-2">${item.salePrice}</div>
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
                <span className="text-gray-900 font-bold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Shipping</span>
                <span className="text-gray-900 font-bold">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Estimated Tax</span>
                <span className="text-gray-900 font-bold">$0.00</span>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
            </div>

            <Link 
              to="/checkout" 
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3"
            >
              Proceed to Checkout
              <ArrowRight size={20} />
            </Link>

            <div className="pt-4 space-y-4">
              <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                <ShieldCheck size={18} className="text-green-500" />
                <span>Secure Checkout Guaranteed</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                <Truck size={18} className="text-blue-500" />
                <span>Fast & Reliable Shipping</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-gray-200">
            <h4 className="font-bold mb-4">Have a Coupon?</h4>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Enter code" 
                className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button className="absolute right-2 top-1.5 bg-white text-gray-900 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-500 hover:text-white transition-all">
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
