"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ShoppingCart as ShoppingCartIcon, ShoppingCartCheckout as AddToCartIcon } from "@mui/icons-material";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useTranslation } from "react-i18next";
import QuantitySelector from "../../../components/QuantitySelector";
import { useCart } from "../../../hooks/useCart";

interface ProductCardProps {
  id: number;
  name: string;
  nameAr: string;
  description: string;
  price: number;
  originalPrice: number;
  totalWithTax: number;
  image: string;
  barcode: string;
  minQuantity?: number;
  className?: string;
  supportPhone?: string;
  expiryDate?: string;
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
  barcode,
  minQuantity = 1,
  className = "",
  supportPhone,
  expiryDate
}) => {
  const { t } = useTranslation();
  const { addToCart, getItemQuantity } = useCart();
  const [selectedQuantity, setSelectedQuantity] = useState(minQuantity);
  const currentCartQuantity = getItemQuantity(id);

  const handleAddToCart = () => {
    addToCart({
      id,
      name,
      nameAr,
      price,
      originalPrice,
      totalWithTax,
      image,
      barcode,
      minQuantity
    }, selectedQuantity);
  };

  const isCompact = className?.includes('compact-horizontal');
  
  return (
    <div
      className={`bg-white rounded-lg shadow-sm ${isCompact ? 'p-2' : 'p-4'} hover:shadow-md transition-shadow ${className}`}
    >
      <div className={`w-full ${isCompact ? 'mb-2' : 'mb-4'} relative rounded-lg overflow-hidden`}>
        <Image
          src={image}
          alt={name}
          width={500}
          height={500}
          className="object-contain"
          style={{ 
            width: '100%', 
            height: isCompact ? '100px' : 'auto',
            maxHeight: isCompact ? '100px' : 'none'
          }}
        />
      </div>
      <div className={isCompact ? 'space-y-1' : 'space-y-2'}>
        <h3 className={`${isCompact ? 'text-xs' : 'text-lg'} font-semibold text-right`} dir="rtl">{name}</h3>
        {!isCompact && <p className="text-gray-600 text-right">{description}</p>}
        <div className={`${isCompact ? 'text-xs' : 'text-sm'} text-gray-500 text-right`} dir="rtl">
          <span className={`font-mono bg-gray-100 ${isCompact ? 'px-1 py-0.5 text-xs' : 'px-2 py-1'} rounded`}>الباركود: {barcode}</span>
        </div>
        <div  dir="rtl" className={`flex flex-col ${isCompact ? 'gap-1' : 'gap-2'}`}>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <span className={`text-gray-500 line-through ${isCompact ? 'text-xs' : 'text-sm'}`}>
                {originalPrice} ريال
              </span>
              <span className={`${isCompact ? 'text-xs' : 'text-sm'} font-semibold text-red-600`}>
                -{Math.round(((originalPrice - price) / originalPrice) * 100)}%
              </span>
            </div>
          </div>
          <div className="flex justify-between">
            <div className={`${isCompact ? 'text-sm' : 'text-xl'} font-bold text-right`}>{price} ريال</div>
          </div>
          <div className={`${isCompact ? 'text-xs' : 'text-sm'} text-red-600 text-right`}>
            غير شامل للضريبة
          </div>
          <div className={`${isCompact ? 'text-xs' : 'text-sm'} text-gray-500 text-right`}>
            الضريبة: {(totalWithTax - price).toFixed(2)} ريال
          </div>
        </div>
        {!isCompact && <div className={`${isCompact ? 'text-xs' : 'text-sm'} text-gray-600 text-right`}>الحد الأدنى للطلب: {minQuantity} قطعة</div>}
        {currentCartQuantity > 0 && (
          <div className={`${isCompact ? 'text-xs' : 'text-sm'} text-green-600 text-right font-semibold`}>
            في السلة: {currentCartQuantity} قطعة
          </div>
        )}
        <div className={isCompact ? 'mt-1' : 'mt-3'}>
          <div className={`${isCompact ? 'text-xs' : 'text-sm'} text-gray-600 text-right ${isCompact ? 'mb-1' : 'mb-2'}`}>الكمية:</div>
          <QuantitySelector
            quantity={selectedQuantity}
            onQuantityChange={setSelectedQuantity}
            minQuantity={minQuantity}
            className="justify-end"
          />
        </div>
        {!isCompact && supportPhone && (
          <div dir="rtl" className="text-sm text-gray-500 text-right">
            <a href={`tel:${supportPhone}`} className="flex items-center gap-2 hover:text-blue-500">
              <WhatsAppIcon className="text-green-500" />
              خدمة العملاء: {supportPhone}
            </a>
          </div>
        )}
      </div>
      <div className={isCompact ? 'mt-2' : 'mt-4'}>
        <button
          onClick={handleAddToCart}
          className={`bg-green-500 text-white ${isCompact ? 'px-2 py-1.5 text-xs' : 'px-4 py-2'} rounded-md hover:bg-green-600 transition-colors flex items-center gap-2 w-full justify-center`}
        >
          <AddToCartIcon className={`${isCompact ? 'w-4 h-4' : 'w-5 h-5'} inline-block`} />
          {t('addToCart')}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
