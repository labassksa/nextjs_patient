"use client";

import React, { useEffect } from "react";
import { ShoppingCart as ShoppingCartIcon } from "@mui/icons-material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ProductCard from "./ProductCard";
import { useCart } from "../../../hooks/useCart";
import Link from "next/link";

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
  },
  {
    id: 7,
    name: "Stridex Acne Pads Large",
    nameAr: "قطع قطنيه ستريديكس لحب الشباب كبير 90 قطعة",
    description: "Stridex Acne Pads - 90 pieces",
    price: 29,
    originalPrice: 35,
    image: "/images/products/ستريديكس مسحات قطنيه لحب الشباب 55 قطعه STRIDEX_041388097015_20_27_23_02-2027.jpg.png",
    barcode: "041388097091",
    totalWithTax: 33.35,
    expiryDate: "02-2027",
    minQuantity: 2
  },
  {
    id: 8,
    name: "Beauty of Joseon Sunscreen",
    nameAr: "بيوتي اوف جوسون واقي شمس 50 مل",
    description: "Beauty of Joseon Sunscreen - 50ml",
    price: 33,
    originalPrice: 37,
    image: "/images/products/بيوتي اوف جوسون واقي شمس BEAUTY OFJOSEON 50 ML_8809782555508_33_37_37.95_07-2027.jpg.png",
    barcode: "8809782555508",
    totalWithTax: 37.95,
    expiryDate: "07-2027",
    minQuantity: 1
  },
  {
    id: 9,
    name: "Bioderma Sebium Hydra",
    nameAr: "بيوديرما سيبيوم هيدرا 40 مل",
    description: "Bioderma Sebium Hydra - 40ml",
    price: 32,
    originalPrice: 37,
    image: "/images/products/بيوديرما سيبيوم هيدرا BIODERMA SEBIUM HYDRA 40 ML_3401348840421_32_37_36.8_06-2027.jpg.png",
    barcode: "3401348840421",
    totalWithTax: 36.8,
    expiryDate: "06-2027",
    minQuantity: 1
  },
  {
    id: 10,
    name: "Skala Expert Hair Cream with Panthenol",
    nameAr: "سكالا اكسبرت ـ كريم بخلاصة الديبانثينول وزبدة الشيا وزيت الخروع",
    description: "Skala Expert Hair Cream with Panthenol, Shea Butter and Castor Oil",
    price: 29.24,
    originalPrice: 38.99,
    image: "/images/products/سكالا اكسبرت ـ كريم بخلاصة الديبانثينول وزبدة الشيا وزيت الخروع 18525+24673_7897042018574_29.24_38.99_33.62_12-2027.jpg.png",
    barcode: "7897042018574",
    totalWithTax: 33.62,
    expiryDate: "12-2027",
    minQuantity: 1
  },
  {
    id: 11,
    name: "Skala Expert Hair Cream with Plant Oils",
    nameAr: "سكالا اكسبرت ـ كريم بخلاصة العديد من الزيوت النباتية المغذية للشعر",
    description: "Skala Expert Hair Cream with Nourishing Plant Oils",
    price: 29.24,
    originalPrice: 38.99,
    image: "/images/products/سكالا اكسبرت ـ كريم بخلاصة العديد من الزيوت النباتية المغذية للشعر رقم 19807+24668_7897042018529_29.24_38.99_33.62_01-2028.jpg.png",
    barcode: "7897042018529",
    totalWithTax: 33.62,
    expiryDate: "01-2028",
    minQuantity: 1
  },
  {
    id: 12,
    name: "Anua Niacinamide 70% Serum",
    nameAr: "سيروم بيتش 70% نياسين من أنوا - 30مل",
    description: "Anua Peach 70% Niacinamide Serum - 30ml",
    price: 54,
    originalPrice: 65,
    image: "/images/products/سيروم بيتش 70% نياسين من أنوا - 30مل ANUA_8809640733550_54_65_62.1_02-2027.jpg.png",
    barcode: "8809640733550",
    totalWithTax: 62.1,
    expiryDate: "02-2027",
    minQuantity: 1
  },
  {
    id: 13,
    name: "Retinol Intense Eye Cream",
    nameAr: "كريم ريتنول للعناية محيط العين 30 مل",
    description: "Retinol Intense Eye Cream - 30ml",
    price: 38,
    originalPrice: 43,
    image: "/images/products/كريم ريتنول للعناية محيط العين RETIONL INTENSE EYE CREAM 30 ML_8809647392583_38_43_43.7_06-2027.jpg.png",
    barcode: "8809647392583",
    totalWithTax: 43.7,
    expiryDate: "06-2027",
    minQuantity: 1
  },
  {
    id: 14,
    name: "Embryolisse Lait Creme",
    nameAr: "كريم للبشرة امبريوليس 30 مل",
    description: "Embryolisse Lait Creme - 30ml",
    price: 32,
    originalPrice: 38,
    image: "/images/products/كريم للبشرة امبريوليس EMBRYOLISSE LAIT CREME 30 ML_3350900000394_32_38_36.8_01-2028.jpg.png",
    barcode: "3350900000394",
    totalWithTax: 36.8,
    expiryDate: "01-2028",
    minQuantity: 1
  },
  {
    id: 15,
    name: "Eucerin Hand Cream",
    nameAr: "كريم يد يوسيرين 78 جرام",
    description: "Eucerin Hand Cream - 78g",
    price: 23,
    originalPrice: 26,
    image: "/images/products/كريم يد يوسيرين EUCERIN 78 G_072140633820_23_26_26.45_03-2027.jpg.png",
    barcode: "072140633820",
    totalWithTax: 26.45,
    expiryDate: "03-2027",
    minQuantity: 1
  },
  {
    id: 16,
    name: "Numbuzin No.3 Skin Softening Serum",
    nameAr: "نومبوزين سيروم رقم 3 لتنعيم البشرة - 50 مل",
    description: "Numbuzin No.3 Skin Softening Serum - 50ml",
    price: 54,
    originalPrice: 65,
    image: "/images/products/نومبوزين سيروم رقم 3 لتنعيم البشرة - 50 مل NUMBUZIN_8809652580036_54_65_62.1_06-2027.jpg.png",
    barcode: "8809652580036",
    totalWithTax: 62.1,
    expiryDate: "06-2027",
    minQuantity: 1
  },
  {
    id: 17,
    name: "Skala Expert Hair Cream with Plant Oils (Alternative)",
    nameAr: "سكالا اكسبرت ـ كريم بخلاصة العديد من الزيوت النباتية المغذية للشعر (بديل)",
    description: "Skala Expert Hair Cream with Nourishing Plant Oils - Alternative Version",
    price: 29.24,
    originalPrice: 38.99,
    image: "/images/products/سكالا اكسبرت ـ كريم بخلاصة العديد من الزيوت النباتية المغذية للشعر رقم 19807+24668_7897042018529_29.24_38.99_33.62_01-2028.jpg",
    barcode: "7897042018529",
    totalWithTax: 33.62,
    expiryDate: "01-2028",
    minQuantity: 1
  }
];

