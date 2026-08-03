"use client";

import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const WHATSAPP = "https://wa.me/966505117551";

const t = {
  en: {
    heading: "See it live in your clinic",
    sub: "Fill in your details and we'll reach out to schedule a personalized demo — no commitment required",
    checks: [
      "Free 30-minute discovery call",
      "Demo built for your specialty",
      "Works in Arabic and English",
      "No credit card needed",
    ],
    waTitle: "Prefer WhatsApp?",
    waSub: "Message us directly and we'll schedule something in minutes",
    waCta: "Chat on WhatsApp",
    fields: {
      name: "Full name",
      namePlaceholder: "Dr. Ahmed",
      company: "Facility name",
      companyPlaceholder: "Al-Noor Medical Center",
      email: "Email",
      emailPlaceholder: "you@clinic.sa",
      phone: "Phone",
      phonePlaceholder: "+966 5X XXX XXXX",
      type: "Facility type",
      typeOptions: [
        { value: "", label: "Select one..." },
        { value: "clinic", label: "Clinic" },
        { value: "hospital", label: "Hospital" },
        { value: "pharmacy", label: "Pharmacy chain" },
        { value: "lab", label: "Medical lab" },
        { value: "group", label: "Healthcare group" },
        { value: "other", label: "Other" },
      ],
    },
    submit: "Book my free demo",
    submitting: "Sending...",
    noSpam: "No spam — we respect your time",
    successTitle: "We'll be in touch",
    successSub: "Expect a reply within 24 hours — we'll set up a call at a time that works for you",
  },
  ar: {
    heading: "شاهده مباشرةً في عيادتك",
    sub: "أدخل بياناتك وسنتواصل معك لترتيب عرض مخصص — بدون أي التزام",
    checks: [
      "مكالمة استكشاف مجانية لمدة 30 دقيقة",
      "عرض مبني خصيصاً لتخصصك",
      "يعمل بالعربية والإنجليزية",
      "لا بطاقة ائتمانية مطلوبة",
    ],
    waTitle: "تفضّل واتساب؟",
    waSub: "راسلنا مباشرةً وسنرتب موعداً في دقائق",
    waCta: "تحدّث معنا على واتساب",
    fields: {
      name: "الاسم الكامل",
      namePlaceholder: "د. أحمد",
      company: "اسم المنشأة",
      companyPlaceholder: "مركز النور الطبي",
      email: "البريد الإلكتروني",
      emailPlaceholder: "you@clinic.sa",
      phone: "رقم الهاتف",
      phonePlaceholder: "+966 5X XXX XXXX",
      type: "نوع المنشأة",
      typeOptions: [
        { value: "", label: "اختر..." },
        { value: "clinic", label: "عيادة" },
        { value: "hospital", label: "مستشفى" },
        { value: "pharmacy", label: "سلسلة صيدليات" },
        { value: "lab", label: "مختبر طبي" },
        { value: "group", label: "مجموعة رعاية صحية" },
        { value: "other", label: "أخرى" },
      ],
    },
    submit: "احجز عرضي المجاني",
    submitting: "جارٍ الإرسال...",
    noSpam: "لا رسائل مزعجة — نحترم وقتك",
    successTitle: "سنتواصل معك قريباً",
    successSub: "توقّع رداً خلال 24 ساعة — سنرتب مكالمة في الوقت الذي يناسبك",
  },
};

type FormState = { name: string; company: string; email: string; phone: string; facilityType: string };
const initialForm: FormState = { name: "", company: "", email: "", phone: "", facilityType: "" };

