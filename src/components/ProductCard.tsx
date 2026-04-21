import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Eye, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatPrice } from '../lib/utils';

/**
 * Utility for merging tailwind classes
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ProductCardProps {
  product: Product;
  addToCart?: (product: Product) => void;
  viewMode?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, addToCart, viewMode = 'grid' }) => {
  const discount = product.regularPrice > product.salePrice 
    ? Math.round(((product.regularPrice - product.salePrice) / product.regularPrice) * 100)
    : 0;

  if (viewMode === 'list') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-stone-100 group hover:shadow-xl transition-all duration-500 overflow-hidden"
      >
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="relative w-full md:w-64 aspect-[4/3] overflow-hidden rounded-[2rem] bg-gray-50 flex-shrink-0">
            <img 
              src={product.mainImage || 'https://picsum.photos/seed/product/400/400'} 
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            {discount > 0 && (
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-accent text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">
                  -{discount}%
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">{product.category}</span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} className={cn(i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-200")} />
                ))}
              </div>
            </div>

            <Link to={`/product/${product.id}`}>
              <h3 className="text-2xl font-black text-primary hover:text-accent transition-colors tracking-tight">{product.name}</h3>
            </Link>

            <p className="text-gray-500 text-sm font-medium line-clamp-2 leading-relaxed">
              {product.fullDescription || "Elegant fashion piece designed for modern style and comfort. Crafted with premium materials for a luxurious feel." }
            </p>

            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-primary">{formatPrice(product.salePrice)}</span>
                {product.regularPrice > product.salePrice && (
                  <span className="text-sm text-gray-400 line-through font-bold">{formatPrice(product.regularPrice)}</span>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => addToCart?.(product)}
                  className="px-8 py-3.5 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all shadow-lg shadow-primary/20 hover:shadow-accent/40 active:scale-95"
                >
                  Add to Cart
                </button>
                <button 
                  onClick={() => alert(`Added ${product.name} to wishlist!`)}
                  className="p-3.5 bg-linen text-primary rounded-2xl hover:bg-accent hover:text-white transition-all shadow-sm active:scale-95"
                >
                  <Heart size={18} />
                </button>
                <Link 
                  to={`/product/${product.id}`}
                  className="p-3.5 bg-linen text-primary rounded-2xl hover:bg-accent hover:text-white transition-all shadow-sm active:scale-95 flex items-center justify-center"
                >
                  <Eye size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-gray-50 group hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col h-full"
    >
      {/* Top Image Section - Full container as requested */}
      <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-gray-50 border border-gray-100/50 flex items-center justify-center">
        <img 
          src={product.mainImage || 'https://picsum.photos/seed/product/400/400'} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {discount > 0 && (
            <span className="bg-accent text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
              -{discount}%
            </span>
          )}
          {(product.status === 'Featured' || (product as any).isTrending) && (
            <span className="bg-primary text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg border border-white/20">
              Hot
            </span>
          )}
        </div>

        {/* Quick Actions (Overlay) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <button 
            onClick={() => alert(`Added ${product.name} to wishlist!`)}
            className="p-3 bg-white rounded-full text-primary hover:bg-accent hover:text-white transition-all shadow-xl shadow-black/10"
          >
            <Heart size={16} />
          </button>
          <Link 
            to={`/product/${product.id}`}
            className="p-3 bg-white rounded-full text-primary hover:bg-accent hover:text-white transition-all shadow-xl shadow-black/10"
          >
            <Eye size={16} />
          </Link>
        </div>
      </div>

      {/* Info Area - Based on image structure */}
      <div className="pt-6 px-2 flex flex-col flex-1">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-black text-primary line-clamp-1 hover:text-accent transition-colors leading-tight mb-2 uppercase tracking-tighter">
            {product.name}
          </h3>
        </Link>
        
        {/* Attributes: category • SKU • etc */}
        <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 mb-3 uppercase tracking-wider">
          <span>{product.category}</span>
          <span className="w-1 h-1 rounded-full bg-gray-200" />
          <span>{product.sku || 'ZF-Boutique'}</span>
          <span className="w-1 h-1 rounded-full bg-gray-200" />
          <span>Premium</span>
        </div>

        {/* Rating Section */}
        <div className="flex items-center gap-1.5 mb-4">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className={cn(i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-200")} />
            ))}
          </div>
          <span className="text-xs font-black text-gray-900 ml-1">4.5</span>
          <span className="text-xs font-medium text-gray-400">(22 reviews)</span>
        </div>

        {/* Stock Status */}
        <div className="mb-4">
          <span className={cn(
            "text-[11px] font-bold uppercase tracking-widest",
            product.quantity > 0 ? "text-green-500" : "text-sale"
          )}>
            {product.quantity > 0 ? `In-Stock (${product.quantity})` : 'Out of Stock'}
          </span>
        </div>

        {/* Price & Cart Button Area (Bottom Align) */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-primary">{formatPrice(product.salePrice)}</span>
              {product.regularPrice > product.salePrice && (
                <span className="text-xs text-gray-400 line-through font-bold">{formatPrice(product.regularPrice)}</span>
              )}
            </div>
          </div>
          <button 
            onClick={() => addToCart?.(product)}
            className="w-12 h-12 rounded-full rose-gradient text-white shadow-lg shadow-accent/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group/btn"
          >
            <ShoppingCart size={20} className="group-hover/btn:animate-bounce" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
