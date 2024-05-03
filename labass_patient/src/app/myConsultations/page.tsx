"use client";
import React from "react";
import BottomNavBar from "../../components/BottomNavBar";
import { usePathname } from "next/navigation";

const MyConsultationsPage: React.FC = () => {
  const pathname = usePathname();
  return (
    <div>
      <h1 className="text-blue-500">My Consultations</h1>
      <p>View all your consultations here.</p>
      <BottomNavBar currentPath={pathname} />
    </div>
  );
};

export default MyConsultationsPage;
