import React, { useState } from "react";

const PromoCode: React.FC = () => {
  const [promoCode, setPromoCode] = useState("");

  const handleApplyPromo = () => {
    console.log("Applying promo code:", promoCode);
    // Add logic to validate or apply the promo code as needed
  };

  return (
    <div className="relative flex  justify-around border-2 border-gray-300 rounded-md bg-white mx-2">
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
    </div>
  );
};

export default PromoCode;
