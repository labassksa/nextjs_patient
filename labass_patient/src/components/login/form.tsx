"use client";
import React, { useState } from "react";

const SimpleLoginForm = () => {
  const [phoneNumber, setPhoneNumber] = useState("");

  // Handle changes in the phone number input
  const handlePhoneNumberChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setPhoneNumber(e.target.value);
  };

  // Function to handle form submission
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    alert(`Phone number entered: ${phoneNumber}`);
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
      </div>
      <button
        type="submit"
        className="px-6 py-2 w-full  bg-custom-green text-white rounded-md  focus:outline-none"
      >
        تسجيل الدخول
      </button>
    </form>
  );
};

export default SimpleLoginForm;
