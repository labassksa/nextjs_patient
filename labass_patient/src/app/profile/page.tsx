"use client";
import React from "react";
import BottomNavBar from "../../components/BottomNavBar";
import { usePathname } from "next/navigation";

const ProfilePage: React.FC = () => {
  const pathname = usePathname();
  return (
    <div>
      <div className="bg-custom-background min-h-screen flex-col text-blue-600">
        <div className="pt-[28vh] overflow-auto px-4 flex-grow">
          <h1>Profile Page</h1>
          <h1>Profile Page</h1>
          <p>Welcome to your profile.</p>
        </div>
        <BottomNavBar currentPath={pathname} />
      </div>
    </div>
  );
};

export default ProfilePage;
