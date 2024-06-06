import React from "react";
import { PersonRounded } from "@mui/icons-material";

const Header: React.FC = () => {
  return (
    <div className="header flex flex-col justify-between items-center mb-4 ">
      <h1 className=" font-bold text-lg text-gray-500">المزيد</h1>
      <div
        className="w-full flex flex-row items-center justify-start mt-2 mb-4"
        dir="rtl"
      >
        <div className="flex items-center"></div>
        <PersonRounded className="text-gray-500" />
        <div className="flex flex-col mr-2 text-right justify-end">
          <p className="font-semibold">أهلاً </p>
          <a href="/login" className="text-blue-500">
            تسجيل الدخول
          </a>
        </div>
      </div>
    </div>
  );
};

export default Header;
