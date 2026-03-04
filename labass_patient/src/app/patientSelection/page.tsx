"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import PatientCard from "./_components/patientSelection/patientCard";
import Header from "../../components/common/header";
import { PlusIcon } from "@heroicons/react/24/solid";
import Spinner from "./_components/patientSelection/spinner";

const PatientSelection: React.FC = () => {
  const router = useRouter();
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedDependentId, setSelectedDependentId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selfPatientProfileId, setSelfPatientProfileId] = useState<number | null>(null);
  const [isSelfInfoComplete, setIsSelfInfoComplete] = useState(false);
  const searchParams = useSearchParams();
  const consultationId = searchParams?.get("consultationId");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("labass_token");
      const headers = { Authorization: `Bearer ${token}` };
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      try {
        // Fetch user info, patient profile, and dependents in parallel
        const [userRes, patientRes, dependentsRes] = await Promise.allSettled([
          axios.get(`${apiUrl}/user`, { headers }),
          axios.get(`${apiUrl}/getPatient`, { headers }),
          axios.get(`${apiUrl}/Dependents`, { headers }),
        ]);

        // Check if self info is complete
        if (userRes.status === "fulfilled") {
          const u = userRes.value.data;
          if (u.firstName && u.lastName && u.nationalId && u.dateOfBirth && u.gender) {
            setIsSelfInfoComplete(true);
          }
        }

        // Store own patientProfile id if it exists
        if (patientRes.status === "fulfilled" && patientRes.value.data?.exists) {
          setSelfPatientProfileId(patientRes.value.data.profile.id);
        }

        // Build patient list
        const defaultPatient = {
          id: 0,
          firstName: "أنا",
          lastName: "",
          nationalId: "123456789",
          dateOfBirth: "1990-01-01",
          gender: "male",
          phoneNumber: "0000000000",
          patientId: null,
        };

        if (dependentsRes.status === "fulfilled" && dependentsRes.value.status === 200) {
          const fetchedPatients = dependentsRes.value.data.map((dependent: any) => ({
            ...dependent.user,
            guardianId: dependent.guardianId,
            patientId: dependent.id,
          }));
          setPatients([defaultPatient, ...fetchedPatients.reverse()]);
        } else {
          setPatients([defaultPatient]);
        }

        setSelectedPatientId("123456789");
      } catch (error) {
        console.error("Error fetching patient data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectPatient = (nationalId: string, patientId: number | null) => {
    setSelectedPatientId(nationalId);
    setSelectedDependentId(patientId);
  };

  const handleNextClick = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("labass_token");
    const headers = { Authorization: `Bearer ${token}` };
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (selectedPatientId === "123456789") {
      // "أنا" selected
      if (isSelfInfoComplete && selfPatientProfileId && consultationId) {
        // Info already in DB — skip completeInfo, link profile and go to chat
        try {
          await axios.post(
            `${apiUrl}/select-patient/${consultationId}`,
            { patientId: selfPatientProfileId },
            { headers }
          );
          router.push(`/chat/${consultationId}`);
        } catch (error) {
          console.error("Error linking patient to consultation:", error);
          setIsLoading(false);
        }
      } else {
        // Info missing — go to completeInfo to fill it in
        router.push(`/completeInfo/?consultationId=${consultationId}`);
      }
    } else if (selectedDependentId && consultationId) {
      // Dependent selected — link and go to chat
      try {
        await axios.post(
          `${apiUrl}/select-patient/${consultationId}`,
          { patientId: selectedDependentId },
          { headers }
        );
        router.push(`/chat/${consultationId}`);
      } catch (error) {
        console.error("Error attaching patient to consultation:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header title="اختر المريض" showBackButton />

      {isLoading ? (
        <div className="flex-grow flex justify-center items-center">
          <Spinner />
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
            disabled={isLoading}
          >
            {isLoading ? <Spinner /> : "التالي"}
          </button>
        </>
      )}
    </div>
  );
};

export default function SuspenseWrapper() {
  return (
    <Suspense fallback={<Spinner />}>
      <PatientSelection />
    </Suspense>
  );
}
