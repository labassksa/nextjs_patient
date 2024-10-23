"use client";
import React, { Suspense } from "react";
import Header from "../../components/common/header";
import PersonalInfoForm from "./_components/form";
import Spinner from "./_components/spinner"; // Import the Spinner component

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

// Wrap in Suspense to handle any client-side fetching and ensure the `useSearchParams` (if used inside `PersonalInfoForm`) works properly.
export default function SuspenseWrapper() {
  return (
    <Suspense fallback={<Spinner />}>
      <PersonalInfo />
    </Suspense>
  );
}
