"use client";

import React from "react";
import { useLanguage } from "../context/LanguageContext";

const S = { stroke: "#4DA514", strokeWidth: "1.7", strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };

const featureIcons = [
  /* clipboard / intake */
  <svg key="0" viewBox="0 0 24 24" className="w-5 h-5" {...S}>
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <path d="M9 12h6M9 16h4" />
  </svg>,
  /* microphone / documentation */
  <svg key="1" viewBox="0 0 24 24" className="w-5 h-5" {...S}>
    <rect x="9" y="2" width="6" height="11" rx="3" />
    <path d="M5 10a7 7 0 0014 0" />
    <path d="M12 19v3M8 22h8" />
  </svg>,
  /* chat bubble / follow-up */
  <svg key="2" viewBox="0 0 24 24" className="w-5 h-5" {...S}>
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    <path d="M8 10h.01M12 10h.01M16 10h.01" strokeWidth="2.2" />
  </svg>,
  /* bar chart / dashboard */
  <svg key="3" viewBox="0 0 24 24" className="w-5 h-5" {...S}>
    <path d="M18 20V10M12 20V4M6 20v-6" />
    <path d="M2 20h20" />
  </svg>,
  /* shield / secure */
  <svg key="4" viewBox="0 0 24 24" className="w-5 h-5" {...S}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>,
  /* bolt / fast setup */
  <svg key="5" viewBox="0 0 24 24" className="w-5 h-5" {...S}>
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>,
];

const t = {
  en: {
    heading: "Everything in one place",
    sub: "A focused set of AI tools — nothing you don't need, everything you do",
    items: [
      { title: "Patient Intake", desc: "Patients fill forms before the visit — AI organizes everything and sends it to the right person", tag: "Saves 15 min per visit" },
      { title: "Auto Documentation", desc: "AI listens to consultations and writes the notes — doctors review in seconds, not minutes", tag: "Arabic & English" },
      { title: "Smart Follow-up", desc: "Reminders, check-ins, and satisfaction messages sent automatically to every patient", tag: "3× higher follow-up rate" },
      { title: "Operations Dashboard", desc: "See your clinic's performance in real time — no-shows, wait times, and revenue in one place", tag: "Live updates" },
      { title: "Secure by Default", desc: "Built to meet local health data regulations — your patient data never leaves the region", tag: "Fully compliant" },
      { title: "Fast Setup", desc: "Connects to your existing system in days — no long IT projects or complex migrations", tag: "Live in 7 days" },
    ],
  },
  ar: {
    heading: "كل شيء في مكان واحد",
    sub: "مجموعة مركّزة من أدوات الذكاء الاصطناعي — لا شيء زائد، وكل ما تحتاجه موجود",
    items: [
      { title: "استقبال المرضى", desc: "يملأ المرضى نماذجهم قبل الزيارة — يقوم الذكاء الاصطناعي بتنظيم كل شيء وإرساله للشخص المناسب", tag: "يوفّر 15 دقيقة لكل زيارة" },
      { title: "التوثيق التلقائي", desc: "يستمع الذكاء الاصطناعي إلى الاستشارات ويكتب الملاحظات — يراجعها الأطباء في ثوانٍ لا دقائق", tag: "عربي وإنجليزي" },
      { title: "المتابعة الذكية", desc: "تُرسل التذكيرات والمتابعات ورسائل قياس الرضا تلقائياً لكل مريض", tag: "معدل متابعة أعلى 3 أضعاف" },
      { title: "لوحة العمليات", desc: "اطّلع على أداء عيادتك في الوقت الفعلي — الغيابات وأوقات الانتظار والإيرادات في مكان واحد", tag: "تحديثات لحظية" },
      { title: "الأمان افتراضياً", desc: "مبني ليلتزم بأنظمة بيانات الصحة المحلية — بيانات مرضاك لا تغادر المنطقة", tag: "متوافق بالكامل" },
      { title: "إعداد سريع", desc: "يتصل بنظامك الحالي خلال أيام — لا مشاريع IT طويلة أو هجرات معقدة", tag: "تشغيل في 7 أيام" },
    ],
  },
};

const Features: React.FC = () => {
  const { lang, isAr } = useLanguage();
  const tx = t[lang];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className={`text-3xl md:text-4xl font-black text-gray-900 ${isAr ? "font-cairo" : ""}`}>
            {tx.heading}
          </h2>
          <p className={`text-gray-400 mt-3 max-w-md mx-auto text-base font-medium ${isAr ? "font-cairo" : ""}`}>
            {tx.sub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tx.items.map((f, i) => (
            <div
              key={i}
              className="group bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:border-[#4DA514]/30 hover:bg-white hover:shadow-lg hover:shadow-[#4DA514]/5 transition-all duration-300"
            >
              <div className="w-10 h-10 bg-[#4DA514]/8 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#4DA514]/12 transition-colors duration-200">
                {featureIcons[i]}
              </div>
              <h3 className={`font-bold text-gray-900 text-base mb-2 ${isAr ? "font-cairo text-right" : ""}`}>{f.title}</h3>
              <p className={`text-gray-400 text-sm leading-relaxed mb-4 ${isAr ? "font-cairo text-right" : ""}`}>{f.desc}</p>
              <div className={`${isAr ? "text-right" : ""}`}>
                <span className={`inline-block bg-[#4DA514]/8 text-[#4DA514] text-xs font-semibold px-3 py-1 rounded-full ${isAr ? "font-cairo" : ""}`}>
                  {f.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
