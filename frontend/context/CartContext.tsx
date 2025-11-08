import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import type { Product, CartItem, CartContextType, Notification, Receipt } from '../types';
import * as api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext<CartContextType | undefined>(undefined);

const NotificationContext = createContext<{
    notifications: Notification[];
    addNotification: (message: string, type: 'success' | 'error') => void;
} | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth() ?? {};
    const [products, setProducts] = useState<Product[]>([]);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = useCallback((message: string, type: 'success' | 'error' = 'success') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 3000);
    }, []);

    const clearCart = useCallback(() => {
        setCartItems([]);
        setTotal(0);
    }, []);

    const fetchCart = useCallback(async () => {
        if (!user) {
            clearCart();
            return;
        };
        try {
            const cartData = await api.getCart();
            setCartItems(cartData.cart);
            setTotal(cartData.total);
        } catch (error) {
            console.error("Failed to refresh cart:", error);
            addNotification("Could not update cart.", "error");
            // If token is invalid/expired, server might send 401/403.
            // A robust app would logout the user here.
        }
    }, [user, addNotification, clearCart]);
    
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const fetchedProducts = await api.getProducts();
                setProducts(fetchedProducts);
            } catch (error) {
                console.error("Failed to fetch products:", error);
                addNotification("Could not load store products.", "error");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, [addNotification]);
    
    useEffect(() => {
        fetchCart();
    }, [fetchCart]);


    const addToCart = async (product: Product, quantity: number) => {
        if (!user) {
            addNotification("Please log in to add items to your cart.", "error");
            return;
        }
        try {
            await api.addToCart({ productId: product.id, qty: quantity });
            addNotification(`${product.name} added to cart!`, 'success');
            await fetchCart();
        } catch (error) {
            console.error("Failed to add to cart:", error);
            addNotification(`Failed to add ${product.name} to cart.`, 'error');
        }
    };
    
    const removeFromCart = async (productId: number) => {
        try {
            await api.removeFromCart(productId);
            addNotification(`Item removed from cart.`, 'success');
            await fetchCart();
        } catch (error) {
            console.error("Failed to remove from cart:", error);
            addNotification("Failed to remove item.", "error");
        }
    };

    const updateCartItemQuantity = async (productId: number, quantity: number) => {
        const item = cartItems.find(i => i.productId === productId);
        if (!item) return;

        const diff = quantity - item.qty;
        if (diff === 0) return;

        try {
            await api.addToCart({ productId, qty: diff });
            await fetchCart();
        } catch (error) {
            console.error("Failed to update quantity:", error);
            addNotification("Failed to update quantity.", "error");
        }
    };
    
    const checkout = async (currentCartItems: CartItem[]): Promise<Receipt | null> => {
        if (currentCartItems.length === 0) {
            addNotification("Your cart is empty.", "error");
            return null;
        }
        try {
            const receipt = await api.checkout(currentCartItems);
            addNotification("Checkout successful!", "success");
            await fetchCart(); // This should result in an empty cart
            return receipt;
        } catch (error) {
            console.error("Checkout failed:", error);
            addNotification("Checkout failed. Please try again.", "error");
            return null;
        }
    };

    const cartItemsWithImages = cartItems.map(item => {
        const product = products.find(p => p.id === item.productId);
        return {
            ...item,
            image: product?.image
        };
    });

    const itemCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

    return (
        <CartContext.Provider value={{ cartItems: cartItemsWithImages, total, itemCount, isLoading, addToCart, removeFromCart, updateCartItemQuantity, checkout, clearCart, fetchCart }}>
            <NotificationContext.Provider value={{ notifications, addNotification }}>
                {children}
            </NotificationContext.Provider>
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a CartProvider');
    }
    return context;
};
