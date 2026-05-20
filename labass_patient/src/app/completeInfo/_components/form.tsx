"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { convertArabicToEnglishNumbers } from "../../../utils/arabicToenglish";

const PersonalInfoForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    idNumber: "",
    dob: "",
    gender: "",
  });

  const [isViewOnly, setIsViewOnly] = useState(false);
  const [idError, setIdError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const consultationId = searchParams?.get("consultationId");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("labass_token");
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          const u = response.data;
          const data = {
            firstName: u.firstName || "",
            lastName: u.lastName || "",
            idNumber: u.nationalId || "",
            dob: u.dateOfBirth ? u.dateOfBirth.split("T")[0] : "",
            gender: u.gender || "",
          };
          setFormData(data);
          const allFilled =
            data.firstName && data.lastName && data.idNumber && data.dob && data.gender;
          setIsViewOnly(!!allFilled);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "idNumber") {
      const convertedId = convertArabicToEnglishNumbers(value);
      setFormData({ ...formData, idNumber: convertedId });
      setIdError(null);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSuccessConfirmation = () => {
    if (consultationId) {
      router.push(`/chat/${consultationId}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    const idPattern = /^[0-9]{10}$/;
    if (!idPattern.test(formData.idNumber)) {
      setIdError("رقم الهوية يجب أن يتكون من 10 أرقام");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("labass_token");
      const headers = { Authorization: `Bearer ${token}` };
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      await axios.post(
        `${apiUrl}/CompleteUserProfile`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          gender: formData.gender,
          nationalId: formData.idNumber,
          dateOfBirth: formData.dob,
        },
        { headers }
      );

      let patientProfileId: number | null = null;
      const patientRes = await axios.get(`${apiUrl}/getPatient`, { headers });

      if (patientRes.data?.exists) {
        patientProfileId = patientRes.data.profile.id;
      } else {
        const createRes = await axios.post(`${apiUrl}/createPatient`, {}, { headers });
        patientProfileId = createRes.data.id;
      }

      if (patientProfileId && consultationId) {
        await axios.post(
          `${apiUrl}/select-patient/${consultationId}`,
          { patientId: patientProfileId },
          { headers }
        );
      }

      setSuccessMessage("تم إرسال المعلومات بنجاح");
    } catch (error: any) {
      console.error("Error submitting form:", error);
      const backendMsg = error?.response?.data?.message;
      setErrorMessage(backendMsg || "حدث خطأ أثناء إرسال المعلومات. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
      setShowModal(true);
    }
  };

  const closeModal = () => setShowModal(false);

  if (isFetching) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 rounded-full border-4 border-custom-green border-t-transparent animate-spin" />
      </div>
    );
  }

  if (isViewOnly) {
    const genderLabel = formData.gender === "male" ? "ذكر" : "أنثى";
    const dobFormatted = formData.dob
      ? new Date(formData.dob).toLocaleDateString("ar-SA")
      : formData.dob;

    return (
      <div className="flex flex-col min-h-screen bg-gray-50 pb-24" dir="rtl">
        <div className="px-4 pt-4 space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-green-600 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-green-700">معلوماتك الشخصية مكتملة</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-700">المعلومات الشخصية</p>
            </div>

            <div className="divide-y divide-gray-100">
              <div className="flex justify-between items-center px-4 py-3">
                <span className="text-sm text-gray-800 font-medium">
                  {formData.firstName} {formData.lastName}
                </span>
                <span className="text-xs text-gray-400">الاسم الكامل</span>
              </div>
              <div className="flex justify-between items-center px-4 py-3">
                <span className="text-sm text-gray-800 font-medium">{formData.idNumber}</span>
                <span className="text-xs text-gray-400">رقم الهوية</span>
              </div>
              <div className="flex justify-between items-center px-4 py-3">
                <span className="text-sm text-gray-800 font-medium">{dobFormatted}</span>
                <span className="text-xs text-gray-400">تاريخ الميلاد</span>
              </div>
              <div className="flex justify-between items-center px-4 py-3">
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${
                    formData.gender === "male"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-pink-50 text-pink-700"
                  }`}
                >
                  {genderLabel}
                </span>
                <span className="text-xs text-gray-400">الجنس</span>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
          <button
            onClick={handleSuccessConfirmation}
            className="w-full bg-custom-green py-3 text-white rounded-2xl text-sm font-medium"
          >
            المتابعة
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="w-12 h-12 rounded-full border-4 border-white border-t-transparent animate-spin" />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col min-h-screen bg-gray-50 pb-24"
        dir="rtl"
      >
        <div className="px-4 pt-4 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-amber-500 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.538-1.333-3.308 0L3.732 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-sm text-amber-700">يرجى إكمال معلوماتك الشخصية</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 space-y-5">
            <p className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-3">
              المعلومات الشخصية
            </p>

            {/* Gender */}
            <div className="space-y-2">
              <label className="text-xs text-gray-500">الجنس</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: "male" })}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                    formData.gender === "male"
                      ? "bg-custom-green text-white border-custom-green"
                      : "bg-white text-gray-600 border-gray-200"
                  }`}
                >
                  ذكر
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: "female" })}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                    formData.gender === "female"
                      ? "bg-custom-green text-white border-custom-green"
                      : "bg-white text-gray-600 border-gray-200"
                  }`}
                >
                  أنثى
                </button>
              </div>
            </div>

            {/* First name */}
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500">الاسم الأول</label>
              <input
                type="text"
                name="firstName"
                placeholder="أدخل الاسم الأول"
                onChange={handleChange}
                value={formData.firstName}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-right text-sm focus:outline-none focus:border-custom-green bg-gray-50"
                required
              />
            </div>

            {/* Last name */}
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500">اسم العائلة</label>
              <input
                type="text"
                name="lastName"
                placeholder="أدخل اسم العائلة"
                onChange={handleChange}
                value={formData.lastName}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-right text-sm focus:outline-none focus:border-custom-green bg-gray-50"
                required
              />
            </div>

            {/* ID number */}
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500">رقم الهوية أو الإقامة</label>
              <input
                type="tel"
                name="idNumber"
                placeholder="أدخل رقم الهوية (10 أرقام)"
                onChange={handleChange}
                value={formData.idNumber}
                className={`w-full px-4 py-3 border rounded-xl text-right text-sm focus:outline-none bg-gray-50 ${
                  idError
                    ? "border-red-400 focus:border-red-400"
                    : "border-gray-200 focus:border-custom-green"
                }`}
                required
              />
              {idError && <p className="text-red-500 text-xs">{idError}</p>}
            </div>

            {/* Date of birth */}
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500">تاريخ الميلاد</label>
              <input
                type="date"
                name="dob"
                onChange={handleChange}
                value={formData.dob}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-right text-sm text-black appearance-none focus:outline-none focus:border-custom-green bg-gray-50"
                required
              />
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
          <button
            type="submit"
            className="w-full bg-custom-green py-3 text-white rounded-2xl text-sm font-medium disabled:opacity-60"
            disabled={isLoading}
          >
            {isLoading ? "جارٍ الإرسال..." : "حفظ المعلومات"}
          </button>
        </div>
      </form>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-6">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6" dir="rtl">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
                successMessage ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {successMessage ? (
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </div>
            <p
              className={`text-center text-sm mb-5 ${
                successMessage ? "text-green-700" : "text-red-600"
              }`}
            >
              {successMessage || errorMessage}
            </p>
            <button
              onClick={successMessage ? handleSuccessConfirmation : closeModal}
              className="w-full bg-custom-green text-white py-3 rounded-2xl text-sm font-medium"
            >
              {successMessage ? "المتابعة للدردشة" : "حسناً"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PersonalInfoForm;
