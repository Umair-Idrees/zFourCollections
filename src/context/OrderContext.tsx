import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  db, 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  where,
  doc,
  updateDoc,
  deleteDoc,
  handleFirestoreError,
  OperationType,
  auth
} from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  email: string;
  items: OrderItem[];
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: string;
  shippingAddress: {
    address: string;
    city: string;
    zipCode: string;
    phone: string;
  };
  createdAt: any;
}

interface OrderContextType {
  orders: Order[];
  userOrders: Order[];
  loading: boolean;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
    });
    return () => unsubscribeAuth();
  }, []);

  // Admin: Listen to all orders only if authenticated (and possibly admin)
  useEffect(() => {
    // If not logged in, don't even try to fetch all orders
    if (!userId) {
      setOrders([]);
      setLoading(false);
      return;
    }

    // Optional: Only fetch if user email matches the admin email known from rules
    // This prevents noise for regular users, though the rules would block it anyway
    const adminEmail = "umairmayo607@gmail.com";
    const currentUser = auth.currentUser;
    if (currentUser?.email !== adminEmail) {
      // If we are sure they aren't the primary admin by email, we might still check DB roles later
      // For now, we'll try it if they are logged in, but handle the permission error silently for non-admins
    }

    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      // Only log/throw if it's not a permission error for a non-admin user
      if (error.message.includes('permission-denied') || error.message.includes('Missing or insufficient permissions')) {
        console.warn("User does not have permission to view all orders. This is expected for non-admin users.");
        setOrders([]);
      } else {
        handleFirestoreError(error, OperationType.LIST, 'orders');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  // User: Listen to their own orders
  useEffect(() => {
    if (!userId) {
      setUserOrders([]);
      return;
    }

    const q = query(
      collection(db, 'orders'), 
      where('customerId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setUserOrders(ordersData);
    }, (error) => {
      // If permission denied, it might be because the user is not the owner or index is missing
      // We handle it gracefully for the user dashboard
      console.error("Error fetching user orders:", error);
    });

    return () => unsubscribe();
  }, [userId]);

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await deleteDoc(orderRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `orders/${orderId}`);
    }
  };

  return (
    <OrderContext.Provider value={{ orders, userOrders, loading, updateOrderStatus, deleteOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
