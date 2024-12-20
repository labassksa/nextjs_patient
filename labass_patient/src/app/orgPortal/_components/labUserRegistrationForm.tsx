"use client";

import React, { useState } from "react";
import { createLabUser } from "../_controllers/createLabUser";
import { convertArabicToEnglishNumbers } from "../../../utils/arabicToenglish";

const nationalities = ["سعودي", "مصري", "إماراتي", "قطري", "كويتي", "أخرى"];
const genders = ["ذكر", "أنثى"];
const testTypes = ["استشارة قبل التحليل", "استشارة بعد التحليل"];

const LabUserRegistrationForm: React.FC = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [nationality, setNationality] = useState("سعودي");
  const [gender, setGender] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [testType, setTestType] = useState("استشارة قبل التحليل");
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle phone number change
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const convertedPhone = convertArabicToEnglishNumbers(e.target.value) || "";
    setPhone(convertedPhone);
    setErrorMessage("");
  };

  // Handle age input change
  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const convertedAge = convertArabicToEnglishNumbers(e.target.value) || "";
    setAge(convertedAge);
  };
  // Handle age input change
  const handleNationalIdorIqamaChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const convertedNationalId =
      convertArabicToEnglishNumbers(e.target.value) || "";
    setNationalId(convertedNationalId);
  };

  // Handle file addition
  const handleAddPdf = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPdfFiles([...pdfFiles, ...Array.from(e.target.files)]);
    }
  };

  // Handle file removal
  const handleRemovePdf = (index: number) => {
    setPdfFiles(pdfFiles.filter((_, i) => i !== index));
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !phone || !age || !nationality || !gender || !testType) {
      alert("يرجى ملء جميع الحقول المطلوبة.");
      return;
    }

    if (phone.length !== 10) {
      setErrorMessage("يرجى إدخال رقم جوال صحيح مكون من 10 أرقام.");
      return;
    }

    if (testType === "استشارة بعد التحليل" && pdfFiles.length === 0) {
      alert("يرجى تحميل ملف أو أكثر بصيغة PDF عند اختيار استشارة بعد التحليل.");
      return;
    }

    setIsLoading(true);

    const formData = {
      name,
      phoneNumber: phone.startsWith("0")
        ? `+966${phone.slice(1)}`
        : `+966${phone}`,
      age,
      nationality,
      gender,
      nationalId: nationalId || undefined,
      testType,
      pdfFiles,
    };

    const result = await createLabUser(formData);

    setIsLoading(false);

    if (result.success) {
      alert(`تم تسجيل المريض ${name} بنجاح.`);
      // Reset form
      setName("");
      setPhone("");
      setAge("");
      setNationality("سعودي");
      setGender("");
      setNationalId("");
      setTestType("");
      setPdfFiles([]);
    } else {
      alert(result.message || "حدث خطأ أثناء تسجيل المريض.");
    }
  };

  return (
    <div dir="rtl" className="p-4">
      <h2
        className="text-black text-xl font-
       mb-4"
      >
        إرسال استشارة طبية{" "}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Patient Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-normal p-2">
            اسم المريض
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-custom-green focus:border-custom-green"
            required
          />
        </div>

        {/* Phone Number */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-normal
           p-2"
          >
            رقم الجوال
          </label>
          <input
            id="phone"
            dir="rtl"
            type="tel"
            placeholder="05xxx"
            value={phone}
            onChange={handlePhoneNumberChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-custom-green focus:border-custom-green"
            required
          />
          {errorMessage && (
            <div className="text-red-400 text-sm">{errorMessage}</div>
          )}
        </div>

        {/* Age */}
        <div>
          <label htmlFor="age" className="block text-sm font-normal p-2">
            العمر
          </label>
          <input
            id="age"
            type="text"
            inputMode="numeric"
            value={age}
            onChange={handleAgeChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-custom-green focus:border-custom-green"
            required
          />
        </div>

        {/* Nationality */}
        <div>
          <label
            htmlFor="nationality"
            className="block text-sm font-normal p-2"
          >
            الجنسية
          </label>
          <select
            id="nationality"
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-custom-green focus:border-custom-green"
            required
          >
            {nationalities.map((nat) => (
              <option
                key={nat}
                value={nat}
                className="bg-white focus:bg-custom-green"
              >
                {nat}
              </option>
            ))}
          </select>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-normal p-2">الجنس</label>
          <div className="bg-white p-4 rounded-lg">
            {genders.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g)}
                className="flex items-center justify-between p-2 w-full text-black"
              >
                <div className="flex items-center">
                  <div
                    className={`w-4 h-4 rounded-full ml-2 ${
                      gender === g ? "bg-custom-green" : "bg-gray-400"
                    }`}
                  />
                  {g}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* National ID (Optional) */}
        <div>
          <label htmlFor="nationalId" className="block text-sm font-normal p-2">
            رقم الهوية الوطنية
          </label>
          <input
            id="nationalId"
            type="text"
            value={nationalId}
            onChange={handleNationalIdorIqamaChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-custom-green focus:border-custom-green"
          />
        </div>

        {/* Test Type */}
        <div>
          <label className="block text-sm font-normal p-2">وقت الاستشارة</label>
          <div className="bg-white p-4 rounded-lg">
            {testTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setTestType(type)}
                className="flex items-center justify-between p-2 w-full text-black"
              >
                <div className="flex items-center">
                  <div
                    className={`w-4 h-4 rounded-full ml-2 ${
                      testType === type ? "bg-custom-green" : "bg-gray-400"
                    }`}
                  />
                  {type}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* PDF Files */}
        {testType === "استشارة بعد التحليل" && (
          <div>
            <label htmlFor="pdfFiles" className="block text-sm font-normal p-2">
              إضافة ملف
            </label>
            <input
              id="pdfFiles"
              type="file"
              accept="application/pdf"
              multiple
              onChange={handleAddPdf}
              className="w-full border border-gray-300 rounded-md p-2 file:mr-2 file:py-1 file:px-4 file:border-0 file:bg-custom-green file:text-white file:rounded-md file:cursor-pointer focus:ring-2 focus:ring-custom-green"
            />
            {pdfFiles.length > 0 && (
              <div className="mt-2">
                {pdfFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span>{file.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePdf(index)}
                      className="text-red-400"
                    >
                      إزالة
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-custom-green text-white py-3 px-4 rounded-md"
        >
          {isLoading ? <div className="spinner"></div> : "إرسال استشارة طبية"}
        </button>
      </form>
    </div>
  );
};

export default LabUserRegistrationForm;
