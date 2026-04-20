import React, { useState, useRef } from 'react';
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
import { cn } from '../lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useProducts } from '../context/ProductContext';
import { storage, ref, uploadBytes, getDownloadURL, useAuth, logout } from '../lib/firebase';
import Logo from '../components/Logo';

export default function AdminAddProduct() {
  const navigate = useNavigate();
  const { user, loading: authLoading, isAdmin } = useAuth();
  const { addProduct } = useProducts();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Women',
    price: '',
    salePrice: '',
    stock: '',
    sku: '',
    brand: '',
    schedule: '',
    tags: '',
    description: '',
    images: [] as string[],
    sizes: ['M'] as string[],
    colors: [{ name: 'Orange', hex: '#f97316' }] as { name: string, hex: string }[]
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    navigate('/admin');
    return null;
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
    setFormError(null);
    
    try {
      if (!newProduct.name || !newProduct.price || !newProduct.stock) {
        throw new Error('Please fill in all required fields (Product title, Price, Stock)');
      }

      let imageUrl = 'https://picsum.photos/seed/placeholder/600/600';

      if (selectedFile) {
        const storageRef = ref(storage, `products/${Date.now()}_${selectedFile.name}`);
        const snapshot = await uploadBytes(storageRef, selectedFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      } else if (newProduct.images[0] && newProduct.images[0].startsWith('http')) {
        imageUrl = newProduct.images[0];
      }

      const price = parseFloat(newProduct.price) || 0;
      const salePrice = newProduct.salePrice ? parseFloat(newProduct.salePrice) : price;
      const stock = parseInt(newProduct.stock) || 0;
      const discount = (price > 0 && salePrice < price) 
        ? Math.round(((price - salePrice) / price) * 100) 
        : 0;

      await addProduct({
        name: newProduct.name,
        category: newProduct.category,
        regularPrice: price,
        salePrice: salePrice,
        quantity: stock,
        mainImage: imageUrl,
        fullDescription: newProduct.description,
        shortDescription: newProduct.description.substring(0, 100) + '...',
        sku: newProduct.sku || `ZF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        tags: newProduct.tags ? newProduct.tags.split(',').map(t => t.trim()) : [newProduct.category, 'New Arrival'],
        discountPercentage: discount,
        lowStockAlert: 5,
        galleryImages: [imageUrl],
        thumbnailImage: imageUrl,
        colors: newProduct.colors.map(c => c.name),
        sizes: newProduct.sizes,
        deliveryDays: 3,
        status: 'Active'
      } as any);

      navigate('/admin');
    } catch (error) {
      console.error('Error adding product:', error);
      setFormError(error instanceof Error ? error.message : 'Failed to add product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const SidebarItem = ({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
    <button 
      onClick={() => label === 'Products' ? navigate('/admin') : null}
      className={cn(
        "flex items-center gap-4 px-8 py-4 w-full transition-all duration-300 relative group",
        active 
          ? "text-primary bg-accent/5" 
          : "text-gray-400 hover:text-primary hover:bg-gray-50/50"
      )}
    >
      {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-r-full" />}
      <div className={cn(
        "p-2 rounded-xl transition-all duration-300",
        active ? "bg-accent text-white shadow-lg shadow-accent/20" : "bg-transparent group-hover:bg-white group-hover:shadow-md"
      )}>
        <Icon size={18} />
      </div>
      <span className="text-[11px] font-black uppercase tracking-[0.15em]">{label}</span>
      {active && <ChevronRight size={14} className="ml-auto opacity-50" />}
    </button>
  );

  return (
    <div className="flex min-h-screen bg-[#f8f9fb] font-sans selection:bg-accent/30">
      {/* Sidebar - Same as AdminDashboard */}
      <aside className="w-80 bg-white border-r border-gray-100 flex flex-col items-center sticky top-0 h-screen transition-all duration-500 overflow-hidden shrink-0 z-50">
        <div className="p-10 w-full">
          <Logo />
        </div>
        
        <nav className="flex-1 w-full space-y-1 py-10 overflow-y-auto custom-scrollbar">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem icon={Package} label="Products" active />
          <SidebarItem icon={ShoppingCart} label="Orders" />
          <SidebarItem icon={Users} label="Customers" />
          <SidebarItem icon={Star} label="Reviews" />
          <SidebarItem icon={CreditCard} label="Payments" />
          <SidebarItem icon={Tag} label="Discounts" />
          <SidebarItem icon={ImageIcon} label="Media" />
          <SidebarItem icon={Globe} label="Region" />
          <SidebarItem icon={Settings} label="Settings" />
        </nav>

        <div className="p-10 w-full">
          <button 
            onClick={() => logout()}
            className="flex items-center gap-4 px-8 py-5 w-full bg-gray-50 text-gray-400 rounded-[1.5rem] font-bold text-xs uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all group"
          >
            <div className="p-2 bg-white rounded-xl shadow-sm group-hover:shadow-md group-hover:text-red-500 transition-all">
              <LogOut size={16} />
            </div>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col relative h-screen">
        {/* Header */}
        <header className="h-28 bg-white border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-40 shrink-0">
          <div className="flex items-center gap-10">
            <h1 className="text-2xl font-black text-primary tracking-tight">Add Product</h1>
            <div className="hidden lg:flex items-center gap-1.5 px-4 py-2 bg-gray-50 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Store Live</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group hidden md:block">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-accent transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Product Search..." 
                className="bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-8 text-[11px] font-bold text-primary w-64 focus:ring-2 focus:ring-accent/10 transition-all placeholder:text-gray-300"
              />
            </div>
            <button className="relative p-4 bg-gray-50 rounded-2xl text-gray-400 hover:bg-white hover:shadow-md hover:text-accent transition-all group">
              <Bell size={20} />
              <span className="absolute top-4 right-4 w-2 h-2 bg-accent rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-4 bg-gray-50 p-2 pr-6 rounded-3xl border border-gray-100 hover:shadow-md transition-all cursor-pointer">
              <img 
                src={user?.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&h=100&fit=crop"} 
                alt="Admin" 
                className="w-10 h-10 rounded-2xl object-cover shadow-sm border border-white" 
              />
              <div className="flex flex-col">
                <span className="text-xs font-black text-primary leading-none uppercase tracking-tighter">{user?.displayName?.split(' ')[0] || 'Admin'}</span>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Super Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-10 bg-[#f8f9fb]">
          <div className="max-w-[1200px] mx-auto space-y-10 pb-20">
            {/* Header with Breadcrumbs */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-tight">
                <Link to="/admin" className="hover:text-primary">Dashboard</Link>
                <ChevronRight size={12} />
                <span className="hover:text-primary cursor-pointer">Product</span>
                <ChevronRight size={12} />
                <span className="text-gray-900">Add Product</span>
              </div>
            </div>

            {formError && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-shake">
                <AlertCircle size={20} />
                <p className="text-sm font-medium">{formError}</p>
                <button onClick={() => setFormError(null)} className="ml-auto p-1 hover:bg-red-100 rounded-lg transition-colors">
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Image Upload Section */}
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-8">
              <h3 className="text-sm font-black text-gray-900">Upload images</h3>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-[4/1] w-full border-2 border-dashed border-orange-200 bg-orange-50/20 rounded-3xl flex flex-col items-center justify-center group cursor-pointer hover:bg-orange-50/40 transition-all"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  multiple 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <div className="mb-4 text-orange-500">
                  <CloudUpload size={48} />
                </div>
                <p className="text-sm font-bold text-gray-500">
                  Drop your images here or select <span className="text-orange-500 underline">click to browse</span>
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {newProduct.images.map((img, i) => (
                  <div key={i} className="aspect-[3/4] rounded-2xl overflow-hidden border border-gray-100 shadow-sm relative group">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNewProduct({...newProduct, images: newProduct.images.filter((_, idx) => idx !== i)});
                      }}
                      className="absolute top-2 right-2 p-1 bg-white/90 rounded-lg text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-2xl">
                You need to add at least 4 images. Pay attention to the quality of the pictures you add, comply with the background color standards. Pictures must be in certain dimensions. Notice that the product shows all the details.
              </p>
            </div>

            {/* Form Content */}
            <div className="bg-white p-10 rounded-[2rem] border border-gray-100 shadow-sm space-y-10">
              <form onSubmit={handleAddProduct} className="space-y-8">
                {/* Product Title */}
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-900">Product title <span className="text-orange-500">*</span></label>
                  <input 
                    type="text"
                    placeholder="Enter title"
                    className="w-full bg-[#f4f7f9] border-none rounded-xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-orange-500/20"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  />
                  <p className="text-[10px] text-gray-400 font-medium ml-1">Do not exceed 20 characters when entering the product name.</p>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-900">Category <span className="text-orange-500">*</span></label>
                  <div className="relative">
                    <select 
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      className="w-full bg-[#f4f7f9] border-none rounded-xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-orange-500/20 appearance-none cursor-pointer"
                    >
                      <option>Women</option>
                      <option>Dress</option>
                      <option>Ready-to-wear</option>
                      <option>Fabrics</option>
                    </select>
                    <ChevronRight size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none" />
                  </div>
                </div>

                {/* Price, Sale, Schedule */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-900">Price <span className="text-orange-500">*</span></label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                      <input 
                        type="number"
                        placeholder="Price"
                        className="w-full bg-[#f4f7f9] border-none rounded-xl py-4 pl-10 pr-6 text-sm font-medium focus:ring-2 focus:ring-orange-500/20"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-900">Sale Price</label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                      <input 
                        type="number"
                        placeholder="Sale Price"
                        className="w-full bg-[#f4f7f9] border-none rounded-xl py-4 pl-12 pr-6 text-sm font-medium focus:ring-2 focus:ring-orange-500/20"
                        value={newProduct.salePrice}
                        onChange={(e) => setNewProduct({...newProduct, salePrice: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-900">Schedule</label>
                    <div className="relative">
                      <input 
                        type="date"
                        className="w-full bg-[#f4f7f9] border-none rounded-xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-orange-500/20"
                        value={newProduct.schedule}
                        onChange={(e) => setNewProduct({...newProduct, schedule: e.target.value})}
                      />
                      <Calendar size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Brand, Color, Size */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-900">Brand <span className="text-orange-500">*</span></label>
                    <input 
                      type="text"
                      placeholder="Choose brand"
                      className="w-full bg-[#f4f7f9] border-none rounded-xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-orange-500/20"
                      value={newProduct.brand}
                      onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-900">Color: <span className="text-gray-400 ml-1 font-bold">Orange</span></label>
                    <div className="flex items-center gap-3 pt-2">
                      {[
                        { hex: '#f97316', name: 'Orange' },
                        { hex: '#3b82f6', name: 'Blue' },
                        { hex: '#fbbf24', name: 'Yellow' },
                        { hex: '#000000', name: 'Black' }
                      ].map(c => (
                        <button 
                          key={c.hex}
                          type="button"
                          className={cn(
                            "w-8 h-8 rounded-full transition-all border-4 shadow-sm",
                            newProduct.colors.some(cp => cp.hex === c.hex) ? "border-white shadow-xl scale-110" : "border-transparent"
                          )}
                          style={{ backgroundColor: c.hex }}
                          onClick={() => setNewProduct({...newProduct, colors: [c]})}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-900">Size: <span className="text-gray-400 ml-1 font-bold">M</span></label>
                    <div className="flex items-center gap-2 pt-2">
                      {['S', 'M', 'L', 'XL'].map(s => (
                        <button 
                          key={s}
                          type="button"
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold transition-all",
                            newProduct.sizes.includes(s) 
                              ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" 
                              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                          )}
                          onClick={() => setNewProduct({...newProduct, sizes: [s]})}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SKU, Stock, Tags */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-900">SKU</label>
                    <input 
                      type="text"
                      placeholder="Enter SKU"
                      className="w-full bg-[#f4f7f9] border-none rounded-xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-orange-500/20"
                      value={newProduct.sku}
                      onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-900">Stock <span className="text-orange-500">*</span></label>
                    <input 
                      type="number"
                      placeholder="Enter Stock"
                      className="w-full bg-[#f4f7f9] border-none rounded-xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-orange-500/20"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-900">Tags</label>
                    <input 
                      type="text"
                      placeholder="Enter a tag"
                      className="w-full bg-[#f4f7f9] border-none rounded-xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-orange-500/20"
                      value={newProduct.tags}
                      onChange={(e) => setNewProduct({...newProduct, tags: e.target.value})}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-900">Description <span className="text-orange-500">*</span></label>
                  <textarea 
                    rows={8}
                    placeholder="Short description about product"
                    className="w-full bg-[#f4f7f9] border-none rounded-xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-orange-500/20 resize-none"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  />
                  <p className="text-[10px] text-gray-400 font-medium ml-1">Do not exceed 100 characters when entering the product name.</p>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-10">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-5 bg-orange-500 text-white rounded-[1.25rem] font-bold text-sm shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Adding...' : 'Add product'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => navigate('/admin')}
                    className="flex-1 py-5 bg-transparent text-orange-500 border border-orange-200 rounded-[1.25rem] font-bold text-sm hover:bg-orange-50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            <div className="text-center py-6">
              <p className="text-[11px] font-bold text-gray-400">
                Copyright © 2026 <span className="text-orange-500">Dataflow</span> Design By Themesflat All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
