// src/stores/orderStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Order } from '../types';

interface OrderStore {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'estimatedDelivery' | 'trackingNumber'>) => Promise<void>;
  loadOrders: () => Promise<void>;
}

const ORDERS_KEY = '@orders';

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],

  addOrder: async (orderData) => {
    const allOrdersData = await AsyncStorage.getItem(ORDERS_KEY);
    const allOrders = allOrdersData ? JSON.parse(allOrdersData) : [];
    
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      createdAt: new Date(),
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      trackingNumber: `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    };

    const updatedAllOrders = [newOrder, ...allOrders];
    await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(updatedAllOrders));
    
    // Recharger les commandes du user actuel
    await get().loadOrders();
  },

  loadOrders: async () => {
    try {
      const allOrdersData = await AsyncStorage.getItem(ORDERS_KEY);
      const userData = await AsyncStorage.getItem('@user_data');
      
      if (!allOrdersData || !userData) {
        set({ orders: [] });
        return;
      }

      const allOrders = JSON.parse(allOrdersData);
      const currentUser = JSON.parse(userData);
      
      // Filtrer les commandes du user connecté
      const userOrders = allOrders.filter((order: any) => order.userId === currentUser.id);
      
      // Convertir les dates
      const ordersWithDates = userOrders.map((order: any) => ({
        ...order,
        createdAt: new Date(order.createdAt),
        estimatedDelivery: order.estimatedDelivery ? new Date(order.estimatedDelivery) : undefined,
      }));
      
      set({ orders: ordersWithDates });
    } catch (error) {
      console.error('Load orders error:', error);
      set({ orders: [] });
    }
  },
}));