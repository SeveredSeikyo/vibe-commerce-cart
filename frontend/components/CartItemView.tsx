import React from 'react';
import { useCart } from '../context/CartContext';
import type { CartItem } from '../types';
import TrashIcon from './icons/TrashIcon';

interface CartItemViewProps {
    item: CartItem & { image?: string };
}

const CartItemView: React.FC<CartItemViewProps> = ({ item }) => {
    const { removeFromCart, updateCartItemQuantity } = useCart();

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Don't do anything if the input is empty; onBlur will handle it.
        if (value === '') {
            return;
        }

        const newQuantity = parseInt(value, 10);
        
        // Prevent non-numeric values or values below 1 from being processed.
        if (isNaN(newQuantity) || newQuantity < 1) {
            return;
        }
        
        // Enforce a reasonable maximum quantity
        const finalQuantity = Math.min(newQuantity, 99);
        
        updateCartItemQuantity(item.productId, finalQuantity);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        // If the user leaves the input field empty, reset the quantity to 1.
        if (e.target.value === '') {
            updateCartItemQuantity(item.productId, 1);
        }
    };
    
    const increment = () => {
        if (item.qty < 99) { // Respect the max quantity
            updateCartItemQuantity(item.productId, item.qty + 1)
        }
    };
    const decrement = () => item.qty > 1 && updateCartItemQuantity(item.productId, item.qty - 1);


    return (
        <li className="flex py-6 px-4 sm:px-6">
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                <img
                    src={item.image || 'https://picsum.photos/200'}
                    alt={item.name}
                    className="h-full w-full object-cover object-center"
                />
            </div>

            <div className="ml-4 flex flex-1 flex-col">
                <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>{item.name}</h3>
                        <p className="ml-4">${(item.price * item.qty).toFixed(2)}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                </div>
                <div className="flex flex-1 items-end justify-between text-sm">
                    <div className="flex items-center border border-gray-300 rounded-md">
                        <button onClick={decrement} className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-l-md disabled:opacity-50" disabled={item.qty <= 1}>-</button>
                        <input
                            type="number"
                            value={item.qty}
                            onChange={handleQuantityChange}
                            onBlur={handleBlur}
                            className="w-12 text-center border-l border-r border-gray-300 focus:outline-none"
                            min="1"
                            max="99"
                        />
                         <button onClick={increment} className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-r-md disabled:opacity-50" disabled={item.qty >= 99}>+</button>
                    </div>

                    <div className="flex">
                        <button
                            type="button"
                            onClick={() => removeFromCart(item.productId)}
                            className="font-medium text-primary-600 hover:text-primary-500 flex items-center"
                        >
                            <TrashIcon />
                            <span className="ml-1">Remove</span>
                        </button>
                    </div>
                </div>
            </div>
        </li>
    );
};

export default CartItemView;