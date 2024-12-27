"use client";

import React from "react";
import { OrganizationTypes } from "../_types/organizationTypes"; // Ensure the correct path

interface ConsultationTypeSectionProps {
  orgType: "pharmacy" | "laboratory" | "";
  testType: string;
  setTestType: (type: string) => void;
  pdfFiles: File[];
  setPdfFiles: (files: File[]) => void;
}

const ConsultationTypeSection: React.FC<ConsultationTypeSectionProps> = ({
  orgType,
  testType,
  setTestType,
  pdfFiles,
  setPdfFiles,
}) => {
  const testTypes = ["استشارة قبل التحليل", "استشارة بعد التحليل"];

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
      <div dir="rtl">
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
                <span>{type}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* PDF Files Upload */}
      {testType === "استشارة بعد التحليل" && (
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
            className="w-full border text-black border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-custom-green focus:border-custom-green file:mr-2 file:py-1 file:px-4 file:border-0 file:bg-custom-green file:text-white file:rounded-md file:cursor-pointer"
          />
          {pdfFiles.length > 0 && (
            <div className="mt-2">
              {pdfFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between mb-1"
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

export default ConsultationTypeSection;
