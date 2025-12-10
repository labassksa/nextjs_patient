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
    <div className="bg-custom-background h-screen max-h-screen overflow-hidden">
      <TopBanner />
      <BottomBanner />
      <div className="pt-[22vh] pb-16 px-4 h-full overflow-hidden">
        <HealthFacilitiesButton />
        <SchoolsButton />
        <ConsultationButton />
      </div>
      <BottomNavBar currentPath="/" />
    </div>
  );
};

export default Home;
