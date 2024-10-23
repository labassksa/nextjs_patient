"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import PatientCard from "./_components/patientSelection/patientCard";
import Header from "../../components/common/header";
import { PlusIcon } from "@heroicons/react/24/solid";
import Spinner from "./_components/patientSelection/spinner"; // Import the Spinner component

const PatientSelection: React.FC = () => {
  const router = useRouter();
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  );
  const [selectedDependentId, setSelectedDependentId] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const searchParams = useSearchParams();
  const consultationId = searchParams?.get("consultationId");

  // Fetch dependents from the API
  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true); // Start loading
      try {
        const token = localStorage.getItem("labass_token");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/Dependents`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          const fetchedPatients = response.data.map((dependent: any) => ({
            ...dependent.user, // Extract user information
            guardianId: dependent.guardianId,
            patientId: dependent.id, // This is the key for selecting the dependent
          }));

          // Add the default "أنا" (myself) patient at the beginning of the list
          const defaultPatient = {
            id: 0,
            firstName: "أنا",
            lastName: "",
            nationalId: "123456789", // Default nationalId for "أنا"
            dateOfBirth: "1990-01-01", // Default DOB for "أنا"
            gender: "male", // Default gender for "أنا"
            phoneNumber: "0000000000", // Default phone number
            patientId: null, // No patientId for "أنا"
          };

          // Reverse fetchedPatients to show the most recent ones first
          setPatients([defaultPatient, ...fetchedPatients.reverse()]);
          setSelectedPatientId(defaultPatient.nationalId); // Select "أنا" by default
        }
      } catch (error) {
        console.error("Error fetching dependents:", error);
      } finally {
        setIsLoading(false); // End loading
      }
    };

    fetchPatients();
  }, []);

  // Handle patient selection
  const handleSelectPatient = (
    nationalId: string,
    patientId: number | null
  ) => {
    setSelectedPatientId(nationalId);
    setSelectedDependentId(patientId); // Store patientId to use in POST request
  };

  // Handle the "next" button click
  const handleNextClick = async () => {
    setIsLoading(true); // Start loading when the button is clicked
    if (selectedPatientId === "123456789") {
      // If "أنا" is selected, navigate to fillPersonalInfo page
      router.push(`/fillPatientInfo/?consultationId=${consultationId}`);
    } else if (selectedDependentId && consultationId) {
      // If another patient is selected, make a POST request to attach the patient to the consultation
      const token = localStorage.getItem("labass_token");
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/select-patient/${consultationId}`,
          { patientId: selectedDependentId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Redirect to the next page after successful attachment
        router.push(`/chat/${consultationId}`);
      } catch (error) {
        console.error("Error attaching patient to consultation:", error);
      } finally {
        setIsLoading(false); // End loading after navigation or error
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header title="اختر المريض" showBackButton />

      {isLoading ? (
        <div className="flex-grow flex justify-center items-center">
          <Spinner /> {/* Loading spinner while fetching */}
        </div>
      ) : (
        <>
          <div className="flex-grow pt-16 px-2" dir="rtl">
            <div
              className="flex flex-row flex-wrap gap-2 overflow-y-auto"
              style={{ maxHeight: "calc(100vh - 160px)" }}
            >
              <button
                className="self-start w-24 h-28 text-sm py-2 px-4 bg-gray-100 rounded-lg text-black flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                onClick={() =>
                  router.push(`/addPatient/?consultationId=${consultationId}`)
                }
              >
                <PlusIcon className="h-6 w-6 mb-2" />
                إضافة مريض
              </button>
              {patients.map((patient) => (
                <PatientCard
                  key={patient.nationalId}
                  patient={patient}
                  isSelected={selectedPatientId === patient.nationalId}
                  onSelect={() =>
                    handleSelectPatient(patient.nationalId, patient.patientId)
                  }
                />
              ))}
            </div>
          </div>

          <button
            className="w-full py-3 bg-custom-green text-white rounded-3xl shadow sticky bottom-12 flex justify-center items-center"
            onClick={handleNextClick}
            disabled={isLoading} // Disable the button while loading
          >
            {isLoading ? <Spinner /> : "التالي"}{" "}
            {/* Show spinner when loading */}
          </button>
        </>
      )}
    </div>
  );
};

// Wrap in Suspense to handle useSearchParams
export default function SuspenseWrapper() {
  return (
    <Suspense fallback={<Spinner />}>
      <PatientSelection />
    </Suspense>
  );
}
