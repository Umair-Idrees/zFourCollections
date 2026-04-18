import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db, doc, getDoc } from '../lib/firebase';
import { Product } from '../types';
import { ShoppingCart, Heart, Share2, Star, Truck, ShieldCheck, Clock, Plus, Minus, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import ProductSection from '../components/ProductSection';

interface ProductDetailProps {
  addToCart: (product: any, quantity: number) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ addToCart }) => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as Product;
          setProduct({ id: docSnap.id, ...data });
          setSelectedImage(data.mainImage);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
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
    <div className="pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-12">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
          <ChevronRight size={12} />
          <span className="text-primary truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Images */}
          <div className="space-y-6">
            <div className="aspect-[3/4] bg-linen rounded-[2.5rem] overflow-hidden border border-stone-100 shadow-sm relative group">
              <img 
                src={selectedImage || 'https://picsum.photos/seed/product/800/800'} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              {discount > 0 && (
                <span className="absolute top-8 left-8 bg-sale text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-widest shadow-xl">
                  -{discount}% OFF
                </span>
              )}
            </div>
            
            {/* Gallery */}
            {(product.galleryImages?.length > 0 || product.mainImage) && (
              <div className="grid grid-cols-4 gap-4">
                {[product.mainImage, ...(product.galleryImages || [])].filter(Boolean).map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedImage(img)}
                    className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                      selectedImage === img ? 'border-primary shadow-xl scale-95' : 'border-transparent hover:border-linen'
                    }`}
                  >
                    <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-linen px-4 py-1.5 rounded-full border border-stone-100">
                  {product.category}
                </span>
                {product.brand && (
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] bg-stone-50 px-4 py-1.5 rounded-full border border-gray-100">
                    {product.brand}
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-primary mb-6 leading-tight tracking-tight uppercase">{product.name}</h1>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < 4 ? 'text-gold fill-gold' : 'text-gray-200'}`} />
                  ))}
                  <span className="text-xs font-black text-gray-400 ml-2 tracking-tighter">4.0 / 5.0</span>
                </div>
                <div className="w-px h-4 bg-gray-100"></div>
                <span className="text-[10px] font-black text-green-600 uppercase tracking-widest flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  {product.stockStatus || 'In Stock'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 py-6 border-y border-linen">
              <span className="text-5xl font-black text-primary tracking-tighter">${product.salePrice}</span>
              {product.regularPrice > product.salePrice && (
                <span className="text-2xl text-gray-300 line-through font-bold decoration-sale/30">${product.regularPrice}</span>
              )}
              <div className="ml-auto bg-green-50 text-green-600 px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase">
                Special Price
              </div>
            </div>

            <p className="text-gray-500 leading-relaxed text-lg font-medium">
              {product.shortDescription || 'An exquisite masterpiece from our couture collection, crafted for those who appreciate the finer details of high-fashion.'}
            </p>

            {/* Options */}
            <div className="space-y-8 pt-6">
              {product.colors?.length > 0 && (
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Couture Palette</label>
                  <div className="flex gap-4">
                    {product.colors.map(color => (
                      <button key={color} className="w-10 h-10 rounded-full border-2 border-white shadow-md ring-1 ring-gray-100 hover:scale-110 transition-transform p-0.5" style={{ backgroundColor: color.toLowerCase() }} title={color}></button>
                    ))}
                  </div>
                </div>
              )}

              {product.sizes?.length > 0 && (
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Select Fit</label>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map(size => (
                      <button key={size} className="px-7 py-3 rounded-2xl border border-gray-100 text-[10px] font-black text-primary uppercase tracking-widest hover:border-primary hover:bg-primary hover:text-white transition-all active:scale-95">{size}</button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <div className="flex items-center bg-linen rounded-2xl p-1.5 w-fit border border-stone-100">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3.5 hover:bg-white rounded-xl transition-all shadow-sm hover:text-primary text-gray-400"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="w-14 text-center font-black text-primary text-lg">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3.5 hover:bg-white rounded-xl transition-all shadow-sm hover:text-primary text-gray-400"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                
                <button 
                  onClick={() => addToCart(product, quantity)}
                  className="flex-1 bg-primary text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-gold transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-4 active:scale-95 translate-y-0 hover:-translate-y-1"
                >
                  <ShoppingCart size={18} />
                  Add to Cart
                </button>
                
                <button className="p-5 bg-white border border-gray-100 rounded-[2rem] text-gray-400 hover:text-sale hover:border-sale/20 transition-all shadow-sm group">
                  <Heart size={24} className="group-hover:fill-sale transition-all" />
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-10">
              <div className="flex flex-col items-center text-center p-6 bg-linen rounded-[2rem] border border-stone-100 group">
                <Truck size={24} className="text-primary mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-black text-primary uppercase tracking-widest">Global Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-linen rounded-[2rem] border border-stone-100 group">
                <ShieldCheck size={24} className="text-primary mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-black text-primary uppercase tracking-widest">Secure Check</span>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-linen rounded-[2rem] border border-stone-100 group">
                <Star size={24} className="text-gold mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-black text-primary uppercase tracking-widest">Top Quality</span>
              </div>
            </div>
          </div>
        </div>

        {/* Full Description */}
        <div className="mt-24">
          <div className="flex gap-12 border-b border-linen mb-12 overflow-x-auto no-scrollbar">
            <button className="pb-6 border-b-2 border-primary text-[10px] font-black text-primary uppercase tracking-[0.3em] whitespace-nowrap">Description</button>
            <button className="pb-6 border-b-2 border-transparent text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] hover:text-primary transition-colors whitespace-nowrap">Specifications</button>
            <button className="pb-6 border-b-2 border-transparent text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] hover:text-primary transition-colors whitespace-nowrap">Reviews (120)</button>
          </div>
          <div className="max-w-4xl">
            <p className="text-gray-500 leading-relaxed text-lg font-medium whitespace-pre-wrap">
              {product.fullDescription || 'No detailed description available for this product.'}
            </p>
          </div>
        </div>
      </div>

      <ProductSection title="Related Products" category={product.category} limit={4} addToCart={addToCart} />
    </div>
  );
};

export default ProductDetail;
