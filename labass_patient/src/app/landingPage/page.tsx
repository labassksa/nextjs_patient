"use client";

import React from "react";
import TopBanner from "../becomeAmarketer/_components/topBanner";
import BottomBanner from "../becomeAmarketer/_components/bottomBanner";
import HeroSection from "./_components/HeroSection";
import ServicesOverview from "./_components/ServicesOverview";
import HowItWorks from "./_components/HowItWorks";
import PartnersNetwork from "./_components/PartnersNetwork";
import FooterCTA from "./_components/FooterCTA";

const LandingPage = () => {
  return (
    <div dir="rtl" className="relative bg-white overflow-hidden">
      <TopBanner />
      <BottomBanner />

      <HeroSection />
      <ServicesOverview />
      <HowItWorks />
      <PartnersNetwork />
      <FooterCTA />

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes countUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.7s ease-out both;
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out both;
        }
        .animate-scale-in {
          animation: scaleIn 0.5s ease-out both;
        }
        .animate-count-up {
          animation: countUp 0.6s ease-out both;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-800 { animation-delay: 0.8s; }
      `}</style>
    </div>
  );
};

export default LandingPage;
