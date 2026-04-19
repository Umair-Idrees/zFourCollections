import React, { useState, useEffect } from 'react';
import { 
  User, 
  Package, 
  Heart, 
  Settings, 
  LogOut, 
  ChevronRight, 
  ShoppingBag, 
  Clock, 
  CreditCard, 
  MapPin,
  Bell,
  Star,
  LayoutDashboard,
  ShoppingCart,
  Plus,
  Trash2,
  Edit2,
  Download,
  Truck,
  Eye,
  CheckCircle2,
  AlertCircle,
  Lock,
  Camera,
  X,
  Globe
} from 'lucide-react';
import { cn } from '../lib/utils';
import { auth, logout, loginWithGoogle, useAuth, loginAsDemoUser } from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'motion/react';
import { useProducts } from '../context/ProductContext';
import { useOrders, Order } from '../context/OrderContext';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const RECENTLY_VIEWED_PLACEHOLDERS = [
  { id: 'rv1', name: 'Lawn Collection Set', price: 85, image: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=400', rating: 4.8 },
  { id: 'rv2', name: 'Ready-to-Wear Kurti', price: 45, image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=400', rating: 4.9 },
  { id: 'rv3', name: 'Luxury Velvet Suit', price: 120, image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=400', rating: 4.5 },
  { id: 'rv4', name: 'Printed Silk Maxi', price: 95, image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=400', rating: 4.7 },
  { id: 'rv5', name: 'Embroidered Shawl', price: 65, image: 'https://picsum.photos/seed/shawl/400/400', rating: 4.6 },
  { id: 'rv6', name: 'Cigarette Pants', price: 25, image: 'https://picsum.photos/seed/pants/400/400', rating: 4.4 },
  { id: 'rv7', name: 'Organza Dupatta', price: 35, image: 'https://picsum.photos/seed/dupatta/400/400', rating: 4.8 },
  { id: 'rv8', name: 'Festive Formal Set', price: 150, image: 'https://picsum.photos/seed/formal/400/400', rating: 5.0 },
  { id: 'rv9', name: 'Daily Wear Kurti', price: 38, image: 'https://picsum.photos/seed/kurti/400/400', rating: 4.3 },
  { id: 'rv10', name: 'Tulip Shalwar', price: 30, image: 'https://picsum.photos/seed/shalwar/400/400', rating: 4.5 },
  { id: 'rv11', name: 'Lawn Printed Suit', price: 75, image: 'https://picsum.photos/seed/suit1/400/400', rating: 4.7 },
  { id: 'rv12', name: 'Chiffon Party Wear', price: 110, image: 'https://picsum.photos/seed/suit2/400/400', rating: 4.9 },
];

const ORDERS = [
  { id: '#10234', date: 'May 16, 2024', status: 'Shipped', total: '$299.99', product: 'Premium Wireless Headphones', image: 'https://picsum.photos/seed/headphones/200/200' },
  { id: '#10229', date: 'May 12, 2024', status: 'Delivered', total: '$189.00', product: 'Minimalist Leather Watch', image: 'https://picsum.photos/seed/watch/200/200' },
  { id: '#10215', date: 'May 05, 2024', status: 'Delivered', total: '$1,299.99', product: 'Laptop Pro 15"', image: 'https://picsum.photos/seed/laptop/200/200' },
];

const ADDRESSES = [
  { id: 'addr1', type: 'Home', name: 'Sarah Johnson', address: '123 Fashion Ave, Suite 45', city: 'New York', state: 'NY', zip: '10001', isDefault: true },
  { id: 'addr2', type: 'Office', name: 'Sarah Johnson', address: '456 Business Blvd, Floor 12', city: 'Brooklyn', state: 'NY', zip: '11201', isDefault: false },
];

const PAYMENTS = [
  { id: 'pay1', type: 'Visa', last4: '4242', expiry: '12/26', isDefault: true },
  { id: 'pay2', type: 'Mastercard', last4: '8888', expiry: '08/25', isDefault: false },
];

const NOTIFICATIONS = [
  { id: 'n1', title: 'Order Shipped!', message: 'Your order #10234 has been shipped and is on its way.', time: '2 hours ago', type: 'order' },
  { id: 'n2', title: 'Flash Sale Alert', message: 'Get 50% off on all electronics this weekend!', time: '5 hours ago', type: 'promo' },
  { id: 'n3', title: 'Delivery Update', message: 'Order #10229 was successfully delivered.', time: '1 day ago', type: 'delivery' },
];

export default function UserDashboard({ cart = [] }: { cart?: any[] }) {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { products } = useProducts();
  const { userOrders } = useOrders();
  const navigate = useNavigate();

  const { user, loading: authLoading } = useAuth();

  const totalOrders = userOrders.length;
  const pendingOrders = userOrders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;
  const deliveredOrders = userOrders.filter(o => o.status === 'Delivered').length;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header cart={cart} />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 text-center max-w-md w-full">
            <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <User className="text-accent w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold text-primary mb-2">My Account</h1>
            <p className="text-gray-500 mb-8">Please login to view your orders, wishlist, and account settings.</p>
            <div className="space-y-4">
              <button 
                onClick={() => loginWithGoogle()}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3"
              >
                <Globe size={20} /> Login with Google
              </button>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                <span className="relative px-3 text-xs text-gray-400 bg-white">OR TESTING ONLY</span>
              </div>
              <button 
                onClick={() => loginAsDemoUser()}
                className="w-full py-4 bg-gray-100 text-primary rounded-2xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-3"
              >
                <User size={20} /> Bypass & Enter as Demo User
              </button>
            </div>
            <Link to="/" className="block mt-6 text-sm font-bold text-gray-400 hover:text-primary transition-colors">
              Back to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const MENU_ITEMS = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'My Orders', icon: Package },
    { name: 'Wishlist', icon: Heart },
    { name: 'My Cart', icon: ShoppingCart },
    { name: 'Addresses', icon: MapPin },
    { name: 'Payment Methods', icon: CreditCard },
    { name: 'Notifications', icon: Bell },
    { name: 'Account Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Header cart={cart} />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 py-8 md:py-12 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden sticky top-24">
              <div className="p-8 text-center border-b border-gray-50">
                <div className="relative inline-block mb-4 group">
                  <img 
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || user.email}`} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full border-4 border-accent/10 object-cover transition-transform group-hover:scale-105"
                  />
                  <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-100 text-gray-400 hover:text-accent transition-colors">
                    <Camera size={14} />
                  </button>
                </div>
                <h2 className="text-xl font-bold text-primary truncate">{user.displayName || 'Sarah Johnson'}</h2>
                <p className="text-xs text-gray-400 font-medium truncate">{user.email}</p>
              </div>

              <nav className="p-4 space-y-1">
                {MENU_ITEMS.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setActiveTab(item.name)}
                    className={cn(
                      "w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold text-sm transition-all",
                      activeTab === item.name 
                        ? "bg-primary text-white shadow-xl shadow-primary/20" 
                        : "text-gray-500 hover:bg-gray-50 hover:text-primary"
                    )}
                  >
                    <item.icon size={18} />
                    {item.name}
                  </button>
                ))}
                <button 
                  onClick={async () => {
                    await logout();
                    window.location.href = "/";
                  }}
                  className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold text-sm text-sale hover:bg-red-50 transition-all mt-6"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </nav>
            </div>
          </aside>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'Dashboard' && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <h1 className="text-3xl font-bold text-primary">Welcome, {user.displayName?.split(' ')[0] || 'Sarah'}!</h1>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        { label: 'Total Orders', value: totalOrders.toString(), icon: Package, color: 'text-blue-500', bg: 'bg-blue-50' },
                        { label: 'Pending Orders', value: pendingOrders.toString(), icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
                        { label: 'Delivered Orders', value: deliveredOrders.toString(), icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50' },
                        { label: 'Wishlist Items', value: '4', icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50' },
                      ].map((stat) => (
                        <div key={stat.label} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-lg transition-shadow">
                          <div className={cn("p-4 rounded-2xl", stat.bg)}>
                            <stat.icon size={24} className={stat.color} />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-primary">{stat.value}</h3>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Recently Viewed */}
                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group/rv">
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-primary tracking-tight">Recently Viewed</h3>
                        <div className="flex gap-2">
                          <button className="rv-prev p-2.5 rounded-full border border-gray-100 text-gray-400 hover:text-accent hover:border-accent hover:bg-accent/5 transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed">
                            <ChevronRight size={18} className="rotate-180" />
                          </button>
                          <button className="rv-next p-2.5 rounded-full border border-gray-100 text-gray-400 hover:text-accent hover:border-accent hover:bg-accent/5 transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed">
                            <ChevronRight size={18} />
                          </button>
                        </div>
                      </div>
                      
                      <Swiper
                        modules={[Navigation]}
                        navigation={{
                          prevEl: '.rv-prev',
                          nextEl: '.rv-next',
                        }}
                        spaceBetween={24}
                        slidesPerView={1}
                        breakpoints={{
                          640: { slidesPerView: 2 },
                          1024: { slidesPerView: 3 },
                          1280: { slidesPerView: 4 },
                        }}
                        className="!overflow-visible"
                      >
                        {(products.length > 0 ? [...products, ...RECENTLY_VIEWED_PLACEHOLDERS] : RECENTLY_VIEWED_PLACEHOLDERS).slice(0, 12).map((product) => (
                          <SwiperSlide key={product.id}>
                            <Link to={`/product/${product.id}`} className="block group cursor-pointer border border-gray-50 rounded-3xl p-4 hover:border-accent/20 hover:shadow-xl hover:shadow-accent/5 transition-all bg-white h-full">
                              <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-50 relative">
                                <img 
                                  src={product.mainImage || (product as any).image} 
                                  alt={product.name} 
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                  referrerPolicy="no-referrer" 
                                />
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="absolute top-3 left-3">
                                  <span className="bg-white/90 backdrop-blur-md text-[10px] font-black px-2.5 py-1 rounded-full text-accent shadow-sm uppercase tracking-widest">
                                    Recent
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <h4 className="font-bold text-primary group-hover:text-accent transition-colors truncate">{product.name}</h4>
                                <div className="flex items-center justify-between">
                                  <p className="font-black text-primary text-lg">${product.salePrice || (product as any).price}</p>
                                  <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg">
                                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                                    <span className="text-[10px] font-black text-gray-500 tracking-tighter">{ (product as any).rating || 4.8 }</span>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>

                    {/* Recent Orders Preview */}
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                      <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-primary">My Recent Orders</h3>
                        <button onClick={() => setActiveTab('My Orders')} className="text-sm font-bold text-accent hover:underline">View All</button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50/50">
                              <th className="text-left py-4 px-8 text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID</th>
                              <th className="text-left py-4 px-8 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                              <th className="text-left py-4 px-8 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                              <th className="text-right py-4 px-8 text-xs font-bold text-gray-400 uppercase tracking-widest">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {userOrders.slice(0, 3).map((order) => (
                              <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="py-5 px-8 text-sm font-bold text-primary">{order.orderId}</td>
                                <td className="py-5 px-8 text-sm text-gray-500">
                                  {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Recent'}
                                </td>
                                <td className="py-5 px-8">
                                  <span className={cn(
                                    "text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider",
                                    order.status === 'Pending' ? "bg-orange-50 text-orange-600" : 
                                    order.status === 'Shipped' ? "bg-blue-50 text-blue-600" : 
                                    "bg-green-50 text-green-600"
                                  )}>
                                    {order.status}
                                  </span>
                                </td>
                                <td className="py-5 px-8 text-right">
                                  <button 
                                    onClick={() => setSelectedOrder(order)}
                                    className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-800 transition-all flex items-center gap-2 ml-auto"
                                  >
                                    View Details <ChevronRight size={14} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {userOrders.length === 0 && (
                              <tr>
                                <td colSpan={4} className="py-10 text-center text-gray-400 text-sm">No orders yet.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'My Orders' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h1 className="text-3xl font-bold text-primary">My Orders</h1>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 rounded-xl bg-white border border-gray-100 text-sm font-bold text-primary hover:bg-gray-50 transition-all">All Orders</button>
                        <button className="px-4 py-2 rounded-xl bg-white border border-gray-100 text-sm font-bold text-gray-400 hover:bg-gray-50 transition-all">Processing</button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {userOrders.map((order) => (
                        <div key={order.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                              <img src={order.items[0]?.image || 'https://picsum.photos/seed/order/200/200'} alt={order.items[0]?.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-grow">
                              <div className="flex flex-col md:flex-row justify-between gap-2 mb-4">
                                <div>
                                  <h4 className="font-bold text-primary text-lg mb-1">
                                    {order.items.length > 1 ? `${order.items[0].name} + ${order.items.length - 1} more` : order.items[0]?.name}
                                  </h4>
                                  <p className="text-sm text-gray-400 font-medium">
                                    Order ID: {order.orderId} • {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Recent'}
                                  </p>
                                </div>
                                <div className="text-left md:text-right">
                                  <p className="text-xl font-bold text-primary mb-1">${order.total.toFixed(2)}</p>
                                  <span className={cn(
                                    "text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider",
                                    order.status === 'Pending' ? "bg-orange-50 text-orange-600" : 
                                    order.status === 'Shipped' ? "bg-blue-50 text-blue-600" : 
                                    "bg-green-50 text-green-600"
                                  )}>
                                    {order.status}
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-50">
                                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-gray-800 transition-all">
                                  <Truck size={14} /> Track Order
                                </button>
                                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-50 text-primary text-xs font-bold hover:bg-gray-100 transition-all">
                                  <Download size={14} /> Invoice
                                </button>
                                <button 
                                  onClick={() => setSelectedOrder(order)}
                                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-50 text-primary text-xs font-bold hover:bg-gray-100 transition-all"
                                >
                                  <Eye size={14} /> View Details
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {userOrders.length === 0 && (
                        <div className="bg-white p-12 rounded-[2rem] border border-gray-100 shadow-sm text-center">
                          <Package size={48} className="mx-auto text-gray-200 mb-4" />
                          <h3 className="text-xl font-bold text-primary mb-2">No orders found</h3>
                          <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
                          <Link to="/shop" className="bg-accent text-white px-8 py-3 rounded-2xl font-bold hover:bg-accent/90 transition-all">
                            Start Shopping
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'Wishlist' && (
                  <div className="space-y-8">
                    <h1 className="text-3xl font-bold text-primary">Wishlist</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {RECENTLY_VIEWED_PLACEHOLDERS.slice(0, 3).map((product) => (
                        <div key={product.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden group">
                          <div className="aspect-square relative overflow-hidden bg-gray-50">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <button className="absolute top-4 right-4 p-2.5 bg-white/80 backdrop-blur-md rounded-full text-sale hover:bg-sale hover:text-white transition-all shadow-lg">
                              <Trash2 size={18} />
                            </button>
                          </div>
                          <div className="p-6">
                            <h4 className="font-bold text-primary mb-2 truncate group-hover:text-accent transition-colors">{product.name}</h4>
                            <div className="flex items-center justify-between mb-6">
                              <p className="text-xl font-bold text-primary">${product.price}</p>
                              <div className="flex items-center gap-1">
                                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-bold text-gray-400">{product.rating}</span>
                              </div>
                            </div>
                            <button className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3.5 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-primary/10">
                              <ShoppingCart size={18} /> Add to Cart
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'My Cart' && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <h1 className="text-3xl font-bold text-primary">My Cart</h1>
                      <Link to="/" className="text-sm font-bold text-accent hover:underline">Continue Shopping</Link>
                    </div>

                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                      <div className="p-8 border-b border-gray-50 grid grid-cols-12 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <div className="col-span-6">Product</div>
                        <div className="col-span-2 text-center">Price</div>
                        <div className="col-span-2 text-center">Quantity</div>
                        <div className="col-span-2 text-right">Total</div>
                      </div>
                      <div className="divide-y divide-gray-50">
                        {[
                          { id: 'c1', name: 'Premium Wireless Headphones', price: 299.99, qty: 1, image: 'https://picsum.photos/seed/headphones/200/200' },
                          { id: 'c2', name: 'Minimalist Leather Watch', price: 189.00, qty: 1, image: 'https://picsum.photos/seed/watch/200/200' },
                        ].map((item) => (
                          <div key={item.id} className="p-8 grid grid-cols-12 items-center group">
                            <div className="col-span-6 flex gap-6">
                              <img src={item.image} alt={item.name} className="w-20 h-20 rounded-2xl object-cover border border-gray-100" />
                              <div className="flex flex-col justify-center">
                                <h4 className="font-bold text-primary group-hover:text-accent transition-colors">{item.name}</h4>
                                <button className="text-xs font-bold text-sale mt-2 flex items-center gap-1">
                                  <Trash2 size={12} /> Remove
                                </button>
                              </div>
                            </div>
                            <div className="col-span-2 text-center font-bold text-primary">${item.price}</div>
                            <div className="col-span-2 flex justify-center">
                              <div className="flex items-center border border-gray-100 rounded-xl overflow-hidden">
                                <button className="px-3 py-1 hover:bg-gray-50 text-gray-400">-</button>
                                <span className="px-3 py-1 font-bold text-sm">{item.qty}</span>
                                <button className="px-3 py-1 hover:bg-gray-50 text-gray-400">+</button>
                              </div>
                            </div>
                            <div className="col-span-2 text-right font-bold text-primary">${(item.price * item.qty).toFixed(2)}</div>
                          </div>
                        ))}
                      </div>
                      <div className="p-8 bg-gray-50/50 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex gap-4">
                          <input type="text" placeholder="Coupon Code" className="bg-white border border-gray-100 rounded-xl px-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20" />
                          <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition-all">Apply</button>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400 font-medium mb-1">Subtotal: <span className="text-primary font-bold">$488.99</span></p>
                          <button className="bg-accent text-white px-10 py-4 rounded-2xl font-bold hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 mt-2">
                            Checkout Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'Addresses' && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <h1 className="text-3xl font-bold text-primary">Addresses</h1>
                      <button className="flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-2xl font-bold hover:bg-accent/90 transition-all shadow-lg shadow-accent/20">
                        <Plus size={18} /> Add New
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {ADDRESSES.map((addr) => (
                        <div key={addr.id} className={cn(
                          "bg-white p-8 rounded-[2rem] border transition-all relative group",
                          addr.isDefault ? "border-accent shadow-lg shadow-accent/5" : "border-gray-100 shadow-sm"
                        )}>
                          <div className="flex items-center justify-between mb-6">
                            <span className={cn(
                              "text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest",
                              addr.isDefault ? "bg-accent text-white" : "bg-gray-100 text-gray-500"
                            )}>
                              {addr.type} {addr.isDefault && '• Default'}
                            </span>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 text-gray-400 hover:text-accent transition-colors"><Edit2 size={16} /></button>
                              <button className="p-2 text-gray-400 hover:text-sale transition-colors"><Trash2 size={16} /></button>
                            </div>
                          </div>
                          <h4 className="font-bold text-primary text-lg mb-2">{addr.name}</h4>
                          <p className="text-gray-500 leading-relaxed mb-1">{addr.address}</p>
                          <p className="text-gray-500 leading-relaxed">{addr.city}, {addr.state} {addr.zip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'Payment Methods' && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <h1 className="text-3xl font-bold text-primary">Payment Methods</h1>
                      <button className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-primary/20">
                        <Plus size={18} /> Add Card
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {PAYMENTS.map((pay) => (
                        <div key={pay.id} className={cn(
                          "bg-white p-8 rounded-[2rem] border transition-all relative overflow-hidden group",
                          pay.isDefault ? "border-primary shadow-lg" : "border-gray-100 shadow-sm"
                        )}>
                          <div className="flex items-center justify-between mb-10">
                            <div className="w-12 h-8 bg-gray-100 rounded-md flex items-center justify-center font-bold text-xs text-gray-400">
                              {pay.type}
                            </div>
                            <button className="p-2 text-gray-400 hover:text-sale transition-colors opacity-0 group-hover:opacity-100">
                              <Trash2 size={18} />
                            </button>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xl font-bold text-primary tracking-widest">•••• •••• •••• {pay.last4}</p>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Expires {pay.expiry}</p>
                          </div>
                          {pay.isDefault && (
                            <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-4 py-1 rounded-bl-2xl uppercase tracking-widest">
                              Default
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {/* COD Option */}
                      <div className="bg-gray-50 p-8 rounded-[2rem] border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                        <div className="p-4 bg-white rounded-2xl mb-4 shadow-sm">
                          <CreditCard size={24} className="text-gray-400" />
                        </div>
                        <h4 className="font-bold text-primary mb-1">Cash on Delivery</h4>
                        <p className="text-xs text-gray-400 font-medium">Available for all orders</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'Notifications' && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <h1 className="text-3xl font-bold text-primary">Notifications</h1>
                      <button className="text-sm font-bold text-accent hover:underline">Mark all as read</button>
                    </div>

                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                      <div className="divide-y divide-gray-50">
                        {NOTIFICATIONS.map((note) => (
                          <div key={note.id} className="p-8 flex gap-6 hover:bg-gray-50/50 transition-all group">
                            <div className={cn(
                              "p-4 rounded-2xl h-fit",
                              note.type === 'order' ? "bg-blue-50 text-blue-500" :
                              note.type === 'promo' ? "bg-purple-50 text-purple-500" :
                              "bg-green-50 text-green-500"
                            )}>
                              {note.type === 'order' ? <Package size={24} /> : 
                               note.type === 'promo' ? <Bell size={24} /> : 
                               <Truck size={24} />}
                            </div>
                            <div className="flex-grow">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-bold text-primary group-hover:text-accent transition-colors">{note.title}</h4>
                                <span className="text-xs text-gray-400 font-medium">{note.time}</span>
                              </div>
                              <p className="text-gray-500 text-sm leading-relaxed">{note.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'Account Settings' && (
                  <div className="space-y-8">
                    <h1 className="text-3xl font-bold text-primary">Account Settings</h1>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Profile Info */}
                      <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                          <h3 className="text-xl font-bold text-primary mb-8">Personal Information</h3>
                          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                <input 
                                  type="text" 
                                  defaultValue={user.displayName || 'Sarah Johnson'}
                                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                <input 
                                  type="email" 
                                  defaultValue={user.email || ''}
                                  disabled
                                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-gray-400 cursor-not-allowed"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                <input 
                                  type="tel" 
                                  placeholder="+1 (234) 567-890"
                                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                                />
                              </div>
                            </div>
                            <div className="pt-6 border-t border-gray-50 flex justify-end">
                              <button className="bg-primary text-white px-10 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-primary/20">
                                Save Changes
                              </button>
                            </div>
                          </form>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                          <h3 className="text-xl font-bold text-primary mb-8">Security</h3>
                          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Current Password</label>
                                <div className="relative">
                                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                  <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all" />
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                                  <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all" />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                                  <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all" />
                                </div>
                              </div>
                            </div>
                            <div className="pt-6 border-t border-gray-50 flex justify-end">
                              <button className="bg-gray-50 text-primary border border-gray-100 px-10 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all">
                                Update Password
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>

                      {/* Profile Image Card */}
                      <div className="space-y-6">
                        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm text-center">
                          <h3 className="text-lg font-bold text-primary mb-6">Profile Picture</h3>
                          <div className="relative inline-block mb-6">
                            <img 
                              src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || user.email}`} 
                              alt="Profile" 
                              className="w-32 h-32 rounded-full border-4 border-accent/10 object-cover"
                            />
                            <button className="absolute bottom-0 right-0 p-3 bg-accent text-white rounded-full shadow-xl hover:scale-110 transition-transform">
                              <Camera size={18} />
                            </button>
                          </div>
                          <p className="text-xs text-gray-400 font-medium leading-relaxed px-4">
                            Allowed JPG, GIF or PNG. Max size of 800K
                          </p>
                        </div>

                        <div className="bg-sale/5 p-8 rounded-[2rem] border border-sale/10">
                          <div className="flex items-center gap-3 text-sale mb-4">
                            <AlertCircle size={20} />
                            <h4 className="font-bold">Delete Account</h4>
                          </div>
                          <p className="text-xs text-sale/70 font-medium leading-relaxed mb-6">
                            Once you delete your account, there is no going back. Please be certain.
                          </p>
                          <button className="w-full py-3.5 rounded-2xl bg-sale text-white font-bold hover:bg-red-700 transition-all shadow-lg shadow-sale/20">
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-8 border-b border-gray-50 flex items-center justify-between sticky top-0 bg-white z-10">
                <div>
                  <h2 className="text-2xl font-bold text-primary">Order Details</h2>
                  <p className="text-sm text-gray-400 font-medium">Order ID: {selectedOrder.orderId}</p>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-primary transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Shipping Information</h3>
                    <div className="bg-gray-50 p-6 rounded-3xl">
                      <p className="font-bold text-primary mb-1">{selectedOrder.customerName}</p>
                      <p className="text-sm text-gray-500 leading-relaxed mb-1">{selectedOrder.shippingAddress.address}</p>
                      <p className="text-sm text-gray-500 leading-relaxed mb-1">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.zipCode}</p>
                      <p className="text-sm text-gray-500 leading-relaxed">{selectedOrder.shippingAddress.phone}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order Summary</h3>
                    <div className="bg-gray-50 p-6 rounded-3xl space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Status</span>
                        <span className={cn(
                          "font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded-full",
                          selectedOrder.status === 'Pending' ? "bg-orange-50 text-orange-600" : 
                          selectedOrder.status === 'Shipped' ? "bg-blue-50 text-blue-600" : 
                          "bg-green-50 text-green-600"
                        )}>
                          {selectedOrder.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Date</span>
                        <span className="font-bold text-primary">
                          {selectedOrder.createdAt?.toDate ? selectedOrder.createdAt.toDate().toLocaleDateString() : 'Recent'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Payment</span>
                        <span className="font-bold text-primary">{selectedOrder.paymentMethod}</span>
                      </div>
                      <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                        <span className="font-bold text-primary">Total Amount</span>
                        <span className="text-xl font-bold text-accent">${selectedOrder.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Items Ordered</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl hover:border-accent/20 transition-all group">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="flex-grow min-w-0">
                          <h4 className="font-bold text-primary text-sm truncate">{item.name}</h4>
                          <p className="text-xs text-gray-400 font-medium">Qty: {item.quantity} • ${item.price.toFixed(2)} each</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-gray-50 bg-gray-50/30 flex gap-4">
                <button className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-primary/10 flex items-center justify-center gap-2">
                  <Truck size={18} /> Track Shipment
                </button>
                <button className="flex-1 bg-white border border-gray-100 text-primary py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                  <Download size={18} /> Download Invoice
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
