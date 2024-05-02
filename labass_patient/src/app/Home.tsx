"use client";
import { usePathname } from "next/navigation";
import BottomNavBar from "../components/BottomNavBar";
import Image from "next/image";
import React from "react";
import ListItem from "../components/symptomsListItem";
import { Item } from "./page";

export const Home: React.FC = () => {
  const pathname = usePathname();

  const items: Item[] = [
    {
      id: 1,
      title: "Item 1",
      description: "Description of Item 1",
      imageUrl: "/images/item1.jpg",
    },
    {
      id: 2,
      title: "Item 2",
      description: "Description of Item 2",
      imageUrl: "/images/item2.jpg",
    },
    {
      id: 3,
      title: "Item 3",
      description: "Description of Item 3",
      imageUrl: "/images/item3.jpg",
    },
    {
      id: 4,
      title: "Item 4",
      description: "Description of Item 4",
      imageUrl: "/images/item4.jpg",
    },
  ];

  return (
    <div className="bg-custom-background min-h-screen flex flex-col">
      {/* Top Banner with custom green background and rounded bottom corners */}
      <div
        className="fixed top-0 w-full bg-custom-green rounded-b-3xl p-4 z-10"
        style={{ minHeight: "20vh" }}
      >
        {/* Placeholder for any potential top banner content */}
      </div>

      {/* Bottom Banner with slight overlap over the top banner */}
      <div
        className="fixed top-[16vh]  bg-white rounded-lg shadow-lg p-5 mx-3 z-20"
        style={{ minHeight: "15vh" }}
      >
        <div dir="rtl" className="flex justify-between items-center">
          <div className="relative w-16 h-16 p-2">
            <Image
              src="/images/MOHLogo.svg"
              alt="Ministry of Health Logo"
              layout="fill"
              objectFit="contain"
              className="rounded-lg"
            />
          </div>
          <div className="text-black flex-col mx-2">
            <h1 className="text-lg font-bold">لاباس</h1>
            <div className="text-xs ml-4 flex-grow">
              شركة مرخصة من وزارة الصحة وتحمل الترخيص رقم 1234213#
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area starts below both banners */}
      <div className="pt-[35vh] flex-grow overflow-auto">
        {/* Quick Consultation Button visible right underneath the bottom banner */}
        <div className="relative mt-4 mb-6 bg-custom-green p-4 rounded-lg text-right text-white mx-4">
          <h2 className="text-xl font-bold" dir="rtl">
            استشارة طبية فورية{" "}
          </h2>
          <div className="flex justify-between items-center">
            <Image
              src="/images/consultation-icon.svg"
              alt="Consultation Icon"
              width={120}
              height={120}
              className="ml-4"
            />
            <div>
              <p className="my-2 font-bold" dir="rtl">
                اطلب استشارة فورية وتواصل مع طبيب عام خلال ثلاث دقائق{" "}
              </p>
              <p className="my-2" dir="rtl">
                وصفة طبية.{" "}
              </p>
              <p className="my-2" dir="rtl">
                قراءة نتائج تحليل المختبرات.{" "}
              </p>
              <p className="my-2" dir="rtl">
                إعادة صرف الأدوية.{" "}
              </p>
              <p className="font-bold" dir="rtl">
                تواصل مع الطبيب ←
              </p>
            </div>
          </div>
        </div>

        {/* Horizontal List of items */}
        <div className="flex flex-nowrap overflow-x-auto px-4 py-4 gap-4">
          {items.map((item) => (
            <ListItem
              key={item.id}
              title={item.title}
              description={item.description}
              imageUrl={item.imageUrl}
            />
          ))}
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <BottomNavBar currentPath={pathname} />
    </div>
  );
};
