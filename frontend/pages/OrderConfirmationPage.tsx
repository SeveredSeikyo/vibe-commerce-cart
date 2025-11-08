import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Receipt } from '../types';

const OrderConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const receipt = location.state?.receipt as Receipt | undefined;

  if (!receipt) {
    // If there's no receipt data, redirect to products page or show an error
    navigate('/products');
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-green-600">Order Confirmed!</h1>
      <p className="text-lg mb-4">Thank you for your purchase. Your order has been successfully placed.</p>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Order Details</h2>
        <p className="mb-2"><strong>Order ID:</strong> {receipt.id}</p>
        <p className="mb-2"><strong>Date:</strong> {new Date(receipt.date).toLocaleDateString()}</p>
        <p className="mb-4"><strong>Total Amount:</strong> ${receipt.total.toFixed(2)}</p>

        <h3 className="text-xl font-semibold mb-3">Items Purchased:</h3>
        <ul>
          {receipt.items.map((item, index) => (
            <li key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
              <span>{item.name} (x{item.qty})</span>
              <span>${(item.price * item.qty).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => navigate('/products')}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default OrderConfirmationPage;
