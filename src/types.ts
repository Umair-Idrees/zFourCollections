export interface Product {
  id?: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  sku: string;
  category: string;
  subcategory?: string;
  brand?: string;
  tags: string[];
  regularPrice: number;
  salePrice: number;
  discountPercentage: number;
  quantity: number;
  stockStatus: 'In Stock' | 'Out of Stock' | 'Low Stock';
  lowStockAlert: number;
  mainImage: string;
  galleryImages: string[];
  thumbnailImage: string;
  colors: string[];
  sizes: string[];
  material?: string;
  model?: string;
  weight?: string;
  dimensions?: string;
  deliveryDays: number;
  status: 'Active' | 'Draft' | 'Featured';
  createdAt: any;
  updatedAt: any;
}

export interface Category {
  id?: string;
  name: string;
  slug?: string;
  image: string;
  count?: number;
  productCount?: number;
}

export interface Banner {
  id?: string;
  title: string;
  subtitle: string;
  description?: string;
  image: string;
  link: string;
  cta?: string;
  type: 'Home Slider' | 'Flash Sale' | 'Promo';
  active: boolean;
  createdAt?: any;
}

export interface Order {
  id?: string;
  orderId: string;
  customerId: string;
  customerName: string;
  items: any[];
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: string;
  shippingAddress: any;
  createdAt: any;
}
