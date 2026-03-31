"use client";

import React from "react";
import { DoctorType } from "../_types/doctorTypes";

interface DoctorTypeSectionProps {
  doctorType: DoctorType;
  setDoctorType: (type: DoctorType) => void;
}

const DoctorTypeSection: React.FC<DoctorTypeSectionProps> = ({
  doctorType,
  setDoctorType,
}) => {
  const doctorTypes = [
    { type: DoctorType.General, label: "عام", disabled: false, note: null },
    { type: DoctorType.Obesity, label: "سمنة", disabled: false, note: null },
    {
      type: DoctorType.SickLeave,
      label: "عام (إجازة مرضية)",
      disabled: false,
      note: "سيتم إرسال رابط دفع 89 ريال للمريض",
    },
  ];

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg p-6 mt-4" dir="rtl">
      <h3 className="text-gray-800 text-lg font-semibold mb-2">نوع الاستشارة</h3>
      <p className="text-gray-600 text-sm mb-4">اختر نوع الاستشارة المناسب</p>

      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
        {doctorTypes.map((doc) => (
          <div key={doc.type}>
            <button
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
            </button>
            {doc.note && doctorType === doc.type && (
              <p className="text-xs text-gray-500 mt-1 pr-3">{doc.note}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorTypeSection;
