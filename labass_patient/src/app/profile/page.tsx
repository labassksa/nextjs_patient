"use client";
import React from "react";
import Header from "./_components/profile/header";
import Menu from "./_components/profile/menu";
import AddressAndWhatsAppSection from "./_components/profile/addresandCustomerSupport";
import BottomNavBar from "../../components/common/BottomNavBar";
import { usePathname, useRouter } from "next/navigation";
import ComplaintsSection from "./_components/profile/complaints";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";

const ProfilePage: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = () => {
    localStorage.removeItem("labass_token");
    router.push("/login");
  };

  const navigateToMarketerPage = () => {
    router.push("/becomeAmarketer");
  };

  return (
    <div className="profile-page bg-gray-100 min-h-screen p-4 text-black">
      <Header />

      {/* "Join as a Marketer" Section */}
      <div
        className="bg-blue-500 text-white text-center py-3 mb-4 rounded cursor-pointer hover:bg-blue-600 transition duration-200"
        onClick={navigateToMarketerPage}
      >
        انضم كمسوق
      </div>

      <Menu />
      <AddressAndWhatsAppSection />
      <ComplaintsSection />
      <BottomNavBar currentPath={pathname} />
      <button
        onClick={handleSignOut}
        className="w-full mb-16 py-2.5 px-4 border border-blue-500 text-blue-500 rounded transition duration-200 hover:bg-blue-500 hover:text-white flex items-center justify-center"
      >
        <ArrowRightOnRectangleIcon className="h-6 w-6 mr-2" />
        تسجيل الخروج
      </button>
    </div>
  );
};

export default ProfilePage;
