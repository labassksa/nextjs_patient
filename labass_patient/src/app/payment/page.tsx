"use client";
export const dynamic = "force-dynamic"; // <-- Add this line

import React, { useEffect, useState } from "react";
import PaymentIntro from "./_components/payment/paymentIntro";
import PaymentMethod from "./_components/payment/paymentMethod";
import PaymentSummary from "./_components/payment/paymentSummary";
import PaymentButton from "./_components/payment/paymentButton";
import PromoCode from "./_components/payment/promoCodeInput"; // Ensure correct path
import { PaymentMethodEnum } from "../../types/paymentMethods";
import Header from "../../components/common/header";
import { useSearchParams } from "next/navigation";
import { getMagicLink } from "./_controllers/getMagicLink";

const PaymentPage: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState(
    PaymentMethodEnum.ApplePay
  );
  const [discountedPrice, setDiscountedPrice] = useState(89); // Default price
  const [promoCode, setPromoCode] = useState(""); // Track applied promo code
  // 1. Grab the query parameters:
  const searchParams = useSearchParams();
  const tokenUUIDFromQuery = searchParams.get("tokenUUID");
  const promoCodeFromQuery = searchParams.get("promoCode");
  // New state: track magic link loading
  const [magicLinkLoading, setMagicLinkLoading] = useState(false);
  // 2. On mount, if both are present, call the magic link endpoint
  useEffect(() => {
    const applyMagicLinkPromo = async () => {
      if (tokenUUIDFromQuery && promoCodeFromQuery) {
        try {
          setMagicLinkLoading(true); // Start loading indicator

          const responseData = await getMagicLink(
            tokenUUIDFromQuery,
            promoCodeFromQuery
          );
          // Example responseData:
          // {
          //   "message": "Promo code applied successfully.",
          //   "discountedPrice": 70,
          //   "tokenJWT": "eyJhbGc..."
          // }

          if (responseData.tokenJWT) {
            localStorage.setItem("labass_token", responseData.tokenJWT);
            console.log("User automatically signed in (tokenJWT).");
          }

          if (responseData.discountedPrice) {
            setDiscountedPrice(responseData.discountedPrice);
            setPromoCode(promoCodeFromQuery);
            console.log(
              "Discount applied automatically:",
              responseData.message
            );
          } else if (responseData.error) {
            // Could be "Promotional code not found" or other errors
            console.error("Magic link error:", responseData.error);
          }
        } catch (error) {
          console.error("Error during magic link promo:", error);
        } finally {
          setMagicLinkLoading(false); // End loading indicator
        }
      }
    };

    applyMagicLinkPromo();
  }, [tokenUUIDFromQuery, promoCodeFromQuery]);

  // 3. Render your page
  // Show a loading indicator if magicLinkLoading is true
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col relative">
      <Header title="ادفع" showBackButton />
      <div className="pt-16 flex-grow overflow-auto">
        <PaymentIntro />
        <PaymentMethod method={paymentMethod} setMethod={setPaymentMethod} />

        {/* 
          Your existing promo code component (manual flow) 
          remains unchanged 
        */}
        <div className="my-4">
          <PromoCode
            setDiscountedPrice={setDiscountedPrice}
            setPromoCode={setPromoCode}
            selectedPaymentMethod={paymentMethod}
          />
        </div>

        {/* Payment Summary */}
        <PaymentSummary discountedPrice={discountedPrice} />
      </div>

      {/* Payment Button */}
      <div className="m-2 pb-4 sticky bottom-0">
        <PaymentButton
          method={paymentMethod}
          discountedPrice={discountedPrice}
          promoCode={promoCode}
        />
      </div>

      {/* 4. A simple overlay or spinner to indicate loading */}
      {magicLinkLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="flex flex-col items-center">
            {/* You can replace with any fancy spinner */}
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
            <p className="text-white mt-2">Applying Promo...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
