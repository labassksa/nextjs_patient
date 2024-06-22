"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

const CardDetails: React.FC = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const countryCode = searchParams.get("countryCode");
  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [formRendered, setFormRendered] = useState(false);
  const myFatoorahInitializedRef = useRef(false);

  useEffect(() => {
    if (!sessionId || !countryCode) return;

    const scriptId = "myFatoorahScript";

    const loadScript = () => {
      return new Promise<void>((resolve, reject) => {
        const existingScript = document.getElementById(scriptId);
        if (existingScript) {
          console.log("Script already exists, resolving...");
          setIsScriptLoaded(true);
          resolve();
          return;
        }

        const script = document.createElement("script");
        script.id = scriptId;
        script.src = "https://demo.myfatoorah.com/cardview/v2/session.js";
        script.onload = () => {
          console.log("MyFatoorah script loaded successfully.");
          setIsScriptLoaded(true);
          resolve();
        };
        script.onerror = (error) => {
          console.error("Failed to load MyFatoorah script.", error);
          reject(error);
        };
        document.body.appendChild(script);
        console.log("Script element added to the document.");
      });
    };

    const initializeMyFatoorah = () => {
      if (
        typeof window !== "undefined" &&
        window.myFatoorah &&
        !myFatoorahInitializedRef.current
      ) {
        const cardElement = document.getElementById("card-element");
        if (!cardElement) {
          console.error("Card element not found.");
          return;
        }
        console.log(
          `myFatoorahInitialized: ${myFatoorahInitializedRef.current}`
        );
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
        console.log("MyFatoorah initialized successfully.");
        myFatoorahInitializedRef.current = true;
      } else if (myFatoorahInitializedRef.current) {
        console.log("MyFatoorah is already initialized.");
      } else {
        console.error("MyFatoorah is not available on window.");
      }
    };

    loadScript()
      .then(() => {
        const cardElementInterval = setInterval(() => {
          if (document.getElementById("card-element")) {
            clearInterval(cardElementInterval);
            initializeMyFatoorah();
          }
        }, 100);
      })
      .catch(console.error);
  }, [sessionId, countryCode]);

  useEffect(() => {
    if (sessionId && countryCode && isScriptLoaded && !formRendered) {
      setFormRendered(true);
    }
  }, [sessionId, countryCode, isScriptLoaded]);

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

      window.myFatoorah.submit().then((response) => {
        console.log("Submit response received:", response);
        // In case of success
        // Here you need to pass session id to you backend here
        var sessionId = response.sessionId;
        var cardBrand = response.cardBrand; //cardBrand will be one of the following values: Master, Visa, Mada, Amex
        var cardIdentifier = response.cardIdentifier;
        console.log("session", sessionId);
      });

      //   if (response) {
      //     console.log("Session ID received:", response.sessionId);
      //     try {
      //       console.log("Before calling execute payment API");
      //       const executePaymentResponse = await axios.post(
      //         "http://localhost:4000/api_labass/execute-payment",
      //         {
      //           sessionId: response.sessionId,
      //           invoiceValue: 100,
      //           customerName: "John Doe",
      //           displayCurrencyIso: "KWD",
      //           mobileCountryCode: "+965",
      //           customerMobile: "12345678",
      //           customerEmail: "john.doe@example.com",
      //           callbackUrl: "https://yoursite.com/success",
      //           errorUrl: "https://yoursite.com/error",
      //           customerReference: "ref123",
      //           customerAddress: {
      //             Block: "1",
      //             Street: "Main Street",
      //             HouseBuildingNo: "10",
      //             AddressInstructions: "Near the park",
      //           },
      //           invoiceItems: [
      //             {
      //               ItemName: "Product 1",
      //               Quantity: 1,
      //               UnitPrice: 100,
      //             },
      //           ],
      //         }
      //       );

      //       console.log(
      //         "Execute payment response received:",
      //         executePaymentResponse
      //       );

      //       if (executePaymentResponse.data.IsSuccess) {
      //         console.log(
      //           `Payment URL: ${executePaymentResponse.data.Data.PaymentURL}`
      //         );
      //         handle3DSecure(executePaymentResponse.data.Data.PaymentURL);
      //       } else {
      //         console.error(
      //           "Execute payment failed:",
      //           executePaymentResponse.data.Message
      //         );
      //       }
      //     } catch (error) {
      //       console.error("Error executing payment:", error);
      //     }
      //   } else {
      //     console.error("Payment submission failed:", response);
      //   }
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
          {formRendered ? (
            <div className="bg-white">
              <div id="card-element"></div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
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
