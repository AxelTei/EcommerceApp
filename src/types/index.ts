// src/types/index.ts

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  createdAt: Date;
}

export interface Address {
  id: string;
  userId: string;
  label: string; // "Maison", "Travail", etc.
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: Category;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  variants?: ProductVariant[];
  sizes?: string[];
  colors?: string[];
  brand?: string;
  tags?: string[];
}

export interface ProductVariant {
  id: string;
  size?: string;
  color?: string;
  price: number;
  stock: number;
}

export type Category = 
  | 'electronics'
  | 'clothing'
  | 'shoes'
  | 'accessories'
  | 'home'
  | 'sports'
  | 'beauty';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  variantId?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  discount?: number;
  status: OrderStatus;
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  createdAt: Date;
  estimatedDelivery?: Date;
  trackingNumber?: string;
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface PaymentMethod {
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
  last4?: string;
  brand?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: Date;
  helpful: number;
}

export interface PromoCode {
  code: string;
  discount: number; // Pourcentage ou montant fixe
  type: 'percentage' | 'fixed';
  minAmount?: number;
  expiresAt?: Date;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}