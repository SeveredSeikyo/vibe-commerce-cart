import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ShoppingCartIcon from './icons/ShoppingCartIcon';

const Header: React.FC = () => {
    const { itemCount } = useCart();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const activeLinkClass = "text-primary-600 border-primary-600";
    const inactiveLinkClass = "text-gray-500 hover:text-gray-800 border-transparent";
    const linkBaseClass = "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors";

    return (
        <header className="bg-white shadow-sm sticky top-0 z-40">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <NavLink to="/" className="text-2xl font-bold text-primary-600">
                                Vibe
                            </NavLink>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <NavLink to="/products" className={({ isActive }) => `${linkBaseClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                                Products
                            </NavLink>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        {user ? (
                             <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-600">Hi, {user.username}</span>
                                <button onClick={handleLogout} className="text-sm font-medium text-gray-500 hover:text-gray-800">Logout</button>
                             </div>
                        ) : (
                            <NavLink to="/login" className={({ isActive }) => `${linkBaseClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                                Login
                            </NavLink>
                        )}

                        <NavLink to="/checkout" className="group -m-2 p-2 flex items-center relative text-gray-400 hover:text-gray-500">
                           <ShoppingCartIcon />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-2 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                                    {itemCount}
                                </span>
                            )}
                            <span className="sr-only">items in cart, view bag</span>
                        </NavLink>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
