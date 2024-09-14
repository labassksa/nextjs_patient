import React, { useState } from "react";
import axios from "axios";

const PromoCode: React.FC = () => {
  const [promoCode, setPromoCode] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const handleApplyPromo = async () => {
    if (promoCode.length !== 6) {
      setResponseMessage("الرمز الترويجي يجب أن يكون مكونًا من 6 أحرف");
      return;
    }

    // Use environment variable for the backend URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      const response = await axios.post(`${apiUrl}/use-promo`, {
        promoCode: promoCode,
      });

      if (response.data.discountedPrice) {
        setResponseMessage(
          `تم تطبيق الرمز! السعر المخفض: ${response.data.discountedPrice}`
        );
      } else if (response.data.message) {
        setResponseMessage(response.data.message);
      }
    } catch (error) {
      setResponseMessage("حدث خطأ أثناء محاولة تطبيق الرمز الترويجي");
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
