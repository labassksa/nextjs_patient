import axios from "axios";
import { Gender } from "../_types/genderType";
import { LabtestType } from "../_types/labTestTypes";
import i18next from "i18next";

interface CreateBundleConsultationData {
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
  consultationType: string;
  labConsultationType?: LabtestType;
  pdfFiles?: File[];
  sendSMS?: boolean;
}

interface CreateBundleConsultationResponse {
  success: boolean;
  message: string;
  data?: {
    consultation: any;
    magicLink: string;
    remainingConsultations: number;
  };
}

export const createBundleConsultation = async (
  data: CreateBundleConsultationData
): Promise<CreateBundleConsultationResponse> => {
  try {
    console.log("Preparing data for createBundleConsultation API call.");

    // Validate nationalId format
    if (!/^\d{10}$/.test(data.patientInfo.nationalId)) {
      throw new Error(i18next.t("nationalIdMustBe"));
    }

    // Create a new FormData object to send the form and files together
    const formData = new FormData();

    // Append patient info and other data to formData
    formData.append("patientInfo", JSON.stringify(data.patientInfo));
    formData.append("consultationType", data.consultationType);

    if (data.labConsultationType) {
      formData.append("labConsultationType", data.labConsultationType);
    }

    // Append sendSMS flag (defaults to true if not specified)
    formData.append("sendSMS", String(data.sendSMS ?? true));

    // Append the files if the testType is PostTest
    if (
      data.labConsultationType === LabtestType.PostTest &&
      data.pdfFiles &&
      data.pdfFiles.length > 0
    ) {
      data.pdfFiles.forEach((file) => {
        formData.append("pdfFiles", file);
      });
    }

    console.log("FormData ready, sending request.");

    const token = localStorage.getItem("labass_token");
    if (!token) {
      throw new Error("No token found. Please log in to continue.");
    }

    console.log(
      "Sending POST request to /consultations/create-from-bundle endpoint."
    );

    // Send the request with the FormData object
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/consultations/create-from-bundle`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log(
      "Received response from /consultations/create-from-bundle:",
      response
    );
    return response.data;
  } catch (error: any) {
    console.error("Error in createBundleConsultation:", error);
    throw error;
  }
};
