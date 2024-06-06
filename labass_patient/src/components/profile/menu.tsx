import React from "react";
import { ArrowBackIos } from "@mui/icons-material";

const menuItems = [
  { title: "من نحن" },
  { title: "الشروط والأحكام" },
  { title: "سياسة الخصوصية" },
  { title: "تواصل معنا" },
  { title: "تعديل على المعلومات الشخصيه" },
  { title: "ربط التأمين" },
];

const Menu: React.FC = () => {
  return (
    <div className="menu">
      {menuItems.slice(0, 4).map((item, index) => (
        <div key={index} className="menu-item flex justify-between items-center bg-white p-4 mb-2 rounded-lg shadow-sm">
          <ArrowBackIos className="text-gray-500" />
          <span>{item.title}</span>
        </div>
      ))}
      <div className="mt-4">
        {menuItems.slice(4).map((item, index) => (
          <div key={index} className="menu-item flex justify-between items-center bg-white p-4 mb-2 rounded-lg shadow-sm">
            <ArrowBackIos className="text-gray-500" />
            <span>{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
