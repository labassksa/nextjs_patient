"use client";

import React from "react";
import TopBanner from "../becomeAmarketer/_components/topBanner";
import HeroSection from "./_components/HeroSection";
import HowItWorks from "./_components/HowItWorks";
import WhatsIncluded from "./_components/WhatsIncluded";
import PricingPlans from "./_components/PricingPlans";
import FAQ from "./_components/FAQ";
import FooterCTA from "./_components/FooterCTA";

const VitaminsPackagesPage = () => {
  return (
    <div dir="rtl" className="relative bg-white">
      <TopBanner />
      <div className="mt-16">
        <HeroSection />
      <HowItWorks />
      <WhatsIncluded />
      <PricingPlans />
      <FAQ />
      <FooterCTA />
      </div>
    </div>
  );
};

export default VitaminsPackagesPage;
