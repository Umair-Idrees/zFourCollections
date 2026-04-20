import { Product, Category } from './types';

export const CATEGORIES: Category[] = [
  { id: '1', name: 'FABRICS (Unstitched)', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=400&auto=format&fit=crop', count: 120 },
  { id: '2', name: 'READY-TO-WEAR (Pret)', image: 'https://www.polkadots.pk/cdn/shop/files/Peach_3e6d7b4b-b270-443d-ac1d-f47acbfc0e10.jpg?v=1769846025&width=400', count: 85 },
  { id: '3', name: 'BOTTOMS & DUPATTAS', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=400&auto=format&fit=crop', count: 45 },
  { id: '4', name: 'BOUTIQUE', image: 'https://img.freepik.com/free-photo/portrait-young-stylish-girl-model-casual-summer-clothes-brown-hat-with-natural-makeup-glasses-isolated_158538-8562.jpg', count: 62 },
  { id: '5', name: 'WESTERN', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYHyAO9kJDOmgNAtKn9Vk2s3QlD-iOYomSIA&s', count: 38 },
];

export const PRODUCTS: any[] = [
  {
    id: 'p1',
    name: 'Floral Boutique Maxi',
    regularPrice: 145.00,
    salePrice: 115.00,
    mainImage: 'https://img.freepik.com/free-photo/portrait-young-stylish-girl-model-casual-summer-clothes-brown-hat-with-natural-makeup-glasses-isolated_158538-8562.jpg',
    category: 'BOUTIQUE',
    quantity: 50,
    stockStatus: 'In Stock',
    status: 'Active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'p2',
    name: 'Chic Denim & Floral Mix',
    regularPrice: 65.00,
    salePrice: 48.00,
    mainImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDtlimnu5VN4jKnHDDtykPPcriyIiVXzYWhA&s',
    category: 'READY-TO-WEAR (Pret)',
    quantity: 10,
    stockStatus: 'Low Stock',
    status: 'Active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'p3',
    name: 'Country Tiered Set',
    regularPrice: 110.00,
    salePrice: 89.00,
    mainImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiWPNAO3EvRsK9CJX4Feug6WaefYlGoPOvow&s',
    category: 'FABRICS (Unstitched)',
    quantity: 5,
    stockStatus: 'Low Stock',
    status: 'Featured',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'p4',
    name: 'Vintage Ruffle Dress',
    regularPrice: 75.00,
    salePrice: 59.00,
    mainImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYHyAO9kJDOmgNAtKn9Vk2s3QlD-iOYomSIA&s',
    category: 'WESTERN',
    quantity: 100,
    stockStatus: 'In Stock',
    status: 'Active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
];
