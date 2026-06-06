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

import BottomNavBar from "../../components/common/BottomNavBar";
import TopBanner from "../_components/homePage/TopHomePageBanner";
import BottomBanner from "../_components/homePage/BottomHomePageBanner";
import ConsultationButton from "../_components/homePage/QuickConsultationButton";
import ObesityConsultationButton from "../_components/homePage/ObesityConsultationButton";
import GeneralPackageButton from "../_components/homePage/GeneralPackageButton";
import HealthFacilitiesButton from "../_components/homePage/HealthFacilitiesButton";
import SchoolsButton from "../_components/homePage/SchoolsButton";
import React from "react";

const Home = () => {
  return (
    <div className="bg-custom-background h-screen overflow-hidden flex flex-col">
      <div className="w-full bg-blue-600 text-white text-center py-2 font-bold">
        pushed from Termius
      </div>
      <TopBanner />
      <BottomBanner />
      <div className="pt-[28vh] overflow-auto px-4 flex-grow pb-32">
        <HealthFacilitiesButton />
        <SchoolsButton />
        <ConsultationButton />
        <ObesityConsultationButton />
        <GeneralPackageButton />
      </div>
      <BottomNavBar currentPath="/home" />
    </div>
  );
};

export default Home;
