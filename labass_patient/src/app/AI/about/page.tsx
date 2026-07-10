"use client";

import React, { useState, useEffect } from "react";
import { LanguageProvider, useLanguage } from "../context/LanguageContext";
import WhatsAppFloat from "../_components/WhatsAppFloat";

const WHATSAPP = "https://wa.me/966505117551";

/* ─── Shared Navbar (self-contained for this route) ─── */
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { lang, toggle, isAr } = useLanguage();
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100" : "bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="/AI" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#4DA514] rounded-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className={`font-bold text-gray-900 text-lg ${isAr ? "font-cairo" : ""}`}>
            LaBas <span className="text-[#4DA514]">AI</span>
          </span>
        </a>
        <div className="flex items-center gap-3">
          <a href="/AI" className={`text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium hidden md:block ${isAr ? "font-cairo" : ""}`}>
            {isAr ? "الرئيسية" : "Home"}
          </a>
          <button onClick={toggle} className="text-xs font-bold text-gray-400 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-full transition-all">
            {isAr ? "EN" : "عر"}
          </button>
          <a href="/AI#demo" className={`bg-[#4DA514] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#3d8a10] transition-colors shadow-md shadow-[#4DA514]/20 ${isAr ? "font-cairo" : ""}`}>
            {isAr ? "احجز عرضاً" : "Book a Demo"}
          </a>
        </div>
      </div>
    </nav>
  );
};

/* ─── Arc Diagram (Sully-style) ─── */
const ArcDiagram = () => {
  const { isAr } = useLanguage();

  const W = 760, H = 400;
  const cx = W / 2, cy = H - 40;

  const levels = isAr ? [
    { r: 70,  num: "01", label: "وكلاء مستقلون لعمليات العيادة" },
    { r: 155, num: "02", label: "التوثيق الطبي والملاحظات السريرية" },
    { r: 240, num: "03", label: "الفرز وقرارات الدعم الطبي" },
    { r: 325, num: "04", label: "تحليلات ومتابعة مستقلة بالكامل" },
  ] : [
    { r: 70,  num: "01", label: "Autonomous agents for clinic operations" },
    { r: 155, num: "02", label: "AI documentation & clinical notes" },
    { r: 240, num: "03", label: "AI triage & clinical decision support" },
    { r: 325, num: "04", label: "Fully autonomous follow-up & analytics" },
  ];

  return (
    <div className="w-full bg-[#f7f5f0] rounded-2xl overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Baseline */}
        <line x1="20" y1={cy} x2={W - 20} y2={cy} stroke="#d6d3ca" strokeWidth="1" />

        {levels.map((lv, i) => {
          const apexY = cy - lv.r;
          const leftX = cx - lv.r;
          const rightX = cx + lv.r;

          return (
            <g key={i}>
              {/* Arc */}
              <path
                d={`M ${leftX} ${cy} A ${lv.r} ${lv.r} 0 0 1 ${rightX} ${cy}`}
                fill="none"
                stroke="#c8c4bb"
                strokeWidth="1"
              />

              {/* Apex dot */}
              <circle cx={cx} cy={apexY} r="5" fill="#1a1a1a" />

              {/* Label to the right of apex */}
              <g>
                <text
                  x={cx + 14}
                  y={apexY - 6}
                  fontSize="10"
                  fontWeight="600"
                  fill="#555"
                  fontFamily="system-ui, sans-serif"
                >
                  {isAr ? `المستوى ${lv.num}` : `Level ${lv.num}`}
                </text>
                <text
                  x={cx + 14}
                  y={apexY + 8}
                  fontSize="9"
                  fill="#888"
                  fontFamily="system-ui, sans-serif"
                >
                  {lv.label}
                </text>
              </g>
            </g>
          );
        })}

        {/* Hospital center */}
        <circle cx={cx} cy={cy} r="6" fill="#1a1a1a" />
        <text
          x={cx}
          y={cy + 20}
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          fill="#1a1a1a"
          fontFamily="system-ui, sans-serif"
        >
          {isAr ? "المستشفى / العيادة" : "Hospital"}
        </text>
      </svg>
    </div>
  );
};

/* ─── Partner Logos strip ─── */
const logos = [
  { name: "MOH", sub: "Ministry of Health" },
  { name: "SFDA", sub: "Saudi FDA" },
  { name: "NCA", sub: "Cybersecurity" },
  { name: "CCHI", sub: "Council of Health" },
  { name: "CBAHI", sub: "Accreditation" },
];

