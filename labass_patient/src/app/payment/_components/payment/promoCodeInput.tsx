"use client"; // Ensure this is a client-side component

import React, { useState } from "react";
import axios from "axios";

const PromoCode: React.FC = () => {
  const [promoCode, setPromoCode] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const handleApplyPromo = async () => {
    if (promoCode.length !== 7) {
      setResponseMessage("الرمز الترويجي يجب أن يكون مكونًا من 7 أحرف");
      return;
    }

    // Get the token from localStorage
    const token = localStorage.getItem("labass_token");

    if (!token) {
      setResponseMessage("لم يتم العثور على رمز التوثيق");
      return;
    }

    // Use environment variable for the backend URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      const response = await axios.post(
        `${apiUrl}/use-promo`,
        {
          promoCode: promoCode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the request header
          },
        }
      );

      // Handle successful response
      if (response.data.discountedPrice) {
        setResponseMessage(
          `تم تطبيق الرمز! السعر المخفض: ${response.data.discountedPrice}`
        );
      } else if (response.data.message === "Promotional code not found") {
        setResponseMessage("الرمز الترويجي غير موجود");
      } else if (response.data.message === "Promotional code is already used") {
        setResponseMessage("تم استخدام الرمز الترويجي بالفعل");
      } else {
        setResponseMessage(response.data.message);
      }
    } catch (error: any) {
      // Improve error handling
      if (error.response) {
        // Check if it's a 400 error with a specific message from the backend
        if (error.response.status === 500 && error.response.data.message) {
          setResponseMessage(error.response.data.message);
        } else {
          // For 500 or other errors, display a generic message
          setResponseMessage("حدث خطأ أثناء محاولة تطبيق الرمز الترويجي");
        }
      } else {
        setResponseMessage("حدث خطأ أثناء محاولة تطبيق الرمز الترويجي");
      }
    }
  };

  return (
    <div className="relative flex justify-around border-2 border-gray-300 rounded-md bg-white mx-2">
      <button
        onClick={handleApplyPromo}
        className="px-4 bg-custom-background text-custom-green rounded-r-md"
      >
        استخدام
      </button>
      <input
        type="text"
        value={promoCode}
        onChange={(e) => setPromoCode(e.target.value)}
        placeholder="أدخل الرمز الترويجي"
        className="flex-grow p-2 focus:outline-none rounded-l-md"
        dir="rtl"
      />
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default PromoCode;
