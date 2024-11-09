"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

const PromoCode: React.FC<{
  setDiscountedPrice: (price: number) => void;
  setPromoCode: (code: string) => void;
}> = ({ setDiscountedPrice, setPromoCode }) => {
  const [promoCodeInput, setPromoCodeInput] = useState(""); // Promo code value
  const [responseMessage, setResponseMessage] = useState(""); // Feedback message (success or error)
  const [isSuccess, setIsSuccess] = useState(false); // Track success state
  const [isFieldFrozen, setIsFieldFrozen] = useState(false); // Track whether the field is frozen
  const [loading, setLoading] = useState(false); // Track loading state
  const [showModal, setShowModal] = useState(false); // Modal state for success
  const [consultationId, setConsultationId] = useState<number | null>(null); // State to store consultationId

  const router = useRouter(); // Initialize router

  const defaultPrice = 89; // Default price

  const handleApplyPromo = async () => {
    if (promoCodeInput.length !== 7) {
      setResponseMessage("الرمز الترويجي يجب أن يكون مكونًا من 7 أحرف");
      setIsSuccess(false);
      return;
    }

    const token = localStorage.getItem("labass_token");

    if (!token) {
      setResponseMessage("سجل دخول أولا لاستخدام الخصم");
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
      console.log(`the response.data ${response.data.discountedPrice}`);

      if (response.data.discountedPrice) {
        setDiscountedPrice(response.data.discountedPrice); // Update discounted price
        setPromoCode(promoCodeInput); // Set promo code in the parent state
        setResponseMessage(
          `تم تطبيق الرمز! السعر المخفض: ${response.data.discountedPrice.toFixed(
            2
          )}`
        );
        setIsSuccess(true); // Mark success
        setIsFieldFrozen(true); // Freeze the field after successful application
      } else if (response.data.message === "Promotional code not found") {
        setResponseMessage("الرمز الترويجي غير موجود");
        setIsSuccess(false); // Handle invalid promo code
      } else if (response.data.message === "Promotional code is already used") {
        setResponseMessage("تم استخدام الرمز الترويجي سابقا");
        setIsSuccess(false); // Handle already used promo code
      } else if (response.data.consultationId != null) {
        // Handle free consultation case
        setConsultationId(response.data.consultationId); // Store the consultationId
        setResponseMessage("تمت العملية بنجاح - لقد حصلت على استشارة !");
        setIsSuccess(true);
        setShowModal(true); // Show success modal
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
      setResponseMessage(""); // Clear success message if the code is being changed
      setIsSuccess(false); // Reset success status
    }

    setPromoCodeInput(newPromoCode); // Update input value
  };

  const handleGoToFillPersonalInfo = () => {
    if (consultationId) {
      console.log("inside PromoCode");
      router.push(`/patientSelection?consultationId=${consultationId}`);
    } else {
      console.error("Consultation ID is missing.");
    }
  };

  return (
    <div className="relative flex flex-col border border-gray-200 rounded-lg bg-white mx-2 p-2">
      <div className="flex flex-row ">
        <button
          onClick={handleApplyPromo}
          className={`flex items-center  ${
            isFieldFrozen ? "cursor-not-allowed opacity-50" : ""
          }`}
          style={{
            margin: "0",
            padding: "0 4px", // px-2 and py-0 equivalent
            backgroundColor: "#22c55e", // Green background
            color: "white", // Text color white
            fontSize: "12px", // Equivalent to text-xs
            borderRadius: "0.5rem", // Rounded corners
            height: "32px", // Height for better button control
            lineHeight: "normal", // Reset line height
          }}
          disabled={loading || isFieldFrozen}
        >
          {loading ? (
            <div
              style={{
                borderTopColor: "transparent",
                border: "2px solid white",
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            ></div>
          ) : (
            "استخدام"
          )}
        </button>
        <input
          type="text"
          value={promoCodeInput}
          onChange={handleInputChange}
          placeholder="أدخل الرمز الترويجي"
          className={`flex-grow text-sm focus:outline-none rounded-r-md text-black ${
            isFieldFrozen ? "bg-gray-200" : "" // Gray out the field if frozen
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

      {/* Modal for success message */}
      {showModal && (
        <div className="modal">
          <div className="modal-content text-black">
            <p>{responseMessage}</p>
            <button
              className="text-white background-custom-green"
              onClick={handleGoToFillPersonalInfo}
            >
              أكمل معلوماتك
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
        }
        button {
          margin-top: 20px;
          padding: 10px 20px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default PromoCode;
