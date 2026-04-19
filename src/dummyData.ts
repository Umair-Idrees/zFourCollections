import { Order } from './context/OrderContext';

export const DUMMY_ORDERS: any[] = [
  {
    id: 'o1',
    orderId: '#10234',
    customerId: 'demo-user-456',
    customerName: 'Sarah Johnson',
    email: 'sarah@example.com',
    items: [
      { id: 'p1', name: 'Premium Wireless Headphones', price: 299.99, quantity: 1, image: 'https://picsum.photos/seed/headphones/200/200' }
    ],
    total: 299.99,
    status: 'Shipped',
    paymentMethod: 'Visa',
    shippingAddress: { address: '123 Fashion Blvd', city: 'London', zipCode: 'W1A 1AA', phone: '+1 234 567 890' },
    createdAt: new Date().toISOString()
  },
  {
    id: 'o2',
    orderId: '#10229',
    customerId: 'c2',
    customerName: 'Michael Chen',
    email: 'mchen@example.com',
    items: [
      { id: 'p2', name: 'Minimalist Leather Watch', price: 189.00, quantity: 1, image: 'https://picsum.photos/seed/watch/200/200' }
    ],
    total: 189.00,
    status: 'Delivered',
    paymentMethod: 'Mastercard',
    shippingAddress: { address: '456 Tech Lane', city: 'San Francisco', zipCode: '94105', phone: '+1 234 567 891' },
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'o3',
    orderId: '#10215',
    customerId: 'demo-user-456',
    customerName: 'Emma Wilson',
    email: 'emma@example.com',
    items: [
      { id: 'p3', name: 'Ultra-Slim Laptop Pro', price: 1299.99, quantity: 1, image: 'https://picsum.photos/seed/laptop/200/200' }
    ],
    total: 1299.99,
    status: 'Pending',
    paymentMethod: 'PayPal',
    shippingAddress: { address: '789 Creative Crt', city: 'Berlin', zipCode: '10115', phone: '+1 234 567 892' },
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
];
