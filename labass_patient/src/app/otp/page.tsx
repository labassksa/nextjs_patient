// pages/otp.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import OTPInput from "../../components/otp/otpInput";
import OTPHeader from "../../components/otp/header";
import OTPTopText from "../../components/otp/otpTopText";
import OTPBottomText from "../../components/otp/otpBottomText";
import { useRouter, useSearchParams } from "next/navigation";

const OTPPage = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([
    null,
    null,
    null,
    null,
  ]);

  const searchParams = useSearchParams();
  const phoneNumber = searchParams.get("phoneNumber"); // Extract phoneNumber from query parameters
  const router = useRouter(); // Use useRouter for navigation

  useEffect(() => {
    if (otp.every((val) => val.length === 1)) {
      handleSubmitOTP();
    }
  }, [otp.join("")]); // Trigger only when combined OTP changes

  const updateOTP = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus(); // Focus next field
    } else if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus(); // Focus previous field
    }
  };

  const handleSubmitOTP = async () => {
    if (!phoneNumber) {
      console.error("Phone number is missing in the OTP page.");
      return;
    }

    const otpCode = otp.join("");
    const data = {
      role: "patient",
      phoneNumber, // Use phoneNumber from query parameters
      otpcode: otpCode,
    };

    try {
      const response = await axios.post(
        "http://localhost:4000/api_labass/auth",
        data
      );
      // Extract the JWT token from response and store it in local storage
      const { token } = response.data;
      localStorage.setItem("jwtToken", token); // Store the token in local storage

      console.log("OTP Verified:", response.data);

      // Navigate to the home page after successful login
      router.push("/");
    } catch (error) {
      console.error("Failed to verify OTP:", error);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="flex flex-col justify-between">
        <OTPHeader />
        <OTPTopText phoneNumber={phoneNumber} />
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
        <OTPBottomText />
      </div>
    </div>
  );
};

export default OTPPage;
