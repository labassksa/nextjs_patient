import React, { Suspense } from "react";
import VitaminsPaymentClient from "./myClientComponent";

export default function VitaminsPaymentPage() {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <VitaminsPaymentClient />
    </Suspense>
  );
}

function LoadingIndicator() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fdfcf7",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: "3px solid rgba(23,52,4,0.12)",
          borderTopColor: "#7ED957",
        }}
      />
    </div>
  );
}
