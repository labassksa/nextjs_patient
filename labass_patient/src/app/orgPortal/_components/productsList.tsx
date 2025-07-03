"use client";

import React, { useState } from "react";
import { ShoppingCart as ShoppingCartIcon } from "@mui/icons-material";
import ProductCard from "./ProductCard";

interface Product {
  id: number;
  name: string;
  nameAr: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  barcode: string;
  totalWithTax: number;
  expiryDate: string;
  minQuantity?: number;
}

const products: Product[] = [
  {
    id: 1,
    name: "QV Lip Balm",
    nameAr: "لب بام مرطب شفاه كيو في",
    description: "QV Lip Balm - 9314839007422",
    price: 18,
    originalPrice: 27,
    image: "/images/products/ لب بام مرطب شفاه كيو في QV_9314839007422_18_27_20.7_04-2027.png",
    barcode: "9314839007422",
    totalWithTax: 20.7,
    expiryDate: "04-2027",
    minQuantity: 1
  },
  {
    id: 2,
    name: "Stridex Acne Pads",
    nameAr: "ستريديكس مسحات قطنيه لحب الشباب 55 قطعه",
    description: "Stridex Acne Pads - 55 pieces",
    price: 20,
    originalPrice: 27,
    image: "/images/products/ستريديكس مسحات قطنيه لحب الشباب 55 قطعه STRIDEX_041388097015_20_27_23_02-2027.jpg.png",
    barcode: "041388097015",
    totalWithTax: 23,
    expiryDate: "02-2027",
    minQuantity: 2
  },
  {
    id: 3,
    name: "Cetaphil Lotion",
    nameAr: "سيتافيل لوشن مرطب 100 مل",
    description: "Cetaphil Moisturizing Lotion - 100ml",
    price: 30,
    originalPrice: 45,
    image: "/images/products/سيتافيل لوشن مرطب 100 مل_3499320011815_30_45_34.5_07-2026.jpg.png",
    barcode: "3499320011815",
    totalWithTax: 34.5,
    expiryDate: "07-2026",
    minQuantity: 1
  },
  {
    id: 4,
    name: "K18 Hair Mask",
    nameAr: "قناع اصلاح الشعر الجزيئي ليف ان 50 مل",
    description: "K18 Hair Repair Mask - 50ml",
    price: 135,
    originalPrice: 155,
    image: "/images/products/قناع اصلاح الشعر الجزيئي ليف ان 50 مل k18_858511001128_135_155_155.25_09-2027.jpg.png",
    barcode: "858511001128",
    totalWithTax: 155.25,
    expiryDate: "09-2027",
    minQuantity: 1
  },
  {
    id: 5,
    name: "QV Cream",
    nameAr: "كريم كيوفي ضغاط 500 جرام",
    description: "QV Cream - 500g",
    price: 44,
    originalPrice: 65,
    image: "/images/products/كريم كيوفي ضغاط 500 جرام QV CREAM_9314839020742_44_65_50.6_06-2028.png",
    barcode: "9314839020742",
    totalWithTax: 50.6,
    expiryDate: "06-2028",
    minQuantity: 1
  },
  {
    id: 6,
    name: "La Roche-Posay Cicaplast",
    nameAr: "لاروش بوزيه مرطب سيكابلاست بي + 5",
    description: "La Roche-Posay Cicaplast B5 - 100ml",
    price: 54,
    originalPrice: 60,
    image: "/images/products/لاروش بوزيه مرطب سيكابلاست بي + 5 LA ROCHE POSAY BAUME CICAPLAST 100 ML_3337875816847_54_60_62.1_05-2027.jpg.png",
    barcode: "3337875816847",
    totalWithTax: 62.1,
    expiryDate: "05-2027",
    minQuantity: 1
  }
];

const ProductsList: React.FC = () => {
  const [cart, setCart] = useState<{ [key: number]: number }>({});

  const handleAddToCart = (productId: number, quantity: number) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + quantity
    }));
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg fixed w-full top-0 z-10">
        <div className="flex flex-col items-end text-right">
          <h2 className="text-xl font-semibold text-black-600">قائمة المنتجات</h2>
          <p className="text-xs text-blue-500 mt-2">سيتم تحديث القائمة بشكل دوري واضافة منتجات جديدة</p>
          <p className="text-xs text-black-500 mt-2">رقم الحساب البنكي</p>
          <p className="text-xs text-black-500">SA0305000068203377503000</p>
        </div>
      </div>
      <div className="mt-20 pt-20 px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsList;
