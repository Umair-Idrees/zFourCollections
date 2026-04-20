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
  CloudUpload,
  Calendar
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
  Line,
  ComposedChart,
  Legend
} from 'recharts';
import { cn } from '../lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useProducts } from '../context/ProductContext';
import { useOrders } from '../context/OrderContext';
import { auth, loginWithGoogle, logout, storage, ref, uploadBytes, getDownloadURL, useAuth, loginAsDemoAdmin } from '../lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';

import Logo from '../components/Logo';

// --- Mock Data ---
const REVENUE_DATA = [
  { name: 'Jan', revenue: 6000, orders: 4000 },
  { name: 'Feb', revenue: 8000, orders: 4200 },
  { name: 'Mar', revenue: 15000, orders: 4500 },
  { name: 'Apr', revenue: 9000, orders: 5000 },
  { name: 'May', revenue: 11000, orders: 5500 },
  { name: 'Jun', revenue: 26000, orders: 6000 },
  { name: 'Jul', revenue: 20000, orders: 7500 },
  { name: 'Aug', revenue: 16000, orders: 7000 },
  { name: 'Sep', revenue: 19000, orders: 6500 },
  { name: 'Oct', revenue: 24000, orders: 8000 },
  { name: 'Nov', revenue: 22000, orders: 7500 },
  { name: 'Dec', revenue: 28000, orders: 8500 },
];

const SPARKLINE_DATA = [
  { value: 40 }, { value: 30 }, { value: 60 }, { value: 50 }, 
  { value: 80 }, { value: 55 }, { value: 90 }, { value: 70 }
];

const PROMOTIONAL_DATA = [
  { name: 'Social Media', value: 3432, color: '#3b82f6' },
  { name: 'Website', value: 2100, color: '#6366f1' },
  { name: 'Store', value: 1200, color: '#f43f5e' },
];

