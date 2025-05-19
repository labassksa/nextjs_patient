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

  // Use Map for ALL_NATIONALITIES
  const ALL_NATIONALITIES = new Map<string, string>([
    ["سعودي", t("nationalities.saudi")],
    ["باكستاني", t("nationalities.pakistani")],
    ["مصري", t("nationalities.egyptian")],
    ["إماراتي", t("nationalities.emirati")],
    ["قطري", t("nationalities.qatari")],
    ["كويتي", t("nationalities.kuwaiti")],
    ["بحريني", t("nationalities.bahraini")],
    ["عماني", t("nationalities.omani")],
    ["يمني", t("nationalities.yemeni")],
    ["لبناني", t("nationalities.lebanese")],
    ["سوري", t("nationalities.syrian")],
    ["أردني", t("nationalities.jordanian")],
    ["فلسطيني", t("nationalities.palestinian")],
    ["عراقي", t("nationalities.iraqi")],
    ["ليبي", t("nationalities.libyan")],
    ["تونسي", t("nationalities.tunisian")],
    ["جزائري", t("nationalities.algerian")],
    ["مغربي", t("nationalities.moroccan")],
    ["موريتاني", t("nationalities.mauritanian")],
    ["سوداني", t("nationalities.sudanese")],
    ["صومالي", t("nationalities.somali")],
    ["جيبوتي", t("nationalities.djiboutian")],
    ["جزر القمر", t("nationalities.comorian")],
    ["أفغاني", t("nationalities.afghan")],
    ["بنغلاديشي", t("nationalities.bangladeshi")],
    ["هندي", t("nationalities.indian")],
    ["سريلانكي", t("nationalities.sriLankan")],
    ["نيبالي", t("nationalities.nepali")],
    ["فلبيني", t("nationalities.filipino")],
    ["إندونيسي", t("nationalities.indonesian")],
    ["ماليزي", t("nationalities.malaysian")],
    ["تايلندي", t("nationalities.thai")],
    ["صيني", t("nationalities.chinese")],
    ["ياباني", t("nationalities.japanese")],
    ["كوري", t("nationalities.korean")],
    ["تركي", t("nationalities.turkish")],
    ["إيراني", t("nationalities.iranian")],
    ["روسي", t("nationalities.russian")],
    ["بريطاني", t("nationalities.british")],
    ["فرنسي", t("nationalities.french")],
    ["ألماني", t("nationalities.german")],
    ["إيطالي", t("nationalities.italian")],
    ["إسباني", t("nationalities.spanish")],
    ["أمريكي", t("nationalities.american")],
    ["كندي", t("nationalities.canadian")],
    ["برازيلي", t("nationalities.brazilian")],
    ["أسترالي", t("nationalities.australian")],
    ["نيجيري", t("nationalities.nigerian")],
    ["جنوب أفريقي", t("nationalities.southAfrican")],
    ["أخرى", t("nationalities.other")],
  ]);

  const genders = [Gender.Male, Gender.Female];

  const genderLabels: Record<Gender, string> = {
    [Gender.Male]: t("genders.male"),
    [Gender.Female]: t("genders.female"),
  };

  // State for custom dropdown
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter the nationalities based on the search term
  const filteredNationalities = Array.from(ALL_NATIONALITIES.entries()).filter(
    ([, value]) => value.toLowerCase().includes(searchTerm.toLowerCase())
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
            {ALL_NATIONALITIES.get(nationality) || t("chooseNationality")}
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
                {filteredNationalities.map(([key, value]) => (
                  <li key={key}>
                    <button
                      type="button"
                      onClick={() => handleSelectNationality(key)}
                      className={`block w-full text-right px-2 py-1 hover:bg-gray-200 ${
                        key === nationality
                          ? "bg-green-500 text-white"
                          : ""
                      }`}
                    >
                      {value}
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
