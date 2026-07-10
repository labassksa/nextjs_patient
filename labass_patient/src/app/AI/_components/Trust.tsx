"use client";

import React from "react";
import { useLanguage } from "../context/LanguageContext";

const t = {
  en: {
    badge: "Security & Trust",
    heading: "Built on trust",
    sub: "LaBas AI is designed to meet the highest standards of security, privacy, and compliance — so healthcare organizations can deploy with confidence",
    pillars: [
      {
        icon: (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
        title: "Multi-layered protection",
        desc: "Defense in depth across every layer of the stack. Data encrypted at rest with AES-256 and in transit with TLS 1.3. Access controlled by zero-trust architecture with MFA enforced across all systems",
      },
      {
        icon: (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
            <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
        title: "Built-in data autonomy",
        desc: "Your patient data is yours. LaBas AI operates as a HIPAA Business Associate, executing BAAs with every covered entity. PHI is never shared, sold, or used for model improvement without explicit consent",
      },
      {
        icon: (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
            <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
        title: "Healthcare-ready infrastructure",
        desc: "Deployed on HIPAA-eligible cloud infrastructure with network isolation, WAF protection, and real-time threat monitoring. Designed for the reliability and compliance healthcare demands",
      },
    ],
    certifications: [
      {
        abbr: "HIPAA",
        label: "HIPAA Compliant",
        desc: "We operate as a HIPAA Business Associate, executing BAAs with all covered entity customers",
      },
      {
        abbr: "ISO",
        label: "ISO 27001:2022",
        desc: "Information Security Management certified to the latest ISO 27001 standard at enterprise scale",
      },
      {
        abbr: "SOC 2",
        label: "SOC 2 Type II",
        desc: "Annual independent audits validating our security, availability, and confidentiality controls",
      },
      {
        abbr: "NCA",
        label: "NCA Compliant",
        desc: "Aligned with the National Cybersecurity Authority framework for data protection in KSA",
      },
    ],
  },
  ar: {
    badge: "الأمان والثقة",
    heading: "مبني على الثقة",
    sub: "لاباس AI مصمم وفق أعلى معايير الأمان والخصوصية والامتثال — حتى تتمكن المنشآت الصحية من النشر بثقة تامة",
    pillars: [
      {
        icon: (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
        title: "حماية متعددة الطبقات",
        desc: "دفاع متعمق عبر كل طبقة في النظام. بيانات مشفرة في حالة السكون بمعيار AES-256 وأثناء النقل بـ TLS 1.3. وصول محكوم ببنية Zero-Trust مع MFA مُطبَّق على جميع الأنظمة",
      },
      {
        icon: (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
            <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
        title: "استقلالية البيانات المدمجة",
        desc: "بيانات مرضاك ملكك وحدك. لاباس AI يعمل كشريك أعمال HIPAA ويُبرم اتفاقيات BAA مع كل جهة مشمولة. لا تُشارك معلومات المرضى أو تُباع أو تُستخدم لتدريب النماذج دون موافقة صريحة",
      },
      {
        icon: (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
            <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
        title: "بنية تحتية جاهزة للرعاية الصحية",
        desc: "منشور على بنية سحابية مؤهلة لـ HIPAA مع عزل الشبكة وحماية WAF ومراقبة التهديدات في الوقت الفعلي. مصمم للموثوقية والامتثال الذي تتطلبه الرعاية الصحية",
      },
    ],
    certifications: [
      {
        abbr: "HIPAA",
        label: "متوافق مع HIPAA",
        desc: "نعمل كشريك أعمال HIPAA ونبرم اتفاقيات BAA مع جميع الجهات المشمولة",
      },
      {
        abbr: "ISO",
        label: "ISO 27001:2022",
        desc: "معتمد بأحدث معيار ISO 27001 لإدارة أمن المعلومات على نطاق المؤسسات",
      },
      {
        abbr: "SOC 2",
        label: "SOC 2 النوع الثاني",
        desc: "تدقيقات مستقلة سنوية تُثبت ضوابط الأمان والتوافر والسرية",
      },
      {
        abbr: "NCA",
        label: "متوافق مع NCA",
        desc: "متوافق مع إطار الهيئة الوطنية للأمن السيبراني لحماية البيانات في المملكة",
      },
    ],
  },
};

const Trust: React.FC = () => {
  const { lang, isAr } = useLanguage();
  const tx = t[lang];

  return (
    <section id="trust" className="py-24 bg-gray-950">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className={`text-center mb-16 ${isAr ? "font-cairo" : ""}`}>
          <div className="inline-block bg-[#4DA514]/10 text-[#4DA514] text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
            {tx.badge}
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            {tx.heading}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-base leading-relaxed">
            {tx.sub}
          </p>
        </div>

        {/* 3 pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {tx.pillars.map((p, i) => (
            <div
              key={i}
              className={`bg-gray-900 border border-gray-800 rounded-2xl p-7 ${isAr ? "text-right" : ""}`}
            >
              <div className={`w-10 h-10 bg-[#4DA514]/10 text-[#4DA514] rounded-xl flex items-center justify-center mb-5 ${isAr ? "mr-auto" : ""}`}>
                {p.icon}
              </div>
              <h3 className={`text-white font-bold text-base mb-3 leading-snug ${isAr ? "font-cairo" : ""}`}>
                {p.title}
              </h3>
              <p className={`text-gray-400 text-sm leading-relaxed ${isAr ? "font-cairo" : ""}`}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Certification badges row — mimicking Sully's compliance row */}
        <div className="border border-gray-800 rounded-2xl overflow-hidden">
          {/* Top label */}
          <div className="bg-gray-900 px-7 py-4 border-b border-gray-800">
            <p className={`text-xs font-bold text-gray-500 uppercase tracking-widest ${isAr ? "font-cairo text-right" : ""}`}>
              {isAr ? "الامتثال في كل طبقة" : "Compliance at every layer"}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-800">
            {tx.certifications.map((cert, i) => (
              <div
                key={i}
                className={`bg-gray-900 hover:bg-gray-800/60 transition-colors duration-200 p-7 flex flex-col gap-4 ${isAr ? "items-end text-right" : ""}`}
              >
                {/* Badge icon */}
                <div className={`flex items-center gap-3 ${isAr ? "flex-row-reverse" : ""}`}>
                  <div className="w-12 h-12 rounded-xl border border-gray-700 bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-black text-xs tracking-tight text-center leading-tight px-1">
                      {cert.abbr}
                    </span>
                  </div>
                  <div>
                    <div className={`w-2 h-2 rounded-full bg-[#4DA514] mb-1 ${isAr ? "mr-auto" : ""}`} />
                    <span className="text-[10px] text-[#4DA514] font-bold uppercase tracking-widest">
                      {isAr ? "معتمد" : "Certified"}
                    </span>
                  </div>
                </div>
                <div>
                  <p className={`text-white font-bold text-sm mb-1.5 ${isAr ? "font-cairo" : ""}`}>
                    {cert.label}
                  </p>
                  <p className={`text-gray-500 text-xs leading-relaxed ${isAr ? "font-cairo" : ""}`}>
                    {cert.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>


      </div>
    </section>
  );
};

export default Trust;
