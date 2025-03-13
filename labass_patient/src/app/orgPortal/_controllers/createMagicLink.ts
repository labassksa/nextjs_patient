import axios from "axios";
import { Gender } from "../_types/genderType";
import { LabtestType } from "../_types/labTestTypes";

interface CreateMagicLinkData {
  patientInfo: {
    phoneNumber: string;
    role: string[];
    firstName: string;
    lastName: string;
    gender: Gender;
    nationality: string;
    nationalId: string;
    dateOfBirth: string;
    email?: string;
  };
  paymentMethod: string;
  orgType: string;
  dealType: string;
  consultationPrice: number | null;
  testType: LabtestType | "";
  pdfFiles?: File[];
}

interface CreateMagicLinkResponse {
  message: string;
  link: string;
  discountPrice: number;
  promoCode: string;
}

export const createMagicLink = async (data: CreateMagicLinkData): Promise<CreateMagicLinkResponse> => {
  try {
    console.log("Preparing data for createMagicLink API call.");

    // Validate nationalId format
    if (!/^\d{10}$/.test(data.patientInfo.nationalId)) {
      throw new Error("رقم الهوية يجب أن يكون 10 أرقام");
    }

    // Create a new FormData object to send the form and files together
    const formData = new FormData();

    // Append patient info and other data to formData
    formData.append("patientInfo", JSON.stringify(data.patientInfo));
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
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Received response from /magic-link:", response);
    return response.data;
  } catch (error: any) {
    console.error("Error in createMagicLink:", error);
    throw error;
  }
};
