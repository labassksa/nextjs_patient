import React from "react";
import { LocationOn, WhatsApp } from "@mui/icons-material";

const AddressAndWhatsAppSection: React.FC = () => {
  const whatsappLink = "https://wa.me/message/O3GWSJL2NBLAA1"; // Replace with your WhatsApp number

  return (
    <div className="flex flex-col bg-white p-4 rounded-lg shadow-sm">
      <div className="flex flex-row justify-end items-center mb-2">
        <div className="text-right">
          <p className="text-sm font-semibold"> العنوان</p>
          <p className="text-gray-500 text-sm" dir="rtl">
            <LocationOn className="inline-block text-gray-400" />
            الرياض طريق الأمير بندر بن عبدالعزيز مبنى رقم 3486 {" "}
          </p>
        </div>
      </div>
      <div className="flex flex-row justify-end items-center">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-custom-green flex items-center text-sm"
        >
          <WhatsApp className="mr-2" />
          <span>تواصل عبر واتساب</span>
        </a>
      </div>
    </div>
  );
};

export default AddressAndWhatsAppSection;
