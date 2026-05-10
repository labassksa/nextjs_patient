"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { verifyOTPandLogin } from "../otp/_controllers/verifyOTPandLogin";

export default function SchoolOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [resent, setResent] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([null, null, null, null]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setPhoneNumber(params.get("phoneNumber") || "");
  }, []);

  useEffect(() => {
    if (otp.every((v) => v.length === 1)) handleVerify(otp.join(""));
  }, [otp.join("")]);

  const updateOtp = (val: string, idx: number) => {
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 3) inputRefs.current[idx + 1]?.focus();
    else if (!val && idx > 0) inputRefs.current[idx - 1]?.focus();
  };

  const handleVerify = async (code: string) => {
    if (!phoneNumber) return;
    setError("");
    try {
      const res = await verifyOTPandLogin("patient", phoneNumber, code);
      if (res?.success) {
        router.push("/schoolPortal");
      } else {
        setError(res?.message || "رمز التحقق غير صحيح");
        setOtp(["", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError("حدث خطأ، حاول مرة أخرى");
    }
  };

  const handleResend = async () => {
    if (!phoneNumber) return;
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/send-otp`, {
        phoneNumber,
        role: "patient",
      });
      setOtp(["", "", "", ""]);
      setError("");
      setResent(true);
      setTimeout(() => setResent(false), 3000);
      inputRefs.current[0]?.focus();
    } catch {
      setError("تعذّر إعادة الإرسال، حاول مرة أخرى");
    }
  };

  const displayPhone = phoneNumber.replace("+966", "0");

  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col bg-gray-50"
      style={{ fontFamily: "Tajawal, system-ui, sans-serif" }}
    >
      {/* Hero band */}
      <div
        className="bg-green-600 px-6 pb-10 text-white text-right"
        style={{ paddingTop: "max(3.5rem, env(safe-area-inset-top, 3.5rem))" }}
      >
        <div className="text-4xl mb-3">🏫</div>
        <h1 className="text-2xl font-bold leading-snug">رمز التحقق</h1>
        <p className="text-green-100 text-sm mt-1">
          أُرسل رمز مكوّن من 4 أرقام إلى{" "}
          <span dir="ltr" className="font-mono">{displayPhone}</span>
        </p>
      </div>

      {/* OTP card */}
      <div className="flex-1 px-4 -mt-5 pb-8" style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom, 2rem))" }}>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-6">

          {/* OTP inputs — responsive sizing so 4 boxes fit even on 320px screens */}
          <div className="flex justify-center gap-2 sm:gap-3" dir="ltr">
            {otp.map((val, idx) => (
              <input
                key={idx}
                ref={(el) => { inputRefs.current[idx] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={val}
                autoFocus={idx === 0}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "");
                  if (v) updateOtp(v[v.length - 1], idx);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !val && idx > 0) {
                    updateOtp("", idx - 1);
                    inputRefs.current[idx - 1]?.focus();
                  }
                }}
                className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
              />
            ))}
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {resent && (
            <p className="text-green-600 text-sm text-center">تم إعادة إرسال الرمز ✓</p>
          )}

          <button
            onClick={handleResend}
            className="w-full text-sm text-gray-400 hover:text-green-600 active:text-green-700 py-3 transition-colors"
          >
            لم تستلم الرمز؟ إعادة الإرسال
          </button>
        </div>

        {/* Back */}
        <button
          onClick={() => router.push("/schoolLogin")}
          className="mt-4 w-full text-center text-sm text-gray-400 hover:text-gray-600 active:text-gray-800 py-3"
        >
          تغيير رقم الجوال
        </button>
      </div>
    </div>
  );
}
