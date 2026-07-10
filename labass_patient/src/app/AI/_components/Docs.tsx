"use client";

import React from "react";
import { useLanguage } from "../context/LanguageContext";

const t = {
  en: {
    badge: "Documentation",
    heading: "Everything you need to know",
    sub: "Guides, API references, and integration docs — all in one place",
    searchPlaceholder: "Search documentation...",
    popular: "Popular articles",
    contact: "Can't find what you're looking for?",
    contactCta: "Talk to our team",
    categories: [
      {
        title: "Getting Started",
        desc: "Set up LaBas AI in your clinic from scratch",
        articles: ["Quick start guide", "Connecting your first facility", "Inviting your team", "System requirements"],
      },
      {
        title: "AI Agents",
        desc: "Understand what each agent does and how to configure it",
        articles: ["Intake agent", "Documentation agent", "Follow-up agent", "Custom agent setup"],
      },
      {
        title: "API Reference",
        desc: "Integrate LaBas AI into your existing systems",
        articles: ["Authentication", "Patient endpoints", "Webhook events", "Rate limits"],
      },
      {
        title: "Integrations",
        desc: "Connect with EMRs, HIS platforms, and clinic tools",
        articles: ["Connecting your EMR", "WhatsApp Business", "MOH systems", "Custom HIS setup"],
      },
      {
        title: "Configuration",
        desc: "Customize agents, workflows, and notification rules",
        articles: ["Agent settings", "Notification rules", "Language settings", "Access control"],
      },
      {
        title: "Security & Compliance",
        desc: "Data privacy, regulatory compliance, and security practices",
        articles: ["Data residency", "Access logs", "Compliance overview", "Incident response"],
      },
    ],
    popularArticles: [
      { title: "How to set up the intake agent in 10 minutes", tag: "Getting Started" },
      { title: "Connecting LaBas AI to your WhatsApp Business number", tag: "Integrations" },
      { title: "How documentation agents create SOAP notes", tag: "AI Agents" },
      { title: "Setting language preferences per clinic branch", tag: "Configuration" },
      { title: "Understanding webhook payloads", tag: "API Reference" },
    ],
  },
  ar: {
    badge: "التوثيق",
    heading: "كل ما تحتاج معرفته",
    sub: "أدلة إرشادية، مراجع API، وتوثيق التكامل — كلها في مكان واحد",
    searchPlaceholder: "ابحث في التوثيق...",
    popular: "المقالات الأكثر قراءة",
    contact: "لم تجد ما تبحث عنه؟",
    contactCta: "تحدّث مع فريقنا",
    categories: [
      {
        title: "البداية",
        desc: "إعداد لاباس AI في عيادتك من الصفر",
        articles: ["دليل البدء السريع", "ربط أول منشأة", "دعوة فريقك", "متطلبات النظام"],
      },
      {
        title: "وكلاء الذكاء الاصطناعي",
        desc: "افهم ما يفعله كل وكيل وكيف تضبط إعداداته",
        articles: ["وكيل الاستقبال", "وكيل التوثيق", "وكيل المتابعة", "إعداد وكيل مخصص"],
      },
      {
        title: "مرجع API",
        desc: "ادمج لاباس AI في أنظمتك الحالية",
        articles: ["المصادقة", "نقاط نهاية المرضى", "أحداث Webhook", "حدود الاستخدام"],
      },
      {
        title: "التكاملات",
        desc: "الاتصال بأنظمة السجلات الطبية ومنصات العيادات",
        articles: ["ربط السجل الطبي", "واتساب للأعمال", "أنظمة وزارة الصحة", "إعداد HIS مخصص"],
      },
      {
        title: "الإعدادات",
        desc: "تخصيص الوكلاء وسير العمل وقواعد الإشعارات",
        articles: ["إعدادات الوكيل", "قواعد الإشعارات", "إعدادات اللغة", "التحكم بالوصول"],
      },
      {
        title: "الأمان والامتثال",
        desc: "خصوصية البيانات والامتثال التنظيمي وممارسات الأمان",
        articles: ["إقامة البيانات", "سجلات الوصول", "نظرة عامة على الامتثال", "الاستجابة للحوادث"],
      },
    ],
    popularArticles: [
      { title: "كيفية إعداد وكيل الاستقبال في 10 دقائق", tag: "البداية" },
      { title: "ربط لاباس AI برقم واتساب للأعمال", tag: "التكاملات" },
      { title: "كيف يُنشئ وكيل التوثيق ملاحظات SOAP", tag: "وكلاء الذكاء الاصطناعي" },
      { title: "ضبط تفضيلات اللغة لكل فرع", tag: "الإعدادات" },
      { title: "فهم بيانات Webhook", tag: "مرجع API" },
    ],
  },
};

