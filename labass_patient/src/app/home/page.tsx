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

import AppDrawer from "../../components/common/AppDrawer";
import TopBanner from "../_components/homePage/TopHomePageBanner";
import BottomBanner from "../_components/homePage/BottomHomePageBanner";
import GeneralPackageButton from "../_components/homePage/GeneralPackageButton";
import HealthFacilitiesButton from "../_components/homePage/HealthFacilitiesButton";
import SchoolsButton from "../_components/homePage/SchoolsButton";
import React from "react";

const Home = () => {
  return (
    <div className="bg-custom-background h-screen overflow-hidden flex flex-col">
      <TopBanner />
      <BottomBanner />
      <div className="pt-[28vh] overflow-auto px-4 flex-grow pb-8">
        <HealthFacilitiesButton />
        <SchoolsButton />
        <GeneralPackageButton />
      </div>
      <AppDrawer currentPath="/home" />
    </div>
  );
};

export default Home;
