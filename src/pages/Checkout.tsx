import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db, collection, addDoc, serverTimestamp, handleFirestoreError, OperationType, auth } from '../lib/firebase';
import { ShieldCheck, Truck, CreditCard, ChevronLeft, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CheckoutProps {
  cart: any[];
}

const Checkout: React.FC<CheckoutProps> = ({ cart }) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    phone: '',
    paymentMethod: 'Credit Card'
  });

  const subtotal = cart.reduce((acc, item) => acc + (item.salePrice * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 10;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      const orderData = {
        orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        customerId: auth.currentUser?.uid || 'guest',
        customerName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.salePrice,
          quantity: item.quantity,
          image: item.image
        })),
        total,
        status: 'Pending',
        paymentMethod: formData.paymentMethod,
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          phone: formData.phone
        },
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'orders'), orderData);
      setIsSuccess(true);
      setTimeout(() => navigate('/'), 5000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'orders');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0 && !isSuccess) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <h2 className="text-3xl font-black text-primary mb-4 uppercase tracking-tight">Your cart is empty</h2>
        <Link to="/shop" className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gold transition-all shadow-xl shadow-primary/10">Back to Shop</Link>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle2 size={48} className="text-green-600" />
        </motion.div>
        <h2 className="text-4xl font-black text-primary mb-4 uppercase tracking-tight">Order Placed Successfully!</h2>
        <p className="text-gray-500 mb-10 max-w-md mx-auto font-medium">Thank you for your purchase. Your order has been received and is being processed. You will receive an email confirmation shortly.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/" 
            className="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gold transition-all shadow-xl shadow-primary/10 active:scale-95"
          >
            Back to Home
          </Link>
          <button className="bg-linen border border-stone-100 text-primary px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white transition-all">
            Track Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-12">
        <Link to="/cart" className="hover:text-primary transition-colors">Cart</Link>
        <ChevronLeft size={12} className="rotate-180" />
        <span className="text-primary">Checkout</span>
      </div>

      <h1 className="text-4xl font-black text-primary mb-12 uppercase tracking-tight">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Shipping Info */}
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
            <div className="flex items-center gap-4 border-b border-gray-50 pb-6">
              <div className="w-10 h-10 bg-linen rounded-xl flex items-center justify-center text-primary">
                <Truck size={20} />
              </div>
              <h3 className="text-xl font-black text-primary uppercase tracking-tight">Shipping Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="John" 
                  className="w-full bg-linen border border-transparent rounded-2xl py-4 px-6 focus:outline-none focus:bg-white focus:border-stone-100 focus:ring-4 focus:ring-primary/5 transition-all text-sm" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Doe" 
                  className="w-full bg-linen border border-transparent rounded-2xl py-4 px-6 focus:outline-none focus:bg-white focus:border-stone-100 focus:ring-4 focus:ring-primary/5 transition-all text-sm" 
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com" 
                  className="w-full bg-linen border border-transparent rounded-2xl py-4 px-6 focus:outline-none focus:bg-white focus:border-stone-100 focus:ring-4 focus:ring-primary/5 transition-all text-sm" 
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Street Address</label>
                <input 
                  type="text" 
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="123 Main St, Apt 4" 
                  className="w-full bg-linen border border-transparent rounded-2xl py-4 px-6 focus:outline-none focus:bg-white focus:border-stone-100 focus:ring-4 focus:ring-primary/5 transition-all text-sm" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">City</label>
                <input 
                  type="text" 
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="New York" 
                  className="w-full bg-linen border border-transparent rounded-2xl py-4 px-6 focus:outline-none focus:bg-white focus:border-stone-100 focus:ring-4 focus:ring-primary/5 transition-all text-sm" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Zip Code</label>
                <input 
                  type="text" 
                  name="zipCode"
                  required
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  placeholder="10001" 
                  className="w-full bg-linen border border-transparent rounded-2xl py-4 px-6 focus:outline-none focus:bg-white focus:border-stone-100 focus:ring-4 focus:ring-primary/5 transition-all text-sm" 
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (234) 567-890" 
                  className="w-full bg-linen border border-transparent rounded-2xl py-4 px-6 focus:outline-none focus:bg-white focus:border-stone-100 focus:ring-4 focus:ring-primary/5 transition-all text-sm" 
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
            <div className="flex items-center gap-4 border-b border-gray-50 pb-6">
              <div className="w-10 h-10 bg-linen rounded-xl flex items-center justify-center text-primary">
                <CreditCard size={20} />
              </div>
              <h3 className="text-xl font-black text-primary uppercase tracking-tight">Payment Method</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className={`flex items-center justify-between p-6 rounded-2xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'Credit Card' ? 'border-primary bg-linen' : 'border-gray-100 hover:border-stone-200'}`}>
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
                    {formData.paymentMethod === 'Credit Card' && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                  </div>
                  <span className="font-black text-primary text-xs uppercase tracking-widest">Credit Card</span>
                </div>
                <CreditCard size={20} className="text-gray-400" />
                <input type="radio" name="paymentMethod" value="Credit Card" className="hidden" onChange={handleInputChange} checked={formData.paymentMethod === 'Credit Card'} />
              </label>
              
              <label className={`flex items-center justify-between p-6 rounded-2xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'PayPal' ? 'border-primary bg-linen' : 'border-gray-100 hover:border-stone-200'}`}>
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
                    {formData.paymentMethod === 'PayPal' && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                  </div>
                  <span className="font-black text-primary text-xs uppercase tracking-widest">PayPal</span>
                </div>
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
                <input type="radio" name="paymentMethod" value="PayPal" className="hidden" onChange={handleInputChange} checked={formData.paymentMethod === 'PayPal'} />
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
            <h3 className="text-xl font-bold text-gray-900">Your Order</h3>
            
            <div className="space-y-6 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="w-16 h-16 bg-linen rounded-xl overflow-hidden flex-shrink-0 border border-stone-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-all" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-black text-primary uppercase tracking-tight line-clamp-1">{item.name}</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Qty: {item.quantity}</p>
                    <p className="text-sm font-black text-primary mt-1">${(item.salePrice * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-100">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-primary">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                <span className="text-gray-400">Shipping</span>
                <span className="text-primary">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="pt-4 flex justify-between items-center border-t border-linen">
                <span className="text-sm font-black text-primary uppercase tracking-widest">Total cost</span>
                <span className="text-2xl font-black text-primary">${total.toFixed(2)}</span>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isProcessing}
              className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gold transition-all shadow-xl shadow-primary/10 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  Complete Purchase
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-widest">
              <Lock size={14} />
              <span>Secure Encrypted Payment</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
