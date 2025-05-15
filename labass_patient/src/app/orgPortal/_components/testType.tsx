// src/app/orgPortal/_components/ConsultationTypeSection.tsx

"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { LabtestType } from "../_types/labTestTypes";
import { OrganizationTypes } from "../_types/organizationTypes";

interface TestTypeSectionProps {
  orgType: OrganizationTypes.Pharmacy | OrganizationTypes.Laboratory | "";
  testType?: LabtestType | "";
  setTestType: (type: LabtestType) => void;
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
  const { t } = useTranslation();
  const testTypes: LabtestType[] = [LabtestType.PreTest, LabtestType.PostTest];

  const handleAddPdf = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPdfFiles([...pdfFiles, ...Array.from(e.target.files)]);
    }
  };

  const handleRemovePdf = (index: number) => {
    setPdfFiles(pdfFiles.filter((_, i) => i !== index));
  };

  if (orgType !== OrganizationTypes.Laboratory) {
    return null;
  }

  return (
    <div className="mb-4" dir="rtl">
      <div>
        <label className="block text-lg font-bold text-black p-2">
          {t('testType.title')}
        </label>
        <p className="text-sm text-gray-700 mb-4">{t('testType.subtitle')}</p>
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
                    ? t('testType.preTest')
                    : t('testType.postTest')}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {testType === LabtestType.PostTest && (
        <div className="mt-4">
          <label
            htmlFor="pdfFiles"
            className="block text-sm text-black font-normal p-2"
          >
            {t('testType.addFile')}
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
                    {t('testType.remove')}
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
