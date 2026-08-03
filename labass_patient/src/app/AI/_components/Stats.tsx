"use client";

import React from "react";
import { useLanguage } from "../context/LanguageContext";

const t = {
  en: [
    { number: "40%", label: "Less admin time" },
    { number: "3×", label: "Faster documentation" },
    { number: "30", label: "Days to see results" },
    { number: "1000+", label: "Facilities served" },
  ],
  ar: [
    { number: "40%", label: "أقل وقتاً في الأعمال الإدارية" },
    { number: "3×", label: "توثيق أسرع" },
    { number: "30", label: "يوماً لرؤية النتائج" },
    { number: "+1000", label: "منشأة خدّمناها" },
  ],
};

const Stats: React.FC = () => {
  const { lang, isAr } = useLanguage();
  const stats = t[lang];

  return (
    <section id="stats" className="py-20 bg-white border-y border-gray-100">
      <div className="max-w-4xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="text-4xl md:text-5xl font-black text-[#4DA514] mb-2">{s.number}</div>
              <div className={`text-gray-400 font-medium text-sm ${isAr ? "font-cairo" : ""}`}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
