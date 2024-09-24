"use client";
import React from "react";
import { PersonRounded } from "@mui/icons-material";
import { useRouter } from "next/navigation"; // Import the router

const Header: React.FC = () => {
  const router = useRouter();

  const handleLoginClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push("/login"); // Navigate to login page
  };

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
          <a href="/login" className="text-blue-500" onClick={handleLoginClick}>
            تسجيل الدخول
          </a>
        </div>
      </div>
    </div>
  );
};

export default Header;