const categoryIcons = [
  <svg key="0" className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  <svg key="1" className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>,
  <svg key="2" className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>,
  <svg key="3" className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>,
  <svg key="4" className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>,
  <svg key="5" className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>,
];

const Docs: React.FC = () => {
  const { lang, isAr } = useLanguage();
  const tx = t[lang];

  return (
    <section id="docs" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className={`inline-block bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest ${isAr ? "font-cairo" : ""}`}>
            {tx.badge}
          </div>
          <h2 className={`text-3xl md:text-4xl font-black text-gray-900 ${isAr ? "font-cairo" : ""}`}>
            {tx.heading}
          </h2>
          <p className={`text-gray-400 mt-3 max-w-md mx-auto text-base ${isAr ? "font-cairo" : ""}`}>
            {tx.sub}
          </p>
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="relative">
            <svg className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isAr ? "right-4" : "left-4"}`} viewBox="0 0 24 24" fill="none">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder={tx.searchPlaceholder}
              readOnly
              className={`w-full py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-400 focus:outline-none cursor-pointer ${isAr ? "pr-10 pl-14 text-right font-cairo" : "pl-10 pr-14"}`}
            />
            <kbd className={`absolute top-1/2 -translate-y-1/2 bg-gray-200 text-gray-400 text-xs px-2 py-0.5 rounded font-mono ${isAr ? "left-4" : "right-4"}`}>
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {tx.categories.map((cat, i) => (
            <div
              key={i}
              className="group bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:border-[#4DA514]/30 hover:bg-white hover:shadow-lg hover:shadow-[#4DA514]/5 transition-all duration-200 cursor-pointer"
            >
              <div className={`flex items-start gap-3 mb-4 ${isAr ? "flex-row-reverse" : ""}`}>
                <div className="w-9 h-9 bg-[#4DA514]/10 text-[#4DA514] rounded-xl flex items-center justify-center flex-shrink-0">
                  {categoryIcons[i]}
                </div>
                <div className={isAr ? "text-right" : ""}>
                  <h3 className={`font-bold text-gray-900 text-base mb-0.5 ${isAr ? "font-cairo" : ""}`}>{cat.title}</h3>
                  <p className={`text-gray-400 text-sm leading-relaxed ${isAr ? "font-cairo" : ""}`}>{cat.desc}</p>
                </div>
              </div>
              <ul className={`space-y-1.5 ${isAr ? "text-right" : ""}`}>
                {cat.articles.map((article, j) => (
                  <li key={j} className={`flex items-center gap-2 text-sm text-gray-500 ${isAr ? "flex-row-reverse font-cairo" : ""}`}>
                    <span className="w-1 h-1 bg-gray-300 rounded-full flex-shrink-0" />
                    {article}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Popular articles */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8">
          <h3 className={`font-bold text-gray-900 text-lg mb-5 ${isAr ? "font-cairo text-right" : ""}`}>
            {tx.popular}
          </h3>
          <div className="divide-y divide-gray-100">
            {tx.popularArticles.map((a, i) => (
              <div key={i} className={`flex items-center justify-between py-3.5 cursor-pointer group ${isAr ? "flex-row-reverse" : ""}`}>
                <span className={`text-sm text-gray-600 group-hover:text-gray-900 transition-colors font-medium ${isAr ? "font-cairo text-right" : ""}`}>
                  {a.title}
                </span>
                <div className={`flex items-center gap-3 flex-shrink-0 ${isAr ? "flex-row-reverse" : ""}`}>
                  <span className={`hidden sm:block text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full ${isAr ? "font-cairo" : ""}`}>
                    {a.tag}
                  </span>
                  <svg className={`w-4 h-4 text-gray-300 group-hover:text-[#4DA514] transition-colors ${isAr ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none">
                    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className={`text-gray-400 text-sm ${isAr ? "font-cairo" : ""}`}>
            {tx.contact}{" "}
            <button
              onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })}
              className="text-[#4DA514] font-semibold hover:underline"
            >
              {tx.contactCta}
            </button>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Docs;
