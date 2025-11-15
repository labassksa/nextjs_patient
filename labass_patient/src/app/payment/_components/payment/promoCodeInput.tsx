"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { PaymentMethodEnum } from "../../../../types/paymentMethods"; // Import PaymentMethodEnum
import { convertArabicToEnglishNumbers } from "../../../../utils/arabicToenglish"; // Import the utility function for conversion

const PromoCode: React.FC<{
  setDiscountedPrice: (price: number) => void;
  setPromoCode: (code: string) => void;
  selectedPaymentMethod: PaymentMethodEnum; // Use PaymentMethodEnum type
}> = ({ setDiscountedPrice, setPromoCode, selectedPaymentMethod }) => {
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [cashAmount, setCashAmount] = useState(""); // State for cash amount input
  const [responseMessage, setResponseMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFieldFrozen, setIsFieldFrozen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [consultationId, setConsultationId] = useState<number | null>(null);

  const router = useRouter();
  const defaultPrice = 89;

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

    setLoading(true);
    setResponseMessage("");

    try {
      const response = await axios.post(
        `${apiUrl}/use-promo`,
        { promoCode: promoCodeInput, price: cashAmount || undefined },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("API Response:", response.data);

      // Handle successful response
      if (response.status === 200) {
        if (response.data.discountedPrice) {
          setDiscountedPrice(response.data.discountedPrice);
          setPromoCode(promoCodeInput);
          setResponseMessage(
            `تم تطبيق الرمز! السعر المخفض: ${response.data.discountedPrice.toFixed(
              2
            )}`
          );
          setIsSuccess(true);
          setIsFieldFrozen(true);
        } else if (response.data.consultationId != null) {
          setConsultationId(response.data.consultationId);
          setResponseMessage("تمت العملية بنجاح - لقد حصلت على استشارة!");
          setIsSuccess(true);
          setShowModal(true);
        } else {
          setResponseMessage("حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى");
          setIsSuccess(false);
        }
      } else {
        console.error("Unexpected status code:", response.status);
        setResponseMessage("حدث خطأ أثناء معالجة الطلب");
        setIsSuccess(false);
      }
    } catch (error: unknown) {
      console.error("Error during promo application:", error);

      // Narrow down the error type
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        const errorMessage = error.response.data.message;
        console.log("Backend Error Message:", errorMessage); // Debug log

        if (errorMessage === "Promotional code not found") {
          setResponseMessage("الرمز الترويجي غير موجود");
          setIsSuccess(false);
        } else if (errorMessage === "Promotional code is already used") {
          setResponseMessage("تم استخدام الرمز الترويجي سابقا");
          setIsSuccess(false);
        } else if (
          errorMessage === "This free promo code has already been used"
        ) {
          setResponseMessage("تم استخدام الرمز الترويجي سابقا");
          setIsSuccess(false);
        } else if (errorMessage === "Price is required") {
          console.log("Price condition matched.");
          setResponseMessage(
            "اختر الدفع نقدا وأدخل مبلغ الكاش للحصول على فاتورة الكترونية"
          );
          setIsSuccess(false);
        } else {
          setResponseMessage("حدث خطأ أثناء معالجة الطلب، يرجى المحاولة لاحقا");
          setIsSuccess(false);
        }
      } else {
        // Fallback for unexpected errors
        setResponseMessage("حدث خطأ أثناء محاولة تطبيق الرمز الترويجي");
        setIsSuccess(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFieldFrozen) {
      setPromoCode("");
      setDiscountedPrice(defaultPrice);
      setIsFieldFrozen(false);
      setResponseMessage("");
      setIsSuccess(false);
    }
    setPromoCodeInput(e.target.value);
  };

  const handleCashAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Filter out anything that's not a number and convert Arabic numerals
    const inputValue = e.target.value;
    const filteredValue = inputValue.replace(/[^٠١٢٣٤٥٦٧٨٩0-9]/g, ""); // Remove non-numeric characters
    const convertedValue = convertArabicToEnglishNumbers(filteredValue); // Convert Arabic to English in real-time
    setCashAmount(convertedValue); // Set the converted value directly
  };

  const handleGoToFillPersonalInfo = () => {
    if (consultationId) {
      // Check if it's an obesity consultation
      const consultationType = localStorage.getItem("consultationType");

      if (consultationType === "obesity") {
        // Redirect to obesity survey
        localStorage.setItem("obesityConsultationId", consultationId.toString());
        router.push(`/obesitySurvey?consultationId=${consultationId}`);
        return;
      }

      // Otherwise, go to patient selection
      router.push(`/patientSelection?consultationId=${consultationId}`);
    } else {
      console.error("Consultation ID is missing.");
    }
  };

  return (
    <div className="relative flex flex-col border border-gray-200 rounded-lg bg-white mx-2 p-2">
      <div className="flex flex-row">
        <button
          onClick={handleApplyPromo}
          className={`flex items-center ${
            isFieldFrozen ? "cursor-not-allowed opacity-50" : ""
          }`}
          style={{
            margin: "0",
            padding: "0 4px",
            backgroundColor: "#22c55e",
            color: "white",
            fontSize: "12px",
            borderRadius: "0.5rem",
            height: "32px",
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
            isFieldFrozen ? "bg-gray-200" : ""
          }`}
          dir="rtl"
          disabled={loading || isFieldFrozen}
        />
      </div>

      {responseMessage && (
        <p
          className={`mt-2 text-sm text-right ${
            isSuccess ? "text-custom-green" : "text-red-500"
          }`}
        >
          {responseMessage}
        </p>
      )}

      {/* Conditional input for cash payment */}
      {selectedPaymentMethod === PaymentMethodEnum.Cash && (
        <div className="mt-4">
          <label
            htmlFor="cashAmount"
            className="block text-sm font-medium text-black"
          ></label>
          <input
            id="cashAmount"
            type="text" // Use text type to allow Arabic numerals and control input
            value={cashAmount}
            onChange={handleCashAmountChange}
            placeholder="أدخل المبلغ النقدي"
            dir="rtl"
            className="mt-1 rtl block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-custom-green focus:ring-custom-green sm:text-sm"
          />
        </div>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content text-black">
            <p>{responseMessage}</p>
            <button
              className="text-white bg-green-500 px-4 py-2 rounded"
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
          background-color: #22c55e;
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
