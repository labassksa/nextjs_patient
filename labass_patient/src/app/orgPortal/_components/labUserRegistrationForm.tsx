// ./_components/LabUserRegistrationForm.tsx
"use client";

import React, { useState } from "react";
import { createLabUser } from "../_controllers/createLabUser";
import { convertArabicToEnglishNumbers } from "../../../utils/arabicToenglish";
import ConsultationTypeSection from "./ConsultationTypeSection"; // Ensure correct path

// Define the props interface
interface LabUserRegistrationFormProps {
  orgType: "pharmacy" | "laboratory" | "";
  onSubmit: (data: LabUserFormData) => void; // Adjust the type as needed
}

// Define the form data interface for better type safety
interface LabUserFormData {
  name: string;
  phoneNumber: string;
  dateOfBirth: Date | null;
  nationality: string;
  gender: string;
  nationalId?: string;
  testType: string;
  pdfFiles: File[];
}

const nationalities = ["سعودي", "مصري", "إماراتي", "قطري", "كويتي", "أخرى"];
const genders = ["ذكر", "أنثى"];

const LabUserRegistrationForm: React.FC<LabUserRegistrationFormProps> = ({
  orgType,
  onSubmit,
}) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [nationality, setNationality] = useState("سعودي");
  const [gender, setGender] = useState("");
  const [nationalId, setNationalId] = useState("");

  // Consultation Type and PDF Files
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

    if (convertedAge) {
      const ageInYears = parseInt(convertedAge, 10);
      if (!isNaN(ageInYears)) {
        const today = new Date();
        const birthDate = new Date(
          today.getFullYear() - ageInYears,
          today.getMonth(),
          today.getDate()
        );
        console.log("Date of Birth:", birthDate); // Log the Date object
        setDateOfBirth(birthDate); // Assuming setDateOfBirth expects a Date object
      } else {
        console.log("Invalid age input.");
        setDateOfBirth(null); // Clear DOB for invalid input, use null for Date types
      }
    } else {
      console.log("Age input is empty.");
      setDateOfBirth(null); // Clear DOB if no age is provided
    }
  };

  // Handle National ID or Iqama change
  const handleNationalIdorIqamaChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const convertedNationalId =
      convertArabicToEnglishNumbers(e.target.value) || "";
    setNationalId(convertedNationalId);
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

    const formData: LabUserFormData = {
      name,
      phoneNumber: phone.startsWith("0")
        ? `+966${phone.slice(1)}`
        : `+966${phone}`,
      dateOfBirth,
      nationality,
      gender,
      nationalId: nationalId || undefined,
      testType,
      pdfFiles,
    };

    try {
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
        setTestType("استشارة قبل التحليل");
        setPdfFiles([]);

        // Notify parent component
        onSubmit(formData);
      } else {
        alert(result.message || "حدث خطأ أثناء تسجيل المريض.");
      }
    } catch (error) {
      console.error("Error creating lab user:", error);
      alert("حدث خطأ أثناء تسجيل المريض.");
      setIsLoading(false);
    }
  };

  return (
    <div dir="rtl" className="p-4">
      <h2 className="text-black text-xl font-semibold mb-4">
        إرسال استشارة طبية
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Patient Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm text-black font-normal p-2"
          >
            اسم المريض
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border text-black border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-custom-green focus:border-custom-green"
            required
          />
        </div>

        {/* Phone Number */}
        <div>
          <label
            htmlFor="phone"
            className="block text-black text-sm font-normal p-2"
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
            className="w-full border text-black border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-custom-green focus:border-custom-green"
            required
          />
          {errorMessage && (
            <div className="text-red-400 text-sm">{errorMessage}</div>
          )}
        </div>

        {/* Age */}
        <div>
          <label
            htmlFor="age"
            className="block text-black text-sm font-normal p-2"
          >
            العمر
          </label>
          <input
            id="age"
            type="text"
            inputMode="numeric"
            value={age}
            onChange={handleAgeChange}
            className="w-full border text-black border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-custom-green focus:border-custom-green"
            required
          />
        </div>

        {/* Nationality */}
        <div>
          <label
            htmlFor="nationality"
            className="block text-sm text-black font-normal p-2"
          >
            الجنسية
          </label>
          <select
            id="nationality"
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            className="w-full text-black border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-custom-green focus:border-custom-green"
            required
          >
            {nationalities.map((nat) => (
              <option
                key={nat}
                value={nat}
                className="bg-white text-black focus:bg-custom-green"
              >
                {nat}
              </option>
            ))}
          </select>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-black text-sm font-normal p-2">
            الجنس
          </label>
          <div className="bg-white p-4 rounded-lg">
            {genders.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g)}
                className={`flex items-center justify-between p-2 w-full text-black focus:outline-none rounded-md mb-2 ${
                  gender === g
                    ? "bg-custom-green text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                aria-pressed={gender === g}
              >
                <div className="flex items-center">
                  <div
                    className={`w-4 h-4 rounded-full ml-2 ${
                      gender === g ? "bg-white" : "bg-gray-400"
                    }`}
                  />
                  <span>{g}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* National ID (Optional) */}
        <div>
          <label
            htmlFor="nationalId"
            className="block text-black text-sm font-normal p-2"
          >
            رقم الهوية الوطنية
          </label>
          <input
            id="nationalId"
            type="text"
            value={nationalId}
            onChange={handleNationalIdorIqamaChange}
            className="w-full border text-black border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-custom-green focus:border-custom-green"
          />
        </div>

        {/* Submit Button */}
        <div className="fixed bottom-12 left-0 w-full p-4 shadow-md">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-custom-green text-white py-3 px-4 rounded-md"
          >
            {isLoading ? <div className="spinner"></div> : "إرسال استشارة طبية"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LabUserRegistrationForm;
