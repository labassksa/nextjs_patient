import React, { useState } from "react";

const MarketerRegistrationForm: React.FC = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = () => {
    if (!name || !phone) {
      alert("يرجى إدخال اسمك الكامل ورقم هاتفك.");
      return;
    }

    // Simulate API call here
    alert("تم حفظ بياناتك وسيتم إنشاء رموز ترويجية لك!");
  };

  return (
    <div dir="rtl">
      <h2 className="text-black text-xl font-semibold mb-2 text-black">
        انضم كمسوّق{" "}
      </h2>
      <p className="mb-4 text-black">
        أدخل بياناتك أدناه للتسجيل والبدء في معرفة كيفية العمل.
      </p>
      <div dir="rtl" className=" text-black space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-bold">
            الاسم الكامل
          </label>
          <input
            dir="rtl"
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="أدخل اسمك الكامل"
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-bold">
            رقم الجوال (رقم سعودي)
          </label>
          <input
            dir="rtl"
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="أدخل رقم هاتفك"
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-900 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700"
        >
          طلب أكواد خصم{" "}
        </button>
      </div>
    </div>
  );
};

export default MarketerRegistrationForm;
