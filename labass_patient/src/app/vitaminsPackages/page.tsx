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
    </div>
  );
};

export default VitaminsPackagesPage;
