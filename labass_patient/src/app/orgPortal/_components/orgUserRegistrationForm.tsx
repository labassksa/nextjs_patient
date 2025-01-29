"use client";

import React, { useState, useRef } from "react";
import { convertArabicToEnglishNumbers } from "../../../utils/arabicToenglish";
import { Gender } from "../_types/genderType";
import { OrganizationTypes } from "../_types/organizationTypes";

// Define the props interface
interface OrgUserRegistrationFormProps {
  orgType: OrganizationTypes.Pharmacy | OrganizationTypes.Laboratory | "";
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
  gender: Gender;
  setGender: React.Dispatch<React.SetStateAction<Gender>>;
  nationalId: string;
  setNationalId: React.Dispatch<React.SetStateAction<string>>;
  pdfFiles: File[];
  setPdfFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

const ALL_NATIONALITIES = [
  "سعودي",
  "مصري",
  "إماراتي",
  "قطري",
  "كويتي",
  "بحريني",
  "لبناني",
  "سوري",
  "أردني",
  "فلسطيني",
  "ليبي",
  "سوداني",
  "أخرى",
];
const genders = [Gender.Male, Gender.Female];

// Mapping from Gender enum to Arabic labels
const genderLabels: Record<Gender, string> = {
  [Gender.Male]: "ذكر",
  [Gender.Female]: "أنثى",
};

const OrgUserRegistrationForm: React.FC<OrgUserRegistrationFormProps> = ({
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
  // State for custom dropdown
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter the nationalities based on the search term
  const filteredNationalities = ALL_NATIONALITIES.filter((nat) =>
    nat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Clicking outside the dropdown to close it:
  const dropdownRef = useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handlers
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const converted = convertArabicToEnglishNumbers(e.target.value) || "";
    setPhone(converted);
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
    const convertedId = convertArabicToEnglishNumbers(e.target.value) || "";
    setNationalId(convertedId);
  };

  // Handle selection of a nationality
  const handleSelectNationality = (selectedNat: string) => {
    setNationality(selectedNat);
    setShowDropdown(false);
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

        {/* Nationality - Custom Combo Box with search inside dropdown */}
        <div className="relative" ref={dropdownRef}>
          <label
            htmlFor="nationality"
            className="block text-sm text-black font-normal p-2"
          >
            الجنسية
          </label>
          {/* "Clickable" field showing selected nationality */}
          <button
            type="button"
            id="nationality"
            onClick={() => setShowDropdown((prev) => !prev)}
            className="w-full flex justify-between items-center border text-black border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-custom-green focus:border-custom-green"
          >
            {nationality || "اختر الجنسية"}
            <span className="ml-2 text-gray-600">▼</span>
          </button>

          {/* Dropdown menu */}
          {showDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg p-2">
              {/* Search input at top */}
              <input
                type="text"
                placeholder="ابحث هنا..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border text-black border-gray-300 rounded-md p-2 mb-2 focus:ring-2 focus:ring-custom-green focus:border-custom-green"
              />
              <ul className="max-h-40 overflow-auto">
                {filteredNationalities.map((nat) => (
                  <li key={nat}>
                    <button
                      type="button"
                      onClick={() => handleSelectNationality(nat)}
                      className={`block w-full text-right px-2 py-1 hover:bg-gray-200 ${
                        nat === nationality ? "bg-custom-green text-white" : ""
                      }`}
                    >
                      {nat}
                    </button>
                  </li>
                ))}
                {filteredNationalities.length === 0 && (
                  <li className="text-gray-500 px-2 py-1">لا توجد نتائج</li>
                )}
              </ul>
            </div>
          )}
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
                  <span>{genderLabels[g]}</span>
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

export default OrgUserRegistrationForm;
