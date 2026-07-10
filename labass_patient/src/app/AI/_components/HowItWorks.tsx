"use client";

import React from "react";
import { useLanguage } from "../context/LanguageContext";

const stepIcons = [
  /* 01 — phone/call */
  <svg key="0" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#4DA514" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>,
  /* 02 — screen/demo */
  <svg key="1" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#4DA514" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
    <path d="M10 8l2 2 4-4" />
  </svg>,
  /* 03 — chart/pilot */
  <svg key="2" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#4DA514" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>,
  /* 04 — rocket/launch */
  <svg key="3" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#4DA514" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>,
];

const t = {
  en: {
    heading: "From intro to live",
    headingSub: " in under 6 weeks",
    steps: [
      { number: "01", title: "Discovery call", desc: "We learn about your workflow, your team, and what's slowing you down", duration: "30 min" },
      { number: "02", title: "Custom demo", desc: "We show you exactly how LaBas AI works for your type of facility — live", duration: "1 week" },
      { number: "03", title: "30-day pilot", desc: "Your team uses it on real cases — you measure the results yourself", duration: "30 days" },
      { number: "04", title: "Full rollout", desc: "We handle everything — training, integration, and ongoing support", duration: "Ongoing" },
    ],
  },
  ar: {
    heading: "من التعارف إلى التشغيل",
    headingSub: " في أقل من 6 أسابيع",
    steps: [
      { number: "01", title: "مكالمة استكشاف", desc: "نتعرف على سير عملك، فريقك، وما يعيقكم", duration: "30 دقيقة" },
      { number: "02", title: "عرض مخصص", desc: "نريك كيف يعمل لاباس AI لنوع منشأتك — مباشرةً", duration: "أسبوع" },
      { number: "03", title: "تجربة 30 يوماً", desc: "يستخدمه فريقك على حالات حقيقية — تقيس النتائج بنفسك", duration: "30 يوماً" },
      { number: "04", title: "الانطلاق الكامل", desc: "نتولى كل شيء — التدريب، التكامل، والدعم المستمر", duration: "مستمر" },
    ],
  },
};

const HowItWorks: React.FC = () => {
  const { lang, isAr } = useLanguage();
  const tx = t[lang];

  return (
    <section id="how-it-works" className="py-24 bg-gray-50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className={`text-3xl md:text-4xl font-black text-gray-900 ${isAr ? "font-cairo" : ""}`}>
            {tx.heading}
            <span className="text-[#4DA514]">{tx.headingSub}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {tx.steps.map((step, i) => (
            <div
              key={i}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#4DA514]/25 transition-all duration-200 h-full group"
            >
              {/* Icon */}
              <div className="w-12 h-12 bg-[#4DA514]/8 group-hover:bg-[#4DA514]/12 rounded-xl flex items-center justify-center mb-5 transition-colors duration-200">
                {stepIcons[i]}
              </div>

              {/* Step number + duration */}
              <div className={`flex items-center gap-2 mb-3 ${isAr ? "flex-row-reverse" : ""}`}>
                <span className="text-[#4DA514] font-black text-xs">{step.number}</span>
                <span className={`bg-[#4DA514]/8 text-[#4DA514] text-xs font-bold px-2.5 py-0.5 rounded-full ${isAr ? "font-cairo" : ""}`}>
                  {step.duration}
                </span>
              </div>

              <h3 className={`font-bold text-gray-900 text-base mb-2 ${isAr ? "font-cairo text-right" : ""}`}>
                {step.title}
              </h3>
              <p className={`text-gray-400 text-sm leading-relaxed ${isAr ? "font-cairo text-right" : ""}`}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
