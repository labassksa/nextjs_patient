"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import axios from "axios";
import Header from "../../components/common/header";

declare global {
  interface Window {
    myFatoorah: any;
    myFatoorahAP: any;
  }
}

type ExecutePaymentResponse = {
  IsSuccess: boolean;
  Message: string | null;
  ValidationErrors: string | null;
  Data: {
    InvoiceId: number;
    IsDirectPayment: boolean;
    PaymentURL: string;
    CustomerReference: string | null;
    UserDefinedField: string | null;
    RecurringId: string | null;
  };
};

const CardDetails: React.FC = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const countryCode = searchParams.get("countryCode");
  const myFatoorahInitializedRef = useRef(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.myFatoorah &&
      sessionId &&
      countryCode
    ) {
      initializeMyFatoorah();
    }

    // Event listener for 3DS redirection URL
    window.addEventListener("message", handle3DSRedirection, false);

    return () => {
      window.removeEventListener("message", handle3DSRedirection, false);
    };
  }, [sessionId, countryCode]);

  const initializeMyFatoorah = () => {
    if (!myFatoorahInitializedRef.current) {
      console.log("Initializing MyFatoorah with:", { countryCode, sessionId });
      window.myFatoorah.init({
        countryCode,
        sessionId,
        cardViewId: "card-element",
        supportedNetworks: "v,m,md,ae",
      });
      console.log("MyFatoorah initialized successfully.");
      myFatoorahInitializedRef.current = true;
      setIsInitialized(true);
    }
  };

  const handlePaymentSubmit = async () => {
    console.log("Submitting payment...");

    // Check if MyFatoorah is initialized and the submit function is available
    if (!window.myFatoorah || typeof window.myFatoorah.submit !== "function") {
      console.error("window.myFatoorah.submit is not available.");
      return;
    }

    // Check if sessionId is available
    if (!sessionId) {
      console.error("Session ID is missing. Unable to proceed with payment.");
      return;
    }

    try {
      // Log before submission to see if sessionId and session data is correctly passed
      console.log("Submitting payment with sessionId:", sessionId);

      // Submit the payment
      const response = await window.myFatoorah.submit();
      console.log("Submit response received:", response);

      if (response) {
        const token = localStorage.getItem("labass_token");

        if (!token) {
          console.error("Token not found in localStorage.");
          return;
        }

        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          const executePaymentResponse =
            await axios.post<ExecutePaymentResponse>(
              `${apiUrl}/execute-payment`,
              {
                SessionId: response.sessionId,
                DisplayCurrencyIso: "KWD",
                InvoiceValue: 101,
                CallBackUrl: "https://labass.sa/cardDetails/success",
                ErrorUrl: "https://labass.sa/cardDetails/error",
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
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
          console.error("Error executing payment:", error);
        }
      } else {
        console.error("Payment submission failed:", response);
      }
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  const handle3DSecure = (paymentUrl: string) => {
    const iframeUrl = `${paymentUrl}&iframeEnabled=true`;

    // Clear existing content
    document.body.innerHTML = "";

    // Create and style the iframe
    const iframe = document.createElement("iframe");
    iframe.src = iframeUrl;
    iframe.style.position = "fixed";
    iframe.style.top = "0";
    iframe.style.left = "0";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    iframe.style.zIndex = "9999";

    document.body.appendChild(iframe);
  };

  const handle3DSRedirection = (event: MessageEvent) => {
    if (!event.data) return;

    try {
      const message = JSON.parse(event.data);

      if (message.sender === "MF-3DSecure") {
        const redirectionUrl = message.url;
        if (redirectionUrl.includes("error")) {
          window.location.href = "https://labass.sa/cardDetails/error";
        } else {
          window.location.href = "https://labass.sa/cardDetails/success";
        }
      }
    } catch (error) {
      console.error("Error handling 3DS redirection:", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-between p-4">
      <script
        src="https://demo.myfatoorah.com/cardview/v2/session.js"
        defer
        onLoad={initializeMyFatoorah}
      />
      <Header title="ادفع" showBackButton />
      <div>
        <h1
          className="flex flex-row text-black text-lg font-bold mb-4 mt-16"
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
      <div>
        <button
          className="sticky bottom-0 p-2 w-full font-bold bg-custom-green text-white text-sm rounded-3xl"
          onClick={handlePaymentSubmit}
          disabled={!isInitialized}
        >
          ادفع
        </button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CardDetails />
    </Suspense>
  );
};

export default App;
