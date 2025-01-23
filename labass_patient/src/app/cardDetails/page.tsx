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
  // ---------------------------------------------
  // 1. Read URL parameters
  // ---------------------------------------------
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const countryCode = searchParams.get("countryCode"); // e.g. "SAU", or "SAR"
  const discountedPrice = searchParams.get("discountedPrice");
  const promoCode = searchParams.get("promoCode");

  // ---------------------------------------------
  // 2. State and Refs
  // ---------------------------------------------
  const myFatoorahInitializedRef = useRef(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(false);

  // ---------------------------------------------
  // 3. On mount, add postMessage listener
  // ---------------------------------------------
  useEffect(() => {
    console.log(
      "[CardDetails] Mounted. sessionId:",
      sessionId,
      "countryCode:",
      countryCode,
      "discountedPrice:",
      discountedPrice,
      "promoCode:",
      promoCode
    );

    // Listen for "MF-3DSecure" messages from MyFatoorah
    window.addEventListener("message", handle3DSRedirection, false);

    return () => {
      console.log("[CardDetails] Unmounted. Removing event listener.");
      window.removeEventListener("message", handle3DSRedirection, false);
    };
  }, [sessionId, countryCode, discountedPrice, promoCode]);

  // ---------------------------------------------
  // 4. Initialize MyFatoorah
  // ---------------------------------------------
  const initializeMyFatoorah = () => {
    console.log("[initializeMyFatoorah] Attempting init...");

    if (!myFatoorahInitializedRef.current && window.myFatoorah) {
      console.log(
        "[initializeMyFatoorah] MyFatoorah found. Initializing with:",
        {
          sessionId,
          countryCode,
        }
      );

      // Initialize the card fields
      window.myFatoorah.init({
        // If your gateway specifically needs "SAR", you can hardcode it here:
        // countryCode: "SAR",
        // Otherwise, if you want to respect the param, use:
        countryCode,
        sessionId,
        cardViewId: "card-element",
        supportedNetworks: "v,m,md,ae",
      });

      myFatoorahInitializedRef.current = true;
      setIsInitialized(true);
      console.log("[initializeMyFatoorah] Successfully initialized.");
    } else {
      console.warn(
        "[initializeMyFatoorah] MyFatoorah script not available or already initialized."
      );
    }
  };

  // ---------------------------------------------
  // 5. Submit Payment
  // ---------------------------------------------
  const handlePaymentSubmit = async () => {
    console.log("[handlePaymentSubmit] Submitting payment...");
    setLoading(true);

    // Check if .submit exists
    if (!window.myFatoorah || typeof window.myFatoorah.submit !== "function") {
      console.error(
        "[handlePaymentSubmit] window.myFatoorah.submit is not available."
      );
      setLoading(false);
      return;
    }

    // Check sessionId
    if (!sessionId) {
      console.error("[handlePaymentSubmit] No sessionId found in URL.");
      setLoading(false);
      return;
    }

    try {
      // This triggers tokenization & initial validation
      console.log(
        "[handlePaymentSubmit] Calling myFatoorah.submit() with sessionId:",
        sessionId
      );
      const submitResponse = await window.myFatoorah.submit();
      console.log("[handlePaymentSubmit] submit response:", submitResponse);

      if (submitResponse) {
        // Retrieve token from localStorage
        const token = localStorage.getItem("labass_token");
        if (!token) {
          console.error(
            "[handlePaymentSubmit] No token found in localStorage."
          );
          setLoading(false);
          return;
        }

        // Make the /execute-payment call to get a PaymentURL
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          console.log(
            "[handlePaymentSubmit] Posting to /execute-payment with token:",
            token
          );

          // Keep the fallback as a number "89"
          const invoiceValue = discountedPrice
            ? Number(discountedPrice).toFixed(2)
            : "89";

          // Hardcode "SAR" if your account is strictly for SAR
          const displayCurrencyIso = "SAR";

          const executePaymentResponse =
            await axios.post<ExecutePaymentResponse>(
              `${apiUrl}/execute-payment`,
              {
                SessionId: submitResponse.sessionId,
                DisplayCurrencyIso: displayCurrencyIso,
                InvoiceValue: invoiceValue,
                PromoCode: promoCode,
                // The URLs for final callbacks
                CallBackUrl: "https://labass.sa/cardDetails/success",
                ErrorUrl: "https://labass.sa/cardDetails/error",
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

          console.log(
            "[handlePaymentSubmit] /execute-payment result:",
            executePaymentResponse.data
          );

          if (executePaymentResponse.data.IsSuccess) {
            const paymentUrl = executePaymentResponse.data.Data.PaymentURL;
            console.log(
              "[handlePaymentSubmit] PaymentURL for 3D Secure:",
              paymentUrl
            );

            // Now open the 3D Secure page in an iFrame:
            handle3DSecure(paymentUrl);
          } else {
            console.error(
              "[handlePaymentSubmit] Execute payment failed:",
              executePaymentResponse.data.Message
            );
            setLoading(false);
          }
        } catch (error) {
          console.error(
            "[handlePaymentSubmit] Error calling /execute-payment:",
            error
          );
          setLoading(false);
        }
      } else {
        console.error(
          "[handlePaymentSubmit] Payment submission failed. Response:",
          submitResponse
        );
        setLoading(false);
      }
    } catch (error) {
      console.error("[handlePaymentSubmit] Payment error:", error);
      setLoading(false);
    }
  };

  // ---------------------------------------------
  // 6. Open 3D Secure in iFrame
  // ---------------------------------------------
  const handle3DSecure = (paymentUrl: string) => {
    console.log(
      "[handle3DSecure] Creating iFrame for 3DS. PaymentUrl:",
      paymentUrl
    );
    const iframeUrl = `${paymentUrl}&iframeEnabled=true`; // MyFatoorah param

    // Create or reuse the container
    let container = document.getElementById("threeDS-container");
    if (!container) {
      console.log("[handle3DSecure] Creating #threeDS-container in DOM.");
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

    // Clear the container
    container.innerHTML = "";

    // Create iframe
    const iframe = document.createElement("iframe");
    iframe.src = iframeUrl;
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";

    // Attach the iframe
    container.appendChild(iframe);
    console.log(
      "[handle3DSecure] iFrame attached. User should see OTP entry screen."
    );
  };

  // ---------------------------------------------
  // 7. Handle 3D Secure Redirection
  // ---------------------------------------------
  const handle3DSRedirection = (event: MessageEvent) => {
    console.log("[handle3DSRedirection] Received message:", event.data);
    if (!event.data) return;

    try {
      const message = JSON.parse(event.data);
      console.log("[handle3DSRedirection] Parsed JSON message:", message);

      // MyFatoorah uses sender = "MF-3DSecure"
      if (message.sender === "MF-3DSecure") {
        const redirectionUrl = message.url;
        console.log(
          "[handle3DSRedirection] The final redirection URL is:",
          redirectionUrl
        );

        // If the callback has "error" in it, handle as error
        if (redirectionUrl.includes("error")) {
          console.error(
            "[handle3DSRedirection] 3DS flow returned error. Redirecting..."
          );
          window.location.href = "https://labass.sa/cardDetails/error";
        } else {
          console.log(
            "[handle3DSRedirection] 3DS flow success. Redirecting..."
          );
          window.location.href = "https://labass.sa/cardDetails/success";
        }
      }
    } catch (error) {
      console.error(
        "[handle3DSRedirection] Error handling 3DS message:",
        error
      );
    }
  };

  // ---------------------------------------------
  // 8. Render
  // ---------------------------------------------
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-between">
      {/* MyFatoorah Script */}
      <Script
        src="https://sa.myfatoorah.com/cardview/v2/session.js"
        strategy="lazyOnload"
        onLoad={() => {
          console.log("[Script] MyFatoorah session.js loaded. Initializing...");
          initializeMyFatoorah();
        }}
        onError={() =>
          console.error("[Script] MyFatoorah script failed to load.")
        }
      />

      {/* Page Header */}
      <Header title="ادفع" showBackButton />

      {/* Card Info Form */}
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

      {/* Pay Button */}
      <div>
        <button
          className="sticky bottom-0 p-2 my-2 w-full font-bold bg-custom-green text-white text-sm rounded-3xl"
          onClick={handlePaymentSubmit}
          disabled={!isInitialized || loading}
        >
          {loading ? "Processing..." : "ادفع"}
        </button>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="text-center mt-4">
          <p>Processing payment, please wait...</p>
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