const LogosStrip = () => {
  const { isAr } = useLanguage();
  return (
    <div className="border-y border-gray-100 py-6 bg-white">
      <p className={`text-center text-xs text-gray-400 font-medium mb-5 uppercase tracking-widest ${isAr ? "font-cairo" : ""}`}>
        {isAr ? "متوافق ومعتمد مع" : "Aligned & compliant with"}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-8">
        {logos.map((l) => (
          <div key={l.name} className="flex flex-col items-center gap-1">
            <div className="h-10 px-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center min-w-[80px]">
              <span className="text-gray-500 font-black text-sm tracking-tight">{l.name}</span>
            </div>
            <span className="text-gray-400 text-[10px]">{l.sub}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── "Building the future" section ─── */
const BuildingSection = () => {
  const { isAr } = useLanguage();
  const content = {
    en: {
      heading: "We are building the future of healthcare",
      items: [
        "AI documentation that gives hours back to doctors every day",
        "Intake and scheduling that works in Arabic and English",
        "Decision support that is accurate and auditable",
        "Post-visit workflows that just run — without anyone chasing them",
      ],
    },
    ar: {
      heading: "نبني مستقبل الرعاية الصحية",
      items: [
        "توثيق بالذكاء الاصطناعي يُعيد ساعات لأطباء كل يوم",
        "استقبال ومواعيد يعمل بالعربية والإنجليزية",
        "دعم قرارات دقيق وقابل للمراجعة",
        "سير عمل ما بعد الزيارة يعمل تلقائياً — دون أن يلاحقه أحد",
      ],
    },
  };
  const tx = isAr ? content.ar : content.en;

  return (
    <section className="py-24 bg-gray-950">
      <div className="max-w-4xl mx-auto px-6">
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-16 items-center ${isAr ? "md:flex-row-reverse" : ""}`}>
          <div className={isAr ? "text-right" : ""}>
            <h2 className={`text-3xl md:text-4xl font-black text-white leading-tight mb-10 ${isAr ? "font-cairo" : ""}`}>
              {tx.heading}
            </h2>
            <ul className="space-y-5">
              {tx.items.map((item, i) => (
                <li key={i} className={`flex items-start gap-4 ${isAr ? "flex-row-reverse" : ""}`}>
                  <div className="w-5 h-5 rounded-full bg-[#4DA514]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#4DA514]" />
                  </div>
                  <span className={`text-gray-300 text-base leading-relaxed ${isAr ? "font-cairo" : ""}`}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Visual: animated pulse rings */}
          <div className="flex items-center justify-center">
            <div className="relative w-64 h-64">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="absolute inset-0 rounded-full border border-[#4DA514]/20 animate-ping"
                  style={{ animationDelay: `${i * 0.4}s`, animationDuration: "2.5s", transform: `scale(${0.4 + i * 0.2})` }}
                />
              ))}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-[#4DA514]/10 rounded-full flex items-center justify-center border border-[#4DA514]/30">
                  <div className="w-14 h-14 bg-[#4DA514] rounded-full flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


/* ─── Footer ─── */
const Footer = () => {
  const { isAr } = useLanguage();
  return (
    <footer className="bg-gray-950 border-t border-gray-900 py-10">
      <div className={`max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 ${isAr ? "sm:flex-row-reverse" : ""}`}>
        <div className={`flex items-center gap-2 ${isAr ? "flex-row-reverse" : ""}`}>
          <div className="w-7 h-7 bg-[#4DA514] rounded-lg flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className={`font-bold text-white text-sm ${isAr ? "font-cairo" : ""}`}>
            LaBas <span className="text-[#4DA514]">AI</span>
          </span>
        </div>
        <div className="flex items-center gap-5 text-gray-700 text-xs">
          <a href="/AI" className="hover:text-gray-500 transition-colors">{isAr ? "الرئيسية" : "Home"}</a>
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="hover:text-gray-500 transition-colors">{isAr ? "واتساب" : "WhatsApp"}</a>
          <span className={`text-gray-700 ${isAr ? "font-cairo" : ""}`}>© 2025 LaBas</span>
        </div>
      </div>
    </footer>
  );
};

/* ─── Main Page ─── */
function AboutContent() {
  const { isAr } = useLanguage();

  return (
    <div className={`bg-white ${isAr ? "font-cairo" : "font-sans"}`} dir={isAr ? "rtl" : "ltr"} lang={isAr ? "ar" : "en"}>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-6 bg-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#4DA514]/5 rounded-full blur-[120px]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className={`inline-block bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1 rounded-full mb-6 uppercase tracking-widest ${isAr ? "font-cairo" : ""}`}>
            {isAr ? "من نحن" : "About Us"}
          </div>
          <h1 className={`text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6 ${isAr ? "font-cairo" : ""}`}>
            {isAr ? (
              <>نبني أفضل فريق<br /><span className="text-[#4DA514]">إنسان + ذكاء اصطناعي</span><br />في الرعاية الصحية</>
            ) : (
              <>We&apos;re building healthcare&apos;s best<br /><span className="text-[#4DA514]">human + AI team</span></>
            )}
          </h1>
          <p className={`text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed ${isAr ? "font-cairo" : ""}`}>
            {isAr
              ? "فريق من المبنيين والأطباء، نصمم ذكاءً اصطناعياً طبياً يأخذ الملاحظات ويكتب التقارير ويتابع المرضى بصمت — حتى يُرى الناس بشكل أسرع ويستعيد الأطباء وقتهم"
              : "A tight team of clinicians and builders, we design medical AI that quietly takes notes, books visits, and closes loops — so people get seen faster and clinicians get their time back"}
          </p>
        </div>
      </section>

      {/* Arc Diagram */}
      <section className="pb-10 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <ArcDiagram />
          <p className={`text-center text-xs text-gray-400 mt-2 ${isAr ? "font-cairo" : ""}`}>
            {isAr ? "طبقات منصة لاباس AI حول عيادتك" : "LaBas AI platform layers around your clinic"}
          </p>
        </div>
      </section>

      {/* Partner / compliance logos */}
      <LogosStrip />

      {/* Building the future */}
      <BuildingSection />

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

export default function AboutPage() {
  return (
    <LanguageProvider>
      <AboutContent />
    </LanguageProvider>
  );
}
