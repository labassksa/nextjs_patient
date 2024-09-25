"use client";
import React, { useState } from "react";
import axios from "axios";

const PromoCode: React.FC<{
  setDiscountedPrice: (price: number) => void;
  setPromoCode: (code: string) => void;
}> = ({ setDiscountedPrice, setPromoCode }) => {
  const [promoCodeInput, setPromoCodeInput] = useState(""); // Promo code value
  const [responseMessage, setResponseMessage] = useState(""); // Feedback message (success or error)
  const [isSuccess, setIsSuccess] = useState(false); // Track success state
  const [isFieldFrozen, setIsFieldFrozen] = useState(false); // Track whether the field is frozen
  const [loading, setLoading] = useState(false); // Track loading state

  const defaultPrice = 89; // Default price

  const handleApplyPromo = async () => {
    if (promoCodeInput.length !== 7) {
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
    setResponseMessage(""); // Clear previous messages

    try {
      const response = await axios.post(
        `${apiUrl}/use-promo`,
        {
          promoCode: promoCodeInput,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.discountedPrice) {
        setDiscountedPrice(response.data.discountedPrice); // Update discounted price
        setPromoCode(promoCodeInput); // Freeze promo code by setting it in the parent
        setResponseMessage(
          `تم تطبيق الرمز! السعر المخفض: ${response.data.discountedPrice}`
        );
        setIsSuccess(true);
        setIsFieldFrozen(true); // Freeze the field after successful application
      } else if (response.data.message === "Promotional code not found") {
        setResponseMessage("الرمز الترويجي غير موجود");
        setIsSuccess(false); // Handle invalid promo code
      } else if (response.data.message === "Promotional code is already used") {
        setResponseMessage("تم استخدام الرمز الترويجي بالفعل");
        setIsSuccess(false); // Handle already used promo code
      } else {
        setResponseMessage(response.data.message);
        setIsSuccess(false);
      }
    } catch (error: any) {
      setResponseMessage("حدث خطأ أثناء محاولة تطبيق الرمز الترويجي");
      setIsSuccess(false);
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPromoCode = e.target.value;

    // If the user touches the field after it is frozen, reset the field
    if (isFieldFrozen) {
      setPromoCode(""); // Reset promo code to empty string
      setDiscountedPrice(defaultPrice); // Reset to default price
      setIsFieldFrozen(false); // Make the field editable again
      setResponseMessage(""); // Clear any success message
    }

    setPromoCodeInput(newPromoCode); // Update input value
  };

  return (
    <div className="relative flex flex-col border-2 border-gray-300 rounded-md bg-white mx-2 p-2">
      <div className="flex justify-between items-center">
        <button
          onClick={handleApplyPromo}
          className={`px-4 bg-custom-background text-custom-green rounded-l-md flex items-center ${
            isFieldFrozen ? "cursor-not-allowed opacity-50" : "" // Disable button if field is frozen
          }`}
          disabled={loading || isFieldFrozen} // Disable the button when loading or field is frozen
        >
          {loading ? (
            <div className="spinner-border animate-spin inline-block w-4 h-4 border-2 border-t-transparent rounded-full"></div>
          ) : (
            "استخدام"
          )}
        </button>
        <input
          type="text"
          value={promoCodeInput}
          onChange={handleInputChange}
          placeholder="أدخل الرمز الترويجي"
          className={`flex-grow p-2 focus:outline-none rounded-r-md ${
            isFieldFrozen ? "bg-gray-200 text-gray-500" : "" // Gray out the field if frozen
          }`}
          dir="rtl"
          disabled={loading || isFieldFrozen} // Disable input when frozen or loading
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
