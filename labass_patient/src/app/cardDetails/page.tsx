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
      switch (response.paymentType) {
        case "Card":
          console.log("Card response >> " + JSON.stringify(response));
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

  const executePayment = async (cardIdentifier: string) => {
    try {
      const token = localStorage.getItem('labass_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cardIdentifier,
          consultationId: Number(consultationId),
          ...(promoCode && { promoCode }),
          ...(discountedPrice && { discountedPrice: Number(discountedPrice) }),
        }),
      });

      const data = await response.json();
      if (data.PaymentURL) {
        window.location.href = data.PaymentURL;
      } else if (data.IsSuccess) {
        router.push('/cardDetails/success');
      } else {
        router.push('/cardDetails/error');
      }
    } catch (error) {
      console.error('Error executing payment:', error);
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

    console.log('Initializing payment with:', {
      sessionId,
      countryCode,
      discountedPrice
    });

    const config = {
      sessionId,
      countryCode,
      currencyCode: 'SAR',
      amount: String(discountedPrice),
      callback: payment,
      cardViewId: "embedded-payment",
      paymentOptions: ["Card"],
      language: 'ar',
      showPayButton: true,
      buttonLabel: 'إتمام الدفع'
    };

    try {
      (window as any).myFatoorah.init(config);
      console.log('Payment initialized successfully');
    } catch (error) {
      console.error('Failed to initialize payment:', error);
    }
  }, [isScriptLoaded, sessionId, discountedPrice]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Script
        src="https://sa.myfatoorah.com/cardview/v1/session.js"
        onLoad={() => {
          console.log('Script loaded');
          setIsScriptLoaded(true);
        }}
        onError={(e) => console.error('Script failed to load:', e)}
        strategy="afterInteractive"
      />
      
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">بوابة الدفع</h1>
        <div 
          id="embedded-payment"
          className="bg-white rounded-lg shadow-lg p-4 mb-4"
          style={{ 
            minHeight: '600px',
            width: '100%'
          }}
        />
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
