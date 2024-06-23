"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

declare global {
  interface Window {
    myFatoorah: any;
  }
}

const CardDetails: React.FC = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId") || "";
  const countryCode = searchParams.get("countryCode") || "";
  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);
  const myFatoorahInitializedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !sessionId || !countryCode) return;

    const initializeMyFatoorah = () => {
      if (window.myFatoorah && !myFatoorahInitializedRef.current) {
        console.log("Initializing MyFatoorah with:", {
          countryCode,
          sessionId,
        });
        window.myFatoorah.init({
          countryCode,
          sessionId,
          cardViewId: "card-element",
          supportedNetworks: "v,m,md,ae",
        });
        console.log("MyFatoorah initialized.");
        myFatoorahInitializedRef.current = true;
      } else if (myFatoorahInitializedRef.current) {
        console.log("MyFatoorah is already initialized.");
      } else {
        console.error("MyFatoorah is not available on window.");
      }
    };

    const scriptCheckInterval = setInterval(() => {
      if (window.myFatoorah) {
        clearInterval(scriptCheckInterval);
        initializeMyFatoorah();
      }
    }, 100);

    return () => clearInterval(scriptCheckInterval);
  }, [sessionId, countryCode]);

  const handlePaymentSubmit = async () => {
    console.log("Submitting payment...");

    if (
      typeof window === "undefined" ||
      !window.myFatoorah ||
      typeof window.myFatoorah.submit !== "function"
    ) {
      console.error("window.myFatoorah.submit is not available.");
      return;
    }

    try {
      console.log("Before submitting to MyFatoorah");

      const response = await window.myFatoorah.submit();
      console.log("Submit response received:", response);

      const sessionId = response.sessionId;
      const cardBrand = response.cardBrand; // cardBrand will be one of the following values: Master, Visa, Mada, Amex
      const cardIdentifier = response.cardIdentifier;
      const issuccess = response.IsSuccess;
      console.log("isSucess", issuccess);
      console.log("session", sessionId);

      // Call your execute payment endpoint here
      const executePaymentResponse = await axios.post(
        "http://localhost:4000/api_labass/execute-payment",
        {
          sessionId: response.sessionId,
          invoiceValue: 100, // Example value
          customerName: "John Doe", // Example value
          displayCurrencyIso: "KWD", // Example value
          mobileCountryCode: "+965", // Example value
          customerMobile: "12345678", // Example value
          customerEmail: "john.doe@example.com", // Example value
          callbackUrl: "https://yoursite.com/success", // Your success callback URL
          errorUrl: "https://yoursite.com/error", // Your error callback URL
          customerReference: "ref123", // Example value
          customerAddress: {
            Block: "1",
            Street: "Main Street",
            HouseBuildingNo: "10",
            AddressInstructions: "Near the park",
          },
          invoiceItems: [
            {
              ItemName: "Product 1",
              Quantity: 1,
              UnitPrice: 100,
            },
          ],
        }
      );

      if (executePaymentResponse.data.IsSuccess) {
        console.log(
          `Payment URL: ${executePaymentResponse.data.Data.PaymentURL}`
        );
        handle3DSecure(executePaymentResponse.data.Data.PaymentURL);
      } else {
        console.error(
          "Execute payment failed:",
          executePaymentResponse.data.Message
        );
      }
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  const handle3DSecure = (paymentUrl: string) => {
    const iframeUrl = `${paymentUrl}&iframeEnabled=true`;
    const iframe = document.createElement("iframe");
    iframe.src = iframeUrl;
    iframe.width = "100%";
    iframe.height = "500";
    document.body.appendChild(iframe);
    setIframe(iframe);

    window.addEventListener(
      "message",
      function (event) {
        if (!event.data) return;
        try {
          const message = JSON.parse(event.data);
          if (message.sender === "MF-3DSecure") {
            console.log("3D Secure completed:", message.url);
            verifyPaymentStatus(message.url);
          }
        } catch (error) {
          console.error("Error processing 3D Secure:", error);
        }
      },
      false
    );
  };

  const verifyPaymentStatus = async (paymentUrl: string) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api_labass/payment-status?paymentUrl=${paymentUrl}`
      );
      console.log("Payment status:", response.data);
      if (response.data.isSuccess) {
        // Payment is successful
        // Redirect or show success message
      } else {
        // Payment failed
        // Redirect or show error message
      }
    } catch (error) {
      console.error("Error verifying payment status:", error);
    }
  };

  const handleCancelPayment = () => {
    if (iframe) {
      document.body.removeChild(iframe);
      setIframe(null);
      console.log("Payment cancelled by the user.");
      // Optionally inform the server about the cancellation
      // axios.post('http://localhost:4000/api_labass/cancel-payment', { sessionId });
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-between p-4">
      <div>
        <h1
          className="flex flex-row text-black text-lg font-bold mb-4"
          dir="rtl"
        >
          أدخل معلومات البطاقة
        </h1>
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <div className="bg-white">
            <div id="card-element"></div>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <button
          className="bg-custom-green w-full text-white py-2 px-4 rounded mt-4"
          onClick={handlePaymentSubmit}
          disabled={!myFatoorahInitializedRef.current}
        >
          ادفع
        </button>
        {iframe && (
          <button
            className="bg-red-600 text-white py-2 px-4 rounded mt-4"
            onClick={handleCancelPayment}
          >
            إلغاء
          </button>
        )}
      </div>
    </div>
  );
};

export default CardDetails;
