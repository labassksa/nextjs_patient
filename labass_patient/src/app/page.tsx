// app/page.js
export const metadata = {
  title: "لاباس",
  description: "استشارات طبية فورية",
  openGraph: {
    title: "لاباس",
    description: "استشارات طبية فورية",
    images: ["https://example.com/your-image.jpg"],
  },
};

import BottomNavBar from "../components/common/BottomNavBar";
import TopBanner from "./_components/homePage/TopHomePageBanner";
import BottomBanner from "./_components/homePage/BottomHomePageBanner";
import ConsultationButton from "./_components/homePage/QuickConsultationButton";
import HealthFacilitiesButton from "./_components/homePage/HealthFacilitiesButton";
import SchoolsButton from "./_components/homePage/SchoolsButton";
import React from "react";
import "./globals.css";

const Home = () => {
  return (
    <div className="bg-custom-background h-screen w-full flex flex-col overflow-hidden relative touch-none">
      <TopBanner />
      <BottomBanner />
      <div className="absolute inset-0 flex flex-col justify-center gap-2 px-4 pb-20 overflow-hidden">
        <div className="touch-auto flex flex-col gap-2">
          <HealthFacilitiesButton />
          <SchoolsButton />
          <ConsultationButton />
        </div>
      </div>
      <BottomNavBar currentPath="/" />
    </div>
  );
};

export default Home;
