import BottomNavBar from "../components/common/BottomNavBar";
import TopBanner from "./_components/homePage/TopHomePageBanner";
import BottomBanner from "./_components/homePage/BottomHomePageBanner";
import ConsultationButton from "./_components/homePage/QuickConsultationButton";
import HorizontalItemList from "./_components/homePage/symptoms";
import React from "react";
import "./globals.css";
import LinkInsurance from "./_components/homePage/LinkInsuranceButton";

const items = [
  {
    id: 1,
    title: " القولون العصبي",
    description: "Description of Item 2",
    imageUrl: "/icons/widgets/icon-anxiety.svg",
  },
  {
    id: 3,
    title: "الحساسية",
    description: "Description of Item 4",
    imageUrl: "/icons/widgets/icon-hair.svg",
  },
  {
    id: 2,
    title: "القلق والاكتئاب",
    description: "Description of Item 1",
    imageUrl: "/icons/widgets/icon-anxiety.svg",
  },
  {
    id: 5,
    title: "المختبر",
    description: "Description of Item 3",
    imageUrl: "/icons/widgets/icon-lab.svg",
  },
  {
    id: 4,
    title: "جنس أفضل",
    description: "Description of Item 3",
    imageUrl: "/icons/widgets/icon-sex.svg",
  },
  // Add other items
];

interface HomeProps {
  pathname: string;
}

const Home: React.FC = () => {
  return (
    <div className=" bg-custom-background min-h-screen  justify-center items-center ">
      <TopBanner />
      <BottomBanner />
      <div className="pt-[28vh] overflow-auto px-4 flex-grow">
        <LinkInsurance />
        <ConsultationButton />
        {/* <HorizontalItemList items={items} /> */}
      </div>
      <BottomNavBar currentPath="/" />
    </div>
  );
};
export default Home;
