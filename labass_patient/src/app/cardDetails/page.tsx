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
          executePayment(response.sessionId);
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

      const data = await response.json();
      if (data.IsSuccess) {
        router.push('/cardDetails/success');
      } else {
        router.push('/cardDetails/error');
      }
    } catch (error) {
      console.error('Error executing payment:', error);
      router.push('/cardDetails/error');
    }
  };
  useEffect(() => {
    if (!isScriptLoaded || !(window as any).myFatoorah || !sessionId || !discountedPrice) return;

    const config = {
      sessionId: sessionId,
      countryCode,
      currencyCode: 'SAR',
      amount: String(discountedPrice),
      callback: payment,
      containerId: "embedded-payment",
      paymentOptions: ["Card"]
    };

    (window as any).myFatoorah.init(config);
  }, [isScriptLoaded, sessionId, discountedPrice]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Script
        src="https://sa.myfatoorah.com/payment/v1/session.js"
        onLoad={() => setIsScriptLoaded(true)}
        strategy="afterInteractive"
      />
      
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">بوابة الدفع</h1>
        <div 
          id="embedded-payment"
          className="bg-white rounded-lg shadow-lg"
          style={{ height: '600px' }}
        />
      </div>
    </div>
  );
};

export default CardDetailsPage;
