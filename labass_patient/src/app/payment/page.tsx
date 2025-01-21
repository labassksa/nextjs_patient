import React, { Suspense } from "react";
import PaymentClient from "./myClientComponent"; // Import the client component

// This remains a Server Component by default (no "use client").
export default function PaymentPage() {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <PaymentClient />
    </Suspense>
  );
}

// A basic fallback for Suspense
function LoadingIndicator() {
  return (
    <div style={{ textAlign: "center", paddingTop: 40 }}>
      <p>Loading Payment Page...</p>
    </div>
  );
}
