// MyConsultationsPage.js
"use client";
import React, { useState, useEffect } from "react";
import ConsultationCard from "./_components/myConsultation/card";
import BottomNavBar from "../../components/common/BottomNavBar";
import Header from "../../components/common/header";
import { usePathname } from "next/navigation";
// import { fetchConsultations } from "../../controllers/consultation.controller"; // adjust the path as necessary
import { mockConsultations } from "../../utils/mockedConsultation";
import { Consultation } from "../../models/consultation";

const MyConsultationsPage = () => {
  const pathname = usePathname();
  // Initialize the state with an empty array of Consultation type
  const [consultations, setConsultations] = useState<Consultation[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    //Use this to fetch consultations 

    // const loadData = async () => {
    //   const result = await fetchConsultations();
    //   if (result) {
    //     if (result.success) {
    //       setConsultations(result.data);
    //     } else {
    //       setError(result.message || "maybe no consultations ");
    //     }
    //   } else {
    //     setError("Failed to fetch data.");
    //   }
    // };

    // loadData();
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
              onSelect={(id) => console.log("Selected consultation ID:", id)}
              onChatClick={function (id: number): void {
                throw new Error("Function not implemented.");
              }}
            />
          ))
        )}
      </div>
      <BottomNavBar currentPath={pathname} />
    </div>
  );
};

export default MyConsultationsPage;
