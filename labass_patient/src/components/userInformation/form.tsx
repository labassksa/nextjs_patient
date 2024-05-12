"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const PersonalInfoForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nationalId: "",
    dateOfBirth: "",
    gender: "",
  });

  // Add state for error handling and feedback
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Reset previous errors

    try {
      const response = await fetch(
        "https://yourapiendpoint.com/personal-info",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Submission successful:", result);
      // Optionally, navigate or show success message
      // router.push('/success-page');
    } catch (err) {
      // setError(err.message);
      console.error("Submission failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-between w-full h-screen p-4 rtl"
      noValidate
    >
      <div className="space-y-2 overflow-auto mb-4">
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="الاسم الأول"
          required
          className="px-4 py-2 border border-gray-300 w-full text-black text-right focus:outline-none focus:border-custom-green   placeholder-gray-400"
        />
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="الاسم الاخير"
          required
          className="px-4 py-2 border border-gray-300 text-black w-full text-right placeholder:text-right focus:outline-none focus:border-custom-green  placeholder-gray-400"
        />
        <input
          type="text"
          name="nationalId"
          value={formData.nationalId}
          onChange={handleChange}
          placeholder="رقم الهوية أو الإقامة"
          required
          className="px-4 py-2 border text-black border-gray-300 w-full text-right placeholder:text-right focus:outline-none focus:border-custom-green  placeholder-gray-400"
        />
        <div dir="rtl" className="flex flex-col text-black mb-4">
          تاريخ الميلاد{" "}
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
            className="px-4 py-2 mt-2 border border-gray-300 w-full text-right text-black placeholder:text-right  placeholder-black"
            placeholder="تاريخ الميلاد"
          />
        </div>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
          autoComplete="off"
          className="px-4 py-2 border border-gray-300 w-full text-black text-right focus:border-custom-green  placeholder:text-right  rtl"
        >
          <option value="" dir="rtl">
            اختر الجنس
          </option>
          <option value="male" dir="rtl">
            ذكر
          </option>
          <option value="female" dir="rtl">
            أنثى
          </option>
        </select>
      </div>
      <div className="sticky bottom-0 pb-4">
        <button
          type="submit"
          className="w-full font-bold bg-custom-green text-white py-4 px-4 rounded-3xl"
        >
          إرسال
        </button>
      </div>
    </form>
  );
};

export default PersonalInfoForm;
