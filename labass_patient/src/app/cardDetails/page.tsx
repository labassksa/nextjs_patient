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
  const promoCode = searchParams.get('promoCode');
  const discountedPrice = searchParams.get('discountedPrice');
  const consultationId = searchParams.get('consultationId');

  const payment = (response: any) => {
    console.log('[Payment] Response:', response);
    setIsSubmitting(false);

    if (response.isSuccess) {
      if (response.data?.Data?.PaymentURL) {
        // Create iframe for 3D Secure
        const container = document.getElementById('secure-container');
        if (container) {
          container.innerHTML = `
            <iframe 
              src="${response.data.Data.PaymentURL}"
              style="width: 100%; height: 100%; border: none;"
              id="secure-frame"
            ></iframe>
          `;
        }
      } else {
        router.push('/cardDetails/success');
      }
    } else {
      console.error('Payment failed:', response);
      router.push('/cardDetails/error');
    }
  };

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

  useEffect(() => {
    if (!isScriptLoaded || !(window as any).myFatoorah || !sessionId || !discountedPrice) return;

    const config = {
      sessionId,
      countryCode,
      currencyCode: 'SAR',
      amount: String(discountedPrice),
      callback: payment,
      cardViewId: "embedded-payment",
      paymentOptions: ["Card"],
      language: 'ar'
    };

    try {
      (window as any).myFatoorah.init(config);
      console.log('Payment initialized successfully');
    } catch (error) {
      console.error('Failed to initialize payment:', error);
    }
  }, [isScriptLoaded, sessionId, discountedPrice]);

  // Handle 3D Secure completion
  useEffect(() => {
    const handle3DSecure = (event: MessageEvent) => {
      if (!event.data) return;
      try {
        const message = JSON.parse(typeof event.data === 'string' ? event.data : JSON.stringify(event.data));
        if (message.sender === "MF-3DSecure") {
          // Close iframe and redirect
          const container = document.getElementById('secure-container');
          if (container) {
            container.innerHTML = '';
          }
          router.push('/cardDetails/success');
        }
      } catch (error) {
        console.error('Error handling 3D Secure:', error);
        router.push('/cardDetails/error');
      }
    };

    window.addEventListener("message", handle3DSecure);
    return () => window.removeEventListener("message", handle3DSecure);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Script
        src="https://sa.myfatoorah.com/cardview/v1/session.js"
        onLoad={() => setIsScriptLoaded(true)}
        strategy="afterInteractive"
      />
      
      <div className="w-full max-w-3xl mx-auto px-4 py-6 flex-grow flex flex-col">
        <h1 className="text-xl md:text-2xl font-bold mb-4 text-center">بوابة الدفع</h1>
        
        {/* Payment Form Container */}
        <div 
          id="embedded-payment"
          className="bg-white rounded-lg shadow-lg p-4 mb-4 flex-grow"
          style={{ minHeight: '400px' }}
        />

        {/* 3D Secure Container */}
        <div 
          id="secure-container"
          className="fixed inset-0 bg-black bg-opacity-50 z-50 hidden"
          style={{ 
            display: 'none',
            height: '100vh',
            width: '100vw'
          }}
        />

        {/* Submit Button - Fixed at bottom on mobile */}
        <div className="sticky bottom-0 left-0 right-0 p-4 bg-white md:bg-transparent">
          <button
            onClick={handlePaymentSubmit}
            disabled={isSubmitting}
            className={`w-full max-w-md mx-auto bg-custom-green text-white py-3 px-4 rounded-lg font-bold relative ${
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
      </div>
    </div>
  );
};

// Wrapper component with Suspense
const CardDetailsPage: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">جاري التحميل...</div>
      </div>
    }>
      <CardDetailsContent />
    </Suspense>
  );
};

export default CardDetailsPage;
