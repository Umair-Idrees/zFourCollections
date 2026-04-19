import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  BarChart3, 
  Search, 
  Bell, 
  Plus, 
  MoreVertical, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  LogOut,
  ChevronRight,
  Filter,
  Download,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  Tag,
  Star,
  CreditCard,
  PieChart as PieChartIcon,
  Image as ImageIcon,
  Globe,
  Truck,
  ShieldCheck,
  X,
  Upload,
  Calendar,
  Layers,
  Heart,
  User
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { cn } from '../lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useProducts } from '../context/ProductContext';
import { useOrders } from '../context/OrderContext';
import { auth, loginWithGoogle, logout, storage, ref, uploadBytes, getDownloadURL, useAuth, loginAsDemoAdmin } from '../lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';

import Logo from '../components/Logo';

// --- Mock Data for Boutique Theme ---
const GROWTH_DATA = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 5000 },
  { name: 'Thu', sales: 4500 },
  { name: 'Fri', sales: 6000 },
  { name: 'Sat', sales: 8000 },
  { name: 'Sun', sales: 7000 },
];

const CATEGORY_STATS = [
  { name: 'Lawn Collection', value: 45, color: '#c5a059' }, // Gold
  { name: 'Bridal Wear', value: 25, color: '#d32f2f' }, // Maroon
  { name: 'Ready-to-Wear', value: 20, color: '#111111' }, // Black
  { name: 'Accessories', value: 10, color: '#666666' },
];

