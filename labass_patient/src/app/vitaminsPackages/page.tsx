"use client";

import React from "react";
import HeroSection from "./_components/HeroSection";
// import HowItWorks from "./_components/HowItWorks";
import WhatsIncluded from "./_components/WhatsIncluded";
import PricingPlans from "./_components/PricingPlans";
import Testimonials from "./_components/Testimonials";
import BlogHub from "./_components/BlogHub";
import FAQ from "./_components/FAQ";
import FooterCTA from "./_components/FooterCTA";

const VitaminsPackagesPage = () => {
  return (
    <div dir="rtl" className="relative bg-white">
      {/* ─── LICENSE TAG ─── */}
      <div style={{ background: "#f2faed", borderBottom: "0.5px solid rgba(23,52,4,0.08)", padding: "8px 48px", textAlign: "center", fontSize: "12px", fontWeight: 600, color: "#27500A", letterSpacing: "0.2px" }}>
        شركة سعودية مرخّصة من وزارة الصحة · ترخيص رقم 1400055938
      </div>
      <HeroSection />
      {/* <HowItWorks /> */}
      <div style={{ backgroundColor: "#7ED957" }}>
        <WhatsIncluded />
        <PricingPlans />
        <Testimonials />
        <BlogHub />
        <FAQ />
        <FooterCTA />
      </div>
      {/* ─── LICENSE TAG ─── */}
      <div style={{ background: "#f2faed", borderTop: "0.5px solid rgba(23,52,4,0.08)", padding: "8px 48px", textAlign: "center", fontSize: "12px", fontWeight: 600, color: "#27500A", letterSpacing: "0.2px" }}>
        شركة سعودية مرخّصة من وزارة الصحة · ترخيص رقم 1400055938
      </div>
    </div>
  );
};

export default VitaminsPackagesPage;
