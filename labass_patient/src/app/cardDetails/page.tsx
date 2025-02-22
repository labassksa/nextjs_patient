"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Script from 'next/script';

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
    setIsSubmitting(false);

    if (response.isSuccess) {
      switch (response.paymentType) {
        case "Card":
          if (response.data?.Data?.CardIdentifier) {
            executePayment(response.data.Data.CardIdentifier);
          } else {
            console.error('No card identifier found');
            router.push('/cardDetails/error');
          }
          break;
        default:
          console.log("Unknown payment type");
          router.push('/cardDetails/error');
          break;
      }
    } else {
      console.error('Payment failed:', response);
      router.push('/cardDetails/error');
    }
  };

  const executePayment = async (paymentSessionId: string) => {
    try {
      const token = localStorage.getItem('labass_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          SessionId: paymentSessionId,
          InvoiceValue: Number(discountedPrice)
        }),
      });

      const data = await response.json();
      if (data.PaymentURL) {
        // Show 3D Secure iframe
        const container = document.getElementById('secure-container');
        if (container) {
          container.style.display = 'block';
          container.innerHTML = `
            <iframe 
              src="${data.PaymentURL}"
              style="width: 100%; height: 100%; border: none;"
            ></iframe>
          `;
        }
      }
    } catch (error) {
      console.error('Payment execution failed:', error);
      router.push('/cardDetails/error');
    }
  };

  useEffect(() => {
    if (!isScriptLoaded || !(window as any).myFatoorah || !sessionId || !discountedPrice) return;

    const config = {
      sessionId,
      countryCode,
      currencyCode: 'SAR',
      amount: String(discountedPrice),
      cardViewId: "embedded-payment",
      callback: payment,
      paymentOptions: ["Card"],
      language: 'ar'
    };

    (window as any).myFatoorah.init(config);
  }, [isScriptLoaded, sessionId, discountedPrice]);

  useEffect(() => {
    const handle3DSecure = (event: MessageEvent) => {
      if (!event.data) return;
      try {
        const message = JSON.parse(typeof event.data === 'string' ? event.data : JSON.stringify(event.data));
        if (message.sender === "MF-3DSecure" && message.url) {
          // Hide 3D Secure iframe
          const container = document.getElementById('secure-container');
          if (container) {
            container.style.display = 'none';
          }
          // Redirect to success/error based on URL
          if (message.url.includes('success')) {
            router.push('/cardDetails/success');
          } else {
            router.push('/cardDetails/error');
          }
        }
      } catch (error) {
        console.error('3D Secure error:', error);
      }
    };

    window.addEventListener("message", handle3DSecure);
    return () => window.removeEventListener("message", handle3DSecure);
  }, []);

  const handlePaymentSubmit = () => {
    console.log('[handlePaymentSubmit] Submitting payment...');
    setIsSubmitting(true);
    try {
      (window as any).myFatoorah.submit();
    } catch (error) {
      console.error('[handlePaymentSubmit] Error:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Script
        src="https://sa.myfatoorah.com/cardview/v1/session.js"
        onLoad={() => setIsScriptLoaded(true)}
        strategy="afterInteractive"
      />
      
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">بوابة الدفع</h1>
        <div id="embedded-payment" className="bg-white rounded-lg shadow-lg p-4 mb-4" />
        
        {/* Payment Button */}
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
        
        <div 
          id="secure-container"
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          style={{ display: 'none' }}
        />
      </div>
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
