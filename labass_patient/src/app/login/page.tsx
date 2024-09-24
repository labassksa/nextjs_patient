"use client";
import React from "react";
import SimpleLoginForm from "./_components/login/form";
import { useRouter } from "next/navigation";
import { ArrowForward } from "@mui/icons-material"; // Use right arrow icon for Arabic RTL layout

const LoginPage: React.FC = () => {
  const router = useRouter();

  const handleBackClick = () => {
    router.back(); // Navigate to the previous page
  };

  return (
    <div
      className="flex flex-col justify-between text-lg text-black bg-white min-h-screen rtl"
      style={{ overflow: "hidden", height: "100vh" }}
    >
      <div className="flex items-center justify-end m-6">
        {/* Back button with right-pointing arrow */}
        <h1 className="text-bold text-3xl ml-2">تسجيل الدخول</h1>
        <button
          onClick={handleBackClick}
          className="text-custom-green text-sm flex items-center"
        >
          <ArrowForward className="text-gray-400 ml-2" />{" "}
          {/* Right-pointing arrow */}
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <SimpleLoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
