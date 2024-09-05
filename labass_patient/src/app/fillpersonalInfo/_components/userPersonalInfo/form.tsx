"use client";
import React, { useState } from "react";
import axios from "axios";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "idNumber") {
      setIdError(null); // Clear the error if ID is updated
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate National ID (must be exactly 10 digits)
    const idPattern = /^[0-9]{10}$/; // Regex to check for exactly 10 digits
    if (!idPattern.test(formData.idNumber)) {
      setIdError("رقم الهوية يجب أن يتكون من 10 أرقام");
      return; // Prevent form submission if validation fails
    }
    console.log(formData);
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

      console.log(response.data); // Handle successful response
    } catch (error) {
      console.error("Error submitting form:", error); // Handle error
    } finally {
      setIsLoading(false); // Set loading to false after request is done
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="pt-16 flex flex-col min-h-screen m-1 bg-white"
    >
      <div className="space-y-4 p-2 flex-grow text-black">
        {/* Gender Selection Section Moved to the Top */}
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

        {/* Other Input Fields */}
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
  );
};

export default PersonalInfoForm;
