"use client";

// TEMPORARY MARKETER OTP BYPASS — REMOVE AFTER 2026-08-27
// Interstitial shown when /send-otp recognises the phone number as an
// already-registered marketer and returns a session without an OTP round-trip.
// Delete this route together with the bypass handling in
// src/app/login/_components/login/form.tsx and sendOTP.Controller.ts.

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const RegisteredMarketerPage = () => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  // This page is only reachable off the back of a bypass session. Without one,
  // send the user to the login page rather than showing a dead-end screen.
  useEffect(() => {
    const token = localStorage.getItem("labass_token");
    const userId = localStorage.getItem("labass_userId");
    if (!token || !userId) {
      router.replace("/login");
      return;
    }
    setAuthorized(true);
  }, [router]);

  if (!authorized) return null;

  return (
    <div className="bg-white min-h-screen flex flex-col justify-center items-center px-6 text-center">
      <h1 className="text-xl font-bold mb-3">أنت مسجل بالفعل كصيدلي</h1>
      <p className="text-sm text-gray-600 mb-8">
        يمكنك الآن المتابعة إلى بوابة المنشأة
      </p>
      <button
        type="button"
        onClick={() => router.push("/orgPortal")}
        className="px-6 py-4 w-full max-w-sm bg-custom-green text-white font-bold text-sm rounded-md focus:outline-none"
      >
        المتابعة إلى بوابة المنشأة
      </button>
    </div>
  );
};

export default RegisteredMarketerPage;
