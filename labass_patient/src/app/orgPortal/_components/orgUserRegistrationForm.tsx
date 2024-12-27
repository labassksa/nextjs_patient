"use client";

import React from "react";
import { convertArabicToEnglishNumbers } from "../../../utils/arabicToenglish";

// Define the props interface
interface OrgUserRegistrationFormProps {
  orgType: "pharmacy" | "laboratory" | "";
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  phone: string;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
  age: string;
  setAge: React.Dispatch<React.SetStateAction<string>>;
  dateOfBirth: Date | null;
  setDateOfBirth: React.Dispatch<React.SetStateAction<Date | null>>;
  nationality: string;
  setNationality: React.Dispatch<React.SetStateAction<string>>;
  gender: string;
  setGender: React.Dispatch<React.SetStateAction<string>>;
  nationalId: string;
  setNationalId: React.Dispatch<React.SetStateAction<string>>;
  pdfFiles: File[];
  setPdfFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

const nationalities = ["سعودي", "مصري", "إماراتي", "قطري", "كويتي", "أخرى"];
const genders = ["ذكر", "أنثى"];

const LabUserRegistrationForm: React.FC<OrgUserRegistrationFormProps> = ({
  orgType,
  name,
  setName,
  phone,
  setPhone,
  age,
  setAge,
  dateOfBirth,
  setDateOfBirth,
  nationality,
  setNationality,
  gender,
  setGender,
  nationalId,
  setNationalId,
  pdfFiles,
  setPdfFiles,
}) => {
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const convertedPhone = convertArabicToEnglishNumbers(e.target.value) || "";
    setPhone(convertedPhone);
  };

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
        setDateOfBirth(birthDate);
      } else {
        setDateOfBirth(null);
      }
    } else {
      setDateOfBirth(null);
    }
  };

  const handleNationalIdorIqamaChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const convertedNationalId =
      convertArabicToEnglishNumbers(e.target.value) || "";
    setNationalId(convertedNationalId);
  };

  return (
    <div dir="rtl" className="p-4">
      <h2 className="text-black text-xl font-semibold mb-4">
        إرسال استشارة طبية
      </h2>
      <form className="space-y-4">
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
      </form>
    </div>
  );
};

export default LabUserRegistrationForm;
