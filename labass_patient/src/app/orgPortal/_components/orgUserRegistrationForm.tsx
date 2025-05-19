"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  const ALL_NATIONALITIES = [
    { key: "سعودي", value: t("nationalities.saudi") },
    { key: "مصري", value: t("nationalities.egyptian") },
    { key: "إماراتي", value: t("nationalities.emirati") },
    { key: "قطري", value: t("nationalities.qatari") },
    { key: "كويتي", value: t("nationalities.kuwaiti") },
    { key: "بحريني", value: t("nationalities.bahraini") },
    { key: "عماني", value: t("nationalities.omani") },
    { key: "يمني", value: t("nationalities.yemeni") },
    { key: "لبناني", value: t("nationalities.lebanese") },
    { key: "سوري", value: t("nationalities.syrian") },
    { key: "أردني", value: t("nationalities.jordanian") },
    { key: "فلسطيني", value: t("nationalities.palestinian") },
    { key: "عراقي", value: t("nationalities.iraqi") },
    { key: "ليبي", value: t("nationalities.libyan") },
    { key: "تونسي", value: t("nationalities.tunisian") },
    { key: "جزائري", value: t("nationalities.algerian") },
    { key: "مغربي", value: t("nationalities.moroccan") },
    { key: "موريتاني", value: t("nationalities.mauritanian") },
    { key: "سوداني", value: t("nationalities.sudanese") },
    { key: "صومالي", value: t("nationalities.somali") },
    { key: "جيبوتي", value: t("nationalities.djiboutian") },
    { key: "جزر القمر", value: t("nationalities.comorian") },
    { key: "أفغاني", value: t("nationalities.afghan") },
    { key: "باكستاني", value: t("nationalities.pakistani") },
    { key: "بنغلاديشي", value: t("nationalities.bangladeshi") },
    { key: "هندي", value: t("nationalities.indian") },
    { key: "سريلانكي", value: t("nationalities.sriLankan") },
    { key: "نيبالي", value: t("nationalities.nepali") },
    { key: "فلبيني", value: t("nationalities.filipino") },
    { key: "إندونيسي", value: t("nationalities.indonesian") },
    { key: "ماليزي", value: t("nationalities.malaysian") },
    { key: "تايلندي", value: t("nationalities.thai") },
    { key: "صيني", value: t("nationalities.chinese") },
    { key: "ياباني", value: t("nationalities.japanese") },
    { key: "كوري", value: t("nationalities.korean") },
    { key: "تركي", value: t("nationalities.turkish") },
    { key: "إيراني", value: t("nationalities.iranian") },
    { key: "روسي", value: t("nationalities.russian") },
    { key: "بريطاني", value: t("nationalities.british") },
    { key: "فرنسي", value: t("nationalities.french") },
    { key: "ألماني", value: t("nationalities.german") },
    { key: "إيطالي", value: t("nationalities.italian") },
    { key: "إسباني", value: t("nationalities.spanish") },
    { key: "أمريكي", value: t("nationalities.american") },
    { key: "كندي", value: t("nationalities.canadian") },
    { key: "برازيلي", value: t("nationalities.brazilian") },
    { key: "أسترالي", value: t("nationalities.australian") },
    { key: "نيجيري", value: t("nationalities.nigerian") },
    { key: "جنوب أفريقي", value: t("nationalities.southAfrican") },
    { key: "أخرى", value: t("nationalities.other") }
  ];

  const genders = [Gender.Male, Gender.Female];

  const genderLabels: Record<Gender, string> = {
    [Gender.Male]: t("genders.male"),
    [Gender.Female]: t("genders.female"),
  };

  // State for custom dropdown
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter the nationalities based on the search term
  const filteredNationalities = ALL_NATIONALITIES.filter((nat) =>
    nat.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Clicking outside the dropdown to close it:
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
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
    <div dir="rtl" className="max-w-xl mx-auto bg-white rounded-lg p-6 mt-8">
      <h2 className="text-gray-800 text-2xl font-semibold mb-4 text-center">
        {t("formTitle")}
      </h2>

      <form className="space-y-4">
        {/* Patient Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm text-gray-700 font-medium mb-1"
          >
            {t("patientName")}
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-200 focus:outline-none"
            required
          />
        </div>

        {/* Phone Number */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm text-gray-700 font-medium mb-1"
          >
            {t("phoneNumber")}
          </label>
          <input
            id="phone"
            dir="rtl"
            type="tel"
            placeholder="05xxx"
            value={phone}
            onChange={handlePhoneNumberChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-200 focus:outline-none"
            required
          />
        </div>

        {/* Age */}
        <div>
          <label
            htmlFor="age"
            className="block text-sm text-gray-700 font-medium mb-1"
          >
            {t("age")}
          </label>
          <input
            id="age"
            type="text"
            inputMode="numeric"
            value={age}
            onChange={handleAgeChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-200 focus:outline-none"
            required
          />
        </div>

        {/* Nationality - Custom Combo Box with search inside dropdown */}
        <div className="relative" ref={dropdownRef}>
          <label
            htmlFor="nationality"
            className="block text-sm text-gray-700 font-medium mb-1"
          >
            {t("nationality")}
          </label>
          {/* "Clickable" field showing selected nationality */}
          <button
            type="button"
            id="nationality"
            onClick={() => setShowDropdown((prev) => !prev)}
            className="w-full flex justify-between items-center border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-200 focus:outline-none"
          >
            {nationality || t("chooseNationality")}
            <span className="ml-2 text-gray-600">▼</span>
          </button>

          {/* Dropdown menu */}
          {showDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg p-2">
              {/* Search input at top */}
              <input
                type="text"
                placeholder={t("search")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 mb-2 focus:ring-2 focus:ring-green-200 focus:outline-none"
              />
              <ul className="max-h-40 overflow-auto">
                {filteredNationalities.map((nat) => (
                  <li key={nat.key}>
                    <button
                      type="button"
                      onClick={() => handleSelectNationality(nat.key)}
                      className={`block w-full text-right px-2 py-1 hover:bg-gray-200 ${
                        nat.key === nationality
                          ? "bg-green-500 text-white"
                          : ""
                      }`}
                    >
                      {nat.value}
                    </button>
                  </li>
                ))}
                {filteredNationalities.length === 0 && (
                  <li className="text-gray-500 px-2 py-1">
                    {t("noResults")}
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            {t("gender")}
          </label>
          <div className="bg-gray-50 p-4 rounded-lg">
            {genders.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g)}
                className={`flex items-center justify-between p-2 w-full focus:outline-none rounded-md mb-2 transition-colors ${
                  gender === g
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
                aria-pressed={gender === g}
              >
                <div className="flex items-center">
                  <div
                    className={`w-4 h-4 rounded-full ml-2 ${
                      gender === g ? "bg-white" : "bg-gray-400"
                    }`}
                  />
                  <span className="text-sm">{genderLabels[g]}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* National ID (Optional) */}
        <div>
          <label
            htmlFor="nationalId"
            className="block text-gray-700 text-sm font-medium mb-1"
          >
            {t("nationalId")}
          </label>
          <input
            id="nationalId"
            type="text"
            value={nationalId}
            onChange={handleNationalIdorIqamaChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-200 focus:outline-none"
          />
        </div>
      </form>
    </div>
  );
};

export default OrgUserRegistrationForm;
