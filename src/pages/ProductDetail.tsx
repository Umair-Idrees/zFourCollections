import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db, doc, getDoc } from '../lib/firebase';
import { Product } from '../types';
import { useProducts } from '../context/ProductContext';
import { ShoppingCart, Heart, Share2, Star, Truck, ShieldCheck, Clock, Plus, Minus, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import ProductSection from '../components/ProductSection';
import { formatPrice } from '../lib/utils';

interface ProductDetailProps {
  addToCart: (product: any, quantity: number) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ addToCart }) => {
  const { id } = useParams<{ id: string }>();
  const { products: contextProducts, loading: contextLoading } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'reviews' | 'shipping'>('info');
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  useEffect(() => {
    if (id && contextProducts.length > 0) {
      const foundProduct = contextProducts.find(p => p.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedImage(foundProduct.mainImage);
      }
    }
  }, [id, contextProducts]);

  const loading = contextLoading && contextProducts.length === 0;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-gray-100 rounded-3xl"></div>
          <div className="space-y-6">
            <div className="h-8 bg-gray-100 rounded w-3/4"></div>
            <div className="h-4 bg-gray-100 rounded w-1/2"></div>
            <div className="h-12 bg-gray-100 rounded w-1/4"></div>
            <div className="h-32 bg-gray-100 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-40">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
        <Link to="/shop" className="text-blue-600 font-bold hover:underline">Back to Shop</Link>
      </div>
    );
  }

  const discount = product.regularPrice > product.salePrice 
    ? Math.round(((product.regularPrice - product.salePrice) / product.regularPrice) * 100)
    : 0;

  return (
    <div className="pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={10} />
          <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
          <ChevronRight size={10} />
          <span className="text-primary truncate max-w-[150px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Product Images */}
          <div className="space-y-4">
            <div 
              className="aspect-[3/4] bg-linen rounded-[2rem] overflow-hidden border border-stone-50 shadow-sm relative group cursor-zoom-in"
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleMouseMove}
            >
              <img 
                src={selectedImage || 'https://picsum.photos/seed/product/800/800'} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-200"
                style={{
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transform: isZooming ? 'scale(2.2)' : 'scale(1)'
                }}
                referrerPolicy="no-referrer"
              />
              {discount > 0 && (
                <span className="absolute top-6 left-6 bg-sale text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl pointer-events-none">
                  -{discount}% OFF
                </span>
              )}
            </div>
            
            {/* Gallery */}
            {(product.galleryImages?.length > 0 || product.mainImage) && (
              <div className="grid grid-cols-5 gap-3">
                {[product.mainImage, ...(product.galleryImages || [])].filter(Boolean).map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedImage(img)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === img ? 'border-primary shadow-md' : 'border-transparent hover:border-linen'
                    }`}
                  >
                    <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] bg-linen px-3 py-1 rounded-full">
                  {product.category}
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-black text-primary mb-3 leading-tight tracking-tight uppercase">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className={`w-3 h-3 ${i < 4 ? 'text-gold fill-gold' : 'text-gray-200'}`} />
                  ))}
                  <span className="text-[10px] font-black text-gray-400 ml-1">4.0 / 5.0</span>
                </div>
                <div className="w-px h-3 bg-gray-100"></div>
                <span className="text-[9px] font-black text-green-600 uppercase tracking-widest flex items-center gap-1">
                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                  {product.quantity > 0 ? `In Stock (${product.quantity})` : 'Out of Stock'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 py-3 border-y border-linen">
              <span className="text-3xl font-black text-primary tracking-tighter">{formatPrice(product.salePrice)}</span>
              {product.regularPrice > product.salePrice && (
                <span className="text-lg text-gray-300 line-through font-bold decoration-sale/30">{formatPrice(product.regularPrice)}</span>
              )}
              <div className="ml-auto bg-green-50 text-green-600 px-2 py-1 rounded-lg text-[9px] font-black tracking-widest uppercase">
                Special Price
              </div>
            </div>

            <p className="text-gray-500 leading-relaxed text-[13px] font-medium whitespace-pre-wrap">
              {product.fullDescription || product.shortDescription || 'An exquisite masterpiece from our couture collection.'}
            </p>

            {/* Options */}
            <div className="space-y-5 pt-1">
              <div className="grid grid-cols-2 gap-4">
                {product.colors?.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Couture Palette</label>
                    <div className="flex gap-2">
                      {product.colors.map(color => (
                        <button key={color} className="w-6 h-6 rounded-full border border-white shadow-sm ring-1 ring-gray-100 p-0.5" style={{ backgroundColor: color.toLowerCase() }} title={color}></button>
                      ))}
                    </div>
                  </div>
                )}

                {product.sizes?.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Select Fit</label>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map(size => (
                        <button key={size} className="px-4 py-1.5 rounded-lg border border-gray-100 text-[9px] font-black text-primary uppercase tracking-widest hover:border-primary transition-colors">{size}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-3">
                <div className="flex items-center bg-linen rounded-xl p-0.5 w-fit border border-stone-50">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 hover:bg-white rounded-lg transition-all text-gray-400"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center font-black text-primary text-sm">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2.5 hover:bg-white rounded-lg transition-all text-gray-400"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <button 
                  onClick={() => addToCart(product, quantity)}
                  className="flex-1 bg-accent text-white px-6 py-3.5 rounded-2xl font-black uppercase tracking-[0.1em] text-[10px] hover:bg-neutral-900 transition-all shadow-xl shadow-accent/10 flex items-center justify-center gap-3 active:scale-95"
                >
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>
                
                <button className="p-3.5 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-sale transition-all group">
                  <Heart size={20} className="group-hover:fill-sale transition-all" />
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-4">
              <div className="flex flex-col items-center text-center p-3 bg-linen rounded-2xl">
                <Truck size={16} className="text-primary mb-1" />
                <span className="text-[7px] font-black text-primary uppercase tracking-widest">Global Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-linen rounded-2xl">
                <ShieldCheck size={16} className="text-primary mb-1" />
                <span className="text-[7px] font-black text-primary uppercase tracking-widest">Secure Check</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-linen rounded-2xl">
                <Star size={16} className="text-gold mb-1" />
                <span className="text-[7px] font-black text-primary uppercase tracking-widest">Top Quality</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Inner Tabs */}
        <div className="mt-12 bg-white rounded-[2rem] border border-gray-50 p-6 md:p-8 shadow-sm">
          <div className="flex gap-8 border-b border-linen mb-8 overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setActiveTab('info')}
              className={`pb-4 border-b-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                activeTab === 'info' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-primary'
              }`}
            >
              Additional Information
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 border-b-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                activeTab === 'reviews' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-primary'
              }`}
            >
              Reviews (22)
            </button>
            <button 
              onClick={() => setActiveTab('shipping')}
              className={`pb-4 border-b-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                activeTab === 'shipping' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-primary'
              }`}
            >
              Shipping & Delivery
            </button>
          </div>

          <div className="max-w-3xl">
            {activeTab === 'info' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">SKU</span>
                  <span className="text-xs font-bold text-primary">{product.sku}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Material</span>
                  <span className="text-xs font-bold text-primary">{product.material || 'Premium Silk/Lawn'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Model</span>
                  <span className="text-xs font-bold text-primary">{product.model || 'Spring 2024'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Weight</span>
                  <span className="text-xs font-bold text-primary">{product.weight || '0.5 kg'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Dimensions</span>
                  <span className="text-xs font-bold text-primary">{product.dimensions || '30 × 40 × 10 cm'}</span>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {[
                  { name: 'Sarah Ahmed', rating: 5, date: 'Mar 12, 2024', text: 'Beautiful fabric and perfect fitting. Highly recommended!' },
                  { name: 'Zoya Khan', rating: 4, date: 'Feb 28, 2024', text: 'Love the color, though delivery was a bit late.' }
                ].map((review, i) => (
                  <div key={i} className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-primary">{review.name}</span>
                      <span className="text-[10px] font-bold text-gray-400">{review.date}</span>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} size={10} className={j < review.rating ? "text-gold fill-gold" : "text-gray-200"} />
                      ))}
                    </div>
                    <p className="text-[11px] text-gray-500 font-medium">{review.text}</p>
                  </div>
                ))}
                <button className="text-[10px] font-black text-accent uppercase tracking-widest hover:underline decoration-2 underline-offset-4">Read All Reviews</button>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4">
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  We offer fast and reliable delivery options tailored to your location. Standard delivery typically takes 3-5 business days within Pakistan.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <Truck className="text-accent mb-2" size={18} />
                    <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Standard Delivery</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Rs. 250 (3-5 Days)</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <Clock className="text-accent mb-2" size={18} />
                    <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Express Shipping</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Rs. 500 (1-2 Days)</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>



      <ProductSection title="Related Products" category={product.category} limit={4} addToCart={addToCart} />
    </div>
  );
};

export default ProductDetail;
