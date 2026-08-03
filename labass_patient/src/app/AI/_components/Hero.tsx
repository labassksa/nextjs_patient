"use client";

import React from "react";
import { useLanguage } from "../context/LanguageContext";

const t = {
  en: {
    badge: "Now serving healthcare teams across the region",
    h1pre: "AI agents",
    h1mid: " for",
    h1green: " healthcare teams",
    sub: "Six intelligent agents — always on, never tired. They handle your intake, write your clinical notes, follow up with every patient, and give you real-time visibility into your operations. Your team focuses on medicine. We handle the rest",
    cta1: "Chat with us on WhatsApp",
    cta2: "See how it works",
    trust: ["Clinics", "Hospitals", "Pharmacies", "Labs", "School Health"],
  },
  ar: {
    badge: "نخدم الآن فرق الرعاية الصحية في المنطقة",
    h1pre: "وكلاء ذكاء اصطناعي",
    h1mid: " لـ",
    h1green: "فرق الرعاية الصحية",
    sub: "ستة وكلاء أذكياء — دائمو العمل، لا يتعبون. يتولون استقبال مرضاك، كتابة الملاحظات الطبية، المتابعة مع كل مريض، ويمنحونك رؤية لحظية لعمليات عيادتك. فريقك يركز على الطب. نحن نتولى الباقي",
    cta1: "تحدّث معنا على واتساب",
    cta2: "اكتشف كيف يعمل",
    trust: ["العيادات", "المستشفيات", "الصيدليات", "المختبرات", "الصحة المدرسية"],
  },
};

const Hero: React.FC = () => {
  const { lang, isAr } = useLanguage();
  const tx = t[lang];

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden pt-20">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#4DA514]/5 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Headline */}
        <h1
          className={`font-black text-gray-900 leading-[1.1] mb-7 tracking-tight ${isAr ? "font-cairo text-4xl md:text-5xl lg:text-6xl" : "text-5xl md:text-6xl lg:text-7xl"}`}
        >
          {tx.h1pre}
          {tx.h1mid}
          <br />
          <span className="text-[#4DA514]">{tx.h1green}</span>
        </h1>

        {/* Sub */}
        <p
          className={`text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium ${isAr ? "font-cairo text-base" : "text-lg"}`}
        >
          {tx.sub}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="https://wa.me/966505117551"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center gap-2.5 w-full sm:w-auto bg-[#4DA514] text-white font-bold py-4 px-10 rounded-full text-sm shadow-xl shadow-[#4DA514]/20 hover:bg-[#3d8a10] hover:-translate-y-0.5 transition-all duration-200 ${isAr ? "font-cairo flex-row-reverse" : ""}`}
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {tx.cta1}
          </a>
          <button
            onClick={() =>
              document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })
            }
            className={`w-full sm:w-auto text-gray-500 font-medium py-4 px-10 rounded-full text-sm border border-gray-200 hover:border-gray-300 hover:text-gray-900 transition-all duration-200 ${isAr ? "font-cairo" : ""}`}
          >
            {tx.cta2}
          </button>
        </div>

      </div>
    </section>
  );
};

export default Hero;
