
import React from 'react';
import type { Receipt } from '../types';

interface CheckoutModalProps {
    receipt: Receipt;
    onClose: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ receipt, onClose }) => {
    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50 flex justify-center items-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-2xl font-semibold text-gray-900">Payment Successful!</h3>
                    <p className="mt-2 text-sm text-gray-500">
                        Thank you for your purchase. Your order is confirmed.
                    </p>
                </div>

                <div className="mt-6 border-t border-b border-gray-200 py-4">
                    <dl className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-gray-500">Receipt ID</dt>
                            <dd className="font-mono text-gray-900">{receipt.receiptId}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-gray-500">Date</dt>
                            <dd className="text-gray-900">{new Date(receipt.timestamp).toLocaleString()}</dd>
                        </div>
                         <div className="flex justify-between font-semibold text-base pt-2">
                            <dt className="text-gray-900">Total Paid</dt>
                            <dd className="text-primary-600">${receipt.total.toFixed(2)}</dd>
                        </div>
                    </dl>
                </div>

                <div className="mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutModal;
