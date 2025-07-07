"use client";

import React from "react";
import Image from "next/image";
import { Delete, ShoppingCart, Add, Remove } from "@mui/icons-material";
import { useCart } from "../../../hooks/useCart";
import QuantitySelector from "../../../components/QuantitySelector";

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, refreshCart } = useCart();

  // Refresh cart when component mounts to ensure we have latest data from localStorage
  React.useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const handleClearCart = () => {
    if (window.confirm("هل أنت متأكد من إفراغ السلة؟")) {
      clearCart();
    }
  };

  const handlePlaceOrder = () => {
    // Placeholder for order placement logic
    alert("سيتم تنفيذ وظيفة الطلب قريباً");
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <ShoppingCart className="mx-auto text-gray-300 mb-4" style={{ fontSize: "4rem" }} />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">السلة فارغة</h2>
            <p className="text-gray-500 mb-6">لم تقم بإضافة أي منتجات إلى السلة بعد</p>
            <a
              href="/orgPortal?view=products"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              تصفح المنتجات
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-right mb-2">سلة التسوق</h1>
          <p className="text-gray-600 text-right">عدد المنتجات: {cart.totalItems}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 lg:space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                  {/* Product Image */}
                  <div className="w-full md:w-32 h-48 md:h-32 relative rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-1 space-y-3 md:space-y-4">
                    {/* Header with title and delete button */}
                    <div className="flex justify-between items-start">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
                        title="حذف المنتج"
                      >
                        <Delete className="w-5 h-5" />
                      </button>
                      <div className="text-right flex-1">
                        <h3 className="text-lg font-semibold mb-1" dir="rtl">{item.nameAr}</h3>
                        <p className="text-gray-600 text-sm">{item.name}</p>
                      </div>
                    </div>
                    
                    {/* Barcode */}
                    <div className="text-right">
                      <div className="text-sm text-gray-500" dir="rtl">
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded">الباركود: {item.barcode}</span>
                      </div>
                    </div>
                    
                    {/* Pricing Section */}
                    <div className="space-y-2" dir="rtl">
                      <div className="flex justify-between items-center">
                        <div className="text-right">
                          <div className="text-lg font-bold">{item.price} ريال</div>
                          <div className="text-sm text-red-600">غير شامل للضريبة</div>
                          <div className="text-sm text-gray-500">
                            الضريبة: {(item.totalWithTax - item.price).toFixed(2)} ريال
                          </div>
                        </div>
                      </div>
                      
                      {/* Quantity and Total */}
                      <div className="pt-2 border-t border-gray-100 space-y-3">
                        {/* Quantity Selector */}
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">الكمية:</span>
                            <QuantitySelector
                              quantity={item.quantity}
                              onQuantityChange={(qty) => updateQuantity(item.id, qty)}
                              minQuantity={item.minQuantity}
                            />
                          </div>
                        </div>
                        
                        {/* Total Price */}
                        <div className="text-right">
                          <div className="text-xl font-bold text-green-600">
                            {(item.totalWithTax * item.quantity).toFixed(2)} ريال
                          </div>
                          <div className="text-sm text-gray-500">
                            ({item.totalWithTax} × {item.quantity})
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4 text-right">ملخص الطلب</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">المجموع الفرعي:</span>
                  <span>{cart.subtotal.toFixed(2)} ريال</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">الضريبة:</span>
                  <span>{(cart.totalWithTax - cart.subtotal).toFixed(2)} ريال</span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>المجموع النهائي:</span>
                    <span className="text-green-600">{cart.totalWithTax.toFixed(2)} ريال</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handlePlaceOrder}
                  className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold"
                >
                  إتمام الطلب
                </button>
                
                <button
                  onClick={handleClearCart}
                  className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors font-semibold"
                >
                  إفراغ السلة
                </button>
              </div>
              
              <div className="mt-6 text-center">
                <a
                  href="/orgPortal?view=products"
                  className="text-blue-500 hover:text-blue-700 transition-colors"
                >
                  ← العودة للتسوق
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;