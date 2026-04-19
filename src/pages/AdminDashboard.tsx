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
  Upload
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
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useProducts } from '../context/ProductContext';
import { useOrders } from '../context/OrderContext';
import { auth, loginWithGoogle, logout, storage, ref, uploadBytes, getDownloadURL } from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

import Logo from '../components/Logo';

// --- Mock Data ---
const REVENUE_DATA = [
  { name: 'Jan', revenue: 45000, orders: 120 },
  { name: 'Feb', revenue: 52000, orders: 150 },
  { name: 'Mar', revenue: 48000, orders: 140 },
  { name: 'Apr', revenue: 61000, orders: 180 },
  { name: 'May', revenue: 55000, orders: 160 },
  { name: 'Jun', revenue: 67000, orders: 210 },
  { name: 'Jul', revenue: 72000, orders: 230 },
];

const CATEGORY_DATA = [
  { name: 'Electronics', value: 45, color: '#3b82f6' },
  { name: 'Fashion', value: 30, color: '#ec4899' },
  { name: 'Home', value: 15, color: '#10b981' },
  { name: 'Beauty', value: 10, color: '#f59e0b' },
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
  { id: 'c1', name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+1 234 567 890', orders: 12, spend: '$2,450', status: 'Active' },
  { id: 'c2', name: 'Michael Chen', email: 'mchen@example.com', phone: '+1 234 567 891', orders: 8, spend: '$1,890', status: 'Active' },
  { id: 'c3', name: 'Emma Wilson', email: 'emma@example.com', phone: '+1 234 567 892', orders: 5, spend: '$3,200', status: 'Inactive' },
];

export default function AdminDashboard({ 
  initialTab = 'Dashboard',
  openAddProduct = false
}: { 
  initialTab?: string;
  openAddProduct?: boolean;
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(openAddProduct);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [productSearchQuery, setProductSearchQuery] = useState('');
  
  const { products, addProduct, deleteProduct } = useProducts();
  const { orders, updateOrderStatus, deleteOrder: deleteOrderFromDb } = useOrders();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;
  const deliveredOrdersCount = orders.filter(o => o.status === 'Delivered').length;
  const cancelledOrdersCount = orders.filter(o => o.status === 'Cancelled').length;
  const totalOrdersCount = orders.length;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const isAdmin = user?.email === 'umairmayo607@gmail.com';

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Fashion',
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="text-accent w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">Admin Access Required</h1>
          <p className="text-gray-500 mb-8">Please login with your admin account to manage the store.</p>
          {!user ? (
            <button 
              onClick={() => loginWithGoogle()}
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3"
            >
              <Globe size={20} /> Login with Google
            </button>
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct(prev => ({
          ...prev,
          images: [reader.result as string]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log("Starting product addition process...");
      let imageUrl = 'https://picsum.photos/seed/placeholder/600/600';

      if (selectedFile) {
        console.log("Uploading image to storage...");
        const storageRef = ref(storage, `products/${Date.now()}_${selectedFile.name}`);
        const snapshot = await uploadBytes(storageRef, selectedFile);
        imageUrl = await getDownloadURL(snapshot.ref);
        console.log("Image uploaded successfully:", imageUrl);
      } else if (newProduct.images[0] && newProduct.images[0].startsWith('http')) {
        imageUrl = newProduct.images[0];
        console.log("Using provided image URL:", imageUrl);
      }

      const price = parseFloat(newProduct.price) || 0;
      const salePrice = newProduct.salePrice ? parseFloat(newProduct.salePrice) : price;
      const stock = parseInt(newProduct.stock) || 0;
      const discount = (price > 0 && salePrice < price) 
        ? Math.round(((price - salePrice) / price) * 100) 
        : 0;

      console.log("Calling addProduct with data:", {
        name: newProduct.name,
        category: newProduct.category,
        price,
        salePrice,
        stock,
        discount,
        imageUrl
      });

      await addProduct({
        name: newProduct.name,
        category: newProduct.category,
        regularPrice: price,
        salePrice: salePrice,
        quantity: stock,
        mainImage: imageUrl,
        fullDescription: newProduct.description,
        shortDescription: newProduct.description.substring(0, 100) + '...',
        sku: `ZF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        tags: [newProduct.category, 'New Arrival'],
        discountPercentage: discount,
        lowStockAlert: 5,
        galleryImages: [imageUrl],
        thumbnailImage: imageUrl,
        colors: newProduct.colors.map(c => c.name),
        sizes: newProduct.sizes,
        deliveryDays: 3,
        status: 'Active'
      } as any);

      console.log("Product added successfully to database!");
      setIsAddProductModalOpen(false);
      setSelectedFile(null);
      // Reset form
      setNewProduct({
        name: '',
        category: 'Fashion',
        price: '',
        salePrice: '',
        stock: '',
        description: '',
        images: [''],
        sizes: [],
        colors: []
      });
    } catch (error) {
      console.error('Error adding product:', error);
      setFormError(error instanceof Error ? error.message : 'Failed to add product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <div className="space-y-10">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, change: '+12.5%', isPositive: true, icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Total Orders', value: totalOrdersCount.toLocaleString(), change: '+8.2%', isPositive: true, icon: ShoppingCart, color: 'text-purple-600', bg: 'bg-purple-50' },
                { label: 'Total Customers', value: '1,540', change: '+5.4%', isPositive: true, icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
                { label: 'Total Products', value: products.length.toLocaleString(), change: '+12', isPositive: true, icon: Package, color: 'text-orange-600', bg: 'bg-orange-50' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn("p-3 rounded-2xl", stat.bg)}>
                      <stat.icon size={24} className={stat.color} />
                    </div>
                    <div className={cn(
                      "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                      stat.isPositive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                    )}>
                      {stat.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {stat.change}
                    </div>
                  </div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-primary">{stat.value}</h3>
                </div>
              ))}
            </div>

            {/* Secondary Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Pending Orders', value: pendingOrdersCount.toLocaleString(), status: 'Pending', color: 'text-yellow-600', bg: 'bg-yellow-50' },
                { label: 'Delivered Orders', value: deliveredOrdersCount.toLocaleString(), status: 'Delivered', color: 'text-green-600', bg: 'bg-green-50' },
                { label: 'Cancelled Orders', value: cancelledOrdersCount.toLocaleString(), status: 'Cancelled', color: 'text-red-600', bg: 'bg-red-50' },
                { label: 'Low Stock', value: products.filter(p => p.quantity < 5).length.toLocaleString(), status: 'Alert', color: 'text-orange-600', bg: 'bg-orange-50' },
              ].map((stat) => (
                <div key={stat.label} className={cn("p-6 rounded-[2rem] border shadow-sm transition-all", stat.bg, "border-white/20")}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold uppercase tracking-widest opacity-60">{stat.label}</p>
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-white/50", stat.color)}>
                      {stat.status}
                    </span>
                  </div>
                  <h3 className={cn("text-3xl font-bold", stat.color)}>{stat.value}</h3>
                </div>
              ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Sales Overview */}
              <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-primary">Sales Overview</h3>
                    <p className="text-sm text-gray-400">Monthly revenue and orders trend</p>
                  </div>
                  <select className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm font-bold text-gray-500 focus:outline-none">
                    <option>Last 7 Months</option>
                    <option>Last Year</option>
                  </select>
                </div>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={REVENUE_DATA}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Distribution */}
              <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold text-primary mb-8">Sales by Category</h3>
                <div className="h-[250px] w-full mb-8">
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
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  {CATEGORY_DATA.map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                        <span className="text-sm font-medium text-gray-600">{cat.name}</span>
                      </div>
                      <span className="text-sm font-bold text-primary">{cat.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Orders */}
              <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-primary">Recent Orders</h3>
                  <button onClick={() => setActiveTab('Orders')} className="text-sm font-bold text-accent hover:underline">View All</button>
                </div>
                <div className="divide-y divide-gray-50">
                  {orders.slice(0, 4).map((order) => (
                    <div key={order.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-primary text-xs">
                          {order.customerName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-primary">{order.customerName}</p>
                          <p className="text-xs text-gray-400">
                            {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Recent'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-primary">${order.total.toFixed(2)}</p>
                        <span className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                          order.status === 'Shipped' ? "bg-blue-50 text-blue-600" : 
                          order.status === 'Delivered' ? "bg-green-50 text-green-600" :
                          order.status === 'Cancelled' ? "bg-red-50 text-red-600" :
                          "bg-yellow-50 text-yellow-600"
                        )}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <div className="p-10 text-center text-gray-400 text-sm">No recent orders.</div>
                  )}
                </div>
              </div>

              {/* Top Selling Products */}
              <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-primary">Top Selling Products</h3>
                  <button onClick={() => setActiveTab('Products')} className="text-sm font-bold text-accent hover:underline">View All</button>
                </div>
                <div className="p-8 space-y-6">
                  {products.slice(0, 4).map((product) => (
                    <div key={product.id} className="flex items-center gap-4 group">
                      <img src={product.mainImage} alt={product.name} className="w-14 h-14 rounded-2xl object-cover border border-gray-100 group-hover:scale-110 transition-transform" referrerPolicy="no-referrer" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-primary truncate group-hover:text-accent transition-colors">{product.name}</p>
                        <p className="text-xs text-gray-400">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-primary">${product.salePrice}</p>
                        <p className="text-[10px] text-green-500 font-bold">120 Sold</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'Products':
        const filteredProducts = products.filter(p => 
          p.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
          p.sku?.toLowerCase().includes(productSearchQuery.toLowerCase())
        );

        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-primary">Product Management</h1>
              <button 
                onClick={() => {
                  setFormError(null);
                  setIsAddProductModalOpen(true);
                }}
                className="flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-2xl font-bold hover:bg-accent/90 transition-all shadow-lg shadow-accent/20"
              >
                <Plus size={18} /> Add Product
              </button>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search products..." 
                    value={productSearchQuery}
                    onChange={(e) => setProductSearchQuery(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-accent/20" 
                  />
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-100 text-sm font-bold text-gray-500 hover:bg-gray-50">
                    <Filter size={18} /> Filter
                  </button>
                  <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-100 text-sm font-bold text-gray-500 hover:bg-gray-50">
                    <Download size={18} /> Export
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="text-left py-4 px-8 text-xs font-bold text-gray-400 uppercase tracking-widest">Product</th>
                      <th className="text-left py-4 px-8 text-xs font-bold text-gray-400 uppercase tracking-widest">Category</th>
                      <th className="text-left py-4 px-8 text-xs font-bold text-gray-400 uppercase tracking-widest">Price</th>
                      <th className="text-left py-4 px-8 text-xs font-bold text-gray-400 uppercase tracking-widest">Stock</th>
                      <th className="text-left py-4 px-8 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                      <th className="text-right py-4 px-8 text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredProducts.length > 0 ? filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="py-4 px-8">
                          <div className="flex items-center gap-4">
                            <img src={product.mainImage} alt={product.name} className="w-12 h-12 rounded-xl object-cover border border-gray-100" referrerPolicy="no-referrer" />
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-primary truncate max-w-[200px]">{product.name}</span>
                              <span className="text-[10px] text-gray-400 font-mono">{product.sku}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-8 text-sm text-gray-500">{product.category}</td>
                        <td className="py-4 px-8 text-sm font-bold text-primary">${product.salePrice}</td>
                        <td className="py-4 px-8 text-sm text-gray-500">{product.quantity} in stock</td>
                        <td className="py-4 px-8">
                          <span className={cn(
                            "text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider",
                            product.stockStatus === 'In Stock' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                          )}>
                            {product.stockStatus}
                          </span>
                        </td>
                        <td className="py-4 px-8 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 text-gray-400 hover:text-accent transition-colors"><Edit2 size={16} /></button>
                            <button 
                              onClick={() => deleteProduct(product.id)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="py-20 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="p-4 bg-gray-50 rounded-full">
                              <Search size={32} className="text-gray-300" />
                            </div>
                            <p className="text-gray-500 font-medium">No products found matching "{productSearchQuery}"</p>
                            <button 
                              onClick={() => setProductSearchQuery('')}
                              className="text-accent text-sm font-bold hover:underline"
                            >
                              Clear search
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
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
                            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center font-bold text-accent">
                              {customer.name.charAt(0)}
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

      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Settings size={40} className="text-gray-400 animate-spin-slow" />
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2">{activeTab} Section</h2>
            <p className="text-gray-500">This section is currently under development.</p>
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
            <Logo variant="dark" className="origin-left" />
            <span className="text-xl font-bold text-accent -ml-1">Admin</span>
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
          <button className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold text-sm text-sale hover:bg-red-50 transition-all">
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
              <h1 className="text-xl font-bold text-primary">{activeTab}</h1>
              <div className="hidden md:flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <ChevronRight size={14} />
                Overview
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
                    src="https://ui-avatars.com/api/?name=Admin+User&background=3b82f6&color=fff" 
                    alt="Admin" 
                    className="w-10 h-10 rounded-xl border-2 border-white shadow-sm"
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

        {/* Add Product Modal */}
        <AnimatePresence>
          {isAddProductModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAddProductModalOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              >
                {/* Modal Header */}
                <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
                  <div>
                    <h2 className="text-2xl font-bold text-primary">Add New Product</h2>
                    <p className="text-sm text-gray-400">Fill in the details to list a new item on zFour</p>
                  </div>
                  <button 
                    onClick={() => setIsAddProductModalOpen(false)}
                    className="p-3 hover:bg-gray-50 rounded-2xl text-gray-400 hover:text-primary transition-all"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Modal Body - Scrollable */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                  {formError && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-shake">
                      <AlertCircle size={20} />
                      <p className="text-sm font-medium">{formError}</p>
                      <button onClick={() => setFormError(null)} className="ml-auto p-1 hover:bg-red-100 rounded-lg transition-colors">
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  <form onSubmit={handleAddProduct} className="space-y-10">
                    {/* Basic Information */}
                    <section className="space-y-6">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <div className="w-1 h-4 bg-accent rounded-full"></div>
                        Basic Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-primary ml-1">Product Name</label>
                          <input 
                            required
                            type="text" 
                            placeholder="e.g. Premium Wool Overcoat"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-primary ml-1">Category</label>
                          <select 
                            value={newProduct.category}
                            onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all appearance-none"
                          >
                            <option>Fashion</option>
                            <option>Electronics</option>
                            <option>Watches</option>
                            <option>Accessories</option>
                            <option>Home & Living</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-primary ml-1">Product Description</label>
                        <textarea 
                          required
                          rows={4}
                          placeholder="Describe your product in detail (features, materials, care instructions...)"
                          value={newProduct.description}
                          onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all resize-none"
                        ></textarea>
                      </div>
                    </section>

                    {/* Pricing & Inventory */}
                    <section className="space-y-6">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <div className="w-1 h-4 bg-accent rounded-full"></div>
                        Pricing & Inventory
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-primary ml-1">Regular Price ($)</label>
                          <input 
                            required
                            type="number" 
                            placeholder="0.00"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-primary ml-1">Sale Price ($)</label>
                          <input 
                            type="number" 
                            placeholder="0.00"
                            value={newProduct.salePrice}
                            onChange={(e) => setNewProduct({...newProduct, salePrice: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-primary ml-1">Stock Quantity</label>
                          <input 
                            required
                            type="number" 
                            placeholder="0"
                            value={newProduct.stock}
                            onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                          />
                        </div>
                      </div>
                    </section>

                    {/* Media & Variants */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                      {/* Images */}
                      <section className="space-y-6">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                          <div className="w-1 h-4 bg-accent rounded-full"></div>
                          Product Images
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                          />
                          <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square bg-gray-50 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center text-gray-400 hover:border-accent/40 hover:bg-accent/5 transition-all cursor-pointer group relative overflow-hidden"
                          >
                            {newProduct.images[0] ? (
                              <img src={newProduct.images[0]} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                              <>
                                <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                                  <Upload size={24} className="text-accent" />
                                </div>
                                <span className="mt-4 text-xs font-bold uppercase tracking-widest">Main Image</span>
                              </>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                              <div key={i} className="aspect-square bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-gray-300 hover:bg-gray-100 transition-all cursor-pointer">
                                <Plus size={20} />
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Or Image URL</label>
                          <input 
                            type="url" 
                            placeholder="https://images.unsplash.com/..."
                            value={newProduct.images[0]}
                            onChange={(e) => setNewProduct({...newProduct, images: [e.target.value]})}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                          />
                        </div>
                      </section>

                      {/* Variants */}
                      <section className="space-y-6">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                          <div className="w-1 h-4 bg-accent rounded-full"></div>
                          Variants
                        </h3>
                        <div className="space-y-6">
                          <div className="space-y-3">
                            <label className="text-sm font-bold text-primary ml-1">Available Sizes</label>
                            <div className="flex flex-wrap gap-2">
                              {['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'].map((size) => (
                                <button
                                  key={size}
                                  type="button"
                                  onClick={() => {
                                    const sizes = newProduct.sizes.includes(size)
                                      ? newProduct.sizes.filter(s => s !== size)
                                      : [...newProduct.sizes, size];
                                    setNewProduct({...newProduct, sizes});
                                  }}
                                  className={cn(
                                    "px-4 py-2 rounded-xl text-xs font-bold border transition-all",
                                    newProduct.sizes.includes(size)
                                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                      : "bg-white text-gray-500 border-gray-100 hover:border-primary"
                                  )}
                                >
                                  {size}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-3">
                            <label className="text-sm font-bold text-primary ml-1">Available Colors</label>
                            <div className="flex flex-wrap gap-3">
                              {[
                                { name: 'Black', hex: '#000000' },
                                { name: 'White', hex: '#FFFFFF' },
                                { name: 'Navy', hex: '#000080' },
                                { name: 'Red', hex: '#EF4444' },
                                { name: 'Beige', hex: '#F5F5DC' },
                                { name: 'Gray', hex: '#808080' },
                              ].map((color) => (
                                <button
                                  key={color.name}
                                  type="button"
                                  onClick={() => {
                                    const colors = newProduct.colors.some(c => c.name === color.name)
                                      ? newProduct.colors.filter(c => c.name !== color.name)
                                      : [...newProduct.colors, color];
                                    setNewProduct({...newProduct, colors});
                                  }}
                                  className={cn(
                                    "w-10 h-10 rounded-full border-2 transition-all p-0.5",
                                    newProduct.colors.some(c => c.name === color.name) ? "border-accent shadow-lg shadow-accent/20" : "border-transparent"
                                  )}
                                >
                                  <div className="w-full h-full rounded-full border border-gray-100" style={{ backgroundColor: color.hex }}></div>
                                </button>
                              ))}
                              <button type="button" className="w-10 h-10 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 hover:border-accent hover:text-accent transition-all">
                                <Plus size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>

                    {/* Form Actions */}
                    <div className="pt-6 flex items-center justify-end gap-4 border-t border-gray-50">
                      <button 
                        type="button"
                        onClick={() => setIsAddProductModalOpen(false)}
                        className="px-8 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="px-10 py-4 bg-accent text-white rounded-2xl font-bold hover:bg-accent/90 transition-all shadow-xl shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Publishing...
                          </>
                        ) : 'Publish Product'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
