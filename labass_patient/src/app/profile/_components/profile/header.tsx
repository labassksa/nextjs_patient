"use client";
import React, { useEffect, useState } from "react";
import { PersonRounded } from "@mui/icons-material";
import { useRouter } from "next/navigation"; // Import the router

const Header: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track if the user is authenticated
  const router = useRouter();

  useEffect(() => {
    // Check if 'labass_token' exists in localStorage
    const token = localStorage.getItem("labass_token");
    if (token) {
      setIsAuthenticated(true); // User is authenticated
    }
  }, []);

  const handleLoginClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push("/login"); // Navigate to login page
  };

  return (
    <div className="header flex flex-col justify-between items-center mb-4">
      <h1 className=" font-bold text-lg text-gray-500">المزيد</h1>
      <div
        className="w-full flex flex-row items-center justify-start mt-2 mb-4"
        dir="rtl"
      >
        <div className="flex items-center"></div>
        <PersonRounded className="text-gray-500" />
        <div className="flex flex-col mr-2 text-right justify-end">
          <p className="font-semibold">أهلاً </p>
          {/* Conditionally render the 'تسجيل الدخول' link if not authenticated */}
          {!isAuthenticated && (
            <a
              href="/login"
              className="text-blue-500"
              onClick={handleLoginClick}
            >
              تسجيل الدخول
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
