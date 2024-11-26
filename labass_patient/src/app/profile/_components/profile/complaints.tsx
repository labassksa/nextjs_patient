import React from "react";
import { Message, WhatsApp } from "@mui/icons-material";

const ComplaintsSection: React.FC = () => {
  const whatsappLink = "https://wa.me/message/O3GWSJL2NBLAA1"; // Replace with your WhatsApp number

  return (
    <div className="flex flex-col bg-white p-4 rounded-lg shadow-sm mb-6 mt-2">
      <div className="flex flex-row justify-end items-center  ">
        <div className="text-right">
          <p className="text-sm font-semibold"> للشكاوى والاقتراحات</p>
          <p className="text-gray-500 text-sm" dir="rtl">
            <Message className="inline-block text-gray-400" />
            لتقديم الشكاوى والاقتراحات التواصل عن طريق الواتساب أو الاتصال على
            الرقم 0505117551{" "}
          </p>
          <p className="text-black-500 text-sm mt-2 mb-2" dir="rtl">
            أوقات العمل: ٨ صباحا حتى ٥ مساء
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

export default ComplaintsSection;