const DemoForm: React.FC = () => {
  const { lang, isAr } = useLanguage();
  const tx = t[lang];
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section id="demo" className="py-24 bg-gray-950">
        <div className="max-w-lg mx-auto px-6 text-center">
          <div className="w-14 h-14 bg-[#4DA514]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-7 h-7 text-[#4DA514]" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className={`text-2xl font-black text-white mb-2 ${isAr ? "font-cairo" : ""}`}>{tx.successTitle}</h3>
          <p className={`text-gray-500 text-sm ${isAr ? "font-cairo" : ""}`}>{tx.successSub}</p>
        </div>
      </section>
    );
  }

  const inputClass = `w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4DA514]/50 transition-colors ${isAr ? "text-right font-cairo" : ""}`;

  return (
    <section id="demo" className="py-24 bg-gray-950">
      <div className="max-w-5xl mx-auto px-6">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-14 items-start ${isAr ? "lg:flex-row-reverse" : ""}`}>

          {/* Left — copy */}
          <div className={isAr ? "text-right" : ""}>
            <h2 className={`text-3xl md:text-4xl font-black text-white mb-4 leading-tight ${isAr ? "font-cairo" : ""}`}>
              {tx.heading}
            </h2>
            <p className={`text-gray-400 mb-8 leading-relaxed text-base ${isAr ? "font-cairo" : ""}`}>
              {tx.sub}
            </p>

            <div className="space-y-3.5 mb-10">
              {tx.checks.map((item) => (
                <div key={item} className={`flex items-center gap-3 text-gray-400 text-sm ${isAr ? "flex-row-reverse font-cairo" : ""}`}>
                  <div className="w-5 h-5 rounded-full bg-[#4DA514]/15 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-[#4DA514]" viewBox="0 0 12 12" fill="none">
                      <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  {item}
                </div>
              ))}
            </div>

            <div className={`p-5 bg-gray-900 border border-gray-800 rounded-2xl ${isAr ? "text-right" : ""}`}>
              <p className={`text-white font-semibold text-sm mb-1 ${isAr ? "font-cairo" : ""}`}>{tx.waTitle}</p>
              <p className={`text-gray-500 text-sm mb-3 ${isAr ? "font-cairo" : ""}`}>{tx.waSub}</p>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 text-[#4DA514] text-sm font-semibold hover:underline ${isAr ? "flex-row-reverse font-cairo" : ""}`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {tx.waCta}
              </a>
            </div>
          </div>

          {/* Right — form */}
          <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-semibold text-gray-500 mb-1.5 ${isAr ? "text-right font-cairo" : ""}`}>
                  {tx.fields.name} *
                </label>
                <input name="name" value={form.name} onChange={handleChange} required placeholder={tx.fields.namePlaceholder} className={inputClass} />
              </div>
              <div>
                <label className={`block text-xs font-semibold text-gray-500 mb-1.5 ${isAr ? "text-right font-cairo" : ""}`}>
                  {tx.fields.company} *
                </label>
                <input name="company" value={form.company} onChange={handleChange} required placeholder={tx.fields.companyPlaceholder} className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-semibold text-gray-500 mb-1.5 ${isAr ? "text-right font-cairo" : ""}`}>
                  {tx.fields.email} *
                </label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder={tx.fields.emailPlaceholder} className={inputClass} />
              </div>
              <div>
                <label className={`block text-xs font-semibold text-gray-500 mb-1.5 ${isAr ? "text-right font-cairo" : ""}`}>
                  {tx.fields.phone} *
                </label>
                <input name="phone" type="tel" value={form.phone} onChange={handleChange} required placeholder={tx.fields.phonePlaceholder} className={inputClass} />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-semibold text-gray-500 mb-1.5 ${isAr ? "text-right font-cairo" : ""}`}>
                {tx.fields.type}
              </label>
              <select name="facilityType" value={form.facilityType} onChange={handleChange} className={`${inputClass} appearance-none`}>
                {tx.fields.typeOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#4DA514] text-white font-bold py-4 rounded-xl text-sm hover:bg-[#3d8a10] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 mt-2 ${isAr ? "font-cairo" : ""}`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {tx.submitting}
                </span>
              ) : tx.submit}
            </button>

            <p className={`text-center text-gray-600 text-xs pt-1 ${isAr ? "font-cairo" : ""}`}>
              {tx.noSpam}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default DemoForm;
