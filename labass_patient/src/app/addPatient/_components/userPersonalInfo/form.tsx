"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Use useSearchParams to extract query params
import axios from "axios";
import { convertArabicToEnglishNumbers } from "../../../../utils/arabicToenglish"; // Adjust the path as needed

const PersonalInfoForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    idNumber: "",
    dob: "",
    gender: "male", // Default value set to "male"
    phoneNumber: "", // Added phone number field
    email: "", // Added email field
  });

  const [idError, setIdError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Success message state
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error message state
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const router = useRouter(); // Initialize useRouter for routing
  const searchParams = useSearchParams(); // Get search parameters

  const consultationId = searchParams?.get("consultationId");

  // Function to handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "idNumber") {
      const convertedId = convertArabicToEnglishNumbers(value);
      setFormData({ ...formData, idNumber: convertedId });
      setIdError(null); // Clear the error if ID is updated
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSuccessConfirmation = () => {
    if (consultationId) {
      router.push(`/patientSelection/${consultationId}`); // Navigate to the chat page with the consultationId
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSuccessMessage(null);
    setErrorMessage(null);

    const idPattern = /^[0-9]{10}$/; // Regex to check for exactly 10 digits
    if (!idPattern.test(formData.idNumber)) {
      setIdError("رقم الهوية يجب أن يتكون من 10 أرقام");
      return; // Prevent form submission if validation fails
    }

    setIsLoading(true); // Set loading to true when submitting

    try {
      const token = localStorage.getItem("labass_token"); // Replace this with actual token logic
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/AddDependent`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          gender: formData.gender,
          nationalId: formData.idNumber,
          dateOfBirth: formData.dob,
          phoneNumber: formData.phoneNumber, // Added phone number to the request
          email: formData.email, // Added email to the request
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage("تمت إضافة المريض بنجاح");
        setErrorMessage(null); // Clear any previous error
      } else {
        setErrorMessage("حدث خطأ أثناء إضافة المريض. يرجى المحاولة مرة أخرى.");
        setSuccessMessage(null);
      }
    } catch (error) {
      const err = error as any; // Cast the error to any to bypass TypeScript's unknown type

      if (err.response && err.response.data) {
        const data = err.response.data;

        // Check if the response contains an "errors" array
        if (Array.isArray(data.errors)) {
          // Extract the error messages from the "errors" array
          const backendErrors = data.errors.map(
            (err: { msg: string }) => err.msg
          );
          setErrorMessage(backendErrors.join(", "));
        }
        // Check if the response contains a "message"
        else if (data.message) {
          setErrorMessage(data.message);
        }
        // If neither "errors" nor "message" is present, show a generic error
        else {
          setErrorMessage(
            "حدث خطأ أثناء إضافة المريض. يرجى المحاولة مرة أخرى."
          );
        }
      } else {
        setErrorMessage("حدث خطأ أثناء إضافة المريض. يرجى المحاولة مرة أخرى.");
      }
    } finally {
      setIsLoading(false); // Set loading to false after request is done
      setShowModal(true); // Show modal after submission
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="pt-16 flex flex-col min-h-screen m-1 bg-white"
      >
        <div className="space-y-4 p-2 flex-grow text-black">
          {/* Gender Selection Section */}
          <div className="flex flex-col justify-between text-xs" dir="rtl">
            <div className=""> الجنس</div>
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

          {/* Input Fields */}
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
              <div className="text-red-500 mt-2 text-right text-xs">
                {idError}
              </div>
            )}
          </div>

          {/* Phone Number Input Field */}
          <input
            type="tel"
            name="phoneNumber"
            placeholder="رقم الجوال"
            onChange={handleChange}
            value={formData.phoneNumber} // Added phone number field
            className="w-full p-3 border rounded text-right focus:outline-none focus:border-custom-green text-xs"
            required
          />

          {/* Email Input Field */}
          <input
            type="email"
            name="email"
            placeholder="البريد الإلكتروني"
            onChange={handleChange}
            value={formData.email} // Added email field
            className="w-full p-3 border rounded text-right focus:outline-none focus:border-custom-green text-xs"
            required
          />

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

        {/* Submit Button */}
        <button
          type="submit"
          className="fixed left-1/2 transform -translate-x-1/2 bottom-0 w-3/4 bg-custom-green p-2 text-white rounded-2xl text-xs"
          style={{ bottom: "10px" }} // Adjust the bottom position as needed
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? "جارٍ الإرسال..." : "إضافة مريض"}
        </button>
      </form>

      {/* Modal for Success/Error Messages */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-80">
            {successMessage ? (
              <div className="text-green-600 text-center mb-4">
                {successMessage}
              </div>
            ) : (
              <div className="text-red-600 text-center mb-4">
                {errorMessage}
              </div>
            )}
            <button
              onClick={successMessage ? handleSuccessConfirmation : closeModal}
              className="bg-custom-green text-white px-4 py-2 rounded-full w-full"
            >
              {successMessage ? "متابعة" : "متابعة"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PersonalInfoForm;
