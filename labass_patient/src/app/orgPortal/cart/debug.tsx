"use client";

import React, { useEffect } from "react";
import { useCart } from "../../../hooks/useCart";

const CartDebug: React.FC = () => {
  const { cart } = useCart();

  useEffect(() => {
    console.log("Cart Debug:", cart);
    console.log("Cart items:", cart.items);
    console.log("Total items:", cart.totalItems);
    console.log("LocalStorage cart:", localStorage.getItem('labass_cart'));
  }, [cart]);

  return (
    <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
      <h3 className="font-bold">Cart Debug Info:</h3>
      <p>Total Items: {cart.totalItems}</p>
      <p>Items Count: {cart.items.length}</p>
      <p>Subtotal: {cart.subtotal}</p>
      <p>Total with Tax: {cart.totalWithTax}</p>
      <div className="mt-2">
        <h4>Items:</h4>
        {cart.items.map((item, index) => (
          <div key={index} className="text-sm">
            {item.name} - Qty: {item.quantity}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartDebug;