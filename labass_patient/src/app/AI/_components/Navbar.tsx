"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";

/* ── icon helpers ── */
const Circle = ({ color, children }: { color: string; children: React.ReactNode }) => (
  <div
    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
    style={{ background: color }}
  >
    {children}
  </div>
);

/* ── product data ── */
const agentProducts = {
  en: [
    {
      title: "AI Triage Nurse",
      desc: "Handles referrals, labs, and follow-ups.",
      color: "linear-gradient(135deg,#b8f5a0,#4DA514)",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
    },
    {
      title: "AI Receptionist",
      desc: "24/7 scheduling, intake, and reminders.",
      color: "linear-gradient(135deg,#a0c4ff,#3b82f6)",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.5 12 19.79 19.79 0 0 1 1.15 3.38 2 2 0 0 1 3.12 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 5.99 5.99l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
    },
    {
      title: "AI Consultant",
      desc: "Clear, evidence-based answers during visits.",
      color: "linear-gradient(135deg,#c4b5fd,#8b5cf6)",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
      ),
    },
    {
      title: "AI Scribe",
      desc: "Transcribes consultations into structured clinical notes.",
      color: "linear-gradient(135deg,#fca5a5,#ef4444)",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      ),
    },
    {
      title: "AI Pharmacist",
      desc: "Medication checks, refills, and safety alerts.",
      color: "linear-gradient(135deg,#6ee7b7,#10b981)",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
        </svg>
      ),
    },
    {
      title: "AI Medical Coder",
      desc: "Accurate ICD-10/CPT, audit-ready notes and HCC coding.",
      color: "linear-gradient(135deg,#fcd34d,#f59e0b)",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ),
    },
  ],
  ar: [
    {
      title: "ممرضة الفرز الذكية",
      desc: "تتعامل مع الإحالات والمختبرات والمتابعة.",
      color: "linear-gradient(135deg,#b8f5a0,#4DA514)",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
    },
    {
      title: "موظف الاستقبال الذكي",
      desc: "جدولة على مدار الساعة، استقبال، وتذكيرات.",
      color: "linear-gradient(135deg,#a0c4ff,#3b82f6)",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.5 12 19.79 19.79 0 0 1 1.15 3.38 2 2 0 0 1 3.12 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 5.99 5.99l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
    },
    {
      title: "المستشار الطبي الذكي",
      desc: "إجابات واضحة مبنية على الأدلة خلال الزيارات.",
      color: "linear-gradient(135deg,#c4b5fd,#8b5cf6)",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
      ),
    },
    {
      title: "الكاتب الطبي الذكي",
      desc: "يحوّل الاستشارات إلى ملاحظات سريرية منظمة.",
      color: "linear-gradient(135deg,#fca5a5,#ef4444)",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      ),
    },
    {
      title: "الصيدلاني الذكي",
      desc: "فحص الأدوية والتجديدات وتنبيهات السلامة.",
      color: "linear-gradient(135deg,#6ee7b7,#10b981)",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
        </svg>
      ),
    },
    {
      title: "المُرمِّز الطبي الذكي",
      desc: "ترميز ICD-10/CPT دقيق وملاحظات جاهزة للتدقيق.",
      color: "linear-gradient(135deg,#fcd34d,#f59e0b)",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ),
    },
  ],
};

const platformProducts = {
  en: [
    {
      title: "EHR Bridge",
      desc: "One integration that powers every agent.",
      color: "#f3f4f6",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <path d="M14 17h7M17 14v7" />
        </svg>
      ),
    },
    {
      title: "Consensus",
      desc: "Expert models agree for safer answers.",
      color: "#f3f4f6",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      title: "ROI Calculator",
      desc: "Estimate annual savings and payback.",
      color: "#f3f4f6",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
  ],
  ar: [
    {
      title: "جسر السجلات الطبية",
      desc: "تكامل واحد يُشغّل كل وكيل ذكي.",
      color: "#f3f4f6",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <path d="M14 17h7M17 14v7" />
        </svg>
      ),
    },
    {
      title: "التوافق",
      desc: "نماذج خبراء تتفق لإجابات أكثر أماناً.",
      color: "#f3f4f6",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      title: "حاسبة العائد",
      desc: "قدّر المدخرات السنوية وفترة الاسترداد.",
      color: "#f3f4f6",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
  ],
};