export default function AdminDashboard({ 
  initialTab = 'Orders',
  openAddProduct = false
}: { 
  initialTab?: string;
  openAddProduct?: boolean;
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(openAddProduct);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const { user, loading: authLoading, isAdmin } = useAuth();
  const { products, addProduct, deleteProduct, updateProduct } = useProducts();
  const { orders, updateOrderStatus, loading: ordersLoading } = useOrders();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
  const activeOrdersCount = orders.filter(o => o.status === 'Pending' || o.status === 'Processing' || o.status === 'Shipped').length;
  const trendingSuits = products.find(p => p.category === 'Lawn Collection')?.name || 'Spring Lawn 2024';

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Fabrics',
    price: '',
    salePrice: '',
    stock: '',
    description: '',
    images: [''],
    sizes: [] as string[],
    colors: [] as { name: string, hex: string }[]
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfcfc] p-4 font-sans text-[#111111]">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 text-center max-w-md w-full relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#d32f2f] to-[#c5a059]"></div>
          
          <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="text-accent w-10 h-10" />
          </div>
          <h1 className="text-2xl font-black text-primary mb-2 uppercase tracking-tight">Admin Access Required</h1>
          <p className="text-gray-500 mb-8 leading-relaxed">Please login with an authorized administrator account to manage CareNexon Boutique.</p>
          
          <div className="space-y-4">
            <button 
              onClick={() => loginWithGoogle()}
              className="w-full py-4 bg-[#111111] text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              <Globe size={20} /> Login with Google
            </button>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
              <span className="relative px-3 text-[10px] uppercase font-black tracking-widest text-gray-400 bg-white">OR TESTING BYPASS</span>
            </div>
            <button 
              onClick={() => loginAsDemoAdmin()}
              className="w-full py-4 bg-accent/10 text-accent rounded-2xl font-bold hover:bg-accent hover:text-white transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              <ShieldCheck size={20} /> Bypass & Enter as Admin
            </button>
          </div>
          <Link to="/" className="block mt-8 text-xs font-black uppercase text-gray-400 hover:text-primary transition-colors tracking-widest">
            Back to Customer View
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#f8f7f4] font-sans text-[#111111]">
      {/* Sidebar */}
      <aside className={cn(
        "bg-[#111111] text-white transition-all duration-300 ease-in-out flex flex-col fixed inset-y-0 z-50",
        isSidebarOpen ? "w-72" : "w-20"
      )}>
        <div className="p-6 h-20 flex items-center overflow-hidden border-b border-white/5">
          <Logo variant="light" className={cn("transition-all duration-300", !isSidebarOpen && "scale-75 opacity-0")} />
          {!isSidebarOpen && <div className="w-full flex justify-center"><LayoutDashboard className="text-accent" /></div>}
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto no-scrollbar">
          {[
            { id: 'Dashboard', icon: LayoutDashboard, label: 'Analytics' },
            { id: 'Orders', icon: ShoppingCart, label: 'Recent Orders' },
            { id: 'New Arrivals', icon: Star, label: 'Suit Arrivals' },
            { id: 'Categories', icon: Layers, label: 'Management' },
            { id: 'Customers', icon: Users, label: 'Customer Base' },
            { id: 'Settings', icon: Settings, label: 'Store Config' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group relative",
                activeTab === item.id ? "bg-accent/10 text-accent font-bold" : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              {activeTab === item.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute left-0 w-1.5 h-6 bg-accent rounded-r-full"
                />
              )}
              <item.icon size={22} className={cn("flex-shrink-0 transition-transform duration-300", activeTab === item.id && "scale-110")} />
              {isSidebarOpen && <span className="tracking-wide text-[13px] uppercase font-black">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={() => logout()}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-[#d32f2f] hover:bg-red-500/5 transition-all group"
          >
            <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
            {isSidebarOpen && <span className="text-[13px] uppercase font-black tracking-widest">Logout Manager</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-300 min-h-screen",
        isSidebarOpen ? "pl-72" : "pl-20"
      )}>
        {/* Top Header */}
        <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <MenuIcon isSidebarOpen={isSidebarOpen} />
            </button>
            <div>
              <h1 className="text-xl font-black text-primary uppercase tracking-tight">{activeTab}</h1>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest -mt-1">CareNexon Boutique Admin</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center bg-gray-50 rounded-full px-5 py-2 border border-gray-100 focus-within:ring-2 focus-within:ring-accent/20 focus-within:border-accent transition-all">
              <Search size={16} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="Find orders, customers..." 
                className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-48 font-medium"
              />
            </div>
            
            <div className="flex items-center gap-3 border-l border-gray-100 pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-primary leading-none">Admin Manager</p>
                <p className="text-[10px] text-accent uppercase font-black tracking-widest mt-1">Authorized</p>
              </div>
              <img 
                src="https://ui-avatars.com/api/?name=Admin+CareNexon&background=d32f2f&color=fff" 
                alt="Admin" 
                className="w-10 h-10 rounded-2xl shadow-lg shadow-black/5"
              />
            </div>
          </div>
        </header>

        <section className="p-8 pb-20">
          <AnimatePresence mode="wait">
            {activeTab === 'Dashboard' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Sales ($)', value: `$${totalRevenue.toLocaleString()}`, icon: BarChart3, color: 'text-green-600', trend: '+15.4%' },
                    { label: 'Active Orders', value: activeOrdersCount, icon: ShoppingCart, color: 'text-[#d32f2f]', trend: '8 Pending' },
                    { label: 'Trending Suit', value: 'Lawn 2024', icon: TrendingUp, color: 'text-[#c5a059]', trend: 'Best Seller' },
                    { label: 'New Customers', value: '1,248', icon: Users, color: 'text-blue-600', trend: '+24 This Week' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-500"></div>
                      <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex items-center justify-between mb-4">
                          <div className={cn("p-3 rounded-2xl bg-gray-50", stat.color.replace('text', 'bg').replace('-600', '/10'))}>
                            <stat.icon size={24} className={stat.color} />
                          </div>
                          <span className="text-[10px] font-black bg-gray-50 px-2 py-1 rounded-lg text-gray-500 uppercase tracking-widest">{stat.trend}</span>
                        </div>
                        <div>
                          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                          <h3 className="text-2xl font-black text-primary">{stat.value}</h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Main Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Sales Graph */}
                  <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-xl font-black text-primary uppercase tracking-tight">Sales Growth</h2>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Weekly Performance Overview</p>
                      </div>
                      <select className="bg-gray-50 border-none rounded-xl text-xs font-bold uppercase py-2 px-4 focus:ring-accent focus:border-accent">
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                      </select>
                    </div>
                    <div className="h-[350px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={GROWTH_DATA}>
                          <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#c5a059" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#c5a059" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fill: '#999', fontWeight: 700 }}
                            dy={10}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fill: '#999', fontWeight: 700 }}
                          />
                          <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)', fontSize: '12px' }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="sales" 
                            stroke="#c5a059" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorSales)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Category Breakdown */}
                  <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
                    <h2 className="text-xl font-black text-primary uppercase tracking-tight mb-2">Inventory Mix</h2>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-8">Stock Distribution</p>
                    
                    <div className="h-[250px] relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={CATEGORY_STATS}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {CATEGORY_STATS.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                          <p className="text-2xl font-black text-primary leading-none">45%</p>
                          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">Lawn</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 space-y-4">
                      {CATEGORY_STATS.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                            <span className="text-xs font-bold text-gray-600 uppercase tracking-tight">{item.name}</span>
                          </div>
                          <span className="text-xs font-black text-primary">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Orders Table */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
                  <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-black text-primary uppercase tracking-tight leading-none mb-1">Recent Suit Orders</h2>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Latest Customer Transactions</p>
                    </div>
                    <button className="flex items-center gap-2 text-accent font-black uppercase text-[10px] tracking-widest hover:underline transition-all">
                      View All Reports <ChevronRight size={14} />
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                          <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer Name</th>
                          <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Suit Type</th>
                          <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</th>
                          <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                          <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {ordersLoading ? (
                           [...Array(5)].map((_, i) => (
                            <tr key={i} className="animate-pulse">
                              <td colSpan={6} className="px-8 py-6 h-16 bg-gray-50/50"></td>
                            </tr>
                           ))
                        ) : (
                          orders.slice(0, 5).map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                              <td className="px-8 py-5 text-sm font-black text-[#111111]">{order.orderId}</td>
                              <td className="px-8 py-5">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center md:flex hidden">
                                    <User size={14} className="text-accent" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-primary leading-none uppercase tracking-tight">{order.customerName}</p>
                                    <p className="text-[10px] text-gray-400 font-bold tracking-tight mt-1 truncate max-w-[120px]">{order.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-5">
                                <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                                  {order.items[0]?.name || 'Luxury Pret'}
                                </span>
                              </td>
                              <td className="px-8 py-5 text-sm font-black text-primary">${order.total.toFixed(2)}</td>
                              <td className="px-8 py-5">
                                <span className={cn(
                                  "text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full inline-flex items-center gap-2",
                                  order.status === 'Delivered' ? "bg-green-50 text-green-600" :
                                  order.status === 'Cancelled' ? "bg-red-50 text-red-600" :
                                  "bg-accent/10 text-accent"
                                )}>
                                  <div className={cn("w-1.5 h-1.5 rounded-full", 
                                    order.status === 'Delivered' ? "bg-green-600" : 
                                    order.status === 'Cancelled' ? "bg-red-600" : "bg-accent"
                                  )}></div>
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-8 py-5">
                                <button className="p-2 hover:bg-white rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transition-all">
                                  <MoreVertical size={16} className="text-gray-400" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'Orders' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="space-y-6"
              >
                {/* Orders Content (Simplified for this turn) */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-accent/5 rounded-full flex items-center justify-center mb-6">
                    <ShoppingCart className="text-accent w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-primary uppercase mb-2">Order Management</h3>
                  <p className="text-gray-500 max-w-sm mx-auto mb-8">View and process all customer orders for CareNexon's boutique collections.</p>
                  <button 
                    onClick={() => setActiveTab('Dashboard')}
                    className="px-8 py-4 bg-[#111111] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-accent transition-all active:scale-95"
                  >
                    Go to Analytics View
                  </button>
                </div>
              </motion.div>
            )}

            {/* Other tabs would follow same pattern */}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}

function MenuIcon({ isSidebarOpen }: { isSidebarOpen: boolean }) {
  return (
    <div className="w-6 h-6 flex flex-col items-center justify-center gap-1">
      <div className={cn("w-full h-0.5 bg-primary transition-all", !isSidebarOpen && "rotate-45 translate-y-1.5")}></div>
      <div className={cn("w-full h-0.5 bg-primary transition-all", !isSidebarOpen && "opacity-0")}></div>
      <div className={cn("w-full h-0.5 bg-primary transition-all", !isSidebarOpen && "-rotate-45 -translate-y-1.5")}></div>
    </div>
  );
}
