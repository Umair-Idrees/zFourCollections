import React, { useState } from 'react';
import { Heart, ShoppingCart, Eye, Star, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useProducts } from '../context/ProductContext';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ProductProps {
  id: string | number;
  image: string;
  title: string;
  price: number;
  salePrice?: number;
  sizes: string[];
  colors: { name: string; hex: string }[];
  stockBadge?: string;
  rating: number;
  reviews: number;
  description?: string;
}

const FashionProductCard: React.FC<{ product: ProductProps }> = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0].name);
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  return (
    <>
      <div 
        className="group bg-white rounded-xl overflow-hidden border border-gray-100 transition-all duration-500 hover:shadow-xl hover:border-transparent relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image & Badges */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {product.salePrice && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm uppercase tracking-wider">
                -{Math.round(((product.price - product.salePrice) / product.price) * 100)}%
              </span>
            )}
            {product.stockBadge && (
              <span className="bg-black text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm uppercase tracking-wider">
                {product.stockBadge}
              </span>
            )}
          </div>

          {/* Quick Actions Overlay */}
          <div className={cn(
            "absolute inset-0 bg-black/5 flex items-center justify-center gap-3 transition-all duration-300 z-20",
            isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
          )}>
            <button className="p-3 bg-white rounded-full text-black hover:bg-black hover:text-white transition-all duration-300 shadow-lg transform translate-y-4 group-hover:translate-y-0">
              <Heart size={18} />
            </button>
            <button 
              onClick={() => setIsQuickViewOpen(true)}
              className="p-3 bg-white rounded-full text-black hover:bg-black hover:text-white transition-all duration-300 shadow-lg transform translate-y-4 group-hover:translate-y-0 delay-75"
            >
              <Eye size={18} />
            </button>
            <button className="p-3 bg-white rounded-full text-black hover:bg-black hover:text-white transition-all duration-300 shadow-lg transform translate-y-4 group-hover:translate-y-0 delay-150">
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={12} 
                fill={i < Math.floor(product.rating) ? "currentColor" : "none"} 
                className={i < Math.floor(product.rating) ? "" : "text-gray-300"}
              />
            ))}
          </div>
          <span className="text-[10px] text-gray-400 font-medium">({product.reviews})</span>
        </div>

        <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {product.title}
        </h3>

        <div className="flex items-center gap-2 mb-4">
          {product.salePrice ? (
            <>
              <span className="text-lg font-bold text-red-600">${product.salePrice.toFixed(2)}</span>
              <span className="text-sm text-gray-400 line-through">${product.price.toFixed(2)}</span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
          )}
        </div>

        {/* Sizes */}
        <div className="mb-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Select Size</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "w-8 h-8 rounded-md text-[10px] font-bold border transition-all duration-300",
                  selectedSize === size 
                    ? "bg-black text-white border-black" 
                    : "bg-white text-gray-600 border-gray-200 hover:border-black"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Color: <span className="text-gray-900">{selectedColor}</span></p>
          <div className="flex gap-2">
            {product.colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                className={cn(
                  "w-6 h-6 rounded-full border-2 transition-all duration-300 p-0.5",
                  selectedColor === color.name ? "border-black" : "border-transparent"
                )}
              >
                <div 
                  className="w-full h-full rounded-full border border-gray-100" 
                  style={{ backgroundColor: color.hex }}
                />
              </button>
            ))}
          </div>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {isQuickViewOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsQuickViewOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
            >
              <button
                onClick={() => setIsQuickViewOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-md hover:bg-white transition-colors text-gray-500 hover:text-black z-10 shadow-sm"
              >
                <X size={20} />
              </button>

              {/* Product Image */}
              <div className="w-full md:w-1/2 aspect-[3/4] md:aspect-auto bg-gray-50">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Product Details */}
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-1 mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        fill={i < Math.floor(product.rating) ? "currentColor" : "none"} 
                        className={i < Math.floor(product.rating) ? "" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400 font-medium">({product.reviews} reviews)</span>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                  {product.title}
                </h2>

                <div className="flex items-center gap-3 mb-6">
                  {product.salePrice ? (
                    <>
                      <span className="text-2xl font-bold text-red-600">${product.salePrice.toFixed(2)}</span>
                      <span className="text-lg text-gray-400 line-through">${product.price.toFixed(2)}</span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                  )}
                </div>

                <p className="text-gray-500 mb-8 leading-relaxed">
                  {product.description || "Experience premium quality and timeless style with this exclusive piece from zFour. Crafted with attention to detail and designed for comfort, it's the perfect addition to your modern wardrobe."}
                </p>

                {/* Sizes Selection in Modal */}
                <div className="mb-6">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Select Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "w-10 h-10 rounded-lg text-xs font-bold border transition-all duration-300",
                          selectedSize === size 
                            ? "bg-black text-white border-black" 
                            : "bg-white text-gray-600 border-gray-200 hover:border-black"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors Selection in Modal */}
                <div className="mb-8">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Color: <span className="text-gray-900">{selectedColor}</span></p>
                  <div className="flex gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={cn(
                          "w-8 h-8 rounded-full border-2 transition-all duration-300 p-0.5",
                          selectedColor === color.name ? "border-black" : "border-transparent"
                        )}
                      >
                        <div 
                          className="w-full h-full rounded-full border border-gray-100" 
                          style={{ backgroundColor: color.hex }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-black/20 flex items-center justify-center gap-2">
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
                  <button className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-gray-600">
                    <Heart size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export const FashionCollection = () => {
  const { products: contextProducts } = useProducts();

  // Map context products to ProductProps format
  const products: ProductProps[] = contextProducts
    .filter(p => p.category === 'Fashion' || p.category === 'Trending')
    .map(p => ({
      id: p.id,
      image: p.mainImage,
      title: p.name,
      price: p.regularPrice,
      salePrice: p.salePrice,
      sizes: p.sizes || ['S', 'M', 'L', 'XL'],
      colors: p.colors ? p.colors.map(c => ({ 
        name: typeof c === 'string' ? c : c.name, 
        hex: typeof c === 'string' ? '#000000' : c.hex 
      })) : [{ name: 'Black', hex: '#000000' }],
      stockBadge: p.stockStatus === 'In Stock' ? 'New' : 'Out of Stock',
      rating: 4.5 + Math.random() * 0.5, // Mock rating if not present
      reviews: Math.floor(Math.random() * 200) + 50, // Mock reviews if not present
      description: p.fullDescription
    }));

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Trending Collection</h2>
          <p className="text-sm text-gray-500">Discover the latest fashion trends handpicked for you</p>
        </div>
        <button className="text-sm font-bold border-b-2 border-black hover:text-gray-600 hover:border-gray-400 transition-all">
          View All Products
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <FashionProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default FashionProductCard;
