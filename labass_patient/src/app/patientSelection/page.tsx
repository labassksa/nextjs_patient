"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import User from "../../models/user";
import PatientCard from "../../components/patientSelection/patientCard";
import Header from "../../components/common/header";
import { PlusIcon } from "@heroicons/react/24/solid"; // Ensure the icon is imported correctly

const PatientSelection: React.FC = () => {
  const router = useRouter();
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  );

  const patients: User[] = [
    new User(0, "أنا", "", "123456789", "1990-01-01", "male"),
    new User(1, "محمد", "سمير", "987654321", "1992-07-15", "male"),
    new User(2, "أماني", "مرتضى", "192837465", "1993-05-20", "female"),
  ];

  const handleSelectPatient = (nationalId: string) => {
    setSelectedPatientId(nationalId);
  };

  return (
    <div className="min-h-screen bg-white flex">
      <Header title="أدخل المعلومات الشخصية" showBackButton />
      <div className="flex flex-col justify-between m-2 w-full">
        <div className="pt-16 px-2" dir="rtl">
          <div className="flex flex-row gap-2 flex-wrap">
            <button
              className="self-start w-24 h-28 text-sm py-2 px-4 bg-gray-100 rounded-lg text-black flex flex-col items-center justify-center"
              onClick={() => router.push("/path/to/add/patient")}
            >
              <PlusIcon className="h-6 w-6 mb-2" />{" "}
              {/* Adjusted icon size and margin */}
              إضافة مريض
            </button>
            {patients.map((patient) => (
              <PatientCard
                key={patient.nationalId}
                patient={patient}
                isSelected={selectedPatientId === patient.nationalId}
                onSelect={handleSelectPatient}
              />
            ))}
          </div>
        </div>
        <button
          className="w-full py-3 bg-custom-green text-white rounded-3xl shadow sticky bottom-12"
          onClick={() => router.push("/path/to/consultation")}
        >
          التالي
        </button>
      </div>
    </div>
  );
};

export default PatientSelection;