const TOP_SALES_DATA = [
  { id: 1, name: 'Neptune Longsleeve', price: '$138', sales: 952, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100&h=100&fit=crop' },
  { id: 2, name: 'Ribbed Tank Top', price: '$108', sales: 952, image: 'https://images.unsplash.com/photo-1554412930-c96790ca4a9b?w=100&h=100&fit=crop' },
  { id: 3, name: 'Ribbed Modal Maxi', price: '$125', sales: 902, image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=100&h=100&fit=crop' },
  { id: 4, name: 'Oversized Motion Duo', price: '$98', sales: 882, image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=100&h=100&fit=crop' },
];

const LOCATION_DATA = [
  { name: 'California', value: 40, color: '#f97316' },
  { name: 'Arizona', value: 15, color: '#f97316' },
  { name: 'Texas', value: 10, color: '#f97316' },
  { name: 'Georgia', value: 3.5, color: '#f97316' },
  { name: 'North Carolina', value: 2, color: '#f97316' },
  { name: 'Florida', value: 1.5, color: '#f97316' },
];

const CATEGORY_DATA = [
  { name: 'FABRICS (Unstitched)', value: 45, color: '#e11d48' },
  { name: 'READY-TO-WEAR (Pret)', value: 30, color: '#000000' },
  { name: 'BOUTIQUE', value: 15, color: '#f43f5e' },
  { name: 'WESTERN', value: 10, color: '#4b5563' },
];

const STATS = [
  { label: 'Total Revenue', value: '$65,320', change: '+12.5%', isPositive: true, icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Total Orders', value: '1,250', change: '+8.2%', isPositive: true, icon: ShoppingCart, color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Total Customers', value: '1,540', change: '+5.4%', isPositive: true, icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Total Products', value: '450', change: '+12', isPositive: true, icon: Package, color: 'text-orange-600', bg: 'bg-orange-50' },
];

const SECONDARY_STATS = [
  { label: 'Pending Orders', value: '32', status: 'Pending', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { label: 'Delivered Orders', value: '1,150', status: 'Delivered', color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Cancelled Orders', value: '15', status: 'Cancelled', color: 'text-red-600', bg: 'bg-red-50' },
  { label: 'Low Stock', value: '12', status: 'Alert', color: 'text-orange-600', bg: 'bg-orange-50' },
];

const ORDERS = [
  { id: '#10234', customer: 'Sarah Johnson', date: 'May 16, 2024', status: 'Shipped', total: '$299.99', payment: 'Visa', delivery: 'Express' },
  { id: '#10229', customer: 'Michael Chen', date: 'May 12, 2024', status: 'Delivered', total: '$189.00', payment: 'Mastercard', delivery: 'Standard' },
  { id: '#10215', customer: 'Emma Wilson', date: 'May 05, 2024', status: 'Pending', total: '$1,299.99', payment: 'PayPal', delivery: 'Express' },
  { id: '#10208', customer: 'David Miller', date: 'Apr 28, 2024', status: 'Cancelled', total: '$45.00', payment: 'COD', delivery: 'Standard' },
];

const CUSTOMERS = [
  { id: 'c1', name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+1 234 567 890', orders: 12, spend: '$2,450', status: 'Active', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&fit=crop' },
  { id: 'c2', name: 'Michael Chen', email: 'mchen@example.com', phone: '+1 234 567 891', orders: 8, spend: '$1,890', status: 'Active', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&fit=crop' },
  { id: 'c3', name: 'Emma Wilson', email: 'emma@example.com', phone: '+1 234 567 892', orders: 5, spend: '$3,200', status: 'Inactive', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&fit=crop' },
];

const MOCK_CATEGORIES = [
  { id: 'cat1', name: 'FABRICS (Unstitched)', products: 145, slug: 'fabrics', status: 'Active', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=200' },
  { id: 'cat2', name: 'READY-TO-WEAR (Pret)', products: 92, slug: 'ready-to-wear', status: 'Active', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=200' },
  { id: 'cat3', name: 'BOUTIQUE', products: 48, slug: 'boutique', status: 'Active', image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=200' },
  { id: 'cat4', name: 'WESTERN', products: 36, slug: 'western', status: 'Active', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=200' },
  { id: 'cat5', name: 'BOTTOMS & DUPATTAS', products: 64, slug: 'bottoms', status: 'Active', image: 'https://picsum.photos/seed/bottoms/200/200' },
];

const MOCK_DISCOUNTS = [
  { id: 'd1', code: 'WELCOME20', type: 'Percentage', value: '20%', usage: '84/100', expiry: 'Dec 31, 2024', status: 'Active' },
  { id: 'd2', code: 'SUMMER50', type: 'Fixed', value: '$50', usage: '120/500', expiry: 'Aug 15, 2024', status: 'Active' },
  { id: 'd3', code: 'EIDGIFT', type: 'Percentage', value: '15%', usage: '200/200', expiry: 'May 10, 2024', status: 'Expired' },
];

const MOCK_REVIEWS = [
  { id: 'r1', customer: 'Ayesha Khan', product: 'Luxury Velvet Suit', rating: 5, comment: 'Amazing quality! The embroidery is very detailed.', date: '2 days ago' },
  { id: 'r2', customer: 'Zainab Ahmed', product: 'Printed Silk Maxi', rating: 4, comment: 'Fabric is great, but delivery took a bit long.', date: '1 week ago' },
  { id: 'r3', customer: 'Fatima Ali', product: 'Lawn Collection Set', rating: 5, comment: 'Perfect for summers. Highly recommend!', date: '3 days ago' },
];

const MOCK_TRANSACTIONS = [
  { id: 'tx1', order: '#10234', method: 'Visa ending in 4242', amount: '$299.99', date: 'May 16, 2024', status: 'Success' },
  { id: 'tx2', order: '#10229', method: 'Mastercard ending in 8888', amount: '$189.00', date: 'May 12, 2024', status: 'Success' },
  { id: 'tx3', order: '#10215', method: 'PayPal', amount: '$1,299.99', date: 'May 05, 2024', status: 'Pending' },
];

export default function AdminDashboard({ 
  initialTab = 'Dashboard'
}: { 
  initialTab?: string;
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const navigate = useNavigate();
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All Categories');
  const [productStatusFilter, setProductStatusFilter] = useState('All Status');
  const [productSortFilter, setProductSortFilter] = useState('Sort by (Default)');
  const [productEntriesPerPage, setProductEntriesPerPage] = useState(10);
  
  const { user, loading: authLoading, isAdmin } = useAuth();

  const { products, addProduct, deleteProduct } = useProducts();
  const { orders, updateOrderStatus, deleteOrder: deleteOrderFromDb } = useOrders();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;
  const deliveredOrdersCount = orders.filter(o => o.status === 'Delivered').length;
  const cancelledOrdersCount = orders.filter(o => o.status === 'Cancelled').length;
  const totalOrdersCount = orders.length;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="text-accent w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">Admin Access Required</h1>
          <p className="text-gray-500 mb-8">Please login with your admin account to manage the store.</p>
          {!user ? (
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
                onClick={() => loginAsDemoAdmin()}
                className="w-full py-4 bg-accent/10 text-accent rounded-2xl font-bold hover:bg-accent hover:text-white transition-all flex items-center justify-center gap-3"
              >
                <LayoutDashboard size={20} /> Bypass & Enter as Admin
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sale font-bold text-sm">Access Denied: {user.email}</p>
              <button 
                onClick={() => logout()}
                className="w-full py-4 bg-gray-100 text-primary rounded-2xl font-bold hover:bg-gray-200 transition-all"
              >
                Logout & Switch Account
              </button>
            </div>
          )}
          <Link to="/" className="block mt-6 text-sm font-bold text-gray-400 hover:text-primary transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <div className="space-y-8 pb-10">
            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Earnings', value: '$334,945', change: '1.56%', isPositive: true, color: '#22c55e', bg: 'bg-green-500', icon: CreditCard },
                { label: 'Total Orders', value: '2,802', change: '1.56%', isPositive: false, color: '#f97316', bg: 'bg-orange-500', icon: ShoppingCart },
                { label: 'Customers', value: '4,945', change: '1.56%', isPositive: true, color: '#8b5cf6', bg: 'bg-purple-500', icon: Users },
                { label: 'My Balance', value: '$4,945', change: '1.56%', isPositive: true, color: '#3b82f6', bg: 'bg-blue-500', icon: BarChart3 }
              ].map((stat, idx) => (
                <div key={stat.label} className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-xl text-white shadow-sm", stat.bg)}>
                        <stat.icon size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">{stat.label}</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-black text-primary leading-none">{stat.value}</span>
                          <span className={cn("text-[10px] font-bold flex items-center gap-0.5", stat.isPositive ? "text-green-500" : "text-sale")}>
                            {stat.isPositive ? <TrendingUp size={10} /> : <TrendingUp size={10} className="rotate-180" />}
                            {stat.change}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="h-20 w-full mt-auto -mx-6 -mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={SPARKLINE_DATA.map(d => ({ ...d, value: d.value + (idx * 5) }))}>
                        <defs>
                          <linearGradient id={`color-${idx}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={stat.color} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={stat.color} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="value" stroke={stat.color} strokeWidth={2} fillOpacity={1} fill={`url(#color-${idx})`} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ))}
            </div>

            {/* Middle Charts & Top Sales */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start">
              {/* Revenue (Main Chart) */}
              <div className="xl:col-span-2 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col h-full min-h-[500px]">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-black text-primary">Revenue</h3>
                    <div className="flex gap-6 mt-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                        <span className="text-xs font-bold text-gray-400 uppercase">Revenue</span>
                        <span className="text-sm font-black text-primary">$37,802</span>
                        <span className="text-[10px] font-bold text-green-500 flex items-center gap-0.5"><TrendingUp size={10} /> 0.56%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                        <span className="text-xs font-bold text-gray-400 uppercase">Order</span>
                        <span className="text-sm font-black text-primary">$28,305</span>
                        <span className="text-[10px] font-bold text-green-500 flex items-center gap-0.5"><TrendingUp size={10} /> 0.56%</span>
                      </div>
                    </div>
                  </div>
                  <select className="bg-gray-50 border-none rounded-xl px-4 py-2 text-[11px] font-bold text-gray-500 focus:ring-0">
                    <option>Yearly</option>
                    <option>Weekly</option>
                  </select>
                </div>
                <div className="flex-1 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={REVENUE_DATA}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} />
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                      <Bar dataKey="revenue" fill="#f97316" radius={[4, 4, 0, 0]} barSize={20} />
                      <Line type="monotone" dataKey="orders" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Promotional Sales (Doughnut) */}
              <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col h-full min-h-[500px]">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-black text-primary">Promotional Sales</h3>
                  <select className="bg-gray-50 border-none rounded-xl px-4 py-2 text-[11px] font-bold text-gray-500 focus:ring-0">
                    <option>Weekly</option>
                  </select>
                </div>
                <div className="text-center">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Visitors</span>
                  <p className="text-2xl font-black text-primary flex items-center justify-center gap-2">
                    7,802
                    <span className="text-[10px] font-bold text-green-500 flex items-center gap-0.5"><TrendingUp size={10} /> 0.56%</span>
                  </p>
                </div>
                <div className="flex-1 relative mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={PROMOTIONAL_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={105}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {PROMOTIONAL_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-4">
                    <div className="w-2 h-2 rounded-full border-2 border-orange-500" />
                    <span className="text-[10px] font-black text-primary uppercase mt-1">Social Media</span>
                    <span className="text-lg font-black text-primary leading-none">3,432</span>
                    <span className="text-[9px] font-bold text-green-500 flex items-center gap-0.5 mt-0.5"><ArrowUpRight size={8} /> 5.6%</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-8">
                  {PROMOTIONAL_DATA.map((cat) => (
                    <div key={cat.name} className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="text-[9px] font-bold text-gray-400 uppercase truncate max-w-[50px]">{cat.name.split(' ')[0]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Sale */}
              <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col h-full min-h-[500px]">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-black text-primary">Top sale</h3>
                  <select className="bg-gray-50 border-none rounded-xl px-4 py-2 text-[11px] font-bold text-gray-500 focus:ring-0">
                    <option>Weekly</option>
                  </select>
                </div>
                <div className="space-y-6 flex-1">
                  {TOP_SALES_DATA.map((item) => (
                    <div key={item.id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                        <div>
                          <p className="text-sm font-black text-primary truncate max-w-[120px]">{item.name}</p>
                          <p className="text-[11px] font-bold text-gray-400">{item.price}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-primary">{item.sales}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Sales</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Grid: Recent Orders & Map */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-10">
              {/* Recent Orders Table */}
              <div className="xl:col-span-2 bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                <div className="p-8 pb-4">
                  <h3 className="text-lg font-black text-primary uppercase tracking-tight">Recent orders</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-50">
                        <th className="py-4 px-8 text-[11px] font-bold text-gray-400 uppercase">Product</th>
                        <th className="py-4 px-8 text-[11px] font-bold text-gray-400 uppercase">Customer</th>
                        <th className="py-4 px-8 text-[11px] font-bold text-gray-400 uppercase">Product ID</th>
                        <th className="py-4 px-8 text-[11px] font-bold text-gray-400 uppercase">Quantity</th>
                        <th className="py-4 px-8 text-[11px] font-bold text-gray-400 uppercase text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {[
                        { name: 'Neptune Longsleeve', customer: 'Leslie Alexander', id: '1452', qty: 'X1', price: '$120', image: TOP_SALES_DATA[0].image },
                        { name: 'Corduroy slim-fit', customer: 'Leslie Alexander', id: '1452', qty: 'X1', price: '$120', image: TOP_SALES_DATA[1].image },
                        { name: 'Turtleneck knitted', customer: 'Leslie Alexander', id: '1452', qty: 'X1', price: '$120', image: TOP_SALES_DATA[2].image },
                        { name: 'Wool oversized', customer: 'Leslie Alexander', id: '1452', qty: 'X1', price: '$120', image: TOP_SALES_DATA[3].image },
                        { name: 'Oversized poplin', customer: 'Leslie Alexander', id: '1452', qty: 'X1', price: '$120', image: TOP_SALES_DATA[1].image },
                      ].map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="py-4 px-8">
                            <div className="flex items-center gap-4">
                              <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                              <span className="text-sm font-bold text-primary">{item.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-8 text-sm font-medium text-gray-500">{item.customer}</td>
                          <td className="py-4 px-8 text-sm font-medium text-gray-500">{item.id}</td>
                          <td className="py-4 px-8 text-sm font-medium text-gray-500">{item.qty}</td>
                          <td className="py-4 px-8 text-sm font-black text-primary text-right">{item.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-auto p-6 flex flex-col sm:flex-row items-center justify-between border-t border-gray-50">
                  <span className="text-[11px] font-bold text-gray-400">Showing 1-5 of 15</span>
                  <div className="flex gap-2 mt-4 sm:mt-0">
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors"><ChevronRight className="rotate-180" size={14} /></button>
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold text-gray-400 hover:bg-gray-50 transition-colors">1</button>
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold bg-orange-500 text-white shadow-lg shadow-orange-500/20">2</button>
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold text-gray-400 hover:bg-gray-50 transition-colors">3</button>
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors"><ChevronRight size={14} /></button>
                  </div>
                </div>
              </div>

              {/* User Location */}
              <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col min-h-[500px]">
                <h3 className="text-lg font-black text-primary">User Location</h3>
                <div className="flex-1 my-8 flex items-center justify-center relative overflow-hidden bg-gray-50 rounded-3xl p-4">
                  {/* Simplified USA Map SVG Representation */}
                  <svg viewBox="0 0 500 300" className="w-full h-auto text-gray-300">
                    <path fill="currentColor" d="M100,50 L400,50 L420,150 L380,250 L80,250 L60,150 Z" opacity="0.1" />
                    <circle cx="150" cy="180" r="40" fill="#f97316" opacity="0.7" />
                    <circle cx="350" cy="200" r="30" fill="#f97316" opacity="0.6" />
                    <circle cx="300" cy="120" r="25" fill="#f97316" opacity="0.5" />
                    <circle cx="200" cy="100" r="20" fill="#f97316" opacity="0.4" />
                    <circle cx="420" cy="160" r="15" fill="#f97316" opacity="0.3" />
                  </svg>
                  <div className="absolute inset-0 bg-transparent pointer-events-none border border-gray-100 rounded-3xl" />
                </div>
                <div className="grid grid-cols-3 gap-y-4 gap-x-6">
                  {LOCATION_DATA.map((loc) => (
                    <div key={loc.name} className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5 line-clamp-1">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: loc.color }} />
                        <span className="text-[10px] font-bold text-gray-400 uppercase truncate leading-none">{loc.name}</span>
                      </div>
                      <span className="text-xs font-black text-primary pl-3.5 leading-none">{loc.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center py-10">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                Copyright © 2026 <span className="text-accent">Z-Four Collections</span> Design By Themesflat All rights reserved.
              </p>
            </div>
          </div>
        );

      case 'Products':
        const filteredProducts = products.filter(p => {
          const matchesSearch = p.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
                              p.category.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
                              p.sku?.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
                              p.id.toLowerCase().includes(productSearchQuery.toLowerCase());
          
          const matchesCategory = productCategoryFilter === 'All Categories' || p.category === productCategoryFilter;
          
          const matchesStatus = productStatusFilter === 'All Status' || 
                               (productStatusFilter === 'In Stock' && p.quantity > 0) ||
                               (productStatusFilter === 'Out of Stock' && p.quantity === 0);
                               
          return matchesSearch && matchesCategory && matchesStatus;
        }).sort((a, b) => {
          if (productSortFilter === 'Price: Low to High') return a.salePrice - b.salePrice;
          if (productSortFilter === 'Price: High to Low') return b.salePrice - a.salePrice;
          return 0;
        });

        const paginatedProducts = filteredProducts.slice(0, productEntriesPerPage);

        return (
          <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-3xl font-black text-primary">All Products</h1>
              <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-tight">
                <span>Dashboard</span>
                <ChevronRight size={12} />
                <span>Product</span>
                <ChevronRight size={12} />
                <span className="text-gray-900">All Products</span>
              </div>
            </div>

            {/* Tip Banner */}
            <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex items-start gap-3">
              <div className="bg-white p-2 rounded-xl text-orange-500 shadow-sm flex-shrink-0">
                <AlertCircle size={18} />
              </div>
              <p className="text-sm font-medium text-orange-800 leading-relaxed mt-1">
                <span className="font-bold underline">Tip search by Product ID:</span> Each product is provided with a unique ID, which you can rely on to find the exact product you need.
              </p>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
              {/* Filter Bar */}
              <div className="p-8 pb-4 flex flex-col xl:flex-row gap-6 items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                  <span>Showing</span>
                  <select 
                    value={productEntriesPerPage}
                    onChange={(e) => setProductEntriesPerPage(Number(e.target.value))}
                    className="bg-gray-50 border-none rounded-lg px-3 py-1.5 focus:ring-0 cursor-pointer"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                  <span>entries</span>
                </div>

                <div className="flex flex-1 max-w-xl relative">
                  <input 
                    type="text" 
                    placeholder="Search here..." 
                    value={productSearchQuery}
                    onChange={(e) => setProductSearchQuery(e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-[1.25rem] py-4 pl-6 pr-14 text-sm font-medium focus:ring-2 focus:ring-orange-500/20" 
                  />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors">
                    <Search size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full xl:w-auto">
                  <select 
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="bg-gray-50 border-none rounded-xl px-4 py-3.5 text-[11px] font-black text-primary uppercase tracking-tight focus:ring-0 cursor-pointer"
                  >
                    <option>All Categories</option>
                    {Array.from(new Set(products.map(p => p.category))).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <select 
                    value={productStatusFilter}
                    onChange={(e) => setProductStatusFilter(e.target.value)}
                    className="bg-gray-50 border-none rounded-xl px-4 py-3.5 text-[11px] font-black text-primary uppercase tracking-tight focus:ring-0 cursor-pointer"
                  >
                    <option>All Status</option>
                    <option>In Stock</option>
                    <option>Out of Stock</option>
                  </select>
                  <select 
                    value={productSortFilter}
                    onChange={(e) => setProductSortFilter(e.target.value)}
                    className="bg-gray-50 border-none rounded-xl px-4 py-3.5 text-[11px] font-black text-primary uppercase tracking-tight focus:ring-0 cursor-pointer"
                  >
                    <option>Sort by (Default)</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                  </select>
                  <button 
                    onClick={() => navigate('/admin/add-product')}
                    className="flex items-center justify-center gap-2 bg-orange-500 text-white px-6 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-wider hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
                  >
                    <Plus size={16} /> Add new
                  </button>
                </div>
              </div>

              {/* Products Table */}
              <div className="overflow-x-auto mt-4 px-4 pb-4">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-50">
                      <th className="py-5 px-6 text-[11px] font-black text-gray-400 uppercase tracking-tight">Product</th>
                      <th className="py-5 px-6 text-[11px] font-black text-gray-400 uppercase tracking-tight">Product ID</th>
                      <th className="py-5 px-6 text-[11px] font-black text-gray-400 uppercase tracking-tight">Price</th>
                      <th className="py-5 px-6 text-[11px] font-black text-gray-400 uppercase tracking-tight">Quantity</th>
                      <th className="py-5 px-6 text-[11px] font-black text-gray-400 uppercase tracking-tight">Sale</th>
                      <th className="py-5 px-6 text-[11px] font-black text-gray-400 uppercase tracking-tight">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginatedProducts.length > 0 ? (
                      paginatedProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="py-6 px-6">
                            <div className="flex items-center gap-5">
                              <img src={product.mainImage} alt="" className="w-14 h-14 rounded-2xl object-cover border border-gray-100 shadow-sm" referrerPolicy="no-referrer" />
                              <div className="flex flex-col">
                                <span className="text-sm font-black text-primary leading-tight group-hover:text-orange-600 transition-colors">{product.name}</span>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{product.category}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-6 px-6 text-sm font-bold text-gray-500">#{product.id.substring(0, 8).toUpperCase()}</td>
                          <td className="py-6 px-6 text-sm font-black text-primary">${product.salePrice.toLocaleString()}</td>
                          <td className="py-6 px-6 text-sm font-bold text-gray-500">{product.quantity.toLocaleString()}</td>
                          <td className="py-6 px-6 text-sm font-bold text-gray-500">20</td>
                          <td className="py-6 px-6">
                            <span className={cn(
                              "text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest leading-none",
                              product.quantity > 0 
                                ? "bg-green-50 text-green-500 border border-green-100" 
                                : "bg-orange-50 text-orange-500 border border-orange-100"
                            )}>
                              {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-24 text-center">
                          <div className="flex flex-col items-center gap-4">
                            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300">
                              <Search size={32} />
                            </div>
                            <div>
                              <p className="text-lg font-black text-primary">No products found</p>
                              <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search term</p>
                            </div>
                            <button 
                              onClick={() => {
                                setProductSearchQuery('');
                                setProductCategoryFilter('All Categories');
                                setProductStatusFilter('All Status');
                              }}
                              className="mt-4 px-8 py-3 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                            >
                              Reset all filters
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer / Pagination */}
              <div className="p-8 pt-4 flex flex-col sm:flex-row items-center justify-between border-t border-gray-50">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Showing {paginatedProducts.length} of {filteredProducts.length} entries</span>
                <div className="flex gap-2 mt-4 sm:mt-0">
                  <button className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors border border-gray-50 shadow-sm" disabled><ChevronRight className="rotate-180" size={16} /></button>
                  <button className="w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-black bg-orange-500 text-white shadow-lg shadow-orange-500/20">1</button>
                  <button className="w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-black text-gray-400 hover:bg-gray-50 transition-colors border border-gray-50 shadow-sm">2</button>
                  <button className="w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-black text-gray-400 hover:bg-gray-50 transition-colors border border-gray-50 shadow-sm">3</button>
                  <button className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors border border-gray-50 shadow-sm"><ChevronRight size={16} /></button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'Orders':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-primary">Order Management</h1>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-gray-100 font-bold text-gray-500 hover:bg-gray-50">
                  <Download size={18} /> Export CSV
                </button>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="text-left py-4 px-8 text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID</th>
                      <th className="text-left py-4 px-8 text-xs font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                      <th className="text-left py-4 px-8 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                      <th className="text-left py-4 px-8 text-xs font-bold text-gray-400 uppercase tracking-widest">Payment</th>
                      <th className="text-left py-4 px-8 text-xs font-bold text-gray-400 uppercase tracking-widest">Total</th>
                      <th className="text-left py-4 px-8 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                      <th className="text-right py-4 px-8 text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="py-5 px-8 text-sm font-bold text-primary">{order.orderId}</td>
                        <td className="py-5 px-8 text-sm text-gray-600 font-medium">{order.customerName}</td>
                        <td className="py-5 px-8 text-sm text-gray-400">
                          {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Recent'}
                        </td>
                        <td className="py-5 px-8 text-sm text-gray-600">{order.paymentMethod}</td>
                        <td className="py-5 px-8 text-sm font-bold text-primary">${order.total.toFixed(2)}</td>
                        <td className="py-5 px-8">
                          <select 
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                            className={cn(
                              "text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border-none focus:ring-0 cursor-pointer",
                              order.status === 'Pending' ? "bg-yellow-50 text-yellow-600" :
                              order.status === 'Processing' ? "bg-orange-50 text-orange-600" :
                              order.status === 'Shipped' ? "bg-blue-50 text-blue-600" : 
                              order.status === 'Delivered' ? "bg-green-50 text-green-600" :
                              "bg-red-50 text-red-600"
                            )}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-5 px-8 text-right">
                          <div className="flex justify-end gap-2">
                            <button className="p-2 text-gray-400 hover:text-accent transition-colors"><Eye size={18} /></button>
                            <button 
                              onClick={() => deleteOrderFromDb(order.id)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-20 text-center text-gray-400">No orders found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'Customers':
        return (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-primary">Customer Management</h1>
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="text-left py-4 px-8 text-xs font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                      <th className="text-left py-4 px-8 text-xs font-bold text-gray-400 uppercase tracking-widest">Contact</th>
                      <th className="text-left py-4 px-8 text-xs font-bold text-gray-400 uppercase tracking-widest">Orders</th>
                      <th className="text-left py-4 px-8 text-xs font-bold text-gray-400 uppercase tracking-widest">Total Spend</th>
                      <th className="text-left py-4 px-8 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                      <th className="text-right py-4 px-8 text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {CUSTOMERS.map((customer) => (
                      <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="py-5 px-8">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 shadow-sm">
                              <img src={customer.avatar} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <span className="text-sm font-bold text-primary">{customer.name}</span>
                          </div>
                        </td>
                        <td className="py-5 px-8">
                          <p className="text-sm text-gray-600">{customer.email}</p>
                          <p className="text-xs text-gray-400">{customer.phone}</p>
                        </td>
                        <td className="py-5 px-8 text-sm font-bold text-primary">{customer.orders}</td>
                        <td className="py-5 px-8 text-sm font-bold text-primary">{customer.spend}</td>
                        <td className="py-5 px-8">
                          <span className={cn(
                            "text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider",
                            customer.status === 'Active' ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"
                          )}>
                            {customer.status}
                          </span>
                        </td>
                        <td className="py-5 px-8 text-right">
                          <button className="p-2 text-gray-400 hover:text-accent transition-colors"><MoreVertical size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'Settings':
        return (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-primary">System Settings</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* General Settings */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                  <h3 className="text-xl font-bold text-primary mb-8 flex items-center gap-2">
                    <Globe size={20} className="text-accent" /> General Settings
                  </h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Store Name</label>
                        <input type="text" defaultValue="zFour" className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-accent/20" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Support Email</label>
                        <input type="email" defaultValue="support@zfour.com" className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-accent/20" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Store Logo</label>
                      <div className="flex items-center gap-4 p-4 border-2 border-dashed border-gray-100 rounded-2xl">
                        <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                          <ImageIcon size={24} />
                        </div>
                        <button className="text-sm font-bold text-accent">Upload New Logo</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                  <h3 className="text-xl font-bold text-primary mb-8 flex items-center gap-2">
                    <CreditCard size={20} className="text-accent" /> Payment Gateways
                  </h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Stripe', status: 'Active', icon: ShieldCheck },
                      { name: 'PayPal', status: 'Active', icon: ShieldCheck },
                      { name: 'Razorpay', status: 'Inactive', icon: AlertCircle },
                    ].map((gateway) => (
                      <div key={gateway.name} className="flex items-center justify-between p-4 border border-gray-50 rounded-2xl hover:border-accent/20 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                            <gateway.icon size={20} className={gateway.status === 'Active' ? 'text-green-500' : 'text-gray-400'} />
                          </div>
                          <span className="font-bold text-primary">{gateway.name}</span>
                        </div>
                        <button className={cn(
                          "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                          gateway.status === 'Active' ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"
                        )}>
                          {gateway.status === 'Active' ? 'Configure' : 'Enable'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar Settings */}
              <div className="space-y-8">
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                  <h3 className="text-xl font-bold text-primary mb-8 flex items-center gap-2">
                    <Truck size={20} className="text-accent" /> Shipping & Tax
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Free Shipping</span>
                      <div className="w-12 h-6 bg-accent rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Tax Percentage (%)</label>
                      <input type="number" defaultValue="18" className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-accent/20" />
                    </div>
                  </div>
                </div>

                <div className="bg-primary p-8 rounded-[2rem] text-white shadow-xl shadow-primary/20">
                  <h3 className="text-lg font-bold mb-4">Need Help?</h3>
                  <p className="text-sm text-gray-300 mb-6 leading-relaxed">Check our documentation for advanced system configurations and API integrations.</p>
                  <button className="w-full py-3 bg-white text-primary rounded-xl font-bold text-sm hover:bg-gray-100 transition-all">
                    View Documentation
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'Categories':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-primary">Category Management</h1>
              <button 
                onClick={() => alert('Add Category functionality would open a modal here.')}
                className="flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-2xl font-bold hover:bg-accent/90 transition-all shadow-lg shadow-accent/20"
              >
                <Plus size={18} /> Add Category
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_CATEGORIES.map((cat) => (
                <div key={cat.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                  <div className="aspect-video rounded-2xl overflow-hidden mb-6 bg-gray-50 relative">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-3 right-3">
                      <span className={cn(
                        "text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest",
                        cat.status === 'Active' ? "bg-green-500 text-white" : "bg-gray-400 text-white"
                      )}>
                        {cat.status}
                      </span>
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-primary mb-1">{cat.name}</h4>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-4">{cat.products} Products</p>
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
                    <button 
                      onClick={() => alert(`Editing ${cat.name}`)}
                      className="flex-1 py-2 rounded-xl bg-gray-50 text-primary text-xs font-bold hover:bg-gray-100 transition-all"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => alert(`Deleting ${cat.name}`)}
                      className="flex-1 py-2 rounded-xl bg-red-50 text-red-500 text-xs font-bold hover:bg-red-100 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Inventory':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-primary">Inventory Tracking</h1>
              <div className="flex gap-3">
                <button 
                  onClick={() => alert('Exporting Inventory List...')}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-gray-100 font-bold text-gray-500 hover:bg-gray-50"
                >
                  <Download size={18} /> Export List
                </button>
                <button 
                  onClick={() => alert('Restock Request Initiated')}
                  className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold hover:bg-gray-800 shadow-lg"
                >
                  Restock Inventory
                </button>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                <div className="grid grid-cols-4 gap-6">
                  <div className="bg-white p-4 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Total Items</p>
                    <p className="text-xl font-black text-primary">4,520</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Out of Stock</p>
                    <p className="text-xl font-black text-sale">0</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Low Stock Alert</p>
                    <p className="text-xl font-black text-orange-500">12</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Total Valuation</p>
                    <p className="text-xl font-black text-green-500">$85,420</p>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="text-left py-4 px-8 text-xs font-bold text-gray-400 uppercase">Product Name</th>
                      <th className="text-left py-4 px-8 text-xs font-bold text-gray-400 uppercase">SKU</th>
                      <th className="text-left py-4 px-8 text-xs font-bold text-gray-400 uppercase">Price</th>
                      <th className="text-left py-4 px-8 text-xs font-bold text-gray-400 uppercase">In Stock</th>
                      <th className="text-left py-4 px-8 text-xs font-bold text-gray-400 uppercase">Status</th>
                      <th className="text-right py-4 px-8 text-xs font-bold text-gray-400 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-8 flex items-center gap-3">
                          <img src={product.mainImage} className="w-10 h-10 rounded-lg object-cover" alt="" />
                          <span className="text-sm font-bold text-primary">{product.name}</span>
                        </td>
                        <td className="py-4 px-8 text-xs text-gray-400 font-mono">{product.sku}</td>
                        <td className="py-4 px-8 text-sm font-bold text-primary">${product.salePrice}</td>
                        <td className="py-4 px-8 text-sm text-gray-600 font-medium">{product.quantity} Units</td>
                        <td className="py-4 px-8">
                          <span className={cn(
                            "text-[10px] font-bold px-3 py-1 rounded-full uppercase",
                            product.quantity < 5 ? "bg-orange-50 text-orange-600" : "bg-green-50 text-green-600"
                          )}>
                            {product.quantity < 5 ? 'Low Stock' : 'Good Stock'}
                          </span>
                        </td>
                        <td className="py-4 px-8 text-right">
                          <button className="text-accent text-xs font-bold hover:underline">Edit Stock</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'Discounts':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-primary">Discount Coupons</h1>
              <button 
                onClick={() => alert('Open Discount Creator')}
                className="flex items-center gap-2 bg-sale text-white px-6 py-3 rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-sale/20"
              >
                <Tag size={18} /> Create Coupon
              </button>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="text-left py-4 px-8 text-xs font-bold text-gray-400 uppercase">Coupon Code</th>
                      <th className="text-left py-4 px-8 text-xs font-bold text-gray-400 uppercase">Type</th>
                      <th className="text-left py-4 px-8 text-xs font-bold text-gray-400 uppercase">Value</th>
                      <th className="text-left py-4 px-8 text-xs font-bold text-gray-400 uppercase">Usage</th>
                      <th className="text-left py-4 px-8 text-xs font-bold text-gray-400 uppercase">Expiry</th>
                      <th className="text-left py-4 px-8 text-xs font-bold text-gray-400 uppercase">Status</th>
                      <th className="text-right py-4 px-8 text-xs font-bold text-gray-400 uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {MOCK_DISCOUNTS.map((d) => (
                      <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-5 px-8">
                          <span className="bg-gray-100 text-primary font-mono font-bold px-3 py-1 rounded-lg border border-gray-200">{d.code}</span>
                        </td>
                        <td className="py-5 px-8 text-sm text-gray-600">{d.type}</td>
                        <td className="py-5 px-8 text-sm font-bold text-sale">{d.value} OFF</td>
                        <td className="py-5 px-8 text-sm text-gray-400">{d.usage}</td>
                        <td className="py-5 px-8 text-sm text-gray-500 font-medium">{d.expiry}</td>
                        <td className="py-5 px-8">
                          <span className={cn(
                            "text-[10px] font-bold px-3 py-1 rounded-full uppercase",
                            d.status === 'Active' ? "bg-green-50 text-green-600" : "bg-red-50 text-sale"
                          )}>
                            {d.status}
                          </span>
                        </td>
                        <td className="py-5 px-8 text-right">
                          <button className="p-2 text-gray-400 hover:text-accent"><Edit2 size={16} /></button>
                          <button className="p-2 text-gray-400 hover:text-sale"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'Reviews':
        return (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-primary">Customer Reviews</h1>
            <div className="grid grid-cols-1 gap-6">
              {MOCK_REVIEWS.map((review) => (
                <div key={review.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-lg transition-all">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center font-bold text-accent text-xl flex-shrink-0">
                      {review.customer.charAt(0)}
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                        <div>
                          <h4 className="font-bold text-primary text-lg">{review.customer}</h4>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Reviewed: <span className="text-accent">{review.product}</span></p>
                        </div>
                        <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-xl">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} className={cn(i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200")} />
                          ))}
                          <span className="ml-2 text-sm font-bold text-yellow-600">{review.rating}.0</span>
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed mb-6 italic">"{review.comment}"</p>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <span className="text-xs font-medium text-gray-400">{review.date}</span>
                        <div className="flex gap-2">
                          <button className="text-xs font-bold text-accent hover:underline px-4 py-2 bg-accent/5 rounded-xl">Reply</button>
                          <button className="text-xs font-bold text-sale hover:underline px-4 py-2 bg-red-50 rounded-xl">Hide</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Payments':
        return (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-primary">Transactions & Payments</h1>
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-50 rounded-2xl">
                    <ShieldCheck size={24} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary">Verified Transactions</h3>
                    <p className="text-xs text-gray-400 font-medium">All financial events are encrypted and safe.</p>
                  </div>
                </div>
                <button className="text-sm font-bold text-accent px-6 py-2.5 bg-accent/5 rounded-xl border border-accent/10">View Audit Log</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="text-left py-4 px-8 text-xs font-bold text-gray-400 uppercase">Transaction ID</th>
                      <th className="text-left py-4 px-8 text-xs font-bold text-gray-400 uppercase">Order</th>
                      <th className="text-left py-4 px-8 text-xs font-bold text-gray-400 uppercase">Method</th>
                      <th className="text-left py-4 px-8 text-xs font-bold text-gray-400 uppercase">Amount</th>
                      <th className="text-left py-4 px-8 text-xs font-bold text-gray-400 uppercase">Date</th>
                      <th className="text-left py-4 px-8 text-xs font-bold text-gray-400 uppercase text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {MOCK_TRANSACTIONS.map((tx) => (
                      <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-5 px-8 text-sm font-bold text-primary">{tx.id}</td>
                        <td className="py-5 px-8 text-sm text-accent font-bold hover:underline cursor-pointer">{tx.order}</td>
                        <td className="py-5 px-8 text-sm text-gray-600">{tx.method}</td>
                        <td className="py-5 px-8 text-sm font-bold text-primary">{tx.amount}</td>
                        <td className="py-5 px-8 text-sm text-gray-400">{tx.date}</td>
                        <td className="py-5 px-8 text-right">
                          <span className={cn(
                            "text-[10px] font-bold px-3 py-1 rounded-full uppercase",
                            tx.status === 'Success' ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"
                          )}>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'Reports':
        return (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-primary">Advanced Reports</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold text-primary mb-8">Revenue Breakdown</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={REVENUE_DATA}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                      <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                      <Bar dataKey="revenue" fill="#e11d48" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold text-primary mb-8">Order Volume Trend</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={REVENUE_DATA}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                      <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                      <Line type="monotone" dataKey="orders" stroke="#000000" strokeWidth={4} dot={{r: 6, fill: '#000000', strokeWidth: 2, stroke: '#fff'}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold text-primary mb-8">Category Distribution</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={CATEGORY_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {CATEGORY_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {CATEGORY_DATA.map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between text-xs font-bold">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></div>
                        <span className="text-gray-500 uppercase tracking-tighter">{cat.name}</span>
                      </div>
                      <span className="text-primary">{cat.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Avg. Order Value', value: '$184.20', trend: '+5.2%', icon: TrendingUp },
                { label: 'Conversion Rate', value: '4.8%', trend: '+1.2%', icon: BarChart3 },
                { label: 'Customer Retention', value: '62%', trend: '-0.5%', icon: Users },
              ].map((stat) => (
                <div key={stat.label} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gray-50 rounded-2xl">
                      <stat.icon size={20} className="text-primary" />
                    </div>
                    <span className={cn("text-xs font-bold", stat.trend.includes('+') ? "text-green-500" : "text-sale")}>
                      {stat.trend}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                  <h4 className="text-2xl font-black text-primary mt-1">{stat.value}</h4>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-[3rem] border border-gray-100 shadow-sm p-12">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Settings size={48} className="text-gray-300 animate-spin-slow" />
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2">{activeTab} Section</h2>
            <p className="text-gray-500 max-w-sm">We are working on this feature to give you the best management experience. Stay tuned!</p>
            <button 
              onClick={() => setActiveTab('Dashboard')}
              className="mt-8 px-8 py-3 bg-primary text-white rounded-2xl font-bold hover:apply-dark shadow-xl"
            >
              Back to Dashboard
            </button>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col fixed h-full z-50">
        <div className="p-8 mb-4">
          <Link to="/" className="flex items-center gap-2">
            <Logo variant="dark" className="scale-125 origin-left" />
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar pb-8">
          {[
            { name: 'Dashboard', icon: LayoutDashboard },
            { name: 'Products', icon: Package },
            { name: 'Categories', icon: Tag },
            { name: 'Orders', icon: ShoppingCart },
            { name: 'Customers', icon: Users },
            { name: 'Inventory', icon: Package },
            { name: 'Discounts', icon: Tag },
            { name: 'Reviews', icon: Star },
            { name: 'Payments', icon: CreditCard },
            { name: 'Reports', icon: BarChart3 },
            { name: 'Settings', icon: Settings },
          ].map((item) => (
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
        </nav>

        <div className="p-6 border-t border-gray-100">
          <button 
            onClick={async () => {
              await logout();
              window.location.href = "/";
            }}
            className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold text-sm text-sale hover:bg-red-50 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 min-h-screen">
        {/* Top Navbar */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-black text-primary uppercase tracking-tighter">Admin Dashboard</h1>
                <div className="flex items-center gap-2 text-[10px] font-bold text-accent uppercase tracking-[0.2em] mt-0.5">
                  <span>Management Portal</span>
                  <ChevronRight size={10} />
                  <span className="text-gray-400">{activeTab}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="relative hidden lg:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search orders, products..." 
                  className="bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-accent/20 w-80 transition-all text-sm"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <button className="p-2.5 bg-gray-50 rounded-xl text-gray-500 hover:text-accent transition-all relative">
                  <Bell size={20} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-sale rounded-full border-2 border-white"></span>
                </button>
                <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-primary">Admin User</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Super Admin</p>
                  </div>
                  <img 
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&fit=crop" 
                    alt="Admin" 
                    className="w-10 h-10 rounded-xl border-2 border-white shadow-sm object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="p-8 max-w-[1600px] mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
