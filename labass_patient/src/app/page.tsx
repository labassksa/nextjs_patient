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
<<<<<<< HEAD
=======
import ObesityConsultationButton from "./_components/homePage/ObesityConsultationButton";
>>>>>>> develop
import HealthFacilitiesButton from "./_components/homePage/HealthFacilitiesButton";
import SchoolsButton from "./_components/homePage/SchoolsButton";
import React from "react";
import "./globals.css";

const Home = () => {
  return (
    <div className="bg-custom-background h-screen overflow-hidden flex flex-col">
      <TopBanner />
      <BottomBanner />
<<<<<<< HEAD
      <div className="pt-[28vh] overflow-auto px-4 flex-grow">
=======
      <div className="pt-[28vh] px-4 flex-1 overflow-hidden">
>>>>>>> develop
        <HealthFacilitiesButton />
        <SchoolsButton />
        <ConsultationButton />
        <ObesityConsultationButton />
      </div>
      <BottomNavBar currentPath="/" />
    </div>
  );
};

export default Home;
