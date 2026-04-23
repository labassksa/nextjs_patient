"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";

import PaymentHeader from "./_components/payment/paymentHeader";
import PaymentIntro from "./_components/payment/paymentIntro";
import PaymentMethod from "./_components/payment/paymentMethod";
import PaymentSummary from "./_components/payment/paymentSummary";
import PaymentButton from "./_components/payment/paymentButton";
import PromoCode from "./_components/payment/promoCodeInput";

import { PaymentMethodEnum } from "@/types/paymentMethods";
import { getMagicLink } from "./_controllers/getMagicLink";

import s from "./payment.module.css";

const VitaminsPaymentClient: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const priceParam = searchParams.get("discountedPrice");
  const planLabelParam = searchParams.get("planLabel");
  const bundleIdParam = searchParams.get("bundleId");
  const tokenUUIDParam = searchParams.get("tokenUUID");
  const promoCodeParam = searchParams.get("promoCode");

  const [paymentMethod, setPaymentMethod] = useState(PaymentMethodEnum.ApplePay);
  const [discountedPrice, setDiscountedPrice] = useState(
    priceParam ? Number(priceParam) : 289
  );
  const [promoCode, setPromoCode] = useState("");
  const [magicLinkLoading, setMagicLinkLoading] = useState(false);

  const planLabel = planLabelParam || "الباقة الشهرية";
  const bundleId = bundleIdParam ? Number(bundleIdParam) : null;

  // Apply magic-link promo on mount
  useEffect(() => {
    if (!tokenUUIDParam || !promoCodeParam) return;
    const apply = async () => {
      try {
        setMagicLinkLoading(true);
        const data = await getMagicLink(tokenUUIDParam, promoCodeParam);
        if (data.tokenJWT) localStorage.setItem("labass_token", data.tokenJWT);
        if (data.discountedPrice) {
          setDiscountedPrice(data.discountedPrice);
          setPromoCode(promoCodeParam);
        }
      } catch (e) {
        console.error("Magic link error:", e);
      } finally {
        setMagicLinkLoading(false);
      }
    };
    apply();
  }, [tokenUUIDParam, promoCodeParam]);

  return (
    <div dir="rtl" className={s.app}>

      {/* ── Sticky nav ── */}
      <PaymentHeader onBack={() => router.back()} />

      {/* ── Scrollable content ── */}
      <div className={s.scroll}>

        {/* Green plan banner */}
        <PaymentIntro planLabel={planLabel} price={discountedPrice} />

        <div className={s.body}>

          {/* Payment method selector */}
          <PaymentMethod method={paymentMethod} setMethod={setPaymentMethod} />

          {/* Promo code */}
          <PromoCode
            setDiscountedPrice={setDiscountedPrice}
            setPromoCode={setPromoCode}
            selectedPaymentMethod={paymentMethod}
          />

          {/* Order summary */}
          <PaymentSummary discountedPrice={discountedPrice} />

          {/* Trust strip */}
          <div className={s.trustCard}>
            <div className={s.trustRow}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6L12 2Z" stroke="#639922" strokeWidth="1.8" strokeLinejoin="round"/>
                <path d="M9 12l2 2 4-4" stroke="#639922" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className={s.trustTxt}>مدفوع بأمان عبر MyFatoorah · SSL مشفّر</span>
            </div>
            <div className={s.trustLogos}>
              {[
                { src: "/icons/visa.svg", alt: "Visa", w: 38 },
                { src: "/icons/mada.svg", alt: "Mada", w: 38 },
                { src: "/icons/mc.svg", alt: "Mastercard", w: 30 },
                { src: "/icons/apple_pay.svg", alt: "Apple Pay", w: 46 },
              ].map((logo) => (
                <div key={logo.alt} className={s.trustLogoBox}>
                  <Image src={logo.src} alt={logo.alt} width={logo.w} height={20} />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Sticky pay footer ── */}
      <div className={s.footer}>
        <PaymentButton
          method={paymentMethod}
          discountedPrice={discountedPrice}
          promoCode={promoCode}
          bundleId={bundleId}
        />
      </div>

      {/* ── Magic-link loading overlay ── */}
      {magicLinkLoading && (
        <div className={s.loading}>
          <div className={s.loadingSpinner} />
          <p className={s.loadingTxt}>جاري تطبيق العرض...</p>
        </div>
      )}

    </div>
  );
};

export default VitaminsPaymentClient;
