"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginPatient } from "../../_controllers/sendOTP.Controller";
import { convertArabicToEnglishNumbers } from "../../../../utils/arabicToenglish";
import s from "../../login.module.css";

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

  return (
    <form onSubmit={handleSubmit} className={s.card} id="loginForm" noValidate>
      <label htmlFor="phoneNumber" className={s.label}>
        رقم الجوال
      </label>

      {/* Phone numbers read left-to-right: [code ▾ | number] */}
      <div dir="ltr" className={`${s.field} ${errorMessage ? s.fieldError : ""}`}>
        <div className={s.codeWrap}>
          <select
            id="countryCode"
            aria-label="رمز الدولة"
            value={countryCode}
            onChange={handleCountryCodeChange}
            className={s.code}
          >
            {countryCodes.map((cc) => (
              <option key={cc.code} value={cc.code}>
                {cc.label}
              </option>
            ))}
          </select>
          <svg className={s.codeChevron} width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <input
          id="phoneNumber"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          placeholder="5X XXX XXXX"
          required
          autoFocus
          aria-invalid={!!errorMessage}
          aria-describedby={errorMessage ? "phoneError" : undefined}
          className={s.input}
        />
      </div>

      {errorMessage ? (
        <div id="phoneError" role="alert" className={s.error}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path d="M12 7v6M12 16.5v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          {errorMessage}
        </div>
      ) : (
        <p className={s.hint}>سنرسل لك رمز تحقق عبر رسالة نصية</p>
      )}

      <button type="submit" className={s.submit} disabled={isLoading}>
        {isLoading ? (
          <div className="spinner"></div>
        ) : (
          <>
            إرسال رمز التحقق
            <span className={s.submitArr}>←</span>
          </>
        )}
      </button>

      <p className={s.terms}>
        مع الاستمرار بتسجيل الدخول، أنت توافق على{" "}
        <a href="/termsandConditions" className={s.termsLink}>
          الشروط والأحكام
        </a>
      </p>
    </form>
  );
};

export default SimpleLoginForm;
