"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ShoppingCart as ShoppingCartIcon, ShoppingCartCheckout as AddToCartIcon } from "@mui/icons-material";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useTranslation } from "react-i18next";

interface ProductCardProps {
  id: number;
  name: string;
  nameAr: string;
  description: string;
  price: number;
  originalPrice: number;
  totalWithTax: number;
  image: string;
  minQuantity?: number;
  className?: string;
  onAddToCart?: (productId: number, quantity: number) => void;
  supportPhone?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  nameAr,
  description,
  price,
  originalPrice,
  totalWithTax,
  image,
  minQuantity = 1,
  className = "",
  onAddToCart,
  supportPhone
}) => {
  const { t } = useTranslation();
  const quantity = minQuantity;

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(id, quantity);
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow ${className}`}
    >
      <div className="w-full mb-4 relative rounded-lg overflow-hidden">
        <Image
          src={image}
          alt={name}
          width={500}
          height={500}
          className="object-contain"
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-right" dir="rtl">{name}</h3>
        <p className="text-gray-600 text-right">{description}</p>
        <div  dir="rtl" className="flex flex-col gap-2">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 line-through">
                {originalPrice} ريال
              </span>
              <span className="text-sm font-semibold text-red-600">
                -{Math.round(((originalPrice - price) / originalPrice) * 100)}%
              </span>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 line-through">
              {price} ريال
            </span>
          </div>
          <div className="flex justify-between">
            <div className="text-xl font-bold">{totalWithTax} ريال</div>
          </div>
          <div className="text-sm text-green-500 text-right">
            شامل الضريبة
          </div>
        </div>
        <div className="text-sm text-gray-600 text-right">الحد الأدنى للطلب: {quantity} قطعة</div>
        {supportPhone && (
          <div dir="rtl" className="text-sm text-gray-500 text-right">
            <a href={`tel:${supportPhone}`} className="flex items-center gap-2 hover:text-blue-500">
              <WhatsAppIcon className="text-green-500" />
              خدمة العملاء: {supportPhone}
            </a>
          </div>
        )}
      </div>
      <div className="mt-4">
        <button
          onClick={handleAddToCart}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors flex items-center gap-2 w-full justify-center"
        >
          <AddToCartIcon className="w-5 h-5 inline-block" />
          {t('addToCart')}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
