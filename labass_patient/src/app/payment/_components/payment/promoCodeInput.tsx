"use client"; // Ensure this is a client-side component
import React, { useState } from "react";
import axios from "axios";

const PromoCode: React.FC<{ setDiscountedPrice: (price: number) => void }> = ({
  setDiscountedPrice,
}) => {
  const [promoCode, setPromoCode] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false); // Track if message is success or error
  const [loading, setLoading] = useState(false); // Track loading state

  const handleApplyPromo = async () => {
    if (promoCode.length !== 7) {
      setResponseMessage("الرمز الترويجي يجب أن يكون مكونًا من 7 أحرف");
      setIsSuccess(false);
      return;
    }

    const token = localStorage.getItem("labass_token");

    if (!token) {
      setResponseMessage("لم يتم العثور على رمز التوثيق");
      setIsSuccess(false);
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    setLoading(true); // Start loading spinner
    setResponseMessage(""); // Clear any previous messages

    try {
      const response = await axios.post(
        `${apiUrl}/use-promo`,
        {
          promoCode: promoCode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.discountedPrice) {
        setDiscountedPrice(response.data.discountedPrice);
        setResponseMessage(
          `تم تطبيق الرمز! السعر المخفض: ${response.data.discountedPrice}`
        );
        setIsSuccess(true); // Mark as success
      } else if (response.data.message === "Promotional code not found") {
        setResponseMessage("الرمز الترويجي غير موجود");
        setIsSuccess(false); // Mark as error
      } else if (response.data.message === "Promotional code is already used") {
        setResponseMessage("تم استخدام الرمز الترويجي بالفعل");
        setIsSuccess(false); // Mark as error
      } else {
        setResponseMessage(response.data.message);
        setIsSuccess(false); // Mark as error
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 500 && error.response.data.message) {
          setResponseMessage(error.response.data.message);
        } else {
          setResponseMessage("حدث خطأ أثناء محاولة تطبيق الرمز الترويجي");
        }
      } else {
        setResponseMessage("حدث خطأ أثناء محاولة تطبيق الرمز الترويجي");
      }
      setIsSuccess(false); // Mark as error
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <div className="relative flex flex-col border-2 border-gray-300 rounded-md bg-white mx-2 p-2">
      <div className="flex justify-between items-center">
        <button
          onClick={handleApplyPromo}
          className=" bg-custom-background text-custom-green rounded-l-md flex items-center"
          disabled={loading} // Disable button during loading
        >
          {loading ? (
            <div className="spinner-border animate-spin inline-block w-4 h-4 border-2 border-t-transparent rounded-full"></div>
          ) : (
            "استخدام"
          )}
        </button>
        <input
          type="text"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          placeholder="أدخل الرمز الترويجي"
          className="flex-grow p-2 text-black focus:outline-none rounded-r-md"
          dir="rtl"
          disabled={loading} // Disable input during loading
        />
      </div>

      {/* Display error/success message below the input */}
      {responseMessage && (
        <p
          className={`mt-2 text-sm text-right ${
            isSuccess ? "text-custom-green" : "text-red-500"
          }`}
        >
          {responseMessage}
        </p>
      )}
    </div>
  );
};

export default PromoCode;
