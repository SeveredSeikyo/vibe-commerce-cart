
import React from 'react';
import { useNotifications } from '../context/CartContext';
import type { Notification } from '../types';

const NotificationToast: React.FC<{ notification: Notification }> = ({ notification }) => {
    const baseClasses = 'w-full max-w-sm p-4 rounded-lg shadow-lg text-white transform transition-all duration-300';
    const typeClasses = {
        success: 'bg-green-500',
        error: 'bg-red-500',
    };

    return (
        <div className={`${baseClasses} ${typeClasses[notification.type]}`}>
            {notification.message}
        </div>
    );
};


const NotificationContainer: React.FC = () => {
    const { notifications } = useNotifications();
    return (
        <div className="fixed bottom-5 right-5 z-50 space-y-3">
            {notifications.map((n) => (
                <NotificationToast key={n.id} notification={n} />
            ))}
        </div>
    );
};

export default NotificationContainer;
