"use client";

import React from "react";
import { Add, Remove } from "@mui/icons-material";

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  minQuantity?: number;
  maxQuantity?: number;
  className?: string;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onQuantityChange,
  minQuantity = 1,
  maxQuantity = 999,
  className = ""
}) => {
  const handleDecrease = () => {
    if (quantity > minQuantity) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxQuantity) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || minQuantity;
    const clampedValue = Math.max(minQuantity, Math.min(maxQuantity, value));
    onQuantityChange(clampedValue);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={handleDecrease}
        disabled={quantity <= minQuantity}
        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors text-black"
        aria-label="تقليل الكمية"
      >
        <Remove className="w-4 h-4" />
      </button>
      
      <div className="flex items-center">
        <input
          type="number"
          value={quantity}
          onChange={handleInputChange}
          min={minQuantity}
          max={maxQuantity}
          className="w-20 h-8 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          dir="ltr"
        />
      </div>
      
      <button
        onClick={handleIncrease}
        disabled={quantity >= maxQuantity}
        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors text-black"
        aria-label="زيادة الكمية"
      >
        <Add className="w-4 h-4" />
      </button>
    </div>
  );
};

export default QuantitySelector;