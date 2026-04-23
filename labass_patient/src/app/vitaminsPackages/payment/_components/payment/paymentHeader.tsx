import React from "react";
import Link from "next/link";

const PaymentHeader: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "18px 28px",
        background: "#ffffff",
        borderBottom: "0.5px solid rgba(23, 52, 4, 0.1)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <Link
        href="/vitaminsPackages"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          textDecoration: "none",
        }}
      >
        {/* Brand mark */}
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "#173404",
            position: "relative",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#7ED957",
            }}
          />
        </div>
        <span
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: "#173404",
            letterSpacing: "-0.3px",
          }}
        >
          لاباس
        </span>
      </Link>

      <span
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: "#0d2002",
          letterSpacing: "-0.2px",
        }}
      >
        الدفع
      </span>
    </div>
  );
};

export default PaymentHeader;
