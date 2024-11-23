"use client";

import React from "react";
import TopBanner from "./_components/topBanner";
import BottomBanner from "./_components/bottomBanner";
import MarketerRegistrationForm from "./_components/marketerRegistrationForm";
import PromoCodeInfo from "./_components/promoCodeInfo";
import EarningsInfo from "./_components/earningsInfo";

const BecomeAMarketerPage = () => {
  return (
    <div className="relative pb-20 bg-white">
      {/* Banners */}
      <TopBanner />
      <BottomBanner />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 pt-40 space-y-8">
        {/* Back Button */}

        <EarningsInfo />
        {/* Promo Codes Section */}
        <PromoCodeInfo />

        {/* Earnings Section */}

        {/* Registration Form */}
        <div className="bg-white p-6 rounded-lg shadow-lg text-black">
          <h1 className="text-3xl font-bold mb-4">Become a Marketer</h1>
          <p className="text-lg mb-6">
            Join our marketing program and earn by promoting our services. Start
            by registering below to access your promo codes and weekly earnings.
          </p>
          <MarketerRegistrationForm />
        </div>
      </div>
    </div>
  );
};

export default BecomeAMarketerPage;
