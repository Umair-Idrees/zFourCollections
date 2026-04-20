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
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
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
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
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
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
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
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    updatedAt: new Date()
  },
  {
    id: 'p5',
    name: 'Silk Dupatta Collection',
    regularPrice: 45.00,
    salePrice: 35.00,
    mainImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=400&auto=format&fit=crop',
    category: 'BOTTOMS & DUPATTAS',
    quantity: 25,
    stockStatus: 'In Stock',
    status: 'Active',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    updatedAt: new Date()
  },
  {
    id: 'p6',
    name: 'Embroidered Lawn Suit',
    regularPrice: 160.00,
    salePrice: 140.00,
    mainImage: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=400&auto=format&fit=crop',
    category: 'FABRICS (Unstitched)',
    quantity: 15,
    stockStatus: 'In Stock',
    status: 'Active',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
    updatedAt: new Date()
  },
  {
    id: 'p7',
    name: 'Modern Kurtis Set',
    regularPrice: 85.00,
    salePrice: 75.00,
    mainImage: 'https://www.polkadots.pk/cdn/shop/files/Peach_3e6d7b4b-b270-443d-ac1d-f47acbfc0e10.jpg?v=1769846025&width=400',
    category: 'READY-TO-WEAR (Pret)',
    quantity: 30,
    stockStatus: 'In Stock',
    status: 'Active',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    updatedAt: new Date()
  },
  {
    id: 'p8',
    name: 'Boutique Evening Gown',
    regularPrice: 250.00,
    salePrice: 199.00,
    mainImage: 'https://img.freepik.com/free-photo/gorgeous-woman-luxury-dress-red-background_158538-8314.jpg?w=400',
    category: 'BOUTIQUE',
    quantity: 8,
    stockStatus: 'Low Stock',
    status: 'Active',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12),
    updatedAt: new Date()
  },
  {
    id: 'p9',
    name: 'Stitched Cotton Trousers',
    regularPrice: 35.00,
    salePrice: 29.00,
    mainImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6s7qW_Xy9F1gOyx-6q2JvXWkK3v6e0z5yRg&s',
    category: 'BOTTOMS & DUPATTAS',
    quantity: 40,
    stockStatus: 'In Stock',
    status: 'Active',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
    updatedAt: new Date()
  },
  {
    id: 'p10',
    name: 'Western Jumpsuit',
    regularPrice: 95.00,
    salePrice: 85.00,
    mainImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7w_vE_Xq9F5y_O6zX7E_X5jXq7E_X5jXq7E&s',
    category: 'WESTERN',
    quantity: 20,
    stockStatus: 'In Stock',
    status: 'Active',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
    updatedAt: new Date()
  }
];
