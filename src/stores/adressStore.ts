// src/stores/addressStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Address } from '../types';

interface AddressStore {
  addresses: Address[];
  addAddress: (address: Omit<Address, 'id' | 'userId' | 'isDefault'>) => Promise<void>;
  removeAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
  loadAddresses: () => Promise<void>;
}

const ADDRESSES_KEY = '@addresses';

export const useAddressStore = create<AddressStore>((set, get) => ({
  addresses: [],

  addAddress: async (addressData) => {
    const { addresses } = get();
    
    const newAddress: Address = {
      id: Date.now().toString(),
      userId: '1', // Mock user ID
      ...addressData,
      isDefault: addresses.length === 0, // First address is default
    };

    const updatedAddresses = [...addresses, newAddress];
    set({ addresses: updatedAddresses });
    await AsyncStorage.setItem(ADDRESSES_KEY, JSON.stringify(updatedAddresses));
  },

  removeAddress: async (id) => {
    const { addresses } = get();
    const updatedAddresses = addresses.filter(addr => addr.id !== id);
    
    // Si on supprime l'adresse par défaut et qu'il reste des adresses
    if (addresses.find(a => a.id === id)?.isDefault && updatedAddresses.length > 0) {
      updatedAddresses[0].isDefault = true;
    }
    
    set({ addresses: updatedAddresses });
    await AsyncStorage.setItem(ADDRESSES_KEY, JSON.stringify(updatedAddresses));
  },

  setDefaultAddress: async (id) => {
    const { addresses } = get();
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
    }));
    
    set({ addresses: updatedAddresses });
    await AsyncStorage.setItem(ADDRESSES_KEY, JSON.stringify(updatedAddresses));
  },

  loadAddresses: async () => {
    try {
      const data = await AsyncStorage.getItem(ADDRESSES_KEY);
      if (data) {
        set({ addresses: JSON.parse(data) });
      }
    } catch (error) {
      console.error('Load addresses error:', error);
    }
  },
}));