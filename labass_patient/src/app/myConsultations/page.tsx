// MyConsultationsPage.tsx
"use client";
import React, { useState, useEffect } from "react";
import ConsultationCard from "./_components/myConsultation/card"; // Adjust the import path based on your structure
import BottomNavBar from "../../components/common/BottomNavBar";
import Header from "../../components/common/header";
import { usePathname } from "next/navigation";
import { fetchConsultations } from "./_controllers/myConsultations"; // Adjust the path as necessary
import { Consultation } from "../../models/consultation";

const MyConsultationsPage = () => {
  const pathname = usePathname();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(""); // Reset error on each new load
      try {
        const result = await fetchConsultations();
        if (result.length === 0) {
          setError("No consultations found.");
        } else {
          // Sort consultations by createdAt date, newest first
          const sortedConsultations = result.sort((a: Consultation, b: Consultation) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
          setConsultations(sortedConsultations);
        }
      } catch (error: any) {
        console.error(error);
        setError(error.message); // Set the error message to display on screen
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 mb-16">
      <Header title="استشاراتي" />
      <div className="pt-16">
        {isLoading ? (
          <p className="spinner text-gray-500"></p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : consultations.length === 0 ? (
          <p className="text-center text-gray-500">لا يوجد لديك استشارات</p>
        ) : (
          consultations.map((consultation) => (
            <ConsultationCard
              key={consultation.id}
              consultation={consultation}
              onSelect={(id: any) =>
                console.log("Selected consultation ID:", id)
              }
            />
          ))
        )}
      </div>
      <BottomNavBar currentPath={pathname} />
    </div>
  );
};

export default MyConsultationsPage;
