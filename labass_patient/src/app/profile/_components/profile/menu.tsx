"use client";
import React from "react";
import Link from "next/link";
import { ArrowBackIos } from "@mui/icons-material";

const menuItems = [
  { title: "الأطباء", href: "/doctors" },
  { title: "الشروط والأحكام", href: "/termsandConditions" },
  { title: "سياسة الخصوصية", href: "/privacyPolicy" },
  //   { title: "تواصل معنا", href: "/profile/contact" },
  { title: "قائمة الأسعار", href: "/pricingList" },
  { title: "ربط التأمين", href: "/linkInsurance" },
];

const Menu: React.FC = () => {
  return (
    <div className="menu">
      {menuItems.slice(0, 4).map((item, index) => (
        <Link href={item.href} key={index}>
          <div className="menu-item flex justify-between items-center bg-white p-4 mb-2 rounded-lg shadow-xs cursor-pointer">
            <ArrowBackIos className="text-gray-400" />
            <span>{item.title}</span>
          </div>
        </Link>
      ))}
      <div className="mt-4">
        {menuItems.slice(4).map((item, index) => (
          <Link href={item.href} key={index}>
            <div className="menu-item flex justify-between items-center bg-white p-4 mb-8 rounded-lg shadow-sm cursor-pointer">
              <ArrowBackIos className="text-gray-400" />
              <span>{item.title}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Menu;
