"use client";

import React from "react";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import Navbar from "./_components/Navbar";
import Hero from "./_components/Hero";
import Stats from "./_components/Stats";
import Features from "./_components/Features";
import ELI11 from "./_components/ELI11";
import HowItWorks from "./_components/HowItWorks";
import Docs from "./_components/Docs";
import Trust from "./_components/Trust";
import ContactCTA from "./_components/ContactCTA";
import Footer from "./_components/Footer";
import WhatsAppFloat from "./_components/WhatsAppFloat";

function PageContent() {
  const { isAr } = useLanguage();
  return (
    <div
      className={`bg-white ${isAr ? "font-cairo" : "font-sans"}`}
      dir={isAr ? "rtl" : "ltr"}
      lang={isAr ? "ar" : "en"}
    >
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <Trust />
      <ELI11 />
      <HowItWorks />
      <Docs />
      <ContactCTA />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

export default function AIPage() {
  return (
    <LanguageProvider>
      <PageContent />
    </LanguageProvider>
  );
}
