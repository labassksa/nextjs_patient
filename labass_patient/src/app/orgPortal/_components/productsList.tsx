"use client";

import React, { useEffect, useState } from "react";
import { ShoppingCart as ShoppingCartIcon } from "@mui/icons-material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ProductCard from "./ProductCard";
import { useCart } from "../../../hooks/useCart";
import Link from "next/link";
import { fetchProducts, searchProducts, Product } from "../../../controllers/productsController";

// Helper function to add missing properties to local products
const addMissingProperties = (product: any): Product => ({
  ...product,
  brand: product.brand || getBrandFromName(product.name),
  brandAr: product.brandAr || getBrandFromName(product.nameAr),
  isImported: product.isImported || false,
  supplier: product.supplier || "alhumazi"
});

// Extract brand from product name
const getBrandFromName = (name: string): string => {
  const brands = [
    "QV", "Stridex", "Cetaphil", "K18", "La Roche-Posay", "Beauty of Joseon", 
    "Bioderma", "Skala", "Anua", "Retinol", "Embryolisse", "Eucerin", 
    "Numbuzin", "CeraVe"
  ];
  
  for (const brand of brands) {
    if (name.toLowerCase().includes(brand.toLowerCase())) {
      return brand;
    }
  }
  return "أخرى";
};

const localProducts = [
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
    image: "/images/products/سكالا اكسبرت ـ كريم بخلاصة العديد من الزيوت النباتية المغذية للشعر رقم 19807+24668_7897042018529_29.24_38.99_33.62_01-2028.jpeg",
    barcode: "7897042018529",
    totalWithTax: 33.62,
    expiryDate: "01-2028",
    minQuantity: 1
  },
  {
    id: 18,
    name: "CeraVe Moisturizing Cream for Dry to Very Dry Skin",
    nameAr: "سيرافي كريم ترطيب البشرة الجافة الى الجافة جداً 340 جم",
    description: "CeraVe Moisturizing Cream for Dry to Very Dry Skin - 340g",
    price: 48,
    originalPrice: 55.2,
    image: "/images/products/سيرافي كريم ترطيب البشرة الجافة الى الجافة جداً 340 جم_3337875597227_48_55.2.png",
    barcode: "3337875597227",
    totalWithTax: 55.2,
    expiryDate: "08-2027",
    minQuantity: 1
  },
  {
    id: 19,
    name: "CeraVe Moisturizing Cream for Very Dry Skin",
    nameAr: "سيرافي كريم مرطب للبشره الجافه جدا 454 جرام",
    description: "CeraVe Moisturizing Cream for Very Dry Skin - 454g",
    price: 54,
    originalPrice: 62.1,
    image: "/images/products/سيرافي كريم مرطب للبشره الجافه جدا 454 جرام_3337875597388_54_62.1.jpg.png",
    barcode: "3337875597388",
    totalWithTax: 62.1,
    expiryDate: "08-2027",
    minQuantity: 1
  },
  {
    id: 20,
    name: "CeraVe Foaming Facial Cleanser",
    nameAr: "سيرافي منظف رغوي للوجه 473 مل",
    description: "CeraVe Foaming Facial Cleanser - 473ml",
    price: 54,
    originalPrice: 62.1,
    image: "/images/products/سيرافي منظف رغوي للوجه 473 مل CERAVE_3337875597357_54_62.1.png",
    barcode: "3337875597357",
    totalWithTax: 62.1,
    expiryDate: "08-2027",
    minQuantity: 1
  },
  {
    id: 21,
    name: "CeraVe Foaming Cleanser for Oily Skin",
    nameAr: "سيرافي منظف للبشرة الدهنية 236 مل",
    description: "CeraVe Foaming Cleanser for Oily Skin - 236ml",
    price: 37,
    originalPrice: 42.55,
    image: "/images/products/سيرافي منظف للبشرة الدهنية CERAVE FOAMING 236 ML_3337875597197_37_42.55.jpg",
    barcode: "3337875597197",
    totalWithTax: 42.55,
    expiryDate: "08-2027",
    minQuantity: 1
  }
];

