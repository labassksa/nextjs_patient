import React from "react";
import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/solid";
import { Person2Rounded } from "@mui/icons-material";
import DoctorsHeader from "./_components/header";

const DoctorsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <DoctorsHeader />
      <div className="p-4 pt-28 text-right leading-relaxed text-gray-800">
        {/* Placeholder for policy text */}

        <div className="flex p-2 m-2 rounded-lg border shadow border-gray-300 bg-white">
          <div className="w-full flex flex-col justify-between" dir="rtl">
            <div className="flex flex-row justify-between mb-2">
              <div className="flex flex-row items-center">
                <img
                  src="/images/dr_mohammed.jpg"
                  alt="د. محمد"
                  className="w-12 h-12 rounded-full ml-2"
                />
                <div className="flex flex-col jus">
                  <h3 className="font-bold text-md text-black" dir="rtl">
                    د. محمد ماهر عبدالله عوض الكريم
                  </h3>
                  <h3 className="font-normal text-sm text-black" dir="rtl">
                    الجنسية: سوداني
                  </h3>
                  <h3 className="font-normal text-sm text-black" dir="rtl">
                    طبيب عام{" "}
                  </h3>
                  <h3
                    className="font-normal text-sm text-custom-green mt-2"
                    dir="rtl"
                  >
                    طبيب مرخص من هيئة التخصصات الصحية ترخيص رقم 1287495
                  </h3>
                  <h3
                    className="font-normal text-sm text-custom-green mt-2"
                    dir="rtl"
                  >
                    الخبرة: سنتين{" "}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorsPage;
