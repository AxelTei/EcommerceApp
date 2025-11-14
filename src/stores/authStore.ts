// src/stores/authStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthState, LoginCredentials, SignupData } from '../types';

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
}

const STORAGE_KEY = '@auth_token';
const USER_KEY = '@user_data';

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (credentials) => {
    set({ isLoading: true });
    
    try {
      // Simulation API (on remplacera par de vraies requêtes plus tard)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock user
      const mockUser: User = {
        id: '1',
        email: credentials.email,
        firstName: 'John',
        lastName: 'Doe',
        avatar: 'https://i.pravatar.cc/150?img=1',
        createdAt: new Date(),
      };
      
      const mockToken = 'mock_jwt_token_' + Date.now();
      
      // Sauvegarder dans AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEY, mockToken);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(mockUser));
      
      set({
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signup: async (data) => {
    set({ isLoading: true });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newUser: User = {
        id: Date.now().toString(),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        createdAt: new Date(),
      };
      
      const mockToken = 'mock_jwt_token_' + Date.now();
      
      await AsyncStorage.setItem(STORAGE_KEY, mockToken);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(newUser));
      
      set({
        user: newUser,
        token: mockToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      await AsyncStorage.removeItem(USER_KEY);
      
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  loadUser: async () => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEY);
      const userData = await AsyncStorage.getItem(USER_KEY);
      
      if (token && userData) {
        set({
          user: JSON.parse(userData),
          token,
          isAuthenticated: true,
        });
      }
    } catch (error) {
      console.error('Load user error:', error);
    }
  },
}));