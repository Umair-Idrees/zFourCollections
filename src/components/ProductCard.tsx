import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Eye, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for merging tailwind classes
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ProductCardProps {
  product: Product;
  addToCart?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, addToCart }) => {
  const discount = product.regularPrice > product.salePrice 
    ? Math.round(((product.regularPrice - product.salePrice) / product.regularPrice) * 100)
    : 0;

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group transition-all hover:shadow-md"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
        <img 
          src={product.mainImage || 'https://picsum.photos/seed/product/400/400'} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          <div className="flex gap-2 items-center">
            {discount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                -{discount}%
              </span>
            )}
            {(product.status === 'Featured' || (product as any).isTrending) && (
              <span className="bg-black text-accent text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg border border-accent/30">
                Trending
              </span>
            )}
          </div>
        </div>

        {/* Quick Actions (All cards get this) */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4 backdrop-blur-[2px]">
          <button className="p-3 bg-white rounded-full text-gray-900 hover:bg-accent hover:text-white transition-all transform translate-y-8 group-hover:translate-y-0 shadow-xl">
            <Heart className={cn("w-5 h-5", (product as any).isTrending && "fill-red-500 text-red-500")} />
          </button>
          <Link to={`/product/${product.id}`} className="p-3 bg-white rounded-full text-gray-900 hover:bg-accent hover:text-white transition-all transform translate-y-8 group-hover:translate-y-0 delay-75 shadow-xl">
            <Eye className="w-5 h-5" />
          </Link>
          <button 
            onClick={() => addToCart?.(product)}
            className="p-3 bg-white rounded-full text-gray-900 hover:bg-accent hover:text-white transition-all transform translate-y-8 group-hover:translate-y-0 delay-150 shadow-xl"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Info Area with Gradient */}
      <div className="p-5 bg-gradient-to-br from-red-50/30 to-white relative">
        <div className="text-[10px] text-accent font-black uppercase tracking-[0.2em] mb-2">
          {product.category}
        </div>
        <Link to={`/product/${product.id}`} className="block mb-2 group/title">
          <h3 className="text-sm font-black text-primary line-clamp-1 group-hover/title:text-accent transition-colors leading-tight">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} className={cn(i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-200")} />
          ))}
          <span className="text-[10px] text-gray-400 ml-1 font-bold">(4.0)</span>
        </div>

        <div className="flex items-end justify-between border-t border-red-100/50 pt-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-primary">${product.salePrice}</span>
              {product.regularPrice > product.salePrice && (
                <span className="text-xs text-gray-400 line-through font-bold">${product.regularPrice}</span>
              )}
            </div>
            <p className="text-[10px] text-accent font-black uppercase tracking-wider mt-1">Free Delivery</p>
          </div>
          <button 
            onClick={() => addToCart?.(product)}
            className="bg-white border border-red-100 hover:bg-accent hover:text-white text-primary w-10 h-10 rounded-2xl transition-all shadow-sm flex items-center justify-center active:scale-95"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
