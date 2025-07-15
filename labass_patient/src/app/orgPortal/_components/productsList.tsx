"use client";

import React, { useEffect, useState } from "react";
import { ShoppingCart as ShoppingCartIcon } from "@mui/icons-material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ProductCard from "./ProductCard";
import { useCart } from "../../../hooks/useCart";
import Link from "next/link";
import { fetchProducts, searchProducts, Product } from "../../../controllers/productsController";

const ProductsList: React.FC = () => {
  const { cart, refreshCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
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
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Handle search
  useEffect(() => {
    const filtered = searchProducts(products, searchQuery);
    setFilteredProducts(filtered);
  }, [products, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Display products to render
  const displayProducts = error ? [] : filteredProducts;

  // Group products by brand
  const groupedProducts = displayProducts.reduce((acc, product) => {
    const brand = product.brandAr || product.brand || 'أخرى'; // Use Arabic brand, fallback to English, or 'Other'
    if (!acc[brand]) {
      acc[brand] = [];
    }
    acc[brand].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

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