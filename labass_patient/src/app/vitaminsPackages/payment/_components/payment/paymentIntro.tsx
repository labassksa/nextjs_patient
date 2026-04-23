import React from "react";
import Image from "next/image";

const PaymentIntro: React.FC = () => {
  return (
    <div
      dir="rtl"
      style={{
        background: "#ffffff",
        border: "0.5px solid rgba(23, 52, 4, 0.1)",
        borderRadius: 14,
        padding: "18px 20px",
        margin: "16px 16px 0",
      }}
    >
      {/* Live indicator */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 14,
          fontSize: 13.5,
          color: "rgba(23, 52, 4, 0.72)",
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#7ED957",
            flexShrink: 0,
            display: "inline-block",
          }}
        />
        سيتم معالجة اشتراكك خلال دقيقة واحدة
      </div>

      <h2
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: "#0d2002",
          margin: "0 0 14px",
          letterSpacing: "-0.2px",
        }}
      >
        طرق الدفع المتوفرة
      </h2>

      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        {[
          { src: "/icons/visa.svg", alt: "Visa" },
          { src: "/icons/mada.svg", alt: "Mada" },
          { src: "/icons/mc.svg", alt: "Mastercard" },
          { src: "/icons/apple_pay.svg", alt: "Apple Pay" },
        ].map((logo) => (
          <div
            key={logo.alt}
            style={{
              border: "0.5px solid rgba(23, 52, 4, 0.1)",
              borderRadius: 8,
              padding: "4px 8px",
              background: "#fafaf7",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Image src={logo.src} alt={logo.alt} width={52} height={34} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentIntro;
