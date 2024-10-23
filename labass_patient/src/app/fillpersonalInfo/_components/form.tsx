"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Use useSearchParams to extract query params
import axios from "axios";
import { convertArabicToEnglishNumbers } from "../../../utils/arabicToenglish"; // Adjust the path as needed

const PersonalInfoForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    idNumber: "",
    dob: "",
    gender: "male", // Default value set to "male"
  });

  const [idError, setIdError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Success message state
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error message state
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const router = useRouter(); // Initialize useRouter for routing
  const searchParams = useSearchParams(); // Get search parameters

  //In Next.js 13 and later, when using useSearchParams or useParams in a client component,
  //you must wrap that component with <Suspense> to prevent hydration mismatches.
  // Retrieve consultationId from the query parameters
  const consultationId = searchParams?.get("consultationId");

  // Function to handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "idNumber") {
      // Convert Arabic numbers to English before updating the state
      const convertedId = convertArabicToEnglishNumbers(value);
      setFormData({ ...formData, idNumber: convertedId });
      setIdError(null); // Clear the error if ID is updated
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Function to handle success confirmation and navigate to the chat page
  const handleSuccessConfirmation = () => {
    if (consultationId) {
      router.push(`/chat/${consultationId}`); // Navigate to the chat page with the consultationId
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset messages
    setSuccessMessage(null);
    setErrorMessage(null);

    // Validate National ID (must be exactly 10 digits)
    const idPattern = /^[0-9]{10}$/; // Regex to check for exactly 10 digits
    if (!idPattern.test(formData.idNumber)) {
      setIdError("رقم الهوية يجب أن يتكون من 10 أرقام");
      return; // Prevent form submission if validation fails
    }

    // Proceed with form submission
    setIsLoading(true); // Set loading to true when submitting

    try {
      const token = localStorage.getItem("labass_token"); // Replace this with actual token logic
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/CompleteUserProfile`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          gender: formData.gender,
          nationalId: formData.idNumber,
          dateOfBirth: formData.dob,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Display success message only when the response is successful
        setSuccessMessage("تم إرسال المعلومات بنجاح");
        setErrorMessage(null); // Clear any previous error
      } else {
        // If response status is not 200, treat it as an error
        setErrorMessage(
          "حدث خطأ أثناء إرسال المعلومات. يرجى المحاولة مرة أخرى."
        );
        setSuccessMessage(null);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage("حدث خطأ أثناء إرسال المعلومات. يرجى المحاولة مرة أخرى.");
      setSuccessMessage(null); // Clear any previous success message
    } finally {
      setIsLoading(false); // Set loading to false after request is done
      setShowModal(true); // Show modal after submission
    }
  };

  // Function to close the modal
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
          {isLoading ? "جارٍ الإرسال..." : "إرسال"}
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
              {successMessage ? "انتقل إلى الدردشة" : "تأكيد"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PersonalInfoForm;
