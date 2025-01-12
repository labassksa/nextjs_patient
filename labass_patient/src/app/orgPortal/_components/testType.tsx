// src/app/orgPortal/_components/ConsultationTypeSection.tsx

"use client";

import React from "react";
import { LabtestType } from "../_types/labTestTypes";
import { OrganizationTypes } from "../_types/organizationTypes"; // Ensure the correct path

// Temporary console log to verify import
console.log("Imported LabConsultationType:", LabtestType);
console.log("Imported OrganizationTypes:", OrganizationTypes);

interface TestTypeSectionProps {
  orgType: OrganizationTypes.Pharmacy | OrganizationTypes.Laboratory | "";
  testType?: LabtestType | ""; // Update type to use enum
  setTestType: (type: LabtestType) => void; // Update setter to accept enum
  pdfFiles: File[];
  setPdfFiles: (files: File[]) => void;
}

const TestTypeSection: React.FC<TestTypeSectionProps> = ({
  orgType,
  testType,
  setTestType,
  pdfFiles,
  setPdfFiles,
}) => {
  // Define consultation types using the enum
  const testTypes: LabtestType[] = [LabtestType.PreTest, LabtestType.PostTest];

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

  // Render only if orgType is Laboratory
  if (orgType !== OrganizationTypes.Laboratory) {
    return null;
  }

  return (
    <div className="mb-4" dir="rtl">
      {/* Consultation Type Selection */}
      <div>
        <label className="block text-sm text-black font-normal p-2">
          نوع الاستشارة
        </label>
        <div className="bg-white p-4 rounded-lg">
          {testTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setTestType(type)}
              className={`flex items-center justify-between p-2 w-full text-black focus:outline-none rounded-md mb-2 ${
                testType === type
                  ? "bg-custom-green text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`w-4 h-4 rounded-full ml-2 ${
                    testType === type ? "bg-white" : "bg-gray-400"
                  }`}
                />
                <span>
                  {type === LabtestType.PreTest
                    ? "قبل الاختبار"
                    : "بعد الاختبار"}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* PDF Files Upload */}
      {testType === LabtestType.PostTest && (
        <div className="mt-4">
          <label
            htmlFor="pdfFiles"
            className="block text-sm text-black font-normal p-2"
          >
            إضافة ملف
          </label>
          <input
            id="pdfFiles"
            type="file"
            accept="application/pdf"
            multiple
            onChange={handleAddPdf}
            className="w-full border p-2 text-black border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-custom-green focus:border-custom-green file:mr-2 file:py-1 file:px-4 file:border-0 file:bg-custom-green file:text-white file:rounded-md file:cursor-pointer"
          />
          {pdfFiles.length > 0 && (
            <div className="mt-4 p-4">
              {pdfFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center text-black text-xs justify-between mb-1"
                >
                  <span>{file.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemovePdf(index)}
                    className="text-red-400 hover:text-red-600"
                  >
                    إزالة
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TestTypeSection;
