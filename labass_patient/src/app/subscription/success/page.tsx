"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function SubscriptionSuccessPage() {
  const router = useRouter();

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#eef4e6",
        padding: "24px",
        fontFamily: "Tajawal, system-ui, sans-serif",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: 24,
          padding: "48px 32px",
          maxWidth: 440,
          width: "100%",
          textAlign: "center",
          boxShadow: "0 20px 60px rgba(23,52,4,0.08)",
        }}
      >
        {/* Check icon */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "#eef4e6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 6L9 17l-5-5"
              stroke="#4DA514"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: "#173404",
            margin: "0 0 12px",
            letterSpacing: "-0.3px",
          }}
        >
          تمت عملية الدفع بنجاح
        </h1>

        <p
          style={{
            fontSize: 15,
            color: "#5a6b4a",
            lineHeight: 1.6,
            margin: "0 0 32px",
          }}
        >
          اشتراكك الآن نشط. يمكنك البدء في استخدام الخدمة فوراً.
        </p>

        <button
          onClick={() => router.push("/mySubscriptions")}
          style={{
            width: "100%",
            padding: "15px 24px",
            background: "#173404",
            color: "#ffffff",
            border: "none",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          عرض اشتراكاتي
        </button>
      </div>
    </div>
  );
}
