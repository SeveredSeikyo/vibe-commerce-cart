
import axios from 'axios';
import type { Product, CartItem, CartData, Receipt, User } from '../types';

// The backend server runs on port 5000.
// The frontend must target this specific origin for API calls during development.
const baseURL = 'http://localhost:5000/api';

export const API = axios.create({ 
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Auth
export const login = async (credentials: {username: string, password: string}): Promise<{token: string, user: User}> => {
    const { data } = await API.post('/auth/login', credentials);
    return data;
};

// Products
export const getProducts = async (): Promise<Product[]> => {
    const { data } = await API.get<Product[]>('/products');
    return data;
};

// Cart
export const getCart = async (): Promise<CartData> => {
    const { data } = await API.get<CartData>('/cart');
    return data;
};

export const addToCart = async (item: { productId: number; qty: number; }): Promise<CartItem[]> => {
    const { data } = await API.post<CartItem[]>('/cart', { productId: item.productId, qty: item.qty });
    return data;
};

export const removeFromCart = async (id: number): Promise<CartItem[]> => {
    const { data } = await API.delete<CartItem[]>(`/cart/${id}`);
    return data;
};

// Checkout
export const checkout = async (cartItems: CartItem[]): Promise<Receipt> => {
    const { data } = await API.post<Receipt>('/checkout', { cartItems });
    return data;
};