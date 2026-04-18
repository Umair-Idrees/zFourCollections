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
        <nav className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-12">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link to="/shop" className="hover:text-blue-600 transition-colors">Shop</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Images */}
          <div className="space-y-6">
            <div className="aspect-square bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm relative group">
              <img 
                src={selectedImage || 'https://picsum.photos/seed/product/800/800'} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              {discount > 0 && (
                <span className="absolute top-6 left-6 bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">
                  Save {discount}%
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
                      selectedImage === img ? 'border-blue-600 shadow-lg' : 'border-transparent hover:border-blue-200'
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
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                  {product.category}
                </span>
                {product.brand && (
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">
                    {product.brand}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-400">4.0 (120 Reviews)</span>
                <span className="text-gray-200">|</span>
                <span className="text-sm font-bold text-green-600 uppercase tracking-widest">{product.stockStatus || 'In Stock'}</span>
              </div>
            </div>

            <div className="flex items-end gap-4">
              <span className="text-4xl font-bold text-gray-900">${product.salePrice}</span>
              {product.regularPrice > product.salePrice && (
                <span className="text-xl text-gray-400 line-through mb-1">${product.regularPrice}</span>
              )}
            </div>

            <p className="text-gray-500 leading-relaxed text-lg">
              {product.shortDescription || 'Experience the perfect blend of style and performance with the ' + product.name + '. Designed for the modern lifestyle.'}
            </p>

            {/* Options */}
            <div className="space-y-6 pt-6 border-t border-gray-100">
              {product.colors?.length > 0 && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Available Colors</label>
                  <div className="flex gap-3">
                    {product.colors.map(color => (
                      <button key={color} className="w-8 h-8 rounded-full border border-gray-200 hover:scale-110 transition-transform" style={{ backgroundColor: color.toLowerCase() }} title={color}></button>
                    ))}
                  </div>
                </div>
              )}

              {product.sizes?.length > 0 && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select Size</label>
                  <div className="flex gap-3">
                    {product.sizes.map(size => (
                      <button key={size} className="px-5 py-2.5 rounded-xl border border-gray-100 text-sm font-bold text-gray-600 hover:border-blue-600 hover:text-blue-600 transition-all">{size}</button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <div className="flex items-center bg-gray-50 rounded-2xl p-1 w-fit border border-gray-100">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-white rounded-xl transition-colors text-gray-500"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="w-12 text-center font-bold text-gray-900">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-white rounded-xl transition-colors text-gray-500"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                
                <button 
                  onClick={() => addToCart(product, quantity)}
                  className="flex-1 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3"
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
                
                <button className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-red-500 hover:border-red-100 transition-all shadow-sm">
                  <Heart size={24} />
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-3xl border border-gray-100">
                <Truck size={24} className="text-blue-600 mb-2" />
                <span className="text-[10px] font-bold text-gray-900 uppercase tracking-wider">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-3xl border border-gray-100">
                <ShieldCheck size={24} className="text-green-600 mb-2" />
                <span className="text-[10px] font-bold text-gray-900 uppercase tracking-wider">Secure Warranty</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-3xl border border-gray-100">
                <Clock size={24} className="text-purple-600 mb-2" />
                <span className="text-[10px] font-bold text-gray-900 uppercase tracking-wider">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Full Description */}
        <div className="mt-24">
          <div className="flex gap-12 border-b border-gray-100 mb-12">
            <button className="pb-6 border-b-2 border-blue-600 text-sm font-bold text-gray-900 uppercase tracking-widest">Description</button>
            <button className="pb-6 border-b-2 border-transparent text-sm font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors">Specifications</button>
            <button className="pb-6 border-b-2 border-transparent text-sm font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors">Reviews (120)</button>
          </div>
          <div className="max-w-4xl prose prose-blue">
            <p className="text-gray-500 leading-relaxed text-lg whitespace-pre-wrap">
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
