export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;
}

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  qty: number;
}

export interface CartData {
  cart: CartItem[];
  total: number;
}

export interface Receipt {
  id: string;
  total: number;
  date: string;
  items: CartItem[];
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface User {
  id: number;
  username: string;
}

export interface CartContextType {
  cartItems: (CartItem & { image?: string })[];
  total: number;
  itemCount: number;
  isLoading: boolean;
  addToCart: (product: Product, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateCartItemQuantity: (productId: number, quantity: number) => Promise<void>;
  checkout: (cartItems: CartItem[]) => Promise<Receipt | null>;
  clearCart: () => void;
  fetchCart: () => Promise<void>;
}
