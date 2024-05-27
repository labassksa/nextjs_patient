"use client";
import React, { useState } from "react";

const PersonalInfoForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    idNumber: "",
    dob: "dd/mm/yyyy",
    gender: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData); // Replace with your submission logic
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="pt-16 flex flex-col min-h-screen m-2"
    >
      <div className="space-y-4 p-4 flex-grow text-black  ">
        <input
          type="text"
          name="firstName"
          placeholder="الاسم الأول"
          onChange={handleChange}
          value={formData.firstName}
          className="w-full p-3 border rounded text-right focus:outline-none focus:border-custom-green"
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="اسم العائلة"
          onChange={handleChange}
          value={formData.lastName}
          className="w-full p-3 border rounded text-right focus:outline-none focus:border-custom-green"
          required
        />
        <input
          type="text"
          name="idNumber"
          placeholder="رقم الهوية أو الإقامة"
          onChange={handleChange}
          value={formData.idNumber}
          className="w-full p-3 border rounded text-right focus:outline-none focus:border-custom-green"
          required
        />
        <div>
          <div className="" dir="rtl">
            أدخل تاريخ الميلاد
          </div>
          <input
            className="w-full p-3 border rounded text-right text-black appearance-none"
            autoFocus
            type="date"
            name="dob"
            onChange={handleChange}
            value={formData.dob}
            required
          />
        </div>

        <div className="flex flex-col justify-between" dir="rtl">
          <div className=""> هل أنت</div>
          <label>
            <input
              type="radio"
              name="gender"
              value="male"
              className=""
              onChange={handleChange}
              checked={formData.gender === "male"}
            />{" "}
            ذكر
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="female"
              onChange={handleChange}
              checked={formData.gender === "female"}
            />{" "}
            أنثى
          </label>
        </div>
      </div>
      <button
        type="submit"
        className="sticky bottom-0 w-full bg-custom-green p-4 mt-2 text-white rounded-3xl mb-2"
      >
        إرسال
      </button>
    </form>
  );
};

export default PersonalInfoForm;
