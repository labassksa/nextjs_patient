import axios from "axios";
import { Gender } from "../_types/genderType";
import { LabtestType } from "../_types/labTestTypes";

interface CreateMagicLinkData {
  patientInfo: {
    phoneNumber: string;
    role: string[]; // e.g., ["patient"]
    firstName: string;
    gender: Gender;
    nationality: string;
    nationalId: string | null;
    dateOfBirth: string; // YYYY-MM-DD format
  };
  paymentMethod: string; // e.g., "Through Labass Platform", "Through Organization Payment System"
  orgType: string; // e.g., "pharmacy" | "laboratory"
  dealType: string; // e.g., "SUBSCRIPTION" | "REVENUE_SHARE"
  consultationPrice: number | null; // e.g., 99
  testType: LabtestType | ""; // e.g., "pre_test" | "post_test"
  pdfFiles?: File[]; // Optional, only for specific test types
}

export const createMagicLink = async (data: CreateMagicLinkData) => {
  try {
    console.log("Preparing data for createMagicLink API call.");

    // Create a new FormData object to send the form and files together
    const formData = new FormData();

    // Append patient info and other data to formData
    formData.append("patientInfo", JSON.stringify(data.patientInfo)); // Stringify the patientInfo to send it as a JSON string
    formData.append("paymentMethod", data.paymentMethod);
    formData.append("orgType", data.orgType);
    formData.append("dealType", data.dealType);
    formData.append(
      "consultationPrice",
      data.consultationPrice?.toString() || ""
    );
    if (data.testType != "") {
      formData.append("testType", data.testType);
    }
    console.log("patient info ", JSON.stringify(data.patientInfo));
    console.log(
      "type of patient info ",
      typeof JSON.stringify(data.patientInfo)
    );
    // Append the files if the testType is PostTest
    if (data.testType === LabtestType.PostTest && data.pdfFiles) {
      data.pdfFiles.forEach((file) => {
        formData.append("pdfFiles", file);
      });
    }

    console.log("FormData ready, sending request.");

    const token = localStorage.getItem("labass_token");
    if (!token) {
      throw new Error("No token found. Please log in to continue.");
    }

    console.log("Sending POST request to /magic-link endpoint.");

    // Send the request with the FormData object
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/magic-link`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Set the content type to multipart/form-data
        },
      }
    );

    console.log("Received response from /magic-link:", response);

    if (response.status === 200) {
      console.log("Magic link created successfully.");
      return { success: true, data: response.data };
    } else {
      console.warn("Unexpected response status code:", response.status);
      return { success: false, message: "Unexpected response status code" };
    }
  } catch (error: any) {
    console.error("Error in createMagicLink:", error);

    return {
      success: false,
      message:
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "حدث خطأ ، حاول مرة أخرى",
    };
  }
};
