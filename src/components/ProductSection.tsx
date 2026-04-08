import React from 'react';
import ProductCard from './ProductCard';
import { useProducts } from '../context/ProductContext';

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  limit?: number;
  category?: string;
  addToCart?: (product: any) => void;
}

export default function ProductSection({ title, subtitle, limit = 8, category, addToCart }: ProductSectionProps) {
  const { products: allProducts, loading } = useProducts();

  const products = allProducts
    .filter(p => !category || p.category === category)
    .slice(0, limit);

  if (loading) {
    return (
      <section className="py-16 max-w-7xl mx-auto px-4" id={title.toLowerCase().replace(/\s+/g, '-')}>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">{title}</h2>
          <div className="w-20 h-1 bg-accent mx-auto mt-6"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="bg-gray-100 animate-pulse rounded-3xl h-96"></div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 max-w-7xl mx-auto px-4" id={title.toLowerCase().replace(/\s+/g, '-')}>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">{title}</h2>
        {subtitle && <p className="text-gray-500 max-w-2xl mx-auto">{subtitle}</p>}
        <div className="w-20 h-1 bg-accent mx-auto mt-6"></div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No products found in this section.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} />
          ))}
        </div>
      )}
    </section>
  );
}
