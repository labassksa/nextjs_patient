"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { login } from "../../controllers/login.Controller"; // Import the login function from your authController
import { convertArabicToEnglishNumbers } from "../../utils/arabicToenglish";

const SimpleLoginForm = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State to hold error messages
  const router = useRouter();

  const handlePhoneNumberChange = (e: { target: { value: string } }) => {
    const convertedNumber = convertArabicToEnglishNumbers(e.target.value);
    setPhoneNumber(convertedNumber);
    setErrorMessage(""); // Clear previous error messages when user changes input
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // Ensure the phone number is exactly 10 digits long
    if (phoneNumber.length !== 10) {
      setErrorMessage("يرجى إدخال رقم جوال صحيح مكون من 10 أرقام");
      return;
    }

    const cleanedPhoneNumber = phoneNumber.startsWith("0")
      ? phoneNumber.slice(1)
      : phoneNumber;

    const result = await login(cleanedPhoneNumber); // Call the login function from authController

    if (result.success) {
      // Navigate to OTP page using query string for phoneNumber
      router.push(`/otp?phoneNumber=%2B966${cleanedPhoneNumber}`);
    } else {
      setErrorMessage(result.message); // Set error message on login failure
    }
  };

  return (
    <form onSubmit={handleSubmit} className="text-right m-2">
      <label htmlFor="phoneNumber" className="block m-2">
        أدخل رقم الجوال
      </label>
      <div className="m-2">
        <input
          id="phoneNumber"
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          placeholder="059xxxxxxx"
          required
          className="w-full p-3 text-lg border-2 border-gray-300 rounded-md focus:outline-none focus:border-custom-green direction-rtl"
        />
        {errorMessage && (
          <div className="text-red-500 text-sm m-2">{errorMessage}</div>
        )}
      </div>
      <button
        type="submit"
        className="px-6 py-2 w-full bg-custom-green text-white rounded-md focus:outline-none"
      >
        تسجيل الدخول
      </button>
    </form>
  );
};

export default SimpleLoginForm;
