"use client";
import React from "react";
import Header from "./_components/profile/header";
import Menu from "./_components/profile/menu";
import AddressAndWhatsAppSection from "./_components/profile/addresandCustomerSupport";
import BottomNavBar from "../../components/common/BottomNavBar";
import { usePathname } from "next/navigation";
import ComplaintsSection from "./_components/profile/complaints";

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
