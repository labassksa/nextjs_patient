"use client";

import React, { useState, useEffect } from "react";
import LabPatientCard from "./_components/patientsCard";
import Header from "../../components/common/header";
import LabBottomNavBar from "./_components/bottomNavBar";
import LabUserRegistrationForm from "./_components/LabUserRegistrationForm";
import ConsultationTypeSection from "./_components/ConsultationTypeSection";
import ConsultationPriceSection from "./_components/ConsultationPriceSection";
import PaymentMethodSection from "./_components/PaymentMethodSection";
import { getLabPatients } from "./_controllers/getLabPatients";
import { getOrganization } from "./_controllers/getOrganization";
import { DealType } from "./_types/dealType";
import { OrganizationTypes } from "./_types/organizationTypes";
import { PaymentMethod } from "./_types/paymentMethodTypes";

interface LabPatient {
  id: number;
  phoneNumber: string;
  firstName: string | null;
  lastName: string | null;
  createdAt: string;
  role: string[];
  duplicateCount?: number;
}

const LabPatientsPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<"patients" | "registration">(
    "registration"
  );
  const [patients, setPatients] = useState<LabPatient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // DealType: SUBSCRIPTION or REVENUE_SHARE (or empty)
  const [dealType, setDealType] = useState<DealType | "">("");
  const [orgType, setOrgType] = useState<OrganizationTypes | "">("");

  // Consultation type and files
  const [consultationType, setConsultationType] = useState<string>("");
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);

  // Payment Method and Prices
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");
  const [cashPrice, setCashPrice] = useState<number | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const possiblePrices = [15, 25, 35, 50];

  // Payment methods based on dealType
  const subscriptionPaymentMethods: PaymentMethod[] = [
    "online",
    "cash",
    "free",
  ];
  const revenueSharePaymentMethods: PaymentMethod[] = ["online", "cash"];

  const possiblePaymentMethods: PaymentMethod[] =
    dealType === DealType.SUBSCRIPTION
      ? subscriptionPaymentMethods
      : dealType === DealType.REVENUE_SHARE
      ? revenueSharePaymentMethods
      : [];

  useEffect(() => {
    const fetchOrg = async () => {
      const orgResponse = await getOrganization();
      if (orgResponse.success && orgResponse.data) {
        if (
          orgResponse.data.dealType === DealType.REVENUE_SHARE ||
          orgResponse.data.dealType === DealType.SUBSCRIPTION
        ) {
          setDealType(orgResponse.data.dealType);
        }
        if (
          orgResponse.data.type === OrganizationTypes.Pharmacy ||
          orgResponse.data.type === OrganizationTypes.Laboratory
        ) {
          setOrgType(orgResponse.data.type);
        }
      } else {
        console.warn("Failed to fetch organization or no data returned.");
      }
    };

    fetchOrg();
  }, []);

  useEffect(() => {
    if (currentView === "patients") {
      loadPatients();
    }
  }, [currentView]);

  const loadPatients = async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await getLabPatients();
      if (result.success) {
        const patientMap = new Map<string, LabPatient>();
        result.data.forEach((p: LabPatient) => {
          if (patientMap.has(p.phoneNumber)) {
            const existing = patientMap.get(p.phoneNumber)!;
            existing.duplicateCount = (existing.duplicateCount || 1) + 1;
          } else {
            patientMap.set(p.phoneNumber, { ...p, duplicateCount: 1 });
          }
        });
        setPatients(Array.from(patientMap.values()));
      } else {
        setError(result.message || "No patients found.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load patients.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleView = (view: "patients" | "registration") => {
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        title={
          currentView === "patients"
            ? "متابعة الاستشارات"
            : "إرسال استشارة طبية"
        }
      />

      {currentView === "patients" && (
        <div
          className={`${
            dealType ? "top-28" : "top-16"
          } fixed left-0 w-full bg-blue-100 py-2 px-4 shadow-md flex justify-between items-center z-10`}
        >
          <p className="text-sm text-blue-700 font-semibold">
            {`عدد العملاء: ${patients.length}`}
          </p>
        </div>
      )}

      <div className={`pt-${dealType ? "40" : "28"} pb-28`}>
        {currentView === "patients" ? (
          isLoading ? (
            <div className="flex items-center justify-center min-h-[50vh]">
              <p className="spinner"></p>
            </div>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : patients.length === 0 ? (
            <p className="text-center text-gray-500">لا يوجد مرضى حاليًا</p>
          ) : (
            <div>
              {patients.map((p) => (
                <LabPatientCard
                  key={p.phoneNumber}
                  patientName={
                    p.firstName
                      ? `${p.firstName} ${p.lastName || ""}`
                      : `غير معروف`
                  }
                  date={new Date(p.createdAt).toLocaleString("ar-EG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  packageType={p.role.join(", ")}
                  additionalInfo={`عدد الرموز المرسلة للعميل: ${
                    p.duplicateCount || 1
                  }`}
                  onSelect={() =>
                    console.log(
                      `Selected patient: ${p.phoneNumber} (ID ${p.id})`
                    )
                  }
                />
              ))}
            </div>
          )
        ) : (
          <div className="mt-16">
            <LabUserRegistrationForm
              orgType={orgType}
              onSubmit={(formData) => console.log(formData)}
            />

            <ConsultationTypeSection
              orgType={orgType}
              testType={consultationType}
              setTestType={setConsultationType}
              pdfFiles={pdfFiles}
              setPdfFiles={setPdfFiles}
            />

            {dealType !== DealType.SUBSCRIPTION && (
              <PaymentMethodSection
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                possiblePaymentMethods={possiblePaymentMethods}
                cashPrice={cashPrice}
                setCashPrice={setCashPrice}
              />
            )}
            {paymentMethod === "online" &&
              dealType === DealType.REVENUE_SHARE && (
                <ConsultationPriceSection
                  selectedPrice={selectedPrice}
                  onChange={(price) => setSelectedPrice(price)}
                  possiblePrices={possiblePrices}
                />
              )}
          </div>
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
