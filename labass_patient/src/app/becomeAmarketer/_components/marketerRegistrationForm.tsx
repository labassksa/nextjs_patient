"use client";

import React, { useState } from "react";
import { createMarketerAndGeneratePromoCodes } from "../_controllers/createMarketerAndCodes";
import { convertArabicToEnglishNumbers } from "../../../utils/arabicToenglish";

const MarketerRegistrationForm: React.FC = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [promoterName] = useState("Mostafa");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const convertedPhone = convertArabicToEnglishNumbers(e.target.value) || "";
    setPhone(convertedPhone);
    setErrorMessage(""); // Clear errors on input change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !phone) {
      alert("يرجى إدخال اسمك الكامل ورقم هاتفك.");
      return;
    }

    if (phone.length !== 10) {
      setErrorMessage("يرجى إدخال رقم جوال صحيح مكون من 10 أرقام.");
      return;
    }
    const cleanedPhoneNumber = phone.startsWith("0") ? phone.slice(1) : phone;
    setIsLoading(true);

    const result = await createMarketerAndGeneratePromoCodes(
      name,
      cleanedPhoneNumber,
      promoterName
    );

    setIsLoading(false);

    if (result.success) {
      alert(
        `تم اضافة اسم المسوق ${name} ورقم جواله ${phone}، وتم إرسال أكواد الخصم مع مزيد من التفاصيل عبر الواتس`
      );
    } else {
      alert(result.message || "لم يتم اضافتك كمسوق حدث خطأ");
    }
  };

  return (
    <div dir="rtl">
      <h2 className="text-black text-xl font-semibold mb-2">انضم كمسوّق</h2>
      <p className="mb-4 text-black">
        أدخل بياناتك أدناه للتسجيل والبدء في معرفة كيفية العمل.
      </p>
      <form onSubmit={handleSubmit} className="text-black space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-bold p-2">
            الاسم الكامل
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="أدخل اسمك الكامل"
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-bold p-2">
            رقم الجوال (رقم سعودي)
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={handlePhoneNumberChange}
            placeholder="05xx"
            className="w-full border border-gray-300 rounded-md p-2"
            dir="rtl"
          />
          {errorMessage && (
            <div className="text-red-400 text-sm m-2">{errorMessage}</div>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-custom-green text-white font-bold py-3 px-4 rounded-md flex justify-center items-center"
        >
          {isLoading ? (
            <div className="spinner border-t-4 border-white border-solid rounded-full w-6 h-6 animate-spin"></div>
          ) : (
            "طلب أكواد خصم"
          )}
        </button>
      </form>
    </div>
  );
};

export default MarketerRegistrationForm;
