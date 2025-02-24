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
import LinkInsurance from "./_components/homePage/LinkInsuranceButton";
import React from "react";
import "./globals.css";

const Home = () => {
  return (
    <div className="bg-custom-background min-h-screen justify-center items-center">
      <TopBanner />
      <BottomBanner />
      <div className="pt-[28vh] overflow-auto px-4 flex-grow">
        <LinkInsurance />
        <ConsultationButton />
      </div>
      <BottomNavBar currentPath="/" />
    </div>
  );
};

export default Home;
