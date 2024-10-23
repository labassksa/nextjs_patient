"use client";

import React, { Suspense } from "react";
import Header from "../../components/common/header";
import dynamic from "next/dynamic";
import Spinner from "./_components/spinner";

// Dynamically import PersonalInfoForm
const PersonalInfoForm = dynamic(() => import("./_components/form"), {
  ssr: false, // Disable SSR for the form
  loading: () => <Spinner />, // Show spinner while loading
});

const PersonalInfo = () => {
  return (
    <div className="flex flex-col bg-gray-100 min-h-screen">
      <Header title="أدخل المعلومات الشخصية" showBackButton />
      <div className="pt-16 w-full">
        <PersonalInfoForm />
      </div>
    </div>
  );
};

// Wrap the entire component in Suspense for client-side fetching
export default function SuspenseWrapper() {
  return (
    <Suspense fallback={<Spinner />}>
      <PersonalInfo />
    </Suspense>
  );
}
