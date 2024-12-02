"use client";

import React, { useState } from "react";
import { createMarketerAndGeneratePromoCodes } from "../_controllers/createMarketerAndCodes";
import { convertArabicToEnglishNumbers } from "../../../utils/arabicToenglish";

const MarketerRegistrationForm: React.FC = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [promoterName] = useState("Mostafa");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !phone) {
      alert("يرجى إدخال اسمك الكامل ورقم هاتفك.");
      return;
    }

    const convertedPhone = convertArabicToEnglishNumbers(phone);

    setIsLoading(true);

    const result = await createMarketerAndGeneratePromoCodes(
      name,
      convertedPhone,
      promoterName
    );

    setIsLoading(false);

    if (result.success) {
      alert(
        "تم اضافة اسم المسوق ورقم جواله ، وتم إرسال أكواد الخصم مع مزيد من التفاصيل عبر الواتس"
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
      <div className="text-black space-y-4">
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
        <div dir="rtl">
          <label htmlFor="phone" className="block text-sm font-bold p-2">
            رقم الجوال (رقم سعودي)
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="05xx"
            className="w-full border border-gray-300 rounded-md p-2"
            dir="rtl"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-custom-green text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700"
        >
          {isLoading ? "جاري التنفيذ..." : "طلب أكواد خصم"}
        </button>
      </div>
    </div>
  );
};

export default MarketerRegistrationForm;
