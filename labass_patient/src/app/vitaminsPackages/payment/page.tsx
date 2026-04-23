import React, { Suspense } from "react";
import VitaminsPaymentClient from "./myClientComponent";

export default function VitaminsPaymentPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VitaminsPaymentClient />
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#eef4e6",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          border: "3px solid rgba(23,52,4,0.12)",
          borderTopColor: "#7ED957",
          animation: "spin 0.85s linear infinite",
        }}
      />
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
