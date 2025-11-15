"use client";
import { I18nextProvider } from 'react-i18next';
import * as i18next from '../../utils/i18n';
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from "react";
import LabBottomNavBar from "./_components/bottomNavBar";
import ConsultationPriceSection from "./_components/ConsultationPriceSection";
import PaymentMethodSection from "./_components/PaymentMethodSection";
import { getOrganization } from "./_controllers/getOrganization";
import { getUserData } from "./_controllers/getUserData";
import { updateMarketer } from "./_controllers/updateMarketer";
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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import DoctorTypeSection from "./_components/DoctorTypeSection";
import { DoctorType } from "./_types/doctorTypes";
import BundleSection from "./_components/BundleSection";
import { getMySubscription } from "./_controllers/getMySubscription";
import { createBundleConsultation } from "./_controllers/createBundleConsultation";


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
  const [orgName, setOrgName] = useState<string>("");
  const [userData, setUserData] = useState<any>(null);
  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [showNameUpdateSuccessModal, setShowNameUpdateSuccessModal] = useState(false);
  const [showNameUpdateErrorModal, setShowNameUpdateErrorModal] = useState(false);

  // Confirmation modals for consultations
  const [showSendConsultationConfirm, setShowSendConsultationConfirm] = useState(false);
  const [showOpenConsultationConfirm, setShowOpenConsultationConfirm] = useState(false);
  const [isOpeningConsultation, setIsOpeningConsultation] = useState(false);

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
  const [doctorType, setDoctorType] = useState<DoctorType>(DoctorType.General);
  const [subscription, setSubscription] = useState<any>(null);
  const [useBundle, setUseBundle] = useState<boolean>(true);
  const marketerName = orgType === OrganizationTypes.Pharmacy
    ? t('pharmacist')
    : orgType === OrganizationTypes.School
    ? "الموظف"
    : t('employee');
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
      console.log("Organization Response:", orgResponse);
      if (orgResponse.success && orgResponse.data) {
        console.log("Organization Data:", orgResponse.data);
        setDealType(orgResponse.data.dealType);
        setOrgType(orgResponse.data.type);
        setOrgName(orgResponse.data.name || "");
      } else {
        throw new Error(orgResponse.message || "Unknown error occurred.");
      }

      // Fetch user data
      const userResponse = await getUserData();
      console.log("User Response:", userResponse);
      if (userResponse.success && userResponse.data) {
        console.log("User Data:", userResponse.data);
        setUserData(userResponse.data); // Use data directly, not as array
      } else {
        console.log("User fetch failed:", userResponse.message);
      }

    } catch (err: any) {
      const backendMessage =
        err.response?.message || err.message || "Unknown error";
      setOrgError(backendMessage);
    } finally {
      setIsLoadingOrg(false);
    }
  };

  const fetchSubscription = async () => {
    try {
      const subscriptionResponse = await getMySubscription();
      console.log("Subscription Response:", subscriptionResponse);
      if (subscriptionResponse.success && subscriptionResponse.data) {
        console.log("Subscription Data:", subscriptionResponse.data);
        setSubscription(subscriptionResponse.data);
        // Auto-disable bundle if no remaining consultations
        if (subscriptionResponse.data.remainingConsultations === 0) {
          setUseBundle(false);
        }
      } else if (subscriptionResponse.noSubscription) {
        console.log("No active subscription found");
        setSubscription(null);
      }
    } catch (err: any) {
      console.error("Error fetching subscription:", err);
      setSubscription(null);
    }
  };

  useEffect(() => {
    fetchOrg();
    fetchSubscription();
    const urlParams = new URLSearchParams(window.location.search);
    if(urlParams.get('lang') && i18n.language !==  urlParams.get('lang')){
      i18n.changeLanguage(urlParams.get('lang')|| 'ar');
    }

    // Check for view parameter and set current view
    const viewParam = urlParams.get('view');
    if (viewParam === 'products' || viewParam === 'patients' || viewParam === 'registration') {
      setCurrentView(viewParam);
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

  useEffect(() => {
    console.log("userData state changed:", userData);
  }, [userData]);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    const urlParams = new URLSearchParams(window.location.search);
    i18n.changeLanguage(newLang);
    urlParams.set('lang', newLang);
    window.history.replaceState({}, '', `${window.location.pathname}?${urlParams}`);
  };

  const handleEditNameClick = () => {
    setEditFirstName(userData?.firstName || "");
    setEditLastName(userData?.lastName || "");
    setShowEditNameModal(true);
  };

  const handleSaveName = async () => {
    setIsUpdatingName(true);
    try {
      const result = await updateMarketer({
        firstName: editFirstName,
        lastName: editLastName
      });
      
      if (result.success) {
        // Update local state
        setUserData((prev: any) => ({
          ...prev,
          firstName: editFirstName,
          lastName: editLastName
        }));
        
        setShowEditNameModal(false);
        setShowNameUpdateSuccessModal(true);
      } else {
        setShowEditNameModal(false);
        setShowNameUpdateErrorModal(true);
        console.error("Update failed:", result.message);
      }
    } catch (error) {
      console.error("Error updating name:", error);
      setShowEditNameModal(false);
      setShowNameUpdateErrorModal(true);
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleNameUpdateSuccessModalClose = () => {
    setShowNameUpdateSuccessModal(false);
  };

  const handleNameUpdateErrorModalClose = () => {
    setShowNameUpdateErrorModal(false);
  };

  // Show confirmation modal for send consultation
  const handleSendConsultationClick = () => {
    setShowSendConsultationConfirm(true);
  };

  // Show confirmation modal for open consultation
  const handleOpenConsultationClick = () => {
    setShowOpenConsultationConfirm(true);
  };

  // Actual send consultation logic (after confirmation)
  const handleSendConsultation = async () => {
    setShowSendConsultationConfirm(false);
    setIsSubmitting(true);
    setSubmitError("");

    if (!name || !phone || !dateOfBirth || !gender || !nationality) {
      alert(t('formValidation'));
      setIsSubmitting(false);
      return;
    }

    // Map DoctorType to ConsultationType for backend
    const getConsultationType = (doctorType: DoctorType) => {
      switch (doctorType) {
        case DoctorType.Obesity:
          return "obesity";
        case DoctorType.Psychiatrist:
          return "psychiatric";
        case DoctorType.General:
        default:
          return "quick";
      }
    };

    const magicLinkData = {
      patientInfo: {
        firstName: name.trim(),
        lastName: "",
        phoneNumber: phone.startsWith("0")
          ? `+966${phone.slice(1)}`
          : `+966${phone}`,
        role: orgType === OrganizationTypes.School ? ["student"] : ["patient"],
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
      consultationType: getConsultationType(doctorType),
      pdfFiles: testType === LabtestType.PostTest ? pdfFiles : undefined
    };

    try {
      // Check if we should use bundle or magic link
      if (subscription && useBundle && subscription.remainingConsultations > 0) {
        // Use bundle consultation endpoint
        const bundleData = {
          patientInfo: magicLinkData.patientInfo,
          consultationType: magicLinkData.consultationType,
          labConsultationType: testType || undefined,
          pdfFiles: testType === LabtestType.PostTest ? pdfFiles : undefined,
        };

        const result = await createBundleConsultation(bundleData);

        // Update local subscription state
        if (result.success && result.data) {
          setSubscription((prev: any) => ({
            ...prev,
            remainingConsultations: result.data.remainingConsultations,
          }));
        }

        alert(
          `${t('consultationSuccess')}\n${t('link')}: ${result.data.magicLink}\nالاستشارات المتبقية: ${result.data.remainingConsultations}`
        );
      } else {
        // Use regular magic link flow
        const result = await createMagicLink(magicLinkData);
        alert(
          `${t('consultationSuccess')}\n${t('link')}: ${result.link}\n${t('promoCode')}: ${result.promoCode}`
        );
      }
    } catch (err: any) {
      console.error("Error from backend:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        t("unexpectedError");
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open consultation logic (creates magic link and opens it immediately)
  const handleOpenConsultation = async () => {
    setShowOpenConsultationConfirm(false);
    setIsOpeningConsultation(true);
    setSubmitError("");

    if (!name || !phone || !dateOfBirth || !gender || !nationality) {
      alert(t('formValidation'));
      setIsOpeningConsultation(false);
      return;
    }

    // Map DoctorType to ConsultationType for backend
    const getConsultationType = (doctorType: DoctorType) => {
      switch (doctorType) {
        case DoctorType.Obesity:
          return "obesity";
        case DoctorType.Psychiatrist:
          return "psychiatric";
        case DoctorType.General:
        default:
          return "quick";
      }
    };

    const magicLinkData = {
      patientInfo: {
        firstName: name.trim(),
        lastName: "",
        phoneNumber: phone.startsWith("0")
          ? `+966${phone.slice(1)}`
          : `+966${phone}`,
        role: orgType === OrganizationTypes.School ? ["student"] : ["patient"],
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
      consultationType: getConsultationType(doctorType),
      pdfFiles: testType === LabtestType.PostTest ? pdfFiles : undefined
    };

    try {
      // Check if we should use bundle or magic link
      if (subscription && useBundle && subscription.remainingConsultations > 0) {
        // Use bundle consultation endpoint
        const bundleData = {
          patientInfo: magicLinkData.patientInfo,
          consultationType: magicLinkData.consultationType,
          labConsultationType: testType || undefined,
          pdfFiles: testType === LabtestType.PostTest ? pdfFiles : undefined,
        };

        const result = await createBundleConsultation(bundleData);

        // Update local subscription state
        if (result.success && result.data) {
          setSubscription((prev: any) => ({
            ...prev,
            remainingConsultations: result.data.remainingConsultations,
          }));

          // Open the magic link in the same window
          window.location.href = result.data.magicLink;
        }
      } else {
        // Use regular magic link flow
        const result = await createMagicLink(magicLinkData);

        // Open the magic link in the same window
        window.location.href = result.link;
      }
    } catch (err: any) {
      console.error("Error from backend:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        t("unexpectedError");
      setSubmitError(errorMessage);
      setIsOpeningConsultation(false);
    }
  };

  return (
    <I18nextProvider i18n={i18next.default}>
      <div className="min-h-screen bg-white text-black">
        {/* User Info Section - Compact Design */}
        {userData && (
          <div className="mb-4">
            <div className="w-full">
              {/* Compact Header with Language Toggle */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2">
                <div className="flex items-center justify-between">
                  <button 
                    onClick={toggleLanguage}
                    className="text-white bg-blue-700 bg-opacity-50 rounded px-2 py-1 text-xs font-medium hover:bg-opacity-70"
                  >
                    {i18n.language === 'ar' ? 'English' : 'عربي'}
                  </button>
                  <h3 className="text-sm font-semibold text-white" dir="rtl">
                    بياناتي
                  </h3>
                  <div className="w-12"></div> {/* Spacer for centering */}
                </div>
              </div>
              
              {/* Compact Content */}
              <div className="bg-white p-3">
                <div className="space-y-2" dir="rtl">
                  {/* Name Section */}
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-xs">👤</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">الاسم</p>
                        <p className="text-sm font-medium text-gray-800">
                          {userData.firstName || userData.lastName 
                            ? `${userData.firstName || ''} ${userData.lastName || ''}`.trim()
                            : 'غير محدد'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleEditNameClick}
                      className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                    >
                      تعديل
                    </button>
                  </div>

                  {/* Phone Section */}
                  <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xs">📱</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">رقم الجوال</p>
                      <p className="text-sm font-medium text-gray-800" dir="ltr">
                        {userData.phoneNumber}
                      </p>
                    </div>
                  </div>

                  {/* Organization Name Section */}
                  {orgName && (
                    <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 text-xs">🏢</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">
                          {orgType === OrganizationTypes.School ? "اسم المدرسة" : "اسم المنشأة"}
                        </p>
                        <p className="text-sm font-medium text-gray-800">
                          {orgName}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
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
                  <DoctorTypeSection
                    doctorType={doctorType}
                    setDoctorType={setDoctorType}
                  />
                  <BundleSection
                    subscription={subscription}
                    useBundle={useBundle}
                    setUseBundle={setUseBundle}
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

                  {/* Bottom Buttons for Web (not fixed) */}
                  {orgType === OrganizationTypes.School ? (
                    /* School: Two buttons with confirmations */
                    <div className="flex gap-3 mt-4" dir="rtl">
                      {/* Send Consultation Button (Green) */}
                      <button
                        onClick={handleSendConsultationClick}
                        className="flex-1 bg-custom-green text-white py-3 px-4 rounded-md flex justify-center items-center hover:bg-green-600 transition-colors"
                        disabled={isSubmitting || isOpeningConsultation}
                      >
                        {isSubmitting ? (
                          <div className="spinner" />
                        ) : (
                          t('sendConsultation')
                        )}
                      </button>

                      {/* Open Consultation Button (Blue) - Only for schools */}
                      <button
                        onClick={handleOpenConsultationClick}
                        className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-md flex justify-center items-center hover:bg-blue-600 transition-colors"
                        disabled={isSubmitting || isOpeningConsultation}
                      >
                        {isOpeningConsultation ? (
                          <div className="spinner" />
                        ) : (
                          "فتح الاستشارة"
                        )}
                      </button>
                    </div>
                  ) : (
                    /* Pharmacy/Lab: Single button without confirmation */
                    <button
                      onClick={handleSendConsultation}
                      className="mt-4 w-full bg-custom-green text-white py-3 px-4 rounded-md flex justify-center items-center hover:bg-green-600 transition-colors"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="spinner" />
                      ) : (
                        t('sendConsultation')
                      )}
                    </button>
                  )}
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

        {/* Edit Name Modal */}
        {showEditNameModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 mx-4 max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center" dir="rtl">
                تعديل الاسم
              </h3>
              
              <div className="space-y-4" dir="rtl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الاسم الأول
                  </label>
                  <input
                    type="text"
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-right"
                    placeholder="أدخل الاسم الأول"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الاسم الأخير
                  </label>
                  <input
                    type="text"
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-right"
                    placeholder="أدخل الاسم الأخير"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6" dir="rtl">
                <button
                  onClick={handleSaveName}
                  disabled={isUpdatingName}
                  className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:opacity-50"
                >
                  {isUpdatingName ? "جاري الحفظ..." : "حفظ"}
                </button>
                <button
                  onClick={() => setShowEditNameModal(false)}
                  className="flex-1 bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-400"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Name Update Success Modal */}
        {showNameUpdateSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 mx-4 max-w-sm w-full">
              <div className="text-center">
                <CheckCircleIcon className="text-green-500 w-24 h-24 mx-auto mb-4" />
                <p className="text-lg font-semibold text-black mb-2">تم تحديث الاسم بنجاح</p>
                <p className="text-gray-600 text-sm mb-6" dir="rtl">
                  تم تحديث الاسم بنجاح في النظام
                </p>
                
                <button
                  onClick={handleNameUpdateSuccessModalClose}
                  className="p-3 w-full text-sm font-bold bg-green-500 text-white rounded-lg hover:bg-green-600"
                  dir="rtl"
                >
                  موافق
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Name Update Error Modal */}
        {showNameUpdateErrorModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 mx-4 max-w-sm w-full">
              <div className="text-center">
                <ErrorIcon className="text-red-500 w-24 h-24 mx-auto mb-4" />
                <p className="text-lg font-semibold text-black mb-2">لم نتمكن من تحديث الاسم</p>
                <p className="text-gray-600 text-sm mb-6" dir="rtl">
                  حدث خطأ أثناء تحديث الاسم، يرجى المحاولة مرة أخرى
                </p>

                <button
                  onClick={handleNameUpdateErrorModalClose}
                  className="p-3 w-full text-sm font-bold bg-red-500 text-white rounded-lg hover:bg-red-600"
                  dir="rtl"
                >
                  حسناً
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Send Consultation Confirmation Modal - Only for Schools */}
        {showSendConsultationConfirm && orgType === OrganizationTypes.School && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 mx-4 max-w-md w-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📱</span>
                </div>
                <p className="text-lg font-semibold text-black mb-3" dir="rtl">
                  إرسال رابط الاستشارة للطالب
                </p>
                <p className="text-gray-600 text-sm mb-6" dir="rtl">
                  سيتم إرسال رابط الاستشارة إلى رقم جوال الطالب {phone}. هل أنت متأكد؟
                </p>

                <div className="flex gap-3" dir="rtl">
                  <button
                    onClick={handleSendConsultation}
                    className="flex-1 p-3 text-sm font-bold bg-custom-green text-white rounded-lg hover:bg-green-600"
                  >
                    نعم، إرسال
                  </button>
                  <button
                    onClick={() => setShowSendConsultationConfirm(false)}
                    className="flex-1 p-3 text-sm font-bold bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Open Consultation Confirmation Modal - Only for Schools */}
        {showOpenConsultationConfirm && orgType === OrganizationTypes.School && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 mx-4 max-w-md w-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔗</span>
                </div>
                <p className="text-lg font-semibold text-black mb-3" dir="rtl">
                  فتح الاستشارة مباشرة
                </p>
                <p className="text-gray-600 text-sm mb-6" dir="rtl">
                  سيتم فتح الاستشارة مباشرة الآن على هذا الجهاز. هل أنت متأكد؟
                </p>

                <div className="flex gap-3" dir="rtl">
                  <button
                    onClick={handleOpenConsultation}
                    className="flex-1 p-3 text-sm font-bold bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    نعم، فتح الآن
                  </button>
                  <button
                    onClick={() => setShowOpenConsultationConfirm(false)}
                    className="flex-1 p-3 text-sm font-bold bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
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
