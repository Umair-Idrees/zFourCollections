/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import FashionHeroSection from './components/FashionHeroSection';
import GirlsCollection from './components/GirlsCollection';
import { FashionCollection } from './components/FashionProductCard';
import CategoryGrid from './components/CategoryGrid';
import ProductSection from './components/ProductSection';
import SpecialOffer from './components/SpecialOffer';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductDetail from './pages/ProductDetail';
import Blog from './pages/Blog';
import Contact from './pages/Contact';

function HomePage({ addToCart, cart }: { addToCart: (product: any) => void, cart: any[] }) {
  const [selectedCategory, setSelectedCategory] = React.useState<string | undefined>(undefined);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header cart={cart} />
      
      <main className="flex-grow">
        {/* Fashion Hero Section */}
        <FashionHeroSection />

        {/* Girls' Specialized Collection */}
        <GirlsCollection />


        {/* Trending Collection Section */}
        <ProductSection 
          title="Trending Girls' Collection" 
          subtitle="Discover our most sought-after boutique pieces. Hand-picked trending styles for the modern generation."
          limit={4}
          addToCart={addToCart}
        />

        {/* Categories Section */}
        <CategoryGrid onSelectCategory={(cat) => setSelectedCategory(cat)} />

        {/* Special Offer Banner */}
        <SpecialOffer />


        {/* Newsletter Section */}
        <Newsletter />
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  const [cart, setCart] = useState<any[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error parsing cart from localStorage', e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: any, quantity: number = 1) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { 
        id: product.id, 
        name: product.name, 
        salePrice: product.salePrice || product.regularPrice, 
        image: product.mainImage, 
        category: product.category,
        quantity 
      }];
    });
  };

  return (
    <Routes>
      <Route path="/" element={<HomePage addToCart={addToCart} cart={cart} />} />
      <Route path="/shop" element={
        <div className="min-h-screen flex flex-col bg-white">
          <Header cart={cart} />
          <main className="flex-grow">
            <Shop addToCart={addToCart} />
          </main>
          <Footer />
        </div>
      } />
      <Route path="/cart" element={
        <div className="min-h-screen flex flex-col bg-white">
          <Header cart={cart} />
          <main className="flex-grow">
            <Cart cart={cart} setCart={setCart} />
          </main>
          <Footer />
        </div>
      } />
      <Route path="/checkout" element={
        <div className="min-h-screen flex flex-col bg-white">
          <Header cart={cart} />
          <main className="flex-grow">
            <Checkout cart={cart} />
          </main>
          <Footer />
        </div>
      } />
      <Route path="/product/:id" element={
        <div className="min-h-screen flex flex-col bg-white">
          <Header cart={cart} />
          <main className="flex-grow">
            <ProductDetail addToCart={addToCart} />
          </main>
          <Footer />
        </div>
      } />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/dashboard" element={<UserDashboard cart={cart} />} />
      <Route path="/blog" element={
        <div className="min-h-screen flex flex-col bg-white">
          <Header cart={cart} />
          <main className="flex-grow">
            <Blog />
          </main>
          <Footer />
        </div>
      } />
      <Route path="/contact" element={
        <div className="min-h-screen flex flex-col bg-white">
          <Header cart={cart} />
          <main className="flex-grow">
            <Contact />
          </main>
          <Footer />
        </div>
      } />
    </Routes>
  );
}
