"use client";
// src/app/Home.tsx
import { usePathname } from "next/navigation";
import BottomNavBar from "../components/BottomNavBar";
import TopBanner from "../components/homePage/TopHomePageBanner";
import BottomBanner from "../components/homePage/BottomHomePageBanner";
import ConsultationButton from "../components/homePage/ConsultationButtonHomePage";
import HorizontalItemList from "../components/homePage/symptomsList";
import React from "react";
import "./globals.css";
import LinkInsuranceButton from "../components/homePage/LinkInsuranceButton";
import LinkInsurance from "../components/homePage/LinkInsuranceButton";

const items = [
  {
    id: 1,
    title: "مشاكل الشعر",
    description: "Description of Item 1",
    imageUrl: "/images/item1.jpg",
  },
  {
    id: 2,
    title: " القولون العصبي",
    description: "Description of Item 2",
    imageUrl: "/images/item2.jpg",
  },
  {
    id: 3,
    title: "Have better sex",
    description: "Description of Item 3",
    imageUrl: "/images/item3.jpg",
  },
  {
    id: 4,
    title: "الحساسية",
    description: "Description of Item 4",
    imageUrl: "/images/item4.jpg",
  },
  // Add other items
];

const Home: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className="bg-custom-background min-h-screen flex-col">
      <TopBanner />
      <BottomBanner />
      <div className="pt-[28vh] overflow-auto px-4 flex-grow">
        <ConsultationButton />
        <HorizontalItemList items={items} />
        <LinkInsurance />
      </div>
      <BottomNavBar currentPath={pathname} />
    </div>
  );
};
export default Home;
