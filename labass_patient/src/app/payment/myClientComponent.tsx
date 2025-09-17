"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import PaymentIntro from "./_components/payment/paymentIntro";
import PaymentMethod from "./_components/payment/paymentMethod";
import PaymentSummary from "./_components/payment/paymentSummary";
import PaymentButton from "./_components/payment/paymentButton";
import PromoCode from "./_components/payment/promoCodeInput";
import Header from "../../components/common/header";

import { PaymentMethodEnum } from "../../types/paymentMethods";
import { getMagicLink } from "./_controllers/getMagicLink";

const PaymentClient: React.FC = () => {
  // Client-side states
  const [paymentMethod, setPaymentMethod] = useState(
    PaymentMethodEnum.ApplePay
  );
  const [discountedPrice, setDiscountedPrice] = useState(89); // Default price
  const [promoCode, setPromoCode] = useState("");
  const [magicLinkLoading, setMagicLinkLoading] = useState(false);

  // Read query parameters in the client
  const searchParams = useSearchParams();
  const tokenUUIDFromQuery = searchParams.get("tokenUUID");
  const promoCodeFromQuery = searchParams.get("promoCode");
  const consultationType = searchParams.get("consultationType");

  useEffect(() => {
    const applyMagicLinkPromo = async () => {
      if (tokenUUIDFromQuery && promoCodeFromQuery) {
        try {
          setMagicLinkLoading(true);
          const responseData = await getMagicLink(
            tokenUUIDFromQuery,
            promoCodeFromQuery
          );

          // If there's a token, store it => user is signed in
          if (responseData.tokenJWT) {
            localStorage.setItem("labass_token", responseData.tokenJWT);
            console.log("User auto-signed in via tokenJWT.");
          }

          // If discountedPrice is returned, set it
          if (responseData.discountedPrice) {
            setDiscountedPrice(responseData.discountedPrice);
            setPromoCode(promoCodeFromQuery);
            console.log(
              "Discount applied automatically:",
              responseData.message
            );
          } else if (responseData.error) {
            console.error("Magic link error:", responseData.error);
          }
        } catch (error) {
          console.error("Error applying magic link promo:", error);
        } finally {
          setMagicLinkLoading(false);
        }
      }
    };

    applyMagicLinkPromo();
  }, [tokenUUIDFromQuery, promoCodeFromQuery]);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col relative">
      <Header title="ادفع" showBackButton />

      <div className="pt-16 flex-grow overflow-auto">
        <PaymentIntro />
        <PaymentMethod method={paymentMethod} setMethod={setPaymentMethod} />

        <div className="my-4">
          <PromoCode
            setDiscountedPrice={setDiscountedPrice}
            setPromoCode={setPromoCode}
            selectedPaymentMethod={paymentMethod}
          />
        </div>

        <PaymentSummary discountedPrice={discountedPrice} />
      </div>

      <div className="m-2 pb-4 sticky bottom-0">
        <PaymentButton
          method={paymentMethod}
          discountedPrice={discountedPrice}
          promoCode={promoCode}
          consultationType={consultationType}
        />
      </div>

      {/* Loading Overlay */}
      {magicLinkLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
            <p className="text-white mt-2">Applying Promo...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentClient;
