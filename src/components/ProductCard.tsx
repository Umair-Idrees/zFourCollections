import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Eye, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';

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
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img 
          src={product.mainImage || 'https://picsum.photos/seed/product/400/400'} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              -{discount}%
            </span>
          )}
          {product.status === 'Featured' && (
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              Featured
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button className="p-2.5 bg-white rounded-full text-gray-700 hover:bg-blue-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 shadow-lg">
            <Heart className="w-5 h-5" />
          </button>
          <Link to={`/product/${product.id}`} className="p-2.5 bg-white rounded-full text-gray-700 hover:bg-blue-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 delay-75 shadow-lg">
            <Eye className="w-5 h-5" />
          </Link>
          <button 
            onClick={() => addToCart?.(product)}
            className="p-2.5 bg-white rounded-full text-gray-700 hover:bg-blue-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 delay-150 shadow-lg"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mb-1">
          {product.category}
        </div>
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 hover:text-blue-600 transition-colors h-10">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-3 h-3 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
          ))}
          <span className="text-[10px] text-gray-400 ml-1">(4.0)</span>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">${product.salePrice}</span>
              {product.regularPrice > product.salePrice && (
                <span className="text-xs text-gray-400 line-through">${product.regularPrice}</span>
              )}
            </div>
            <p className="text-[10px] text-green-600 font-medium mt-0.5">Free Delivery</p>
          </div>
          <button 
            onClick={() => addToCart?.(product)}
            className="bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-700 p-2 rounded-lg transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
