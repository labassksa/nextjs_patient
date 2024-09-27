"use client";
import React, { useState, useEffect, useRef } from "react";
import OTPInput from "./_components/otp/otpInput";
import Header from "../../components/common/header";
import OTPTopText from "./_components/otp/otpTopText";
import OTPBottomText from "./_components/otp/otpBottomText";
import { useRouter } from "next/navigation";
import { verifyOTPandLogin } from "./_controllers/verifyOTPandLogin"; // Adjust the import path as necessary
import { loginPatient } from "../login/_controllers/sendOTP.Controller"; // Adjust the import path as necessary

const OTPPage = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([
    null,
    null,
    null,
    null,
  ]);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const phoneNumber = searchParams.get("phoneNumber");
    setPhoneNumber(phoneNumber);
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
    if (!phoneNumber) {
      console.error("Phone number is missing in the OTP page.");
      return;
    }

    const otpCode = otp.join("");
    try {
      const result = await verifyOTPandLogin("patient", phoneNumber, otpCode);

      if (result && result.success) {
        console.log("OTP Verified:", result);
        router.push("/");
      } else if (result) {
        setErrorMessage(result.message ?? "حدث خطأ ، حاول مرة أخرى");
        console.error("Failed to verify OTP:", result.message);
      } else {
        setErrorMessage("حدث خطأ ، حاول مرة أخرى");
        console.error("Failed to verify OTP: Result is undefined");
      }
    } catch (error) {
      setErrorMessage("حدث خطأ ، حاول مرة أخرى");
      console.error("Failed to verify OTP:", error);
    }
  };

  const handleResendOTP = async () => {
    if (!phoneNumber) {
      console.error("Phone number is missing in the OTP page.");
      return;
    }

    try {
      const result = await loginPatient(phoneNumber);
      if (result && result.success) {
        setOtp(["", "", "", ""]); // Clear the OTP input fields
        inputRefs.current[0]?.focus(); // Focus on the first input field
        setErrorMessage(null);
      } else if (result) {
        setErrorMessage(result.message ?? "حدث خطأ ، حاول مرة أخرى");
        console.error("Failed to resend OTP:", result.message);
      } else {
        setErrorMessage("حدث خطأ ، حاول مرة أخرى");
        console.error("Failed to resend OTP: Result is undefined");
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
        {phoneNumber ? <OTPTopText phoneNumber={phoneNumber} /> : null}
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
