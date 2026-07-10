"use client";

import React, { createContext, useContext, useState } from "react";

export type Lang = "en" | "ar";

interface LanguageContextType {
  lang: Lang;
  toggle: () => void;
  isAr: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  toggle: () => {},
  isAr: false,
});

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [lang, setLang] = useState<Lang>("en");
  const toggle = () => setLang((l) => (l === "en" ? "ar" : "en"));
  return (
    <LanguageContext.Provider value={{ lang, toggle, isAr: lang === "ar" }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
