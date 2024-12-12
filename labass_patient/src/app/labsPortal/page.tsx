"use client";

import React, { useState, useEffect } from "react";
import LabPatientCard from "./_components/patientsCard";
import Header from "../../components/common/header";
import LabBottomNavBar from "./_components/bottomNavBar";
import LabUserRegistrationForm from "./_components/labUserRegistrationForm";
import { getLabPatients } from "./_controllers/getLabPatients";

interface LabPatient {
  id: number;
  phoneNumber: string;
  firstName: string | null;
  lastName: string | null;
  createdAt: string;
  role: string[];
  duplicateCount?: number; // New field to track duplicates
}

const LabPatientsPage = () => {
  const [currentView, setCurrentView] = useState<"patients" | "registration">(
    "patients"
  );
  const [patients, setPatients] = useState<LabPatient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentView === "patients") {
      const loadPatients = async () => {
        setIsLoading(true);
        setError("");
        try {
          const result = await getLabPatients();
          if (result.success) {
            // Group by phoneNumber and count duplicates
            const patientMap = new Map<string, LabPatient>();
            result.data.forEach((patient: LabPatient) => {
              if (patientMap.has(patient.phoneNumber)) {
                const existingPatient = patientMap.get(patient.phoneNumber)!;
                existingPatient.duplicateCount =
                  (existingPatient.duplicateCount || 1) + 1;
              } else {
                patientMap.set(patient.phoneNumber, {
                  ...patient,
                  duplicateCount: 1,
                });
              }
            });
            setPatients(Array.from(patientMap.values()));
          } else {
            setError(result.message || "No patients found.");
          }
        } catch (error: any) {
          console.error(error);
          setError(error.message || "Failed to load patients.");
        } finally {
          setIsLoading(false);
        }
      };

      loadPatients();
    }
  }, [currentView]);

  const handleToggleView = (view: "patients" | "registration") => {
    setCurrentView(view);
  };

  const totalDuplicateCodes = patients.reduce(
    (sum, patient) => sum + (patient.duplicateCount || 1),
    0
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Header */}
      <Header
        title={currentView === "patients" ? "المرضى" : "تسجيل مستخدم جديد"}
      />

      {/* Fixed Banner Below Header */}
      {currentView === "patients" && (
        <div className="fixed top-16 left-0 w-full bg-blue-100 py-2 px-4 shadow-md flex justify-between items-center z-10">
          <p className="text-sm text-blue-700 font-semibold">
            {`عدد العملاء: ${patients.length}`}
          </p>
          <p className="text-sm text-green-700 font-semibold">
            {`مجموع الأكواد المرسلة: ${totalDuplicateCodes}`}
          </p>
        </div>
      )}

      {/* Content */}
      <div className="pt-28 pb-28">
        {currentView === "patients" ? (
          isLoading ? (
            <div className="flex items-center justify-center min-h-[50vh]">
              <p className="spinner "></p>
            </div>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : patients.length === 0 ? (
            <p className="text-center text-gray-500">لا يوجد مرضى حاليًا</p>
          ) : (
            <div>
              {/* Patients List */}
              {patients.map((patient) => (
                <LabPatientCard
                  key={patient.phoneNumber} // Grouped by phoneNumber
                  patientName={
                    patient.firstName
                      ? `${patient.firstName} ${patient.lastName || ""}`
                      : `غير معروف`
                  }
                  date={new Date(patient.createdAt).toLocaleString("ar-EG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  packageType={patient.role.join(", ")}
                  additionalInfo={`عدد الرموز المرسلة للعميل: ${
                    patient.duplicateCount || 1
                  }`}
                  onSelect={() =>
                    console.log(
                      `Selected patient: ${patient.phoneNumber} (${patient.id})`
                    )
                  }
                />
              ))}
            </div>
          )
        ) : (
          <LabUserRegistrationForm />
        )}
      </div>

      <LabBottomNavBar
        onToggleView={handleToggleView}
        currentView={currentView}
      />
    </div>
  );
};

export default LabPatientsPage;
