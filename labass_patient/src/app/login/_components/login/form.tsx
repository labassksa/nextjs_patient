"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginPatient } from "../../_controllers/sendOTP.Controller";
import { convertArabicToEnglishNumbers } from "../../../../utils/arabicToenglish";
import { ArrowBack } from "@mui/icons-material";

const countryCodes = [
  { code: "+966", label: "🇸🇦 +966" },
  { code: "+971", label: "🇦🇪 +971" },
  { code: "+965", label: "🇰🇼 +965" },
  { code: "+973", label: "🇧🇭 +973" },
  { code: "+974", label: "🇶🇦 +974" },
  { code: "+20", label: "🇪🇬 +20" },
  { code: "+1", label: "🇺🇸 +1" },
];

const SimpleLoginForm = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [countryCode, setCountryCode] = useState<string>(countryCodes[0].code);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const convertedNumber = convertArabicToEnglishNumbers(e.target.value) || "";
    setPhoneNumber(convertedNumber);
    setErrorMessage("");
  };

  const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCountryCode(e.target.value);
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (phoneNumber.length < 7 || phoneNumber.length > 14) {
      setErrorMessage("يرجى إدخال رقم جوال صحيح");
      setIsLoading(false);
      return;
    }

    const cleanedPhoneNumber = phoneNumber.startsWith("0")
      ? phoneNumber.slice(1)
      : phoneNumber;

    const result = await loginPatient(cleanedPhoneNumber, countryCode);

    setIsLoading(false);

    if (result.success) {
      router.push(
        `/otp?phoneNumber=${encodeURIComponent(
          `${countryCode}${cleanedPhoneNumber}`
        )}`
      );
    } else {
      setErrorMessage(result.message || "حدث خطأ غير معروف");
    }
  };

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="flex flex-col h-screen justify-between">
      <form onSubmit={handleSubmit} className="text-right m-2" id="loginForm">
        <label htmlFor="phoneNumber" className="block mb-2">
          أدخل رقم الجوال
        </label>
        <div className="flex">
          <select
            id="countryCode"
            value={countryCode}
            onChange={handleCountryCodeChange}
            className="p-3 text-right text-lg border border-gray-200 rounded-l-md focus:outline-none focus:border-custom-green direction-rtl"
          >
            {countryCodes.map((cc) => (
              <option key={cc.code} value={cc.code}>
                {cc.label}
              </option>
            ))}
          </select>
          <input
            id="phoneNumber"
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            placeholder="5xxxxxxx"
            required
            className="w-full p-3 text-right text-lg border border-gray-200 rounded-r-md focus:outline-none focus:border-custom-green direction-rtl"
          />
        </div>

        {errorMessage && (
          <div className="text-red-400 text-sm mt-2">{errorMessage}</div>
        )}
      </form>

      <div className="p-6 mb-60">
        <div className="text-xs text-right">
          مع الاستمرار بتسجيل الدخول، أنت توافق على{" "}
          <a href="/termsandConditions" className="underline text-custom-green">
            الشروط والأحكام
          </a>
        </div>
        <button
          type="submit"
          form="loginForm"
          className="mt-2 px-6 py-4 w-full bg-custom-green text-white font-bold text-sm rounded-md focus:outline-none flex justify-center items-center"
          disabled={isLoading}
        >
          {isLoading ? <div className="spinner"></div> : "تسجيل الدخول"}
        </button>
      </div>
    </div>
  );
};

export default SimpleLoginForm;
