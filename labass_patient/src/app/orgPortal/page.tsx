"use client";

import React, { useState, useEffect } from "react";
import Header from "../../components/common/header";
import LabBottomNavBar from "./_components/bottomNavBar";
import ConsultationPriceSection from "./_components/ConsultationPriceSection";
import PaymentMethodSection from "./_components/PaymentMethodSection";
import { getOrganization } from "./_controllers/getOrganization";
import { DealType } from "./_types/dealType";
import { OrganizationTypes } from "./_types/organizationTypes";
import OrgUserRegistrationForm from "./_components/orgUserRegistrationForm";
import { PaymentMethodEnum } from "@/types/paymentMethods";
import { createMagicLink } from "./_controllers/createMagicLink";
import LabPatientCard from "./_components/patientsCard";
import { LabtestType } from "./_types/labTestTypes";
import { Gender } from "./_types/genderType";
import TestTypeSection from "./_components/testType";

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
  const [isLoadingOrg, setIsLoadingOrg] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orgError, setOrgError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [dealType, setDealType] = useState<DealType | "">("");
  const [orgType, setOrgType] = useState<OrganizationTypes | "">("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [nationality, setNationality] = useState("سعودي");
  const [gender, setGender] = useState(Gender.Male);
  const [nationalId, setNationalId] = useState("");
  const [testType, settestType] = useState<LabtestType | "">("");
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodEnum>(
    PaymentMethodEnum.THROUGH_ORGANIZATION
  );
  const [cashPrice, setCashPrice] = useState<number | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);

  const possiblePrices = [80, 70, 50, 35, 25, 15];
  const possiblePaymentMethods: PaymentMethodEnum[] =
    dealType === DealType.SUBSCRIPTION
      ? [
          PaymentMethodEnum.THROUGH_LABASS,
          PaymentMethodEnum.THROUGH_ORGANIZATION,
        ]
      : dealType === DealType.REVENUE_SHARE
      ? [
          PaymentMethodEnum.THROUGH_LABASS,
          PaymentMethodEnum.THROUGH_ORGANIZATION,
        ]
      : [];

  const fetchOrg = async () => {
    setIsLoadingOrg(true);
    setOrgError("");
    try {
      const orgResponse = await getOrganization();
      if (orgResponse.success && orgResponse.data) {
        setDealType(orgResponse.data.dealType);
        setOrgType(orgResponse.data.type);
      } else {
        throw new Error(orgResponse.data.message || "Unknown error occurred.");
      }
    } catch (err: any) {
      const backendMessage =
        err.response?.data?.message || err.message || "Unknown error";
      setOrgError(backendMessage);
    } finally {
      setIsLoadingOrg(false);
    }
  };

  useEffect(() => {
    fetchOrg();
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError("");

    if (!name || !phone || !dateOfBirth || !gender || !nationality) {
      alert("يرجى ملء جميع الحقول المطلوبة.");
      setIsSubmitting(false);
      return;
    }

    const magicLinkData = {
      patientInfo: {
        firstName: name.trim(),
        phoneNumber: phone.startsWith("0")
          ? `+966${phone.slice(1)}`
          : `+966${phone}`,
        role: ["patient"],
        gender,
        nationality,
        nationalId: nationalId.trim() || null,
        dateOfBirth: dateOfBirth.toISOString().split("T")[0],
      },
      paymentMethod,
      orgType,
      dealType,
      consultationPrice: selectedPrice || cashPrice,
      testType,
      pdfFiles: testType === LabtestType.PostTest ? pdfFiles : undefined,
    };

    try {
      const result = await createMagicLink(magicLinkData);
      if (result.success) {
        alert(` ${result.data.link}تم إرسال الاستشارة الطبية للعميل بنجاح`);
      } else {
        throw new Error(result.message);
      }
    } catch (err: any) {
      if (err.message === "Network Error" || !err.response) {
        setSubmitError(
          "خطأ في الاتصال بالشبكة: يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى."
        );
      } else {
        setSubmitError(
          "فشل إنشاء الرابط السحري. يرجى المحاولة مرة أخرى لاحقًا."
        );
      }
    } finally {
      setIsSubmitting(false);
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

      {/* Wrap main content in container for responsiveness */}
      <div
        className={`container mx-auto px-4 pt-${dealType ? "40" : "28"} pb-28`}
      >
        {/* Display org error in a modal if any */}
        {orgError && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center mx-4">
              <p className="text-red-500 text-lg mb-4">{orgError}</p>
              <button
                onClick={fetchOrg}
                className="bg-custom-green text-white py-2 px-4 rounded-md"
                disabled={isLoadingOrg}
              >
                {isLoadingOrg ? (
                  <div className="spinner"></div>
                ) : (
                  "إعادة المحاولة"
                )}
              </button>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoadingOrg ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="spinner"></div>
          </div>
        ) : (
          // Use grid to separate content or adapt for wide screens
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {currentView === "patients" ? (
              <div>
                {/* Patients List */}
                {patients.length === 0 ? (
                  <p className="text-center text-gray-500">
                    لا يوجد مرضى حاليًا
                  </p>
                ) : (
                  patients.map((p) => (
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
                  ))
                )}
              </div>
            ) : (
              // Registration / Form View
              <div className="mt-16 lg:mt-0">
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
                <TestTypeSection
                  orgType={orgType}
                  testType={testType}
                  setTestType={settestType}
                  pdfFiles={pdfFiles}
                  setPdfFiles={setPdfFiles}
                />
                {dealType === DealType.REVENUE_SHARE && (
                  <>
                    <PaymentMethodSection
                      paymentMethod={paymentMethod}
                      setPaymentMethod={setPaymentMethod}
                      possiblePaymentMethods={possiblePaymentMethods}
                      cashPrice={cashPrice}
                      setCashPrice={setCashPrice}
                    />
                    <ConsultationPriceSection
                      selectedPrice={selectedPrice}
                      onChange={(price) => setSelectedPrice(price)}
                      possiblePrices={possiblePrices}
                    />
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Submit Error Modal */}
      {submitError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center mx-4">
            <p className="text-red-500 text-lg mb-4">{submitError}</p>
            <button
              onClick={() => setSubmitError("")}
              className="bg-gray-300 text-black py-2 px-4 rounded-md"
            >
              موافق
            </button>
          </div>
        </div>
      )}

      {/* Fixed "إرسال استشارة طبية" Button */}
      <div className="fixed bottom-16 left-0 w-full px-4">
        <button
          onClick={handleSubmit}
          className="w-full bg-custom-green text-white py-3 px-4 rounded-md flex justify-center items-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="spinner"></div>
          ) : (
            "إرسال استشارة طبية"
          )}
        </button>
      </div>

      {/* Bottom Nav for Mobile */}
      <LabBottomNavBar
        onToggleView={setCurrentView}
        currentView={currentView}
      />
    </div>
  );
};

export default OrgPatientsPage;
