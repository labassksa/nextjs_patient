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
    gender: "male",
  });

  const [idError, setIdError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const consultationId = searchParams?.get("consultationId");

  // Pre-fill form with existing user data from DB
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("labass_token");
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          const u = response.data;
          setFormData({
            firstName: u.firstName || "",
            lastName: u.lastName || "",
            idNumber: u.nationalId || "",
            dob: u.dateOfBirth ? u.dateOfBirth.split("T")[0] : "",
            gender: u.gender || "male",
          });
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

      // 1. Update user info
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

      // 2. Ensure patientProfile exists
      let patientProfileId: number | null = null;
      const patientRes = await axios.get(`${apiUrl}/getPatient`, { headers });

      if (patientRes.data?.exists) {
        patientProfileId = patientRes.data.profile.id;
      } else {
        // Create patientProfile if it doesn't exist
        const createRes = await axios.post(`${apiUrl}/createPatient`, {}, { headers });
        patientProfileId = createRes.data.id;
      }

      // 3. Link patientProfile to consultation
      if (patientProfileId && consultationId) {
        await axios.post(
          `${apiUrl}/select-patient/${consultationId}`,
          { patientId: patientProfileId },
          { headers }
        );
      }

      setSuccessMessage("تم إرسال المعلومات بنجاح");
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage("حدث خطأ أثناء إرسال المعلومات. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
      setShowModal(true);
    }
  };

  const closeModal = () => setShowModal(false);

  if (isFetching) {
    return (
      <div className="pt-16 flex justify-center items-center min-h-screen">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="pt-16 flex flex-col min-h-screen m-1 bg-white"
      >
        <div className="space-y-4 p-2 flex-grow text-black">
          {/* Gender Selection */}
          <div className="flex flex-col justify-between text-xs" dir="rtl">
            <div className=""> هل أنت</div>
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                onChange={handleChange}
                checked={formData.gender === "male"}
              />{" "}
              ذكر
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                onChange={handleChange}
                checked={formData.gender === "female"}
              />{" "}
              أنثى
            </label>
          </div>

          <input
            type="text"
            name="firstName"
            placeholder="الاسم الأول"
            onChange={handleChange}
            value={formData.firstName}
            className="w-full p-3 border rounded text-right focus:outline-none focus:border-custom-green text-xs"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="اسم العائلة"
            onChange={handleChange}
            value={formData.lastName}
            className="w-full p-3 border rounded text-right focus:outline-none focus:border-custom-green text-xs"
            required
          />
          <div className="flex flex-col">
            <input
              type="tel"
              name="idNumber"
              placeholder="رقم الهوية أو الإقامة"
              onChange={handleChange}
              value={formData.idNumber}
              className="w-full p-3 border rounded text-right focus:outline-none focus:border-custom-green text-xs"
              required
            />
            {idError && (
              <div className="text-red-500 mt-2 text-right text-xs">{idError}</div>
            )}
          </div>
          <div>
            <div className="text-xs m-2 text-gray-500" dir="rtl">
              أدخل تاريخ الميلاد
            </div>
            <input
              className="w-full p-3 border rounded text-right text-black appearance-none text-xs"
              type="date"
              name="dob"
              onChange={handleChange}
              value={formData.dob}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="fixed left-1/2 transform -translate-x-1/2 bottom-0 w-3/4 bg-custom-green p-2 text-white rounded-2xl text-xs"
          style={{ bottom: "10px" }}
          disabled={isLoading}
        >
          {isLoading ? "جارٍ الإرسال..." : "إرسال"}
        </button>
      </form>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-80">
            {successMessage ? (
              <div className="text-green-600 text-center mb-4">{successMessage}</div>
            ) : (
              <div className="text-red-600 text-center mb-4">{errorMessage}</div>
            )}
            <button
              onClick={successMessage ? handleSuccessConfirmation : closeModal}
              className="bg-custom-green text-white px-4 py-2 rounded-full w-full"
            >
              {successMessage ? "انتقل إلى الدردشة" : "تأكيد"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PersonalInfoForm;
