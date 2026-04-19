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

  // Fallback Dummy Products for Trending Highlights
  const fallbackProducts = [
    {
      id: 'best-1',
      name: 'Floral Boutique Maxi',
      mainImage: 'https://img.freepik.com/free-photo/portrait-young-stylish-girl-model-casual-summer-clothes-brown-hat-with-natural-makeup-glasses-isolated_158538-8562.jpg',
      category: 'BOUTIQUE',
      regularPrice: 145.00,
      salePrice: 115.00,
      fullDescription: 'Hand-crafted floral dress with delicate patterns and premium fabric.',
      stockStatus: 'In Stock',
      quantity: 15,
      isTrending: true
    },
    {
      id: 'best-2',
      name: 'Chic Denim & Floral Mix',
      mainImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDtlimnu5VN4jKnHDDtykPPcriyIiVXzYWhA&s',
      category: 'READY-TO-WEAR',
      regularPrice: 65.00,
      salePrice: 48.00,
      fullDescription: 'Contemporary mix of denim and floral prints for a modern boutique look.',
      stockStatus: 'In Stock',
      quantity: 25
    },
    {
      id: 'best-3',
      name: 'Country Tiered Set',
      mainImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiWPNAO3EvRsK9CJX4Feug6WaefYlGoPOvow&s',
      category: 'UNSTITCHED',
      regularPrice: 110.00,
      salePrice: 89.00,
      fullDescription: 'Vibrant tiered set with classic country-chic detailing.',
      stockStatus: 'In Stock',
      quantity: 10
    },
    {
      id: 'best-4',
      name: 'Vintage Ruffle Dress',
      mainImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYHyAO9kJDOmgNAtKn9Vk2s3QlD-iOYomSIA&s',
      category: 'WESTERN',
      regularPrice: 75.00,
      salePrice: 59.00,
      fullDescription: 'Romantic western-style dress with delicate ruffles.',
      stockStatus: 'In Stock',
      quantity: 20
    }
  ];

  const filteredProducts = allProducts
    .filter(p => !category || p.category === category)
    .slice(0, limit);
  
  const productsToDisplay = filteredProducts.length > 0 ? filteredProducts : fallbackProducts;

  if (loading) {
    return (
      <section className="py-24 max-w-[1440px] mx-auto px-4" id={title.toLowerCase().replace(/\s+/g, '-')}>
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-primary mb-3">{title}</h2>
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
    <section className="py-16 max-w-[1440px] mx-auto px-4" id={title.toLowerCase().replace(/\s+/g, '-')}>
      <div className="text-center mb-16 px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-primary uppercase tracking-tight leading-none mb-6">
          {title.split(' ')[0]} <span className="text-accent underline decoration-4 underline-offset-8 decoration-accent/30">{title.split(' ').slice(1).join(' ')}</span>
        </h2>
        {subtitle && (
          <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-2xl mx-auto italic">
            {subtitle}
          </p>
        )}
      </div>

      {productsToDisplay.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No products found in this section.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {productsToDisplay.map((product) => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} />
          ))}
        </div>
      )}
    </section>
  );
}
