"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { convertArabicToEnglishNumbers } from "../../utils/arabicToenglish";

export default function SchoolLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const cleaned = convertArabicToEnglishNumbers(phone) || phone;
    const local = cleaned.startsWith("0") ? cleaned.slice(1) : cleaned;

    if (!/^\d{9}$/.test(local)) {
      setError("يرجى إدخال رقم جوال صحيح");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/send-otp`, {
        phoneNumber: `+966${local}`,
        role: "patient",
      });
      router.push(`/schoolOtp?phoneNumber=${encodeURIComponent(`+966${local}`)}`);
    } catch (err: any) {
      setError(err?.response?.data?.error || "حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-2xl font-bold leading-snug">بوابة المدارس</h1>
        <p className="text-green-100 text-sm mt-1">
          تسجيل دخول موظفي وإداريي المدارس
        </p>
      </div>

      {/* Form card */}
      <div className="flex-1 px-4 -mt-5 pb-8" style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom, 2rem))" }}>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                رقم الجوال
              </label>
              <div className="flex gap-2">
                {/* Country code badge */}
                <div className="flex items-center flex-shrink-0 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 whitespace-nowrap">
                  🇸🇦 +966
                </div>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => {
                    setPhone(convertArabicToEnglishNumbers(e.target.value) || e.target.value);
                    setError("");
                  }}
                  placeholder="5xxxxxxxx"
                  dir="ltr"
                  className="flex-1 min-w-0 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              {error && (
                <p className="text-red-500 text-xs mt-1.5 text-right">{error}</p>
              )}
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              مع الاستمرار، أنت توافق على{" "}
              <a href="/termsandConditions" className="underline text-green-600">
                الشروط والأحكام
              </a>
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-green-300 text-white font-bold text-sm rounded-xl transition-colors"
            >
              {loading ? "جارٍ الإرسال..." : "إرسال رمز التحقق"}
            </button>
          </form>
        </div>

        {/* Back link */}
        <button
          onClick={() => router.push("/home")}
          className="mt-4 w-full text-center text-sm text-gray-400 hover:text-gray-600 active:text-gray-800 py-3"
        >
          العودة للصفحة الرئيسية
        </button>
      </div>
    </div>
  );
}
