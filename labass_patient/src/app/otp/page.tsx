"use client";
import React, { useState, useEffect, useRef } from "react";
import OTPInput from "./_components/otp/otpInput";
import Header from "../../components/common/header";
import OTPTopText from "./_components/otp/otpTopText";
import OTPBottomText from "./_components/otp/otpBottomText";
import { useRouter } from "next/navigation";
import { verifyOTPandLogin } from "./_controllers/verifyOTPandLogin";
import { loginPatient } from "../login/_controllers/sendOTP.Controller";

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
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    } else if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    if (!localPhoneNumber || !countryCode) {
      console.error("Phone number or country code is missing.");
      return;
    }

    const otpCode = otp.join("");
    try {
      const fullNumber = `${countryCode}${localPhoneNumber}`;
      const result = await verifyOTPandLogin("patient", fullNumber, otpCode);

      if (result && result.success) {
        router.push("/");
      } else if (result) {
        setErrorMessage(result.message ?? "حدث خطأ ، حاول مرة أخرى");
      } else {
        setErrorMessage("حدث خطأ ، حاول مرة أخرى");
      }
    } catch (error) {
      setErrorMessage("حدث خطأ ، حاول مرة أخرى");
      console.error("Failed to verify OTP:", error);
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
    <div className="bg-white min-h-screen">
      <div className="flex flex-col justify-between">
        <Header title="التحقق" showBackButton />
        {countryCode && localPhoneNumber ? (
          <OTPTopText phoneNumber={`${countryCode}${localPhoneNumber}`} />
        ) : null}
        <div className="flex mt-10 justify-center">
          {otp.map((value, index) => (
            <OTPInput
              key={index}
              value={value}
              index={index}
              onChange={updateOTP}
              autoFocus={index === 0}
              ref={(el: any) => (inputRefs.current[index] = el)}
            />
          ))}
        </div>
        {errorMessage && (
          <div className="text-red-500 text-sm m-2 text-center">
            {errorMessage}
          </div>
        )}
        <OTPBottomText onResend={handleResendOTP} />
      </div>
    </div>
  );
};

export default OTPPage;
