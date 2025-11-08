import React from 'react';
import { useCart } from '../context/CartContext';
import ProtectedRoute from '../components/ProtectedRoute';
import { useNavigate } from 'react-router-dom';
import TrashIcon from '../components/icons/TrashIcon';
import { useNotifications } from '../context/NotificationContext';

const CheckoutPage: React.FC = () => {
  const { cartItems, total, itemCount, removeFromCart, updateCartItemQuantity, checkout, clearCart } = useCart();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const handleUpdateQuantity = (productId: number, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(productId);
    } else {
      updateCartItemQuantity(productId, newQty);
    }
  };

  const handleCheckout = async () => {
    try {
      const receipt = await checkout(cartItems);
      addNotification({ message: 'Checkout successful! Your order has been placed.', type: 'success' });
      clearCart(); // Clear local cart state after successful checkout
      navigate('/order-confirmation', { state: { receipt } }); // Redirect to an order confirmation page
    } catch (error) {
      addNotification({ message: 'Checkout failed. Please try again.', type: 'error' });
      console.error('Checkout error:', error);
    }
  };

  if (itemCount === 0) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto p-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-lg">Looks like you haven't added anything to your cart yet.</p>
          <button
            onClick={() => navigate('/products')}
            className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Start Shopping
          </button>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          {cartItems.map((item) => (
            <div key={item.productId} className="flex items-center justify-between py-4 border-b last:border-b-0">
              <div className="flex items-center">
                {/* Assuming product images are not directly in cart items, or we'd fetch them */}
                {/* <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded mr-4" /> */}
                <div>
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <p className="text-gray-600">${item.price.toFixed(2)} each</p>
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="number"
                  min="1"
                  value={item.qty}
                  onChange={(e) => handleUpdateQuantity(item.productId, parseInt(e.target.value))}
                  className="w-20 p-2 border rounded text-center mr-4"
                />
                <p className="text-lg font-semibold mr-4">${(item.price * item.qty).toFixed(2)}</p>
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="text-red-500 hover:text-red-700"
                  aria-label={`Remove ${item.name} from cart`}
                >
                  <TrashIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end items-center bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mr-4">Total: ${total.toFixed(2)}</h2>
          <button
            onClick={handleCheckout}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-xl"
            disabled={itemCount === 0}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CheckoutPage;
