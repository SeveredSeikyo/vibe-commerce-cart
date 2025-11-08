import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Receipt } from '../types';
import CheckoutModal from '../components/CheckoutModal';
import { useNavigate } from 'react-router-dom';

const PaymentPage: React.FC = () => {
    const { cartItems, total, checkout } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const [receipt, setReceipt] = useState<Receipt | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '' });
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        const checkoutReceipt = await checkout(cartItems);
        if (checkoutReceipt) {
            setReceipt(checkoutReceipt);
            setShowModal(true);
        }
        setIsProcessing(false);
    };

    const closeModal = () => {
        setShowModal(false);
        setReceipt(null);
        navigate('/'); // Redirect to home after closing receipt
    };
    
    return (
        <>
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl mb-6">Checkout</h1>
                
                <div className="mb-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-2">Order Summary</h2>
                    <ul role="list" className="divide-y divide-gray-200 border-b border-t">
                        {cartItems.map(item => (
                            <li key={item.productId} className="flex py-4 justify-between items-center">
                                <div>
                                    <p className="font-medium text-gray-800">{item.name}</p>
                                    <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                                </div>
                                <p className="font-medium text-gray-800">${(item.price * item.qty).toFixed(2)}</p>
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-between text-base font-bold text-gray-900 mt-4">
                        <p>Total</p>
                        <p>${total.toFixed(2)}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h2>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" name="name" id="name" required value={formData.name} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input type="email" name="email" id="email" required value={formData.email} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
                        </div>
                         {/* Mock CC fields for realism */}
                        <div>
                            <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">Card Number</label>
                            <input type="text" name="card-number" id="card-number" placeholder="**** **** **** ****" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isProcessing || cartItems.length === 0}
                        className="mt-6 w-full flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 disabled:bg-gray-300"
                    >
                        {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                    </button>
                </form>
            </div>
            {showModal && receipt && <CheckoutModal receipt={receipt} onClose={closeModal} />}
        </>
    );
};

export default PaymentPage;
