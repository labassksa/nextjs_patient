"use client";
import React from "react";
import Header from "../../components/profile/header";
import Menu from "../../components/profile/menu";
import AddressAndWhatsAppSection from "../../components/profile/addresandCustomerSupport";
import BottomNavBar from "../../components/BottomNavBar";
import { usePathname } from "next/navigation";
import ComplaintsSection from "../../components/profile/complaints";

const ProfilePage: React.FC = () => {
  const pathname = usePathname();
  return (
    <div className="profile-page bg-gray-100 min-h-screen p-4 text-black">
      <Header />
      <Menu />
      <AddressAndWhatsAppSection />
      <ComplaintsSection />
      <BottomNavBar currentPath={pathname} />
    </div>
  );
};

export default ProfilePage;
