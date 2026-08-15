"use client";

import React from "react";
import { useLanguage } from "../context/LanguageContext";

const WHATSAPP = "https://wa.me/966505117551";

const t = {
  en: {
    tagline: "AI agents for healthcare teams",
    contact: "Contact us",
    email: "ai@labas.sa",
    waBtn: "WhatsApp us",
    copyright: "© 2025 LaBas — All rights reserved",
    privacy: "Privacy",
    terms: "Terms",
    disclaimer:
      "LaBas is an independent software product and is not affiliated with, endorsed by, or sponsored by WhatsApp LLC or Meta Platforms, Inc. WhatsApp is a trademark of WhatsApp LLC.",
  },
  ar: {
    tagline: "وكلاء ذكاء اصطناعي لفرق الرعاية الصحية",
    contact: "تواصل معنا",
    email: "ai@labas.sa",
    waBtn: "واتساب",
    copyright: "© 2025 LaBas — جميع الحقوق محفوظة",
    privacy: "الخصوصية",
    terms: "الشروط",
    disclaimer:
      "لاباس منتج برمجي مستقل، وليس تابعاً لشركة واتساب أو ميتا ولا معتمداً أو مدعوماً منهما. واتساب علامة تجارية مملوكة لشركة WhatsApp LLC.",
  },
};

const Footer: React.FC = () => {
  const { lang, isAr } = useLanguage();
  const tx = t[lang];

  return (
    <footer className="bg-gray-950 border-t border-gray-900 py-12">
      <div className="max-w-5xl mx-auto px-6">
        <div className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-10 pb-10 border-b border-gray-900 ${isAr ? "md:flex-row-reverse" : ""}`}>
          {/* Brand */}
          <div className={isAr ? "text-right" : ""}>
            <div className={`flex items-center gap-2 mb-1 ${isAr ? "flex-row-reverse justify-end" : ""}`}>
              <div className="w-7 h-7 bg-[#4DA514] rounded-lg flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className={`font-bold text-white text-sm ${isAr ? "font-cairo" : ""}`}>
                LaBas <span className="text-[#4DA514]">AI</span>
              </span>
            </div>
            <p className={`text-gray-600 text-xs mt-2 max-w-xs ${isAr ? "font-cairo" : ""}`}>
              {tx.tagline}
            </p>
          </div>

          {/* Contact */}
          <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 ${isAr ? "sm:flex-row-reverse" : ""}`}>
            <div className={`text-gray-600 text-xs ${isAr ? "text-right" : ""}`}>
              <span className={`text-gray-500 font-semibold block mb-1 ${isAr ? "font-cairo" : ""}`}>{tx.contact}</span>
              <span>{tx.email}</span>
            </div>

            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2.5 bg-[#4DA514]/10 hover:bg-[#4DA514]/20 border border-[#4DA514]/20 text-[#4DA514] text-sm font-semibold px-4 py-2.5 rounded-full transition-all duration-200 ${isAr ? "flex-row-reverse font-cairo" : ""}`}
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {tx.waBtn}
            </a>
          </div>
        </div>

        {/* Brand disclaimer */}
        <p className={`text-gray-600 text-xs leading-relaxed mb-6 ${isAr ? "font-cairo text-right" : ""}`}>
          {tx.disclaimer}
        </p>

        {/* Bottom */}
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 text-gray-700 text-xs ${isAr ? "sm:flex-row-reverse" : ""}`}>
          <span className={isAr ? "font-cairo" : ""}>{tx.copyright}</span>
          <div className="flex items-center gap-5">
            <span className={`hover:text-gray-500 cursor-pointer transition-colors ${isAr ? "font-cairo" : ""}`}>{tx.privacy}</span>
            <span className={`hover:text-gray-500 cursor-pointer transition-colors ${isAr ? "font-cairo" : ""}`}>{tx.terms}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
