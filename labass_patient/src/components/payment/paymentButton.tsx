"use client";

import React, { useState } from "react";
import AppleIcon from "@mui/icons-material/Apple";
import { PaymentMethodEnum } from "../../types/paymentMethods";
import { useRouter } from "next/navigation";
import axios from "axios";

interface PaymentButtonProps {
  method: string;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ method }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePaymentClick = async () => {
    if (method === PaymentMethodEnum.Card) {
      setLoading(true);
      try {
        // Call the initiate session endpoint
        const response = await axios.post(
          "http://localhost:4000/api_labass/initiate-session",
          {
            InvoiceAmount: 100, // Use actual amount
            CurrencyIso: "KWD", // Use actual currency
          }
        );

        if (response.data.IsSuccess) {
          const { SessionId, CountryCode } = response.data.Data;
          // Pass sessionId and countryCode to cardDetails page
          router.push(
            `/cardDetails?sessionId=${SessionId}&countryCode=${CountryCode}`
          );
        } else {
          // Handle the error
          console.error("Failed to initiate session:", response.data.Message);
        }
      } catch (error) {
        console.error("Error initiating session:", error);
      } finally {
        setLoading(false);
      }
    } else {
      router.push("/userPersonalInfo");
    }
  };

  if (method === PaymentMethodEnum.ApplePay) {
    return (
      <button
        className="sticky bottom-0 pb-4 w-full font-bold bg-black text-white py-4 px-4 rounded-3xl flex justify-center items-center"
        dir="rtl"
        onClick={handlePaymentClick}
        disabled={loading}
      >
        <AppleIcon className="ml-2" />
        Apple Pay
      </button>
    );
  } else if (method === PaymentMethodEnum.Card) {
    return (
      <button
        className="sticky bottom-0 pb-4 w-full font-bold bg-custom-green text-white py-4 px-4 rounded-3xl"
        dir="rtl"
        onClick={handlePaymentClick}
        disabled={loading}
      >
        {loading ? "Processing..." : "الدفع"}
      </button>
    );
  }

  return null;
};

export default PaymentButton;
