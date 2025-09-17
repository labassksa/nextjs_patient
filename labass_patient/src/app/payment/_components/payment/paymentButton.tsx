"use client";

import React, { useState, useEffect, useRef } from "react";
import { PaymentMethodEnum } from "../../../../types/paymentMethods";
import { useRouter } from "next/navigation";
import axios from "axios";

interface PaymentButtonProps {
  method: string;
  discountedPrice: number;
  promoCode: string;
  consultationType: string | null;
}

interface ApplePayConfig {
  sessionId: string;
  countryCode: string;
  currencyCode: string;
  amount: string;
  cardViewId: string;
  callback: (response: {
    sessionId: string;
    cardBrand: string;
    cardIdentifier: string;
  }) => void;
  sessionStarted: () => void;
  sessionCanceled: () => void;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const PaymentButton: React.FC<PaymentButtonProps> = ({
  method,
  discountedPrice,
  promoCode,
  consultationType,
}) => {
  const router = useRouter();

  // Local states
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const [consultationId, setConsultationId] = useState<number | null>(null);

  // Apple Pay references
  const applePayConfigRef = useRef<ApplePayConfig | null>(null);
  const scriptLoadedRef = useRef(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // ----------------------------------------------------------------
  // 1. Load the Apple Pay script once
  // ----------------------------------------------------------------
  useEffect(() => {
    const loadApplePayScript = () => {
      const script = document.createElement("script");
      script.src = "https://demo.myfatoorah.com/applepay/v3/applepay.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        console.log("Apple Pay script loaded successfully.");
        scriptLoadedRef.current = true;

        // If config is ready, init right away
        if (applePayConfigRef.current) {
          window.myFatoorahAP.init(applePayConfigRef.current);
          setIsInitialized(true);
          // Reflect the discounted price
          window.myFatoorahAP.updateAmount(discountedPrice.toFixed(2));
        }
      };

      script.onerror = () => {
        console.error("Error loading Apple Pay script.");
      };

      return () => {
        document.body.removeChild(script);
      };
    };

    if (!scriptLoadedRef.current) {
      loadApplePayScript();
    }
  }, []);

  // ----------------------------------------------------------------
  // 2. Initialize Apple Pay with discounted price
  // ----------------------------------------------------------------
  const initializeApplePay = async () => {
    if (method === PaymentMethodEnum.ApplePay) {
      try {
        const response = await axios.post(`${apiUrl}/initiate-session`, {
          InvoiceAmount: discountedPrice, // always use discounted
          CurrencyIso: "SAR",
        });

        if (response.data.IsSuccess) {
          const { SessionId } = response.data.Data;
          applePayConfigRef.current = {
            sessionId: SessionId,
            countryCode: "SAU",
            currencyCode: "SAR",
            amount: discountedPrice.toFixed(2),
            cardViewId: "apple-pay-container",
            callback: paymentCallback, // see below
            sessionStarted: sessionStarted,
            sessionCanceled: sessionCanceled,
          };

          if (scriptLoadedRef.current) {
            // init Apple Pay immediately
            window.myFatoorahAP.init(applePayConfigRef.current);
            setIsInitialized(true);
            // update to discounted price
            window.myFatoorahAP.updateAmount(discountedPrice.toFixed(2));
          }
        } else {
          console.error("Failed to initiate session:", response.data.Message);
        }
      } catch (err) {
        console.error("Error initiating Apple Pay session:", err);
      }
    }
  };

  // ----------------------------------------------------------------
  // 3. Re-initialize ApplePay if discountedPrice or method changes
  // ----------------------------------------------------------------
  useEffect(() => {
    if (method === PaymentMethodEnum.ApplePay) {
      // Clear old Apple Pay button if it exists
      const container = document.getElementById("apple-pay-container");
      if (container) {
        container.innerHTML = "";
      }
      // Now initialize with the new discounted price
      initializeApplePay();
    } else {
      // Remove Apple Pay if user switched method
      const container = document.getElementById("apple-pay-container");
      if (container) {
        container.innerHTML = "";
      }
    }
  }, [discountedPrice, method]);

  // ----------------------------------------------------------------
  // 4. The "handlePaymentClick" for other methods (e.g. Card)
  // ----------------------------------------------------------------
  const handlePaymentClick = async () => {
    const token = localStorage.getItem("labass_token");
    if (!token) {
      router.push("/login");
      return;
    }

    if (loading) return;

    setLoading(true);

    try {
      // We also do "initiate-session" if user picks card
      const response = await axios.post(`${apiUrl}/initiate-session`, {
        InvoiceAmount: discountedPrice, // discounted price
        CurrencyIso: "SAR",
      });

      if (response.data.IsSuccess) {
        const { SessionId, CountryCode } = response.data.Data;

        // If method is Card, go to the card details page
        if (method === PaymentMethodEnum.Card) {
          router.push(
            `/cardDetails?sessionId=${SessionId}&countryCode=${CountryCode}&discountedPrice=${discountedPrice}&promoCode=${promoCode}${consultationType ? "&consultationType=" + consultationType : ""}`
          );
        }
        // If method is ApplePay, we do the same ApplePay init logic
        else if (method === PaymentMethodEnum.ApplePay) {
          applePayConfigRef.current = {
            sessionId: SessionId,
            countryCode: "SAU",
            currencyCode: "SAR",
            amount: discountedPrice.toFixed(2),
            cardViewId: "apple-pay-container",
            callback: paymentCallback,
            sessionStarted: sessionStarted,
            sessionCanceled: sessionCanceled,
          };

          if (scriptLoadedRef.current) {
            window.myFatoorahAP.init(applePayConfigRef.current);
            setIsInitialized(true);
            window.myFatoorahAP.updateAmount(discountedPrice.toFixed(2));
          }
        }
      } else {
        console.error("Failed to initiate session:", response.data.Message);
      }
    } catch (err) {
      console.error("Error initiating session:", err);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------------------
  // 5. Payment callback => user approved Apple Pay
  // ----------------------------------------------------------------
  const paymentCallback = (response: {
    sessionId: string;
    cardBrand: string;
    cardIdentifier: string;
  }) => {
    console.log("Apple Pay callback triggered:", response);
    // Now we finalize the payment
    executePayment(response.sessionId);
  };

  // ----------------------------------------------------------------
  // 6. Final executePayment call
  // ----------------------------------------------------------------
  const executePayment = async (sessionId: string) => {
    try {
      const token = localStorage.getItem("labass_token");
      if (!token) {
        console.error("No token found in localStorage.");
        return;
      }

      console.log(
        "Execute payment with discountedPrice:",
        discountedPrice,
        "promoCode:",
        promoCode
      );

      // Send discounted price & promo code to server
      const response = await axios.post(
        `${apiUrl}/execute-payment`,
        {
          SessionId: sessionId,
          DisplayCurrencyIso: "SAR",
          InvoiceValue: discountedPrice.toFixed(2),
          PromoCode: promoCode,
          CallBackUrl: "https://labass.sa/success",
          ErrorUrl: "https://labass.sa/error",
          consultationType: consultationType,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.IsSuccess) {
        // Payment success
        const paymentUrl = response.data.Data.PaymentURL;
        const newConsultationId = response.data.consultation;

        setPaymentMessage("تمت عملية الدفع بنجاح");
        setConsultationId(newConsultationId);
        setShowModal(true);

        // Possibly do a GET request to paymentUrl
        // (some setups might do a redirect or tracking)
        await axios.get(paymentUrl);
      } else {
        console.error("executePayment failed:", response.data);
      }
    } catch (error) {
      console.error("Error in executePayment:", error);
    }
  };

  // Apple Pay session events
  const sessionStarted = () => {
    console.log("Apple Pay session started");
  };
  const sessionCanceled = () => {
    console.log("Apple Pay session canceled");
  };

  // 1. Adjusted handleGoToChat to check for promoCode source
  // ----------------------------------------------------------------
  const handleGoToChat = () => {
    if (consultationId) {
      // Check if the promoCode came from the URL by looking at current URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const urlPromoCode = urlParams.get('promoCode');
      
      // If promoCode exists AND it came from the URL, go to chat
      if (promoCode && promoCode.trim() !== "" && urlPromoCode === promoCode) {
        router.push(`/chat/${consultationId}`);
      } else {
        // Otherwise (promoCode from input field or no promoCode), go to patient selection
        router.push(`/patientSelection?consultationId=${consultationId}`);
      }
    } else {
      console.error("Consultation ID is missing.");
    }
  };

  // ----------------------------------------------------------------
  // 8. Render
  // ----------------------------------------------------------------
  return (
    <div>
      {/* Apple Pay container */}
      <div id="apple-pay-container"></div>

      {/* If method is Card, show a pay button */}
      {method === PaymentMethodEnum.Card && (
        <button
          className="sticky bottom-0 p-2 w-full text-sm font-bold bg-custom-green text-white rounded-3xl"
          onClick={handlePaymentClick}
          disabled={loading}
          dir="rtl"
        >
          {loading ? "Processing..." : "الدفع بالبطاقة"}
        </button>
      )}

      {/* Payment success modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content text-black">
            <pre>{paymentMessage}</pre>
            <button
              className="text-white bg-custom-green"
              onClick={handleGoToChat}
            >
              أكمل معلوماتك
            </button>
          </div>
        </div>
      )}

      {/* Basic modal styling */}
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
        pre {
          text-align: left;
          white-space: pre-wrap;
          word-wrap: break-word;
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

export default PaymentButton;
