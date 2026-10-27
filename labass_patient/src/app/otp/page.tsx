"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import OTPInput from "./_components/otp/otpInput";
import OTPTopText from "./_components/otp/otpTopText";
import OTPBottomText from "./_components/otp/otpBottomText";
import { useRouter } from "next/navigation";
import { verifyOTPandLogin } from "./_controllers/verifyOTPandLogin";
import { loginPatient } from "../login/_controllers/sendOTP.Controller";
import s from "../login/login.module.css";
import o from "./otp.module.css";

const OTPPage = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([
    null,
    null,
    null,
    null,
  ]);

  // Instead of storing a single phoneNumber, store both countryCode and localPhoneNumber separately
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [localPhoneNumber, setLocalPhoneNumber] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const fullPhoneNumber = searchParams.get("phoneNumber");

    if (fullPhoneNumber) {
      // Attempt to match a phone number in the format +<countryCode><localNumber>
      const match = fullPhoneNumber.match(/^(\+\d{1,3})(\d{7,14})$/);
      if (match) {
        setCountryCode(match[1]); // e.g. +966
        setLocalPhoneNumber(match[2]); // e.g. 5xxxxxxx
      } else {
        // Fallback behavior if the format doesn't match
        // You can adjust this logic based on your requirements
        setCountryCode("+966");
        setLocalPhoneNumber(fullPhoneNumber.replace(/^\+966/, ""));
      }
    }
  }, []);

  useEffect(() => {
    if (otp.every((val) => val.length === 1)) {
      handleVerifyOTP();
    }
  }, [otp.join("")]);

  const updateOTP = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setErrorMessage(null);
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    } else if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Spread a pasted / autofilled code across the boxes.
  // A full-length code always starts from the first box.
  const fillOTP = (digits: string, index: number) => {
    const start = digits.length >= otp.length ? 0 : index;
    const newOtp = [...otp];
    digits
      .slice(0, otp.length - start)
      .split("")
      .forEach((d, i) => (newOtp[start + i] = d));
    setOtp(newOtp);
    setErrorMessage(null);
    inputRefs.current[Math.min(start + digits.length, otp.length - 1)]?.focus();
  };

  const handleVerifyOTP = async () => {
    if (!localPhoneNumber || !countryCode) {
      console.error("Phone number or country code is missing.");
      return;
    }

    if (isVerifying) return;

    const otpCode = otp.join("");
    setIsVerifying(true);
    try {
      const fullNumber = `${countryCode}${localPhoneNumber}`;
      const result = await verifyOTPandLogin("patient", fullNumber, otpCode);

      if (result && result.success) {
        router.push("/home");
      } else if (result) {
        setErrorMessage(result.message ?? "حدث خطأ ، حاول مرة أخرى");
      } else {
        setErrorMessage("حدث خطأ ، حاول مرة أخرى");
      }
    } catch (error) {
      setErrorMessage("حدث خطأ ، حاول مرة أخرى");
      console.error("Failed to verify OTP:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (!localPhoneNumber || !countryCode) {
      console.error("Phone number or country code is missing.");
      return;
    }

    try {
      // Now call loginPatient with both localPhoneNumber and countryCode
      const result = await loginPatient(localPhoneNumber, countryCode);
      if (result && result.success) {
        setOtp(["", "", "", ""]);
        inputRefs.current[0]?.focus();
        setErrorMessage(null);
      } else if (result) {
        setErrorMessage(result.message ?? "حدث خطأ ، حاول مرة أخرى");
        console.error("Failed to resend OTP:", result.message);
      } else {
        setErrorMessage("حدث خطأ ، حاول مرة أخرى");
      }
    } catch (error) {
      setErrorMessage("حدث خطأ ، حاول مرة أخرى");
      console.error("Failed to resend OTP:", error);
    }
  };

  return (
    <div dir="rtl" className={s.page}>
      <div className={s.shell}>
        {/* ─── TOP BAR ─── */}
        <header className={s.topBar}>
          <Link href="/landing" className={s.brand}>
            <div className={s.mark} />
            <span className={s.bname}>لاباس</span>
          </Link>
          {/* Right-pointing arrow = "back" in RTL */}
          <button onClick={() => router.back()} className={s.backBtn} aria-label="رجوع">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </header>

        {/* ─── HERO ─── */}
        <section className={s.hero}>
          <OTPTopText
            phoneNumber={
              countryCode && localPhoneNumber
                ? `${countryCode} ${localPhoneNumber}`
                : null
            }
          />
          <div className={s.pillVisual} aria-hidden="true">
            <div className={s.ring} />
            <div className={s.pillWrap}>
              <div className={s.pill}>
                <span className={s.pillText}>labass</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── CODE ─── */}
        <div className={s.card}>
          <label className={s.label} htmlFor="otp-0">رمز التحقق</label>
          <div className={o.boxes} dir="ltr">
            {otp.map((value, index) => (
              <OTPInput
                key={index}
                value={value}
                index={index}
                onChange={updateOTP}
                onFill={fillOTP}
                autoFocus={index === 0}
                hasError={!!errorMessage}
                ref={(el: any) => (inputRefs.current[index] = el)}
              />
            ))}
          </div>

          {isVerifying && (
            <div className={o.verifying} role="status">
              <span className={o.miniSpinner} />
              جارٍ التحقق…
            </div>
          )}

          {errorMessage && (
            <div role="alert" className={s.error}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M12 7v6M12 16.5v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              {errorMessage}
            </div>
          )}

          <OTPBottomText onResend={handleResendOTP} />
        </div>

        <footer className={s.foot}>شركة معالم التطوير · مرخّصة من وزارة الصحة</footer>
      </div>
    </div>
  );
};

export default OTPPage;
