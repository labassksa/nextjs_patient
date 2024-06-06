import React from "react";
import Header from "../../components/profile/header";
import Menu from "../../components/profile/menu";
import AddressAndWhatsAppSection from "../../components/profile/addresandCustomerSupport";

const ProfilePage: React.FC = () => {
  return (
    <div className="profile-page bg-gray-100 min-h-screen p-4 text-black">
      <Header />
      <Menu />
      <AddressAndWhatsAppSection/>
    </div>
  );
};

export default ProfilePage;
