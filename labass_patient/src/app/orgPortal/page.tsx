"use client";
import { I18nextProvider } from 'react-i18next';
import * as i18next from '../../utils/i18n';
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from "react";
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
import { getMarketerConsultaion } from "./_controllers/getMarketerConsultaion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ProductsList from "./_components/productsList";

const LanguageToggle: React.FC<{ currentLang: string; onToggle: () => void }> = ({ currentLang, onToggle }) => {
  return (
    <button 
      onClick={onToggle}
      className="fixed top-4 right-4 text-white bg-blue-500 shadow-md rounded-md px-3 py-1 text-sm font-medium z-10"
    >
      {currentLang === 'ar' ? 'English' : 'عربي'}
    </button>
  );
};

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
  const { t, i18n } = useTranslation();
  const [currentView, setCurrentView] = useState<"patients" | "registration" | "products">(
    "registration"
  );
  const [patients, setPatients] = useState<OrgPatient[]>([]);
  const [fromDate, setFromDate] = useState<Date>(new Date(new Date().setDate(1))); // Default to start of current month
  const [toDate, setToDate] = useState<Date>(new Date()); // Default to today
  const [isLoadingOrg, setIsLoadingOrg] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orgError, setOrgError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [dealType, setDealType] = useState<DealType | "">("");
  const [orgType, setOrgType] = useState<OrganizationTypes | "">("");

  // Form fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [nationality, setNationality] = useState("");
  const [gender, setGender] = useState(Gender.Male);
  const [nationalId, setNationalId] = useState("");
  const [testType, settestType] = useState<LabtestType | "">("");
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodEnum>(
    PaymentMethodEnum.THROUGH_ORGANIZATION
  );
  const [cashPrice, setCashPrice] = useState<number | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [marketerConsultaion, setMarketerConsultaion] = useState<any>(null);
  const [marketers, setMarketers] = useState<string[]>([]);
  const [selectedMarketer, setSelectedMarketer] = useState<string>();
  const marketerName = orgType === OrganizationTypes.Pharmacy? t('pharmacist') : t('employee');
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
        throw new Error(orgResponse.message || "Unknown error occurred.");
      }


    } catch (err: any) {
      const backendMessage =
        err.response?.message || err.message || "Unknown error";
      setOrgError(backendMessage);
    } finally {
      setIsLoadingOrg(false);
    }
  };

  useEffect(() => {
    fetchOrg();
    const urlParams = new URLSearchParams(window.location.search);
    if(urlParams.get('lang') && i18n.language !==  urlParams.get('lang')){
      i18n.changeLanguage(urlParams.get('lang')|| 'ar');
    }
  }, []);

  useEffect(() =>{
    (async () => {
      const marketerConsultaion = await getMarketerConsultaion(fromDate, toDate);
      if (marketerConsultaion.success && marketerConsultaion.data.consultations) {
        setMarketerConsultaion(marketerConsultaion.data.consultations);
        const uniqueMarketers: any[] = [...new Set(marketerConsultaion.data.consultations
        .map((p:any) => `${p.marketer.firstName} ${p.marketer.lastName}`))];
        setMarketers(uniqueMarketers);
      } else {
        setOrgError(marketerConsultaion.message || t('unexpectedError'));
      }
      })()
  }, [fromDate, toDate]);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    const urlParams = new URLSearchParams(window.location.search);
    i18n.changeLanguage(newLang);
    urlParams.set('lang', newLang);
    window.history.replaceState({}, '', `${window.location.pathname}?${urlParams}`);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError("");

    if (!name || !phone || !dateOfBirth || !gender || !nationality) {
      alert(t('formValidation'));
      setIsSubmitting(false);
      return;
    }

    const magicLinkData = {
      patientInfo: {
        firstName: name.trim(),
        lastName: "",
        phoneNumber: phone.startsWith("0")
          ? `+966${phone.slice(1)}`
          : `+966${phone}`,
        role: ["patient"],
        gender,
        nationality,
        nationalId: nationalId.trim() || "",
        dateOfBirth: dateOfBirth.toISOString().split("T")[0],
        email: ""
      },
      paymentMethod,
      orgType,
      dealType,
      consultationPrice: selectedPrice || cashPrice,
      testType,
      pdfFiles: testType === LabtestType.PostTest ? pdfFiles : undefined
    };

    try {
      const result = await createMagicLink(magicLinkData);
      alert(`${t('consultationSuccess')}\n${t('link')}: ${result.link}\n${t('promoCode')}: ${result.promoCode}`);
    } catch (err: any) {
      console.error("Error from backend:", err);
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          err.message || 
                          t('unexpectedError');
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <I18nextProvider i18n={i18next.default}>
      <div className="min-h-screen bg-gray-100 text-black">
        {/* Main Content */}
        <LanguageToggle
          currentLang={i18n.language} 
          onToggle={toggleLanguage}
        />
        <div
          className={`max-w-screen-lg mx-auto pb-28`}
        >
          {orgError && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1]">
              <div className="bg-white rounded-lg shadow-lg p-6 text-center mx-4">
                <p className="text-red-500 text-lg mb-4">{orgError}</p>
                <button
                  onClick={fetchOrg}
                  className="bg-custom-green text-white py-2 px-4 rounded-md"
                  disabled={isLoadingOrg}
                >
                  {isLoadingOrg ? (
                    <div className="spinner"></div>
                  ) : (t('retryButton'))}
                </button>
              </div>
            </div>
          )}

          {isLoadingOrg ? (
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="spinner"></div>
            </div>
          ) : (
            /* 2 columns: left for text, right for form/patients */
            <div className="grid grid-cols-1 gap-6">

              {/* Right column fills remaining space */}
              {currentView === "patients" ? (
                <div className="bg-white p-6 rounded-md shadow-sm w-full">
                  <div className="flex flex-wrap gap-4 mb-6 justify-center" dir="rtl">
                    <div className="flex items-center gap-2">
                      <label className="text-gray-600">{t('from')}:</label>
                      <DatePicker
                        selected={fromDate}
                        onChange={(date: Date | null) => {
                          if (date) {
                            setSelectedMarketer("");
                            setFromDate(date);
                          }
                        }}
                        className="border rounded-md p-2 text-right"
                        dateFormat="yyyy/MM/dd"
                        maxDate={toDate}
                        placeholderText={t('chooseDate')}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-gray-600">{t('to')}:</label>
                      <DatePicker
                        selected={toDate}
                        onChange={(date: Date | null) => {
                          if(date){
                            setSelectedMarketer("");
                            setToDate(date);
                          }
                        }}
                        className="border rounded-md p-2 text-right"
                        dateFormat="yyyy/MM/dd"
                        minDate={fromDate}
                        maxDate={new Date()}
                        placeholderText={t('chooseDate')}
                      />
                    </div>
                    {marketers && (
                    <div className="flex items-center gap-2">
                      <label className="text-gray-600">{t('choose')} {marketerName}:</label>
                      <select 
                        value={selectedMarketer || ""}
                        onChange={(e) => setSelectedMarketer(e.target.value)}
                        className="border rounded-md p-2 text-right"
                      >
                        <option value="">{t('all')}</option>
                        {marketers.map((marketer, index) => (
                        <option key={index} value={marketer}>
                          {marketer}
                        </option>
                        ))}
                      </select>
                    </div>)}
                  </div>
                  <h2 dir="rtl" className="text-gray-400 text-xl font-semibold mb-4 text-center">
                    {selectedMarketer ? `${t('consultaionsFor')} ${selectedMarketer}` : t('allConsultaions')}: 
                    <span className="mr-4 inline-block bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm font-semibold">
                      {marketerConsultaion.filter((m:any)=>
                        selectedMarketer ? `${m.marketer.firstName} ${m.marketer.lastName}` === selectedMarketer : true
                      ).length}
                    </span>
                  </h2>
                  {marketerConsultaion.filter((m:any)=>
                        selectedMarketer ? `${m.marketer.firstName} ${m.marketer.lastName}` === selectedMarketer : true
                      ).length === 0 ? (
                    <p className="text-center text-gray-500">
                      {t('noPatients')}
                    </p>
                  ) : (
                    marketerConsultaion.filter((m:any)=>
                      selectedMarketer ? `${m.marketer.firstName} ${m.marketer.lastName}` === selectedMarketer : true
                    ).map((p:any, i:number) => (
                      <LabPatientCard
                        key={i}
                        {...p}
                        orgType={orgType}
                        onSelect={() =>
                          console.log(
                            `Selected patient: ${p?.phoneNumber} (ID ${p?.id})`
                          )
                        }
                      />
                    ))
                  )}
                </div>
              ) : currentView === "products" ? (
                <ProductsList />
              ) : (
                <div className="bg-white p-6 rounded-md shadow-sm w-full">
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

                  {/* Bottom Button for Web (not fixed) */}
                  <button
                    onClick={handleSubmit}
                    className="mt-4 w-full bg-custom-green text-white py-3 px-4 rounded-md flex justify-center items-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="spinner" />
                    ) : (
                    t('sendConsultation')
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {submitError && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center mx-4">
              <p className="text-red-500 text-lg mb-4">{submitError}</p>
              <button
                onClick={() => setSubmitError("")}
                className="bg-gray-300 text-black py-2 px-4 rounded-md"
              >
                {t('ok')}
              </button>
            </div>
          </div>
        )}
          <LabBottomNavBar
            onToggleView={setCurrentView}
            currentView={currentView}
          />
      </div>
    </I18nextProvider>
  );
};

export default OrgPatientsPage;
