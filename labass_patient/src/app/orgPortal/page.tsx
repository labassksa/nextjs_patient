"use client";

import React, { useState, useEffect } from "react";
import LabPatientCard from "./_components/patientsCard";
import Header from "../../components/common/header";
import LabBottomNavBar from "./_components/bottomNavBar";
import ConsultationTypeSection from "./_components/ConsultationTypeSection";
import ConsultationPriceSection from "./_components/ConsultationPriceSection";
import PaymentMethodSection from "./_components/PaymentMethodSection";
import { getLabPatients } from "./_controllers/getLabPatients";
import { getOrganization } from "./_controllers/getOrganization";
import { DealType } from "./_types/dealType";
import { OrganizationTypes } from "./_types/organizationTypes";
import { PaymentMethod } from "./_types/paymentMethodTypes";
import OrgUserRegistrationForm from "./_components/orgUserRegistrationForm";

interface OrgPatient {
  id: number;
  phoneNumber: string;
  firstName: string | null;
  lastName: string | null;
  createdAt: string;
  role: string[];
  duplicateCount?: number;
}

const OrgPatientsPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<"patients" | "registration">(
    "registration"
  );
  const [patients, setPatients] = useState<OrgPatient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // DealType and Organization Type
  const [dealType, setDealType] = useState<DealType | "">("");
  const [orgType, setOrgType] = useState<OrganizationTypes | "">("");

  // Form Data
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [nationality, setNationality] = useState("سعودي");
  const [gender, setGender] = useState("");
  const [nationalId, setNationalId] = useState("");

  // Consultation Type and Files
  const [consultationType, setConsultationType] = useState<string>("");
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);

  // Payment Method and Prices
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");
  const [cashPrice, setCashPrice] = useState<number | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const possiblePrices = [15, 25, 35, 50];

  const possiblePaymentMethods: PaymentMethod[] =
    dealType === DealType.SUBSCRIPTION
      ? ["online", "cash"]
      : dealType === DealType.REVENUE_SHARE
      ? ["online", "cash"]
      : [];

  useEffect(() => {
    const fetchOrg = async () => {
      const orgResponse = await getOrganization();
      if (orgResponse.success && orgResponse.data) {
        setDealType(orgResponse.data.dealType);
        setOrgType(orgResponse.data.type);
      } else {
        console.warn("Failed to fetch organization or no data returned.");
      }
    };

    fetchOrg();
  }, []);

  const handleSubmit = async () => {
    if (phone.length !== 10) {
      alert("يرجى إدخال رقم جوال صحيح مكون من 10 أرقام.");
      return;
    }

    if (consultationType === "استشارة بعد التحليل" && pdfFiles.length === 0) {
      alert("يرجى تحميل ملف أو أكثر بصيغة PDF عند اختيار استشارة بعد التحليل.");
      return;
    }
    if (
      !name ||
      !phone ||
      !age ||
      !nationality ||
      !gender ||
      !consultationType
    ) {
      alert("يرجى ملء جميع الحقول المطلوبة.");
      return;
    }

    const formData = {
      name,
      phoneNumber: phone.startsWith("0")
        ? `+966${phone.slice(1)}`
        : `+966${phone}`,
      dateOfBirth,
      nationality,
      gender,
      nationalId,
      consultationType,
      pdfFiles,
      paymentMethod,
      cashPrice,
      selectedPrice,
    };

    try {
      const result = await getLabPatients();
      if (result.success) {
        alert(`تم تسجيل المريض ${name} بنجاح.`);
        setName("");
        setPhone("");
        setAge("");
        setNationality("سعودي");
        setGender("");
        setNationalId("");
        setConsultationType("");
        setPdfFiles([]);
        setPaymentMethod("");
        setCashPrice(null);
        setSelectedPrice(null);
      } else {
        alert("فشل في تسجيل المريض.");
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء التسجيل.");
    }
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
                      : "غير معروف"
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
            <OrgUserRegistrationForm
              orgType={orgType}
              name={name}
              setName={setName}
              phone={phone}
              setPhone={setPhone}
              age={age}
              setAge={setAge}
              dateOfBirth={dateOfBirth}
              setDateOfBirth={setDateOfBirth}
              nationality={nationality}
              setNationality={setNationality}
              gender={gender}
              setGender={setGender}
              nationalId={nationalId}
              setNationalId={setNationalId}
              pdfFiles={pdfFiles}
              setPdfFiles={setPdfFiles}
            />

            <ConsultationTypeSection
              orgType={orgType}
              testType={consultationType}
              setTestType={setConsultationType}
              pdfFiles={pdfFiles}
              setPdfFiles={setPdfFiles}
            />

            <PaymentMethodSection
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              possiblePaymentMethods={possiblePaymentMethods}
              cashPrice={cashPrice}
              setCashPrice={setCashPrice}
            />

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

      <div className="fixed bottom-12 left-0 w-full px-4">
        <button
          onClick={handleSubmit}
          className="w-full bg-custom-green text-white py-3 px-4 rounded-md"
        >
          إرسال استشارة طبية
        </button>
      </div>

      <LabBottomNavBar
        onToggleView={setCurrentView}
        currentView={currentView}
      />
    </div>
  );
};

export default OrgPatientsPage;
