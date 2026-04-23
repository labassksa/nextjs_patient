"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import PaymentHeader from "./_components/payment/paymentHeader";
import PaymentIntro from "./_components/payment/paymentIntro";
import PaymentMethod from "./_components/payment/paymentMethod";
import PaymentSummary from "./_components/payment/paymentSummary";
import PaymentButton from "./_components/payment/paymentButton";
import PromoCode from "./_components/payment/promoCodeInput";

import { PaymentMethodEnum } from "@/types/paymentMethods";
import { getMagicLink } from "./_controllers/getMagicLink";

const VitaminsPaymentClient: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState(PaymentMethodEnum.ApplePay);
  const [discountedPrice, setDiscountedPrice] = useState(289);
  const [promoCode, setPromoCode] = useState("");
  const [magicLinkLoading, setMagicLinkLoading] = useState(false);

  const searchParams = useSearchParams();
  const tokenUUIDFromQuery = searchParams.get("tokenUUID");
  const promoCodeFromQuery = searchParams.get("promoCode");
  const consultationType = searchParams.get("consultationType");
  const priceFromQuery = searchParams.get("discountedPrice");

  useEffect(() => {
    if (priceFromQuery) setDiscountedPrice(Number(priceFromQuery));
  }, [priceFromQuery]);

  useEffect(() => {
    if (consultationType) {
      localStorage.setItem("consultationType", consultationType);
    } else {
      localStorage.removeItem("consultationType");
    }
  }, [consultationType]);

  useEffect(() => {
    const applyMagicLinkPromo = async () => {
      if (tokenUUIDFromQuery && promoCodeFromQuery) {
        try {
          setMagicLinkLoading(true);
          const responseData = await getMagicLink(
            tokenUUIDFromQuery,
            promoCodeFromQuery
          );
          if (responseData.tokenJWT) {
            localStorage.setItem("labass_token", responseData.tokenJWT);
          }
          if (responseData.discountedPrice) {
            setDiscountedPrice(responseData.discountedPrice);
            setPromoCode(promoCodeFromQuery);
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
    <div
      style={{
        background: "#fdfcf7",
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        fontFamily:
          "'Tajawal', 'IBM Plex Sans Arabic', 'Segoe UI', system-ui, sans-serif",
      }}
    >
      <PaymentHeader />

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 16 }}>
        <PaymentIntro />
        <PaymentMethod method={paymentMethod} setMethod={setPaymentMethod} />

        <div style={{ margin: "12px 16px 0" }}>
          <PromoCode
            setDiscountedPrice={setDiscountedPrice}
            setPromoCode={setPromoCode}
            selectedPaymentMethod={paymentMethod}
          />
        </div>

        <PaymentSummary discountedPrice={discountedPrice} />
      </div>

      {/* Sticky pay button */}
      <div
        style={{
          padding: "14px 16px 20px",
          background: "#ffffff",
          borderTop: "0.5px solid rgba(23, 52, 4, 0.1)",
          flexShrink: 0,
          position: "sticky",
          bottom: 0,
        }}
      >
        <PaymentButton
          method={paymentMethod}
          discountedPrice={discountedPrice}
          promoCode={promoCode}
        />
      </div>

      {/* Magic-link loading overlay */}
      {magicLinkLoading && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.45)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "3px solid rgba(255,255,255,0.25)",
              borderTopColor: "#7ED957",
              animation: "spin 0.85s linear infinite",
            }}
          />
          <p style={{ color: "#ffffff", fontSize: 14, marginTop: 14, fontWeight: 500 }}>
            جاري تطبيق العرض...
          </p>
        </div>
      )}

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default VitaminsPaymentClient;