const t = {
  en: {
    howItWorks: "How It Works",
    products: "Products",
    trust: "Security",
    docs: "Docs",
    about: "About",
    cta: "Contact Us",
    aiAgent: "AI AGENT",
    platform: "PLATFORM",
    featuredLabel: "How LaBas AI protects your data",
  },
  ar: {
    howItWorks: "كيف يعمل",
    products: "المنتجات",
    trust: "الأمان",
    docs: "التوثيق",
    about: "من نحن",
    cta: "تواصل معنا",
    aiAgent: "وكلاء الذكاء الاصطناعي",
    platform: "المنصة",
    featuredLabel: "كيف تحمي LaBas AI بياناتك",
  },
};

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileFeaturesOpen, setMobileFeaturesOpen] = useState(false);
  const { lang, toggle, isAr } = useLanguage();
  const tx = t[lang];
  const agents = agentProducts[lang];
  const platform = platformProducts[lang];
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
    setDropdownOpen(false);
  };

  const openMenu = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDropdownOpen(true);
  };
  const closeMenu = () => {
    timeoutRef.current = setTimeout(() => setDropdownOpen(false), 150);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || mobileOpen
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#4DA514] rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className={`font-bold text-gray-900 text-lg tracking-tight ${isAr ? "font-cairo" : ""}`}>
              LaBas <span className="text-[#4DA514]">AI</span>
            </span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-500 font-medium">
            <button onClick={() => scrollTo("how-it-works")} className={`hover:text-gray-900 transition-colors ${isAr ? "font-cairo" : ""}`}>
              {tx.howItWorks}
            </button>

            {/* Products dropdown */}
            <div className="relative" onMouseEnter={openMenu} onMouseLeave={closeMenu}>
              <button
                className={`flex items-center gap-1 hover:text-gray-900 transition-colors ${isAr ? "font-cairo" : ""}`}
                onClick={() => scrollTo("features")}
              >
                {tx.products}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {dropdownOpen && (
                <div
                  className="absolute top-full mt-3 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6"
                  style={{
                    width: "720px",
                    left: "50%",
                    transform: `translateX(${isAr ? "-20%" : "-50%"})`,
                  }}
                  onMouseEnter={openMenu}
                  onMouseLeave={closeMenu}
                >
                  <div className={`flex gap-5 ${isAr ? "flex-row-reverse" : ""}`}>
                    {/* Left: agents + platform */}
                    <div className="flex-1 min-w-0">
                      {/* AI AGENT */}
                      <p className={`text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3 ${isAr ? "font-cairo text-right" : ""}`}>
                        {tx.aiAgent}
                      </p>
                      <div className="grid grid-cols-3 gap-1 mb-5">
                        {agents.map((item) => (
                          <button
                            key={item.title}
                            onClick={() => scrollTo("features")}
                            className={`flex items-start gap-2.5 p-3 rounded-xl hover:bg-gray-50 transition-colors group w-full ${isAr ? "flex-row-reverse text-right" : "text-left"}`}
                          >
                            <Circle color={item.color}>{item.icon}</Circle>
                            <div className="min-w-0">
                              <p className={`text-sm font-semibold text-gray-800 leading-tight ${isAr ? "font-cairo" : ""}`}>{item.title}</p>
                              <p className={`text-xs text-gray-400 mt-0.5 leading-snug ${isAr ? "font-cairo" : ""}`}>{item.desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Divider */}
                      <div className="border-t border-gray-100 mb-4" />

                      {/* PLATFORM */}
                      <p className={`text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3 ${isAr ? "font-cairo text-right" : ""}`}>
                        {tx.platform}
                      </p>
                      <div className="grid grid-cols-3 gap-1">
                        {platform.map((item) => (
                          <button
                            key={item.title}
                            onClick={() => scrollTo("trust")}
                            className={`flex items-start gap-2.5 p-3 rounded-xl hover:bg-gray-50 transition-colors group w-full ${isAr ? "flex-row-reverse text-right" : "text-left"}`}
                          >
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                              style={{ background: item.color }}
                            >
                              {item.icon}
                            </div>
                            <div>
                              <p className={`text-xs font-semibold text-gray-800 ${isAr ? "font-cairo" : ""}`}>{item.title}</p>
                              <p className={`text-[11px] text-gray-400 mt-0.5 leading-snug ${isAr ? "font-cairo" : ""}`}>{item.desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Right: featured card */}
                    <button
                      onClick={() => scrollTo("trust")}
                      className="w-40 shrink-0 rounded-xl bg-gradient-to-br from-[#4DA514]/10 to-[#4DA514]/5 border border-[#4DA514]/20 p-4 flex flex-col items-center justify-center gap-3 hover:from-[#4DA514]/15 hover:to-[#4DA514]/10 transition-colors text-center"
                    >
                      <div className="w-14 h-14 rounded-full bg-[#4DA514]/15 flex items-center justify-center">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4DA514" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          <polyline points="9 12 11 14 15 10" />
                        </svg>
                      </div>
                      <p className={`text-xs font-semibold text-gray-700 leading-snug ${isAr ? "font-cairo" : ""}`}>
                        {tx.featuredLabel}
                      </p>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => scrollTo("trust")} className={`hover:text-gray-900 transition-colors ${isAr ? "font-cairo" : ""}`}>
              {tx.trust}
            </button>
            <button onClick={() => scrollTo("docs")} className={`hover:text-gray-900 transition-colors ${isAr ? "font-cairo" : ""}`}>
              {tx.docs}
            </button>
            <a href="/AI/about" className={`hover:text-gray-900 transition-colors ${isAr ? "font-cairo" : ""}`}>
              {tx.about}
            </a>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              className="text-xs font-bold text-gray-400 hover:text-gray-700 border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded-full transition-all duration-200"
            >
              {isAr ? "EN" : "عر"}
            </button>
            <a
              href="https://wa.me/966505117551"
              target="_blank" rel="noopener noreferrer"
              className={`hidden md:inline-flex bg-[#4DA514] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#3d8a10] transition-colors duration-200 shadow-md shadow-[#4DA514]/20 ${isAr ? "font-cairo" : ""}`}
            >
              {tx.cta}
            </a>
            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-1 max-h-[80vh] overflow-y-auto">
            <button onClick={() => scrollTo("how-it-works")} className={`text-left py-3 text-sm font-medium text-gray-700 hover:text-gray-900 border-b border-gray-50 ${isAr ? "font-cairo text-right" : ""}`}>
              {tx.howItWorks}
            </button>

            {/* Products accordion */}
            <div className="border-b border-gray-50">
              <button
                onClick={() => setMobileFeaturesOpen(!mobileFeaturesOpen)}
                className={`w-full flex items-center justify-between py-3 text-sm font-medium text-gray-700 hover:text-gray-900 ${isAr ? "font-cairo flex-row-reverse" : ""}`}
              >
                {tx.products}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  className={`transition-transform duration-200 ${mobileFeaturesOpen ? "rotate-180" : ""}`}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {mobileFeaturesOpen && (
                <div className="pb-3 flex flex-col gap-1">
                  <p className={`text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-1 mb-1 ${isAr ? "font-cairo text-right" : ""}`}>
                    {tx.aiAgent}
                  </p>
                  {agents.map((item) => (
                    <button
                      key={item.title}
                      onClick={() => scrollTo("features")}
                      className={`flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors w-full ${isAr ? "flex-row-reverse text-right" : "text-left"}`}
                    >
                      <Circle color={item.color}>{item.icon}</Circle>
                      <div>
                        <p className={`text-sm font-semibold text-gray-800 ${isAr ? "font-cairo" : ""}`}>{item.title}</p>
                        <p className={`text-xs text-gray-400 mt-0.5 leading-snug ${isAr ? "font-cairo" : ""}`}>{item.desc}</p>
                      </div>
                    </button>
                  ))}
                  <p className={`text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-1 mt-2 mb-1 ${isAr ? "font-cairo text-right" : ""}`}>
                    {tx.platform}
                  </p>
                  {platform.map((item) => (
                    <button
                      key={item.title}
                      onClick={() => scrollTo("trust")}
                      className={`flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors w-full ${isAr ? "flex-row-reverse text-right" : "text-left"}`}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: item.color }}>
                        {item.icon}
                      </div>
                      <div>
                        <p className={`text-sm font-semibold text-gray-800 ${isAr ? "font-cairo" : ""}`}>{item.title}</p>
                        <p className={`text-xs text-gray-400 mt-0.5 leading-snug ${isAr ? "font-cairo" : ""}`}>{item.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => scrollTo("trust")} className={`text-left py-3 text-sm font-medium text-gray-700 hover:text-gray-900 border-b border-gray-50 ${isAr ? "font-cairo text-right" : ""}`}>
              {tx.trust}
            </button>
            <button onClick={() => scrollTo("docs")} className={`text-left py-3 text-sm font-medium text-gray-700 hover:text-gray-900 border-b border-gray-50 ${isAr ? "font-cairo text-right" : ""}`}>
              {tx.docs}
            </button>
            <a href="/AI/about" className={`py-3 text-sm font-medium text-gray-700 hover:text-gray-900 border-b border-gray-50 ${isAr ? "font-cairo text-right block" : ""}`}>
              {tx.about}
            </a>
            <a
              href="https://wa.me/966505117551"
              target="_blank" rel="noopener noreferrer"
              className={`mt-3 bg-[#4DA514] text-white text-sm font-semibold px-5 py-3 rounded-full hover:bg-[#3d8a10] transition-colors text-center ${isAr ? "font-cairo" : ""}`}
            >
              {tx.cta}
            </a>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
