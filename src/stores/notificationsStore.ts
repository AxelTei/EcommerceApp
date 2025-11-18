// src/stores/notificationsStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type NotificationType = 'order' | 'promo' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  data?: any;
}

interface NotificationsStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  loadNotifications: () => Promise<void>;
}

const NOTIFICATIONS_KEY = '@notifications';

export const useNotificationsStore = create<NotificationsStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: async (notificationData) => {
    const { notifications } = get();
    
    const newNotification: Notification = {
      id: Date.now().toString(),
      createdAt: new Date(),
      read: false,
      ...notificationData,
    };

    const updatedNotifications = [newNotification, ...notifications];
    
    set({ 
      notifications: updatedNotifications,
      unreadCount: get().unreadCount + 1,
    });
    
    await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
  },

  markAsRead: async (id) => {
    const { notifications } = get();
    const updatedNotifications = notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    );
    
    const unreadCount = updatedNotifications.filter(n => !n.read).length;
    
    set({ notifications: updatedNotifications, unreadCount });
    await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
  },

  markAllAsRead: async () => {
    const { notifications } = get();
    const updatedNotifications = notifications.map(notif => ({ ...notif, read: true }));
    
    set({ notifications: updatedNotifications, unreadCount: 0 });
    await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
  },

  deleteNotification: async (id) => {
    const { notifications } = get();
    const notifToDelete = notifications.find(n => n.id === id);
    const updatedNotifications = notifications.filter(notif => notif.id !== id);
    
    set({ 
      notifications: updatedNotifications,
      unreadCount: notifToDelete && !notifToDelete.read ? get().unreadCount - 1 : get().unreadCount,
    });
    
    await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
  },

  loadNotifications: async () => {
    try {
      const data = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
      if (data) {
        const notifications = JSON.parse(data);
        const notificationsWithDates = notifications.map((notif: any) => ({
          ...notif,
          createdAt: new Date(notif.createdAt),
        }));
        
        const unreadCount = notificationsWithDates.filter((n: Notification) => !n.read).length;
        
        set({ notifications: notificationsWithDates, unreadCount });
      }
    } catch (error) {
      console.error('Load notifications error:', error);
    }
  },
}));