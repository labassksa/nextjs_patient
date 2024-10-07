// _controllers/myConsultations.ts
import axios from "axios";

export const fetchConsultations = async () => {
  try {
    const token = localStorage.getItem("labass_token");
    if (!token) {
      throw new Error("No token found. Please log in to continue.");
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/patient-consultations`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response) {
      // API error with response from server
      throw new Error(
        error.response.data.message ||
          "Failed to fetch consultations from the server."
      );
    } else if (error.request) {
      // Request was made but no response
      throw new Error(
        "No response from server. Please check your network connection."
      );
    } else {
      // General error
      throw new Error(
        error.message || "An unexpected error occurred. Please try again."
      );
    }
  }
};
