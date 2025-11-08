import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItemView from '../components/CartItemView';

const CartPage: React.FC = () => {
    const { cartItems, total, itemCount } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        navigate('/payment');
    };

    if (cartItems.length === 0) {
        return (
            <div className="text-center py-20">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
                <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
                <Link to="/" className="inline-block bg-primary-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-lg rounded-lg">
            <div className="px-4 py-5 sm:px-6">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Shopping Cart</h1>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <ul role="list" className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                        <CartItemView key={item.productId} item={item} />
                    ))}
                </ul>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>${total.toFixed(2)}</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                <div className="mt-6">
                    <button
                        onClick={handleCheckout}
                        disabled={itemCount === 0}
                        className="w-full flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Proceed to Checkout
                    </button>
                </div>
                <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                    <p>
                        or{' '}
                        <Link to="/" className="font-medium text-primary-600 hover:text-primary-500">
                            Continue Shopping
                            <span aria-hidden="true"> &rarr;</span>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
