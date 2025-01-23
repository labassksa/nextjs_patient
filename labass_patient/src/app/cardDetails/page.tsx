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
  const countryCode = searchParams.get("countryCode"); // e.g. "SAU"
  const discountedPrice = searchParams.get("discountedPrice");
  const promoCode = searchParams.get("promoCode");

  const myFatoorahInitializedRef = useRef(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.addEventListener("message", handle3DSRedirection, false);
    return () => {
      window.removeEventListener("message", handle3DSRedirection, false);
    };
  }, []);

  const initializeMyFatoorah = () => {
    if (!myFatoorahInitializedRef.current && window.myFatoorah) {
      console.log("Initializing MyFatoorah with:", { countryCode, sessionId });
      window.myFatoorah.init({
        // If your gateway expects "SAR" for currency, you can hardcode:
        // countryCode: "SAR",
        // Otherwise, if you rely on the query param being correct:
        countryCode,
        sessionId,
        cardViewId: "card-element",
        supportedNetworks: "v,m,md,ae",
      });
      console.log("MyFatoorah initialized successfully.");
      myFatoorahInitializedRef.current = true;
      setIsInitialized(true);
    } else {
      console.error("MyFatoorah script not available or already initialized.");
    }
  };

  const handlePaymentSubmit = async () => {
    setLoading(true);
    console.log("Submitting payment...");

    if (!window.myFatoorah || typeof window.myFatoorah.submit !== "function") {
      console.error("window.myFatoorah.submit is not available.");
      setLoading(false);
      return;
    }

    if (!sessionId) {
      console.error("Session ID is missing. Unable to proceed with payment.");
      setLoading(false);
      return;
    }

    try {
      console.log("Submitting payment with sessionId:", sessionId);
      const response = await window.myFatoorah.submit();
      console.log("Submit response received:", response);

      if (response) {
        const token = localStorage.getItem("labass_token");
        if (!token) {
          console.error("Token not found in localStorage.");
          setLoading(false);
          return;
        }

        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          const executePaymentResponse =
            await axios.post<ExecutePaymentResponse>(
              `${apiUrl}/execute-payment`,
              {
                SessionId: response.sessionId,
                // If your backend expects "SAR", replace countryCode with "SAR"
                DisplayCurrencyIso: "SAR",
                InvoiceValue: discountedPrice
                  ? Number(discountedPrice).toFixed(2)
                  : 89,
                CallBackUrl: "https://labass.sa/cardDetails/success",
                ErrorUrl: "https://labass.sa/cardDetails/error",
                PromoCode: promoCode,
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
            setLoading(false);
          }
        } catch (error) {
          console.error("Error executing payment:", error);
          setLoading(false);
        }
      } else {
        console.error("Payment submission failed:", response);
        setLoading(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setLoading(false);
    }
  };

  /**
   * Creates/clears a dedicated container and injects an iframe
   * so you don't wipe out the entire React DOM.
   */
  const handle3DSecure = (paymentUrl: string) => {
    const iframeUrl = `${paymentUrl}&iframeEnabled=true`;

    // Create a container for the iFrame if it doesn't exist
    let container = document.getElementById("threeDS-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "threeDS-container";
      container.style.position = "fixed";
      container.style.top = "0";
      container.style.left = "0";
      container.style.width = "100%";
      container.style.height = "100%";
      container.style.zIndex = "9999";
      document.body.appendChild(container);
    }

    // Clear previous content if any
    container.innerHTML = "";

    // Create and style the iframe
    const iframe = document.createElement("iframe");
    iframe.src = iframeUrl;
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";

    // Append to the container
    container.appendChild(iframe);
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
    <div className="bg-gray-100 min-h-screen flex flex-col justify-between">
      <Script
        src="https://sa.myfatoorah.com/cardview/v2/session.js"
        strategy="lazyOnload"
        onLoad={initializeMyFatoorah}
        onError={() => console.error("MyFatoorah script failed to load.")}
      />
      <Header title="ادفع" showBackButton />

      <div>
        <h1
          className="flex flex-row text-black text-md font-bold mb-4 mt-20 mr-2"
          dir="rtl"
        >
          أدخل معلومات البطاقة
        </h1>
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mt-10 mx-auto">
          <div className="bg-white">
            <div id="card-element"></div>
          </div>
        </div>
      </div>

      <div>
        <button
          className="sticky bottom-0 p-2 my-2 w-full font-bold bg-custom-green text-white text-sm rounded-3xl"
          onClick={handlePaymentSubmit}
          disabled={!isInitialized || loading}
        >
          {loading ? "Processing..." : "ادفع"}
        </button>
      </div>

      {loading && (
        <div className="text-center mt-4">
          Processing payment, please wait...
        </div>
      )}
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
