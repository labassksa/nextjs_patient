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
    { type: DoctorType.General, label: "عام", disabled: false, note: null, badge: null },
    { type: DoctorType.Obesity, label: "سمنة", disabled: true, note: null, badge: "قريباً" },
    {
      type: DoctorType.SickLeave,
      label: "عام (تشمل اجازة مرضية)",
      disabled: false,
      note: "سيتم إرسال رابط دفع 89 ريال للمريض",
      badge: "نشطة الان",
    },
  ];

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg p-6 mt-4" dir="rtl">
      <h3 className="text-gray-800 text-lg font-semibold mb-2">نوع الاستشارة</h3>
      <p className="text-gray-600 text-sm mb-4">اختر نوع الاستشارة المناسب</p>

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
            {/* Right side: radio + label + note */}
            <div className="flex items-center">
              <div
                className={`w-4 h-4 rounded-full ml-2 flex-shrink-0 ${
                  doctorType === doc.type
                    ? "bg-white"
                    : doc.disabled
                    ? "bg-gray-300"
                    : "bg-gray-400"
                }`}
              />
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{doc.label}</span>
                {doc.note && (
                  <span
                    className={`text-xs font-bold mt-0.5 ${
                      doctorType === doc.type ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {doc.note}
                  </span>
                )}
              </div>
            </div>

            {/* Left side: badge */}
            {doc.badge && (
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  doc.disabled
                    ? "bg-gray-300 text-gray-500"
                    : doctorType === doc.type
                    ? "bg-white text-custom-green"
                    : "bg-green-100 text-custom-green"
                }`}
              >
                {doc.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DoctorTypeSection;
