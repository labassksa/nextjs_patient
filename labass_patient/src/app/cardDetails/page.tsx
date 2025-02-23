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
    
    if (response.sender === "CardView") {
      console.log("[Payment] Received CardView message, type:", response.type);
      
      if (response.type === 1 && response.data?.IsSuccess) {
        // Use the same session flow as Apple Pay
        fetch('/api/payments/execute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
            amount: discountedPrice
          })
        })
        .then(res => res.json())
        .then(data => {
          if (data.IsSuccess && data.Data?.PaymentURL) {
            showSecureIframe(data.Data.PaymentURL);
          } else {
            throw new Error('No payment URL received');
          }
        })
        .catch(error => {
          console.error('[Payment] Execute payment error:', error);
          setIsSubmitting(false);
          router.push('/cardDetails/error');
        });
      }
      return;
    }

    if (response.IsSuccess || response.isSuccess) {
      const paymentUrl = response.Data?.PaymentURL || 
                        response.data?.Data?.PaymentURL || 
                        response.PaymentURL;
      
      if (paymentUrl) {
        showSecureIframe(paymentUrl);
      } else {
        setIsSubmitting(false);
        console.error('Payment failed:', response);
        router.push('/cardDetails/error');
      }
    } else {
      setIsSubmitting(false);
      console.error('Payment failed:', response);
      router.push('/cardDetails/error');
    }
  };

  const showSecureIframe = (paymentUrl: string) => {
    console.log("[showSecureIframe] Starting to show iframe");
    const container = document.getElementById('secure-container');
    
    if (!container) {
      console.error("[showSecureIframe] Container not found");
      return;
    }
    
    try {
      container.innerHTML = '';
      
      const iframeWrapper = document.createElement('div');
      iframeWrapper.className = 'relative w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg';
      iframeWrapper.style.height = '80vh';
      
      const iframe = document.createElement('iframe');
      iframe.src = paymentUrl;
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      iframe.id = 'secure-frame';
      
      iframe.onload = () => console.log("[showSecureIframe] Iframe loaded");
      
      const closeButton = document.createElement('button');
      closeButton.className = 'absolute top-4 right-4 text-gray-500 hover:text-gray-700';
      closeButton.textContent = '✕';
      closeButton.onclick = () => {
        console.log("[showSecureIframe] Closing iframe");
        container.style.display = 'none';
      };
      
      iframeWrapper.appendChild(iframe);
      iframeWrapper.appendChild(closeButton);
      container.appendChild(iframeWrapper);
      
      container.style.display = 'flex';
      console.log("[showSecureIframe] Iframe should now be visible");
    } catch (error) {
      console.error("[showSecureIframe] Error showing iframe:", error);
    }
  };

  useEffect(() => {
    const handle3DSecure = (event: MessageEvent) => {
      if (!event.data) return;
      try {
        const message = JSON.parse(typeof event.data === 'string' ? event.data : JSON.stringify(event.data));
        console.log('[3DSecure] Received message:', message);
        
        if (message.sender === "MF-3DSecure") {
          const url = message.url;
          console.log('[3DSecure] Redirect URL:', url);
          
          const container = document.getElementById('secure-container');
          if (container) {
            container.style.display = 'none';
          }

          setIsSubmitting(false);
          
          if (url.includes('success')) {
            router.push('/cardDetails/success');
          } else {
            router.push('/cardDetails/error');
          }
        }
      } catch (error) {
        console.error('[3DSecure] Error:', error);
      }
    };

    window.addEventListener("message", handle3DSecure);
    return () => window.removeEventListener("message", handle3DSecure);
  }, []);

  useEffect(() => {
    if (!isScriptLoaded || !(window as any).myFatoorah || !sessionId || !discountedPrice) return;

    const config = {
      sessionId, // Use the existing session ID
      countryCode,
      currencyCode: 'SAR',
      amount: String(discountedPrice),
      cardViewId: "embedded-payment",
      callback: payment,
      paymentOptions: ["Card"],
      language: 'ar'
    };

    console.log('Initializing payment with config:', config);
    try {
      (window as any).myFatoorah.init(config);
      console.log('Payment initialized successfully');
    } catch (error) {
      console.error('Failed to initialize payment:', error);
      setIsSubmitting(false);
    }
  }, [isScriptLoaded, sessionId, discountedPrice]);

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
        className="fixed inset-0 bg-black bg-opacity-50 z-[9999] items-center justify-center"
        style={{ 
          display: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: 'center',
          justifyContent: 'center',
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
