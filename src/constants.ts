import { Product, Category } from './types';

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Electronics', image: 'https://picsum.photos/seed/electronics/400/400', count: 120 },
  { id: '2', name: 'Fashion', image: 'https://picsum.photos/seed/fashion/400/400', count: 85 },
  { id: '3', name: 'Watches', image: 'https://picsum.photos/seed/watches/400/400', count: 45 },
  { id: '4', name: 'Shoes', image: 'https://picsum.photos/seed/shoes/400/400', count: 62 },
  { id: '5', name: 'Accessories', image: 'https://picsum.photos/seed/accessories/400/400', count: 38 },
  { id: '6', name: 'Mobile Phones', image: 'https://picsum.photos/seed/mobile/400/400', count: 94 },
  { id: '7', name: 'Laptops', image: 'https://picsum.photos/seed/laptop/400/400', count: 56 },
];

export const PRODUCTS: any[] = [
  {
    id: 'p1',
    name: 'Premium Wireless Headphones',
    regularPrice: 349.99,
    salePrice: 299.99,
    mainImage: 'https://picsum.photos/seed/headphones/600/600',
    category: 'Electronics',
    quantity: 50,
    stockStatus: 'In Stock',
    status: 'Active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'p2',
    name: 'Minimalist Leather Watch',
    regularPrice: 189.00,
    salePrice: 189.00,
    mainImage: 'https://picsum.photos/seed/watch/600/600',
    category: 'Watches',
    quantity: 10,
    stockStatus: 'Low Stock',
    status: 'Active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'p3',
    name: 'Ultra-Slim Laptop Pro',
    regularPrice: 1499.99,
    salePrice: 1299.99,
    mainImage: 'https://picsum.photos/seed/laptop-pro/600/600',
    category: 'Laptops',
    quantity: 5,
    stockStatus: 'Low Stock',
    status: 'Featured',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'p4',
    name: 'Smart Fitness Tracker',
    regularPrice: 79.99,
    salePrice: 79.99,
    mainImage: 'https://picsum.photos/seed/fitness/600/600',
    category: 'Accessories',
    quantity: 100,
    stockStatus: 'In Stock',
    status: 'Active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
];