const ProductsList: React.FC = () => {
  const { cart, refreshCart } = useCart();

  // Listen for cart updates from other components
  useEffect(() => {
    const handleCartUpdate = () => {
      refreshCart();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    
    // Also refresh when component mounts
    refreshCart();

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [refreshCart]);

  const handleCartClick = () => {
    // Refresh cart data from localStorage before navigating
    refreshCart();
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg fixed w-full top-0 z-10">
        <div className="flex justify-between items-start mb-4">
          <Link href="/orgPortal/cart" className="relative" onClick={handleCartClick}>
            <div className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow">
              <ShoppingCartIcon className="text-blue-600 w-6 h-6" />
              {cart.totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.totalItems}
                </span>
              )}
            </div>
          </Link>
          <div className="text-right">
            <h2 className="text-xl font-semibold text-black-600">قائمة المنتجات</h2>
          </div>
        </div>
        <div className="flex flex-col items-end text-right">
          <p className="text-xs text-blue-500 mt-2">سيتم تحديث القائمة بشكل دوري واضافة منتجات جديدة</p>
          <p className="text-xs text-black-500 mt-2">رقم الحساب البنكي</p>
          <p className="text-xs text-black-500">SA0305000068203377503000</p>
          <p className="text-xs text-black-500 mt-2">
            <a
              href="https://wa.me/966505117551"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-blue-500"
            >
              <WhatsAppIcon className="text-green-500" />
              خدمة العملاء: 0505117551
            </a>
          </p>
        </div>
      </div>
      <div className="mt-20 pt-20 px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              supportPhone="0505117551"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsList;
