"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import axios from 'axios';

const CardDetailsContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sessionId = searchParams.get('sessionId');
  const countryCode = searchParams.get('countryCode') || 'SAU';
  const discountedPrice = searchParams.get('discountedPrice');

  const payment = (response: any) => {
    console.log("[Payment] Response:", response);
    
    if (response.isSuccess) {
      switch (response.paymentType) {
        case "Card":
          console.log("Card payment response:", JSON.stringify(response));
          const token = localStorage.getItem("labass_token");
          if (!token) {
            console.error("No token found in localStorage.");
            return;
          }

          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          if (!apiUrl) {
            console.error("NEXT_PUBLIC_API_URL is not defined");
            return;
          }

          // Use window.location.origin as fallback for base URL
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;

          axios.post(
            `${apiUrl}/execute-payment`,
            {
              SessionId: sessionId,
              DisplayCurrencyIso: "SAR",
              InvoiceValue: discountedPrice,
              PromoCode: searchParams.get('promoCode'),
              CallBackUrl: `${baseUrl}/cardDetails/success`,
              ErrorUrl: `${baseUrl}/cardDetails/error`,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          .then(response => {
            if (response.data.IsSuccess) {
              const paymentUrl = response.data.Data.PaymentURL;
              console.log("[Payment] Opening 3D secure iframe with URL:", paymentUrl);
              showSecureIframe(paymentUrl);
            } else {
              console.error('[Payment] Execute payment failed:', response.data);
              setIsSubmitting(false);
              router.push('/cardDetails/error');
            }
          })
          .catch(error => {
            console.error('[Payment] Execute payment error:', error);
            setIsSubmitting(false);
            router.push('/cardDetails/error');
          });
          break;
        default:
          console.log("Unknown payment type");
          break;
      }
    } else {
      console.error('Payment not successful:', response);
      setIsSubmitting(false);
      router.push('/cardDetails/error');
    }
  };

  const showSecureIframe = (paymentUrl: string) => {
    const container = document.getElementById('secure-container');
    if (!container) return;

    // Clear previous content
    container.innerHTML = '';
    
    // Create iframe exactly as shown in docs
    const iframe = document.createElement('iframe');
    iframe.src = paymentUrl;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    
    // Add iframe to container
    container.appendChild(iframe);
    container.style.display = 'flex';
  };

  useEffect(() => {
    const handle3DSecure = (event: MessageEvent) => {
      if (!event.data) return;
      try {
        // Parse the message exactly as shown in docs
        const message = JSON.parse(event.data);
        console.log('[3DSecure] Received message:', message);
        
        if (message.sender === "MF-3DSecure") {
          const url = message.url;
          console.log('[3DSecure] Redirect URL:', url);
          
          // Hide the iframe
          const container = document.getElementById('secure-container');
          if (container) {
            container.style.display = 'none';
          }

          setIsSubmitting(false);
          
          // Handle the redirect based on URL
          if (url.includes('success')) {
            router.push('/cardDetails/success');
          } else {
            router.push('/cardDetails/error');
          }
        }
      } catch (error) {
        console.error('[3DSecure] Error handling message:', error);
        return;
      }
    };

    window.addEventListener("message", handle3DSecure, false);
    return () => window.removeEventListener("message", handle3DSecure, false);
  }, [router]);

  useEffect(() => {
    if (!isScriptLoaded || !(window as any).myFatoorah || !sessionId) return;

    const config = {
      countryCode,
      sessionId,
      cardViewId: "card-element",
      supportedNetworks: "v,m,md,ae"
    };

    console.log('Initializing payment with config:', config);
    try {
      (window as any).myFatoorah.init(config);
      console.log('Payment initialized successfully');
    } catch (error) {
      console.error('Failed to initialize payment:', error);
      setIsSubmitting(false);
    }
  }, [isScriptLoaded, sessionId, countryCode]);

  const handlePaymentSubmit = () => {
    console.log('[handlePaymentSubmit] Submitting payment...');
    setIsSubmitting(true);
    
    (window as any).myFatoorah.submit()
      .then(
        function (response: any) {
          console.log("[Payment] Card submission response:", response);
          const sessionId = response.sessionId;
          const cardBrand = response.cardBrand;
          const cardIdentifier = response.cardIdentifier;

          const token = localStorage.getItem("labass_token");
          if (!token) {
            console.error("No token found in localStorage.");
            return;
          }

          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          if (!apiUrl) {
            console.error("NEXT_PUBLIC_API_URL is not defined");
            return;
          }

          axios.post(
            `${apiUrl}/execute-payment`,
            {
              SessionId: sessionId,
              InvoiceValue: discountedPrice,
              CustomerName: "fname lname",
              DisplayCurrencyIso: "SAR",
              MobileCountryCode: "966",
              CustomerMobile: "",
              CustomerEmail: "",
              CallBackUrl: `${window.location.origin}/cardDetails/success`,
              ErrorUrl: `${window.location.origin}/cardDetails/error`,
              Language: "ar",
              CustomerReference: "card-payment",
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          .then(response => {
            if (response.data.IsSuccess) {
              const paymentUrl = response.data.Data.PaymentURL;
              console.log("[Payment] Opening 3D secure iframe with URL:", paymentUrl);
              showSecureIframe(paymentUrl);
            } else {
              console.error('[Payment] Execute payment failed:', response.data);
              setIsSubmitting(false);
              router.push('/cardDetails/error');
            }
          })
          .catch(error => {
            console.error('[Payment] Execute payment error:', error);
            setIsSubmitting(false);
            router.push('/cardDetails/error');
          });
        },
        function (error: any) {
          console.log(error);
          setIsSubmitting(false);
        }
      );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Script
        src="https://sa.myfatoorah.com/cardview/v2/session.js"
        onLoad={() => setIsScriptLoaded(true)}
        strategy="afterInteractive"
      />
      
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">بوابة الدفع</h1>
        <div id="card-element" className="bg-white rounded-lg shadow-lg p-4 mb-4" />
        
        <button
          onClick={handlePaymentSubmit}
          disabled={isSubmitting}
          className={`w-full bg-custom-green text-white py-3 rounded-lg font-bold relative ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <>
              <span className="opacity-0">إتمام الدفع</span>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            </>
          ) : (
            'إتمام الدفع'
          )}
        </button>
      </div>

      <div 
        id="secure-container"
        style={{ 
          display: 'none',
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '500px',
          height: '600px',
          backgroundColor: 'white',
          zIndex: 9999,
        }}
      />
    </div>
  );
};

const CardDetailsPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CardDetailsContent />
    </Suspense>
  );
};

export default CardDetailsPage;
