"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { DoctorType } from "../_types/doctorTypes";

interface DoctorTypeSectionProps {
  doctorType: DoctorType;
  setDoctorType: (type: DoctorType) => void;
}

const DoctorTypeSection: React.FC<DoctorTypeSectionProps> = ({
  doctorType,
  setDoctorType,
}) => {
  const { t } = useTranslation();

  const doctorTypes = [
    { type: DoctorType.General, label: "عام", disabled: false },
    { type: DoctorType.Psychiatrist, label: "نفسي", disabled: true },
    { type: DoctorType.Obesity, label: " سمنة", disabled: true },
  ];

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg p-6 mt-4" dir="rtl">
      <h3 className="text-gray-800 text-lg font-semibold mb-2">تخصص الطبيب</h3>
      <p className="text-gray-600 text-sm mb-4">اختر تخصص الطبيب المناسب للاستشارة</p>
      
      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
        {doctorTypes.map((doc) => (
          <button
            key={doc.type}
            type="button"
            onClick={() => !doc.disabled && setDoctorType(doc.type)}
            disabled={doc.disabled}
            className={`flex items-center justify-between p-3 w-full rounded-md transition-colors ${
              doctorType === doc.type
                ? "bg-custom-green text-white"
                : doc.disabled
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
            aria-pressed={doctorType === doc.type}
          >
            <div className="flex items-center">
              <div
                className={`w-4 h-4 rounded-full ml-2 ${
                  doctorType === doc.type
                    ? "bg-white"
                    : doc.disabled
                    ? "bg-gray-300"
                    : "bg-gray-400"
                }`}
              />
              <span className="text-sm font-medium">{doc.label}</span>
            </div>
            {doc.disabled && (
              <span className="text-xs text-green-600 font-medium">قريباً</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DoctorTypeSection;