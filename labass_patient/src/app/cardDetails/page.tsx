"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Script from 'next/script';

const CardDetailsPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  const sessionId = searchParams.get('sessionId');
  const countryCode = searchParams.get('countryCode') || 'SAU';
  const promoCode = searchParams.get('promoCode');
  const discountedPrice = searchParams.get('discountedPrice');
  const consultationId = searchParams.get('consultationId');

  const payment = (response: any) => {
    console.log('[Payment] Response:', response);
    if (response.isSuccess) {
      switch (response.paymentType) {
        case "Card":
          console.log("Card response >> " + JSON.stringify(response));
          // Execute payment with session ID
          executePayment(response.data?.Data?.SessionId);
          break;
        default:
          console.log("Unknown payment type");
          router.push('/cardDetails/error');
          break;
      }
    }
  };

  const executePayment = async (sessionId: string) => {
    try {
      const token = localStorage.getItem('labass_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sessionId,
          consultationId: Number(consultationId),
          ...(promoCode && { promoCode }),
          ...(discountedPrice && { discountedPrice: Number(discountedPrice) }),
        }),
      });

      if (!response.ok) {
        throw new Error('Payment execution failed');
      }

      const data = await response.json();
      if (data.PaymentURL) {
        // Create OTP iframe
        const container = document.getElementById('otp-container');
        if (container) {
          container.innerHTML = `
            <iframe 
              src="${data.PaymentURL}"
              style="width: 100%; height: 500px; border: none;"
            ></iframe>
          `;
        }
      }
    } catch (error) {
      console.error('Error executing payment:', error);
      router.push('/cardDetails/error');
    }
  };

  useEffect(() => {
    if (!isScriptLoaded || !window.myFatoorah || !sessionId || !discountedPrice) return;

    const config = {
      sessionId: sessionId,
      countryCode,
      currencyCode: 'SAR',
      amount: String(discountedPrice),
      callback: payment,
      containerId: "embedded-payment",
      paymentOptions: ["Card"],
    };

    console.log('[Debug] Initializing with config:', config);
    window.myFatoorah.init(config);
  }, [isScriptLoaded, sessionId, discountedPrice]);

  // Handle 3D Secure messages
  useEffect(() => {
    const handle3DSecure = (event: MessageEvent) => {
      if (!event.data) return;
      try {
        const message = JSON.parse(typeof event.data === 'string' ? event.data : JSON.stringify(event.data));
        if (message.sender === "MF-3DSecure" && message.url) {
          router.push('/cardDetails/success');
        }
      } catch (error) {
        console.error('Error handling 3D Secure message:', error);
      }
    };

    window.addEventListener("message", handle3DSecure);
    return () => window.removeEventListener("message", handle3DSecure);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Script
        src="https://sa.myfatoorah.com/payment/v1/session.js"
        onLoad={() => setIsScriptLoaded(true)}
        strategy="afterInteractive"
      />
      
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">بوابة الدفع</h1>
        <div id="embedded-payment" className="bg-white rounded-lg shadow-lg mb-4" />
        <div id="otp-container" className="bg-white rounded-lg shadow-lg" />
      </div>
    </div>
  );
};

declare global {
  interface Window {
    myFatoorah: {
      init: (config: { 
        sessionId: string;
        countryCode: string;
        currencyCode: string;
        amount: string;
        containerId: string;
        paymentOptions?: string[];
        callback: (response: any) => void;
        language?: string;
      }) => void;
    };
  }
}

export default CardDetailsPage;
