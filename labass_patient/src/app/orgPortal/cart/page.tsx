"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Delete, ShoppingCart, Add, Remove } from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useCart } from "../../../hooks/useCart";
import QuantitySelector from "../../../components/QuantitySelector";
import axios from "axios";

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, refreshCart } = useCart();
  const [orderLoading, setOrderLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [orderResponse, setOrderResponse] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Refresh cart when component mounts to ensure we have latest data from localStorage
  React.useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const handleClearCart = () => {
    if (window.confirm("هل أنت متأكد من إفراغ السلة؟")) {
      clearCart();
    }
  };

  const submitOrder = async () => {
    try {
      const token = localStorage.getItem("labass_token");
      console.log("Token found:", !!token);
      if (!token) {
        throw new Error("No token found. Please log in to continue.");
      }

      // Prepare products array from cart
      const products = cart.items.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }));

      console.log("Products to send:", products);
      console.log("Request payload:", { products });

      const response = await axios.post(
        "https://api.labass.sa/api_marketplace/place-order",
        { products },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log("API response:", response);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(
          error.response.data.message ||
            "Failed to submit order."
        );
      } else if (error.request) {
        throw new Error(
          "No response from server. Please check your network connection."
        );
      } else {
        throw new Error(
          error.message || "An unexpected error occurred. Please try again."
        );
      }
    }
  };

  const handlePlaceOrder = async () => {
    console.log("Place order clicked");
    console.log("Cart items:", cart.items);
    
    if (cart.items.length === 0) {
      alert("السلة فارغة");
      return;
    }

    setOrderLoading(true);
    try {
      console.log("Submitting order...");
      const response = await submitOrder();
      console.log("Order response:", response);
      console.log("Setting success modal to true");
      setOrderResponse(response);
      setShowSuccessModal(true);
      console.log("Success modal state:", true);
      // Don't clear cart immediately - wait for modal close
    } catch (error: any) {
      console.error("Error submitting order:", error);
      setErrorMessage(error.message || "خطأ غير معروف");
      setShowErrorModal(true);
    } finally {
      setOrderLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    console.log("Closing success modal");
    setShowSuccessModal(false);
    setOrderResponse(null);
    // Clear cart after modal is closed
    clearCart();
  };

  const handleErrorModalClose = () => {
    console.log("Closing error modal");
    setShowErrorModal(false);
    setErrorMessage("");
  };

  const handleContactSupport = () => {
    window.open("https://wa.me/966505117551", "_blank");
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
        <div className="mb-6 flex justify-between items-start">
          <a
            href="/orgPortal?view=products"
            className="text-blue-500 hover:text-blue-700 transition-colors text-sm"
          >
            ← العودة للتسوق
          </a>
          <div className="text-right">
            <h1 className="text-2xl font-bold mb-2 text-black">سلة التسوق</h1>
            <p className="text-gray-600">عدد المنتجات: {cart.totalItems}</p>
          </div>
        </div>
        
        {/* Free Consultation Note */}
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-700 text-center font-medium" dir="rtl">
            🎁 احصل على استشارة طبية مجانية مقابل كل 300 ريال من مشترياتك
          </p>
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
              <h2 className="text-xl font-semibold mb-4 text-right text-black">ملخص الطلب</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">المجموع الفرعي:</span>
                  <span className="text-black">{cart.subtotal.toFixed(2)} ريال</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">الضريبة:</span>
                  <span className="text-black">{(cart.totalWithTax - cart.subtotal).toFixed(2)} ريال</span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-black">المجموع النهائي:</span>
                    <span className="text-black">{cart.totalWithTax.toFixed(2)} ريال</span>
                  </div>
                </div>
                
                {/* Bonus Consultations */}
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-green-700 font-medium">الاستشارات المجانية:</span>
                    <span className="text-green-700 font-bold">
                      {Math.floor(cart.totalWithTax / 300)} استشارة مجانية
                    </span>
                  </div>
                  <p className="text-green-600 text-xs mt-1" dir="rtl">
                    🎁 استشارة طبية مجانية لكل ٣٠٠ ريال
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handlePlaceOrder}
                  disabled={orderLoading}
                  className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {orderLoading ? "جاري إرسال الطلب..." : "إتمام الطلب"}
                </button>
                
                <button
                  onClick={handleClearCart}
                  className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors font-semibold"
                >
                  إفراغ السلة
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 mx-4 max-w-sm w-full">
            <div className="text-center">
              <CheckCircleIcon className="text-green-500 w-24 h-24 mx-auto mb-4" />
              <p className="text-lg font-semibold text-black mb-2">تم الإرسال بنجاح</p>
              <p className="text-gray-600 text-sm mb-6" dir="rtl">
                تم ارسال الطلب، سيتم التواصل معك من فريق لاباس
              </p>
              
              <button
                onClick={handleSuccessModalClose}
                className="p-3 w-full text-sm font-bold bg-green-500 text-white rounded-lg hover:bg-green-600"
                dir="rtl"
              >
                موافق
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 mx-4 max-w-sm w-full">
            <div className="text-center">
              <ErrorIcon className="text-red-500 w-24 h-24 mx-auto mb-4" />
              <p className="text-lg font-semibold text-black mb-2">حدث خطأ</p>
              <p className="text-gray-600 text-sm mb-4" dir="rtl">
                حدث خطأ أثناء إرسال الطلب. يرجى التواصل مع خدمة العملاء للمساعدة.
              </p>
              <p className="text-xs text-gray-500 mb-6" dir="rtl">
                تفاصيل الخطأ: {errorMessage}
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={handleContactSupport}
                  className="w-full flex items-center justify-center gap-2 p-3 text-sm font-bold bg-green-500 text-white rounded-lg hover:bg-green-600"
                  dir="rtl"
                >
                  <WhatsAppIcon className="w-5 h-5" />
                  تواصل مع خدمة العملاء
                </button>
                
                <button
                  onClick={handleErrorModalClose}
                  className="w-full p-3 text-sm font-bold bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  dir="rtl"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;