// Convert local products to match the Product type
const products: Product[] = localProducts.map(addMissingProperties);

const ProductsList: React.FC = () => {
  const { cart, refreshCart } = useCart();
  const [apiProducts, setApiProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Load products from API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await fetchProducts();
        setApiProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error('Error loading products:', err);
        // Fallback to local products
        setApiProducts(products);
        setFilteredProducts(products);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Handle search
  useEffect(() => {
    const filtered = searchProducts(apiProducts, searchQuery);
    setFilteredProducts(filtered);
  }, [apiProducts, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

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

  // Display products to render
  const displayProducts = error ? products : filteredProducts;

  // Group products by brand
  const groupedProducts = displayProducts.reduce((acc, product) => {
    const brand = product.brandAr || product.brand || 'أخرى'; // Use Arabic brand, fallback to English, or 'Other'
    if (!acc[brand]) {
      acc[brand] = [];
    }
    acc[brand].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <div className="space-y-4">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 fixed w-full left-0 right-0 top-0 z-10 shadow-lg">
        {/* Main Header Row */}
        <div className="flex justify-between items-center p-2 md:p-3">
          {/* Cart Icon */}
          <Link href="/orgPortal/cart" className="relative" onClick={handleCartClick}>
            <div className="bg-white/10 backdrop-blur-sm p-1.5 md:p-2 rounded-full hover:bg-white/20 transition-all duration-200">
              <ShoppingCartIcon className="text-white w-5 h-5 md:w-6 md:h-6" />
              {cart.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center font-bold">
                  {cart.totalItems}
                </span>
              )}
            </div>
          </Link>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4">
            <input
              type="text"
              placeholder="البحث في المنتجات..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-3 py-1.5 md:py-2 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40"
              dir="rtl"
            />
          </div>
          
          {/* Title and Subtitle */}
          <div className="text-right text-white">
            <h1 className="text-sm md:text-lg font-bold">متجر المنتجات</h1>
            <p className="text-xs text-blue-100 font-mono">SA0305000068203377503000</p>
            <p className="text-xs text-blue-100 hidden md:block">منتجات طبية وتجميلية</p>
          </div>
        </div>
        
        {/* Mobile Info Bar */}
        <div className="block md:hidden bg-white/10 backdrop-blur-sm px-2 py-1 border-t border-white/20">
          <div className="flex justify-center mb-1">
            <div className="text-xs text-yellow-200 font-bold bg-yellow-500/20 px-2 py-1 rounded-md border border-yellow-400/30">
              <div className="text-center mb-1">للملاحظات على الأسعار</div>
              <a
                href="https://wa.me/966505117551"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 hover:text-blue-200 transition-colors"
              >
                <WhatsAppIcon className="w-3 h-3 text-green-400" />
                <span className="text-white">دعم العملاء</span>
              </a>
            </div>
          </div>
          <div className="flex justify-center">
            <span className="text-xs text-blue-100">سيتم تحديث المنتجات بشكل دوري</span>
          </div>
        </div>

        {/* Desktop Info Bar */}
        <div className="hidden md:block bg-white/10 backdrop-blur-sm px-3 py-2 border-t border-white/20">
          <div className="flex justify-between items-center">
            {/* Bank Account - Left */}
            <div className="text-center">
              <p className="text-xs text-blue-100 leading-none font-semibold">رقم الحساب البنكي</p>
              <p className="text-xs text-white font-mono bg-white/20 px-2 py-1 rounded-md leading-none font-bold shadow-sm">
                SA0305000068203377503000
              </p>
            </div>

            {/* Center Info */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-sm text-yellow-200 font-bold bg-yellow-500/20 px-2 py-0.5 rounded-md border border-yellow-400/30 shadow-sm">للملاحظات على الأسعار</span>
              <a
                href="https://wa.me/966505117551"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-blue-200 transition-colors bg-white/10 px-2 py-1 rounded-md"
              >
                <WhatsAppIcon className="w-4 h-4 text-green-400" />
                <span className="text-xs text-white font-semibold">دعم العملاء</span>
              </a>
            </div>

            {/* Updates Info - Right */}
            <div className="text-center">
              <span className="text-xs text-blue-100 font-semibold">سيتم تحديث المنتجات بشكل دوري</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Products List - Responsive Layout */}
      <div className="pt-32 md:pt-40 lg:pt-48 xl:pt-56 pb-20">
        {/* Title */}
        <div className="text-right mb-4 px-4 md:px-8" dir="rtl">
          <p className="text-xs text-gray-600 mb-1">التوصيل لمدينة الرياض والدمام فقط</p>
          <div className="flex justify-start">
            <div className="w-20 h-1 bg-blue-500 rounded-full"></div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">جاري تحميل المنتجات...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                إعادة المحاولة
              </button>
            </div>
          </div>
        )}

        {/* No Products State */}
        {!loading && !error && displayProducts.length === 0 && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <p className="text-gray-600">
                {searchQuery ? 'لا توجد منتجات تطابق البحث' : 'لا توجد منتجات متاحة'}
              </p>
            </div>
          </div>
        )}

        {/* Products Display - Grouped by Brand */}
        {!loading && !error && displayProducts.length > 0 && (
          <div className="space-y-8">
            {Object.entries(groupedProducts).map(([brand, products]) => (
              <div key={brand} className="brand-section">
                {/* Brand Header */}
                <div className="px-4 md:px-8 mb-4" dir="rtl">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 text-right">{brand}</h3>
                    <div className="flex-1 mx-4 h-px bg-gray-200"></div>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {products.length} منتج
                    </span>
                  </div>
                </div>

                {/* Mobile and Small Tablets - Horizontal Scroll */}
                <div className="block lg:hidden">
                  <div className="relative">
                    {/* Scroll container */}
                    <div 
                      className="flex overflow-x-auto gap-3 md:gap-4 px-4 md:px-8 pb-6 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    >
                      {products.map((product, index) => (
                        <div 
                          key={product.id} 
                          className={`flex-shrink-0 w-[65vw] sm:w-[45vw] md:w-[35vw] transform transition-all duration-300 hover:scale-[1.02] ${
                            index === 0 ? 'ml-0' : ''
                          } ${index === products.length - 1 ? 'mr-4 md:mr-8' : ''}`}
                        >
                          <ProductCard
                            {...product}
                            supportPhone="0505117551"
                            className="h-full shadow-md hover:shadow-lg transition-shadow duration-300 compact-horizontal"
                          />
                        </div>
                      ))}
                    </div>
                    
                    {/* Gradient fade effects */}
                    <div className="absolute left-0 top-0 bottom-6 w-8 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none z-10"></div>
                    <div className="absolute right-0 top-0 bottom-6 w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none z-10"></div>
                  </div>
                  
                  {/* Scroll indicator */}
                  <div className="flex justify-center mt-4">
                    <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      ← اسحب للتصفح →
                    </div>
                  </div>
                </div>

                {/* Large Screens - Horizontal Scroll */}
                <div className="hidden lg:block">
                  <div className="relative">
                    {/* Scroll container */}
                    <div 
                      className="flex overflow-x-auto gap-6 px-8 pb-6 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    >
                      {products.map((product, index) => (
                        <div 
                          key={product.id} 
                          className={`flex-shrink-0 w-80 transform transition-all duration-300 hover:scale-[1.02] ${
                            index === 0 ? 'ml-0' : ''
                          } ${index === products.length - 1 ? 'mr-8' : ''}`}
                        >
                          <ProductCard
                            {...product}
                            supportPhone="0505117551"
                            className="h-full shadow-md hover:shadow-lg transition-shadow duration-300"
                          />
                        </div>
                      ))}
                    </div>
                    
                    {/* Gradient fade effects */}
                    <div className="absolute left-0 top-0 bottom-6 w-8 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none z-10"></div>
                    <div className="absolute right-0 top-0 bottom-6 w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none z-10"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsList;
