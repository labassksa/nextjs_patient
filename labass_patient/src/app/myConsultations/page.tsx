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
      try {
        const result = await fetchConsultations();
        setConsultations(result);
      } catch (error) {
        console.log(`${error}`);
        setError("Failed to fetch data. ");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="استشاراتي" />
      <div className="pt-16">
        {isLoading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          consultations.map((consultation) => (
            <ConsultationCard
              key={consultation.id}
              consultation={consultation}
              onSelect={(id: any) =>
                console.log("Selected consultation ID:", id)
              }
              onChatClick={(id: any) => console.log("Chat clicked for ID:", id)}
            />
          ))
        )}
      </div>
      <BottomNavBar currentPath={pathname} />
    </div>
  );
};

export default MyConsultationsPage;
