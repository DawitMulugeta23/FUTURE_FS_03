import React from 'react';
import { useSelector } from 'react-redux';

const CartSummary = () => {
  const { items, totalQuantity, totalAmount } = useSelector((state) => state.cart);
  const tax = totalAmount * 0.05;
  const serviceCharge = totalAmount * 0.1;
  const grandTotal = totalAmount + tax + serviceCharge;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
      <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
      
      <div className="space-y-3 text-gray-600">
        <div className="flex justify-between">
          <span>Subtotal ({totalQuantity} items)</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax (5%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Service Charge (10%)</span>
          <span>${serviceCharge.toFixed(2)}</span>
        </div>
        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span className="text-coffee-500">${grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;